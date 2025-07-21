import React from 'react';
import TopNavigationBar from '@/components/old-ui/TopNavigationBar';
import MainNavigationBar from '@/components/old-ui/MainNavigationBar';
import MobileBottomNavigation from '@/components/organisms/MobileBottomNavigation/mobile-bottom-navigation';
import Avatar from '@/components/atoms/Avatar/avatar';
import { ProfileMenu } from '@/components/molecules/ProfileMenu/profile-menu';

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
        <div className="flex items-center justify-between p-3 bg-primary/20 text-slate-700 border-b border-blue-200">
          {/* Logo */}
          <img 
            src="/logo.svg" 
            alt="Logo" 
            className="h-8 w-8 brightness-0 invert-[0.4] flex-shrink-0" 
          />
          
          {/* Hospital Name */}
          <h1 className="text-lg font-semibold text-slate-800 truncate flex-1 text-center px-2">
            {hospitalName}
          </h1>
          
          {/* User Profile with Menu */}
          <div className="flex-shrink-0">
            <ProfileMenu
              variant="topNav"
              userInfo={userInfo || {
                name: "User",
                role: "staff",
                avatar: userAvatarUrl
              }}
              trigger={
                <button className="flex items-center gap-2 p-1 rounded-lg hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all group">
                  {/* Profile Avatar with Status Indicator */}
                  <div className="relative">
                    <Avatar 
                      src={userAvatarUrl || userInfo?.avatar} 
                      alt={userInfo?.name || "User"}
                      fallback={userInfo?.name ? userInfo.name.charAt(0).toUpperCase() : 'U'}
                      size="md"
                      className="ring-2 ring-white shadow-sm group-hover:ring-primary/20 transition-all cursor-pointer"
                    />
                    {/* Online Status Indicator */}
                    <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
                  </div>
                  
                  {/* Chevron Down Icon */}
                  <svg 
                    className="w-3 h-3 text-slate-400 group-hover:text-slate-600 transition-colors" 
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
              }
            />
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
