/**
 * Card — Flexible container component
 *
 * Props:
 *  variant   — 'default' | 'elevated' | 'outlined' | 'glass' | 'flat'
 *  padding   — 'none' | 'sm' | 'md' | 'lg'
 *  radius    — 'md' | 'lg' | 'xl' | '2xl' | '3xl'
 *  hover     — enables hover lift effect
 *  as        — polymorphic element tag
 *  className — additional classes
 *
 * Sub-components:
 *  <Card.Header>  — top section with bottom border
 *  <Card.Body>    — main content area
 *  <Card.Footer>  — bottom section with top border
 *
 * Usage:
 *  <Card variant="elevated" hover>
 *    <Card.Header>Title</Card.Header>
 *    <Card.Body>Content</Card.Body>
 *    <Card.Footer>Actions</Card.Footer>
 *  </Card>
 */
import React from 'react'

const variants = {
  default:  'bg-white border border-slate-100 shadow-card',
  elevated: 'bg-white shadow-card-hover border border-slate-50',
  outlined: 'bg-white border-2 border-slate-200',
  glass:    'glass border border-white/50 shadow-card',
  flat:     'bg-slate-50',
}

const paddings = {
  none: '',
  sm:   'p-4',
  md:   'p-5 sm:p-6',
  lg:   'p-6 sm:p-8',
}

const radii = {
  md:  'rounded-xl',
  lg:  'rounded-2xl',
  xl:  'rounded-3xl',
  '2xl': 'rounded-4xl',
  '3xl': 'rounded-5xl',
}

const Card = React.forwardRef(({
  variant = 'default',
  padding = 'md',
  radius = 'xl',
  hover = false,
  as: Tag = 'div',
  className = '',
  children,
  ...rest
}, ref) => (
  <Tag
    ref={ref}
    className={[
      'overflow-hidden',
      variants[variant] ?? variants.default,
      padding !== 'none' ? paddings[padding] ?? paddings.md : '',
      radii[radius] ?? radii.xl,
      hover ? 'transition-all duration-300 hover:-translate-y-1.5 hover:shadow-card-hover cursor-pointer' : '',
      'transition-shadow duration-200',
      className,
    ].join(' ')}
    {...rest}
  >
    {children}
  </Tag>
))

Card.displayName = 'Card'

/* ── Sub-components ─────────────────────────────────────── */

const CardHeader = ({ className = '', children, ...rest }) => (
  <div
    className={`px-6 py-4 border-b border-slate-100 -mx-6 -mt-6 mb-5 first:-mx-0 ${className}`}
    {...rest}
  >
    {children}
  </div>
)
CardHeader.displayName = 'Card.Header'

const CardBody = ({ className = '', children, ...rest }) => (
  <div className={className} {...rest}>
    {children}
  </div>
)
CardBody.displayName = 'Card.Body'

const CardFooter = ({ className = '', children, ...rest }) => (
  <div
    className={`px-6 py-4 border-t border-slate-100 -mx-6 -mb-6 mt-5 ${className}`}
    {...rest}
  >
    {children}
  </div>
)
CardFooter.displayName = 'Card.Footer'

Card.Header = CardHeader
Card.Body   = CardBody
Card.Footer = CardFooter

export default Card
