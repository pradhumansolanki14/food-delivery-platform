/**
 * Select — Premium custom-styled select component
 *
 * Props:
 *  label     — field label text
 *  error     — error message
 *  hint      — helper text
 *  options   — array of { value, label, disabled? }
 *  size      — 'sm' | 'md' | 'lg'
 *  required  — marks label with asterisk
 *  className — wrapper additional classes
 *
 * Usage:
 *  <Select
 *    label="Category"
 *    options={[{ value: 'pizza', label: 'Pizza' }]}
 *    value={category}
 *    onChange={e => setCategory(e.target.value)}
 *  />
 */
import React, { useId } from 'react'
import { FiChevronDown } from 'react-icons/fi'

const sizeClasses = {
  sm: 'h-9 text-sm pl-3 pr-9 rounded-xl',
  md: 'h-11 text-sm pl-4 pr-10 rounded-xl',
  lg: 'h-13 text-base pl-5 pr-12 rounded-2xl',
}

const Select = React.forwardRef(({
  label,
  error,
  hint,
  options = [],
  size = 'md',
  required = false,
  className = '',
  id: externalId,
  placeholder,
  ...rest
}, ref) => {
  const autoId = useId()
  const id = externalId ?? autoId
  const hasError = Boolean(error)

  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      {label && (
        <label htmlFor={id} className="text-sm font-semibold text-slate-700 leading-none">
          {label}
          {required && <span className="text-rose-500 ml-1" aria-hidden="true">*</span>}
        </label>
      )}

      <div className="relative">
        <select
          ref={ref}
          id={id}
          required={required}
          aria-invalid={hasError}
          aria-describedby={hasError ? `${id}-error` : hint ? `${id}-hint` : undefined}
          className={[
            'w-full appearance-none border-2 outline-none transition-all duration-200',
            'font-medium text-slate-900 bg-slate-50 focus:bg-white',
            'cursor-pointer',
            sizeClasses[size] ?? sizeClasses.md,
            hasError
              ? 'border-rose-300 focus:border-rose-400 focus:shadow-[0_0_0_3px_rgba(244,63,94,0.12)]'
              : 'border-slate-200 focus:border-emerald-400 focus:shadow-[0_0_0_3px_rgba(16,185,129,0.12)]',
            'disabled:opacity-50 disabled:cursor-not-allowed',
          ].join(' ')}
          {...rest}
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {options.map((opt) => (
            <option key={opt.value} value={opt.value} disabled={opt.disabled}>
              {opt.label}
            </option>
          ))}
        </select>

        {/* Chevron icon */}
        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
          <FiChevronDown size={16} />
        </span>
      </div>

      {hasError && (
        <p id={`${id}-error`} role="alert" className="text-xs font-medium text-rose-500">
          {error}
        </p>
      )}
      {!hasError && hint && (
        <p id={`${id}-hint`} className="text-xs text-slate-400">{hint}</p>
      )}
    </div>
  )
})

Select.displayName = 'Select'

export default Select
