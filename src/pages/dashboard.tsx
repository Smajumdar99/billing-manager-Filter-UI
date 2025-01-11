import { FC, useState, useEffect } from 'react'
import { useDocumentTitle } from '@/hooks/useDocumentTitle'
import { Squares2X2Icon, UserIcon, UsersIcon, BanknotesIcon, ChartBarIcon, QuestionMarkCircleIcon, Cog6ToothIcon, ArrowPathIcon, CalendarIcon, ClipboardDocumentListIcon, HomeIcon } from "@heroicons/react/24/outline"
import { Sidebar } from "@/components/organisms/Sidebar"
import { NavSection } from '@/types/navigation'
import { Header } from '@/components/organisms/Header'
import { Widget } from '@/components/molecules/Widget'
import { WidgetGrid } from '@/components/organisms/WidgetGrid'
import '@/styles/widget-grid.css'
import { getUserSettings, saveUserSettings } from '@/services/firestore'
import { ConfirmDialog } from '@/components/molecules/ConfirmDialog/confirm-dialog'
import { Button } from '@/components/atoms/Button'
import { AppointmentsWidget } from '@/components/molecules/AppointmentsWidget/appointments-widget'
import { Appointment } from '@/types/appointment'
import { PatientOverviewWidget } from '@/components/molecules/PatientOverviewWidget/patient-overview-widget'
import { PendingReferralsWidget } from '@/components/molecules/PendingReferralsWidget/pending-referrals-widget'
import { MessagesWidget } from '@/components/molecules/MessagesWidget/messages-widget'
import { NotificationsDrawer } from '@/components/organisms/NotificationsDrawer/notifications-drawer'
import { Layouts, WidgetLayout } from '@/types/layout'
import { SidebarMenu } from '@/components/organisms/SidebarMenu'
import { Skeleton } from "@/components/atoms/Skeleton/skeleton"
import { useCurrentUser } from '@/hooks/useCurrentUser'

const navigation: NavSection[] = [
  {
    items: [
      {
        title: "Dashboard",
        path: "/dashboard",
        icon: <HomeIcon className="w-5 h-5" />,
        children: [
          {
            title: "Overview",
            path: "/dashboard",
          },
          {
            title: "My Tasks",
            path: "/dashboard/tasks",
          }
        ]
      },
      {
        title: "Patient Care",
        path: "/patient-care",
        icon: <UserIcon className="w-5 h-5" />,
        children: [
            {
              title: "Intake and Onboarding",
              path: "/patient-care/intake",
            },
            {
              title: "All Encounters",
              path: "/patient-care/all-encounters",
            },
            {
              title: "All Patients",
              path: "/patient-care/all-patients",
            },
            {
              title: "Assessments & Treatment Plans",
              path: "/patient-care/assessments-treatment-plans",
            },
            {
              title: "Follow ups",
              path: "/patient-care/follow-ups",
            },
            {
              title: "Referrals",
              path: "/patient-care/referrals",
            },
            {
              title: "Patient Incidents",
              path: "/patient-care/patient-incidents",
            }
          ]
      },
      {
        title: "Clinic Operations",
        path: "/clinic-operations",
        icon: <UsersIcon className="w-5 h-5" />
      },
      {
        title: "Billing & Financials",
        path: "/billing",
        icon: <BanknotesIcon className="w-5 h-5" />
      },
      {
        title: "Reports and Analytics",
        path: "/reports",
        icon: <ChartBarIcon className="w-5 h-5" />
      }
    ]
  },
  {
    items: [
      {
        title: "Support",
        path: "/support",
        icon: <QuestionMarkCircleIcon className="w-5 h-5" />
      },
      {
        title: "Settings",
        path: "/settings",
        icon: <Cog6ToothIcon className="w-5 h-5" />
      }
    ]
  }
]

export const defaultLayouts: Layouts = {
  lg: [
    { 
      i: 'appointments', 
      x: 0, 
      y: 0, 
      w: 6, 
      h: 6, 
      minW: 4, 
      minH: 6, 
      isResizable: true,
      isDraggable: true,
      static: false
    },
    { 
      i: 'patients', 
      x: 6, 
      y: 0, 
      w: 6, 
      h: 6, 
      minW: 4, 
      minH: 4, 
      isResizable: true,
      isDraggable: true,
      static: false
    },
    { 
      i: 'tasks', 
      x: 0, 
      y: 6, 
      w: 6, 
      h: 6, 
      minW: 4, 
      minH: 4, 
      isResizable: true,
      isDraggable: true,
      static: false
    },
    { 
      i: 'referrals', 
      x: 6, 
      y: 6, 
      w: 6,
      h: 6,
      minW: 4,
      minH: 4,
      isResizable: true,
      isDraggable: true,
      static: false
    }
  ],
  md: [
    { 
      i: 'appointments', 
      x: 0, 
      y: 0, 
      w: 6, 
      h: 6, 
      minW: 4, 
      minH: 6, 
      isResizable: true,
      isDraggable: true,
      static: false
    },
    { 
      i: 'patients', 
      x: 6, 
      y: 0, 
      w: 6, 
      h: 6, 
      minW: 4, 
      minH: 4, 
      isResizable: true,
      isDraggable: true,
      static: false
    },
    { 
      i: 'tasks', 
      x: 0, 
      y: 6, 
      w: 6, 
      h: 6, 
      minW: 4, 
      minH: 4, 
      isResizable: true,
      isDraggable: true,
      static: false
    },
    { 
      i: 'referrals', 
      x: 6, 
      y: 6, 
      w: 6,
      h: 6,
      minW: 4,
      minH: 4,
      isResizable: true,
      isDraggable: true,
      static: false
    }
  ],
  sm: [
    { 
      i: 'appointments', 
      x: 0, 
      y: 0, 
      w: 12, 
      h: 6, 
      minW: 6, 
      minH: 6, 
      isResizable: true,
      isDraggable: true,
      static: false
    },
    { 
      i: 'patients', 
      x: 0, 
      y: 6, 
      w: 12, 
      h: 6, 
      minW: 6, 
      minH: 4, 
      isResizable: true,
      isDraggable: true,
      static: false
    },
    { 
      i: 'tasks', 
      x: 0, 
      y: 12, 
      w: 12, 
      h: 6, 
      minW: 6, 
      minH: 4, 
      isResizable: true,
      isDraggable: true,
      static: false
    },
    { 
      i: 'referrals', 
      x: 0, 
      y: 18, 
      w: 12,
      h: 6,
      minW: 6,
      minH: 4,
      isResizable: true,
      isDraggable: true,
      static: false
    }
  ]
}

const mockAppointments: Appointment[] = [
  // 7 AM Slot
  {
    id: '1',
    patientName: 'John Doe',
    time: '07:10',
    date: new Date(),
    status: 'confirmed',
    type: 'initial',
    duration: 30
  },
  {
    id: '2',
    patientName: 'Devon Lane',
    time: '07:20',
    date: new Date(),
    status: 'checkedIn',
    type: 'newPatient',
    duration: 30
  },
  {
    id: '3',
    patientName: 'Jane Cooper',
    time: '07:30',
    date: new Date(),
    status: 'checkedIn',
    type: 'newPatient',
    duration: 30
  },
  // 8 AM Slot
  {
    id: '4',
    patientName: 'Cody Fisher',
    time: '08:30',
    date: new Date(),
    status: 'scheduled',
    type: 'followUp',
    duration: 45
  },
  // 9 AM Slot
  {
    id: '5',
    patientName: 'Darlene Robertson',
    time: '09:00',
    date: new Date(),
    status: 'confirmed',
    type: 'initial',
    duration: 60
  },
  {
    id: '6',
    patientName: 'Courtney Henry',
    time: '09:20',
    date: new Date(),
    status: 'scheduled',
    type: 'followUp',
    duration: 30
  },
  // 10 AM Slot
  {
    id: '7',
    patientName: 'Floyd Miles',
    time: '10:00',
    date: new Date(),
    status: 'confirmed',
    type: 'initial',
    duration: 45
  },
  {
    id: '8',
    patientName: 'Robert Fox',
    time: '10:20',
    date: new Date(),
    status: 'scheduled',
    type: 'followUp',
    duration: 30
  },
  {
    id: '9',
    patientName: 'Dianne Russell',
    time: '10:25',
    date: new Date(),
    status: 'scheduled',
    type: 'followUp',
    duration: 30
  },
  // 11 AM Slot
  {
    id: '10',
    patientName: 'Eleanor Pena',
    time: '11:00',
    date: new Date(),
    status: 'confirmed',
    type: 'initial',
    duration: 45
  },
  {
    id: '11',
    patientName: 'Theresa Webb',
    time: '11:30',
    date: new Date(),
    status: 'scheduled',
    type: 'followUp',
    duration: 30
  },
  // 2 PM Slot
  {
    id: '12',
    patientName: 'Cameron Williamson',
    time: '14:00',
    date: new Date(),
    status: 'confirmed',
    type: 'newPatient',
    duration: 60
  },
  {
    id: '13',
    patientName: 'Brooklyn Simmons',
    time: '14:30',
    date: new Date(),
    status: 'scheduled',
    type: 'followUp',
    duration: 30
  }
]

const mockPatients = [
  {
    id: '1',
    name: 'Jhon Doe',
    avatar: 'https://ui-avatars.com/api/?name=Jhon+Doe&background=random',
    appointmentType: 'Initial Assessment',
    clinician: {
      name: 'Dr. Michelle',
      avatar: 'https://ui-avatars.com/api/?name=Dr+Michelle&background=random',
      title: 'MD'
    },
    status: 'Checked In'
  },
  {
    id: '2',
    name: 'Jane Cooper',
    avatar: 'https://ui-avatars.com/api/?name=Jane+Cooper&background=random',
    appointmentType: 'Follow-up',
    clinician: {
      name: 'Jorge',
      avatar: 'https://ui-avatars.com/api/?name=Jorge&background=random'
    },
    status: 'Waiting to Check In'
  },
  {
    id: '3',
    name: 'Colleen',
    avatar: 'https://ui-avatars.com/api/?name=Colleen&background=random',
    appointmentType: 'New Patient',
    clinician: {
      name: 'Courtney',
      avatar: 'https://ui-avatars.com/api/?name=Courtney&background=random'
    },
    status: 'Arrival',
    arrivalTime: 'Tomorrow'
  },
  {
    id: '4',
    name: 'Priscilla',
    avatar: 'https://ui-avatars.com/api/?name=Priscilla&background=random',
    appointmentType: 'New Patient',
    clinician: {
      name: 'Orosz Boldizsár',
      avatar: 'https://ui-avatars.com/api/?name=Orosz+Boldizsar&background=random'
    },
    status: 'Waiting to Check In'
  },
  {
    id: '5',
    name: 'Brandie',
    avatar: 'https://ui-avatars.com/api/?name=Brandie&background=random',
    appointmentType: 'Follow-up',
    clinician: {
      name: 'Emma',
      avatar: 'https://ui-avatars.com/api/?name=Emma&background=random'
    },
    status: 'Checked In'
  }
]

const mockReferrals = [
  {
    id: '1',
    name: 'Albert Flores',
    age: 62,
    state: 'NY',
    source: 'Web Link',
    avatar: 'https://ui-avatars.com/api/?name=Albert+Flores&background=F5F5F4'
  },
  {
    id: '2',
    name: 'Esther Howard',
    age: 77,
    state: 'NJ',
    source: 'Campaign 1',
    avatar: 'https://ui-avatars.com/api/?name=Esther+Howard&background=F0F7FF'
  },
  {
    id: '3',
    name: 'Guy Hawkins',
    age: 72,
    state: 'NY',
    source: 'Internal',
    avatar: 'https://ui-avatars.com/api/?name=Guy+Hawkins&background=F3F4F6'
  }
]

const mockMessages = [
  {
    id: '1',
    sender: {
      name: 'Wade Warren',
      type: 'Patient',
      avatar: 'https://ui-avatars.com/api/?name=Wade+Warren'
    },
    content: 'Hi, I have a question about my upcoming appointment.',
    time: '10:15 AM',
    unreadCount: 3
  },
  {
    id: '2',
    sender: {
      name: 'Dr. Michelle',
      type: 'Clinician',
      avatar: 'https://ui-avatars.com/api/?name=Dr+Michelle'
    },
    content: 'Hi, I have a question about my upcoming appointment.',
    time: '11:30 AM',
    unreadCount: 1
  },
  {
    id: '3',
    sender: {
      name: 'Sarah Wilson',
      type: 'Patient',
      avatar: 'https://ui-avatars.com/api/?name=Sarah+Wilson'
    },
    content: "I've completed my intake forms. Can you confirm you've received them?",
    time: '1:45 PM',
    unreadCount: 2
  },
  {
    id: '4',
    sender: {
      name: 'Dr. James',
      type: 'Clinician',
      avatar: 'https://ui-avatars.com/api/?name=Dr+James'
    },
    content: 'Please prepare the assessment room for our 3:30 PM session',
    time: '2:15 PM',
    unreadCount: 1
  }
]

const mockAlerts = [
  {
    id: '1',
    title: 'Review and Update Treatment Plan for John Doe',
    description: 'Treatment plan expired for Jhon Deo. Review and update'
  },
  {
    id: '2',
    title: 'Emergency Alert',
    description: 'Medical emergency in Room 3. Please call 911 and notify the clinical team immediately.'
  },
  {
    id: '3',
    title: 'Patient Special Needs',
    description: 'Jane Smith requires wheelchair assistance. Please make necessary accommodations for her visit'
  },
  {
    id: '4',
    title: 'Billing Notice',
    description: 'Emily Johnson has an outstanding balance. Kindly inform her about the pending payment during her visit.'
  }
]

const mockTasks = [
  {
    id: '1',
    title: 'Verify Patient Insurance',
    description: 'Confirm insurance coverage for today\'s appointments',
    assignee: 'Cris Brown',
    dueDate: 'Tomorrow'
  },
  {
    id: '2',
    title: 'Update Patient Records',
    description: 'Review and update patient records in the EHR system',
    assignee: 'Jenny Wilson',
    dueDate: '09 Sep'
  },
  {
    id: '3',
    title: 'Emergency Response Readiness',
    description: 'Ensure emergency response kit is ready and accessible',
    assignee: 'Cris Brown',
    dueDate: '10 Sep'
  }
]

const DashboardSkeleton: FC = () => {
  return (
    <div className="flex h-screen bg-background overflow-hidden">
      {/* Sidebar Skeleton */}
      <div className="hidden lg:flex w-64 flex-col fixed inset-y-0">
        <div className="flex flex-col flex-grow pt-5 bg-card overflow-y-auto border-r">
          <div className="px-4 mb-8">
            <Skeleton className="h-8 w-32" />
          </div>
          {/* Navigation Items */}
          <div className="space-y-6 px-4">
            <div className="space-y-2">
              <Skeleton className="h-10 w-full rounded-lg" />
              <Skeleton className="h-10 w-11/12 rounded-lg ml-4" />
              <Skeleton className="h-10 w-10/12 rounded-lg ml-4" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-10 w-full rounded-lg" />
              <Skeleton className="h-10 w-11/12 rounded-lg ml-4" />
            </div>
            <Skeleton className="h-10 w-full rounded-lg" />
            <Skeleton className="h-10 w-full rounded-lg" />
          </div>
          {/* User Profile Skeleton */}
          <div className="mt-auto p-4">
            <div className="flex items-center space-x-3">
              <Skeleton className="h-10 w-10 rounded-full" />
              <div className="flex-1">
                <Skeleton className="h-4 w-24 mb-2" />
                <Skeleton className="h-3 w-20" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 w-full lg:pl-64">
        {/* Header Skeleton */}
        <header className="h-16 bg-card border-b flex items-center justify-between px-4">
          <div className="flex items-center space-x-4">
            <Skeleton className="h-10 w-10 rounded-lg" /> {/* Menu Icon */}
            <Skeleton className="h-8 w-64 rounded-full" /> {/* Search Bar */}
          </div>
          <div className="flex items-center space-x-3">
            <Skeleton className="h-9 w-9 rounded-full" />
            <Skeleton className="h-9 w-9 rounded-full" />
            <Skeleton className="h-9 w-9 rounded-full" />
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 overflow-auto p-6">
          {/* Welcome Section */}
          <div className="flex justify-between items-center mb-6">
            <Skeleton className="h-8 w-64" />
            <div className="flex space-x-3">
              <Skeleton className="h-9 w-40 rounded-lg" />
              <Skeleton className="h-9 w-9 rounded-full" />
            </div>
          </div>

          {/* Widget Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Appointments Widget */}
            <div className="bg-card rounded-xl p-5 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <Skeleton className="h-6 w-32" />
                <Skeleton className="h-8 w-8 rounded-lg" />
              </div>
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex items-center space-x-4">
                    <Skeleton className="h-12 w-12 rounded-full" />
                    <div className="flex-1">
                      <Skeleton className="h-4 w-32 mb-2" />
                      <Skeleton className="h-3 w-24" />
                    </div>
                    <Skeleton className="h-8 w-20 rounded-lg" />
                  </div>
                ))}
              </div>
            </div>

            {/* Patient Overview Widget */}
            <div className="bg-card rounded-xl p-5 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <Skeleton className="h-6 w-40" />
                <div className="flex space-x-2">
                  <Skeleton className="h-8 w-8 rounded-lg" />
                  <Skeleton className="h-8 w-8 rounded-lg" />
                </div>
              </div>
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex items-center p-3 rounded-lg border">
                    <Skeleton className="h-10 w-10 rounded-full" />
                    <div className="ml-3 flex-1">
                      <Skeleton className="h-4 w-28 mb-2" />
                      <Skeleton className="h-3 w-20" />
                    </div>
                    <Skeleton className="h-6 w-24 rounded-full" />
                  </div>
                ))}
              </div>
            </div>

            {/* Messages Widget */}
            <div className="bg-card rounded-xl p-5 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <Skeleton className="h-6 w-24" />
                <Skeleton className="h-8 w-8 rounded-lg" />
              </div>
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex items-start space-x-3">
                    <Skeleton className="h-10 w-10 rounded-full" />
                    <div className="flex-1">
                      <Skeleton className="h-4 w-full max-w-[250px] mb-2" />
                      <Skeleton className="h-3 w-20" />
                    </div>
                    <Skeleton className="h-5 w-5 rounded-full" />
                  </div>
                ))}
              </div>
            </div>

            {/* Referrals Widget */}
            <div className="bg-card rounded-xl p-5 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <Skeleton className="h-6 w-36" />
                <Skeleton className="h-8 w-8 rounded-lg" />
              </div>
              <div className="space-y-3">
                {[1, 2].map((i) => (
                  <div key={i} className="flex items-center space-x-3 p-3 rounded-lg border">
                    <Skeleton className="h-12 w-12 rounded-full" />
                    <div className="flex-1">
                      <Skeleton className="h-4 w-32 mb-2" />
                      <div className="flex space-x-2">
                        <Skeleton className="h-3 w-16" />
                        <Skeleton className="h-3 w-16" />
                      </div>
                    </div>
                    <Skeleton className="h-8 w-8 rounded-lg" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}

export const DashboardPage: FC = () => {
  useDocumentTitle('Dashboard')
  const { user } = useCurrentUser()
  const [isLoading, setIsLoading] = useState(true)
  const [layouts, setLayouts] = useState(defaultLayouts)
  const [isResetDialogOpen, setIsResetDialogOpen] = useState(false)
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false)
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  
  const userId = user?.id || 'current-user-id'

  useEffect(() => {
    const loadUserSettings = async () => {
      try {
        setIsLoading(true)
        const settings = await getUserSettings(userId)
        
        if (settings?.dashboardLayout) {
          console.log('=== Loading Saved Layout ===');
          
          // Ensure all required properties are present and valid
          const loadedLayouts = {
            lg: settings.dashboardLayout.lg?.map(item => ({
              i: String(item.i),
              x: Number(item.x) || 0,
              y: Number(item.y) || 0,
              w: Math.max(Number(item.w) || 6, 4), // Minimum width of 4
              h: Math.max(Number(item.h) || 6, 4), // Minimum height of 4
              minW: 4,
              minH: 4,
              isResizable: true,
              isDraggable: true,
              static: false
            })) || defaultLayouts.lg,
            md: settings.dashboardLayout.md?.map(item => ({
              i: String(item.i),
              x: Number(item.x) || 0,
              y: Number(item.y) || 0,
              w: Math.max(Number(item.w) || 6, 4), // Minimum width of 4
              h: Math.max(Number(item.h) || 6, 4), // Minimum height of 4
              minW: 4,
              minH: 4,
              isResizable: true,
              isDraggable: true,
              static: false
            })) || defaultLayouts.md,
            sm: settings.dashboardLayout.sm?.map(item => ({
              i: String(item.i),
              x: Number(item.x) || 0,
              y: Number(item.y) || 0,
              w: Math.max(Number(item.w) || 12, 6), // Minimum width of 6 for small screens
              h: Math.max(Number(item.h) || 6, 4), // Minimum height of 4
              minW: 6,
              minH: 4,
              isResizable: true,
              isDraggable: true,
              static: false
            })) || defaultLayouts.sm
          };

          // Validate that all required widgets exist
          const requiredWidgets = ['appointments', 'patients', 'tasks', 'referrals'];
          const hasAllWidgets = requiredWidgets.every(widgetId => 
            loadedLayouts.lg.some(item => item.i === widgetId) &&
            loadedLayouts.md.some(item => item.i === widgetId) &&
            loadedLayouts.sm.some(item => item.i === widgetId)
          );

          if (hasAllWidgets) {
            console.log('Setting layouts with dimensions:', loadedLayouts);
            setLayouts(loadedLayouts);
          } else {
            console.warn('Missing required widgets in saved layout, using default layout');
            setLayouts(defaultLayouts);
          }
        } else {
          console.log('No saved layout found, using default layout');
          setLayouts(defaultLayouts);
        }

        // Set sidebar state if it exists
        if (settings?.sidebarCollapsed !== undefined) {
          setIsSidebarCollapsed(settings.sidebarCollapsed);
        }
      } catch (error) {
        console.error('Error loading user settings:', error)
        setLayouts(defaultLayouts)
      } finally {
        setIsLoading(false)
      }
    }

    loadUserSettings()
  }, [userId])

  const handleLayoutChange = async (_: WidgetLayout[], allLayouts: Layouts) => {
    // Log specific layout changes
    console.log('=== Layout Change ===');
    Object.entries(allLayouts).forEach(([breakpoint, items]) => {
      console.log(`${breakpoint} breakpoint layouts:`, items.map(item => ({
        id: item.i,
        position: `(${item.x}, ${item.y})`,
        size: `${item.w}x${item.h}`
      })));
    });

    // Update local state
    setLayouts(allLayouts)
    
    // Save to Firestore with specific layout data
    const debouncedSave = setTimeout(async () => {
      try {
        // Get existing settings to preserve other data
        const existingSettings = await getUserSettings(userId)
        
        await saveUserSettings(userId, {
          dashboardLayout: {
            lg: allLayouts.lg.map(item => ({
              i: String(item.i),
              x: Number(item.x),
              y: Number(item.y),
              w: Math.max(Number(item.w), 4), // Enforce minimum width
              h: Math.max(Number(item.h), 4), // Enforce minimum height
              minW: 4,
              minH: 4,
              isResizable: true,
              isDraggable: true,
              static: false
            })),
            md: allLayouts.md.map(item => ({
              i: String(item.i),
              x: Number(item.x),
              y: Number(item.y),
              w: Math.max(Number(item.w), 4), // Enforce minimum width
              h: Math.max(Number(item.h), 4), // Enforce minimum height
              minW: 4,
              minH: 4,
              isResizable: true,
              isDraggable: true,
              static: false
            })),
            sm: allLayouts.sm.map(item => ({
              i: String(item.i),
              x: Number(item.x),
              y: Number(item.y),
              w: Math.max(Number(item.w), 6), // Enforce minimum width for small screens
              h: Math.max(Number(item.h), 4), // Enforce minimum height
              minW: 6,
              minH: 4,
              isResizable: true,
              isDraggable: true,
              static: false
            }))
          },
          updatedAt: new Date()
        })
        
        console.log('Layout saved successfully');
      } catch (error) {
        console.error('Error saving layout:', error)
      }
    }, 1000)

    return () => clearTimeout(debouncedSave)
  }

  const handleResetLayout = async () => {
    try {
      // Update local state first
      setLayouts(defaultLayouts)
      
      // Save complete settings to Firestore
      await saveUserSettings(userId, {
        id: userId,
        userId,
        dashboardLayout: defaultLayouts,
        createdAt: new Date(),
        updatedAt: new Date(),
        sidebarCollapsed: isSidebarCollapsed
      })
    } catch (error) {
      console.error('Error resetting layout:', error)
      setLayouts(layouts) // Revert on error
    }
  }

  const handleResetClick = () => {
    setIsResetDialogOpen(true)
  }

  const handleResetConfirm = async () => {
    setIsResetDialogOpen(false)
    await handleResetLayout()
  }

  const handleSidebarCollapse = async (collapsed: boolean) => {
    try {
      setIsSidebarCollapsed(collapsed)
      await saveUserSettings(userId, {
        sidebarCollapsed: collapsed
      })
    } catch (error) {
      console.error('Error saving sidebar state:', error)
      setIsSidebarCollapsed(!collapsed) // Revert on error
    }
  }

  return (
    <>
      {isLoading ? (
        <DashboardSkeleton />
      ) : (
        <div className="flex h-screen bg-background overflow-hidden">
          <Sidebar 
            logo={<span className="text-xl font-bold">LOGO</span>}
            navigation={navigation}
            userInfo={{
              name: user?.displayName || 'Guest User',
              role: user?.role || 'No Role'
            }}
            defaultCollapsed={isSidebarCollapsed}
            onCollapsedChange={handleSidebarCollapse}
            mobileOpen={isMobileMenuOpen}
            onMobileClose={() => setIsMobileMenuOpen(false)}
          />
          <div className="flex-1 flex flex-col min-w-0 w-full">
            <Header 
              notificationCount={4}
              onSearch={console.log}
              onNotificationClick={() => setIsNotificationsOpen(true)}
              onAddClick={() => console.log('Add clicked')}
              onResetLayout={handleResetClick}
              onMobileMenuClick={() => setIsMobileMenuOpen(true)}
            />
            <main className="flex-1 overflow-hidden relative">
              <div className="h-full overflow-x-hidden overflow-y-auto px-2">
                <div className="flex items-center justify-between mb-0 pt-0">
                  <h1 className="text-2xl pl-4 font-semibold text-foreground">
                    Welcome back, {user?.displayName || 'Guest'}
                  </h1>
                  <div className="flex items-center gap-2  pr-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => console.log('Customize')}
                      className="gap-2"
                    >
                      <Cog6ToothIcon className="h-4 w-4" />
                      Customize Dashboard
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={handleResetClick}
                      className="rounded-full shadow-sm hover:shadow-md transition-shadow"
                      aria-label="Reset layout"
                    >
                      <ArrowPathIcon className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <div>
                  <WidgetGrid layouts={layouts} onLayoutChange={handleLayoutChange}>
                    <div key="appointments">
                      <Widget title="Appointments">
                        <AppointmentsWidget 
                          appointments={mockAppointments}
                          onAddAppointment={() => console.log('Add appointment')}
                        />
                      </Widget>
                    </div>
                    <div key="patients">
                      <Widget title="Patient Arrival/Check-In Status">
                        <PatientOverviewWidget patients={mockPatients} />
                      </Widget>
                    </div>
                    <div key="tasks">
                      <Widget title="Messages">
                        <MessagesWidget 
                          messages={mockMessages}
                          onCreateMessage={() => console.log('Create message')}
                        />
                      </Widget>
                    </div>
                    <div key="referrals">
                      <Widget title="Pending Referrals">
                        <PendingReferralsWidget referrals={mockReferrals} />
                      </Widget>
                    </div>
                  </WidgetGrid>
                </div>
              </div>
            </main>
          </div>
        </div>
      )}

      <ConfirmDialog
        isOpen={isResetDialogOpen}
        onClose={() => setIsResetDialogOpen(false)}
        onConfirm={handleResetConfirm}
        title="Reset Layout"
        message="Are you sure you want to reset the dashboard layout to default? This action cannot be undone."
      />

      <NotificationsDrawer
        isOpen={isNotificationsOpen}
        onClose={() => setIsNotificationsOpen(false)}
        alerts={mockAlerts}
        tasks={mockTasks}
      />
    </>
  )
}

export default DashboardPage 