import mongoose from "mongoose";

const couponSchema = new mongoose.Schema({
  code:           { type: String, required: true, unique: true, uppercase: true },
  discountType:   { type: String, enum: ["percent", "fixed"], default: "percent" },
  discount:       { type: Number, required: true },
  minOrder:       { type: Number, default: 0 },
  maxUses:        { type: Number, default: 100 },
  usedCount:      { type: Number, default: 0 },
  expiresAt:      { type: Date, required: true },
  isActive:       { type: Boolean, default: true },
  description:    { type: String, default: "" },
  restaurantId:   { type: mongoose.Schema.Types.ObjectId, ref: "restaurant", default: null },
  // null = platform-wide coupon (superadmin only)
}, { timestamps: true });

const couponModel = mongoose.models.coupon || mongoose.model("coupon", couponSchema);
export default couponModel;
