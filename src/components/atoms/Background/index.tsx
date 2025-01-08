import { FC } from 'react'

export const Background: FC = () => {
  return (
    <div className="absolute inset-0 -z-10 overflow-hidden">
      {/* Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-red-50 to-red-100" />
      
      {/* Hexagon Pattern */}
      <div className="absolute inset-0 opacity-10">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <pattern
            id="hexagons"
            width="50"
            height="43.4"
            patternUnits="userSpaceOnUse"
            patternTransform="scale(2) rotate(0)"
          >
            <path
              d="M24.8,14.4 L37.3,22.1 L37.3,37.4 L24.8,45.1 L12.3,37.4 L12.3,22.1 L24.8,14.4 Z"
              fill="none"
              stroke="#DC2626"
              strokeWidth="1"
            />
          </pattern>
          <rect width="100%" height="100%" fill="url(#hexagons)" />
        </svg>
      </div>

      {/* Floating Elements */}
      <div className="absolute top-20 right-20 w-32 h-32 bg-red-500/5 rounded-2xl animate-float" />
      <div className="absolute bottom-40 left-20 w-24 h-24 bg-red-500/10 rounded-2xl animate-float-delayed" />
      <div className="absolute top-1/2 right-1/3 w-40 h-40 bg-red-500/5 rounded-2xl animate-float-slow" />
    </div>
  )
} 