import React from 'react'
import { menu_list } from '../../assets/assets'

const categoryEmoji = {
  "Salad": "🥗",
  "Rolls": "🌯",
  "Deserts": "🍰",
  "Sandwich": "🥪",
  "Cake": "🎂",
  "Pure Veg": "🥦",
  "Pasta": "🍝",
  "Noodles": "🍜",
}

const ExploreMenu = ({ category, setCategory }) => {
  return (
    <section id="explore-menu" className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-10">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-orange-50 border border-orange-100 rounded-xl mb-3">
              <span className="text-xs font-bold text-orange-500 uppercase tracking-widest">Categories</span>
            </div>
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight">
              What are you{' '}
              <span className="text-gradient">craving?</span>
            </h2>
          </div>
          {category !== "All" && (
            <button
              onClick={() => setCategory("All")}
              className="flex items-center gap-2 text-sm font-semibold text-slate-400 hover:text-orange-500 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
              Clear filter
            </button>
          )}
        </div>

        {/* Category Grid */}
        <div className="grid grid-cols-4 sm:grid-cols-8 gap-3">
          {menu_list.map((item, index) => {
            const isActive = category === item.menu_name;
            return (
              <button
                key={index}
                onClick={() => setCategory(prev => prev === item.menu_name ? "All" : item.menu_name)}
                className={`group flex flex-col items-center gap-3 p-3 sm:p-4 rounded-2xl border-2 transition-all duration-300 ${
                  isActive
                    ? 'bg-orange-500 border-orange-500 shadow-orange scale-105'
                    : 'bg-white border-slate-100 hover:border-orange-200 hover:scale-105 hover:shadow-card'
                }`}
              >
                {/* Image with emoji fallback overlay */}
                <div className={`relative w-14 h-14 sm:w-16 sm:h-16 rounded-xl overflow-hidden transition-all duration-300 ${
                  isActive ? 'ring-2 ring-white/40' : ''
                }`}>
                  <img
                    src={item.menu_image}
                    alt={item.menu_name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  {isActive && (
                    <div className="absolute inset-0 bg-orange-500/20" />
                  )}
                </div>
                <span className={`text-xs font-semibold text-center leading-tight transition-colors ${
                  isActive ? 'text-white' : 'text-slate-700 group-hover:text-orange-500'
                }`}>
                  {item.menu_name}
                </span>
              </button>
            );
          })}
        </div>

        {/* Active filter strip */}
        {category !== "All" && (
          <div className="mt-6 flex items-center gap-2 p-4 bg-orange-50 border border-orange-100 rounded-2xl animate-fadeUp">
            <span className="text-lg">{categoryEmoji[category] || "🍽️"}</span>
            <div>
              <p className="text-sm font-semibold text-slate-900">
                Showing <span className="text-orange-500">{category}</span> dishes
              </p>
              <p className="text-xs text-slate-400">Click the category again or "Clear filter" to show all</p>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}

export default ExploreMenu
