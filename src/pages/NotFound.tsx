import { FC, useMemo } from 'react'
import { Link } from "react-router-dom"
import { Button } from "@/components/atoms/Button"
import { NotFoundIllustration } from "@/components/atoms/NotFoundIllustration"
import { ArrowLeftIcon } from "@heroicons/react/24/outline"
import { useLocation } from 'react-router-dom'
import { useDocumentTitle } from '@/hooks/useDocumentTitle'

export const NotFoundPage: FC = () => {
  useDocumentTitle('404 - Page Not Found')
  const location = useLocation()
  
  const formattedPath = useMemo(() => {
    const pathParts = location.pathname.slice(1).split('/')
    const lastPart = pathParts[pathParts.length - 1]
    return lastPart
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ')
  }, [location.pathname])

  return (
    <div className="min-h-screen bg-background relative">
      {/* Background Pattern */}
      <div className="fixed inset-0 -z-10 bg-grid-primary/[0.02]" />

      {/* Container */}
      <div className="container min-h-screen mx-auto px-4 relative">
        <div className="grid grid-cols-12 gap-4 min-h-screen items-center">
          {/* Logo */}
          <div className="col-span-12 h-16 sm:h-20 lg:h-24">
            <Link 
              to="/" 
              className="absolute top-4 sm:top-6 lg:top-8 left-4 sm:left-6 lg:left-8 flex items-center gap-2 no-underline group z-20"
            >
              <img 
                src="/logo.svg" 
                alt="DrCloudEHR" 
                className="h-6 sm:h-7 lg:h-8 w-auto transition-transform group-hover:scale-105"
              />
              <span className="text-lg sm:text-xl font-manrope font-semibold text-foreground hidden sm:block">
                DrCloudEHR
              </span>
            </Link>
          </div>

          {/* Main Content */}
          <div className="col-span-12 md:col-start-2 md:col-span-10 lg:col-start-3 lg:col-span-8 flex flex-col items-center justify-center space-y-8 sm:space-y-12 relative z-10">
            {/* Illustration */}
            <div className="w-full max-w-md mx-auto">
              <NotFoundIllustration />
            </div>

            {/* Content */}
            <div className="w-full max-w-lg mx-auto space-y-6 text-center">
              <div className="space-y-2">
                <p className="text-base sm:text-lg text-muted-foreground select-text">
                  Attempted to access
                </p>
                <h2 className="text-xl sm:text-2xl font-medium text-primary break-words select-text">
                  {formattedPath}
                </h2>
              </div>

              <div className="space-y-4">
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-manrope font-bold text-foreground select-text">
                  Oops! Page Not Found
                </h1>
                <p className="text-base sm:text-lg text-muted-foreground leading-relaxed select-text">
                  The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
                </p>
              </div>

              {/* Actions */}
              <div className="pt-4 relative z-10">
                <Link to="/" className="inline-block w-full sm:w-auto">
                  <Button 
                    className="w-full sm:w-auto h-12 sm:h-14 px-6 sm:px-8 rounded-xl bg-primary hover:bg-primary/90 transition-colors group"
                  >
                    <span className="flex items-center justify-center gap-2 text-base sm:text-lg font-medium">
                      <ArrowLeftIcon className="w-5 h-5 transition-transform group-hover:-translate-x-1" />
                      Back to Homepage
                    </span>
                  </Button>
                </Link>
              </div>
            </div>

            {/* Support Text */}
            <p className="text-sm sm:text-base text-muted-foreground select-text">
              If you think this is a mistake,{' '}
              <Link 
                to="/contact" 
                className="font-medium text-primary hover:text-primary/90 transition-colors relative z-10"
              >
                please contact us
              </Link>
            </p>
          </div>

          {/* Bottom Spacing */}
          <div className="col-span-12 h-8 sm:h-12 lg:h-16" />
        </div>
      </div>
    </div>
  )
}

export default NotFoundPage 