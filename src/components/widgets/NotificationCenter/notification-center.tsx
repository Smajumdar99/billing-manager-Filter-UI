import { FC, useState } from 'react';
import { ScrollArea } from '@/components/atoms/ScrollArea/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/molecules/Tabs/tabs';
import { NotificationCard } from '@/components/molecules/NotificationCard/notification-card';
import { cn } from '@/lib/utils';

type NotificationType = 'golden-thread' | 'task' | 'message' | 'reminder';

interface Notification {
  id: string;
  type: NotificationType;
  priority: 'high' | 'medium' | 'low';
  title: string;
  message: string;
  timestamp: string;
  isRead: boolean;
  sender?: string;
  category?: string;
  actionRequired?: boolean;
  to?: string;
  subject?: string;
}

interface NotificationCenterProps {
  patientId: string;
  className?: string;
}

const mockNotifications: Notification[] = [
  {
    id: '1',
    type: 'golden-thread',
    priority: 'high',
    title: 'Critical Lab Result Alert',
    message: 'Patient shows elevated potassium levels requiring immediate attention',
    timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
    isRead: false,
    category: 'Lab Results',
    actionRequired: true
  },
  {
    id: '2',
    type: 'message',
    priority: 'medium',
    title: 'Consultation Request',
    message: 'Dr. Smith requested cardiology consultation',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
    isRead: false,
    sender: 'Dr. Smith',
    to: 'Dr. Johnson',
    subject: 'Cardiology Consultation Request',
    category: 'Consultations'
  },
  {
    id: '3',
    type: 'task',
    priority: 'medium',
    title: 'Medication Review Required',
    message: 'Please review updated medication list',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 4).toISOString(),
    isRead: false,
    category: 'Medications',
    actionRequired: true
  },
  {
    id: '4',
    type: 'reminder',
    priority: 'low',
    title: 'Follow-up Appointment',
    message: 'Schedule follow-up appointment for next week',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
    isRead: false,
    category: 'Appointments'
  },
  {
    id: '5',
    type: 'golden-thread',
    priority: 'high',
    title: 'Abnormal Vital Signs',
    message: 'Blood pressure readings outside normal range',
    timestamp: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
    isRead: false,
    category: 'Vitals',
    actionRequired: true
  }
];

export const NotificationCenter: FC<NotificationCenterProps> = ({ patientId, className }) => {
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications);
  const [selectedType, setSelectedType] = useState<'all' | NotificationType>('all');

  const getTypeCount = (type: 'all' | NotificationType) => {
    if (type === 'all') return notifications.length;
    return notifications.filter(n => n.type === type).length;
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 1000 / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  };

  const filteredNotifications = notifications
    .filter(n => selectedType === 'all' || n.type === selectedType)
    .sort((a, b) => {
      // Sort by priority first, then by timestamp
      const priorityOrder = { high: 3, medium: 2, low: 1 };
      const priorityDiff = priorityOrder[b.priority] - priorityOrder[a.priority];
      if (priorityDiff !== 0) return priorityDiff;
      return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
    });

  const markAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(n => n.id === id ? { ...n, isRead: true } : n)
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
  };

  return (
    <div className={cn("h-full flex flex-col overflow-hidden relative", className)}>
      <div className="absolute inset-0 flex flex-col">
        <Tabs value={selectedType} onValueChange={(value) => setSelectedType(value as typeof selectedType)} className="flex h-full flex-col">
          <TabsList className="shrink-0 w-full justify-start gap-2 px-1">
            <TabsTrigger value="all">
              All ({getTypeCount('all')})
            </TabsTrigger>
            <TabsTrigger value="golden-thread">
              GT Alerts ({getTypeCount('golden-thread')})
            </TabsTrigger>
            <TabsTrigger value="task">
              Tasks ({getTypeCount('task')})
            </TabsTrigger>
            <TabsTrigger value="message">
              Messages ({getTypeCount('message')})
            </TabsTrigger>
            <TabsTrigger value="reminder">
              Reminders ({getTypeCount('reminder')})
            </TabsTrigger>
          </TabsList>

          <div className="flex-1 min-h-0">
            <ScrollArea className="h-full">
              <div className="space-y-2 p-0 pt-4">
                {filteredNotifications.map((notification) => (
                  <NotificationCard
                    key={notification.id}
                    type={notification.type}
                    title={notification.title}
                    message={notification.message}
                    timestamp={formatTimestamp(notification.timestamp)}
                    priority={notification.priority}
                    to={notification.to}
                    subject={notification.subject}
                    actions={[
                      {
                        label: notification.isRead ? 'Mark as Unread' : 'Mark as Read',
                        onClick: () => markAsRead(notification.id)
                      },
                      {
                        label: 'View Details',
                        onClick: () => console.log('View details clicked')
                      }
                    ]}
                  />
                ))}

                {filteredNotifications.length === 0 && (
                  <div className="flex flex-col items-center justify-center py-8 text-center">
                    <span className="text-2xl mb-2">📭</span>
                    <p className="text-sm text-slate-500">No notifications found</p>
                  </div>
                )}
              </div>
            </ScrollArea>
          </div>
        </Tabs>
      </div>
    </div>
  );
}; 