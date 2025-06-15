import React, { useState, useMemo, useRef } from 'react';
import { Badge } from '@/components/atoms/Badge';
import { Button } from '@/components/atoms/Button';
import { Input } from '@/components/atoms/Input';
import { cn } from '@/lib/utils';
import { DataTable } from '@/components/organisms/DataTable';
import { ColumnMenuTab, GridOptions } from 'ag-grid-community';
import {
  MagnifyingGlassIcon,
  ClockIcon,
  UserIcon,
  DocumentTextIcon,
  BuildingOffice2Icon,
  CurrencyDollarIcon,
  ShieldCheckIcon,
  ExclamationTriangleIcon,
  ExclamationCircleIcon,
  ArrowTopRightOnSquareIcon
} from '@heroicons/react/24/outline';
import {
  Menubar,
  MenubarMenu,
  MenubarTrigger,
  MenubarContent,
  MenubarItem,
  MenubarSeparator,
  MenubarLabel
} from '@/components/ui/menubar';
import {
  TooltipRoot,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from '@/components/atoms/Tooltip/tooltip';
import { useMediaQuery } from '@/hooks/useMediaQuery';

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
}

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
    }
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
    unbilledReason: 'Missing authorization code - Insurance verification pending'
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
    }
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
    insurance: 'Primary: (Commercial) Blue Cross Blue Shield'
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
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeFilter, setActiveFilter] = useState<string>('all');
  const [selectedEncounter, setSelectedEncounter] = useState<Encounter | null>(null);
  const isMobile = useMediaQuery('(max-width: 640px)');

  // Handle encounter selection
  const handleEncounterSelect = (encounter: Encounter) => {
    setSelectedEncounter(encounter);
  };

  // Filter encounters based on search query and active filter
  const filteredEncounters = useMemo(() => {
    return mockEncounters.filter(encounter => {
      const matchesSearch = searchQuery === '' || 
        encounter.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        encounter.provider.toLowerCase().includes(searchQuery.toLowerCase()) ||
        encounter.serviceProgram.toLowerCase().includes(searchQuery.toLowerCase()) ||
        encounter.issue.toLowerCase().includes(searchQuery.toLowerCase());
      
      let matchesFilter = true;
      if (activeFilter !== 'all') {
        matchesFilter = encounter.encounterStatus.toLowerCase() === activeFilter.toLowerCase() ||
          encounter.billingProgram.toLowerCase() === activeFilter.toLowerCase();
      }
      
      return matchesSearch && matchesFilter;
    });
  }, [searchQuery, activeFilter]);

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
        {/* Search and Controls Section */}
        <div className="p-4 pb-0">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <div className="relative w-full sm:w-64">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              type="text"
              placeholder="Search encounters..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-10"
            />
          </div>
          
          <div className="flex items-center gap-2 ml-auto">
            <Menubar className="bg-white border rounded-lg px-2 py-1 shrink-0">
              <MenubarMenu>
                <MenubarTrigger>
                  <div className="flex items-center gap-2">
                    <span>Filter</span>
                    {activeFilter !== 'all' && (
                      <span className="flex h-5 w-5 items-center justify-center rounded-full bg-blue-100 text-xs font-medium text-blue-600">
                        1
                      </span>
                    )}
                  </div>
                </MenubarTrigger>
                <MenubarContent>
                  <MenubarItem 
                    onClick={() => setActiveFilter('all')}
                    className={cn(
                      "flex items-center gap-2",
                      activeFilter === 'all' && "bg-blue-50 text-blue-600"
                    )}
                  >
                    All Encounters
                  </MenubarItem>
                  <MenubarSeparator />
                  <MenubarLabel>Status</MenubarLabel>
                  {['Open', 'Closed', 'Closed With Errors', 'In Progress'].map(status => (
                    <MenubarItem 
                      key={status}
                      onClick={() => setActiveFilter(status)}
                      className={cn(
                        "flex items-center gap-2",
                        activeFilter === status && "bg-blue-50 text-blue-600"
                      )}
                    >
                      {status}
                    </MenubarItem>
                  ))}
                  <MenubarSeparator />
                  <MenubarLabel>Billing</MenubarLabel>
                  {['Insurance', 'Self-pay', 'Medicaid'].map(billing => (
                    <MenubarItem 
                      key={billing}
                      onClick={() => setActiveFilter(billing)}
                      className={cn(
                        "flex items-center gap-2",
                        activeFilter === billing && "bg-blue-50 text-blue-600"
                      )}
                    >
                      {billing}
                    </MenubarItem>
                  ))}
                </MenubarContent>
              </MenubarMenu>
            </Menubar>
          </div>
        </div>
      </div>
      
      {/* Table Content */}
      <div className="px-4 pb-4 pt-2">
        {filteredEncounters.length > 0 ? (
          <>
            {/* Desktop View */}
            <div className="hidden sm:block w-full overflow-x-auto">
              <div className="min-w-[1400px] h-[calc(100vh-280px)]">
                <DataTable
                  rowData={filteredEncounters}
                  columnDefs={columnDefs}
                  className="w-full h-full rounded-lg"
                  gridOptions={gridOptions}
                />
              </div>
            </div>
            
            {/* Mobile View */}
            <div className="sm:hidden max-h-[calc(100vh-280px)] overflow-y-auto">
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
          <div className="flex flex-col items-center justify-center text-center h-[calc(100vh-280px)]">
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
    </TooltipProvider>
  );
};

export default EncountersTable; 