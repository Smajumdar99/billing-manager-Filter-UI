import { FC } from 'react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import {
  CalendarIcon,
  ClockIcon,
  UserIcon,
  MapPinIcon,
  BuildingOfficeIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon as PendingIcon,
} from '@heroicons/react/24/outline';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

export interface AppointmentCardProps {
  id: string;
  patientName: string;
  patientId: string;
  date: Date;
  time: string;
  provider: {
    name: string;
    role: string;
  };
  service: string;
  facility: string;
  status: 'upcoming' | 'completed' | 'cancelled' | 'pending';
  type: 'individual' | 'group' | 'crisis';
  onReschedule?: () => void;
  onCancel?: () => void;
  onViewDetails?: () => void;
}

export const AppointmentCard: FC<AppointmentCardProps> = ({
  patientName,
  patientId,
  date,
  time,
  provider,
  service,
  facility,
  status,
  type,
  onReschedule,
  onCancel,
  onViewDetails,
}) => {
  const getStatusConfig = (status: AppointmentCardProps['status']) => {
    switch (status) {
      case 'upcoming':
        return {
          color: 'bg-blue-50 text-blue-700 border-blue-100',
          icon: ClockIcon,
        };
      case 'completed':
        return {
          color: 'bg-green-50 text-green-700 border-green-100',
          icon: CheckCircleIcon,
        };
      case 'cancelled':
        return {
          color: 'bg-red-50 text-red-700 border-red-100',
          icon: XCircleIcon,
        };
      case 'pending':
        return {
          color: 'bg-yellow-50 text-yellow-700 border-yellow-100',
          icon: PendingIcon,
        };
    }
  };

  const getTypeConfig = (type: AppointmentCardProps['type']) => {
    switch (type) {
      case 'individual':
        return 'bg-purple-50 text-purple-700 border-purple-100';
      case 'group':
        return 'bg-indigo-50 text-indigo-700 border-indigo-100';
      case 'crisis':
        return 'bg-red-50 text-red-700 border-red-100';
    }
  };

  const statusConfig = getStatusConfig(status);
  const typeColor = getTypeConfig(type);
  const StatusIcon = statusConfig.icon;

  return (
    <div className="bg-white rounded-lg border p-4 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-3">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">{patientName}</h3>
          <p className="text-sm text-gray-500">ID: {patientId}</p>
        </div>
        <div className="flex gap-2">
          <Badge variant="outline" className={cn(typeColor, "capitalize")}>
            {type}
          </Badge>
          <Badge variant="outline" className={cn(statusConfig.color, "flex items-center gap-1")}>
            <StatusIcon className="w-4 h-4" />
            <span className="capitalize">{status}</span>
          </Badge>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="flex items-center gap-2 text-gray-600">
          <CalendarIcon className="w-5 h-5" />
          <div>
            <p className="text-sm font-medium">Date</p>
            <p className="text-sm">{format(date, 'MMM dd, yyyy')}</p>
          </div>
        </div>
        <div className="flex items-center gap-2 text-gray-600">
          <ClockIcon className="w-5 h-5" />
          <div>
            <p className="text-sm font-medium">Time</p>
            <p className="text-sm">{time}</p>
          </div>
        </div>
        <div className="flex items-center gap-2 text-gray-600">
          <UserIcon className="w-5 h-5" />
          <div>
            <p className="text-sm font-medium">Provider</p>
            <p className="text-sm">{provider.name}</p>
            <p className="text-xs text-gray-500">{provider.role}</p>
          </div>
        </div>
        <div className="flex items-center gap-2 text-gray-600">
          <BuildingOfficeIcon className="w-5 h-5" />
          <div>
            <p className="text-sm font-medium">Service</p>
            <p className="text-sm">{service}</p>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2 mb-4 text-gray-600">
        <MapPinIcon className="w-5 h-5" />
        <div>
          <p className="text-sm font-medium">Facility</p>
          <p className="text-sm">{facility}</p>
        </div>
      </div>

      <div className="flex items-center justify-end gap-2 mt-4">
        <Button
          variant="outline"
          size="sm"
          onClick={onViewDetails}
        >
          View Details
        </Button>
        {status === 'upcoming' && (
          <>
            <Button
              variant="outline"
              size="sm"
              onClick={onReschedule}
            >
              Reschedule
            </Button>
            <Button
              variant="destructive"
              size="sm"
              onClick={onCancel}
            >
              Cancel
            </Button>
          </>
        )}
      </div>
    </div>
  );
}; 