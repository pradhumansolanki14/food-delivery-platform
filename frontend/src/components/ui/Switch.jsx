/**
 * Switch — Toggle switch component
 *
 * Props:
 *  checked   — boolean state
 *  onChange  — (checked: boolean) => void
 *  label     — visible label text
 *  description — smaller description text
 *  size      — 'sm' | 'md' | 'lg'
 *  disabled  — disables interaction
 *  className — wrapper additional classes
 *
 * Usage:
 *  <Switch label="Email notifications" checked={enabled} onChange={setEnabled} />
 */
import React, { useId } from 'react'

const sizeMap = {
  sm: { track: 'w-8 h-4',   thumb: 'w-3 h-3 translate-x-0.5',   on: 'translate-x-4',   text: 'text-sm' },
  md: { track: 'w-11 h-6',  thumb: 'w-5 h-5 translate-x-0.5',   on: 'translate-x-5',   text: 'text-sm' },
  lg: { track: 'w-14 h-7',  thumb: 'w-6 h-6 translate-x-0.5',   on: 'translate-x-7',   text: 'text-base' },
}

const Switch = React.forwardRef(({
  checked = false,
  onChange,
  label,
  description,
  size = 'md',
  disabled = false,
  className = '',
  id: externalId,
  ...rest
}, ref) => {
  const autoId = useId()
  const id = externalId ?? autoId
  const s = sizeMap[size] ?? sizeMap.md

  return (
    <div className={`flex items-start gap-3 ${disabled ? 'opacity-50' : ''} ${className}`}>
      {/* Hidden native input */}
      <input
        ref={ref}
        type="checkbox"
        role="switch"
        id={id}
        checked={checked}
        disabled={disabled}
        onChange={(e) => onChange?.(e.target.checked)}
        className="sr-only"
        {...rest}
      />

      {/* Track */}
      <label
        htmlFor={id}
        className={`flex-shrink-0 ${disabled ? 'cursor-not-allowed' : 'cursor-pointer'}`}
        aria-hidden="true"
      >
        <span
          className={[
            `relative inline-flex ${s.track} rounded-full transition-all duration-300`,
            checked
              ? 'bg-emerald-500 shadow-inner'
              : 'bg-slate-200',
          ].join(' ')}
        >
          {/* Thumb */}
          <span
            className={[
              `absolute top-0.5 ${s.thumb} rounded-full bg-white shadow-sm`,
              'transition-transform duration-300 ease-in-out',
              checked ? s.on : '',
            ].join(' ')}
          />
        </span>
      </label>

      {/* Label */}
      {(label || description) && (
        <label
          htmlFor={id}
          className={`flex flex-col gap-0.5 pt-px ${disabled ? 'cursor-not-allowed' : 'cursor-pointer'}`}
        >
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
        </label>
      )}
    </div>
  )
})

Switch.displayName = 'Switch'

export default Switch
