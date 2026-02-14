import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  MagnifyingGlassIcon, BellIcon, QuestionMarkCircleIcon, EnvelopeIcon, UserPlusIcon
} from '@heroicons/react/24/outline';
import Avatar from '@/components/atoms/Avatar/avatar';
import { PatientSnapshot } from '@/components/molecules/PatientSnapshot/patient-snapshot';
import { ProfileMenu } from '@/components/molecules/ProfileMenu/profile-menu';

/**
 * TopNavigationBar Component
 * 
 * Reusable navigation bar component extracted from the OldUI
 * Displays a logo, search input, patient snapshot, and right-side icons
 * 
 * @param {string} hospitalName - The name of the hospital to display
 * @param {string} userAvatarUrl - URL for the user's avatar image
 * @param {Function} onSearch - Optional callback for search input changes
 * @param {Object} patient - Optional patient data to display in snapshot (only shown when provided)
 * @param {Function} onNewEncounter - Optional callback for new encounter action
 * @param {Function} onViewChart - Optional callback for view chart action
 */
interface TopNavigationBarProps {
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
}

const TopNavigationBar: React.FC<TopNavigationBarProps> = ({
  hospitalName,
  userAvatarUrl,
  onSearch,
  patient,
  onNewEncounter,
  onViewChart,
  userInfo,
}) => {
  const navigate = useNavigate();
  
  const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (onSearch) {
      onSearch(e.target.value);
    }
  };

  const handleLogoClick = () => {
    navigate('/old-ui-dashboard');
  };

  // Helper function to format role names
  const formatRole = (role: string): string => {
    const roleMap: Record<string, string> = {
      billing_specialist: 'Billing Specialist',
      billing_manager: 'Billing Manager',
      clinician: 'Clinician',
      front_desk: 'Front Desk',
      clinic_admin: 'Clinic Admin',
      cfo: 'CFO',
      practice_manager: 'Practice Manager',
      ccbhc: 'CCBHC',
      supervisor: 'Supervisor'
    };
    return roleMap[role] || role.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  // Default userInfo if not provided
  const defaultUserInfo = userInfo || {
    name: "Sarah Johnson",
    role: "front_desk",
    avatar: "/avatar.png"
  };

  return (
    <div className="flex items-center justify-between p-2 min-h-[68px] bg-primary/20 text-slate-700 overflow-visible border-b border-blue-200">
      {/* Left side - Logo and search only */}
      <div className="flex items-center gap-2 sm:gap-4 flex-shrink-0 min-w-0">
        <img 
          src="/logo.svg" 
          alt="Logo" 
          className="h-8 w-8 cursor-pointer hover:opacity-80 transition-opacity brightness-0 invert-[0.4] flex-shrink-0" 
          onClick={handleLogoClick}
        />
        <div className="relative min-w-0 flex-1 sm:flex-initial">
          <input
            type="text"
            placeholder="Search"
            className="w-full sm:w-48 lg:w-64 px-4 py-1.5 pl-10 rounded text-sm sm:text-md bg-white border border-slate-200 placeholder-slate-400 text-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-300 shadow-sm"
            onChange={handleSearchInputChange}
          />
          <MagnifyingGlassIcon className="absolute left-3 top-2 h-5 w-5 text-slate-400" />
        </div>
      </div>

      {/* Right side - Patient snapshot, icons, and user info */}
      <div className="flex items-center gap-1 sm:gap-2 lg:gap-6 flex-shrink-0 min-w-0">
        {/* Patient Snapshot - Hide on very small screens if needed */}
        {patient && (
          <div className="hidden sm:block mx-2 lg:mx-4">
            <PatientSnapshot
              patient={patient}
              variant="header"
              onNewEncounter={onNewEncounter}
              onViewChart={onViewChart}
            />
          </div>
        )}
        
        {/* Action Icons */}
        <button className="p-1.5 sm:p-2 hover:bg-slate-100 rounded-full transition-colors">
          <BellIcon className="h-5 w-5 sm:h-5 sm:w-5 lg:h-6 lg:w-6 text-slate-600 hover:text-slate-800 transition-colors" />
        </button>
        <button className="p-1.5 sm:p-2 hover:bg-slate-100 rounded-full transition-colors hidden md:block">
          <QuestionMarkCircleIcon className="h-5 w-5 sm:h-5 sm:w-5 lg:h-6 lg:w-6 text-slate-600 hover:text-slate-800 transition-colors" />
        </button>
        <button className="p-1.5 sm:p-2 hover:bg-slate-100 rounded-full transition-colors hidden md:block">
          <EnvelopeIcon className="h-5 w-5 sm:h-5 sm:w-5 lg:h-6 lg:w-6 text-slate-600 hover:text-slate-800 transition-colors" />
        </button>
        <button className="p-1.5 sm:p-2 hover:bg-slate-100 rounded-full transition-colors hidden md:block" title="Add New Client">
          <UserPlusIcon className="h-5 w-5 sm:h-5 sm:w-5 lg:h-6 lg:w-6 text-slate-600 hover:text-slate-800 transition-colors" />
        </button>
        
        {/* Modern User Profile Section */}
        <div className="flex items-center gap-2 lg:gap-4">
          {/* Modern Profile Info Card */}
          <ProfileMenu
            variant="topNav"
            userInfo={defaultUserInfo}
            trigger={
              <button className="flex items-center gap-2 lg:gap-3 px-1 sm:px-2 py-1.5 rounded-lg hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all group">
                {/* User Info Text - Only show on larger screens */}
                <div className="hidden md:flex flex-col items-end text-right min-w-0">
                  <div className="text-sm font-semibold text-slate-800 truncate max-w-[120px] lg:max-w-[160px]">
                    {defaultUserInfo.name}
                  </div>
                  <div className="text-xs text-slate-500 truncate max-w-[120px] lg:max-w-[160px]">
                    {formatRole(defaultUserInfo.role)}
                  </div>
                </div>
                
                {/* Profile Avatar with Status Indicator */}
                <div className="relative">
                  <Avatar 
                    src={userAvatarUrl || defaultUserInfo.avatar} 
                    alt={defaultUserInfo.name || hospitalName}
                    fallback={defaultUserInfo.name ? defaultUserInfo.name.charAt(0).toUpperCase() : 'U'}
                    size="md"
                    className="ring-2 ring-white shadow-sm group-hover:ring-primary/20 transition-all cursor-pointer"
                  />
                  {/* Online Status Indicator */}
                  <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
                </div>
                
                {/* Chevron Down Icon - Show on mobile too but smaller */}
                <svg 
                  className="w-3 h-3 sm:w-4 sm:h-4 text-slate-400 group-hover:text-slate-600 transition-colors" 
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
  );
};

export default TopNavigationBar; 