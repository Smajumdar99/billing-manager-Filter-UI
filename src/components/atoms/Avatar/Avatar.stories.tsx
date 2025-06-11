import type { Meta, StoryObj } from '@storybook/react';
import { Avatar } from './avatar';

const meta: Meta<typeof Avatar> = {
  title: 'Atoms/Avatar',
  component: Avatar,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A versatile avatar component for displaying user profile images with fallback initials. Essential for healthcare applications to represent doctors, nurses, patients, and staff members.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    src: {
      control: 'text',
      description: 'URL of the avatar image',
    },
    alt: {
      control: 'text',
      description: 'Alt text for the image and source for initials fallback',
    },
    fallback: {
      control: 'text',
      description: 'Fallback text when no alt text is provided',
    },
    size: {
      control: { type: 'select' },
      options: ['sm', 'md', 'lg'],
      description: 'Size of the avatar',
    },
    className: {
      control: 'text',
      description: 'Additional CSS classes',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

// Default avatar with image
export const Default: Story = {
  args: {
    src: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
    alt: 'Dr. John Smith',
    size: 'md',
  },
};

// Small size
export const Small: Story = {
  args: {
    src: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=150&h=150&fit=crop&crop=face',
    alt: 'Nurse Jane Doe',
    size: 'sm',
  },
};

// Large size
export const Large: Story = {
  args: {
    src: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=150&h=150&fit=crop&crop=face',
    alt: 'Dr. Sarah Johnson',
    size: 'lg',
  },
};

// Fallback with initials
export const FallbackInitials: Story = {
  args: {
    src: '', // No image to trigger fallback
    alt: 'Dr. Michael Brown',
    size: 'md',
  },
  parameters: {
    docs: {
      description: {
        story: 'Shows fallback behavior with initials when no image is provided.',
      },
    },
  },
};

// Simple fallback
export const SimpleFallback: Story = {
  args: {
    src: '', // No image to trigger fallback
    fallback: 'P',
    alt: 'Patient',
    size: 'md',
  },
  parameters: {
    docs: {
      description: {
        story: 'Simple fallback with single letter when no proper name is available.',
      },
    },
  },
};

// Different healthcare roles
export const HealthcareRoles: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      <div className="text-center">
        <Avatar 
          src="https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=150&h=150&fit=crop&crop=face"
          alt="Dr. Sarah Wilson"
          size="lg"
        />
        <p className="text-xs mt-2 text-gray-600">Doctor</p>
      </div>
      <div className="text-center">
        <Avatar 
          src="https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=150&h=150&fit=crop&crop=face"
          alt="Nurse Maria Garcia"
          size="md"
        />
        <p className="text-xs mt-2 text-gray-600">Nurse</p>
      </div>
      <div className="text-center">
        <Avatar 
          src=""
          alt="Patient John"
          size="md"
        />
        <p className="text-xs mt-2 text-gray-600">Patient</p>
      </div>
      <div className="text-center">
        <Avatar 
          src=""
          alt="Admin Staff"
          size="sm"
        />
        <p className="text-xs mt-2 text-gray-600">Admin</p>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Different avatar sizes representing various healthcare roles.',
      },
    },
  },
};

// Patient list
export const PatientList: Story = {
  render: () => (
    <div className="space-y-3">
      <div className="flex items-center gap-3 p-2 border rounded-lg">
        <Avatar 
          src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face"
          alt="James Wilson"
          size="md"
        />
        <div>
          <p className="font-medium">James Wilson</p>
          <p className="text-sm text-gray-600">MRN: 12345</p>
        </div>
      </div>
      <div className="flex items-center gap-3 p-2 border rounded-lg">
        <Avatar 
          src=""
          alt="Maria Rodriguez"
          size="md"
        />
        <div>
          <p className="font-medium">Maria Rodriguez</p>
          <p className="text-sm text-gray-600">MRN: 12346</p>
        </div>
      </div>
      <div className="flex items-center gap-3 p-2 border rounded-lg">
        <Avatar 
          src=""
          alt="Robert Johnson"
          size="md"
        />
        <div>
          <p className="font-medium">Robert Johnson</p>
          <p className="text-sm text-gray-600">MRN: 12347</p>
        </div>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Example of avatars in a patient list context.',
      },
    },
  },
};

// Medical team
export const MedicalTeam: Story = {
  render: () => (
    <div className="flex items-center gap-2">
      <Avatar 
        src="https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=150&h=150&fit=crop&crop=face"
        alt="Dr. Sarah Chen"
        size="lg"
        className="ring-blue-200 ring-4"
      />
      <Avatar 
        src="https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=150&h=150&fit=crop&crop=face"
        alt="Nurse Lisa Park"
        size="md"
        className="ring-green-200 ring-4"
      />
      <Avatar 
        src=""
        alt="Tech Mike Davis"
        size="md"
        className="ring-orange-200 ring-4"
      />
      <Avatar 
        src=""
        alt="Resident Alex Kim"
        size="sm"
        className="ring-purple-200 ring-4"
      />
      <div className="text-xs text-gray-500 ml-2">
        <div className="flex items-center gap-1">
          <div className="w-2 h-2 bg-blue-200 rounded-full"></div>
          <span>Attending</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-2 h-2 bg-green-200 rounded-full"></div>
          <span>Nurse</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-2 h-2 bg-orange-200 rounded-full"></div>
          <span>Tech</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-2 h-2 bg-purple-200 rounded-full"></div>
          <span>Resident</span>
        </div>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Medical team avatars with color-coded rings to indicate roles.',
      },
    },
  },
};

// Online status indicators
export const OnlineStatus: Story = {
  render: () => (
    <div className="flex items-center gap-6">
      <div className="relative">
        <Avatar 
          src="https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=150&h=150&fit=crop&crop=face"
          alt="Dr. Emma Thompson"
          size="lg"
        />
        <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
        <p className="text-xs mt-2 text-center text-green-600">Available</p>
      </div>
      <div className="relative">
        <Avatar 
          src="https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=150&h=150&fit=crop&crop=face"
          alt="Nurse Tom Wilson"
          size="lg"
        />
        <div className="absolute bottom-0 right-0 w-3 h-3 bg-yellow-500 border-2 border-white rounded-full"></div>
        <p className="text-xs mt-2 text-center text-yellow-600">Busy</p>
      </div>
      <div className="relative">
        <Avatar 
          src=""
          alt="Dr. Lisa Chang"
          size="lg"
        />
        <div className="absolute bottom-0 right-0 w-3 h-3 bg-gray-400 border-2 border-white rounded-full"></div>
        <p className="text-xs mt-2 text-center text-gray-600">Offline</p>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Avatars with online status indicators for healthcare staff availability.',
      },
    },
  },
}; 