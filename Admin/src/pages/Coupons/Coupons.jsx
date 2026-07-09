import React, { useState, useEffect } from "react"
import axios from "axios"
import { toast } from "react-hot-toast"
import { FiTag, FiPlus, FiTrash2, FiX, FiCalendar, FiDollarSign, FiClock, FiActivity, FiAlertCircle } from "react-icons/fi"
import { Card, Badge, ConfirmationModal } from "../../components/ui"

const Coupons = ({ url }) => {
  const [coupons, setCoupons] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ 
    code: "", 
    discountType: "percent", 
    discount: "", 
    minOrder: "", 
    maxUses: "100", 
    expiresAt: "", 
    description: "" 
  })
  const [creating, setCreating] = useState(false)
  const [confirmDialog, setConfirmDialog] = useState({ isOpen: false, title: "", message: "", onConfirm: null })

  const fetchCoupons = async () => {
    setLoading(true)
    try {
      const adminToken = localStorage.getItem("adminToken")
      const res = await axios.get(`${url}/api/coupons/list`, { headers: { token: adminToken } })
      if (res.data.success) {
        setCoupons(res.data.data)
      }
    } catch { 
      toast.error("Failed to load coupons database") 
    }
    setLoading(false)
  }

  const createCoupon = async (e) => {
    e.preventDefault()
    setCreating(true)
    try {
      const adminToken = localStorage.getItem("adminToken")
      const res = await axios.post(`${url}/api/coupons/create`, form, { headers: { token: adminToken } })
      if (res.data.success) { 
        toast.success("Promo coupon created!") 
        setShowForm(false) 
        setForm({ code: "", discountType: "percent", discount: "", minOrder: "", maxUses: "100", expiresAt: "", description: "" }) 
        fetchCoupons() 
      } else {
        toast.error(res.data.message || "Failed to create coupon")
      }
    } catch { 
      toast.error("Failed to create coupon") 
    }
    setCreating(false)
  }

  const toggleCoupon = async (id) => {
    try {
      const adminToken = localStorage.getItem("adminToken")
      const res = await axios.patch(`${url}/api/coupons/${id}/toggle`, {}, { headers: { token: adminToken } })
      if (res.data.success) { 
        toast.success(res.data.message || "Status updated") 
        fetchCoupons() 
      }
    } catch { 
      toast.error("Failed to change status") 
    }
  }

  const deleteCoupon = (id) => {
    setConfirmDialog({
      isOpen: true,
      title: "Delete Coupon",
      message: "Are you sure you want to permanently delete this promotional coupon? Any customers currently checking out won't be able to use it.",
      onConfirm: async () => {
        setConfirmDialog(d => ({ ...d, isOpen: false }))
        try {
          const adminToken = localStorage.getItem("adminToken")
          const res = await axios.delete(`${url}/api/coupons/${id}`, { headers: { token: adminToken } })
          if (res.data.success) { 
            toast.success("Coupon code deleted") 
            fetchCoupons() 
          }
        } catch { 
          toast.error("Failed to delete coupon") 
        }
      },
      onCancel: () => setConfirmDialog(d => ({ ...d, isOpen: false }))
    })
  }

  useEffect(() => { 
    fetchCoupons() 
  }, [])

  const labelClass = "block text-[9px] font-bold text-zinc-400 uppercase tracking-widest"
  const inpClass = "w-full px-3.5 py-2.5 rounded-xl border border-zinc-200 bg-white text-xs text-zinc-800 placeholder-zinc-400 focus:outline-none focus:border-zinc-950 transition-all"

  return (
    <div className="max-w-5xl space-y-6 animate-fadeUp">
      
      {/* Page Header */}
      <div className="flex items-center justify-between border-b border-zinc-200/50 pb-5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-zinc-100 border border-zinc-200/60 flex items-center justify-center text-zinc-700">
            <FiTag size={16} />
          </div>
          <div>
            <h1 className="text-lg font-bold tracking-tight text-zinc-900">Promo Coupons</h1>
            <p className="text-xs text-zinc-400 font-semibold mt-0.5">{coupons.length} promotional codes listed</p>
          </div>
        </div>
        <button 
          onClick={() => setShowForm(f => !f)}
          className="flex items-center gap-1.5 px-3 py-2 bg-zinc-950 hover:bg-zinc-850 text-white text-xs font-bold rounded-xl shadow-sm transition-colors"
        >
          <FiPlus size={13} />
          <span>Create Coupon</span>
        </button>
      </div>

      {/* Form Drawer overlay */}
      {showForm && (
        <Card variant="default" radius="2xl" padding="lg" className="border border-zinc-200 bg-white shadow-premium animate-fadeUp max-w-xl">
          <div className="flex justify-between items-center pb-2 border-b border-zinc-100 mb-4">
            <h2 className="text-xs font-bold uppercase tracking-wider text-zinc-800">Add Promo Coupon</h2>
            <button onClick={() => setShowForm(false)} className="text-zinc-400 hover:text-zinc-755 text-xs font-bold">Cancel</button>
          </div>
          
          <form onSubmit={createCoupon} className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className={labelClass}>Coupon Code</label>
              <input 
                required
                name="code"
                value={form.code} 
                onChange={e => setForm(f => ({ ...f, code: e.target.value.toUpperCase() }))} 
                placeholder="e.g. EXTRA30" 
                className={`${inpClass} font-mono uppercase font-bold`}
              />
            </div>
            
            <div className="space-y-1.5">
              <label className={labelClass}>Discount Type</label>
              <select 
                name="discountType"
                value={form.discountType} 
                onChange={e => setForm(f => ({ ...f, discountType: e.target.value }))}
                className={inpClass}
              >
                <option value="percent">Percentage (%)</option>
                <option value="fixed">Fixed Flat USD ($)</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className={labelClass}>Discount Value</label>
              <input 
                required
                type="number"
                min="1"
                name="discount"
                value={form.discount} 
                onChange={e => setForm(f => ({ ...f, discount: e.target.value }))} 
                placeholder={form.discountType === 'percent' ? '30' : '15.00'} 
                className={inpClass}
              />
            </div>

            <div className="space-y-1.5">
              <label className={labelClass}>Min Order Limit ($)</label>
              <input 
                type="number"
                min="0"
                name="minOrder"
                value={form.minOrder} 
                onChange={e => setForm(f => ({ ...f, minOrder: e.target.value }))} 
                placeholder="0.00" 
                className={inpClass}
              />
            </div>

            <div className="space-y-1.5">
              <label className={labelClass}>Max Usage Limits</label>
              <input 
                type="number"
                min="1"
                name="maxUses"
                value={form.maxUses} 
                onChange={e => setForm(f => ({ ...f, maxUses: e.target.value }))} 
                className={inpClass}
              />
            </div>

            <div className="space-y-1.5">
              <label className={labelClass}>Expiration Date</label>
              <input 
                required
                type="datetime-local"
                name="expiresAt"
                value={form.expiresAt} 
                onChange={e => setForm(f => ({ ...f, expiresAt: e.target.value }))} 
                className={inpClass}
              />
            </div>

            <div className="sm:col-span-2 space-y-1.5">
              <label className={labelClass}>Offer Descriptions</label>
              <input 
                name="description"
                value={form.description} 
                onChange={e => setForm(f => ({ ...f, description: e.target.value }))} 
                placeholder="e.g. 30% discount off gourmet category burgers" 
                className={inpClass}
              />
            </div>

            <div className="sm:col-span-2 flex gap-3 pt-2">
              <button type="button" onClick={() => setShowForm(false)} className="flex-1 py-2.5 bg-zinc-100 hover:bg-zinc-200 text-zinc-705 text-xs font-bold rounded-lg transition-colors">
                Cancel
              </button>
              <button type="submit" disabled={creating} className="flex-1 py-2.5 bg-zinc-950 hover:bg-zinc-850 text-white text-xs font-bold rounded-lg transition-colors">
                {creating ? 'Creating...' : 'Publish Discount'}
              </button>
            </div>
          </form>
        </Card>
      )}

      {/* Coupons Listings */}
      <div className="bg-white border border-zinc-200/60 rounded-xl shadow-premium overflow-hidden">
        {/* Table Head */}
        <div className="hidden sm:grid grid-cols-[1.5fr_1fr_1fr_1fr_1fr_auto] gap-4 px-6 py-4.5 bg-zinc-50/50 border-b border-zinc-150/80 text-[9px] font-bold uppercase tracking-widest text-zinc-400">
          <span>Coupon Code</span>
          <span>Discount Amount</span>
          <span>Min Order</span>
          <span>Usage Logs</span>
          <span>Expires At</span>
          <span className="text-right">Actions</span>
        </div>

        {loading ? (
          <div className="p-6 space-y-3">
            {[1, 2].map(i => <div key={i} className="h-10 bg-zinc-100 rounded-lg animate-pulse" />)}
          </div>
        ) : coupons.length === 0 ? (
          <div className="text-center py-16 p-8">
            <FiTag className="mx-auto text-zinc-350 mb-3 animate-bounce" size={24} />
            <p className="font-bold text-zinc-755 text-xs">No coupons created</p>
          </div>
        ) : (
          <div className="divide-y divide-zinc-100">
            {coupons.map(c => {
              const expired = new Date() > new Date(c.expiresAt)
              return (
                <div 
                  key={c._id} 
                  className="grid grid-cols-[auto_1fr_auto] sm:grid-cols-[1.5fr_1fr_1fr_1fr_1fr_auto] gap-4 items-center px-6 py-4 hover:bg-zinc-50/20 transition-all duration-200"
                >
                  
                  {/* Code */}
                  <div>
                    <span className="font-mono font-bold text-zinc-950 text-xs tracking-wider bg-zinc-50 border border-zinc-200 px-2 py-0.5 rounded">
                      {c.code}
                    </span>
                    {c.description && <p className="text-[10px] text-zinc-400 mt-1.5 font-semibold leading-normal">{c.description}</p>}
                  </div>

                  {/* Discount */}
                  <span className="font-mono font-bold text-emerald-650 text-xs">
                    {c.discount}{c.discountType === 'percent' ? '%' : '$'} Off
                  </span>

                  {/* Min order */}
                  <span className="hidden sm:block text-xs font-mono font-semibold text-zinc-550">
                    {c.minOrder > 0 ? `$${c.minOrder.toFixed(2)}` : 'None'}
                  </span>

                  {/* Usage */}
                  <span className="hidden sm:block text-xs font-mono text-zinc-500 font-semibold">
                    {c.usedCount} / <span className="text-zinc-400">{c.maxUses}</span>
                  </span>

                  {/* Expiration */}
                  <div className="hidden sm:block">
                    {expired ? (
                      <span className="px-1.5 py-0.5 rounded bg-rose-50 border border-rose-100 text-[8px] font-bold text-rose-600 uppercase tracking-wider">
                        Expired
                      </span>
                    ) : (
                      <span className="text-xs font-semibold text-zinc-500 flex items-center gap-1">
                        <FiCalendar className="text-zinc-400" size={11} />
                        <span>{new Date(c.expiresAt).toLocaleDateString()}</span>
                      </span>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 ml-auto sm:ml-0">
                    <button 
                      onClick={() => toggleCoupon(c._id)}
                      className={`px-2 py-1 rounded text-[9px] font-bold uppercase tracking-wider border transition-colors ${
                        c.isActive 
                          ? 'bg-emerald-50 text-emerald-705 border-emerald-100/50 hover:bg-emerald-100' 
                          : 'bg-zinc-50 text-zinc-450 border-zinc-200 hover:bg-zinc-100'
                      }`}
                    >
                      {c.isActive ? 'Active' : 'Inactive'}
                    </button>
                    
                    <button 
                      onClick={() => deleteCoupon(c._id)} 
                      className="w-8 h-8 rounded-lg flex items-center justify-center text-zinc-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                    >
                      <FiTrash2 size={13} />
                    </button>
                  </div>

                </div>
              )
            })}
          </div>
        )}
      </div>

      <ConfirmationModal 
        isOpen={confirmDialog.isOpen}
        title={confirmDialog.title}
        message={confirmDialog.message}
        onConfirm={confirmDialog.onConfirm}
        onCancel={confirmDialog.onCancel}
      />
    </div>
  )
}

export default Coupons
