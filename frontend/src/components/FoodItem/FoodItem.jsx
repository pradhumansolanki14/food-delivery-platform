import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiHeart, FiPlus, FiMinus, FiStar, FiClock, FiActivity } from 'react-icons/fi';
import { StoreContext } from '../../context/StoreContext';
import { Card, Button, Badge } from '../ui';

const FoodItem = ({ id, name, price, description, image, category }) => {
  const { cartItems, addToCart, removeFromCart, url, toggleFavorite, isFavorite, token } = useContext(StoreContext);
  const [imgLoaded, setImgLoaded] = useState(false);
  const [favAnimating, setFavAnimating] = useState(false);
  const navigate = useNavigate();
  const qty = cartItems[id] || 0;
  const fav = isFavorite(id);

  // Dynamically calculate metadata so we don't violate backend constraints
  const lowerCat = (category || '').toLowerCase();
  const lowerName = (name || '').toLowerCase();
  const isVeg = lowerCat.includes('veg') || lowerCat.includes('salad') || lowerName.includes('veg') || lowerName.includes('paneer') || lowerName.includes('salad') || lowerName.includes('fruit');

  // Deterministic calculations based on name characters so metadata is consistent per item
  const charSum = name.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0);
  const prepTime = 15 + (charSum % 20); // 15 - 35 mins
  const calories = 180 + (charSum % 300); // 180 - 480 kcal

  const handleFav = async (e) => {
    e.stopPropagation();
    if (!token) return; // parent component handles login triggers
    setFavAnimating(true);
    await toggleFavorite(id);
    setTimeout(() => setFavAnimating(false), 400);
  };

  return (
    <Card
      variant="default"
      padding="none"
      radius="2xl"
      onClick={() => navigate(`/food/${id}`)}
      className="group relative flex flex-col h-full overflow-hidden border border-slate-100 bg-white shadow-card hover:shadow-[0_20px_50px_rgba(15,23,42,0.08)] hover:-translate-y-1.5 hover:border-emerald-100 cursor-pointer transition-all duration-500"
    >
      {/* ── Image Cover Section ── */}
      <div className="relative overflow-hidden bg-slate-50" style={{ paddingBottom: '72%' }}>
        {!imgLoaded && (
          <div className="absolute inset-0 bg-gradient-to-r from-slate-200 via-slate-100 to-slate-200 animate-pulse" />
        )}
        <img
          src={url + "/images/" + image}
          alt={name}
          onLoad={() => setImgLoaded(true)}
          className={`absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105 group-hover:rotate-[0.5deg] ${
            imgLoaded ? 'opacity-100' : 'opacity-0'
          }`}
        />

        {/* Gradient dark bottom overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* Rating chip overlay */}
        <div className="absolute top-3.5 left-3.5">
          <Badge variant="white" size="sm" rounded="full" className="backdrop-blur-md shadow-sm bg-white/90 border border-slate-100/50 font-bold flex items-center gap-1">
            <FiStar className="text-amber-400 fill-amber-400" size={12} />
            <span className="text-[10px] text-slate-700">4.8</span>
          </Badge>
        </div>

        {/* Favorite toggle heart button */}
        <button
          type="button"
          onClick={handleFav}
          className={`absolute top-3.5 right-3.5 w-8 h-8 rounded-xl flex items-center justify-center transition-all duration-300 z-10 ${
            fav 
              ? 'bg-rose-500 shadow-md scale-110' 
              : 'bg-white/90 backdrop-blur-md opacity-0 group-hover:opacity-100 shadow-sm border border-slate-100'
          } ${favAnimating ? 'scale-125' : ''}`}
          aria-label={fav ? "Remove from favorites" : "Add to favorites"}
        >
          <FiHeart 
            size={14} 
            className={`transition-colors ${fav ? 'text-white fill-white' : 'text-slate-505'}`} 
          />
        </button>

        {/* Veg/Non-veg Indicator Tag */}
        <div className="absolute bottom-3.5 left-3.5 z-10">
          <div className={`w-5 h-5 rounded-md border-2 bg-white/95 flex items-center justify-center shadow-xs ${
            isVeg ? 'border-emerald-500' : 'border-rose-500'
          }`}>
            <div className={`w-2 h-2 rounded-full ${
              isVeg ? 'bg-emerald-500' : 'bg-rose-500'
            }`} />
          </div>
        </div>
      </div>

      {/* ── Content Details ── */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-start justify-between gap-2 mb-1.5">
            <h3 className="font-poppins font-bold text-slate-900 text-sm leading-tight line-clamp-1 group-hover:text-emerald-600 transition-colors duration-300">
              {name}
            </h3>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed line-clamp-2 mb-4 font-semibold">
            {description}
          </p>

          {/* Calorie & Prep info chips */}
          <div className="flex items-center gap-2 mb-5">
            <span className="flex items-center gap-1 text-[10px] font-bold text-slate-450 bg-slate-50 border border-slate-100/60 px-2 py-1 rounded-lg">
              <FiClock size={11} className="text-emerald-500" />
              {prepTime} mins
            </span>
            <span className="flex items-center gap-1 text-[10px] font-bold text-slate-450 bg-slate-50 border border-slate-100/60 px-2 py-1 rounded-lg">
              <FiActivity size={11} className="text-emerald-500" />
              {calories} kcal
            </span>
          </div>
        </div>

        {/* Price & Cart CTA footer */}
        <div className="flex items-center justify-between border-t border-slate-50 pt-4 mt-auto">
          <div>
            <span className="text-lg font-poppins font-extrabold text-slate-900 leading-none">${price}</span>
            <span className="text-[10px] text-slate-400 font-bold ml-1">/ serving</span>
          </div>

          <div onClick={e => e.stopPropagation()}>
            {qty === 0 ? (
              <button
                onClick={() => addToCart(id)}
                className="px-4 py-2.5 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white text-xs font-bold rounded-xl flex items-center justify-center shadow-emerald hover:scale-105 active:scale-95 transition-all duration-300"
                aria-label={`Add ${name} to cart`}
              >
                <FiPlus size={13} strokeWidth={2.5} className="mr-1" />
                Add to Cart
              </button>
            ) : (
              <div className="flex items-center gap-2.5 bg-white border border-slate-205 rounded-xl p-1 shadow-card animate-scaleUp">
                <button 
                  onClick={() => removeFromCart(id)} 
                  className="w-7 h-7 rounded-lg bg-slate-50 hover:bg-rose-50 hover:text-rose-500 flex items-center justify-center transition-colors font-bold"
                  aria-label="Decrease quantity"
                >
                  <FiMinus size={11} strokeWidth={2.5} />
                </button>
                <span className="w-5 text-center text-xs font-extrabold text-slate-800">{qty}</span>
                <button 
                  onClick={() => addToCart(id)} 
                  className="w-7 h-7 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-white flex items-center justify-center transition-colors font-bold"
                  aria-label="Increase quantity"
                >
                  <FiPlus size={11} strokeWidth={2.5} />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
};

export default FoodItem;
