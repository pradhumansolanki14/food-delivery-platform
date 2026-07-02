import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const CATEGORIES = ["Salad", "Rolls", "Deserts", "Sandwich", "Cake", "Pure Veg", "Pasta", "Noodles"];

const categoryColors = {
  Salad: "bg-green-50 text-green-600", Rolls: "bg-amber-50 text-amber-600",
  Deserts: "bg-pink-50 text-pink-600", Sandwich: "bg-yellow-50 text-yellow-600",
  Cake: "bg-purple-50 text-purple-600", "Pure Veg": "bg-emerald-50 text-emerald-600",
  Pasta: "bg-orange-50 text-orange-600", Noodles: "bg-red-50 text-red-600",
};

// ─── Edit Modal ───────────────────────────────────────────────
const EditModal = ({ item, url, onClose, onSaved }) => {
  const [data, setData] = useState({ name: item.name, description: item.description, price: item.price, category: item.category });
  const [newImage, setNewImage] = useState(null);
  const [loading, setLoading] = useState(false);

  const onChange = (e) => setData(d => ({ ...d, [e.target.name]: e.target.value }));

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("name", data.name);
      formData.append("description", data.description);
      formData.append("price", Number(data.price));
      formData.append("category", data.category);
      if (newImage) formData.append("image", newImage);

      const res = await axios.put(`${url}/api/food/${item._id}`, formData);
      if (res.data.success) {
        toast.success("Dish updated!");
        onSaved();
        onClose();
      } else {
        toast.error(res.data.message);
      }
    } catch { toast.error("Update failed"); }
    setLoading(false);
  };

  const inputCls = "w-full px-4 py-3 rounded-2xl border-2 border-slate-100 bg-slate-50 text-slate-900 text-sm focus:outline-none focus:border-orange-300 focus:bg-white transition-all";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: "rgba(15,23,42,0.6)", backdropFilter: "blur(4px)" }} onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="bg-white rounded-4xl shadow-2xl w-full max-w-lg overflow-hidden animate-fadeUp">
        <div className="h-1.5 w-full" style={{ background: "linear-gradient(135deg, #f97316, #ea580c)" }} />
        <div className="p-6 sm:p-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-orange-100 flex items-center justify-center text-xl">✏️</div>
              <div>
                <h2 className="font-display font-bold text-xl text-slate-900">Edit Dish</h2>
                <p className="text-xs text-slate-400">Update item details</p>
              </div>
            </div>
            <button onClick={onClose} className="w-8 h-8 rounded-xl bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 transition-colors">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </div>

          <form onSubmit={onSubmit} className="space-y-4">
            {/* Current image + upload new */}
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Dish Photo</label>
              <div className="flex items-center gap-4">
                <div className="w-20 h-20 rounded-2xl overflow-hidden bg-slate-100 flex-shrink-0">
                  <img src={newImage ? URL.createObjectURL(newImage) : `${url}/images/${item.image}`} alt={item.name} className="w-full h-full object-cover" />
                </div>
                <div>
                  <label htmlFor="edit-image" className="cursor-pointer flex items-center gap-2 px-4 py-2.5 bg-slate-50 hover:bg-orange-50 border-2 border-dashed border-slate-200 hover:border-orange-300 rounded-2xl text-xs font-semibold text-slate-600 hover:text-orange-500 transition-all">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                    Change photo
                  </label>
                  <input id="edit-image" type="file" accept="image/*" hidden onChange={e => setNewImage(e.target.files[0])} />
                  {newImage && <p className="text-xs text-emerald-500 mt-1.5 font-medium">✓ New photo selected</p>}
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1.5">Dish Name *</label>
              <input name="name" value={data.name} onChange={onChange} required className={inputCls} placeholder="Dish name" />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1.5">Description *</label>
              <textarea name="description" value={data.description} onChange={onChange} rows={3} required className={`${inputCls} resize-none`} placeholder="Description" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1.5">Category</label>
                <select name="category" value={data.category} onChange={onChange} className={inputCls}>
                  {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1.5">Price ($)</label>
                <input name="price" value={data.price} onChange={onChange} type="number" min="1" required className={inputCls} placeholder="0.00" />
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <button type="button" onClick={onClose} className="flex-1 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-2xl text-sm transition-colors">Cancel</button>
              <button type="submit" disabled={loading} className="flex-1 py-3 text-white font-bold rounded-2xl text-sm flex items-center justify-center gap-2 disabled:opacity-60 transition-all"
                style={{ background: "linear-gradient(135deg, #f97316, #ea580c)", boxShadow: "0 8px 25px -5px rgba(249,115,22,0.4)" }}>
                {loading ? <><div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full" style={{ animation: "rotate 0.8s linear infinite" }} />Saving...</> : "Save Changes"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

// ─── Main List Page ───────────────────────────────────────────
const List = ({ url }) => {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [editItem, setEditItem] = useState(null);

  const fetchList = async () => {
    setLoading(true);
    const res = await axios.get(`${url}/api/food/list`);
    if (res.data.success) setList(res.data.data);
    else toast.error("Error fetching food list");
    setLoading(false);
  };

  const removeFood = async (foodId) => {
    const res = await axios.post(`${url}/api/food/remove`, { id: foodId });
    if (res.data.success) { toast.success(res.data.message); fetchList(); }
    else toast.error("Error removing item");
  };

  useEffect(() => { fetchList(); }, []);

  const filtered = list.filter(item =>
    item.name.toLowerCase().includes(search.toLowerCase()) ||
    item.category.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-5xl animate-fadeUp">
      {editItem && <EditModal item={editItem} url={url} onClose={() => setEditItem(null)} onSaved={fetchList} />}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-blue-100 flex items-center justify-center text-xl">🍽️</div>
          <div>
            <h1 className="font-display text-2xl font-bold text-slate-900">Food List</h1>
            <p className="text-slate-400 text-sm">{list.length} item{list.length !== 1 ? 's' : ''} on your menu</p>
          </div>
        </div>
        <div className="flex items-center gap-3 bg-white border border-slate-200 rounded-2xl px-4 py-2.5 w-full sm:w-72 focus-within:border-orange-300 transition-colors">
          <svg className="w-4 h-4 text-slate-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input type="text" placeholder="Search dishes..." value={search} onChange={e => setSearch(e.target.value)}
            className="flex-1 bg-transparent text-sm text-slate-700 placeholder-slate-400 outline-none" />
          {search && <button onClick={() => setSearch("")} className="text-slate-400 hover:text-slate-600">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {[
          { label: "Total Items", value: list.length, icon: "🍽️", color: "bg-blue-50 border-blue-100" },
          { label: "Categories", value: [...new Set(list.map(i => i.category))].length, icon: "📂", color: "bg-orange-50 border-orange-100" },
          { label: "Avg Price", value: list.length ? `$${(list.reduce((a, b) => a + b.price, 0) / list.length).toFixed(0)}` : "$0", icon: "💰", color: "bg-emerald-50 border-emerald-100" },
        ].map((stat, i) => (
          <div key={i} className={`bg-white rounded-2xl border shadow-card p-4 ${stat.color}`}>
            <div className="flex items-center gap-3">
              <span className="text-2xl">{stat.icon}</span>
              <div>
                <p className="text-xl font-display font-bold text-slate-900">{stat.value}</p>
                <p className="text-xs text-slate-400">{stat.label}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Table */}
      <div className="bg-white rounded-3xl border border-slate-100 shadow-card overflow-hidden">
        <div className="hidden sm:grid grid-cols-[1fr_2fr_1.5fr_1fr_auto] gap-4 px-6 py-4 bg-slate-50 border-b border-slate-100">
          {["Photo", "Dish Name", "Category", "Price", "Actions"].map((h, i) => (
            <span key={i} className="text-xs font-bold text-slate-400 uppercase tracking-widest">{h}</span>
          ))}
        </div>

        {loading ? (
          <div className="p-6 space-y-4">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="flex items-center gap-4 animate-pulse">
                <div className="w-12 h-12 bg-slate-100 rounded-2xl" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-slate-100 rounded-xl w-2/3" />
                  <div className="h-3 bg-slate-50 rounded-xl w-1/3" />
                </div>
                <div className="h-4 w-16 bg-slate-100 rounded-xl" />
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="text-5xl mb-4">🔍</div>
            <p className="font-semibold text-slate-700 mb-1">{search ? 'No results found' : 'No dishes yet'}</p>
            <p className="text-sm text-slate-400">{search ? `No dishes match "${search}"` : 'Add your first dish to get started'}</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-50">
            {filtered.map((item) => (
              <div key={item._id} className="grid grid-cols-[auto_1fr_auto] sm:grid-cols-[1fr_2fr_1.5fr_1fr_auto] gap-4 items-center px-6 py-4 hover:bg-slate-50/50 transition-colors group">
                <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl overflow-hidden flex-shrink-0 bg-slate-100">
                  <img src={`${url}/images/${item.image}`} alt={item.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                </div>
                <div className="min-w-0">
                  <p className="font-semibold text-slate-900 truncate text-sm">{item.name}</p>
                  <p className="sm:hidden text-xs text-slate-400 mt-0.5">
                    <span className={`px-2 py-0.5 rounded-lg text-xs font-medium ${categoryColors[item.category] || 'bg-slate-100 text-slate-600'}`}>{item.category}</span>
                    <span className="ml-2 font-bold text-orange-500">${item.price}</span>
                  </p>
                </div>
                <span className={`hidden sm:inline-flex items-center px-3 py-1.5 rounded-xl text-xs font-semibold ${categoryColors[item.category] || 'bg-slate-100 text-slate-600'}`}>
                  {item.category}
                </span>
                <p className="hidden sm:block font-display font-bold text-slate-900 text-sm">${item.price}</p>
                {/* Actions */}
                <div className="flex items-center gap-1 ml-auto sm:ml-0">
                  <button onClick={() => setEditItem(item)}
                    className="w-9 h-9 rounded-xl flex items-center justify-center text-slate-400 hover:text-orange-500 hover:bg-orange-50 transition-all duration-150"
                    aria-label={`Edit ${item.name}`}>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </button>
                  <button onClick={() => removeFood(item._id)}
                    className="w-9 h-9 rounded-xl flex items-center justify-center text-slate-400 hover:text-red-500 hover:bg-red-50 transition-all duration-150"
                    aria-label={`Remove ${item.name}`}>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default List;
