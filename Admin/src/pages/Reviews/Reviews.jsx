import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const Stars = ({ rating }) => (
  <div className="flex items-center gap-0.5">
    {[1,2,3,4,5].map(s => (
      <svg key={s} className={`w-3.5 h-3.5 ${s <= rating ? "text-amber-400" : "text-slate-200"}`} fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
      </svg>
    ))}
  </div>
);

const Reviews = ({ url }) => {
  const [reviews, setReviews] = useState([]);
  const [foodItems, setFoodItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterFood, setFilterFood] = useState("All");
  const [filterRating, setFilterRating] = useState(0);
  const [replyText, setReplyText] = useState({});
  const [editingReply, setEditingReply] = useState({});
  const [savingReply, setSavingReply] = useState("");
  const token = localStorage.getItem("adminToken");

  const fetchData = async () => {
    setLoading(true);
    try {
      // Get vendor's food items
      const foodRes = await axios.get(`${url}/api/food/my/items`, { headers: { token } });
      if (!foodRes.data.success) { setLoading(false); return; }
      const items = foodRes.data.data;
      setFoodItems(items);

      // Fetch reviews for each food item
      const allReviews = [];
      for (const food of items) {
        try {
          const revRes = await axios.get(`${url}/api/reviews/food/${food._id}`);
          if (revRes.data.success) {
            revRes.data.data.forEach(r => allReviews.push({ ...r, foodName: food.name }));
          }
        } catch {}
      }
      setReviews(allReviews.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
    } catch { toast.error("Failed to load reviews"); }
    setLoading(false);
  };

  useEffect(() => { fetchData(); }, []);

  const handleReply = async (review) => {
    const reply = replyText[review._id]?.trim();
    if (!reply) { toast.error("Reply cannot be empty"); return; }
    setSavingReply(review._id);
    try {
      const res = await axios.put(`${url}/api/admin/reviews/${review._id}/reply`, { reply }, { headers: { token } });
      if (res.data.success) {
        toast.success("Reply saved");
        setReviews(prev => prev.map(r => r._id === review._id ? { ...r, vendorReply: reply, vendorRepliedAt: new Date() } : r));
        setReplyText(prev => ({ ...prev, [review._id]: "" }));
        setEditingReply(prev => ({ ...prev, [review._id]: false }));
      } else toast.error(res.data.message);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to save reply");
    }
    setSavingReply("");
  };

  const filtered = reviews.filter(r => {
    const matchFood = filterFood === "All" || r.foodName === filterFood;
    const matchRating = filterRating === 0 || r.rating === filterRating;
    return matchFood && matchRating;
  });

  const uniqueFoodNames = [...new Set(reviews.map(r => r.foodName))];

  return (
    <div className="max-w-4xl animate-fadeUp">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-amber-100 flex items-center justify-center text-xl">⭐</div>
          <div>
            <h1 className="font-bold text-2xl text-slate-900">Reviews</h1>
            <p className="text-slate-400 text-sm">{reviews.length} customer review{reviews.length !== 1 ? "s" : ""}</p>
          </div>
        </div>
        <button onClick={fetchData} className="flex items-center gap-1.5 px-4 py-2 bg-white border border-slate-200 hover:border-orange-300 text-slate-600 hover:text-orange-500 text-xs font-semibold rounded-xl transition-all">
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/></svg>
          Refresh
        </button>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3 mb-6 flex-wrap">
        <select value={filterFood} onChange={e => setFilterFood(e.target.value)}
          className="px-4 py-2 bg-white border border-slate-200 text-slate-700 text-sm font-semibold rounded-xl focus:outline-none focus:border-orange-300">
          <option value="All">All Items</option>
          {uniqueFoodNames.map(n => <option key={n} value={n}>{n}</option>)}
        </select>
        <select value={filterRating} onChange={e => setFilterRating(Number(e.target.value))}
          className="px-4 py-2 bg-white border border-slate-200 text-slate-700 text-sm font-semibold rounded-xl focus:outline-none focus:border-orange-300">
          <option value={0}>All Ratings</option>
          {[5,4,3,2,1].map(r => <option key={r} value={r}>{r} Star{r !== 1 ? "s" : ""}</option>)}
        </select>
        {(filterFood !== "All" || filterRating !== 0) && (
          <button onClick={() => { setFilterFood("All"); setFilterRating(0); }} className="text-xs font-semibold text-orange-500 hover:underline">Clear filters</button>
        )}
        <span className="ml-auto text-xs text-slate-400">{filtered.length} result{filtered.length !== 1 ? "s" : ""}</span>
      </div>

      {loading ? (
        <div className="space-y-4">{[1,2,3].map(i => <div key={i} className="h-32 bg-white rounded-3xl border border-slate-100 animate-pulse"/>)}</div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 bg-white rounded-3xl border border-slate-100">
          <span className="text-5xl mb-3">💬</span>
          <p className="font-semibold text-slate-700">No reviews yet</p>
          <p className="text-sm text-slate-400 mt-1">Reviews from your customers will appear here</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map(review => {
            const isEditing = editingReply[review._id];
            const isSaving = savingReply === review._id;
            return (
              <div key={review._id} className="bg-white rounded-3xl border border-slate-100 shadow-card p-5">
                {/* Review header */}
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-orange-100 to-orange-200 flex items-center justify-center font-bold text-orange-600 text-sm flex-shrink-0">
                      {review.name?.charAt(0)?.toUpperCase() || "?"}
                    </div>
                    <div>
                      <p className="font-bold text-slate-900 text-sm">{review.name}</p>
                      <p className="text-xs text-slate-400">{review.foodName}</p>
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <Stars rating={review.rating} />
                    <p className="text-xs text-slate-400 mt-1">{new Date(review.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>

                {/* Comment */}
                <p className="text-sm text-slate-700 leading-relaxed mb-4">{review.comment}</p>

                {/* Vendor reply */}
                {review.vendorReply && !isEditing ? (
                  <div className="bg-orange-50 border border-orange-100 rounded-2xl p-3 mb-3">
                    <div className="flex items-center justify-between mb-1">
                      <p className="text-xs font-bold text-orange-600">Your reply</p>
                      <button onClick={() => { setEditingReply(e => ({ ...e, [review._id]: true })); setReplyText(t => ({ ...t, [review._id]: review.vendorReply })); }}
                        className="text-xs text-slate-400 hover:text-orange-500 transition-colors">Edit</button>
                    </div>
                    <p className="text-sm text-slate-700">{review.vendorReply}</p>
                    {review.vendorRepliedAt && <p className="text-xs text-slate-400 mt-1">{new Date(review.vendorRepliedAt).toLocaleDateString()}</p>}
                  </div>
                ) : null}

                {/* Reply input */}
                {(!review.vendorReply || isEditing) && (
                  <div className="space-y-2">
                    <textarea
                      value={replyText[review._id] || ""}
                      onChange={e => setReplyText(t => ({ ...t, [review._id]: e.target.value }))}
                      placeholder="Write a reply to this review..."
                      rows={2}
                      className="w-full px-4 py-3 rounded-2xl border-2 border-slate-100 bg-slate-50 text-slate-900 text-sm focus:outline-none focus:border-orange-300 transition-all resize-none"
                    />
                    <div className="flex items-center gap-2">
                      {isEditing && (
                        <button onClick={() => setEditingReply(e => ({ ...e, [review._id]: false }))}
                          className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl text-xs transition-all">
                          Cancel
                        </button>
                      )}
                      <button disabled={isSaving} onClick={() => handleReply(review)}
                        className="px-4 py-2 bg-slate-900 hover:bg-slate-700 text-white font-semibold rounded-xl text-xs transition-all disabled:opacity-60">
                        {isSaving ? "Saving..." : isEditing ? "Update Reply" : "Post Reply"}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Reviews;
