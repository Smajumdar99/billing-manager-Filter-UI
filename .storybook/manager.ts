// Simple branding configuration for Storybook 9.0
document.title = 'DrCloud Design System';

// Add custom CSS for branding
const style = document.createElement('style');
style.innerHTML = `
  /* Hide the Storybook logo and replace with text */
  .sidebar-header-brand svg {
    display: none !important;
  }
  
  .sidebar-header-brand::before {
    content: '🏥 DrCloud Design System';
    font-size: 16px;
    font-weight: 600;
    color: #2563eb;
    display: block;
    padding: 8px 0;
  }
  
  /* Customize the toolbar */
  .os-content {
    --color-primary: #2563eb;
  }
`;

document.head.appendChild(style); 