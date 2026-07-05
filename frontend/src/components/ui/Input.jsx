/**
 * Input — Premium form input component
 *
 * Props:
 *  label       — field label text
 *  error       — error message (shown below input, adds red border)
 *  hint        — helper text (shown below input when no error)
 *  leftIcon    — React icon node rendered inside left edge
 *  rightIcon   — React icon node rendered inside right edge
 *  size        — 'sm' | 'md' | 'lg'
 *  required    — marks label with asterisk
 *  id          — for label-input association (auto-generated if not provided)
 *  className   — wrapper div additional classes
 *  inputClass  — additional classes on the input element itself
 *
 * Usage:
 *  <Input label="Email" type="email" leftIcon={<FiMail />} error={errors.email} />
 */
import React, { useId } from 'react'

const sizeClasses = {
  sm: 'h-9 text-sm px-3 rounded-xl',
  md: 'h-11 text-sm px-4 rounded-xl',
  lg: 'h-13 text-base px-5 rounded-2xl',
}

const iconSizeClasses = {
  sm: 'text-sm',
  md: 'text-base',
  lg: 'text-lg',
}

const Input = React.forwardRef(({
  label,
  error,
  hint,
  leftIcon,
  rightIcon,
  size = 'md',
  required = false,
  id: externalId,
  className = '',
  inputClass = '',
  ...rest
}, ref) => {
  const autoId = useId()
  const id = externalId ?? autoId

  const hasError = Boolean(error)

  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      {/* Label */}
      {label && (
        <label
          htmlFor={id}
          className="text-sm font-semibold text-slate-700 leading-none"
        >
          {label}
          {required && (
            <span className="text-rose-500 ml-1" aria-hidden="true">*</span>
          )}
        </label>
      )}

      {/* Input wrapper */}
      <div className="relative flex items-center">
        {/* Left icon */}
        {leftIcon && (
          <span
            className={`absolute left-3.5 flex items-center pointer-events-none text-slate-400 ${iconSizeClasses[size] ?? iconSizeClasses.md}`}
            aria-hidden="true"
          >
            {leftIcon}
          </span>
        )}

        <input
          ref={ref}
          id={id}
          aria-invalid={hasError}
          aria-describedby={
            hasError ? `${id}-error` : hint ? `${id}-hint` : undefined
          }
          required={required}
          className={[
            'w-full border-2 outline-none transition-all duration-200',
            'font-medium placeholder-slate-400',
            'bg-slate-50 text-slate-900',
            'focus:bg-white',
            sizeClasses[size] ?? sizeClasses.md,
            leftIcon ? 'pl-10' : '',
            rightIcon ? 'pr-10' : '',
            hasError
              ? 'border-rose-300 focus:border-rose-400 focus:shadow-[0_0_0_3px_rgba(244,63,94,0.12)]'
              : 'border-slate-200 focus:border-emerald-400 focus:shadow-[0_0_0_3px_rgba(16,185,129,0.12)]',
            'disabled:opacity-50 disabled:cursor-not-allowed',
            inputClass,
          ].join(' ')}
          {...rest}
        />

        {/* Right icon */}
        {rightIcon && (
          <span
            className={`absolute right-3.5 flex items-center pointer-events-none text-slate-400 ${iconSizeClasses[size] ?? iconSizeClasses.md}`}
            aria-hidden="true"
          >
            {rightIcon}
          </span>
        )}
      </div>

      {/* Error message */}
      {hasError && (
        <p id={`${id}-error`} role="alert" className="text-xs font-medium text-rose-500 flex items-center gap-1.5">
          {error}
        </p>
      )}

      {/* Hint text */}
      {!hasError && hint && (
        <p id={`${id}-hint`} className="text-xs text-slate-400">
          {hint}
        </p>
      )}
    </div>
  )
})

Input.displayName = 'Input'

export default Input
