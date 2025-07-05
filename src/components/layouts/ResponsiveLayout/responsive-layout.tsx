import React from 'react';
import ResponsiveNavigation from '@/components/organisms/ResponsiveNavigation/responsive-navigation';

/**
 * ResponsiveLayout Component
 * 
 * A layout wrapper that provides responsive navigation for all pages
 * Automatically handles desktop vs mobile navigation without affecting existing functionality
 * 
 * Usage:
 * ```tsx
 * <ResponsiveLayout 
 *   hospitalName="Demo Hospital"
 *   userAvatarUrl="/avatar.png"
 *   activeItem="Dashboard"
 * >
 *   <YourPageContent />
 * </ResponsiveLayout>
 * ```
 */
interface ResponsiveLayoutProps {
  children: React.ReactNode;
  
  // Navigation props
  hospitalName: string;
  userAvatarUrl: string;
  onSearch?: (searchTerm: string) => void;
  patient?: {
    id: string;
    name: string;
    avatar?: string;
    gender: string;
    age?: number;
    bloodGroup?: string;
    insuranceProvider?: string;
    admittedTo?: string;
    language?: string;
    mobile?: string;
    programAuditor?: string;
    auditorTimestamp?: string;
    primaryCareProvider?: string;
    nickname?: string;
  };
  onNewEncounter?: () => void;
  onViewChart?: () => void;
  userInfo?: {
    name: string;
    role: string;
    avatar?: string;
  };
  activeItem?: string;
  onNavigate?: (itemName: string) => boolean | void;
  
  // Layout options
  className?: string;
  contentClassName?: string;
}

const ResponsiveLayout: React.FC<ResponsiveLayoutProps> = ({
  children,
  hospitalName,
  userAvatarUrl,
  onSearch,
  patient,
  onNewEncounter,
  onViewChart,
  userInfo,
  activeItem,
  onNavigate,
  className = '',
  contentClassName = '',
}) => {
  return (
    <div className={`flex flex-col h-screen overflow-hidden bg-white ${className}`}>
      {/* Responsive Navigation */}
      <ResponsiveNavigation
        hospitalName={hospitalName}
        userAvatarUrl={userAvatarUrl}
        onSearch={onSearch}
        patient={patient}
        onNewEncounter={onNewEncounter}
        onViewChart={onViewChart}
        userInfo={userInfo}
        activeItem={activeItem}
        onNavigate={onNavigate}
      />
      
      {/* Main Content - Takes remaining space */}
      <main className={`flex-1 overflow-hidden ${contentClassName}`}>
        {children}
      </main>
    </div>
  );
};

export default ResponsiveLayout;
