import { FC, useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { cn } from '@/lib/utils'
import { Bars3Icon, ChevronUpDownIcon } from '@heroicons/react/24/outline'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Button } from '@/components/atoms/Button'
import { TooltipProvider, TooltipRoot, TooltipTrigger, TooltipContent } from '@/components/atoms/Tooltip'
import { NavItem, NavSection } from '@/types/navigation'
import { ProfileMenu } from '@/components/molecules/ProfileMenu'
import * as Popover from '@radix-ui/react-popover'
import { useAuth } from '@/context/AuthContext'
import { getUserSettings, saveUserSettings } from '@/services/firestore'
import { AuroraBackground } from '@/components/ui/aurora-background'

export interface SidebarProps {
  navigation: NavSection[]
  userInfo: {
    name: string
    role: string
    avatar?: string
  }
  onCollapsedChange?: (collapsed: boolean) => void
  defaultCollapsed?: boolean
  mobileOpen?: boolean
  onMobileClose?: () => void
}

export const Sidebar: FC<SidebarProps> = ({
  navigation,
  userInfo,
  onCollapsedChange,
  defaultCollapsed = false,
  mobileOpen,
  onMobileClose
}) => {
  if (!Array.isArray(navigation)) {
    console.error("Navigation prop is not an array:", navigation);
    return null;
  }

  const location = useLocation()
  const { user } = useAuth()
  const [collapsed, setCollapsed] = useState(defaultCollapsed)
  const [expandedItems, setExpandedItems] = useState<string[]>(["Dashboard"])

  // Load user settings on mount
  useEffect(() => {
    const loadSidebarState = async () => {
      if (user?.uid) {
        try {
          const settings = await getUserSettings(user.uid)
          if (settings?.sidebarCollapsed !== undefined) {
            setCollapsed(settings.sidebarCollapsed)
            onCollapsedChange?.(settings.sidebarCollapsed)
          }
        } catch (error) {
          console.error('Error loading sidebar state:', error)
        }
      }
    }
    loadSidebarState()
  }, [user?.uid])

  // Effect to open the parent item when "All Patients" is active
  useEffect(() => {
    if (location.pathname === "/patient-care/all-patients") {
      setExpandedItems(prev => {
        if (!prev.includes("Patient Care")) {
          return [...prev, "Patient Care"];
        }
        return prev;
      });
    }
  }, [location.pathname]);

  const toggleExpand = (title: string) => {
    setExpandedItems(prev => 
      prev.includes(title) 
        ? prev.filter(item => item !== title)
        : [...prev, title]
    )
  }

  const handleCollapse = async () => {
    const newCollapsed = !collapsed
    setCollapsed(newCollapsed)
    onCollapsedChange?.(newCollapsed)

    // Save to Firestore
    if (user?.uid) {
      try {
        await saveUserSettings(user.uid, {
          sidebarCollapsed: newCollapsed,
          updatedAt: new Date()
        })
      } catch (error) {
        console.error('Error saving sidebar state:', error)
        // Revert on error
        setCollapsed(!newCollapsed)
        onCollapsedChange?.(!newCollapsed)
      }
    }
  }

  const renderNavItem = (item: NavItem) => {
    const isActive = item.children
      ? item.children.some(child => location.pathname === child.path || location.pathname === item.path)
      : location.pathname === item.path
    
    const isExpanded = expandedItems.includes(item.title)

    const handleItemClick = (e: React.MouseEvent) => {
      if (item.children && !collapsed) {
        e.preventDefault()
        toggleExpand(item.title)
      }
    }

    const linkContent = (
      <>
        <div className={cn(
          "flex items-center justify-center w-5 h-5",
          isActive ? "text-primary" : "text-foreground"
        )}>
          {item.icon}
        </div>
        {!collapsed && (
          <>
            <span className="flex-1">{item.title}</span>
            {item.children && (
              <FontAwesomeIcon 
                icon="chevron-down"
                className={cn(
                  "w-4 h-4 transition-transform",
                  isExpanded && "rotate-180",
                  isActive ? "text-primary" : "text-muted-foreground"
                )}
              />
            )}
          </>
        )}
      </>
    )

    return (
      <div key={item.title}>
        {collapsed ? (
          item.children ? (
            <Popover.Root>
              <Popover.Trigger asChild>
                <button
                  className={cn(
                    "flex w-full items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors relative",
                    "hover:bg-primary/10 dark:hover:bg-primary/20",
                    "justify-center",
                    isActive && "bg-primary/10 dark:bg-primary/20 text-primary",
                    !isActive && "text-foreground"
                  )}
                >
                  {linkContent}
                </button>
              </Popover.Trigger>
              <Popover.Portal>
                <Popover.Content
                  side="right"
                  sideOffset={12}
                  className={cn(
                    "z-50 w-48 rounded-md border bg-card shadow-md",
                    "animate-in slide-in-from-left-1 duration-200"
                  )}
                >
                  <div className="px-2 py-1.5 text-xs font-medium text-muted-foreground border-b">
                    {item.title}
                  </div>
                  <div className="p-1">
                    {item.children.map(child => (
                      <Link
                        key={child.title}
                        to={child.path}
                        className={cn(
                          "flex w-full items-center px-2 py-1.5 text-sm rounded-sm",
                          "hover:bg-accent hover:text-accent-foreground",
                          "transition-colors",
                          location.pathname === child.path 
                            ? "bg-primary/5 text-primary" 
                            : "text-muted-foreground"
                        )}
                      >
                        {child.title}
                      </Link>
                    ))}
                  </div>
                </Popover.Content>
              </Popover.Portal>
            </Popover.Root>
          ) : (
            <Link
              to={item.path}
              className={cn(
                "flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors",
                "hover:bg-primary/10 dark:hover:bg-primary/20",
                "justify-center",
                isActive && "bg-primary/10 dark:bg-primary/20 text-primary",
                !isActive && "text-foreground"
              )}
            >
              {linkContent}
            </Link>
          )
        ) : (
          <>
            <Link
            to={item.path}
            className={cn(
              "flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors",
              "hover:bg-primary/10 dark:hover:bg-primary/20",
              collapsed ? "justify-center" : "",
              isActive && "bg-primary/10 dark:bg-primary/20 text-primary",
              !isActive && "text-foreground"
            )}
            onClick={handleItemClick}
          >
            {linkContent}
          </Link>
          {item.children && isExpanded && (
            <div className="ml-9 mt-1 space-y-1">
              {item.children.map(child => (
                <Link
                  key={child.title}
                  to={child.path}
                  className={cn(
                    "block px-3 py-2 rounded-md text-sm",
                    "hover:bg-primary/10 dark:hover:bg-primary/20",
                    location.pathname === child.path 
                      ? "text-primary" 
                      : "text-muted-foreground"
                  )}
                >
                  {child.title}
                </Link>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  )
}

  return (
    <TooltipProvider>
      <AuroraBackground 
        opacity="low"
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex flex-col border-r border-border transition-all duration-300 ease-in-out",
          "md:relative md:flex",
          "shadow-[5px_0_30px_-15px_rgba(0,0,0,0.2)] dark:shadow-[5px_0_30px_-15px_rgba(0,0,0,0.4)]",
          collapsed ? "w-[60px]" : "w-[240px]",
          "transform md:transform-none",
          !mobileOpen && "-translate-x-full md:translate-x-0"
        )}
      >
        {mobileOpen && (
          <div 
            className="fixed inset-0 bg-black/50 md:hidden z-40"
            onClick={onMobileClose}
          />
        )}
        {/* Header with Logo and Toggle */}
        <div className="h-24 border-b border-border/50">
          <div className={cn(
            "h-full flex items-center",
            collapsed ? "justify-center" : "px-4 gap-3"
          )}>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleCollapse}
              className={cn(
                "h-9 w-9 rounded-md flex items-center justify-center shrink-0",
                "transition-transform duration-300",
                collapsed && "rotate-180"
              )}
            >
              <Bars3Icon className="w-5 h-5" />
              <span className="sr-only">
                {collapsed ? "Expand sidebar" : "Collapse sidebar"}
              </span>
            </Button>
            <div className={cn(
              "flex flex-col items-start gap-1 transition-all duration-300",
              collapsed ? "w-0 opacity-0" : "w-auto opacity-100"
            )}>
              <img 
                src="/customer-logo.svg" 
                alt="Cygnet" 
                className="h-8 w-auto" 
              />
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <span>Powered by</span>
                <img 
                  src="/logo.svg" 
                  alt="DrCloudEHR" 
                  className="h-3 w-auto" 
                />
              </div>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex-1 overflow-y-auto px-3 py-2 space-y-6">
          {navigation.map((section, index) => (
            <div key={index} className="space-y-1">
              {section.items.map(renderNavItem)}
            </div>
          ))}
        </div>
        
        {/* User Info */}
        {userInfo && (
          <div className={cn(
            "h-16 px-4 border-t border-border/50 flex items-center gap-3 relative",
            collapsed ? "justify-center" : ""
          )}>
            <ProfileMenu
              trigger={
                collapsed ? (
                  <TooltipRoot>
                    <TooltipTrigger asChild>
                      <button className="hover:bg-accent/50 rounded-md p-2 -m-2 transition-colors">
                        <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                          {userInfo.avatar ? (
                            <img 
                              src={userInfo.avatar} 
                              alt={userInfo.name}
                              className="w-9 h-9 rounded-full" 
                            />
                          ) : (
                            <span className="text-sm font-medium text-primary">
                              {userInfo.name.charAt(0)}
                            </span>
                          )}
                        </div>
                      </button>
                    </TooltipTrigger>
                    <TooltipContent side="right">
                      {userInfo.name}
                    </TooltipContent>
                  </TooltipRoot>
                ) : (
                  <button className="flex items-center gap-3 w-full hover:bg-accent/50 rounded-md p-2 -mx-2 transition-colors group">
                    <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                      {userInfo.avatar ? (
                        <img 
                          src={userInfo.avatar} 
                          alt={userInfo.name}
                          className="w-9 h-9 rounded-full" 
                        />
                      ) : (
                        <span className="text-sm font-medium text-primary">
                          {userInfo.name.charAt(0)}
                        </span>
                      )}
                    </div>
                    <div className="min-w-0 transition-all duration-300 overflow-hidden text-left flex-1">
                      <p className="text-sm font-medium truncate">{userInfo.name}</p>
                      <p className="text-xs text-muted-foreground truncate">{userInfo.role}</p>
                    </div>
                    <ChevronUpDownIcon 
                      className={cn(
                        "w-4 h-4 text-muted-foreground transition-colors",
                        "group-hover:text-foreground"
                      )} 
                    />
                  </button>
                )
              }
              userInfo={userInfo}
            />
          </div>
        )}
      </AuroraBackground>
    </TooltipProvider>
  )
} 