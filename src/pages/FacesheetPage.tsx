import { FC, useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { 
  PrinterIcon, 
  ArrowDownTrayIcon,
  UserIcon,
  IdentificationIcon,
  PhoneIcon,
  HomeIcon,
  MapPinIcon,
  HeartIcon,
  BeakerIcon,
  ShieldCheckIcon,
  UserGroupIcon,
  CalendarIcon,
  BuildingOfficeIcon,
  ExclamationTriangleIcon,
  DocumentTextIcon
} from '@heroicons/react/24/outline'
import { Breadcrumb, BreadcrumbItem } from '@/components/atoms/Breadcrumb'
import { Button } from '@/components/atoms/Button'
import TopNavigationBar from '@/components/old-ui/TopNavigationBar'
import MainNavigationBar from '@/components/old-ui/MainNavigationBar'

// Mock data structure - in real app, this would come from API
interface FacesheetData {
  generalInfo: {
    name: string
    pid: string
    father?: string
    mother?: string
    guardian?: string
    age: string
    gender?: string
    ssn: string
    birthPlace: string
    homePhone: string
    mobilePhone: string
    preferredLanguage: string
    levelOfCare?: string
    race?: string
    maritalStatus?: string
    dob: string
    religion?: string
    county: string
    address: string
  }
  diagnosis: {
    primary?: string
    secondary?: string
    allergies: string[]
    advancedDirectives?: string
    codeStatus?: string
  }
  medications: Array<{
    name: string
    drug: string
    dosage: string
    beginDate: string
    endDate?: string
  }>
  icd10Codes: Array<{
    code: string
    description: string
    beginDate: string
    endDate?: string
  }>
  insurance: {
    medicare?: string
    medicaid?: string
  }
  contacts: Array<{
    name: string
    dob?: string
    relation: string
    mobile?: string
    home?: string
    work?: string
    other?: string
  }>
  admission: {
    admitDate: string
    dischargeDate?: string
    program: string
    provider?: string
    careLevel?: string
    type?: string
    location?: {
      wing?: string
      floor?: string
      room?: string
      bed?: string
    }
    readmissions?: Array<{
      readmitDate: string
      dischargeDate: string
      program: string
      provider?: string
    }>
  }
}

const FacesheetPage: FC = () => {
  const { patientId } = useParams<{ patientId: string }>()
  const navigate = useNavigate()
  const [facesheetData, setFacesheetData] = useState<FacesheetData | null>(null)

  console.log('FacesheetPage rendered with patientId:', patientId)

  // Extract patient name from ID format "Name (ID)" if needed
  const patientName = patientId?.includes(' (') 
    ? patientId.split(' (')[0] 
    : patientId || 'Patient'

  // Mock data - in real app, fetch from API
  useEffect(() => {
    // Simulate API call
    const mockData: FacesheetData = {
      generalInfo: {
        name: '',
        pid: '1004873',
        guardian: '1',
        age: '23 months 9 days',
        ssn: 'XXX-XX-1111',
        birthPlace: '111111111111',
        homePhone: '111-111-1111',
        mobilePhone: '111-111-1111',
        preferredLanguage: 'English',
        dob: '20/02/2024',
        county: '1',
        address: "PO BOX 2111111, 1, 1, Califo'rni&a, 1111111"
      },
      diagnosis: {
        primary: 'No data available for your access programs',
        secondary: 'No data available for your access programs',
        allergies: ['Fevadryl', 'Plas/SD']
      },
      medications: [
        { name: 'blood-glucose meter', drug: 'blood-glucose meter', dosage: '1', beginDate: '10/03/2025' },
        { name: 'testosterone cyp, micro (bulk)', drug: 'testosterone cyp, micro (bulk)', dosage: '1', beginDate: '10/03/2025' },
        { name: 'testosterone (bulk)', drug: 'testosterone (bulk)', dosage: '1', beginDate: '10/03/2025' },
        { name: 'urinary tract infxn-ph test', drug: 'urinary tract infxn-ph test', dosage: '4', beginDate: '10/03/2025' },
        { name: 'bun test', drug: 'bun test', dosage: '2', beginDate: '10/03/2025' },
        { name: 'testosterone', drug: 'testosterone', dosage: '2', beginDate: '10/03/2025' }
      ],
      icd10Codes: [
        { code: 'A01.09', description: 'Typhoid fever with other complications', beginDate: '10/03/2025' },
        { code: 'A01.2', description: 'Paratyphoid fever B', beginDate: '10/03/2025' },
        { code: 'A01.3', description: 'Paratyphoid fever C', beginDate: '10/03/2025' },
        { code: 'A25.9', description: 'Rat-bite fever, unspecified', beginDate: '10/03/2025' },
        { code: 'A38.1', description: 'Scarlet fever with myocarditis', beginDate: '10/03/2025' }
      ],
      insurance: {},
      contacts: [
        {
          name: '1',
          relation: 'Conservator or Guardian',
          mobile: '111',
          home: '11',
          work: '11',
          other: '111111111111111'
        }
      ],
      admission: {
        admitDate: '10/03/2025 15:48:00',
        program: 'A-METH',
        readmissions: [
          {
            readmitDate: '10/03/2025 14:01:00',
            dischargeDate: '10/03/2025 14:46:15',
            program: "1111ADiamond1111 Facility"
          }
        ]
      }
    }
    setFacesheetData(mockData)
  }, [patientId])

  const breadcrumbItems: BreadcrumbItem[] = [
    { label: 'Clients', href: '/clients' },
    { label: patientName, href: undefined },
    { label: 'Facesheet', href: undefined }
  ]

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
      navigate('/old-ui')
    } else if (itemName === 'Staff Dashboard') {
      navigate('/staff-dashboard')
    } else if (itemName === 'Billing') {
      navigate('/billing')
    } else if (itemName === 'Practice') {
      navigate('/practice')
    } else if (itemName === 'Reports') {
      navigate('/reports')
    } else if (itemName === 'Administration') {
      navigate('/administration')
    } else if (itemName === 'Wait List') {
      navigate('/wait-list')
    }
  }

  // Handle search in the top nav
  const handleSearch = (searchTerm: string) => {
    console.log(`Searching for: ${searchTerm}`)
  }

  // Handle print action
  const handlePrint = () => {
    console.log('Printing facesheet for patient:', patientId)
    window.print()
  }

  // Handle export action
  const handleExport = () => {
    console.log('Exporting facesheet for patient:', patientId)
    // TODO: Implement export functionality
  }

  return (
    <>
      {/* Print Styles */}
      <style>{`
        @media print {
          /* Hide navigation and non-essential elements */
          .no-print {
            display: none !important;
          }
          
          /* Ensure full width for print */
          body {
            margin: 0;
            padding: 0;
          }
          
          /* Page setup */
          @page {
            margin: 1cm;
            size: A4;
          }
          
          /* Prevent page breaks inside sections */
          .print-section {
            page-break-inside: avoid;
            break-inside: avoid;
          }
          
          /* Prevent orphaned rows */
          table {
            page-break-inside: auto;
          }
          
          tr {
            page-break-inside: avoid;
            page-break-after: auto;
          }
          
          thead {
            display: table-header-group;
          }
          
          tfoot {
            display: table-footer-group;
          }
          
          /* Ensure tables don't break awkwardly */
          .print-table-container {
            page-break-inside: avoid;
          }
          
          /* Background colors for print */
          .bg-white,
          .bg-gray-50 {
            background: white !important;
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }
          
          /* Borders for print */
          .border-gray-200,
          .border-gray-100 {
            border-color: #e5e7eb !important;
          }
          
          /* Text colors */
          .text-gray-900,
          .text-gray-700,
          .text-gray-600 {
            color: #000 !important;
          }
          
          /* Shadows for print */
          .shadow-sm,
          .shadow-lg {
            box-shadow: none !important;
          }
          
          /* Remove overflow hidden for print */
          .overflow-hidden {
            overflow: visible !important;
          }
          
          /* Ensure proper spacing */
          .print-section {
            margin-bottom: 1rem;
          }
        }
      `}</style>
      
      <div className="flex flex-col min-h-screen bg-white">
        {/* Top Navigation Bar */}
        <div className="no-print">
          <TopNavigationBar 
            hospitalName="Mayank Hospitals"
            userAvatarUrl="https://ui-avatars.com/api/?name=Darlene+Robertson"
            onSearch={handleSearch}
          />
        </div>

        {/* Main Navigation */}
        <div className="no-print">
          <MainNavigationBar 
            activeItem="Clients"
            onNavigate={handleMainNavigation}
          />
        </div>

        {/* Content Area */}
        <div className="flex flex-1 min-h-0">
          {/* Main Content */}
          <div className="flex-1 bg-gray-50 overflow-y-auto">
            {/* Breadcrumb Navigation */}
            <div className="bg-white border-b border-gray-200 px-6 py-3 no-print">
              <div className="flex items-center justify-between">
                <Breadcrumb 
                  items={breadcrumbItems} 
                  onNavigate={(href) => {
                    if (href === '/clients') {
                      navigate('/old-ui')
                    }
                  }}
                />
                
                {/* Action Buttons */}
                <div className="flex items-center gap-3">
                  <Button
                    onClick={handlePrint}
                    variant="outline"
                    className="flex items-center gap-2"
                  >
                    <PrinterIcon className="h-4 w-4" />
                    Print
                  </Button>
                  <Button
                    onClick={handleExport}
                    variant="outline"
                    className="flex items-center gap-2"
                  >
                    <ArrowDownTrayIcon className="h-4 w-4" />
                    Export
                  </Button>
                </div>
              </div>
            </div>

          {/* Page Content */}
          <div className="container mx-auto px-6 py-8 max-w-7xl print:max-w-full print:px-0 print:py-4">
            {facesheetData ? (
              <div className="space-y-6 print:space-y-4">
                {/* Header Card - Compact Apple Design Style */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 print-section print:rounded-none print:border print:border-gray-300 print:p-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <h1 className="text-xl font-semibold text-gray-900 tracking-tight">Facesheet</h1>
                      <span className="text-xs text-gray-400">•</span>
                      <p className="text-sm text-gray-600">Patient ID: <span className="font-medium text-gray-900">{facesheetData.generalInfo.pid}</span></p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-gray-500 font-medium">{new Date().toLocaleDateString('en-GB')}</p>
                    </div>
                  </div>
                </div>

                {/* General Information - Full Width */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden print-section print:rounded-none print:border print:border-gray-300 print:break-inside-avoid">
                  <div className="bg-gray-50 px-4 py-3 border-b border-gray-200 print:bg-white print:px-3 print:py-2">
                    <div className="flex items-center gap-2">
                      <UserIcon className="h-4 w-4 text-blue-600 print:hidden" />
                      <h2 className="text-lg font-semibold text-gray-900 print:text-base">General Information</h2>
                    </div>
                  </div>
                  <div className="p-4 print:p-3">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 print:grid-cols-4 print:gap-4">
                      {/* Personal Information Table */}
                      <div className="overflow-hidden print-table-container">
                        <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 px-1 print:text-xs">Personal</h3>
                        <table className="w-full divide-y divide-gray-100 print:text-xs">
                          <tbody className="divide-y divide-gray-100">
                            <TableRow label="Name" value={facesheetData.generalInfo.name || `(PID# ${facesheetData.generalInfo.pid})`} />
                            <TableRow label="Age" value={facesheetData.generalInfo.age} />
                            <TableRow label="Gender" value={facesheetData.generalInfo.gender} />
                            <TableRow label="DOB" value={facesheetData.generalInfo.dob} />
                            <TableRow label="SS No" value={facesheetData.generalInfo.ssn} />
                            <TableRow label="Birth Place" value={facesheetData.generalInfo.birthPlace} />
                          </tbody>
                        </table>
                      </div>

                      {/* Family Information Table */}
                      <div className="overflow-hidden print-table-container">
                        <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 px-1 print:text-xs">Family</h3>
                        <table className="w-full divide-y divide-gray-100 print:text-xs">
                          <tbody className="divide-y divide-gray-100">
                            <TableRow label="Father" value={facesheetData.generalInfo.father} />
                            <TableRow label="Mother" value={facesheetData.generalInfo.mother} />
                            <TableRow label="Guardian" value={facesheetData.generalInfo.guardian} />
                            <TableRow label="Marital Status" value={facesheetData.generalInfo.maritalStatus} />
                          </tbody>
                        </table>
                      </div>

                      {/* Demographics Table */}
                      <div className="overflow-hidden print-table-container">
                        <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 px-1 print:text-xs">Demographics</h3>
                        <table className="w-full divide-y divide-gray-100 print:text-xs">
                          <tbody className="divide-y divide-gray-100">
                            <TableRow label="Race" value={facesheetData.generalInfo.race} />
                            <TableRow label="Religion" value={facesheetData.generalInfo.religion} />
                            <TableRow label="Language" value={facesheetData.generalInfo.preferredLanguage} />
                            <TableRow label="Care Level" value={facesheetData.generalInfo.levelOfCare} />
                          </tbody>
                        </table>
                      </div>

                      {/* Contact Information Table */}
                      <div className="overflow-hidden print-table-container">
                        <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 px-1 print:text-xs">Contact</h3>
                        <table className="w-full divide-y divide-gray-100 print:text-xs">
                          <tbody className="divide-y divide-gray-100">
                            <TableRow label="Home" value={facesheetData.generalInfo.homePhone} />
                            <TableRow label="Mobile" value={facesheetData.generalInfo.mobilePhone} />
                            <TableRow label="Address" value={facesheetData.generalInfo.address} />
                            <TableRow label="County" value={facesheetData.generalInfo.county} />
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Diagnosis & Allergies and Insurance - Side by Side */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 print:grid-cols-2 print:gap-4">
                  {/* Diagnosis/Allergies/Advanced Directives */}
                  <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden print-section print:rounded-none print:border print:border-gray-300 print:break-inside-avoid">
                    <div className="bg-gray-50 px-4 py-3 border-b border-gray-200 print:bg-white print:px-3 print:py-2">
                      <div className="flex items-center gap-2">
                        <HeartIcon className="h-4 w-4 text-red-600 print:hidden" />
                        <h2 className="text-lg font-semibold text-gray-900 print:text-base">Diagnosis & Allergies</h2>
                      </div>
                    </div>
                    <div className="p-4 print:p-3">
                      <div className="space-y-3">
                        <InfoField label="Primary Diagnosis" value={facesheetData.diagnosis.primary} showEmpty />
                        <InfoField label="Secondary Diagnosis" value={facesheetData.diagnosis.secondary} showEmpty />
                        <div>
                          <label className="block text-xs font-medium text-gray-700 mb-2">Allergies</label>
                          {facesheetData.diagnosis.allergies.length > 0 ? (
                            <div className="flex flex-wrap gap-2">
                              {facesheetData.diagnosis.allergies.map((allergy, idx) => (
                                <span key={idx} className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                                  <ExclamationTriangleIcon className="h-3 w-3 mr-1" />
                                  {allergy}
                                </span>
                              ))}
                            </div>
                          ) : (
                            <p className="text-gray-500 text-xs">No allergies recorded</p>
                          )}
                        </div>
                        <InfoField label="Advanced Directives" value={facesheetData.diagnosis.advancedDirectives || facesheetData.diagnosis.codeStatus} showEmpty />
                      </div>
                    </div>
                  </div>

                  {/* Insurance Information */}
                  <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden print-section print:rounded-none print:border print:border-gray-300 print:break-inside-avoid">
                    <div className="bg-gray-50 px-4 py-3 border-b border-gray-200 print:bg-white print:px-3 print:py-2">
                      <div className="flex items-center gap-2">
                        <ShieldCheckIcon className="h-4 w-4 text-green-600 print:hidden" />
                        <h2 className="text-lg font-semibold text-gray-900 print:text-base">Insurance</h2>
                      </div>
                    </div>
                    <div className="p-4 print:p-3">
                      <div className="space-y-3">
                        <InfoField label="Medicare#" value={facesheetData.insurance.medicare} showEmpty />
                        <InfoField label="Medicaid#" value={facesheetData.insurance.medicaid} showEmpty />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Medications - Full Width */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden print-section print:rounded-none print:border print:border-gray-300 print:break-inside-avoid">
                  <div className="bg-gray-50 px-4 py-3 border-b border-gray-200 print:bg-white print:px-3 print:py-2">
                    <div className="flex items-center gap-2">
                      <BeakerIcon className="h-4 w-4 text-purple-600 print:hidden" />
                      <h2 className="text-lg font-semibold text-gray-900 print:text-base">Medications</h2>
                    </div>
                  </div>
                  <div className="p-4 print:p-3">
                    <div className="overflow-x-auto print:overflow-visible">
                      <table className="w-full divide-y divide-gray-200 print:text-xs">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                            <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Drug</th>
                            <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Dosage</th>
                            <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Begin Date</th>
                            <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">End Date</th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {facesheetData.medications.map((med, idx) => (
                            <tr key={idx} className="hover:bg-gray-50">
                              <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-900">{med.name}</td>
                              <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-900">{med.drug}</td>
                              <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-900">{med.dosage}</td>
                              <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-900">{med.beginDate}</td>
                              <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-500">{med.endDate || '-'}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    
                    {/* ICD10 Codes */}
                    {facesheetData.icd10Codes.length > 0 && (
                      <div className="mt-4 pt-4 border-t border-gray-200">
                        <h3 className="text-xs font-semibold text-gray-900 mb-2">ICD10 Codes</h3>
                        <div className="space-y-1.5">
                          {facesheetData.icd10Codes.map((code, idx) => (
                            <div key={idx} className="flex items-center gap-2 p-1.5 bg-gray-50 rounded text-xs">
                              <span className="font-mono text-blue-600">{code.code}</span>
                              <span className="text-gray-700 flex-1">{code.description}</span>
                              <span className="text-gray-500 text-xs">Begin: {code.beginDate}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Contacts - Full Width */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden print-section print:rounded-none print:border print:border-gray-300 print:break-inside-avoid">
                  <div className="bg-gray-50 px-4 py-3 border-b border-gray-200 print:bg-white print:px-3 print:py-2">
                    <div className="flex items-center gap-2">
                      <UserGroupIcon className="h-4 w-4 text-indigo-600 print:hidden" />
                      <h2 className="text-lg font-semibold text-gray-900 print:text-base">Contacts</h2>
                    </div>
                  </div>
                  <div className="p-4 print:p-3">
                    <h3 className="text-xs font-semibold text-gray-700 mb-3 underline print:text-xs">Emergency</h3>
                    <div className="overflow-x-auto print:overflow-visible">
                      <table className="w-full divide-y divide-gray-200 print:text-xs">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                            <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">DOB</th>
                            <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Relation</th>
                            <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Mobile</th>
                            <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Home</th>
                            <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Work</th>
                            <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Other</th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {facesheetData.contacts.map((contact, idx) => (
                            <tr key={idx} className="hover:bg-gray-50">
                              <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-900">{contact.name}</td>
                              <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-500">{contact.dob || '-'}</td>
                              <td className="px-3 py-2 text-xs text-gray-900">{contact.relation}</td>
                              <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-900">{contact.mobile || '-'}</td>
                              <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-900">{contact.home || '-'}</td>
                              <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-900">{contact.work || '-'}</td>
                              <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-900">{contact.other || '-'}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>

                {/* Admission Information */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden print-section print:rounded-none print:border print:border-gray-300 print:break-inside-avoid">
                  <div className="bg-gray-50 px-4 py-3 border-b border-gray-200 print:bg-white print:px-3 print:py-2">
                    <div className="flex items-center gap-2">
                      <BuildingOfficeIcon className="h-4 w-4 text-orange-600 print:hidden" />
                      <h2 className="text-lg font-semibold text-gray-900 print:text-base">Admission</h2>
                    </div>
                  </div>
                  <div className="p-4 print:p-3">
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <InfoField label="Admit Date" value={facesheetData.admission.admitDate} icon={CalendarIcon} />
                      <InfoField label="Discharge Date" value={facesheetData.admission.dischargeDate} icon={CalendarIcon} showEmpty />
                      <InfoField label="Program" value={facesheetData.admission.program} icon={BuildingOfficeIcon} />
                      <InfoField label="Provider" value={facesheetData.admission.provider} icon={UserIcon} showEmpty />
                      <InfoField label="Care Level" value={facesheetData.admission.careLevel} icon={HeartIcon} showEmpty />
                      <InfoField label="Type" value={facesheetData.admission.type} icon={DocumentTextIcon} showEmpty />
                    </div>
                    
                    <div className="mb-4 pt-4 border-t border-gray-200">
                      <h3 className="text-xs font-semibold text-gray-700 mb-2">Location</h3>
                      <div className="grid grid-cols-4 gap-3">
                        <InfoField label="Wing" value={facesheetData.admission.location?.wing} showEmpty />
                        <InfoField label="Floor" value={facesheetData.admission.location?.floor} showEmpty />
                        <InfoField label="Room" value={facesheetData.admission.location?.room} showEmpty />
                        <InfoField label="Bed" value={facesheetData.admission.location?.bed} showEmpty />
                      </div>
                    </div>

                    {facesheetData.admission.readmissions && facesheetData.admission.readmissions.length > 0 && (
                      <div className="pt-4 border-t border-gray-200">
                        <h3 className="text-xs font-semibold text-gray-700 mb-3">Re-admissions</h3>
                        <div className="space-y-2">
                          {facesheetData.admission.readmissions.map((readmit, idx) => (
                            <div key={idx} className="p-2 bg-gray-50 rounded text-xs">
                              <div className="grid grid-cols-3 gap-2">
                                <InfoField label="Re-admit Date" value={readmit.readmitDate} />
                                <InfoField label="Discharge Date" value={readmit.dischargeDate} />
                                <InfoField label="Program" value={readmit.program} />
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

              </div>
            ) : (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
                <div className="text-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                  <p className="text-gray-600">Loading facesheet data...</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
    </>
  )
}

// Helper component for table rows
interface TableRowProps {
  label: string
  value?: string
}

const TableRow: FC<TableRowProps> = ({ label, value }) => {
  return (
    <tr className="hover:bg-gray-50 transition-colors">
      <td className="px-3 py-2 whitespace-nowrap text-xs font-medium text-gray-500 uppercase tracking-wide w-1/3">
        {label}
      </td>
      <td className="px-3 py-2 text-xs text-gray-900 break-words">
        {value || <span className="text-gray-400 italic">Not specified</span>}
      </td>
    </tr>
  )
}

// Helper component for info fields (used in other sections)
interface InfoFieldProps {
  label: string
  value?: string
  icon?: React.ComponentType<{ className?: string }>
  showEmpty?: boolean
}

const InfoField: FC<InfoFieldProps> = ({ label, value, icon: Icon, showEmpty = false }) => {
  if (!showEmpty && !value) return null
  
  return (
    <div className="flex items-start gap-3">
      {Icon && <Icon className="h-5 w-5 text-gray-400 mt-0.5 flex-shrink-0" />}
      <div className="flex-1 min-w-0">
        <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
          {label}
        </label>
        <p className={`text-sm break-words ${value ? 'text-gray-900' : 'text-gray-400 italic'}`}>
          {value || 'Not specified'}
        </p>
      </div>
    </div>
  )
}

export default FacesheetPage
