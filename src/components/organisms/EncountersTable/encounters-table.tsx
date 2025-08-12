import React, { useState, useMemo, useRef } from 'react';
import { Badge } from '@/components/atoms/Badge';
import { Input } from '@/components/atoms/Input';
import { cn } from '@/lib/utils';
import { DataTable } from '@/components/organisms/DataTable';
import { ColumnMenuTab, GridOptions } from 'ag-grid-community';
import {
  MagnifyingGlassIcon,
  ClockIcon,
  UserIcon,
  DocumentTextIcon,
  CurrencyDollarIcon,
  ShieldCheckIcon,
  ExclamationTriangleIcon,
  ExclamationCircleIcon,
  ArrowTopRightOnSquareIcon,
} from '@heroicons/react/24/outline';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faDownload } from '@fortawesome/free-solid-svg-icons';
import {
  TooltipProvider
} from '@/components/atoms/Tooltip/tooltip';
import { Combobox, ComboboxOption } from '@/components/atoms/Combobox/Combobox';
import { RadioGroup, RadioGroupItem } from '@/components/atoms/RadioGroup/radio-group';
import { Tabs } from '@/components/atoms/Tabs';
import { useMediaQuery } from '@/hooks/useMediaQuery';

// Document interface for the document view
interface Document {
  id: string;
  date: string;
  name: string;
  category: string;
  program: string;
  billTo: string;
  size: string;
  type: string;
  uploadedBy: string;
}

// Encounter interface for the table
interface Encounter {
  id: string;
  date: string;
  category: string;
  encounterStatus: string;
  serviceProgram: string;
  billingProgram: string;
  billTo: string;
  issue: string;
  reasonForm: string;
  provider: string;
  unitsBilling: number;
  insurance: string;
  goldenThreadAlert?: {
    hasAlert: boolean;
    missingRules: string[];
    missingForms: string[];
  };
  isUnbilled?: boolean;
  unbilledReason?: string;
  // Billing-specific fields
  billingNote?: string;
  code?: string;
  charge?: number;
  paid?: number;
  adjustment?: number;
  balance?: number;
}

// Document categories from the provided list
const documentCategories = [
  'Incidents',
  'Incoming Call Documents',
  'Insurance Documents',
  'Lab Report',
  'Legal Documents',
  'Manual Intake forms',
  'Mid America Lab',
  'Patient ID card',
  'Patient Information',
  'Patient Photograph',
  'Portal Documents',
  'Referrals',
  'Reports',
  'Reports from CDI',
  'Reports from Other',
  'Scanned Assessment Paperwork',
  'Session notes from EHR',
  'Venous'
];

// Mock document data
const mockDocuments: Document[] = [
  {
    id: 'DOC001',
    date: '01/23/2025',
    name: 'Q17534831DS.png (Client Photograph) (Enc # 0)',
    category: 'Patient Photograph',
    program: '',
    billTo: '',
    size: '2.1 MB',
    type: 'PNG',
    uploadedBy: 'Admin User'
  },
  {
    id: 'DOC002',
    date: '01/19/2025',
    name: 'Q.png (Portal Documents) (Enc # 0)',
    category: 'Portal Documents',
    program: '',
    billTo: '',
    size: '1.8 MB',
    type: 'PNG',
    uploadedBy: 'Patient Portal'
  },
  {
    id: 'DOC003',
    date: '01/19/2025',
    name: 'patient_Doc1744-00721.png (Client Photograph) (Enc # 0)',
    category: 'Patient Photograph',
    program: '',
    billTo: '',
    size: '3.2 MB',
    type: 'PNG',
    uploadedBy: 'Clinical Staff'
  },
  {
    id: 'DOC004',
    date: '01/07/2025',
    name: 'Screenshot_2025_04_07-162004.png (Client ID card) (Enc # 0)',
    category: 'Patient ID card',
    program: '',
    billTo: '',
    size: '1.5 MB',
    type: 'PNG',
    uploadedBy: 'Registration'
  },
  {
    id: 'DOC005',
    date: '01/25/2025',
    name: 'Document: 1a.Communication_Documentation_etc (Lab Report) (Enc # 0)',
    category: 'Lab Report',
    program: 'A-METH',
    billTo: '',
    size: '856 KB',
    type: 'PDF',
    uploadedBy: 'Lab Tech'
  },
  {
    id: 'DOC006',
    date: '01/19/2025',
    name: 'Thumbnail_image.png (Advance Directive) (Enc # 0)',
    category: 'Legal Documents',
    program: 'A-METH',
    billTo: '',
    size: '2.3 MB',
    type: 'PNG',
    uploadedBy: 'Legal Dept'
  },
  {
    id: 'DOC007',
    date: '01/27/2025',
    name: 'Document: SATTL.GANGABATARAM.pdf (Encounter Documents) (Enc # 0)',
    category: 'Session notes from EHR',
    program: '',
    billTo: '',
    size: '1.2 MB',
    type: 'PDF',
    uploadedBy: 'Therapist'
  },
  {
    id: 'DOC008',
    date: '01/25/2025',
    name: 'Document: Screenshot_2024_05_04_131911.png (Client Photograph) (Enc # 0)',
    category: 'Patient Photograph',
    program: '',
    billTo: '',
    size: '4.1 MB',
    type: 'PNG',
    uploadedBy: 'Intake Staff'
  },
  {
    id: 'DOC009',
    date: '01/24/2025',
    name: 'Document: ganesh.jpg (Client Photograph) (Enc # 0)',
    category: 'Patient Photograph',
    program: 'A-AADC',
    billTo: '',
    size: '987 KB',
    type: 'JPG',
    uploadedBy: 'Clinical Staff'
  },
  {
    id: 'DOC010',
    date: '01/21/2025',
    name: 'Document: LabResult_20241225_120700.pdf (Lab Report) (Enc # 100206235)',
    category: 'Lab Report',
    program: 'B-ACTS',
    billTo: '',
    size: '2.7 MB',
    type: 'PDF',
    uploadedBy: 'Lab Coordinator'
  }
];

// Mock data for encounters based on the screenshot
const mockEncounters: Encounter[] = [
  {
    id: '100199626',
    date: '11/01/2024 2:08 PM',
    category: 'Alcohol Sessions',
    encounterStatus: 'Open',
    serviceProgram: 'Adult A&D Outpatient Services',
    billingProgram: 'Insurance',
    billTo: 'Insurance',
    issue: 'Alcohol Sessions Annual Assessment FB Form Test 1 (66.67%) CAMS Interim Session (0%)',
    reasonForm: 'Alcohol Sessions Annual Assessment FB Form Test 1 (66.67%) CAMS Interim Session (0%)',
    provider: 'GVC, chandana',
    unitsBilling: 3,
    insurance: 'Primary: (Medicaid) AETNA 012345',
    goldenThreadAlert: {
      hasAlert: true,
      missingRules: ['14 day treatment plan'],
      missingForms: ['FB Form Test 1', 'CAMS Interim Session']
    },
    billingNote: 'Admin., Ensoftek - CADC',
    code: '97166',
    charge: 350.00,
    paid: 0.00,
    adjustment: 0.00,
    balance: 350.00
  },
  {
    id: '100199617',
    date: '11/01/2024 1:35 PM',
    category: 'Alcohol Sessions',
    encounterStatus: 'Open',
    serviceProgram: 'Adult A&D Outpatient Services',
    billingProgram: 'Insurance',
    billTo: 'Insurance',
    issue: 'Alcohol Sessions Annual Assessment CAMS Initial Form (0%)',
    reasonForm: 'Alcohol Sessions Annual Assessment CAMS Initial Form (0%)',
    provider: 'GVC, chandana',
    unitsBilling: 4,
    insurance: 'Primary: (Medicaid) AETNA 012345',
    isUnbilled: true,
    unbilledReason: 'Missing authorization code - Insurance verification pending',
    billingNote: 'Patient Admin., Ensoftek - CADC',
    code: '90834',
    charge: 275.00,
    paid: 0.00,
    adjustment: 0.00,
    balance: 275.00
  },
  {
    id: '100191586',
    date: '06/10/2024 11:49 PM',
    category: 'Benzodiazepines',
    encounterStatus: 'Closed With Errors',
    serviceProgram: 'Room',
    billingProgram: 'Insurance',
    billTo: 'Insurance',
    issue: 'ICD10:F33.0 Major depressive disorder, recurrent, mild ICD10:C10.8 Malignant neoplasm of overlapping sites of oropharynx',
    reasonForm: 'PAR-Q HIR-Q (33.33%) Request For Tenancy Approval Packet',
    provider: 'Rayavarapu, Sairam',
    unitsBilling: 5,
    insurance: 'Primary: (Medicaid) AETNA F33.0 C10.8',
    goldenThreadAlert: {
      hasAlert: true,
      missingRules: ['14 day treatment plan'],
      missingForms: ['PAR-Q HIR-Q']
    },
    billingNote: 'Details not available',
    code: '90837',
    charge: 425.00,
    paid: 320.00,
    adjustment: 25.00,
    balance: 80.00
  },
  {
    id: '100199508',
    date: '10/28/2024 9:15 AM',
    category: 'Mental Health Therapy',
    encounterStatus: 'Closed',
    serviceProgram: 'Adult Mental Health Outpatient',
    billingProgram: 'Insurance',
    billTo: 'Insurance',
    issue: 'Individual therapy session - Anxiety and Depression management',
    reasonForm: 'Therapy Progress Form (100%) Mental Health Assessment (90%)',
    provider: 'Smith, Jennifer',
    unitsBilling: 2,
    insurance: 'Primary: (Commercial) Blue Cross Blue Shield',
    billingNote: 'Therapy session completed',
    code: '90834',
    charge: 200.00,
    paid: 200.00,
    adjustment: 0.00,
    balance: 0.00
  },
  {
    id: '100199445',
    date: '10/25/2024 3:30 PM',
    category: 'Drug Testing',
    encounterStatus: 'Closed',
    serviceProgram: 'Adult A&D Outpatient Services',
    billingProgram: 'Self-pay',
    billTo: 'Patient',
    issue: 'Random drug screening - Comprehensive panel',
    reasonForm: 'Drug Test Authorization Form (100%)',
    provider: 'Johnson, Michael',
    unitsBilling: 1,
    insurance: 'Self-pay'
  },
  {
    id: '100199389',
    date: '10/22/2024 11:00 AM',
    category: 'Medical Evaluation',
    encounterStatus: 'In Progress',
    serviceProgram: 'Primary Care Services',
    billingProgram: 'Medicaid',
    billTo: 'Medicaid',
    issue: 'Annual physical examination and routine blood work',
    reasonForm: 'Physical Exam Form (75%) Lab Orders (50%)',
    provider: 'Wilson, David',
    unitsBilling: 3,
    insurance: 'Primary: (Medicaid) United Healthcare',
    isUnbilled: true,
    unbilledReason: 'Encounter still in progress - Cannot bill until completed'
  },
  {
    id: '100199321',
    date: '10/18/2024 4:45 PM',
    category: 'Group Therapy',
    encounterStatus: 'Closed',
    serviceProgram: 'Adult A&D Outpatient Services',
    billingProgram: 'Insurance',
    billTo: 'Insurance',
    issue: 'Group therapy session - Substance abuse recovery support',
    reasonForm: 'Group Therapy Attendance Form (100%)',
    provider: 'Brown, Sarah',
    unitsBilling: 1,
    insurance: 'Primary: (Commercial) Anthem'
  },
  {
    id: '100199256',
    date: '10/15/2024 10:30 AM',
    category: 'Psychiatric Evaluation',
    encounterStatus: 'Open',
    serviceProgram: 'Adult Mental Health Outpatient',
    billingProgram: 'Insurance',
    billTo: 'Insurance',
    issue: 'Medication review and adjustment for bipolar disorder',
    reasonForm: 'Psychiatric Assessment Form (60%) Medication Review (40%)',
    provider: 'Garcia, Maria',
    unitsBilling: 4,
    insurance: 'Primary: (Commercial) Cigna Healthcare'
  },
  {
    id: '100199187',
    date: '10/12/2024 2:15 PM',
    category: 'Case Management',
    encounterStatus: 'Closed',
    serviceProgram: 'Adult A&D Outpatient Services',
    billingProgram: 'Medicaid',
    billTo: 'Medicaid',
    issue: 'Care coordination and discharge planning',
    reasonForm: 'Case Management Plan (100%) Discharge Summary (95%)',
    provider: 'Davis, Robert',
    unitsBilling: 2,
    insurance: 'Primary: (Medicaid) Molina Healthcare'
  },
  {
    id: '100199098',
    date: '10/08/2024 8:00 AM',
    category: 'Crisis Intervention',
    encounterStatus: 'Closed With Errors',
    serviceProgram: 'Emergency Mental Health Services',
    billingProgram: 'Insurance',
    billTo: 'Insurance',
    issue: 'Emergency psychiatric evaluation - Suicidal ideation',
    reasonForm: 'Crisis Assessment Form (85%) Safety Plan (100%)',
    provider: 'Miller, Lisa',
    unitsBilling: 6,
    insurance: 'Primary: (Commercial) Humana',
    isUnbilled: true,
    unbilledReason: 'Billing errors detected - Missing required documentation',
    goldenThreadAlert: {
      hasAlert: true,
      missingRules: ['14 day treatment plan', 'Crisis intervention protocol'],
      missingForms: ['Crisis Assessment Form', 'Follow-up Plan']
    }
  },
  {
    id: '100199023',
    date: '10/04/2024 1:20 PM',
    category: 'Family Therapy',
    encounterStatus: 'In Progress',
    serviceProgram: 'Family Support Services',
    billingProgram: 'Self-pay',
    billTo: 'Patient',
    issue: 'Family counseling session - Communication and relationship issues',
    reasonForm: 'Family Assessment Form (70%) Treatment Plan (50%)',
    provider: 'Anderson, Thomas',
    unitsBilling: 2,
    insurance: 'Self-pay',
    goldenThreadAlert: {
      hasAlert: true,
      missingRules: ['14 day treatment plan'],
      missingForms: ['Treatment Plan']
    }
  },
  {
    id: '100198967',
    date: '09/30/2024 5:00 PM',
    category: 'Medication Management',
    encounterStatus: 'Closed',
    serviceProgram: 'Adult Mental Health Outpatient',
    billingProgram: 'Insurance',
    billTo: 'Insurance',
    issue: 'Medication monitoring and side effect assessment',
    reasonForm: 'Medication Monitoring Form (100%) Side Effect Checklist (100%)',
    provider: 'Taylor, Patricia',
    unitsBilling: 1,
    insurance: 'Primary: (Medicaid) WellCare'
  }
];

// Helper to get status badge styles
const getStatusBadgeStyles = (status: string) => {
  switch (status.toLowerCase()) {
    case 'open':
      return "bg-green-50 text-green-700 border-green-200";
    case 'closed with errors':
      return "bg-red-50 text-red-700 border-red-200";
    case 'closed':
      return "bg-gray-50 text-gray-700 border-gray-200";
    case 'in progress':
      return "bg-blue-50 text-blue-700 border-blue-200";
    default:
      return "bg-gray-50 text-gray-700 border-gray-200";
  }
};

// Helper to get billing program badge styles
const getBillingBadgeStyles = (program: string) => {
  switch (program.toLowerCase()) {
    case 'insurance':
      return "bg-blue-50 text-blue-700 border-blue-200";
    case 'self-pay':
      return "bg-amber-50 text-amber-700 border-amber-200";
    case 'medicaid':
      return "bg-green-50 text-green-700 border-green-200";
    default:
      return "bg-gray-50 text-gray-700 border-gray-200";
  }
};

// Helper to create Golden Thread Alert tooltip content
const createGoldenThreadTooltip = (alert: { missingRules: string[]; missingForms: string[] }) => {
  let tooltip = '[Golden Thread Rule]\n- One or more forms do not meet the golden thread rules:\n';
  tooltip += alert.missingRules.join(', ');
  tooltip += '\n\n[Form Completion Rule]\nThe following forms do not meet the completion criteria:\n';
  tooltip += alert.missingForms.join(', ');
  return tooltip;
};

// Simple custom tooltip component that renders outside AG Grid
const CustomTooltip: React.FC<{
  children: React.ReactNode;
  content: string;
  type: 'golden' | 'unbilled';
}> = ({ children, content, type }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const triggerRef = useRef<HTMLDivElement>(null);

  const handleMouseEnter = (e: React.MouseEvent) => {
    if (triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect();
      const newPosition = {
        x: rect.left + rect.width / 2,
        y: rect.bottom + 8
      };
      console.log('Tooltip position:', newPosition, 'Type:', type);
      setPosition(newPosition);
      setIsVisible(true);
    }
  };

  const handleMouseLeave = () => {
    setIsVisible(false);
  };

  const tooltipStyles = type === 'golden' 
    ? 'bg-amber-100 border-amber-300 text-amber-900 border-2'
    : 'bg-red-100 border-red-300 text-red-900 border-2';

  return (
    <>
      <div
        ref={triggerRef}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        style={{ pointerEvents: 'auto' }}
      >
        {children}
      </div>
      {isVisible && (
        <div
          className={`fixed max-w-sm border text-xs p-3 shadow-lg z-[10000] whitespace-pre-line rounded-md ${tooltipStyles}`}
          style={{
            left: `${position.x}px`,
            top: `${position.y}px`,
            transform: 'translateX(-50%)',
            pointerEvents: 'none',
            display: 'block'
          }}
        >
          {type === 'unbilled' && <div className="font-medium mb-1">Unbilled Encounter</div>}
          {content}
        </div>
      )}
    </>
  );
};

// Add new EncounterCard component for mobile view
const EncounterCard: React.FC<{ encounter: Encounter; onSelect: (encounter: Encounter) => void }> = ({ encounter, onSelect }) => {
  return (
    <div 
      className="bg-white rounded-lg border border-gray-100 p-4 mb-3 shadow-sm active:bg-gray-50"
      onClick={() => onSelect(encounter)}
    >
      {/* Header with Date and Status */}
      <div className="flex justify-between items-start mb-2">
        <div className="flex items-center text-sm text-gray-600">
          <ClockIcon className="h-4 w-4 mr-1" />
          {encounter.date}
          
          {/* Alert Icons */}
          <div className="flex items-center gap-2 ml-2">
            {/* Golden Thread Alert - Clinical Documentation Issues */}
            {encounter.goldenThreadAlert?.hasAlert && (
              <div 
                className="relative group"
                title={createGoldenThreadTooltip(encounter.goldenThreadAlert)}
              >
                <div className="relative flex items-center justify-center w-5 h-5 bg-amber-100 border-2 border-amber-400 rounded-full shadow-sm">
                  <ExclamationTriangleIcon className="h-3 w-3 text-amber-700 font-bold" />
                  <div className="absolute inset-0 bg-amber-400 rounded-full animate-ping opacity-20"></div>
                </div>
              </div>
            )}

            {/* Unbilled Alert - Financial/Billing Issues */}
            {encounter.isUnbilled && (
              <div 
                className="relative group"
                title={`Unbilled Encounter: ${encounter.unbilledReason}`}
              >
                <div className="relative flex items-center justify-center w-5 h-5 bg-red-100 border-2 border-red-400 rounded-full shadow-sm">
                  <ExclamationCircleIcon className="h-3 w-3 text-red-700 font-bold" />
                  <div className="absolute inset-0 bg-red-400 rounded-full animate-ping opacity-20"></div>
                </div>
              </div>
            )}
          </div>
        </div>
        <Badge variant="outline" className={cn('text-xs h-6', getStatusBadgeStyles(encounter.encounterStatus))}>
          {encounter.encounterStatus}
        </Badge>
      </div>
      
      {/* Category and Service Program */}
      <div className="mb-3">
        <h3 className="text-sm font-medium text-gray-900 mb-1">
          {encounter.category}
        </h3>
        <p className="text-xs text-gray-600">
          {encounter.serviceProgram}
        </p>
      </div>
      
      {/* Issue/Reason */}
      <p className="text-sm text-gray-600 mb-3 line-clamp-2">
        {encounter.issue}
      </p>
      
      {/* Provider and Billing Info */}
      <div className="grid grid-cols-2 gap-2 text-xs text-gray-600 mb-3">
        <div className="flex items-center">
          <UserIcon className="h-3.5 w-3.5 mr-1 text-gray-400" />
          {encounter.provider}
        </div>
        <div className="flex items-center">
          <CurrencyDollarIcon className="h-3.5 w-3.5 mr-1 text-gray-400" />
          {encounter.unitsBilling} units
        </div>
      </div>
      
      {/* Insurance and Billing */}
      <div className="flex items-center justify-between">
        <Badge variant="outline" className={cn('text-xs h-6', getBillingBadgeStyles(encounter.billingProgram))}>
          {encounter.billingProgram}
        </Badge>
        <div className="text-xs text-gray-500 truncate ml-2">
          {encounter.insurance}
        </div>
      </div>
    </div>
  );
};

export interface EncountersTableProps {
  className?: string;
  patientId?: string;
}

/**
 * EncountersTable Component
 * 
 * Displays past encounters of a patient in a tabular format.
 * Includes filtering and search functionality.
 */
const EncountersTable: React.FC<EncountersTableProps> = ({
  className,
  patientId
}) => {
  // Search and filter state - following staff dashboard pattern
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedIndividualEncounters, setSelectedIndividualEncounters] = useState<string[]>([]);
  const [selectedGroupEncounters, setSelectedGroupEncounters] = useState<string[]>([]);
  const [selectedServiceLocation, setSelectedServiceLocation] = useState<string[]>([]);
  const [selectedProvider, setSelectedProvider] = useState<string[]>([]);
  const [selectedForms, setSelectedForms] = useState<string[]>([]);
  const [selectedEncounterStatus, setSelectedEncounterStatus] = useState<string[]>([]);
  const [serviceDateFilter, setServiceDateFilter] = useState<'all' | 'range'>('all');
  const [activeTab, setActiveTab] = useState<'clinical' | 'billing' | 'document'>('clinical');
  const [selectedEncounter, setSelectedEncounter] = useState<Encounter | null>(null);
  
  // Document view state
  const [documents, setDocuments] = useState<Document[]>(mockDocuments);
  const [selectedDocumentCategory, setSelectedDocumentCategory] = useState<string[]>([]);
  const [documentSearchQuery, setDocumentSearchQuery] = useState<string>('');
  const isMobile = useMediaQuery('(max-width: 640px)');

  // Handle encounter selection
  const handleEncounterSelect = (encounter: Encounter) => {
    setSelectedEncounter(encounter);
  };

  // Get unique options for dropdowns - following staff dashboard pattern
  const individualEncounterOptions = useMemo((): ComboboxOption[] => {
    const encounters = [...new Set(mockEncounters.filter(e => e.category.includes('Individual') || e.category.includes('Therapy')).map(e => e.category))];
    return encounters.sort().map(encounter => ({ value: encounter, label: encounter }));
  }, []);

  const groupEncounterOptions = useMemo((): ComboboxOption[] => {
    const encounters = [...new Set(mockEncounters.filter(e => e.category.includes('Group') || e.category.includes('Sessions')).map(e => e.category))];
    return encounters.sort().map(encounter => ({ value: encounter, label: encounter }));
  }, []);

  const serviceLocationOptions = useMemo((): ComboboxOption[] => {
    const locations = [...new Set(mockEncounters.map(e => e.serviceProgram))];
    return locations.sort().map(location => ({ value: location, label: location }));
  }, []);

  const providerOptions = useMemo((): ComboboxOption[] => {
    const providers = [...new Set(mockEncounters.map(e => e.provider))];
    return providers.sort().map(provider => ({ value: provider, label: provider }));
  }, []);

  const formsOptions = useMemo((): ComboboxOption[] => {
    return [
      { value: 'All', label: 'All' },
      { value: 'Treatment Plan', label: 'Treatment Plan' },
      { value: 'Progress Note', label: 'Progress Note' },
      { value: 'Assessment', label: 'Assessment' }
    ];
  }, []);

  const encounterStatusOptions = useMemo((): ComboboxOption[] => {
    const statuses = [...new Set(mockEncounters.map(e => e.encounterStatus))];
    return statuses.sort().map(status => ({ value: status, label: status }));
  }, []);

  const documentCategoryOptions: ComboboxOption[] = documentCategories.map(category => ({
    value: category,
    label: category
  }));

  const filteredDocuments = useMemo(() => {
    let filtered = documents;

    if (documentSearchQuery.trim()) {
      const query = documentSearchQuery.toLowerCase();
      filtered = filtered.filter(doc => 
        doc.name.toLowerCase().includes(query) ||
        doc.category.toLowerCase().includes(query) ||
        doc.program.toLowerCase().includes(query) ||
        doc.type.toLowerCase().includes(query)
      );
    }

    if (selectedDocumentCategory.length > 0) {
      filtered = filtered.filter(doc => 
        selectedDocumentCategory.includes(doc.category)
      );
    }

    return filtered;
  }, [documents, documentSearchQuery, selectedDocumentCategory]);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      const newDocuments: Document[] = Array.from(files).map((file, index) => ({
        id: `DOC${Date.now()}_${index}`,
        date: new Date().toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' }),
        name: `${file.name} (Uploaded Document) (Enc # 0)`,
        category: 'Portal Documents', 
        program: '',
        billTo: '',
        size: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
        type: file.type.split('/')[1]?.toUpperCase() || 'FILE',
        uploadedBy: 'Current User'
      }));
      
      setDocuments(prev => [...newDocuments, ...prev]);
    }
  };

  const filteredEncounters = useMemo(() => {
    return mockEncounters.filter(encounter => {
      const matchesSearch = searchQuery === '' || 
        encounter.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        encounter.provider.toLowerCase().includes(searchQuery.toLowerCase()) ||
        encounter.serviceProgram.toLowerCase().includes(searchQuery.toLowerCase()) ||
        encounter.issue.toLowerCase().includes(searchQuery.toLowerCase()) ||
        encounter.id.includes(searchQuery);
      
      // Individual encounters filtering
      const matchesIndividual = selectedIndividualEncounters.length === 0 || 
        selectedIndividualEncounters.some(selected => encounter.category.includes(selected));
      
      // Group encounters filtering
      const matchesGroup = selectedGroupEncounters.length === 0 || 
        selectedGroupEncounters.some(selected => encounter.category.includes(selected));
      
      // Service location filtering
      const matchesLocation = selectedServiceLocation.length === 0 || 
        selectedServiceLocation.includes(encounter.serviceProgram);
      
      // Provider filtering
      const matchesProvider = selectedProvider.length === 0 || 
        selectedProvider.includes(encounter.provider);
      
      // Forms filtering (placeholder for now)
      const matchesForms = selectedForms.length === 0 || selectedForms.includes('All');
      
      // Encounter status filtering
      const matchesStatus = selectedEncounterStatus.length === 0 || 
        selectedEncounterStatus.includes(encounter.encounterStatus);
      
      return matchesSearch && matchesIndividual && matchesGroup && 
             matchesLocation && matchesProvider && matchesForms && 
             matchesStatus;
    });
  }, [searchQuery, selectedIndividualEncounters, selectedGroupEncounters, 
      selectedServiceLocation, selectedProvider, selectedForms, 
      selectedEncounterStatus]);

  const gridOptions: GridOptions = {
    suppressCellFocus: true,
    animateRows: true,
    pagination: true,
    paginationPageSize: 20,
    domLayout: 'normal',
    rowHeight: 60, // Slightly taller for multi-line content
    headerHeight: 40,
    onRowClicked: (params: any) => handleEncounterSelect(params.data),
    suppressHorizontalScroll: false,
    alwaysShowHorizontalScroll: false,
    suppressAutoSize: false,
    skipHeaderOnAutoSize: false,
    defaultColDef: {
      sortable: true,
      filter: 'agTextColumnFilter',
      menuTabs: ['filterMenuTab'] as ColumnMenuTab[],
      filterParams: {
        buttons: ['reset', 'apply'],
        closeOnApply: true
      },
      floatingFilter: false,
      resizable: true,
      flex: 1
    }
  };

  const columnDefs = [
    {
      headerName: '',
      field: 'alerts',
      colId: 'alerts',
      width: 100,
      minWidth: 100,
      maxWidth: 100,
      pinned: 'left' as const,
      filter: false,
      sortable: false,
      suppressMenu: true,
      resizable: false,
      cellRenderer: (params: any) => {
        const hasGoldenThread = params.data.goldenThreadAlert?.hasAlert;
        const hasUnbilled = params.data.isUnbilled;
        
        // Debug logging for dual alerts
        if (hasGoldenThread && hasUnbilled) {
          console.log('Dual alerts for encounter:', params.data.id, 'Golden:', hasGoldenThread, 'Unbilled:', hasUnbilled);
        }
        
        if (!hasGoldenThread && !hasUnbilled) {
          return null;
        }

        return (
          <div className="flex items-center justify-center gap-1 h-full w-full px-1">
            {/* Golden Thread Alert - Clinical Documentation Issues */}
            {hasGoldenThread && (
              <div 
                className="relative group flex-shrink-0"
                title={createGoldenThreadTooltip(params.data.goldenThreadAlert)}
              >
                <CustomTooltip
                  content={createGoldenThreadTooltip(params.data.goldenThreadAlert)}
                  type="golden"
                >
                  <div className="relative flex items-center justify-center w-7 h-7 bg-amber-100 border-2 border-amber-400 rounded-full shadow-sm hover:shadow-md transition-all duration-200 hover:scale-105 cursor-pointer">
                    <ExclamationTriangleIcon className="h-4 w-4 text-amber-700 font-bold" />
                    {/* Pulse animation for emphasis */}
                    <div className="absolute inset-0 bg-amber-400 rounded-full animate-ping opacity-20"></div>
                  </div>
                </CustomTooltip>
              </div>
            )}

            {/* Unbilled Alert - Financial/Billing Issues */}
            {hasUnbilled && (
              <div 
                className="relative group flex-shrink-0"
                title={`Unbilled Encounter: ${params.data.unbilledReason}`}
              >
                <CustomTooltip
                  content={params.data.unbilledReason}
                  type="unbilled"
                >
                  <div className="relative flex items-center justify-center w-7 h-7 bg-red-100 border-2 border-red-400 rounded-full shadow-sm hover:shadow-md transition-all duration-200 hover:scale-105 cursor-pointer">
                    <ExclamationCircleIcon className="h-4 w-4 text-red-700 font-bold" />
                    {/* Pulse animation for emphasis */}
                    <div className="absolute inset-0 bg-red-400 rounded-full animate-ping opacity-20"></div>
                  </div>
                </CustomTooltip>
              </div>
            )}
          </div>
        );
      }
    },
    {
      headerName: 'Date',
      field: 'date',
      colId: 'date',
      minWidth: 160,
      filter: 'agTextColumnFilter',
      sort: 'desc' as const,
      sortIndex: 0,
      pinned: 'left' as const,
      cellRenderer: (params: any) => (
        <div className="flex items-center text-sm text-gray-600">
          <ClockIcon className="h-4 w-4 mr-2 text-gray-500" />
          {params.data.date}
        </div>
      )
    },
    {
      headerName: 'Category/Encounter',
      field: 'category',
      colId: 'category',
      minWidth: 180,
      filter: 'agTextColumnFilter',
      cellRenderer: (params: any) => (
        <div>
          <div className="text-sm font-medium text-gray-900">
            {params.data.category}
          </div>
          <div className="text-xs text-gray-500">
            ({params.data.id})
          </div>
        </div>
      )
    },
    {
      headerName: 'Encounter Status',
      field: 'encounterStatus',
      minWidth: 140,
      filter: 'agSetColumnFilter',
      cellRenderer: (params: any) => (
        <Badge variant="outline" className={cn('text-sm h-6', getStatusBadgeStyles(params.data.encounterStatus))}>
          {params.data.encounterStatus}
        </Badge>
      )
    },
    {
      headerName: 'Service Program',
      field: 'serviceProgram',
      minWidth: 220,
      filter: 'agTextColumnFilter',
      cellRenderer: (params: any) => {
        // Helper function to handle popup icon click
        const handlePopupClick = (e: React.MouseEvent) => {
          e.stopPropagation(); // Prevent row selection
          console.log('Opening service program popup for:', params.data.serviceProgram);
          // TODO: Open service program details popup/modal
        };

        return (
          <div className="flex items-center justify-between text-sm text-gray-600 group">
            <div className="flex items-center flex-1 min-w-0">
              <span className="truncate" title={params.data.serviceProgram}>
                {params.data.serviceProgram}
              </span>
            </div>
            <button
              onClick={handlePopupClick}
              className="ml-2 p-1 rounded-full hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-colors duration-150 opacity-0 group-hover:opacity-100 flex-shrink-0"
              title="Open service program details"
            >
              <ArrowTopRightOnSquareIcon className="h-3.5 w-3.5 text-gray-400 hover:text-blue-600" />
            </button>
          </div>
        );
      }
    },
    {
      headerName: 'Billing Program',
      field: 'billingProgram',
      minWidth: 120,
      filter: 'agSetColumnFilter',
      cellRenderer: (params: any) => (
        <Badge variant="outline" className={cn('text-sm h-6', getBillingBadgeStyles(params.data.billingProgram))}>
          {params.data.billingProgram}
        </Badge>
      )
    },
    {
      headerName: 'Bill-To',
      field: 'billTo',
      minWidth: 100,
      filter: 'agSetColumnFilter',
      cellRenderer: (params: any) => (
        <div className="text-sm text-gray-600">
          {params.data.billTo}
        </div>
      )
    },
    {
      headerName: 'Issue',
      field: 'issue',
      minWidth: 300,
      filter: 'agTextColumnFilter',
      cellRenderer: (params: any) => (
        <div className="text-sm text-gray-600 line-clamp-2" title={params.data.issue}>
          {params.data.issue}
        </div>
      )
    },
    {
      headerName: 'Reason/Form',
      field: 'reasonForm',
      minWidth: 250,
      filter: 'agTextColumnFilter',
      cellRenderer: (params: any) => {
        // Parse and render forms as clickable links
        const reasonFormText = params.data.reasonForm;
        
        // Helper function to handle form clicks
        const handleFormClick = (formName: string, e: React.MouseEvent) => {
          e.stopPropagation(); // Prevent row selection
          console.log('Opening form:', formName);
          // TODO: Navigate to form or open form modal
        };
        
        // Improved regex to match form patterns with percentages
        // Matches: "Form Name (percentage%)" or standalone form names
        const formPattern = /([A-Za-z][A-Za-z\s\-&]+(?:Form|Assessment|Session|Plan|Summary|Orders|Review|Packet)(?:\s+[A-Za-z0-9\s]*)?)\s*(\(\d+(?:\.\d+)?%\))?/gi;
        
        const parts: Array<{ text: string; isForm: boolean; fullMatch: string }> = [];
        let lastIndex = 0;
        let match;
        
        // Find all form matches
        while ((match = formPattern.exec(reasonFormText)) !== null) {
          // Add text before the match
          if (match.index > lastIndex) {
            const beforeText = reasonFormText.slice(lastIndex, match.index);
            if (beforeText.trim()) {
              parts.push({ text: beforeText, isForm: false, fullMatch: beforeText });
            }
          }
          
          // Add the form match
          const formName = match[1].trim();
          const percentage = match[2] || '';
          const fullMatch = formName + (percentage ? ' ' + percentage : '');
          parts.push({ text: fullMatch, isForm: true, fullMatch });
          
          lastIndex = match.index + match[0].length;
        }
        
        // Add remaining text after last match
        if (lastIndex < reasonFormText.length) {
          const remainingText = reasonFormText.slice(lastIndex);
          if (remainingText.trim()) {
            parts.push({ text: remainingText, isForm: false, fullMatch: remainingText });
          }
        }
        
        // If no forms found, treat as plain text
        if (parts.length === 0) {
          parts.push({ text: reasonFormText, isForm: false, fullMatch: reasonFormText });
        }
        
        return (
          <div className="text-sm line-clamp-2" title={reasonFormText}>
            {parts.map((part, index: number) => {
              if (part.isForm) {
                return (
                  <button
                    key={index}
                    onClick={(e) => handleFormClick(part.text, e)}
                    className="text-blue-600 hover:text-blue-800 hover:underline focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 rounded px-1 transition-colors duration-150 mr-1"
                  >
                    {part.text}
                  </button>
                );
              }
              return <span key={index} className="text-gray-600">{part.text}</span>;
            })}
          </div>
        );
      }
    },
    {
      headerName: 'Provider',
      field: 'provider',
      minWidth: 150,
      filter: 'agTextColumnFilter',
      cellRenderer: (params: any) => (
        <div className="flex items-center text-sm text-gray-600">
          <UserIcon className="h-4 w-4 mr-2 text-gray-500" />
          {params.data.provider}
        </div>
      )
    },
    {
      headerName: 'Units Billing',
      field: 'unitsBilling',
      minWidth: 100,
      filter: 'agNumberColumnFilter',
      cellRenderer: (params: any) => (
        <div className="flex items-center text-sm text-gray-600">
          <CurrencyDollarIcon className="h-4 w-4 mr-1 text-gray-500" />
          {params.data.unitsBilling}
        </div>
      )
    },
    {
      headerName: 'Insurance',
      field: 'insurance',
      minWidth: 200,
      filter: 'agTextColumnFilter',
      cellRenderer: (params: any) => (
        <div className="flex items-center text-sm text-gray-600">
          <ShieldCheckIcon className="h-4 w-4 mr-2 text-gray-500" />
          <span className="truncate" title={params.data.insurance}>
            {params.data.insurance}
          </span>
        </div>
      )
    }
  ];

  return (
    <TooltipProvider>
      <div className={cn("bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100", className)}>
        {/* Tab Navigation */}
        <div className="border-b border-gray-200 px-4 pt-4">
          <Tabs
            tabs={[
              {
                id: 'clinical',
                label: 'Clinical View',
                icon: <UserIcon className="w-4 h-4" />
              },
              {
                id: 'billing',
                label: 'Billing View',
                icon: <CurrencyDollarIcon className="w-4 h-4" />
              },
              {
                id: 'document',
                label: 'Document View',
                icon: <DocumentTextIcon className="w-4 h-4" />
              }
            ]}
            activeTab={activeTab}
            onTabChange={(tabId) => setActiveTab(tabId as 'clinical' | 'billing' | 'document')}
            className="mb-4"
          />
        </div>

        {/* Clinical View Tab Content */}
        {activeTab === 'clinical' && (
          <div>
            {/* Search and Filter Controls - Following Staff Dashboard Pattern */}
            <div className="p-4 pb-0">
              <div className="space-y-4">
                {/* Row 1: Search Bar + Service Date */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
                  <div className="relative flex-1 max-w-2xl">
                    <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                      type="text"
                      placeholder="Search encounters by ID, category, provider, or issue..."
                      value={searchQuery}
                      onChange={e => setSearchQuery(e.target.value)}
                      className="pl-10 w-full"
                    />
                  </div>
                  
                  <div className="flex items-center gap-3 flex-shrink-0">
                    <span className="text-sm font-medium text-gray-700">Service Date:</span>
                    <RadioGroup
                      value={serviceDateFilter}
                      onValueChange={(value) => setServiceDateFilter(value as 'all' | 'range')}
                      className="flex items-center gap-4"
                    >
                      <div className="flex items-center gap-2">
                        <RadioGroupItem value="all" id="all" />
                        <label htmlFor="all" className="text-sm font-medium text-gray-700 cursor-pointer">
                          All
                        </label>
                      </div>
                      <div className="flex items-center gap-2">
                        <RadioGroupItem value="range" id="range" />
                        <label htmlFor="range" className="text-sm font-medium text-gray-700 cursor-pointer">
                          Range:
                        </label>
                      </div>
                    </RadioGroup>
                  </div>
                </div>

               
                {/* Row 3: Main Filters - Horizontal Layout */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3">
                  <div className="space-y-1">
                    <label className="text-xs font-medium text-gray-600">Individual Encounters:</label>
                    <Combobox
                      options={individualEncounterOptions}
                      value={selectedIndividualEncounters}
                      onChange={setSelectedIndividualEncounters}
                      placeholder="-- Select --"
                      className="w-full"
                      multiple={true}
                      hideFilters={true}
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-medium text-gray-600">Group Encounters:</label>
                    <Combobox
                      options={groupEncounterOptions}
                      value={selectedGroupEncounters}
                      onChange={setSelectedGroupEncounters}
                      placeholder="-- Select --"
                      className="w-full"
                      multiple={true}
                      hideFilters={true}
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-medium text-gray-600">Service Location:</label>
                    <Combobox
                      options={serviceLocationOptions}
                      value={selectedServiceLocation}
                      onChange={setSelectedServiceLocation}
                      placeholder="-- All --"
                      className="w-full"
                      multiple={true}
                      hideFilters={true}
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-medium text-gray-600">Provider:</label>
                    <Combobox
                      options={providerOptions}
                      value={selectedProvider}
                      onChange={setSelectedProvider}
                      placeholder="-- All --"
                      className="w-full"
                      multiple={true}
                      hideFilters={true}
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-medium text-gray-600">Forms:</label>
                    <Combobox
                      options={formsOptions}
                      value={selectedForms}
                      onChange={setSelectedForms}
                      placeholder="-- All --"
                      className="w-full"
                      multiple={true}
                      hideFilters={true}
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-medium text-gray-600">Encounter status:</label>
                    <Combobox
                      options={encounterStatusOptions}
                      value={selectedEncounterStatus}
                      onChange={setSelectedEncounterStatus}
                      placeholder="--All--"
                      className="w-full"
                      multiple={true}
                      hideFilters={true}
                    />
                  </div>
                </div>
              </div>
            </div>
          
            {/* Clinical Table Content */}
            <div className="px-4 pb-4 pt-2">
              {filteredEncounters.length > 0 ? (
                <>
                  {/* Desktop View */}
                  <div className="hidden sm:block w-full overflow-x-auto">
                    <div className="min-w-[1400px] h-[calc(100vh-320px)]">
                      <DataTable
                        rowData={filteredEncounters}
                        columnDefs={columnDefs}
                        className="w-full h-full rounded-lg"
                        gridOptions={gridOptions}
                      />
                    </div>
                  </div>
                  
                  {/* Mobile View */}
                  <div className="sm:hidden max-h-[calc(100vh-320px)] overflow-y-auto">
                    {filteredEncounters.map((encounter) => (
                      <EncounterCard 
                        key={encounter.id} 
                        encounter={encounter}
                        onSelect={handleEncounterSelect}
                      />
                    ))}
                  </div>
                </>
              ) : (
                <div className="flex flex-col items-center justify-center text-center h-[calc(100vh-320px)]">
                  <DocumentTextIcon className="h-10 w-10 text-gray-300 mb-2" />
                  <p className="text-gray-500">
                    {searchQuery.trim() 
                      ? `No encounters found matching "${searchQuery}"` 
                      : "No encounters found for the selected filter."}
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Billing View Tab Content */}
        {activeTab === 'billing' && (
          <div>
            {/* Billing Search and Filter Controls - Same as Clinical View */}
            <div className="p-4 pb-0">
              <div className="space-y-4">
                {/* Row 1: Search Bar + Service Date */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
                  <div className="relative flex-1 max-w-2xl">
                    <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                      type="text"
                      placeholder="Search by billing code, provider, or insurance..."
                      value={searchQuery}
                      onChange={e => setSearchQuery(e.target.value)}
                      className="pl-10 w-full"
                    />
                  </div>
                  
                  <div className="flex items-center gap-3 flex-shrink-0">
                    <span className="text-sm font-medium text-gray-700">Service Date:</span>
                    <RadioGroup
                      value={serviceDateFilter}
                      onValueChange={(value) => setServiceDateFilter(value as 'all' | 'range')}
                      className="flex items-center gap-4"
                    >
                      <div className="flex items-center gap-2">
                        <RadioGroupItem value="all" id="billing-all" />
                        <label htmlFor="billing-all" className="text-sm font-medium text-gray-700 cursor-pointer">
                          All
                        </label>
                      </div>
                      <div className="flex items-center gap-2">
                        <RadioGroupItem value="range" id="billing-range" />
                        <label htmlFor="billing-range" className="text-sm font-medium text-gray-700 cursor-pointer">
                          Range:
                        </label>
                      </div>
                    </RadioGroup>
                  </div>
                </div>

                {/* Row 2: Main Filters - Same as Clinical View */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3">
                  <div className="space-y-1">
                    <label className="text-xs font-medium text-gray-600">Individual Encounters:</label>
                    <Combobox
                      options={individualEncounterOptions}
                      value={selectedIndividualEncounters}
                      onChange={setSelectedIndividualEncounters}
                      placeholder="-- Select --"
                      className="w-full"
                      multiple={true}
                      hideFilters={true}
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-medium text-gray-600">Group Encounters:</label>
                    <Combobox
                      options={groupEncounterOptions}
                      value={selectedGroupEncounters}
                      onChange={setSelectedGroupEncounters}
                      placeholder="-- Select --"
                      className="w-full"
                      multiple={true}
                      hideFilters={true}
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-medium text-gray-600">Service Location:</label>
                    <Combobox
                      options={serviceLocationOptions}
                      value={selectedServiceLocation}
                      onChange={setSelectedServiceLocation}
                      placeholder="-- Select --"
                      className="w-full"
                      multiple={true}
                      hideFilters={true}
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-medium text-gray-600">Provider:</label>
                    <Combobox
                      options={providerOptions}
                      value={selectedProvider}
                      onChange={setSelectedProvider}
                      placeholder="-- Select --"
                      className="w-full"
                      multiple={true}
                      hideFilters={true}
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-medium text-gray-600">Forms:</label>
                    <Combobox
                      options={formsOptions}
                      value={selectedForms}
                      onChange={setSelectedForms}
                      placeholder="-- Select --"
                      className="w-full"
                      multiple={true}
                      hideFilters={true}
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-medium text-gray-600">Encounter Status:</label>
                    <Combobox
                      options={encounterStatusOptions}
                      value={selectedEncounterStatus}
                      onChange={setSelectedEncounterStatus}
                      placeholder="-- Select --"
                      className="w-full"
                      multiple={true}
                      hideFilters={true}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Billing Table */}
            <div className="p-4">
              <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-200">
                      <tr>
                        <th className="px-3 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap w-[100px]">Alert</th>
                        <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Date</th>
                        <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Category/Encounter</th>
                        <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Encounter Status</th>
                        <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Service Program</th>
                        <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Billing Program</th>
                        <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Bill-To</th>
                        <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Provider</th>
                        <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Billing Note</th>
                        <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Code</th>
                        <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Units</th>
                        <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Chg</th>
                        <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Paid</th>
                        <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Adj</th>
                        <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Bal</th>
                        <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Insurance</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {filteredEncounters.map((encounter, index) => (
                        <tr key={encounter.id} className={cn(
                          "hover:bg-gray-50 transition-colors duration-150",
                          index % 2 === 0 ? "bg-white" : "bg-gray-50/30"
                        )}>
                          <td className="px-3 py-3 text-center whitespace-nowrap w-[100px]">
                            <div className="flex items-center justify-center gap-1 h-full w-full px-1">
                              {/* Golden Thread Alert - Clinical Documentation Issues */}
                              {encounter.goldenThreadAlert?.hasAlert && (
                                <div 
                                  className="relative group flex-shrink-0"
                                  title={createGoldenThreadTooltip(encounter.goldenThreadAlert)}
                                >
                                  <CustomTooltip
                                    content={createGoldenThreadTooltip(encounter.goldenThreadAlert)}
                                    type="golden"
                                  >
                                    <div className="relative flex items-center justify-center w-7 h-7 bg-amber-100 border-2 border-amber-400 rounded-full shadow-sm hover:shadow-md transition-all duration-200 hover:scale-105 cursor-pointer">
                                      <ExclamationTriangleIcon className="h-4 w-4 text-amber-700 font-bold" />
                                      {/* Pulse animation for emphasis */}
                                      <div className="absolute inset-0 bg-amber-400 rounded-full animate-ping opacity-20"></div>
                                    </div>
                                  </CustomTooltip>
                                </div>
                              )}

                              {/* Unbilled Alert - Financial/Billing Issues */}
                              {encounter.isUnbilled && (
                                <div 
                                  className="relative group flex-shrink-0"
                                  title={`Unbilled Encounter: ${encounter.unbilledReason}`}
                                >
                                  <CustomTooltip
                                    content={encounter.unbilledReason || 'Unbilled encounter'}
                                    type="unbilled"
                                  >
                                    <div className="relative flex items-center justify-center w-7 h-7 bg-red-100 border-2 border-red-400 rounded-full shadow-sm hover:shadow-md transition-all duration-200 hover:scale-105 cursor-pointer">
                                      <ExclamationCircleIcon className="h-4 w-4 text-red-700 font-bold" />
                                      {/* Pulse animation for emphasis */}
                                      <div className="absolute inset-0 bg-red-400 rounded-full animate-ping opacity-20"></div>
                                    </div>
                                  </CustomTooltip>
                                </div>
                              )}
                            </div>
                          </td>
                          <td className="px-3 py-3 text-sm text-gray-900 whitespace-nowrap">
                            <div className="flex items-center text-sm text-gray-600">
                              <ClockIcon className="h-4 w-4 mr-2 text-gray-500" />
                              {encounter.date}
                            </div>
                          </td>
                          <td className="px-3 py-3 text-sm text-gray-900 whitespace-nowrap">
                            <div>
                              <div className="text-sm font-medium text-gray-900">
                                {encounter.category}
                              </div>
                              <div className="text-xs text-gray-500">
                                ({encounter.id})
                              </div>
                            </div>
                          </td>
                          <td className="px-3 py-3 text-sm whitespace-nowrap">
                            <Badge 
                              variant={encounter.encounterStatus === 'Open' ? 'destructive' : 
                                      encounter.encounterStatus === 'Closed' ? 'default' : 'secondary'}
                              className="text-xs"
                            >
                              {encounter.encounterStatus}
                            </Badge>
                          </td>
                          <td className="px-3 py-3 text-sm text-gray-900 whitespace-nowrap max-w-[200px] truncate" title={encounter.serviceProgram}>{encounter.serviceProgram}</td>
                          <td className="px-3 py-3 text-sm text-gray-900 whitespace-nowrap">{encounter.billingProgram}</td>
                          <td className="px-3 py-3 text-sm text-gray-900 whitespace-nowrap">{encounter.billTo}</td>
                          <td className="px-3 py-3 text-sm text-gray-900 whitespace-nowrap">{encounter.provider}</td>
                          <td className="px-3 py-3 text-sm text-gray-900 whitespace-nowrap max-w-[150px] truncate" title={encounter.billingNote}>{encounter.billingNote || '-'}</td>
                          <td className="px-3 py-3 text-sm text-gray-900 whitespace-nowrap font-mono">{encounter.code || '-'}</td>
                          <td className="px-3 py-3 text-sm text-gray-900 whitespace-nowrap text-center">{encounter.unitsBilling}</td>
                          <td className="px-3 py-3 text-sm text-gray-900 whitespace-nowrap text-right font-mono">${encounter.charge?.toFixed(2) || '0.00'}</td>
                          <td className="px-3 py-3 text-sm text-gray-900 whitespace-nowrap text-right font-mono">${encounter.paid?.toFixed(2) || '0.00'}</td>
                          <td className="px-3 py-3 text-sm text-gray-900 whitespace-nowrap text-right font-mono">${encounter.adjustment?.toFixed(2) || '0.00'}</td>
                          <td className="px-3 py-3 text-sm whitespace-nowrap text-right font-mono">
                            <span className={cn(
                              "font-semibold",
                              (encounter.balance || 0) > 0 ? "text-red-600" : "text-green-600"
                            )}>
                              ${encounter.balance?.toFixed(2) || '0.00'}
                            </span>
                          </td>
                          <td className="px-3 py-3 text-sm text-gray-900 whitespace-nowrap max-w-[200px] truncate" title={encounter.insurance}>{encounter.insurance}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* No Results Message for Billing */}
                {filteredEncounters.length === 0 && (
                  <div className="flex flex-col items-center justify-center py-12">
                    <CurrencyDollarIcon className="h-10 w-10 text-gray-300 mb-2" />
                    <p className="text-gray-500">
                      {searchQuery.trim() 
                        ? `No billing records found matching "${searchQuery}"` 
                        : "No billing records found for the selected filter."}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Document View Tab Content */}
        {activeTab === 'document' && (
          <div>
            {/* Document Search and Filter Controls */}
            <div className="p-4 pb-0">
              <div className="space-y-4">
                {/* Row 1: Search Bar + Upload Button */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
                  <div className="relative flex-1 max-w-2xl">
                    <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                      type="text"
                      placeholder="Search documents by name, category, or type..."
                      value={documentSearchQuery}
                      onChange={e => setDocumentSearchQuery(e.target.value)}
                      className="pl-10 w-full"
                    />
                  </div>
                  
                  <div className="flex items-center gap-3 flex-shrink-0">
                    <label className="relative cursor-pointer bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 flex items-center gap-2">
                      <DocumentTextIcon className="w-4 h-4" />
                      Upload Document
                      <input
                        type="file"
                        multiple
                        onChange={handleFileUpload}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        accept=".pdf,.png,.jpg,.jpeg,.doc,.docx,.txt"
                      />
                    </label>
                  </div>
                </div>

                {/* Row 2: Document Category Filter */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
                  <div className="space-y-1">
                    <label className="text-xs font-medium text-gray-600">Document Category:</label>
                    <Combobox
                      options={documentCategoryOptions}
                      value={selectedDocumentCategory}
                      onChange={setSelectedDocumentCategory}
                      placeholder="-- Select Category --"
                      className="w-full"
                      multiple={true}
                      hideFilters={true}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Document Table */}
            <div className="p-4">
              <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-200">
                      <tr>
                        <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Date</th>
                        <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Document</th>
                        <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Program</th>
                        <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Bill-To</th>
                        <th className="px-3 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {filteredDocuments.map((document, index) => (
                        <tr key={document.id} className={cn(
                          "hover:bg-gray-50 transition-colors duration-150",
                          index % 2 === 0 ? "bg-white" : "bg-gray-50/30"
                        )}>
                          <td className="px-3 py-3 text-sm text-gray-900 whitespace-nowrap">
                            <div className="flex items-center text-sm text-gray-600">
                              <ClockIcon className="h-4 w-4 mr-2 text-gray-500" />
                              {document.date}
                            </div>
                          </td>
                          <td className="px-3 py-3 text-sm text-gray-900 whitespace-nowrap max-w-[400px]">
                            <div className="space-y-1">
                              <div className="font-medium text-gray-900 truncate" title={document.name}>
                                {document.name}
                              </div>
                              <div className="flex items-center gap-2 text-xs text-gray-500">
                                <Badge variant="outline" className="text-xs">
                                  {document.category}
                                </Badge>
                                <span>•</span>
                                <span>{document.type}</span>
                                <span>•</span>
                                <span>{document.size}</span>
                              </div>
                            </div>
                          </td>
                          <td className="px-3 py-3 text-sm text-gray-900 whitespace-nowrap">
                            {document.program || '-'}
                          </td>
                          <td className="px-3 py-3 text-sm text-gray-900 whitespace-nowrap">
                            {document.billTo || '-'}
                          </td>
                          <td className="px-3 py-3 text-center whitespace-nowrap">
                            <div className="flex items-center justify-center gap-2">
                              <button
                                className="text-blue-600 hover:text-blue-800 p-1.5 rounded-md hover:bg-blue-50 transition-colors duration-200"
                                title="View document"
                              >
                                <FontAwesomeIcon icon={faEye} className="w-4 h-4" />
                              </button>
                              <button
                                className="text-green-600 hover:text-green-800 p-1.5 rounded-md hover:bg-green-50 transition-colors duration-200"
                                title="Download document"
                              >
                                <FontAwesomeIcon icon={faDownload} className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* No Results Message for Documents */}
                {filteredDocuments.length === 0 && (
                  <div className="flex flex-col items-center justify-center py-12">
                    <DocumentTextIcon className="h-10 w-10 text-gray-300 mb-2" />
                    <p className="text-gray-500">
                      {documentSearchQuery.trim() 
                        ? `No documents found matching "${documentSearchQuery}"` 
                        : "No documents found for the selected filter."}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </TooltipProvider>
  );
};

export default EncountersTable; 