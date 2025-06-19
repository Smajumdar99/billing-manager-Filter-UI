import React, { useState, useEffect } from 'react';
import { 
  ChartPieIcon, DocumentTextIcon, EnvelopeOpenIcon, ChartBarIcon, 
  PencilSquareIcon, BeakerIcon as LabIcon, ArrowTrendingUpIcon, 
  DocumentPlusIcon, ClipboardIcon, ClipboardDocumentListIcon, 
  Square3Stack3DIcon as MedicationIcon, DocumentCheckIcon, AcademicCapIcon, 
  CheckCircleIcon, ExclamationCircleIcon, EyeIcon, UserGroupIcon as GroupIcon,
  FolderIcon, DocumentDuplicateIcon, PresentationChartBarIcon,
  ChevronLeftIcon, ChevronRightIcon, MagnifyingGlassIcon
} from '@heroicons/react/24/outline';
import { 
  TooltipProvider, 
  TooltipRoot, 
  TooltipTrigger, 
  TooltipContent 
} from '@/components/atoms/Tooltip/tooltip';

/**
 * SidebarItem Component Props
 */
export interface SidebarItemProps {
  icon: JSX.Element;
  label: string;
  badge?: string;
  isActive?: boolean;
  onClick?: () => void;
  collapsed?: boolean;
}

// Icon color mapping based on functionality
const getIconColor = (label: string): string => {
  // Activity Center - Light Blue
  if (label.includes('Activity')) {
    return 'text-blue-600 bg-blue-50/50';
  }
  // Documents & Forms - Purple
  if (label.includes('Document') || label.includes('Form')) {
    return 'text-purple-600 bg-purple-50/50';
  }
  // Calendar/Log - Light Gray
  if (label.includes('Log')) {
    return 'text-gray-600 bg-gray-50/50';
  }
  // Messages & Communication - Peach/Orange
  if (label.includes('Message') || label.includes('Direct Messaging')) {
    return 'text-orange-600 bg-orange-50/50';
  }
  // Staff & Dashboard - Light Blue
  if (label.includes('Staff') || label.includes('Dashboard')) {
    return 'text-blue-600 bg-blue-50/50';
  }
  // Treatment Plans - Mint Green
  if (label.includes('Treatment')) {
    return 'text-emerald-600 bg-emerald-50/50';
  }
  // Transactions - Gray
  if (label.includes('Transaction')) {
    return 'text-gray-600 bg-gray-50/50';
  }
  // User Related - Purple
  if (label.includes('User')) {
    return 'text-purple-600 bg-purple-50/50';
  }
  // Default - Light Gray
  return 'text-gray-600 bg-gray-50/50';
};

/**
 * SidebarItem Component
 * 
 * Renders an individual sidebar menu item with icon, label, and optional badge
 */
export const SidebarItem: React.FC<SidebarItemProps> = ({ 
  icon, 
  label, 
  badge, 
  isActive, 
  onClick,
  collapsed 
}) => {
  const iconColor = getIconColor(label);
  
  const iconWithClasses = {
    ...icon,
    props: {
      ...icon.props,
      className: `h-5 w-5 transition-colors duration-200`
    }
  };
  
  const linkContent = (
    <a 
      href="#" 
      onClick={(e) => {
        e.preventDefault();
        onClick?.();
      }}
      className={`flex items-center ${collapsed ? 'justify-center' : 'px-4'} py-1.5 text-sm relative group
        ${isActive 
          ? 'text-[#1C75BC] bg-[#1C75BC]/5 font-semibold' 
          : 'text-gray-700 hover:bg-gray-50/50'
        }`}
    >
      {isActive && (
        <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#1C75BC]" />
      )}
      <div className={`w-8 h-8 flex items-center justify-center rounded-lg ${iconColor}`}>
        {iconWithClasses}
      </div>
      {!collapsed && <span className="ml-3">{label}</span>}
      {!collapsed && badge && (
        <span className="ml-auto inline-flex items-center justify-center rounded-full bg-red-500 px-2 min-w-[1.25rem] h-5 text-xs font-medium text-white">
          {badge}
        </span>
      )}
      {collapsed && badge && (
        <span className="absolute top-0 right-0 inline-flex items-center justify-center rounded-full bg-red-500 min-w-[1rem] h-4 text-[9px] font-medium text-white">
          {badge}
        </span>
      )}
    </a>
  );

  // Show tooltip only when sidebar is collapsed
  if (collapsed) {
    return (
      <TooltipRoot>
        <TooltipTrigger asChild>
          {linkContent}
        </TooltipTrigger>
        <TooltipContent side="right" sideOffset={8}>
          <p className="font-medium">{label}</p>
          {badge && (
            <p className="text-xs text-neutral-300 mt-1">
              {badge} notification{badge !== '1' ? 's' : ''}
            </p>
          )}
        </TooltipContent>
      </TooltipRoot>
    );
  }

  return linkContent;
};

/**
 * Default sidebar items for the OldUI
 */
const defaultSidebarItems = [
  { icon: <ChartPieIcon />, label: "Client Summary Chart" },
  { icon: <DocumentTextIcon />, label: "Past Encounters" },
  { icon: <EnvelopeOpenIcon />, label: "Message Patient" },
  { icon: <ChartBarIcon />, label: "ROI Dashboard", badge: "1" },
  { icon: <PencilSquareIcon />, label: "Prescribe" },
  { icon: <LabIcon />, label: "Labs" },
  { icon: <ArrowTrendingUpIcon />, label: "Trend Vitals" },
  { icon: <DocumentPlusIcon />, label: "Forms to Sign" },
  { icon: <ClipboardIcon />, label: "Record Vitals" },
  { icon: <ClipboardDocumentListIcon />, label: "Treatment Plan" },
  { icon: <MedicationIcon />, label: "Administer Medications" },
  { icon: <DocumentCheckIcon />, label: "RecordMAR Orders/Vitals" },
  { icon: <AcademicCapIcon />, label: "Patient Education" },
  { icon: <CheckCircleIcon />, label: "Batch Eligibility Checking" },
  { icon: <ExclamationCircleIcon />, label: "New Incident" },
  { icon: <EyeIcon />, label: "View Incidents" },
  { icon: <GroupIcon />, label: "Patient Monitoring Rounds" },
  { icon: <DocumentTextIcon />, label: "Patient Forms" },
  { icon: <FolderIcon />, label: "Form Cabinet" },
  { icon: <DocumentDuplicateIcon />, label: "CCDA" },
  { icon: <ChartBarIcon />, label: "ABA Definition" },
  { icon: <PresentationChartBarIcon />, label: "ABA Reports" },
  { icon: <ClipboardDocumentListIcon />, label: "ABA Tracking" },
];

/**
 * Sidebar Component Props
 */
export interface SidebarProps {
  /**
   * Array of sidebar items to render
   * If not provided, defaults to the standard old UI sidebar items
   */
  items?: Array<{
    icon: JSX.Element;
    label: string;
    badge?: string;
  }>;
  
  /**
   * The currently active menu item label
   */
  activeItem?: string;
  
  /**
   * Callback when a menu item is clicked
   */
  onMenuSelect?: (itemLabel: string) => void;
  
  /**
   * Callback when search input changes
   */
  onSearch?: (searchTerm: string) => void;
  
  /**
   * Width classname for the sidebar
   * Default is "w-64"
   */
  widthClass?: string;

  /**
   * Whether the sidebar is collapsed
   * Default is false
   */
  isCollapsed?: boolean;

  /**
   * Callback when collapse state changes
   */
  onCollapsedChange?: (collapsed: boolean) => void;

  /**
   * Default collapsed state
   */
  defaultCollapsed?: boolean;
}

/**
 * Modern Sidebar Component
 * 
 * A beautiful and responsive sidebar with smooth animations and modern design
 */
const Sidebar: React.FC<SidebarProps> = ({
  items = defaultSidebarItems,
  activeItem = 'Patient Forms',
  onMenuSelect,
  onSearch,
  widthClass = 'w-64',
  onCollapsedChange,
  defaultCollapsed = false
}) => {
  const [collapsed, setCollapsed] = useState(defaultCollapsed);
  
  useEffect(() => {
    const savedState = localStorage.getItem('oldui-sidebar-collapsed');
    if (savedState !== null) {
      const isCollapsed = savedState === 'true';
      setCollapsed(isCollapsed);
      onCollapsedChange?.(isCollapsed);
    }
  }, []);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (onSearch) {
      onSearch(e.target.value);
    }
  };

  const toggleCollapse = () => {
    const newCollapsed = !collapsed;
    setCollapsed(newCollapsed);
    localStorage.setItem('oldui-sidebar-collapsed', String(newCollapsed));
    onCollapsedChange?.(newCollapsed);
  };

  return (
    <TooltipProvider>
      <div className={`${collapsed ? 'w-16' : widthClass} bg-white border-r flex flex-col h-screen`}>
        {/* Fixed Header with search and collapse button */}
        <div className="shrink-0 border-b bg-white sticky top-0 z-10">
          <div className="flex items-center p-2">
            {!collapsed && (
              <div className="flex-1 px-2">
                <div className="relative">
                  <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="search"
                    placeholder="Search menu"
                    className="w-full pl-9 pr-3 py-2 text-sm border rounded-md bg-gray-50 focus:outline-none focus:ring-1 focus:ring-[#1C75BC] focus:border-[#1C75BC]"
                    onChange={handleSearchChange}
                  />
                </div>
              </div>
            )}
            <TooltipRoot>
              <TooltipTrigger asChild>
                <button 
                  onClick={toggleCollapse}
                  className="p-2 hover:bg-gray-100 rounded-md ml-2"
                >
                  {collapsed ? (
                    <ChevronRightIcon className="h-5 w-5 text-gray-500" />
                  ) : (
                    <ChevronLeftIcon className="h-5 w-5 text-gray-500" />
                  )}
                </button>
              </TooltipTrigger>
              <TooltipContent side="bottom">
                <p>{collapsed ? "Expand sidebar" : "Collapse sidebar"}</p>
              </TooltipContent>
            </TooltipRoot>
          </div>
        </div>

        {/* Scrollable Navigation */}
        <nav className="flex-1 overflow-y-auto">
          <div className="space-y-0.5 py-2">
            {items.map((item) => (
              <SidebarItem 
                key={item.label}
                icon={item.icon}
                label={item.label}
                badge={item.badge}
                isActive={activeItem === item.label}
                onClick={() => onMenuSelect?.(item.label)}
                collapsed={collapsed}
              />
            ))}
          </div>
        </nav>
      </div>
    </TooltipProvider>
  );
};

export default Sidebar; 