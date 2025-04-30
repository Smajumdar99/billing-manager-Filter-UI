import React, { FC } from 'react'
import { Input } from '../../ui/input'
import { Select, SelectItem } from '../../ui/select'
import { Checkbox } from '../../ui/checkbox'
import { Button } from '../../ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card'
import { CheckIcon, CalendarIcon } from '@heroicons/react/24/outline'
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import interactionPlugin from '@fullcalendar/interaction'
import { cn } from '../../../lib/utils'

interface FilterOptions {
  personApptsOnly: boolean;
  providerResvOnly: boolean;
  providerInOfficeResvOnly: boolean;
  groupApptsOnly: boolean;
  apptsInNextHours: number;
  filterByHours: boolean;
  includeInactivePrograms: boolean;
  includeInactiveProviders: boolean;
}

interface Provider {
  id: string;
  name: string;
  count: number | null;
}

interface Program {
  id: string;
  name: string;
}

interface ScheduleFiltersProps {
  filters: FilterOptions;
  onFilterChange: (filters: FilterOptions) => void;
  providers: Provider[];
  programs: Program[];
  onProviderSelect?: (providerId: string) => void;
  onProgramSelect?: (programId: string) => void;
  calendarRef?: React.RefObject<FullCalendar>;
}

export const ScheduleFilters: FC<ScheduleFiltersProps> = ({
  filters,
  onFilterChange,
  providers,
  programs,
  onProviderSelect,
  onProgramSelect,
  calendarRef
}) => {
  const [programSearch, setProgramSearch] = React.useState('');
  const [providerSearch, setProviderSearch] = React.useState('');

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = type === 'checkbox' ? (e.target as HTMLInputElement).checked : undefined;
    
    onFilterChange({
      ...filters,
      [name]: checked !== undefined ? checked : value
    });
  };

  return (
    <div className="w-72 bg-gradient-to-b from-orange-50 to-blue-50 border-r border-gray-200 overflow-y-auto flex-shrink-0">
      <div className="p-5">
        {/* Mini Calendar */}
        <div className="rounded-[1.5rem] overflow-hidden bg-white">
          <div className="filters-mini-calendar">
            <FullCalendar
              plugins={[dayGridPlugin, interactionPlugin]}
              initialView="dayGridMonth"
              headerToolbar={{
                left: '',
                center: 'title',
                right: 'prev,next'
              }}
              height={280}
              dayMaxEventRows={0}
              selectable={true}
              select={(info) => {
                if (calendarRef?.current) {
                  calendarRef.current.getApi().gotoDate(info.start);
                }
              }}
              dateClick={(info) => {
                if (calendarRef?.current) {
                  calendarRef.current.getApi().gotoDate(info.date);
                }
              }}
              eventDisplay="none"
              dayCellClassNames="cursor-pointer hover:bg-blue-50"
              titleFormat={{ month: 'short', year: 'numeric' }}
              dayHeaderFormat={{ weekday: 'narrow' }}
              datesSet={(dateInfo) => {
                if (calendarRef?.current) {
                  const mainCalendarDate = calendarRef.current.getApi().getDate();
                  if (dateInfo.view.currentStart.getMonth() !== mainCalendarDate.getMonth()) {
                    dateInfo.view.calendar.gotoDate(mainCalendarDate);
                  }
                }
              }}
              views={{
                dayGridMonth: {
                  titleFormat: { month: 'long', year: 'numeric' },
                  dayHeaderFormat: { weekday: 'narrow' },
                  displayEventTime: false,
                  dayMaxEvents: 0
                }
              }}
            />
          </div>
        </div>

        {/* Filter Groups */}
        <div className="space-y-4 mt-4">
          {/* Appointment Type Filters */}
          <Card>
            <CardHeader className="bg-gray-50 border-b border-gray-200 py-3">
              <CardTitle>Appointment Types</CardTitle>
            </CardHeader>
            <CardContent className="p-4 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 rounded-md bg-blue-500 flex items-center justify-center">
                    <CheckIcon className="w-3.5 h-3.5 text-white" />
                  </div>
                  <span className="text-[0.9375rem] font-medium text-gray-700">Person appts only</span>
                </div>
                <Checkbox
                  checked={filters.personApptsOnly}
                  onCheckedChange={(checked) => 
                    onFilterChange({ ...filters, personApptsOnly: checked as boolean })}
                  name="personApptsOnly"
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 rounded-md bg-purple-500 flex items-center justify-center">
                    <CheckIcon className="w-3.5 h-3.5 text-white" />
                  </div>
                  <span className="text-[0.9375rem] font-medium text-gray-700">Provider resv. only</span>
                </div>
                <Checkbox
                  checked={filters.providerResvOnly}
                  onCheckedChange={(checked) => 
                    onFilterChange({ ...filters, providerResvOnly: checked as boolean })}
                  name="providerResvOnly"
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 rounded-md bg-green-500 flex items-center justify-center">
                    <CheckIcon className="w-3.5 h-3.5 text-white" />
                  </div>
                  <span className="text-[0.9375rem] font-medium text-gray-700">Provider in Office resv. only</span>
                </div>
                <Checkbox
                  checked={filters.providerInOfficeResvOnly}
                  onCheckedChange={(checked) => 
                    onFilterChange({ ...filters, providerInOfficeResvOnly: checked as boolean })}
                  name="providerInOfficeResvOnly"
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 rounded-md bg-indigo-500 flex items-center justify-center">
                    <CheckIcon className="w-3.5 h-3.5 text-white" />
                  </div>
                  <span className="text-[0.9375rem] font-medium text-gray-700">Group appts only</span>
                </div>
                <Checkbox
                  checked={filters.groupApptsOnly}
                  onCheckedChange={(checked) => 
                    onFilterChange({ ...filters, groupApptsOnly: checked as boolean })}
                  name="groupApptsOnly"
                />
              </div>
            </CardContent>
          </Card>

          {/* Time Filter */}
          <Card>
            <CardHeader className="bg-gray-50 border-b border-gray-200 py-3">
              <CardTitle>Time Range</CardTitle>
            </CardHeader>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 rounded-md bg-blue-500 flex items-center justify-center">
                    <CheckIcon className="w-3.5 h-3.5 text-white" />
                  </div>
                  <span className="text-[0.9375rem] font-medium text-gray-700">Appts in next</span>
                </div>
                <select
                  name="apptsInNextHours"
                  value={filters.apptsInNextHours}
                  onChange={handleFilterChange}
                  disabled={!filters.filterByHours}
                  className="text-sm border border-gray-200 rounded-md p-1 w-16 text-gray-700 bg-white focus:ring-blue-400 focus:border-blue-400 focus:outline-none disabled:bg-gray-50 disabled:text-gray-500"
                >
                  <option value="1">1</option>
                  <option value="2">2</option>
                  <option value="3">3</option>
                  <option value="4">4</option>
                  <option value="8">8</option>
                  <option value="12">12</option>
                  <option value="24">24</option>
                </select>
                <span className="text-[0.9375rem] font-medium text-gray-700">hours</span>
              </div>
            </CardContent>
          </Card>

          {/* Programs Section */}
          <Card>
            <CardHeader className="bg-gray-50 border-b border-gray-200 py-3">
              <div className="flex justify-between items-center">
                <CardTitle>Programs</CardTitle>
                <div className="flex items-center gap-2">
                  <Checkbox
                    checked={filters.includeInactivePrograms}
                    onCheckedChange={(checked) => 
                      onFilterChange({ ...filters, includeInactivePrograms: checked as boolean })}
                    name="includeInactivePrograms"
                  />
                  <span className="text-sm text-gray-500">Include inactive</span>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-4">
              <div className="rounded-xl border border-gray-100 overflow-hidden bg-gray-50">
                <div className="p-2 border-b border-gray-100">
                  <Input
                    type="text"
                    placeholder="Search programs..."
                    value={programSearch}
                    onChange={(e) => setProgramSearch(e.target.value)}
                    className="w-full px-3 py-2 text-sm bg-white border border-gray-200 rounded-lg focus:ring-blue-400 focus:border-blue-400 focus:outline-none"
                  />
                </div>
                <div className="max-h-40 overflow-y-auto bg-white">
                  <div className="p-2 border-b border-gray-100">
                    <div className="text-[0.9375rem] font-medium text-gray-900">All Programs</div>
                  </div>
                  {programs.slice(1).filter(program => 
                    program.name.toLowerCase().includes(programSearch.toLowerCase())
                  ).map(program => (
                    <div 
                      key={program.id} 
                      className="p-2 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0 transition-colors"
                      onClick={() => onProgramSelect?.(program.id)}
                    >
                      <div className="text-[0.9375rem] text-gray-700">{program.name}</div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Providers Section */}
          <Card>
            <CardHeader className="bg-gray-50 border-b border-gray-200 py-3">
              <div className="flex justify-between items-center">
                <CardTitle>Providers</CardTitle>
                <div className="flex items-center gap-2">
                  <Checkbox
                    checked={filters.includeInactiveProviders}
                    onCheckedChange={(checked) => 
                      onFilterChange({ ...filters, includeInactiveProviders: checked as boolean })}
                    name="includeInactiveProviders"
                  />
                  <span className="text-sm text-gray-500">Include inactive</span>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-4">
              <div className="rounded-xl border border-gray-100 overflow-hidden bg-gray-50">
                <div className="p-2 border-b border-gray-100">
                  <Input
                    type="text"
                    placeholder="Search providers..."
                    value={providerSearch}
                    onChange={(e) => setProviderSearch(e.target.value)}
                    className="w-full px-3 py-2 text-sm bg-white border border-gray-200 rounded-lg focus:ring-blue-400 focus:border-blue-400 focus:outline-none"
                  />
                </div>
                <div className="max-h-40 overflow-y-auto bg-white">
                  <div className="p-2 border-b border-gray-100">
                    <div className="text-[0.9375rem] font-medium text-gray-900">All Providers</div>
                  </div>
                  {providers.filter(provider => 
                    provider.name.toLowerCase().includes(providerSearch.toLowerCase())
                  ).map(provider => (
                    <div 
                      key={provider.id} 
                      className="p-2 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0 transition-colors flex justify-between items-center"
                      onClick={() => onProviderSelect?.(provider.id)}
                    >
                      <div className="text-[0.9375rem] text-gray-700">{provider.name}</div>
                      {provider.count !== null && (
                        <div className="text-xs bg-blue-100 text-blue-800 rounded-full px-2 py-0.5">
                          {provider.count}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
} 