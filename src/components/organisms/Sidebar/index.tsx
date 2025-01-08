import { FC, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { cn } from '@/lib/utils'
import { ChevronDownIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline'
import { Input } from '@/components/atoms/Input'
import { Button } from '@/components/atoms/Button'
import { NavItem, NavSection } from '@/types/navigation'

interface SidebarProps {
  logo: string;
  navigation: NavSection[];
  userInfo?: {
    name: string;
    role: string;
    avatar?: string;
  };
  collapsible?: boolean;
}

export const Sidebar: FC<SidebarProps> = ({
  logo,
  navigation,
  userInfo,
  collapsible = true
}) => {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [expandedItems, setExpandedItems] = useState<string[]>([])
  const location = useLocation()

  const toggleExpand = (title: string) => {
    setExpandedItems(prev => 
      prev.includes(title) 
        ? prev.filter(item => item !== title)
        : [...prev, title]
    )
  }

  const renderNavItem = (item: NavItem) => {
    const isActive = location.pathname === item.path
    const isExpanded = expandedItems.includes(item.title)

    return (
      <div key={item.title}>
        <Link
          to={item.path}
          className={cn(
            "flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors",
            "hover:bg-primary/10 dark:hover:bg-primary/20",
            isActive && "bg-primary/10 dark:bg-primary/20 text-primary",
            !isActive && "text-foreground"
          )}
          onClick={() => item.children && toggleExpand(item.title)}
        >
          <span className="p-1">{item.icon}</span>
          {!isCollapsed && (
            <>
              <span className="flex-1">{item.title}</span>
              {item.children && (
                <ChevronDownIcon 
                  className={cn(
                    "w-4 h-4 transition-transform",
                    isExpanded && "rotate-180"
                  )}
                />
              )}
            </>
          )}
        </Link>
        {!isCollapsed && item.children && isExpanded && (
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
      </div>
    )
  }

  return (
    <div 
      className={cn(
        "flex flex-col h-screen border-r border-border bg-card",
        isCollapsed ? "w-[72px]" : "w-[280px]"
      )}
    >
      {/* Logo */}
      <div className="p-4 flex items-center gap-2">
        <img src={logo} alt="Logo" className="h-8 w-auto" />
        {!isCollapsed && <span className="font-semibold">DrCloudEHR</span>}
      </div>

      {/* Search */}
      <div className="px-3 mb-3">
        {isCollapsed ? (
          <Button
            variant="ghost"
            size="icon"
            className="w-full h-10"
          >
            <MagnifyingGlassIcon className="w-4 h-4" />
          </Button>
        ) : (
          <div className="relative">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Ask anything"
              className="pl-9"
            />
          </div>
        )}
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
          "p-4 border-t border-border flex items-center gap-3",
          isCollapsed && "justify-center"
        )}>
          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
            {userInfo.avatar ? (
              <img 
                src={userInfo.avatar} 
                alt={userInfo.name}
                className="w-8 h-8 rounded-full" 
              />
            ) : (
              <span className="text-sm font-medium text-primary">
                {userInfo.name.charAt(0)}
              </span>
            )}
          </div>
          {!isCollapsed && (
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{userInfo.name}</p>
              <p className="text-xs text-muted-foreground truncate">{userInfo.role}</p>
            </div>
          )}
          {collapsible && !isCollapsed && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsCollapsed(true)}
              className="ml-auto"
            >
              <ChevronDownIcon className="w-4 h-4 -rotate-90" />
            </Button>
          )}
        </div>
      )}
    </div>
  )
} 