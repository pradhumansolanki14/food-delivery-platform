import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FiStar, FiClock, FiMapPin, FiTruck, FiChevronRight, FiDollarSign } from 'react-icons/fi';
import { Card, Badge, Button } from '../ui';

const StarRating = ({ rating }) => {
  const roundedRating = Math.round(rating || 0);
  return (
    <div className="flex items-center gap-0.5" aria-label={`Rating: ${rating} out of 5 stars`}>
      {[1, 2, 3, 4, 5].map((s) => (
        <FiStar 
          key={s} 
          size={11} 
          className={s <= roundedRating ? 'text-amber-400 fill-amber-400' : 'text-slate-200'} 
        />
      ))}
    </div>
  );
};

/**
 * RestaurantCard
 * Displays a restaurant summary in a premium 2026 SaaS layout.
 */
const RestaurantCard = ({ restaurant, url }) => {
  const navigate = useNavigate();
  const isClosed = !restaurant.isOpen;

  const handleClick = () => {
    if (!isClosed) navigate(`/restaurant/${restaurant._id}`);
  };

  return (
    <Card
      variant={isClosed ? 'flat' : 'default'}
      padding="none"
      radius="2xl"
      onClick={handleClick}
      className={`group relative flex flex-col h-full border border-slate-100 bg-white transition-all duration-500 overflow-hidden ${
        isClosed
          ? 'opacity-70 cursor-not-allowed select-none'
          : 'hover:shadow-[0_20px_50px_rgba(15,23,42,0.08)] hover:-translate-y-1.5 hover:border-emerald-100 cursor-pointer'
      }`}
    >
      {/* ── Image Cover Area ── */}
      <div className="relative h-44 sm:h-48 bg-slate-50 overflow-hidden">
        {restaurant.coverImage ? (
          <img
            src={`${url}/images/${restaurant.coverImage}`}
            alt={restaurant.name}
            className={`w-full h-full object-cover transition-transform duration-700 ease-out ${
              !isClosed ? 'group-hover:scale-105 group-hover:rotate-[0.5deg]' : ''
            }`}
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-emerald-50 to-emerald-100 text-emerald-600">
            <span className="text-3xl">🏪</span>
          </div>
        )}

        {/* Closed Overlay */}
        {isClosed && (
          <div className="absolute inset-0 bg-slate-950/40 backdrop-blur-[2px] flex items-center justify-center">
            <span className="px-4 py-2 bg-slate-900/90 text-white text-[10px] font-extrabold rounded-2xl tracking-widest uppercase border border-white/10">
              Closed
            </span>
          </div>
        )}

        {/* Logo badge overlay */}
        {restaurant.logo && (
          <div className="absolute bottom-3.5 left-4 w-11 h-11 rounded-2xl bg-white border border-slate-100 shadow-md overflow-hidden z-10 transition-transform duration-500 group-hover:scale-105">
            <img src={`${url}/images/${restaurant.logo}`} alt="Logo" className="w-full h-full object-cover" />
          </div>
        )}

        {/* Open badge overlay */}
        {!isClosed && (
          <div className="absolute top-3.5 right-3.5 z-10">
            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-500 text-white text-[10px] font-black rounded-full shadow-sm tracking-wide uppercase">
              <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
              Open Now
            </div>
          </div>
        )}
      </div>

      {/* ── Content Area ── */}
      <div className="p-5 flex-1 flex flex-col justify-between relative">
        <div>
          {/* Title & Chevron hover indicator */}
          <div className="flex items-start justify-between gap-2 mb-1.5">
            <h3 className="font-poppins font-bold text-slate-900 text-base line-clamp-1 transition-colors duration-300 group-hover:text-emerald-600">
              {restaurant.name}
            </h3>
            {!isClosed && (
              <span className="w-6 h-6 rounded-lg bg-slate-50 group-hover:bg-emerald-50 text-slate-400 group-hover:text-emerald-600 flex items-center justify-center transition-all duration-300 translate-x-1 opacity-0 group-hover:translate-x-0 group-hover:opacity-100">
                <FiChevronRight size={14} strokeWidth={2.5} />
              </span>
            )}
          </div>

          {/* Cuisine info */}
          {restaurant.cuisine && (
            <p className="text-xs font-semibold text-slate-400 mb-3.5 flex items-center gap-1.5">
              <FiMapPin size={12} className="text-slate-350" />
              <span className="truncate">{restaurant.cuisine}</span>
            </p>
          )}

          {/* Ratings info */}
          <div className="flex items-center gap-2 mb-4 bg-slate-50/70 border border-slate-100/50 px-2.5 py-1.5 rounded-xl w-fit">
            <StarRating rating={restaurant.rating || 0} />
            <span className="text-xs font-bold text-slate-800 leading-none">{restaurant.rating?.toFixed(1) || '0.0'}</span>
            {restaurant.totalReviews > 0 && (
              <span className="text-[10px] font-semibold text-slate-400 leading-none">({restaurant.totalReviews} reviews)</span>
            )}
          </div>
        </div>

        {/* Meta details */}
        <div className="flex flex-col gap-3.5 border-t border-slate-50 pt-4 mt-auto">
          <div className="flex items-center justify-between">
            {restaurant.deliveryFee !== undefined && (
              <span className="flex items-center gap-1.5 text-xs font-bold text-slate-505">
                <FiTruck size={14} className="text-emerald-500" />
                <span>${restaurant.deliveryFee} Delivery</span>
              </span>
            )}
            {restaurant.preparationTime && (
              <span className="flex items-center gap-1.5 text-xs font-bold text-slate-505">
                <FiClock size={14} className="text-emerald-500" />
                <span>{restaurant.preparationTime} Mins</span>
              </span>
            )}
          </div>
          
          <div className="flex items-center justify-between">
            {restaurant.minOrder !== undefined && (
              <span className="flex items-center gap-1 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                <FiDollarSign size={13} className="text-slate-300" />
                <span>Min: ${restaurant.minOrder || 0}</span>
              </span>
            )}
            
            {/* View Restaurant hover text */}
            {!isClosed && (
              <span className="text-xs font-extrabold text-emerald-600 group-hover:underline flex items-center gap-0.5 transition-all duration-300 transform translate-y-1 opacity-0 group-hover:translate-y-0 group-hover:opacity-100">
                View Menu &rarr;
              </span>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
};

export default RestaurantCard;
