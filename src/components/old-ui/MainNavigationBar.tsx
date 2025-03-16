import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  HomeIcon, ClipboardDocumentIcon, ClockIcon, CalendarDaysIcon, 
  UsersIcon, BeakerIcon, BanknotesIcon, ChartBarIcon, 
  Cog8ToothIcon, InboxIcon, WrenchScrewdriverIcon
} from '@heroicons/react/24/outline';

/**
 * MainNavigationBar Component
 * 
 * Secondary navigation bar with the main application links
 * Displays various navigation options with icons
 * 
 * @param {string} activeItem - The currently active navigation item
 * @param {Function} onNavigate - Optional callback for navigation item clicks
 *                               If it returns false, navigation will be prevented
 */
interface MainNavigationBarProps {
  activeItem?: string;
  onNavigate?: (itemName: string) => boolean | void;
}

// Navigation item configuration with routes
const navItems = [
  { name: 'Dashboard', icon: <HomeIcon className="h-4 w-4" />, route: '/dashboard' },
  { name: 'ADL', icon: <ClipboardDocumentIcon className="h-4 w-4" />, route: '/adl' },
  { name: 'Wait List', icon: <ClockIcon className="h-4 w-4" />, route: '/wait-list' },
  { name: 'Schedule', icon: <CalendarDaysIcon className="h-4 w-4" />, route: '/schedule' },
  { name: 'Clients', icon: <UsersIcon className="h-4 w-4" />, route: '/old-ui' },
  { name: 'Practice', icon: <BeakerIcon className="h-4 w-4" />, route: '/practice' },
  { name: 'Billing', icon: <BanknotesIcon className="h-4 w-4" />, route: '/billing' },
  { name: 'Reports', icon: <ChartBarIcon className="h-4 w-4" />, route: '/reports' },
  { name: 'Administration', icon: <Cog8ToothIcon className="h-4 w-4" />, route: '/administration' },
  { name: 'Inbox', icon: <InboxIcon className="h-4 w-4" />, route: '/inbox' },
  { name: 'Settings', icon: <WrenchScrewdriverIcon className="h-4 w-4" />, route: '/settings' },
];

const MainNavigationBar: React.FC<MainNavigationBarProps> = ({
  activeItem = 'Clients',
  onNavigate,
}) => {
  const navigate = useNavigate();
  
  const handleNavClick = (itemName: string, route: string) => {
    // Skip navigation if this is already the active item
    if (activeItem === itemName) {
      return;
    }
    
    // Call the onNavigate callback if provided
    if (onNavigate) {
      const shouldNavigate = onNavigate(itemName);
      
      // If onNavigate returns false explicitly, don't navigate
      if (shouldNavigate === false) {
        console.log(`Navigation to ${route} prevented by callback`);
        return;
      }
    }
    
    // Navigate to the appropriate route
    navigate(route);
  };

  return (
    <div className="flex items-end h-10 min-h-[40px] max-h-[40px] bg-[#1C75BC] text-white relative">
      <nav className="flex w-full">
        {navItems.map((item) => (
          <Link 
            key={item.name}
            to={item.route}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs ${
              activeItem === item.name 
                ? 'bg-white text-[#1C75BC] rounded-t-md shadow-sm relative z-10 h-8 font-medium border-t-2 border-r border-l border-white/20'
                : 'hover:bg-blue-600 h-8'
            }`}
            onClick={(e) => {
              // Prevent default only if we want to handle navigation in our own way
              if (onNavigate) {
                e.preventDefault();
                handleNavClick(item.name, item.route);
              }
            }}
          >
            {item.icon}
            {item.name}
          </Link>
        ))}
      </nav>
    </div>
  );
};

export default MainNavigationBar; 