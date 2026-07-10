import express from "express";
import { logSearch, getTrendingSearches } from "../controllers/searchController.js";

const searchRouter = express.Router();

searchRouter.post("/log", logSearch);
searchRouter.get("/trending", getTrendingSearches);

export default searchRouter;
