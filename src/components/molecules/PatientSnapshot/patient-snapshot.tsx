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
} from '@heroicons/react/24/outline';
import { Avatar } from '@/components/atoms/Avatar';

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
  };
  onClose?: () => void;
  onNewEncounter?: () => void;
  onViewChart?: () => void;
  className?: string;
  variant?: 'header' | 'floating';
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
    <div className="flex items-center h-14 bg-white px-4 min-w-[900px] pt-0 bg-gradient-to-br from-blue-100/50 via-orange-100/70 to-yellow-100/50 rounded-lg border border-white shadow-lg">
      {/* Left Section */}
      <div className="flex items-center gap-3 min-w-[280px]">
        <Avatar
          src={patient.avatar}
          alt={patient.name}
          className="w-7 h-7"
          fallback={patient.name.charAt(0)}
        />
        <div>
          <div className="flex items-center gap-1">
            <span className="text-gray-900 font-medium text-xs">{patient.name.split(' ')[0]}</span>
            <span className="text-gray-500 text-xs">{patient.name.split(' ')[1]}</span>
          </div>
          <p className="text-[11px] text-gray-500">
            Gender: {patient.gender}
            {patient.age && `, Age: ${patient.age} years`}
            {patient.bloodGroup && `, Blood group: ${patient.bloodGroup}`}
          </p>
        </div>
      </div>

      {/* Middle Section */}
      <div className="flex items-center ml-4">
        <button
          onClick={handleExpand}
          className="flex items-center gap-1.5 text-gray-700 hover:text-gray-900 bg-white rounded border px-2.5 py-1"
        >
          <ClockIcon className="w-3.5 h-3.5" />
          <span className="text-xs">Encounter History</span>
        </button>
      </div>

      {/* Right Section */}
      <div className="ml-auto flex items-center gap-6">
        <div>
          <div className="flex items-center gap-1">
            <span className="text-[11px] text-gray-500">Admitted:</span>
            <span className="text-[11px] text-gray-700">{patient.admittedTo || 'Not Admitted'}</span>
          </div>
          {patient.programAuditor && patient.auditorTimestamp && (
            <div className="flex items-center gap-1">
              <span className="text-[11px] text-gray-500">Program Auditor:</span>
              <span className="text-[11px] text-gray-700">{patient.auditorTimestamp}</span>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
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
        'fixed top-16 right-4 z-50 rounded-lg shadow-lg border transition-all duration-300',
        'bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50',
        'hover:shadow-xl',
        isExpanded ? 'w-[800px]' : 'w-[400px]',
        isDragging && 'opacity-90 scale-[0.98]',
        className
      )}
    >
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
          <Avatar
            src={patient.avatar}
            alt={patient.name}
            className="w-10 h-10"
            fallback={patient.name.charAt(0)}
          />
          <div>
            <h3 className="font-semibold text-gray-900">{patient.name}</h3>
            <p className="text-xs text-gray-500">
              Gender: {patient.gender}
              {patient.age && `, Age: ${patient.age} years`}
              {patient.bloodGroup && `, Blood group: ${patient.bloodGroup}`}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={handleCollapse}
            className="p-1 hover:bg-gray-100 rounded-md transition-colors"
            title="Collapse to header"
          >
            <ChevronUpIcon className="w-4 h-4" />
          </button>
          <button
            onClick={() => {
              setIsFloating(false);
              onClose?.();
            }}
            className="p-1 hover:bg-gray-100 rounded-md transition-colors"
          >
            <XMarkIcon className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="p-3 space-y-3">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            {patient.insuranceProvider && (
              <div className="flex items-center gap-2 text-sm">
                <span className="text-gray-500">Insurance:</span>
                <span className="text-primary font-medium truncate">{patient.insuranceProvider}</span>
              </div>
            )}
            {patient.admittedTo && (
              <div className="flex items-center gap-2 text-sm">
                <span className="text-gray-500">Admitted:</span>
                <span className="font-medium">{patient.admittedTo}</span>
              </div>
            )}
          </div>
          <div className="space-y-2">
            {patient.language && (
              <div className="flex items-center gap-2 text-sm">
                <LanguageIcon className="w-4 h-4 text-gray-400" />
                <span className="font-medium">{patient.language}</span>
              </div>
            )}
            {patient.mobile && (
              <div className="flex items-center gap-2 text-sm">
                <PhoneIcon className="w-4 h-4 text-gray-400" />
                <span className="font-medium">{patient.mobile}</span>
              </div>
            )}
          </div>
        </div>

        {isExpanded && (
          <div className="pt-2 border-t space-y-2">
            <div className="flex items-center gap-2 text-sm">
              <ClockIcon className="w-4 h-4 text-gray-400" />
              <span className="text-gray-500">Program Auditor:</span>
              <span className="font-medium">{patient.programAuditor}</span>
              <span className="text-gray-400 text-xs">{patient.auditorTimestamp}</span>
            </div>
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="p-3 border-t flex items-center justify-end gap-2">
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