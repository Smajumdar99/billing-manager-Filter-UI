import { FC, useState, useCallback } from 'react'
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/atoms/Select/select'
import { Textarea } from '@/components/atoms/Textarea/textarea'
import { Switch } from '@/components/atoms/Switch/switch'
import { Autocomplete } from '@/components/atoms/Autocomplete/Autocomplete'
import {
  TooltipProvider,
  TooltipRoot,
  TooltipTrigger,
  TooltipContent
} from '@/components/atoms/Tooltip/tooltip'
import { Breadcrumb } from '@/components/atoms/Breadcrumb/breadcrumb'

/**
 * NewPaymentPage Component
 * 
 * Page for creating a new payment entry.
 */
const NewPaymentPage: FC = () => {
  const navigate = useNavigate()
  useDocumentTitle('New Payment')

  // Mobile detection
  const isMobile = useMediaQuery('(max-width: 768px)')

  // State for sidebar navigation
  const [activeSidebarItem, setActiveSidebarItem] = useState('Payments')
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)

  // Mobile-specific states
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false)

  // Form states
  const [dateOfEntry, setDateOfEntry] = useState(() => {
    const today = new Date()
    return `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`
  })
  const [paymentMethod, setPaymentMethod] = useState('Check Payment')
  const [checkRefNumber, setCheckRefNumber] = useState('')
  const [paymentAmount, setPaymentAmount] = useState('0.00')
  const [payingEntity, setPayingEntity] = useState('Insurance')
  const [paymentCategory, setPaymentCategory] = useState('Funding Source')
  const [location, setLocation] = useState('')
  const [paymentFrom, setPaymentFrom] = useState('')
  const [paymentReceivedBy, setPaymentReceivedBy] = useState('Admin, Ensoftek')
  const [description, setDescription] = useState('')
  const [undistributed, setUndistributed] = useState('0.00')
  const [printReceipt, setPrintReceipt] = useState(true)
  const [allocate, setAllocate] = useState(false)
  const [autoAllocate, setAutoAllocate] = useState(false)

  // Mock data for typeahead options based on paying entity
  const getPaymentFromOptions = useCallback(() => {
    if (payingEntity === 'Insurance') {
      return [
        { 
          value: 'Blue Cross Blue Shield', 
          label: 'Blue Cross Blue Shield',
          code: 'BCBS',
          address: '123 Insurance Blvd, Chicago, IL 60601'
        },
        { 
          value: 'Aetna', 
          label: 'Aetna',
          code: 'AETNA',
          address: '151 Farmington Ave, Hartford, CT 06156'
        },
        { 
          value: 'UnitedHealth', 
          label: 'UnitedHealth',
          code: 'UHC',
          address: '9900 Bren Rd E, Minnetonka, MN 55343'
        },
        { 
          value: 'Cigna', 
          label: 'Cigna',
          code: 'CIGNA',
          address: '900 Cottage Grove Rd, Bloomfield, CT 06002'
        },
        { 
          value: 'Medicare', 
          label: 'Medicare',
          code: 'MEDICARE',
          address: '7500 Security Blvd, Baltimore, MD 21244'
        },
        { 
          value: 'Medicaid', 
          label: 'Medicaid',
          code: 'MEDICAID',
          address: '7500 Security Blvd, Baltimore, MD 21244'
        },
        { 
          value: 'Humana', 
          label: 'Humana',
          code: 'HUMANA',
          address: '500 W Main St, Louisville, KY 40202'
        },
        { 
          value: 'Anthem', 
          label: 'Anthem',
          code: 'ANTHEM',
          address: '220 Virginia Ave, Indianapolis, IN 46204'
        }
      ]
    } else if (payingEntity === 'Patient') {
      return [
        { 
          value: 'John Smith', 
          label: 'John Smith',
          code: 'PID-001',
          address: '123 Main St, Anytown, ST 12345'
        },
        { 
          value: 'Mary Johnson', 
          label: 'Mary Johnson',
          code: 'PID-002',
          address: '456 Oak Ave, Anytown, ST 12345'
        },
        { 
          value: 'Robert Davis', 
          label: 'Robert Davis',
          code: 'PID-003',
          address: '789 Pine Rd, Anytown, ST 12345'
        },
        { 
          value: 'Sarah Thompson', 
          label: 'Sarah Thompson',
          code: 'PID-004',
          address: '321 Elm St, Anytown, ST 12345'
        },
        { 
          value: 'Michael Chen', 
          label: 'Michael Chen',
          code: 'PID-005',
          address: '654 Maple Dr, Anytown, ST 12345'
        },
        { 
          value: 'Emily Rodriguez', 
          label: 'Emily Rodriguez',
          code: 'PID-006',
          address: '987 Cedar Ln, Anytown, ST 12345'
        },
        { 
          value: 'David Martinez', 
          label: 'David Martinez',
          code: 'PID-007',
          address: '147 Birch Way, Anytown, ST 12345'
        },
        { 
          value: 'Jennifer Wilson', 
          label: 'Jennifer Wilson',
          code: 'PID-008',
          address: '258 Spruce Ct, Anytown, ST 12345'
        }
      ]
    } else if (payingEntity === 'Third Party') {
      return [
        { 
          value: 'Third Party Payer A', 
          label: 'Third Party Payer A',
          code: 'TPA-001',
          address: '100 Corporate Dr, Business City, ST 54321'
        },
        { 
          value: 'Third Party Payer B', 
          label: 'Third Party Payer B',
          code: 'TPB-001',
          address: '200 Enterprise Ave, Business City, ST 54321'
        },
        { 
          value: 'Workers Compensation', 
          label: 'Workers Compensation',
          code: 'WC',
          address: '300 Industrial Blvd, Business City, ST 54321'
        },
        { 
          value: 'Liability Insurance', 
          label: 'Liability Insurance',
          code: 'LI',
          address: '400 Legal St, Business City, ST 54321'
        },
        { 
          value: 'Charity Care', 
          label: 'Charity Care',
          code: 'CC',
          address: '500 Charity Way, Business City, ST 54321'
        }
      ]
    }
    return []
  }, [payingEntity])

  // Handle form actions
  const handleSavePayment = useCallback(() => {
    if (allocate) {
      // Navigate to allocation page with payment details
      navigate('/payment-allocation', {
        state: {
          paymentDetails: {
            dateOfEntry,
            paymentMethod,
            checkRefNumber,
            paymentAmount,
            payingEntity,
            paymentCategory,
            location,
            paymentFrom,
            paymentReceivedBy,
            description,
            undistributed
          }
        }
      })
    } else {
      console.log('Saving payment...')
      // Save logic will be implemented here
      navigate('/payments')
    }
  }, [allocate, navigate, dateOfEntry, paymentMethod, checkRefNumber, paymentAmount, payingEntity, paymentCategory, location, paymentFrom, paymentReceivedBy, description, undistributed])

  const handleCancelPayment = useCallback(() => {
    navigate('/payments')
  }, [navigate])

  const handleSaveAndAllocate = useCallback(() => {
    console.log('Saving and allocating payment...')
    // Navigate to payment allocation page with payment details
    navigate('/payment-allocation', {
      state: {
        paymentDetails: {
          dateOfEntry,
          paymentMethod,
          checkRefNumber,
          paymentAmount,
          payingEntity,
          paymentCategory,
          location,
          paymentFrom,
          paymentReceivedBy,
          description,
          undistributed,
        },
      },
    })
  }, [navigate, dateOfEntry, paymentMethod, checkRefNumber, paymentAmount, payingEntity, paymentCategory, location, paymentFrom, paymentReceivedBy, description, undistributed])

  const handleSaveAndAutoAllocate = useCallback(() => {
    console.log('Saving and auto-allocating payment...')
    // Save and auto-allocate logic will be implemented here
  }, [])

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

  // Handle search in the top nav
  const handleSearch = (searchTerm: string) => {
    console.log(`Searching for: ${searchTerm}`)
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
    { label: 'Payments', href: '/payments' },
    { label: 'New Payment' }
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
                    <Icon icon="money-bill-wave" className="w-5 h-5 text-[#1C75BC]" />
                    New Payment
                  </h1>
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
                        <Label htmlFor="paymentMethod" className="text-sm font-medium text-gray-700">
                          Payment Method:
                        </Label>
                        <Select value={paymentMethod} onValueChange={setPaymentMethod}>
                          <SelectTrigger className="w-full">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Check Payment">Check Payment</SelectItem>
                            <SelectItem value="Cash">Cash</SelectItem>
                            <SelectItem value="Credit Card">Credit Card</SelectItem>
                            <SelectItem value="EFT">EFT</SelectItem>
                            <SelectItem value="ACH">ACH</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      {/* Row 2 */}
                      <div className="space-y-2">
                        <Label htmlFor="checkRefNumber" className="text-sm font-medium text-gray-700">
                          Check/Ref Number:
                        </Label>
                        <Input
                          id="checkRefNumber"
                          type="text"
                          value={checkRefNumber}
                          onChange={(e) => setCheckRefNumber(e.target.value)}
                          placeholder="Enter check/ref number"
                          className="w-full"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="paymentAmount" className="text-sm font-medium text-gray-700">
                          Payment Amount:
                        </Label>
                        <Input
                          id="paymentAmount"
                          type="number"
                          step="0.01"
                          value={paymentAmount}
                          onChange={(e) => setPaymentAmount(e.target.value)}
                          className="w-full"
                        />
                      </div>

                      {/* Row 3 */}
                      <div className="space-y-2">
                        <Label htmlFor="payingEntity" className="text-sm font-medium text-gray-700">
                          Paying Entity:
                        </Label>
                        <Select value={payingEntity} onValueChange={setPayingEntity}>
                          <SelectTrigger className="w-full">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Insurance">Insurance</SelectItem>
                            <SelectItem value="Patient">Patient</SelectItem>
                            <SelectItem value="Third Party">Third Party</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="paymentCategory" className="text-sm font-medium text-gray-700">
                          Payment Category:
                        </Label>
                        <Select value={paymentCategory} onValueChange={setPaymentCategory}>
                          <SelectTrigger className="w-full">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Funding Source">Funding Source</SelectItem>
                            <SelectItem value="Copay">Copay</SelectItem>
                            <SelectItem value="Deductible">Deductible</SelectItem>
                            <SelectItem value="Coinsurance">Coinsurance</SelectItem>
                            <SelectItem value="Self Pay">Self Pay</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      {/* Row 4 */}
                      <div className="space-y-2">
                        <Label htmlFor="location" className="text-sm font-medium text-gray-700">
                          Location:
                        </Label>
                        <Select value={location} onValueChange={setLocation}>
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="-- Select Location" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="main">Main Campus</SelectItem>
                            <SelectItem value="satellite1">Satellite Clinic A</SelectItem>
                            <SelectItem value="satellite2">Satellite Clinic B</SelectItem>
                            <SelectItem value="telehealth">Telehealth</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      {/* Row 5 */}
                      <div className="space-y-2">
                        <Label htmlFor="paymentFrom" className="text-sm font-medium text-gray-700">
                          Payment From:
                        </Label>
                        <Autocomplete
                          options={getPaymentFromOptions()}
                          value={paymentFrom}
                          onChange={setPaymentFrom}
                          placeholder={payingEntity ? `Search ${payingEntity.toLowerCase()}...` : "Select paying entity first"}
                          className="w-full"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="paymentReceivedBy" className="text-sm font-medium text-gray-700">
                          Payment Received by:
                        </Label>
                        <Select value={paymentReceivedBy} onValueChange={setPaymentReceivedBy}>
                          <SelectTrigger className="w-full">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Admin, Ensoftek">Admin, Ensoftek</SelectItem>
                            <SelectItem value="Staff Member 1">Staff Member 1</SelectItem>
                            <SelectItem value="Staff Member 2">Staff Member 2</SelectItem>
                            <SelectItem value="System">System</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      {/* Row 6 - Undistributed (full width) */}
                      <div className="space-y-2 col-span-2">
                        <Label htmlFor="undistributed" className="text-sm font-medium text-gray-700">
                          UNDISTRIBUTED:
                        </Label>
                        <Input
                          id="undistributed"
                          type="text"
                          value={undistributed}
                          readOnly
                          className="w-full bg-red-50 border-red-300 text-gray-900 font-medium"
                        />
                      </div>
                    </div>

                    {/* Description Row */}
                    <div className="mt-6">
                      <div className="space-y-2">
                        <Label htmlFor="description" className="text-sm font-medium text-gray-700">
                          Description:
                        </Label>
                        <Textarea
                          id="description"
                          value={description}
                          onChange={(e) => setDescription(e.target.value)}
                          placeholder="Enter description"
                          className="w-full min-h-[100px] resize-y"
                        />
                      </div>
                    </div>

                    {/* Print Receipt Switch */}
                    <div className="mt-6 flex items-center gap-3">
                      <Switch
                        id="printReceipt"
                        checked={printReceipt}
                        onCheckedChange={setPrintReceipt}
                      />
                      <div className="flex flex-col">
                        <Label htmlFor="printReceipt" className="text-sm font-medium text-gray-900 cursor-pointer">
                          Print Receipt
                        </Label>
                        <span className="text-xs text-gray-500">Automatically print a receipt after saving the payment</span>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="mt-8 flex items-center justify-end gap-3 border-t border-gray-200 pt-6">
                      <Button
                        variant="outline"
                        onClick={handleCancelPayment}
                        className="text-[#1C75BC] border-[#1C75BC] hover:bg-[#1C75BC] hover:text-white"
                      >
                        Cancel
                      </Button>
                      <Button
                        onClick={handleSaveAndAllocate}
                      >
                        Save & Allocate
                      </Button>
                      <Button
                        onClick={handleSaveAndAutoAllocate}
                      >
                        Save & Auto Allocate
                      </Button>
                      <Button
                        onClick={handleSavePayment}
                      >
                        Save Payment
                      </Button>
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

export default NewPaymentPage

