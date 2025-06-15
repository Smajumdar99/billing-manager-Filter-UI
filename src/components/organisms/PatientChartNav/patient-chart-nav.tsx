import { FC, useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/context/AuthContext';
import { getUserSettings, saveUserSettings } from '@/services/firestore';
import {
  UserIcon,
  ClockIcon,
  CalendarIcon,
  DocumentIcon,
  ChatBubbleLeftIcon,
  ChartBarIcon,
  ClipboardDocumentListIcon,
  BoltIcon,
  TableCellsIcon,
  BeakerIcon,
  HeartIcon,
  BanknotesIcon,
  DocumentTextIcon,
  DocumentDuplicateIcon,
  Cog6ToothIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ArrowsRightLeftIcon
} from '@heroicons/react/24/outline';
import {
  TooltipRoot,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/atoms/Tooltip/tooltip";

export interface PatientChartNavProps {
  position?: 'left' | 'right';
  onPositionChange?: (position: 'left' | 'right') => void;
  onSectionSelect?: (section: string | null) => void;
  className?: string;
}

export const PatientChartNav: FC<PatientChartNavProps> = ({
  position = 'left',
  onPositionChange,
  onSectionSelect,
  className
}) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const { user: authUser, loading: authLoading } = useAuth();

  // Load saved settings when component mounts
  useEffect(() => {
    const loadSettings = async () => {
      if (authLoading || !authUser?.uid) return;

      try {
        const settings = await getUserSettings(authUser.uid);
        if (settings?.patientChartNavSettings) {
          const { position: savedPosition, isCollapsed: savedCollapsed } = settings.patientChartNavSettings;
          onPositionChange?.(savedPosition);
          setIsCollapsed(savedCollapsed);
        }
      } catch (error) {
        console.error('Error loading patient chart nav settings:', error);
      }
    };

    loadSettings();
  }, [authUser?.uid, authLoading, onPositionChange]);

  // Save settings when position or collapsed state changes
  const saveSettings = async (newPosition: 'left' | 'right', newCollapsed: boolean) => {
    if (authLoading || !authUser?.uid) return;

    try {
      await saveUserSettings(authUser.uid, {
        patientChartNavSettings: {
          position: newPosition,
          isCollapsed: newCollapsed
        }
      });
    } catch (error) {
      console.error('Error saving patient chart nav settings:', error);
    }
  };

  const handleClick = (section: string) => {
    if (onSectionSelect) {
      onSectionSelect(section);
    }
  };

  const toggleCollapse = () => {
    const newCollapsed = !isCollapsed;
    setIsCollapsed(newCollapsed);
    saveSettings(position, newCollapsed);
  };

  const togglePosition = () => {
    const newPosition = position === 'left' ? 'right' : 'left';
    onPositionChange?.(newPosition);
    saveSettings(newPosition, isCollapsed);
  };

  return (
    <TooltipProvider delayDuration={0}>
      <div
        className={cn(
          'h-full border-r bg-white flex flex-col transition-all duration-300 shadow-sm',
          isCollapsed ? 'w-12' : 'w-52',
          position === 'right' && 'border-l border-r-0',
          className
        )}
      >
        {/* Header */}
        <div className="p-1.5 flex items-center justify-between border-b bg-white">
          {!isCollapsed && (
            <button
              onClick={() => onSectionSelect?.(null)}
              className="text-xs font-semibold text-primary pl-2 hover:text-primary/80"
            >
              Overview...
            </button>
          )}
          <div className="flex items-center gap-0.5 ml-auto">
            <TooltipRoot>
              <TooltipTrigger asChild>
                <button
                  onClick={togglePosition}
                  className="p-1 rounded-md hover:bg-gray-50 hover:text-gray-900"
                >
                  <ArrowsRightLeftIcon className="w-3.5 h-3.5" />
                </button>
              </TooltipTrigger>
              <TooltipContent side={position === 'left' ? 'right' : 'left'} sideOffset={10}>
                Move to {position === 'left' ? 'right' : 'left'}
              </TooltipContent>
            </TooltipRoot>
            <TooltipRoot>
              <TooltipTrigger asChild>
                <button
                  onClick={toggleCollapse}
                  className="p-1 rounded-md hover:bg-gray-50 hover:text-gray-900"
                >
                  {position === 'left' ? (
                    isCollapsed ? <ChevronRightIcon className="w-3.5 h-3.5" /> : <ChevronLeftIcon className="w-3.5 h-3.5" />
                  ) : (
                    isCollapsed ? <ChevronLeftIcon className="w-3.5 h-3.5" /> : <ChevronRightIcon className="w-3.5 h-3.5" />
                  )}
                </button>
              </TooltipTrigger>
              <TooltipContent side={position === 'left' ? 'right' : 'left'} sideOffset={10}>
                {isCollapsed ? 'Expand' : 'Collapse'}
              </TooltipContent>
            </TooltipRoot>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex-1 overflow-y-auto py-2 px-1">
          <div className="space-y-4">
            <div className="px-2">
              <h3 className={cn(
                "text-xs font-semibold text-gray-500 uppercase tracking-wider",
                isCollapsed && "sr-only"
              )}>
                PERSONAL
              </h3>
              <div className="mt-2 space-y-1">
                <TooltipRoot>
                  <TooltipTrigger asChild>
                    <button
                      onClick={() => handleClick('Demographics')}
                      className="flex items-center w-full px-2 py-1.5 text-sm text-gray-600 rounded-md hover:bg-gray-100 hover:text-gray-900"
                    >
                      <UserIcon className="w-4 h-4 shrink-0" />
                      {!isCollapsed && <span className="ml-3">Demographics</span>}
                    </button>
                  </TooltipTrigger>
                  {isCollapsed && (
                    <TooltipContent side={position === 'left' ? 'right' : 'left'} sideOffset={10}>
                      Demographics
                    </TooltipContent>
                  )}
                </TooltipRoot>

                <TooltipRoot>
                  <TooltipTrigger asChild>
                    <button
                      onClick={() => handleClick('Encounters')}
                      className="flex items-center w-full px-2 py-1.5 text-sm text-gray-600 rounded-md hover:bg-gray-100 hover:text-gray-900 group"
                    >
                      <ClockIcon className="w-4 h-4 shrink-0" />
                      {!isCollapsed ? (
                        <div className="flex items-center justify-between flex-1 ml-3">
                          <span>Encounters</span>
                          <span className="bg-primary/10 text-primary text-xs px-2 py-0.5 rounded-full">12</span>
                        </div>
                      ) : (
                        <span className="ml-auto bg-primary/10 text-primary text-xs px-2 py-0.5 rounded-full">12</span>
                      )}
                    </button>
                  </TooltipTrigger>
                  {isCollapsed && (
                    <TooltipContent side={position === 'left' ? 'right' : 'left'} sideOffset={10}>
                      <div className="flex items-center gap-2">
                        Encounters
                        <span className="bg-primary/10 text-primary text-xs px-2 py-0.5 rounded-full">12</span>
                      </div>
                    </TooltipContent>
                  )}
                </TooltipRoot>

                <TooltipRoot>
                  <TooltipTrigger asChild>
                    <button
                      onClick={() => handleClick('Appointments')}
                      className="flex items-center w-full px-2 py-1.5 text-sm text-gray-600 rounded-md hover:bg-gray-100 hover:text-gray-900"
                    >
                      <CalendarIcon className="w-4 h-4 shrink-0" />
                      {!isCollapsed && <span className="ml-3">Appointments</span>}
                    </button>
                  </TooltipTrigger>
                  {isCollapsed && (
                    <TooltipContent side={position === 'left' ? 'right' : 'left'} sideOffset={10}>
                      Appointments
                    </TooltipContent>
                  )}
                </TooltipRoot>

                <TooltipRoot>
                  <TooltipTrigger asChild>
                    <button
                      onClick={() => handleClick('Document Vault')}
                      className="flex items-center w-full px-2 py-1.5 text-sm text-gray-600 rounded-md hover:bg-gray-100 hover:text-gray-900"
                    >
                      <DocumentIcon className="w-4 h-4 shrink-0" />
                      {!isCollapsed && <span className="ml-3">Document Vault</span>}
                    </button>
                  </TooltipTrigger>
                  {isCollapsed && (
                    <TooltipContent side={position === 'left' ? 'right' : 'left'} sideOffset={10}>
                      Document Vault
                    </TooltipContent>
                  )}
                </TooltipRoot>

                <TooltipRoot>
                  <TooltipTrigger asChild>
                    <button
                      onClick={() => handleClick('Messages')}
                      className="flex items-center w-full px-2 py-1.5 text-sm text-gray-600 rounded-md hover:bg-gray-100 hover:text-gray-900"
                    >
                      <ChatBubbleLeftIcon className="w-4 h-4 shrink-0" />
                      {!isCollapsed && <span className="ml-3">Messages</span>}
                    </button>
                  </TooltipTrigger>
                  {isCollapsed && (
                    <TooltipContent side={position === 'left' ? 'right' : 'left'} sideOffset={10}>
                      Messages
                    </TooltipContent>
                  )}
                </TooltipRoot>
              </div>
            </div>

            <div className="px-2">
              <h3 className={cn(
                "text-xs font-semibold text-gray-500 uppercase tracking-wider",
                isCollapsed && "sr-only"
              )}>
                JOURNEY
              </h3>
              <div className="mt-2 space-y-1">
                <TooltipRoot>
                  <TooltipTrigger asChild>
                    <button
                      onClick={() => handleClick('Timeline')}
                      className="flex items-center w-full px-2 py-1.5 text-sm text-gray-600 rounded-md hover:bg-gray-100 hover:text-gray-900"
                    >
                      <ChartBarIcon className="w-4 h-4 shrink-0" />
                      {!isCollapsed && <span className="ml-3">Timeline</span>}
                    </button>
                  </TooltipTrigger>
                  {isCollapsed && (
                    <TooltipContent side={position === 'left' ? 'right' : 'left'} sideOffset={10}>
                      Timeline
                    </TooltipContent>
                  )}
                </TooltipRoot>
              </div>
            </div>

            <div className="px-2">
              <h3 className={cn(
                "text-xs font-semibold text-gray-500 uppercase tracking-wider",
                isCollapsed && "sr-only"
              )}>
                CLINICAL
              </h3>
              <div className="mt-2 space-y-1">
                <TooltipRoot>
                  <TooltipTrigger asChild>
                    <button
                      onClick={() => handleClick('Care Plan')}
                      className="flex items-center w-full px-2 py-1.5 text-sm text-gray-600 rounded-md hover:bg-gray-100 hover:text-gray-900"
                    >
                      <ClipboardDocumentListIcon className="w-4 h-4 shrink-0" />
                      {!isCollapsed && <span className="ml-3">Care Plan</span>}
                    </button>
                  </TooltipTrigger>
                  {isCollapsed && (
                    <TooltipContent side={position === 'left' ? 'right' : 'left'} sideOffset={10}>
                      Care Plan
                    </TooltipContent>
                  )}
                </TooltipRoot>

                <TooltipRoot>
                  <TooltipTrigger asChild>
                    <button
                      onClick={() => handleClick('Clinical Info')}
                      className="flex items-center w-full px-2 py-1.5 text-sm text-gray-600 rounded-md hover:bg-gray-100 hover:text-gray-900"
                    >
                      <BoltIcon className="w-4 h-4 shrink-0" />
                      {!isCollapsed && <span className="ml-3">Clinical Info</span>}
                    </button>
                  </TooltipTrigger>
                  {isCollapsed && (
                    <TooltipContent side={position === 'left' ? 'right' : 'left'} sideOffset={10}>
                      Clinical Info
                    </TooltipContent>
                  )}
                </TooltipRoot>

                <TooltipRoot>
                  <TooltipTrigger asChild>
                    <button
                      onClick={() => handleClick('Medications')}
                      className="flex items-center w-full px-2 py-1.5 text-sm text-gray-600 rounded-md hover:bg-gray-100 hover:text-gray-900"
                    >
                      <TableCellsIcon className="w-4 h-4 shrink-0" />
                      {!isCollapsed && <span className="ml-3">Medications</span>}
                    </button>
                  </TooltipTrigger>
                  {isCollapsed && (
                    <TooltipContent side={position === 'left' ? 'right' : 'left'} sideOffset={10}>
                      Medications
                    </TooltipContent>
                  )}
                </TooltipRoot>

                <TooltipRoot>
                  <TooltipTrigger asChild>
                    <button
                      onClick={() => handleClick('Lab Reports')}
                      className="flex items-center w-full px-2 py-1.5 text-sm text-gray-600 rounded-md hover:bg-gray-100 hover:text-gray-900"
                    >
                      <BeakerIcon className="w-4 h-4 shrink-0" />
                      {!isCollapsed && <span className="ml-3">Lab Reports</span>}
                    </button>
                  </TooltipTrigger>
                  {isCollapsed && (
                    <TooltipContent side={position === 'left' ? 'right' : 'left'} sideOffset={10}>
                      Lab Reports
                    </TooltipContent>
                  )}
                </TooltipRoot>

                <TooltipRoot>
                  <TooltipTrigger asChild>
                    <button
                      onClick={() => handleClick('Vitals')}
                      className="flex items-center w-full px-2 py-1.5 text-sm text-gray-600 rounded-md hover:bg-gray-100 hover:text-gray-900"
                    >
                      <HeartIcon className="w-4 h-4 shrink-0" />
                      {!isCollapsed && <span className="ml-3">Vitals</span>}
                    </button>
                  </TooltipTrigger>
                  {isCollapsed && (
                    <TooltipContent side={position === 'left' ? 'right' : 'left'} sideOffset={10}>
                      Vitals
                    </TooltipContent>
                  )}
                </TooltipRoot>
              </div>
            </div>

            <div className="px-2">
              <h3 className={cn(
                "text-xs font-semibold text-gray-500 uppercase tracking-wider",
                isCollapsed && "sr-only"
              )}>
                INSURANCE
              </h3>
              <div className="mt-2 space-y-1">
                <TooltipRoot>
                  <TooltipTrigger asChild>
                    <button
                      onClick={() => handleClick('Insurances')}
                      className="flex items-center w-full px-2 py-1.5 text-sm text-gray-600 rounded-md hover:bg-gray-100 hover:text-gray-900"
                    >
                      <BanknotesIcon className="w-4 h-4 shrink-0" />
                      {!isCollapsed && <span className="ml-3">Insurances</span>}
                    </button>
                  </TooltipTrigger>
                  {isCollapsed && (
                    <TooltipContent side={position === 'left' ? 'right' : 'left'} sideOffset={10}>
                      Insurances
                    </TooltipContent>
                  )}
                </TooltipRoot>
              </div>
            </div>

            <div className="px-2">
              <h3 className={cn(
                "text-xs font-semibold text-gray-500 uppercase tracking-wider",
                isCollapsed && "sr-only"
              )}>
                BILLING
              </h3>
              <div className="mt-2 space-y-1">
                <TooltipRoot>
                  <TooltipTrigger asChild>
                    <button
                      onClick={() => handleClick('Billing Information')}
                      className="flex items-center w-full px-2 py-1.5 text-sm text-gray-600 rounded-md hover:bg-gray-100 hover:text-gray-900"
                    >
                      <DocumentTextIcon className="w-4 h-4 shrink-0" />
                      {!isCollapsed && <span className="ml-3">Billing Information</span>}
                    </button>
                  </TooltipTrigger>
                  {isCollapsed && (
                    <TooltipContent side={position === 'left' ? 'right' : 'left'} sideOffset={10}>
                      Billing Information
                    </TooltipContent>
                  )}
                </TooltipRoot>

                <TooltipRoot>
                  <TooltipTrigger asChild>
                    <button
                      onClick={() => handleClick('Disclosures')}
                      className="flex items-center w-full px-2 py-1.5 text-sm text-gray-600 rounded-md hover:bg-gray-100 hover:text-gray-900"
                    >
                      <DocumentDuplicateIcon className="w-4 h-4 shrink-0" />
                      {!isCollapsed && <span className="ml-3">Disclosures</span>}
                    </button>
                  </TooltipTrigger>
                  {isCollapsed && (
                    <TooltipContent side={position === 'left' ? 'right' : 'left'} sideOffset={10}>
                      Disclosures
                    </TooltipContent>
                  )}
                </TooltipRoot>

                <TooltipRoot>
                  <TooltipTrigger asChild>
                    <button
                      onClick={() => handleClick('Amendments')}
                      className="flex items-center w-full px-2 py-1.5 text-sm text-gray-600 rounded-md hover:bg-gray-100 hover:text-gray-900"
                    >
                      <DocumentDuplicateIcon className="w-4 h-4 shrink-0" />
                      {!isCollapsed && <span className="ml-3">Amendments</span>}
                    </button>
                  </TooltipTrigger>
                  {isCollapsed && (
                    <TooltipContent side={position === 'left' ? 'right' : 'left'} sideOffset={10}>
                      Amendments
                    </TooltipContent>
                  )}
                </TooltipRoot>
              </div>
            </div>

            <div className="px-2">
              <h3 className={cn(
                "text-xs font-semibold text-gray-500 uppercase tracking-wider",
                isCollapsed && "sr-only"
              )}>
                OTHERS
              </h3>
              <div className="mt-2 space-y-1">
                <TooltipRoot>
                  <TooltipTrigger asChild>
                    <button
                      onClick={() => handleClick('Statements')}
                      className="flex items-center w-full px-2 py-1.5 text-sm text-gray-600 rounded-md hover:bg-gray-100 hover:text-gray-900"
                    >
                      <DocumentDuplicateIcon className="w-4 h-4 shrink-0" />
                      {!isCollapsed && <span className="ml-3">Statements</span>}
                    </button>
                  </TooltipTrigger>
                  {isCollapsed && (
                    <TooltipContent side={position === 'left' ? 'right' : 'left'} sideOffset={10}>
                      Statements
                    </TooltipContent>
                  )}
                </TooltipRoot>

                <TooltipRoot>
                  <TooltipTrigger asChild>
                    <button
                      onClick={() => handleClick('Reports')}
                      className="flex items-center w-full px-2 py-1.5 text-sm text-gray-600 rounded-md hover:bg-gray-100 hover:text-gray-900"
                    >
                      <DocumentDuplicateIcon className="w-4 h-4 shrink-0" />
                      {!isCollapsed && <span className="ml-3">Reports</span>}
                    </button>
                  </TooltipTrigger>
                  {isCollapsed && (
                    <TooltipContent side={position === 'left' ? 'right' : 'left'} sideOffset={10}>
                      Reports
                    </TooltipContent>
                  )}
                </TooltipRoot>

                <TooltipRoot>
                  <TooltipTrigger asChild>
                    <button
                      onClick={() => handleClick('Notes')}
                      className="flex items-center w-full px-2 py-1.5 text-sm text-gray-600 rounded-md hover:bg-gray-100 hover:text-gray-900"
                    >
                      <DocumentDuplicateIcon className="w-4 h-4 shrink-0" />
                      {!isCollapsed && <span className="ml-3">Notes</span>}
                    </button>
                  </TooltipTrigger>
                  {isCollapsed && (
                    <TooltipContent side={position === 'left' ? 'right' : 'left'} sideOffset={10}>
                      Notes
                    </TooltipContent>
                  )}
                </TooltipRoot>

                <TooltipRoot>
                  <TooltipTrigger asChild>
                    <button
                      onClick={() => handleClick('Settings')}
                      className="flex items-center w-full px-2 py-1.5 text-sm text-gray-600 rounded-md hover:bg-gray-100 hover:text-gray-900"
                    >
                      <Cog6ToothIcon className="w-4 h-4 shrink-0" />
                      {!isCollapsed && <span className="ml-3">Settings</span>}
                    </button>
                  </TooltipTrigger>
                  {isCollapsed && (
                    <TooltipContent side={position === 'left' ? 'right' : 'left'} sideOffset={10}>
                      Settings
                    </TooltipContent>
                  )}
                </TooltipRoot>
              </div>
            </div>
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
}; 