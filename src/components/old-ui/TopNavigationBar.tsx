import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  MagnifyingGlassIcon, BellIcon, QuestionMarkCircleIcon, EnvelopeIcon
} from '@heroicons/react/24/outline';
import Avatar from '@/components/atoms/Avatar/avatar';
import { PatientSnapshot } from '@/components/molecules/PatientSnapshot/patient-snapshot';

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
}

const TopNavigationBar: React.FC<TopNavigationBarProps> = ({
  hospitalName,
  userAvatarUrl,
  onSearch,
  patient,
  onNewEncounter,
  onViewChart,
}) => {
  const navigate = useNavigate();
  
  const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (onSearch) {
      onSearch(e.target.value);
    }
  };

  const handleLogoClick = () => {
    navigate('/dashboard');
  };

  return (
    <div className="flex items-center justify-between p-2 min-h-[64px] bg-primary/10 text-slate-700 overflow-visible">
      {/* Left side - Logo and search only */}
      <div className="flex items-center gap-4 flex-shrink-0">
        <img 
          src="/logo.svg" 
          alt="Logo" 
          className="h-8 w-8 cursor-pointer hover:opacity-80 transition-opacity brightness-0 invert-[0.4]" 
          onClick={handleLogoClick}
        />
        <div className="relative">
          <input
            type="text"
            placeholder="Search"
            className="w-48 lg:w-64 px-4 py-1.5 pl-10 rounded text-sm bg-white border border-slate-200 placeholder-slate-400 text-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-300 shadow-sm"
            onChange={handleSearchInputChange}
          />
          <MagnifyingGlassIcon className="absolute left-3 top-2 h-5 w-5 text-slate-400" />
        </div>
      </div>

      {/* Right side - Patient snapshot, icons, and user info */}
      <div className="flex items-center gap-2 lg:gap-6 flex-shrink-0">
        {/* Patient Snapshot */}
        {patient && (
          <div className="mx-2 lg:mx-4">
            <PatientSnapshot
              patient={patient}
              variant="header"
              onNewEncounter={onNewEncounter}
              onViewChart={onViewChart}
            />
          </div>
        )}
        
        {/* Action Icons */}
        <button className="p-2 hover:bg-slate-100 rounded-full transition-colors">
          <BellIcon className="h-5 w-5 lg:h-6 lg:w-6 text-slate-600 hover:text-slate-800 transition-colors" />
        </button>
        <button className="p-2 hover:bg-slate-100 rounded-full transition-colors hidden sm:block">
          <QuestionMarkCircleIcon className="h-5 w-5 lg:h-6 lg:w-6 text-slate-600 hover:text-slate-800 transition-colors" />
        </button>
        <button className="p-2 hover:bg-slate-100 rounded-full transition-colors hidden sm:block">
          <EnvelopeIcon className="h-5 w-5 lg:h-6 lg:w-6 text-slate-600 hover:text-slate-800 transition-colors" />
        </button>
        
        {/* User Info */}
        <div className="flex items-center gap-2 lg:gap-3">
          <span className="text-xs lg:text-sm text-slate-700 font-medium hidden md:block">{hospitalName}</span>
          <Avatar 
            src={userAvatarUrl} 
            alt={hospitalName}
            size="sm"
            className="ring-slate-200"
          />
        </div>
      </div>
    </div>
  );
};

export default TopNavigationBar; 