import vendorWalletModel from "../models/vendorWalletModel.js";
import financialLedgerModel from "../models/financialLedgerModel.js";
import adminModel from "../models/adminModel.js";

// GET /api/finance/wallet (Vendor only)
export const getWalletDetails = async (req, res) => {
  try {
    const vendorId = req.adminId;
    let wallet = await vendorWalletModel.findOne({ vendorId });
    if (!wallet) {
      // Return dummy zero wallet for initial state
      return res.json({
        success: true,
        data: {
          pendingBalance: 0,
          availableBalance: 0,
          totalEarnings: 0,
          totalSettled: 0,
          totalRefunded: 0,
          currency: "INR",
          lastSettlementAt: null
        }
      });
    }
    res.json({ success: true, data: wallet });
  } catch (error) {
    console.error("Error fetching wallet details:", error);
    res.status(500).json({ success: false, message: "Error fetching wallet details" });
  }
};

// GET /api/finance/wallet/transactions (Vendor only)
export const getWalletTransactions = async (req, res) => {
  try {
    const vendorId = req.adminId;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const [transactions, total] = await Promise.all([
      financialLedgerModel.find({ vendorId })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      financialLedgerModel.countDocuments({ vendorId })
    ]);

    res.json({
      success: true,
      data: transactions,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error("Error fetching wallet transactions:", error);
    res.status(500).json({ success: false, message: "Error fetching wallet transactions" });
  }
};

// GET /api/finance/overview (Superadmin only)
export const getFinanceOverview = async (req, res) => {
  try {
    const [wallets, commissions, gatewayFees] = await Promise.all([
      vendorWalletModel.find({}),
      financialLedgerModel.find({ transactionType: "COMMISSION" }),
      financialLedgerModel.find({ transactionType: "PAYMENT_GATEWAY_FEE" })
    ]);

    const platformRevenue = commissions.reduce((sum, entry) => sum + Math.abs(entry.amount), 0);
    const totalGatewayFees = gatewayFees.reduce((sum, entry) => sum + Math.abs(entry.amount), 0);
    const totalVendorEarnings = wallets.reduce((sum, w) => sum + w.totalEarnings, 0);
    const pendingVendorBalance = wallets.reduce((sum, w) => sum + w.pendingBalance, 0);
    const availableVendorBalance = wallets.reduce((sum, w) => sum + w.availableBalance, 0);
    const walletCount = wallets.length;

    res.json({
      success: true,
      data: {
        platformRevenue,
        totalVendorEarnings,
        pendingVendorBalance,
        availableVendorBalance,
        totalGatewayFees,
        walletCount
      }
    });
  } catch (error) {
    console.error("Error fetching finance overview:", error);
    res.status(500).json({ success: false, message: "Error fetching finance overview" });
  }
};

// GET /api/finance/vendors (Superadmin only)
export const getFinanceVendors = async (req, res) => {
  try {
    const wallets = await vendorWalletModel.find({})
      .populate({
        path: "vendorId",
        select: "name email restaurantId",
        populate: { path: "restaurantId", select: "name" }
      });

    res.json({ success: true, data: wallets });
  } catch (error) {
    console.error("Error fetching finance vendors:", error);
    res.status(500).json({ success: false, message: "Error fetching finance vendors" });
  }
};

// GET /api/finance/ledger (Superadmin only)
export const getGlobalLedger = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const filter = {};
    if (req.query.transactionType) {
      filter.transactionType = req.query.transactionType;
    }
    if (req.query.vendorId) {
      filter.vendorId = req.query.vendorId;
    }
    if (req.query.startDate || req.query.endDate) {
      filter.createdAt = {};
      if (req.query.startDate) {
        filter.createdAt.$gte = new Date(req.query.startDate);
      }
      if (req.query.endDate) {
        // Set to end of the day
        const end = new Date(req.query.endDate);
        end.setHours(23, 59, 59, 999);
        filter.createdAt.$lte = end;
      }
    }

    const [transactions, total] = await Promise.all([
      financialLedgerModel.find(filter)
        .populate({
          path: "vendorId",
          select: "name email restaurantId",
          populate: { path: "restaurantId", select: "name" }
        })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      financialLedgerModel.countDocuments(filter)
    ]);

    res.json({
      success: true,
      data: transactions,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error("Error fetching global ledger:", error);
    res.status(500).json({ success: false, message: "Error fetching global ledger" });
  }
};
