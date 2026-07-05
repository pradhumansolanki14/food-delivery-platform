/**
 * Checkbox — Custom styled checkbox with emerald accent
 *
 * Props:
 *  label       — label text rendered next to checkbox
 *  description — smaller text below label
 *  error       — error message
 *  size        — 'sm' | 'md' | 'lg'
 *  className   — wrapper additional classes
 *
 * Usage:
 *  <Checkbox label="Remember me" checked={checked} onChange={setChecked} />
 */
import React, { useId } from 'react'
import { FiCheck } from 'react-icons/fi'

const sizeMap = {
  sm: { box: 'w-4 h-4', icon: 12, text: 'text-sm' },
  md: { box: 'w-5 h-5', icon: 14, text: 'text-sm' },
  lg: { box: 'w-6 h-6', icon: 16, text: 'text-base' },
}

const Checkbox = React.forwardRef(({
  label,
  description,
  error,
  size = 'md',
  className = '',
  id: externalId,
  checked,
  onChange,
  disabled,
  ...rest
}, ref) => {
  const autoId = useId()
  const id = externalId ?? autoId
  const s = sizeMap[size] ?? sizeMap.md
  const hasError = Boolean(error)

  return (
    <div className={`flex flex-col gap-1 ${className}`}>
      <label
        htmlFor={id}
        className={`flex items-start gap-3 cursor-pointer select-none ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        {/* Hidden native checkbox */}
        <input
          ref={ref}
          type="checkbox"
          id={id}
          checked={checked}
          onChange={onChange}
          disabled={disabled}
          aria-invalid={hasError}
          aria-describedby={hasError ? `${id}-error` : undefined}
          className="sr-only peer"
          {...rest}
        />

        {/* Custom box */}
        <span
          className={[
            `flex-shrink-0 ${s.box} rounded-lg border-2 flex items-center justify-center`,
            'transition-all duration-200',
            checked
              ? 'bg-emerald-500 border-emerald-500'
              : hasError
                ? 'border-rose-400 bg-white'
                : 'border-slate-300 bg-white hover:border-emerald-400',
          ].join(' ')}
          aria-hidden="true"
        >
          {checked && <FiCheck size={s.icon} className="text-white" strokeWidth={3} />}
        </span>

        {/* Label text */}
        {(label || description) && (
          <span className="flex flex-col gap-0.5 pt-px">
            {label && (
              <span className={`font-medium text-slate-800 leading-snug ${s.text}`}>
                {label}
              </span>
            )}
            {description && (
              <span className="text-xs text-slate-400 leading-relaxed">
                {description}
              </span>
            )}
          </span>
        )}
      </label>

      {hasError && (
        <p id={`${id}-error`} role="alert" className="text-xs font-medium text-rose-500 ml-8">
          {error}
        </p>
      )}
    </div>
  )
})

Checkbox.displayName = 'Checkbox'

export default Checkbox
