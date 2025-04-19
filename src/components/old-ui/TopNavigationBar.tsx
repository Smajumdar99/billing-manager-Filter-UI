import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  MagnifyingGlassIcon, BellIcon, QuestionMarkCircleIcon, EnvelopeIcon
} from '@heroicons/react/24/outline';
import Avatar from '@/components/atoms/Avatar/avatar';

/**
 * TopNavigationBar Component
 * 
 * Reusable navigation bar component extracted from the OldUI
 * Displays a logo, search input, and right-side icons
 * 
 * @param {string} hospitalName - The name of the hospital to display
 * @param {string} userAvatarUrl - URL for the user's avatar image
 * @param {Function} onSearch - Optional callback for search input changes
 */
interface TopNavigationBarProps {
  hospitalName: string;
  userAvatarUrl: string;
  onSearch?: (searchTerm: string) => void;
}

const TopNavigationBar: React.FC<TopNavigationBarProps> = ({
  hospitalName,
  userAvatarUrl,
  onSearch,
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
    <div className="flex items-center p-2 h-16 min-h-[64px] max-h-[64px] bg-primary/10 text-slate-700">
      {/* Left side */}
      <div className="flex items-center gap-4">
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
            className="w-64 px-4 py-1.5 pl-10 rounded text-sm bg-white border border-slate-200 placeholder-slate-400 text-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-300 shadow-sm"
            onChange={handleSearchInputChange}
          />
          <MagnifyingGlassIcon className="absolute left-3 top-2 h-5 w-5 text-slate-400" />
        </div>
      </div>

      {/* Right side */}
      <div className="ml-auto flex items-center gap-6">
        <button className="p-2 hover:bg-slate-100 rounded-full transition-colors">
          <BellIcon className="h-6 w-6 text-slate-600 hover:text-slate-800 transition-colors" />
        </button>
        <button className="p-2 hover:bg-slate-100 rounded-full transition-colors">
          <QuestionMarkCircleIcon className="h-6 w-6 text-slate-600 hover:text-slate-800 transition-colors" />
        </button>
        <button className="p-2 hover:bg-slate-100 rounded-full transition-colors">
          <EnvelopeIcon className="h-6 w-6 text-slate-600 hover:text-slate-800 transition-colors" />
        </button>
        <div className="flex items-center gap-3">
          <span className="text-sm text-slate-700 font-medium">{hospitalName}</span>
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