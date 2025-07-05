import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  HomeIcon, 
  CalendarDaysIcon, 
  UsersIcon, 
  BellIcon,
  Bars3Icon,
  XMarkIcon,
  MagnifyingGlassIcon,
  ClipboardDocumentIcon,
  ClockIcon,
  UserGroupIcon,
  BeakerIcon,
  BanknotesIcon,
  ChartBarIcon,
  InboxIcon,
  Cog8ToothIcon
} from '@heroicons/react/24/outline';
import { 
  HomeIcon as HomeIconSolid,
  CalendarDaysIcon as CalendarIconSolid,
  UsersIcon as UsersIconSolid,
  BellIcon as BellIconSolid
} from '@heroicons/react/24/solid';

/**
 * MobileBottomNavigation Component
 * 
 * Mobile-first bottom navigation that combines functionality from TopNavigationBar and MainNavigationBar
 * Only visible on mobile devices (hidden on desktop with md:hidden)
 * Features a collapsible overlay menu for additional navigation items
 * 
 * @param {string} activeItem - The currently active navigation item
 * @param {Function} onNavigate - Optional callback for navigation item clicks
 * @param {Function} onSearch - Optional callback for search functionality
 */
interface MobileBottomNavigationProps {
  activeItem?: string;
  onNavigate?: (itemName: string) => boolean | void;
  onSearch?: (searchTerm: string) => void;
}

// Primary navigation items for bottom bar (most important/frequently used)
const primaryNavItems = [
  { 
    name: 'Dashboard', 
    icon: HomeIcon, 
    iconSolid: HomeIconSolid, 
    route: '/old-ui-dashboard' 
  },
  { 
    name: 'Schedule', 
    icon: CalendarDaysIcon, 
    iconSolid: CalendarIconSolid, 
    route: '/my-calendar' 
  },
  { 
    name: 'Clients', 
    icon: UsersIcon, 
    iconSolid: UsersIconSolid, 
    route: '/clients' 
  },
  { 
    name: 'Notifications', 
    icon: BellIcon, 
    iconSolid: BellIconSolid, 
    route: '/notifications' 
  },
];

// Secondary navigation items for overlay menu
const secondaryNavItems = [
  { name: 'ADL', icon: <ClipboardDocumentIcon className="h-5 w-5" />, route: '/adl' },
  { name: 'Wait List', icon: <ClockIcon className="h-5 w-5" />, route: '/wait-list' },
  { name: 'Staff Dashboard', icon: <UserGroupIcon className="h-5 w-5" />, route: '/staff-dashboard' },
  { name: 'Practice', icon: <BeakerIcon className="h-5 w-5" />, route: '/practice' },
  { name: 'Billing', icon: <BanknotesIcon className="h-5 w-5" />, route: '/billing' },
  { name: 'Reports', icon: <ChartBarIcon className="h-5 w-5" />, route: '/reports' },
  { name: 'Inbox', icon: <InboxIcon className="h-5 w-5" />, route: '/task-hub' },
  { name: 'Administration', icon: <Cog8ToothIcon className="h-5 w-5" />, route: '/administration' },
];

const MobileBottomNavigation: React.FC<MobileBottomNavigationProps> = ({
  activeItem = 'Clients',
  onNavigate,
  onSearch,
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [showOverlay, setShowOverlay] = useState(false);
  const [showSearch, setShowSearch] = useState(false);

  // Determine active item based on current route if not explicitly provided
  const getCurrentActiveItem = () => {
    const currentPath = location.pathname;
    const allItems = [...primaryNavItems, ...secondaryNavItems];
    const activeNavItem = allItems.find(item => item.route === currentPath);
    return activeNavItem?.name || activeItem;
  };

  const currentActiveItem = getCurrentActiveItem();

  const handleNavClick = (itemName: string, route: string) => {
    if (currentActiveItem === itemName) return;
    
    if (onNavigate) {
      const shouldNavigate = onNavigate(itemName);
      if (shouldNavigate === false) {
        console.log(`Navigation to ${route} prevented by callback`);
        return;
      }
    }
    
    navigate(route);
    setShowOverlay(false); // Close overlay after navigation
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const searchTerm = formData.get('search') as string;
    if (onSearch && searchTerm.trim()) {
      onSearch(searchTerm.trim());
    }
    setShowSearch(false);
  };

  return (
    <>
      {/* Mobile Bottom Navigation Bar - Only visible on mobile */}
      <div className="fixed bottom-0 left-0 right-0 z-40 md:hidden">
        {/* Search Bar Overlay */}
        {showSearch && (
          <div className="bg-white border-t border-gray-200 px-4 py-3 shadow-lg">
            <form onSubmit={handleSearchSubmit} className="flex gap-2">
              <div className="relative flex-1">
                <input
                  name="search"
                  type="text"
                  placeholder="Search patients, appointments..."
                  className="w-full px-4 py-2 pl-10 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  autoFocus
                />
                <MagnifyingGlassIcon className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
              </div>
              <button
                type="button"
                onClick={() => setShowSearch(false)}
                className="px-3 py-2 text-gray-500 hover:text-gray-700"
              >
                Cancel
              </button>
            </form>
          </div>
        )}

        {/* Main Bottom Navigation */}
        <div className="bg-white border-t border-gray-200 shadow-lg">
          <div className="flex items-center justify-around py-2">
            {/* Primary Navigation Items */}
            {primaryNavItems.map((item) => {
              const isActive = currentActiveItem === item.name;
              const IconComponent = isActive ? item.iconSolid : item.icon;
              
              return (
                <button
                  key={item.name}
                  onClick={() => handleNavClick(item.name, item.route)}
                  className={`flex flex-col items-center justify-center px-3 py-2 min-w-0 transition-colors ${
                    isActive 
                      ? 'text-blue-600' 
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <IconComponent className="h-6 w-6 mb-1" />
                  <span className="text-xs font-medium truncate max-w-[60px]">
                    {item.name}
                  </span>
                </button>
              );
            })}

            {/* Menu Button */}
            <button
              onClick={() => setShowOverlay(true)}
              className={`flex flex-col items-center justify-center px-3 py-2 min-w-0 transition-colors ${
                showOverlay 
                  ? 'text-blue-600' 
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <Bars3Icon className="h-6 w-6 mb-1" />
              <span className="text-xs font-medium">Menu</span>
            </button>
          </div>
        </div>
      </div>

      {/* Overlay Menu - Only visible on mobile */}
      {showOverlay && (
        <div className="fixed inset-0 z-50 md:hidden">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black bg-opacity-50"
            onClick={() => setShowOverlay(false)}
          />
          
          {/* Menu Content */}
          <div className="absolute bottom-0 left-0 right-0 bg-white rounded-t-xl shadow-2xl max-h-[70vh] overflow-y-auto">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Navigation Menu</h3>
              <div className="flex items-center gap-2">
                {/* Search Button */}
                <button
                  onClick={() => {
                    setShowSearch(true);
                    setShowOverlay(false);
                  }}
                  className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <MagnifyingGlassIcon className="h-5 w-5" />
                </button>
                {/* Close Button */}
                <button
                  onClick={() => setShowOverlay(false)}
                  className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <XMarkIcon className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Primary Items (repeated for easy access) */}
            <div className="p-4">
              <h4 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-3">
                Quick Access
              </h4>
              <div className="grid grid-cols-2 gap-2 mb-6">
                {primaryNavItems.map((item) => {
                  const isActive = currentActiveItem === item.name;
                  const IconComponent = isActive ? item.iconSolid : item.icon;
                  
                  return (
                    <button
                      key={`overlay-${item.name}`}
                      onClick={() => handleNavClick(item.name, item.route)}
                      className={`flex items-center gap-3 p-3 rounded-lg transition-colors ${
                        isActive 
                          ? 'bg-blue-50 text-blue-700 border border-blue-200' 
                          : 'text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      <IconComponent className="h-5 w-5 flex-shrink-0" />
                      <span className="font-medium">{item.name}</span>
                    </button>
                  );
                })}
              </div>

              {/* Secondary Items */}
              <h4 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-3">
                More Options
              </h4>
              <div className="space-y-1">
                {secondaryNavItems.map((item) => {
                  const isActive = currentActiveItem === item.name;
                  
                  return (
                    <button
                      key={`secondary-${item.name}`}
                      onClick={() => handleNavClick(item.name, item.route)}
                      className={`flex items-center gap-3 w-full p-3 rounded-lg transition-colors ${
                        isActive 
                          ? 'bg-blue-50 text-blue-700 border border-blue-200' 
                          : 'text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      {item.icon}
                      <span className="font-medium">{item.name}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Bottom padding for safe area */}
            <div className="h-4" />
          </div>
        </div>
      )}


    </>
  );
};

export default MobileBottomNavigation;
