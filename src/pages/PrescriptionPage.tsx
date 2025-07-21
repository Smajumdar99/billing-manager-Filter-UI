import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  BeakerIcon,
  DocumentTextIcon,
  ComputerDesktopIcon,
  ArrowLeftIcon,
  ListBulletIcon,
  ClipboardDocumentListIcon,
} from '@heroicons/react/24/outline';
import { cn } from '@/lib/utils';

type TabType = 'list' | 'rx-dispense' | 'eprescription';

interface Tab {
  id: TabType;
  label: string;
  mobileLabel: string;
  icon: React.ComponentType<{ className?: string }>;
}

const tabs: Tab[] = [
  {
    id: 'list',
    label: 'List',
    mobileLabel: 'List',
    icon: ListBulletIcon,
  },
  {
    id: 'rx-dispense',
    label: 'Rx/Dispense',
    mobileLabel: 'Rx',
    icon: DocumentTextIcon,
  },
  {
    id: 'eprescription',
    label: 'ePrescription',
    mobileLabel: 'eRx',
    icon: ComputerDesktopIcon,
  },
];

export default function PrescriptionPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const patientName = searchParams.get('patient') || 'Unknown Patient';
  const [activeTab, setActiveTab] = useState<TabType>('list');
  const [iframeLoaded, setIframeLoaded] = useState(false);
  const [iframeError, setIframeError] = useState(false);
  const [loadingTimeout, setLoadingTimeout] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const handleBack = () => {
    navigate(-1);
  };

  const handleIframeLoad = () => {
    setIframeLoaded(true);
    setIframeError(false);
  };

  const handleIframeError = () => {
    setIframeError(true);
    setIframeLoaded(false);
  };

  // Detect mobile device
  useEffect(() => {
    const checkMobile = () => {
      const userAgent = navigator.userAgent.toLowerCase();
      const isMobileDevice = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(userAgent) || 
                            window.innerWidth <= 768;
      setIsMobile(isMobileDevice);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Reset iframe state when tab changes
  useEffect(() => {
    setIframeLoaded(false);
    setIframeError(false);
    setLoadingTimeout(false);
  }, [activeTab]);

  // Set timeout for iframe loading on mobile
  useEffect(() => {
    if (activeTab === 'eprescription' && !iframeLoaded && !iframeError) {
      const timer = setTimeout(() => {
        if (!iframeLoaded) {
          setLoadingTimeout(true);
        }
      }, 8000); // 8 second timeout for mobile
      
      return () => clearTimeout(timer);
    }
  }, [activeTab, iframeLoaded, iframeError]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile Header */}
      <div className="bg-white border-b border-gray-200 px-4 py-3">
        <div className="flex items-center gap-3">
          <button
            onClick={handleBack}
            className="p-2 -ml-2 rounded-lg hover:bg-gray-100 transition-colors"
            aria-label="Go back"
          >
            <ArrowLeftIcon className="h-5 w-5 text-gray-600" />
          </button>
          <div className="flex items-center gap-2">
            <BeakerIcon className="h-5 w-5 text-blue-600" />
            <div>
              <h1 className="text-lg font-semibold text-gray-900">Prescription Management</h1>
              <p className="text-sm text-gray-600">Patient: {patientName}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Tab Navigation */}
      <div className="bg-white border-b border-gray-200 px-4">
        <div className="flex space-x-2 overflow-x-auto">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  'flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 whitespace-nowrap flex-shrink-0 transition-colors',
                  isActive
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                )}
              >
                <Icon className="h-4 w-4" />
                {tab.mobileLabel}
              </button>
            );
          })}
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 p-4">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 h-[calc(100vh-200px)] relative overflow-hidden">
          {/* Content based on active tab */}
          {activeTab === 'eprescription' ? (
            <>
              {/* Loading State for iframe */}
              {!iframeLoaded && !iframeError && !loadingTimeout && (
                <div className="absolute inset-0 flex items-center justify-center bg-gray-50">
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-sm text-gray-600">Loading prescription interface...</p>
                    {isMobile && (
                      <p className="text-xs text-gray-500 mt-2">This may take longer on mobile devices</p>
                    )}
                  </div>
                </div>
              )}
              
              {/* Timeout State for mobile */}
              {loadingTimeout && !iframeLoaded && (
                <div className="absolute inset-0 flex items-center justify-center bg-gray-50">
                  <div className="text-center p-6">
                    <ClipboardDocumentListIcon className="h-12 w-12 text-amber-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Prescription Interface Loading</h3>
                    <p className="text-sm text-gray-600 mb-4">
                      The prescription system is taking longer than usual to load on mobile.
                    </p>
                    <div className="space-y-3">
                      <button
                        onClick={() => {
                          window.open('https://demo.rcopia.com/External/Iframe.aspx', '_blank');
                        }}
                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 mr-3"
                      >
                        Open in New Tab
                      </button>
                      <button
                        onClick={() => {
                          setLoadingTimeout(false);
                          setIframeLoaded(false);
                          setIframeError(false);
                        }}
                        className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                      >
                        Try Again
                      </button>
                    </div>
                  </div>
                </div>
              )}
              
              {/* Error State for iframe */}
              {iframeError && (
                <div className="absolute inset-0 flex items-center justify-center bg-gray-50">
                  <div className="text-center p-6">
                    <DocumentTextIcon className="h-12 w-12 text-red-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Unable to load prescription interface</h3>
                    <p className="text-sm text-gray-600 mb-4">
                      {isMobile 
                        ? "The prescription system has mobile compatibility issues. Try opening in a new tab."
                        : "The prescription system is currently unavailable."
                      }
                    </p>
                    <div className="space-y-3">
                      {isMobile && (
                        <button
                          onClick={() => {
                            window.open('https://demo.rcopia.com/External/Iframe.aspx', '_blank');
                          }}
                          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 mr-3"
                        >
                          Open in New Tab
                        </button>
                      )}
                      <button
                        onClick={() => {
                          setIframeError(false);
                          setIframeLoaded(false);
                          setLoadingTimeout(false);
                        }}
                        className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                      >
                        Try Again
                      </button>
                    </div>
                  </div>
                </div>
              )}
              
              {/* ePrescription iframe */}
              <iframe
                key={activeTab}
                src="https://demo.rcopia.com/External/Iframe.aspx"
                className={cn(
                  "w-full h-full rounded-lg border-0",
                  (!iframeLoaded || iframeError) && "opacity-0"
                )}
                title={`ePrescription for ${patientName}`}
                sandbox="allow-same-origin allow-scripts allow-forms allow-popups allow-popups-to-escape-sandbox allow-top-navigation"
                loading="eager"
                onLoad={handleIframeLoad}
                onError={handleIframeError}
                referrerPolicy="strict-origin-when-cross-origin"
                allow="clipboard-write; clipboard-read"
              />
            </>
          ) : (
            /* Placeholder content for List and Rx/Dispense tabs */
            <div className="flex items-center justify-center h-full bg-gray-50">
              <div className="text-center p-8">
                {activeTab === 'list' && (
                  <>
                    <ListBulletIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">Prescription List</h3>
                    <p className="text-gray-600 mb-4">View and manage prescription history for {patientName}</p>
                    <div className="bg-white rounded-lg border border-gray-200 p-4 text-left max-w-md">
                      <h4 className="font-medium text-gray-900 mb-2">Recent Prescriptions:</h4>
                      <ul className="space-y-2 text-sm text-gray-600">
                        <li className="flex justify-between">
                          <span>Metformin 500mg</span>
                          <span className="text-gray-400">2 days ago</span>
                        </li>
                        <li className="flex justify-between">
                          <span>Lisinopril 10mg</span>
                          <span className="text-gray-400">1 week ago</span>
                        </li>
                        <li className="flex justify-between">
                          <span>Atorvastatin 20mg</span>
                          <span className="text-gray-400">2 weeks ago</span>
                        </li>
                      </ul>
                    </div>
                  </>
                )}
                {activeTab === 'rx-dispense' && (
                  <>
                    <DocumentTextIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">Rx/Dispense</h3>
                    <p className="text-gray-600 mb-4">Create and manage prescriptions for {patientName}</p>
                    <div className="bg-white rounded-lg border border-gray-200 p-4 text-left max-w-md">
                      <h4 className="font-medium text-gray-900 mb-2">Quick Actions:</h4>
                      <div className="space-y-2">
                        <button className="w-full text-left px-3 py-2 text-sm bg-blue-50 text-blue-700 rounded-md hover:bg-blue-100 transition-colors">
                          + New Prescription
                        </button>
                        <button className="w-full text-left px-3 py-2 text-sm bg-gray-50 text-gray-700 rounded-md hover:bg-gray-100 transition-colors">
                          📋 Prescription Templates
                        </button>
                        <button className="w-full text-left px-3 py-2 text-sm bg-gray-50 text-gray-700 rounded-md hover:bg-gray-100 transition-colors">
                          🔄 Refill Requests
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
