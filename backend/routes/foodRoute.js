import express from "express";
import { addFood, listFood, listMyFood, removeFood, getFood, searchFood, updateFood, listRestaurants, getRestaurant } from "../controllers/foodController.js";
import adminAuthMiddleware from "../middlewares/adminAuth.js";
import multer from "multer";

const foodRouter = express.Router();

const storage = multer.diskStorage({
  destination: "uploads",
  filename: (req, file, cb) => cb(null, `${Date.now()}${file.originalname}`)
});
const upload = multer({ storage });

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
