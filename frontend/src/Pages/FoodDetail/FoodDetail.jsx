import React, { useContext, useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { StoreContext } from '../../context/StoreContext'

// ─── Reviews Section ─────────────────────────────────────────
const ReviewsSection = ({ foodId, url, token }) => {
  const [reviews, setReviews] = useState([])
  const [average, setAverage] = useState(0)
  const [count, setCount] = useState(0)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ rating: 5, comment: '' })
  const [submitting, setSubmitting] = useState(false)
  const [msg, setMsg] = useState('')

  const fetchReviews = async () => {
    try {
      const res = await axios.get(`${url}/api/reviews/${foodId}`)
      if (res.data.success) { setReviews(res.data.data); setAverage(res.data.average); setCount(res.data.count) }
    } catch {}
  }

  useEffect(() => { fetchReviews() }, [foodId])

  const submitReview = async (e) => {
    e.preventDefault()
    if (!token) { setMsg('Sign in to leave a review'); return }
    setSubmitting(true); setMsg('')
    try {
      const res = await axios.post(`${url}/api/reviews`, { foodId, ...form }, { headers: { token } })
      if (res.data.success) { setMsg('✅ Review submitted!'); setShowForm(false); fetchReviews() }
      else setMsg(res.data.message)
    } catch { setMsg('Failed to submit') }
    setSubmitting(false)
  }

  const deleteReview = async (id) => {
    try {
      await axios.delete(`${url}/api/reviews/${id}`, { headers: { token } })
      fetchReviews()
    } catch {}
  }

  return (
    <div className="bg-white rounded-4xl border border-slate-100 shadow-card p-6 sm:p-8 animate-fadeUp">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="font-display text-2xl font-bold text-slate-900">Reviews</h2>
          <div className="flex items-center gap-2 mt-1">
            <div className="flex gap-0.5">
              {[1,2,3,4,5].map(s => (
                <svg key={s} className={`w-4 h-4 ${s <= Math.round(average) ? 'text-amber-400' : 'text-slate-200'}`} fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                </svg>
              ))}
            </div>
            <span className="text-sm font-bold text-slate-900">{average || '—'}</span>
            <span className="text-xs text-slate-400">({count} review{count !== 1 ? 's' : ''})</span>
          </div>
        </div>
        {token && (
          <button onClick={() => setShowForm(f => !f)}
            className="flex items-center gap-2 px-4 py-2.5 btn-primary text-white font-semibold rounded-xl shadow-orange text-sm">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"/></svg>
            Write Review
          </button>
        )}
      </div>

      {/* Review form */}
      {showForm && (
        <form onSubmit={submitReview} className="mb-6 p-5 bg-orange-50 border border-orange-100 rounded-2xl space-y-4 animate-fadeUp">
          <div>
            <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">Your Rating</label>
            <div className="flex gap-2">
              {[1,2,3,4,5].map(s => (
                <button key={s} type="button" onClick={() => setForm(f => ({...f, rating: s}))}
                  className={`w-10 h-10 rounded-xl text-xl transition-all ${form.rating >= s ? 'bg-amber-400 scale-110' : 'bg-white border border-slate-200 hover:bg-amber-50'}`}>
                  ⭐
                </button>
              ))}
              <span className="self-center text-sm font-semibold text-slate-600">{form.rating}/5</span>
            </div>
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5">Your Review</label>
            <textarea value={form.comment} onChange={e => setForm(f => ({...f, comment: e.target.value}))} required rows={3}
              placeholder="Share your experience with this dish..."
              className="w-full px-4 py-3 rounded-2xl border-2 border-slate-100 bg-white text-sm focus:outline-none focus:border-orange-300 transition-all resize-none" />
          </div>
          {msg && <p className={`text-xs font-medium ${msg.startsWith('✅') ? 'text-emerald-600' : 'text-red-500'}`}>{msg}</p>}
          <div className="flex gap-3">
            <button type="button" onClick={() => setShowForm(false)} className="flex-1 py-2.5 bg-white border border-slate-200 text-slate-700 font-semibold rounded-xl text-sm">Cancel</button>
            <button type="submit" disabled={submitting} className="flex-1 py-2.5 btn-primary text-white font-bold rounded-xl text-sm disabled:opacity-60">
              {submitting ? 'Submitting...' : 'Submit Review'}
            </button>
          </div>
        </form>
      )}

      {!token && <p className="text-sm text-slate-400 mb-4 italic">Sign in to leave a review.</p>}
      {msg && !showForm && <p className={`text-xs font-medium mb-4 ${msg.startsWith('✅') ? 'text-emerald-600' : 'text-red-500'}`}>{msg}</p>}

      {/* Reviews list */}
      {reviews.length === 0 ? (
        <div className="text-center py-10 text-slate-400">
          <div className="text-4xl mb-3">💬</div>
          <p className="font-medium text-slate-600">No reviews yet</p>
          <p className="text-sm">Be the first to share your experience!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {reviews.map((r, i) => (
            <div key={i} className="p-5 bg-slate-50 rounded-2xl border border-slate-100 group">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center text-white font-bold text-sm">
                    {r.name?.charAt(0)?.toUpperCase()}
                  </div>
                  <div>
                    <p className="font-semibold text-slate-900 text-sm">{r.name}</p>
                    <p className="text-xs text-slate-400">{new Date(r.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex gap-0.5">
                    {[1,2,3,4,5].map(s => (
                      <svg key={s} className={`w-3.5 h-3.5 ${s <= r.rating ? 'text-amber-400' : 'text-slate-200'}`} fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                      </svg>
                    ))}
                  </div>
                  {token && (
                    <button onClick={() => deleteReview(r._id)} className="opacity-0 group-hover:opacity-100 text-slate-300 hover:text-red-400 transition-all ml-1">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
                    </button>
                  )}
                </div>
              </div>
              <p className="text-sm text-slate-600 leading-relaxed">{r.comment}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

const RELATED_COUNT = 4

const FoodDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { url, cartItems, addToCart, removeFromCart, toggleFavorite, isFavorite, token, food_list } = useContext(StoreContext)

  const [food, setFood] = useState(null)
  const [loading, setLoading] = useState(true)
  const [imgLoaded, setImgLoaded] = useState(false)
  const [favAnimating, setFavAnimating] = useState(false)

  const qty = cartItems[id] || 0
  const fav = isFavorite(id)

  useEffect(() => {
    window.scrollTo(0, 0)
    fetchFood()
  }, [id])

  const fetchFood = async () => {
    setLoading(true)
    setImgLoaded(false)
    try {
      const res = await axios.get(`${url}/api/food/${id}`)
      if (res.data.success) setFood(res.data.data)
      else navigate('/404')
    } catch { navigate('/') }
    setLoading(false)
  }

  const handleFav = async () => {
    if (!token) return
    setFavAnimating(true)
    await toggleFavorite(id)
    setTimeout(() => setFavAnimating(false), 400)
  }

  // Related items — same category, excluding current
  const related = food
    ? food_list.filter(f => f.category === food.category && f._id !== id).slice(0, RELATED_COUNT)
    : []

  if (loading) return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10">
        <div className="grid md:grid-cols-2 gap-8 animate-pulse">
          <div className="aspect-square bg-slate-200 rounded-3xl" />
          <div className="space-y-4 py-6">
            <div className="h-8 bg-slate-200 rounded-2xl w-3/4" />
            <div className="h-4 bg-slate-100 rounded-xl w-1/3" />
            <div className="space-y-2 pt-4">
              <div className="h-3 bg-slate-100 rounded-xl" />
              <div className="h-3 bg-slate-100 rounded-xl w-5/6" />
              <div className="h-3 bg-slate-100 rounded-xl w-4/6" />
            </div>
            <div className="h-14 bg-slate-200 rounded-2xl mt-6" />
          </div>
        </div>
      </div>
    </div>
  )

  if (!food) return null

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Breadcrumb header */}
      <div className="bg-white border-b border-slate-100">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-4 flex items-center gap-2 text-sm">
          <button onClick={() => navigate('/')} className="text-slate-400 hover:text-orange-500 transition-colors">Home</button>
          <svg className="w-4 h-4 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
          <button onClick={() => navigate('/#explore-menu')} className="text-slate-400 hover:text-orange-500 transition-colors">{food.category}</button>
          <svg className="w-4 h-4 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
          <span className="text-slate-700 font-medium truncate max-w-xs">{food.name}</span>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
        {/* Main card */}
        <div className="bg-white rounded-4xl border border-slate-100 shadow-card overflow-hidden mb-10 animate-fadeUp">
          <div className="grid md:grid-cols-2 gap-0">
            {/* Image */}
            <div className="relative bg-slate-100 md:rounded-none" style={{ minHeight: '360px' }}>
              {!imgLoaded && (
                <div className="absolute inset-0 bg-gradient-to-br from-slate-200 via-slate-100 to-slate-200 animate-pulse" />
              )}
              <img
                src={`${url}/images/${food.image}`}
                alt={food.name}
                onLoad={() => setImgLoaded(true)}
                className={`w-full h-full object-cover transition-opacity duration-500 ${imgLoaded ? 'opacity-100' : 'opacity-0'}`}
                style={{ minHeight: '360px', maxHeight: '480px' }}
              />
              {/* Category pill on image */}
              <div className="absolute top-4 left-4">
                <span className="px-3 py-1.5 bg-white/90 backdrop-blur-sm text-xs font-bold text-slate-700 rounded-xl shadow-sm">
                  {food.category}
                </span>
              </div>
              {/* Fav button on image */}
              <button
                onClick={handleFav}
                className={`absolute top-4 right-4 w-10 h-10 rounded-2xl flex items-center justify-center transition-all duration-300 shadow-md ${
                  fav ? 'bg-red-500 scale-110' : 'bg-white/90 backdrop-blur-sm hover:bg-red-50'
                } ${favAnimating ? 'scale-125' : ''}`}
              >
                <svg
                  className={`w-5 h-5 transition-colors ${fav ? 'text-white' : 'text-slate-500 hover:text-red-400'}`}
                  fill={fav ? 'currentColor' : 'none'}
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </button>
            </div>

            {/* Info panel */}
            <div className="p-6 sm:p-8 flex flex-col justify-between">
              <div>
                {/* Rating row */}
                <div className="flex items-center gap-3 mb-4">
                  <div className="flex items-center gap-1">
                    {[1,2,3,4,5].map(i => (
                      <svg key={i} className={`w-4 h-4 ${i <= 4 ? 'text-amber-400' : 'text-slate-200'}`} fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                  <span className="text-sm font-semibold text-slate-700">4.8</span>
                  <span className="text-xs text-slate-400">(120+ reviews)</span>
                </div>

                {/* Name */}
                <h1 className="font-display text-3xl sm:text-4xl font-bold text-slate-900 leading-tight mb-3">
                  {food.name}
                </h1>

                {/* Badges */}
                <div className="flex flex-wrap gap-2 mb-5">
                  <span className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 text-emerald-600 text-xs font-semibold rounded-xl border border-emerald-100">
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    25–30 min delivery
                  </span>
                  <span className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 text-blue-600 text-xs font-semibold rounded-xl border border-blue-100">
                    🍽️ {food.category}
                  </span>
                  <span className="flex items-center gap-1.5 px-3 py-1.5 bg-orange-50 text-orange-600 text-xs font-semibold rounded-xl border border-orange-100">
                    🔥 Popular
                  </span>
                </div>

                {/* Description */}
                <p className="text-slate-500 text-sm sm:text-base leading-relaxed mb-6">
                  {food.description}
                </p>

                {/* Nutritional/info strip */}
                <div className="grid grid-cols-3 gap-3 mb-6 p-4 bg-slate-50 rounded-2xl">
                  {[
                    { label: 'Calories', value: '~450 kcal' },
                    { label: 'Prep Time', value: '15 min' },
                    { label: 'Serving', value: '1 person' },
                  ].map((info, i) => (
                    <div key={i} className="text-center">
                      <p className="text-sm font-bold text-slate-900">{info.value}</p>
                      <p className="text-xs text-slate-400 mt-0.5">{info.label}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Price + Cart */}
              <div>
                {/* Price */}
                <div className="flex items-baseline gap-2 mb-5">
                  <span className="font-display font-bold text-4xl text-slate-900">${food.price}</span>
                  <span className="text-slate-400 text-sm">per serving</span>
                </div>

                {/* Cart control */}
                {qty === 0 ? (
                  <button
                    onClick={() => addToCart(id)}
                    className="w-full py-4 btn-primary text-white font-bold rounded-2xl shadow-orange text-base flex items-center justify-center gap-3 transition-all duration-200 hover:scale-[1.02]"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                    </svg>
                    Add to Cart
                  </button>
                ) : (
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-3 bg-slate-50 border-2 border-slate-100 rounded-2xl px-2 py-2">
                      <button
                        onClick={() => removeFromCart(id)}
                        className="w-10 h-10 rounded-xl bg-white shadow-sm flex items-center justify-center hover:bg-red-50 transition-colors border border-slate-100"
                      >
                        <svg className="w-4 h-4 text-slate-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M20 12H4" />
                        </svg>
                      </button>
                      <span className="text-xl font-display font-bold text-slate-900 w-8 text-center">{qty}</span>
                      <button
                        onClick={() => addToCart(id)}
                        className="w-10 h-10 rounded-xl bg-orange-500 hover:bg-orange-600 flex items-center justify-center transition-colors shadow-sm"
                      >
                        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
                        </svg>
                      </button>
                    </div>
                    <div className="flex-1">
                      <p className="text-xs text-slate-400 font-medium">Subtotal</p>
                      <p className="text-xl font-display font-bold text-orange-500">${(food.price * qty).toFixed(2)}</p>
                    </div>
                    <button
                      onClick={() => navigate('/cart')}
                      className="px-5 py-3 bg-slate-900 hover:bg-slate-700 text-white font-bold rounded-2xl text-sm transition-all"
                    >
                      View Cart →
                    </button>
                  </div>
                )}

                {!token && (
                  <p className="text-xs text-slate-400 mt-3 text-center">
                    Sign in to save to favorites & sync your cart
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Related dishes */}
        {related.length > 0 && (
          <div className="animate-fadeUp">
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-display text-2xl font-bold text-slate-900">
                More <span className="text-gradient">{food.category}</span> dishes
              </h2>
              <button onClick={() => navigate('/')} className="text-sm font-semibold text-orange-500 hover:underline">See all →</button>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {related.map(item => (
                <div key={item._id} onClick={() => navigate(`/food/${item._id}`)}
                  className="bg-white rounded-3xl border border-slate-100 shadow-sm hover:shadow-card hover:-translate-y-1 transition-all duration-300 overflow-hidden cursor-pointer group">
                  <div className="relative overflow-hidden" style={{ paddingBottom: '70%' }}>
                    <img src={`${url}/images/${item.image}`} alt={item.name}
                      className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                  </div>
                  <div className="p-3">
                    <p className="font-semibold text-slate-900 text-sm truncate group-hover:text-orange-500 transition-colors">{item.name}</p>
                    <p className="text-orange-500 font-bold text-sm mt-0.5">${item.price}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Reviews */}
        <ReviewsSection foodId={id} url={url} token={token} />
      </div>
    </div>
  )
}

export default FoodDetail
