import settingsModel from "../models/settingsModel.js";
import orderModel from "../models/orderModel.js";
import restaurantModel from "../models/restaurantModel.js";
import vendorWalletModel from "../models/vendorWalletModel.js";
import financialLedgerModel from "../models/financialLedgerModel.js";

// Helper calculations
export const calculateCommission = (amount, commissionPercent) => {
  return amount * (commissionPercent / 100);
};

export const calculateGatewayFee = (amount, gatewayFeePercent) => {
  return amount * (gatewayFeePercent / 100);
};

export const calculateVendorNet = (amount, commissionAmount, gatewayFee) => {
  return amount - commissionAmount - gatewayFee;
};

// Create a single immutable ledger entry
export const createLedgerEntry = async (data, session) => {
  const ledger = new financialLedgerModel(data);
  return await ledger.save({ session });
};

// Credits vendor wallet pending balance on payment capture/verification
export const processOrderFinance = async (orderId, session) => {
  // Find order
  const order = await orderModel.findById(orderId).session(session);
  if (!order) {
    throw new Error(`Order ${orderId} not found in finance processing`);
  }

  // Idempotency guard check
  if (order.walletProcessed) {
    console.log(`Order ${orderId} already processed for wallet ledger. Skipping.`);
    return order;
  }

  // Fetch settings or defaults
  const settings = await settingsModel.findOne({}).session(session);
  const commissionPercent = settings?.commissionPercent !== undefined 
    ? settings.commissionPercent 
    : (settings?.platformFeePercent !== undefined ? settings.platformFeePercent : 10);
  const gatewayFeePercent = settings?.gatewayFeePercent !== undefined ? settings.gatewayFeePercent : 2;
  const currency = settings?.currency || "INR";

  // Calculate finance shares based on foodSubtotal for commission, and grand total for gateway fee
  const foodSubtotal = (order.items || []).reduce((sum, item) => sum + (item.price * (item.quantity || 1)), 0);
  const commissionAmount = calculateCommission(foodSubtotal, commissionPercent);
  const gatewayFee = calculateGatewayFee(order.amount, gatewayFeePercent);
  const vendorNetAmount = calculateVendorNet(order.amount, commissionAmount, gatewayFee);

  // Retrieve restaurant vendor owner
  const restaurant = await restaurantModel.findById(order.restaurantId).session(session);
  if (!restaurant) {
    throw new Error(`Restaurant ${order.restaurantId} not found for order ${orderId}`);
  }
  const vendorId = restaurant.ownerId;
  if (!vendorId) {
    throw new Error(`Owner Id not found for restaurant ${order.restaurantId}`);
  }

  // Fetch or automatically initialize wallet
  let wallet = await vendorWalletModel.findOne({ vendorId }).session(session);
  if (!wallet) {
    wallet = new vendorWalletModel({
      vendorId,
      currency,
      pendingBalance: 0,
      availableBalance: 0,
      totalEarnings: 0,
      totalSettled: 0,
      totalRefunded: 0
    });
  }

  // Record ledger updates atomically
  let runningPending = wallet.pendingBalance;

  // 1. ORDER_CREDIT (Gross Amount Credit)
  const afterCredit = runningPending + order.amount;
  await createLedgerEntry({
    walletId: wallet._id,
    vendorId,
    orderId: order._id,
    transactionType: "ORDER_CREDIT",
    amount: order.amount,
    balanceBefore: runningPending,
    balanceAfter: afterCredit,
    currency,
    reference: order._id.toString(),
    description: `Gross order credit for order #${order._id.toString().slice(-6)}`,
    createdBy: "system"
  }, session);
  runningPending = afterCredit;

  // 2. COMMISSION (Platform Commission Debit)
  const afterCommission = runningPending - commissionAmount;
  await createLedgerEntry({
    walletId: wallet._id,
    vendorId,
    orderId: order._id,
    transactionType: "COMMISSION",
    amount: -commissionAmount,
    balanceBefore: runningPending,
    balanceAfter: afterCommission,
    currency,
    reference: order._id.toString(),
    description: `Platform commission fee (${commissionPercent}%) on food subtotal of ₹${foodSubtotal} for order #${order._id.toString().slice(-6)}`,
    createdBy: "system"
  }, session);
  runningPending = afterCommission;

  // 3. PAYMENT_GATEWAY_FEE (Gateway Processing Debit)
  const afterGateway = runningPending - gatewayFee;
  await createLedgerEntry({
    walletId: wallet._id,
    vendorId,
    orderId: order._id,
    transactionType: "PAYMENT_GATEWAY_FEE",
    amount: -gatewayFee,
    balanceBefore: runningPending,
    balanceAfter: afterGateway,
    currency,
    reference: order._id.toString(),
    description: `Payment gateway processing fee (${gatewayFeePercent}%) for order #${order._id.toString().slice(-6)}`,
    createdBy: "system"
  }, session);
  runningPending = afterGateway;

  // Commit wallet state changes
  wallet.pendingBalance = runningPending;
  wallet.totalEarnings += vendorNetAmount;
  await wallet.save({ session });

  // Update order document details
  order.commissionAmount = commissionAmount;
  order.gatewayFee = gatewayFee;
  order.vendorNetAmount = vendorNetAmount;
  order.walletProcessed = true;
  order.walletProcessedAt = new Date();
  await order.save({ session });

  return order;
};

// Release pending funds into available balance upon order completion
export const movePendingToAvailable = async (orderId, session) => {
  const order = await orderModel.findById(orderId).session(session);
  if (!order) {
    throw new Error(`Order ${orderId} not found in pending release`);
  }

  // Pre-requisite validation
  if (!order.walletProcessed) {
    // If payment capture event was delayed or webhook failed to process, credit pending first!
    await processOrderFinance(orderId, session);
  }

  // Idempotency check: Ensure funds have not been released already
  const alreadyReleased = await financialLedgerModel.findOne({
    orderId: order._id,
    transactionType: "ORDER_CREDIT_AVAILABLE"
  }).session(session);

  if (alreadyReleased) {
    console.log(`Order ${orderId} already released to available balance. Skipping.`);
    return;
  }

  const restaurant = await restaurantModel.findById(order.restaurantId).session(session);
  if (!restaurant) {
    throw new Error(`Restaurant ${order.restaurantId} not found`);
  }
  const vendorId = restaurant.ownerId;

  const wallet = await vendorWalletModel.findOne({ vendorId }).session(session);
  if (!wallet) {
    throw new Error(`Wallet not found for vendor ${vendorId}`);
  }

  const initialPending = wallet.pendingBalance;
  const initialAvailable = wallet.availableBalance;
  const netAmount = order.vendorNetAmount;

  // Adjust wallet balances safely
  wallet.pendingBalance = Math.max(0, initialPending - netAmount);
  wallet.availableBalance = initialAvailable + netAmount;
  await wallet.save({ session });

  // Record ledger movement log entry
  await createLedgerEntry({
    walletId: wallet._id,
    vendorId,
    orderId: order._id,
    transactionType: "ORDER_CREDIT_AVAILABLE",
    amount: netAmount,
    balanceBefore: initialAvailable,
    balanceAfter: wallet.availableBalance,
    currency: wallet.currency,
    reference: order._id.toString(),
    description: `Funds released to available balance for delivered order #${order._id.toString().slice(-6)}`,
    createdBy: "system"
  }, session);
};
