import React from 'react'

const Container = ({
  children,
  className = '',
  clean = false,
  as: Tag = 'div',
  ...rest
}) => {
  return (
    <Tag
      className={[
        !clean ? 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full' : '',
        className,
      ].join(' ')}
      {...rest}
    >
      {children}
    </Tag>
  )
}

export default Container
