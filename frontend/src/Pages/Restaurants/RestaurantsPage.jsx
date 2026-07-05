import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { FiSliders, FiX, FiInfo } from 'react-icons/fi';
import { StoreContext } from '../../context/StoreContext';
import RestaurantCard from '../../components/RestaurantCard/RestaurantCard';
import { Container, SearchInput, Skeleton, Button } from '../../components/ui';

const RestaurantsPage = () => {
  const { url } = useContext(StoreContext);
  const [restaurants, setRestaurants] = useState([]);
  const [cuisines, setCuisines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCuisine, setSelectedCuisine] = useState('');
  const [search, setSearch] = useState('');

  const fetchRestaurants = async (cuisineId) => {
    setLoading(true);
    try {
      const params = cuisineId ? `?cuisineId=${cuisineId}` : '';
      const res = await axios.get(`${url}/api/food/restaurants${params}`);
      if (res.data.success) {
        setRestaurants(res.data.data);
      }
    } catch {
      setRestaurants([]);
    }
    setLoading(false);
  };

  const fetchCuisines = async () => {
    try {
      const res = await axios.get(`${url}/api/cuisines`);
      if (res.data.success) setCuisines(res.data.data);
    } catch {}
  };

  useEffect(() => {
    fetchCuisines();
    fetchRestaurants('');
    window.scrollTo(0, 0);
  }, []);

  const handleCuisineChange = (id) => {
    setSelectedCuisine(id);
    fetchRestaurants(id);
  };

  // Client-side search filter by name or cuisine text
  const filtered = restaurants.filter(r => {
    if (!search) return true;
    const q = search.toLowerCase();
    return r.name?.toLowerCase().includes(q) || r.cuisine?.toLowerCase().includes(q);
  });

  return (
    <div className="min-h-screen bg-slate-50">
      
      {/* ── Page Header ── */}
      <div className="bg-white border-b border-slate-100">
        <Container className="py-12">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div>
              <h1 className="font-poppins font-extrabold text-3xl sm:text-4xl text-slate-900 tracking-tight mb-2">
                All Restaurants
              </h1>
              <p className="text-slate-400 text-sm font-semibold">
                {loading ? 'Searching kitchens...' : `${filtered.length} culinary kitchen${filtered.length !== 1 ? 's' : ''} available`}
              </p>
            </div>
            
            {/* Search Input Box */}
            <div className="w-full md:w-80">
              <SearchInput
                placeholder="Search restaurants or cuisines..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                onClear={() => setSearch('')}
              />
            </div>
          </div>
        </Container>
      </div>

      {/* ── Main Content Area ── */}
      <Container className="py-8">
        
        {/* Cuisine Filter Scroll Strip */}
        {cuisines.length > 0 && (
          <div className="flex items-center gap-2.5 overflow-x-auto pb-3 mb-8 scrollbar-hide">
            <button
              onClick={() => handleCuisineChange('')}
              className={`flex-shrink-0 flex items-center gap-2 px-5 py-2.5 rounded-2xl text-xs font-bold uppercase tracking-wider transition-all duration-300 ${
                !selectedCuisine
                  ? 'bg-slate-900 text-white shadow-md'
                  : 'bg-white border border-slate-200 text-slate-500 hover:border-emerald-300 hover:text-emerald-600'
              }`}
            >
              <FiSliders className="text-sm" />
              All Cuisines
            </button>
            {cuisines.map(c => (
              <button
                key={c._id}
                onClick={() => handleCuisineChange(c._id)}
                className={`flex-shrink-0 flex items-center gap-2 px-5 py-2.5 rounded-2xl text-xs font-bold uppercase tracking-wider transition-all duration-300 ${
                  selectedCuisine === c._id
                    ? 'bg-emerald-500 text-white shadow-emerald'
                    : 'bg-white border border-slate-200 text-slate-500 hover:border-emerald-300 hover:text-emerald-600'
                }`}
              >
                {c.icon && <span className="text-sm">{c.icon}</span>}
                <span>{c.name}</span>
              </button>
            ))}
          </div>
        )}

        {/* ── Restaurant Grid ── */}
        <AnimatePresence mode="wait">
          {loading ? (
            <motion.div 
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
            >
              {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
                <div key={i} className="bg-white rounded-3xl border border-slate-100 overflow-hidden p-4 space-y-4 shadow-sm">
                  <Skeleton variant="card" />
                  <Skeleton variant="title" className="w-2/3" />
                  <Skeleton variant="text" className="w-1/2" />
                  <div className="flex gap-2 pt-2">
                    <Skeleton variant="text" className="w-1/3" />
                    <Skeleton variant="text" className="w-1/3" />
                  </div>
                </div>
              ))}
            </motion.div>
          ) : filtered.length === 0 ? (
            <motion.div 
              key="empty"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="flex flex-col items-center justify-center py-20 text-center max-w-sm mx-auto bg-white border border-slate-100/80 rounded-3xl shadow-card p-8"
            >
              <div className="w-16 h-16 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-600 mb-5">
                <FiInfo size={28} />
              </div>
              <h3 className="font-poppins font-bold text-slate-800 text-lg mb-2">
                {search ? 'No Match Found' : 'No Kitchens Online'}
              </h3>
              <p className="text-slate-400 text-sm leading-relaxed mb-6">
                {search ? 'Try checking your spelling or search for another keyword.' : 'Check back later for active culinary kitchens.'}
              </p>
              {(search || selectedCuisine) && (
                <Button
                  onClick={() => { setSearch(''); handleCuisineChange(''); }}
                  variant="primary"
                  size="md"
                  className="font-bold shadow-emerald-lg"
                >
                  Clear Filters
                </Button>
              )}
            </motion.div>
          ) : (
            <motion.div 
              key="grid"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
            >
              {filtered.map((r, idx) => (
                <motion.div
                  key={r._id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: idx * 0.05 }}
                >
                  <RestaurantCard restaurant={r} url={url} />
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

      </Container>
    </div>
  );
};

export default RestaurantsPage;
