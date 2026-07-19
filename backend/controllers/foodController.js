import foodModel from "../models/foodModel.js";
import restaurantModel from "../models/restaurantModel.js";
import foodReviewModel from "../models/foodReviewModel.js";
import cuisineModel from "../models/cuisineModel.js";
import { uploadToCloudinary, deleteFromCloudinary } from "../services/cloudinaryService.js";

// ─── Add food (vendor adds to their restaurant) ──────────────
const addFood = async (req, res) => {
  try {
    // restaurantId comes from the authenticated vendor's token via adminAuth middleware
    const restaurantId = req.restaurantId;
    if (!restaurantId) return res.json({ success: false, message: "No restaurant linked to this account" });

    if (!req.file) return res.json({ success: false, message: "Image required" });

    let tagsArray = [];
    if (req.body.tags) {
      try {
        tagsArray = JSON.parse(req.body.tags);
      } catch (e) {
        if (typeof req.body.tags === 'string') {
          tagsArray = req.body.tags.split(',').map(t => t.trim()).filter(Boolean);
        } else if (Array.isArray(req.body.tags)) {
          tagsArray = req.body.tags;
        }
      }
    }

    const imageUrl = await uploadToCloudinary(req.file.buffer, "cravearc/foods");

    const food = new foodModel({
      name: req.body.name,
      description: req.body.description,
      price: Number(req.body.price),
      category: req.body.category,
      image: imageUrl,
      restaurantId,
      preparationTime: req.body.preparationTime ? Number(req.body.preparationTime) : undefined,
      isVeg: req.body.isVeg === "true" || req.body.isVeg === true,
      calories: req.body.calories ? Number(req.body.calories) : undefined,
      tags: tagsArray,
    });
    await food.save();
    res.json({ success: true, message: "Food Added" });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: "Error" });
  }
};

// Helper to attach ratings stats to food items dynamically using Aggregation
const attachRatingStats = async (foods) => {
  if (!foods || foods.length === 0) return [];
  const foodIds = foods.map(f => f._id.toString());
  try {
    const stats = await foodReviewModel.aggregate([
      { $match: { foodId: { $in: foodIds } } },
      { $group: { _id: "$foodId", avgRating: { $avg: "$rating" }, count: { $sum: 1 } } }
    ]);
    const statsMap = {};
    stats.forEach(s => {
      statsMap[s._id] = {
        avgRating: Math.round(s.avgRating * 10) / 10,
        reviewCount: s.count
      };
    });
    return foods.map(f => {
      const s = statsMap[f._id.toString()] || { avgRating: 0, reviewCount: 0 };
      return {
        ...f.toObject(),
        averageRating: s.avgRating,
        reviewCount: s.reviewCount
      };
    });
  } catch (err) {
    console.error("Error attaching rating stats:", err);
    return foods.map(f => ({ ...f.toObject(), averageRating: 0, reviewCount: 0 }));
  }
};

// ─── List food (public — with optional restaurant filter) ────
const listFood = async (req, res) => {
  try {
    const filter = {};
    if (req.query.restaurantId) filter.restaurantId = req.query.restaurantId;
    if (req.query.isVeg === "true" || req.query.vegOnly === "true") filter.isVeg = true;
    if (req.query.category && req.query.category !== "All") filter.category = req.query.category;
    
    if (req.query.search) {
      const q = req.query.search;
      filter.$or = [
        { name: { $regex: q, $options: "i" } },
        { description: { $regex: q, $options: "i" } }
      ];
    }
    
    if (req.query.priceRange) {
      if (req.query.priceRange === "under-150") filter.price = { $lt: 150 };
      else if (req.query.priceRange === "150-500") filter.price = { $gte: 150, $lte: 500 };
      else if (req.query.priceRange === "over-500") filter.price = { $gt: 500 };
    }
    
    if (req.query.inStockOnly === "true" || req.query.isAvailable === "true") {
      filter.isAvailable = true;
    }
    
    if (req.query.maxPrepTime && req.query.maxPrepTime !== "999") {
      filter.preparationTime = { $lte: Number(req.query.maxPrepTime) };
    }

    const foods = await foodModel.find(filter).populate("restaurantId", "name logo isOpen isApproved deliveryFee");
    const filtered = req.query.restaurantId
      ? foods
      : foods.filter(f => f.restaurantId?.isApproved);
    
    const foodsWithStats = await attachRatingStats(filtered);
    let finalItems = foodsWithStats;
    
    if (req.query.minRating && req.query.minRating !== "0") {
      const minRat = parseFloat(req.query.minRating);
      finalItems = finalItems.filter(f => f.averageRating >= minRat);
    }
    
    if (req.query.sortBy === "price-asc") {
      finalItems.sort((a, b) => a.price - b.price);
    } else if (req.query.sortBy === "price-desc") {
      finalItems.sort((a, b) => b.price - a.price);
    } else if (req.query.sortBy === "name") {
      finalItems.sort((a, b) => a.name.localeCompare(b.name));
    }
    
    if (req.query.page) {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 8;
      const skip = (page - 1) * limit;
      const paginated = finalItems.slice(skip, skip + limit);
      
      res.json({
        success: true,
        data: paginated,
        pagination: {
          page,
          limit,
          total: finalItems.length,
          pages: Math.ceil(finalItems.length / limit)
        }
      });
    } else {
      res.json({ success: true, data: finalItems });
    }
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: "Error" });
  }
};

// ─── Vendor list (only their own items) ─────────────────────
const listMyFood = async (req, res) => {
  try {
    const restaurantId = req.restaurantId;
    if (!restaurantId) return res.json({ success: false, message: "No restaurant linked" });
    const foods = await foodModel.find({ restaurantId });
    res.json({ success: true, data: foods });
  } catch (error) {
    res.json({ success: false, message: "Error" });
  }
};

// ─── Get single food ─────────────────────────────────────────
const getFood = async (req, res) => {
  try {
    const food = await foodModel.findById(req.params.id).populate("restaurantId", "name logo address phone openingHours isOpen");
    if (!food) return res.json({ success: false, message: "Food not found" });

    // Fetch reviews including vendorReply and vendorRepliedAt
    const reviews = await foodReviewModel.find({ foodId: req.params.id }).sort({ createdAt: -1 });

    res.json({ success: true, data: { ...food.toObject(), reviews } });
  } catch (error) {
    res.json({ success: false, message: "Error" });
  }
};

// ─── Update food (vendor can only update their own) ──────────
const updateFood = async (req, res) => {
  try {
    const food = await foodModel.findById(req.params.id);
    if (!food) return res.status(404).json({ success: false, message: "Food not found" });

    // Vendor authorization check
    if (req.adminRole === "vendor") {
      if (!req.restaurantId || food.restaurantId.toString() !== req.restaurantId) {
        return res.status(403).json({ success: false, message: "Not authorized to edit this item" });
      }
    }

    let tagsArray = undefined;
    if (req.body.tags) {
      try {
        tagsArray = JSON.parse(req.body.tags);
      } catch (e) {
        if (typeof req.body.tags === 'string') {
          tagsArray = req.body.tags.split(',').map(t => t.trim()).filter(Boolean);
        } else if (Array.isArray(req.body.tags)) {
          tagsArray = req.body.tags;
        }
      }
    }

    let imageUrl = undefined;
    if (req.file) {
      if (food.image) {
        await deleteFromCloudinary(food.image);
      }
      imageUrl = await uploadToCloudinary(req.file.buffer, "cravearc/foods");
    }

    const updates = {
      name: req.body.name || food.name,
      description: req.body.description || food.description,
      price: req.body.price ? Number(req.body.price) : food.price,
      category: req.body.category || food.category,
      isAvailable: req.body.isAvailable !== undefined ? (req.body.isAvailable === "true" || req.body.isAvailable === true) : food.isAvailable,
      preparationTime: req.body.preparationTime !== undefined ? Number(req.body.preparationTime) : food.preparationTime,
      isVeg: req.body.isVeg !== undefined ? (req.body.isVeg === "true" || req.body.isVeg === true) : food.isVeg,
      calories: req.body.calories !== undefined ? Number(req.body.calories) : food.calories,
      tags: tagsArray !== undefined ? tagsArray : food.tags,
    };

    if (req.file) {
      updates.image = imageUrl;
    }

    const updated = await foodModel.findByIdAndUpdate(req.params.id, updates, { new: true });
    res.json({ success: true, message: "Food updated", data: updated });
  } catch (error) {
    res.json({ success: false, message: "Error updating food" });
  }
};

// ─── Search food ─────────────────────────────────────────────
const searchFood = async (req, res) => {
  try {
    const { q, category, restaurantId } = req.query;
    const filter = {};
    if (q) filter.$or = [
      { name: { $regex: q, $options: "i" } },
      { description: { $regex: q, $options: "i" } },
      { category: { $regex: q, $options: "i" } },
    ];
    if (category && category !== "All") filter.category = category;
    if (restaurantId) filter.restaurantId = restaurantId;

    const foods = await foodModel.find(filter).populate("restaurantId", "name logo isApproved").limit(30);
    const result = restaurantId ? foods : foods.filter(f => f.restaurantId?.isApproved);
    const foodsWithStats = await attachRatingStats(result);
    res.json({ success: true, data: foodsWithStats });
  } catch (error) {
    res.json({ success: false, message: "Error" });
  }
};

// ─── Remove food (vendor can only remove their own) ──────────
const removeFood = async (req, res) => {
  try {
    const food = await foodModel.findById(req.body.id);
    if (!food) return res.status(404).json({ success: false, message: "Food not found" });

    if (req.adminRole === "vendor") {
      if (!req.restaurantId || food.restaurantId.toString() !== req.restaurantId) {
        return res.status(403).json({ success: false, message: "Not authorized" });
      }
    }

    if (food.image) {
      await deleteFromCloudinary(food.image);
    }
    await foodModel.findByIdAndDelete(req.body.id);
    res.json({ success: true, message: "Food Removed" });
  } catch (error) {
    res.json({ success: false, message: "Error" });
  }
};

// ─── List all restaurants (public) ───────────────────────────
const listRestaurants = async (req, res) => {
  try {
    const filter = { isApproved: true };
    
    // Filter by cuisineId (restaurant has this cuisine in cuisineIds array or matches by name)
    if (req.query.cuisineId) {
      const cuisineDoc = await cuisineModel.findById(req.query.cuisineId);
      if (cuisineDoc) {
        filter.$or = [
          { cuisineIds: req.query.cuisineId },
          { cuisine: { $regex: new RegExp(cuisineDoc.name, 'i') } }
        ];
      } else {
        filter.cuisineIds = req.query.cuisineId;
      }
    }
    
    // Filter by featured flag
    if (req.query.featured === "true") {
      filter.featured = true;
    }
    
    // Filter by search query
    if (req.query.search) {
      const q = req.query.search;
      filter.name = { $regex: q, $options: "i" };
    }
    
    if (req.query.page) {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 8;
      const skip = (page - 1) * limit;
      
      const [restaurants, total] = await Promise.all([
        restaurantModel.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit),
        restaurantModel.countDocuments(filter)
      ]);
      
      res.json({
        success: true,
        data: restaurants,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit)
        }
      });
    } else {
      const restaurants = await restaurantModel.find(filter).sort({ createdAt: -1 });
      res.json({ success: true, data: restaurants });
    }
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: "Error" });
  }
};

const getRestaurant = async (req, res) => {
  try {
    const isObjectId = req.params.id.match(/^[0-9a-fA-F]{24}$/);
    let restaurant;
    if (isObjectId) {
      restaurant = await restaurantModel.findById(req.params.id);
    } else {
      restaurant = await restaurantModel.findOne({ slug: req.params.id.toLowerCase() });
    }
    if (!restaurant) return res.json({ success: false, message: "Restaurant not found" });
    const menu = await foodModel.find({ restaurantId: restaurant._id, isAvailable: true });
    const menuWithStats = await attachRatingStats(menu);
    res.json({ success: true, data: { restaurant, menu: menuWithStats } });
  } catch (error) {
    res.json({ success: false, message: "Error" });
  }
};

export { addFood, listFood, listMyFood, removeFood, getFood, searchFood, updateFood, listRestaurants, getRestaurant };
