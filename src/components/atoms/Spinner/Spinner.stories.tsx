import type { Meta, StoryObj } from '@storybook/react';
import { Spinner } from './spinner';

const meta: Meta<typeof Spinner> = {
  title: 'Atoms/Spinner',
  component: Spinner,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A loading spinner component for indicating processing states. Essential for healthcare applications during data fetching, form submissions, and medical record processing.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    className: {
      control: 'text',
      description: 'Additional CSS classes for custom styling',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

// Default spinner
export const Default: Story = {
  args: {
    className: 'h-6 w-6 text-blue-600',
  },
};

// Small spinner
export const Small: Story = {
  args: {
    className: 'h-4 w-4 text-blue-600',
  },
  parameters: {
    docs: {
      description: {
        story: 'Small spinner for inline loading states and form submissions.',
      },
    },
  },
};

// Medium spinner
export const Medium: Story = {
  args: {
    className: 'h-8 w-8 text-blue-600',
  },
};

// Large spinner
export const Large: Story = {
  args: {
    className: 'h-12 w-12 text-blue-600',
  },
  parameters: {
    docs: {
      description: {
        story: 'Large spinner for page-level loading states and major operations.',
      },
    },
  },
};

// Different colors for medical contexts
export const MedicalColors: Story = {
  render: () => (
    <div className="flex items-center gap-6">
      <div className="text-center">
        <Spinner className="h-8 w-8 text-blue-600" />
        <p className="text-xs mt-2 text-blue-600">Loading Patient Data</p>
      </div>
      <div className="text-center">
        <Spinner className="h-8 w-8 text-green-600" />
        <p className="text-xs mt-2 text-green-600">Processing Lab Results</p>
      </div>
      <div className="text-center">
        <Spinner className="h-8 w-8 text-orange-600" />
        <p className="text-xs mt-2 text-orange-600">Uploading Medical Records</p>
      </div>
      <div className="text-center">
        <Spinner className="h-8 w-8 text-red-600" />
        <p className="text-xs mt-2 text-red-600">Emergency Alert Processing</p>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Different colored spinners for various medical operations and contexts.',
      },
    },
  },
};

// Loading states with text
export const LoadingStates: Story = {
  render: () => (
    <div className="space-y-4">
      <div className="flex items-center gap-3 p-4 border rounded-lg">
        <Spinner className="h-5 w-5 text-blue-600" />
        <span className="text-sm">Loading patient records...</span>
      </div>
      <div className="flex items-center gap-3 p-4 border rounded-lg">
        <Spinner className="h-5 w-5 text-green-600" />
        <span className="text-sm">Syncing with lab systems...</span>
      </div>
      <div className="flex items-center gap-3 p-4 border rounded-lg">
        <Spinner className="h-5 w-5 text-orange-600" />
        <span className="text-sm">Verifying insurance coverage...</span>
      </div>
      <div className="flex items-center gap-3 p-4 border rounded-lg">
        <Spinner className="h-5 w-5 text-purple-600" />
        <span className="text-sm">Processing prescription...</span>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Loading states with descriptive text for different healthcare operations.',
      },
    },
  },
};

// Centered page loading
export const PageLoading: Story = {
  render: () => (
    <div className="flex flex-col items-center justify-center h-64 bg-gray-50 rounded-lg">
      <Spinner className="h-12 w-12 text-blue-600 mb-4" />
      <h3 className="text-lg font-medium text-gray-900 mb-2">Loading Patient Dashboard</h3>
      <p className="text-sm text-gray-600">Please wait while we retrieve your information...</p>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Full page loading state for major application sections.',
      },
    },
  },
};

// Inline button loading
export const ButtonLoading: Story = {
  render: () => (
    <div className="space-y-3">
      <button 
        disabled 
        className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md opacity-75 cursor-not-allowed"
      >
        <Spinner className="h-4 w-4 text-white" />
        Saving Patient Data
      </button>
      <button 
        disabled 
        className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-md opacity-75 cursor-not-allowed"
      >
        <Spinner className="h-4 w-4 text-white" />
        Submitting Lab Order
      </button>
      <button 
        disabled 
        className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-md opacity-75 cursor-not-allowed"
      >
        <Spinner className="h-4 w-4 text-white" />
        Processing Emergency Alert
      </button>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Spinner inside buttons during form submissions and actions.',
      },
    },
  },
}; 