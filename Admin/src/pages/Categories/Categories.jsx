import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";

// Default categories always available
const DEFAULT_CATEGORIES = [
  { name: "Salad",     emoji: "🥗", color: "bg-green-50 text-green-600 border-green-200" },
  { name: "Rolls",     emoji: "🌯", color: "bg-amber-50 text-amber-600 border-amber-200" },
  { name: "Deserts",   emoji: "🍰", color: "bg-pink-50 text-pink-600 border-pink-200" },
  { name: "Sandwich",  emoji: "🥪", color: "bg-yellow-50 text-yellow-600 border-yellow-200" },
  { name: "Cake",      emoji: "🎂", color: "bg-purple-50 text-purple-600 border-purple-200" },
  { name: "Pure Veg",  emoji: "🥦", color: "bg-emerald-50 text-emerald-600 border-emerald-200" },
  { name: "Pasta",     emoji: "🍝", color: "bg-orange-50 text-orange-600 border-orange-200" },
  { name: "Noodles",   emoji: "🍜", color: "bg-red-50 text-red-600 border-red-200" },
];

const EMOJI_OPTIONS = ["🥗","🌯","🍰","🥪","🎂","🥦","🍝","🍜","🍕","🍔","🌮","🍱","🍛","🥩","🦐","🍣","🍱","🥟","🧆","🫕"];

const Categories = ({ url }) => {
  const [foodList, setFoodList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [newCat, setNewCat] = useState({ name: "", emoji: "🍽️" });

  const fetchFoods = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${url}/api/food/list`);
      if (res.data.success) setFoodList(res.data.data);
    } catch {}
    setLoading(false);
  };

  useEffect(() => { fetchFoods(); }, []);

  // Build category stats from actual food data
  const categoryStats = DEFAULT_CATEGORIES.map(cat => ({
    ...cat,
    count: foodList.filter(f => f.category === cat.name).length,
    avgPrice: foodList.filter(f => f.category === cat.name).length
      ? (foodList.filter(f => f.category === cat.name).reduce((a, b) => a + b.price, 0) / foodList.filter(f => f.category === cat.name).length).toFixed(0)
      : 0,
  }));

  const handleAddCategory = (e) => {
    e.preventDefault();
    if (!newCat.name.trim()) return;
    toast.info(`Category "${newCat.name}" noted! To make it available in the food list, add it to the CATEGORIES array in your Add.jsx file.`);
    setShowAdd(false);
    setNewCat({ name: "", emoji: "🍽️" });
  };

  return (
    <div className="max-w-4xl animate-fadeUp">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-orange-100 flex items-center justify-center text-xl">📂</div>
          <div>
            <h1 className="font-display text-2xl font-bold text-slate-900">Categories</h1>
            <p className="text-slate-400 text-sm">{DEFAULT_CATEGORIES.length} categories · {foodList.length} total items</p>
          </div>
        </div>
        <button onClick={() => setShowAdd(f => !f)}
          className="flex items-center gap-2 px-5 py-2.5 bg-slate-900 hover:bg-slate-700 text-white font-bold rounded-2xl text-sm transition-all">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4"/></svg>
          Add Category
        </button>
      </div>

      {/* Add form */}
      {showAdd && (
        <div className="bg-white rounded-3xl border border-slate-100 shadow-card p-6 mb-6 animate-fadeUp">
          <h2 className="font-display font-bold text-lg text-slate-900 mb-4">New Category</h2>
          <form onSubmit={handleAddCategory} className="space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1.5">Category Name *</label>
                <input value={newCat.name} onChange={e => setNewCat(c => ({...c, name: e.target.value}))} required placeholder="e.g. Burgers"
                  className="w-full px-4 py-3 rounded-2xl border-2 border-slate-100 bg-white text-slate-900 text-sm focus:outline-none focus:border-orange-300 transition-all" />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1.5">Emoji</label>
                <div className="grid grid-cols-10 gap-1.5">
                  {EMOJI_OPTIONS.map(em => (
                    <button key={em} type="button" onClick={() => setNewCat(c => ({...c, emoji: em}))}
                      className={`w-8 h-8 rounded-xl text-sm flex items-center justify-center transition-all ${newCat.emoji === em ? 'bg-orange-100 ring-2 ring-orange-400' : 'bg-slate-50 hover:bg-slate-100'}`}>
                      {em}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            <div className="p-3 bg-amber-50 border border-amber-200 rounded-2xl">
              <p className="text-xs font-semibold text-amber-700">📝 Note: After adding a category here, also add it to the <code className="font-mono bg-amber-100 px-1 rounded">CATEGORIES</code> array in <code className="font-mono bg-amber-100 px-1 rounded">Admin/src/pages/Add/Add.jsx</code> to make it available when adding food items.</p>
            </div>
            <div className="flex gap-3">
              <button type="button" onClick={() => setShowAdd(false)} className="flex-1 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-2xl text-sm">Cancel</button>
              <button type="submit" className="flex-1 py-3 bg-slate-900 hover:bg-slate-700 text-white font-bold rounded-2xl text-sm transition-all">Add Category</button>
            </div>
          </form>
        </div>
      )}

      {/* Category grid */}
      {loading ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1,2,3,4,5,6,7,8].map(i => <div key={i} className="h-36 bg-white rounded-3xl border border-slate-100 animate-pulse"/>)}
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {categoryStats.map((cat, i) => (
            <div key={i} className={`bg-white rounded-3xl border-2 ${cat.color} p-5 hover:scale-105 transition-all duration-300 cursor-default`}>
              <div className="text-3xl mb-3">{cat.emoji}</div>
              <h3 className="font-display font-bold text-slate-900 mb-1">{cat.name}</h3>
              <div className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-500">Items</span>
                  <span className="font-bold text-slate-900">{cat.count}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-slate-500">Avg Price</span>
                  <span className="font-bold text-slate-900">${cat.avgPrice}</span>
                </div>
              </div>
              {/* Mini bar */}
              <div className="mt-3 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-current rounded-full transition-all duration-700"
                  style={{ width: `${foodList.length > 0 ? (cat.count / foodList.length) * 100 : 0}%` }} />
              </div>
              <p className="text-xs text-slate-400 mt-1">{foodList.length > 0 ? Math.round((cat.count / foodList.length) * 100) : 0}% of menu</p>
            </div>
          ))}
        </div>
      )}

      {/* All items breakdown */}
      {!loading && (
        <div className="mt-6 bg-white rounded-3xl border border-slate-100 shadow-card overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100 bg-slate-50">
            <h3 className="font-display font-bold text-slate-900">Items per Category</h3>
          </div>
          <div className="p-6 space-y-3">
            {categoryStats.map((cat, i) => (
              <div key={i} className="flex items-center gap-4">
                <span className="text-lg w-7">{cat.emoji}</span>
                <span className="text-sm font-semibold text-slate-700 w-28 flex-shrink-0">{cat.name}</span>
                <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div className={`h-full rounded-full transition-all duration-700 ${cat.count > 0 ? 'bg-orange-400' : 'bg-slate-200'}`}
                    style={{ width: `${foodList.length > 0 ? (cat.count / Math.max(...categoryStats.map(c=>c.count||1), 1)) * 100 : 0}%` }} />
                </div>
                <span className="text-sm font-bold text-slate-900 w-10 text-right">{cat.count}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Categories;
