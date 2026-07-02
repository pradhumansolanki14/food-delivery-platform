import React, { useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { StoreContext } from '../../context/StoreContext'
import FoodItem from '../../components/FoodItem/FoodItem'

const Favorites = () => {
  const { url, token, favorites } = useContext(StoreContext)
  const [favFoods, setFavFoods] = useState([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    if (!token) { navigate('/'); return }
    fetchFavorites()
  }, [token, favorites]) // re-fetch whenever favorites list changes

  const fetchFavorites = async () => {
    setLoading(true)
    try {
      const res = await axios.get(`${url}/api/favorites`, { headers: { token } })
      if (res.data.success) setFavFoods(res.data.data)
    } catch (e) { console.log(e) }
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Page header */}
      <div className="bg-white border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate(-1)}
              className="w-9 h-9 rounded-xl bg-slate-100 hover:bg-slate-200 flex items-center justify-center transition-colors"
            >
              <svg className="w-5 h-5 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <div>
              <h1 className="font-display text-2xl font-bold text-slate-900 flex items-center gap-2">
                My Favorites
                <svg className="w-6 h-6 text-red-500" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </h1>
              <p className="text-slate-400 text-sm mt-0.5">
                {loading ? 'Loading...' : `${favFoods.length} saved item${favFoods.length !== 1 ? 's' : ''}`}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="bg-white rounded-3xl border border-slate-100 overflow-hidden animate-pulse">
                <div className="h-48 bg-slate-200" />
                <div className="p-4 space-y-2">
                  <div className="h-4 bg-slate-100 rounded-xl w-3/4" />
                  <div className="h-3 bg-slate-100 rounded-xl w-1/2" />
                  <div className="h-6 bg-slate-100 rounded-xl w-1/3 mt-3" />
                </div>
              </div>
            ))}
          </div>
        ) : favFoods.length === 0 ? (
          /* Empty state */
          <div className="flex flex-col items-center justify-center py-28">
            <div className="w-28 h-28 rounded-4xl bg-red-50 flex items-center justify-center mb-6" style={{ fontSize: '64px' }}>
              🤍
            </div>
            <h2 className="font-display text-2xl font-bold text-slate-900 mb-2">No favorites yet</h2>
            <p className="text-slate-400 text-sm text-center max-w-xs mb-8">
              Tap the ❤️ on any dish to save it here for quick access later.
            </p>
            <button
              onClick={() => navigate('/')}
              className="flex items-center gap-2 px-8 py-4 btn-primary text-white font-bold rounded-2xl shadow-orange text-sm"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253" />
              </svg>
              Explore Menu
            </button>
          </div>
        ) : (
          <>
            {/* Hint */}
            <div className="flex items-center gap-2.5 p-4 bg-red-50 border border-red-100 rounded-2xl mb-6">
              <svg className="w-4 h-4 text-red-400 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
                <path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
              <p className="text-xs text-red-600 font-medium">
                Tap the ❤️ on any card to remove it from favorites
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 sm:gap-6">
              {favFoods.map(item => (
                <FoodItem
                  key={item._id}
                  id={item._id}
                  name={item.name}
                  description={item.description}
                  price={item.price}
                  image={item.image}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default Favorites
