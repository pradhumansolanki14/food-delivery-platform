import React, { useContext, useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FiX, FiUser, FiMail, FiLock, FiArrowRight,
  FiCheck, FiEye, FiEyeOff, FiLoader,
  FiZap, FiShield, FiStar,
} from 'react-icons/fi';
import axios from 'axios';
import { StoreContext } from '../../context/StoreContext';
import useToast from '../../hooks/useToast';
import { BrandLogo } from '../ui';
import { BRAND } from '../../constants/brand';

/* ─── Left-panel brand points ───────────────────────────────── */
const BRAND_POINTS = [
  { icon: <FiZap size={14} />,    text: 'Order from the best local restaurants' },
  { icon: <FiStar size={14} />,   text: 'Track every order in real-time' },
  { icon: <FiShield size={14} />, text: 'Secure, reliable delivery every time' },
];

/* ─── Reusable field ─────────────────────────────────────────── */
const Field = ({ icon, name, type = 'text', placeholder, value, onChange, required, autoFocus }) => {
  const [showPwd, setShowPwd] = useState(false);
  const isPassword = type === 'password';

  return (
    <div className="relative flex items-center bg-white border border-zinc-200 rounded-xl px-3.5 py-2.5 transition-all duration-200 focus-within:border-zinc-900 focus-within:ring-2 focus-within:ring-zinc-950/6">
      <span className="text-zinc-400 mr-2.5 flex-shrink-0">{icon}</span>
      <input
        name={name}
        type={isPassword ? (showPwd ? 'text' : 'password') : type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        autoFocus={autoFocus}
        autoComplete={isPassword ? 'current-password' : 'off'}
        className="flex-1 bg-transparent text-xs font-semibold text-zinc-800 placeholder-zinc-400 outline-none"
      />
      {isPassword && (
        <button
          type="button"
          onClick={() => setShowPwd(p => !p)}
          className="text-zinc-400 hover:text-zinc-700 transition-colors ml-2 flex-shrink-0"
          aria-label={showPwd ? 'Hide password' : 'Show password'}
        >
          {showPwd ? <FiEyeOff size={13} /> : <FiEye size={13} />}
        </button>
      )}
    </div>
  );
};

/* ════════════════════════════════════════════════════════════
   LOGIN POPUP
════════════════════════════════════════════════════════════ */
const LoginPopup = ({ setShowLogin, initialState }) => {
  const { url, setToken } = useContext(StoreContext);
  const defaultTab = initialState === 'Sign Up' ? 'Sign Up' : 'Login';
  const [currState, setCurrState] = useState(defaultTab);
  const [data, setData]           = useState({ name: '', email: '', password: '' });
  const [agree, setAgree]         = useState(false);
  const [loading, setLoading]     = useState(false);
  const toast = useToast();
  const cardRef = useRef(null);

  /* Reset fields on tab switch */
  useEffect(() => {
    setData({ name: '', email: '', password: '' });
    setAgree(false);
  }, [currState]);

  /* Trap focus inside modal */
  useEffect(() => {
    const prev = document.activeElement;
    cardRef.current?.querySelector('input')?.focus();
    return () => prev?.focus();
  }, [currState]);

  /* Esc to close */
  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') setShowLogin(false); };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [setShowLogin]);

  const onChangeHandler = (e) => {
    const { name, value } = e.target;
    setData(prev => ({ ...prev, [name]: value }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (currState === 'Sign Up' && !agree) {
      toast.error('Please agree to the Terms of Use & Privacy Policy.');
      return;
    }
    setLoading(true);
    const endpoint = currState === 'Login' ? '/api/user/login' : '/api/user/register';
    try {
      const res = await axios.post(`${url}${endpoint}`, data);
      if (res.data.success) {
        setToken(res.data.token);
        localStorage.setItem('token', res.data.token);
        toast.success(currState === 'Login' ? 'Logged in successfully!' : 'Account created successfully!');
        setShowLogin(false);
      } else {
        toast.error(res.data.message);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Authentication failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const isSignUp = currState === 'Sign Up';

  return (
    <AnimatePresence>
      <div
        className="fixed inset-0 z-[150] flex items-center justify-center p-4"
        role="dialog"
        aria-modal="true"
        aria-label="Authentication"
      >
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          className="absolute inset-0 bg-zinc-950/75 backdrop-blur-sm"
          onClick={() => setShowLogin(false)}
        />

        {/* Modal card — two-panel */}
        <motion.div
          ref={cardRef}
          initial={{ opacity: 0, scale: 0.96, y: 12 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 12 }}
          transition={{ type: 'spring', stiffness: 380, damping: 30 }}
          className="relative z-10 w-full max-w-[820px] flex rounded-2xl overflow-hidden shadow-[0_32px_80px_-8px_rgba(0,0,0,0.4)] border border-white/8"
        >

          {/* ── LEFT: Dark Brand Panel ─────────────────────────── */}
          <div className="hidden md:flex md:w-[42%] bg-zinc-950 flex-col justify-between p-9 relative overflow-hidden flex-shrink-0">

            {/* Glow orbs */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/12 rounded-full blur-[70px] pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-teal-500/8 rounded-full blur-[60px] pointer-events-none" />

            {/* Dot pattern */}
            <div className="absolute inset-0 opacity-[0.025] bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:16px_16px]" />

            {/* Brand */}
            <div className="relative z-10 flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center border border-white/10">
                <BrandLogo size={12} />
              </div>
              <span className="text-sm font-mono font-bold uppercase tracking-widest text-white">{BRAND.NAME}</span>
            </div>

            {/* Center copy */}
            <div className="relative z-10 space-y-6">
              <div>
                <h2 className="text-2xl font-bold tracking-tight text-white leading-snug">
                  {isSignUp
                    ? <>Join {BRAND.NAME}<br /><span className="text-emerald-400">and start ordering.</span></>
                    : <>Welcome<br /><span className="text-emerald-400">back.</span></>
                  }
                </h2>
                <p className="text-zinc-500 text-xs font-medium leading-relaxed mt-3 max-w-[220px]">
                  {isSignUp
                    ? 'Create a free account and start ordering from the best local restaurants.'
                    : 'Sign in to your account to continue ordering your favourite meals.'
                  }
                </p>
              </div>

              {/* Brand points */}
              <div className="space-y-2.5">
                {BRAND_POINTS.map((p, i) => (
                  <div key={i} className="flex items-center gap-2.5">
                    <div className="w-6 h-6 rounded-lg bg-emerald-500/15 border border-emerald-500/20 flex items-center justify-center text-emerald-400 flex-shrink-0">
                      {p.icon}
                    </div>
                    <span className="text-xs font-semibold text-zinc-400">{p.text}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Bottom live indicator */}
            <div className="relative z-10 flex items-center gap-2 text-zinc-600 text-[10px] font-mono">
              <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
              <span>Deliveries: Operational</span>
            </div>
          </div>

          {/* ── RIGHT: Form Panel ──────────────────────────────── */}
          <div className="flex-1 bg-[#fafafa] flex flex-col">

            {/* Top accent bar */}
            <div className="h-0.5 w-full bg-gradient-to-r from-emerald-400 via-emerald-500 to-teal-500" />

            {/* Close button */}
            <button
              type="button"
              onClick={() => setShowLogin(false)}
              aria-label="Close"
              className="absolute top-4 right-4 w-8 h-8 rounded-xl bg-zinc-100 text-zinc-500 hover:bg-zinc-200 hover:text-zinc-900 flex items-center justify-center transition-colors z-20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-400"
            >
              <FiX size={16} />
            </button>

            <div className="flex-1 flex flex-col justify-center px-8 py-10 sm:px-10">

              {/* Header */}
              <div className="mb-6">
                <h1 className="text-lg font-bold tracking-tight text-zinc-900">
                  {isSignUp ? 'Create your account' : 'Sign in to your account'}
                </h1>
                <p className="text-xs text-zinc-400 font-semibold mt-1">
                  {isSignUp ? 'Start ordering your favourite food today.' : 'Enter your credentials to continue.'}
                </p>
              </div>

              {/* Tab switcher */}
              <div className="flex gap-1 p-1 bg-zinc-100 border border-zinc-200/60 rounded-xl mb-6">
                {['Login', 'Sign Up'].map((tab) => {
                  const active = currState === tab;
                  return (
                    <button
                      key={tab}
                      type="button"
                      onClick={() => setCurrState(tab)}
                      className={`relative flex-1 py-2 rounded-lg text-xs font-bold transition-all duration-250 ${
                        active ? 'text-zinc-900' : 'text-zinc-400 hover:text-zinc-600'
                      }`}
                    >
                      {active && (
                        <motion.span
                          layoutId="auth-tab-pill"
                          className="absolute inset-0 bg-white border border-zinc-200/60 rounded-lg shadow-sm -z-10"
                          transition={{ type: 'spring', stiffness: 420, damping: 32 }}
                        />
                      )}
                      {tab === 'Login' ? 'Sign In' : 'Register'}
                    </button>
                  );
                })}
              </div>

              {/* Form */}
              <form onSubmit={onSubmit} className="space-y-3">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currState}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.15 }}
                    className="space-y-3"
                  >
                    {/* Name — Sign Up only */}
                    {isSignUp && (
                      <div>
                        <label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-1">Full Name</label>
                        <Field
                          icon={<FiUser size={13} />}
                          name="name"
                          placeholder="John Doe"
                          value={data.name}
                          onChange={onChangeHandler}
                          required
                          autoFocus={isSignUp}
                        />
                      </div>
                    )}

                    {/* Email */}
                    <div>
                      <label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-1">Email Address</label>
                      <Field
                        icon={<FiMail size={13} />}
                        name="email"
                        type="email"
                        placeholder="you@example.com"
                        value={data.email}
                        onChange={onChangeHandler}
                        required
                        autoFocus={!isSignUp}
                      />
                    </div>

                    {/* Password */}
                    <div>
                      <label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-1">Password</label>
                      <Field
                        icon={<FiLock size={13} />}
                        name="password"
                        type="password"
                        placeholder="••••••••"
                        value={data.password}
                        onChange={onChangeHandler}
                        required
                      />
                    </div>
                  </motion.div>
                </AnimatePresence>

                {/* Terms checkbox — Sign Up only */}
                {isSignUp && (
                  <motion.label
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex items-start gap-2.5 mt-1 cursor-pointer select-none pt-1"
                  >
                    <div className="relative flex items-center justify-center mt-px flex-shrink-0">
                      <input
                        type="checkbox"
                        checked={agree}
                        onChange={(e) => setAgree(e.target.checked)}
                        className="peer appearance-none w-4 h-4 rounded border border-zinc-300 checked:bg-zinc-950 checked:border-zinc-950 focus:outline-none transition-all cursor-pointer"
                      />
                      <FiCheck className="absolute text-white w-2.5 h-2.5 pointer-events-none opacity-0 peer-checked:opacity-100 transition-opacity" strokeWidth={3} />
                    </div>
                    <span className="text-[11px] font-semibold text-zinc-500 leading-relaxed">
                      I agree to the{' '}
                      <span className="text-emerald-600 font-bold hover:underline cursor-pointer">Terms of Use</span>
                      {' '}&{' '}
                      <span className="text-emerald-600 font-bold hover:underline cursor-pointer">Privacy Policy</span>
                    </span>
                  </motion.label>
                )}

                {/* Submit */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full mt-2 py-2.5 bg-zinc-950 hover:bg-zinc-800 text-white font-bold rounded-xl text-xs shadow-sm transition-colors disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-900"
                >
                  {loading ? (
                    <>
                      <motion.span
                        animate={{ rotate: 360 }}
                        transition={{ repeat: Infinity, duration: 0.8, ease: 'linear' }}
                        className="inline-block"
                      >
                        <FiLoader size={13} />
                      </motion.span>
                      {isSignUp ? 'Creating account…' : 'Signing in…'}
                    </>
                  ) : (
                    <>
                      {isSignUp ? 'Create Account' : 'Sign In'}
                      <FiArrowRight size={13} />
                    </>
                  )}
                </button>
              </form>

              {/* Footer tab switch hint */}
              <p className="text-center text-[11px] font-semibold text-zinc-400 mt-6">
                {isSignUp ? 'Already have an account? ' : "Don't have an account? "}
                <button
                  type="button"
                  onClick={() => setCurrState(isSignUp ? 'Login' : 'Sign Up')}
                  className="text-emerald-600 font-bold hover:underline focus-visible:outline-none"
                >
                  {isSignUp ? 'Sign in' : 'Create one'}
                </button>
              </p>

            </div>
          </div>

        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default LoginPopup;
