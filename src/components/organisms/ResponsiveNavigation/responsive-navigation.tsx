import React from 'react';
import TopNavigationBar from '@/components/old-ui/TopNavigationBar';
import MainNavigationBar from '@/components/old-ui/MainNavigationBar';
import MobileBottomNavigation from '@/components/organisms/MobileBottomNavigation/mobile-bottom-navigation';

/**
 * ResponsiveNavigation Component
 * 
 * Intelligent navigation wrapper that shows appropriate navigation based on screen size:
 * - Desktop: TopNavigationBar + MainNavigationBar (existing functionality preserved)
 * - Mobile: MobileBottomNavigation (bottom navigation with overlay menu)
 * 
 * This ensures zero impact on desktop experience while providing mobile-optimized navigation
 */
interface ResponsiveNavigationProps {
  // TopNavigationBar props
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
  
  // MainNavigationBar props
  activeItem?: string;
  onNavigate?: (itemName: string) => boolean | void;
}

const ResponsiveNavigation: React.FC<ResponsiveNavigationProps> = ({
  hospitalName,
  userAvatarUrl,
  onSearch,
  patient,
  onNewEncounter,
  onViewChart,
  userInfo,
  activeItem,
  onNavigate,
}) => {
  return (
    <>
      {/* Desktop Navigation - Hidden on mobile (md:block) */}
      <div className="hidden md:block">
        <TopNavigationBar
          hospitalName={hospitalName}
          userAvatarUrl={userAvatarUrl}
          onSearch={onSearch}
          patient={patient}
          onNewEncounter={onNewEncounter}
          onViewChart={onViewChart}
          userInfo={userInfo}
        />
        <MainNavigationBar
          activeItem={activeItem}
          onNavigate={onNavigate}
        />
      </div>

      {/* Mobile Top Bar - Simplified version for mobile */}
      <div className="block md:hidden">
        <div className="flex items-center justify-between p-4 bg-primary/20 text-slate-700 border-b border-blue-200">
          {/* Logo */}
          <img 
            src="/logo.svg" 
            alt="Logo" 
            className="h-8 w-8 brightness-0 invert-[0.4]" 
          />
          
          {/* Hospital Name */}
          <h1 className="text-lg font-semibold text-slate-800 truncate">
            {hospitalName}
          </h1>
          
          {/* User Avatar */}
          <div className="relative">
            <img
              src={userAvatarUrl}
              alt="User"
              className="h-8 w-8 rounded-full ring-2 ring-white shadow-sm"
            />
            {/* Online Status Indicator */}
            <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
          </div>
        </div>
      </div>

      {/* Mobile Bottom Navigation - Only visible on mobile */}
      <MobileBottomNavigation
        activeItem={activeItem}
        onNavigate={onNavigate}
        onSearch={onSearch}
      />
    </>
  );
};

export default ResponsiveNavigation;
