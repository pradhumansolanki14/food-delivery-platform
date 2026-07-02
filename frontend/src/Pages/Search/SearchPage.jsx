import React, { useState, useEffect, useContext, useRef } from 'react'
import { StoreContext } from '../../context/StoreContext'
import FoodItem from '../../components/FoodItem/FoodItem'
import { useNavigate, useSearchParams } from 'react-router-dom'

const CATEGORIES = ["All", "Salad", "Rolls", "Deserts", "Sandwich", "Cake", "Pure Veg", "Pasta", "Noodles"]

const SearchPage = () => {
  const { food_list } = useContext(StoreContext)
  const [searchParams, setSearchParams] = useSearchParams()
  const [query, setQuery] = useState(searchParams.get('q') || '')
  const [activeCategory, setActiveCategory] = useState('All')
  const [sortBy, setSortBy] = useState('default')
  const inputRef = useRef(null)
  const navigate = useNavigate()

  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  const q = query.toLowerCase().trim()

  let results = food_list.filter(item => {
    const matchesSearch = !q || item.name.toLowerCase().includes(q) || item.category.toLowerCase().includes(q) || item.description.toLowerCase().includes(q)
    const matchesCategory = activeCategory === 'All' || item.category === activeCategory
    return matchesSearch && matchesCategory
  })

  if (sortBy === 'price-asc') results = [...results].sort((a, b) => a.price - b.price)
  if (sortBy === 'price-desc') results = [...results].sort((a, b) => b.price - a.price)
  if (sortBy === 'name') results = [...results].sort((a, b) => a.name.localeCompare(b.name))

  const handleSearch = (val) => {
    setQuery(val)
    if (val) setSearchParams({ q: val })
    else setSearchParams({})
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Search Header */}
      <div className="bg-white border-b border-slate-100 sticky top-[72px] z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-3">
            <button onClick={() => navigate(-1)} className="w-9 h-9 rounded-xl bg-slate-100 hover:bg-slate-200 flex items-center justify-center transition-colors flex-shrink-0">
              <svg className="w-5 h-5 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7"/>
              </svg>
            </button>
            <div className="flex-1 flex items-center gap-3 bg-slate-50 border-2 border-slate-200 focus-within:border-orange-400 focus-within:bg-white rounded-2xl px-4 py-3 transition-all">
              <svg className="w-5 h-5 text-slate-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
              </svg>
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={e => handleSearch(e.target.value)}
                placeholder="Search for dishes, categories..."
                className="flex-1 bg-transparent text-sm text-slate-900 placeholder-slate-400 outline-none"
              />
              {query && (
                <button onClick={() => handleSearch('')} className="text-slate-400 hover:text-slate-700 transition-colors">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/>
                  </svg>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Filters Row */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          {/* Categories */}
          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide flex-1">
            {CATEGORIES.map(cat => (
              <button key={cat} onClick={() => setActiveCategory(cat)}
                className={`flex-shrink-0 px-4 py-2 rounded-xl text-xs font-semibold transition-all duration-200 ${
                  activeCategory === cat
                    ? 'bg-orange-500 text-white shadow-orange'
                    : 'bg-white border border-slate-200 text-slate-600 hover:border-orange-200 hover:text-orange-500'
                }`}>
                {cat}
              </button>
            ))}
          </div>
          {/* Sort */}
          <select value={sortBy} onChange={e => setSortBy(e.target.value)}
            className="flex-shrink-0 px-4 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-600 focus:outline-none focus:border-orange-300 cursor-pointer">
            <option value="default">Sort: Default</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="name">Name: A–Z</option>
          </select>
        </div>

        {/* Results header */}
        <div className="flex items-center justify-between mb-4">
          <p className="text-sm text-slate-500">
            {q ? (
              <><span className="font-semibold text-slate-900">{results.length}</span> results for &quot;<span className="text-orange-500 font-semibold">{query}</span>&quot;</>
            ) : (
              <><span className="font-semibold text-slate-900">{results.length}</span> items available</>
            )}
          </p>
        </div>

        {/* No results */}
        {results.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24">
            <div className="w-24 h-24 rounded-3xl bg-slate-100 flex items-center justify-center text-5xl mb-5">🔍</div>
            <h3 className="font-display text-xl font-bold text-slate-900 mb-2">No results found</h3>
            <p className="text-slate-400 text-sm text-center max-w-xs">
              We couldn't find &quot;{query}&quot;. Try a different keyword or browse by category.
            </p>
            <button onClick={() => { handleSearch(''); setActiveCategory('All'); }}
              className="mt-6 px-6 py-2.5 btn-primary text-white font-semibold rounded-xl shadow-orange text-sm">
              Clear Search
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {results.map(item => (
              <FoodItem key={item._id} id={item._id} name={item.name} description={item.description} price={item.price} image={item.image}/>
            ))}
          </div>
        )}

        {/* Popular suggestions when no query */}
        {!q && (
          <div className="mt-12">
            <h3 className="font-display font-bold text-slate-900 text-lg mb-4">🔥 Popular Searches</h3>
            <div className="flex flex-wrap gap-2">
              {["Pizza", "Pasta", "Salad", "Cake", "Noodles", "Sandwich", "Rolls", "Ice Cream"].map(s => (
                <button key={s} onClick={() => handleSearch(s)}
                  className="px-4 py-2 bg-white border border-slate-200 hover:border-orange-300 hover:text-orange-500 text-sm font-medium text-slate-600 rounded-xl transition-all">
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default SearchPage
