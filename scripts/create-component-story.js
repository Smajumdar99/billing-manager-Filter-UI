#!/usr/bin/env node

/**
 * DrCloud EHR Design System - Component Story Generator
 * 
 * This script helps developers create new component stories following
 * the established patterns and healthcare-specific documentation standards.
 * 
 * Usage: node scripts/create-component-story.js <ComponentName> <AtomicLevel>
 * Example: node scripts/create-component-story.js Badge atoms
 */

const fs = require('fs');
const path = require('path');

// Get command line arguments
const [, , componentName, atomicLevel] = process.argv;

if (!componentName || !atomicLevel) {
  console.error('❌ Usage: node scripts/create-component-story.js <ComponentName> <AtomicLevel>');
  console.error('   Example: node scripts/create-component-story.js Badge atoms');
  console.error('   Atomic levels: atoms, molecules, organisms, templates');
  process.exit(1);
}

// Validate atomic level
const validLevels = ['atoms', 'molecules', 'organisms', 'templates'];
if (!validLevels.includes(atomicLevel)) {
  console.error(`❌ Invalid atomic level: ${atomicLevel}`);
  console.error(`   Valid levels: ${validLevels.join(', ')}`);
  process.exit(1);
}

// Create component directory path
const componentDir = path.join('src', 'components', atomicLevel, componentName);
const storyPath = path.join(componentDir, `${componentName}.stories.tsx`);

// Check if component directory exists
if (!fs.existsSync(componentDir)) {
  console.error(`❌ Component directory does not exist: ${componentDir}`);
  console.error('   Please create the component first, then run this script.');
  process.exit(1);
}

// Check if story already exists
if (fs.existsSync(storyPath)) {
  console.error(`❌ Story already exists: ${storyPath}`);
  process.exit(1);
}

// Generate story template based on atomic level
const generateStoryTemplate = (componentName, atomicLevel) => {
  const capitalizedLevel = atomicLevel.charAt(0).toUpperCase() + atomicLevel.slice(0, -1);
  
  const descriptions = {
    atoms: {
      description: 'A fundamental building block component used throughout the DrCloud EHR system.',
      principles: [
        '**Simplicity**: Single responsibility and clear purpose',
        '**Reusability**: Can be used across multiple contexts',
        '**Accessibility**: Full keyboard and screen reader support',
        '**Consistency**: Follows design system tokens and patterns'
      ],
      whenToUse: [
        'As a basic interactive element in forms and interfaces',
        'When you need consistent styling across the application',
        'For building more complex molecules and organisms',
        'In any context requiring this specific functionality'
      ],
      whenNotToUse: [
        'For complex interactions (use molecules or organisms)',
        'When you need multiple related elements (combine into molecules)',
        'For page-level layouts (use templates)',
        'When existing components already serve the purpose'
      ]
    },
    molecules: {
      description: 'A combination of atoms that function together as a cohesive unit in the DrCloud EHR system.',
      principles: [
        '**Cohesion**: Atoms work together for a single purpose',
        '**Medical Context**: Designed for healthcare workflows',
        '**Reusability**: Can be used in multiple organisms and templates',
        '**Accessibility**: Maintains focus management and screen reader support'
      ],
      whenToUse: [
        'When combining multiple atoms for a specific function',
        'For common UI patterns in healthcare applications',
        'As building blocks for more complex organisms',
        'When you need consistent grouped functionality'
      ],
      whenNotToUse: [
        'For single-purpose elements (use atoms)',
        'For complete page sections (use organisms)',
        'For page layouts (use templates)',
        'When atoms alone are sufficient'
      ]
    },
    organisms: {
      description: 'A complex component made of molecules and atoms that represents a distinct section of the DrCloud EHR interface.',
      principles: [
        '**Complexity**: Handles sophisticated healthcare workflows',
        '**Integration**: Combines multiple molecules and atoms effectively',
        '**Medical Workflows**: Designed for specific healthcare processes',
        '**Data Management**: Handles complex state and data interactions'
      ],
      whenToUse: [
        'For complete interface sections (headers, sidebars, forms)',
        'When managing complex state and data interactions',
        'For healthcare-specific workflows and processes',
        'As major building blocks for page templates'
      ],
      whenNotToUse: [
        'For simple UI elements (use atoms)',
        'For basic combinations (use molecules)',
        'For complete page layouts (use templates)',
        'When simpler components can achieve the goal'
      ]
    },
    templates: {
      description: 'A page-level layout that combines organisms to create complete interface structures for the DrCloud EHR system.',
      principles: [
        '**Layout Structure**: Defines overall page organization',
        '**Responsive Design**: Works across all device sizes',
        '**Healthcare Workflows**: Optimized for medical processes',
        '**Consistency**: Maintains layout patterns across the application'
      ],
      whenToUse: [
        'For complete page layouts and structures',
        'When defining consistent layout patterns',
        'For organizing complex healthcare interfaces',
        'As the foundation for specific page implementations'
      ],
      whenNotToUse: [
        'For individual components (use atoms, molecules, or organisms)',
        'For partial page sections (use organisms)',
        'When existing templates already serve the purpose',
        'For simple component combinations'
      ]
    }
  };

  const levelInfo = descriptions[atomicLevel] || descriptions.atoms;

  return `import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { ${componentName} } from './${componentName}';

/**
 * ## ${componentName} Component
 * 
 * ${levelInfo.description}
 * 
 * ### Design Principles
${levelInfo.principles.map(principle => ` * - ${principle}`).join('\n')}
 * 
 * ### When to Use
${levelInfo.whenToUse.map(use => ` * - ${use}`).join('\n')}
 * 
 * ### When Not to Use
${levelInfo.whenNotToUse.map(notUse => ` * - ${notUse}`).join('\n')}
 */
const meta: Meta<typeof ${componentName}> = {
  title: '${capitalizedLevel}s/${componentName}',
  component: ${componentName},
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: \`
The ${componentName} component is built with healthcare workflows in mind, providing consistent styling and accessibility features for the DrCloud EHR system.

### Accessibility Features
- Proper focus management with visible focus indicators
- Screen reader support with semantic HTML
- Keyboard navigation support
- High contrast support for medical environments
- WCAG 2.1 AA compliant color contrast ratios

### Technical Implementation
- Built with TypeScript for type safety
- Uses Tailwind CSS for consistent styling
- Supports ref forwarding for advanced use cases
- Optimized for performance with minimal re-renders
- Follows atomic design principles

### Healthcare Context
This component is designed specifically for medical applications where clarity, accessibility, and error prevention are critical for patient safety.
        \`
      }
    }
  },
  tags: ['autodocs'],
  argTypes: {
    // TODO: Add comprehensive prop documentation
    className: {
      control: 'text',
      description: 'Additional CSS classes to apply to the component',
      table: {
        type: { summary: 'string' },
        category: 'Styling',
      },
    },
    children: {
      control: 'text',
      description: 'The content to be rendered inside the component',
      table: {
        type: { summary: 'ReactNode' },
        category: 'Content',
      },
    },
    // TODO: Add more specific prop types based on your component
  },
  args: {
    // TODO: Add default args
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * The default ${componentName.toLowerCase()} style used throughout the EHR system.
 * This represents the most common usage pattern.
 */
export const Default: Story = {
  args: {
    // TODO: Add default story args
    children: '${componentName} Content',
  },
};

/**
 * Example showing the ${componentName.toLowerCase()} in a healthcare context.
 * Demonstrates proper usage within medical workflows.
 */
export const HealthcareExample: Story = {
  args: {
    // TODO: Add healthcare-specific example
    children: 'Patient Information',
  },
  parameters: {
    docs: {
      description: {
        story: \`
**Healthcare Context**: This example shows how the ${componentName} component is used in typical medical workflows.

**Best Practices:**
- Use clear, medical-appropriate language
- Ensure accessibility for all users
- Follow HIPAA compliance guidelines
- Provide clear visual hierarchy
- Consider mobile and tablet usage

**Implementation Example:**
\\\`\\\`\\\`tsx
<${componentName}>
  Patient Record: John Doe (MRN: 12345)
</${componentName}>
\\\`\\\`\\\`
        \`
      }
    }
  }
};

/**
 * Disabled state for when the ${componentName.toLowerCase()} cannot be interacted with.
 * Important for preventing errors in medical contexts.
 */
export const Disabled: Story = {
  args: {
    disabled: true,
    children: 'Disabled ${componentName}',
  },
  parameters: {
    docs: {
      description: {
        story: \`
**Disabled State**: Use when the component should not be interactive.

**Medical Use Cases:**
- When user lacks permissions to modify patient data
- During form submission to prevent double-submission
- When dependent fields are not yet completed
- For read-only system-generated information

**Accessibility**: Ensure disabled components are still announced by screen readers with appropriate context.
        \`
      }
    }
  }
};

/**
 * Error state showing validation or system errors.
 * Critical for preventing medical errors and data corruption.
 */
export const WithError: Story = {
  args: {
    // TODO: Add error state styling
    className: 'border-red-500 text-red-700',
    children: 'Error: Invalid patient data',
  },
  parameters: {
    docs: {
      description: {
        story: \`
**Error Handling**: Clear error states are crucial in healthcare applications.

**Error Prevention Guidelines:**
- Provide clear, actionable error messages
- Use appropriate error colors (red) consistently
- Include specific guidance on how to fix errors
- Validate data in real-time when possible
- Never allow invalid medical data to be saved

**Implementation:**
\\\`\\\`\\\`tsx
<${componentName} 
  className="border-red-500 text-red-700"
  aria-invalid="true"
  aria-describedby="error-message"
>
  Invalid Data
</${componentName}>
<p id="error-message" className="text-red-500 text-sm">
  Please enter a valid medical record number
</p>
\\\`\\\`\\\`
        \`
      }
    }
  }
};

/**
 * Loading state for async operations.
 * Common in EHR systems where data operations may take time.
 */
export const Loading: Story = {
  args: {
    disabled: true,
    children: (
      <>
        <span className="animate-spin mr-2">⏳</span>
        Loading patient data...
      </>
    ),
  },
  parameters: {
    docs: {
      description: {
        story: \`
**Loading States**: Provide clear feedback during async operations.

**Healthcare Considerations:**
- Medical data operations may take time
- Users need clear feedback about system status
- Prevent user actions during data loading
- Show specific loading context when possible

**Best Practices:**
- Use loading indicators for operations > 200ms
- Disable interactions during loading
- Provide specific loading messages
- Consider skeleton loading for better UX
        \`
      }
    }
  }
};

/**
 * Responsive behavior demonstration showing how the component
 * adapts to different screen sizes used in healthcare settings.
 */
export const Responsive: Story = {
  render: () => (
    <div className="space-y-4">
      <div className="block sm:hidden">
        <${componentName} className="w-full text-center">
          Mobile: Full Width
        </${componentName}>
      </div>
      <div className="hidden sm:block md:hidden">
        <${componentName}>
          Tablet: Standard Size
        </${componentName}>
      </div>
      <div className="hidden md:block">
        <${componentName}>
          Desktop: Compact Size
        </${componentName}>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: \`
**Responsive Design**: Healthcare professionals use various devices.

**Device Considerations:**
- **Mobile**: Larger touch targets, full-width layouts
- **Tablet**: Balanced sizing for touch and precision
- **Desktop**: Compact layouts for efficiency
- **Medical Workstations**: Large screens, potential glove use

**Implementation:**
\\\`\\\`\\\`tsx
<${componentName} 
  className="w-full sm:w-auto md:w-64"
>
  Responsive Content
</${componentName}>
\\\`\\\`\\\`
        \`
      }
    }
  }
};

// TODO: Add more stories as needed:
// - Different variants/sizes
// - Interactive states
// - Complex examples
// - Edge cases
// - Integration examples`;
};

// Generate and write the story file
const storyContent = generateStoryTemplate(componentName, atomicLevel);

try {
  fs.writeFileSync(storyPath, storyContent);
  console.log(`✅ Successfully created story: ${storyPath}`);
  console.log('');
  console.log('📝 Next steps:');
  console.log('1. Update the argTypes with your component\'s specific props');
  console.log('2. Add appropriate default args');
  console.log('3. Customize the healthcare examples');
  console.log('4. Add any additional story variants needed');
  console.log('5. Test the component in Storybook');
  console.log('');
  console.log('🚀 Run Storybook to see your new story:');
  console.log('   npm run storybook');
} catch (error) {
  console.error(`❌ Error creating story: ${error.message}`);
  process.exit(1);
} 