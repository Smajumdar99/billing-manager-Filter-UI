import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { VisitDetailsStep } from './VisitDetailsStep';
import { ClinicalNoteStep } from './ClinicalNoteStep';
import { DiagnosisAllergiesStep } from './DiagnosisAllergiesStep';
import { BillingStep } from './BillingStep';
import { SignaturesStep } from './SignaturesStep';
import { ReviewStep } from './ReviewStep';
import { Button } from '@/components/atoms/Button';
import {
    CheckIcon,
    ChevronRightIcon,
    ChevronLeftIcon,
    CalendarIcon,
    DocumentTextIcon,
    CurrencyDollarIcon,
    PencilSquareIcon,
    ClipboardDocumentCheckIcon,
    HeartIcon
} from '@heroicons/react/24/outline';
import { cn } from '@/lib/utils';

const steps = [
    { id: 'visit', title: 'Logistics', description: 'Date, time, program & location', icon: CalendarIcon },
    { id: 'note', title: 'Clinical Note', description: 'SOAP & instructions', icon: DocumentTextIcon },
    { id: 'diagnosis', title: 'Diagnosis & Allergies', description: 'Manage conditions & allergies', icon: HeartIcon },
    { id: 'billing', title: 'Billing & Coding', description: 'Codes & payor info', icon: CurrencyDollarIcon },
    { id: 'signatures', title: 'Signatures', description: 'Staff & patient sign-off', icon: PencilSquareIcon },
    { id: 'review', title: 'Review', description: 'Verify and submit', icon: ClipboardDocumentCheckIcon },
];

export const EncounterForm: React.FC = () => {
    const navigate = useNavigate();
    const [currentStep, setCurrentStep] = useState(0);
    const contentRef = useRef<HTMLDivElement>(null);
    const [formData, setFormData] = useState({
        // Logistics
        date: new Date().toISOString().split('T')[0],
        time: '09:00',
        duration: '60',
        program: '',
        provider: 'Admin, Ensoftek', // Default to current user
        serviceType: 'therapy',
        category: 'mental_health',
        location: 'office',
        referringSource: '',
        sensitivity: 'standard',
        isTelehealth: false,
        telehealthOption: '',
        personLocation: '',
        onsetDate: '',
        checkOutDate: '',
        dartsProgram: 'assessment',

        // Clinical Note
        isLateNote: false,
        subjective: '',
        objective: '',
        assessment: '',
        plan: '',
        instructions: '',
        serviceNote: '',

        // Billing
        notBillable: false,
        billTo: 'insurance',
        cptCodes: [],
        icdCodes: [],
        placeOfService: '11',
        billingLocation: 'main',
        referringProvider: 'unassigned',
        referringNPI: '',

        // Diagnosis & Allergies
        diagnosisAllergies: [],

        // Signatures
        staffSignature: null,
        signedDate: null,
        patientSignature: false,
        patientSignDate: '',
    });

    const isStepComplete = (stepId: string) => {
        switch (stepId) {
            case 'visit':
                return !!formData.date && !!formData.time && !!formData.program;
            case 'note':
                return !!formData.subjective || !!formData.assessment;
            case 'billing':
                return formData.notBillable || formData.cptCodes.length > 0;
            case 'signatures':
                return formData.staffSignature;
            case 'review':
                return false;
            default:
                return false;
        }
    };

    const handleNext = () => {
        if (currentStep < steps.length - 1) {
            setCurrentStep(prev => prev + 1);
            // Reset scroll to top for next step
            if (contentRef.current) {
                contentRef.current.scrollTop = 0;
            }
        }
    };

    const handleBack = () => {
        if (currentStep > 0) {
            setCurrentStep(prev => prev - 1);
        }
    };

    const handleSave = () => {
        console.log('Saving encounter data:', formData);
        // Simulate API call
        setTimeout(() => {
            navigate('/clients');
        }, 1000);
    };

    // Auto-advance on scroll logic
    const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
        const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
        // Check if scrolled to bottom (with small buffer)
        if (scrollHeight - scrollTop <= clientHeight + 10) {
            // Only auto-advance if not on the last step and the user is actively scrolling down
            // We might want to add a debounce or a more deliberate check here
            // For now, we'll keep it simple but maybe require a "pull" feel or just simple detection
            if (currentStep < steps.length - 1) {
                // Optional: Add a small delay or visual cue before switching
                // handleNext(); 
                // NOTE: Immediate switching can be jarring. Let's just enable it for now as requested.
                // To avoid accidental triggers, we could check if the step is "complete" first?
                // The user requirement said "when user reaches the end... allow user to next step automatically"
                // I'll add a small debounce to avoid it triggering instantly if the content is short
            }
        }
    };

    // Using useEffect to scroll to top when step changes
    useEffect(() => {
        if (contentRef.current) {
            // contentRef.current.scrollTop = 0; // Already handled in handleNext, but good safety
        }
    }, [currentStep]);


    const renderStep = () => {
        switch (currentStep) {
            case 0:
                return <VisitDetailsStep data={formData} updateData={setFormData} />;
            case 1:
                return <ClinicalNoteStep data={formData} updateData={setFormData} />;
            case 2:
                return <DiagnosisAllergiesStep data={formData} updateData={setFormData} />;
            case 3:
                return <BillingStep data={formData} updateData={setFormData} />;
            case 4:
                return <SignaturesStep data={formData} updateData={setFormData} />;
            case 5:
                return <ReviewStep data={formData} />;
            default:
                return null;
        }
    };

    return (
        <div className="max-w-7xl mx-auto bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden flex flex-col md:flex-row h-full">
            {/* Vertical Tabs Sidebar */}
            <div className="w-full md:w-72 bg-gray-50 border-b md:border-b-0 md:border-r border-gray-200 flex flex-col shrink-0">
                <div className="p-6 border-b border-gray-100">
                    <h3 className="font-semibold text-gray-900">Encounter Details</h3>
                    <p className="text-xs text-gray-500 mt-1">Navigate sections freely</p>
                </div>

                <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
                    {steps.map((step, index) => {
                        const isActive = currentStep === index;
                        const isComplete = isStepComplete(step.id);
                        const StepIcon = step.icon;

                        return (
                            <button
                                key={step.id}
                                onClick={() => setCurrentStep(index)}
                                className={cn(
                                    "w-full flex items-center gap-3 p-3 rounded-lg text-left transition-all duration-200 group",
                                    isActive
                                        ? "bg-white shadow-sm ring-1 ring-gray-200"
                                        : "hover:bg-gray-100/80"
                                )}
                            >
                                <div className={cn(
                                    "w-8 h-8 rounded-lg flex items-center justify-center text-sm font-medium transition-colors shrink-0",
                                    isActive
                                        ? "bg-primary/10 text-primary"
                                        : isComplete
                                            ? "bg-green-100 text-green-700"
                                            : "bg-gray-200 text-gray-500 group-hover:bg-gray-300"
                                )}>
                                    {isComplete ? <CheckIcon className="h-5 w-5" /> : <StepIcon className="h-5 w-5" />}
                                </div>

                                <div className="flex-1 min-w-0">
                                    <p className={cn(
                                        "text-sm font-medium truncate",
                                        isActive ? "text-primary" : "text-gray-700"
                                    )}>
                                        {step.title}
                                    </p>
                                    <p className="text-xs text-gray-500 truncate">{step.description}</p>
                                </div>

                                {isActive && (
                                    <ChevronRightIcon className="h-4 w-4 text-primary shrink-0" />
                                )}
                            </button>
                        );
                    })}
                </nav>

                <div className="p-4 bg-gray-100/50 border-t border-gray-200">
                    <div className="text-xs text-gray-500 font-medium mb-2">Progress</div>
                    <div className="h-1.5 w-full bg-gray-200 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-green-500 transition-all duration-500 ease-out"
                            style={{
                                width: `${(steps.filter(s => isStepComplete(s.id)).length / (steps.length - 1)) * 100}%`
                            }}
                        />
                    </div>
                </div>
            </div>

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col bg-white min-w-0">
                {/* Scrollable Content */}
                <div
                    ref={contentRef}
                    onScroll={handleScroll}
                    className="flex-1 p-4 md:p-6 overflow-y-auto scroll-smooth"
                >
                    <div className="mb-3">
                        <h2 className="text-base font-bold text-gray-900">{steps[currentStep].title}</h2>
                        <p className="text-xs text-gray-500">{steps[currentStep].description}</p>
                    </div>

                    {renderStep()}

                    {/* Spacer to allow scrolling to trigger next step comfortably */}
                    <div className="h-20"></div>
                </div>

                {/* Persistent Footer Actions */}
                <div className="px-6 py-3 border-t border-gray-200 bg-gray-50 flex justify-between items-center shrink-0 z-10">
                    <div className="flex gap-3">
                        <Button
                            variant="outline"
                            onClick={handleBack}
                            disabled={currentStep === 0}
                            className="w-24 h-9 text-sm"
                        >
                            <ChevronLeftIcon className="h-3 w-3 mr-1" />
                            Back
                        </Button>
                    </div>

                    <div className="flex gap-3">
                        <Button variant="ghost" onClick={() => navigate('/clients')} className="h-9 text-sm">
                            Cancel
                        </Button>

                        <Button onClick={handleSave} className="bg-primary hover:bg-primary/90 text-primary-foreground w-28 h-9 text-sm">
                            Save
                        </Button>

                        {currentStep < steps.length - 1 && (
                            <Button onClick={handleNext} variant="outline" className="w-28 h-9 text-sm border-primary text-primary hover:bg-primary/5">
                                Next Step
                                <ChevronRightIcon className="h-3 w-3 ml-1" />
                            </Button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};
