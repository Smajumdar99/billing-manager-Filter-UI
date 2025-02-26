import { FC } from 'react'

export const ComingSoonIllustration: FC = () => {
  return (
    <div className="flex flex-col items-center justify-center w-full max-w-lg mx-auto py-12">
      {/* Modern Illustration Container */}
      <div className="relative w-full aspect-square max-w-md">
        {/* Background Glow Effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-primary/5 to-primary/10 rounded-full blur-3xl animate-pulse" />
        
        {/* Main Circle */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="relative w-64 h-64">
            {/* Outer Ring */}
            <div className="absolute inset-0 border-4 border-primary/30 rounded-full" />
            
            {/* Spinning Ring */}
            <div className="absolute inset-0 border-4 border-primary rounded-full border-dashed animate-spin-slow" />
            
            {/* Inner Content */}
            <div className="absolute inset-0 flex items-center justify-center">
              {/* Central Icon */}
              <div className="bg-background shadow-lg rounded-2xl p-6 backdrop-blur-sm border border-primary/10">
                <svg className="w-16 h-16 text-primary animate-pulse" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path 
                    d="M12 4V2M12 22v-2M6.34 6.34L4.93 4.93M19.07 19.07l-1.41-1.41M4 12H2M22 12h-2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" 
                    stroke="currentColor" 
                    strokeWidth="2" 
                    strokeLinecap="round"
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Floating Elements */}
        <div className="absolute inset-0">
          {/* Decorative Dots */}
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 bg-primary rounded-full animate-float"
              style={{
                top: `${20 + Math.random() * 60}%`,
                left: `${20 + Math.random() * 60}%`,
                animationDelay: `${i * 0.5}s`,
                opacity: 0.4
              }}
            />
          ))}
          
          {/* Progress Indicators */}
          <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex gap-2">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="w-2 h-2 bg-primary rounded-full animate-ping"
                style={{ animationDelay: `${i * 0.3}s` }}
              />
            ))}
          </div>
        </div>

        {/* Side Decorations */}
        <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 flex justify-between px-8 pointer-events-none">
          <div className="w-16 h-16 border-2 border-primary/20 rounded-xl rotate-45 animate-float" />
          <div className="w-16 h-16 border-2 border-primary/20 rounded-xl -rotate-45 animate-float-delayed" />
        </div>
      </div>
    </div>
  )
}

export default ComingSoonIllustration 