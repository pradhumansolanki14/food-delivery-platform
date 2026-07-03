import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const EMOJI_OPTIONS = ["🍝","🥡","🍛","🍔","🌮","🍱","🍜","🥙","🍕","🥩","🍣","🍤","🥗","🌯","🍲","🫕","🧆","🥘","🍖","🫔"];

const inp = "w-full px-4 py-3 rounded-2xl border-2 border-slate-100 bg-white text-slate-900 text-sm focus:outline-none focus:border-orange-300 transition-all";

const Cuisines = ({ url }) => {
  const [cuisines, setCuisines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null); // cuisine object being edited
  const [form, setForm] = useState({ name: "", icon: "🍽️" });
  const [saving, setSaving] = useState(false);
  const token = localStorage.getItem("adminToken");

  const fetchCuisines = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${url}/api/cuisines`);
      if (res.data.success) setCuisines(res.data.data);
    } catch { toast.error("Failed to load cuisines"); }
    setLoading(false);
  };

  useEffect(() => { fetchCuisines(); }, []);

  const openAdd = () => { setEditing(null); setForm({ name: "", icon: "🍽️" }); setShowForm(true); };
  const openEdit = (c) => { setEditing(c); setForm({ name: c.name, icon: c.icon || "🍽️" }); setShowForm(true); };
  const closeForm = () => { setShowForm(false); setEditing(null); };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!form.name.trim()) return;
    setSaving(true);
    try {
      let res;
      if (editing) {
        res = await axios.put(`${url}/api/cuisines/${editing._id}`, form, { headers: { token } });
      } else {
        res = await axios.post(`${url}/api/cuisines`, form, { headers: { token } });
      }
      if (res.data.success) {
        toast.success(editing ? "Cuisine updated" : "Cuisine created");
        closeForm();
        fetchCuisines();
      } else {
        toast.error(res.data.message || "Error");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Request failed");
    }
    setSaving(false);
  };

  const handleDelete = async (c) => {
    if (!window.confirm(`Delete cuisine "${c.name}"? This will fail if any restaurant uses it.`)) return;
    try {
      const res = await axios.delete(`${url}/api/cuisines/${c._id}`, { headers: { token } });
      if (res.data.success) {
        toast.success("Cuisine deleted");
        fetchCuisines();
      } else {
        toast.error(res.data.message || "Cannot delete");
      }
    } catch (err) {
      const msg = err.response?.data?.message || "Delete failed";
      if (err.response?.status === 409) toast.error("Cannot delete: cuisine is used by existing restaurants");
      else toast.error(msg);
    }
  };

  return (
    <div className="max-w-3xl animate-fadeUp">
      {/* Modal form */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: "rgba(15,23,42,0.5)", backdropFilter: "blur(4px)" }} onClick={e => e.target === e.currentTarget && closeForm()}>
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden animate-fadeUp">
            <div className="h-1.5 w-full bg-gradient-to-r from-orange-400 to-orange-600" />
            <div className="p-6">
              <div className="flex items-center justify-between mb-5">
                <h2 className="font-bold text-xl text-slate-900">{editing ? "Edit Cuisine" : "Add Cuisine"}</h2>
                <button onClick={closeForm} className="w-8 h-8 rounded-xl bg-slate-100 flex items-center justify-center text-slate-500 hover:bg-slate-200">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/></svg>
                </button>
              </div>
              <form onSubmit={handleSave} className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1.5 block">Name *</label>
                  <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="e.g. Italian" required className={inp} />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1.5 block">Icon</label>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-3xl w-10 h-10 flex items-center justify-center bg-slate-50 rounded-xl">{form.icon}</span>
                    <input value={form.icon} onChange={e => setForm(f => ({ ...f, icon: e.target.value }))} placeholder="Emoji or text" className={`${inp} flex-1`} />
                  </div>
                  <div className="grid grid-cols-10 gap-1.5">
                    {EMOJI_OPTIONS.map(em => (
                      <button key={em} type="button" onClick={() => setForm(f => ({ ...f, icon: em }))}
                        className={`w-8 h-8 rounded-xl text-base flex items-center justify-center transition-all ${form.icon === em ? 'bg-orange-100 ring-2 ring-orange-400' : 'bg-slate-50 hover:bg-slate-100'}`}>
                        {em}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="flex gap-3 pt-2">
                  <button type="button" onClick={closeForm} className="flex-1 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-2xl text-sm transition-all">Cancel</button>
                  <button type="submit" disabled={saving} className="flex-1 py-3 bg-slate-900 hover:bg-slate-700 text-white font-bold rounded-2xl text-sm transition-all disabled:opacity-60">
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
          <div className="w-10 h-10 rounded-2xl bg-orange-100 flex items-center justify-center text-xl">🍽️</div>
          <div>
            <h1 className="font-bold text-2xl text-slate-900">Cuisines</h1>
            <p className="text-slate-400 text-sm">{cuisines.length} active cuisine{cuisines.length !== 1 ? "s" : ""}</p>
          </div>
        </div>
        <button onClick={openAdd} className="flex items-center gap-2 px-5 py-2.5 bg-slate-900 hover:bg-slate-700 text-white font-bold rounded-2xl text-sm transition-all">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4"/></svg>
          Add Cuisine
        </button>
      </div>

      {/* Grid */}
      {loading ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1,2,3,4,5,6].map(i => <div key={i} className="h-24 bg-white rounded-3xl border border-slate-100 animate-pulse" />)}
        </div>
      ) : cuisines.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 bg-white rounded-3xl border border-slate-100">
          <span className="text-5xl mb-3">🍽️</span>
          <p className="font-semibold text-slate-700">No cuisines yet</p>
          <p className="text-sm text-slate-400 mt-1">Click "Add Cuisine" to get started</p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {cuisines.map(c => (
            <div key={c._id} className="bg-white rounded-3xl border border-slate-100 shadow-card p-5 flex items-center justify-between group hover:border-orange-200 transition-all">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-orange-50 flex items-center justify-center text-2xl">{c.icon || "🍽️"}</div>
                <div>
                  <p className="font-bold text-slate-900">{c.name}</p>
                  <span className={`text-xs font-semibold px-2 py-0.5 rounded-lg ${c.isActive ? "bg-emerald-50 text-emerald-600" : "bg-slate-100 text-slate-500"}`}>
                    {c.isActive ? "Active" : "Inactive"}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button onClick={() => openEdit(c)} className="w-8 h-8 rounded-xl bg-slate-100 hover:bg-orange-50 hover:text-orange-500 flex items-center justify-center text-slate-500 transition-all">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/></svg>
                </button>
                <button onClick={() => handleDelete(c)} className="w-8 h-8 rounded-xl bg-slate-100 hover:bg-red-50 hover:text-red-500 flex items-center justify-center text-slate-500 transition-all">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Cuisines;
