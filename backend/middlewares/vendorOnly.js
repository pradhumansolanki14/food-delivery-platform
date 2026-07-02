// Allows only Restaurant_Manager (vendor) role to proceed.
// Must be used after adminAuthMiddleware which sets req.adminRole.
const vendorOnly = (req, res, next) => {
  if (req.adminRole !== "vendor") {
    return res.status(403).json({ success: false, message: "Restaurant manager access required" });
  }
  next();
};

export default vendorOnly;
