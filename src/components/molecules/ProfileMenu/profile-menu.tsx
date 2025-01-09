import { FC, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import * as DropdownMenu from '@radix-ui/react-dropdown-menu'
import { cn } from '@/lib/utils'
import {
  Cog6ToothIcon,
  ArrowPathIcon,
  ChevronRightIcon,
  DocumentTextIcon,
  PlayCircleIcon,
  QuestionMarkCircleIcon,
  ArrowRightOnRectangleIcon,
  BookOpenIcon,
  ChevronLeftIcon,
  UserCircleIcon,
  IdentificationIcon
} from '@heroicons/react/24/outline'
import { signOut } from '@/services/auth'

interface ProfileMenuProps {
  trigger: React.ReactNode
  userInfo?: {
    name: string
    role: string
    avatar?: string
  }
}

const getRoleLabel = (roleValue: string): string => {
  const roles = {
    billing_specialist: 'Billing Specialist',
    billing_manager: 'Billing Manager',
    clinician: 'Clinician',
    front_desk: 'Front Desk',
    clinic_admin: 'Clinic Admin/Supervisor',
    cfo: 'CFO',
    practice_manager: 'Practice Manager',
    ccbhc: 'CCBHC',
    supervisor: 'Supervisor'
  };
  return roles[roleValue as keyof typeof roles] || roleValue;
};

export const ProfileMenu: FC<ProfileMenuProps> = ({ trigger, userInfo }) => {
  const navigate = useNavigate()
  const [showRoles, setShowRoles] = useState(false)

  const handleSignOut = async () => {
    try {
      await signOut()
      navigate('/')
    } catch (error) {
      console.error('Failed to sign out:', error)
    }
  }

  const roles = [
    { label: 'Billing Specialist', value: 'billing_specialist' },
    { label: 'Billing Manager', value: 'billing_manager' },
    { label: 'Clinician', value: 'clinician' },
    { label: 'Front Desk', value: 'front_desk' },
    { label: 'Clinic Admin/Supervisor', value: 'clinic_admin' },
    { label: 'CFO', value: 'cfo' },
    { label: 'Practice Manager', value: 'practice_manager' },
    { label: 'CCBHC', value: 'ccbhc' },
    { label: 'Supervisor', value: 'supervisor' }
  ]

  const menuItems = [
    {
      icon: <DocumentTextIcon className="w-5 h-5 text-orange-400" />,
      label: 'Account',
      description: 'Manage your account settings',
      onClick: () => navigate('/account')
    },
    {
      icon: <ArrowPathIcon className="w-5 h-5 text-orange-400" />,
      label: 'Switch as',
      description: 'You have access to other roles',
      onClick: (e: Event) => {
        e.preventDefault()
        setShowRoles(true)
      },
      rightIcon: <ChevronRightIcon className="w-5 h-5 text-gray-400" />,
      preventClose: true
    },
    {
      icon: <Cog6ToothIcon className="w-5 h-5 text-orange-400" />,
      label: 'Settings',
      description: 'App settings, themes, and more',
      onClick: () => navigate('/settings')
    },
    {
      icon: <PlayCircleIcon className="w-5 h-5 text-orange-400" />,
      label: 'Video tutorials',
      description: 'Get up and running on new features and techniques.',
      onClick: () => navigate('/tutorials')
    },
    {
      icon: <BookOpenIcon className="w-5 h-5 text-orange-400" />,
      label: 'Documentation',
      description: 'How to things can be found here',
      onClick: () => navigate('/documentation')
    },
    {
      icon: <QuestionMarkCircleIcon className="w-5 h-5 text-orange-400" />,
      label: 'Help and support',
      description: 'Learn, fix a problem, and get answers to your questions.',
      onClick: () => navigate('/support')
    },
    {
      icon: <ArrowRightOnRectangleIcon className="w-5 h-5 text-orange-400" />,
      label: 'Logout',
      onClick: handleSignOut
    }
  ]

  return (
    <DropdownMenu.Root modal={false}>
      <DropdownMenu.Trigger asChild>
        {trigger}
      </DropdownMenu.Trigger>

      <DropdownMenu.Portal>
        <DropdownMenu.Content
          className={cn(
            "w-[320px] rounded-md border bg-white p-2",
            "data-[side=bottom]:animate-slideUpAndFade",
            "data-[side=top]:animate-slideDownAndFade"
          )}
          align="end"
          sideOffset={5}
        >
          {/* User Info Section */}
          <div className="px-4 py-3 border-b border-gray-100">
            <div className="flex items-center gap-3">
              {userInfo?.avatar ? (
                <img
                  src={userInfo.avatar}
                  alt={userInfo.name}
                  className="h-10 w-10 rounded-full ring-1 ring-gray-200"
                />
              ) : (
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                  <UserCircleIcon className="h-6 w-6 text-primary" />
                </div>
              )}
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium text-gray-900">
                  {userInfo?.name || 'Guest User'}
                </div>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <IdentificationIcon className="w-4 h-4 text-primary" />
                  <span className="text-xs font-medium text-primary">
                    {userInfo?.role ? getRoleLabel(userInfo.role) : 'No Role'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {!showRoles ? (
            // Main Menu
            menuItems.map((item, index) => (
              <DropdownMenu.Item
                key={index}
                className={cn(
                  "flex items-start gap-3 px-4 py-3",
                  "cursor-pointer hover:bg-gray-50",
                  "border-b last:border-0 border-gray-100",
                  "my-0.5",
                  "first:mt-0 last:mb-0"
                )}
                onSelect={(e) => {
                  if (item.preventClose) {
                    e.preventDefault()
                  }
                  item.onClick(e)
                }}
              >
                {item.icon}
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-gray-900 mb-1">
                    {item.label}
                  </div>
                  {item.description && (
                    <div className="text-sm text-gray-500">
                      {item.description}
                    </div>
                  )}
                </div>
                {item.rightIcon}
              </DropdownMenu.Item>
            ))
          ) : (
            // Roles Submenu
            <>
              <div className="flex items-center px-4 py-3 border-b border-gray-100">
                <button
                  onClick={() => setShowRoles(false)}
                  className="flex items-center text-sm text-gray-500 hover:text-gray-900"
                >
                  <ChevronLeftIcon className="w-4 h-4 mr-1" />
                  Back
                </button>
              </div>
              <div className="px-2 py-2">
                {roles.map((role, index) => (
                  <DropdownMenu.Item
                    key={index}
                    className={cn(
                      "flex items-center justify-between w-full px-2 py-2.5",
                      "text-sm cursor-pointer",
                      "hover:bg-gray-50 rounded-md",
                      userInfo?.role === role.value ? "text-primary font-medium bg-primary/5" : "text-gray-900"
                    )}
                    onSelect={() => {
                      console.log(`Switching to role: ${role.value}`)
                      setShowRoles(false)
                    }}
                  >
                    <div className="flex items-center gap-2">
                      <IdentificationIcon className={cn(
                        "w-4 h-4",
                        userInfo?.role === role.value ? "text-primary" : "text-gray-400"
                      )} />
                      {role.label}
                      {userInfo?.role === role.value && (
                        <span className="ml-2 inline-flex items-center rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
                          Current
                        </span>
                      )}
                    </div>
                    <ChevronRightIcon className="w-4 h-4 text-gray-400" />
                  </DropdownMenu.Item>
                ))}
              </div>
            </>
          )}
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  )
} 