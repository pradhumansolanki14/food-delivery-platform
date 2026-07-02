import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

const OrderSuccess = () => {
  const navigate = useNavigate()
  const [countdown, setCountdown] = useState(5)

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown(c => {
        if (c <= 1) { clearInterval(timer); navigate('/myorders'); return 0 }
        return c - 1
      })
    }, 1000)
    return () => clearInterval(timer)
  }, [navigate])

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
      <div className="bg-white rounded-4xl shadow-card border border-slate-100 p-10 sm:p-14 flex flex-col items-center text-center max-w-md w-full animate-scaleIn">
        {/* Animated checkmark */}
        <div className="relative w-24 h-24 mb-8">
          <div className="absolute inset-0 rounded-full bg-emerald-100 animate-ping opacity-30"/>
          <div className="relative w-full h-full rounded-full bg-emerald-50 border-4 border-emerald-400 flex items-center justify-center">
            <svg className="w-10 h-10 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7"/>
            </svg>
          </div>
        </div>

        <span className="text-xs font-bold text-emerald-500 uppercase tracking-widest mb-3">Order Confirmed</span>
        <h1 className="font-display text-3xl font-bold text-slate-900 mb-3">Your food is on the way!</h1>
        <p className="text-slate-400 text-sm leading-relaxed mb-8">
          We've received your order and our kitchen is already preparing your delicious meal. Estimated delivery in 30–45 minutes.
        </p>

        {/* Steps */}
        <div className="w-full space-y-3 mb-8">
          {[
            { icon: '✅', label: 'Order Received', done: true },
            { icon: '👨‍🍳', label: 'Kitchen Preparing', done: true },
            { icon: '🛵', label: 'Out for Delivery', done: false },
            { icon: '🏠', label: 'Delivered', done: false },
          ].map((step, i) => (
            <div key={i} className={`flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-medium ${step.done ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-50 text-slate-400'}`}>
              <span>{step.icon}</span>
              <span>{step.label}</span>
              {step.done && <svg className="w-4 h-4 ml-auto text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7"/></svg>}
            </div>
          ))}
        </div>

        <div className="flex flex-col sm:flex-row gap-3 w-full">
          <button onClick={() => navigate('/myorders')} className="flex-1 py-3.5 btn-primary text-white font-bold rounded-2xl shadow-orange text-sm">
            Track Order
          </button>
          <button onClick={() => navigate('/')} className="flex-1 py-3.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-2xl text-sm transition-colors">
            Order More
          </button>
        </div>

        <p className="text-xs text-slate-400 mt-5">
          Redirecting to orders in <span className="font-bold text-orange-500">{countdown}s</span>
        </p>
      </div>
    </div>
  )
}

export default OrderSuccess
