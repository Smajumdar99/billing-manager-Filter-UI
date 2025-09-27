import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import CountUp from 'react-countup';
import { 
  HomeIcon, ClipboardDocumentIcon, ClockIcon, CalendarDaysIcon, 
  UsersIcon, BeakerIcon, BanknotesIcon, ChartBarIcon, 
  Cog8ToothIcon, InboxIcon, UserGroupIcon, EllipsisHorizontalIcon,
  ChevronDownIcon, DocumentTextIcon
} from '@heroicons/react/24/outline';

// Animated counter component for notification badge using react-countup
const AnimatedCounter: React.FC<{ value: number; className?: string }> = ({ value, className = '' }) => {
  const [shouldPulse, setShouldPulse] = useState(true);
  const [startValue, setStartValue] = useState(0);
  const [animationKey, setAnimationKey] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  
  useEffect(() => {
    // When value changes, update start value and trigger new animation
    if (value !== startValue) {
      setStartValue(value > startValue ? startValue : 0); // Start from previous or 0
      setAnimationKey(prev => prev + 1); // Force re-render with new key
      setIsAnimating(true);
      setShouldPulse(true); // Reset pulse when number changes
      
      // Stop animation state after duration
      const timer = setTimeout(() => {
        setIsAnimating(false);
        setStartValue(value); // Update start value after animation
      }, 1500); // Match CountUp duration
      
      return () => clearTimeout(timer);
    }
  }, [value, startValue]);
  
  // Stop pulse animation after 3 seconds
  useEffect(() => {
    if (shouldPulse) {
      const timer = setTimeout(() => {
        setShouldPulse(false);
      }, 3000);
      
      return () => clearTimeout(timer);
    }
  }, [shouldPulse]);
  
  const pulseClass = shouldPulse ? 'animate-pulse' : '';
  const scaleClass = isAnimating ? 'scale-110' : 'scale-100';
  
  // Handle display for numbers over 99
  if (value > 99) {
    return (
      <span className={`${className} ${pulseClass} ${scaleClass} transition-all duration-300 font-mono`}>
        99+
      </span>
    );
  }
  
  return (
    <CountUp
      key={animationKey} // Force re-render when value changes
      start={Math.max(0, value - 10)} // Start from a lower number for visible animation
      end={value}
      duration={1.2}
      className={`${className} ${pulseClass} ${scaleClass} transition-all duration-300 font-mono`}
    />
  );
};

/**
 * MainNavigationBar Component
 * 
 * Modern secondary navigation bar with smooth transitions and visual feedback
 * Implements a clean, minimalist design with improved spacing and hierarchy
 * 
 * @param {string} activeItem - The currently active navigation item
 * @param {Function} onNavigate - Optional callback for navigation item clicks
 */
interface MainNavigationBarProps {
  activeItem?: string;
  onNavigate?: (itemName: string) => boolean | void;
  notificationCount?: number;
}

// Navigation item configuration with routes
const navItems = [
  { name: 'Dashboard', icon: <HomeIcon className="h-5 w-5" />, route: '/old-ui-dashboard' },
  { name: 'ADL', icon: <ClipboardDocumentIcon className="h-5 w-5" />, route: '/adl' },
  { name: 'Wait List', icon: <ClockIcon className="h-5 w-5" />, route: '/wait-list' },
  //{ name: 'Schedule', icon: <CalendarDaysIcon className="h-5 w-5" />, route: '/schedule' },
  { name: 'Schedule', icon: <CalendarDaysIcon className="h-5 w-5" />, route: '/my-calendar' },
  { name: 'Clients', icon: <UsersIcon className="h-5 w-5" />, route: '/clients' },
  { name: 'Staff Dashboard', icon: <UserGroupIcon className="h-5 w-5" />, route: '/staff-dashboard' },
  { name: 'Practice', icon: <BeakerIcon className="h-5 w-5" />, route: '/practice' },
  { name: 'Billing', icon: <BanknotesIcon className="h-5 w-5" />, route: '/billing' },
  { name: 'Fax Center', icon: <DocumentTextIcon className="h-5 w-5" />, route: '/fax-center' },
  { name: 'Reports', icon: <ChartBarIcon className="h-5 w-5" />, route: '/reports' },
  { name: 'Inbox', icon: <InboxIcon className="h-5 w-5" />, route: '/task-hub' },
  { name: 'Administration', icon: <Cog8ToothIcon className="h-5 w-5" />, route: '/administration' },
];

const MainNavigationBar: React.FC<MainNavigationBarProps> = ({
  activeItem = 'Clients',
  onNavigate,
  notificationCount = 0,
}) => {
  const navigate = useNavigate();
  const navRef = useRef<HTMLDivElement>(null);
  const [visibleItems, setVisibleItems] = useState<typeof navItems>([]);
  const [overflowItems, setOverflowItems] = useState<typeof navItems>([]);
  const [showOverflowMenu, setShowOverflowMenu] = useState(false);
  
  const handleNavClick = (itemName: string, route: string) => {
    if (activeItem === itemName) return;
    
    if (onNavigate) {
      const shouldNavigate = onNavigate(itemName);
      if (shouldNavigate === false) {
        console.log(`Navigation to ${route} prevented by callback`);
        return;
      }
    }
    
    navigate(route);
    setShowOverflowMenu(false); // Close overflow menu after navigation
  };

  // Calculate which items fit in the available space
  useEffect(() => {
    const calculateVisibleItems = () => {
      if (!navRef.current) return;
      
      const container = navRef.current;
      const containerWidth = container.offsetWidth;
      
      // For testing, let's show first 6 items as visible and rest as overflow
      // This ensures we can see the "More" button functionality
      const maxVisibleItems = Math.max(3, Math.floor(containerWidth / 140)); // Approximate 140px per item
      
      const visible = navItems.slice(0, maxVisibleItems);
      const overflow = navItems.slice(maxVisibleItems);
      
      console.log('Container width:', containerWidth, 'Max visible:', maxVisibleItems, 'Overflow items:', overflow.length);
      
      setVisibleItems(visible);
      setOverflowItems(overflow);
    };

    // Use setTimeout to ensure DOM is ready
    const timer = setTimeout(calculateVisibleItems, 100);
    
    // Recalculate on window resize
    const handleResize = () => {
      setTimeout(calculateVisibleItems, 100); // Debounce
    };
    
    window.addEventListener('resize', handleResize);
    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const NavItem = ({ item, onClick }: { item: typeof navItems[0], onClick?: () => void }) => (
    <Link 
      key={item.name}
      to={item.route}
      className={`flex items-center gap-2 px-3 py-2 mx-2 my-1 text-sm font-semibold transition-all duration-200 rounded-md whitespace-nowrap relative ${
        activeItem === item.name 
          ? 'text-white bg-white/20 shadow-sm backdrop-blur-sm border border-white/30'
          : 'text-primary-foreground hover:text-white hover:bg-white/10 hover:backdrop-blur-sm'
      }`}
      onClick={(e) => {
        if (onNavigate) {
          e.preventDefault();
          handleNavClick(item.name, item.route);
        }
        onClick?.();
      }}
    >
      {item.icon}
      {item.name}
      {/* Notification badge for Inbox */}
      {item.name === 'Inbox' && notificationCount > 0 && (
        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center hover:scale-110">
          <AnimatedCounter value={notificationCount} />
        </span>
      )}
    </Link>
  );

  return (
    <div className="flex items-center bg-gradient-to-r from-primary to-primary/90 border-b border-blue-200 shadow-lg">
      <nav ref={navRef} className="flex w-full px-4 items-center">
        {/* Visible navigation items */}
        {visibleItems.map((item) => (
          <NavItem key={item.name} item={item} />
        ))}
        
        {/* Overflow menu for items that don't fit */}
        {overflowItems.length > 0 && (
          <div className="relative">
            {(() => {
              // Check if the active item is in the overflow menu
              const activeOverflowItem = overflowItems.find(item => item.name === activeItem);
              const buttonLabel = activeOverflowItem ? activeOverflowItem.name : 'More';
              const buttonIcon = activeOverflowItem ? activeOverflowItem.icon : <EllipsisHorizontalIcon className="h-5 w-5" />;
              const isActiveInOverflow = !!activeOverflowItem;
              const hasInboxInOverflow = overflowItems.some(item => item.name === 'Inbox');
              
              return (
                <button
                  onClick={() => setShowOverflowMenu(!showOverflowMenu)}
                  className={`flex items-center gap-2 px-3 py-2 mx-2 my-1 text-sm font-semibold transition-all duration-200 rounded-md whitespace-nowrap relative ${
                    showOverflowMenu || isActiveInOverflow
                      ? 'text-white bg-white/20 shadow-sm backdrop-blur-sm border border-white/30'
                      : 'text-primary-foreground hover:text-white hover:bg-white/10 hover:backdrop-blur-sm'
                  }`}
                >
                  {buttonIcon}
                  {buttonLabel}
                  <ChevronDownIcon className={`h-4 w-4 transition-transform duration-200 ${
                    showOverflowMenu ? 'rotate-180' : ''
                  }`} />
                  {/* Notification badge when Inbox is in overflow */}
                  {hasInboxInOverflow && notificationCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                      <AnimatedCounter value={notificationCount} />
                    </span>
                  )}
                </button>
              );
            })()}
            
            {/* Overflow dropdown menu */}
            {showOverflowMenu && (
              <div className="absolute top-full left-0 mt-1 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50 min-w-[200px]">
                {overflowItems.map((item) => (
                  <Link
                    key={item.name}
                    to={item.route}
                    className={`flex items-center gap-3 px-4 py-2 text-sm font-medium transition-colors whitespace-nowrap relative ${
                      activeItem === item.name
                        ? 'text-blue-700 bg-blue-50'
                        : 'text-gray-700 hover:text-blue-700 hover:bg-gray-50'
                    }`}
                    onClick={(e) => {
                      if (onNavigate) {
                        e.preventDefault();
                        handleNavClick(item.name, item.route);
                      }
                      setShowOverflowMenu(false);
                    }}
                  >
                    {item.icon}
                    {item.name}
                    {/* Notification badge for Inbox in overflow menu */}
                    {item.name === 'Inbox' && notificationCount > 0 && (
                      <span className="ml-auto bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                        <AnimatedCounter value={notificationCount} />
                      </span>
                    )}
                  </Link>
                ))}
              </div>
            )}
          </div>
        )}
      </nav>
      
      {/* Click outside to close overflow menu */}
      {showOverflowMenu && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => setShowOverflowMenu(false)}
        />
      )}
    </div>
  );
};

export default MainNavigationBar; 