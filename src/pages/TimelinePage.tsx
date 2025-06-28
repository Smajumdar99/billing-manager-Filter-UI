import React from 'react';
import { PatientTimeline } from '@/components/organisms/PatientTimeline';

/**
 * Timeline Page Component
 * 
 * Main page component for displaying patient timeline view
 */
const TimelinePage: React.FC = () => {
  return (
    <div className="h-screen flex flex-col overflow-hidden">
      {/* Patient Timeline View */}
      <PatientTimeline />
    </div>
  );
};

export default TimelinePage; 