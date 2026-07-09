import React, { useState, useEffect } from "react"
import axios from "axios"
import { toast } from "react-hot-toast"
import { 
  FiFolder, FiPlus, FiX, FiInfo, FiLayers, FiDollarSign, 
  FiActivity, FiSliders, FiHeart, FiBox, FiCheck, FiCompass, FiZap 
} from "react-icons/fi"
import { Card, Button } from "../../components/ui"

const DEFAULT_CATEGORIES = [
  { name: "Salad",     color: "border-zinc-200 text-zinc-800 bg-white" },
  { name: "Rolls",     color: "border-zinc-200 text-zinc-800 bg-white" },
  { name: "Deserts",   color: "border-zinc-200 text-zinc-800 bg-white" },
  { name: "Sandwich",  color: "border-zinc-200 text-zinc-800 bg-white" },
  { name: "Cake",      color: "border-zinc-200 text-zinc-800 bg-white" },
  { name: "Pure Veg",  color: "border-zinc-200 text-zinc-800 bg-white" },
  { name: "Pasta",     color: "border-zinc-200 text-zinc-800 bg-white" },
  { name: "Noodles",   color: "border-zinc-200 text-zinc-800 bg-white" },
]

const CATEGORY_ICONS = {
  "Salad": <FiActivity size={14} />,
  "Rolls": <FiSliders size={14} />,
  "Deserts": <FiHeart size={14} />,
  "Sandwich": <FiLayers size={14} />,
  "Cake": <FiBox size={14} />,
  "Pure Veg": <FiCheck size={14} />,
  "Pasta": <FiCompass size={14} />,
  "Noodles": <FiZap size={14} />,
}

const Categories = ({ url }) => {
  const [foodList, setFoodList] = useState([])
  const [loading, setLoading] = useState(true)
  const [showAdd, setShowAdd] = useState(false)
  const [newCat, setNewCat] = useState({ name: "" })

  const fetchFoods = async () => {
    setLoading(true)
    try {
      const res = await axios.get(`${url}/api/food/list`)
      if (res.data.success) {
        setFoodList(res.data.data)
      }
    } catch {}
    setLoading(false)
  }

  useEffect(() => { 
    fetchFoods() 
  }, [])

  const categoryStats = DEFAULT_CATEGORIES.map(cat => ({
    ...cat,
    count: foodList.filter(f => f.category === cat.name).length,
    avgPrice: foodList.filter(f => f.category === cat.name).length
      ? (foodList.filter(f => f.category === cat.name).reduce((a, b) => a + b.price, 0) / foodList.filter(f => f.category === cat.name).length).toFixed(2)
      : "0.00",
  }))

  const handleAddCategory = (e) => {
    e.preventDefault()
    if (!newCat.name.trim()) return
    toast.success(`Category details saved! Add to catalog lists configuration.`)
    setShowAdd(false)
    setNewCat({ name: "" })
  }

  const labelClass = "block text-[9px] font-bold text-zinc-400 uppercase tracking-widest"
  const inputClass = "w-full px-3 py-2 rounded-lg border border-zinc-200 bg-white text-xs text-zinc-800 focus:outline-none focus:border-zinc-950 transition-all"

  return (
    <div className="max-w-4xl space-y-6 animate-fadeUp">
      
      {/* Page Header */}
      <div className="flex items-center justify-between border-b border-zinc-200/50 pb-5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-zinc-100 border border-zinc-200/60 flex items-center justify-center text-zinc-700">
            <FiFolder size={16} />
          </div>
          <div>
            <h1 className="text-lg font-bold tracking-tight text-zinc-900">Categories</h1>
            <p className="text-xs text-zinc-400 font-semibold mt-0.5">{DEFAULT_CATEGORIES.length} active menu structures</p>
          </div>
        </div>
        <button 
          onClick={() => setShowAdd(f => !f)}
          className="flex items-center gap-1.5 px-3 py-2 bg-zinc-950 hover:bg-zinc-850 text-white text-xs font-bold rounded-xl shadow-sm transition-colors"
        >
          <FiPlus size={13} />
          <span>Add Category</span>
        </button>
      </div>

      {/* Add Drawer */}
      {showAdd && (
        <Card variant="default" radius="lg" padding="md" className="border border-zinc-200 bg-white shadow-premium animate-fadeUp max-w-sm">
          <div className="flex justify-between items-center pb-2 border-b border-zinc-100 mb-4">
            <h2 className="text-xs font-bold uppercase tracking-wider text-zinc-800">Add New Category</h2>
            <button onClick={() => setShowAdd(false)} className="text-zinc-400 hover:text-zinc-700 text-xs font-bold">Cancel</button>
          </div>
          
          <form onSubmit={handleAddCategory} className="space-y-4">
            <div className="space-y-1.5">
              <label className={labelClass}>Category Name</label>
              <input 
                required
                value={newCat.name} 
                onChange={e => setNewCat(c => ({ ...c, name: e.target.value }))} 
                placeholder="e.g. Burgers, Beverages" 
                className={inputClass}
              />
            </div>

            <div className="p-3 bg-zinc-50 border border-zinc-150 rounded-xl flex gap-2">
              <FiInfo className="text-zinc-450 flex-shrink-0 mt-0.5" size={13} />
              <p className="text-[9px] font-semibold text-zinc-500 leading-normal">
                To support listings filters, make sure to append the category name in Add.jsx & List.jsx constants.
              </p>
            </div>

            <button type="submit" className="w-full py-2 bg-zinc-950 hover:bg-zinc-850 text-white font-bold rounded-lg text-2xs transition-colors">
              Submit Category
            </button>
          </form>
        </Card>
      )}

      {/* Categories Cards */}
      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map(i => <div key={i} className="h-32 bg-white border border-zinc-200 rounded-xl animate-pulse" />)}
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {categoryStats.map((cat, i) => (
            <div 
              key={i} 
              className="bg-white border border-zinc-200/65 rounded-xl p-4 shadow-premium flex flex-col justify-between h-32 hover:border-zinc-300 transition-colors"
            >
              <div>
                <div className="w-7 h-7 rounded-lg bg-zinc-50 border border-zinc-150 flex items-center justify-center text-zinc-550 mb-2">
                  {CATEGORY_ICONS[cat.name] || <FiFolder size={13} />}
                </div>
                <h3 className="text-xs font-bold text-zinc-800 uppercase tracking-wide">{cat.name}</h3>
              </div>
              <div className="space-y-1">
                <div className="flex justify-between text-[9px] font-semibold text-zinc-400 uppercase tracking-wider">
                  <span>Dishes</span>
                  <span className="font-mono text-zinc-800 font-bold">{cat.count}</span>
                </div>
                <div className="flex justify-between text-[9px] font-semibold text-zinc-400 uppercase tracking-wider">
                  <span>Avg Price</span>
                  <span className="font-mono text-zinc-800 font-bold">${cat.avgPrice}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Distribution Percentages */}
      {!loading && (
        <div className="bg-white border border-zinc-200/65 rounded-xl p-6 shadow-premium space-y-5">
          <h2 className="text-xs font-bold text-zinc-800 uppercase tracking-wider border-b border-zinc-100 pb-3">
            Menu Distribution
          </h2>
          
          <div className="grid md:grid-cols-2 gap-4">
            {categoryStats.map((cat, i) => {
              const pct = foodList.length > 0 ? Math.round((cat.count / foodList.length) * 100) : 0
              return (
                <div key={i} className="flex items-center gap-3 bg-zinc-50/50 p-3 rounded-xl border border-zinc-200/40">
                  <span className="text-zinc-450">{CATEGORY_ICONS[cat.name] || <FiFolder size={12} />}</span>
                  <span className="text-xs font-bold text-zinc-800 w-24 flex-shrink-0">{cat.name}</span>
                  
                  <div className="flex-1 h-1.5 bg-zinc-100 rounded-full overflow-hidden border border-zinc-150">
                    <div 
                      className="h-full bg-zinc-950 rounded-full transition-all duration-500"
                      style={{ width: `${pct}%` }} 
                    />
                  </div>
                  
                  <span className="text-[10px] font-mono font-bold text-zinc-500 w-8 text-right">{pct}%</span>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}

export default Categories
