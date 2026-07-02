import couponModel from "../models/couponModel.js";

// ─── Validate coupon (frontend use) ──────────────────────────
const validateCoupon = async (req, res) => {
  try {
    const { code, cartAmount } = req.body;
    if (!code) return res.json({ success: false, message: "Code required" });

    const coupon = await couponModel.findOne({ code: code.toUpperCase() });
    if (!coupon)           return res.json({ success: false, message: "Invalid promo code" });
    if (!coupon.isActive)  return res.json({ success: false, message: "This code is inactive" });
    if (new Date() > coupon.expiresAt) return res.json({ success: false, message: "This code has expired" });
    if (coupon.usedCount >= coupon.maxUses) return res.json({ success: false, message: "This code has reached its usage limit" });
    if (cartAmount < coupon.minOrder)  return res.json({ success: false, message: `Minimum order of $${coupon.minOrder} required` });

    const discountAmount = coupon.discountType === "percent"
      ? parseFloat(((cartAmount * coupon.discount) / 100).toFixed(2))
      : parseFloat(Math.min(coupon.discount, cartAmount).toFixed(2));

    res.json({
      success: true,
      message: `🎉 ${coupon.discount}${coupon.discountType === "percent" ? "%" : "$"} off applied!`,
      discount: discountAmount,
      couponId: coupon._id,
      code: coupon.code,
      type: coupon.discountType,
      value: coupon.discount,
    });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error validating coupon" });
  }
};

// ─── Admin: list all coupons ──────────────────────────────────
const listCoupons = async (req, res) => {
  try {
    const coupons = await couponModel.find({}).sort({ createdAt: -1 });
    res.json({ success: true, data: coupons });
  } catch (error) {
    res.json({ success: false, message: "Error" });
  }
};

// ─── Admin: create coupon ─────────────────────────────────────
const createCoupon = async (req, res) => {
  try {
    const { code, discountType, discount, minOrder, maxUses, expiresAt, description } = req.body;
    if (!code || !discount || !expiresAt) return res.json({ success: false, message: "Code, discount, and expiry required" });

    const exists = await couponModel.findOne({ code: code.toUpperCase() });
    if (exists) return res.json({ success: false, message: "Code already exists" });

    const coupon = await couponModel.create({
      code: code.toUpperCase(), discountType, discount: Number(discount),
      minOrder: Number(minOrder) || 0, maxUses: Number(maxUses) || 100,
      expiresAt: new Date(expiresAt), description,
    });
    res.json({ success: true, message: "Coupon created", data: coupon });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error creating coupon" });
  }
};

// ─── Admin: toggle active ─────────────────────────────────────
const toggleCoupon = async (req, res) => {
  try {
    const coupon = await couponModel.findById(req.params.id);
    if (!coupon) return res.json({ success: false, message: "Not found" });
    coupon.isActive = !coupon.isActive;
    await coupon.save();
    res.json({ success: true, message: `Coupon ${coupon.isActive ? "activated" : "deactivated"}`, data: coupon });
  } catch (error) {
    res.json({ success: false, message: "Error" });
  }
};

// ─── Admin: delete coupon ─────────────────────────────────────
const deleteCoupon = async (req, res) => {
  try {
    await couponModel.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: "Coupon deleted" });
  } catch (error) {
    res.json({ success: false, message: "Error" });
  }
};

export { validateCoupon, listCoupons, createCoupon, toggleCoupon, deleteCoupon };
