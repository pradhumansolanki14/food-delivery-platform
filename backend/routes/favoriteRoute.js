import express from "express";
import { getFavorites, getFavoriteIds, toggleFavorite } from "../controllers/favoriteController.js";
import authMiddleware from "../middlewares/auth.js";

const favoriteRouter = express.Router();

favoriteRouter.get("/", authMiddleware, getFavorites);
favoriteRouter.get("/ids", authMiddleware, getFavoriteIds);
favoriteRouter.post("/toggle", authMiddleware, toggleFavorite);

export default favoriteRouter;
