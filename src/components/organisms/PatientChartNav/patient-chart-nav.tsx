import { FC, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import {
  UserIcon,
  ClockIcon,
  CalendarIcon,
  DocumentIcon,
  ChatBubbleLeftIcon,
  ChartBarIcon,
  ClipboardDocumentIcon,
  BoltIcon,
  BeakerIcon,
  HeartIcon,
  DocumentTextIcon,
  FlagIcon,
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
} from "@/components/atoms/Tooltip/tooltip"

interface NavSection {
  title: string;
  items: {
    id: string;
    title: string;
    icon: JSX.Element;
    count?: number;
  }[];
}

interface PatientChartNavProps {
  position: 'left' | 'right'
  onPositionChange: (position: 'left' | 'right') => void
  className?: string
}

const navSections: NavSection[] = [
  {
    title: 'Personal',
    items: [
      { id: 'demographics', title: 'Demographics', icon: <UserIcon className="w-4 h-4" /> },
      { id: 'encounters', title: 'Encounters', icon: <ClockIcon className="w-4 h-4" />, count: 12 },
      { id: 'appointments', title: 'Appointments', icon: <CalendarIcon className="w-4 h-4" /> },
      { id: 'document-vault', title: 'Document Vault', icon: <DocumentIcon className="w-4 h-4" /> },
      { id: 'messages', title: 'Messages', icon: <ChatBubbleLeftIcon className="w-4 h-4" /> }
    ]
  },
  {
    title: 'Journey',
    items: [
      { id: 'timeline', title: 'Timeline', icon: <ChartBarIcon className="w-4 h-4" /> }
    ]
  },
  {
    title: 'Clinical',
    items: [
      { id: 'care-plan', title: 'Care Plan', icon: <ClipboardDocumentIcon className="w-4 h-4" /> },
      { id: 'clinical-info', title: 'Clinical Info', icon: <BoltIcon className="w-4 h-4" /> },
      { id: 'medications', title: 'Medications', icon: <ClipboardDocumentIcon className="w-4 h-4" /> },
      { id: 'lab-reports', title: 'Lab Reports', icon: <BeakerIcon className="w-4 h-4" /> },
      { id: 'vitals', title: 'Vitals', icon: <HeartIcon className="w-4 h-4" /> }
    ]
  },
  {
    title: 'Insurance',
    items: [
      { id: 'insurances', title: 'Insurances', icon: <DocumentTextIcon className="w-4 h-4" /> }
    ]
  },
  {
    title: 'Billing',
    items: [
      { id: 'billing-info', title: 'Billing Information', icon: <DocumentTextIcon className="w-4 h-4" /> }
    ]
  },
  {
    title: 'Others',
    items: [
      { id: 'statements', title: 'Statements', icon: <FlagIcon className="w-4 h-4" /> },
      { id: 'reports', title: 'Reports', icon: <DocumentTextIcon className="w-4 h-4" /> },
      { id: 'notes', title: 'Notes', icon: <DocumentTextIcon className="w-4 h-4" /> },
      { id: 'settings', title: 'Settings', icon: <Cog6ToothIcon className="w-4 h-4" /> }
    ]
  }
];

export const PatientChartNav: FC<PatientChartNavProps> = ({
  position,
  onPositionChange,
  className
}) => {
  const [isCollapsed, setIsCollapsed] = useState(true);
  const location = useLocation();
  const patientId = location.pathname.split('/').pop();

  const toggleCollapse = () => setIsCollapsed(!isCollapsed);
  const togglePosition = () => onPositionChange?.(position === 'left' ? 'right' : 'left');

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
          {!isCollapsed && <h2 className="text-xs font-semibold text-primary pl-2">Overview</h2>}
          <div className="flex items-center gap-0.5">
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
          {navSections.map((section) => (
            <div key={section.title} className="mb-3">
              {!isCollapsed && (
                <h3 className="px-2 mb-1 text-[11px] font-medium text-gray-400 uppercase tracking-wider">
                  {section.title}
                </h3>
              )}
              <div className="space-y-0.5">
                {section.items.map((item) => (
                  <TooltipRoot key={item.id}>
                    <TooltipTrigger asChild>
                      <Link
                        to={`/patient-care/patient-chart/${patientId}/${item.id}`}
                        className={cn(
                          'flex items-center gap-2 px-2 py-1.5 text-xs font-medium rounded-md transition-all relative group',
                          'hover:bg-gray-50 hover:text-gray-900 hover:pl-3',
                          location.pathname.includes(item.id) && 'bg-gray-50 text-gray-900 pl-3'
                        )}
                      >
                        <div className={cn(
                          'text-gray-500 transition-colors',
                          location.pathname.includes(item.id) && 'text-primary',
                          'group-hover:text-primary'
                        )}>
                          {item.icon}
                        </div>
                        {!isCollapsed && (
                          <>
                            <span className="flex-1 truncate text-gray-700">{item.title}</span>
                            {item.count !== undefined && (
                              <span className="px-1.5 py-0.5 rounded-full text-[10px] bg-primary/10 text-primary min-w-[20px] text-center">
                                {item.count}
                              </span>
                            )}
                          </>
                        )}
                      </Link>
                    </TooltipTrigger>
                    {isCollapsed && (
                      <TooltipContent side={position === 'left' ? 'right' : 'left'} sideOffset={10}>
                        <div className="flex items-center gap-2">
                          {item.title}
                          {item.count !== undefined && (
                            <span className="px-1.5 py-0.5 rounded-full text-[10px] bg-primary/10 text-primary min-w-[20px] text-center">
                              {item.count}
                            </span>
                          )}
                        </div>
                      </TooltipContent>
                    )}
                  </TooltipRoot>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </TooltipProvider>
  );
}; 