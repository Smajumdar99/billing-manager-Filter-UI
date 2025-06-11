import type { Meta, StoryObj } from '@storybook/react';
import { Button } from './index';

/**
 * ## Button Component
 * 
 * The Button component is a fundamental interactive element used throughout the DrCloud EHR system.
 * It provides consistent styling, accessibility features, and interaction patterns for user actions.
 * 
 * ### Design Principles
 * - **Accessibility First**: All buttons include proper ARIA attributes and keyboard navigation
 * - **Medical Context**: Designed for healthcare workflows with appropriate visual hierarchy
 * - **Consistency**: Maintains visual consistency across the entire EHR application
 * - **Responsive**: Works seamlessly across all device sizes from mobile to medical workstations
 * 
 * ### When to Use
 * - Primary actions (Save Patient, Submit Form, Create Appointment)
 * - Secondary actions (Cancel, Edit, View Details)
 * - Destructive actions (Delete Record, Remove Patient)
 * - Navigation actions (Next Step, Previous, Continue)
 * 
 * ### When Not to Use
 * - For navigation between pages (use Link component instead)
 * - For toggling states (use Switch or Toggle component)
 * - For selecting from multiple options (use Radio or Checkbox)
 */
const meta: Meta<typeof Button> = {
  title: 'Atoms/Button',
  component: Button,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
The Button component is built on top of Radix UI's Slot component and uses class-variance-authority for consistent styling variants. It supports all standard HTML button attributes and provides additional props for customization.

### Accessibility Features
- Proper focus management with visible focus indicators
- Screen reader support with semantic HTML
- Keyboard navigation (Enter and Space key activation)
- High contrast support for medical environments
- WCAG 2.1 AA compliant color contrast ratios

### Technical Implementation
- Built with TypeScript for type safety
- Uses Tailwind CSS for styling
- Supports ref forwarding for advanced use cases
- Includes hover and active state animations
- Optimized for performance with minimal re-renders
        `
      }
    }
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: { type: 'select' },
      options: ['default', 'destructive', 'outline', 'secondary', 'ghost', 'link'],
      description: 'The visual style variant of the button',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: 'default' },
        category: 'Appearance',
      },
    },
    size: {
      control: { type: 'select' },
      options: ['default', 'sm', 'lg', 'icon'],
      description: 'The size of the button',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: 'default' },
        category: 'Appearance',
      },
    },
    asChild: {
      control: { type: 'boolean' },
      description: 'When true, the button will render as a child element (useful for custom components)',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
        category: 'Advanced',
      },
    },
    disabled: {
      control: { type: 'boolean' },
      description: 'When true, the button is disabled and cannot be interacted with',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
        category: 'State',
      },
    },
    children: {
      control: { type: 'text' },
      description: 'The content to display inside the button',
      table: {
        type: { summary: 'ReactNode' },
        category: 'Content',
      },
    },
    onClick: {
      action: 'clicked',
      description: 'Function called when the button is clicked',
      table: {
        type: { summary: '(event: MouseEvent) => void' },
        category: 'Events',
      },
    },
  },
  args: {
    onClick: () => console.log('Button clicked'),
    children: 'Button',
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * The default button style used for primary actions in the EHR system.
 * Use this for the most important action on a page or form.
 */
export const Default: Story = {
  args: {
    children: 'Save Patient Record',
  },
};

/**
 * Destructive buttons are used for actions that cannot be undone or have serious consequences.
 * Always provide confirmation dialogs for destructive actions in medical contexts.
 */
export const Destructive: Story = {
  args: {
    variant: 'destructive',
    children: 'Delete Patient Record',
  },
  parameters: {
    docs: {
      description: {
        story: `
**⚠️ Use with Caution**: Destructive buttons should always be accompanied by confirmation dialogs in healthcare applications. Consider the impact of irreversible actions on patient data.

**Best Practices:**
- Always show a confirmation dialog
- Clearly explain what will be deleted
- Provide an undo option when possible
- Use specific language (e.g., "Delete Patient Record" not just "Delete")
        `
      }
    }
  }
};

/**
 * Outline buttons are used for secondary actions that are important but not primary.
 * They work well alongside primary buttons in forms and dialogs.
 */
export const Outline: Story = {
  args: {
    variant: 'outline',
    children: 'Edit Patient Info',
  },
};

/**
 * Secondary buttons are used for less prominent actions or when you need
 * multiple buttons with different levels of emphasis.
 */
export const Secondary: Story = {
  args: {
    variant: 'secondary',
    children: 'View History',
  },
};

/**
 * Ghost buttons are subtle and work well for tertiary actions or in dense interfaces
 * like data tables or navigation areas.
 */
export const Ghost: Story = {
  args: {
    variant: 'ghost',
    children: 'More Options',
  },
};

/**
 * Link buttons look like links but behave like buttons. Use for actions that
 * feel like navigation but are actually operations.
 */
export const Link: Story = {
  args: {
    variant: 'link',
    children: 'Learn More',
  },
};

/**
 * Small buttons are used in compact interfaces like table rows, cards, or toolbars.
 */
export const Small: Story = {
  args: {
    size: 'sm',
    children: 'Quick Action',
  },
};

/**
 * Large buttons are used for prominent calls-to-action or in touch interfaces
 * where larger touch targets are beneficial.
 */
export const Large: Story = {
  args: {
    size: 'lg',
    children: 'Start New Patient Visit',
  },
};

/**
 * Icon buttons are square and designed to contain only an icon.
 * Always include proper aria-label for accessibility.
 */
export const Icon: Story = {
  args: {
    size: 'icon',
    children: '⚙️',
    'aria-label': 'Settings',
  },
  parameters: {
    docs: {
      description: {
        story: `
**Accessibility Note**: Icon buttons must include an \`aria-label\` or \`aria-labelledby\` attribute to be accessible to screen readers. The icon alone is not sufficient for users who cannot see it.

**Example with Lucide React icon:**
\`\`\`tsx
<Button size="icon" aria-label="Edit patient">
  <Edit className="h-4 w-4" />
</Button>
\`\`\`
        `
      }
    }
  }
};

/**
 * Disabled buttons cannot be interacted with. Use sparingly and provide
 * clear feedback about why the button is disabled.
 */
export const Disabled: Story = {
  args: {
    disabled: true,
    children: 'Save Changes',
  },
  parameters: {
    docs: {
      description: {
        story: `
**UX Guidelines for Disabled Buttons:**
- Provide clear feedback about why the button is disabled
- Consider using tooltips to explain the disabled state
- In forms, validate fields and show specific error messages
- Avoid disabling buttons unnecessarily - users should understand what's required

**Example with tooltip:**
\`\`\`tsx
<Tooltip content="Please fill in all required fields">
  <Button disabled>Save Patient</Button>
</Tooltip>
\`\`\`
        `
      }
    }
  }
};

/**
 * Loading state example showing how to handle async operations.
 * This pattern is common in EHR systems where data operations may take time.
 */
export const Loading: Story = {
  args: {
    disabled: true,
    children: (
      <>
        <span className="animate-spin mr-2">⏳</span>
        Saving Patient...
      </>
    ),
  },
  parameters: {
    docs: {
      description: {
        story: `
**Loading State Pattern**: When performing async operations, disable the button and show loading feedback. This prevents double-submissions and provides clear user feedback.

**Implementation Example:**
\`\`\`tsx
const [isLoading, setIsLoading] = useState(false);

const handleSave = async () => {
  setIsLoading(true);
  try {
    await savePatientData();
  } finally {
    setIsLoading(false);
  }
};

<Button disabled={isLoading} onClick={handleSave}>
  {isLoading ? (
    <>
      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
      Saving...
    </>
  ) : (
    'Save Patient'
  )}
</Button>
\`\`\`
        `
      }
    }
  }
};

/**
 * Example showing multiple button variants together, demonstrating
 * proper visual hierarchy in a typical EHR form or dialog.
 */
export const ButtonGroup: Story = {
  render: () => (
    <div className="flex gap-3 items-center">
      <Button variant="default">Save & Continue</Button>
      <Button variant="outline">Save as Draft</Button>
      <Button variant="ghost">Cancel</Button>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: `
**Button Hierarchy**: When using multiple buttons together, establish clear visual hierarchy:

1. **Primary Action** (default variant): The main action users should take
2. **Secondary Action** (outline variant): Important alternative action  
3. **Tertiary Action** (ghost variant): Less important or cancel actions

**Spacing**: Use consistent spacing between buttons (typically 12px/0.75rem in medical interfaces for easy touch targets).
        `
      }
    }
  }
};

/**
 * Responsive button example showing how buttons adapt to different screen sizes.
 * Important for EHR systems used on various devices.
 */
export const Responsive: Story = {
  render: () => (
    <div className="space-y-4">
      <div className="block sm:hidden">
        <Button size="lg" className="w-full">
          Mobile: Full Width Large Button
        </Button>
      </div>
      <div className="hidden sm:block md:hidden">
        <Button size="default">
          Tablet: Standard Button
        </Button>
      </div>
      <div className="hidden md:block">
        <Button size="sm">
          Desktop: Compact Button
        </Button>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: `
**Responsive Design**: Buttons should adapt to different screen sizes and input methods:

- **Mobile**: Larger buttons (min 44px height) for touch targets
- **Tablet**: Standard sizing with adequate spacing
- **Desktop**: Can be more compact, optimized for mouse interaction
- **Medical Workstations**: Consider larger screens and potential glove use

**Implementation:**
\`\`\`tsx
<Button 
  size={{ base: 'lg', md: 'default' }}
  className={{ base: 'w-full', md: 'w-auto' }}
>
  Responsive Button
</Button>
\`\`\`
        `
      }
    }
  }
}; 