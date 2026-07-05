/**
 * Textarea — Premium multi-line text input
 *
 * Props:
 *  label     — field label text
 *  error     — error message
 *  hint      — helper text
 *  rows      — number of visible rows  (default: 4)
 *  resize    — 'none' | 'vertical' | 'both'  (default: 'vertical')
 *  maxLength — character limit (shows counter if set)
 *  required  — marks label with asterisk
 *  className — wrapper additional classes
 */
import React, { useId, useState } from 'react'

const Textarea = React.forwardRef(({
  label,
  error,
  hint,
  rows = 4,
  resize = 'vertical',
  maxLength,
  required = false,
  className = '',
  id: externalId,
  value,
  onChange,
  ...rest
}, ref) => {
  const autoId = useId()
  const id = externalId ?? autoId
  const hasError = Boolean(error)

  const [internalValue, setInternalValue] = useState('')
  const controlled = value !== undefined
  const currentValue = controlled ? value : internalValue
  const charCount = typeof currentValue === 'string' ? currentValue.length : 0

  const handleChange = (e) => {
    if (!controlled) setInternalValue(e.target.value)
    onChange?.(e)
  }

  const resizeClass = {
    none:     'resize-none',
    vertical: 'resize-y',
    both:     'resize',
  }[resize] ?? 'resize-y'

  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      {/* Label + counter row */}
      <div className="flex items-center justify-between">
        {label && (
          <label htmlFor={id} className="text-sm font-semibold text-slate-700 leading-none">
            {label}
            {required && <span className="text-rose-500 ml-1" aria-hidden="true">*</span>}
          </label>
        )}
        {maxLength && (
          <span className={`text-xs font-medium ${charCount > maxLength * 0.9 ? 'text-rose-500' : 'text-slate-400'}`}>
            {charCount}/{maxLength}
          </span>
        )}
      </div>

      <textarea
        ref={ref}
        id={id}
        rows={rows}
        maxLength={maxLength}
        required={required}
        value={controlled ? value : internalValue}
        onChange={handleChange}
        aria-invalid={hasError}
        aria-describedby={hasError ? `${id}-error` : hint ? `${id}-hint` : undefined}
        className={[
          'w-full border-2 outline-none transition-all duration-200',
          'font-medium placeholder-slate-400 text-sm text-slate-900',
          'bg-slate-50 focus:bg-white',
          'px-4 py-3 rounded-xl',
          resizeClass,
          hasError
            ? 'border-rose-300 focus:border-rose-400 focus:shadow-[0_0_0_3px_rgba(244,63,94,0.12)]'
            : 'border-slate-200 focus:border-emerald-400 focus:shadow-[0_0_0_3px_rgba(16,185,129,0.12)]',
          'disabled:opacity-50 disabled:cursor-not-allowed',
        ].join(' ')}
        {...rest}
      />

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

Textarea.displayName = 'Textarea'

export default Textarea
