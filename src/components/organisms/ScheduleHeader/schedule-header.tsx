import React, { FC, Dispatch, SetStateAction, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '../../ui/button'
import { Tooltip } from '../../ui/tooltip'
import { Badge } from '../../ui/badge'
import { AppointmentSearch } from '../../molecules/AppointmentSearch/appointment-search'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../../ui/dropdown-menu"
import { cn } from '../../../lib/utils'
import {
  PlusIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ArrowPathIcon,
  ArrowTopRightOnSquareIcon,
  AdjustmentsHorizontalIcon,
  ArrowsRightLeftIcon,
  CalendarIcon,
  PrinterIcon,
  SwatchIcon,
  MapIcon,
  BuildingOfficeIcon,
  CheckIcon,
  UserIcon,
  UserGroupIcon,
  BoltIcon
} from '@heroicons/react/24/outline'
import FullCalendar from '@fullcalendar/react'
import { ColorScheme } from '@/types/schedule'

export interface ScheduleHeaderProps {
  searchQuery: string;
  setSearchQuery: Dispatch<SetStateAction<string>>;
  onSearch: (filters: any) => void;
  handlePrev: () => void;
  handleNext: () => void;
  handleToday: () => void;
  getHeaderTitle: () => string;
  currentView: 'timeGridDay' | 'timeGridWeek' | 'dayGridMonth' | 'agenda';
  setCurrentView: (view: 'timeGridDay' | 'timeGridWeek' | 'dayGridMonth' | 'agenda') => void;
  calendarRef: React.RefObject<FullCalendar>;
  onNewAppointment: () => void;
  activeColorScheme: 'category' | 'facility' | 'location';
  setActiveColorScheme: Dispatch<SetStateAction<'category' | 'facility' | 'location'>>;
  colorScheme: ColorScheme;
}

const colorSchemes: Record<'category' | 'facility' | 'location', ColorScheme> = {
  category: {
    icon: SwatchIcon,
    label: 'Category Color Scheme',
    colors: ['#60A5FA', '#C084FC', '#F87171'],
    iconColor: 'text-blue-500',
    eventColors: {
      individual: { bg: '#bfdbfe', border: '#93c5fd', text: '#1e40af' },
      group: { bg: '#ddd6fe', border: '#c4b5fd', text: '#5b21b6' },
      crisis: { bg: '#fecaca', border: '#fca5a5', text: '#b91c1c' }
    }
  },
  facility: {
    icon: BuildingOfficeIcon,
    label: 'Facility Color Scheme',
    colors: ['#34D399', '#A78BFA', '#FB923C'],
    iconColor: 'text-green-500',
    eventColors: {
      individual: { bg: '#d1fae5', border: '#6ee7b7', text: '#065f46' },
      group: { bg: '#ede9fe', border: '#c4b5fd', text: '#5b21b6' },
      crisis: { bg: '#ffedd5', border: '#fdba74', text: '#9a3412' }
    }
  },
  location: {
    icon: MapIcon,
    label: 'Location Color Scheme',
    colors: ['#F472B6', '#FBBF24', '#2DD4BF'],
    iconColor: 'text-pink-500',
    eventColors: {
      individual: { bg: '#fce7f3', border: '#f9a8d4', text: '#9d174d' },
      group: { bg: '#fef3c7', border: '#fcd34d', text: '#92400e' },
      crisis: { bg: '#ccfbf1', border: '#5eead4', text: '#115e59' }
    }
  }
};

const getEventColor = (type: 'Individual' | 'Group' | 'Crisis', colorSchemes: Record<'category' | 'facility' | 'location', ColorScheme>, activeColorScheme: 'category' | 'facility' | 'location') => {
  const scheme = colorSchemes[activeColorScheme];
  const typeMap = {
    Individual: 'individual',
    Group: 'group',
    Crisis: 'crisis'
  } as const;
  return scheme.eventColors[typeMap[type]];
};

export const ScheduleHeader: FC<ScheduleHeaderProps> = ({
  searchQuery,
  setSearchQuery,
  onSearch,
  handlePrev,
  handleNext,
  handleToday,
  getHeaderTitle,
  currentView,
  setCurrentView,
  calendarRef,
  onNewAppointment,
  activeColorScheme,
  setActiveColorScheme,
  colorScheme
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  // Function to navigate to My Calendar page
  const handleMyCalendarClick = () => {
    navigate('/my-calendar');
  };

  return (
    <div className="bg-gradient-to-b from-blue-50 to-orange-50 rounded-lg mb-4">
      {/* Main Header Section */}
      <div className="p-2 sm:p-4 flex flex-col lg:flex-row lg:items-center justify-between border-b border-gray-200 gap-3">
        {/* Left Section */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4 w-full lg:w-auto">
          <Tooltip content="Create a new appointment" side="bottom">
            <button 
              className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium rounded-md border border-blue-200 bg-blue-50 text-blue-700 hover:bg-blue-100 transition-colors shadow-sm w-full sm:w-auto justify-center sm:justify-start"
              onClick={onNewAppointment}
            >
              <PlusIcon className="w-4 h-4" />
              <span className="hidden sm:inline">Add Appointment</span>
              <span className="sm:hidden">New</span>
            </button>
          </Tooltip>

          <div className="w-full sm:w-auto">
            <AppointmentSearch
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              onSearch={onSearch}
              recentSearches={[]}
              suggestions={[]}
            />
          </div>
        </div>

        {/* Center Section - Date Navigation */}
        <div className="flex items-center gap-2 order-first lg:order-none">
          <div className="flex items-center gap-1">
            <Tooltip content="Previous" side="bottom">
              <button 
                onClick={handlePrev}
                className="p-1.5 rounded-full hover:bg-gray-100 transition-colors text-gray-500"
              >
                <ChevronLeftIcon className="w-5 h-5" />
              </button>
            </Tooltip>
            
            <Tooltip content="Go to today" side="bottom">
              <button 
                className="px-3 py-1.5 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-md transition-colors"
                onClick={handleToday}
              >
                Today
              </button>
            </Tooltip>
            
            <Tooltip content="Next" side="bottom">
              <button 
                onClick={handleNext}
                className="p-1.5 rounded-full hover:bg-gray-100 transition-colors text-gray-500"
              >
                <ChevronRightIcon className="w-5 h-5" />
              </button>
            </Tooltip>
          </div>
          
          <h2 className="text-sm font-medium text-gray-700 hidden sm:block">
            {getHeaderTitle()}
          </h2>
        </div>

        {/* Right Section - Actions and View Toggle */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
          {/* Action Buttons */}
          <div className="flex justify-between sm:justify-start items-center gap-1">
            <div className="flex">
              <Tooltip content="Refresh calendar" side="bottom">
                <button 
                  className="p-1.5 rounded-md hover:bg-gray-100 transition-colors text-gray-500"
                  onClick={() => calendarRef.current?.getApi().refetchEvents()}
                >
                  <ArrowPathIcon className="w-5 h-5" />
                </button>
              </Tooltip>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="p-1.5 rounded-md hover:bg-gray-100 transition-colors text-gray-500 sm:hidden">
                    <AdjustmentsHorizontalIcon className="w-5 h-5" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuItem onClick={() => console.log('Export calendar')}>
                    <ArrowTopRightOnSquareIcon className="w-5 h-5 mr-2" />
                    Export Calendar
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => console.log('Transfer appointments')}>
                    <ArrowsRightLeftIcon className="w-5 h-5 mr-2" />
                    Transfer
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleMyCalendarClick}>
                    <CalendarIcon className="w-5 h-5 mr-2" />
                    My Calendar
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => console.log('Print calendar')}>
                    <PrinterIcon className="w-5 h-5 mr-2" />
                    Print
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              
              <div className="hidden sm:flex">
                <Tooltip content="Export calendar" side="bottom">
                  <button 
                    className="p-1.5 rounded-md hover:bg-gray-100 transition-colors text-gray-500"
                    onClick={() => console.log('Export calendar')}
                  >
                    <ArrowTopRightOnSquareIcon className="w-5 h-5" />
                  </button>
                </Tooltip>
                
                <Tooltip content="Transfer appointments" side="bottom">
                  <button 
                    className="p-1.5 rounded-md hover:bg-gray-100 transition-colors text-gray-500"
                    onClick={() => console.log('Transfer appointments')}
                  >
                    <ArrowsRightLeftIcon className="w-5 h-5" />
                  </button>
                </Tooltip>
                
                <Tooltip content="My Calendar" side="bottom">
                  <button 
                    className="p-1.5 rounded-md hover:bg-gray-100 transition-colors text-gray-500"
                    onClick={handleMyCalendarClick}
                  >
                    <CalendarIcon className="w-5 h-5" />
                  </button>
                </Tooltip>
                
                <Tooltip content="Print calendar" side="bottom">
                  <button 
                    className="p-1.5 rounded-md hover:bg-gray-100 transition-colors text-gray-500"
                    onClick={() => console.log('Print calendar')}
                  >
                    <PrinterIcon className="w-5 h-5" />
                  </button>
                </Tooltip>
              </div>
            </div>

            <div className="h-6 w-px bg-gray-200 mx-2 hidden sm:block" />

            <DropdownMenu>
              <Tooltip content="Color Settings" side="bottom">
                <DropdownMenuTrigger asChild>
                  <button 
                    className={cn(
                      "p-1.5 rounded-md hover:bg-gray-100 transition-colors",
                      colorSchemes[activeColorScheme].iconColor
                    )}
                  >
                    <SwatchIcon className="w-5 h-5" />
                  </button>
                </DropdownMenuTrigger>
              </Tooltip>
              <DropdownMenuContent align="end" className="w-64">
                <DropdownMenuLabel className="text-sm">Color Scheme</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {Object.entries(colorSchemes).map(([key, scheme]) => (
                  <DropdownMenuItem 
                    key={key}
                    className={cn(
                      "flex items-center gap-2 cursor-pointer py-2",
                      activeColorScheme === key && "bg-gray-50"
                    )}
                    onClick={() => setActiveColorScheme(key as keyof typeof colorSchemes)}
                  >
                    <div className="flex items-center gap-2 flex-1">
                      <scheme.icon className={cn("w-4 h-4", scheme.iconColor)} />
                      <span className="text-sm text-gray-700">{scheme.label}</span>
                    </div>
                    <div className="flex -space-x-1">
                      {(scheme.colors || []).map((color, index) => (
                        <div
                          key={index}
                          className="w-3.5 h-3.5 rounded-full border border-gray-100 shadow-sm"
                          style={{ backgroundColor: color }}
                        />
                      ))}
                    </div>
                    {activeColorScheme === key && (
                      <CheckIcon className="w-4 h-4 ml-2 text-blue-600" />
                    )}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* View Toggle */}
          <div className="flex border border-gray-200 rounded-md overflow-hidden shadow-sm">
            <Tooltip content="Day view" side="bottom">
              <button 
                className={`flex-1 px-3 py-1.5 text-sm font-medium transition-colors ${
                  currentView === 'timeGridDay' ? 'bg-blue-50 text-blue-600' : 'bg-white text-gray-600 hover:bg-gray-50'
                }`}
                onClick={() => {
                  setCurrentView('timeGridDay');
                  calendarRef.current?.getApi().changeView('timeGridDay');
                }}
              >
                <span className="hidden sm:inline">Day</span>
                <span className="sm:hidden">D</span>
              </button>
            </Tooltip>
            
            <Tooltip content="Week view" side="bottom">
              <button 
                className={`flex-1 px-3 py-1.5 text-sm font-medium transition-colors ${
                  currentView === 'timeGridWeek' ? 'bg-blue-50 text-blue-600' : 'bg-white text-gray-600 hover:bg-gray-50'
                }`}
                onClick={() => {
                  setCurrentView('timeGridWeek');
                  calendarRef.current?.getApi().changeView('timeGridWeek');
                }}
              >
                <span className="hidden sm:inline">Week</span>
                <span className="sm:hidden">W</span>
              </button>
            </Tooltip>
            
            <Tooltip content="Month view" side="bottom">
              <button 
                className={`flex-1 px-3 py-1.5 text-sm font-medium transition-colors ${
                  currentView === 'dayGridMonth' ? 'bg-blue-50 text-blue-600' : 'bg-white text-gray-600 hover:bg-gray-50'
                }`}
                onClick={() => {
                  setCurrentView('dayGridMonth');
                  calendarRef.current?.getApi().changeView('dayGridMonth');
                }}
              >
                <span className="hidden sm:inline">Month</span>
                <span className="sm:hidden">M</span>
              </button>
            </Tooltip>

            <Tooltip content="Agenda view" side="bottom">
              <button 
                className={`flex-1 px-3 py-1.5 text-sm font-medium transition-colors ${
                  currentView === 'agenda' ? 'bg-blue-50 text-blue-600' : 'bg-white text-gray-600 hover:bg-gray-50'
                }`}
                onClick={() => setCurrentView('agenda')}
              >
                <span className="hidden sm:inline">Agenda</span>
                <span className="sm:hidden">A</span>
              </button>
            </Tooltip>
          </div>
        </div>
      </div>
      
      {/* Legend Section */}
      <div className="px-2 sm:px-4 py-2 bg-white flex flex-wrap items-center text-xs text-gray-600 gap-2">
        <div className="flex items-center mr-4">
          <span className="w-3 h-3 rounded-full bg-blue-400 mr-1.5"></span>
          <UserIcon className="w-4 h-4 text-blue-500 mr-1" />
          Individual
        </div>
        <div className="flex items-center mr-4">
          <span className="w-3 h-3 rounded-full bg-purple-400 mr-1.5"></span>
          <UserGroupIcon className="w-4 h-4 text-purple-500 mr-1" />
          Group
        </div>
        <div className="flex items-center">
          <span className="w-3 h-3 rounded-full bg-red-400 mr-1.5"></span>
          <BoltIcon className="w-4 h-4 text-red-500 mr-1" />
          Crisis
        </div>
        <div className="hidden sm:flex ml-auto items-center text-xs text-gray-500">
          <span className="mr-1">Business hours:</span>
          <span className="font-medium">8:00am - 6:00pm</span>
        </div>
      </div>
    </div>
  );
} 