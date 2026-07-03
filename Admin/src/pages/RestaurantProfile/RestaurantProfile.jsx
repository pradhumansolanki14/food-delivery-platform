import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const inp = "w-full px-4 py-3 rounded-2xl border-2 border-slate-100 bg-white text-slate-900 text-sm focus:outline-none focus:border-orange-300 transition-all";
const label = "text-xs font-bold text-slate-500 uppercase tracking-widest mb-1.5 block";

const RestaurantProfile = ({ url }) => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [togglingOpen, setTogglingOpen] = useState(false);
  const [form, setForm] = useState({});
  const [logoFile, setLogoFile] = useState(null);
  const [logoPreview, setLogoPreview] = useState("");
  const [coverFile, setCoverFile] = useState(null);
  const [coverPreview, setCoverPreview] = useState("");
  const token = localStorage.getItem("adminToken");

  const fetchProfile = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${url}/api/admin/restaurant/profile`, { headers: { token } });
      if (res.data.success) {
        const d = res.data.data;
        setProfile(d);
        setForm({
          name: d.name || "", description: d.description || "",
          cuisine: d.cuisine || "", address: d.address || "",
          phone: d.phone || "", email: d.email || "",
          deliveryFee: d.deliveryFee ?? 2, minOrder: d.minOrder ?? 0,
          openingHours: d.openingHours || "", preparationTime: d.preparationTime ?? 30,
          isOpen: d.isOpen ?? true,
        });
        setLogoPreview(d.logo ? `${url}/images/${d.logo}` : "");
        setCoverPreview(d.coverImage ? `${url}/images/${d.coverImage}` : "");
      } else toast.error(res.data.message);
    } catch { toast.error("Failed to load profile"); }
    setLoading(false);
  };

  useEffect(() => { fetchProfile(); }, []);

  const handleFileChange = (e, type) => {
    const file = e.target.files[0];
    if (!file) return;
    if (type === "logo") { setLogoFile(file); setLogoPreview(URL.createObjectURL(file)); }
    else { setCoverFile(file); setCoverPreview(URL.createObjectURL(file)); }
  };

  const handleToggleOpen = async () => {
    setTogglingOpen(true);
    const newVal = !form.isOpen;
    setForm(f => ({ ...f, isOpen: newVal })); // optimistic
    try {
      const fd = new FormData();
      fd.append("isOpen", newVal);
      const res = await axios.put(`${url}/api/admin/restaurant/profile`, fd, { headers: { token } });
      if (res.data.success) {
        setProfile(p => ({ ...p, isOpen: newVal }));
        toast.success(newVal ? "Restaurant is now Open" : "Restaurant is now Closed");
      } else {
        setForm(f => ({ ...f, isOpen: !newVal })); // revert
        toast.error(res.data.message);
      }
    } catch {
      setForm(f => ({ ...f, isOpen: !newVal })); // revert
      toast.error("Toggle failed");
    }
    setTogglingOpen(false);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const fd = new FormData();
      const allowed = ["name","description","cuisine","address","phone","email","deliveryFee","minOrder","openingHours","preparationTime"];
      allowed.forEach(k => { if (form[k] !== undefined) fd.append(k, form[k]); });
      if (logoFile) fd.append("logo", logoFile);
      if (coverFile) fd.append("coverImage", coverFile);
      const res = await axios.put(`${url}/api/admin/restaurant/profile`, fd, { headers: { token } });
      if (res.data.success) {
        toast.success("Profile updated");
        setProfile(res.data.data);
        setLogoFile(null); setCoverFile(null);
        if (res.data.data.logo) setLogoPreview(`${url}/images/${res.data.data.logo}`);
        if (res.data.data.coverImage) setCoverPreview(`${url}/images/${res.data.data.coverImage}`);
      } else toast.error(res.data.message);
    } catch { toast.error("Save failed"); }
    setSaving(false);
  };

  if (loading) return (
    <div className="max-w-2xl space-y-4 animate-pulse">
      <div className="h-8 bg-slate-100 rounded-2xl w-48" />
      <div className="h-48 bg-slate-100 rounded-3xl" />
      <div className="h-64 bg-slate-100 rounded-3xl" />
    </div>
  );

  return (
    <div className="max-w-2xl animate-fadeUp">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-orange-100 flex items-center justify-center text-xl">🏠</div>
          <div>
            <h1 className="font-bold text-2xl text-slate-900">Restaurant Profile</h1>
            <p className="text-slate-400 text-sm">Manage your restaurant information</p>
          </div>
        </div>
        {/* isOpen toggle */}
        <button onClick={handleToggleOpen} disabled={togglingOpen}
          className={`flex items-center gap-2 px-4 py-2 rounded-2xl font-bold text-sm transition-all disabled:opacity-60 ${form.isOpen ? "bg-emerald-50 border border-emerald-200 text-emerald-700 hover:bg-emerald-100" : "bg-red-50 border border-red-200 text-red-600 hover:bg-red-100"}`}>
          <div className={`relative w-9 h-5 rounded-full transition-colors ${form.isOpen ? "bg-emerald-500" : "bg-slate-300"}`}>
            <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${form.isOpen ? "translate-x-4" : "translate-x-0.5"}`} />
          </div>
          {form.isOpen ? "Open" : "Closed"}
        </button>
      </div>

      {/* Read-only info */}
      {profile && (
        <div className="bg-slate-50 rounded-3xl border border-slate-100 p-4 mb-6 grid grid-cols-3 gap-3">
          {[
            { label: "Rating", value: profile.rating?.toFixed(1) || "N/A", icon: "⭐" },
            { label: "Reviews", value: profile.totalReviews || 0, icon: "💬" },
            { label: "Status", value: profile.isApproved ? "Approved" : "Pending", icon: "🏅" },
          ].map((s, i) => (
            <div key={i} className="bg-white rounded-2xl p-3 text-center border border-slate-100">
              <p className="text-lg">{s.icon}</p>
              <p className="font-bold text-slate-900 text-sm">{s.value}</p>
              <p className="text-xs text-slate-400">{s.label}</p>
            </div>
          ))}
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-5">
        {/* Images */}
        <div className="bg-white rounded-3xl border border-slate-100 shadow-card p-6 space-y-4">
          <h2 className="font-bold text-slate-900">Images</h2>
          <div className="grid grid-cols-2 gap-4">
            {[
              { label: "Logo", file: logoFile, preview: logoPreview, id: "logo-inp", onChange: e => handleFileChange(e, "logo") },
              { label: "Cover Image", file: coverFile, preview: coverPreview, id: "cover-inp", onChange: e => handleFileChange(e, "cover") },
            ].map(img => (
              <div key={img.label}>
                <label className={label}>{img.label}</label>
                <label htmlFor={img.id} className="cursor-pointer block">
                  <div className={`w-full h-28 rounded-2xl border-2 border-dashed overflow-hidden flex items-center justify-center transition-all ${img.preview ? "border-orange-200" : "border-slate-200 hover:border-orange-300 bg-slate-50"}`}>
                    {img.preview ? (
                      <img src={img.preview} alt={img.label} className="w-full h-full object-cover" />
                    ) : (
                      <div className="flex flex-col items-center gap-1 text-slate-400">
                        <span className="text-2xl">📸</span>
                        <p className="text-xs">Click to upload</p>
                      </div>
                    )}
                  </div>
                </label>
                <input id={img.id} type="file" accept="image/*" className="hidden" onChange={img.onChange} />
              </div>
            ))}
          </div>
        </div>

        {/* Basic Info */}
        <div className="bg-white rounded-3xl border border-slate-100 shadow-card p-6 space-y-4">
          <h2 className="font-bold text-slate-900">Basic Information</h2>
          <div>
            <label className={label}>Restaurant Name *</label>
            <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} required className={inp} />
          </div>
          <div>
            <label className={label}>Description</label>
            <textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} rows={3} className={`${inp} resize-none`} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={label}>Cuisine</label>
              <input value={form.cuisine} onChange={e => setForm(f => ({ ...f, cuisine: e.target.value }))} placeholder="e.g. Italian" className={inp} />
            </div>
            <div>
              <label className={label}>Opening Hours</label>
              <input value={form.openingHours} onChange={e => setForm(f => ({ ...f, openingHours: e.target.value }))} placeholder="9 AM – 11 PM" className={inp} />
            </div>
          </div>
        </div>

        {/* Contact */}
        <div className="bg-white rounded-3xl border border-slate-100 shadow-card p-6 space-y-4">
          <h2 className="font-bold text-slate-900">Contact & Location</h2>
          <div>
            <label className={label}>Address</label>
            <input value={form.address} onChange={e => setForm(f => ({ ...f, address: e.target.value }))} className={inp} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={label}>Phone</label>
              <input value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} className={inp} />
            </div>
            <div>
              <label className={label}>Email</label>
              <input type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} className={inp} />
            </div>
          </div>
        </div>

        {/* Delivery Settings */}
        <div className="bg-white rounded-3xl border border-slate-100 shadow-card p-6 space-y-4">
          <h2 className="font-bold text-slate-900">Delivery Settings</h2>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className={label}>Delivery Fee ($)</label>
              <input type="number" min="0" step="0.5" value={form.deliveryFee} onChange={e => setForm(f => ({ ...f, deliveryFee: Number(e.target.value) }))} className={inp} />
            </div>
            <div>
              <label className={label}>Min Order ($)</label>
              <input type="number" min="0" value={form.minOrder} onChange={e => setForm(f => ({ ...f, minOrder: Number(e.target.value) }))} className={inp} />
            </div>
            <div>
              <label className={label}>Prep Time (min)</label>
              <input type="number" min="0" value={form.preparationTime} onChange={e => setForm(f => ({ ...f, preparationTime: Number(e.target.value) }))} className={inp} />
            </div>
          </div>
        </div>

        <button type="submit" disabled={saving}
          className="w-full py-4 bg-slate-900 hover:bg-slate-700 text-white font-bold rounded-2xl text-sm transition-all disabled:opacity-60 flex items-center justify-center gap-2">
          {saving ? (
            <><div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full" style={{ animation: "rotate 0.8s linear infinite" }} />Saving...</>
          ) : "Save Changes"}
        </button>
      </form>
    </div>
  );
};

export default RestaurantProfile;
