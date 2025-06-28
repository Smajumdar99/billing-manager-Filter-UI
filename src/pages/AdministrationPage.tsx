import { FC } from 'react'
import { useNavigate } from 'react-router-dom'
import { ComingSoonIllustration } from '@/components/atoms/ComingSoonIllustration/coming-soon-illustration'
import { useDocumentTitle } from '@/hooks/useDocumentTitle'
import TopNavigationBar from '@/components/old-ui/TopNavigationBar'
import MainNavigationBar from '@/components/old-ui/MainNavigationBar'

/**
 * AdministrationPage Component
 * 
 * Administration page for Old UI approach with proper navigation structure
 * Includes TopNavigationBar and MainNavigationBar with coming soon content
 * Uses atomic design principles with reusable components
 */
export const AdministrationPage: FC = () => {
  const navigate = useNavigate()
  
  // Set document title for better UX
  useDocumentTitle('Administration - Old UI')

  // Handle navigation in the main nav bar
  const handleMainNavigation = (itemName: string) => {
    console.log(`Navigating to ${itemName}`)
    
    // Handle navigation to different pages
    if (itemName === 'Dashboard') {
      navigate('/old-ui-dashboard')
    } else if (itemName === 'Inbox') {
      navigate('/task-hub')
    } else if (itemName === 'Settings') {
      navigate('/settings')
    } else if (itemName === 'Schedule') {
      navigate('/my-calendar')
    } else if (itemName === 'Clients') {
      navigate('/clients')
    } else if (itemName === 'Staff Dashboard') {
      navigate('/staff-dashboard')
    } else if (itemName === 'Billing') {
      navigate('/billing')
    } else if (itemName === 'Practice') {
      navigate('/practice')
    } else if (itemName === 'Reports') {
      navigate('/reports')
    }
    // Administration is current page, so no navigation needed
  }

  // Handle search in the top nav
  const handleSearch = (searchTerm: string) => {
    console.log(`Searching for: ${searchTerm}`)
    // In a real app, this would trigger a search operation
  }

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-white">
      {/* Top Navigation Bar */}
      <TopNavigationBar 
        hospitalName="DrCloud EHR"
        userAvatarUrl="/avatar.png"
        onSearch={handleSearch}
        userInfo={{
          name: "Sarah Johnson",
          role: "front_desk",
          avatar: "/avatar.png"
        }}
      />

      {/* Main Navigation */}
      <MainNavigationBar 
        activeItem="Administration"
        onNavigate={handleMainNavigation}
      />
      
      {/* Content Area with Coming Soon */}
      <div className="flex-1 overflow-auto bg-background">
        <div className="min-h-full flex items-center justify-center p-4">
          <div className="max-w-md w-full text-center space-y-6">
            {/* Coming Soon Illustration */}
            <div className="flex justify-center">
              <ComingSoonIllustration />
            </div>
            
            {/* Main Heading */}
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground">
              Administration Coming Soon
            </h1>
            
            {/* Description */}
            <p className="text-muted-foreground text-sm sm:text-base leading-relaxed">
              We're working hard to bring you powerful administration tools and features. 
              Stay tuned for updates!
            </p>
            
            {/* Status Badge */}
            <div className="inline-flex items-center px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium">
              🚀 In Development
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdministrationPage 