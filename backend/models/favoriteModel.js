import mongoose from "mongoose";

const favoriteSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  foodId: { type: String, required: true },
}, { timestamps: true });

// Unique compound index so user can't duplicate-favorite
favoriteSchema.index({ userId: 1, foodId: 1 }, { unique: true });

const favoriteModel = mongoose.models.favorite || mongoose.model("favorite", favoriteSchema);
export default favoriteModel;
