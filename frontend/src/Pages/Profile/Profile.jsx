import React, { useContext, useEffect, useState } from 'react'
import { StoreContext } from '../../context/StoreContext'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

const Profile = () => {
  const { url, token, setToken } = useContext(StoreContext)
  const navigate = useNavigate()

  const [profile, setProfile] = useState({ name: '', email: '', phone: '' })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [activeTab, setActiveTab] = useState('profile')
  const [msg, setMsg] = useState({ type: '', text: '' })

  const [pwData, setPwData] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' })
  const [pwSaving, setPwSaving] = useState(false)

  useEffect(() => {
    if (!token) { navigate('/'); return }
    fetchProfile()
  }, [token])

  const fetchProfile = async () => {
    setLoading(true)
    try {
      const res = await axios.get(url + '/api/user/profile', { headers: { token } })
      if (res.data.success) setProfile({ name: res.data.data.name, email: res.data.data.email, phone: res.data.data.phone || '' })
    } catch (e) { console.log(e) }
    setLoading(false)
  }

  const saveProfile = async (e) => {
    e.preventDefault()
    setSaving(true)
    setMsg({ type: '', text: '' })
    try {
      const res = await axios.put(url + '/api/user/profile', { name: profile.name, phone: profile.phone }, { headers: { token } })
      if (res.data.success) setMsg({ type: 'success', text: 'Profile updated successfully!' })
      else setMsg({ type: 'error', text: res.data.message })
    } catch (e) { setMsg({ type: 'error', text: 'Failed to update profile' }) }
    setSaving(false)
  }

  const changePassword = async (e) => {
    e.preventDefault()
    if (pwData.newPassword !== pwData.confirmPassword) {
      setMsg({ type: 'error', text: 'New passwords do not match' }); return
    }
    if (pwData.newPassword.length < 8) {
      setMsg({ type: 'error', text: 'Password must be at least 8 characters' }); return
    }
    setPwSaving(true)
    setMsg({ type: '', text: '' })
    try {
      const res = await axios.post(url + '/api/user/change-password', { currentPassword: pwData.currentPassword, newPassword: pwData.newPassword }, { headers: { token } })
      if (res.data.success) { setMsg({ type: 'success', text: 'Password changed successfully!' }); setPwData({ currentPassword: '', newPassword: '', confirmPassword: '' }) }
      else setMsg({ type: 'error', text: res.data.message })
    } catch (e) { setMsg({ type: 'error', text: 'Failed to change password' }) }
    setPwSaving(false)
  }

  const logout = () => { localStorage.removeItem('token'); setToken(''); navigate('/') }

  const inputCls = "w-full px-4 py-3.5 rounded-2xl border-2 border-slate-100 bg-slate-50 text-slate-900 placeholder-slate-400 text-sm focus:outline-none focus:border-orange-300 focus:bg-white transition-all duration-200"

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-white border-b border-slate-100">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
          <div className="flex items-center gap-3">
            <button onClick={() => navigate(-1)} className="w-9 h-9 rounded-xl bg-slate-100 hover:bg-slate-200 flex items-center justify-center transition-colors">
              <svg className="w-5 h-5 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7"/></svg>
            </button>
            <div>
              <h1 className="font-display text-2xl font-bold text-slate-900">My Profile</h1>
              <p className="text-slate-400 text-sm">Manage your account details</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
        {loading ? (
          <div className="space-y-4">
            {[1,2,3].map(i => <div key={i} className="h-16 bg-white rounded-2xl animate-pulse"/>)}
          </div>
        ) : (
          <div className="grid md:grid-cols-[240px_1fr] gap-6">
            {/* Sidebar */}
            <div className="space-y-3">
              {/* Avatar card */}
              <div className="bg-white rounded-3xl border border-slate-100 shadow-card p-6 text-center">
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center text-white font-display font-bold text-2xl mx-auto mb-3">
                  {profile.name?.charAt(0)?.toUpperCase() || 'U'}
                </div>
                <p className="font-display font-bold text-slate-900">{profile.name}</p>
                <p className="text-xs text-slate-400 mt-1">{profile.email}</p>
              </div>

              {/* Nav */}
              <div className="bg-white rounded-3xl border border-slate-100 shadow-card p-3 space-y-1">
                {[
                  { key: 'profile', label: 'Profile Info', icon: '👤' },
                  { key: 'password', label: 'Change Password', icon: '🔒' },
                  { key: 'orders', label: 'My Orders', icon: '📦', action: () => navigate('/myorders') },
                ].map(tab => (
                  <button key={tab.key}
                    onClick={() => tab.action ? tab.action() : setActiveTab(tab.key)}
                    className={`flex items-center gap-3 w-full px-4 py-3 rounded-2xl text-sm font-semibold transition-all ${
                      activeTab === tab.key && !tab.action ? 'bg-orange-500 text-white' : 'text-slate-600 hover:bg-slate-50'
                    }`}>
                    <span>{tab.icon}</span>{tab.label}
                  </button>
                ))}
                <hr className="border-slate-100"/>
                <button onClick={logout} className="flex items-center gap-3 w-full px-4 py-3 rounded-2xl text-sm font-semibold text-red-500 hover:bg-red-50 transition-all">
                  <span>🚪</span> Sign Out
                </button>
              </div>
            </div>

            {/* Main Content */}
            <div>
              {/* Feedback message */}
              {msg.text && (
                <div className={`mb-4 px-4 py-3 rounded-2xl text-sm font-medium animate-fadeUp ${
                  msg.type === 'success' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-red-50 text-red-700 border border-red-200'
                }`}>
                  {msg.type === 'success' ? '✅ ' : '❌ '}{msg.text}
                </div>
              )}

              {/* Profile Tab */}
              {activeTab === 'profile' && (
                <div className="bg-white rounded-3xl border border-slate-100 shadow-card p-6 sm:p-8">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-2xl bg-orange-100 flex items-center justify-center text-xl">👤</div>
                    <div>
                      <h2 className="font-display font-bold text-lg text-slate-900">Profile Information</h2>
                      <p className="text-xs text-slate-400">Update your personal details</p>
                    </div>
                  </div>
                  <form onSubmit={saveProfile} className="space-y-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1.5">Full Name</label>
                      <input value={profile.name} onChange={e => setProfile(p => ({ ...p, name: e.target.value }))} type="text" required className={inputCls} placeholder="Your name"/>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1.5">Email Address</label>
                      <input value={profile.email} type="email" disabled className={`${inputCls} opacity-60 cursor-not-allowed`} placeholder="Email"/>
                      <p className="text-xs text-slate-400 mt-1.5">Email cannot be changed</p>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1.5">Phone Number</label>
                      <input value={profile.phone} onChange={e => setProfile(p => ({ ...p, phone: e.target.value }))} type="tel" className={inputCls} placeholder="+1 (555) 000-0000"/>
                    </div>
                    <button type="submit" disabled={saving} className="w-full py-4 btn-primary text-white font-bold rounded-2xl shadow-orange text-sm flex items-center justify-center gap-2 disabled:opacity-60">
                      {saving ? <><div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full" style={{animation:'rotate 0.8s linear infinite'}}/>Saving...</> : 'Save Changes'}
                    </button>
                  </form>
                </div>
              )}

              {/* Password Tab */}
              {activeTab === 'password' && (
                <div className="bg-white rounded-3xl border border-slate-100 shadow-card p-6 sm:p-8">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-2xl bg-slate-100 flex items-center justify-center text-xl">🔒</div>
                    <div>
                      <h2 className="font-display font-bold text-lg text-slate-900">Change Password</h2>
                      <p className="text-xs text-slate-400">Keep your account secure</p>
                    </div>
                  </div>
                  <form onSubmit={changePassword} className="space-y-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1.5">Current Password</label>
                      <input value={pwData.currentPassword} onChange={e => setPwData(p => ({ ...p, currentPassword: e.target.value }))} type="password" required className={inputCls} placeholder="Enter current password"/>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1.5">New Password</label>
                      <input value={pwData.newPassword} onChange={e => setPwData(p => ({ ...p, newPassword: e.target.value }))} type="password" required className={inputCls} placeholder="At least 8 characters"/>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1.5">Confirm New Password</label>
                      <input value={pwData.confirmPassword} onChange={e => setPwData(p => ({ ...p, confirmPassword: e.target.value }))} type="password" required className={inputCls} placeholder="Repeat new password"/>
                    </div>
                    <button type="submit" disabled={pwSaving} className="w-full py-4 bg-slate-900 hover:bg-slate-700 text-white font-bold rounded-2xl text-sm flex items-center justify-center gap-2 disabled:opacity-60 transition-all">
                      {pwSaving ? <><div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full" style={{animation:'rotate 0.8s linear infinite'}}/>Updating...</> : 'Update Password'}
                    </button>
                  </form>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Profile
