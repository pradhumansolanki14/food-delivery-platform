import searchLogModel from "../models/searchLogModel.js";

export const logSearch = async (req, res) => {
  try {
    const { query } = req.body;
    if (!query || !query.trim()) {
      return res.json({ success: false, message: "Query is required" });
    }
    const cleanQuery = query.trim().toLowerCase();
    
    // Save query log
    await searchLogModel.create({ query: cleanQuery });
    res.json({ success: true, message: "Search logged successfully" });
  } catch (error) {
    console.error(error);
    res.status(550).json({ success: false, message: "Server error logging search" });
  }
};

export const getTrendingSearches = async (req, res) => {
  try {
    // Get search logs from the last 7 days
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const stats = await searchLogModel.aggregate([
      { $match: { createdAt: { $gte: sevenDaysAgo } } },
      { $group: { _id: "$query", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 8 }
    ]);
    
    let trending = stats.map(s => {
      // Capitalize search terms for presentation
      return s._id.split(" ").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");
    });
    
    // Fallbacks if data logs are dry
    const fallbacks = ["Pizza", "Pasta", "Salad", "Cake", "Noodles", "Sandwich", "Rolls", "Dessert"];
    if (trending.length < 5) {
      trending = [...new Set([...trending, ...fallbacks])].slice(0, 8);
    }
    
    res.json({ success: true, data: trending });
  } catch (error) {
    console.error(error);
    res.status(550).json({ success: false, message: "Server error fetching trending searches" });
  }
};
