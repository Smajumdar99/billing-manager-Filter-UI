import type { Preview } from '@storybook/react-vite'
import React from 'react'
import '../src/index.css' // Import Tailwind CSS and global styles

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    docs: {
      toc: true,
    },
    backgrounds: {
      default: 'light',
      values: [
        {
          name: 'light',
          value: '#ffffff',
        },
        {
          name: 'dark',
          value: '#333333',
        },
        {
          name: 'medical-blue',
          value: '#f0f9ff',
        },
      ],
    },
    viewport: {
      viewports: {
        mobile: {
          name: 'Mobile',
          styles: {
            width: '375px',
            height: '667px',
          },
        },
        tablet: {
          name: 'Tablet',
          styles: {
            width: '768px',
            height: '1024px',
          },
        },
        desktop: {
          name: 'Desktop',
          styles: {
            width: '1440px',
            height: '900px',
          },
        },
        medicalWorkstation: {
          name: 'Medical Workstation',
          styles: {
            width: '1920px',
            height: '1080px',
          },
        },
      },
    },
  },

  // Global decorators for consistent styling
  decorators: [
    (Story) => React.createElement(
      'div',
      { className: 'font-sans antialiased' },
      React.createElement(Story)
    ),
  ],
};

export default preview;