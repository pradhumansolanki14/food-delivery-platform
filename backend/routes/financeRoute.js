import express from "express";
import adminAuthMiddleware, { superAdminOnly } from "../middlewares/adminAuth.js";
import vendorOnly from "../middlewares/vendorOnly.js";
import {
  getWalletDetails,
  getWalletTransactions,
  getFinanceOverview,
  getFinanceVendors,
  getGlobalLedger
} from "../controllers/financeController.js";

const financeRouter = express.Router();

// ─── Vendor only Routes ───────────────────────────────────────────
financeRouter.get("/wallet",              adminAuthMiddleware, vendorOnly, getWalletDetails);
financeRouter.get("/wallet/transactions", adminAuthMiddleware, vendorOnly, getWalletTransactions);

// ─── Superadmin only Routes ───────────────────────────────────────
financeRouter.get("/overview",            adminAuthMiddleware, superAdminOnly, getFinanceOverview);
financeRouter.get("/vendors",             adminAuthMiddleware, superAdminOnly, getFinanceVendors);
financeRouter.get("/ledger",              adminAuthMiddleware, superAdminOnly, getGlobalLedger);

export default financeRouter;
