import React from 'react';
import { Icon } from '@/components/atoms/Icon';

/**
 * FontAwesome Icons Example Component
 * 
 * This component demonstrates how to use FontAwesome icons in the drcloud-ehr project.
 * It shows various healthcare-specific icons and common UI icons.
 */
export const FontAwesomeExample: React.FC = () => {
  return (
    <div className="p-8 space-y-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">FontAwesome Icons Example</h1>
        
        {/* Healthcare Icons */}
        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Healthcare Icons</h2>
          <div className="grid grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-4">
            <div className="flex flex-col items-center p-4 border rounded-lg">
              <Icon icon="stethoscope" size="2x" className="text-blue-600 mb-2" />
              <span className="text-xs text-center">stethoscope</span>
            </div>
            <div className="flex flex-col items-center p-4 border rounded-lg">
              <Icon icon="heart" size="2x" className="text-red-500 mb-2" />
              <span className="text-xs text-center">heart</span>
            </div>
            <div className="flex flex-col items-center p-4 border rounded-lg">
              <Icon icon="pills" size="2x" className="text-green-600 mb-2" />
              <span className="text-xs text-center">pills</span>
            </div>
            <div className="flex flex-col items-center p-4 border rounded-lg">
              <Icon icon="user-md" size="2x" className="text-blue-700 mb-2" />
              <span className="text-xs text-center">user-md</span>
            </div>
            <div className="flex flex-col items-center p-4 border rounded-lg">
              <Icon icon="hospital" size="2x" className="text-gray-600 mb-2" />
              <span className="text-xs text-center">hospital</span>
            </div>
            <div className="flex flex-col items-center p-4 border rounded-lg">
              <Icon icon="ambulance" size="2x" className="text-red-600 mb-2" />
              <span className="text-xs text-center">ambulance</span>
            </div>
            <div className="flex flex-col items-center p-4 border rounded-lg">
              <Icon icon="clipboard" size="2x" className="text-amber-600 mb-2" />
              <span className="text-xs text-center">clipboard</span>
            </div>
            <div className="flex flex-col items-center p-4 border rounded-lg">
              <Icon icon="file-alt" size="2x" className="text-blue-500 mb-2" />
              <span className="text-xs text-center">file-alt</span>
            </div>
          </div>
        </section>

        {/* Common UI Icons */}
        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Common UI Icons</h2>
          <div className="grid grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-4">
            <div className="flex flex-col items-center p-4 border rounded-lg">
              <Icon icon="user" size="2x" className="text-gray-600 mb-2" />
              <span className="text-xs text-center">user</span>
            </div>
            <div className="flex flex-col items-center p-4 border rounded-lg">
              <Icon icon="calendar" size="2x" className="text-blue-600 mb-2" />
              <span className="text-xs text-center">calendar</span>
            </div>
            <div className="flex flex-col items-center p-4 border rounded-lg">
              <Icon icon="home" size="2x" className="text-green-600 mb-2" />
              <span className="text-xs text-center">home</span>
            </div>
            <div className="flex flex-col items-center p-4 border rounded-lg">
              <Icon icon="chart-bar" size="2x" className="text-purple-600 mb-2" />
              <span className="text-xs text-center">chart-bar</span>
            </div>
            <div className="flex flex-col items-center p-4 border rounded-lg">
              <Icon icon="cog" size="2x" className="text-gray-500 mb-2" />
              <span className="text-xs text-center">cog</span>
            </div>
            <div className="flex flex-col items-center p-4 border rounded-lg">
              <Icon icon="bell" size="2x" className="text-yellow-500 mb-2" />
              <span className="text-xs text-center">bell</span>
            </div>
            <div className="flex flex-col items-center p-4 border rounded-lg">
              <Icon icon="search" size="2x" className="text-blue-500 mb-2" />
              <span className="text-xs text-center">search</span>
            </div>
            <div className="flex flex-col items-center p-4 border rounded-lg">
              <Icon icon="filter" size="2x" className="text-indigo-500 mb-2" />
              <span className="text-xs text-center">filter</span>
            </div>
          </div>
        </section>

        {/* Interactive Examples */}
        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Interactive Examples</h2>
          <div className="space-y-4">
            <div className="flex items-center space-x-4 p-4 border rounded-lg">
              <Icon icon="spinner" spin className="text-blue-600" />
              <span>Spinning icon (loading state)</span>
            </div>
            <div className="flex items-center space-x-4 p-4 border rounded-lg">
              <Icon icon="heart" pulse className="text-red-500" />
              <span>Pulsing icon (heartbeat effect)</span>
            </div>
            <div className="flex items-center space-x-4 p-4 border rounded-lg">
              <Icon 
                icon="cog" 
                className="text-gray-600 hover:text-blue-600 transition-colors cursor-pointer" 
                onClick={() => alert('Settings clicked!')}
              />
              <span>Clickable icon (hover to see effect)</span>
            </div>
          </div>
        </section>

        {/* Size Examples */}
        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Size Examples</h2>
          <div className="flex items-center space-x-6 p-4 border rounded-lg">
            <div className="text-center">
              <Icon icon="stethoscope" size="xs" className="text-blue-600" />
              <div className="text-xs mt-1">xs</div>
            </div>
            <div className="text-center">
              <Icon icon="stethoscope" size="sm" className="text-blue-600" />
              <div className="text-xs mt-1">sm</div>
            </div>
            <div className="text-center">
              <Icon icon="stethoscope" size="1x" className="text-blue-600" />
              <div className="text-xs mt-1">1x</div>
            </div>
            <div className="text-center">
              <Icon icon="stethoscope" size="lg" className="text-blue-600" />
              <div className="text-xs mt-1">lg</div>
            </div>
            <div className="text-center">
              <Icon icon="stethoscope" size="2x" className="text-blue-600" />
              <div className="text-xs mt-1">2x</div>
            </div>
            <div className="text-center">
              <Icon icon="stethoscope" size="3x" className="text-blue-600" />
              <div className="text-xs mt-1">3x</div>
            </div>
          </div>
        </section>

        {/* Usage Code Examples */}
        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Usage Examples</h2>
          <div className="bg-gray-100 p-4 rounded-lg">
            <pre className="text-sm overflow-x-auto">
{`// Basic usage
<Icon icon="stethoscope" className="text-blue-600" />

// With size
<Icon icon="heart" size="2x" className="text-red-500" />

// Spinning/animated
<Icon icon="spinner" spin className="text-blue-600" />
<Icon icon="heart" pulse className="text-red-500" />

// Clickable
<Icon 
  icon="cog" 
  className="cursor-pointer hover:text-blue-600" 
  onClick={() => handleSettingsClick()}
/>

// In buttons
<button className="flex items-center space-x-2">
  <Icon icon="plus" />
  <span>Add Patient</span>
</button>`}
            </pre>
          </div>
        </section>
      </div>
    </div>
  );
};

export default FontAwesomeExample;
