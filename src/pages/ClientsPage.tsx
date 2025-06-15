import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ClientsList } from '@/components/molecules/ClientsList';
import TopNavigationBar from '@/components/old-ui/TopNavigationBar';
import MainNavigationBar from '@/components/old-ui/MainNavigationBar';

/**
 * ClientsPage Component
 * 
 * Main page for displaying and selecting clients.
 * Shows a list of patients/clients and navigates to patient view on selection.
 * Includes loading state demonstration for skeleton components.
 */
const ClientsPage: React.FC = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);

  // Simulate loading data on component mount
  useEffect(() => {
    // Simulate API call delay for demonstration
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000); // Show skeleton for 2 seconds

    return () => clearTimeout(timer);
  }, []);

  // Handle patient selection - navigate to OldUI with selected patient
  const handlePatientSelect = (patient: any) => {
    console.log('Patient selected:', patient);
    // The ClientsList component handles navigation internally
  };

  // Handle main navigation
  const handleNavigate = (itemName: string) => {
    console.log('Navigating to:', itemName);
    // Return true to allow normal navigation, false to prevent
    return true;
  };

  return (
    <div className="flex flex-col h-screen bg-background">
      {/* Top Navigation */}
      <TopNavigationBar 
        hospitalName="DrCloud EHR"
        userAvatarUrl="/images/avatars/default-avatar.png"
      />
      
      {/* Main Navigation Bar */}
      <MainNavigationBar 
        activeItem="Clients"
        onNavigate={handleNavigate}
      />
      
      {/* Main Content - Clients List */}
      <div className="flex-1 overflow-hidden">
        <ClientsList 
          onPatientSelect={handlePatientSelect}
          className="h-full"
          isLoading={isLoading}
        />
      </div>
    </div>
  );
};

export default ClientsPage; 