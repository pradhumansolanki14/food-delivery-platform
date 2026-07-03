import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const StatusBadge = ({ ok, label }) => (
  <span className={`text-xs font-semibold px-2 py-0.5 rounded-lg border ${ok ? "bg-emerald-50 text-emerald-600 border-emerald-200" : "bg-amber-50 text-amber-600 border-amber-200"}`}>
    {label}
  </span>
);

const Restaurants = ({ url }) => {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All"); // All | Pending | Approved
  const [actioning, setActioning] = useState("");
  const token = localStorage.getItem("adminToken");

  const fetchRestaurants = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${url}/api/admin/restaurant/`, { headers: { token } });
      if (res.data.success) setRestaurants(res.data.data);
      else toast.error("Failed to load restaurants");
    } catch { toast.error("Failed to load restaurants"); }
    setLoading(false);
  };

  useEffect(() => { fetchRestaurants(); }, []);

  const handleApprove = async (r, approved) => {
    setActioning(r._id + (approved ? "_approve" : "_reject"));
    try {
      const res = await axios.post(`${url}/api/admin/vendors/approve`, { vendorId: r.ownerId?._id || r.ownerId, approved }, { headers: { token } });
      if (res.data.success) {
        toast.success(`Restaurant ${approved ? "approved" : "rejected"}`);
        fetchRestaurants();
      } else toast.error(res.data.message);
    } catch { toast.error("Action failed"); }
    setActioning("");
  };

  const handleToggleFeatured = async (r) => {
    setActioning(r._id + "_featured");
    try {
      const res = await axios.patch(`${url}/api/admin/restaurant/${r._id}/featured`, {}, { headers: { token } });
      if (res.data.success) {
        toast.success(`Featured ${res.data.data?.featured ? "enabled" : "disabled"}`);
        fetchRestaurants();
      } else toast.error(res.data.message);
    } catch { toast.error("Action failed"); }
    setActioning("");
  };

  const handleSoftDelete = async (r) => {
    if (!window.confirm(`Deactivate restaurant "${r.name}"? This will set it as unapproved and closed.`)) return;
    setActioning(r._id + "_delete");
    try {
      const res = await axios.delete(`${url}/api/admin/restaurant/${r._id}`, { headers: { token } });
      if (res.data.success) {
        toast.success("Restaurant deactivated");
        fetchRestaurants();
      } else toast.error(res.data.message);
    } catch { toast.error("Action failed"); }
    setActioning("");
  };

  const filtered = restaurants.filter(r => {
    const matchSearch = r.name?.toLowerCase().includes(search.toLowerCase()) || r.ownerId?.email?.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === "All" || (filter === "Approved" && r.isApproved) || (filter === "Pending" && !r.isApproved);
    return matchSearch && matchFilter;
  });

  const stats = {
    total: restaurants.length,
    approved: restaurants.filter(r => r.isApproved).length,
    pending: restaurants.filter(r => !r.isApproved).length,
    featured: restaurants.filter(r => r.featured).length,
  };

  return (
    <div className="max-w-5xl animate-fadeUp">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-orange-100 flex items-center justify-center text-xl">🏪</div>
          <div>
            <h1 className="font-bold text-2xl text-slate-900">Restaurants</h1>
            <p className="text-slate-400 text-sm">{restaurants.length} total restaurants</p>
          </div>
        </div>
        <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-2xl px-4 py-2.5 w-full sm:w-64 focus-within:border-orange-300 transition-colors">
          <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
          <input placeholder="Search name or owner..." value={search} onChange={e => setSearch(e.target.value)} className="flex-1 bg-transparent text-sm text-slate-700 placeholder-slate-400 outline-none" />
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        {[
          { label: "Total", value: stats.total, icon: "🏪", color: "bg-blue-50 border-blue-100" },
          { label: "Approved", value: stats.approved, icon: "✅", color: "bg-emerald-50 border-emerald-100" },
          { label: "Pending", value: stats.pending, icon: "⏳", color: "bg-amber-50 border-amber-100" },
          { label: "Featured", value: stats.featured, icon: "⭐", color: "bg-orange-50 border-orange-100" },
        ].map((s, i) => (
          <div key={i} className={`bg-white rounded-2xl border shadow-card p-4 ${s.color}`}>
            <div className="flex items-center gap-2.5">
              <span className="text-2xl">{s.icon}</span>
              <div>
                <p className="text-xl font-bold text-slate-900">{s.value}</p>
                <p className="text-xs text-slate-400">{s.label}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Filter tabs */}
      <div className="flex items-center gap-2 mb-5">
        {["All", "Approved", "Pending"].map(f => (
          <button key={f} onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${filter === f ? "bg-slate-900 text-white" : "bg-white border border-slate-200 text-slate-500 hover:border-slate-300"}`}>
            {f}
          </button>
        ))}
        <button onClick={fetchRestaurants} className="ml-auto flex items-center gap-1.5 px-3 py-2 bg-white border border-slate-200 hover:border-orange-300 text-slate-600 hover:text-orange-500 text-xs font-semibold rounded-xl transition-all">
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/></svg>
          Refresh
        </button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-3xl border border-slate-100 shadow-card overflow-hidden">
        {loading ? (
          <div className="p-6 space-y-3">{[1,2,3,4].map(i => <div key={i} className="h-16 bg-slate-100 rounded-xl animate-pulse"/>)}</div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-slate-400">
            <span className="text-5xl mb-3">🏪</span>
            <p className="font-semibold text-slate-700">No restaurants found</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-50">
            {filtered.map(r => {
              const isActioning = actioning.startsWith(r._id);
              return (
                <div key={r._id} className="p-5 hover:bg-slate-50/50 transition-colors">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                    {/* Logo + info */}
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      {r.logo ? (
                        <img src={`${url}/images/${r.logo}`} alt={r.name} className="w-12 h-12 rounded-2xl object-cover flex-shrink-0 border border-slate-100" />
                      ) : (
                        <div className="w-12 h-12 rounded-2xl bg-orange-100 flex items-center justify-center text-2xl flex-shrink-0">🏪</div>
                      )}
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <p className="font-bold text-slate-900 truncate">{r.name}</p>
                          {r.featured && <span className="text-xs bg-amber-50 text-amber-600 border border-amber-200 font-semibold px-2 py-0.5 rounded-lg">⭐ Featured</span>}
                        </div>
                        <p className="text-xs text-slate-400 truncate mt-0.5">{r.ownerId?.email || "No owner email"}</p>
                        <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                          <StatusBadge ok={r.isApproved} label={r.isApproved ? "Approved" : "Pending"} />
                          <StatusBadge ok={r.isOpen} label={r.isOpen ? "Open" : "Closed"} />
                          {r.cuisine && <span className="text-xs text-slate-400 bg-slate-50 px-2 py-0.5 rounded-lg border border-slate-100">{r.cuisine}</span>}
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2 flex-wrap">
                      {!r.isApproved ? (
                        <>
                          <button disabled={isActioning} onClick={() => handleApprove(r, true)}
                            className="px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-semibold rounded-xl text-xs transition-all disabled:opacity-50">
                            ✓ Approve
                          </button>
                          <button disabled={isActioning} onClick={() => handleApprove(r, false)}
                            className="px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-600 font-semibold rounded-xl text-xs transition-all disabled:opacity-50">
                            ✗ Reject
                          </button>
                        </>
                      ) : (
                        <button disabled={isActioning} onClick={() => handleApprove(r, false)}
                          className="px-3 py-1.5 bg-amber-50 hover:bg-amber-100 text-amber-700 font-semibold rounded-xl text-xs transition-all disabled:opacity-50">
                          Revoke
                        </button>
                      )}
                      <button disabled={isActioning} onClick={() => handleToggleFeatured(r)}
                        className={`px-3 py-1.5 font-semibold rounded-xl text-xs transition-all disabled:opacity-50 ${r.featured ? "bg-amber-100 text-amber-700 hover:bg-amber-200" : "bg-slate-100 text-slate-600 hover:bg-slate-200"}`}>
                        {r.featured ? "★ Unfeature" : "☆ Feature"}
                      </button>
                      <button disabled={isActioning} onClick={() => handleSoftDelete(r)}
                        className="w-8 h-8 rounded-xl bg-slate-100 hover:bg-red-50 hover:text-red-500 flex items-center justify-center text-slate-400 transition-all disabled:opacity-50">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
                      </button>
                    </div>
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

export default Restaurants;
