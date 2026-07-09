import React, { useState, useEffect } from "react"
import axios from "axios"
import { toast } from "react-hot-toast"
import { FiBookOpen, FiPlus, FiX, FiEdit, FiTrash2, FiGlobe } from "react-icons/fi"
import { Card, Badge, ConfirmationModal } from "../../components/ui"

const Cuisines = ({ url }) => {
  const [cuisines, setCuisines] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState({ name: "", icon: "FiGlobe" })
  const [saving, setSaving] = useState(false)
  const [confirmDialog, setConfirmDialog] = useState({ isOpen: false, title: "", message: "", onConfirm: null })
  
  const token = localStorage.getItem("adminToken")

  const fetchCuisines = async () => {
    setLoading(true)
    try {
      const res = await axios.get(`${url}/api/cuisines`)
      if (res.data.success) {
        setCuisines(res.data.data)
      }
    } catch {
      toast.error("Failed to load cuisines")
    }
    setLoading(false)
  }

  useEffect(() => { 
    fetchCuisines() 
  }, [])

  const openAdd = () => { 
    setEditing(null) 
    setForm({ name: "", icon: "FiGlobe" }) 
    setShowForm(true) 
  }
  
  const openEdit = (c) => { 
    setEditing(c) 
    setForm({ name: c.name, icon: c.icon || "FiGlobe" }) 
    setShowForm(true) 
  }
  
  const closeForm = () => { 
    setShowForm(false) 
    setEditing(null) 
  }

  const handleSave = async (e) => {
    e.preventDefault()
    if (!form.name.trim()) return
    setSaving(true)
    try {
      let res
      if (editing) {
        res = await axios.put(`${url}/api/cuisines/${editing._id}`, form, { headers: { token } })
      } else {
        res = await axios.post(`${url}/api/cuisines`, form, { headers: { token } })
      }
      if (res.data.success) {
        toast.success(editing ? "Cuisine details updated!" : "New cuisine category added!")
        closeForm()
        fetchCuisines()
      } else {
        toast.error(res.data.message || "Failed to save category")
      }
    } catch (err) {
      toast.error("Failed to update cuisines directory")
    }
    setSaving(false)
  }

  const handleDelete = (c) => {
    setConfirmDialog({
      isOpen: true,
      title: "Delete Cuisine",
      message: `Are you sure you want to permanently delete "${c.name}"? This will fail if any restaurants are registered under it.`,
      onConfirm: async () => {
        setConfirmDialog(d => ({ ...d, isOpen: false }))
        try {
          const res = await axios.delete(`${url}/api/cuisines/${c._id}`, { headers: { token } })
          if (res.data.success) {
            toast.success("Cuisine category removed successfully")
            fetchCuisines()
          } else {
            toast.error(res.data.message || "Failed to remove cuisine")
          }
        } catch (err) {
          if (err.response?.status === 409) {
            toast.error("Cannot delete: Cuisine is active in restaurant catalogs")
          } else {
            toast.error("Request failed")
          }
        }
      },
      onCancel: () => setConfirmDialog(d => ({ ...d, isOpen: false }))
    })
  }

  const labelClass = "block text-[9px] font-bold text-zinc-450 uppercase tracking-widest"
  const inpClass = "w-full px-3.5 py-2.5 rounded-xl border border-zinc-200 bg-white text-xs text-zinc-800 focus:outline-none focus:border-zinc-950 transition-all"

  return (
    <div className="max-w-4xl space-y-6 animate-fadeUp">
      
      {/* Rebuilt Form Dialog Overlay */}
      {showForm && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-955/40 backdrop-blur-xs animate-fadeIn"
          onClick={e => e.target === e.currentTarget && closeForm()}
        >
          <Card variant="default" radius="2xl" padding="none" className="bg-white shadow-2xl w-full max-w-sm overflow-hidden animate-scaleIn">
            <div className="h-1 w-full bg-gradient-to-r from-emerald-500 to-emerald-600" />
            
            <div className="p-6">
              {/* Header */}
              <div className="flex items-center justify-between pb-3 border-b border-zinc-100 mb-5">
                <div>
                  <h2 className="text-sm font-bold text-zinc-900">
                    {editing ? "Edit Cuisine Profile" : "Create Cuisine Class"}
                  </h2>
                  <p className="text-[10px] text-zinc-400 font-semibold mt-0.5">Map global culinary region wrappers</p>
                </div>
                <button type="button" onClick={closeForm} className="text-zinc-400 hover:text-zinc-800 text-xs font-bold">Cancel</button>
              </div>

              <form onSubmit={handleSave} className="space-y-4">
                <div className="space-y-1.5">
                  <label className={labelClass}>Cuisine Region Name</label>
                  <input 
                    required
                    value={form.name} 
                    onChange={e => setForm(f => ({ ...f, name: e.target.value }))} 
                    placeholder="e.g. Italian, Thai, Mediterranean" 
                    className={inpClass}
                  />
                </div>

                <div className="flex gap-2 pt-2">
                  <button type="button" onClick={closeForm} className="flex-1 py-2 bg-zinc-100 hover:bg-zinc-200 text-zinc-700 text-xs font-bold rounded-lg transition-colors">
                    Cancel
                  </button>
                  <button type="submit" disabled={saving} className="flex-1 py-2 bg-zinc-950 hover:bg-zinc-850 text-white text-xs font-bold rounded-lg transition-colors">
                    {saving ? "Saving..." : editing ? "Save Details" : "Create Cuisine"}
                  </button>
                </div>
              </form>
            </div>
          </Card>
        </div>
      )}

      {/* Page Header */}
      <div className="flex items-center justify-between border-b border-zinc-200/50 pb-5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-zinc-100 border border-zinc-200/60 flex items-center justify-center text-zinc-700">
            <FiBookOpen size={16} />
          </div>
          <div>
            <h1 className="text-lg font-bold tracking-tight text-zinc-905">Cuisines Configuration</h1>
            <p className="text-xs text-zinc-400 font-semibold mt-0.5">{cuisines.length} regional filters registered</p>
          </div>
        </div>
        <button 
          onClick={openAdd}
          className="flex items-center gap-1.5 px-3 py-2 bg-zinc-955 hover:bg-zinc-850 text-white text-xs font-bold rounded-xl shadow-sm transition-colors"
        >
          <FiPlus size={13} />
          <span>Add Cuisine</span>
        </button>
      </div>

      {/* Grid mapping */}
      {loading ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1,2,3].map(i => <div key={i} className="h-20 bg-white border border-zinc-200 rounded-xl animate-pulse" />)}
        </div>
      ) : cuisines.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <FiBookOpen size={24} className="text-zinc-300 mb-2" />
          <p className="font-bold text-zinc-755 text-xs">No regional classifications created</p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {cuisines.map(c => (
            <div 
              key={c._id} 
              className="bg-white border border-zinc-200/60 rounded-xl p-4 shadow-premium flex items-center justify-between group hover:border-zinc-350 transition-colors"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-8 h-8 rounded-lg bg-zinc-50 border border-zinc-150 flex items-center justify-center text-zinc-500">
                  <FiGlobe size={13} />
                </div>
                <div className="min-w-0">
                  <p className="font-bold text-zinc-800 text-xs truncate leading-none mb-1.5">{c.name}</p>
                  <span className={`px-1.5 py-0.5 rounded-[4px] text-[8px] font-bold uppercase tracking-wider border ${
                    c.isActive !== false 
                      ? 'bg-emerald-50 border-emerald-250/20 text-emerald-700' 
                      : 'bg-zinc-100 border-zinc-200 text-zinc-500'
                  }`}>
                    {c.isActive !== false ? "Active" : "Inactive"}
                  </span>
                </div>
              </div>
              
              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button 
                  onClick={() => openEdit(c)} 
                  className="w-7 h-7 rounded-lg flex items-center justify-center text-zinc-400 hover:text-zinc-800 hover:bg-zinc-50 transition-colors"
                  title="Modify properties"
                >
                  <FiEdit size={12} />
                </button>
                <button 
                  onClick={() => handleDelete(c)} 
                  className="w-7 h-7 rounded-lg flex items-center justify-center text-zinc-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                  title="Delete category"
                >
                  <FiTrash2 size={12} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

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

export default Cuisines
