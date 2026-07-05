/**
 * Button — Premium reusable button component
 *
 * Props:
 *  variant   — 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'white'
 *  size      — 'xs' | 'sm' | 'md' | 'lg'
 *  isLoading — shows spinner, disables interaction
 *  disabled  — disabled state
 *  leftIcon  — React node rendered before label
 *  rightIcon — React node rendered after label
 *  fullWidth — stretches to container width
 *  as        — polymorphic: render as 'a', Link, etc.
 *  className — additional classes
 *  children  — button label
 *
 * Usage:
 *  <Button variant="primary" size="md" onClick={...}>Add to Cart</Button>
 *  <Button variant="outline" leftIcon={<FiSearch />}>Search</Button>
 *  <Button isLoading>Saving...</Button>
 */
import React from 'react'
import Spinner from './Spinner'

const variants = {
  primary: [
    'bg-gradient-to-r from-emerald-500 to-emerald-600',
    'text-white',
    'shadow-emerald hover:shadow-primary-lg',
    'hover:from-emerald-600 hover:to-emerald-700',
    'active:from-emerald-700 active:to-emerald-800',
    'focus-visible:ring-emerald-400',
    'disabled:from-emerald-300 disabled:to-emerald-300 disabled:shadow-none',
  ].join(' '),

  orange: [
    'bg-gradient-to-r from-orange-500 to-orange-600',
    'text-white',
    'shadow-orange hover:shadow-orange-lg',
    'hover:from-orange-600 hover:to-orange-700',
    'active:from-orange-700 active:to-orange-800',
    'focus-visible:ring-orange-400',
    'disabled:from-orange-300 disabled:to-orange-300 disabled:shadow-none',
  ].join(' '),

  secondary: [
    'bg-emerald-50',
    'text-emerald-700',
    'border border-emerald-200',
    'hover:bg-emerald-100 hover:border-emerald-300',
    'active:bg-emerald-200',
    'focus-visible:ring-emerald-400',
    'disabled:bg-emerald-50 disabled:text-emerald-300 disabled:border-emerald-100',
  ].join(' '),

  outline: [
    'bg-transparent',
    'text-slate-700',
    'border border-slate-200',
    'hover:bg-slate-50 hover:border-slate-300',
    'active:bg-slate-100',
    'focus-visible:ring-slate-400',
    'disabled:text-slate-300 disabled:border-slate-100',
  ].join(' '),

  ghost: [
    'bg-transparent',
    'text-slate-600',
    'hover:bg-slate-100 hover:text-slate-900',
    'active:bg-slate-200',
    'focus-visible:ring-slate-400',
    'disabled:text-slate-300',
  ].join(' '),

  danger: [
    'bg-gradient-to-r from-rose-500 to-rose-600',
    'text-white',
    'hover:from-rose-600 hover:to-rose-700',
    'active:from-rose-700 active:to-rose-800',
    'focus-visible:ring-rose-400',
    'shadow-sm hover:shadow-md',
    'disabled:from-rose-300 disabled:to-rose-300 disabled:shadow-none',
  ].join(' '),

  white: [
    'bg-white',
    'text-slate-800',
    'border border-slate-200',
    'shadow-sm hover:shadow-md',
    'hover:bg-slate-50',
    'active:bg-slate-100',
    'focus-visible:ring-slate-400',
    'disabled:bg-white/60 disabled:text-slate-400',
  ].join(' '),
}

const sizes = {
  xs: 'h-7 px-3 text-xs rounded-lg gap-1.5',
  sm: 'h-9 px-4 text-sm rounded-xl gap-2',
  md: 'h-11 px-5 text-sm rounded-xl gap-2',
  lg: 'h-13 px-7 text-base rounded-2xl gap-2.5',
}

const Button = React.forwardRef(({
  variant = 'primary',
  size = 'md',
  isLoading = false,
  disabled = false,
  leftIcon = null,
  rightIcon = null,
  fullWidth = false,
  as: Tag = 'button',
  className = '',
  children,
  ...rest
}, ref) => {
  const isDisabled = disabled || isLoading

  return (
    <Tag
      ref={ref}
      disabled={Tag === 'button' ? isDisabled : undefined}
      aria-disabled={isDisabled}
      className={[
        // Base styles
        'inline-flex items-center justify-center',
        'font-semibold leading-none',
        'transition-all duration-200',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
        'select-none',
        'cursor-pointer',
        isDisabled ? 'cursor-not-allowed opacity-60' : '',
        !isDisabled ? 'hover:-translate-y-px active:translate-y-0' : '',
        fullWidth ? 'w-full' : '',
        // Variant + size
        variants[variant] ?? variants.primary,
        sizes[size] ?? sizes.md,
        className,
      ].join(' ')}
      {...rest}
    >
      {isLoading ? (
        <>
          <Spinner size="sm" variant={variant === 'primary' || variant === 'danger' || variant === 'orange' ? 'white' : 'primary'} />
          <span>{children}</span>
        </>
      ) : (
        <>
          {leftIcon && <span className="flex-shrink-0">{leftIcon}</span>}
          {children && <span>{children}</span>}
          {rightIcon && <span className="flex-shrink-0">{rightIcon}</span>}
        </>
      )}
    </Tag>
  )
})

Button.displayName = 'Button'

export default Button
