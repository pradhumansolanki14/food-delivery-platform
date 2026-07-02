import React, { useContext, useState } from 'react'
import { StoreContext } from '../../context/StoreContext'
import { useNavigate } from 'react-router-dom'

const FoodItem = ({ id, name, price, description, image }) => {
  const { cartItems, addToCart, removeFromCart, url, toggleFavorite, isFavorite, token } = useContext(StoreContext)
  const [imgLoaded, setImgLoaded] = useState(false)
  const [favAnimating, setFavAnimating] = useState(false)
  const navigate = useNavigate()
  const qty = cartItems[id] || 0
  const fav = isFavorite(id)

  const handleFav = async (e) => {
    e.stopPropagation()
    if (!token) { return } // could trigger login popup — left to parent
    setFavAnimating(true)
    await toggleFavorite(id)
    setTimeout(() => setFavAnimating(false), 400)
  }

  return (
    <div
      className="group bg-white rounded-3xl overflow-hidden border border-slate-100 shadow-card card-hover cursor-pointer animate-fadeUp"
      onClick={() => navigate(`/food/${id}`)}
    >
      {/* Image */}
      <div className="relative overflow-hidden bg-slate-100" style={{ paddingBottom: '68%' }}>
        {!imgLoaded && (
          <div className="absolute inset-0 bg-gradient-to-r from-slate-200 via-slate-100 to-slate-200 animate-pulse" />
        )}
        <img
          src={url + "/images/" + image}
          alt={name}
          onLoad={() => setImgLoaded(true)}
          className={`absolute inset-0 w-full h-full object-cover transition-all duration-700 group-hover:scale-110 ${imgLoaded ? 'opacity-100' : 'opacity-0'}`}
        />

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* Top badges */}
        <div className="absolute top-3 left-3">
          <span className="px-2.5 py-1 bg-white/90 backdrop-blur-sm text-xs font-semibold text-slate-700 rounded-lg shadow-sm">⭐ 4.8</span>
        </div>

        {/* Favorite heart */}
        <button
          onClick={handleFav}
          className={`absolute top-3 right-3 w-8 h-8 rounded-xl flex items-center justify-center transition-all duration-200 z-10 ${
            fav ? 'bg-red-500 shadow-lg scale-110' : 'bg-white/90 backdrop-blur-sm opacity-0 group-hover:opacity-100'
          } ${favAnimating ? 'scale-125' : ''}`}
          aria-label={fav ? "Remove from favorites" : "Add to favorites"}
        >
          <svg className={`w-4 h-4 transition-colors ${fav ? 'text-white' : 'text-slate-500'}`} fill={fav ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
        </button>

        {/* Delivery time */}
        <div className="absolute bottom-10 right-3 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-1 group-hover:translate-y-0">
          <span className="flex items-center gap-1 px-2.5 py-1 bg-white/90 backdrop-blur-sm text-xs font-semibold text-slate-700 rounded-lg shadow-sm">
            <svg className="w-3 h-3 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            25 min
          </span>
        </div>

        {/* Cart controls */}
        <div className="absolute bottom-3 right-3" onClick={e => e.stopPropagation()}>
          {qty === 0 ? (
            <button
              onClick={() => addToCart(id)}
              className="w-10 h-10 btn-primary text-white rounded-2xl flex items-center justify-center shadow-orange opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0 hover:scale-110"
              aria-label={`Add ${name} to cart`}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
              </svg>
            </button>
          ) : (
            <div className="flex items-center gap-1.5 bg-white rounded-2xl p-1 shadow-card border border-slate-100">
              <button onClick={() => removeFromCart(id)} className="w-7 h-7 rounded-xl bg-slate-100 hover:bg-red-100 flex items-center justify-center transition-colors">
                <svg className="w-3.5 h-3.5 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M20 12H4" />
                </svg>
              </button>
              <span className="w-6 text-center text-sm font-bold text-slate-900">{qty}</span>
              <button onClick={() => addToCart(id)} className="w-7 h-7 rounded-xl bg-orange-500 hover:bg-orange-600 flex items-center justify-center transition-colors">
                <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
                </svg>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Info */}
      <div className="p-4">
        <div className="flex items-start justify-between gap-2 mb-1.5">
          <h3 className="font-display font-bold text-slate-900 text-base leading-tight line-clamp-1 group-hover:text-orange-500 transition-colors">{name}</h3>
          <div className="flex-shrink-0 flex items-center gap-0.5">
            <svg className="w-3.5 h-3.5 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            <span className="text-xs font-semibold text-slate-500">4.8</span>
          </div>
        </div>
        <p className="text-xs text-slate-400 leading-relaxed line-clamp-2 mb-3">{description}</p>
        <div className="flex items-center justify-between">
          <div>
            <span className="text-xl font-display font-bold text-slate-900">${price}</span>
            <span className="text-xs text-slate-400 ml-1">/ serving</span>
          </div>
          {qty > 0 && (
            <span className="text-xs font-semibold text-orange-500 bg-orange-50 px-2.5 py-1 rounded-lg">{qty} in cart</span>
          )}
        </div>
      </div>
    </div>
  )
}

export default FoodItem
