import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FiStar, FiClock, FiMapPin, FiTruck } from 'react-icons/fi';
import { Card, Badge } from '../ui';

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
      className={`group relative flex flex-col h-full border border-slate-100/80 transition-all duration-300 ${
        isClosed
          ? 'opacity-65 cursor-not-allowed select-none'
          : 'hover:shadow-card-hover hover:border-slate-200/60 cursor-pointer'
      }`}
    >
      {/* ── Image Cover Area ── */}
      <div className="relative h-48 bg-slate-50 overflow-hidden rounded-t-2xl">
        {restaurant.coverImage ? (
          <img
            src={`${url}/images/${restaurant.coverImage}`}
            alt={restaurant.name}
            className={`w-full h-full object-cover transition-transform duration-700 ease-out ${
              !isClosed ? 'group-hover:scale-105' : ''
            }`}
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-emerald-50 to-emerald-100 text-emerald-600">
            <span className="font-poppins font-bold text-2xl">🏪</span>
          </div>
        )}

        {/* Closed Overlay */}
        {isClosed && (
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-[2px] flex items-center justify-center">
            <span className="px-5 py-2.5 bg-slate-950/85 text-white text-xs font-bold rounded-2xl tracking-wider uppercase">
              Closed
            </span>
          </div>
        )}

        {/* Logo badge overlay */}
        {restaurant.logo && (
          <div className="absolute bottom-4 left-4 w-12 h-12 rounded-2xl bg-white border border-slate-100 shadow-md overflow-hidden">
            <img src={`${url}/images/${restaurant.logo}`} alt="Logo" className="w-full h-full object-cover" />
          </div>
        )}

        {/* Open badge overlay */}
        {!isClosed && (
          <div className="absolute top-4 right-4">
            <Badge variant="success" size="sm" rounded="full" className="shadow-sm">
              Open
            </Badge>
          </div>
        )}
      </div>

      {/* ── Content Area ── */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Title */}
          <h3 className={`font-poppins font-bold text-slate-905 text-base mb-1.5 line-clamp-1 transition-colors ${
            !isClosed ? 'group-hover:text-emerald-600' : ''
          }`}>
            {restaurant.name}
          </h3>

          {/* Cuisine info */}
          {restaurant.cuisine && (
            <p className="text-xs font-medium text-slate-400 mb-3.5 flex items-center gap-1">
              <FiMapPin size={12} className="text-slate-350" />
              <span className="truncate">{restaurant.cuisine}</span>
            </p>
          )}

          {/* Ratings info */}
          <div className="flex items-center gap-2 mb-4 bg-slate-50/50 border border-slate-100/50 p-2 rounded-xl w-fit">
            <StarRating rating={restaurant.rating || 0} />
            <span className="text-xs font-bold text-slate-800">{restaurant.rating?.toFixed(1) || '0.0'}</span>
            {restaurant.totalReviews > 0 && (
              <span className="text-[10px] font-semibold text-slate-400">({restaurant.totalReviews} reviews)</span>
            )}
          </div>
        </div>

        {/* Meta details */}
        <div className="flex items-center justify-between border-t border-slate-50 pt-3.5 mt-auto">
          {restaurant.deliveryFee !== undefined && (
            <span className="flex items-center gap-1.5 text-xs font-semibold text-slate-500">
              <FiTruck size={14} className="text-emerald-500" />
              <span>${restaurant.deliveryFee} delivery</span>
            </span>
          )}
          {restaurant.preparationTime && (
            <span className="flex items-center gap-1.5 text-xs font-semibold text-slate-500">
              <FiClock size={14} className="text-emerald-500" />
              <span>{restaurant.preparationTime} min</span>
            </span>
          )}
        </div>
      </div>
    </Card>
  );
};

export default RestaurantCard;
