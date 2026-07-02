import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const inputCls = "w-full px-4 py-3 rounded-2xl border-2 border-slate-100 bg-white text-slate-900 placeholder-slate-400 text-sm focus:outline-none focus:border-orange-300 transition-all";

const Coupons = ({ url }) => {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ code: "", discountType: "percent", discount: "", minOrder: "", maxUses: "100", expiresAt: "", description: "" });
  const [creating, setCreating] = useState(false);

  const fetchCoupons = async () => {
    setLoading(true);
    try {
      const adminToken = localStorage.getItem("adminToken");
      const res = await axios.get(`${url}/api/coupons/list`, { headers: { token: adminToken } });
      if (res.data.success) setCoupons(res.data.data);
    } catch { toast.error("Failed to load coupons"); }
    setLoading(false);
  };

  const createCoupon = async (e) => {
    e.preventDefault();
    setCreating(true);
    try {
      const adminToken = localStorage.getItem("adminToken");
      const res = await axios.post(`${url}/api/coupons/create`, form, { headers: { token: adminToken } });
      if (res.data.success) { toast.success("Coupon created!"); setShowForm(false); setForm({ code: "", discountType: "percent", discount: "", minOrder: "", maxUses: "100", expiresAt: "", description: "" }); fetchCoupons(); }
      else toast.error(res.data.message);
    } catch { toast.error("Failed to create"); }
    setCreating(false);
  };

  const toggleCoupon = async (id) => {
    try {
      const adminToken = localStorage.getItem("adminToken");
      const res = await axios.patch(`${url}/api/coupons/${id}/toggle`, {}, { headers: { token: adminToken } });
      if (res.data.success) { toast.success(res.data.message); fetchCoupons(); }
    } catch { toast.error("Failed"); }
  };

  const deleteCoupon = async (id) => {
    if (!window.confirm("Delete this coupon?")) return;
    try {
      const adminToken = localStorage.getItem("adminToken");
      const res = await axios.delete(`${url}/api/coupons/${id}`, { headers: { token: adminToken } });
      if (res.data.success) { toast.success("Deleted"); fetchCoupons(); }
    } catch { toast.error("Failed"); }
  };

  useEffect(() => { fetchCoupons(); }, []);

  return (
    <div className="max-w-5xl animate-fadeUp">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-purple-100 flex items-center justify-center text-xl">🎟️</div>
          <div>
            <h1 className="font-display text-2xl font-bold text-slate-900">Coupons</h1>
            <p className="text-slate-400 text-sm">{coupons.length} coupon{coupons.length !== 1 ? 's' : ''}</p>
          </div>
        </div>
        <button onClick={() => setShowForm(f => !f)}
          className="flex items-center gap-2 px-5 py-2.5 btn-primary text-white font-bold rounded-2xl shadow-orange text-sm">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4"/></svg>
          New Coupon
        </button>
      </div>

      {/* Create form */}
      {showForm && (
        <div className="bg-white rounded-3xl border border-slate-100 shadow-card p-6 mb-6 animate-fadeUp">
          <h2 className="font-display font-bold text-lg text-slate-900 mb-5">Create Coupon</h2>
          <form onSubmit={createCoupon} className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1.5">Code *</label>
              <input value={form.code} onChange={e => setForm(f => ({...f, code: e.target.value.toUpperCase()}))} required placeholder="e.g. SAVE20" className={`${inputCls} font-mono`} />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1.5">Type</label>
              <select value={form.discountType} onChange={e => setForm(f => ({...f, discountType: e.target.value}))} className={inputCls}>
                <option value="percent">Percentage (%)</option>
                <option value="fixed">Fixed Amount ($)</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1.5">Discount Value *</label>
              <input type="number" min="1" value={form.discount} onChange={e => setForm(f => ({...f, discount: e.target.value}))} required placeholder={form.discountType === 'percent' ? '20' : '5.00'} className={inputCls} />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1.5">Min Order ($)</label>
              <input type="number" min="0" value={form.minOrder} onChange={e => setForm(f => ({...f, minOrder: e.target.value}))} placeholder="0" className={inputCls} />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1.5">Max Uses</label>
              <input type="number" min="1" value={form.maxUses} onChange={e => setForm(f => ({...f, maxUses: e.target.value}))} className={inputCls} />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1.5">Expires At *</label>
              <input type="datetime-local" value={form.expiresAt} onChange={e => setForm(f => ({...f, expiresAt: e.target.value}))} required className={inputCls} />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1.5">Description</label>
              <input value={form.description} onChange={e => setForm(f => ({...f, description: e.target.value}))} placeholder="e.g. 20% off your first order" className={inputCls} />
            </div>
            <div className="sm:col-span-2 flex gap-3">
              <button type="button" onClick={() => setShowForm(false)} className="flex-1 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-2xl text-sm transition-colors">Cancel</button>
              <button type="submit" disabled={creating} className="flex-1 py-3 btn-primary text-white font-bold rounded-2xl text-sm shadow-orange disabled:opacity-60">
                {creating ? 'Creating...' : 'Create Coupon'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Coupons list */}
      <div className="bg-white rounded-3xl border border-slate-100 shadow-card overflow-hidden">
        <div className="hidden sm:grid grid-cols-[1.5fr_1fr_1fr_1fr_1fr_auto] gap-4 px-6 py-4 bg-slate-50 border-b border-slate-100">
          {["Code", "Discount", "Min Order", "Uses", "Expires", ""].map((h, i) => (
            <span key={i} className="text-xs font-bold text-slate-400 uppercase tracking-widest">{h}</span>
          ))}
        </div>

        {loading ? (
          <div className="p-6 space-y-3">{[1,2,3].map(i => <div key={i} className="h-12 bg-slate-100 rounded-xl animate-pulse"/>)}</div>
        ) : coupons.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-slate-400">
            <span className="text-5xl mb-3">🎟️</span>
            <p className="font-semibold text-slate-700">No coupons yet</p>
            <p className="text-sm mt-1">Create your first promo code</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-50">
            {coupons.map(c => {
              const expired = new Date() > new Date(c.expiresAt);
              return (
                <div key={c._id} className="grid grid-cols-[auto_1fr_auto] sm:grid-cols-[1.5fr_1fr_1fr_1fr_1fr_auto] gap-4 items-center px-6 py-4 hover:bg-slate-50/50 transition-colors">
                  <div>
                    <span className="font-mono font-bold text-slate-900 text-sm">{c.code}</span>
                    {c.description && <p className="text-xs text-slate-400 mt-0.5">{c.description}</p>}
                  </div>
                  <span className="font-bold text-orange-500 text-sm">
                    {c.discount}{c.discountType === 'percent' ? '%' : '$'} off
                  </span>
                  <span className="hidden sm:block text-sm text-slate-600">{c.minOrder > 0 ? `$${c.minOrder}` : 'None'}</span>
                  <span className="hidden sm:block text-sm text-slate-600">{c.usedCount}/{c.maxUses}</span>
                  <span className={`hidden sm:block text-xs font-medium ${expired ? 'text-red-500' : 'text-emerald-600'}`}>
                    {expired ? '⚠️ Expired' : new Date(c.expiresAt).toLocaleDateString()}
                  </span>
                  <div className="flex items-center gap-1 ml-auto sm:ml-0">
                    <button onClick={() => toggleCoupon(c._id)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${c.isActive ? 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}`}>
                      {c.isActive ? 'Active' : 'Inactive'}
                    </button>
                    <button onClick={() => deleteCoupon(c._id)} className="w-8 h-8 rounded-xl flex items-center justify-center text-slate-300 hover:text-red-500 hover:bg-red-50 transition-all">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Coupons;
