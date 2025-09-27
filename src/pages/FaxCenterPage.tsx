import React, { useState } from 'react';
import TopNavigationBar from '@/components/old-ui/TopNavigationBar';
import MainNavigationBar from '@/components/old-ui/MainNavigationBar';
import { Sidebar } from '@/components/atoms/Sidebar/sidebar';
import IncomingFaxes from '@/components/organisms/IncomingFaxes/incoming-faxes';
import OutgoingFaxes from '@/components/organisms/OutgoingFaxes/outgoing-faxes';
// FontAwesome icons are now handled by the Sidebar component directly
import { mockIncomingFaxes, mockOutgoingFaxes } from '@/data/mockFaxes';
import { IncomingFax, OutgoingFax, FaxActionHandlers, OutgoingFaxActionHandlers } from '@/types/fax';

// Fax Center navigation items configuration
const faxCenterNavItems = [
  { 
    icon: "envelope", 
    label: "Incoming"
  },
  { 
    icon: "upload", 
    label: "Outgoing"
  }
];

/**
 * FaxCenterPage Component
 * 
 * Complete Fax Center page with navigation and sidebar functionality.
 * Uses consistent layout pattern with TopNavigationBar, MainNavigationBar, and Sidebar components.
 * Provides Incoming and Outgoing fax management capabilities.
 * Follows atomic design principles and project patterns.
 */
const FaxCenterPage: React.FC = () => {
  // State management for sidebar navigation
  const [selectedMenu, setSelectedMenu] = useState('Incoming');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  // Handle search functionality from top navigation
  const handleSearch = (searchTerm: string) => {
    console.log('Search term:', searchTerm);
    // TODO: Implement search functionality when needed
  };

  // Handle main navigation clicks
  const handleMainNavigation = (itemName: string) => {
    console.log('Navigate to:', itemName);
    // Allow default navigation behavior
    return true;
  };

  // Handle sidebar menu selection
  const handleMenuSelect = (itemLabel: string) => {
    console.log('Sidebar menu selected:', itemLabel);
    setSelectedMenu(itemLabel);
  };

  // Handle sidebar collapsed state change
  const handleSidebarCollapsedChange = (collapsed: boolean) => {
    setSidebarCollapsed(collapsed);
  };

  // Fax action handlers for behavioral health clinic workflow
  const faxActionHandlers: FaxActionHandlers = {
    onView: (fax: IncomingFax) => {
      console.log('Viewing fax:', fax.id);
      // TODO: Open fax viewer modal/page
      alert(`Opening fax: ${fax.subject}`);
    },
    
    onAssignToPatient: (fax: IncomingFax) => {
      console.log('Assigning fax to patient:', fax.id);
      // TODO: Open patient selection dialog
      alert(`Assigning fax "${fax.subject}" to patient`);
    },
    
    onDownload: (fax: IncomingFax) => {
      console.log('Downloading fax:', fax.id);
      // TODO: Trigger fax download
      alert(`Downloading ${fax.pageCount} pages of fax: ${fax.subject}`);
    },
    
    onAddNotes: (fax: IncomingFax) => {
      console.log('Adding notes to fax:', fax.id);
      // TODO: Open notes dialog
      const notes = prompt('Add notes for this fax:', fax.notes || '');
      if (notes !== null) {
        console.log('Notes updated:', notes);
        // Update fax with new notes
      }
    },
    
    onMarkReviewed: (fax: IncomingFax) => {
      console.log('Marking fax as reviewed:', fax.id);
      // TODO: Update fax status to reviewed
      alert(`Marked fax "${fax.subject}" as reviewed`);
    },
    
    onSetPriority: (fax: IncomingFax, priority) => {
      console.log('Setting fax priority:', fax.id, priority);
      // TODO: Update fax priority
      alert(`Set priority to ${priority} for fax: ${fax.subject}`);
    },
    
    onAssignToStaff: (fax: IncomingFax, staffMember: string) => {
      console.log('Assigning fax to staff:', fax.id, staffMember);
      // TODO: Assign fax to staff member
      alert(`Assigned fax "${fax.subject}" to ${staffMember}`);
    },
    
    onArchive: (fax: IncomingFax) => {
      console.log('Archiving fax:', fax.id);
      // TODO: Archive fax
      alert(`Archived fax: ${fax.subject}`);
    }
  };

  // Action handlers for outgoing fax management
  const outgoingFaxActionHandlers: OutgoingFaxActionHandlers = {
    onView: (fax: OutgoingFax) => {
      console.log('Viewing outgoing fax:', fax.id);
      // TODO: Open fax viewer
      alert(`Viewing fax: ${fax.subject}`);
    },
    
    onEdit: (fax: OutgoingFax) => {
      console.log('Editing outgoing fax:', fax.id);
      // TODO: Open fax editor for drafts
      alert(`Editing draft fax: ${fax.subject}`);
    },
    
    onResend: (fax: OutgoingFax) => {
      console.log('Resending failed fax:', fax.id);
      // TODO: Resend failed fax
      alert(`Resending fax: ${fax.subject}`);
    },
    
    onCancel: (fax: OutgoingFax) => {
      console.log('Cancelling fax:', fax.id);
      // TODO: Cancel queued/sending fax
      const confirmed = confirm(`Cancel sending fax: ${fax.subject}?`);
      if (confirmed) {
        alert('Fax sending cancelled');
      }
    },
    
    onDownload: (fax: OutgoingFax) => {
      console.log('Downloading outgoing fax:', fax.id);
      // TODO: Trigger fax download
      alert(`Downloading ${fax.pageCount} pages of fax: ${fax.subject}`);
    },
    
    onDelete: (fax: OutgoingFax) => {
      console.log('Deleting outgoing fax:', fax.id);
      // TODO: Delete fax (only for drafts/failed)
      const confirmed = confirm(`Delete fax: ${fax.subject}?`);
      if (confirmed) {
        alert('Fax deleted');
      }
    },
    
    onAddNotes: (fax: OutgoingFax) => {
      console.log('Adding notes to outgoing fax:', fax.id);
      // TODO: Open notes dialog
      const notes = prompt('Add notes for this fax:', fax.notes || '');
      if (notes !== null) {
        console.log('Notes updated:', notes);
        // Update fax with new notes
      }
    },
    
    onSetPriority: (fax: OutgoingFax, priority) => {
      console.log('Setting outgoing fax priority:', fax.id, priority);
      // TODO: Update fax priority
      alert(`Set priority to ${priority} for fax: ${fax.subject}`);
    }
  };

  // Handle fax updates
  const handleFaxUpdate = (updatedFax: IncomingFax) => {
    console.log('Fax updated:', updatedFax);
    // TODO: Update fax in state/database
  };

  // Handle outgoing fax updates
  const handleOutgoingFaxUpdate = (updatedFax: OutgoingFax) => {
    console.log('Outgoing fax updated:', updatedFax);
    // TODO: Update fax in state/database
  };

  // Render content based on selected menu
  const renderContent = () => {
    switch (selectedMenu) {
      case 'Incoming':
        return (
          <IncomingFaxes 
            faxes={mockIncomingFaxes}
            actionHandlers={faxActionHandlers}
            onFaxUpdate={handleFaxUpdate}
            className="h-full"
          />
        );
      case 'Outgoing':
        return (
          <OutgoingFaxes 
            faxes={mockOutgoingFaxes}
            actionHandlers={outgoingFaxActionHandlers}
            onFaxUpdate={handleOutgoingFaxUpdate}
            className="h-full"
          />
        );
      default:
        return (
          <div className="text-center py-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Fax Center</h2>
            <p className="text-lg text-gray-600">Select a section from the sidebar</p>
          </div>
        );
    }
  };

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-white">
      {/* Top Navigation Bar */}
      <TopNavigationBar 
        hospitalName="DrCloud EHR"
        userAvatarUrl="/avatar.png"
        onSearch={handleSearch}
      />
      
      {/* Main Navigation Bar */}
      <MainNavigationBar 
        activeItem="Fax Center"
        onNavigate={handleMainNavigation}
      />
      
      {/* Content Area */}
      <div className="flex flex-1">
        {/* Sidebar */}
        <Sidebar 
          items={faxCenterNavItems}
          activeItem={selectedMenu}
          onMenuSelect={handleMenuSelect}
          onSearch={(term) => console.log('Sidebar search:', term)}
          defaultCollapsed={sidebarCollapsed}
          onCollapsedChange={handleSidebarCollapsedChange}
        />

        {/* Main Content Area */}
        <div className="flex-1 bg-gray-50 overflow-hidden">
          {(selectedMenu === 'Incoming' || selectedMenu === 'Outgoing') ? (
            // Full height layout for fax tables
            <div className="h-full p-4">
              {renderContent()}
            </div>
          ) : (
            // Regular content layout for other sections
            <div className="flex-1 overflow-y-auto">
              <div className="max-w-full mx-auto p-6">
                {renderContent()}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FaxCenterPage;
