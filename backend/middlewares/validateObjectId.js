import mongoose from "mongoose";

export const autoValidateObjectIds = (req, res, next) => {
  // Validate all route params (e.g. /:id, /:restaurantId)
  if (req.params) {
    for (const key in req.params) {
      const value = req.params[key];
      if (value && (key.toLowerCase().endsWith("id") || key === "id")) {
        if (!mongoose.Types.ObjectId.isValid(value)) {
          return res.status(400).json({
            success: false,
            message: `Invalid parameter format: ${key}`
          });
        }
      }
    }
  }

  // Validate request body keys ending in Id / id / _id
  if (req.body) {
    for (const key in req.body) {
      const value = req.body[key];
      if (value && (key.endsWith("Id") || key === "id" || key === "_id")) {
        if (typeof value === "string" && !mongoose.Types.ObjectId.isValid(value)) {
          return res.status(400).json({
            success: false,
            message: `Invalid field format: ${key}`
          });
        }
      }
    }
  }

  // Validate query parameters ending in Id / id
  if (req.query) {
    for (const key in req.query) {
      const value = req.query[key];
      if (value && (key.endsWith("Id") || key === "id")) {
        if (typeof value === "string" && !mongoose.Types.ObjectId.isValid(value)) {
          return res.status(400).json({
            success: false,
            message: `Invalid query field format: ${key}`
          });
        }
      }
    }
  }

  next();
};
