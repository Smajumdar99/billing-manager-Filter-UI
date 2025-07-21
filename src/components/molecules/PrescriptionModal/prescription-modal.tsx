import React, { useState } from 'react';
import { Dialog, DialogContent, DialogTitle, DialogDescription } from '@/components/atoms/Dialog/dialog';
import { Button } from '@/components/atoms/Button';
import {
  BeakerIcon,
  ListBulletIcon,
  DocumentTextIcon,
  ComputerDesktopIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';
import { cn } from '@/lib/utils';

interface PrescriptionModalProps {
  isOpen: boolean;
  onClose: () => void;
  patientName?: string;
}

type TabType = 'list' | 'rx-dispense' | 'eprescription';

interface Tab {
  id: TabType;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}

const tabs: Tab[] = [
  {
    id: 'list',
    label: 'List',
    icon: ListBulletIcon,
  },
  {
    id: 'rx-dispense',
    label: 'Rx/Dispense',
    icon: DocumentTextIcon,
  },
  {
    id: 'eprescription',
    label: 'ePrescription',
    icon: ComputerDesktopIcon,
  },
];

/**
 * PrescriptionModal Component
 * 
 * A comprehensive prescription management modal with three main tabs:
 * - List: Shows existing prescriptions
 * - Rx/Dispense: Prescription management tools
 * - ePrescription: Integrated DrFirst ePrescription system
 */
const PrescriptionModal: React.FC<PrescriptionModalProps> = ({
  isOpen,
  onClose,
  patientName,
}) => {
  // Default to ePrescription tab as requested
  const [activeTab, setActiveTab] = useState<TabType>('eprescription');

  const renderTabContent = () => {
    switch (activeTab) {
      case 'list':
        return (
          <div className="flex-1 overflow-y-auto p-6">
            <div className="text-center py-12">
              <ListBulletIcon className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Prescription List</h3>
              <p className="text-gray-600 mb-6">
                View and manage existing prescriptions for {patientName || 'this patient'}.
              </p>
              <div className="bg-blue-50 rounded-lg p-4 text-left max-w-md mx-auto">
                <h4 className="font-medium text-blue-900 mb-2">Coming Soon:</h4>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• View prescription history</li>
                  <li>• Track medication adherence</li>
                  <li>• Manage refill requests</li>
                  <li>• Monitor drug interactions</li>
                </ul>
              </div>
            </div>
          </div>
        );

      case 'rx-dispense':
        return (
          <div className="flex-1 overflow-y-auto p-6">
            <div className="text-center py-12">
              <DocumentTextIcon className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Rx/Dispense Management</h3>
              <p className="text-gray-600 mb-6">
                Comprehensive prescription and dispensing tools for healthcare providers.
              </p>
              <div className="bg-green-50 rounded-lg p-4 text-left max-w-md mx-auto">
                <h4 className="font-medium text-green-900 mb-2">Features Include:</h4>
                <ul className="text-sm text-green-800 space-y-1">
                  <li>• Create new prescriptions</li>
                  <li>• Dosage calculations</li>
                  <li>• Drug allergy alerts</li>
                  <li>• Pharmacy integration</li>
                  <li>• Insurance verification</li>
                </ul>
              </div>
            </div>
          </div>
        );

      case 'eprescription':
        return (
          <div className="flex-1 flex flex-col overflow-hidden">
            {/* DrFirst ePrescription iframe */}
            <iframe
              src="https://web.staging.drfirst.com/dashboard?siid=1"
              className="w-full flex-1 border-0 rounded-lg"
              title="ePrescription - DrFirst"
              allow="camera; microphone; geolocation"
              sandbox="allow-same-origin allow-scripts allow-popups allow-forms allow-top-navigation"
            />
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[95vw] w-full h-[98vh] max-h-[98vh] overflow-hidden flex flex-col sm:max-w-4xl md:max-w-5xl lg:max-w-6xl xl:max-w-7xl">
        <DialogTitle className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 text-lg sm:text-xl">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="p-1.5 sm:p-2 bg-blue-100 rounded-lg">
              <BeakerIcon className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600" />
            </div>
            <span className="font-semibold">Prescription Management</span>
          </div>
          {patientName && (
            <span className="text-sm sm:text-base font-normal text-gray-600 ml-7 sm:ml-0">
              Patient: {patientName}
            </span>
          )}
        </DialogTitle>
        
        {/* Tab Navigation */}
        <div className="border-b border-gray-200">
          <nav className="flex space-x-2 sm:space-x-4 md:space-x-8 px-1 overflow-x-auto" aria-label="Prescription tabs">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={cn(
                    'flex items-center gap-1 sm:gap-2 py-3 px-2 sm:px-3 border-b-2 font-medium text-xs sm:text-sm transition-colors whitespace-nowrap flex-shrink-0',
                    isActive
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  )}
                  aria-current={isActive ? 'page' : undefined}
                >
                  <Icon className="h-4 w-4 sm:h-5 sm:w-5" />
                  <span className="hidden sm:inline">{tab.label}</span>
                  <span className="sm:hidden">{tab.label.split('/')[0]}</span>
                </button>
              );
            })}
          </nav>
        </div>
        
        {/* Tab Content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {renderTabContent()}
        </div>
        
        {/* Footer - Only show close button for non-iframe tabs */}
        {activeTab !== 'eprescription' && (
          <div className="border-t border-gray-200 px-6 py-4">
            <div className="flex justify-end">
              <Button variant="ghost" onClick={onClose}>
                Close
              </Button>
            </div>
          </div>
        )}
        
        {/* For iframe tab, show a minimal close icon overlay */}
        {activeTab === 'eprescription' && (
          <div className="absolute top-2 right-2 sm:top-4 sm:right-4 z-10">
            <button
              onClick={onClose}
              className="p-2 bg-white/90 backdrop-blur-sm shadow-lg hover:bg-white rounded-full transition-colors"
              aria-label="Close modal"
            >
              <XMarkIcon className="h-5 w-5 text-gray-600 hover:text-gray-800" />
            </button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default PrescriptionModal;
