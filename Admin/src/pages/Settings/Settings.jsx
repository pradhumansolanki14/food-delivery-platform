import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const inputCls = "w-full px-4 py-3.5 rounded-2xl border-2 border-slate-100 bg-white text-slate-900 placeholder-slate-400 text-sm focus:outline-none focus:border-orange-300 transition-all";

const Settings = ({ url }) => {
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const adminToken = localStorage.getItem("adminToken");

  const fetchSettings = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${url}/api/settings`);
      if (res.data.success) setSettings(res.data.data);
    } catch { toast.error("Failed to load settings"); }
    setLoading(false);
  };

  const saveSettings = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await axios.put(`${url}/api/settings`, settings, { headers: { token: adminToken } });
      if (res.data.success) { toast.success("Settings saved!"); setSettings(res.data.data); }
      else toast.error(res.data.message);
    } catch { toast.error("Failed to save"); }
    setSaving(false);
  };

  useEffect(() => { fetchSettings(); }, []);

  if (loading) return (
    <div className="max-w-3xl space-y-5">
      {[1,2,3].map(i => <div key={i} className="h-40 bg-white rounded-3xl border border-slate-100 animate-pulse"/>)}
    </div>
  );

  return (
    <div className="max-w-3xl animate-fadeUp">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 rounded-2xl bg-slate-100 flex items-center justify-center text-xl">⚙️</div>
        <div>
          <h1 className="font-display text-2xl font-bold text-slate-900">Settings</h1>
          <p className="text-slate-400 text-sm">Manage your restaurant configuration</p>
        </div>
      </div>

      <form onSubmit={saveSettings} className="space-y-5">
        {/* Restaurant Info */}
        <div className="bg-white rounded-3xl border border-slate-100 shadow-card p-6 space-y-4">
          <h2 className="font-display font-bold text-lg text-slate-900 flex items-center gap-2">
            <span>🏪</span> Restaurant Info
          </h2>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1.5">Restaurant Name</label>
              <input value={settings.restaurantName || ""} onChange={e => setSettings(s => ({...s, restaurantName: e.target.value}))} className={inputCls} placeholder="Tomato" />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1.5">Phone</label>
              <input value={settings.phone || ""} onChange={e => setSettings(s => ({...s, phone: e.target.value}))} className={inputCls} placeholder="+1-000-000-0000" />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1.5">Email</label>
              <input type="email" value={settings.email || ""} onChange={e => setSettings(s => ({...s, email: e.target.value}))} className={inputCls} placeholder="contact@tomato.com" />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1.5">Opening Hours</label>
              <input value={settings.openingHours || ""} onChange={e => setSettings(s => ({...s, openingHours: e.target.value}))} className={inputCls} placeholder="9:00 AM - 11:00 PM" />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1.5">Address</label>
              <input value={settings.address || ""} onChange={e => setSettings(s => ({...s, address: e.target.value}))} className={inputCls} placeholder="123 Food Street..." />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1.5">About Us</label>
              <textarea value={settings.aboutUs || ""} onChange={e => setSettings(s => ({...s, aboutUs: e.target.value}))} rows={3} className={`${inputCls} resize-none`} placeholder="Describe your restaurant..." />
            </div>
          </div>
        </div>

        {/* Delivery Settings */}
        <div className="bg-white rounded-3xl border border-slate-100 shadow-card p-6 space-y-4">
          <h2 className="font-display font-bold text-lg text-slate-900 flex items-center gap-2">
            <span>🛵</span> Delivery Settings
          </h2>
          <div className="grid sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1.5">Delivery Fee ($)</label>
              <input type="number" min="0" step="0.5" value={settings.deliveryFee ?? ""} onChange={e => setSettings(s => ({...s, deliveryFee: parseFloat(e.target.value)}))} className={inputCls} placeholder="2" />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1.5">Min Order ($)</label>
              <input type="number" min="0" value={settings.minOrder ?? ""} onChange={e => setSettings(s => ({...s, minOrder: parseFloat(e.target.value)}))} className={inputCls} placeholder="0" />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1.5">Currency</label>
              <select value={settings.currency || "USD"} onChange={e => setSettings(s => ({...s, currency: e.target.value}))} className={inputCls}>
                <option value="USD">USD ($)</option>
                <option value="EUR">EUR (€)</option>
                <option value="GBP">GBP (£)</option>
                <option value="INR">INR (₹)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Restaurant Status */}
        <div className="bg-white rounded-3xl border border-slate-100 shadow-card p-6">
          <h2 className="font-display font-bold text-lg text-slate-900 flex items-center gap-2 mb-4">
            <span>🔆</span> Restaurant Status
          </h2>
          <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
            <div>
              <p className="font-semibold text-slate-900">Restaurant Open</p>
              <p className="text-xs text-slate-400 mt-0.5">Toggle to close your restaurant for new orders</p>
            </div>
            <button
              type="button"
              onClick={() => setSettings(s => ({...s, isOpen: !s.isOpen}))}
              className={`relative w-14 h-7 rounded-full transition-colors duration-300 ${settings.isOpen ? 'bg-emerald-500' : 'bg-slate-300'}`}
            >
              <div className={`absolute top-0.5 w-6 h-6 bg-white rounded-full shadow-md transition-all duration-300 ${settings.isOpen ? 'left-7' : 'left-0.5'}`} />
            </button>
          </div>
          <div className={`mt-3 flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold ${settings.isOpen ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700'}`}>
            <div className={`w-2 h-2 rounded-full ${settings.isOpen ? 'bg-emerald-400 animate-pulse' : 'bg-red-400'}`} />
            {settings.isOpen ? 'Restaurant is currently OPEN' : 'Restaurant is currently CLOSED'}
          </div>
        </div>

        <button type="submit" disabled={saving}
          className="w-full py-4 btn-primary text-white font-bold rounded-2xl shadow-orange text-sm flex items-center justify-center gap-2 disabled:opacity-60">
          {saving ? (
            <><div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full" style={{ animation: 'rotate 0.8s linear infinite' }} />Saving...</>
          ) : (
            <><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7"/></svg>Save Settings</>
          )}
        </button>
      </form>
    </div>
  );
};

export default Settings;
