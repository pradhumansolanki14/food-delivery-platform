import React, { useContext, useEffect, useState } from "react";
import { StoreContext } from "../../context/StoreContext";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const statusConfig = {
  "Food Processing": { badge: "bg-amber-50 text-amber-600 border border-amber-200", dot: "bg-amber-400", icon: "👨‍🍳", bar: "w-1/3 bg-amber-400" },
  "Out for Delivery": { badge: "bg-blue-50 text-blue-600 border border-blue-200", dot: "bg-blue-400", icon: "🛵", bar: "w-2/3 bg-blue-400" },
  "Delivered": { badge: "bg-emerald-50 text-emerald-600 border border-emerald-200", dot: "bg-emerald-400", icon: "✅", bar: "w-full bg-emerald-400" },
};

const MyOrders = () => {
  const { url, token, SetCartItems } = useContext(StoreContext);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchOrders = async () => {
    setLoading(true);
    const response = await axios.post(url + "/api/order/userorders", {}, { headers: { token } });
    setData(response.data.data);
    setLoading(false);
  };

  useEffect(() => { if (token) fetchOrders(); }, [token]);

  const getStatus = (status) => statusConfig[status] || {
    badge: "bg-slate-100 text-slate-600 border border-slate-200",
    dot: "bg-slate-400", icon: "📦", bar: "w-0 bg-slate-400",
  };

  const handleOrderAgain = async (order) => {
    const newCart = {};
    order.items.forEach(item => { if (item._id) newCart[item._id] = item.quantity || 1 });
    SetCartItems(prev => ({ ...prev, ...newCart }));
    try {
      for (const item of order.items) {
        if (item._id) {
          for (let i = 0; i < (item.quantity || 1); i++) {
            await axios.post(url + '/api/cart/add', { itemId: item._id }, { headers: { token } });
          }
        }
      }
    } catch { /* silent — local state already updated */ }
    navigate('/cart');
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="bg-white border-b border-slate-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center gap-3">
            <button onClick={() => navigate("/")} className="w-9 h-9 rounded-xl bg-slate-100 hover:bg-slate-200 flex items-center justify-center transition-colors">
              <svg className="w-5 h-5 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <div>
              <h1 className="font-display text-2xl font-bold text-slate-900">My Orders</h1>
              <p className="text-slate-400 text-sm">{data.length} order{data.length !== 1 ? 's' : ''} total</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading ? (
          <div className="space-y-4">
            {[1,2,3].map(i => (
              <div key={i} className="bg-white rounded-3xl border border-slate-100 p-6 animate-pulse">
                <div className="flex gap-4"><div className="w-16 h-16 bg-slate-200 rounded-2xl"/><div className="flex-1 space-y-2"><div className="h-4 bg-slate-200 rounded-lg w-3/4"/><div className="h-3 bg-slate-100 rounded-lg w-1/2"/></div></div>
              </div>
            ))}
          </div>
        ) : data.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-28">
            <div className="w-28 h-28 rounded-4xl bg-orange-50 flex items-center justify-center text-6xl mb-6">📦</div>
            <h2 className="font-display text-2xl font-bold text-slate-900 mb-2">No orders yet</h2>
            <p className="text-slate-400 text-sm mb-8 text-center max-w-xs">You haven't placed any orders yet. Start exploring our menu!</p>
            <button onClick={() => navigate("/")} className="flex items-center gap-2 px-8 py-4 btn-primary text-white font-bold rounded-2xl shadow-orange">Browse Menu</button>
          </div>
        ) : (
          <div className="space-y-4">
            {data.map((order, index) => {
              const s = getStatus(order.status);
              return (
                <div key={index} className="bg-white rounded-3xl border border-slate-100 shadow-sm hover:shadow-card transition-all duration-300 overflow-hidden animate-fadeUp">
                  {/* Progress bar */}
                  <div className="h-1 w-full bg-slate-100">
                    <div className={`h-full transition-all duration-500 rounded-full ${s.bar}`} />
                  </div>

                  <div className="p-5 sm:p-6">
                    <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                      <div className="w-14 h-14 rounded-2xl bg-orange-50 flex items-center justify-center text-2xl flex-shrink-0">
                        {s.icon}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-start justify-between gap-3 mb-3">
                          <div>
                            <p className="text-sm font-semibold text-slate-700 leading-relaxed line-clamp-2 max-w-sm">
                              {order.items.map((item, i) => (
                                <span key={i}>{item.name} ×{item.quantity}{i < order.items.length - 1 ? ", " : ""}</span>
                              ))}
                            </p>
                            <p className="text-xs text-slate-400 mt-1">{order.items.length} item{order.items.length > 1 ? 's' : ''}</p>
                          </div>
                          <p className="font-display font-bold text-xl text-slate-900 flex-shrink-0">${order.amount}.00</p>
                        </div>

                        <div className="flex flex-wrap items-center gap-2">
                          {/* Status badge */}
                          <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold ${s.badge}`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${s.dot} animate-pulse`} />
                            {order.status}
                          </span>

                          {/* View details */}
                          <button
                            onClick={() => navigate(`/order/${order._id}`)}
                            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-600 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl transition-all"
                          >
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/></svg>
                            Details
                          </button>

                          {/* Refresh */}
                          <button
                            onClick={fetchOrders}
                            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-600 bg-slate-50 hover:bg-orange-50 hover:text-orange-500 border border-slate-200 hover:border-orange-200 rounded-xl transition-all"
                          >
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/></svg>
                            Track
                          </button>

                          {/* Order Again — only for delivered */}
                          {order.status === "Delivered" && (
                            <button
                              onClick={() => handleOrderAgain(order)}
                              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white btn-primary rounded-xl shadow-orange transition-all"
                            >
                              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/></svg>
                              Order Again
                            </button>
                          )}
                        </div>
                      </div>
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

export default MyOrders;
