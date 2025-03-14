import React from 'react';
import { 
  MagnifyingGlassIcon, BellIcon, QuestionMarkCircleIcon, EnvelopeIcon
} from '@heroicons/react/24/outline';

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
  const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (onSearch) {
      onSearch(e.target.value);
    }
  };

  return (
    <div className="flex items-center p-2 h-16 min-h-[64px] max-h-[64px] bg-[#1C75BC]/15 text-[#1C75BC]">
      {/* Left side */}
      <div className="flex items-center gap-4">
        <img src="/logo.svg" alt="Logo" className="h-8 w-8" />
        <div className="relative">
          <input
            type="text"
            placeholder="Search"
            className="w-64 px-4 py-1.5 pl-10 rounded text-sm bg-white/50 border border-[#1C75BC]/20 placeholder-[#1C75BC]/70 focus:outline-none focus:ring-2 focus:ring-[#1C75BC]/30"
            onChange={handleSearchInputChange}
          />
          <MagnifyingGlassIcon className="absolute left-3 top-2 h-5 w-5 text-[#1C75BC]/70" />
        </div>
      </div>

      {/* Right side */}
      <div className="ml-auto flex items-center gap-6">
        <BellIcon className="h-4 w-4 text-[#1C75BC]" />
        <QuestionMarkCircleIcon className="h-4 w-4 text-[#1C75BC]" />
        <EnvelopeIcon className="h-4 w-4 text-[#1C75BC]" />
        <div className="flex items-center gap-2">
          <span className="text-xs text-[#1C75BC]">{hospitalName}</span>
          <img src={userAvatarUrl} alt="User" className="h-6 w-6 rounded-full" />
        </div>
      </div>
    </div>
  );
};

export default TopNavigationBar; 