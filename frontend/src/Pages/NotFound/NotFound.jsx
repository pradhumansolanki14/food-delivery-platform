import React from 'react'
import { useNavigate } from 'react-router-dom'

const NotFound = () => {
  const navigate = useNavigate()

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center px-4 text-center">
      {/* Big 404 */}
      <div className="relative mb-6">
        <p className="font-display font-bold text-[120px] sm:text-[180px] leading-none text-slate-100 select-none">404</p>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-6xl animate-float">🍕</div>
        </div>
      </div>

      <h1 className="font-display text-2xl sm:text-3xl font-bold text-slate-900 mb-3">
        Oops! Page not found
      </h1>
      <p className="text-slate-400 text-sm sm:text-base max-w-sm mb-8 leading-relaxed">
        Looks like this page wandered off. Maybe it went to get some food? Let's get you back on track.
      </p>

      <div className="flex flex-col sm:flex-row gap-3">
        <button onClick={() => navigate('/')} className="flex items-center justify-center gap-2 px-8 py-4 btn-primary text-white font-bold rounded-2xl shadow-orange text-sm">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/></svg>
          Back to Home
        </button>
        <button onClick={() => navigate(-1)} className="px-8 py-4 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-2xl text-sm transition-colors">
          Go Back
        </button>
      </div>
    </div>
  )
}

export default NotFound
