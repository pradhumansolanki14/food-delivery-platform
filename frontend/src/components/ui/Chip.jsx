/**
 * Chip — Dismissible tag / filter chip component
 *
 * Props:
 *  variant   — 'primary' | 'secondary' | 'neutral' | 'orange'
 *  onRemove  — callback for dismiss button (if not provided, no X shown)
 *  icon      — React node rendered before label
 *  size      — 'sm' | 'md'
 *  selected  — highlights chip as active/selected
 *  onClick   — makes chip clickable
 *  className — additional classes
 *
 * Usage:
 *  <Chip onRemove={() => removeFilter(id)}>Pizza</Chip>
 *  <Chip variant="primary" selected>Vegetarian</Chip>
 */
import React from 'react'
import { FiX } from 'react-icons/fi'

const variantStyles = {
  primary:   'bg-emerald-100 text-emerald-700 border-emerald-200',
  secondary: 'bg-green-100   text-green-700   border-green-200',
  neutral:   'bg-slate-100   text-slate-600   border-slate-200',
  orange:    'bg-orange-100  text-orange-700  border-orange-200',
}

const selectedStyles = {
  primary:   'bg-emerald-500 text-white border-emerald-500',
  secondary: 'bg-green-500   text-white border-green-500',
  neutral:   'bg-slate-700   text-white border-slate-700',
  orange:    'bg-orange-500  text-white border-orange-500',
}

const sizeStyles = {
  sm: 'text-xs px-2.5 py-1 gap-1.5 rounded-lg',
  md: 'text-sm px-3 py-1.5 gap-2 rounded-xl',
}

const Chip = ({
  variant = 'neutral',
  onRemove,
  icon,
  size = 'md',
  selected = false,
  onClick,
  className = '',
  children,
  ...rest
}) => {
  const baseStyles = selected
    ? selectedStyles[variant] ?? selectedStyles.neutral
    : variantStyles[variant] ?? variantStyles.neutral

  return (
    <span
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      onClick={onClick}
      onKeyDown={onClick ? (e) => e.key === 'Enter' && onClick(e) : undefined}
      className={[
        'inline-flex items-center border font-medium transition-all duration-200',
        baseStyles,
        sizeStyles[size] ?? sizeStyles.md,
        onClick ? 'cursor-pointer hover:opacity-80 active:opacity-90' : '',
        className,
      ].join(' ')}
      {...rest}
    >
      {icon && <span className="flex-shrink-0" aria-hidden="true">{icon}</span>}
      <span>{children}</span>
      {onRemove && (
        <button
          type="button"
          onClick={(e) => { e.stopPropagation(); onRemove(e) }}
          aria-label={`Remove ${typeof children === 'string' ? children : ''}`}
          className={[
            'flex-shrink-0 flex items-center justify-center rounded-full',
            'w-4 h-4 -mr-0.5',
            'transition-colors duration-150',
            selected ? 'hover:bg-white/20' : 'hover:bg-black/10',
          ].join(' ')}
        >
          <FiX size={11} strokeWidth={2.5} />
        </button>
      )}
    </span>
  )
}

export default Chip
