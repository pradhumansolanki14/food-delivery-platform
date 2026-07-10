import React from 'react';

const FoodTypeIcon = ({ isVeg, className = "" }) => {
  return isVeg ? (
    <span className={`inline-flex items-center justify-center w-[25px] h-[25px] border-2 border-emerald-600 rounded-md flex-shrink-0 bg-white p-0.5 ${className}`} title="Vegetarian">
      <span className="w-3 h-3 rounded-full bg-emerald-600" />
    </span>
  ) : (
    <span className={`inline-flex items-center justify-center w-[25px] h-[25px] border-2 border-rose-600 rounded-md flex-shrink-0 bg-white p-0.5 ${className}`} title="Non-Vegetarian">
      <svg className="w-[14px] h-[14px] text-rose-600 fill-current" viewBox="0 0 24 24">
        <path d="M12 3l10 17H2L12 3z" />
      </svg>
    </span>
  );
};

export default FoodTypeIcon;
