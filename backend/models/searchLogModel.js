import mongoose from "mongoose";

const searchLogSchema = new mongoose.Schema({
  query: { type: String, required: true, trim: true, lowercase: true }
}, { timestamps: true });

// Index on createdAt and query for efficient aggregation performance
searchLogSchema.index({ createdAt: -1, query: 1 });

const searchLogModel = mongoose.models.searchLog || mongoose.model("searchLog", searchLogSchema);
export default searchLogModel;
