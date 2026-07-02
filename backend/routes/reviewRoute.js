import express from "express";
import { getReviews, addReview, deleteReview, adminDeleteReview } from "../controllers/reviewController.js";
import authMiddleware from "../middlewares/auth.js";
import adminAuthMiddleware from "../middlewares/adminAuth.js";

const reviewRouter = express.Router();

reviewRouter.get("/:foodId",        getReviews);                            // public
reviewRouter.post("/",              authMiddleware, addReview);             // auth
reviewRouter.delete("/:id",         authMiddleware, deleteReview);          // own review
reviewRouter.delete("/admin/:id",   adminAuthMiddleware, adminDeleteReview);// admin

export default reviewRouter;
