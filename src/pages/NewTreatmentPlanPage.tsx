import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeftIcon, Bars3Icon, XMarkIcon, CheckIcon, UserIcon, ClipboardDocumentListIcon, CalendarDaysIcon, BeakerIcon, DocumentTextIcon, PrinterIcon, Cog6ToothIcon, TrashIcon } from '@heroicons/react/24/outline';

import { Button } from '@/components/atoms/Button';
import { TopNavigationBar, MainNavigationBar, Sidebar } from '../components/old-ui';
import { Breadcrumb, BreadcrumbItem } from '@/components/atoms/Breadcrumb';

// Import step components
import PlanDetailsStep from '../components/organisms/NewTreatmentPlan/PlanDetailsStep';
import GoalsObjectivesProblemsStep from '../components/organisms/NewTreatmentPlan/GoalsObjectivesProblemsStep';
import StrengthsWeaknessesStep from '../components/organisms/NewTreatmentPlan/StrengthsWeaknessesStep';
import DischargeAgreementsStep from '../components/organisms/NewTreatmentPlan/DischargeAgreementsStep';
import SignaturesStep from '../components/organisms/NewTreatmentPlan/SignaturesStep';

// Import print components
import { TreatmentPlanPrintDialog } from '../components/organisms/TreatmentPlanPrint';

/**
 * NewTreatmentPlanPage Component
 * 
 * A comprehensive 6-step wizard for creating new interdisciplinary treatment plans.
 * Replaces the legacy 20-year-old form with a modern, user-friendly interface.
 * 
 * Features:
 * - 6-step wizard with progress tracking
 * - Auto-save functionality (every 30 seconds)
 * - Form validation and error handling
 * - Mobile-responsive design
 * - Apple-style elegant UI
 * - Draft loading and saving to localStorage
 * - Form validation and auto-save functionality
 * - Apple-style elegant design
 * - Mobile-responsive layout
 * - Professional medical-grade interface
 */

// Treatment Plan Form Data Interface
export interface TreatmentPlanFormData {
  // Step 1: Plan Details
  planName: string;
  planType: 'Initial' | 'Review';
  startDate: string;
  endDate: string;
  dateLastReviewed: string; // For Review Plan type
  patientId: string;
  patientName: string;
  patientLivedName: string;
  patientPronouns: string;
  
  // Step 2: Diagnoses & Facilities
  activeDiagnoses: string[];
  selectedFacilities: string[];
  selectedPrograms: string[];
  
  // Step 3: Goals, Objectives & Problems
  recoveryGoal: string;
  conditions: Array<{
    id: string;
    code: string;
    description: string;
  }>;
  problems: Array<{
    id: string;
    coding: string;
    title: string;
    details: string;
    relatedTo: string;
    beginDate: string;
    endDate: string;
    accessPrograms: string;
    occurrence: string;
    outcome: string;
    comments: string;
    provider: string;
    priority: 'High' | 'Medium' | 'Low';
    // Legacy fields for backward compatibility
    description?: string;
  }>;
  
  // Step 3: Strengths & Weaknesses
  strengths: Array<{
    id: string;
    title: string;
    description: string;
    category: string;
  }>;
  weaknesses: Array<{
    id: string;
    title: string;
    description: string;
    category: string;
    impactLevel: 'High' | 'Medium' | 'Low';
  }>;
  
  // Plan Notes for Strengths & Weaknesses
  planNotes: string;
  
  // Step 5: Discharge Planning
  initialDischargePlan: string[];
  initialDischargeCriteria: string[];
  customDischargePlan: string;
  customDischargeCriteria: string;
  otherNotableItems: string;
  
  // Step 7: Signatures
  agreed: boolean;
  agreedDate: string;
  agreedBy: string;
  
  // Patient Agreements
  patientAgreements: {
    adhereToRecommendations: boolean;
    agreeWithServicesTypes: boolean;
    receivedCopyOfPlan: boolean;
    textForAgreement: boolean;
  };
  
  // Plan Agreements
  planAgreements: {
    agreeToFollowPlan: boolean;
  };
  
  // Signature Sections
  signatures: {
    personSignature: {
      signed: boolean;
      signedBy: string;
      signedDate: string;
      signatureData?: string; // Base64 image data
    };
    careTeamSignatures: Array<{
      id: string;
      providerName: string;
      title: string;
      signed: boolean;
      signedDate: string;
    }>;
  };
}

// Step configuration - 5 steps (removed ProvidersSignaturesStep)
const steps = [
  {
    id: 1,
    title: 'Plan Settings',
    description: 'Configure plan details, signatures, and programs',
    component: PlanDetailsStep
  },
  {
    id: 2,
    title: 'Goals, Objectives & Problems',
    description: 'Define measurable treatment goals and target problems',
    component: GoalsObjectivesProblemsStep
  },
  {
    id: 3,
    title: 'Strengths & Weaknesses',
    description: 'Document patient assets and areas for improvement',
    component: StrengthsWeaknessesStep
  },
  {
    id: 4,
    title: 'Discharge Planning',
    description: 'Define discharge criteria and treatment plan review schedule',
    component: DischargeAgreementsStep
  },
  {
    id: 5,
    title: 'Signatures',
    description: 'Collect patient and family agreements and final signatures',
    component: SignaturesStep
  }
];

const NewTreatmentPlanPage: React.FC = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isPatientHistoryOpen, setIsPatientHistoryOpen] = useState(false);
  const [isPrintDialogOpen, setIsPrintDialogOpen] = useState(false);
  
  // Mock patient history data
  const patientHistory = {
    demographics: {
      name: 'John Smith',
      dob: '1985-03-15',
      age: 39,
      gender: 'Male',
      mrn: 'P001',
      insurance: 'Pacific Source Community Solutions',
      status: 'Outpatient'
    },
    diagnoses: [
      { code: 'F32.9', description: 'Major depressive disorder, single episode, unspecified', status: 'Active' },
      { code: 'F41.1', description: 'Generalized anxiety disorder', status: 'Active' },
      { code: 'Z63.0', description: 'Problems in relationship with spouse or partner', status: 'Active' }
    ],
    allergies: [
      { allergen: 'Penicillin', reaction: 'Rash', severity: 'Moderate' },
      { allergen: 'Shellfish', reaction: 'Anaphylaxis', severity: 'Severe' }
    ],
    medications: [
      { name: 'Sertraline 50mg', frequency: 'Daily', prescriber: 'Dr. Johnson', status: 'Active' },
      { name: 'Lorazepam 0.5mg', frequency: 'As needed', prescriber: 'Dr. Johnson', status: 'Active' }
    ],
    recentEncounters: [
      { date: '2025-01-15', type: 'Therapy Session', provider: 'Dr. Sarah Johnson', notes: 'Patient showing improvement' },
      { date: '2025-01-08', type: 'Medication Review', provider: 'Dr. Michael Chen', notes: 'Adjusted dosage' },
      { date: '2024-12-20', type: 'Initial Assessment', provider: 'Dr. Sarah Johnson', notes: 'Comprehensive evaluation completed' }
    ],
    labResults: [
      { date: '2025-01-10', test: 'CBC with Differential', result: 'Normal', status: 'Final' },
      { date: '2025-01-10', test: 'Basic Metabolic Panel', result: 'Normal', status: 'Final' },
      { date: '2024-12-15', test: 'Thyroid Function', result: 'Normal', status: 'Final' }
    ]
  };
  
  // Handle Escape key to close mobile sidebar and prevent body scroll
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isMobileSidebarOpen) {
        setIsMobileSidebarOpen(false);
      }
    };
    
    // Prevent body scroll when sidebar is open
    if (isMobileSidebarOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    
    document.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset'; // Cleanup on unmount
    };
  }, [isMobileSidebarOpen]);
  
  // Initialize form data with default values
  const [formData, setFormData] = useState<TreatmentPlanFormData>({
    // Step 1: Plan Details
    planName: '',
    planType: 'Initial',
    startDate: new Date().toISOString().split('T')[0],
    endDate: '',
    dateLastReviewed: '',
    patientId: '',
    patientName: '',
    patientLivedName: '',
    patientPronouns: '',
    
    // Step 2: Diagnoses & Facilities
    activeDiagnoses: [],
    selectedFacilities: [],
    selectedPrograms: [],
    
    // Step 3: Goals, Objectives & Problems
    recoveryGoal: '',
    conditions: [],
    problems: [],
    
    // Step 3: Strengths & Weaknesses
    strengths: [],
    weaknesses: [],
    planNotes: '',
    
    // Step 5: Discharge Planning
    initialDischargePlan: [],
    initialDischargeCriteria: [],
    customDischargePlan: '',
    customDischargeCriteria: '',
    otherNotableItems: '',
    
    // Step 5: Signatures
    agreed: false,
    agreedDate: '',
    agreedBy: '',
    
    // Patient Agreements
    patientAgreements: {
      adhereToRecommendations: false,
      agreeWithServicesTypes: false,
      receivedCopyOfPlan: false,
      textForAgreement: false
    },
    
    // Plan Agreements
    planAgreements: {
      agreeToFollowPlan: false
    },
    
    // Signature Sections
    signatures: {
      personSignature: {
        signed: false,
        signedBy: '',
        signedDate: '',
        signatureData: ''
      },
      careTeamSignatures: [
        {
          id: '1',
          providerName: 'Physician',
          title: '1Bright',
          signed: false,
          signedDate: ''
        }
      ]
    }
  });

  // Auto-save functionality (saves every 30 seconds)
  useEffect(() => {
    const autoSaveInterval = setInterval(() => {
      // Save form data to localStorage for recovery
      localStorage.setItem('treatmentPlanDraft', JSON.stringify({
        formData,
        currentStep,
        timestamp: new Date().toISOString()
      }));
    }, 30000); // 30 seconds

    return () => clearInterval(autoSaveInterval);
  }, [formData, currentStep]);

  // Load draft data on component mount
  useEffect(() => {
    const savedDraft = localStorage.getItem('treatmentPlanDraft');
    if (savedDraft) {
      try {
        const { formData: savedFormData, currentStep: savedStep } = JSON.parse(savedDraft);
        setFormData(savedFormData);
        setCurrentStep(savedStep);
      } catch (error) {
        console.error('Error loading draft:', error);
      }
    }
  }, []);

  // Handle form data updates
  const updateFormData = (stepData: Partial<TreatmentPlanFormData>) => {
    setFormData(prev => ({ ...prev, ...stepData }));
  };

  // Navigation handlers
  const handleNext = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleStepClick = (stepNumber: number) => {
    setCurrentStep(stepNumber);
  };

  // Form submission
  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      // TODO: Implement API call to save treatment plan
      console.log('Submitting treatment plan:', formData);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Clear draft data after successful submission
      localStorage.removeItem('treatmentPlanDraft');
      
      // Navigate back to treatment plans list
      navigate('/treatment-plans', { 
        state: { 
          message: 'Treatment plan created successfully!',
          type: 'success'
        }
      });
    } catch (error) {
      console.error('Error submitting treatment plan:', error);
      // TODO: Show error message to user
    } finally {
      setIsSubmitting(false);
    }
  };

  // Get current step component
  const CurrentStepComponent = steps[currentStep - 1].component;

  // Mock patient data for consistent layout
  const patientData = {
    id: 'P001',
    name: 'John Doe',
    gender: 'Male',
    age: 35,
    bloodGroup: 'A+',
    insuranceProvider: 'Blue Cross',
    admittedTo: 'Outpatient',
    language: 'English',
    mobile: '(555) 123-4567',
    programAuditor: 'Dr. Johnson',
    auditorTimestamp: '2 hours ago',
    primaryCareProvider: 'Dr. Brown',
    nickname: 'John'
  };

  // Breadcrumb items for the wizard
  const getBreadcrumbItems = (): BreadcrumbItem[] => [
    { label: 'Clients', href: '#' },
    { label: 'Interdisciplinary Treatment Plan', href: '#' },
    { label: 'New Treatment Plan', href: '#' }
  ];

  return (
    <div className="fixed inset-0 flex flex-col bg-white overflow-hidden">
      {/* Top Navigation Bar */}
      <div className="flex-shrink-0">
        <TopNavigationBar 
          hospitalName="Mayank Hospitals"
          userAvatarUrl="https://ui-avatars.com/api/?name=Darlene+Robertson"
          onSearch={(searchTerm) => console.log('Search:', searchTerm)}
          patient={patientData}
          onNewEncounter={() => console.log('New encounter')}
          onViewChart={() => console.log('View chart for patient:', patientData?.name)}
        />
      </div>

      {/* Main Navigation */}
      <div className="flex-shrink-0">
        <MainNavigationBar 
          activeItem="Clients"
          onNavigate={(itemName) => {
            console.log('Navigate to:', itemName);
            // Handle navigation if needed
          }}
        />
      </div>

      {/* Content Area */}
      <div className="flex flex-1 min-h-0 overflow-hidden">
        {/* Desktop Sidebar - Hidden on mobile */}
        <div className="flex-shrink-0 hidden lg:block">
          <Sidebar 
            activeItem="Interdisciplinary Treatment Plan"
            onMenuSelect={(itemLabel) => {
              console.log('Sidebar menu selected:', itemLabel);
              // Handle sidebar navigation if needed
            }} 
            onSearch={(searchTerm) => console.log('Search sidebar:', searchTerm)}
          />
        </div>

        {/* Main Content with Internal Scroll */}
        <div className="flex-1 flex flex-col min-h-0">
          {/* Responsive Header - Fixed */}
          <div className="flex-shrink-0 bg-white border-b border-gray-200 px-3 sm:px-6 py-3">
            {/* Mobile Layout */}
            <div className="flex items-center justify-between lg:hidden">
              <div className="flex items-center gap-2">
                {/* Mobile Hamburger Menu */}
                <button
                  onClick={() => setIsMobileSidebarOpen(true)}
                  className="p-2 hover:bg-gray-100 rounded-md transition-colors"
                  aria-label="Open sidebar menu"
                >
                  <Bars3Icon className="h-5 w-5 text-gray-600" />
                </button>
                
                {/* Mobile Back Button */}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => navigate(-1)}
                  className="flex items-center gap-1.5 px-2"
                >
                  <ArrowLeftIcon className="w-4 h-4" />
                  <span className="hidden sm:inline">Back</span>
                </Button>
                
                {/* Mobile Draft Badge */}
                <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full font-medium text-xs">
                  Draft
                </span>
              </div>
              
              {/* Mobile Auto-save Indicator */}
              <div className="text-xs text-gray-500 hidden sm:block">
                Auto-saves
              </div>
            </div>
            
            {/* Desktop Layout */}
            <div className="hidden lg:flex items-center justify-between">
              <div className="flex items-center gap-6">
                {/* Desktop Hamburger Menu (for main sidebar) */}
                <button
                  onClick={() => setIsMobileSidebarOpen(true)}
                  className="p-2 hover:bg-gray-100 rounded-md transition-colors xl:hidden"
                  aria-label="Open sidebar menu"
                  title="Open main navigation"
                >
                  <Bars3Icon className="h-5 w-5 text-gray-600" />
                </button>
                
                <div className="flex items-center gap-3">
                  {/* Desktop Breadcrumb */}
                  <Breadcrumb 
                    items={getBreadcrumbItems()} 
                    onNavigate={(href) => {
                      console.log('Breadcrumb navigation:', href);
                    }}
                  />
                  {/* Desktop Draft Badge */}
                  <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full font-medium text-sm">
                    Draft
                  </span>
                </div>
              </div>
              
              {/* Desktop Right Side Actions */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => navigate(-1)}
                    className="flex items-center gap-2"
                  >
                    <ArrowLeftIcon className="w-4 h-4" />
                    Back
                  </Button>
                  <div className="text-xs text-gray-400">
                    Auto-saves every 60 seconds
                  </div>
                </div>
                
                {/* Action Buttons */}
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsPrintDialogOpen(true)}
                    className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
                    title="Print treatment plan"
                  >
                    <PrinterIcon className="w-4 h-4" />
                    Print
                  </Button>
                  
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      console.log('Open settings');
                      // TODO: Implement settings functionality
                    }}
                    className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
                    title="Treatment plan settings"
                  >
                    <Cog6ToothIcon className="w-4 h-4" />
                    Settings
                  </Button>
                  
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      console.log('Delete treatment plan');
                      // TODO: Implement delete functionality with confirmation
                    }}
                    className="flex items-center gap-2 text-red-600 hover:text-red-700 hover:bg-red-50"
                    title="Delete treatment plan"
                  >
                    <TrashIcon className="w-4 h-4" />
                    Delete
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Scrollable Wizard Content */}
          <div className="flex-1 bg-gradient-to-br from-blue-50 via-white to-indigo-50 min-h-0 overflow-hidden">
            <div className="h-full p-2 sm:p-4">
              <div className="max-w-7xl mx-auto h-full">
                {/* Main Content Area with Integrated Sidebar */}
                <div className="bg-white border border-gray-200 rounded-lg overflow-hidden h-full">
                  <div className="flex flex-col h-full">
                    
                    {/* Mobile Step Indicator - Horizontal */}
                    <div className="block lg:hidden border-b border-gray-200 bg-white px-4 py-3">
                      <div className="flex items-center justify-between mb-2">
                        <h2 className="text-sm font-semibold text-gray-900">Step {currentStep} of {steps.length}</h2>
                        <span className="text-xs text-gray-500">{Math.round((currentStep / steps.length) * 100)}% Complete</span>
                      </div>
                      <div className="flex items-center space-x-2 overflow-x-auto pb-2">
                        {steps.map((step) => (
                          <button
                            key={step.id}
                            onClick={() => handleStepClick(step.id)}
                            className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
                              step.id === currentStep
                                ? 'bg-primary text-white'
                                : step.id < currentStep
                                ? 'bg-green-100 text-green-700'
                                : 'bg-gray-100 text-gray-500'
                            }`}
                          >
                            <div className={`w-4 h-4 rounded-full flex items-center justify-center ${
                              step.id < currentStep
                                ? 'bg-green-500 text-white'
                                : step.id === currentStep
                                ? 'bg-white text-primary'
                                : 'bg-gray-300 text-gray-500'
                            }`}>
                              {step.id < currentStep ? (
                                <CheckIcon className="w-2.5 h-2.5" />
                              ) : (
                                <span className="text-xs font-bold">{step.id}</span>
                              )}
                            </div>
                            <span className="hidden sm:inline">{step.title}</span>
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="flex flex-1 min-h-0">
                      {/* Left Sidebar - Hidden on mobile, visible on desktop */}
                      <div className="hidden lg:block w-64 bg-blue-50/20 border-r border-gray-200 p-4">
                        <div className="space-y-4">
                          {steps.map((step) => (
                            <div key={step.id} className="flex items-center">
                              <button
                                onClick={() => handleStepClick(step.id)}
                                className={`flex items-center justify-center w-6 h-6 rounded-full transition-colors mr-3 ${
                                  step.id < currentStep
                                    ? 'bg-green-500 text-white'
                                    : step.id === currentStep
                                    ? 'bg-primary text-white'
                                    : 'bg-gray-200 text-gray-400 hover:bg-gray-300'
                                }`}
                              >
                                {step.id < currentStep ? (
                                  <CheckIcon className="w-3 h-3" />
                                ) : step.id === currentStep ? (
                                  <div className="w-2 h-2 bg-white rounded-full" />
                                ) : (
                                  <div className="w-2 h-2 bg-gray-400 rounded-full" />
                                )}
                              </button>
                              <button
                                onClick={() => handleStepClick(step.id)}
                                className="text-left flex-1 group"
                              >
                                <p className={`text-sm font-medium ${
                                  step.id < currentStep ? 'text-green-600' :
                                  step.id === currentStep ? 'text-primary' : 'text-gray-400'
                                } group-hover:text-gray-700 transition-colors`}>
                                  {step.title}
                                </p>
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Main Content Area - Responsive */}
                      <div className="flex-1 min-h-0 p-3 sm:p-4 lg:p-6">
                        <div className="h-full overflow-y-auto">
                          {/* Compact Step Header */}
                          <div className="mb-4 pb-3 border-b border-gray-200">
                            <div className="flex items-center gap-3 mb-2">
                              <div className={`flex items-center justify-center w-7 h-7 rounded-full flex-shrink-0 ${
                                currentStep <= steps.length ? 'bg-primary text-white' : 'bg-gray-200 text-gray-400'
                              }`}>
                                <span className="text-xs font-semibold">{currentStep}</span>
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between">
                                  <h1 className="text-lg sm:text-xl font-bold text-gray-900 truncate">
                                    {steps.find(step => step.id === currentStep)?.title || 'Step'}
                                  </h1>
                                  <span className="text-xs text-gray-500 ml-3 flex-shrink-0">
                                    {currentStep} of {steps.length}
                                  </span>
                                </div>
                                <div className="flex items-center justify-between mt-0.5 gap-4">
                                  <p className="text-xs sm:text-sm text-gray-600 flex-1">
                                    {steps.find(step => step.id === currentStep)?.description || 'Complete this step to continue.'}
                                  </p>
                                  {/* Inline Progress Bar */}
                                  <div className="flex items-center gap-2 flex-shrink-0">
                                    <span className="text-xs text-gray-500">Progress</span>
                                    <div className="w-24 bg-gray-200 rounded-full h-1.5">
                                      <div 
                                        className="bg-primary h-1.5 rounded-full transition-all duration-300 ease-in-out"
                                        style={{ width: `${(currentStep / steps.length) * 100}%` }}
                                      ></div>
                                    </div>
                                    <span className="text-xs text-gray-500 whitespace-nowrap">
                                      {Math.round((currentStep / steps.length) * 100)}% complete
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                          
                          {/* Step Content */}
                          <CurrentStepComponent
                            formData={formData}
                            updateFormData={updateFormData}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons - Responsive and Touch-Friendly */}
                    <div className="border-t border-gray-200 bg-gray-50 px-3 sm:px-4 lg:px-6 py-3 sm:py-4">
                      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 sm:gap-0">
                        <Button
                          variant="outline"
                          onClick={handlePrevious}
                          disabled={currentStep === 1}
                          className="w-full sm:w-auto h-11 sm:h-auto"
                        >
                          Previous
                        </Button>

                        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3">
                          <Button
                            variant="outline"
                            onClick={() => {
                              // Save draft functionality
                              console.log('Saving draft...', formData);
                              // TODO: Implement actual save to backend
                            }}
                            className="text-gray-600 border-gray-300 hover:bg-gray-50 w-full sm:w-auto h-11 sm:h-auto"
                          >
                            Save & Exit
                          </Button>
                          
                          {currentStep < steps.length ? (
                            <Button 
                              onClick={handleNext}
                              className="w-full sm:w-auto h-11 sm:h-auto"
                            >
                              Next Step
                            </Button>
                          ) : (
                            <Button
                              onClick={handleSubmit}
                              disabled={isSubmitting}
                            >
                              {isSubmitting ? 'Creating Plan...' : 'Create Treatment Plan'}
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Patient History Sticky Trigger */}
      <button
        onClick={() => setIsPatientHistoryOpen(true)}
        className="fixed right-0 top-1/2 -translate-y-1/2 z-30 bg-white/90 hover:bg-white border border-gray-200 hover:border-gray-300 backdrop-blur-sm p-3 rounded-l-lg shadow-lg transition-all duration-200 hover:shadow-xl group"
        title="View Patient History"
      >
        <div className="flex items-center gap-2">
          {/* FontAwesome-style medical chart icon */}
          <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
            <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z"/>
          </svg>
          <span className="text-xs font-medium text-gray-700 hidden group-hover:block whitespace-nowrap">Patient History</span>
        </div>
      </button>
      
      {/* Patient History Drawer */}
      {isPatientHistoryOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity duration-300 ease-in-out"
            onClick={() => setIsPatientHistoryOpen(false)}
            aria-hidden="true"
          />
          
          {/* Drawer */}
          <div className="fixed inset-y-0 right-0 z-50 w-96 bg-white shadow-xl transform transition-transform duration-300 ease-in-out flex flex-col">
            {/* Header */}
            <div className="flex-shrink-0 flex items-center justify-between p-4 border-b border-gray-200 bg-blue-50">
              <div className="flex items-center gap-3">
                <UserIcon className="w-6 h-6 text-blue-600" />
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">{patientHistory.demographics.name}</h2>
                  <p className="text-sm text-gray-600">MRN: {patientHistory.demographics.mrn} • Age: {patientHistory.demographics.age}</p>
                </div>
              </div>
              <button
                onClick={() => setIsPatientHistoryOpen(false)}
                className="p-2 hover:bg-gray-100 rounded-md transition-colors"
                title="Close patient history"
              >
                <XMarkIcon className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            
            {/* Content */}
            <div className="flex-1 overflow-y-auto p-4 space-y-6">
              {/* Demographics */}
              <div>
                <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <UserIcon className="w-4 h-4 text-gray-600" />
                  Demographics
                </h3>
                <div className="bg-gray-50 rounded-lg p-3 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">DOB:</span>
                    <span className="font-medium">{new Date(patientHistory.demographics.dob).toLocaleDateString()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Gender:</span>
                    <span className="font-medium">{patientHistory.demographics.gender}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Insurance:</span>
                    <span className="font-medium text-xs">{patientHistory.demographics.insurance}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Status:</span>
                    <span className="font-medium">{patientHistory.demographics.status}</span>
                  </div>
                </div>
              </div>
              
              {/* Active Diagnoses */}
              <div>
                <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <ClipboardDocumentListIcon className="w-4 h-4 text-gray-600" />
                  Active Diagnoses
                </h3>
                <div className="space-y-2">
                  {patientHistory.diagnoses.map((diagnosis, index) => (
                    <div key={index} className="bg-red-50 border border-red-200 rounded-lg p-3">
                      <div className="flex justify-between items-start mb-1">
                        <span className="font-medium text-sm text-red-900">{diagnosis.code}</span>
                        <span className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded">{diagnosis.status}</span>
                      </div>
                      <p className="text-xs text-red-700">{diagnosis.description}</p>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Allergies */}
              <div>
                <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <BeakerIcon className="w-4 h-4 text-gray-600" />
                  Allergies
                </h3>
                <div className="space-y-2">
                  {patientHistory.allergies.map((allergy, index) => (
                    <div key={index} className="bg-orange-50 border border-orange-200 rounded-lg p-3">
                      <div className="flex justify-between items-start mb-1">
                        <span className="font-medium text-sm text-orange-900">{allergy.allergen}</span>
                        <span className={`text-xs px-2 py-1 rounded ${
                          allergy.severity === 'Severe' 
                            ? 'bg-red-100 text-red-800' 
                            : 'bg-orange-100 text-orange-800'
                        }`}>{allergy.severity}</span>
                      </div>
                      <p className="text-xs text-orange-700">Reaction: {allergy.reaction}</p>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Current Medications */}
              <div>
                <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <BeakerIcon className="w-4 h-4 text-gray-600" />
                  Current Medications
                </h3>
                <div className="space-y-2">
                  {patientHistory.medications.map((medication, index) => (
                    <div key={index} className="bg-green-50 border border-green-200 rounded-lg p-3">
                      <div className="flex justify-between items-start mb-1">
                        <span className="font-medium text-sm text-green-900">{medication.name}</span>
                        <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">{medication.status}</span>
                      </div>
                      <div className="text-xs text-green-700 space-y-1">
                        <p>Frequency: {medication.frequency}</p>
                        <p>Prescriber: {medication.prescriber}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Recent Encounters */}
              <div>
                <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <CalendarDaysIcon className="w-4 h-4 text-gray-600" />
                  Recent Encounters
                </h3>
                <div className="space-y-2">
                  {patientHistory.recentEncounters.map((encounter, index) => (
                    <div key={index} className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                      <div className="flex justify-between items-start mb-1">
                        <span className="font-medium text-sm text-blue-900">{encounter.type}</span>
                        <span className="text-xs text-blue-600">{new Date(encounter.date).toLocaleDateString()}</span>
                      </div>
                      <div className="text-xs text-blue-700 space-y-1">
                        <p>Provider: {encounter.provider}</p>
                        <p>Notes: {encounter.notes}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Lab Results */}
              <div>
                <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <DocumentTextIcon className="w-4 h-4 text-gray-600" />
                  Recent Lab Results
                </h3>
                <div className="space-y-2">
                  {patientHistory.labResults.map((lab, index) => (
                    <div key={index} className="bg-purple-50 border border-purple-200 rounded-lg p-3">
                      <div className="flex justify-between items-start mb-1">
                        <span className="font-medium text-sm text-purple-900">{lab.test}</span>
                        <span className="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded">{lab.status}</span>
                      </div>
                      <div className="text-xs text-purple-700 space-y-1">
                        <p>Result: {lab.result}</p>
                        <p>Date: {new Date(lab.date).toLocaleDateString()}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </>
      )}
      
      {/* Mobile Sidebar Overlay */}
      {isMobileSidebarOpen && (
        <>
          {/* Backdrop with fade animation */}
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden transition-opacity duration-300 ease-in-out"
            onClick={() => setIsMobileSidebarOpen(false)}
            aria-hidden="true"
          />
          
          {/* Mobile Sidebar with slide animation */}
          <div className="fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-xl lg:hidden transform transition-transform duration-300 ease-in-out">
            {/* Mobile Sidebar Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Menu</h2>
              <button
                onClick={() => setIsMobileSidebarOpen(false)}
                className="p-2 hover:bg-gray-100 rounded-md transition-colors"
                aria-label="Close sidebar menu"
              >
                <XMarkIcon className="h-6 w-6 text-gray-600" />
              </button>
            </div>
            
            {/* Mobile Sidebar Content */}
            <div className="flex-1 overflow-hidden">
              <Sidebar 
                activeItem="Interdisciplinary Treatment Plan"
                onMenuSelect={(itemLabel) => {
                  console.log('Mobile sidebar menu selected:', itemLabel);
                  setIsMobileSidebarOpen(false); // Close sidebar after selection
                  // Handle sidebar navigation if needed
                }} 
                onSearch={(searchTerm) => console.log('Search mobile sidebar:', searchTerm)}
              />
            </div>
          </div>
        </>
      )}
      
      {/* Print Dialog */}
      <TreatmentPlanPrintDialog
        isOpen={isPrintDialogOpen}
        onClose={() => setIsPrintDialogOpen(false)}
        formData={formData}
        patientInfo={{
          name: patientHistory.demographics.name,
          dob: patientHistory.demographics.dob,
          mrn: patientHistory.demographics.mrn,
          address: undefined, // Add if available
          phone: undefined // Add if available
        }}
        facilityInfo={{
          name: 'DrCloud EHR Healthcare',
          address: '123 Healthcare Drive, Medical City, MC 12345',
          phone: '(555) 123-4567',
          logo: undefined // Add facility logo if available
        }}
      />
    </div>
  );
};

export default NewTreatmentPlanPage;
