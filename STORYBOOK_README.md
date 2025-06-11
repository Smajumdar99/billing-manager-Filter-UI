# DrCloud EHR Design System - Storybook Documentation

## 🏥 Overview

This Storybook implementation provides a comprehensive component library and design system for the DrCloud EHR application. It follows atomic design principles and healthcare-specific guidelines to ensure consistency, accessibility, and usability across all medical interfaces.

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Modern browser (Chrome 90+, Firefox 88+, Safari 14+, Edge 90+)

### Installation & Setup

```bash
# Install dependencies
npm install

# Start Storybook development server
npm run storybook

# Build Storybook for production
npm run build-storybook
```

Storybook will be available at `http://localhost:6006`

## 🧬 Atomic Design Structure

Our component library follows atomic design methodology:

```
src/components/
├── atoms/           # Basic building blocks (Button, Input, Label)
├── molecules/       # Simple combinations (SearchBar, FormField)
├── organisms/       # Complex components (PatientCard, Navigation)
└── templates/       # Page layouts (DashboardLayout, FormLayout)
```

### Component Story Structure

Each component includes comprehensive documentation:

```typescript
// Component.stories.tsx
export default {
  title: 'Atoms/ComponentName',
  component: Component,
  parameters: {
    docs: {
      description: {
        component: 'Detailed component description...'
      }
    }
  },
  argTypes: {
    // Comprehensive prop documentation
  }
};
```

## 📚 Documentation Standards

### Story Requirements

Each component story must include:

1. **Overview**: What the component does and when to use it
2. **Props API**: Complete TypeScript interface documentation  
3. **Examples**: Common usage patterns and edge cases
4. **Accessibility**: Specific accessibility considerations
5. **Do's and Don'ts**: Clear usage guidelines
6. **Code Examples**: Copy-paste ready code snippets

### Healthcare-Specific Documentation

- **Medical Context**: How the component fits into healthcare workflows
- **Data Safety**: Considerations for patient data handling
- **Compliance**: HIPAA and accessibility compliance notes
- **Error Prevention**: Guidelines for preventing medical errors

## 🎨 Design System Features

### Comprehensive Addons

- **Controls**: Interactive component props testing
- **Actions**: Event handling documentation
- **Accessibility**: WCAG 2.1 AA compliance testing
- **Viewport**: Responsive design testing
- **Backgrounds**: Component testing in different contexts
- **Docs**: Auto-generated documentation
- **Chromatic**: Visual regression testing

### Healthcare-Optimized Configuration

- **Medical Viewports**: Mobile, tablet, desktop, and medical workstation sizes
- **Healthcare Backgrounds**: Medical blue, green, and neutral backgrounds
- **Accessibility Testing**: Enhanced a11y rules for healthcare compliance
- **Touch Targets**: Minimum 44px touch targets for mobile/tablet use

## 🔧 Component Development Workflow

### 1. Create Component

```typescript
// src/components/atoms/NewComponent/NewComponent.tsx
import { forwardRef } from 'react';
import { cn } from '@/lib/utils';

export interface NewComponentProps {
  // Define props with JSDoc comments
}

const NewComponent = forwardRef<HTMLElement, NewComponentProps>(
  ({ className, ...props }, ref) => {
    return (
      <div
        className={cn('base-styles', className)}
        ref={ref}
        {...props}
      />
    );
  }
);

NewComponent.displayName = 'NewComponent';
export { NewComponent };
```

### 2. Create Stories

```typescript
// src/components/atoms/NewComponent/NewComponent.stories.tsx
import type { Meta, StoryObj } from '@storybook/react';
import { NewComponent } from './NewComponent';

const meta: Meta<typeof NewComponent> = {
  title: 'Atoms/NewComponent',
  component: NewComponent,
  parameters: {
    docs: {
      description: {
        component: 'Comprehensive component description...'
      }
    }
  },
  tags: ['autodocs'],
  argTypes: {
    // Define all props with descriptions
  }
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    // Default props
  }
};
```

### 3. Export Component

```typescript
// src/components/atoms/NewComponent/index.ts
export { NewComponent } from './NewComponent';
export type { NewComponentProps } from './NewComponent';
```

## 🎯 Best Practices

### Component Design

✅ **Do:**
- Follow atomic design principles
- Use TypeScript for type safety
- Include comprehensive prop documentation
- Implement proper accessibility features
- Support ref forwarding
- Use design tokens consistently

❌ **Don't:**
- Create overly complex atomic components
- Hard-code colors or spacing values
- Ignore accessibility requirements
- Skip prop validation
- Create components without stories

### Story Writing

✅ **Do:**
- Include multiple story variants
- Document all props thoroughly
- Provide healthcare-specific examples
- Include accessibility considerations
- Show error and loading states
- Demonstrate responsive behavior

❌ **Don't:**
- Create stories without documentation
- Skip edge cases and error states
- Use generic examples (use medical context)
- Ignore mobile/tablet considerations
- Forget to test with screen readers

### Healthcare Considerations

✅ **Do:**
- Use medical terminology appropriately
- Consider patient data sensitivity
- Implement proper error prevention
- Follow HIPAA compliance guidelines
- Test with healthcare professionals
- Provide clear visual hierarchy

❌ **Don't:**
- Use confusing medical abbreviations
- Create error-prone interfaces
- Ignore accessibility standards
- Skip user testing with medical staff
- Use inappropriate colors for medical context

## 🧪 Testing Strategy

### Visual Regression Testing

```bash
# Run Chromatic visual tests
npx chromatic --project-token=<your-token>
```

### Accessibility Testing

- Automated a11y testing with @storybook/addon-a11y
- Manual testing with screen readers
- Keyboard navigation testing
- Color contrast validation

### Component Testing

```bash
# Run component tests
npm run test

# Run tests with coverage
npm run test:coverage
```

## 📱 Responsive Design

### Breakpoints

```css
/* Mobile First Approach */
.component {
  /* Mobile styles (default) */
}

@media (min-width: 768px) {
  /* Tablet styles */
}

@media (min-width: 1024px) {
  /* Desktop styles */
}

@media (min-width: 1920px) {
  /* Medical workstation styles */
}
```

### Touch Targets

- **Mobile/Tablet**: Minimum 44px × 44px
- **Desktop**: Minimum 24px × 24px
- **Medical Workstations**: Consider glove use

## 🎨 Design Tokens

### Usage

```typescript
// Use design tokens in components
const Button = styled.button`
  background-color: hsl(var(--primary));
  color: hsl(var(--primary-foreground));
  padding: var(--space-3) var(--space-6);
  border-radius: var(--radius-md);
`;
```

### Categories

- **Colors**: Primary, secondary, status, neutral
- **Typography**: Font families, sizes, weights, line heights
- **Spacing**: Consistent spacing scale
- **Borders**: Border radius values
- **Shadows**: Elevation system
- **Animations**: Duration and easing values

## 🔄 Chromatic Integration

### Setup

1. Create Chromatic account
2. Install Chromatic CLI: `npm install --save-dev chromatic`
3. Add project token to environment variables
4. Configure CI/CD pipeline

### Visual Testing Workflow

```bash
# Publish to Chromatic
npx chromatic --project-token=<token>

# Auto-accept changes (use carefully)
npx chromatic --auto-accept-changes

# Only run on specific stories
npx chromatic --only-story-names="Button/*"
```

## 📋 Checklist for New Components

### Development Checklist

- [ ] Component follows atomic design principles
- [ ] TypeScript interfaces are complete
- [ ] Component supports ref forwarding
- [ ] Accessibility attributes are included
- [ ] Design tokens are used consistently
- [ ] Component is responsive
- [ ] Error states are handled

### Story Checklist

- [ ] Default story is included
- [ ] All variants are documented
- [ ] Props are fully documented
- [ ] Healthcare examples are provided
- [ ] Accessibility notes are included
- [ ] Do's and don'ts are listed
- [ ] Code examples are provided
- [ ] Responsive behavior is shown

### Testing Checklist

- [ ] Visual regression tests pass
- [ ] Accessibility tests pass
- [ ] Component tests are written
- [ ] Manual testing completed
- [ ] Cross-browser testing done
- [ ] Mobile/tablet testing completed

## 🚀 Deployment

### Build for Production

```bash
# Build static Storybook
npm run build-storybook

# Deploy to hosting service
# (Netlify, Vercel, GitHub Pages, etc.)
```

### CI/CD Integration

```yaml
# .github/workflows/storybook.yml
name: Build and Deploy Storybook
on:
  push:
    branches: [main]
jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
      - run: npm ci
      - run: npm run build-storybook
      - run: npx chromatic --project-token=${{ secrets.CHROMATIC_PROJECT_TOKEN }}
```

## 📞 Support & Contributing

### Getting Help

- **Documentation**: Browse this Storybook for comprehensive guides
- **Issues**: Report bugs and request features on GitHub
- **Discussions**: Join team discussions for design decisions
- **Code Reviews**: All changes go through peer review

### Contributing Guidelines

1. Follow the component development workflow
2. Include comprehensive tests and documentation
3. Ensure accessibility compliance
4. Test with healthcare professionals when possible
5. Update design system documentation

### Code Review Process

1. Create feature branch
2. Develop component with stories
3. Run tests and accessibility checks
4. Submit pull request
5. Address review feedback
6. Merge after approval

---

## 📈 Metrics & Analytics

### Storybook Usage

- Component adoption rates
- Most viewed stories
- Documentation engagement
- Developer feedback

### Design System Health

- Component consistency scores
- Accessibility compliance rates
- Visual regression test results
- Performance metrics

---

*Built with ❤️ for healthcare professionals by the DrCloud team*

**Version**: 1.0.0  
**Last Updated**: December 2024  
**Storybook Version**: 9.0.1 