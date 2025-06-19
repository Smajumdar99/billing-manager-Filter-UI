import { FC, useState, useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/atoms/Button';
import {
  ChevronDownIcon,
  ChevronUpIcon,
  XMarkIcon,
  ClockIcon,
  LanguageIcon,
  PhoneIcon,
  PlusIcon,
  Bars2Icon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from '@heroicons/react/24/outline';
import { Avatar } from '@/components/atoms/Avatar';
import { FlickeringGrid } from '@/components/ui/flickering-grid';

// Helper function to generate nickname
const generateNickname = (firstName: string): string => {
  // Common nickname mappings
  const nicknameMap: { [key: string]: string } = {
    'William': 'Bill',
    'Robert': 'Bob',
    'Elizabeth': 'Liz',
    'Richard': 'Rick',
    'Christopher': 'Chris',
    'Katherine': 'Kate',
    'Jennifer': 'Jen',
    'Margaret': 'Maggie',
    'Joseph': 'Joe',
    'Nicholas': 'Nick',
    'Benjamin': 'Ben',
    'Alexander': 'Alex',
    'Theodore': 'Ted',
    'Matthew': 'Matt',
    'Anthony': 'Tony',
    'Daniel': 'Dan',
    'Timothy': 'Tim',
    'Thomas': 'Tom',
    'James': 'Jim',
    'John': 'Johnny',
    'Sarah': 'Sally',
    'Michael': 'Mike',
    'Emily': 'Em',
    'David': 'Dave',
    'Jonathan': 'Jon',
    'Samuel': 'Sam',
    'Joshua': 'Josh',
    'Andrew': 'Andy',
    'Charles': 'Chuck',
    'Patricia': 'Pat',
    'Jessica': 'Jess',
    'Michelle': 'Mich',
    'Rebecca': 'Becky',
    'Rachel': 'Rach',
    'Steven': 'Steve'
  };

  // Convert to title case for consistent matching
  const normalizedName = firstName.charAt(0).toUpperCase() + firstName.slice(1).toLowerCase();

  // Check if there's a common nickname mapping
  if (nicknameMap[normalizedName]) {
    return nicknameMap[normalizedName];
  }

  // If no mapping exists, create a nickname based on name length and ending
  if (firstName.length > 4) {
    // For names ending in 'y' or 'ie', just use the first part
    if (firstName.toLowerCase().endsWith('y') || firstName.toLowerCase().endsWith('ie')) {
      return firstName.slice(0, firstName.length > 6 ? 4 : 3);
    }
    // For other names, add 'y' at the end
    return firstName.slice(0, firstName.length > 6 ? 4 : 3) + 'y';
  }

  return firstName;
};

// Helper function to get safety alert icon based on severity
const getSafetyAlertIcon = (severity: 'high' | 'medium' | 'low'): string => {
  switch (severity) {
    case 'high':
      return '⚠️';
    case 'medium':
      return '⚡';
    case 'low':
      return 'ℹ️';
  }
};

// Helper function to get safety alert
const getSafetyAlert = (patientId: string, firstName: string): { message: string; severity: 'high' | 'medium' | 'low'; icon?: string } => {
  // For debugging - remove in production
  console.log('Patient ID:', patientId, 'Name:', firstName);

  // Mapping of patient-specific safety alerts with clinically appropriate messages
  const safetyAlerts: { [key: string]: { message: string; severity: 'high' | 'medium' | 'low'; icon?: string } } = {
    // Use actual patient IDs
    '1': {
      message: 'Sensitivity to loud noises - maintain calm environment',
      severity: 'medium',
      icon: '🔊'
    },
    '2': {
      message: 'Prefers structured routines - notify of any schedule changes',
      severity: 'low',
      icon: '📅'
    },
    '3': {
      message: 'Risk of emotional escalation - ensure clear communication',
      severity: 'high',
      icon: '⚠️'
    },
    '4': {
      message: 'History of anxiety in new situations - provide reassurance',
      severity: 'medium',
      icon: '💭'
    },
    '5': {
      message: 'Requires extended processing time - speak slowly and clearly',
      severity: 'medium',
      icon: '⏱️'
    },
    '6': {
      message: 'Difficulty with change - maintain consistent approach',
      severity: 'medium',
      icon: '🔄'
    },
    '7': {
      message: 'Sensory sensitivity - minimize environmental stimuli',
      severity: 'high',
      icon: '👀'
    },
    '8': {
      message: 'Communication challenges - use visual aids when possible',
      severity: 'medium',
      icon: '💬'
    },
    '9': {
      message: 'Trauma-informed care required - avoid sudden movements',
      severity: 'high',
      icon: '🤝'
    },
    '10': {
      message: 'Prefers female staff members - ensure appropriate staffing',
      severity: 'medium',
      icon: '👥'
    }
  };

  // Add name-based fallback alerts for common conditions
  const nameBasedAlerts: { [key: string]: { message: string; severity: 'high' | 'medium' | 'low'; icon?: string } } = {
    'John': {
      message: 'May need additional time to process information',
      severity: 'medium',
      icon: '⏱️'
    },
    'Sarah': {
      message: 'Prefers quiet, structured environment',
      severity: 'medium',
      icon: '🔊'
    },
    'Michael': {
      message: 'Anxiety in crowded spaces - maintain personal space',
      severity: 'medium',
      icon: '👥'
    },
    'Emily': {
      message: 'Sensitive to sudden changes - provide advance notice',
      severity: 'medium',
      icon: '📅'
    },
    'David': {
      message: 'Communication preferences - direct and clear instructions',
      severity: 'low',
      icon: '💬'
    }
  };

  // Try to get alert by ID first, then by name, then default
  const alert = safetyAlerts[patientId] || nameBasedAlerts[firstName] || {
    message: 'Standard behavioral health precautions apply',
    severity: 'low' as const,
    icon: 'ℹ️'
  };

  return alert;
};

interface PatientSnapshotProps {
  patient: {
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
  onClose?: () => void;
  onNewEncounter?: () => void;
  onViewChart?: () => void;
  className?: string;
  variant?: 'header' | 'floating';
}

// Add new interfaces for carousel data
interface CarouselItem {
  id: number;
  content: JSX.Element;
}

export const PatientSnapshot: FC<PatientSnapshotProps> = ({
  patient,
  onClose,
  onNewEncounter,
  onViewChart,
  className,
  variant = 'header'
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isFloating, setIsFloating] = useState(variant === 'floating');
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const snapshotRef = useRef<HTMLDivElement>(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  
  const handlePrevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + carouselItems.length) % carouselItems.length);
  };

  const handleNextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % carouselItems.length);
  };

  const carouselItems: CarouselItem[] = [
    {
      id: 1,
      content: (
        <div className="flex flex-col justify-center h-full">
          <div className="flex items-center gap-1">
            <span className="text-[11px] text-gray-500 min-w-[60px]">Insurance:</span>
            <span className="text-[11px] text-gray-700">Pacific Source Community...</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="text-[11px] text-gray-500 min-w-[60px]">Admitted:</span>
            <span className="text-[11px] text-gray-700">Outpatient</span>
          </div>
        </div>
      )
    },
    {
      id: 2,
      content: (
        <div className="flex flex-col justify-center h-full">
          <div className="flex items-center gap-1">
            <span className="text-[11px] text-gray-500 min-w-[60px]">Type:</span>
            <span className="text-[11px] text-gray-700">Medicaid</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="text-[11px] text-gray-500 min-w-[60px]">PCP:</span>
            <span className="text-[11px] text-gray-700">{patient.primaryCareProvider || 'Not Assigned'}</span>
          </div>
        </div>
      )
    },
    {
      id: 3,
      content: (
        <div className="flex flex-col justify-center h-full">
          <div className="flex items-center gap-1">
            <span className="text-[11px] text-gray-500 min-w-[60px]">Language:</span>
            <span className="text-[11px] text-gray-700">English</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="text-[11px] text-gray-500 min-w-[60px]">School:</span>
            <span className="text-[11px] text-gray-700">Academy for College and Career Exploration</span>
          </div>
        </div>
      )
    }
  ];

  // Generate nickname if not provided
  const nickname = patient.nickname || generateNickname(patient.name.split(' ')[0]);

  // Get safety alert for current patient
  const safetyAlert = getSafetyAlert(patient.id, patient.name.split(' ')[0]);

  // Save position to localStorage
  useEffect(() => {
    if (isFloating) {
      const savedPosition = localStorage.getItem('patientSnapshotPosition');
      if (savedPosition) {
        setPosition(JSON.parse(savedPosition));
      }
    }
  }, [isFloating]);

  useEffect(() => {
    if (isFloating) {
      localStorage.setItem('patientSnapshotPosition', JSON.stringify(position));
    }
  }, [position, isFloating]);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!isFloating) return;
    e.preventDefault();
    setIsDragging(true);
    setDragStart({
      x: e.clientX - position.x,
      y: e.clientY - position.y
    });
  };

  useEffect(() => {
    if (!isDragging) return;

    const handleMouseMove = (e: MouseEvent) => {
      const newPosition = {
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y
      };
      setPosition(newPosition);
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, dragStart]);

  const handleExpand = () => {
    if (!isFloating) {
      setIsFloating(true);
      setPosition({ x: 0, y: 0 });
    }
    setIsExpanded(true);
  };

  const handleCollapse = () => {
    setIsFloating(false);
    setIsExpanded(false);
  };

  const headerContent = (
    <div className="relative flex items-center h-14 bg-blue-50/10 px-3 lg:px-4 w-full pt-0 rounded-lg border border-blue-300 shadow-lg overflow-hidden">
      <FlickeringGrid
        className="absolute inset-0 -z-10"
        squareSize={6}
        gridGap={2}
        color="#4B5563"
        maxOpacity={0.09}
        flickerChance={9}
      />
      {/* Enhanced Left Section */}
      <div className="flex items-start gap-2 lg:gap-3 min-w-[200px] lg:min-w-[320px] py-2">
        {/* Avatar with status indicator */}
        <div className="relative">
          <Avatar
            src={patient.avatar}
            alt={patient.name}
            className="w-8 h-8 lg:w-10 lg:h-10 ring-2 ring-white shadow-sm"
            fallback={patient.name.charAt(0)}
          />
          <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 lg:w-3.5 lg:h-3.5 rounded-full bg-green-400 ring-2 ring-white" />
        </div>

        {/* Patient Info */}
        <div className="flex flex-col">
          {/* Name and Pronouns */}
          <div className="flex items-center gap-2 mb-0.5">
            <div className="flex items-center gap-1">
              <span className="text-gray-900 font-semibold text-xs lg:text-sm">
                {patient.name.split(' ')[0]}
              </span>
              <span className="text-gray-500 text-[10px] lg:text-xs font-medium">
                {patient.name.split(' ')[1]}
              </span>
              {nickname && nickname !== patient.name.split(' ')[0] && (
                <span className="text-blue-600 text-[10px] lg:text-xs font-medium ml-1">
                  "{nickname}"
                </span>
              )}
            </div>
            <span className="px-1 lg:px-1.5 py-0.5 rounded-full bg-gray-100 text-gray-600 text-[9px] lg:text-[10px] font-medium">
              {patient.gender === 'Male' ? 'Him' : 'Her'}
            </span>
          </div>

          {/* Safety Alert with enhanced styling - Header View */}
          <div className={cn(
            "flex items-center gap-1.5 px-2 py-1 rounded-md max-w-fit transition-colors shadow-sm",
            {
              'bg-red-50/90 text-red-700 border border-red-200 shadow-red-100': safetyAlert.severity === 'high',
              'bg-orange-50/90 text-orange-700 border border-orange-200 shadow-orange-100': safetyAlert.severity === 'medium',
              'bg-blue-50/90 text-blue-700 border border-blue-200 shadow-blue-100': safetyAlert.severity === 'low'
            }
          )}>
            <div className={cn(
              "w-1 h-1 rounded-full shrink-0",
              {
                'bg-red-500 animate-pulse': safetyAlert.severity === 'high',
                'bg-orange-500': safetyAlert.severity === 'medium',
                'bg-blue-500': safetyAlert.severity === 'low'
              }
            )} />
            <span className="text-[11px] font-medium leading-tight">
              {safetyAlert.message}
            </span>
          </div>
        </div>
      </div>

      {/* Middle Section - Now Empty */}
      <div className="flex items-center ml-4">
      </div>

      {/* Right Section */}
      <div className="ml-auto flex items-center gap-6">
        <div className="relative w-64 flex items-center">
          <button
            onClick={handlePrevSlide}
            className="absolute left-0 z-10 p-0 text-gray-400 hover:text-gray-600 transition-colors"
            aria-label="Previous slide"
          >
            <ChevronLeftIcon className="w-4 h-4" />
          </button>
          
          <div className="overflow-hidden mx-5">
            <div 
              className="flex transition-transform duration-300 ease-in-out"
              style={{ transform: `translateX(-${currentSlide * 100}%)` }}
            >
              {carouselItems.map((item) => (
                <div key={item.id} className="w-full flex-shrink-0">
                  {item.content}
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={handleNextSlide}
            className="absolute right-0 z-10 p-1 text-gray-400 hover:text-gray-600 transition-colors"
            aria-label="Next slide"
          >
            <ChevronRightIcon className="w-4 h-4" />
          </button>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleExpand}
            className="flex items-center gap-1.5 text-gray-700 hover:text-gray-900 bg-white rounded border px-2.5 py-1"
          >
            <ClockIcon className="w-3.5 h-3.5" />
            <span className="text-xs">Encounter History</span>
          </button>
          <Button
            variant="default"
            size="sm"
            onClick={onNewEncounter}
            className="px-3 py-1.5"
          >
            New Encounter
          </Button>
          <button 
            onClick={handleExpand}
            className="text-gray-400 hover:text-gray-600"
          >
            <ChevronDownIcon className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );

  if (!isFloating) {
    return headerContent;
  }

  return (
    <div
      ref={snapshotRef}
      style={{
        transform: `translate(${position.x}px, ${position.y}px)`
      }}
      className={cn(
        'relative fixed top-16 right-4 z-50 rounded-lg shadow-lg border border-gray-100',
        'bg-white/95',
        'hover:shadow-xl',
        isExpanded ? 'w-[800px]' : 'w-[400px]',
        isDragging && 'opacity-90 scale-[0.98]',
        className
      )}
    >
      <FlickeringGrid
        className="absolute inset-0 -z-10"
        squareSize={4}
        gridGap={6}
        color="#4B5563"
        maxOpacity={0.08}
        flickerChance={0.2}
      />
      {/* Header with drag handle */}
      <div 
        className="p-3 border-b flex items-center justify-between rounded-t-lg bg-white/50 backdrop-blur-sm"
      >
        <div className="flex items-center gap-3">
          <div 
            className="flex flex-col justify-center w-6 h-10 rounded hover:bg-gray-100 cursor-grab transition-colors"
            onMouseDown={handleMouseDown}
          >
            <div className="flex justify-center space-x-1">
              <div className="w-1 h-1 rounded-full bg-gray-400"></div>
              <div className="w-1 h-1 rounded-full bg-gray-400"></div>
            </div>
            <div className="flex justify-center space-x-1 my-1">
              <div className="w-1 h-1 rounded-full bg-gray-400"></div>
              <div className="w-1 h-1 rounded-full bg-gray-400"></div>
            </div>
            <div className="flex justify-center space-x-1">
              <div className="w-1 h-1 rounded-full bg-gray-400"></div>
              <div className="w-1 h-1 rounded-full bg-gray-400"></div>
            </div>
          </div>
          {/* Enhanced Avatar with status */}
          <div className="relative">
            <Avatar
              src={patient.avatar}
              alt={patient.name}
              className="w-12 h-12 ring-2 ring-white shadow-sm"
              fallback={patient.name.charAt(0)}
            />
            <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full bg-green-400 ring-2 ring-white" />
          </div>
          {/* Enhanced Patient Info */}
          <div>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1">
                <span className="text-gray-900 font-semibold text-base">
                  {patient.name.split(' ')[0]}
                </span>
                <span className="text-gray-500 text-sm font-medium">
                  {patient.name.split(' ')[1]}
                </span>
                {nickname && nickname !== patient.name.split(' ')[0] && (
                  <span className="text-blue-600 text-sm font-medium ml-1">
                    "{nickname}"
                  </span>
                )}
              </div>
              <span className="px-2 py-0.5 rounded-full bg-gray-100 text-gray-600 text-xs font-medium">
                {patient.gender === 'Male' ? 'Him' : 'Her'}
              </span>
            </div>
            {/* Safety Alert - Expanded View */}
            <div className={cn(
              "flex items-center gap-2 px-2.5 py-1.5 rounded-lg max-w-fit mt-2 transition-colors shadow-sm",
              {
                'bg-red-50/90 text-red-700 border border-red-200 shadow-red-100': safetyAlert.severity === 'high',
                'bg-orange-50/90 text-orange-700 border border-orange-200 shadow-orange-100': safetyAlert.severity === 'medium',
                'bg-blue-50/90 text-blue-700 border border-blue-200 shadow-blue-100': safetyAlert.severity === 'low'
              }
            )}>
              <div className={cn(
                "w-1.5 h-1.5 rounded-full shrink-0",
                {
                  'bg-red-500 animate-pulse': safetyAlert.severity === 'high',
                  'bg-orange-500': safetyAlert.severity === 'medium',
                  'bg-blue-500': safetyAlert.severity === 'low'
                }
              )} />
              <div className="flex flex-col">
                <span className={cn(
                  "text-[10px] font-semibold uppercase tracking-wider",
                  {
                    'text-red-600': safetyAlert.severity === 'high',
                    'text-orange-600': safetyAlert.severity === 'medium',
                    'text-blue-600': safetyAlert.severity === 'low'
                  }
                )}>
                  {safetyAlert.severity} Priority
                </span>
                <span className="text-xs font-medium leading-tight mt-0.5">
                  {safetyAlert.message}
                </span>
              </div>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={handleCollapse}
            className="p-1.5 hover:bg-gray-100 rounded-md transition-colors"
            title="Collapse to header"
          >
            <ChevronUpIcon className="w-5 h-5" />
          </button>
          <button
            onClick={() => {
              setIsFloating(false);
              onClose?.();
            }}
            className="p-1.5 hover:bg-gray-100 rounded-md transition-colors"
          >
            <XMarkIcon className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 space-y-4">
        {/* Information Grid - Replacing Carousel */}
        <div className="bg-white p-4 rounded-lg shadow-sm">
          <div className="grid grid-cols-2 gap-x-8 gap-y-3">
            {/* Insurance Info */}
            <div className="flex flex-col gap-1">
              <span className="text-xs font-medium text-gray-500">Insurance</span>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-700">{patient.insuranceProvider || 'Pacific Source Community...'}</span>
              </div>
            </div>

            {/* Admission Status */}
            <div className="flex flex-col gap-1">
              <span className="text-xs font-medium text-gray-500">Admitted</span>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-700">{patient.admittedTo || 'Outpatient'}</span>
              </div>
            </div>

            {/* Primary Care Provider */}
            <div className="flex flex-col gap-1">
              <span className="text-xs font-medium text-gray-500">Primary Care Provider</span>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-700">{patient.primaryCareProvider || 'Not Assigned'}</span>
              </div>
            </div>

            {/* Language */}
            <div className="flex flex-col gap-1">
              <span className="text-xs font-medium text-gray-500">Language</span>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-700">{patient.language || 'English'}</span>
              </div>
            </div>

            {/* Contact Info */}
            <div className="flex flex-col gap-1">
              <span className="text-xs font-medium text-gray-500">Contact</span>
              <div className="flex items-center gap-2">
                <PhoneIcon className="w-4 h-4 text-gray-400" />
                <span className="text-sm text-gray-700">{patient.mobile || 'No phone number'}</span>
              </div>
            </div>

            {/* Program Auditor */}
            <div className="flex flex-col gap-1">
              <span className="text-xs font-medium text-gray-500">Program Auditor</span>
              <div className="flex items-center gap-2">
                <ClockIcon className="w-4 h-4 text-gray-400" />
                <span className="text-sm text-gray-700">{patient.programAuditor || 'Not assigned'}</span>
                {patient.auditorTimestamp && (
                  <span className="text-xs text-gray-500">{patient.auditorTimestamp}</span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="p-4 border-t bg-gray-50/80 rounded-b-lg flex items-center justify-end gap-2">
        <button
          onClick={onViewChart}
          className="px-3 py-1.5 text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors"
        >
          View Chart
        </button>
        
        <button
          onClick={onNewEncounter}
          className="px-3 py-1.5 text-sm font-medium text-white bg-primary hover:bg-primary/90 rounded-md flex items-center gap-1 transition-colors"
        >
          <PlusIcon className="w-4 h-4" />
          New Encounter
        </button>
      </div>
    </div>
  );
}; 