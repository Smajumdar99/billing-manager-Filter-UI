import { FC } from 'react';
import { Badge } from '@/components/atoms/Badge/badge';
import { ScrollArea } from '@/components/atoms/ScrollArea/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/molecules/Tabs/tabs';
import { formatDistanceToNow } from 'date-fns';
import { CalendarIcon, ClockIcon, UserIcon, MapPinIcon } from '@heroicons/react/24/outline';

interface AppointmentsWidgetProps {
  patientId: string;
  className?: string;
}

interface Appointment {
  id: string;
  type: 'routine' | 'follow_up' | 'urgent' | 'consultation';
  title: string;
  provider: string;
  department: string;
  location: string;
  date: string;
  time: string;
  status: 'scheduled' | 'completed' | 'cancelled' | 'no_show';
  notes?: string;
}

const mockAppointments: Appointment[] = [
  {
    id: '1',
    type: 'routine',
    title: 'Annual Physical Examination',
    provider: 'Dr. Sarah Chen',
    department: 'Primary Care',
    location: 'Main Clinic - Room 101',
    date: '2024-02-15',
    time: '09:30',
    status: 'scheduled',
    notes: 'Please arrive 15 minutes early to complete paperwork'
  },
  {
    id: '2',
    type: 'follow_up',
    title: 'Post-Surgery Follow-up',
    provider: 'Dr. James Wilson',
    department: 'Orthopedics',
    location: 'Specialty Clinic - Room 205',
    date: '2024-01-20',
    time: '14:15',
    status: 'scheduled'
  },
  {
    id: '3',
    type: 'consultation',
    title: 'Cardiology Consultation',
    provider: 'Dr. Michael Lee',
    department: 'Cardiology',
    location: 'Heart Center - Room 303',
    date: '2024-01-05',
    time: '11:00',
    status: 'completed'
  },
  {
    id: '4',
    type: 'urgent',
    title: 'Urgent Care Visit',
    provider: 'Dr. Emily Brown',
    department: 'Urgent Care',
    location: 'Emergency Wing - Room 1',
    date: '2023-12-28',
    time: '16:45',
    status: 'completed'
  }
];

export const AppointmentsWidget: FC<AppointmentsWidgetProps> = ({ patientId, className }) => {
  return (
    <Tabs defaultValue="upcoming" className="flex h-full flex-col">
      <TabsList className="pl-2 shrink-0 w-full justify-start gap-2">
        <TabsTrigger value="upcoming">
          Upcoming
          <Badge variant="secondary" className="ml-2 h-4 w-4">
            {mockAppointments.filter(a => a.status === 'scheduled').length}
          </Badge>
        </TabsTrigger>
        <TabsTrigger value="past">
          Past
          <Badge variant="secondary" className="ml-2 h-4 w-4">
            {mockAppointments.filter(a => ['completed', 'cancelled', 'no_show'].includes(a.status)).length}
          </Badge>
        </TabsTrigger>
        <TabsTrigger value="all">
          All
          <Badge variant="secondary" className="ml-2 h-4 w-4">
            {mockAppointments.length}
          </Badge>
        </TabsTrigger>
      </TabsList>

      {(['upcoming', 'past', 'all'] as const).map(tabValue => (
        <TabsContent key={tabValue} value={tabValue} className="flex-1 min-h-0">
          <ScrollArea className="h-full">
            <div className="space-y-4 p-4">
              {mockAppointments
                .filter(appointment => {
                  if (tabValue === 'all') return true;
                  if (tabValue === 'upcoming') return appointment.status === 'scheduled';
                  return ['completed', 'cancelled', 'no_show'].includes(appointment.status);
                })
                .sort((a, b) => new Date(b.date + 'T' + b.time).getTime() - new Date(a.date + 'T' + a.time).getTime())
                .map(appointment => (
                  <div key={appointment.id} className="rounded-lg border p-3 space-y-1.5">
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="text-sm font-medium">{appointment.title}</h4>
                          <Badge 
                            variant={
                              appointment.type === 'urgent' ? 'destructive' :
                              appointment.type === 'follow_up' ? 'default' :
                              'secondary'
                            } 
                            className="text-[10px]"
                          >
                            {appointment.type.replace('_', ' ')}
                          </Badge>
                          <Badge 
                            variant={
                              appointment.status === 'scheduled' ? 'default' :
                              appointment.status === 'completed' ? 'secondary' :
                              'destructive'
                            } 
                            className="text-[10px]"
                          >
                            {appointment.status.replace('_', ' ')}
                          </Badge>
                        </div>

                        <div className="mt-2 space-y-1">
                          <div className="flex items-center gap-1.5">
                            <CalendarIcon className="w-3.5 h-3.5 text-muted-foreground" />
                            <span className="text-xs">
                              {new Date(appointment.date + 'T' + appointment.time).toLocaleDateString()} at{' '}
                              {new Date(appointment.date + 'T' + appointment.time).toLocaleTimeString([], { 
                                hour: 'numeric', 
                                minute: '2-digit' 
                              })}
                            </span>
                          </div>

                          <div className="flex items-center gap-1.5">
                            <UserIcon className="w-3.5 h-3.5 text-muted-foreground" />
                            <span className="text-xs">
                              {appointment.provider} • {appointment.department}
                            </span>
                          </div>

                          <div className="flex items-center gap-1.5">
                            <MapPinIcon className="w-3.5 h-3.5 text-muted-foreground" />
                            <span className="text-xs text-muted-foreground">
                              {appointment.location}
                            </span>
                          </div>

                          {appointment.notes && (
                            <div className="mt-2 text-xs text-muted-foreground">
                              Note: {appointment.notes}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </ScrollArea>
        </TabsContent>
      ))}
    </Tabs>
  );
}; 