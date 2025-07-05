import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  HomeIcon, ClipboardDocumentIcon, ClockIcon, CalendarDaysIcon, 
  UsersIcon, BeakerIcon, BanknotesIcon, ChartBarIcon, 
  Cog8ToothIcon, InboxIcon, UserGroupIcon, EllipsisHorizontalIcon,
  ChevronDownIcon
} from '@heroicons/react/24/outline';

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
  { name: 'Reports', icon: <ChartBarIcon className="h-5 w-5" />, route: '/reports' },
  { name: 'Inbox', icon: <InboxIcon className="h-5 w-5" />, route: '/task-hub' },
  { name: 'Administration', icon: <Cog8ToothIcon className="h-5 w-5" />, route: '/administration' },
];

const MainNavigationBar: React.FC<MainNavigationBarProps> = ({
  activeItem = 'Clients',
  onNavigate,
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
      className={`flex items-center gap-2 px-3 py-2 mx-2 my-1 text-sm font-semibold transition-all duration-200 rounded-md whitespace-nowrap ${
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
    </Link>
  );

  return (
    <div className="flex items-center bg-gradient-to-r from-primary to-orange-600 border-b border-blue-200 shadow-lg">
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
              
              return (
                <button
                  onClick={() => setShowOverflowMenu(!showOverflowMenu)}
                  className={`flex items-center gap-2 px-3 py-2 mx-2 my-1 text-sm font-semibold transition-all duration-200 rounded-md whitespace-nowrap ${
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
                    className={`flex items-center gap-3 px-4 py-2 text-sm font-medium transition-colors whitespace-nowrap ${
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