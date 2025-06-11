import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  HomeIcon, ClipboardDocumentIcon, ClockIcon, CalendarDaysIcon, 
  UsersIcon, BeakerIcon, BanknotesIcon, ChartBarIcon, 
  Cog8ToothIcon, InboxIcon, WrenchScrewdriverIcon, UserGroupIcon
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
  { name: 'Dashboard', icon: <HomeIcon className="h-5 w-5" />, route: '/dashboard' },
  { name: 'ADL', icon: <ClipboardDocumentIcon className="h-5 w-5" />, route: '/adl' },
  { name: 'Wait List', icon: <ClockIcon className="h-5 w-5" />, route: '/wait-list' },
  //{ name: 'Schedule', icon: <CalendarDaysIcon className="h-5 w-5" />, route: '/schedule' },
  { name: 'Schedule', icon: <CalendarDaysIcon className="h-5 w-5" />, route: '/my-calendar' },
  { name: 'Clients', icon: <UsersIcon className="h-5 w-5" />, route: '/old-ui' },
  { name: 'My Caseload', icon: <UserGroupIcon className="h-5 w-5" />, route: '/my-caseload' },
  { name: 'Practice', icon: <BeakerIcon className="h-5 w-5" />, route: '/practice' },
  { name: 'Billing', icon: <BanknotesIcon className="h-5 w-5" />, route: '/billing' },
  { name: 'Reports', icon: <ChartBarIcon className="h-5 w-5" />, route: '/reports' },
  { name: 'Administration', icon: <Cog8ToothIcon className="h-5 w-5" />, route: '/administration' },
  { name: 'Inbox', icon: <InboxIcon className="h-5 w-5" />, route: '/task-hub' },
  { name: 'Settings', icon: <WrenchScrewdriverIcon className="h-5 w-5" />, route: '/settings' },
];

const MainNavigationBar: React.FC<MainNavigationBarProps> = ({
  activeItem = 'Clients',
  onNavigate,
}) => {
  const navigate = useNavigate();
  
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
  };

  return (
    <div className="flex items-center bg-primary border-b border-blue-200 shadow-lg">
      <nav className="flex w-full px-4">
        {navItems.map((item) => (
          <Link 
            key={item.name}
            to={item.route}
            className={`flex items-center gap-2 px-4 py-2 text-sm font-medium transition-all duration-200 ${
              activeItem === item.name 
                ? 'text-white border-b-2 border-white'
                : 'text-primary-foreground hover:text-white hover:bg-primary/80'
            }`}
            onClick={(e) => {
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