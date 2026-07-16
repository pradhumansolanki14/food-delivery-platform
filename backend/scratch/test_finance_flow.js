import mongoose from "mongoose";
import dotenv from "dotenv";
import orderModel from "../models/orderModel.js";
import vendorWalletModel from "../models/vendorWalletModel.js";
import financialLedgerModel from "../models/financialLedgerModel.js";
import settingsModel from "../models/settingsModel.js";
import restaurantModel from "../models/restaurantModel.js";
import { processOrderFinance, movePendingToAvailable } from "../services/financeService.js";

dotenv.config();

const runTest = async () => {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log("DB Connected successfully.");

  // 1. Set Settings configuration
  let settings = await settingsModel.findOne({});
  if (!settings) {
    settings = new settingsModel();
  }
  settings.commissionPercent = 10;
  settings.gatewayFeePercent = 2;
  await settings.save();
  console.log("Settings established: 10% commission, 2% gateway fee");

  // 2. Create mock order
  const order = new orderModel({
    userId: "6a57e50d49f499b8e58e561c",
    restaurantId: "6a491167c2b82a9b3b0d8c55", // Navin's Restaurant (owned by 6a491167c2b82a9b3b0d8c53)
    items: [{ id: "food1", name: "Samosa", quantity: 2, price: 50 }],
    amount: 100,
    address: { firstName: "Test", lastName: "User" },
    payment: false,
    status: "Food Processing"
  });
  await order.save();
  console.log("Mock order created with ID:", order._id);

  // Clear any existing wallet for the vendor to start fresh
  const vendorId = "6a491167c2b82a9b3b0d8c53";
  await vendorWalletModel.deleteOne({ vendorId });
  await financialLedgerModel.deleteMany({ vendorId });
  console.log("Cleared old wallet/ledgers for vendor:", vendorId);

  // 3. Process order finance inside session transaction
  const session1 = await mongoose.startSession();
  session1.startTransaction();
  try {
    await processOrderFinance(order._id, session1);
    await session1.commitTransaction();
    console.log("Finance processing transaction committed.");
  } catch (err) {
    await session1.abortTransaction();
    console.error("Finance processing failed:", err);
  } finally {
    session1.endSession();
  }

  // 4. Verify DB updates
  const updatedOrder = await orderModel.findById(order._id);
  console.log("Order walletProcessed:", updatedOrder.walletProcessed);
  console.log("Order commissionAmount:", updatedOrder.commissionAmount); // Expected: 10
  console.log("Order gatewayFee:", updatedOrder.gatewayFee);             // Expected: 2
  console.log("Order vendorNetAmount:", updatedOrder.vendorNetAmount);   // Expected: 88

  const wallet = await vendorWalletModel.findOne({ vendorId });
  console.log("Wallet pendingBalance:", wallet.pendingBalance);         // Expected: 88
  console.log("Wallet availableBalance:", wallet.availableBalance);     // Expected: 0
  console.log("Wallet totalEarnings:", wallet.totalEarnings);           // Expected: 88

  const ledgersCount = await financialLedgerModel.countDocuments({ vendorId });
  console.log("Ledger entries count (expected 3):", ledgersCount);

  // 5. Test processOrderFinance Idempotency (Should skip duplicate wallet credit)
  const session2 = await mongoose.startSession();
  session2.startTransaction();
  try {
    await processOrderFinance(order._id, session2);
    await session2.commitTransaction();
    console.log("Finance re-processing (idempotency test) completed.");
  } catch (err) {
    await session2.abortTransaction();
    console.error(err);
  } finally {
    session2.endSession();
  }

  const walletAfterDup = await vendorWalletModel.findOne({ vendorId });
  console.log("Wallet pendingBalance after duplicate call:", walletAfterDup.pendingBalance); // Expected: 88 (still 88!)

  // 6. Test movePendingToAvailable on Completed Status
  const session3 = await mongoose.startSession();
  session3.startTransaction();
  try {
    // Simulate order transition status delivered
    updatedOrder.status = "Delivered";
    await updatedOrder.save({ session: session3 });

    await movePendingToAvailable(order._id, session3);
    await session3.commitTransaction();
    console.log("Pending release transaction committed.");
  } catch (err) {
    await session3.abortTransaction();
    console.error(err);
  } finally {
    session3.endSession();
  }

  const walletAfterRelease = await vendorWalletModel.findOne({ vendorId });
  console.log("Wallet pendingBalance after release:", walletAfterRelease.pendingBalance);     // Expected: 0
  console.log("Wallet availableBalance after release:", walletAfterRelease.availableBalance); // Expected: 88

  const totalLedgersAfterRelease = await financialLedgerModel.countDocuments({ vendorId });
  console.log("Ledger entries count after release (expected 4):", totalLedgersAfterRelease);

  const releaseLedger = await financialLedgerModel.findOne({ vendorId, transactionType: "ORDER_CREDIT_AVAILABLE" });
  console.log("Release Ledger balanceBefore:", releaseLedger.balanceBefore); // Expected: 0
  console.log("Release Ledger balanceAfter:", releaseLedger.balanceAfter);   // Expected: 88

  // 7. Clean up
  await orderModel.findByIdAndDelete(order._id);
  await vendorWalletModel.deleteOne({ vendorId });
  await financialLedgerModel.deleteMany({ vendorId });
  console.log("Cleared mock entities. Test completed successfully.");
  process.exit(0);
};

runTest().catch(err => {
  console.error(err);
  process.exit(1);
});
