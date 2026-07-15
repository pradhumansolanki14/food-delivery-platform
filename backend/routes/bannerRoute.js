import express from "express";
import { createBanner, updateBanner, deleteBanner, listBanners } from "../controllers/bannerController.js";
import adminAuthMiddleware, { superAdminOnly } from "../middlewares/adminAuth.js";
import upload from "../middlewares/uploadMiddleware.js";

const bannerRouter = express.Router();

// ─── Public ───────────────────────────────────────────────────
bannerRouter.get("/",                          listBanners);

// ─── Super Admin only ────────────────────────────────────────
bannerRouter.post("/",      adminAuthMiddleware, superAdminOnly, upload.single("image"), createBanner);
bannerRouter.put("/:id",    adminAuthMiddleware, superAdminOnly, upload.single("image"), updateBanner);
bannerRouter.delete("/:id", adminAuthMiddleware, superAdminOnly, deleteBanner);

export default bannerRouter;
