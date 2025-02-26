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
  userRole?: 'billing_specialist' | 'front_desk' | 'clinician';
}

const billingNotifications: Notification[] = [
  {
    id: '1',
    type: 'task',
    priority: 'high',
    title: 'Prior Authorization Required',
    message: 'Urgent: MRI authorization needed for patient John D. (ID: 12345) - Insurance requires approval before procedure',
    timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
    isRead: false,
    category: 'Authorization',
    actionRequired: true
  },
  {
    id: '2',
    type: 'golden-thread',
    priority: 'high',
    title: 'Claims Rejection Alert',
    message: 'Medicare rejected 3 claims due to incorrect diagnosis codes - Review needed within 24 hours',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
    isRead: false,
    category: 'Claims',
    actionRequired: true
  },
  {
    id: '3',
    type: 'task',
    priority: 'medium',
    title: 'Outstanding Balance Review',
    message: '5 patient accounts flagged for collections review - Total outstanding: $12,450',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 4).toISOString(),
    isRead: false,
    category: 'Collections',
    actionRequired: true
  },
  {
    id: '4',
    type: 'message',
    priority: 'medium',
    title: 'Insurance Policy Update',
    message: 'BlueCross updated their prior authorization requirements for imaging services',
    timestamp: new Date(Date.now() - 1000 * 60 * 180).toISOString(),
    isRead: false,
    category: 'Policy Updates'
  },
  {
    id: '5',
    type: 'reminder',
    priority: 'medium',
    title: 'EOB Reconciliation',
    message: '28 EOBs pending reconciliation from last week',
    timestamp: new Date(Date.now() - 1000 * 60 * 240).toISOString(),
    isRead: false,
    category: 'Reconciliation'
  }
];

const frontDeskNotifications: Notification[] = [
  {
    id: '1',
    type: 'task',
    priority: 'high',
    title: 'Missing Insurance Information',
    message: 'Patient Maria Garcia (Appt: 10:30 AM) - Missing current insurance card and coverage verification',
    timestamp: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
    isRead: false,
    category: 'Insurance Verification',
    actionRequired: true
  },
  {
    id: '2',
    type: 'golden-thread',
    priority: 'high',
    title: 'No-Show Follow Up Required',
    message: '3 patients missed appointments yesterday - Contact for rescheduling: John D., Sarah M., Robert K.',
    timestamp: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
    isRead: false,
    category: 'Appointments',
    actionRequired: true
  },
  {
    id: '3',
    type: 'task',
    priority: 'medium',
    title: 'Copay Collection Required',
    message: '2 patients in waiting room with outstanding copays: $40 and $60',
    timestamp: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
    isRead: false,
    category: 'Payments',
    actionRequired: true
  },
  {
    id: '4',
    type: 'message',
    priority: 'medium',
    title: 'Update Patient Demographics',
    message: '5 patients need address/phone verification at check-in today',
    timestamp: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
    isRead: false,
    category: 'Patient Information'
  },
  {
    id: '5',
    type: 'reminder',
    priority: 'medium',
    title: 'Appointment Reminders',
    message: 'Send tomorrow\'s appointment reminders to 12 patients',
    timestamp: new Date(Date.now() - 1000 * 60 * 180).toISOString(),
    isRead: false,
    category: 'Appointments'
  },
  {
    id: '6',
    type: 'task',
    priority: 'high',
    title: 'Insurance Pre-Authorization',
    message: 'Collect insurance referral forms from 3 new patients at check-in',
    timestamp: new Date(Date.now() - 1000 * 60 * 25).toISOString(),
    isRead: false,
    category: 'Insurance',
    actionRequired: true
  },
  {
    id: '7',
    type: 'message',
    priority: 'medium',
    title: 'Registration Forms Needed',
    message: 'Print registration packets for 3 new patients arriving between 2-3 PM',
    timestamp: new Date(Date.now() - 1000 * 60 * 90).toISOString(),
    isRead: false,
    category: 'Registration'
  },
  {
    id: '8',
    type: 'reminder',
    priority: 'low',
    title: 'Weekly Schedule Review',
    message: 'Review next week\'s schedule for double bookings and scheduling conflicts',
    timestamp: new Date(Date.now() - 1000 * 60 * 240).toISOString(),
    isRead: false,
    category: 'Schedule Management'
  }
];

const clinicianNotifications: Notification[] = [
  {
    id: '1',
    type: 'golden-thread',
    priority: 'high',
    title: 'Critical Lab Alert',
    message: 'STAT: Patient Sarah M. shows K+ level of 6.8 mEq/L - Immediate action required',
    timestamp: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
    isRead: false,
    category: 'Lab Results',
    actionRequired: true
  },
  {
    id: '2',
    type: 'golden-thread',
    priority: 'high',
    title: 'Medication Safety Alert',
    message: 'High-risk interaction: Patient on Warfarin prescribed NSAIDs - Review needed',
    timestamp: new Date(Date.now() - 1000 * 60 * 10).toISOString(),
    isRead: false,
    category: 'Medications',
    actionRequired: true
  },
  {
    id: '3',
    type: 'task',
    priority: 'high',
    title: 'Pending Orders Review',
    message: '4 unsigned orders including critical imaging results',
    timestamp: new Date(Date.now() - 1000 * 60 * 20).toISOString(),
    isRead: false,
    category: 'Orders',
    actionRequired: true
  },
  {
    id: '4',
    type: 'message',
    priority: 'medium',
    title: 'Care Coordination Alert',
    message: 'Cardiology consultation report received for Patient Robert J.',
    timestamp: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
    isRead: false,
    category: 'Care Coordination'
  },
  {
    id: '5',
    type: 'golden-thread',
    priority: 'high',
    title: 'Clinical Decision Support',
    message: 'Patient meets sepsis screening criteria - Protocol initiation recommended',
    timestamp: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
    isRead: false,
    category: 'Clinical Alerts',
    actionRequired: true
  },
  {
    id: '6',
    type: 'reminder',
    priority: 'medium',
    title: 'Preventive Care Due',
    message: '3 patients due for annual wellness visits this week',
    timestamp: new Date(Date.now() - 1000 * 60 * 240).toISOString(),
    isRead: false,
    category: 'Preventive Care'
  }
];

export const NotificationCenter: FC<NotificationCenterProps> = ({ patientId, className, userRole = 'clinician' }) => {
  const [notifications, setNotifications] = useState<Notification[]>(() => {
    switch (userRole) {
      case 'billing_specialist':
        return billingNotifications;
      case 'front_desk':
        return frontDeskNotifications;
      case 'clinician':
      default:
        return clinicianNotifications;
    }
  });
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