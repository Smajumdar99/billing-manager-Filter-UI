import React from 'react';
import { cn } from '@/lib/utils';

interface TabsProps {
  tabs: {
    id: string;
    label: string;
    icon?: React.ReactNode;
  }[];
  activeTab: string;
  onTabChange: (tabId: string) => void;
  className?: string;
}

export const Tabs: React.FC<TabsProps> = ({
  tabs,
  activeTab,
  onTabChange,
  className
}) => {
  return (
    <div className={cn("flex overflow-x-auto scrollbar-none", className)}>
      <div className="flex gap-1 p-1 bg-gray-50 rounded-lg min-w-fit">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={cn(
              "flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded-md transition-colors whitespace-nowrap",
              activeTab === tab.id
                ? "bg-white text-gray-900 shadow-sm"
                : "text-gray-600 hover:text-gray-900 hover:bg-white/50"
            )}
          >
            {tab.icon && <span className="w-4 h-4">{tab.icon}</span>}
            {tab.label}
          </button>
        ))}
      </div>
    </div>
  );
}; 