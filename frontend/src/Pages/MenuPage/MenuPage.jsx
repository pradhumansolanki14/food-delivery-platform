import React, { useState, useContext } from 'react'
import { StoreContext } from '../../context/StoreContext'
import { menu_list } from '../../assets/assets'
import FoodItem from '../../components/FoodItem/FoodItem'

const CATEGORIES = ["All", ...menu_list.map(m => m.menu_name)]

const categoryEmoji = {
  "All": "🍽️", "Salad": "🥗", "Rolls": "🌯", "Deserts": "🍰",
  "Sandwich": "🥪", "Cake": "🎂", "Pure Veg": "🥦", "Pasta": "🍝", "Noodles": "🍜",
}

const MenuPage = () => {
  const { food_list } = useContext(StoreContext)
  const [activeCategory, setActiveCategory] = useState('All')
  const [sortBy, setSortBy] = useState('default')
  const [search, setSearch] = useState('')

  let filtered = food_list.filter(item => {
    const matchesCat = activeCategory === 'All' || item.category === activeCategory
    const matchesSearch = !search || item.name.toLowerCase().includes(search.toLowerCase()) || item.description.toLowerCase().includes(search.toLowerCase())
    return matchesCat && matchesSearch
  })

  if (sortBy === 'price-asc') filtered = [...filtered].sort((a, b) => a.price - b.price)
  if (sortBy === 'price-desc') filtered = [...filtered].sort((a, b) => b.price - a.price)
  if (sortBy === 'name') filtered = [...filtered].sort((a, b) => a.name.localeCompare(b.name))

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Hero Banner */}
      <div className="relative bg-slate-900 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-0 opacity-5" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,.15) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.15) 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
          <div className="absolute top-0 right-0 w-96 h-96 rounded-full opacity-10" style={{ background: 'radial-gradient(circle, #f97316 0%, transparent 70%)', transform: 'translate(20%, -20%)' }} />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-white/10 border border-white/20 rounded-xl mb-4">
            <span className="text-xs font-bold text-orange-400 uppercase tracking-widest">Full Menu</span>
          </div>
          <h1 className="font-display text-4xl sm:text-5xl font-bold text-white mb-3">
            Our <span className="text-gradient">Menu</span>
          </h1>
          <p className="text-slate-400 text-base max-w-lg mb-8">
            Browse every dish we offer — fresh, delicious, and delivered fast to your door.
          </p>
          {/* Search bar */}
          <div className="flex items-center gap-3 bg-white rounded-2xl px-4 py-3.5 max-w-md focus-within:ring-2 focus-within:ring-orange-400 transition-all">
            <svg className="w-5 h-5 text-slate-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input type="text" value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Search dishes..."
              className="flex-1 bg-transparent text-sm text-slate-700 placeholder-slate-400 outline-none" />
            {search && (
              <button onClick={() => setSearch('')} className="text-slate-400 hover:text-slate-700">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Category pills + sort */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide flex-1">
            {CATEGORIES.map(cat => (
              <button key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`flex-shrink-0 flex items-center gap-1.5 px-4 py-2.5 rounded-2xl text-sm font-semibold transition-all duration-200 ${
                  activeCategory === cat
                    ? 'bg-orange-500 text-white shadow-orange scale-105'
                    : 'bg-white border border-slate-200 text-slate-600 hover:border-orange-300 hover:text-orange-500'
                }`}>
                <span>{categoryEmoji[cat]}</span>
                <span>{cat}</span>
              </button>
            ))}
          </div>
          <select value={sortBy} onChange={e => setSortBy(e.target.value)}
            className="flex-shrink-0 px-4 py-2.5 bg-white border border-slate-200 rounded-2xl text-sm font-semibold text-slate-600 focus:outline-none focus:border-orange-300 cursor-pointer">
            <option value="default">Sort: Default</option>
            <option value="price-asc">Price: Low → High</option>
            <option value="price-desc">Price: High → Low</option>
            <option value="name">Name: A–Z</option>
          </select>
        </div>

        {/* Results count */}
        <div className="flex items-center justify-between mb-5">
          <p className="text-sm text-slate-500">
            <span className="font-bold text-slate-900">{filtered.length}</span> dish{filtered.length !== 1 ? 'es' : ''}
            {activeCategory !== 'All' && <> in <span className="text-orange-500 font-semibold">{activeCategory}</span></>}
            {search && <> matching &ldquo;<span className="text-orange-500 font-semibold">{search}</span>&rdquo;</>}
          </p>
          {(activeCategory !== 'All' || search) && (
            <button onClick={() => { setActiveCategory('All'); setSearch('') }}
              className="text-xs font-semibold text-slate-400 hover:text-orange-500 transition-colors flex items-center gap-1">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
              Clear filters
            </button>
          )}
        </div>

        {/* Grid */}
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="font-display text-xl font-bold text-slate-900 mb-2">No dishes found</h3>
            <p className="text-slate-400 text-sm">Try a different category or search term</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 sm:gap-6">
            {filtered.map(item => (
              <FoodItem key={item._id} id={item._id} name={item.name} description={item.description} price={item.price} image={item.image} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default MenuPage
