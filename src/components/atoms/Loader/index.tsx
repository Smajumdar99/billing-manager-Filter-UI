import { FC } from 'react'

export const Loader: FC = () => {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-grid-primary/[0.02] -z-10" />
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="absolute inset-auto w-[500px] h-[500px] bg-primary/5 rounded-full blur-2xl" />
        <div className="absolute inset-auto w-[300px] h-[300px] bg-primary/10 rounded-full blur-xl animate-pulse" />
      </div>

      {/* Logo and Loading Animation */}
      <div className="relative flex flex-col items-center gap-6">
        <div className="relative">
          <img 
            src="/logo.svg" 
            alt="DrCloud EHR"
            className="w-24 h-auto animate-float"
          />
          <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 w-12 h-3 bg-primary/10 rounded-full blur-sm animate-pulse" />
        </div>

        {/* Loading Text */}
        <div className="space-y-2 text-center">
          <h2 className="text-2xl font-semibold text-foreground">
            Loading DrCloudEHR
          </h2>
          <p className="text-sm text-muted-foreground">
            Please wait while we prepare your dashboard
          </p>
        </div>

        {/* Loading Spinner */}
        <div className="relative w-12 h-12">
          <div className="absolute inset-0 rounded-full border-4 border-primary/20" />
          <div className="absolute inset-0 rounded-full border-4 border-primary border-t-transparent animate-spin" />
        </div>

        {/* Loading Progress Dots */}
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