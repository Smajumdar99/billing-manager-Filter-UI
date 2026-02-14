import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { PanelLeft, PanelRight } from 'lucide-react';
import { 
  TooltipProvider, 
  TooltipRoot, 
  TooltipTrigger, 
  TooltipContent 
} from '@/components/atoms/Tooltip/tooltip';

/**
 * Sub-navigation item interface
 */
export interface SubNavItem {
  label: string;
  onClick?: () => void;
}

/**
 * SidebarItem Component Props
 */
export interface SidebarItemProps {
  icon: string; // FontAwesome icon name
  label: string;
  hasAction?: boolean; // Shows + icon
  subItems?: SubNavItem[]; // Sub-navigation items
  isActive?: boolean;
  onClick?: () => void;
  collapsed?: boolean;
  isExpanded?: boolean;
  onToggleExpand?: () => void;
}

// Icon color mapping for billing functionality
const getIconColor = (label: string, isActive?: boolean): string => {
  // If not active, return normal gray color for all items
  if (!isActive) {
    return 'text-gray-600 bg-gray-50/50';
  }
  
  // Only apply colors for active items
  // Management functions - Blue
  if (label.includes('Manager') || label.includes('Batch')) {
    return 'text-blue-600 bg-blue-50/50';
  }
  // Financial/Billing - Green  
  if (label.includes('Billing') || label.includes('Payment') || label.includes('Fee') || label.includes('Charges')) {
    return 'text-green-600 bg-green-50/50';
  }
  // Reports/Analytics - Purple
  if (label.includes('Report') || label.includes('Error') || label.includes('Statement')) {
    return 'text-purple-600 bg-purple-50/50';
  }
  // Claims/Insurance - Orange (excluding Claims & Denials which uses default gray)
  if ((label.includes('Claims') && label !== 'Claims & Denials') || label.includes('ERA') || label.includes('Eligibility')) {
    return 'text-orange-600 bg-orange-50/50';
  }
  // Data/Processing - Gray
  if (label.includes('Export') || label.includes('Reprocess') || label.includes('UB-04')) {
    return 'text-gray-600 bg-gray-50/50';
  }
  // Default active color - Light Blue
  return 'text-slate-600 bg-slate-50/50';
};

/**
 * SidebarItem Component
 * 
 * Renders an individual sidebar menu item with icon, label, optional action button, and sub-navigation
 */
export const SidebarItem: React.FC<SidebarItemProps> = ({ 
  icon, 
  label, 
  hasAction = false,
  subItems = [],
  isActive, 
  onClick,
  collapsed,
  isExpanded = false,
  onToggleExpand
}) => {
  const iconColor = getIconColor(label, isActive);
  const hasSubItems = subItems.length > 0;
  
  const handleMainClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (hasSubItems) {
      onToggleExpand?.();
    } else {
      onClick?.();
    }
  };
  
  const linkContent = (
    <div>
      <a 
        href="#" 
        onClick={handleMainClick}
        className={`flex items-center ${collapsed ? 'justify-center' : 'px-3'} py-2 text-sm relative group
          ${isActive 
            ? 'text-[#1C75BC] bg-[#1C75BC]/10 font-medium' 
            : 'text-gray-700 hover:bg-gray-50'
          } transition-colors duration-150`}
      >
        {isActive && (
          <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#1C75BC]" />
        )}
        <div className={`w-7 h-7 flex items-center justify-center rounded-lg ${iconColor} shrink-0`}>
          <FontAwesomeIcon icon={icon as IconProp} className="h-4 w-4 transition-colors duration-200" />
        </div>
        {!collapsed && (
          <span className="ml-2 flex-1 truncate">{label}</span>
        )}
        {!collapsed && hasAction && !hasSubItems && (
          <FontAwesomeIcon icon="plus" className="w-4 h-4 text-gray-400 ml-2 shrink-0" />
        )}
        {!collapsed && hasSubItems && (
          <div className="ml-2 shrink-0">
            {isExpanded ? (
              <FontAwesomeIcon icon="chevron-up" className="w-4 h-4 text-gray-400" />
            ) : (
              <FontAwesomeIcon icon="chevron-down" className="w-4 h-4 text-gray-400" />
            )}
          </div>
        )}
      </a>
      
      {/* Sub-navigation items */}
      {!collapsed && hasSubItems && isExpanded && (
        <div className="ml-6 border-l border-gray-200 pl-4 py-1">
          {subItems.map((subItem, index) => (
            <a
              key={index}
              href="#"
              onClick={(e) => {
                e.preventDefault();
                subItem.onClick?.();
              }}
              className="block py-1.5 px-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded transition-colors duration-150"
            >
              {subItem.label}
            </a>
          ))}
        </div>
      )}
    </div>
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
          {hasAction && (
            <p className="text-xs text-neutral-300 mt-1">
              Has additional actions
            </p>
          )}
          {hasSubItems && (
            <p className="text-xs text-neutral-300 mt-1">
              {subItems.length} sub-item{subItems.length !== 1 ? 's' : ''}
            </p>
          )}
        </TooltipContent>
      </TooltipRoot>
    );
  }

  return linkContent;
};

/**
 * Billing sidebar items configuration with FontAwesome icons
 */
const billingNavItems: Array<{
  icon: string;
  label: string;
  hasAction?: boolean;
  subItems?: SubNavItem[];
}> = [
  { icon: "chart-bar", label: "Billing Dashboard" },
  { icon: "file-invoice-dollar", label: "Billing Manager" },
  { icon: "folder-open", label: "Batch Manager" },
  { 
    icon: "cogs", 
    label: "Masters", 
    subItems: [
      { label: "Level of Care" }
    ]
  },
  { icon: "clipboard-list", label: "Claims & Denials" },
  { icon: "exchange-alt", label: "ERA Process" },
  { icon: "file-contract", label: "Fee Sheet" },
  { icon: "dollar-sign", label: "Charges" },
  { icon: "receipt", label: "Checkout" },
  { 
    icon: "chart-line", 
    label: "Error Reports", 
    subItems: [
      { label: "Golden Thread Errors" }
    ]
  },
  { 
    icon: "exclamation-triangle", 
    label: "View Billing Errors", 
    subItems: [
      { label: "HCFA" },
      { label: "UB04" }
    ]
  },
  { icon: "credit-card", label: "Payments" },
  { icon: "chart-pie", label: "Report" },
  { 
    icon: "file-signature", 
    label: "Statement Manager", 
    subItems: [
      { label: "New" },
      { label: "Report" }
    ]
  },
  { 
    icon: "shield-alt", 
    label: "PRP Program", 
    subItems: [
      { label: "Compile PRP Program" },
      { label: "Status Report" },
      { label: "Settings" }
    ]
  },
  { 
    icon: "tools", 
    label: "Manage UB-04 Preprocessing", 
    subItems: [
      { label: "Pre Process" },
      { label: "Pre Process Status Report" },
      { label: "Settings" }
    ]
  },
  { icon: "shield-alt", label: "Eligibility & Benefits" },
  { icon: "calendar", label: "Accounting Period" },
  { 
    icon: "file-export", 
    label: "Export Data to General Ledger", 
    subItems: [
      { label: "Manage Crosswalks" },
      { label: "Export Data" },
      { label: "Export History" },
      { label: "Adjustment Accounts" }
    ]
  },
  { icon: "redo-alt", label: "Reprocess Encounters" }
];

/**
 * Sidebar Component Props
 */
export interface SidebarProps {
  /**
   * Array of sidebar items to render
   * If not provided, defaults to billing navigation items
   */
  items?: Array<{
    icon: string;
    label: string;
    hasAction?: boolean;
    subItems?: SubNavItem[];
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
 * Modern billing sidebar with smooth animations and professional design.
 * Atomic component following design system patterns.
 */
export const Sidebar: React.FC<SidebarProps> = ({
  items = billingNavItems,
  activeItem = 'Billing Dashboard',
  onMenuSelect,
  onSearch,
  widthClass = 'w-64',
  onCollapsedChange,
  defaultCollapsed = false
}) => {
  const [collapsed, setCollapsed] = useState(defaultCollapsed);
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());
  
  useEffect(() => {
    const savedState = localStorage.getItem('billing-sidebar-collapsed');
    if (savedState !== null) {
      const isCollapsed = savedState === 'true';
      setCollapsed(isCollapsed);
      onCollapsedChange?.(isCollapsed);
    }
  }, [onCollapsedChange]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    onSearch?.(value);
  };

  const toggleCollapse = () => {
    const newCollapsed = !collapsed;
    setCollapsed(newCollapsed);
    localStorage.setItem('billing-sidebar-collapsed', String(newCollapsed));
    onCollapsedChange?.(newCollapsed);
  };

  const toggleItemExpanded = (itemLabel: string) => {
    setExpandedItems(prev => {
      const newSet = new Set(prev);
      if (newSet.has(itemLabel)) {
        newSet.delete(itemLabel);
      } else {
        newSet.add(itemLabel);
      }
      return newSet;
    });
  };

  // Filter items based on search term
  const filteredItems = items.filter(item =>
    item.label.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <TooltipProvider>
      <div className={`${collapsed ? 'w-16' : widthClass} bg-white border-r border-gray-200 flex flex-col h-full transition-all duration-300 ease-in-out`}>
        {/* Fixed Header with search and collapse button */}
        <div className="shrink-0 border-b border-gray-200 bg-white sticky top-0 z-10">
          <div className="flex items-center p-3">
            {!collapsed && (
              <div className="flex-1">
                <div className="relative">
                  <FontAwesomeIcon icon="search" className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="search"
                    placeholder="Search navigation..."
                    value={searchTerm}
                    className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#1C75BC] focus:border-[#1C75BC] transition-colors"
                    onChange={handleSearchChange}
                  />
                </div>
              </div>
            )}
            <TooltipRoot>
              <TooltipTrigger asChild>
                <button 
                  onClick={toggleCollapse}
                  className="p-1.5 hover:bg-gray-100 rounded-lg ml-2 transition-colors"
                >
                  {collapsed ? (
                    <PanelRight className="h-4 w-4 text-gray-500" />
                  ) : (
                    <PanelLeft className="h-4 w-4 text-gray-500" />
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
          <div className="py-2 space-y-0.5">
            {filteredItems.map((item) => (
              <SidebarItem 
                key={item.label}
                icon={item.icon}
                label={item.label}
                hasAction={item.hasAction || false}
                subItems={item.subItems}
                isActive={activeItem === item.label}
                onClick={() => onMenuSelect?.(item.label)}
                collapsed={collapsed}
                isExpanded={expandedItems.has(item.label)}
                onToggleExpand={() => toggleItemExpanded(item.label)}
              />
            ))}
          </div>
          
          {filteredItems.length === 0 && searchTerm && (
            <div className="px-3 py-8 text-center text-gray-500">
              <FontAwesomeIcon icon="search" className="w-8 h-8 mx-auto mb-2 text-gray-300" />
              <p className="text-sm">No items found</p>
              <p className="text-xs text-gray-400 mt-1">Try a different search term</p>
            </div>
          )}
        </nav>
      </div>
    </TooltipProvider>
  );
};

export default Sidebar;
