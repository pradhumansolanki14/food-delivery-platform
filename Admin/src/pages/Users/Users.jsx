import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const Users = ({ url }) => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState(null);
  const [userDetail, setUserDetail] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);

  const adminToken = localStorage.getItem("adminToken");

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${url}/api/admin/users`, { headers: { token: adminToken } });
      if (res.data.success) setUsers(res.data.data);
    } catch { toast.error("Failed to load users"); }
    setLoading(false);
  };

  const fetchUserDetail = async (id) => {
    setDetailLoading(true);
    try {
      const res = await axios.get(`${url}/api/admin/users/${id}`, { headers: { token: adminToken } });
      if (res.data.success) setUserDetail(res.data.data);
    } catch {}
    setDetailLoading(false);
  };

  const openUser = (user) => {
    setSelected(user);
    fetchUserDetail(user._id);
  };

  useEffect(() => { fetchUsers(); }, []);

  const filtered = users.filter(u =>
    u.name?.toLowerCase().includes(search.toLowerCase()) ||
    u.email?.toLowerCase().includes(search.toLowerCase())
  );

  const stats = {
    total: users.length,
    totalRevenue: users.reduce((a, b) => a + (b.totalSpent || 0), 0),
    totalOrders: users.reduce((a, b) => a + (b.orderCount || 0), 0),
  };

  return (
    <div className="max-w-5xl animate-fadeUp">
      {/* User detail modal */}
      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: "rgba(15,23,42,0.6)", backdropFilter: "blur(4px)" }} onClick={e => e.target === e.currentTarget && setSelected(null)}>
          <div className="bg-white rounded-4xl shadow-2xl w-full max-w-xl overflow-hidden animate-fadeUp max-h-[90vh] overflow-y-auto">
            <div className="h-1.5 w-full" style={{ background: "linear-gradient(135deg, #f97316, #ea580c)" }} />
            <div className="p-6">
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center text-white font-bold text-xl">
                    {selected.name?.charAt(0)?.toUpperCase()}
                  </div>
                  <div>
                    <h2 className="font-display font-bold text-xl text-slate-900">{selected.name}</h2>
                    <p className="text-xs text-slate-400">{selected.email}</p>
                  </div>
                </div>
                <button onClick={() => setSelected(null)} className="w-8 h-8 rounded-xl bg-slate-100 flex items-center justify-center text-slate-500">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/></svg>
                </button>
              </div>

              <div className="grid grid-cols-3 gap-3 mb-5">
                {[
                  { label: "Orders", value: selected.orderCount || 0, icon: "📦" },
                  { label: "Total Spent", value: `$${(selected.totalSpent || 0).toFixed(0)}`, icon: "💰" },
                  { label: "Phone", value: selected.phone || "N/A", icon: "📞" },
                ].map((s, i) => (
                  <div key={i} className="p-3 bg-slate-50 rounded-2xl text-center">
                    <p className="text-lg">{s.icon}</p>
                    <p className="font-bold text-slate-900 text-sm">{s.value}</p>
                    <p className="text-xs text-slate-400">{s.label}</p>
                  </div>
                ))}
              </div>

              {detailLoading ? (
                <div className="space-y-2">{[1,2,3].map(i => <div key={i} className="h-12 bg-slate-100 rounded-xl animate-pulse"/>)}</div>
              ) : userDetail?.orders?.length > 0 ? (
                <div>
                  <h3 className="font-display font-bold text-slate-900 mb-3">Order History</h3>
                  <div className="space-y-2 max-h-60 overflow-y-auto scrollbar-hide">
                    {userDetail.orders.map((order, i) => {
                      const statusColors = { "Food Processing": "text-amber-600", "Out for Delivery": "text-blue-600", "Delivered": "text-emerald-600" };
                      return (
                        <div key={i} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                          <div>
                            <p className="text-xs font-semibold text-slate-700">{order.items?.map(it => it.name).join(", ")}</p>
                            <p className="text-xs text-slate-400 mt-0.5">{new Date(order.date).toLocaleDateString()}</p>
                          </div>
                          <div className="text-right">
                            <p className="font-bold text-slate-900 text-sm">${order.amount}</p>
                            <p className={`text-xs font-semibold ${statusColors[order.status] || 'text-slate-500'}`}>{order.status}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ) : (
                <p className="text-sm text-slate-400 text-center py-4">No orders yet</p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-blue-100 flex items-center justify-center text-xl">👥</div>
          <div>
            <h1 className="font-display text-2xl font-bold text-slate-900">Users</h1>
            <p className="text-slate-400 text-sm">{users.length} registered user{users.length !== 1 ? 's' : ''}</p>
          </div>
        </div>
        <div className="flex items-center gap-3 bg-white border border-slate-200 rounded-2xl px-4 py-2.5 w-full sm:w-64 focus-within:border-orange-300 transition-colors">
          <svg className="w-4 h-4 text-slate-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
          <input type="text" placeholder="Search users..." value={search} onChange={e => setSearch(e.target.value)} className="flex-1 bg-transparent text-sm text-slate-700 placeholder-slate-400 outline-none" />
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {[
          { label: "Total Users", value: stats.total, icon: "👥", color: "bg-blue-50 border-blue-100" },
          { label: "Total Orders", value: stats.totalOrders, icon: "📦", color: "bg-orange-50 border-orange-100" },
          { label: "Total Revenue", value: `$${stats.totalRevenue.toFixed(0)}`, icon: "💰", color: "bg-emerald-50 border-emerald-100" },
        ].map((s, i) => (
          <div key={i} className={`bg-white rounded-2xl border shadow-card p-4 ${s.color}`}>
            <div className="flex items-center gap-3">
              <span className="text-2xl">{s.icon}</span>
              <div>
                <p className="text-xl font-display font-bold text-slate-900">{s.value}</p>
                <p className="text-xs text-slate-400">{s.label}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Table */}
      <div className="bg-white rounded-3xl border border-slate-100 shadow-card overflow-hidden">
        <div className="hidden sm:grid grid-cols-[2fr_2fr_1fr_1fr_auto] gap-4 px-6 py-4 bg-slate-50 border-b border-slate-100">
          {["Name", "Email", "Orders", "Total Spent", ""].map((h, i) => (
            <span key={i} className="text-xs font-bold text-slate-400 uppercase tracking-widest">{h}</span>
          ))}
        </div>

        {loading ? (
          <div className="p-6 space-y-3">{[1,2,3,4].map(i => <div key={i} className="h-14 bg-slate-100 rounded-xl animate-pulse"/>)}</div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-slate-400">
            <span className="text-5xl mb-3">👥</span>
            <p className="font-semibold text-slate-700">{search ? 'No users found' : 'No users yet'}</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-50">
            {filtered.map((user) => (
              <div key={user._id} className="grid grid-cols-[auto_1fr_auto] sm:grid-cols-[2fr_2fr_1fr_1fr_auto] gap-4 items-center px-6 py-4 hover:bg-slate-50/50 transition-colors cursor-pointer group" onClick={() => openUser(user)}>
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-orange-100 to-orange-200 flex items-center justify-center font-bold text-orange-600 text-sm flex-shrink-0">
                    {user.name?.charAt(0)?.toUpperCase()}
                  </div>
                  <div className="min-w-0">
                    <p className="font-semibold text-slate-900 text-sm truncate group-hover:text-orange-500 transition-colors">{user.name}</p>
                    <p className="sm:hidden text-xs text-slate-400 truncate">{user.email}</p>
                  </div>
                </div>
                <p className="hidden sm:block text-sm text-slate-500 truncate">{user.email}</p>
                <span className="hidden sm:flex items-center justify-center w-8 h-8 bg-slate-100 rounded-xl text-sm font-bold text-slate-700">{user.orderCount || 0}</span>
                <p className="hidden sm:block font-bold text-emerald-600 text-sm">${(user.totalSpent || 0).toFixed(0)}</p>
                <svg className="w-4 h-4 text-slate-300 group-hover:text-orange-400 ml-auto sm:ml-0 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7"/></svg>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Users;
