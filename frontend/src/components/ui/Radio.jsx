/**
 * Radio — Custom radio button group
 *
 * Props:
 *  options   — array of { value, label, description?, disabled? }
 *  value     — currently selected value
 *  onChange  — (value: string) => void
 *  name      — HTML name attribute for the group
 *  label     — group label
 *  error     — group-level error message
 *  size      — 'sm' | 'md' | 'lg'
 *  direction — 'vertical' | 'horizontal'
 *  className — wrapper additional classes
 *
 * Usage:
 *  <Radio
 *    label="Payment Method"
 *    options={[{ value: 'cod', label: 'Cash on Delivery' }]}
 *    value={payment}
 *    onChange={setPayment}
 *  />
 */
import React, { useId } from 'react'

const sizeMap = {
  sm: { dot: 'w-3.5 h-3.5', ring: 'w-4 h-4', text: 'text-sm' },
  md: { dot: 'w-4 h-4',   ring: 'w-5 h-5', text: 'text-sm' },
  lg: { dot: 'w-5 h-5',   ring: 'w-6 h-6', text: 'text-base' },
}

const Radio = ({
  options = [],
  value,
  onChange,
  name: nameProp,
  label,
  error,
  size = 'md',
  direction = 'vertical',
  className = '',
}) => {
  const groupId = useId()
  const name = nameProp ?? groupId
  const s = sizeMap[size] ?? sizeMap.md
  const hasError = Boolean(error)

  return (
    <fieldset className={`flex flex-col gap-2 ${className}`} aria-invalid={hasError}>
      {label && (
        <legend className="text-sm font-semibold text-slate-700 mb-1">
          {label}
        </legend>
      )}

      <div className={`flex ${direction === 'horizontal' ? 'flex-row flex-wrap gap-4' : 'flex-col gap-3'}`}>
        {options.map((opt) => {
          const optId = `${groupId}-${opt.value}`
          const isSelected = value === opt.value

          return (
            <label
              key={opt.value}
              htmlFor={optId}
              className={[
                'flex items-start gap-3 cursor-pointer select-none',
                opt.disabled ? 'opacity-50 cursor-not-allowed' : '',
              ].join(' ')}
            >
              {/* Hidden native input */}
              <input
                type="radio"
                id={optId}
                name={name}
                value={opt.value}
                checked={isSelected}
                disabled={opt.disabled}
                onChange={() => onChange?.(opt.value)}
                className="sr-only"
              />

              {/* Custom radio dot */}
              <span
                className={[
                  `flex-shrink-0 ${s.ring} rounded-full border-2 flex items-center justify-center`,
                  'transition-all duration-200 mt-px',
                  isSelected
                    ? 'border-emerald-500'
                    : hasError
                      ? 'border-rose-400'
                      : 'border-slate-300 hover:border-emerald-400',
                ].join(' ')}
                aria-hidden="true"
              >
                {isSelected && (
                  <span className={`${s.dot.replace('w-', 'w-2 ').replace('h-', 'h-2 ')} w-2 h-2 rounded-full bg-emerald-500`} />
                )}
              </span>

              {/* Text */}
              <span className="flex flex-col gap-0.5 pt-px">
                <span className={`font-medium text-slate-800 leading-snug ${s.text}`}>
                  {opt.label}
                </span>
                {opt.description && (
                  <span className="text-xs text-slate-400 leading-relaxed">
                    {opt.description}
                  </span>
                )}
              </span>
            </label>
          )
        })}
      </div>

      {hasError && (
        <p role="alert" className="text-xs font-medium text-rose-500">{error}</p>
      )}
    </fieldset>
  )
}

export default Radio
