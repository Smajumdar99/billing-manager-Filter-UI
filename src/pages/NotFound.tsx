import { FC, useMemo } from 'react'
import { Link } from "react-router-dom"
import { Button } from "@/components/atoms/Button"
import { ComingSoonIllustration } from "@/components/atoms/ComingSoonIllustration/coming-soon-illustration"
import { ArrowLeftIcon } from "@heroicons/react/24/outline"
import { useLocation } from 'react-router-dom'
import { useDocumentTitle } from '@/hooks/useDocumentTitle'

export const ComingSoonPage: FC = () => {
  useDocumentTitle('Coming Soon')
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
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Background Pattern */}
      <div className="fixed inset-0 -z-10 bg-grid-primary/[0.02]" />

      {/* Container */}
      <div className="container min-h-screen mx-auto px-4 relative">
        {/* Logo */}
        <div className="absolute top-4 sm:top-6 lg:top-8 left-4 sm:left-6 lg:left-8">
          <Link 
            to="/" 
            className="flex items-center gap-2 no-underline group z-20"
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
        <div className="min-h-screen grid lg:grid-cols-2 items-center gap-8 py-16 px-4 lg:px-8">
          {/* Text Content */}
          <div className="text-left space-y-8 lg:pr-8">
            <div className="space-y-2">
              <p className="text-base sm:text-lg text-muted-foreground">
                You're trying to access
              </p>
              <h2 className="text-xl sm:text-2xl font-medium text-primary">
                {formattedPath}
              </h2>
            </div>

            <div className="space-y-4">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-manrope font-bold text-foreground">
                Coming Soon!
              </h1>
              <p className="text-lg sm:text-xl text-muted-foreground leading-relaxed max-w-[40ch]">
                We're working hard to bring you this exciting new feature. Stay tuned for updates!
              </p>
            </div>

            {/* Actions */}
            <div className="flex flex-col items-start gap-6">
              <Link to="/" className="inline-block">
                <Button 
                  className="h-12 sm:h-14 px-8 sm:px-10 rounded-xl bg-primary hover:bg-primary/90 transition-colors group"
                >
                  <span className="flex items-center justify-center gap-2 text-base sm:text-lg font-medium">
                    <ArrowLeftIcon className="w-5 h-5 transition-transform group-hover:-translate-x-1" />
                    Back to Homepage
                  </span>
                </Button>
              </Link>

              <p className="text-sm sm:text-base text-muted-foreground">
                Want to know more?{' '}
                <Link 
                  to="/contact" 
                  className="font-medium text-primary hover:text-primary/90 transition-colors"
                >
                  Contact us
                </Link>
              </p>
            </div>
          </div>

          {/* Illustration */}
          <div className="w-full max-w-lg mx-auto lg:max-w-none">
            <ComingSoonIllustration />
          </div>
        </div>
      </div>
    </div>
  )
}

export default ComingSoonPage 