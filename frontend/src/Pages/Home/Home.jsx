import React, { useState, useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { StoreContext } from '../../context/StoreContext'
import { menu_list } from '../../assets/assets'
import FoodItem from '../../components/FoodItem/FoodItem'

/* ─── Hero ─────────────────────────────────────────────── */
const Hero = ({ setShowLogin }) => {
  const { token } = useContext(StoreContext)
  const navigate = useNavigate()
  return (
    <section className="relative min-h-[90vh] flex items-center overflow-hidden bg-white">
      {/* Blobs */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full opacity-20 pointer-events-none" style={{ background: 'radial-gradient(circle, #fed7aa 0%, transparent 70%)', transform: 'translate(20%,-20%)' }} />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full opacity-15 pointer-events-none" style={{ background: 'radial-gradient(circle, #d1fae5 0%, transparent 70%)', transform: 'translate(-30%,30%)' }} />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-16 lg:py-24">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left */}
          <div className="order-2 lg:order-1">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-orange-50 border border-orange-100 rounded-2xl mb-6 animate-fadeUp">
              <span className="w-2 h-2 bg-orange-400 rounded-full animate-pulse" />
              <span className="text-sm font-semibold text-orange-600">Now delivering in 30 minutes</span>
            </div>
            <h1 className="font-display text-5xl sm:text-6xl lg:text-7xl font-bold text-slate-900 leading-[1.05] tracking-tight mb-6 animate-fadeUp delay-100">
              Delicious{' '}
              <span className="relative inline-block">
                <span className="text-gradient">food</span>
                <svg className="absolute -bottom-2 left-0 w-full" height="8" viewBox="0 0 200 8" fill="none">
                  <path d="M2 6C40 2 100 1 198 6" stroke="#f97316" strokeWidth="3" strokeLinecap="round" />
                </svg>
              </span>{' '}
              at your door
            </h1>
            <p className="text-lg text-slate-500 leading-relaxed max-w-md mb-8 animate-fadeUp delay-200">
              From your favorite local restaurants to hidden gems — hot, fresh, and delivered fast. Pick your craving and we&apos;ll handle the rest.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 mb-10 animate-fadeUp delay-300">
              <button
                onClick={() => navigate('/menu')}
                className="flex items-center justify-center gap-2 px-8 py-4 btn-primary text-white font-bold rounded-2xl text-sm shadow-orange"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253" />
                </svg>
                Browse Full Menu
              </button>
              {!token && (
                <button
                  onClick={() => setShowLogin && setShowLogin(true)}
                  className="flex items-center justify-center gap-2 px-8 py-4 bg-slate-100 hover:bg-slate-200 text-slate-900 font-bold rounded-2xl text-sm transition-all"
                >
                  Sign in to order
                </button>
              )}
            </div>
            <div className="grid grid-cols-4 gap-4 animate-fadeUp delay-400">
              {[{ v: "50K+", l: "Happy Customers" }, { v: "200+", l: "Menu Items" }, { v: "30 min", l: "Avg Delivery" }, { v: "4.9★", l: "App Rating" }].map((s, i) => (
                <div key={i} className="text-center">
                  <p className="text-xl font-display font-bold text-slate-900">{s.v}</p>
                  <p className="text-xs text-slate-400 mt-0.5 leading-tight">{s.l}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Right — hero image */}
          <div className="order-1 lg:order-2 relative flex items-center justify-center animate-fadeIn">
            <div className="relative w-full max-w-lg mx-auto">
              <div className="absolute inset-0 rounded-full" style={{ background: 'linear-gradient(135deg, #fff7ed, #fef3c7)', transform: 'scale(0.9)' }} />
              <img src="/header_img.png" alt="Delicious Food" className="relative w-full h-auto object-contain drop-shadow-2xl animate-float" style={{ maxHeight: '480px' }} />
              <div className="absolute top-8 -left-4 sm:-left-12 bg-white rounded-2xl p-3.5 shadow-card border border-slate-100 animate-scaleIn delay-300">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-orange-100 flex items-center justify-center text-lg">🍕</div>
                  <div><p className="text-xs font-bold text-slate-900">Pizza Margherita</p><p className="text-xs text-emerald-500 font-semibold">Ready in 20 min</p></div>
                </div>
              </div>
              <div className="absolute bottom-12 -right-4 sm:-right-10 bg-white rounded-2xl p-3.5 shadow-card border border-slate-100 animate-scaleIn delay-500">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-orange-300 to-orange-500 flex items-center justify-center text-white font-bold text-sm">JD</div>
                  <div>
                    <p className="text-xs font-bold text-slate-900">Order Confirmed!</p>
                    <div className="flex gap-0.5 mt-0.5">{[1,2,3,4,5].map(i=><svg key={i} className="w-3 h-3 text-amber-400" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>)}</div>
                  </div>
                </div>
              </div>
              <div className="absolute top-16 -right-2 sm:right-4 bg-emerald-500 text-white rounded-2xl px-3 py-2 shadow-green animate-scaleIn delay-200">
                <p className="text-xs font-bold">Free Delivery</p><p className="text-[10px] opacity-80">on first order</p>
              </div>
            </div>
          </div>
        </div>

        {/* Quick pick pills */}
        <div className="mt-14 flex items-center gap-3 overflow-x-auto pb-2 scrollbar-hide animate-fadeUp delay-500">
          <span className="text-xs font-semibold text-slate-400 whitespace-nowrap uppercase tracking-wider">Quick pick:</span>
          {["🍔 Burgers", "🍕 Pizza", "🍜 Noodles", "🥗 Salads", "🍰 Desserts", "🌮 Wraps"].map((c, i) => (
            <button key={i} onClick={() => navigate('/menu')}
              className="flex-shrink-0 px-4 py-2 bg-slate-50 hover:bg-orange-50 border border-slate-200 hover:border-orange-200 text-sm font-medium text-slate-600 hover:text-orange-600 rounded-xl transition-all duration-200">
              {c}
            </button>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ─── Category Section ─────────────────────────────────── */
const CategoriesSection = () => {
  const navigate = useNavigate()
  return (
    <section className="py-16 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-10">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-orange-50 border border-orange-100 rounded-xl mb-3">
              <span className="text-xs font-bold text-orange-500 uppercase tracking-widest">Categories</span>
            </div>
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-slate-900">What are you <span className="text-gradient">craving?</span></h2>
          </div>
          <button onClick={() => navigate('/menu')} className="hidden sm:flex items-center gap-1.5 text-sm font-semibold text-orange-500 hover:underline">
            View all <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3"/></svg>
          </button>
        </div>
        <div className="grid grid-cols-4 sm:grid-cols-8 gap-3">
          {menu_list.map((item, index) => (
            <button key={index} onClick={() => navigate('/menu')}
              className="group flex flex-col items-center gap-3 p-3 sm:p-4 rounded-2xl border-2 border-slate-100 bg-white hover:border-orange-200 hover:scale-105 hover:shadow-card transition-all duration-300">
              <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-xl overflow-hidden">
                <img src={item.menu_image} alt={item.menu_name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
              </div>
              <span className="text-xs font-semibold text-slate-700 group-hover:text-orange-500 text-center leading-tight transition-colors">{item.menu_name}</span>
            </button>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ─── Featured Dishes (top 8 from food_list) ───────────── */
const FeaturedSection = () => {
  const { food_list } = useContext(StoreContext)
  const navigate = useNavigate()
  const featured = food_list.slice(0, 8)

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-8">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-emerald-50 border border-emerald-100 rounded-xl mb-3">
              <span className="text-xs font-bold text-emerald-500 uppercase tracking-widest">Popular</span>
            </div>
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-slate-900">Top dishes <span className="text-gradient">near you</span></h2>
          </div>
          <button onClick={() => navigate('/menu')} className="hidden sm:flex items-center gap-1.5 text-sm font-semibold text-orange-500 hover:underline">
            See all menu <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3"/></svg>
          </button>
        </div>
        {featured.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-slate-400">
            <div className="text-5xl mb-4">🍽️</div>
            <p className="text-lg font-semibold text-slate-600">Menu loading...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 sm:gap-6">
            {featured.map(item => (
              <FoodItem key={item._id} id={item._id} name={item.name} description={item.description} price={item.price} image={item.image} />
            ))}
          </div>
        )}
        <div className="mt-10 text-center">
          <button onClick={() => navigate('/menu')} className="inline-flex items-center gap-2 px-8 py-4 bg-slate-900 hover:bg-slate-700 text-white font-bold rounded-2xl text-sm transition-all duration-200 hover:shadow-lg">
            View Full Menu
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3"/></svg>
          </button>
        </div>
      </div>
    </section>
  )
}

/* ─── How It Works ─────────────────────────────────────── */
const HowItWorks = () => (
  <section className="py-20 bg-slate-50">
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
      <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-slate-100 rounded-xl mb-4">
        <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">How it works</span>
      </div>
      <h2 className="font-display text-3xl sm:text-4xl font-bold text-slate-900 mb-14">Order in 3 easy steps</h2>
      <div className="grid sm:grid-cols-3 gap-8">
        {[
          { step: "1", icon: "🛍️", title: "Choose your food", desc: "Browse hundreds of dishes across 8 categories. Find exactly what you're craving." },
          { step: "2", icon: "💳", title: "Place your order", desc: "Add to cart, enter your address, and pay securely in seconds." },
          { step: "3", icon: "🚀", title: "Fast delivery", desc: "Track your order live. Fresh food delivered hot, right to your door." },
        ].map((s, i) => (
          <div key={i} className="flex flex-col items-center">
            <div className="relative w-20 h-20 rounded-3xl bg-white border-2 border-orange-100 flex items-center justify-center text-3xl mb-5 shadow-card">
              {s.icon}
              <span className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-orange-500 text-white text-xs font-bold flex items-center justify-center">{s.step}</span>
            </div>
            <h3 className="font-display font-bold text-slate-900 mb-2">{s.title}</h3>
            <p className="text-slate-400 text-sm leading-relaxed">{s.desc}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
)

/* ─── Testimonials ─────────────────────────────────────── */
const reviews = [
  { name: "Sarah M.", rating: 5, text: "Ordered 3 times this week already. The food arrives hot and exactly as described. Absolutely love the Caesar salad!", avatar: "SM" },
  { name: "James K.", rating: 5, text: "Best food delivery app I've used. The live tracking is so satisfying to watch. Delivery was 22 minutes!", avatar: "JK" },
  { name: "Priya L.", rating: 5, text: "Amazing variety and the pasta dishes are restaurant-quality. The favorites feature is so handy.", avatar: "PL" },
]

const Testimonials = () => (
  <section className="py-20 bg-white">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-14">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-amber-50 border border-amber-100 rounded-xl mb-4">
          <span className="text-xs font-bold text-amber-600 uppercase tracking-widest">Reviews</span>
        </div>
        <h2 className="font-display text-3xl sm:text-4xl font-bold text-slate-900">What our customers say</h2>
      </div>
      <div className="grid sm:grid-cols-3 gap-6">
        {reviews.map((r, i) => (
          <div key={i} className="bg-slate-50 rounded-3xl border border-slate-100 p-6 hover:shadow-card transition-all duration-300 hover:-translate-y-1">
            <div className="flex gap-0.5 mb-4">
              {[1,2,3,4,5].map(s => <svg key={s} className="w-4 h-4 text-amber-400" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>)}
            </div>
            <p className="text-slate-700 text-sm leading-relaxed mb-5 italic">&ldquo;{r.text}&rdquo;</p>
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center text-white font-bold text-xs">{r.avatar}</div>
              <div>
                <p className="font-semibold text-slate-900 text-sm">{r.name}</p>
                <p className="text-xs text-slate-400">Verified customer</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
)

/* ─── App CTA Banner ───────────────────────────────────── */
const AppCTA = () => {
  const navigate = useNavigate()
  return (
    <section className="py-16 bg-slate-900 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none opacity-5" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.1) 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] rounded-full opacity-10 pointer-events-none" style={{ background: 'radial-gradient(circle, #f97316 0%, transparent 70%)' }} />
      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="font-display text-3xl sm:text-4xl font-bold text-white mb-3">
          Better on the <span className="text-gradient">app</span>
        </h2>
        <p className="text-slate-400 text-base mb-8 max-w-md mx-auto">
          Download Tomato for live order tracking, exclusive deals, and lightning-fast checkout.
        </p>
        <button onClick={() => navigate('/app')} className="inline-flex items-center gap-2 px-8 py-4 btn-primary text-white font-bold rounded-2xl shadow-orange text-sm">
          📱 Get the App
        </button>
      </div>
    </section>
  )
}

/* ─── Main Home page ────────────────────────────────────── */
const Home = ({ setShowLogin }) => {
  return (
    <div className="bg-white">
      <Hero setShowLogin={setShowLogin} />
      <CategoriesSection />
      <FeaturedSection />
      <HowItWorks />
      <Testimonials />
      <AppCTA />
    </div>
  )
}

export default Home
