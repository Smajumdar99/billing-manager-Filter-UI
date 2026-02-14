import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import {
  ClockIcon,
  HeartIcon,
  BeakerIcon,
  DocumentTextIcon,
  ExclamationTriangleIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';

interface HistoryItem {
  id: string;
  type: 'encounter' | 'vital' | 'medication' | 'diagnosis' | 'incident';
  date: string;
  title: string;
  description: string;
  provider?: string;
  value?: string;
  status?: 'active' | 'resolved' | 'alert';
}

// Mock data - replace with actual API data
const mockHistory: HistoryItem[] = [
  {
    id: '1',
    type: 'encounter',
    date: '2024-11-20',
    title: 'Follow-up Visit',
    description: 'Routine check-up for hypertension management',
    provider: 'Dr. Sarah Williams',
  },
  {
    id: '2',
    type: 'vital',
    date: '2024-11-20',
    title: 'Blood Pressure',
    description: 'BP: 128/82 mmHg',
    value: '128/82',
    status: 'active',
  },
  {
    id: '3',
    type: 'medication',
    date: '2024-11-15',
    title: 'Lisinopril 10mg',
    description: 'Started for blood pressure control',
    status: 'active',
  },
  {
    id: '4',
    type: 'diagnosis',
    date: '2024-10-05',
    title: 'Essential Hypertension',
    description: 'I10 - Primary diagnosis',
    status: 'active',
  },
  {
    id: '5',
    type: 'incident',
    date: '2024-09-12',
    title: 'Hospitalization',
    description: 'Admitted for chest pain evaluation - ruled out MI',
    status: 'resolved',
  },
  {
    id: '6',
    type: 'encounter',
    date: '2024-08-15',
    title: 'Annual Physical',
    description: 'Comprehensive health assessment',
    provider: 'Dr. Michael Brown',
  },
  {
    id: '7',
    type: 'vital',
    date: '2024-08-15',
    title: 'Weight',
    description: 'Weight: 82 kg',
    value: '82 kg',
  },
];

const getIconForType = (type: string) => {
  switch (type) {
    case 'encounter':
      return ClockIcon;
    case 'vital':
      return HeartIcon;
    case 'medication':
      return BeakerIcon;
    case 'diagnosis':
      return DocumentTextIcon;
    case 'incident':
      return ExclamationTriangleIcon;
    default:
      return ClockIcon;
  }
};

const getColorForType = (type: string) => {
  switch (type) {
    case 'encounter':
      return 'text-blue-600 bg-blue-50';
    case 'vital':
      return 'text-green-600 bg-green-50';
    case 'medication':
      return 'text-purple-600 bg-purple-50';
    case 'diagnosis':
      return 'text-orange-600 bg-orange-50';
    case 'incident':
      return 'text-red-600 bg-red-50';
    default:
      return 'text-gray-600 bg-gray-50';
  }
};

const getStatusBadge = (status?: string) => {
  if (!status) return null;
  
  const colors = {
    active: 'bg-green-100 text-green-700',
    resolved: 'bg-gray-100 text-gray-600',
    alert: 'bg-red-100 text-red-700',
  };

  return (
    <span className={cn('px-2 py-0.5 text-xs font-medium rounded-full', colors[status as keyof typeof colors])}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
};

export const RunningHistory: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [filter, setFilter] = useState<string>('all');

  const filteredHistory = filter === 'all' 
    ? mockHistory 
    : mockHistory.filter(item => item.type === filter);

  return (
    <>
      {/* Floating Sticky Button - Always visible on right edge */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed right-0 top-1/2 -translate-y-1/2 bg-primary text-white p-3 rounded-l-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 z-40 flex items-center justify-center"
        title="Running History"
      >
        <ClockIcon className="h-6 w-6" />
      </button>

      {/* Backdrop Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/30 z-40 transition-opacity duration-300"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Slide-out Panel */}
      <div
        className={cn(
          'fixed right-0 top-0 h-full w-full sm:w-96 bg-white shadow-2xl z-50 flex flex-col transition-transform duration-300 ease-in-out',
          isOpen ? 'translate-x-0' : 'translate-x-full'
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gradient-to-r from-primary/10 to-primary/5">
          <div className="flex items-center gap-2">
            <ClockIcon className="h-5 w-5 text-primary" />
            <h3 className="text-base font-semibold text-gray-800">Running History</h3>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="p-1.5 hover:bg-gray-200 rounded-full transition-colors"
            title="Close"
          >
            <XMarkIcon className="h-5 w-5 text-gray-600" />
          </button>
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-1 p-3 border-b border-gray-200 overflow-x-auto bg-gray-50">
          {['all', 'encounter', 'vital', 'medication', 'diagnosis', 'incident'].map((type) => (
            <button
              key={type}
              onClick={() => setFilter(type)}
              className={cn(
                'px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap',
                filter === type
                  ? 'bg-primary text-white shadow-sm'
                  : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
              )}
            >
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </button>
          ))}
        </div>

        {/* Timeline */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {filteredHistory.length === 0 ? (
            <div className="text-center py-12 text-gray-500 text-sm">
              <ClockIcon className="h-12 w-12 mx-auto mb-3 text-gray-300" />
              <p>No history items found</p>
            </div>
          ) : (
            filteredHistory.map((item, index) => {
              const Icon = getIconForType(item.type);
              const colorClass = getColorForType(item.type);

              return (
                <div key={item.id} className="relative">
                  {/* Timeline line */}
                  {index < filteredHistory.length - 1 && (
                    <div className="absolute left-4 top-10 bottom-0 w-px bg-gray-200" />
                  )}

                  {/* History Item */}
                  <div className="flex gap-3 hover:bg-gray-50 p-2 rounded-lg transition-colors">
                    <div className={cn('w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 shadow-sm', colorClass)}>
                      <Icon className="h-4 w-4" />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <h4 className="text-sm font-medium text-gray-900 truncate">
                          {item.title}
                        </h4>
                        {getStatusBadge(item.status)}
                      </div>

                      <p className="text-xs text-gray-600 mb-1 line-clamp-2">
                        {item.description}
                      </p>

                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        <span>{new Date(item.date).toLocaleDateString()}</span>
                        {item.provider && (
                          <>
                            <span>•</span>
                            <span className="truncate">{item.provider}</span>
                          </>
                        )}
                      </div>

                      {item.value && (
                        <div className="mt-2 px-2 py-1 bg-gray-100 rounded text-xs font-medium text-gray-700">
                          {item.value}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer Info */}
        <div className="p-3 border-t border-gray-200 bg-gray-50">
          <p className="text-xs text-gray-500 text-center">
            Showing {filteredHistory.length} of {mockHistory.length} items
          </p>
        </div>
      </div>
    </>
  );
};
