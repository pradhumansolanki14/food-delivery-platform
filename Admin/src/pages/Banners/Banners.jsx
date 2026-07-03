import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const ALLOWED_MIME = ["image/jpeg", "image/png", "image/webp"];
const inp = "w-full px-4 py-3 rounded-2xl border-2 border-slate-100 bg-white text-slate-900 text-sm focus:outline-none focus:border-orange-300 transition-all";

const Banners = ({ url }) => {
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ title: "", subtitle: "", restaurantId: "", order: 0, isActive: true });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [saving, setSaving] = useState(false);
  const token = localStorage.getItem("adminToken");

  const fetchBanners = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${url}/api/banners`);
      if (res.data.success) setBanners(res.data.data);
    } catch { toast.error("Failed to load banners"); }
    setLoading(false);
  };

  useEffect(() => { fetchBanners(); }, []);

  const openAdd = () => {
    setEditing(null);
    setForm({ title: "", subtitle: "", restaurantId: "", order: 0, isActive: true });
    setImageFile(null); setImagePreview("");
    setShowForm(true);
  };

  const openEdit = (b) => {
    setEditing(b);
    setForm({ title: b.title, subtitle: b.subtitle || "", restaurantId: b.restaurantId || "", order: b.order || 0, isActive: b.isActive });
    setImageFile(null);
    setImagePreview(b.image ? `${url}/images/${b.image}` : "");
    setShowForm(true);
  };

  const closeForm = () => { setShowForm(false); setEditing(null); setImageFile(null); setImagePreview(""); };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (!ALLOWED_MIME.includes(file.type)) {
      toast.error("Only JPEG, PNG, and WebP images are allowed");
      e.target.value = "";
      return;
    }
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!form.title.trim()) return;
    if (!editing && !imageFile) { toast.error("Image is required for new banners"); return; }
    setSaving(true);
    try {
      const fd = new FormData();
      fd.append("title", form.title);
      fd.append("subtitle", form.subtitle);
      if (form.restaurantId) fd.append("restaurantId", form.restaurantId);
      fd.append("order", form.order);
      if (editing) fd.append("isActive", form.isActive);
      if (imageFile) fd.append("image", imageFile);

      let res;
      if (editing) {
        res = await axios.put(`${url}/api/banners/${editing._id}`, fd, { headers: { token } });
      } else {
        res = await axios.post(`${url}/api/banners`, fd, { headers: { token } });
      }
      if (res.data.success) {
        toast.success(editing ? "Banner updated" : "Banner created");
        closeForm(); fetchBanners();
      } else {
        toast.error(res.data.message || "Error");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Request failed");
    }
    setSaving(false);
  };

  const handleDelete = async (b) => {
    if (!window.confirm(`Delete banner "${b.title}"?`)) return;
    try {
      const res = await axios.delete(`${url}/api/banners/${b._id}`, { headers: { token } });
      if (res.data.success) { toast.success("Banner deleted"); fetchBanners(); }
      else toast.error(res.data.message);
    } catch { toast.error("Delete failed"); }
  };

  return (
    <div className="max-w-4xl animate-fadeUp">
      {/* Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: "rgba(15,23,42,0.5)", backdropFilter: "blur(4px)" }} onClick={e => e.target === e.currentTarget && closeForm()}>
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden animate-fadeUp max-h-[90vh] overflow-y-auto">
            <div className="h-1.5 w-full bg-gradient-to-r from-orange-400 to-orange-600" />
            <div className="p-6">
              <div className="flex items-center justify-between mb-5">
                <h2 className="font-bold text-xl text-slate-900">{editing ? "Edit Banner" : "Create Banner"}</h2>
                <button onClick={closeForm} className="w-8 h-8 rounded-xl bg-slate-100 flex items-center justify-center text-slate-500 hover:bg-slate-200">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/></svg>
                </button>
              </div>
              <form onSubmit={handleSave} className="space-y-4">
                {/* Image upload */}
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1.5 block">Image {!editing && "*"}</label>
                  <label htmlFor="banner-img" className="cursor-pointer block">
                    <div className={`w-full h-40 rounded-2xl border-2 border-dashed overflow-hidden flex items-center justify-center transition-all ${imagePreview ? "border-orange-200 bg-orange-50/20" : "border-slate-200 hover:border-orange-300 bg-slate-50"}`}>
                      {imagePreview ? (
                        <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                      ) : (
                        <div className="flex flex-col items-center gap-2 text-slate-400">
                          <span className="text-3xl">🖼️</span>
                          <p className="text-xs font-semibold">JPEG, PNG, or WebP</p>
                        </div>
                      )}
                    </div>
                  </label>
                  <input id="banner-img" type="file" accept="image/jpeg,image/png,image/webp" className="hidden" onChange={handleFileChange} />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1.5 block">Title *</label>
                  <input value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} placeholder="Banner title" required className={inp} />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1.5 block">Subtitle</label>
                  <input value={form.subtitle} onChange={e => setForm(f => ({ ...f, subtitle: e.target.value }))} placeholder="Optional subtitle" className={inp} />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1.5 block">Sort Order</label>
                    <input type="number" value={form.order} onChange={e => setForm(f => ({ ...f, order: Number(e.target.value) }))} min="0" className={inp} />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1.5 block">Restaurant ID</label>
                    <input value={form.restaurantId} onChange={e => setForm(f => ({ ...f, restaurantId: e.target.value }))} placeholder="Optional" className={inp} />
                  </div>
                </div>
                {editing && (
                  <label className="flex items-center gap-3 cursor-pointer">
                    <div className={`relative w-11 h-6 rounded-full transition-colors ${form.isActive ? "bg-emerald-500" : "bg-slate-300"}`} onClick={() => setForm(f => ({ ...f, isActive: !f.isActive }))}>
                      <div className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-transform ${form.isActive ? "translate-x-6" : "translate-x-1"}`} />
                    </div>
                    <span className="text-sm font-semibold text-slate-700">{form.isActive ? "Active" : "Inactive"}</span>
                  </label>
                )}
                <div className="flex gap-3 pt-2">
                  <button type="button" onClick={closeForm} className="flex-1 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-2xl text-sm">Cancel</button>
                  <button type="submit" disabled={saving} className="flex-1 py-3 bg-slate-900 hover:bg-slate-700 text-white font-bold rounded-2xl text-sm disabled:opacity-60">
                    {saving ? "Saving..." : editing ? "Update" : "Create"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-orange-100 flex items-center justify-center text-xl">🖼️</div>
          <div>
            <h1 className="font-bold text-2xl text-slate-900">Banners</h1>
            <p className="text-slate-400 text-sm">{banners.length} active banner{banners.length !== 1 ? "s" : ""}</p>
          </div>
        </div>
        <button onClick={openAdd} className="flex items-center gap-2 px-5 py-2.5 bg-slate-900 hover:bg-slate-700 text-white font-bold rounded-2xl text-sm transition-all">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4"/></svg>
          Create Banner
        </button>
      </div>

      {loading ? (
        <div className="grid sm:grid-cols-2 gap-4">
          {[1,2,3,4].map(i => <div key={i} className="h-52 bg-white rounded-3xl border border-slate-100 animate-pulse" />)}
        </div>
      ) : banners.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 bg-white rounded-3xl border border-slate-100">
          <span className="text-5xl mb-3">🖼️</span>
          <p className="font-semibold text-slate-700">No banners yet</p>
          <p className="text-sm text-slate-400 mt-1">Create your first promotional banner</p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 gap-4">
          {banners.map(b => (
            <div key={b._id} className="bg-white rounded-3xl border border-slate-100 shadow-card overflow-hidden group hover:border-orange-200 transition-all">
              {b.image ? (
                <div className="h-36 overflow-hidden bg-slate-50">
                  <img src={`${url}/images/${b.image}`} alt={b.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                </div>
              ) : (
                <div className="h-36 bg-slate-100 flex items-center justify-center text-4xl">🖼️</div>
              )}
              <div className="p-4">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="font-bold text-slate-900 truncate">{b.title}</p>
                    {b.subtitle && <p className="text-xs text-slate-400 mt-0.5 truncate">{b.subtitle}</p>}
                    <div className="flex items-center gap-2 mt-2">
                      <span className="text-xs font-semibold bg-slate-100 text-slate-600 px-2 py-0.5 rounded-lg">Order: {b.order}</span>
                      <span className={`text-xs font-semibold px-2 py-0.5 rounded-lg ${b.isActive ? "bg-emerald-50 text-emerald-600" : "bg-slate-100 text-slate-500"}`}>{b.isActive ? "Active" : "Inactive"}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 flex-shrink-0">
                    <button onClick={() => openEdit(b)} className="w-8 h-8 rounded-xl bg-slate-100 hover:bg-orange-50 hover:text-orange-500 flex items-center justify-center text-slate-500 transition-all">
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/></svg>
                    </button>
                    <button onClick={() => handleDelete(b)} className="w-8 h-8 rounded-xl bg-slate-100 hover:bg-red-50 hover:text-red-500 flex items-center justify-center text-slate-500 transition-all">
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Banners;
