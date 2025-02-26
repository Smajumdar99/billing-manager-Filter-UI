import { FC } from 'react'
import { 
  BellIcon, 
  Bars3Icon,
  UserCircleIcon,
  PhoneIcon,
  BellAlertIcon,
  QuestionMarkCircleIcon,
  LifebuoyIcon,
} from '@heroicons/react/24/outline'
import { Button } from '@/components/atoms/Button'
import { ProfileMenu } from '@/components/molecules/ProfileMenu/profile-menu'
import { PatientSnapshot } from '@/components/molecules/PatientSnapshot'
import { SearchBar } from '@/components/molecules/SearchBar'
import { cn } from '@/lib/utils'
import { useCurrentUser } from '@/hooks/useCurrentUser'
import { Skeleton } from '@/components/atoms/Skeleton'

interface HeaderProps {
  variant?: 'default' | 'patient-chart'
  notificationCount?: number
  onSearch?: (query: string) => void
  onNotificationClick?: () => void
  onCallClick?: () => void
  onReminderClick?: () => void
  onHelpClick?: () => void
  onSupportClick?: () => void
  onAddClick?: () => void
  onResetLayout?: () => void
  onMobileMenuClick?: () => void
  userInfo?: {
    name: string
    role: string
    avatar?: string
  }
  patientInfo?: {
    id: string
    name: string
    avatar?: string
    gender: string
    age: number
    bloodGroup: string
    insuranceProvider: string
    admittedTo: string
    language: string
    mobile: string
    programAuditor: string
    auditorTimestamp: string
  }
  children?: React.ReactNode
}

const UserProfileSkeleton: FC = () => (
  <div className="flex items-center gap-3">
    <div className="hidden md:flex flex-col items-end mr-2">
      <Skeleton className="h-4 w-24" />
      <Skeleton className="h-3 w-16 mt-1" />
    </div>
    <Skeleton className="h-10 w-10 rounded-full" />
  </div>
)

export const Header: FC<HeaderProps> = ({
  variant = 'default',
  notificationCount,
  onSearch,
  onNotificationClick,
  onCallClick,
  onReminderClick,
  onHelpClick,
  onSupportClick,
  onAddClick,
  onResetLayout,
  onMobileMenuClick,
  userInfo,
  patientInfo,
  children
}) => {
  if (variant === 'patient-chart') {
    return (
      <header className="sticky top-0 z-30 flex h-16 w-full items-center px-2">
        <Button
          variant="ghost"
          size="icon"
          className="lg:hidden"
          onClick={onMobileMenuClick}
        >
          <Bars3Icon className="h-5 w-5" />
        </Button>

        {children || (patientInfo && (
          <PatientSnapshot
            patient={patientInfo}
            variant="header"
            className="min-w-[900px]"
          />
        ))}
        {/* <div className="ml-4 bg-white rounded-full shadow-sm border">
          <SearchBar
            width="w-[200px]"
            className="[&>div]:border-0 [&>div]:shadow-none"
            onSearch={onSearch}
          />
        </div> */}

        

        <div className="ml-auto flex items-center gap-1 bg-white rounded-full shadow-sm border px-2">
          <Button
            variant="ghost"
            size="icon"
            className={cn(
              "relative transition-colors duration-200",
              "hover:bg-gray-100",
              "active:bg-gray-200",
              "focus-visible:ring-2 focus-visible:ring-primary/20",
              "rounded-full p-3",
              "h-12 w-12"
            )}
            onClick={onCallClick}
            title="Call"
          >
            <PhoneIcon className="h-5 w-5" />
          </Button>

          <Button
            variant="ghost"
            size="icon"
            className={cn(
              "relative transition-colors duration-200",
              "hover:bg-gray-100",
              "active:bg-gray-200",
              "focus-visible:ring-2 focus-visible:ring-primary/20",
              "rounded-full p-3",
              "h-12 w-12"
            )}
            onClick={onReminderClick}
            title="Send Reminder"
          >
            <BellAlertIcon className="h-5 w-5" />
          </Button>

          <Button
            variant="ghost"
            size="icon"
            className={cn(
              "relative transition-colors duration-200",
              "hover:bg-gray-100",
              "active:bg-gray-200",
              "focus-visible:ring-2 focus-visible:ring-primary/20",
              "rounded-full p-3",
              "h-12 w-12"
            )}
            onClick={onHelpClick}
            title="Help"
          >
            <QuestionMarkCircleIcon className="h-5 w-5" />
          </Button>

          <Button
            variant="ghost"
            size="icon"
            className={cn(
              "relative transition-colors duration-200",
              "hover:bg-gray-100",
              "active:bg-gray-200",
              "focus-visible:ring-2 focus-visible:ring-primary/20",
              "rounded-full p-3",
              "h-12 w-12"
            )}
            onClick={onSupportClick}
            title="Support"
          >
            <LifebuoyIcon className="h-5 w-5" />
          </Button>

          <Button
            variant="ghost"
            size="icon"
            className={cn(
              "relative transition-colors duration-200",
              "hover:bg-gray-100",
              "active:bg-gray-200",
              "focus-visible:ring-2 focus-visible:ring-primary/20",
              "rounded-full p-3",
              "h-12 w-12"
            )}
            onClick={onNotificationClick}
          >
            <BellIcon className="h-5 w-5" />
            {notificationCount && notificationCount > 0 && (
              <span className="absolute right-1 top-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-medium text-white">
                {notificationCount}
              </span>
            )}
          </Button>

          <ProfileMenu
            trigger={
              <Button 
                variant="ghost" 
                size="sm"
                className={cn(
                  "flex items-center gap-3",
                  "px-4 py-2 rounded-full",
                  "hover:bg-gray-100",
                  "active:bg-gray-200",
                  "focus-visible:ring-2 focus-visible:ring-primary/20",
                  "transition-all duration-200",
                  "h-12"
                )}
              >
                <div className="hidden md:flex flex-col items-end mr-2">
                  <span className="text-sm font-medium leading-none">
                    {userInfo?.name || 'Guest User'}
                  </span>
                  <span className="text-xs text-muted-foreground leading-none mt-1">
                    {userInfo?.role || 'No Role'}
                  </span>
                </div>
                {userInfo?.avatar ? (
                  <img
                    src={userInfo.avatar}
                    alt={userInfo.name}
                    className="h-8 w-8 rounded-full ring-1 ring-border object-cover"
                  />
                ) : (
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
                    <UserCircleIcon className="h-5 w-5 text-primary" />
                  </div>
                )}
              </Button>
            }
            userInfo={userInfo}
          />
        </div>
      </header>
    )
  }

  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center border-b bg-background px-4">
      <Button
        variant="ghost"
        size="icon"
        className="lg:hidden"
        onClick={onMobileMenuClick}
      >
        <Bars3Icon className="h-5 w-5" />
      </Button>

      {variant === 'default' && (
        <div className="ml-4 flex-1 lg:max-w-sm bg-white rounded-full shadow-sm border">
          <SearchBar 
            onSearch={onSearch}
            className="[&>div]:border-0 [&>div]:shadow-none"
          />
        </div>
      )}

      <div className="ml-auto flex items-center gap-2 bg-white rounded-full shadow-sm border px-2">
        <Button
          variant="ghost"
          size="icon"
          className={cn(
            "relative transition-colors duration-200",
            "hover:bg-gray-100",
            "active:bg-gray-200",
            "focus-visible:ring-2 focus-visible:ring-primary/20",
            "rounded-full p-3",
            "h-12 w-12"
          )}
          onClick={onCallClick}
          title="Call"
        >
          <PhoneIcon className="h-5 w-5" />
        </Button>

        <Button
          variant="ghost"
          size="icon"
          className={cn(
            "relative transition-colors duration-200",
            "hover:bg-gray-100",
            "active:bg-gray-200",
            "focus-visible:ring-2 focus-visible:ring-primary/20",
            "rounded-full p-3",
            "h-12 w-12"
          )}
          onClick={onReminderClick}
          title="Send Reminder"
        >
          <BellAlertIcon className="h-5 w-5" />
        </Button>

        <Button
          variant="ghost"
          size="icon"
          className={cn(
            "relative transition-colors duration-200",
            "hover:bg-gray-100",
            "active:bg-gray-200",
            "focus-visible:ring-2 focus-visible:ring-primary/20",
            "rounded-full p-3",
            "h-12 w-12"
          )}
          onClick={onHelpClick}
          title="Help"
        >
          <QuestionMarkCircleIcon className="h-5 w-5" />
        </Button>

        <Button
          variant="ghost"
          size="icon"
          className={cn(
            "relative transition-colors duration-200",
            "hover:bg-gray-100",
            "active:bg-gray-200",
            "focus-visible:ring-2 focus-visible:ring-primary/20",
            "rounded-full p-3",
            "h-12 w-12"
          )}
          onClick={onSupportClick}
          title="Support"
        >
          <LifebuoyIcon className="h-5 w-5" />
        </Button>

        <Button
          variant="ghost"
          size="icon"
          className={cn(
            "relative transition-colors duration-200",
            "hover:bg-gray-100",
            "active:bg-gray-200",
            "focus-visible:ring-2 focus-visible:ring-primary/20",
            "rounded-full p-3",
            "h-12 w-12"
          )}
          onClick={onNotificationClick}
        >
          <BellIcon className="h-5 w-5" />
          {notificationCount && notificationCount > 0 && (
            <span className="absolute right-1 top-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-medium text-white">
              {notificationCount}
            </span>
          )}
        </Button>

        <ProfileMenu
          trigger={
            <Button 
              variant="ghost" 
              size="sm"
              className={cn(
                "flex items-center gap-3",
                "px-4 py-2 rounded-full",
                "hover:bg-gray-100",
                "active:bg-gray-200",
                "focus-visible:ring-2 focus-visible:ring-primary/20",
                "transition-all duration-200",
                "h-12"
              )}
            >
              <div className="hidden md:flex flex-col items-end mr-2">
                <span className="text-sm font-medium leading-none">
                  {userInfo?.name || 'Guest User'}
                </span>
                <span className="text-xs text-muted-foreground leading-none mt-1">
                  {userInfo?.role || 'No Role'}
                </span>
              </div>
              {userInfo?.avatar ? (
                <img
                  src={userInfo.avatar}
                  alt={userInfo.name}
                  className="h-8 w-8 rounded-full ring-1 ring-border object-cover"
                />
              ) : (
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
                  <UserCircleIcon className="h-5 w-5 text-primary" />
                </div>
              )}
            </Button>
          }
          userInfo={userInfo}
        />
      </div>
    </header>
  )
} 