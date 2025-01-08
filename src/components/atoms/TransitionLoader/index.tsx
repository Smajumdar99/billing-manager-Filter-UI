import { FC } from 'react'

export const TransitionLoader: FC = () => {
  return (
    <div className="fixed inset-0 bg-background z-50 flex flex-col items-center justify-center">
      {/* Loading Spinner */}
      <div className="relative w-16 h-16 mb-8">
        <div className="absolute inset-0 rounded-full border-4 border-primary/20" />
        <div className="absolute inset-0 rounded-full border-4 border-primary border-t-transparent animate-spin" />
      </div>

      {/* Loading Text */}
      <div className="flex flex-col items-center gap-2">
        <h2 className="text-xl font-medium text-foreground">
          Loading resources...
        </h2>
        <div className="flex gap-1">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="w-2 h-2 rounded-full bg-primary/40 animate-bounce"
              style={{ animationDelay: `${i * 0.15}s` }}
            />
          ))}
        </div>
      </div>
    </div>
  )
} 