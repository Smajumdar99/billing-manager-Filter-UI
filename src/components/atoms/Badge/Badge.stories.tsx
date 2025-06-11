import type { Meta, StoryObj } from '@storybook/react';
import { Badge } from './badge';

const meta: Meta<typeof Badge> = {
  title: 'Atoms/Badge',
  component: Badge,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A versatile badge component for displaying status, categories, and labels. Essential for healthcare applications to show patient status, medication alerts, and system notifications.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: { type: 'select' },
      options: ['default', 'secondary', 'destructive', 'outline'],
      description: 'The visual style variant of the badge',
    },
    children: {
      control: 'text',
      description: 'The badge content',
    },
    className: {
      control: 'text',
      description: 'Additional CSS classes',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

// Default badge
export const Default: Story = {
  args: {
    children: 'Active Patient',
    variant: 'default',
  },
};

// Secondary badge
export const Secondary: Story = {
  args: {
    children: 'Outpatient',
    variant: 'secondary',
  },
};

// Destructive badge for alerts
export const Destructive: Story = {
  args: {
    children: 'Critical Alert',
    variant: 'destructive',
  },
  parameters: {
    docs: {
      description: {
        story: 'Used for critical alerts, emergencies, or high-priority medical conditions.',
      },
    },
  },
};

// Outline badge
export const Outline: Story = {
  args: {
    children: 'Scheduled',
    variant: 'outline',
  },
};

// Medical status badges
export const MedicalStatus: Story = {
  render: () => (
    <div className="flex flex-wrap gap-2">
      <Badge variant="default">Stable</Badge>
      <Badge variant="secondary">Recovering</Badge>
      <Badge variant="destructive">Critical</Badge>
      <Badge variant="outline">Under Observation</Badge>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Different medical status indicators for patient conditions.',
      },
    },
  },
};

// Medication badges
export const MedicationAlerts: Story = {
  render: () => (
    <div className="flex flex-wrap gap-2">
      <Badge variant="destructive">Allergy Alert</Badge>
      <Badge variant="default">Taking Medication</Badge>
      <Badge variant="secondary">Prescription Ready</Badge>
      <Badge variant="outline">Medication Review</Badge>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Medication-related alerts and status indicators.',
      },
    },
  },
};

// Appointment badges
export const AppointmentStatus: Story = {
  render: () => (
    <div className="flex flex-wrap gap-2">
      <Badge variant="default">Confirmed</Badge>
      <Badge variant="secondary">Pending</Badge>
      <Badge variant="destructive">Cancelled</Badge>
      <Badge variant="outline">Rescheduled</Badge>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Appointment scheduling status indicators.',
      },
    },
  },
};

// Priority levels
export const PriorityLevels: Story = {
  render: () => (
    <div className="flex flex-wrap gap-2">
      <Badge variant="destructive">High Priority</Badge>
      <Badge variant="default">Medium Priority</Badge>
      <Badge variant="secondary">Low Priority</Badge>
      <Badge variant="outline">Routine</Badge>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Priority level indicators for tasks, alerts, or medical procedures.',
      },
    },
  },
};

// Patient type badges
export const PatientTypes: Story = {
  render: () => (
    <div className="flex flex-wrap gap-2">
      <Badge variant="default">Inpatient</Badge>
      <Badge variant="secondary">Outpatient</Badge>
      <Badge variant="outline">Emergency</Badge>
      <Badge variant="destructive">ICU</Badge>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Different patient type classifications.',
      },
    },
  },
};

// Insurance status
export const InsuranceStatus: Story = {
  render: () => (
    <div className="flex flex-wrap gap-2">
      <Badge variant="default">Verified</Badge>
      <Badge variant="secondary">Pending Verification</Badge>
      <Badge variant="destructive">Expired</Badge>
      <Badge variant="outline">Not Verified</Badge>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Insurance verification status indicators.',
      },
    },
  },
};

// Test results
export const TestResults: Story = {
  render: () => (
    <div className="flex flex-wrap gap-2">
      <Badge variant="default">Normal</Badge>
      <Badge variant="secondary">Pending</Badge>
      <Badge variant="destructive">Abnormal</Badge>
      <Badge variant="outline">Inconclusive</Badge>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Medical test result status indicators.',
      },
    },
  },
};

// Custom colors for specific medical contexts
export const CustomMedicalBadges: Story = {
  render: () => (
    <div className="flex flex-wrap gap-2">
      <Badge className="bg-green-100 text-green-800 hover:bg-green-200">Healthy</Badge>
      <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-200">Caution</Badge>
      <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-200">Lab Pending</Badge>
      <Badge className="bg-purple-100 text-purple-800 hover:bg-purple-200">Consultation</Badge>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Custom colored badges for specific medical contexts and workflows.',
      },
    },
  },
}; 