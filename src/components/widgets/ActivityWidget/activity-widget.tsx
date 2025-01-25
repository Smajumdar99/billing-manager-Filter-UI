import { FC } from 'react';
import { format } from 'date-fns';
import { Avatar } from '@/components/atoms/Avatar/avatar';
import { ExclamationTriangleIcon } from '@heroicons/react/24/outline';

interface Activity {
  id: string;
  type: 'claim_denied' | 'claim_submitted' | 'appointment' | 'encounter' | 'first_visit' | 'onboarded';
  title: string;
  subtitle?: string;
  timestamp: Date;
  error?: boolean;
  errorMessage?: string;
}

interface ActivityWidgetProps {
  patientId: string;
}

// Mock data - replace with real data fetching
const mockActivities: Activity[] = [
  {
    id: '1',
    type: 'claim_denied',
    title: 'Claim denied',
    subtitle: 'The submitted claim has been rejected for reason',
    errorMessage: 'Member id missing',
    timestamp: new Date('2024-06-12T09:00:00'),
    error: true
  },
  {
    id: '2',
    type: 'claim_submitted',
    title: 'Claim Submitted',
    subtitle: 'Claim #283938 has been submitted',
    timestamp: new Date('2024-06-12T09:00:00')
  },
  {
    id: '3',
    type: 'appointment',
    title: 'Appointment Scheduled',
    subtitle: 'Appointment for Dr Annette has been scheduled for 27 Jul, 09:30am',
    timestamp: new Date('2024-06-12T09:00:00')
  },
  {
    id: '4',
    type: 'encounter',
    title: 'Encounter created',
    subtitle: 'New encounter is created for drug abuse treatment',
    timestamp: new Date('2024-06-12T09:00:00')
  },
  {
    id: '5',
    type: 'first_visit',
    title: 'First Visit to clinic',
    subtitle: 'Patient has visited for the first time',
    timestamp: new Date('2024-06-12T09:00:00')
  },
  {
    id: '6',
    type: 'onboarded',
    title: 'Patient On-boarded',
    subtitle: 'New patient record has been created',
    timestamp: new Date('2024-06-12T09:00:00')
  }
];

export const ActivityWidget: FC<ActivityWidgetProps> = ({ patientId }) => {
  // In a real implementation, we would fetch activities based on patientId
  const activities = mockActivities;

  return (
    <div className="h-full flex flex-col">
      <div className="flex-1 overflow-y-auto">
        <div className="space-y-4 px-1">
          {activities.map((activity) => (
            <div
              key={activity.id}
              className="relative flex gap-3"
            >
              {/* Timeline connector */}
              <div className="absolute left-2 top-2 -bottom-4 w-px bg-gray-200 -z-10" />
              
              {/* Timeline dot */}
              <div className="relative shrink-0 mt-1">
                <div className="w-4 h-4 rounded-full border-2 border-gray-200 bg-white" />
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0 -mt-0.5">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-medium text-gray-900">
                        {activity.title}
                      </span>
                      {activity.error && (
                        <ExclamationTriangleIcon className="w-4 h-4 text-red-500" />
                      )}
                    </div>
                    <div className="flex items-center gap-1 mt-0.5">
                      <span className="text-xs text-gray-500">
                        {activity.subtitle}
                      </span>
                      {activity.errorMessage && (
                        <span className="text-xs text-red-500">
                          "{activity.errorMessage}"
                        </span>
                      )}
                    </div>
                  </div>
                  <time className="text-xs text-gray-400 shrink-0 mt-1">
                    {format(activity.timestamp, 'dd MMM, HH:mm\'a\'')}
                  </time>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}; 