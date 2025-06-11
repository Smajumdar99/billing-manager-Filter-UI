import type { Meta, StoryObj } from '@storybook/react';
import { Label } from './index';

const meta: Meta<typeof Label> = {
  title: 'Atoms/Label',
  component: Label,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A foundational label component for form fields, built on Radix UI Label primitive. Essential for accessibility and form usability in healthcare applications.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    children: {
      control: 'text',
      description: 'The label text content',
    },
    htmlFor: {
      control: 'text',
      description: 'Associates the label with a form control',
    },
    className: {
      control: 'text',
      description: 'Additional CSS classes',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

// Basic label
export const Default: Story = {
  args: {
    children: 'Patient Name',
    htmlFor: 'patient-name',
  },
};

// Required field label
export const Required: Story = {
  args: {
    children: (
      <>
        Patient Email <span className="text-red-500">*</span>
      </>
    ),
    htmlFor: 'patient-email',
  },
  parameters: {
    docs: {
      description: {
        story: 'Label for required form fields with visual indicator.',
      },
    },
  },
};

// Medical record label
export const MedicalRecord: Story = {
  args: {
    children: 'Medical Record Number (MRN)',
    htmlFor: 'mrn',
  },
  parameters: {
    docs: {
      description: {
        story: 'Label for medical record identification fields.',
      },
    },
  },
};

// Medication label
export const Medication: Story = {
  args: {
    children: 'Current Medications',
    htmlFor: 'medications',
  },
  parameters: {
    docs: {
      description: {
        story: 'Label for medication-related form fields.',
      },
    },
  },
};

// Disabled label
export const Disabled: Story = {
  args: {
    children: 'Date of Birth',
    htmlFor: 'dob',
    className: 'opacity-50 cursor-not-allowed',
  },
  parameters: {
    docs: {
      description: {
        story: 'Label in disabled state for non-editable fields.',
      },
    },
  },
};

// Emergency contact label
export const EmergencyContact: Story = {
  args: {
    children: (
      <>
        Emergency Contact <span className="text-orange-600 text-xs">(Important)</span>
      </>
    ),
    htmlFor: 'emergency-contact',
  },
  parameters: {
    docs: {
      description: {
        story: 'Label for critical patient information fields.',
      },
    },
  },
};

// Insurance label
export const Insurance: Story = {
  args: {
    children: 'Insurance Provider',
    htmlFor: 'insurance',
  },
  parameters: {
    docs: {
      description: {
        story: 'Label for insurance and billing information.',
      },
    },
  },
};

// Multiple labels example
export const MultipleLabels: Story = {
  render: () => (
    <div className="space-y-4 w-80">
      <div>
        <Label htmlFor="first-name">First Name <span className="text-red-500">*</span></Label>
        <input 
          id="first-name" 
          type="text" 
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
          placeholder="Enter first name"
        />
      </div>
      <div>
        <Label htmlFor="last-name">Last Name <span className="text-red-500">*</span></Label>
        <input 
          id="last-name" 
          type="text" 
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
          placeholder="Enter last name"
        />
      </div>
      <div>
        <Label htmlFor="phone">Phone Number</Label>
        <input 
          id="phone" 
          type="tel" 
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
          placeholder="(555) 123-4567"
        />
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Example showing multiple labels in a patient registration form context.',
      },
    },
  },
}; 