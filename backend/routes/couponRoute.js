import express from "express";
import { validateCoupon, listCoupons, createCoupon, toggleCoupon, deleteCoupon, updateCoupon, getActiveCoupons, getPublicCoupons } from "../controllers/couponController.js";
import adminAuthMiddleware from "../middlewares/adminAuth.js";
import authMiddleware from "../middlewares/auth.js";

const couponRouter = express.Router();

couponRouter.get("/public",    getPublicCoupons);                        // public guest list
couponRouter.post("/validate", authMiddleware, validateCoupon);          // user
couponRouter.get("/active",    getActiveCoupons);         // public list (platform + restaurant specific)
couponRouter.get("/list",     adminAuthMiddleware, listCoupons);          // admin
couponRouter.post("/create",  adminAuthMiddleware, createCoupon);         // admin
couponRouter.patch("/:id/toggle", adminAuthMiddleware, toggleCoupon);    // admin
couponRouter.delete("/:id",   adminAuthMiddleware, deleteCoupon);         // admin
couponRouter.put("/:id",      adminAuthMiddleware, updateCoupon);         // admin

export default couponRouter;
