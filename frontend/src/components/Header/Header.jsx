import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { FiMapPin, FiSearch, FiArrowRight, FiSmile, FiPackage, FiZap, FiStar } from 'react-icons/fi'

const searchPlaceholders = [
  "gourmet pizza...",
  "spicy chicken biryani...",
  "juicy double cheeseburger...",
  "fresh salmon sushi...",
  "healthy avocado salad...",
  "creamy chocolate waffle..."
]

const stats = [
  { value: "120+", label: "Partner Kitchens", icon: <FiSmile className="text-orange-500" /> },
  { value: "25k+", label: "Orders Delivered", icon: <FiPackage className="text-emerald-500" /> },
  { value: "22 min", label: "Avg Delivery Time", icon: <FiZap className="text-amber-500" /> },
  { value: "4.9★", label: "Customer Rating", icon: <FiStar className="text-yellow-500" /> },
]

const popularKeywords = [
  { text: "🍔 Burgers", query: "burger" },
  { text: "🍕 Pizza", query: "pizza" },
  { text: "🍜 Biryani", query: "biryani" },
  { text: "🥗 Salads", query: "salad" },
  { text: "🍰 Desserts", query: "cake" },
  { text: "🍣 Sushi", query: "sushi" }
]

const Header = () => {
  const [searchVal, setSearchVal] = useState("")
  const [placeholderIndex, setPlaceholderIndex] = useState(0)
  const [currentPlaceholder, setCurrentPlaceholder] = useState("")
  const [isDeleting, setIsDeleting] = useState(false)
  const navigate = useNavigate()

  // Typewriter effect for search placeholder
  useEffect(() => {
    let timer
    const fullText = searchPlaceholders[placeholderIndex]
    
    if (isDeleting) {
      timer = setTimeout(() => {
        setCurrentPlaceholder(fullText.substring(0, currentPlaceholder.length - 1))
      }, 50)
    } else {
      timer = setTimeout(() => {
        setCurrentPlaceholder(fullText.substring(0, currentPlaceholder.length + 1))
      }, 100)
    }

    if (!isDeleting && currentPlaceholder === fullText) {
      timer = setTimeout(() => setIsDeleting(true), 2000)
    } else if (isDeleting && currentPlaceholder === "") {
      setIsDeleting(false)
      setPlaceholderIndex((prev) => (prev + 1) % searchPlaceholders.length)
    }

    return () => clearTimeout(timer)
  }, [currentPlaceholder, isDeleting, placeholderIndex])

  const handleSearchSubmit = (e) => {
    e.preventDefault()
    const query = searchVal.trim() || searchPlaceholders[placeholderIndex].replace("...", "")
    navigate(`/search?q=${encodeURIComponent(query)}`)
  }

  const handleQuickKeywordClick = (query) => {
    navigate(`/search?q=${encodeURIComponent(query)}`)
  }

  return (
    <section className="relative min-h-[92vh] flex items-center overflow-hidden bg-gradient-to-b from-orange-50/40 via-white to-emerald-50/20">
      
      {/* Background blobs for premium 2026 feel */}
      <div className="absolute top-0 right-0 w-[700px] h-[700px] rounded-full opacity-30 pointer-events-none filter blur-3xl"
        style={{ background: 'radial-gradient(circle, #ffedd5 0%, rgba(254,243,199,0.3) 50%, transparent 70%)', transform: 'translate(10%, -10%)' }} />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] rounded-full opacity-20 pointer-events-none filter blur-3xl"
        style={{ background: 'radial-gradient(circle, #d1fae5 0%, rgba(16,185,129,0.05) 60%, transparent 70%)', transform: 'translate(-20%, 20%)' }} />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 w-full py-12 lg:py-20 z-10">
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-8 items-center">

          {/* Left Panel: Swiggy-inspired premium copy + Address search */}
          <div className="lg:col-span-7 order-2 lg:order-1 flex flex-col justify-center">
            
            {/* Dynamic Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-orange-100/60 border border-orange-200/80 rounded-full mb-6 w-fit animate-fadeUp">
              <span className="w-2.5 h-2.5 bg-orange-500 rounded-full animate-ping" />
              <span className="text-xs font-bold text-orange-700 tracking-wide uppercase">Superfast Delivery Guarantee</span>
            </div>

            {/* Premium Headline */}
            <h1 className="font-display text-5xl sm:text-6xl lg:text-7xl font-extrabold text-slate-900 leading-[1.05] tracking-tight mb-6">
              Craving satisfied<br />
              <span className="bg-gradient-to-r from-orange-500 via-emerald-500 to-emerald-600 bg-clip-text text-transparent">
                in minutes.
              </span>
            </h1>

            <p className="text-base sm:text-lg text-slate-500 leading-relaxed max-w-xl mb-8 font-medium">
              Order fresh, high-quality meals from your neighborhood's top-rated restaurants. Hot, contactless delivery straight to your doorstep.
            </p>

            {/* Premium Swiggy-like search/address bar */}
            <form onSubmit={handleSearchSubmit} className="w-full max-w-2xl mb-8">
              <div className="flex flex-col sm:flex-row gap-3 bg-white p-2 rounded-2xl sm:rounded-3xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.08)] border border-slate-100 hover:border-slate-200/80 focus-within:border-emerald-300 transition-all duration-300">
                <div className="flex-1 flex items-center gap-3 px-3 py-2">
                  <FiSearch className="text-slate-400 flex-shrink-0" size={20} />
                  <input
                    type="text"
                    value={searchVal}
                    onChange={(e) => setSearchVal(e.target.value)}
                    placeholder={`Search for ${currentPlaceholder}`}
                    className="w-full bg-transparent text-sm sm:text-base font-semibold text-slate-800 placeholder-slate-400 outline-none"
                  />
                </div>
                <button
                  type="submit"
                  className="flex items-center justify-center gap-2 px-8 py-3.5 sm:py-4 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white font-bold rounded-xl sm:rounded-2xl text-sm sm:text-base shadow-lg shadow-emerald-100 transition-all duration-300 active:scale-98 whitespace-nowrap"
                >
                  Find Food
                  <FiArrowRight size={18} />
                </button>
              </div>
            </form>

            {/* Popular/Quick Keyword Search */}
            <div className="flex flex-wrap items-center gap-2.5 mb-10">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-widest mr-1">Popular:</span>
              {popularKeywords.map((keyword, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => handleQuickKeywordClick(keyword.query)}
                  className="px-4 py-2 bg-slate-50 hover:bg-orange-50 border border-slate-200 hover:border-orange-300 text-xs sm:text-sm font-bold text-slate-600 hover:text-orange-600 rounded-xl transition-all duration-200 active:scale-95"
                >
                  {keyword.text}
                </button>
              ))}
            </div>

            {/* Swiggy inspired counters */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 pt-6 border-t border-slate-100">
              {stats.map((s, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-white shadow-sm border border-slate-100 flex items-center justify-center flex-shrink-0">
                    {s.icon}
                  </div>
                  <div>
                    <p className="text-base font-extrabold text-slate-900 leading-tight">{s.value}</p>
                    <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mt-0.5">{s.label}</p>
                  </div>
                </div>
              ))}
            </div>

          </div>

          {/* Right Panel: Stunning 3D layered food graphic with floating ratings */}
          <div className="lg:col-span-5 order-1 lg:order-2 relative flex items-center justify-center">
            <div className="relative w-full max-w-md sm:max-w-lg mx-auto">
              
              {/* Backglow element */}
              <div className="absolute inset-0 bg-gradient-to-tr from-orange-400 to-emerald-400 rounded-full opacity-10 filter blur-3xl transform scale-90" />

              {/* Main premium illustration generated for this section */}
              <div className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-b from-orange-100/50 to-orange-50 p-3 shadow-2xl border border-white">
                <img
                  src="/hero_food_2026.png"
                  alt="Premium Dishes Showcase"
                  className="w-full h-auto object-cover rounded-[2rem] shadow-inner transform transition-transform duration-700 hover:scale-105"
                  style={{ maxHeight: '420px' }}
                />
              </div>

              {/* Floating Swiggy-Style card 1: Fast delivery */}
              <div className="absolute -top-6 -left-4 sm:-left-8 bg-white/95 backdrop-blur rounded-2xl p-4 shadow-[0_15px_30px_-5px_rgba(0,0,0,0.1)] border border-slate-100 flex items-center gap-3 animate-bounce-slow">
                <div className="w-10 h-10 rounded-xl bg-orange-100 flex items-center justify-center text-xl flex-shrink-0">🍕</div>
                <div>
                  <p className="text-xs font-bold text-slate-900 leading-tight">Fresh Pizza Margherita</p>
                  <p className="text-[11px] text-emerald-600 font-extrabold mt-0.5">100% organic ingredients</p>
                </div>
              </div>

              {/* Floating Swiggy-Style card 2: Rating summary */}
              <div className="absolute -bottom-6 -right-2 sm:-right-6 bg-white/95 backdrop-blur rounded-2xl p-4 shadow-[0_15px_30px_-5px_rgba(0,0,0,0.1)] border border-slate-100 flex items-center gap-3 animate-float">
                <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center text-xl flex-shrink-0">🍔</div>
                <div>
                  <p className="text-xs font-bold text-slate-900 leading-tight">Gourmet Burger</p>
                  <div className="flex items-center gap-0.5 mt-0.5">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <svg key={star} className="w-3.5 h-3.5 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  )
}

export default Header
