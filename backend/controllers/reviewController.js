import reviewModel from "../models/reviewModel.js";
import userModel from "../models/userModel.js";

// ─── Get reviews for a food item ─────────────────────────────
const getReviews = async (req, res) => {
  try {
    const reviews = await reviewModel.find({ foodId: req.params.foodId }).sort({ createdAt: -1 });
    const avg = reviews.length
      ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
      : 0;
    res.json({ success: true, data: reviews, average: parseFloat(avg), count: reviews.length });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error" });
  }
};

// ─── Add or update review ────────────────────────────────────
const addReview = async (req, res) => {
  try {
    const { foodId, rating, comment } = req.body;
    if (!foodId || !rating || !comment) return res.json({ success: false, message: "All fields required" });
    if (rating < 1 || rating > 5) return res.json({ success: false, message: "Rating must be 1–5" });

    const user = await userModel.findById(req.userId);
    if (!user) return res.json({ success: false, message: "User not found" });

    const existing = await reviewModel.findOne({ foodId, userId: req.userId });
    if (existing) {
      // Update existing review
      existing.rating = rating;
      existing.comment = comment;
      existing.name = user.name;
      await existing.save();
      return res.json({ success: true, message: "Review updated", data: existing });
    }

    const review = await reviewModel.create({
      foodId, userId: req.userId, name: user.name, rating, comment
    });
    res.json({ success: true, message: "Review added", data: review });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error adding review" });
  }
};

// ─── Delete review (own) ─────────────────────────────────────
const deleteReview = async (req, res) => {
  try {
    const review = await reviewModel.findById(req.params.id);
    if (!review) return res.json({ success: false, message: "Review not found" });
    if (review.userId !== req.userId) return res.json({ success: false, message: "Unauthorized" });
    await review.deleteOne();
    res.json({ success: true, message: "Review deleted" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error" });
  }
};

// ─── Admin: delete any review ────────────────────────────────
const adminDeleteReview = async (req, res) => {
  try {
    await reviewModel.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: "Review deleted" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error" });
  }
};

export { getReviews, addReview, deleteReview, adminDeleteReview };
