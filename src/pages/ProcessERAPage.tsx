import { FC, useState, useCallback, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDocumentTitle } from '@/hooks/useDocumentTitle'
import { useMediaQuery } from '@/hooks/useMediaQuery'
import TopNavigationBar from '@/components/old-ui/TopNavigationBar'
import MainNavigationBar from '@/components/old-ui/MainNavigationBar'
import { Sidebar } from '@/components/atoms/Sidebar/sidebar'
import { Button } from '@/components/atoms/Button/button'
import { Icon } from '@/components/atoms/Icon/Icon'
import { Input } from '@/components/atoms/Input/input'
import { Label } from '@/components/atoms/Label/label'
import { Autocomplete } from '@/components/atoms/Autocomplete/Autocomplete'
import {
  TooltipProvider,
  TooltipRoot,
  TooltipTrigger,
  TooltipContent
} from '@/components/atoms/Tooltip/tooltip'
import { Breadcrumb } from '@/components/atoms/Breadcrumb/breadcrumb'

/**
 * ProcessERAPage Component
 * 
 * Page for uploading and processing ERA (Electronic Remittance Advice) files.
 */
const ProcessERAPage: FC = () => {
  const navigate = useNavigate()
  useDocumentTitle('Process ERA')

  // Mobile detection
  const isMobile = useMediaQuery('(max-width: 768px)')

  // State for sidebar navigation
  const [activeSidebarItem, setActiveSidebarItem] = useState('ERA Process')
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)

  // Mobile-specific states
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false)

  // Form states
  const [dateOfEntry, setDateOfEntry] = useState(() => {
    const today = new Date()
    return `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`
  })
  const [postToDate, setPostToDate] = useState('')
  const [depositDate, setDepositDate] = useState('')
  const [insurance, setInsurance] = useState('')
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Mock insurance options for autocomplete
  const getInsuranceOptions = useCallback(() => {
    return [
      { 
        value: 'Blue Cross Blue Shield', 
        label: 'Blue Cross Blue Shield',
        code: 'BCBS'
      },
      { 
        value: 'Aetna', 
        label: 'Aetna',
        code: 'AETNA'
      },
      { 
        value: 'UnitedHealthcare', 
        label: 'UnitedHealthcare',
        code: 'UHC'
      },
      { 
        value: 'Cigna', 
        label: 'Cigna',
        code: 'CIGNA'
      },
      { 
        value: 'Medicare', 
        label: 'Medicare',
        code: 'MEDICARE'
      },
      { 
        value: 'Medicaid', 
        label: 'Medicaid',
        code: 'MEDICAID'
      },
      { 
        value: 'Humana', 
        label: 'Humana',
        code: 'HUMANA'
      }
    ]
  }, [])

  // Handle file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setSelectedFile(file)
    }
  }

  // Handle file upload button click
  const handleFileButtonClick = () => {
    fileInputRef.current?.click()
  }

  // Handle Process ERA
  const handleProcessERA = useCallback(() => {
    if (!selectedFile) {
      alert('Please select an ERA file to process.')
      return
    }
    console.log('Processing ERA file:', selectedFile.name)
    console.log('Date Of Entry:', dateOfEntry)
    console.log('Post To Date:', postToDate)
    console.log('Deposit Date:', depositDate)
    console.log('Insurance:', insurance)
    // Process ERA logic will be implemented here
    // After processing, navigate to ERA Process page
    navigate('/era-process')
  }, [selectedFile, dateOfEntry, postToDate, depositDate, insurance, navigate])

  // Handle Offline Processed ERAs
  const handleOfflineProcessedERAs = useCallback(() => {
    console.log('Viewing offline processed ERAs...')
    navigate('/era-process?filter=manual')
  }, [navigate])

  // Handle navigation in the main nav bar
  const handleMainNavigation = (itemName: string) => {
    console.log(`Navigating to ${itemName}`)
    
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

  // Handle search in the top nav
  const handleSearch = (searchTerm: string) => {
    console.log(`Searching for: ${searchTerm}`)
  }

  // Handle sidebar navigation
  const handleSidebarSelect = (itemLabel: string) => {
    console.log(`Sidebar navigation to: ${itemLabel}`)
    setActiveSidebarItem(itemLabel)
    
    if (itemLabel === 'Billing Dashboard') {
      navigate('/billing')
    } else if (itemLabel === 'Billing Manager') {
      navigate('/billing-manager')
    } else if (itemLabel === 'ERA Process') {
      navigate('/era-process')
    } else if (itemLabel === 'Payments') {
      navigate('/payments')
    }
  }

  // Handle sidebar search
  const handleSidebarSearch = (searchTerm: string) => {
    console.log(`Sidebar search: ${searchTerm}`)
  }

  // Handle mobile sidebar toggle
  const handleMobileSidebarToggle = useCallback(() => {
    setMobileSidebarOpen(prev => !prev)
  }, [])

  // Breadcrumb items
  const breadcrumbItems = [
    { label: 'Billing', href: '/billing' },
    { label: 'ERA Process', href: '/era-process' },
    { label: 'Process ERA' }
  ]

  return (
    <TooltipProvider>
      <div className="flex flex-col h-screen overflow-hidden bg-white">
        {/* Top Navigation Bar */}
        <TopNavigationBar
          onNavigation={handleMainNavigation}
          onSearch={handleSearch}
        />

        {/* Main Navigation Bar */}
        <MainNavigationBar />

        {/* Main Content Area */}
        <div className="flex-1 overflow-hidden flex">
          {/* Sidebar */}
          <Sidebar
            activeItem={activeSidebarItem}
            onItemSelect={handleSidebarSelect}
            onSearch={handleSidebarSearch}
            collapsed={sidebarCollapsed}
            onToggleCollapse={() => setSidebarCollapsed(prev => !prev)}
            isMobile={isMobile}
            mobileOpen={mobileSidebarOpen}
            onMobileClose={() => setMobileSidebarOpen(false)}
          />

          {/* Main Content */}
          <div className="flex-1 flex flex-col overflow-hidden bg-gray-50">
            {/* Header Section */}
            <div className="bg-white border-b border-gray-200 px-6 py-4">
              <div className="flex items-center justify-between">
                {/* Mobile Menu Button */}
                {isMobile && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleMobileSidebarToggle}
                    className="mr-2"
                  >
                    <Icon icon="bars" className="w-5 h-5" />
                  </Button>
                )}
                
                {/* Title Section */}
                <div className="flex-1">
                  <h1 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                    <Icon icon="exchange-alt" className="w-5 h-5 text-[#1C75BC]" />
                    ERA
                  </h1>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-3">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleOfflineProcessedERAs}
                    className="text-[#1C75BC] border-[#1C75BC] hover:bg-[#1C75BC] hover:text-white"
                  >
                    <Icon icon="file-alt" className="w-4 h-4 mr-2" />
                    Offline Processed ERAs
                  </Button>
                </div>
              </div>

              {/* Breadcrumbs */}
              <div className="mt-4">
                <Breadcrumb items={breadcrumbItems} />
              </div>
            </div>

            {/* Main Content Area */}
            <div className="flex-1 overflow-auto p-6 bg-blue-50">
              <div className="max-w-5xl mx-auto">
                <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
                  {/* Form Content */}
                  <div className="p-6">
                    <div className="grid grid-cols-2 gap-6">
                      {/* Row 1 */}
                      <div className="space-y-2">
                        <Label htmlFor="dateOfEntry" className="text-sm font-medium text-gray-700">
                          Date Of Entry:
                        </Label>
                        <Input
                          id="dateOfEntry"
                          type="date"
                          value={dateOfEntry}
                          onChange={(e) => setDateOfEntry(e.target.value)}
                          className="w-full"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label className="text-sm font-medium text-gray-700">
                          File Upload:
                        </Label>
                        <div className="flex items-center gap-3">
                          <input
                            ref={fileInputRef}
                            type="file"
                            accept=".txt,.835,.x12"
                            onChange={handleFileChange}
                            className="hidden"
                          />
                          <Button
                            type="button"
                            variant="outline"
                            onClick={handleFileButtonClick}
                            className="text-[#1C75BC] border-[#1C75BC] hover:bg-[#1C75BC] hover:text-white"
                          >
                            <Icon icon="upload" className="w-4 h-4 mr-2" />
                            Choose file
                          </Button>
                          <span className="text-sm text-gray-600">
                            {selectedFile ? selectedFile.name : 'No file chosen'}
                          </span>
                        </div>
                      </div>

                      {/* Row 2 */}
                      <div className="space-y-2">
                        <Label htmlFor="postToDate" className="text-sm font-medium text-gray-700">
                          Post To Date:
                        </Label>
                        <div className="relative">
                          <Input
                            id="postToDate"
                            type="date"
                            value={postToDate}
                            onChange={(e) => setPostToDate(e.target.value)}
                            className="w-full pr-10"
                          />
                          <Icon 
                            icon="calendar" 
                            className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" 
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="depositDate" className="text-sm font-medium text-gray-700">
                          Deposit Date:
                        </Label>
                        <div className="relative">
                          <Input
                            id="depositDate"
                            type="date"
                            value={depositDate}
                            onChange={(e) => setDepositDate(e.target.value)}
                            className="w-full pr-10"
                          />
                          <Icon 
                            icon="calendar" 
                            className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" 
                          />
                        </div>
                      </div>

                      {/* Row 3 - Insurance (full width) */}
                      <div className="space-y-2 col-span-2">
                        <Label htmlFor="insurance" className="text-sm font-medium text-gray-700">
                          Insurance:
                        </Label>
                        <Autocomplete
                          options={getInsuranceOptions()}
                          value={insurance}
                          onChange={setInsurance}
                          placeholder="Search insurance..."
                          className="w-full"
                        />
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="mt-8 flex items-center gap-3 border-t border-gray-200 pt-6">
                      <Button
                        onClick={handleProcessERA}
                        className="bg-[#1C75BC] hover:bg-[#155a94] text-white"
                      >
                        <Icon icon="exchange-alt" className="w-4 h-4 mr-2" />
                        Process ERA
                      </Button>
                    </div>

                    {/* Warning Note */}
                    <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                      <p className="text-sm text-red-800 font-medium">
                        <Icon icon="exclamation-triangle" className="w-4 h-4 inline mr-2" />
                        Please Note: Popups MUST be enabled in your browser to successfully post and process the ERA file. Please check this setting in your browser prior to uploading the ERA file.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </TooltipProvider>
  )
}

export default ProcessERAPage

