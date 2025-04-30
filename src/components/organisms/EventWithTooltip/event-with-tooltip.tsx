import React, { FC, useState, useRef } from 'react'
import { UserIcon, UserGroupIcon, BoltIcon } from '@heroicons/react/24/outline'

interface EventWithTooltipProps {
  title: string;
  startTime: string;
  endTime: string;
  patient: string;
  room?: string;
  type: 'Individual' | 'Group' | 'Crisis';
  provider: string;
  patientInfo?: {
    age?: number;
    gender?: string;
    mrn?: string;
    insuranceStatus?: string;
    lastVisit?: string;
  };
}

export const EventWithTooltip: FC<EventWithTooltipProps> = ({ 
  title, 
  startTime, 
  endTime, 
  patient, 
  room, 
  type, 
  provider, 
  patientInfo 
}) => {
  const [showTooltip, setShowTooltip] = useState(false);
  const eventRef = useRef<HTMLDivElement>(null);
  
  // Determine indicator color based on appointment type
  const indicatorColor = type === 'Individual' 
    ? 'bg-blue-400' 
    : type === 'Group' 
      ? 'bg-purple-400' 
      : 'bg-red-400';
  
  // Determine icon based on appointment type
  const TypeIcon = type === 'Individual' 
    ? UserIcon 
    : type === 'Group' 
      ? UserGroupIcon 
      : BoltIcon;
  
  return (
    <div 
      className="h-full relative flex"
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
      ref={eventRef}
    >
      {/* Type indicator bar */}
      <div className={`${indicatorColor} w-1.5 h-full rounded-l-sm`}></div>
      
      {/* Event content */}
      <div className="flex-1 p-1 flex flex-col justify-between min-w-0">
        {/* Event title with text truncation */}
        <div className="font-medium text-xs truncate max-w-full" title={title}>
          {title}
        </div>
        
        {/* Patient and room info with text truncation */}
        <div className="text-xs opacity-90 truncate max-w-full" title={`${startTime} • ${patient}${room ? ` • ${room}` : ''}`}>
          {startTime} • {patient}{room && <span className="opacity-75"> • {room}</span>}
        </div>
        
        {/* Type icon indicator - increased size */}
        <div className="absolute top-0.5 right-0.5 flex items-center">
          <TypeIcon className={`w-4 h-4 ${
            type === 'Individual' ? 'text-blue-500' : 
            type === 'Group' ? 'text-purple-500' : 
            'text-red-500'
          }`} />
        </div>
      </div>
      
      {/* Fixed position tooltip that appears on hover */}
      {showTooltip && (
        <div className="absolute left-0 top-full mt-1 z-[10000]">
          <div className="bg-white text-gray-800 text-xs rounded-md py-2 px-3 shadow-lg border border-gray-200 w-64">
            <div className="font-semibold text-sm mb-1.5 text-gray-900">{title}</div>
            
            <div className="grid grid-cols-[auto,1fr] gap-x-2 gap-y-1">
              <div className="text-gray-500 font-medium">Time:</div>
              <div className="font-medium">{startTime} - {endTime}</div>
              
              <div className="text-gray-500 font-medium">Type:</div>
              <div className="flex items-center">
                <TypeIcon className={`w-3.5 h-3.5 mr-1.5 ${
                  type === 'Individual' ? 'text-blue-500' : 
                  type === 'Group' ? 'text-purple-500' : 
                  'text-red-500'
                }`} />
                <span className="font-medium">{type}</span>
              </div>
              
              <div className="text-gray-500 font-medium">Provider:</div>
              <div className="font-medium">{provider}</div>
              
              {room && (
                <>
                  <div className="text-gray-500 font-medium">Room:</div>
                  <div className="font-medium">{room}</div>
                </>
              )}
            </div>
            
            {patientInfo && type !== 'Group' && (
              <>
                <div className="mt-2 mb-1 font-medium text-gray-700 border-b border-gray-200 pb-1">
                  Patient Information
                </div>
                <div className="grid grid-cols-[auto,1fr] gap-x-2 gap-y-1">
                  <div className="text-gray-500 font-medium">Patient:</div>
                  <div className="font-medium">{patient}</div>
                  
                  {patientInfo.mrn && (
                    <>
                      <div className="text-gray-500 font-medium">MRN:</div>
                      <div>{patientInfo.mrn}</div>
                    </>
                  )}
                  
                  {patientInfo.age && patientInfo.gender && (
                    <>
                      <div className="text-gray-500 font-medium">Demographics:</div>
                      <div>{patientInfo.age} y/o {patientInfo.gender}</div>
                    </>
                  )}
                  
                  {patientInfo.insuranceStatus && (
                    <>
                      <div className="text-gray-500 font-medium">Insurance:</div>
                      <div className={`${patientInfo.insuranceStatus === 'Active' ? 'text-green-600' : 'text-amber-600'}`}>
                        {patientInfo.insuranceStatus}
                      </div>
                    </>
                  )}
                  
                  {patientInfo.lastVisit && (
                    <>
                      <div className="text-gray-500 font-medium">Last Visit:</div>
                      <div>{patientInfo.lastVisit}</div>
                    </>
                  )}
                </div>
              </>
            )}
            
            {type === 'Group' && (
              <div className="mt-2 text-gray-600 italic">
                Group session with multiple patients
              </div>
            )}
            
            <div className="mt-2 pt-1 border-t border-gray-100 text-xs text-blue-600 font-medium">
              Click for more details
            </div>
          </div>
        </div>
      )}
    </div>
  );
}; 