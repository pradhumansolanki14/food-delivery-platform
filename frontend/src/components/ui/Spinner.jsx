/**
 * Spinner — Loading indicator component
 *
 * Props:
 *  size    — 'xs' | 'sm' | 'md' | 'lg' | 'xl'  (default: 'md')
 *  variant — 'primary' | 'white' | 'slate'       (default: 'primary')
 *  label   — aria-label text for accessibility    (default: 'Loading...')
 *  className — additional classes
 */
const sizeMap = {
  xs: 'w-3 h-3 border-[1.5px]',
  sm: 'w-4 h-4 border-2',
  md: 'w-6 h-6 border-2',
  lg: 'w-8 h-8 border-[3px]',
  xl: 'w-12 h-12 border-4',
}

const variantMap = {
  primary: 'border-emerald-200 border-t-emerald-500',
  orange:  'border-orange-200 border-t-orange-500',
  white:   'border-white/30 border-t-white',
  slate:   'border-slate-200 border-t-slate-500',
}

const Spinner = ({
  size = 'md',
  variant = 'primary',
  label = 'Loading...',
  className = '',
}) => (
  <div
    role="status"
    aria-label={label}
    className={`inline-block rounded-full animate-spin ${sizeMap[size] ?? sizeMap.md} ${variantMap[variant] ?? variantMap.primary} ${className}`}
  />
)

export default Spinner
