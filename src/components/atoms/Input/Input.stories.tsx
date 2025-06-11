import type { Meta, StoryObj } from '@storybook/react';
import { Input } from './index';

/**
 * ## Input Component
 * 
 * The Input component is a fundamental form element used throughout the DrCloud EHR system for data entry.
 * It provides consistent styling, validation states, and accessibility features for collecting patient information.
 * 
 * ### Design Principles
 * - **Data Accuracy**: Clear visual design to prevent input errors in medical contexts
 * - **Accessibility**: Full keyboard navigation and screen reader support
 * - **Validation**: Clear error states and helpful feedback for users
 * - **Consistency**: Uniform appearance across all forms in the EHR system
 * 
 * ### When to Use
 * - Patient name, ID, and demographic information
 * - Medical record numbers and identifiers
 * - Medication dosages and instructions
 * - Search fields for finding patients or records
 * - Date and time inputs for appointments
 * 
 * ### When Not to Use
 * - For selecting from predefined options (use Select component)
 * - For boolean values (use Checkbox or Switch)
 * - For large amounts of text (use Textarea component)
 * - For file uploads (use specialized File Input component)
 */
const meta: Meta<typeof Input> = {
  title: 'Atoms/Input',
  component: Input,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
The Input component is built on the native HTML input element with enhanced styling and accessibility features. It supports all standard input types and attributes while maintaining consistency with the DrCloud design system.

### Accessibility Features
- Proper focus management with visible focus rings
- Screen reader compatibility with semantic HTML
- Keyboard navigation support
- High contrast support for medical environments
- WCAG 2.1 AA compliant color contrast ratios

### Technical Implementation
- Built with React forwardRef for ref forwarding
- Uses Tailwind CSS for consistent styling
- Supports all HTML input attributes
- TypeScript interface for type safety
- Optimized for performance with minimal re-renders

### Validation Integration
Works seamlessly with form validation libraries:
- React Hook Form
- Formik
- Yup schema validation
- Custom validation functions
        `
      }
    }
  },
  tags: ['autodocs'],
  argTypes: {
    type: {
      control: { type: 'select' },
      options: ['text', 'email', 'password', 'number', 'tel', 'url', 'search', 'date', 'time', 'datetime-local'],
      description: 'The type of input field',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: 'text' },
        category: 'Behavior',
      },
    },
    placeholder: {
      control: { type: 'text' },
      description: 'Placeholder text shown when input is empty',
      table: {
        type: { summary: 'string' },
        category: 'Content',
      },
    },
    disabled: {
      control: { type: 'boolean' },
      description: 'When true, the input is disabled and cannot be interacted with',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
        category: 'State',
      },
    },
    required: {
      control: { type: 'boolean' },
      description: 'When true, the input is required for form submission',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
        category: 'Validation',
      },
    },
    readOnly: {
      control: { type: 'boolean' },
      description: 'When true, the input is read-only and cannot be edited',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
        category: 'State',
      },
    },
    value: {
      control: { type: 'text' },
      description: 'The current value of the input',
      table: {
        type: { summary: 'string' },
        category: 'Content',
      },
    },
    onChange: {
      action: 'changed',
      description: 'Function called when the input value changes',
      table: {
        type: { summary: '(event: ChangeEvent<HTMLInputElement>) => void' },
        category: 'Events',
      },
    },
    onFocus: {
      action: 'focused',
      description: 'Function called when the input receives focus',
      table: {
        type: { summary: '(event: FocusEvent<HTMLInputElement>) => void' },
        category: 'Events',
      },
    },
    onBlur: {
      action: 'blurred',
      description: 'Function called when the input loses focus',
      table: {
        type: { summary: '(event: FocusEvent<HTMLInputElement>) => void' },
        category: 'Events',
      },
    },
  },
  args: {
    onChange: () => console.log('Input changed'),
    onFocus: () => console.log('Input focused'),
    onBlur: () => console.log('Input blurred'),
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * The default input style used throughout the EHR system.
 * Clean and professional appearance suitable for medical data entry.
 */
export const Default: Story = {
  args: {
    placeholder: 'Enter patient name...',
  },
};

/**
 * Text input for patient names, addresses, and other textual information.
 * Most common input type in healthcare forms.
 */
export const Text: Story = {
  args: {
    type: 'text',
    placeholder: 'Patient full name',
    value: 'John Doe',
  },
};

/**
 * Email input with built-in validation for contact information.
 * Includes browser validation for email format.
 */
export const Email: Story = {
  args: {
    type: 'email',
    placeholder: 'patient@example.com',
  },
  parameters: {
    docs: {
      description: {
        story: `
**Email Validation**: The email input type provides built-in browser validation for email format. This helps prevent invalid email addresses from being entered.

**Best Practices:**
- Always validate email format on both client and server
- Provide clear error messages for invalid formats
- Consider email verification for critical communications
- Use autocomplete="email" for better UX
        `
      }
    }
  }
};

/**
 * Password input for secure authentication.
 * Text is automatically masked for security.
 */
export const Password: Story = {
  args: {
    type: 'password',
    placeholder: 'Enter password',
  },
  parameters: {
    docs: {
      description: {
        story: `
**Security Considerations:**
- Never store passwords in plain text
- Implement proper password strength requirements
- Consider two-factor authentication for medical systems
- Use HTTPS for all password transmissions
- Follow healthcare security compliance standards (HIPAA, etc.)
        `
      }
    }
  }
};

/**
 * Number input for numeric values like patient age, weight, or medication dosages.
 * Includes built-in numeric validation and spinner controls.
 */
export const Number: Story = {
  args: {
    type: 'number',
    placeholder: '0',
    min: 0,
    max: 150,
    step: 1,
  },
  parameters: {
    docs: {
      description: {
        story: `
**Numeric Validation**: Number inputs provide built-in validation and prevent non-numeric characters. Use min/max attributes to set appropriate ranges for medical values.

**Medical Use Cases:**
- Patient age (0-150 years)
- Weight (0-1000 lbs/kg)
- Blood pressure readings
- Medication dosages
- Lab result values

**Implementation Example:**
\`\`\`tsx
<Input 
  type="number" 
  min={0} 
  max={300} 
  step={0.1}
  placeholder="Weight (lbs)"
/>
\`\`\`
        `
      }
    }
  }
};

/**
 * Telephone input for patient contact information.
 * Optimized for phone number entry on mobile devices.
 */
export const Telephone: Story = {
  args: {
    type: 'tel',
    placeholder: '(555) 123-4567',
  },
  parameters: {
    docs: {
      description: {
        story: `
**Phone Number Formatting**: Consider using input masks or formatting libraries to ensure consistent phone number format across your application.

**Accessibility**: The tel input type triggers the numeric keypad on mobile devices, making it easier for users to enter phone numbers.
        `
      }
    }
  }
};

/**
 * Date input for appointments, birth dates, and medical events.
 * Provides native date picker on supported browsers.
 */
export const Date: Story = {
  args: {
    type: 'date',
  },
  parameters: {
    docs: {
      description: {
        story: `
**Date Handling**: Date inputs provide native date pickers on most modern browsers. Always validate date ranges for medical contexts.

**Common Medical Date Fields:**
- Date of birth
- Appointment dates
- Medication start/end dates
- Symptom onset dates
- Last visit dates

**Validation Example:**
\`\`\`tsx
// Ensure birth date is not in the future
const maxDate = new Date().toISOString().split('T')[0];
<Input type="date" max={maxDate} />
\`\`\`
        `
      }
    }
  }
};

/**
 * Search input for finding patients, medications, or medical codes.
 * Includes search icon styling and optimized behavior.
 */
export const Search: Story = {
  args: {
    type: 'search',
    placeholder: 'Search patients...',
  },
  parameters: {
    docs: {
      description: {
        story: `
**Search Optimization**: Search inputs provide enhanced UX with features like:
- Clear button (X) to reset search
- Search icon styling
- Optimized for autocomplete and suggestions
- Better mobile keyboard layout

**Implementation with debouncing:**
\`\`\`tsx
const [searchTerm, setSearchTerm] = useState('');
const debouncedSearch = useDebounce(searchTerm, 300);

<Input 
  type="search"
  value={searchTerm}
  onChange={(e) => setSearchTerm(e.target.value)}
  placeholder="Search patients..."
/>
\`\`\`
        `
      }
    }
  }
};

/**
 * Disabled input for read-only information or when editing is not allowed.
 * Maintains visual hierarchy while preventing interaction.
 */
export const Disabled: Story = {
  args: {
    disabled: true,
    value: 'Patient ID: 12345',
    placeholder: 'This field is disabled',
  },
  parameters: {
    docs: {
      description: {
        story: `
**When to Disable Inputs:**
- System-generated IDs that shouldn't be edited
- Fields that require special permissions to modify
- Calculated values that are derived from other inputs
- During form submission to prevent double-submission

**Accessibility**: Disabled inputs are still focusable by screen readers but cannot be edited. Consider using readonly instead if the value should be copyable.
        `
      }
    }
  }
};

/**
 * Read-only input for displaying information that users can copy but not edit.
 * Useful for system-generated values and reference information.
 */
export const ReadOnly: Story = {
  args: {
    readOnly: true,
    value: 'MRN: 2024-001234',
  },
  parameters: {
    docs: {
      description: {
        story: `
**Read-Only vs Disabled:**
- **Read-only**: Users can select and copy the text, but cannot edit it
- **Disabled**: Users cannot interact with the field at all

**Use read-only for:**
- Medical record numbers
- System-generated timestamps
- Calculated values users might need to reference
- Information that should be visible but not editable
        `
      }
    }
  }
};

/**
 * Required input with validation styling.
 * Essential for mandatory fields in medical forms.
 */
export const Required: Story = {
  args: {
    required: true,
    placeholder: 'Patient name (required)',
  },
  parameters: {
    docs: {
      description: {
        story: `
**Required Field Indicators:**
- Use the required attribute for HTML5 validation
- Consider visual indicators like asterisks (*)
- Provide clear error messages for empty required fields
- Group required fields logically in forms

**Example with label:**
\`\`\`tsx
<div>
  <label htmlFor="patientName">
    Patient Name <span className="text-red-500">*</span>
  </label>
  <Input 
    id="patientName"
    required 
    placeholder="Enter patient name"
  />
</div>
\`\`\`
        `
      }
    }
  }
};

/**
 * Input with error state styling for validation feedback.
 * Critical for preventing data entry errors in medical contexts.
 */
export const WithError: Story = {
  args: {
    value: 'invalid-email',
    className: 'border-red-500 focus-visible:ring-red-500',
  },
  parameters: {
    docs: {
      description: {
        story: `
**Error State Implementation:**
Apply error styling when validation fails. Always provide clear, actionable error messages.

**Complete Error Example:**
\`\`\`tsx
<div>
  <Input 
    type="email"
    value={email}
    onChange={(e) => setEmail(e.target.value)}
    className={errors.email ? 'border-red-500 focus-visible:ring-red-500' : ''}
    aria-invalid={errors.email ? 'true' : 'false'}
    aria-describedby={errors.email ? 'email-error' : undefined}
  />
  {errors.email && (
    <p id="email-error" className="text-red-500 text-sm mt-1">
      Please enter a valid email address
    </p>
  )}
</div>
\`\`\`
        `
      }
    }
  }
};

/**
 * Input with success state styling for positive validation feedback.
 * Provides immediate feedback when data entry is correct.
 */
export const WithSuccess: Story = {
  args: {
    value: 'john.doe@hospital.com',
    className: 'border-green-500 focus-visible:ring-green-500',
  },
  parameters: {
    docs: {
      description: {
        story: `
**Success State**: Provide positive feedback when validation passes. This is especially important in medical forms where accuracy is critical.

**Implementation:**
\`\`\`tsx
<Input 
  className={isValid ? 'border-green-500 focus-visible:ring-green-500' : ''}
  aria-describedby={isValid ? 'success-message' : undefined}
/>
{isValid && (
  <p id="success-message" className="text-green-600 text-sm mt-1">
    ✓ Valid email address
  </p>
)}
\`\`\`
        `
      }
    }
  }
};

/**
 * Example showing multiple input types in a typical patient registration form.
 * Demonstrates proper spacing, labeling, and validation patterns.
 */
export const PatientForm: Story = {
  render: () => (
    <div className="space-y-4 w-80">
      <div>
        <label htmlFor="fullName" className="block text-sm font-medium mb-1">
          Full Name <span className="text-red-500">*</span>
        </label>
        <Input 
          id="fullName"
          type="text" 
          placeholder="Enter patient's full name"
          required
        />
      </div>
      
      <div>
        <label htmlFor="dob" className="block text-sm font-medium mb-1">
          Date of Birth <span className="text-red-500">*</span>
        </label>
        <Input 
          id="dob"
          type="date" 
          required
        />
      </div>
      
      <div>
        <label htmlFor="email" className="block text-sm font-medium mb-1">
          Email Address
        </label>
        <Input 
          id="email"
          type="email" 
          placeholder="patient@example.com"
        />
      </div>
      
      <div>
        <label htmlFor="phone" className="block text-sm font-medium mb-1">
          Phone Number
        </label>
        <Input 
          id="phone"
          type="tel" 
          placeholder="(555) 123-4567"
        />
      </div>
      
      <div>
        <label htmlFor="mrn" className="block text-sm font-medium mb-1">
          Medical Record Number
        </label>
        <Input 
          id="mrn"
          type="text" 
          value="MRN-2024-001234"
          readOnly
        />
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: `
**Form Best Practices:**
- Always associate labels with inputs using htmlFor/id
- Mark required fields clearly with visual indicators
- Use appropriate input types for better UX and validation
- Provide consistent spacing between form fields
- Use read-only for system-generated values
- Group related fields logically

**Accessibility Checklist:**
- ✓ Proper label associations
- ✓ Required field indicators
- ✓ Logical tab order
- ✓ Clear focus indicators
- ✓ Appropriate input types
        `
      }
    }
  }
}; 