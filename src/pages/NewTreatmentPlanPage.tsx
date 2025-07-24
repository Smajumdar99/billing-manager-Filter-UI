import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeftIcon, CheckIcon } from '@heroicons/react/24/outline';
import { Button } from '@/components/atoms/Button';
import { TopNavigationBar, MainNavigationBar, Sidebar } from '../components/old-ui';
import { Breadcrumb, BreadcrumbItem } from '@/components/atoms/Breadcrumb';

// Import step components
import PlanDetailsStep from '../components/organisms/NewTreatmentPlan/PlanDetailsStep';
import DiagnosesAndFacilitiesStep from '../components/organisms/NewTreatmentPlan/DiagnosesAndFacilitiesStep';
import GoalsObjectivesProblemsStep from '../components/organisms/NewTreatmentPlan/GoalsObjectivesProblemsStep';
import ProvidersSignaturesStep from '../components/organisms/NewTreatmentPlan/ProvidersSignaturesStep';
import StrengthsWeaknessesStep from '../components/organisms/NewTreatmentPlan/StrengthsWeaknessesStep';
import DischargeAgreementsStep from '../components/organisms/NewTreatmentPlan/DischargeAgreementsStep';

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
    title: string;
    description: string;
    priority: 'High' | 'Medium' | 'Low';
  }>;
  
  // Step 4: Providers & Signatures
  assignedProviders: Array<{
    id: string;
    providerId: string;
    providerName: string;
    providerTitle: string;
    role: string;
    assignedDate: string;
  }>;
  signatures: {
    [key: string]: {
      signed: boolean;
      signerName: string;
      signedDate: string;
      notes?: string;
    };
  };
  // Signature options/settings
  signatureOptions: {
    showPersonSignature: boolean;
    showGuardianSignature: boolean;
    showOutsideAgencySignatures: boolean;
  };
  
  // Step 5: Strengths & Weaknesses
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
  
  // Step 6: Discharge & Agreements
  dischargeCriteria: string[];
  reviewFrequency: string;
  nextReviewDate: string;
  patientAgreements: {
    [key: string]: {
      agreed: boolean;
      agreedDate: string;
      agreedBy: string;
    };
  };
}

// Step configuration
const steps = [
  {
    id: 1,
    title: 'Plan Details',
    description: 'Basic plan information and patient details',
    component: PlanDetailsStep
  },
  {
    id: 2,
    title: 'Diagnoses & Facilities',
    description: 'Active diagnoses and facility selection',
    component: DiagnosesAndFacilitiesStep
  },
  {
    id: 3,
    title: 'Goals, Objectives & Problems',
    description: 'Treatment goals and identified problems',
    component: GoalsObjectivesProblemsStep
  },
  {
    id: 4,
    title: 'Providers & Signatures',
    description: 'Required signatures and provider assignments',
    component: ProvidersSignaturesStep
  },
  {
    id: 5,
    title: 'Strengths & Weaknesses',
    description: 'Patient strengths and weaknesses assessment',
    component: StrengthsWeaknessesStep
  },
  {
    id: 6,
    title: 'Discharge & Agreements',
    description: 'Discharge planning and patient agreements',
    component: DischargeAgreementsStep
  }
];

const NewTreatmentPlanPage: React.FC = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
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
    
    // Step 4: Providers & Signatures
    assignedProviders: [],
    signatures: {},
    signatureOptions: {
      showPersonSignature: true,
      showGuardianSignature: false,
      showOutsideAgencySignatures: false
    },
    
    // Step 5: Strengths & Weaknesses
    strengths: [],
    weaknesses: [],
    
    // Step 6: Discharge & Agreements
    dischargeCriteria: [],
    reviewFrequency: '',
    nextReviewDate: '',
    patientAgreements: {}
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
    <div className="flex flex-col min-h-screen bg-white">
      {/* Top Navigation Bar - Sticky */}
      <div className="sticky top-0 z-50">
        <TopNavigationBar 
          hospitalName="Mayank Hospitals"
          userAvatarUrl="https://ui-avatars.com/api/?name=Darlene+Robertson"
          onSearch={(searchTerm) => console.log('Search:', searchTerm)}
          patient={patientData}
          onNewEncounter={() => console.log('New encounter')}
          onViewChart={() => console.log('View chart for patient:', patientData?.name)}
        />
      </div>

      {/* Main Navigation - Sticky */}
      <div className="sticky top-[68px] z-40">
        <MainNavigationBar 
          activeItem="Clients"
          onNavigate={(itemName) => {
            console.log('Navigate to:', itemName);
            // Handle navigation if needed
          }}
        />
      </div>

      {/* Content Area */}
      <div className="flex flex-1 min-h-0">
        {/* Sidebar - Sticky */}
        <div className="sticky top-[68px] h-[calc(100vh-68px)] z-30">
          <Sidebar 
            activeItem="Interdisciplinary Treatment Plan"
            onMenuSelect={(itemLabel) => {
              console.log('Sidebar menu selected:', itemLabel);
              // Handle sidebar navigation if needed
            }} 
            onSearch={(searchTerm) => console.log('Search sidebar:', searchTerm)}
          />
        </div>

        {/* Main Content */}
        <div className="flex-1 bg-gray-50 overflow-y-auto">
          {/* Breadcrumb Navigation */}
          <div className="bg-white border-b border-gray-200 px-6 py-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-3">
                  <Breadcrumb 
                    items={getBreadcrumbItems()} 
                    onNavigate={(href) => {
                      console.log('Breadcrumb navigation:', href);
                    }}
                  />
                  {/* Draft Badge */}
                  <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full font-medium text-sm">
                    Draft
                  </span>
                </div>
              </div>
              
              {/* Right Side Actions */}
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
                <div className="text-sm text-gray-500">
                  Auto-saves every 30 seconds
                </div>
              </div>
            </div>
          </div>

          {/* Wizard Content */}
          <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 p-6">

      {/* Progress Bar - Compact */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-3">
            <div className="flex items-center justify-between space-x-2">
              {steps.map((step, index) => (
                <div key={step.id} className="flex items-center flex-1">
                  <button
                    onClick={() => handleStepClick(step.id)}
                    className={`flex items-center justify-center w-6 h-6 rounded-full transition-colors ${
                      step.id < currentStep
                        ? 'bg-green-500 text-white'
                        : step.id === currentStep
                        ? 'bg-blue-500 text-white'
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
                  <div className="ml-2 flex-1">
                    <p className={`text-xs font-medium truncate ${
                      step.id < currentStep ? 'text-green-600' :
                      step.id === currentStep ? 'text-blue-600' : 'text-gray-400'
                    }`}>
                      {step.title}
                    </p>
                  </div>
                  {index < steps.length - 1 && (
                    <div className={`w-8 h-px mx-2 ${
                      step.id < currentStep ? 'bg-green-500' : 'bg-gray-200'
                    }`} />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-24">
        <CurrentStepComponent
          formData={formData}
          updateFormData={updateFormData}
        />
      </div>

      {/* Sticky Navigation Footer */}
      <div className="fixed bottom-0 left-64 right-0 bg-white border-t border-gray-200 shadow-lg z-10">
        <div className="max-w-5xl mx-auto px-16 sm:px-6 lg:px-28">
          <div className="py-4">
            <div className="max-w-2xl mx-auto">
              <div className="flex items-center justify-between">
                <Button
                  variant="outline"
                  onClick={handlePrevious}
                  disabled={currentStep === 1}
                >
                  Previous
                </Button>

                <div className="flex items-center space-x-3">
                  {/* Save Draft button before Next Step */}
                  <Button
                    variant="outline"
                    onClick={() => {
                      // Save draft functionality
                      console.log('Saving draft...', formData);
                      // TODO: Implement actual save to backend
                    }}
                    className="text-gray-600 border-gray-300 hover:bg-gray-50"
                  >
                    Save Draft
                  </Button>
                  
                  {currentStep < steps.length ? (
                    <Button onClick={handleNext}>
                      Next Step
                    </Button>
                  ) : (
                    <Button
                      onClick={handleSubmit}
                      disabled={isSubmitting}
                      className="bg-green-600 hover:bg-green-700"
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
  );
};

export default NewTreatmentPlanPage;
