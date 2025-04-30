import { FC, useState, useEffect } from 'react';
import { AppointmentSearch, SearchFilters } from '@/components/molecules/AppointmentSearch/appointment-search';
import { AppointmentCard } from '@/components/molecules/AppointmentCard/appointment-card';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/atoms/Toast/use-toast';

// Mock data for appointments
const MOCK_APPOINTMENTS = [
  {
    id: '1',
    patientName: 'John Doe',
    patientId: 'P123456',
    date: new Date('2024-03-20'),
    time: '09:00 AM',
    provider: {
      name: 'Dr. Smith',
      role: 'Psychiatrist'
    },
    service: 'Mental Health Assessment',
    facility: 'Main Clinic - Room 101',
    status: 'upcoming' as const,
    type: 'individual' as const
  },
  {
    id: '2',
    patientName: 'Jane Smith',
    patientId: 'P789012',
    date: new Date('2024-03-21'),
    time: '02:30 PM',
    provider: {
      name: 'Dr. Johnson',
      role: 'Therapist'
    },
    service: 'Group Therapy Session',
    facility: 'Behavioral Health Center',
    status: 'pending' as const,
    type: 'group' as const
  },
  {
    id: '3',
    patientName: 'Robert Brown',
    patientId: 'P345678',
    date: new Date('2024-03-19'),
    time: '11:15 AM',
    provider: {
      name: 'Dr. Wilson',
      role: 'Clinical Psychologist'
    },
    service: 'Crisis Intervention',
    facility: 'Emergency Care Unit',
    status: 'completed' as const,
    type: 'crisis' as const
  }
];

interface AppointmentSearchResultsProps {
  initialSearchQuery?: string;
  initialFilters?: SearchFilters | null;
  onClose?: () => void;
}

export const AppointmentSearchResults: FC<AppointmentSearchResultsProps> = ({
  initialSearchQuery = '',
  initialFilters = null,
  onClose
}) => {
  const [searchQuery, setSearchQuery] = useState(initialSearchQuery);
  const [appointments, setAppointments] = useState(MOCK_APPOINTMENTS);
  const [isLoading, setIsLoading] = useState(false);

  const handleSearch = async (filters: SearchFilters) => {
    setIsLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Filter appointments based on search criteria
      const filteredAppointments = MOCK_APPOINTMENTS.filter(appointment => {
        const matchesQuery = filters.query
          ? appointment.patientName.toLowerCase().includes(filters.query.toLowerCase()) ||
            appointment.patientId.toLowerCase().includes(filters.query.toLowerCase()) ||
            appointment.provider.name.toLowerCase().includes(filters.query.toLowerCase())
          : true;

        const matchesStatus = filters.status?.length
          ? filters.status.includes(appointment.status)
          : true;

        const matchesType = filters.appointmentTypes?.length
          ? filters.appointmentTypes.includes(appointment.type)
          : true;

        const matchesDate = filters.dateRange
          ? new Date(appointment.date) >= new Date(filters.dateRange.start) &&
            new Date(appointment.date) <= new Date(filters.dateRange.end)
          : true;

        return matchesQuery && matchesStatus && matchesType && matchesDate;
      });

      setAppointments(filteredAppointments);

      if (filteredAppointments.length === 0) {
        toast({
          title: "No Results",
          description: "No appointments found matching your search criteria.",
          variant: "default"
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to search appointments. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Apply initial filters if provided
  useEffect(() => {
    if (initialFilters) {
      handleSearch(initialFilters);
    }
  }, [initialFilters]);

  const handleReschedule = (appointmentId: string) => {
    toast({
      title: "Reschedule Requested",
      description: `Appointment ${appointmentId} reschedule requested.`,
    });
  };

  const handleCancel = (appointmentId: string) => {
    toast({
      title: "Cancel Requested",
      description: `Appointment ${appointmentId} cancellation requested.`,
    });
  };

  const handleViewDetails = (appointmentId: string) => {
    toast({
      title: "View Details",
      description: `Viewing details for appointment ${appointmentId}.`,
    });
  };

  return (
    <div className="container mx-auto py-6 px-4">
      <div className="mb-6">
        <AppointmentSearch
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          onSearch={handleSearch}
          isLoading={isLoading}
        />
      </div>

      <div className="space-y-4">
        {appointments.length > 0 ? (
          appointments.map((appointment) => (
            <AppointmentCard
              key={appointment.id}
              {...appointment}
              onReschedule={() => handleReschedule(appointment.id)}
              onCancel={() => handleCancel(appointment.id)}
              onViewDetails={() => handleViewDetails(appointment.id)}
            />
          ))
        ) : (
          <div className="text-center py-8">
            <p className="text-lg text-gray-600">No appointments found</p>
            <Button
              variant="outline"
              className="mt-4"
              onClick={() => {
                setSearchQuery('');
                setAppointments(MOCK_APPOINTMENTS);
              }}
            >
              Clear Search
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}; 