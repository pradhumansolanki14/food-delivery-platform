import React, { useContext, useState, useEffect } from "react";
import { assets } from "../../assets/assets";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { StoreContext } from "../../context/StoreContext";

const NAV_ITEMS = [
  { label: "Home",    path: "/",        exact: true },
  { label: "Menu",    path: "/menu",    exact: false },
  { label: "App",     path: "/app",     exact: false },
  { label: "Contact", path: "/contact", exact: false },
]

const Navbar = ({ setShowLogin }) => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { token, setToken, cartItems, favorites } = useContext(StoreContext);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => setMobileOpen(false), [location.pathname]);

  const logout = () => {
    localStorage.removeItem("token");
    setToken("");
    navigate("/");
  };

  const cartCount = Object.values(cartItems || {}).reduce((a, b) => a + (b > 0 ? b : 0), 0);
  const favCount = favorites?.length || 0;

  const isActive = (path, exact) =>
    exact ? location.pathname === path : location.pathname.startsWith(path);

  return (
    <>
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled ? "bg-white/95 backdrop-blur-xl shadow-lg shadow-black/5 border-b border-orange-50" : "bg-white/80 backdrop-blur-md"
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-18 py-3.5">

            {/* ── Logo ── */}
            <Link to="/" className="flex items-center gap-2.5 group flex-shrink-0">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center shadow-orange">
                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                </svg>
              </div>
              <span className="font-display font-bold text-xl text-slate-900 tracking-tight group-hover:text-orange-500 transition-colors">
                Tomato
              </span>
            </Link>

            {/* ── Desktop Nav ── */}
            <div className="hidden md:flex items-center bg-slate-50 rounded-2xl p-1 gap-0.5">
              {NAV_ITEMS.map(item => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`px-5 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                    isActive(item.path, item.exact)
                      ? "bg-white text-orange-500 shadow-sm font-semibold"
                      : "text-slate-500 hover:text-slate-900"
                  }`}
                >
                  {item.label}
                </Link>
              ))}
            </div>

            {/* ── Right Actions ── */}
            <div className="flex items-center gap-1.5">

              {/* Search */}
              <button
                onClick={() => navigate("/search")}
                className="hidden md:flex w-9 h-9 items-center justify-center rounded-xl text-slate-500 hover:bg-slate-100 hover:text-slate-900 transition-all duration-200"
                aria-label="Search"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
                </svg>
              </button>

              {/* Favorites — only when logged in */}
              {token && (
                <button
                  onClick={() => navigate("/favorites")}
                  className="hidden md:flex relative w-9 h-9 items-center justify-center rounded-xl text-slate-500 hover:bg-red-50 hover:text-red-500 transition-all duration-200"
                  aria-label="Favorites"
                >
                  <svg className="w-5 h-5" fill={favCount > 0 ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/>
                  </svg>
                  {favCount > 0 && (
                    <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                      {favCount > 9 ? '9+' : favCount}
                    </span>
                  )}
                </button>
              )}

              {/* Cart */}
              <Link
                to="/cart"
                className="relative flex items-center gap-2 px-3 py-2 rounded-xl bg-orange-50 hover:bg-orange-100 text-orange-600 transition-all duration-200"
                aria-label="Cart"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"/>
                </svg>
                <span className="hidden sm:block text-sm font-semibold">Cart</span>
                {cartCount > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-orange-500 text-white text-xs font-bold rounded-full flex items-center justify-center shadow-orange">
                    {cartCount > 9 ? '9+' : cartCount}
                  </span>
                )}
              </Link>

              {/* Auth */}
              {!token ? (
                <button
                  onClick={() => setShowLogin(true)}
                  className="hidden md:flex items-center gap-2 px-5 py-2.5 bg-slate-900 hover:bg-slate-700 text-white text-sm font-semibold rounded-xl transition-all duration-200 hover:shadow-lg"
                >
                  Sign in
                </button>
              ) : (
                <div className="relative group hidden md:block">
                  <button className="flex items-center gap-2 w-10 h-10 rounded-xl overflow-hidden ring-2 ring-orange-100 hover:ring-orange-300 transition-all duration-200" aria-label="Profile">
                    <img src={assets.profile_icon} alt="Profile" className="w-full h-full object-cover"/>
                  </button>
                  {/* Dropdown */}
                  <div className="absolute right-0 top-full mt-3 w-56 bg-white rounded-2xl shadow-2xl shadow-black/10 border border-slate-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 translate-y-2 group-hover:translate-y-0 pointer-events-none group-hover:pointer-events-auto">
                    <div className="p-2">
                      <div className="px-3 py-2 mb-1 border-b border-slate-50">
                        <p className="text-xs text-slate-400 font-medium">Signed in</p>
                      </div>

                      {[
                        { label: "My Profile",    path: "/profile",   icon: "👤", color: "hover:bg-slate-50 hover:text-slate-900" },
                        { label: "My Orders",     path: "/myorders",  icon: "📦", color: "hover:bg-orange-50 hover:text-orange-600" },
                        { label: "My Favorites",  path: "/favorites", icon: "❤️", color: "hover:bg-red-50 hover:text-red-600" },
                        { label: "Search",        path: "/search",    icon: "🔍", color: "hover:bg-slate-50 hover:text-slate-900" },
                      ].map(item => (
                        <button
                          key={item.path}
                          onClick={() => navigate(item.path)}
                          className={`flex items-center gap-3 w-full px-3 py-2.5 text-sm text-slate-700 ${item.color} rounded-xl transition-all duration-150`}
                        >
                          <span>{item.icon}</span>
                          <span className="font-medium">{item.label}</span>
                        </button>
                      ))}

                      <hr className="my-1.5 border-slate-100"/>

                      <button
                        onClick={logout}
                        className="flex items-center gap-3 w-full px-3 py-2.5 text-sm text-red-500 hover:bg-red-50 rounded-xl transition-all duration-150"
                      >
                        <span>🚪</span>
                        <span className="font-medium">Sign Out</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Mobile hamburger */}
              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className="md:hidden w-9 h-9 flex items-center justify-center rounded-xl bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors"
                aria-label="Menu"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  {mobileOpen
                    ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/>
                    : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16"/>}
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* ── Mobile Menu ── */}
        {mobileOpen && (
          <div className="md:hidden bg-white border-t border-slate-100 px-4 py-4 space-y-1 animate-fadeIn shadow-lg">
            {NAV_ITEMS.map(item => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-2xl font-medium text-sm transition-colors ${
                  isActive(item.path, item.exact)
                    ? "bg-orange-50 text-orange-600"
                    : "text-slate-700 hover:bg-slate-50"
                }`}
              >
                {item.label}
              </Link>
            ))}

            <div className="pt-2 border-t border-slate-100 space-y-1">
              <button onClick={() => navigate("/search")} className="flex items-center gap-3 w-full px-4 py-3 rounded-2xl text-slate-700 hover:bg-slate-50 font-medium text-sm">
                🔍 Search
              </button>

              {token ? (
                <>
                  <button onClick={() => navigate("/favorites")} className="flex items-center gap-3 w-full px-4 py-3 rounded-2xl text-slate-700 hover:bg-red-50 hover:text-red-600 font-medium text-sm">
                    ❤️ Favorites {favCount > 0 && <span className="ml-auto bg-red-500 text-white text-xs font-bold px-1.5 py-0.5 rounded-full">{favCount}</span>}
                  </button>
                  <button onClick={() => navigate("/profile")} className="flex items-center gap-3 w-full px-4 py-3 rounded-2xl text-slate-700 hover:bg-slate-50 font-medium text-sm">
                    👤 My Profile
                  </button>
                  <button onClick={() => navigate("/myorders")} className="flex items-center gap-3 w-full px-4 py-3 rounded-2xl text-slate-700 hover:bg-orange-50 hover:text-orange-600 font-medium text-sm">
                    📦 My Orders
                  </button>
                  <button onClick={logout} className="flex items-center gap-3 w-full px-4 py-3 rounded-2xl text-red-500 hover:bg-red-50 font-medium text-sm">
                    🚪 Sign Out
                  </button>
                </>
              ) : (
                <button
                  onClick={() => { setShowLogin(true); setMobileOpen(false); }}
                  className="w-full mt-1 py-3.5 bg-slate-900 text-white font-bold rounded-2xl text-sm transition-colors"
                >
                  Sign in
                </button>
              )}
            </div>
          </div>
        )}
      </nav>

      {/* Spacer */}
      <div className="h-[68px]" />
    </>
  );
};

export default Navbar;
