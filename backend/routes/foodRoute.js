import express from "express";
import { addFood, listFood, listMyFood, removeFood, getFood, searchFood, updateFood, listRestaurants, getRestaurant } from "../controllers/foodController.js";
import adminAuthMiddleware from "../middlewares/adminAuth.js";
import upload from "../middlewares/uploadMiddleware.js";

const foodRouter = express.Router();

// ─── Public ───────────────────────────────────────────────────
foodRouter.get("/list",                 listFood);          // ?restaurantId= optional
foodRouter.get("/search",               searchFood);
foodRouter.get("/restaurants",          listRestaurants);
foodRouter.get("/restaurants/:id",      getRestaurant);
foodRouter.get("/:id",                  getFood);

// ─── Vendor protected ────────────────────────────────────────
foodRouter.get("/my/items",             adminAuthMiddleware, listMyFood);
foodRouter.post("/add",                 adminAuthMiddleware, upload.single("image"), addFood);
foodRouter.put("/:id",                  adminAuthMiddleware, upload.single("image"), updateFood);
foodRouter.post("/remove",              adminAuthMiddleware, removeFood);

export default foodRouter;
