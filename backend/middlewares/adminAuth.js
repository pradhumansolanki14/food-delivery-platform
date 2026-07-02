import jwt from "jsonwebtoken";
import adminModel from "../models/adminModel.js";

// Creates a signed admin JWT with a 7-day expiry
const createToken = (id) => {
  return jwt.sign({ id, isAdmin: true }, process.env.JWT_SECRET, { expiresIn: "7d" });
};

// Attaches: req.adminId, req.adminRole, req.restaurantId
const adminAuthMiddleware = async (req, res, next) => {
  const { token } = req.headers;
  if (!token) return res.status(401).json({ success: false, message: "Not authorized" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded.isAdmin) return res.status(403).json({ success: false, message: "Admin access required" });

    // Fetch fresh role/restaurantId from DB (so token doesn't go stale)
    const admin = await adminModel.findById(decoded.id).select("role restaurantId isApproved");
    if (!admin) return res.status(401).json({ success: false, message: "Admin account not found" });
    if (!admin.isApproved) return res.status(403).json({ success: false, message: "Account pending approval" });

    req.adminId = decoded.id;
    req.adminRole = admin.role;                          // "superadmin" | "vendor"
    req.restaurantId = admin.restaurantId?.toString();   // null for superadmin

    next();
  } catch (error) {
    res.status(401).json({ success: false, message: "Invalid or expired token" });
  }
};

// Only superadmin passes
const superAdminOnly = (req, res, next) => {
  if (req.adminRole !== "superadmin") {
    return res.status(403).json({ success: false, message: "Super admin access required" });
  }
  next();
};

export { adminAuthMiddleware as default, superAdminOnly, createToken };
