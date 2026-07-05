import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { FiArrowLeft, FiClock, FiTruck, FiDollarSign, FiInfo, FiStar, FiChevronRight, FiSearch, FiX } from 'react-icons/fi';
import { StoreContext } from '../../context/StoreContext';
import { Container, Button, Card, Badge, Skeleton } from '../../components/ui';

const StarRating = ({ rating }) => {
  const roundedRating = Math.round(rating || 0);
  return (
    <div className="flex items-center gap-0.5" aria-label={`Rating: ${rating} out of 5 stars`}>
      {[1, 2, 3, 4, 5].map((s) => (
        <FiStar 
          key={s} 
          size={12} 
          className={s <= roundedRating ? 'text-amber-400 fill-amber-400' : 'text-slate-200'} 
        />
      ))}
    </div>
  );
};

const RestaurantDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { url, cartItems, addToCart, removeFromCart } = useContext(StoreContext);

  const [restaurant, setRestaurant] = useState(null);
  const [menu, setMenu] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isVeg, setIsVeg] = useState(false);
  const [menuSearch, setMenuSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('');

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchData();
  }, [id]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const rRes = await axios.get(`${url}/api/food/restaurants/${id}`);
      if (!rRes.data.success) { navigate('/restaurants'); return; }
      setRestaurant(rRes.data.data.restaurant);

      const mRes = await axios.get(`${url}/api/food/list?restaurantId=${id}`);
      if (mRes.data.success) setMenu(mRes.data.data);
    } catch {
      navigate('/restaurants');
    }
    setLoading(false);
  };

  const fetchMenu = async (vegFilter) => {
    try {
      const params = `?restaurantId=${id}${vegFilter ? '&isVeg=true' : ''}`;
      const res = await axios.get(`${url}/api/food/list${params}`);
      if (res.data.success) setMenu(res.data.data);
    } catch {}
  };

  const handleVegToggle = () => {
    const newVal = !isVeg;
    setIsVeg(newVal);
    fetchMenu(newVal);
  };

  // Client-side menu search
  const filteredMenu = menu.filter(item => {
    if (!menuSearch) return true;
    const q = menuSearch.toLowerCase();
    return item.name?.toLowerCase().includes(q) || item.description?.toLowerCase().includes(q);
  });

  // Group filtered menu by category
  const grouped = filteredMenu.reduce((acc, item) => {
    const cat = item.category || 'Other';
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(item);
    return acc;
  }, {});

  const isClosed = restaurant && !restaurant.isOpen;

  // Track dynamic category scrolling to update active pill
  useEffect(() => {
    const handleScroll = () => {
      const categories = Object.keys(grouped);
      for (const cat of categories) {
        const el = document.getElementById(`cat-${cat.replace(/\s+/g, '-')}`);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top >= 0 && rect.top <= 250) {
            setActiveCategory(cat);
            break;
          }
        }
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [grouped]);

  const scrollToCategory = (catName) => {
    setActiveCategory(catName);
    const el = document.getElementById(`cat-${catName.replace(/\s+/g, '-')}`);
    if (el) {
      const topOffset = el.getBoundingClientRect().top + window.scrollY - 150;
      window.scrollTo({ top: topOffset, behavior: 'smooth' });
    }
  };

  if (loading) return (
    <div className="min-h-screen bg-slate-50">
      <div className="h-64 sm:h-80 bg-slate-100 animate-pulse" />
      <Container className="pb-16 -mt-10">
        <div className="bg-white rounded-3xl p-6 sm:p-8 space-y-6 shadow-sm border border-slate-100">
          <Skeleton variant="title" className="w-1/3" />
          <Skeleton variant="text" className="w-1/2" />
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6">
            {[1, 2, 3, 4].map(i => <Skeleton key={i} className="h-16 rounded-2xl" />)}
          </div>
        </div>
        <div className="mt-8 space-y-4">
          <Skeleton variant="title" className="w-1/4" />
          <div className="space-y-3">
            {[1, 2, 3].map(i => <Skeleton key={i} className="h-28 rounded-2xl" />)}
          </div>
        </div>
      </Container>
    </div>
  );

  if (!restaurant) return null;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      
      {/* ── Hero Image & Floating Controls ── */}
      <div className="relative h-64 sm:h-80 bg-slate-100 overflow-hidden">
        {restaurant.coverImage ? (
          <img
            src={`${url}/images/${restaurant.coverImage}`}
            alt={restaurant.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-emerald-50 to-emerald-100 flex items-center justify-center">
            <span className="text-6xl">🏪</span>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-slate-900/20 to-transparent" />

        {/* Back navigation */}
        <button
          onClick={() => navigate('/restaurants')}
          className="absolute top-6 left-6 w-11 h-11 rounded-2xl bg-white/90 backdrop-blur-md shadow-md flex items-center justify-center text-slate-700 hover:bg-white hover:scale-105 transition-all"
          aria-label="Back to restaurants"
        >
          <FiArrowLeft size={20} />
        </button>

        {/* Floating status tag */}
        <div className="absolute top-6 right-6">
          <Badge variant={restaurant.isOpen ? 'success' : 'neutral'} className="backdrop-blur-md bg-white/95 px-4 py-2 text-sm shadow-md font-bold rounded-2xl">
            {restaurant.isOpen ? '● Open Now' : '✕ Closed'}
          </Badge>
        </div>

        {/* Logo overlay */}
        {restaurant.logo && (
          <div className="absolute bottom-6 left-6 w-20 h-20 rounded-3xl bg-white border-2 border-white shadow-lg overflow-hidden hidden sm:block">
            <img src={`${url}/images/${restaurant.logo}`} alt="Logo" className="w-full h-full object-cover" />
          </div>
        )}
      </div>

      {/* ── Main Details Layout ── */}
      <Container className="pb-16 -mt-10 relative z-10">
        
        {/* Info card box */}
        <Card variant="default" radius="3xl" padding="lg" className="border border-slate-100/80 shadow-card mb-8">
          <div className="flex flex-col sm:flex-row sm:items-start gap-4">
            <div className="flex-1">
              <h1 className="font-poppins font-extrabold text-2xl sm:text-3xl text-slate-900 mb-2">
                {restaurant.name}
              </h1>

              {/* Cuisine list */}
              {restaurant.cuisine && (
                <div className="flex flex-wrap gap-1.5 mb-3.5">
                  {restaurant.cuisine.split(',').map((c, i) => (
                    <Badge key={i} variant="primary" size="sm" rounded="md" className="bg-emerald-50 text-emerald-700 font-bold border-0">
                      {c.trim()}
                    </Badge>
                  ))}
                </div>
              )}

              {/* Rating metrics */}
              <div className="flex items-center gap-2 mb-4 bg-slate-50 border border-slate-100 p-2 rounded-xl w-fit">
                <StarRating rating={restaurant.rating || 0} />
                <span className="text-xs font-bold text-slate-900">{restaurant.rating?.toFixed(1) || '0.0'}</span>
                {restaurant.totalReviews > 0 && (
                  <span className="text-[10px] text-slate-400 font-semibold">({restaurant.totalReviews} customer reviews)</span>
                )}
              </div>

              {/* Description */}
              {restaurant.description && (
                <p className="text-slate-550 text-xs leading-relaxed max-w-xl">
                  {restaurant.description}
                </p>
              )}
            </div>
          </div>

          {/* Quick Metrics Details Strip */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5 mt-6 pt-6 border-t border-slate-100">
            {[
              { icon: <FiDollarSign size={18} className="text-emerald-600" />, label: 'Delivery fee', value: `$${restaurant.deliveryFee ?? 2}` },
              { icon: <FiClock size={18} className="text-emerald-600" />, label: 'Prep time', value: `${restaurant.preparationTime ?? 30} mins` },
              { icon: <FiClock size={18} className="text-emerald-600" />, label: 'Hours', value: restaurant.openingHours || '—' },
              { icon: <FiInfo size={18} className="text-emerald-600" />, label: 'Min order', value: restaurant.minOrder > 0 ? `$${restaurant.minOrder}` : 'None' },
            ].map((info, i) => (
              <div key={i} className="flex items-center gap-3 p-3 bg-slate-50/75 border border-slate-100/50 rounded-2xl">
                <div className="w-9 h-9 rounded-xl bg-white border border-slate-100/40 flex items-center justify-center shadow-sm">
                  {info.icon}
                </div>
                <div className="min-w-0">
                  <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">{info.label}</p>
                  <p className="text-xs font-bold text-slate-800 truncate">{info.value}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Closed banner alert block */}
          {isClosed && (
            <div className="mt-5 p-4 bg-amber-50 border border-amber-100 rounded-2xl flex items-center gap-3 text-amber-800">
              <FiInfo size={22} className="flex-shrink-0" />
              <div>
                <p className="font-bold text-sm">Restaurant is closed</p>
                <p className="text-xs text-amber-600/90">Menus are browse-only. Ordering is disabled until the kitchen opens.</p>
              </div>
            </div>
          )}
        </Card>

        {/* ── Sticky Category quick navigator bar ── */}
        {Object.keys(grouped).length > 0 && (
          <div className="sticky top-20 bg-white/90 backdrop-blur-md z-30 border border-slate-100/80 rounded-2xl p-2.5 shadow-sm flex items-center gap-2 overflow-x-auto scrollbar-hide mb-6">
            {Object.keys(grouped).map((catName) => {
              const active = activeCategory === catName;
              return (
                <button
                  key={catName}
                  onClick={() => scrollToCategory(catName)}
                  className={`flex-shrink-0 px-4 py-2 rounded-xl text-xs font-bold transition-all duration-300 uppercase tracking-wider ${
                    active
                      ? 'bg-slate-900 text-white shadow-sm'
                      : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  {catName}
                </button>
              );
            })}
          </div>
        )}

        {/* ── Menu Section & Items List ── */}
        <Card variant="default" radius="3xl" padding="lg" className="border border-slate-100/80 shadow-card">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
            <h2 className="font-poppins font-extrabold text-xl text-slate-900">Menu Catalog</h2>
            <div className="flex items-center gap-3 flex-wrap">
              {/* Veg switch filter */}
              <button
                onClick={handleVegToggle}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold uppercase tracking-wider transition-all duration-300 border ${
                  isVeg
                    ? 'bg-emerald-500 text-white border-emerald-500 shadow-emerald'
                    : 'bg-white text-slate-500 border-slate-200 hover:border-emerald-300 hover:text-emerald-600'
                }`}
              >
                <span className="w-3.5 h-3.5 rounded border border-current flex items-center justify-center">
                  <span className="w-1.5 h-1.5 bg-current rounded-full" />
                </span>
                Veg Only
              </button>

              {/* Input search query block */}
              <div className="relative flex items-center">
                <input
                  type="text"
                  placeholder="Search menu catalog..."
                  value={menuSearch}
                  onChange={e => setMenuSearch(e.target.value)}
                  className="bg-slate-50 border border-slate-200 rounded-2xl px-4 py-2.5 text-xs font-semibold placeholder-slate-400 outline-none w-44 focus:border-emerald-350 focus:bg-white transition-all duration-300 pr-8"
                />
                {menuSearch ? (
                  <button 
                    onClick={() => setMenuSearch('')} 
                    className="absolute right-2.5 text-slate-400 hover:text-slate-600"
                    aria-label="Clear menu search"
                  >
                    <FiX size={14} />
                  </button>
                ) : (
                  <FiSearch className="absolute right-3 text-slate-400" size={14} />
                )}
              </div>
            </div>
          </div>

          {/* Render Categories and Food Rows */}
          {Object.keys(grouped).length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center max-w-sm mx-auto">
              <div className="w-14 h-14 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-600 mb-4">
                <FiInfo size={24} />
              </div>
              <h3 className="font-poppins font-bold text-slate-800 text-base mb-1">No Dishes Match</h3>
              <p className="text-slate-400 text-xs leading-relaxed mb-4">Try clearing filters or search parameters to browse all dishes.</p>
              {(isVeg || menuSearch) && (
                <Button
                  onClick={() => { setIsVeg(false); setMenuSearch(''); fetchMenu(false); }}
                  variant="secondary"
                  size="sm"
                  className="font-bold"
                >
                  Reset Filters
                </Button>
              )}
            </div>
          ) : (
            <div className="space-y-12">
              {Object.entries(grouped).map(([category, items]) => (
                <div 
                  key={category} 
                  id={`cat-${category.replace(/\s+/g, '-')}`}
                  className="scroll-mt-36"
                >
                  {/* Category Section Header bar */}
                  <h3 className="font-poppins font-extrabold text-sm uppercase tracking-widest text-slate-900 mb-6 flex items-center gap-3">
                    <span className="flex-shrink-0">{category}</span>
                    <span className="flex-1 h-px bg-slate-100" />
                    <span className="text-[10px] text-slate-400 font-bold tracking-normal uppercase bg-slate-50 border border-slate-100/80 px-2 py-0.5 rounded-md">
                      {items.length} choice{items.length !== 1 ? 's' : ''}
                    </span>
                  </h3>

                  {/* Menu Dishes Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {items.map(item => {
                      const qty = cartItems[item._id] || 0;
                      return (
                        <div 
                          key={item._id}
                          className="flex gap-4 p-4 bg-slate-50 border border-slate-100/50 rounded-2xl hover:bg-emerald-50/15 hover:border-emerald-100/50 transition-all duration-300 group"
                        >
                          {/* Dish visual container */}
                          <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl overflow-hidden bg-slate-150 flex-shrink-0 shadow-sm border border-slate-100/20 relative">
                            <img
                              src={`${url}/images/${item.image}`}
                              alt={item.name}
                              className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-500"
                              onError={e => { e.target.style.display = 'none'; }}
                            />
                            {/* Available state flag */}
                            {!item.isAvailable && (
                              <div className="absolute inset-0 bg-slate-900/60 flex items-center justify-center text-center">
                                <span className="text-[10px] text-white font-bold uppercase tracking-wider">Out of Stock</span>
                              </div>
                            )}
                          </div>

                          {/* Dish Description metrics */}
                          <div className="flex-1 min-w-0 flex flex-col justify-between">
                            <div>
                              <div className="flex items-center gap-2 mb-1">
                                <p className="font-poppins font-bold text-slate-900 text-sm truncate">{item.name}</p>
                                
                                {/* Indian Veg indicator square box */}
                                {item.isVeg && (
                                  <span className="flex-shrink-0 w-4 h-4 rounded border-2 border-emerald-500 flex items-center justify-center" aria-label="Vegetarian">
                                    <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />
                                  </span>
                                )}
                              </div>
                              {item.description && (
                                <p className="text-slate-400 text-xs leading-relaxed line-clamp-2 mb-2">
                                  {item.description}
                                </p>
                              )}
                              
                              {/* Extra item tags - Calories / Prep times */}
                              <div className="flex flex-wrap gap-1.5 items-center">
                                {item.calories && (
                                  <span className="text-[9px] font-bold uppercase tracking-wider text-slate-450 bg-slate-100 px-1.5 py-0.5 rounded">
                                    🔥 {item.calories} kcal
                                  </span>
                                )}
                                {item.preparationTime && (
                                  <span className="text-[9px] font-bold uppercase tracking-wider text-slate-450 bg-slate-100 px-1.5 py-0.5 rounded">
                                    ⏱ {item.preparationTime} mins
                                  </span>
                                )}
                              </div>
                            </div>

                            {/* Price and Cart control row */}
                            <div className="flex items-center justify-between border-t border-slate-100/50 pt-2.5 mt-2">
                              <span className="font-poppins font-extrabold text-sm text-slate-805">${item.price}</span>
                              
                              <div className="flex-shrink-0">
                                {isClosed ? (
                                  <Badge variant="neutral" size="sm" rounded="md" className="font-bold">Closed</Badge>
                                ) : !item.isAvailable ? (
                                  <Badge variant="neutral" size="sm" rounded="md" className="font-bold">Unavailable</Badge>
                                ) : qty === 0 ? (
                                  <Button
                                    onClick={() => addToCart(item._id, id)}
                                    variant="outline"
                                    size="sm"
                                    className="h-8 font-bold border-slate-200 hover:border-emerald-300 hover:text-emerald-600 rounded-xl"
                                  >
                                    Add to Cart
                                  </Button>
                                ) : (
                                  <div className="flex items-center gap-2.5 bg-white border border-slate-100 rounded-xl p-1 shadow-sm">
                                    <button
                                      onClick={() => removeFromCart(item._id)}
                                      className="w-6.5 h-6.5 rounded-lg bg-slate-50 hover:bg-rose-50 hover:text-rose-500 flex items-center justify-center text-slate-500 transition-colors"
                                      aria-label="Decrease quantity"
                                    >
                                      <FiX size={12} />
                                    </button>
                                    <span className="font-poppins font-bold text-slate-900 text-xs w-4 text-center">{qty}</span>
                                    <button
                                      onClick={() => addToCart(item._id, id)}
                                      className="w-6.5 h-6.5 rounded-lg bg-emerald-500 hover:bg-emerald-600 flex items-center justify-center text-white transition-colors"
                                      aria-label="Increase quantity"
                                    >
                                      <FiChevronRight size={12} className="rotate-90" />
                                    </button>
                                  </div>
                                )}
                              </div>
                            </div>

                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>

      </Container>
    </div>
  );
};

export default RestaurantDetail;
