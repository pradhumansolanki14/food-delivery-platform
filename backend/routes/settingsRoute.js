import express from "express";
import { getSettings, updateSettings } from "../controllers/settingsController.js";
import adminAuthMiddleware from "../middlewares/adminAuth.js";

const settingsRouter = express.Router();

settingsRouter.get("/",  getSettings);
settingsRouter.put("/",  adminAuthMiddleware, updateSettings);

export default settingsRouter;
