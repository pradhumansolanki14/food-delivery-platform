import React, { useContext, useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { StoreContext } from '../../context/StoreContext'

const statusSteps = [
  { key: 'placed',     label: 'Order Placed',    icon: '📋' },
  { key: 'processing', label: 'Being Prepared',  icon: '👨‍🍳' },
  { key: 'delivery',   label: 'Out for Delivery', icon: '🛵' },
  { key: 'delivered',  label: 'Delivered',        icon: '✅' },
]

const getStepIndex = (status) => {
  if (status === 'Food Processing') return 1
  if (status === 'Out for Delivery') return 2
  if (status === 'Delivered') return 3
  return 0
}

const OrderDetail = () => {
  const { id } = useParams()
  const { url, token, food_list, SetCartItems } = useContext(StoreContext)
  const navigate = useNavigate()
  const [order, setOrder] = useState(null)
  const [loading, setLoading] = useState(true)
  const [reordering, setReordering] = useState(false)

  useEffect(() => {
    if (!token) { navigate('/'); return }
    fetchOrder()
  }, [id, token])

  const fetchOrder = async () => {
    setLoading(true)
    try {
      const res = await axios.get(`${url}/api/order/${id}`, { headers: { token } })
      if (res.data.success) setOrder(res.data.data)
      else navigate('/myorders')
    } catch { navigate('/myorders') }
    setLoading(false)
  }

  const handleOrderAgain = async () => {
    if (!order) return
    setReordering(true)
    // Re-add all items to cart
    const newCart = {}
    order.items.forEach(item => { if (item._id) newCart[item._id] = item.quantity || 1 })
    SetCartItems(prev => ({ ...prev, ...newCart }))
    // Sync with backend if token
    try {
      for (const item of order.items) {
        if (item._id) {
          for (let i = 0; i < (item.quantity || 1); i++) {
            await axios.post(url + '/api/cart/add', { itemId: item._id }, { headers: { token } })
          }
        }
      }
    } catch { /* silently add locally */ }
    setReordering(false)
    navigate('/cart')
  }

  if (loading) return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center">
      <div className="w-12 h-12 rounded-full border-4 border-slate-200 border-t-orange-500 animate-spin" />
    </div>
  )

  if (!order) return null

  const stepIndex = getStepIndex(order.status)
  const date = new Date(order.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-white border-b border-slate-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6">
          <div className="flex items-center gap-3 mb-1">
            <button onClick={() => navigate('/myorders')} className="w-9 h-9 rounded-xl bg-slate-100 hover:bg-slate-200 flex items-center justify-center transition-colors">
              <svg className="w-5 h-5 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <div>
              <h1 className="font-display text-2xl font-bold text-slate-900">Order Details</h1>
              <p className="text-slate-400 text-sm font-mono">#{id.slice(-8).toUpperCase()}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-5">
        {/* Status tracker */}
        <div className="bg-white rounded-3xl border border-slate-100 shadow-card p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-display font-bold text-slate-900">Order Status</h2>
            <span className="text-xs text-slate-400">{date}</span>
          </div>
          <div className="flex items-start gap-0">
            {statusSteps.map((step, i) => {
              const done = i <= stepIndex
              const active = i === stepIndex
              return (
                <div key={step.key} className="flex-1 flex flex-col items-center relative">
                  {/* Connector line */}
                  {i < statusSteps.length - 1 && (
                    <div className={`absolute top-5 left-1/2 right-0 h-1 rounded-full transition-all duration-700 ${done && i < stepIndex ? 'bg-orange-400' : 'bg-slate-100'}`} style={{ width: '100%', left: '50%' }} />
                  )}
                  {/* Circle */}
                  <div className={`relative z-10 w-10 h-10 rounded-2xl flex items-center justify-center text-lg mb-2 transition-all duration-300 ${
                    done ? 'bg-orange-500 scale-110 shadow-orange' : 'bg-slate-100'
                  }`}>
                    {step.icon}
                  </div>
                  <span className={`text-xs font-semibold text-center leading-tight px-1 ${active ? 'text-orange-500' : done ? 'text-slate-700' : 'text-slate-400'}`}>
                    {step.label}
                  </span>
                </div>
              )
            })}
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-5">
          {/* Items ordered */}
          <div className="bg-white rounded-3xl border border-slate-100 shadow-card p-6">
            <h2 className="font-display font-bold text-slate-900 mb-5">Items Ordered</h2>
            <div className="space-y-4">
              {order.items.map((item, i) => {
                const foodData = food_list.find(f => f._id === item._id)
                return (
                  <div key={i} className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl overflow-hidden bg-slate-100 flex-shrink-0">
                      {foodData ? (
                        <img src={`${url}/images/${foodData.image}`} alt={item.name} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-xl">🍽️</div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-slate-900 text-sm truncate">{item.name}</p>
                      <p className="text-xs text-slate-400">×{item.quantity || 1} · ${item.price}</p>
                    </div>
                    <p className="font-bold text-slate-900 text-sm flex-shrink-0">
                      ${((item.price || 0) * (item.quantity || 1)).toFixed(2)}
                    </p>
                  </div>
                )
              })}
            </div>

            {/* Order total */}
            <div className="mt-5 pt-4 border-t border-slate-100 space-y-2">
              <div className="flex justify-between text-sm text-slate-500">
                <span>Subtotal</span>
                <span>${(order.amount - 2).toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm text-slate-500">
                <span>Delivery fee</span>
                <span>$2.00</span>
              </div>
              <div className="flex justify-between font-bold text-base pt-1">
                <span className="text-slate-900">Total</span>
                <span className="text-orange-500">${order.amount.toFixed(2)}</span>
              </div>
            </div>

            {/* Order Again */}
            <button
              onClick={handleOrderAgain}
              disabled={reordering}
              className="mt-5 w-full py-3.5 btn-primary text-white font-bold rounded-2xl shadow-orange text-sm flex items-center justify-center gap-2 disabled:opacity-60"
            >
              {reordering ? (
                <><div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full" style={{ animation: 'rotate 0.8s linear infinite' }} />Adding to cart...</>
              ) : (
                <><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>Order Again</>
              )}
            </button>
          </div>

          {/* Delivery address */}
          <div className="space-y-5">
            <div className="bg-white rounded-3xl border border-slate-100 shadow-card p-6">
              <h2 className="font-display font-bold text-slate-900 mb-4">Delivery Address</h2>
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-2xl bg-orange-50 flex items-center justify-center flex-shrink-0">
                  <svg className="w-5 h-5 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  </svg>
                </div>
                <div>
                  <p className="font-bold text-slate-900">{order.address.firstName} {order.address.lastName}</p>
                  <p className="text-sm text-slate-500 mt-1">{order.address.street}</p>
                  <p className="text-sm text-slate-500">{order.address.city}, {order.address.state} {order.address.zipcode}</p>
                  <p className="text-sm text-slate-500">{order.address.country}</p>
                  <p className="text-sm font-semibold text-slate-700 mt-2">{order.address.phone}</p>
                  <p className="text-sm text-slate-500">{order.address.email}</p>
                </div>
              </div>
            </div>

            {/* Payment info */}
            <div className="bg-white rounded-3xl border border-slate-100 shadow-card p-6">
              <h2 className="font-display font-bold text-slate-900 mb-4">Payment</h2>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-emerald-50 flex items-center justify-center">
                  <svg className="w-5 h-5 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                  </svg>
                </div>
                <div>
                  <p className="font-semibold text-slate-900 text-sm">Stripe</p>
                  <p className={`text-xs font-semibold mt-0.5 ${order.payment ? 'text-emerald-500' : 'text-amber-500'}`}>
                    {order.payment ? '✅ Payment confirmed' : '⏳ Payment pending'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default OrderDetail
