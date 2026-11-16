import React from 'react'

interface Props {
  size?: number
  className?: string
}

const FlyHubLogo: React.FC<Props> = ({ size = 40, className = '' }) => {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" className={className}>
      <rect x="4" y="4" width="92" height="92" rx="24" fill="#312E81" />
      <text x="50" y="62" fontFamily="'Arial Black', Arial, sans-serif" fontWeight="900" fontSize="50" fill="#A5B4FC" textAnchor="middle">F</text>
      <path d="M 34,78 Q 50,92 66,78" stroke="#A5B4FC" strokeWidth="4.5" strokeLinecap="round" fill="none" />
    </svg>
  )
}

export default FlyHubLogo
