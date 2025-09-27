import { FC } from 'react'
import { Button } from '@/components/atoms/Button/button'
import { ClockIcon, CalendarIcon } from '@heroicons/react/24/outline'

export interface ComingSoonProps {
  title?: string
  description?: string
  showBackButton?: boolean
  onBack?: () => void
  className?: string
}

/**
 * ComingSoon Component
 * 
 * A reusable coming soon message component following atomic design principles.
 * Displays a clean, professional coming soon message with optional back button.
 * Used when features are under development or coming in future releases.
 */
export const ComingSoon: FC<ComingSoonProps> = ({
  title = "Coming Soon",
  description = "This feature is currently under development and will be available soon.",
  showBackButton = true,
  onBack,
  className = ""
}) => {
  return (
    <div className={`flex flex-col items-center justify-center min-h-[400px] p-8 text-center ${className}`}>
      {/* Icon Section */}
      <div className="relative mb-6">
        <div className="bg-primary/10 rounded-full p-4 mb-4">
          <ClockIcon className="w-12 h-12 text-primary" />
        </div>
        <div className="absolute -top-2 -right-2 bg-blue-100 rounded-full p-2">
          <CalendarIcon className="w-6 h-6 text-blue-600" />
        </div>
      </div>

      {/* Content Section */}
      <div className="max-w-md">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          {title}
        </h2>
        <p className="text-gray-600 mb-6 leading-relaxed">
          {description}
        </p>
      </div>

      {/* Action Section */}
      {showBackButton && (
        <Button 
          variant="outline" 
          onClick={onBack}
          className="mt-4"
        >
          Go Back
        </Button>
      )}

      {/* Visual Enhancement */}
      <div className="mt-8 flex space-x-2">
        <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
        <div className="w-2 h-2 bg-primary rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
        <div className="w-2 h-2 bg-primary rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
      </div>
    </div>
  )
}
