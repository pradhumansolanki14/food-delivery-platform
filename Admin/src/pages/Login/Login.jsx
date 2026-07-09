import React, { useState } from "react"
import { FiMail, FiLock, FiArrowRight, FiLoader, FiAlertCircle, FiEye, FiEyeOff } from "react-icons/fi"
import axios from "axios"
import { useAdmin } from "../../context/AdminContext"
import { BrandLogo } from "../../components/ui"

const Login = () => {
  const { adminLogin, url } = useAdmin()
  const [data, setData] = useState({ email: "", password: "" })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [showPassword, setShowPassword] = useState(false)

  const onSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError("")
    try {
      const res = await axios.post(`${url}/api/admin/login`, data)
      if (res.data.success) {
        adminLogin(res.data.token, res.data.name, res.data.role, res.data.restaurantId)
      } else {
        setError(res.data.message)
      }
    } catch {
      setError("Connection failed. Is the backend running?")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-white flex flex-col md:flex-row overflow-hidden">
      
      {/* ── Left Side: Brand Pane (Graphite Dark Slate) ── */}
      <div className="hidden md:flex md:w-[45%] bg-zinc-950 relative overflow-hidden flex-col justify-between p-12">
        {/* Glow orb background */}
        <div className="absolute top-1/4 right-0 w-80 h-80 bg-emerald-500/10 rounded-full filter blur-[80px] pointer-events-none" />
        <div className="absolute bottom-10 left-10 w-64 h-64 bg-teal-500/10 rounded-full filter blur-[70px] pointer-events-none" />
        
        {/* Pattern overlay */}
        <div className="absolute inset-0 opacity-[0.03] bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:16px_16px]" />

        {/* Top brand banner */}
        <div className="flex items-center gap-3 relative z-10">
          <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center border border-white/10 text-white">
            <BrandLogo size={14} />
          </div>
          <div>
            <span className="text-sm font-mono font-bold uppercase tracking-widest text-white">CraveArc</span>
            <span className="ml-2 text-[9px] font-mono px-1.5 py-0.5 bg-emerald-500/20 text-emerald-300 rounded border border-emerald-500/30">CON</span>
          </div>
        </div>

        {/* Dynamic marketing text block */}
        <div className="relative z-10 max-w-sm">
          <h2 className="text-3xl font-bold tracking-tight text-white leading-tight font-display">
            The culinary operations engine.
          </h2>
          <p className="text-zinc-400 text-xs font-medium leading-relaxed mt-4">
            Manage menus, track incoming orders, and audit platform settings with extreme speed. Designed for 2026 operations.
          </p>
        </div>

        {/* System telemetry info */}
        <div className="relative z-10 flex items-center gap-2 text-zinc-500 text-[10px] font-mono">
          <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
          <span>Telemetries: Operational v3.0</span>
        </div>
      </div>

      {/* ── Right Side: Credentials Login Pane (Minimal Clerk Style) ── */}
      <div className="flex-1 flex flex-col justify-center px-6 py-12 sm:px-12 lg:px-24 bg-[#fafafa]">
        <div className="mx-auto w-full max-w-sm bg-white p-8 rounded-2xl border border-zinc-200/50 shadow-premium animate-fadeUp">
          
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-xl font-bold tracking-tight text-zinc-900">Sign in to Console</h1>
            <p className="text-xs text-zinc-400 font-semibold mt-1">Provide your staff credentials to continue</p>
          </div>

          {error && (
            <div className="mb-5 p-3.5 bg-rose-50/50 border border-rose-100 rounded-xl text-xs font-semibold text-rose-600 flex items-center gap-2.5 animate-fadeIn">
              <FiAlertCircle className="w-4 h-4 flex-shrink-0 text-rose-500" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={onSubmit} className="space-y-4">
            {/* Email field */}
            <div className="space-y-1.5">
              <label className="block text-[10px] font-bold text-zinc-450 uppercase tracking-widest">Email Address</label>
              <div className="relative flex items-center bg-white border border-zinc-200 rounded-xl px-3.5 py-2.5 focus-within:border-zinc-950 focus-within:ring-1 focus-within:ring-zinc-950 transition-all">
                <FiMail className="text-zinc-400 mr-2.5 flex-shrink-0" size={14} />
                <input
                  type="email"
                  value={data.email}
                  onChange={(e) => setData((d) => ({ ...d, email: e.target.value }))}
                  placeholder="name@restaurant.com"
                  required
                  className="bg-transparent border-none outline-none text-xs text-zinc-800 placeholder-zinc-400 w-full"
                />
              </div>
            </div>

            {/* Password field */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="block text-[10px] font-bold text-zinc-450 uppercase tracking-widest">Password</label>
              </div>
              <div className="relative flex items-center bg-white border border-zinc-200 rounded-xl px-3.5 py-2.5 focus-within:border-zinc-950 focus-within:ring-1 focus-within:ring-zinc-950 transition-all">
                <FiLock className="text-zinc-400 mr-2.5 flex-shrink-0" size={14} />
                <input
                  type={showPassword ? "text" : "password"}
                  value={data.password}
                  onChange={(e) => setData((d) => ({ ...d, password: e.target.value }))}
                  placeholder="••••••••"
                  required
                  className="bg-transparent border-none outline-none text-xs text-zinc-800 placeholder-zinc-400 w-full pr-7"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(p => !p)}
                  className="absolute right-3.5 text-zinc-400 hover:text-zinc-700 transition-colors"
                  aria-label="Toggle password view"
                >
                  {showPassword ? <FiEyeOff size={14} /> : <FiEye size={14} />}
                </button>
              </div>
            </div>

            {/* Submit button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 py-3 bg-zinc-950 hover:bg-zinc-850 text-white font-bold rounded-xl text-xs shadow-sm transition-colors disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <FiLoader className="animate-spin" size={13} />
                  <span>Verifying credentials...</span>
                </>
              ) : (
                <>
                  <span>Sign In</span>
                  <FiArrowRight size={13} />
                </>
              )}
            </button>
          </form>



        </div>
      </div>
    </div>
  )
}

export default Login
