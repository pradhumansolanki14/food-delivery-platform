import React from 'react'

const Skeleton = ({
  variant = 'text',
  className = '',
  ...rest
}) => {
  const baseClasses = 'skeleton bg-slate-100 rounded-xl'

  const variantClasses = {
    text: 'h-4 w-full my-1.5',
    title: 'h-7 w-3/4 my-2.5',
    circle: 'rounded-full',
    rect: 'w-full h-full',
    card: 'w-full h-44 rounded-3xl',
  }[variant] ?? 'h-4 w-full'

  return (
    <div
      className={`${baseClasses} ${variantClasses} ${className}`}
      {...rest}
    />
  )
}

export default Skeleton
