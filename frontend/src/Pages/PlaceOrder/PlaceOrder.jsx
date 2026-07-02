import React, { useContext, useEffect, useState } from "react";
import { StoreContext } from "../../context/StoreContext";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const steps = [
  { num: 1, label: "Delivery" },
  { num: 2, label: "Payment" },
  { num: 3, label: "Confirm" },
]

const PlaceOrder = () => {
  const { getTotalCartAmount, token, food_list, cartItems, url } = useContext(StoreContext);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState({
    firstName: "", lastName: "", email: "",
    street: "", city: "", state: "",
    zipcode: "", country: "", phone: "",
  });

  const onChangeHandler = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setData(d => ({ ...d, [name]: value }));
  };

  const placeOrder = async (event) => {
    event.preventDefault();
    setLoading(true);
    const orderItems = [];
    food_list.map((item) => {
      if (cartItems[item._id] > 0) {
        let itemInfo = item;
        itemInfo["quantity"] = cartItems[item._id];
        orderItems.push(itemInfo);
      }
    });
    const orderData = {
      address: data,
      items: orderItems,
      amount: getTotalCartAmount() + 2,
    };
    try {
      const response = await axios.post(url + "/api/order/place", orderData, { headers: { token } });
      if (response.data.success) {
        window.location.replace(response.data.session_url);
      } else {
        alert("Error placing order");
      }
    } catch (error) {
      console.log(error);
      alert("Something went wrong. Please try again");
    } finally {
      setLoading(false);
    }
  };

  const navigate = useNavigate();
  useEffect(() => {
    if (!token) navigate("/cart");
    else if (getTotalCartAmount() === 0) navigate("/cart");
  }, [token]);

  const cartFoods = food_list.filter(item => cartItems[item._id] > 0);
  const subtotal = getTotalCartAmount();
  const total = subtotal + 2;

  const inputCls = "w-full px-4 py-3.5 rounded-2xl border-2 border-slate-100 bg-slate-50 text-slate-900 placeholder-slate-400 text-sm focus:outline-none focus:border-orange-300 focus:bg-white transition-all duration-200";

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-white border-b border-slate-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center gap-3 mb-6">
            <button onClick={() => navigate("/cart")}
              className="w-9 h-9 rounded-xl bg-slate-100 hover:bg-slate-200 flex items-center justify-center transition-colors">
              <svg className="w-5 h-5 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <h1 className="font-display text-2xl font-bold text-slate-900">Checkout</h1>
          </div>

          {/* Steps */}
          <div className="flex items-center gap-0">
            {steps.map((step, i) => (
              <React.Fragment key={step.num}>
                <div className="flex items-center gap-2">
                  <div className={`w-8 h-8 rounded-xl flex items-center justify-center text-sm font-bold transition-all ${
                    step.num === 1 ? 'bg-orange-500 text-white shadow-orange' : 'bg-slate-100 text-slate-400'
                  }`}>
                    {step.num === 1 ? step.num : (
                      step.num < 1 ? (
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                        </svg>
                      ) : step.num
                    )}
                  </div>
                  <span className={`text-sm font-medium ${step.num === 1 ? 'text-orange-500' : 'text-slate-400'}`}>
                    {step.label}
                  </span>
                </div>
                {i < steps.length - 1 && (
                  <div className="flex-1 h-px bg-slate-200 mx-4" />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <form onSubmit={placeOrder} className="flex flex-col xl:flex-row gap-8 items-start">
          {/* Left — Delivery Info */}
          <div className="flex-1 w-full space-y-6">
            {/* Delivery Info Card */}
            <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6 sm:p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-2xl bg-orange-100 flex items-center justify-center">
                  <svg className="w-5 h-5 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <div>
                  <h2 className="font-display font-bold text-slate-900 text-lg">Delivery Address</h2>
                  <p className="text-xs text-slate-400">Where should we deliver your order?</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase tracking-wider">First Name *</label>
                  <input required type="text" name="firstName" onChange={onChangeHandler} value={data.firstName} placeholder="John" className={inputCls} />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase tracking-wider">Last Name *</label>
                  <input required type="text" name="lastName" onChange={onChangeHandler} value={data.lastName} placeholder="Doe" className={inputCls} />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase tracking-wider">Email Address *</label>
                  <input required type="email" name="email" onChange={onChangeHandler} value={data.email} placeholder="john@example.com" className={inputCls} />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase tracking-wider">Street Address *</label>
                  <input required type="text" name="street" onChange={onChangeHandler} value={data.street} placeholder="123 Main Street, Apt 4B" className={inputCls} />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase tracking-wider">City *</label>
                  <input required type="text" name="city" onChange={onChangeHandler} value={data.city} placeholder="New York" className={inputCls} />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase tracking-wider">State *</label>
                  <input required type="text" name="state" onChange={onChangeHandler} value={data.state} placeholder="NY" className={inputCls} />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase tracking-wider">Zip Code *</label>
                  <input required type="text" name="zipcode" onChange={onChangeHandler} value={data.zipcode} placeholder="10001" className={inputCls} />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase tracking-wider">Country *</label>
                  <input required type="text" name="country" onChange={onChangeHandler} value={data.country} placeholder="United States" className={inputCls} />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase tracking-wider">Phone Number *</label>
                  <input required type="text" name="phone" onChange={onChangeHandler} value={data.phone} placeholder="+1 (555) 000-0000" className={inputCls} />
                </div>
              </div>
            </div>

            {/* Delivery Options */}
            <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6">
              <h3 className="font-display font-bold text-slate-900 mb-4">Delivery Speed</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  { icon: "⚡", title: "Express Delivery", time: "20–30 min", price: "$2.00", checked: true },
                  { icon: "🚶", title: "Standard Delivery", time: "45–60 min", price: "Free", checked: false },
                ].map((opt, i) => (
                  <label key={i} className={`flex items-center gap-4 p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                    opt.checked ? 'border-orange-300 bg-orange-50' : 'border-slate-100 hover:border-slate-200'
                  }`}>
                    <input type="radio" name="delivery" defaultChecked={opt.checked} className="sr-only" />
                    <span className="text-2xl">{opt.icon}</span>
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-slate-900">{opt.title}</p>
                      <p className="text-xs text-slate-400">{opt.time}</p>
                    </div>
                    <span className={`text-sm font-bold ${opt.checked ? 'text-orange-500' : 'text-emerald-500'}`}>
                      {opt.price}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* Right — Summary */}
          <div className="w-full xl:w-[400px] flex-shrink-0 sticky top-24 space-y-4">
            {/* Order summary */}
            <div className="bg-white rounded-3xl border border-slate-100 shadow-card overflow-hidden">
              <div className="px-6 pt-6 pb-4 border-b border-slate-50">
                <h3 className="font-display font-bold text-xl text-slate-900">Your Order</h3>
                <p className="text-xs text-slate-400 mt-1">{cartFoods.length} items</p>
              </div>

              <div className="px-6 py-4 space-y-3 max-h-48 overflow-y-auto scrollbar-hide">
                {cartFoods.map((item) => (
                  <div key={item._id} className="flex items-center gap-3">
                    <img src={`${url}/images/${item.image}`} alt={item.name}
                      className="w-10 h-10 rounded-xl object-cover flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-slate-800 truncate">{item.name}</p>
                      <p className="text-xs text-slate-400">×{cartItems[item._id]}</p>
                    </div>
                    <span className="text-sm font-bold text-slate-900 flex-shrink-0">
                      ${(item.price * cartItems[item._id]).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>

              <div className="px-6 py-4 space-y-2.5 border-t border-slate-50">
                <div className="flex justify-between text-sm text-slate-500">
                  <span>Subtotal</span>
                  <span className="font-semibold text-slate-900">${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm text-slate-500">
                  <span>Delivery</span>
                  <span className="font-semibold text-slate-900">$2.00</span>
                </div>
              </div>

              <div className="px-6 py-4 bg-slate-50">
                <div className="flex justify-between items-center mb-5">
                  <span className="font-display font-bold text-lg text-slate-900">Total</span>
                  <span className="font-display font-bold text-2xl text-orange-500">${total.toFixed(2)}</span>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-4 btn-primary text-white font-bold rounded-2xl shadow-orange text-sm flex items-center justify-center gap-2.5 disabled:opacity-60"
                >
                  {loading ? (
                    <><div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />Processing...</>
                  ) : (
                    <>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                      Pay ${total.toFixed(2)}
                    </>
                  )}
                </button>

                <div className="flex items-center justify-center gap-2 mt-3">
                  <svg className="w-3.5 h-3.5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                  <span className="text-xs text-slate-400 font-medium">256-bit SSL encryption · Secured by Stripe</span>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PlaceOrder;
