import React, { useContext, useState } from "react";
import { StoreContext } from "../../context/StoreContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Cart = () => {
  const { cartItems, food_list, removeFromCart, getTotalCartAmount, url, token } = useContext(StoreContext);
  const navigate = useNavigate();
  const cartFoods = food_list.filter(item => cartItems[item._id] > 0);
  const subtotal = getTotalCartAmount();
  const delivery = subtotal === 0 ? 0 : 2;

  // ─── Coupon state ────────────────────────────────────────────
  const [couponCode, setCouponCode] = useState("");
  const [coupon, setCoupon] = useState(null);   // { discount, code, message }
  const [couponLoading, setCouponLoading] = useState(false);
  const [couponError, setCouponError] = useState("");

  const applyCoupon = async () => {
    if (!couponCode.trim()) return;
    if (!token) { setCouponError("Sign in to apply a promo code"); return; }
    setCouponLoading(true);
    setCouponError("");
    setCoupon(null);
    try {
      const res = await axios.post(`${url}/api/coupons/validate`, { code: couponCode, cartAmount: subtotal }, { headers: { token } });
      if (res.data.success) {
        setCoupon(res.data);
      } else {
        setCouponError(res.data.message);
      }
    } catch { setCouponError("Failed to validate code"); }
    setCouponLoading(false);
  };

  const removeCoupon = () => { setCoupon(null); setCouponCode(""); setCouponError(""); };

  const discount = coupon ? coupon.discount : 0;
  const total = subtotal + delivery - discount;

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Page Header */}
      <div className="bg-white border-b border-slate-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center gap-3">
            <button onClick={() => navigate("/")} className="w-9 h-9 rounded-xl bg-slate-100 hover:bg-slate-200 flex items-center justify-center transition-colors">
              <svg className="w-5 h-5 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <div>
              <h1 className="font-display text-2xl font-bold text-slate-900">Your Cart</h1>
              <p className="text-slate-400 text-sm mt-0.5">
                {cartFoods.length === 0 ? "Empty" : `${cartFoods.length} item${cartFoods.length > 1 ? 's' : ''}`}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {cartFoods.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-28">
            <div className="w-28 h-28 rounded-4xl bg-orange-50 flex items-center justify-center text-6xl mb-6">🛒</div>
            <h2 className="font-display text-2xl font-bold text-slate-900 mb-2">Your cart is empty</h2>
            <p className="text-slate-400 text-sm mb-8 text-center max-w-xs">Looks like you haven't added any delicious items yet.</p>
            <button onClick={() => navigate("/")} className="flex items-center gap-2 px-8 py-4 btn-primary text-white font-bold rounded-2xl shadow-orange">Browse Menu</button>
          </div>
        ) : (
          <div className="flex flex-col xl:flex-row gap-8 items-start">
            {/* Cart Items */}
            <div className="flex-1 w-full space-y-3">
              {cartFoods.map((item) => (
                <div key={item._id} className="bg-white rounded-3xl border border-slate-100 shadow-sm hover:shadow-card transition-all duration-300 p-4 sm:p-5 group animate-fadeUp">
                  <div className="flex items-center gap-4">
                    <div className="relative w-20 h-20 rounded-2xl overflow-hidden flex-shrink-0">
                      <img src={`${url}/images/${item.image}`} alt={item.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-display font-bold text-slate-900 text-base truncate mb-0.5">{item.name}</h3>
                      <p className="text-xs text-slate-400 mb-2">Per serving</p>
                      <div className="flex items-center gap-2">
                        <span className="text-base font-bold text-slate-900">${item.price}</span>
                        <span className="text-slate-300">×</span>
                        <span className="px-2 py-0.5 bg-slate-100 text-slate-700 text-xs font-semibold rounded-lg">{cartItems[item._id]}</span>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-3">
                      <span className="font-display font-bold text-lg text-slate-900">${(item.price * cartItems[item._id]).toFixed(2)}</span>
                      <button onClick={() => removeFromCart(item._id)} className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-red-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all">
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              ))}

              {/* Promo code */}
              <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-5">
                <p className="text-sm font-semibold text-slate-700 mb-3 flex items-center gap-2">
                  <span className="text-lg">🎟️</span> Have a promo code?
                </p>
                {coupon ? (
                  <div className="flex items-center justify-between p-3 bg-emerald-50 border border-emerald-200 rounded-2xl">
                    <div>
                      <p className="text-sm font-bold text-emerald-700">{coupon.message}</p>
                      <p className="text-xs text-emerald-600 mt-0.5">Code: <span className="font-mono font-bold">{coupon.code}</span></p>
                    </div>
                    <button onClick={removeCoupon} className="text-emerald-500 hover:text-red-500 transition-colors">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/></svg>
                    </button>
                  </div>
                ) : (
                  <>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={couponCode}
                        onChange={e => { setCouponCode(e.target.value.toUpperCase()); setCouponError(""); }}
                        onKeyDown={e => e.key === 'Enter' && applyCoupon()}
                        placeholder="Enter promo code"
                        className="flex-1 px-4 py-3 bg-slate-50 border-2 border-slate-100 rounded-2xl text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-orange-300 transition-all font-mono"
                      />
                      <button onClick={applyCoupon} disabled={couponLoading || !couponCode.trim()}
                        className="px-5 py-3 bg-slate-900 hover:bg-slate-700 text-white font-semibold rounded-2xl text-sm transition-all disabled:opacity-50">
                        {couponLoading ? '...' : 'Apply'}
                      </button>
                    </div>
                    {couponError && <p className="text-xs text-red-500 mt-2 font-medium">{couponError}</p>}
                  </>
                )}
              </div>
            </div>

            {/* Summary */}
            <div className="w-full xl:w-96 flex-shrink-0 sticky top-24">
              <div className="bg-white rounded-3xl border border-slate-100 shadow-card overflow-hidden">
                <div className="px-6 pt-6 pb-4 border-b border-slate-50">
                  <h3 className="font-display font-bold text-xl text-slate-900">Order Summary</h3>
                </div>
                <div className="px-6 py-4 border-b border-slate-50 space-y-3 max-h-52 overflow-y-auto scrollbar-hide">
                  {cartFoods.map((item) => (
                    <div key={item._id} className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-2.5">
                        <span className="w-5 h-5 rounded-full bg-orange-100 text-orange-500 text-xs font-bold flex items-center justify-center flex-shrink-0">{cartItems[item._id]}</span>
                        <span className="text-sm text-slate-700 truncate max-w-[140px]">{item.name}</span>
                      </div>
                      <span className="text-sm font-semibold text-slate-900 flex-shrink-0">${(item.price * cartItems[item._id]).toFixed(2)}</span>
                    </div>
                  ))}
                </div>
                <div className="px-6 py-4 space-y-3">
                  <div className="flex justify-between text-sm"><span className="text-slate-500">Subtotal</span><span className="font-semibold text-slate-900">${subtotal.toFixed(2)}</span></div>
                  <div className="flex justify-between text-sm"><span className="text-slate-500">Delivery fee</span><span className={`font-semibold ${delivery === 0 ? 'text-emerald-500' : 'text-slate-900'}`}>{delivery === 0 ? 'FREE' : `$${delivery.toFixed(2)}`}</span></div>
                  {coupon && (
                    <div className="flex justify-between text-sm">
                      <span className="text-emerald-600 font-medium">Promo ({coupon.code})</span>
                      <span className="font-semibold text-emerald-600">-${discount.toFixed(2)}</span>
                    </div>
                  )}
                </div>
                <div className="px-6 py-4 bg-slate-50 border-t border-slate-100">
                  <div className="flex justify-between items-center mb-5">
                    <span className="font-display font-bold text-lg text-slate-900">Total</span>
                    <span className="font-display font-bold text-2xl text-orange-500">${Math.max(0, total).toFixed(2)}</span>
                  </div>
                  <button onClick={() => navigate("/order")} className="w-full py-4 btn-primary text-white font-bold rounded-2xl shadow-orange text-sm flex items-center justify-center gap-2">
                    Checkout
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 8l4 4m0 0l-4 4m4-4H3"/></svg>
                  </button>
                  <button onClick={() => navigate("/")} className="w-full mt-2 py-3 text-slate-500 hover:text-slate-700 font-medium text-sm transition-colors">← Continue Shopping</button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;
