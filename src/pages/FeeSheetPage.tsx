import { FC, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDocumentTitle } from '@/hooks/useDocumentTitle'
import TopNavigationBar from '@/components/old-ui/TopNavigationBar'
import MainNavigationBar from '@/components/old-ui/MainNavigationBar'
import { Sidebar } from '@/components/atoms/Sidebar/sidebar'
import { FeeSheet } from '@/components/organisms/FeeSheet'

export const FeeSheetPage: FC = () => {
  const navigate = useNavigate()
  
  // Set document title for better UX
  useDocumentTitle('Fee Sheet')

  // State for sidebar navigation
  const [activeSidebarItem, setActiveSidebarItem] = useState('Fee Sheet')

  // Handle navigation in the main nav bar
  const handleMainNavigation = (itemName: string) => {
    console.log(`Navigating to ${itemName}`)
    
    // Handle navigation to different pages based on item name
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
    }
  }

  // Handle sidebar navigation
  const handleSidebarSelect = (itemLabel: string) => {
    console.log(`Sidebar navigation to: ${itemLabel}`)
    setActiveSidebarItem(itemLabel)
    
    // Navigate to specific pages based on sidebar item selection
    if (itemLabel === 'Billing Dashboard') {
      navigate('/billing')
    } else if (itemLabel === 'Billing Manager') {
      navigate('/billing-manager')
    } else if (itemLabel === 'Claims & Denials') {
      navigate('/claims-denials')
    } else if (itemLabel === 'ERA Process') {
      navigate('/era-process')
    } else if (itemLabel === 'Payments') {
      navigate('/payments')
    } else if (itemLabel === 'Fee Sheet') {
      return
    }
  }

  // Handle search in the top nav
  const handleSearch = (searchTerm: string) => {
    console.log(`Searching for: ${searchTerm}`)
  }

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Top Navigation */}
      <TopNavigationBar 
        hospitalName="Mayank Hospitals"
        userAvatarUrl="https://ui-avatars.com/api/?name=Darlene+Robertson&background=0D8ABC&color=fff"
        onSearch={handleSearch}
        userInfo={{
          name: "Sarah Johnson",
          role: "Billing Manager",
          avatar: "https://ui-avatars.com/api/?name=Sarah+Johnson&background=0D8ABC&color=fff"
        }}
      />

      {/* Main Navigation */}
      <MainNavigationBar 
        activeItem="Billing"
        onNavigate={handleMainNavigation}
      />

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <Sidebar 
          activeItem={activeSidebarItem}
          onMenuSelect={handleSidebarSelect}
        />

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto">
          <FeeSheet showPatientSelector={true} />
        </main>
      </div>
    </div>
  )
}

export default FeeSheetPage
