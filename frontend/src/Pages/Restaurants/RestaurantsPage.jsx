import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import * as FiIcons from 'react-icons/fi';
import { StoreContext } from '../../context/StoreContext';
import RestaurantCard from '../../components/RestaurantCard/RestaurantCard';
import { Container, Skeleton, Button } from '../../components/ui';

const RestaurantsPage = () => {
  const { url } = useContext(StoreContext);
  const [restaurants, setRestaurants] = useState([]);
  const [cuisines, setCuisines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCuisine, setSelectedCuisine] = useState('');
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  
  // Pagination State
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const limit = 8;

  // Debounce search input to avoid redundant API requests
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1); // Reset page to 1 when search term changes
    }, 400);
    return () => clearTimeout(timer);
  }, [search]);

  const fetchRestaurants = async (pageNum, cuisineId, searchVal) => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (cuisineId) params.set('cuisineId', cuisineId);
      if (searchVal) params.set('search', searchVal);
      params.set('page', pageNum);
      params.set('limit', limit);

      const res = await axios.get(`${url}/api/food/restaurants?${params.toString()}`);
      if (res.data.success) {
        setRestaurants(res.data.data || []);
        setTotalPages(res.data.pagination?.pages || 1);
        setTotalItems(res.data.pagination?.total || 0);
      }
    } catch {
      setRestaurants([]);
      setTotalPages(1);
      setTotalItems(0);
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
    window.scrollTo(0, 0);
  }, []);

  // Fetch paginated data when page, cuisine, or search values shift
  useEffect(() => {
    fetchRestaurants(page, selectedCuisine, debouncedSearch);
  }, [page, selectedCuisine, debouncedSearch]);

  const handleCuisineChange = (id) => {
    setSelectedCuisine(id);
    setPage(1); // Reset to first page on category change
  };

  return (
    <div className="min-h-screen bg-slate-50/50">
      
      {/* ─── Compact Header ─── */}
      <div className="bg-white border-b border-slate-100 py-5">
        <Container>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="font-poppins font-extrabold text-2xl text-slate-900 tracking-tight">
                Gourmet <span className="text-emerald-600">Kitchens</span>
              </h1>
              <p className="text-slate-400 text-[11px] font-bold uppercase tracking-wider mt-0.5">
                {loading ? 'Searching kitchens...' : `${totalItems} kitchens available near you`}
              </p>
            </div>
            
            {/* Inline Compact Search */}
            <div className="w-full md:w-80">
              <div className="flex items-center gap-2.5 bg-slate-50 rounded-xl px-3.5 py-2.5 border border-slate-200 focus-within:ring-2 focus-within:ring-emerald-500/20 focus-within:border-emerald-500 transition-all duration-300">
                <FiIcons.FiSearch className="text-slate-400 flex-shrink-0" size={16} />
                <input 
                  type="text" 
                  value={search} 
                  onChange={e => setSearch(e.target.value)}
                  placeholder="Search kitchens, cuisines..."
                  className="flex-1 bg-transparent text-xs text-slate-800 placeholder-slate-400 outline-none font-semibold" 
                />
                {search && (
                  <button 
                    onClick={() => setSearch('')} 
                    className="text-slate-400 hover:text-slate-700 p-0.5 hover:bg-slate-200 rounded-md transition-all"
                    aria-label="Clear search"
                  >
                    <FiIcons.FiX size={14} />
                  </button>
                )}
              </div>
            </div>
          </div>
        </Container>
      </div>

      {/* ─── Main Grid Selection ─── */}
      <Container className="py-6">
        
        {/* Cuisine Filter Scroll Strip (highly compact) */}
        {cuisines.length > 0 && (
          <div className="flex items-center gap-2 overflow-x-auto pb-1 mb-6 scrollbar-hide">
            <button
              onClick={() => handleCuisineChange('')}
              className={`flex-shrink-0 flex items-center gap-2 px-3 py-1.5 rounded-xl text-2xs font-bold uppercase tracking-wider transition-all duration-200 border ${
                !selectedCuisine
                  ? 'bg-slate-900 text-white border-slate-900 shadow-sm'
                  : 'bg-white border-slate-200 text-slate-600 hover:border-slate-350 hover:text-slate-805'
              }`}
            >
              <div className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 ${
                !selectedCuisine ? 'bg-white/10 text-white' : 'bg-slate-50 border border-slate-150 text-slate-450'
              }`}>
                <FiIcons.FiGrid size={13} />
              </div>
              <span>All Cuisines</span>
            </button>
            {cuisines.map(c => {
              const isSelected = selectedCuisine === c._id;
              return (
                <button
                  key={c._id}
                  onClick={() => handleCuisineChange(c._id)}
                  className={`flex-shrink-0 flex items-center gap-2 px-3 py-1.5 rounded-xl text-2xs font-bold uppercase tracking-wider transition-all duration-200 border ${
                    isSelected
                      ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                      : 'bg-white border-slate-200 text-slate-600 hover:border-slate-350 hover:text-slate-805'
                  }`}
                >
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 transition-colors ${
                    isSelected 
                      ? 'bg-emerald-500/20 text-emerald-100' 
                      : 'bg-slate-50 border border-slate-150 text-slate-450'
                  }`}>
                    {c.image ? (
                      <img 
                        src={c.image} 
                        alt={c.name} 
                        className="w-full h-full rounded-full object-cover"
                        onError={(e) => { e.target.style.display = 'none'; }}
                      />
                    ) : (
                      <FiIcons.FiGlobe size={13} />
                    )}
                  </div>
                  <span>{c.name}</span>
                </button>
              );
            })}
          </div>
        )}

        {/* ── Restaurant Grid ── */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 animate-pulse">
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
          </div>
        ) : restaurants.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center max-w-sm mx-auto bg-white border border-slate-100/80 rounded-3xl shadow-card p-8 animate-fadeUp">
            <div className="w-16 h-16 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-600 mb-5">
              <FiIcons.FiInfo size={28} />
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
                className="font-bold shadow-emerald-lg w-full"
              >
                Clear Filters
              </Button>
            )}
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 animate-fadeUp">
              {restaurants.map(r => (
                <RestaurantCard key={r._id} restaurant={r} url={url} />
              ))}
            </div>

            {/* ── Pagination Controls ── */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-12 pb-6">
                <Button
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={page === 1}
                  variant="outline"
                  size="sm"
                  className="font-bold border-slate-200 text-slate-600 disabled:opacity-50"
                >
                  Previous
                </Button>
                
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                  <button
                    key={p}
                    onClick={() => setPage(p)}
                    className={`w-9 h-9 rounded-xl text-xs font-bold transition-all duration-200 ${
                      page === p
                        ? 'bg-emerald-600 text-white shadow-xs'
                        : 'bg-white border border-slate-200 text-slate-600 hover:border-slate-350 hover:text-slate-805'
                    }`}
                  >
                    {p}
                  </button>
                ))}

                <Button
                  onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  variant="outline"
                  size="sm"
                  className="font-bold border-slate-200 text-slate-600 disabled:opacity-50"
                >
                  Next
                </Button>
              </div>
            )}
          </>
        )}

      </Container>
    </div>
  );
};

export default RestaurantsPage;
