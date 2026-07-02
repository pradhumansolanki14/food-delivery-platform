import favoriteModel from "../models/favoriteModel.js";
import foodModel from "../models/foodModel.js";

// ─── Get user's favorites (with food details) ────────────────
const getFavorites = async (req, res) => {
  try {
    const favs = await favoriteModel.find({ userId: req.userId });
    const foodIds = favs.map(f => f.foodId);
    const foods = await foodModel.find({ _id: { $in: foodIds } });
    res.json({ success: true, data: foods });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error" });
  }
};

// ─── Get favorite IDs only (for quick lookup) ─────────────────
const getFavoriteIds = async (req, res) => {
  try {
    const favs = await favoriteModel.find({ userId: req.userId });
    res.json({ success: true, data: favs.map(f => f.foodId) });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error" });
  }
};

// ─── Toggle favorite ─────────────────────────────────────────
const toggleFavorite = async (req, res) => {
  const { foodId } = req.body;
  try {
    const existing = await favoriteModel.findOne({ userId: req.userId, foodId });
    if (existing) {
      await favoriteModel.deleteOne({ userId: req.userId, foodId });
      return res.json({ success: true, isFavorite: false, message: "Removed from favorites" });
    }
    await favoriteModel.create({ userId: req.userId, foodId });
    res.json({ success: true, isFavorite: true, message: "Added to favorites" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error" });
  }
};

export { getFavorites, getFavoriteIds, toggleFavorite };
