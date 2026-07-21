import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiSearch, FiX, FiTrendingUp } from "react-icons/fi";

const DEFAULT_TAGS = ["Pizza", "Burger", "Biryani", "Sushi", "Chinese", "Desserts"];

const SearchBar = ({
  placeholder = "Search for restaurants, dishes, or cuisines...",
  className = "",
  showTags = false,
  variant = "light", // 'light' (light grey) | 'dark' | 'white'
}) => {
  const [query, setQuery] = useState("");
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e?.preventDefault();
    if (query.trim()) {
      navigate(`/search?q=${encodeURIComponent(query.trim())}`);
    }
  };

  const handleTagClick = (tag) => {
    navigate(`/search?q=${encodeURIComponent(tag)}`);
  };

  const handleClear = () => {
    setQuery("");
  };

  const isDark = variant === "dark";
  const isWhite = variant === "white";

  return (
    <div className={`w-full max-w-4xl mx-auto ${className}`}>
      {/* Search Bar Input Container */}
      <form
        onSubmit={handleSearch}
        className={`relative flex items-center rounded-2xl transition-all duration-300 p-1.5 sm:p-2 group ${
          isDark
            ? "bg-slate-900 border border-slate-800/90 shadow-lg hover:border-slate-700/80 focus-within:border-emerald-500/80 focus-within:shadow-[0_0_25px_rgba(16,185,129,0.15)]"
            : isWhite
            ? "bg-white border border-slate-200/90 shadow-sm hover:shadow-md focus-within:shadow-lg focus-within:border-emerald-500"
            : "bg-slate-100/90 border border-slate-200/80 hover:border-emerald-300/80 focus-within:bg-white focus-within:border-emerald-500 focus-within:shadow-[0_0_20px_rgba(16,185,129,0.12)]"
        }`}
      >
        {/* Left Search Icon */}
        <div
          className={`pl-3 sm:pl-4 pr-2 transition-colors flex-shrink-0 ${
            isDark
              ? "text-slate-400 group-focus-within:text-emerald-400"
              : "text-slate-400 group-focus-within:text-emerald-500"
          }`}
        >
          <FiSearch size={20} className="sm:w-5 sm:h-5" />
        </div>

        {/* Text Input */}
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={placeholder}
          className={`w-full bg-transparent text-xs sm:text-sm font-semibold focus:outline-none py-2 pr-2 ${
            isDark
              ? "text-white placeholder-slate-400"
              : "text-slate-800 placeholder-slate-450"
          }`}
        />

        {/* Clear Button */}
        {query && (
          <button
            type="button"
            onClick={handleClear}
            className={`p-1.5 rounded-full transition-colors mr-1 flex-shrink-0 ${
              isDark
                ? "text-slate-400 hover:text-white hover:bg-slate-800"
                : "text-slate-400 hover:text-slate-700 hover:bg-slate-200/80"
            }`}
            aria-label="Clear search"
          >
            <FiX size={16} />
          </button>
        )}

        {/* Submit Search Button */}
        <button
          type="submit"
          className="px-4 py-2.5 sm:px-6 sm:py-3 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white font-bold text-xs sm:text-sm rounded-xl shadow-md hover:shadow-emerald transition-all duration-200 flex items-center gap-1.5 flex-shrink-0 active:scale-95"
        >
          <span className="hidden xs:inline">Search</span>
          <FiSearch size={16} className="xs:hidden" />
        </button>
      </form>

      {/* Popular Trending Tags (Optional) */}
      {showTags && (
        <div className="flex items-center gap-2 mt-3 overflow-x-auto scrollbar-hide px-1 py-1">
          <span className="flex items-center gap-1 text-[10px] sm:text-xs font-bold text-slate-400 uppercase tracking-wider whitespace-nowrap flex-shrink-0">
            <FiTrendingUp className="text-emerald-500" size={13} />
            Trending:
          </span>
          <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-hide">
            {DEFAULT_TAGS.map((tag) => (
              <button
                key={tag}
                type="button"
                onClick={() => handleTagClick(tag)}
                className={`px-2.5 py-1 sm:px-3 sm:py-1 border text-[11px] sm:text-xs font-bold rounded-lg whitespace-nowrap flex-shrink-0 transition-all duration-200 ${
                  isDark
                    ? "bg-slate-850 hover:bg-emerald-950/60 text-slate-300 hover:text-emerald-400 border-slate-800 hover:border-emerald-600/50"
                    : "bg-slate-100/80 hover:bg-emerald-50 text-slate-600 hover:text-emerald-700 border-slate-200/60 hover:border-emerald-200"
                }`}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchBar;
