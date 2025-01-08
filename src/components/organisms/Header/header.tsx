import { FC } from 'react'
import { 
  MagnifyingGlassIcon, 
  BellIcon, 
  Bars3Icon,
  UserCircleIcon,
  PlusIcon
} from '@heroicons/react/24/outline'
import { Button } from '@/components/atoms/Button'
import { ShimmerButton } from '@/components/atoms/ShimmerButton'
import { ProfileMenu } from '@/components/molecules/ProfileMenu/profile-menu'
import { PatientSnapshot } from '@/components/molecules/PatientSnapshot/index'
import { cn } from '@/lib/utils'

interface HeaderProps {
  variant?: 'default' | 'patient-chart'
  notificationCount?: number
  onSearch?: (query: string) => void
  onNotificationClick?: () => void
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
}

export const Header: FC<HeaderProps> = ({
  variant = 'default',
  notificationCount,
  onSearch,
  onNotificationClick,
  onAddClick,
  onResetLayout,
  onMobileMenuClick,
  userInfo,
  patientInfo
}) => {
  if (variant === 'patient-chart' && patientInfo) {
    return (
      <header className="sticky top-0 z-30 flex h-16 w-full items-center border-b bg-white/80 px-0">
        <Button
          variant="ghost"
          size="icon"
          className="lg:hidden"
          onClick={onMobileMenuClick}
        >
          <Bars3Icon className="h-5 w-5" />
        </Button>

        <PatientSnapshot
          patient={patientInfo}
          variant="header"
          className="min-w-[900px]"
          onNewEncounter={() => console.log('New encounter')}
          onViewChart={() => console.log('View chart')}
        />

        <div className="hidden md:flex relative ml-4 w-[280px]">
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="search"
            placeholder="Search..."
            className={cn(
              "h-9 w-full rounded-full border bg-white pl-9 pr-4 text-sm",
              "placeholder:text-muted-foreground/60",
              "focus:outline-none focus:ring-2 focus:ring-primary/20",
              "transition-all duration-200"
            )}
            onChange={(e) => onSearch?.(e.target.value)}
          />
        </div>

        <div className="ml-auto flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            className={cn(
              "relative transition-colors duration-200",
              "hover:bg-gray-200/90",
              "active:bg-gray-300",
              "focus-visible:ring-2 focus-visible:ring-primary/20",
              "rounded-full p-3",
              "h-14 w-14"
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
                  "hover:bg-gray-200/90",
                  "active:bg-gray-300",
                  "focus-visible:ring-2 focus-visible:ring-primary/20",
                  "transition-all duration-200",
                  "h-14"
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
                    className="h-10 w-10 rounded-full ring-1 ring-border object-cover"
                  />
                ) : (
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                    <UserCircleIcon className="h-6 w-6 text-primary" />
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
    <header className="sticky top-0 z-30 flex h-16 w-full items-center border-b bg-white px-4">
      <Button
        variant="ghost"
        size="icon"
        className="lg:hidden"
        onClick={onMobileMenuClick}
      >
        <Bars3Icon className="h-5 w-5" />
      </Button>

      <div className="hidden md:flex relative max-w-[400px] flex-1 px-4">
        <MagnifyingGlassIcon className="absolute left-6 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <input
          type="search"
          placeholder="Search..."
          className={cn(
            "h-9 w-full rounded-full border bg-white pl-9 pr-4 text-sm",
            "placeholder:text-muted-foreground/60",
            "focus:outline-none focus:ring-2 focus:ring-primary/20",
            "transition-all duration-200"
          )}
          onChange={(e) => onSearch?.(e.target.value)}
        />
      </div>

      <div className="ml-auto flex items-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden hover:bg-gray-100"
          onClick={() => console.log('Mobile search')}
        >
          <MagnifyingGlassIcon className="h-5 w-5" />
        </Button>

        <ShimmerButton
          size="sm"
          className={cn(
            "flex items-center gap-2",
            "px-4 py-2 rounded-full",
            "bg-primary hover:bg-primary/90",
            "text-white font-medium",
            "transition-all duration-200",
            "h-10"
          )}
          background="hsl(var(--primary))"
          onClick={onAddClick}
          shimmerDuration="2s"
          shimmerSize="0.1em"
        >
          <PlusIcon className="h-4 w-4" />
        </ShimmerButton>

        <Button
          variant="ghost"
          size="icon"
          className={cn(
            "relative transition-colors duration-200",
            "hover:bg-gray-200/90",
            "active:bg-gray-300",
            "focus-visible:ring-2 focus-visible:ring-primary/20",
            "rounded-full p-3",
            "h-14 w-14"
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
                "hover:bg-gray-200/90",
                "active:bg-gray-300",
                "focus-visible:ring-2 focus-visible:ring-primary/20",
                "transition-all duration-200",
                "h-14"
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
                  className="h-10 w-10 rounded-full ring-1 ring-border object-cover"
                />
              ) : (
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                  <UserCircleIcon className="h-6 w-6 text-primary" />
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