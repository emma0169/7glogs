import React from 'react'
import { flagUrl } from 'src/lib/constants'

export const Flag = ({
  country,
  className = '',
}: {
  country: string
  className?: string
}) => {
  const url = flagUrl(country)
  if (!url) return <span className={className}>🌍</span>
  return (
    <img
      src={url}
      alt={country ? `${country} flag` : 'flag'}
      loading="lazy"
      className={`inline-block h-3.5 w-5 rounded-[2px] object-cover align-middle ${className}`}
    />
  )
}

export default Flag
