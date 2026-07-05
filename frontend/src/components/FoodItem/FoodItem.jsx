import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiHeart, FiPlus, FiMinus, FiStar } from 'react-icons/fi';
import { StoreContext } from '../../context/StoreContext';
import { Card, Button, Badge } from '../ui';

const FoodItem = ({ id, name, price, description, image }) => {
  const { cartItems, addToCart, removeFromCart, url, toggleFavorite, isFavorite, token } = useContext(StoreContext);
  const [imgLoaded, setImgLoaded] = useState(false);
  const [favAnimating, setFavAnimating] = useState(false);
  const navigate = useNavigate();
  const qty = cartItems[id] || 0;
  const fav = isFavorite(id);

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
      className="group relative flex flex-col h-full overflow-hidden border border-slate-100/80 shadow-card hover:shadow-card-hover cursor-pointer transition-all duration-300"
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
          className={`absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105 ${
            imgLoaded ? 'opacity-100' : 'opacity-0'
          }`}
        />

        {/* Gradient dark bottom overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* Rating chip */}
        <div className="absolute top-3.5 left-3.5">
          <Badge variant="white" size="sm" rounded="md" className="backdrop-blur-sm shadow-sm bg-white/90 border border-slate-100">
            <FiStar className="text-amber-400 fill-amber-400" size={12} />
            <span className="text-[10px] font-bold text-slate-700">4.8</span>
          </Badge>
        </div>

        {/* Favorite toggle heart button */}
        <button
          type="button"
          onClick={handleFav}
          className={`absolute top-3.5 right-3.5 w-8 h-8 rounded-xl flex items-center justify-center transition-all duration-200 z-10 ${
            fav 
              ? 'bg-rose-500 shadow-md scale-110' 
              : 'bg-white/90 backdrop-blur-sm opacity-0 group-hover:opacity-100 shadow-sm border border-slate-100'
          } ${favAnimating ? 'scale-125' : ''}`}
          aria-label={fav ? "Remove from favorites" : "Add to favorites"}
        >
          <FiHeart 
            size={14} 
            className={`transition-colors ${fav ? 'text-white fill-white' : 'text-slate-500'}`} 
          />
        </button>

        {/* Add to Cart button (quick action when qty is 0) */}
        <div className="absolute bottom-3.5 right-3.5" onClick={e => e.stopPropagation()}>
          {qty === 0 ? (
            <button
              onClick={() => addToCart(id)}
              className="w-9 h-9 bg-emerald-500 hover:bg-emerald-600 active:bg-emerald-700 text-white rounded-xl flex items-center justify-center shadow-emerald opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-1 group-hover:translate-y-0 hover:scale-105"
              aria-label={`Add ${name} to cart`}
            >
              <FiPlus size={18} strokeWidth={2.5} />
            </button>
          ) : (
            <div className="flex items-center gap-2.5 bg-white border border-slate-100 rounded-xl p-1 shadow-card">
              <button 
                onClick={() => removeFromCart(id)} 
                className="w-7 h-7 rounded-lg bg-slate-50 hover:bg-rose-50 hover:text-rose-500 flex items-center justify-center transition-colors"
                aria-label="Decrease quantity"
              >
                <FiMinus size={12} strokeWidth={2.5} />
              </button>
              <span className="w-5 text-center text-xs font-bold text-slate-800">{qty}</span>
              <button 
                onClick={() => addToCart(id)} 
                className="w-7 h-7 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-white flex items-center justify-center transition-colors"
                aria-label="Increase quantity"
              >
                <FiPlus size={12} strokeWidth={2.5} />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* ── Content details ── */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-start justify-between gap-2 mb-1.5">
            <h3 className="font-poppins font-bold text-slate-900 text-sm leading-tight line-clamp-1 group-hover:text-emerald-600 transition-colors">
              {name}
            </h3>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed line-clamp-2 mb-4">
            {description}
          </p>
        </div>

        <div className="flex items-center justify-between border-t border-slate-50/50 pt-3">
          <div>
            <span className="text-lg font-poppins font-bold text-slate-900">${price}</span>
            <span className="text-[10px] text-slate-400 font-semibold ml-1">/ serving</span>
          </div>
          {qty > 0 && (
            <Badge variant="primary" size="sm" rounded="md" className="font-bold">
              {qty} added
            </Badge>
          )}
        </div>
      </div>
    </Card>
  );
};

export default FoodItem;
