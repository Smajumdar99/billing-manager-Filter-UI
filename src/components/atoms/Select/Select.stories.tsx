import type { Meta, StoryObj } from '@storybook/react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, SelectLabel, SelectGroup, SelectSeparator } from './select';

const meta: Meta<typeof Select> = {
  title: 'Atoms/Select',
  component: Select,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A customizable select dropdown component built on Radix UI. Essential for healthcare applications for selecting medical conditions, medications, insurance providers, and other clinical data.',
      },
    },
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

// Basic select
export const Default: Story = {
  render: () => (
    <Select>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Select a provider" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="dr-smith">Dr. Sarah Smith</SelectItem>
        <SelectItem value="dr-johnson">Dr. Michael Johnson</SelectItem>
        <SelectItem value="dr-brown">Dr. Emily Brown</SelectItem>
        <SelectItem value="dr-davis">Dr. Robert Davis</SelectItem>
      </SelectContent>
    </Select>
  ),
};

// Medical conditions selector
export const MedicalConditions: Story = {
  render: () => (
    <div className="w-80">
      <label className="text-sm font-medium mb-2 block">Primary Diagnosis</label>
      <Select>
        <SelectTrigger>
          <SelectValue placeholder="Select primary diagnosis" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Cardiovascular</SelectLabel>
            <SelectItem value="hypertension">Hypertension</SelectItem>
            <SelectItem value="arrhythmia">Cardiac Arrhythmia</SelectItem>
            <SelectItem value="cad">Coronary Artery Disease</SelectItem>
          </SelectGroup>
          <SelectSeparator />
          <SelectGroup>
            <SelectLabel>Respiratory</SelectLabel>
            <SelectItem value="asthma">Asthma</SelectItem>
            <SelectItem value="copd">COPD</SelectItem>
            <SelectItem value="pneumonia">Pneumonia</SelectItem>
          </SelectGroup>
          <SelectSeparator />
          <SelectGroup>
            <SelectLabel>Endocrine</SelectLabel>
            <SelectItem value="diabetes-t1">Type 1 Diabetes</SelectItem>
            <SelectItem value="diabetes-t2">Type 2 Diabetes</SelectItem>
            <SelectItem value="thyroid">Thyroid Disorder</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Medical conditions selector organized by medical specialty for clinical documentation.',
      },
    },
  },
};

// Insurance providers
export const InsuranceProviders: Story = {
  render: () => (
    <div className="w-80">
      <label className="text-sm font-medium mb-2 block">Insurance Provider</label>
      <Select>
        <SelectTrigger>
          <SelectValue placeholder="Select insurance provider" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="aetna">Aetna</SelectItem>
          <SelectItem value="anthem">Anthem Blue Cross</SelectItem>
          <SelectItem value="bcbs">Blue Cross Blue Shield</SelectItem>
          <SelectItem value="cigna">Cigna</SelectItem>
          <SelectItem value="humana">Humana</SelectItem>
          <SelectItem value="kaiser">Kaiser Permanente</SelectItem>
          <SelectItem value="medicare">Medicare</SelectItem>
          <SelectItem value="medicaid">Medicaid</SelectItem>
          <SelectItem value="unitedhealthcare">UnitedHealthcare</SelectItem>
          <SelectItem value="self-pay">Self Pay</SelectItem>
        </SelectContent>
      </Select>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Insurance provider selection for patient registration and billing.',
      },
    },
  },
};

// Medication frequency
export const MedicationFrequency: Story = {
  render: () => (
    <div className="w-60">
      <label className="text-sm font-medium mb-2 block">Frequency</label>
      <Select>
        <SelectTrigger>
          <SelectValue placeholder="Select frequency" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="once-daily">Once daily</SelectItem>
          <SelectItem value="twice-daily">Twice daily (BID)</SelectItem>
          <SelectItem value="three-times-daily">Three times daily (TID)</SelectItem>
          <SelectItem value="four-times-daily">Four times daily (QID)</SelectItem>
          <SelectItem value="as-needed">As needed (PRN)</SelectItem>
          <SelectItem value="every-other-day">Every other day</SelectItem>
          <SelectItem value="weekly">Weekly</SelectItem>
          <SelectItem value="monthly">Monthly</SelectItem>
        </SelectContent>
      </Select>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Medication frequency selector for prescription management.',
      },
    },
  },
};

// Priority levels
export const PriorityLevels: Story = {
  render: () => (
    <div className="w-60">
      <label className="text-sm font-medium mb-2 block">Priority Level</label>
      <Select>
        <SelectTrigger>
          <SelectValue placeholder="Select priority" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="critical" className="text-red-600 font-medium">
            🔴 Critical
          </SelectItem>
          <SelectItem value="high" className="text-orange-600 font-medium">
            🟠 High
          </SelectItem>
          <SelectItem value="medium" className="text-yellow-600 font-medium">
            🟡 Medium
          </SelectItem>
          <SelectItem value="low" className="text-green-600 font-medium">
            🟢 Low
          </SelectItem>
          <SelectItem value="routine" className="text-gray-600">
            ⚪ Routine
          </SelectItem>
        </SelectContent>
      </Select>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Priority level selector with visual indicators for clinical decision making.',
      },
    },
  },
};

// Patient status
export const PatientStatus: Story = {
  render: () => (
    <div className="w-60">
      <label className="text-sm font-medium mb-2 block">Patient Status</label>
      <Select>
        <SelectTrigger>
          <SelectValue placeholder="Select status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="active">✅ Active</SelectItem>
          <SelectItem value="inactive">⏸️ Inactive</SelectItem>
          <SelectItem value="discharged">🏠 Discharged</SelectItem>
          <SelectItem value="transferred">🔄 Transferred</SelectItem>
          <SelectItem value="deceased">💀 Deceased</SelectItem>
        </SelectContent>
      </Select>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Patient status selector for medical record management.',
      },
    },
  },
};

// Disabled state
export const Disabled: Story = {
  render: () => (
    <div className="w-60">
      <label className="text-sm font-medium mb-2 block text-gray-500">Locked Field</label>
      <Select disabled>
        <SelectTrigger>
          <SelectValue placeholder="Cannot be changed" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="locked">This field is locked</SelectItem>
        </SelectContent>
      </Select>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Disabled select state for read-only or locked fields.',
      },
    },
  },
}; 