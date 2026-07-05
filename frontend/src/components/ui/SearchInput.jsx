import React, { useId } from 'react'
import { FiSearch, FiX } from 'react-icons/fi'

const SearchInput = React.forwardRef(({
  value,
  onChange,
  onClear,
  placeholder = 'Search...',
  className = '',
  inputClassName = '',
  disabled = false,
  id: externalId,
  ...rest
}, ref) => {
  const autoId = useId()
  const id = externalId ?? autoId

  return (
    <div className={`relative flex items-center w-full ${className}`}>
      {/* Search Icon */}
      <span className="absolute left-4 text-slate-400 pointer-events-none" aria-hidden="true">
        <FiSearch size={18} />
      </span>

      <input
        ref={ref}
        type="text"
        id={id}
        value={value}
        onChange={onChange}
        disabled={disabled}
        placeholder={placeholder}
        className={[
          'w-full bg-slate-50 border-2 border-slate-100 rounded-2xl py-3.5 pl-11 pr-10',
          'text-sm font-medium text-slate-900 placeholder-slate-400 outline-none',
          'transition-all duration-300',
          'focus:bg-white focus:border-emerald-400 focus:shadow-[0_8px_30px_rgb(16,185,129,0.06)]',
          'disabled:opacity-50 disabled:cursor-not-allowed',
          inputClassName,
        ].join(' ')}
        {...rest}
      />

      {/* Clear Button */}
      {value && onClear && !disabled && (
        <button
          type="button"
          onClick={onClear}
          aria-label="Clear search"
          className="absolute right-3.5 p-1 rounded-lg text-slate-400 hover:bg-slate-150 hover:text-slate-650 transition-colors"
        >
          <FiX size={16} />
        </button>
      )}
    </div>
  )
})

SearchInput.displayName = 'SearchInput'

export default SearchInput
