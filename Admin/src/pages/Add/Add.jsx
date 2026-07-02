import React, { useState } from "react";
import { assets } from "../../assets/assets";
import axios from "axios";
import { toast } from "react-toastify";

const CATEGORIES = ["Salad", "Rolls", "Deserts", "Sandwich", "Cake", "Pure Veg", "Pasta", "Noodles"];

const categoryEmoji = {
  Salad: "🥗", Rolls: "🌯", Deserts: "🍰", Sandwich: "🥪",
  Cake: "🎂", "Pure Veg": "🥦", Pasta: "🍝", Noodles: "🍜",
};

const Add = ({ url }) => {
  const [image, setImage] = useState(false);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState({ name: "", description: "", price: "", category: "Salad" });

  const onChangeHandler = (e) => setData(d => ({ ...d, [e.target.name]: e.target.value }));

  const onSubmitHandler = async (event) => {
    event.preventDefault();
    setLoading(true);
    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("description", data.description);
    formData.append("price", Number(data.price));
    formData.append("category", data.category);
    formData.append("image", image);
    try {
      const response = await axios.post(`${url}/api/food/add`, formData);
      if (response.data.success) {
        setData({ name: "", description: "", price: "", category: "Salad" });
        setImage(false);
        toast.success(response.data.message);
      } else {
        toast.error(response.data.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const inputCls = "w-full px-4 py-3.5 rounded-2xl border-2 border-slate-100 bg-white text-slate-900 placeholder-slate-400 text-sm focus:outline-none focus:border-orange-300 transition-all duration-200";

  return (
    <div className="max-w-2xl animate-fadeUp">
      {/* Page header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-1">
          <div className="w-10 h-10 rounded-2xl bg-orange-100 flex items-center justify-center text-xl">
            ➕
          </div>
          <div>
            <h1 className="font-display text-2xl font-bold text-slate-900">Add New Dish</h1>
            <p className="text-slate-400 text-sm">Add a new item to your restaurant menu</p>
          </div>
        </div>
      </div>

      <form onSubmit={onSubmitHandler} className="space-y-5">
        {/* Image Upload */}
        <div className="bg-white rounded-3xl border border-slate-100 shadow-card p-6">
          <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-4">
            Dish Photo
          </label>
          <label htmlFor="image" className="cursor-pointer block">
            <div className={`relative w-full h-52 rounded-2xl border-2 border-dashed transition-all duration-200 overflow-hidden group ${
              image ? 'border-orange-200 bg-orange-50/20' : 'border-slate-200 hover:border-orange-300 bg-slate-50 hover:bg-orange-50/30'
            }`}>
              {image ? (
                <>
                  <img src={URL.createObjectURL(image)} alt="Preview"
                    className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <span className="text-white text-sm font-semibold">Change photo</span>
                  </div>
                </>
              ) : (
                <div className="flex flex-col items-center justify-center h-full gap-3">
                  <div className="w-14 h-14 rounded-2xl bg-orange-100 flex items-center justify-center text-2xl">📸</div>
                  <div className="text-center">
                    <p className="text-sm font-semibold text-slate-700">Drop your photo here</p>
                    <p className="text-xs text-slate-400 mt-1">PNG, JPG, WEBP up to 5MB</p>
                  </div>
                  <span className="px-4 py-2 bg-orange-500 text-white text-xs font-bold rounded-xl">
                    Browse Files
                  </span>
                </div>
              )}
            </div>
          </label>
          <input onChange={(e) => setImage(e.target.files[0])} type="file" id="image" hidden required accept="image/*" />
          {image && (
            <button type="button" onClick={() => setImage(false)}
              className="mt-3 flex items-center gap-1.5 text-xs text-red-400 hover:text-red-600 transition-colors font-medium">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
              Remove photo
            </button>
          )}
        </div>

        {/* Details */}
        <div className="bg-white rounded-3xl border border-slate-100 shadow-card p-6 space-y-4">
          <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">
            Dish Details
          </label>

          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1.5">Dish Name *</label>
            <input onChange={onChangeHandler} value={data.name} type="text" name="name"
              placeholder="e.g. Grilled Caesar Salad" required className={inputCls} />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1.5">Description *</label>
            <textarea onChange={onChangeHandler} value={data.description} name="description"
              rows={4} placeholder="Describe the ingredients, flavor profile, and preparation..."
              required className={`${inputCls} resize-none`} />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1.5">Category *</label>
              <div className="relative">
                <select onChange={onChangeHandler} name="category" value={data.category} className={inputCls}>
                  {CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>{categoryEmoji[cat]} {cat}</option>
                  ))}
                </select>
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1.5">Price (USD) *</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-semibold text-sm">$</span>
                <input onChange={onChangeHandler} value={data.price} type="number" name="price"
                  placeholder="0.00" min="1" required className={`${inputCls} pl-8`} />
              </div>
            </div>
          </div>
        </div>

        {/* Submit */}
        <button type="submit" disabled={loading}
          className="w-full py-4 btn-primary text-white font-bold rounded-2xl shadow-orange text-sm flex items-center justify-center gap-2.5 disabled:opacity-60">
          {loading ? (
            <><div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full" style={{ animation: 'rotate 0.8s linear infinite' }} />Adding dish...</>
          ) : (
            <><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
            </svg>Add to Menu</>
          )}
        </button>
      </form>
    </div>
  );
};

export default Add;
