import React, { useState, useEffect, useContext, useRef } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { FiArrowLeft, FiInfo, FiTrendingUp, FiSearch, FiSliders, FiStar, FiClock, FiMinus, FiPlus, FiShoppingBag } from 'react-icons/fi';
import { StoreContext } from '../../context/StoreContext';
import { Container, SearchInput, Button, FoodTypeIcon } from '../../components/ui';
import axios from 'axios';

const CATEGORIES = ["All", "Salad", "Rolls", "Deserts", "Sandwich", "Cake", "Pure Veg", "Pasta", "Noodles"];

// ─── Search List Rows ──────────────────────────────────────

// 1. Category search row
const SearchCategoryRow = ({ category, navigate }) => {
  return (
    <div 
      onClick={() => navigate(`/menu?category=${category.name}`)}
      className="flex items-center justify-between p-4 bg-white hover:bg-slate-50 border border-slate-100 rounded-2xl cursor-pointer transition-all duration-200 group"
    >
      <div className="flex items-center gap-3.5">
        <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center flex-shrink-0">
          <FiShoppingBag size={18} />
        </div>
        <div>
          <span className="font-poppins font-black text-[9px] uppercase tracking-widest text-slate-400">Category</span>
          <h4 className="font-poppins font-extrabold text-sm text-slate-800 leading-snug group-hover:text-emerald-600 transition-colors mt-0.5">{category.name}</h4>
        </div>
      </div>
      <FiArrowLeft size={16} className="text-slate-300 group-hover:text-emerald-500 group-hover:translate-x-0.5 rotate-180 transition-all" />
    </div>
  );
};

// 2. Kitchen search row
const SearchRestaurantRow = ({ restaurant, navigate, url }) => {
  return (
    <div 
      onClick={() => navigate(`/restaurant/${restaurant._id}`)}
      className="flex items-center justify-between p-4 bg-white hover:bg-slate-50 border border-slate-100 rounded-2xl cursor-pointer transition-all duration-200 group"
    >
      <div className="flex items-center gap-3.5 min-w-0">
        {restaurant.logo ? (
          <img 
            src={`${url}/images/${restaurant.logo}`} 
            alt={restaurant.name} 
            className="w-11 h-11 rounded-xl object-cover bg-slate-50 border border-slate-100 flex-shrink-0" 
          />
        ) : (
          <div className="w-11 h-11 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center flex-shrink-0">
            <FiShoppingBag size={18} />
          </div>
        )}
        <div className="min-w-0">
          <span className="font-poppins font-black text-[9px] uppercase tracking-widest text-slate-400">Kitchen</span>
          <h4 className="font-poppins font-extrabold text-sm text-slate-800 leading-snug group-hover:text-emerald-600 transition-colors truncate mt-0.5">{restaurant.name}</h4>
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-0.5 truncate">{restaurant.cuisine || 'Gourmet Kitchen'}</p>
        </div>
      </div>
      <div className="flex items-center gap-4 flex-shrink-0">
        <div className="text-right text-[10px] font-bold text-slate-400 uppercase tracking-wider hidden sm:block">
          {restaurant.rating > 0 && <span className="text-amber-600">★ {restaurant.rating.toFixed(1)}</span>}
          <span className="mx-1.5">•</span>
          <span>{restaurant.preparationTime || 30} mins</span>
        </div>
        <FiArrowLeft size={16} className="text-slate-300 group-hover:text-emerald-500 group-hover:translate-x-0.5 rotate-180 transition-all" />
      </div>
    </div>
  );
};

// 3. Dish search row
const SearchFoodRow = ({ item, url, cartItems, addToCart, removeFromCart, formatPrice, navigate }) => {
  const qty = cartItems[item._id] || 0;
  const rest = item.restaurantId && typeof item.restaurantId === 'object' ? item.restaurantId : null;
  const isVeg = item.isVeg === true;

  return (
    <div className="flex items-center justify-between p-4 bg-white border border-slate-100 rounded-2xl gap-4 hover:border-slate-150 transition-all group">
      <div className="flex items-center gap-3.5 min-w-0">
        {/* Thumbnail */}
        <div className="w-12 h-12 rounded-xl overflow-hidden bg-slate-50 border border-slate-100 flex-shrink-0 relative">
          <img src={`${url}/images/${item.image}`} alt={item.name} className="w-full h-full object-cover" />
          {item.discount > 0 && (
            <span className="absolute top-0.5 left-0.5 px-1 py-0.2 bg-emerald-500 text-white text-[7px] font-black rounded-sm uppercase scale-90 origin-top-left">
              -{item.discount}%
            </span>
          )}
        </div>
        
        <div className="min-w-0">
          <div className="flex items-center gap-1.5 mb-0.5">
            <FoodTypeIcon isVeg={isVeg} />
            <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider truncate">{item.category}</span>
          </div>
          <h4 className="font-poppins font-extrabold text-sm text-slate-800 leading-snug group-hover:text-emerald-600 transition-colors truncate">{item.name}</h4>
          {rest && (
            <button 
              onClick={() => navigate(`/restaurant/${rest._id || rest}`)}
              className="text-[9px] font-extrabold text-slate-400 hover:text-emerald-500 text-left uppercase tracking-widest mt-0.5 flex items-center gap-0.5 transition-colors"
            >
              <span>from</span>
              <span className="underline font-black">{rest.name}</span>
            </button>
          )}
        </div>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-4 flex-shrink-0">
        <span className="text-sm font-poppins font-black text-slate-800 leading-none">
          {formatPrice(item.price)}
        </span>
        <div onClick={e => e.stopPropagation()}>
          {!item.isAvailable ? (
            <span className="px-2 py-1 bg-slate-100 text-slate-400 text-[8px] font-black uppercase rounded-md tracking-wider border border-slate-200">
              Sold Out
            </span>
          ) : qty === 0 ? (
            <button
              onClick={() => addToCart(item._id, rest?._id || rest)}
              className="w-7 h-7 rounded-full bg-slate-900 hover:bg-emerald-500 text-white flex items-center justify-center shadow-sm hover:scale-105 transition-all duration-350"
              aria-label={`Add ${item.name} to cart`}
            >
              <FiPlus size={12} strokeWidth={2.5} />
            </button>
          ) : (
            <div className="flex items-center bg-white border border-slate-200 rounded-lg p-0.5 shadow-sm">
              <button 
                onClick={() => removeFromCart(item._id)} 
                className="w-4 h-4 rounded-md bg-slate-50 hover:bg-rose-50 hover:text-rose-500 flex items-center justify-center text-slate-500 font-bold"
              >
                <FiMinus size={8} strokeWidth={2.5} />
              </button>
              <span className="w-3.5 text-center text-[9px] font-black text-slate-800">{qty}</span>
              <button 
                onClick={() => addToCart(item._id, rest?._id || rest)} 
                className="w-4 h-4 rounded-md bg-emerald-500 hover:bg-emerald-600 text-white flex items-center justify-center font-bold"
              >
                <FiPlus size={8} strokeWidth={2.5} />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const SearchPage = () => {
  const { food_list, url, cartItems, addToCart, removeFromCart, formatPrice } = useContext(StoreContext);
  const [searchParams, setSearchParams] = useSearchParams();
  const [query, setQuery] = useState(searchParams.get('q') || '');
  const [trendingQueries, setTrendingQueries] = useState([]);
  const [restaurants, setRestaurants] = useState([]);
  const [categories, setCategories] = useState([]);
  const inputRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    inputRef.current?.focus();
    fetchTrendingQueries();
    fetchSearchDatasets();
  }, []);

  const q = query.toLowerCase().trim();

  // Debounced search query logger
  useEffect(() => {
    if (!q) return;
    const timer = setTimeout(() => {
      axios.post(`${url}/api/search/log`, { query: q }).catch(err => {
        console.error("Error logging search query:", err);
      });
    }, 1000);
    return () => clearTimeout(timer);
  }, [q, url]);

  const fetchTrendingQueries = async () => {
    try {
      const res = await axios.get(`${url}/api/search/trending`);
      if (res.data.success) {
        setTrendingQueries(res.data.data);
      }
    } catch (err) {
      console.error("Error fetching trending queries:", err);
    }
  };

  const fetchSearchDatasets = async () => {
    try {
      const restRes = await axios.get(`${url}/api/food/restaurants`);
      if (restRes.data.success) {
        setRestaurants(restRes.data.data || []);
      }
      const catRes = await axios.get(`${url}/api/categories`);
      if (catRes.data.success) {
        setCategories(catRes.data.data || []);
      }
    } catch (err) {
      console.error("Error fetching search lists:", err);
    }
  };

  // Autocomplete filters for all matches
  const matchesSearch = (text) => text && text.toLowerCase().includes(q);

  const matchingDishes = q
    ? food_list.filter(item => matchesSearch(item.name) || matchesSearch(item.description) || matchesSearch(item.category))
    : [];

  const matchingRestaurants = q
    ? restaurants.filter(r => matchesSearch(r.name) || (r.cuisine && matchesSearch(r.cuisine)))
    : [];

  const matchingCategories = q
    ? categories.filter(c => matchesSearch(c.name))
    : [];

  const totalResultsCount = matchingDishes.length + matchingRestaurants.length + matchingCategories.length;

  const handleSearch = (val) => {
    setQuery(val);
    if (val) setSearchParams({ q: val });
    else setSearchParams({});
  };

  return (
    <div className="min-h-screen bg-slate-50">
      
      {/* ── Search Header Bar ── */}
      <div className="bg-white border-b border-slate-100 sticky top-20 z-40 shadow-sm">
        <Container className="py-4">
          <div className="flex items-center gap-3">
            {/* Back button */}
            <button
              onClick={() => navigate(-1)}
              className="w-11 h-11 rounded-2xl bg-slate-50 hover:bg-slate-100 flex items-center justify-center transition-colors flex-shrink-0 border border-slate-100"
              aria-label="Go back"
            >
              <FiArrowLeft size={18} className="text-slate-650" />
            </button>

            {/* Input field */}
            <div className="flex-1">
              <SearchInput
                ref={inputRef}
                placeholder="Search for dishes, categories, or restaurants..."
                value={query}
                onChange={e => handleSearch(e.target.value)}
                onClear={() => handleSearch('')}
              />
            </div>
          </div>
        </Container>
      </div>

      {/* ── Main Area ── */}
      <Container className="py-8 animate-fadeUp">
        
        {!q ? (
          /* Trending Queries at the top when search is empty */
          <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm animate-scaleIn">
            <h3 className="font-poppins font-extrabold text-sm text-slate-800 mb-5 uppercase tracking-widest flex items-center gap-2">
              <FiTrendingUp className="text-emerald-500" />
              <span>Trending Queries</span>
            </h3>
            <div className="flex flex-wrap gap-2.5">
              {trendingQueries.map(s => (
                <button
                  key={s}
                  onClick={() => handleSearch(s)}
                  className="px-4 py-2.5 bg-slate-50 hover:bg-emerald-50 border border-slate-150 hover:border-emerald-250 text-xs font-bold text-slate-650 hover:text-emerald-600 rounded-xl transition-all duration-200"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        ) : (
          /* Unified Search List Response */
          <>
            {totalResultsCount === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 text-center max-w-sm mx-auto bg-white border border-slate-100 rounded-3xl shadow-card p-8 animate-scaleIn">
                <div className="w-16 h-16 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400 mb-5">
                  <FiInfo size={28} />
                </div>
                <h3 className="font-poppins font-bold text-slate-800 text-base uppercase tracking-wider mb-2">No Results Available</h3>
                <p className="text-slate-400 text-xs leading-relaxed mb-6">
                  We couldn&apos;t find any matching dishes, categories, or restaurants for &quot;{query}&quot;.
                </p>
                <Button
                  onClick={() => handleSearch('')}
                  variant="primary"
                  size="sm"
                  className="font-bold shadow-emerald-lg px-6 rounded-xl uppercase tracking-wider text-2xs"
                >
                  Clear Search
                </Button>
              </div>
            ) : (
              <div className="space-y-8 animate-fadeUp">
                
                {/* 1. Matching Categories Section */}
                {matchingCategories.length > 0 && (
                  <div>
                    <h3 className="font-poppins font-extrabold text-xs uppercase tracking-widest text-slate-400 mb-3 ml-1">
                      Categories ({matchingCategories.length})
                    </h3>
                    <div className="space-y-3">
                      {matchingCategories.map(cat => (
                        <SearchCategoryRow 
                          key={cat._id} 
                          category={cat} 
                          navigate={navigate} 
                        />
                      ))}
                    </div>
                  </div>
                )}

                {/* 2. Matching Kitchens Section */}
                {matchingRestaurants.length > 0 && (
                  <div>
                    <h3 className="font-poppins font-extrabold text-xs uppercase tracking-widest text-slate-400 mb-3 ml-1">
                      Restaurants ({matchingRestaurants.length})
                    </h3>
                    <div className="space-y-3">
                      {matchingRestaurants.map(rest => (
                        <SearchRestaurantRow 
                          key={rest._id} 
                          restaurant={rest} 
                          navigate={navigate} 
                          url={url} 
                        />
                      ))}
                    </div>
                  </div>
                )}

                {/* 3. Matching Dishes Section */}
                {matchingDishes.length > 0 && (
                  <div>
                    <h3 className="font-poppins font-extrabold text-xs uppercase tracking-widest text-slate-400 mb-3 ml-1">
                      Dishes ({matchingDishes.length})
                    </h3>
                    <div className="space-y-3">
                      {matchingDishes.map(item => (
                        <SearchFoodRow 
                          key={item._id} 
                          item={item} 
                          url={url} 
                          cartItems={cartItems} 
                          addToCart={addToCart} 
                          removeFromCart={removeFromCart} 
                          formatPrice={formatPrice} 
                          navigate={navigate} 
                        />
                      ))}
                    </div>
                  </div>
                )}

              </div>
            )}
          </>
        )}

      </Container>
    </div>
  );
};

export default SearchPage;
