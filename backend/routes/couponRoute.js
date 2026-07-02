import express from "express";
import { validateCoupon, listCoupons, createCoupon, toggleCoupon, deleteCoupon } from "../controllers/couponController.js";
import adminAuthMiddleware from "../middlewares/adminAuth.js";
import authMiddleware from "../middlewares/auth.js";

const couponRouter = express.Router();

couponRouter.post("/validate", authMiddleware, validateCoupon);          // user
couponRouter.get("/list",     adminAuthMiddleware, listCoupons);          // admin
couponRouter.post("/create",  adminAuthMiddleware, createCoupon);         // admin
couponRouter.patch("/:id/toggle", adminAuthMiddleware, toggleCoupon);    // admin
couponRouter.delete("/:id",   adminAuthMiddleware, deleteCoupon);         // admin

export default couponRouter;
