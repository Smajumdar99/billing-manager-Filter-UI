import type { Meta, StoryObj } from '@storybook/react';
import { Checkbox } from './index';
import { Label } from '../Label';
import { useState } from 'react';

const meta: Meta<typeof Checkbox> = {
  title: 'Atoms/Checkbox',
  component: Checkbox,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A checkbox component for forms and data selection. Essential for healthcare applications for consent forms, medical history, treatment options, and data filtering.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    checked: {
      control: 'boolean',
      description: 'Whether the checkbox is checked',
    },
    disabled: {
      control: 'boolean',
      description: 'Whether the checkbox is disabled',
    },
    indeterminate: {
      control: 'boolean',
      description: 'Whether the checkbox is in an indeterminate state',
    },
    onCheckedChange: {
      action: 'checked changed',
      description: 'Callback when checkbox state changes',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

// Default checkbox
export const Default: Story = {
  args: {
    checked: false,
  },
};

// Checked checkbox
export const Checked: Story = {
  args: {
    checked: true,
  },
};

// Disabled checkbox
export const Disabled: Story = {
  args: {
    checked: false,
    disabled: true,
  },
};

// Disabled checked
export const DisabledChecked: Story = {
  args: {
    checked: true,
    disabled: true,
  },
};

// Indeterminate state
export const Indeterminate: Story = {
  args: {
    indeterminate: true,
  },
  parameters: {
    docs: {
      description: {
        story: 'Indeterminate state useful for parent checkboxes when some but not all children are selected.',
      },
    },
  },
};

// With label - Medical consent
export const MedicalConsent: Story = {
  render: () => (
    <div className="flex items-start space-x-2">
      <Checkbox id="consent" />
      <Label htmlFor="consent" className="text-sm leading-relaxed">
        I consent to the medical treatment and understand the risks and benefits explained by my healthcare provider.
      </Label>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Checkbox for medical consent forms with detailed label.',
      },
    },
  },
};

// Medical history checklist
export const MedicalHistory: Story = {
  render: () => {
    const [conditions, setConditions] = useState({
      diabetes: false,
      hypertension: true,
      heartDisease: false,
      allergies: true,
      asthma: false,
    });

    return (
      <div className="space-y-4 w-80">
        <h3 className="font-medium text-lg">Medical History</h3>
        <div className="space-y-3">
          {Object.entries(conditions).map(([condition, checked]) => (
            <div key={condition} className="flex items-center space-x-2">
              <Checkbox 
                id={condition}
                checked={checked}
                onCheckedChange={(newChecked) => 
                  setConditions(prev => ({ ...prev, [condition]: newChecked }))
                }
              />
              <Label htmlFor={condition} className="capitalize">
                {condition.replace(/([A-Z])/g, ' $1').trim()}
              </Label>
            </div>
          ))}
        </div>
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story: 'Interactive medical history checklist for patient intake forms.',
      },
    },
  },
};

// Medication checklist
export const CurrentMedications: Story = {
  render: () => (
    <div className="space-y-4 w-80">
      <h3 className="font-medium text-lg">Current Medications</h3>
      <div className="space-y-3">
        <div className="flex items-center space-x-2">
          <Checkbox id="aspirin" />
          <Label htmlFor="aspirin">Aspirin 81mg daily</Label>
        </div>
        <div className="flex items-center space-x-2">
          <Checkbox id="lisinopril" checked />
          <Label htmlFor="lisinopril">Lisinopril 10mg daily</Label>
        </div>
        <div className="flex items-center space-x-2">
          <Checkbox id="metformin" />
          <Label htmlFor="metformin">Metformin 500mg twice daily</Label>
        </div>
        <div className="flex items-center space-x-2">
          <Checkbox id="vitamind" checked />
          <Label htmlFor="vitamind">Vitamin D3 1000 IU daily</Label>
        </div>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Medication checklist for tracking current prescriptions.',
      },
    },
  },
};

// Symptoms checklist
export const SymptomsChecklist: Story = {
  render: () => (
    <div className="space-y-4 w-80">
      <h3 className="font-medium text-lg">Current Symptoms</h3>
      <p className="text-sm text-gray-600">Please check all symptoms you are currently experiencing:</p>
      <div className="space-y-3">
        <div className="flex items-center space-x-2">
          <Checkbox id="fever" checked />
          <Label htmlFor="fever">Fever</Label>
        </div>
        <div className="flex items-center space-x-2">
          <Checkbox id="cough" checked />
          <Label htmlFor="cough">Cough</Label>
        </div>
        <div className="flex items-center space-x-2">
          <Checkbox id="headache" />
          <Label htmlFor="headache">Headache</Label>
        </div>
        <div className="flex items-center space-x-2">
          <Checkbox id="fatigue" checked />
          <Label htmlFor="fatigue">Fatigue</Label>
        </div>
        <div className="flex items-center space-x-2">
          <Checkbox id="nausea" />
          <Label htmlFor="nausea">Nausea</Label>
        </div>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Symptoms checklist for patient assessment and triage.',
      },
    },
  },
};

// Treatment preferences
export const TreatmentPreferences: Story = {
  render: () => (
    <div className="space-y-4 w-80">
      <h3 className="font-medium text-lg">Treatment Preferences</h3>
      <div className="space-y-3">
        <div className="flex items-start space-x-2">
          <Checkbox id="email-reminders" checked />
          <Label htmlFor="email-reminders" className="leading-relaxed">
            Email appointment reminders
          </Label>
        </div>
        <div className="flex items-start space-x-2">
          <Checkbox id="sms-notifications" />
          <Label htmlFor="sms-notifications" className="leading-relaxed">
            SMS notifications for test results
          </Label>
        </div>
        <div className="flex items-start space-x-2">
          <Checkbox id="generic-medications" checked />
          <Label htmlFor="generic-medications" className="leading-relaxed">
            Generic medications when available
          </Label>
        </div>
        <div className="flex items-start space-x-2">
          <Checkbox id="research-participation" />
          <Label htmlFor="research-participation" className="leading-relaxed">
            Willing to participate in medical research
          </Label>
        </div>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Treatment and communication preferences for patient care.',
      },
    },
  },
};

// Emergency contacts permissions
export const EmergencyContactPermissions: Story = {
  render: () => (
    <div className="space-y-4 w-80">
      <h3 className="font-medium text-lg">Emergency Contact Permissions</h3>
      <p className="text-sm text-gray-600">
        Please specify what information can be shared with your emergency contacts:
      </p>
      <div className="space-y-3">
        <div className="flex items-start space-x-2">
          <Checkbox id="basic-info" checked />
          <Label htmlFor="basic-info" className="leading-relaxed">
            Basic health status and location
          </Label>
        </div>
        <div className="flex items-start space-x-2">
          <Checkbox id="treatment-details" />
          <Label htmlFor="treatment-details" className="leading-relaxed">
            Detailed treatment information
          </Label>
        </div>
        <div className="flex items-start space-x-2">
          <Checkbox id="test-results" />
          <Label htmlFor="test-results" className="leading-relaxed">
            Laboratory and test results
          </Label>
        </div>
        <div className="flex items-start space-x-2">
          <Checkbox id="medication-info" checked />
          <Label htmlFor="medication-info" className="leading-relaxed">
            Current medications and allergies
          </Label>
        </div>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Emergency contact permissions for HIPAA compliance and patient privacy.',
      },
    },
  },
}; 