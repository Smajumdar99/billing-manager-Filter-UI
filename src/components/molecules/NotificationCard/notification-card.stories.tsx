import type { Meta, StoryObj } from '@storybook/react'
import { NotificationCard } from './notification-card'

const meta: Meta<typeof NotificationCard> = {
  title: 'Molecules/NotificationCard',
  component: NotificationCard,
  parameters: {
    layout: 'centered',
  },
}

export default meta
type Story = StoryObj<typeof NotificationCard>

export const GoldenThreadAlert: Story = {
  args: {
    type: 'golden-thread',
    title: 'Critical Allergy Alert',
    message: 'Patient John Doe has a critical allergy to Penicillin.',
    priority: 'high',
    timestamp: '2 minutes ago',
    actions: [
      { label: 'View Patient Chart', onClick: () => console.log('View chart clicked') },
      { label: 'Acknowledge', onClick: () => console.log('Acknowledged') },
    ],
  },
}

export const TaskNotification: Story = {
  args: {
    type: 'task',
    title: 'Complete Chart Documentation',
    message: 'Complete chart documentation for Jane Doe before 5 P.M.',
    priority: 'medium',
    timestamp: '1 hour ago',
    actions: [
      { label: 'Open Chart', onClick: () => console.log('Open chart clicked') },
      { label: 'Mark as Complete', onClick: () => console.log('Marked as complete') },
    ],
  },
}

export const MessageNotification: Story = {
  args: {
    type: 'message',
    title: 'New Patient Message',
    message: 'Patient: Can I reschedule my appointment?',
    priority: 'low',
    timestamp: '30 minutes ago',
    actions: [
      { label: 'Reply', onClick: () => console.log('Reply clicked') },
    ],
  },
}

export const ReminderNotification: Story = {
  args: {
    type: 'reminder',
    title: 'Vaccination Reminder',
    message: 'Jane Doe requires vaccination for flu season.',
    priority: 'medium',
    timestamp: '3 hours ago',
    actions: [
      { label: 'Add Order', onClick: () => console.log('Add order clicked') },
    ],
  },
}

export const AlertNotification: Story = {
  args: {
    type: 'alert',
    title: 'Drug Interaction Warning',
    message: 'Patient flagged for potential drug interaction (Warfarin + Aspirin).',
    priority: 'high',
    timestamp: '1 minute ago',
    actions: [
      { label: 'Review Medication Details', onClick: () => console.log('Review clicked') },
    ],
  },
} 