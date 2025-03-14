import React, { useState, useEffect } from 'react';
import { 
  ChartPieIcon, DocumentTextIcon, EnvelopeOpenIcon, ChartBarIcon, 
  PencilSquareIcon, BeakerIcon as LabIcon, ArrowTrendingUpIcon, 
  DocumentPlusIcon, ClipboardIcon, ClipboardDocumentListIcon, 
  Square3Stack3DIcon as MedicationIcon, DocumentCheckIcon, AcademicCapIcon, 
  CheckCircleIcon, ExclamationCircleIcon, EyeIcon, UserGroupIcon as GroupIcon,
  FolderIcon, DocumentDuplicateIcon, PresentationChartBarIcon,
  ChevronLeftIcon, ChevronRightIcon
} from '@heroicons/react/24/outline';

/**
 * SidebarItem Component
 * 
 * Individual item in the sidebar with icon, label, and optional badge
 */
export interface SidebarItemProps {
  icon: JSX.Element;
  label: string;
  badge?: string;
  isActive?: boolean;
  onClick?: () => void;
  collapsed?: boolean;
}

/**
 * SidebarItem
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
  const iconWithClasses = {
    ...icon,
    props: {
      ...icon.props,
      className: `h-4 w-4 ${collapsed ? 'mx-auto' : 'mr-3'} ${isActive ? 'text-[#1C75BC]' : 'text-gray-400'}`
    }
  };
  
  return (
    <a 
      href="#" 
      onClick={(e) => {
        e.preventDefault();
        onClick?.();
      }}
      className={`flex items-center ${collapsed ? 'justify-center' : 'px-4'} py-1.5 text-xs relative ${
        isActive 
          ? 'text-semibold text-[#1C75BC] bg-[#1C75BC]/10' 
          : 'text-gray-700 hover:bg-gray-100'
      }`}
      title={collapsed ? label : ''}
    >
      {isActive && (
        <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#1C75BC]" />
      )}
      {iconWithClasses}
      {!collapsed && <span>{label}</span>}
      {!collapsed && badge && (
        <span className="ml-auto inline-flex items-center justify-center rounded-full bg-red-500 w-5 h-5 text-xs font-medium text-white">
          {badge}
        </span>
      )}
      {collapsed && badge && (
        <span className="absolute top-0 right-0 inline-flex items-center justify-center rounded-full bg-red-500 w-4 h-4 text-[9px] font-medium text-white">
          {badge}
        </span>
      )}
    </a>
  );
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
 * Sidebar Component
 * 
 * Reusable sidebar component extracted from OldUI
 * Displays a search input and navigation items
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
  
  // Initialize localStorage persistence if needed
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
    
    // Save state to localStorage
    localStorage.setItem('oldui-sidebar-collapsed', String(newCollapsed));
    
    // Notify parent component
    if (onCollapsedChange) {
      onCollapsedChange(newCollapsed);
    }
  };

  return (
    <div className={`${collapsed ? 'w-14' : widthClass} bg-white border-r overflow-y-auto transition-all duration-300 ease-in-out flex flex-col`}>
      {!collapsed && (
        <div className="p-4">
          <input
            type="search"
            placeholder="Search menu"
            className="w-full px-3 py-2 border rounded-md text-sm"
            onChange={handleSearchChange}
          />
        </div>
      )}
      <nav className="space-y-0.5 py-2 flex-grow">
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
      </nav>
      <div className="border-t p-2 flex justify-center">
        <button 
          onClick={toggleCollapse}
          className="text-gray-500 hover:text-gray-700 p-1.5 rounded-md hover:bg-gray-100 transition-colors"
          title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {collapsed ? <ChevronRightIcon className="h-5 w-5" /> : <ChevronLeftIcon className="h-5 w-5" />}
        </button>
      </div>
    </div>
  );
};

export default Sidebar; 