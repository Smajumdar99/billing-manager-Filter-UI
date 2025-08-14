import React, { useState } from 'react';
import { ArrowLeftIcon, PlusCircleIcon } from '@heroicons/react/24/outline';
import { Button } from '@/components/atoms/Button';
import { Input } from '@/components/atoms/Input';
import { Textarea } from '@/components/atoms/Textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/atoms/Select';
import { Dialog, DialogContent, DialogTitle } from '@/components/atoms/Dialog/dialog';
import { Badge } from '@/components/atoms/Badge';
import { Tabs } from '@/components/atoms/Tabs';

// Mock data for common conditions
const commonConditions = [
  { code: 'E11.9', description: 'Type 2 diabetes mellitus without complications' },
  { code: 'I10', description: 'Essential (primary) hypertension' },
  { code: 'Z51.11', description: 'Encounter for antineoplastic chemotherapy' },
  { code: 'M79.3', description: 'Panniculitis, unspecified' },
  { code: 'R06.02', description: 'Shortness of breath' }
];

const LINKING_MODES = [
  { id: 'clinical-to-encounters', label: 'Clinical Items → Encounters' },
  { id: 'encounters-to-clinical', label: 'Encounters → Clinical Items' }
];

/**
 * ProblemsManagementPage Component
 * 
 * Comprehensive problems management interface with table view, breadcrumbs,
 * and full CRUD operations for patient problems.
 * 
 * Features:
 * - Breadcrumb navigation
 * - AG Grid-style table with sortable columns
 * - Programs displayed as subtle badges with overlay for full list
 * - Edit/Delete actions for each problem
 * - Add new problem functionality
 * - Professional healthcare UI with Apple-style elegance
 */

interface Problem {
  id: string;
  title: string;
  begin: string;
  end: string;
  details: string;
  relatedTo: string;
  status: 'Active' | 'Resolved' | 'Deferred';
  occurrence: string;
  modifiedBy: string;
  modifiedDate: string;
  endDate: string;
  comments: string;
  accessPrograms: string[];
  provider: string;
  coding: string;
  priority: 'High' | 'Medium' | 'Low' | 'Urgent';
  linkedEncounters: Encounter[];
}

interface Encounter {
  id: string;
  date: string;
  type: string;
  provider: string;
  status: 'Completed' | 'Scheduled' | 'Cancelled';
}

// Mock data for available encounters that can be linked
const mockAvailableEncounters: Encounter[] = [
  {
    id: 'enc-017',
    date: '14/08/2025',
    type: 'Initial Consultation',
    provider: 'Sarah Chen',
    status: 'Completed'
  },
  {
    id: 'enc-018',
    date: '16/08/2025',
    type: 'Follow-up Assessment',
    provider: 'Michael Torres',
    status: 'Completed'
  },
  {
    id: 'enc-019',
    date: '18/08/2025',
    type: 'Therapy Session',
    provider: 'Amanda Foster',
    status: 'Completed'
  },
  {
    id: 'enc-020',
    date: '20/08/2025',
    type: 'Medication Review',
    provider: 'Lisa Rodriguez',
    status: 'Scheduled'
  },
  {
    id: 'enc-021',
    date: '22/08/2025',
    type: 'Group Therapy',
    provider: 'Robert Kim',
    status: 'Scheduled'
  },
  {
    id: 'enc-022',
    date: '24/08/2025',
    type: 'Crisis Intervention',
    provider: 'Sarah Chen',
    status: 'Scheduled'
  },
  {
    id: 'enc-023',
    date: '26/08/2025',
    type: 'Psychiatric Evaluation',
    provider: 'Michael Torres',
    status: 'Scheduled'
  },
  {
    id: 'enc-024',
    date: '28/08/2025',
    type: 'Family Therapy',
    provider: 'Amanda Foster',
    status: 'Scheduled'
  }
];

// Mock data based on the screenshot provided
const mockProblems: Problem[] = [
  {
    id: '1',
    title: 'Other intestinal Escherichia coli infections',
    begin: '12/08/2025',
    end: '07/22/31',
    details: 'Other intestinal Escherichia coli infections',
    relatedTo: 'Mental Health',
    status: 'Active',
    occurrence: 'Unknown or N/A',
    modifiedBy: 'Admin, Ensoftek',
    modifiedDate: '13/08/2025',
    endDate: '07/22/31',
    comments: 'Assessment fast test1 PINCO Hospitals Foster Homes geak OK MS Hospital GoodFacility Greenbelt',
    accessPrograms: [
      'ADiagnosticHIT Facility', 'State Facility', '24/7 care hospitals', 'AADOA-METH-A-SURA',
      'APOLLO1234', 'Big Bill cable', 'CCC Flooring', 'County Group Hospital', 'CYR KYR Super',
      'Specialty Hospitals', 'Lenovo123', 'Mental Health Therapy', 'MySQL Hospitals',
      'New Clinic', 'Neural Facility', 'Occupational Therapy', 'Physical Therapy',
      'PINCO Hospitals', 'Foster Homes', 'MS Hospital', 'GoodFacility', 'Greenbelt',
      'Private Insurance', 'Healthcare Hospitals', 'Dental Service', 'Heartbeat Clinic'
    ],
    provider: 'Admin, Ensoftek',
    coding: 'ICD10:A04.4',
    priority: 'Medium',
    linkedEncounters: [
      {
        id: 'enc-001',
        date: '12/08/2025',
        type: 'Initial Assessment',
        provider: 'Sarah Chen',
        status: 'Completed'
      },
      {
        id: 'enc-002',
        date: '15/08/2025',
        type: 'Follow-up Visit',
        provider: 'Sarah Chen',
        status: 'Scheduled'
      }
    ]
  },
  {
    id: '2',
    title: 'Other specified bacterial intestinal infections',
    begin: '05/08/2025',
    end: '07/30/29',
    details: 'Other specified bacterial intestinal infections',
    relatedTo: 'Mental Health',
    status: 'Active',
    occurrence: 'Unknown or N/A',
    modifiedBy: 'Admin, Ensoftek',
    modifiedDate: '13/08/2025',
    endDate: '07/30/29',
    comments: 'Assessment fast test1 PINCO Hospitals Foster Homes geak OK MS Hospital GoodFacility',
    accessPrograms: [
      'ADiagnosticHIT Facility', 'State Facility', '24/7 care hospitals', 'APOLLO1234',
      'Mental Health Therapy', 'Specialty Hospitals', 'Neural Facility', 'Physical Therapy',
      'MS Hospital', 'GoodFacility', 'Private Insurance', 'Healthcare Hospitals'
    ],
    provider: 'Admin, Ensoftek',
    coding: 'ICD10:A04.8',
    priority: 'High',
    linkedEncounters: [
      {
        id: 'enc-003',
        date: '05/08/2025',
        type: 'Diagnostic Session',
        provider: 'Michael Torres',
        status: 'Completed'
      }
    ]
  },
  {
    id: '3',
    title: 'Major Depressive Disorder, Single Episode, Moderate',
    begin: '10/07/2025',
    end: '10/07/2026',
    details: 'Major depressive disorder, single episode, moderate severity',
    relatedTo: 'Mental Health',
    status: 'Active',
    occurrence: 'First Episode',
    modifiedBy: 'Sarah Chen',
    modifiedDate: '12/08/2025',
    endDate: '10/07/2026',
    comments: 'Patient presenting with persistent low mood, decreased energy, and sleep disturbances',
    accessPrograms: [
      'Mental Health Therapy', 'Behavioral Health Services', 'Outpatient Counseling',
      'Group Therapy Sessions', 'Medication Management', 'Crisis Intervention',
      'Peer Support Groups', 'Family Therapy', 'Cognitive Behavioral Therapy'
    ],
    provider: 'Sarah Chen',
    coding: 'ICD10:F32.1',
    priority: 'High',
    linkedEncounters: [
      {
        id: 'enc-004',
        date: '10/07/2025',
        type: 'Psychiatric Evaluation',
        provider: 'Sarah Chen',
        status: 'Completed'
      },
      {
        id: 'enc-005',
        date: '17/07/2025',
        type: 'Therapy Session',
        provider: 'Sarah Chen',
        status: 'Completed'
      },
      {
        id: 'enc-006',
        date: '20/08/2025',
        type: 'Medication Review',
        provider: 'Sarah Chen',
        status: 'Scheduled'
      }
    ]
  },
  {
    id: '4',
    title: 'Generalized Anxiety Disorder',
    begin: '15/06/2025',
    end: 'Ongoing',
    details: 'Generalized anxiety disorder with excessive worry and physical symptoms',
    relatedTo: 'Mental Health',
    status: 'Active',
    occurrence: 'Chronic',
    modifiedBy: 'Dr. Michael Torres',
    modifiedDate: '11/08/2025',
    endDate: '',
    comments: 'Patient reports persistent worry, restlessness, and difficulty concentrating',
    accessPrograms: [
      'Anxiety Management Program', 'Relaxation Training', 'Mindfulness Therapy',
      'Stress Reduction Clinic', 'Behavioral Health Services', 'Group Therapy Sessions',
      'Medication Management', 'Biofeedback Training'
    ],
    provider: 'Dr. Michael Torres',
    coding: 'ICD10:F41.1',
    priority: 'Medium',
    linkedEncounters: [
      {
        id: 'enc-007',
        date: '15/06/2025',
        type: 'Initial Assessment',
        provider: 'Dr. Michael Torres',
        status: 'Completed'
      },
      {
        id: 'enc-008',
        date: '25/08/2025',
        type: 'Follow-up Visit',
        provider: 'Dr. Michael Torres',
        status: 'Scheduled'
      }
    ]
  },
  {
    id: '5',
    title: 'Substance Use Disorder - Alcohol',
    begin: '20/05/2025',
    end: '20/05/2026',
    details: 'Alcohol use disorder, moderate severity with physiological dependence',
    relatedTo: 'Substance Abuse',
    status: 'Active',
    occurrence: 'Recurrent',
    modifiedBy: 'Dr. Lisa Rodriguez',
    modifiedDate: '10/08/2025',
    endDate: '20/05/2026',
    comments: 'Patient enrolled in intensive outpatient program, showing good progress',
    accessPrograms: [
      'Substance Abuse Treatment', 'Detoxification Services', 'Intensive Outpatient Program',
      'Alcoholics Anonymous', 'Family Support Groups', 'Relapse Prevention',
      'Medication Assisted Treatment', 'Counseling Services', 'Peer Recovery Support',
      'Residential Treatment', 'Aftercare Planning'
    ],
    provider: 'Dr. Lisa Rodriguez',
    coding: 'ICD10:F10.20',
    priority: 'High',
    linkedEncounters: [
      {
        id: 'enc-009',
        date: '20/05/2025',
        type: 'Intake Assessment',
        provider: 'Dr. Lisa Rodriguez',
        status: 'Completed'
      },
      {
        id: 'enc-010',
        date: '03/06/2025',
        type: 'Group Therapy',
        provider: 'Dr. Lisa Rodriguez',
        status: 'Completed'
      },
      {
        id: 'enc-011',
        date: '22/08/2025',
        type: 'Progress Review',
        provider: 'Dr. Lisa Rodriguez',
        status: 'Scheduled'
      }
    ]
  },
  {
    id: '6',
    title: 'Post-Traumatic Stress Disorder',
    begin: '02/04/2025',
    end: 'Ongoing',
    details: 'PTSD following traumatic event with intrusive memories and avoidance behaviors',
    relatedTo: 'Mental Health',
    status: 'Active',
    occurrence: 'Chronic',
    modifiedBy: 'Dr. Amanda Foster',
    modifiedDate: '09/08/2025',
    endDate: '',
    comments: 'Patient responding well to EMDR therapy and trauma-focused CBT',
    accessPrograms: [
      'Trauma Recovery Services', 'EMDR Therapy', 'Trauma-Focused CBT',
      'Veterans Services', 'Crisis Intervention', 'Support Groups',
      'Mindfulness Training', 'Art Therapy', 'Medication Management'
    ],
    provider: 'Dr. Amanda Foster',
    coding: 'ICD10:F43.10',
    priority: 'High',
    linkedEncounters: [
      {
        id: 'enc-012',
        date: '02/04/2025',
        type: 'Trauma Assessment',
        provider: 'Dr. Amanda Foster',
        status: 'Completed'
      },
      {
        id: 'enc-013',
        date: '16/04/2025',
        type: 'EMDR Session',
        provider: 'Dr. Amanda Foster',
        status: 'Completed'
      },
      {
        id: 'enc-014',
        date: '28/08/2025',
        type: 'Therapy Session',
        provider: 'Dr. Amanda Foster',
        status: 'Scheduled'
      }
    ]
  },
  {
    id: '7',
    title: 'Bipolar I Disorder, Current Episode Manic',
    begin: '18/03/2025',
    end: '18/03/2026',
    details: 'Bipolar I disorder, current episode manic with psychotic features',
    relatedTo: 'Mental Health',
    status: 'Resolved',
    occurrence: 'Episodic',
    modifiedBy: 'Dr. Robert Kim',
    modifiedDate: '08/08/2025',
    endDate: '15/07/2025',
    comments: 'Episode successfully managed with medication adjustment and stabilization',
    accessPrograms: [
      'Mood Disorder Clinic', 'Medication Management', 'Psychiatric Monitoring',
      'Crisis Stabilization', 'Psychoeducation', 'Family Support',
      'Peer Support Groups', 'Occupational Therapy'
    ],
    provider: 'Dr. Robert Kim',
    coding: 'ICD10:F31.2',
    priority: 'Low',
    linkedEncounters: [
      {
        id: 'enc-015',
        date: '18/03/2025',
        type: 'Crisis Intervention',
        provider: 'Dr. Robert Kim',
        status: 'Completed'
      },
      {
        id: 'enc-016',
        date: '25/03/2025',
        type: 'Medication Adjustment',
        provider: 'Dr. Robert Kim',
        status: 'Completed'
      }
    ]
  }
];

// Medical coding interface for enhanced search functionality
interface MedicalCode {
  code: string;
  description: string;
  shortDescription: string;
  category: 'ICD-10' | 'DSM-5';
}

// Common conditions for AddConditionDialog integration
const commonConditions = [
  { code: 'ICD10:R06.7', description: 'Sneezing' },
  { code: 'ICD10:F32.5', description: 'Major Depressive Disorder' },
  { code: 'ICD10:A77.9', description: 'Spotted Fever Unspecified' },
  { code: 'ICD10:R50.81', description: 'Fever Presenting With Conditions Classified Elsewhere' },
  { code: 'ICD10:F15.10', description: 'Other Stimulant Abuse Uncomplicated' },
  { code: 'ICD10:F10.980', description: 'Alcohol Use Unspecified With Alcohol-Induced Anxiety Disorder' },
  { code: 'ICD10:F99', description: 'Mental Disorder Not Otherwise Specified' },
  { code: 'ICD10:F84.0', description: 'Autistic Disorder' },
  { code: 'ICD10:F90.9', description: 'Attention-Deficit Hyperactivity Disorder, Unspecified Type' },
  { code: 'ICD10:F32.9', description: 'Major Depressive Disorder, Single Episode, Unspecified' },
  { code: 'ICD10:F41.1', description: 'Generalized Anxiety Disorder' },
  { code: 'ICD10:F43.10', description: 'Post-Traumatic Stress Disorder, Unspecified' },
  { code: 'ICD10:F31.9', description: 'Bipolar Disorder, Unspecified' },
  { code: 'ICD10:F20.9', description: 'Schizophrenia, Unspecified' }
];

// Comprehensive medical coding database for behavioral health
const MEDICAL_CODES: MedicalCode[] = [

  // ICD-10 Codes for Behavioral Health
  { code: 'F10.10', description: 'Alcohol use disorder, mild', shortDescription: 'Alcohol use disorder, mild', category: 'ICD-10' },
  { code: 'F10.20', description: 'Alcohol use disorder, moderate', shortDescription: 'Alcohol use disorder, moderate', category: 'ICD-10' },
  { code: 'F10.21', description: 'Alcohol use disorder, moderate, in remission', shortDescription: 'Alcohol use disorder, moderate, in remission', category: 'ICD-10' },
  { code: 'F32.0', description: 'Major depressive disorder, single episode, mild', shortDescription: 'Major depressive disorder, single episode, mild', category: 'ICD-10' },
  { code: 'F32.1', description: 'Major depressive disorder, single episode, moderate', shortDescription: 'Major depressive disorder, single episode, moderate', category: 'ICD-10' },
  { code: 'F32.2', description: 'Major depressive disorder, single episode, severe without psychotic features', shortDescription: 'Major depressive disorder, single episode, severe', category: 'ICD-10' },
  { code: 'F33.0', description: 'Major depressive disorder, recurrent, mild', shortDescription: 'Major depressive disorder, recurrent, mild', category: 'ICD-10' },
  { code: 'F33.1', description: 'Major depressive disorder, recurrent, moderate', shortDescription: 'Major depressive disorder, recurrent, moderate', category: 'ICD-10' },
  { code: 'F41.0', description: 'Panic disorder without agoraphobia', shortDescription: 'Panic disorder without agoraphobia', category: 'ICD-10' },
  { code: 'F41.1', description: 'Generalized anxiety disorder', shortDescription: 'Generalized anxiety disorder', category: 'ICD-10' },
  { code: 'F43.10', description: 'Post-traumatic stress disorder, unspecified', shortDescription: 'Post-traumatic stress disorder, unspecified', category: 'ICD-10' },
  { code: 'F43.12', description: 'Post-traumatic stress disorder, chronic', shortDescription: 'Post-traumatic stress disorder, chronic', category: 'ICD-10' },
  { code: 'F90.0', description: 'Attention-deficit hyperactivity disorder, predominantly inattentive type', shortDescription: 'ADHD, predominantly inattentive type', category: 'ICD-10' },
  { code: 'F90.1', description: 'Attention-deficit hyperactivity disorder, predominantly hyperactive type', shortDescription: 'ADHD, predominantly hyperactive type', category: 'ICD-10' },
  { code: 'F90.2', description: 'Attention-deficit hyperactivity disorder, combined type', shortDescription: 'ADHD, combined type', category: 'ICD-10' },
  
  // DSM-5 Codes for Behavioral Health
  { code: '296.20', description: 'Major Depressive Disorder, Single Episode, Unspecified', shortDescription: 'Major Depressive Disorder, Single Episode', category: 'DSM-5' },
  { code: '296.21', description: 'Major Depressive Disorder, Single Episode, Mild', shortDescription: 'Major Depressive Disorder, Single Episode, Mild', category: 'DSM-5' },
  { code: '296.22', description: 'Major Depressive Disorder, Single Episode, Moderate', shortDescription: 'Major Depressive Disorder, Single Episode, Moderate', category: 'DSM-5' },
  { code: '296.30', description: 'Major Depressive Disorder, Recurrent Episode, Unspecified', shortDescription: 'Major Depressive Disorder, Recurrent', category: 'DSM-5' },
  { code: '300.00', description: 'Anxiety Disorder, Unspecified', shortDescription: 'Anxiety Disorder, Unspecified', category: 'DSM-5' },
  { code: '300.01', description: 'Panic Disorder', shortDescription: 'Panic Disorder', category: 'DSM-5' },
  { code: '300.02', description: 'Generalized Anxiety Disorder', shortDescription: 'Generalized Anxiety Disorder', category: 'DSM-5' },
  { code: '309.81', description: 'Posttraumatic Stress Disorder', shortDescription: 'Posttraumatic Stress Disorder', category: 'DSM-5' },
  { code: '314.00', description: 'Attention-Deficit/Hyperactivity Disorder, Predominantly Inattentive Presentation', shortDescription: 'ADHD, Predominantly Inattentive', category: 'DSM-5' },
  { code: '314.01', description: 'Attention-Deficit/Hyperactivity Disorder, Combined Presentation', shortDescription: 'ADHD, Combined Presentation', category: 'DSM-5' },
  { code: '303.90', description: 'Alcohol Use Disorder, Unspecified', shortDescription: 'Alcohol Use Disorder', category: 'DSM-5' },
  { code: '305.00', description: 'Alcohol Use Disorder, Mild', shortDescription: 'Alcohol Use Disorder, Mild', category: 'DSM-5' },
  { code: '301.83', description: 'Borderline Personality Disorder', shortDescription: 'Borderline Personality Disorder', category: 'DSM-5' },
  { code: '301.50', description: 'Paranoid Personality Disorder', shortDescription: 'Paranoid Personality Disorder', category: 'DSM-5' },
  { code: '301.51', description: 'Schizoid Personality Disorder', shortDescription: 'Schizoid Personality Disorder', category: 'DSM-5' },
  { code: '301.52', description: 'Schizotypal Personality Disorder', shortDescription: 'Schizotypal Personality Disorder', category: 'DSM-5' },
  { code: '301.6', description: 'Histrionic Personality Disorder', shortDescription: 'Histrionic Personality Disorder', category: 'DSM-5' },
  { code: '301.7', description: 'Narcissistic Personality Disorder', shortDescription: 'Narcissistic Personality Disorder', category: 'DSM-5' },
  { code: '301.81', description: 'Avoidant Personality Disorder', shortDescription: 'Avoidant Personality Disorder', category: 'DSM-5' },
  { code: '301.82', description: 'Dependent Personality Disorder', shortDescription: 'Dependent Personality Disorder', category: 'DSM-5' },
  { code: '301.89', description: 'Obsessive-Compulsive Personality Disorder', shortDescription: 'Obsessive-Compulsive Personality Disorder', category: 'DSM-5' },
];

const ProblemsManagementPage: React.FC = () => {
  const [problems, setProblems] = useState<Problem[]>(mockProblems);
  const [selectedProgramsDialog, setSelectedProgramsDialog] = useState<{
    open: boolean;
    programs: string[];
    title: string;
  }>({ open: false, programs: [], title: '' });
  const [selectedEncountersDialog, setSelectedEncountersDialog] = useState<{
    open: boolean;
    encounters: Encounter[];
    problemTitle: string;
    problemId: string;
  }>({ open: false, encounters: [], problemTitle: '', problemId: '' });
  const [linkEncountersDialog, setLinkEncountersDialog] = useState({
    open: false,
    problemId: '',
    problemTitle: '',
    showAddDiagnosis: false // New state to track if we're in Add Condition mode
  });

  // State for linking mode and selected encounter
  const [linkingMode, setLinkingMode] = useState<'clinical-to-encounters' | 'encounters-to-clinical'>('clinical-to-encounters');
  const [selectedEncounterId, setSelectedEncounterId] = useState<string>('');
  const [addProblemDialog, setAddProblemDialog] = useState(false);

  // State for Add Condition form (embedded in Link Encounters dialog)
  const [addConditionForm, setAddConditionForm] = useState({
    currentStep: 1 as 1 | 2,
    selectedCondition: null as any,
    coding: '',
    title: '',
    beginDate: '',
    endDate: '',
    accessPrograms: '118 of 178 selected',
    pathogen: '',
    signsSymptoms: '',
    occurrence: 'Unknown or N/A',
    referredBy: '',
    outcome: 'Unassigned',
    comments: '',
    mdcip: '',
    reportedByClient: false,
    outsideAgency: false,
    provider: "-- Provider's --",
    patientGoal: '',
    objectives: [] as Array<{
      id: string;
      text: string;
      services: Array<{
        id: string;
        name: string;
        serviceCode: string;
        provider: string;
        minutes: string;
        frequency: string;
        duration: string;
      }>;
      measures: Array<{
        id: string;
        name: string;
        initialMeasure: string;
        desiredMeasure: string;
      }>;
      interventions: string[];
    }>
  });

  // Tab configuration for mode switcher (following StaffDashboard pattern)
  const LINKING_MODES = [
    { 
      id: 'clinical-to-encounters' as const, 
      label: 'Clinical Items → Encounters',
      icon: <PlusCircleIcon className="w-4 h-4" />
    },
    { 
      id: 'encounters-to-clinical' as const, 
      label: 'Encounters → Clinical Items',
      icon: <PencilIcon className="w-4 h-4" />
    }
  ];
  const [activeTab, setActiveTab] = useState('Clients');
  const [selectedMenu, setSelectedMenu] = useState('Problems Management');

  // Mock patient data for the top navigation
  const patientData = {
    id: 'patient-123',
    name: 'John Smith',
    avatar: 'https://ui-avatars.com/api/?name=John+Smith',
    gender: 'Male',
    age: 45,
    bloodGroup: 'O+',
    insuranceProvider: 'Pacific Source Community Solutions',
    admittedTo: 'Intensive',
    language: 'English',
    mobile: '+1 (555) 123-4567',
    programAuditor: 'Sarah Johnson',
    auditorTimestamp: 'Last Updated: 2 hours ago',
    primaryCareProvider: 'Dr. Emily Chen',
    nickname: 'Johnny'
  };

  // Breadcrumb items for navigation
  const getBreadcrumbItems = () => [
    { label: 'Clients', href: '#clients' },
    { label: 'John Smith', href: '#john-smith' },
    { label: 'Summary Chart', href: '#summary-chart' },
    { label: 'Problems Management', href: '#problems-management', isActive: true }
  ];

  // Handle viewing all programs for a problem
  const handleViewAllPrograms = (programs: string[], problemTitle: string) => {
    setSelectedProgramsDialog({
      open: true,
      programs,
      title: problemTitle
    });
  };

  // Handle viewing all encounters for a problem
  const handleViewAllEncounters = (encounters: Encounter[], problemTitle: string, problemId: string) => {
    setSelectedEncountersDialog({
      open: true,
      encounters,
      problemTitle,
      problemId
    });
  };

  // Handle linking new encounter to problem
  const handleLinkEncounter = (problemId: string) => {
    const problem = problems.find(p => p.id === problemId);
    if (problem) {
      setLinkEncountersDialog({
        open: true,
        problemId: problemId,
        problemTitle: problem.title,
        showAddDiagnosis: false
      });
    }
  };

  // Handler to open Add Condition mode within Link Encounters dialog
  const handleOpenAddCondition = () => {
    setLinkEncountersDialog(prev => ({
      ...prev,
      showAddDiagnosis: true
    }));
    // Reset form data when opening
    setAddConditionForm({
      currentStep: 1,
      selectedCondition: null,
      coding: '',
      title: '',
      beginDate: '',
      endDate: '',
      accessPrograms: '118 of 178 selected',
      pathogen: '',
      signsSymptoms: '',
      occurrence: 'Unknown or N/A',
      referredBy: '',
      outcome: 'Unassigned',
      comments: '',
      mdcip: '',
      reportedByClient: false,
      outsideAgency: false,
      provider: "-- Provider's --",
      patientGoal: '',
      objectives: []
    });
  };

  // Handler to go back from Add Condition to Link Encounters
  const handleBackFromAddCondition = () => {
    setLinkEncountersDialog(prev => ({
      ...prev,
      showAddDiagnosis: false
    }));
  };

  // Handler for Add Condition form input changes
  const handleAddConditionInputChange = (field: string, value: string | boolean | number) => {
    setAddConditionForm(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Handler for condition selection from common conditions list
  const handleConditionSelect = (condition: { code: string; description: string }) => {
    setAddConditionForm(prev => ({
      ...prev,
      coding: condition.code,
      title: condition.description
    }));
  };

  // Handler for step navigation
  const handleNextStep = () => {
    if (addConditionForm.currentStep === 1 && addConditionForm.coding && addConditionForm.title) {
      setAddConditionForm(prev => ({ ...prev, currentStep: 2 }));
    }
  };

  const handlePreviousStep = () => {
    if (addConditionForm.currentStep === 2) {
      setAddConditionForm(prev => ({ ...prev, currentStep: 1 }));
    }
  };

  // Handle saving the new condition (updated for AddConditionDialog)
  const handleSaveCondition = () => {
    if (!addConditionForm.coding || !addConditionForm.title) {
      alert('Please fill in required fields: Coding and Title');
      return;
    }

    // Create new problem object from condition form
    const newProblem: Problem = {
      id: Date.now().toString(),
      title: addConditionForm.title,
      begin: addConditionForm.beginDate || new Date().toLocaleDateString('en-GB'),
      end: addConditionForm.endDate || 'Ongoing',
      details: addConditionForm.signsSymptoms,
      relatedTo: 'Mental Health',
      status: 'Active',
      occurrence: addConditionForm.occurrence,
      modifiedBy: addConditionForm.provider,
      modifiedDate: new Date().toLocaleDateString('en-GB'),
      endDate: addConditionForm.endDate || 'Ongoing',
      comments: addConditionForm.comments,
      accessPrograms: ['Mental Health Therapy', 'Behavioral Health Services'],
      provider: addConditionForm.provider,
      coding: addConditionForm.coding,
      priority: 'Medium' as 'High' | 'Medium' | 'Low',
      linkedEncounters: []
    };

    setProblems(prev => [...prev, newProblem]);
    handleBackFromAddCondition();
    alert('Condition added successfully!');
  };

  // Handle print preview functionality
  const handlePrintPreview = () => {
    console.log('Print problems list');
    // TODO: Implement print preview functionality
    // This could open a print-optimized view or trigger browser print dialog
    window.print();
  };

  // Handle edit problem
  const handleEditProblem = (problemId: string) => {
    console.log('Edit problem:', problemId);
    // TODO: Open edit dialog or navigate to edit page
  };

  // Handle delete problem
  const handleDeleteProblem = (problemId: string) => {
    console.log('Delete problem:', problemId);
    // TODO: Show confirmation dialog and delete
  };

  // Handle add new problem
  const handleAddProblem = () => {
    console.log('Add new problem');
    // TODO: Open add problem dialog
  };

  // Handle linking an encounter to a problem
  const handleLinkEncounterToProblem = (encounterId: string, problemId: string) => {
    // Find the encounter in the available encounters
    const encounterToLink = mockAvailableEncounters.find(enc => enc.id === encounterId);
    
    if (!encounterToLink) {
      console.error('Encounter not found:', encounterId);
      return;
    }

    // Update the problems state to add the encounter to the selected problem
    setProblems(prevProblems => 
      prevProblems.map(problem => 
        problem.id === problemId 
          ? {
              ...problem,
              linkedEncounters: [...problem.linkedEncounters, encounterToLink]
            }
          : problem
      )
    );

    console.log('Successfully linked encounter:', encounterId, 'to problem:', problemId);
  };

  // AG Grid column definitions for problems table
  const columnDefs: ColDef[] = [
    {
      headerName: 'Title',
      field: 'title',
      width: 400,
      flex: 0,
      cellRenderer: (params: any) => {
        const problem = params.data;
        return (
          <div className="flex flex-col py-1">
            <div className="flex items-center gap-2">
              <span className="font-medium truncate">{problem.title}</span>
              <Badge variant={getPriorityVariant(problem.priority)} className="text-xs">
                {problem.priority}
              </Badge>
            </div>
            <div className="text-xs text-gray-500">{problem.coding}</div>
          </div>
        );
      }
    },
    { headerName: 'Begin', field: 'begin', width: 100 },
    { headerName: 'End', field: 'end', width: 100 },
    { 
      headerName: 'Details', 
      field: 'details', 
      width: 200,
      cellRenderer: (params: any) => (
        <span className="truncate block" title={params.value}>{params.value}</span>
      )
    },
    { headerName: 'Related To', field: 'relatedTo', width: 120 },
    {
      headerName: 'Status',
      field: 'status',
      width: 100,
      cellRenderer: (params: any) => (
        <Badge variant={getStatusVariant(params.value)} className="text-xs">
          {params.value}
        </Badge>
      )
    },
    { headerName: 'Occurrence', field: 'occurrence', width: 120 },
    { headerName: 'Modified By', field: 'modifiedBy', width: 140 },
    { headerName: 'Modified Date', field: 'modifiedDate', width: 120 },
    {
      headerName: 'Encounters',
      field: 'linkedEncounters',
      width: 140,
      flex: 0,
      cellRenderer: (params: any) => {
        const encounters = params.value || [];
        return renderEncounters(encounters, params.data.title, params.data.id);
      },
      sortable: false,
      filter: false
    },
    { headerName: 'End Date', field: 'endDate', width: 100 },
    { 
      headerName: 'Comments', 
      field: 'comments', 
      width: 200,
      cellRenderer: (params: any) => (
        <span className="truncate block" title={params.value}>{params.value}</span>
      )
    },
    {
      headerName: 'Access Programs',
      field: 'accessPrograms',
      width: 300,
      flex: 0,
      cellRenderer: (params: any) => {
        const programs = params.value || [];
        return renderPrograms(programs, params.data.title);
      }
    },
    { headerName: 'Provider', field: 'provider', width: 140 },
    {
      headerName: 'Actions',
      field: 'actions',
      width: 100,
      cellRenderer: (params: any) => (
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleEditProblem(params.data.id)}
            className="h-8 w-8 p-0"
            title="Edit problem"
          >
            <PencilIcon className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleDeleteProblem(params.data.id)}
            className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
            title="Delete problem"
          >
            <TrashIcon className="w-4 h-4" />
          </Button>
        </div>
      ),
      sortable: false,
      filter: false
    }
  ];

  // Get status badge variant
  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'Active': return 'default';
      case 'Resolved': return 'secondary';
      case 'Deferred': return 'outline';
      default: return 'default';
    }
  };

  // Get priority badge variant
  const getPriorityVariant = (priority: string) => {
    switch (priority) {
      case 'High': return 'destructive';
      case 'Urgent': return 'destructive';
      case 'Medium': return 'default';
      case 'Low': return 'secondary';
      default: return 'default';
    }
  };

  // Render programs with show more functionality
  const renderPrograms = (programs: string[], problemTitle: string) => {
    const maxVisible = 10;
    const visiblePrograms = programs.slice(0, maxVisible);
    const hasMorePrograms = programs.length > maxVisible;

    return (
      <div className="flex flex-wrap gap-1">
        {visiblePrograms.map((program, index) => (
          <Badge key={index} variant="outline" className="text-xs">
            {program}
          </Badge>
        ))}
        {hasMorePrograms && (
          <Button
            variant="ghost"
            size="sm"
            className="h-5 px-2 text-xs text-blue-600 hover:text-blue-700"
            onClick={() => handleViewAllPrograms(programs, problemTitle)}
          >
            Show All
          </Button>
        )}
      </div>
    );
  };

  // Render encounters count with link functionality
  const renderEncounters = (encounters: Encounter[], problemTitle: string, problemId: string) => {
    const encounterCount = encounters.length;

    return (
      <div className="flex items-center gap-2">
        {encounterCount > 0 ? (
          <Button
            variant="ghost"
            size="sm"
            className="h-6 px-2 text-xs text-blue-600 hover:text-blue-700"
            onClick={() => handleViewAllEncounters(encounters, problemTitle, problemId)}
          >
            {encounterCount} linked
          </Button>
        ) : (
          <span className="text-xs text-gray-500">0 linked</span>
        )}
        <Button
          variant="ghost"
          size="sm"
          className="h-6 px-2 text-xs text-green-600 hover:text-green-700"
          onClick={() => handleLinkEncounter(problemId)}
        >
          <PencilIcon className="w-4 h-4 mr-1" />
          Edit
        </Button>
      </div>
    );
  };

  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* Top Navigation Bar */}
      <div className="">
        <TopNavigationBar 
          hospitalName="Mayank Hospitals"
          userAvatarUrl="https://ui-avatars.com/api/?name=Sarah+Johnson"
          onSearch={(searchTerm) => console.log('Search:', searchTerm)}
          patient={patientData}
          onNewEncounter={() => console.log('New encounter for patient:', patientData?.name)}
          onViewChart={() => console.log('View chart for patient:', patientData?.name)}
        />
      </div>

      {/* Main Navigation */}
      <div className="">
        <MainNavigationBar 
          activeItem={activeTab}
          onNavigate={(itemName) => {
            console.log('Navigate to:', itemName);
            setActiveTab(itemName);
            
            // Handle navigation to different pages
            if (itemName === 'Inbox') {
              window.location.href = '/inbox';
            } else if (itemName === 'Dashboard') {
              window.location.href = '/dashboard';
            } else if (itemName === 'Settings') {
              window.location.href = '/settings';
            } else if (itemName === 'Schedule') {
              window.location.href = '/my-calendar';
            } else if (itemName === 'Clients') {
              window.location.href = '/old-ui';
            }
          }}
        />
      </div>

      {/* Content Area */}
      <div className="flex flex-1 min-h-0">
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
                      if (href === '#summary-chart') {
                        window.location.href = '/old-ui';
                      }
                    }}
                  />
                </div>
              </div>
              
              {/* Right Side Actions */}
              <div className="flex items-center gap-3">
                <Button
                  onClick={handlePrintPreview}
                  variant="outline"
                  className="flex items-center gap-2"
                >
                  <PrinterIcon className="h-4 w-4" />
                  Print
                </Button>
                <Button
                  onClick={handleAddProblem}
                  className="flex items-center gap-2"
                >
                  <PlusCircleIcon className="h-4 w-4" />
                  Add New Problem
                </Button>
              </div>
            </div>
          </div>

          {/* Page Content */}
          <div className="p-6">
            <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
              <div className="h-[calc(100vh-250px)]">
                <DataTable
                  rowData={problems}
                  columnDefs={columnDefs}
                  gridOptions={{
                    pagination: true,
                    paginationPageSize: 20,
                    domLayout: 'normal',
                    suppressCellFocus: true,
                    rowHeight: 240,
                    headerHeight: 40
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Programs Overlay Dialog */}
      <Dialog 
        open={selectedProgramsDialog.open} 
        onOpenChange={(open) => setSelectedProgramsDialog(prev => ({ ...prev, open }))}
      >
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Access Programs - {selectedProgramsDialog.title}</DialogTitle>
          </DialogHeader>
          <div className="mt-4">
            <div className="grid grid-cols-2 gap-2 max-h-96 overflow-y-auto">
              {selectedProgramsDialog.programs.map((program, index) => (
                <Badge key={index} variant="outline" className="justify-start p-2">
                  {program}
                </Badge>
              ))}
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Encounters Overlay Dialog */}
      <Dialog 
        open={selectedEncountersDialog.open} 
        onOpenChange={(open) => setSelectedEncountersDialog(prev => ({ ...prev, open }))}
      >
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Linked Encounters - {selectedEncountersDialog.problemTitle}</DialogTitle>
          </DialogHeader>
          <div className="mt-4">
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {selectedEncountersDialog.encounters.map((encounter, index) => (
                <div key={index} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Badge variant={
                      encounter.status === 'Completed' ? 'default' :
                      encounter.status === 'Scheduled' ? 'secondary' : 'destructive'
                    } className="text-xs">
                      {encounter.status}
                    </Badge>
                    <div>
                      <div className="font-medium text-sm">{encounter.type}</div>
                      <div className="text-xs text-gray-500">
                        {encounter.date} • {encounter.provider}
                      </div>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => console.log('View encounter:', encounter.id)}
                  >
                    View Details
                  </Button>
                </div>
              ))}
            </div>
            <div className="mt-4 pt-4 border-t border-gray-200">
              <Button
                onClick={() => handleLinkEncounter(selectedEncountersDialog.problemId)}
                className="flex items-center gap-2"
              >
                <PlusCircleIcon className="w-4 h-4" />
                Link New Encounter
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Link Encounters Dialog - Base Layer */}
      <Dialog 
        open={linkEncountersDialog.open} 
        onOpenChange={(open) => setLinkEncountersDialog(prev => ({ ...prev, open }))}
      >
        <DialogContent 
          className={`sm:max-w-[1000px] lg:max-w-[1200px] p-0 flex flex-col h-[800px] max-h-[90vh] overflow-auto bg-gradient-to-br from-orange-50 to-blue-100 transition-all duration-300 ${
            linkEncountersDialog.showAddDiagnosis 
              ? 'transform scale-95 opacity-60 pointer-events-none' 
              : 'transform scale-100 opacity-100'
          }`}
          style={{
            zIndex: linkEncountersDialog.showAddDiagnosis ? 40 : 50
          }}
        >
          {/* Accessible dialog title for screen readers, visually hidden */}
          <DialogTitle className="sr-only">
            Link Encounters to Problem
          </DialogTitle>
          
          {/* Normal Link Encounters content */}
          <div className="px-4 py-2 rounded-t-xl">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base font-semibold text-gray-900">
                  Link Encounters - {linkEncountersDialog.problemTitle}
                </h2>
                <p className="text-sm text-gray-600 mt-1">
                  {linkingMode === 'clinical-to-encounters' 
                    ? 'Select existing encounters or create new ones to link to this problem'
                    : 'Select clinical items to link to encounters'
                  }
                </p>
              </div>
              
              {/* Professional Mode Switcher Tabs */}
              <div className="flex-shrink-0 pr-8">
                <Tabs
                  tabs={LINKING_MODES}
                  activeTab={linkingMode}
                  onTabChange={(tabId: string) => {
                    setLinkingMode(tabId as 'clinical-to-encounters' | 'encounters-to-clinical');
                  }}
                  className="w-fit"
                />
              </div>
            </div>
          </div>

          {/* Main content area */}
          <div className="flex flex-1 min-h-0 overflow-hidden gap-6 p-4">
            <div className="w-[400px] min-w-[400px] bg-white rounded-xl border border-gray-200 shadow-sm h-full flex flex-col">
              <div className="p-4 border-b border-gray-200">
                <h3 className="font-medium text-gray-900">Clinical Items</h3>
              </div>
              <div className="flex-1 p-4">
                <p className="text-gray-500 text-sm">Clinical items content...</p>
              </div>
            </div>
            
            <div className="flex-1 bg-white rounded-xl border border-gray-200 shadow-sm h-full flex flex-col">
              <div className="p-4 border-b border-gray-200">
                <h3 className="font-medium text-gray-900">Encounters</h3>
              </div>
              <div className="flex-1 p-4">
                <p className="text-gray-500 text-sm">Encounters content...</p>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex justify-end gap-3 p-4 border-t border-gray-200">
            <Button variant="outline" onClick={() => setLinkEncountersDialog(prev => ({ ...prev, open: false }))}>
              Cancel
            </Button>
            <Button className="bg-blue-600 hover:bg-blue-700 text-white">
              Done
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Add Condition Dialog - Stacked on top */}
      {linkEncountersDialog.showAddDiagnosis && (
        <Dialog open={true} onOpenChange={() => {}}>
          <DialogContent 
            className="sm:max-w-[1000px] lg:max-w-[1200px] p-0 flex flex-col h-[800px] max-h-[90vh] overflow-auto bg-white shadow-2xl"
            style={{ zIndex: 60 }}
          >
            <DialogTitle className="sr-only">Add New Condition</DialogTitle>
            
            {/* Add Condition content */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-lg m-6">
              {/* Compact Header with Back Button and Breadcrumb */}
              <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 bg-gray-50">
                <div className="flex flex-col gap-1">
                  {/* Back Button */}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleBackFromAddCondition}
                    className="text-gray-600 hover:text-gray-900 self-start h-7 px-2 text-xs"
                  >
                    <ArrowLeftIcon className="w-3 h-3 mr-1" />
                    Back to Link Encounters
                  </Button>
                  
                  {/* Compact Breadcrumb Navigation */}
                  <nav className="flex items-center space-x-1 text-xs text-gray-500">
                    <span className="hover:text-gray-700 cursor-pointer">Problems</span>
                    <span>/</span>
                    <button 
                      onClick={handleBackFromAddCondition}
                      className="hover:text-gray-700 cursor-pointer"
                    >
                      Link Encounters
                    </button>
                    <span>/</span>
                    <span className="text-gray-900 font-medium">Add Condition</span>
                  </nav>
                </div>
                <div className="text-right">
                  <h3 className="text-base font-semibold text-gray-900">Add New Condition</h3>
                </div>
              </div>

              {/* Two-Column Layout - Common Conditions & Condition Details */}
              <div className="flex gap-6 h-[600px]">
                {/* Left Section - Common Conditions (30% width) */}
                <div className="w-[30%] bg-white rounded-lg border border-gray-200 overflow-hidden">
                  <div className="p-4 border-b border-gray-200 bg-gray-50">
                    <h3 className="text-base font-medium text-gray-900">Common Conditions</h3>
                    <p className="text-xs text-gray-600 mt-1">Select a condition to auto-populate the form</p>
                  </div>
                  
                  <div className="overflow-y-auto h-full p-4 space-y-2">
                    {commonConditions.map((condition) => {
                      const isSelected = addConditionForm.coding === condition.code;
                      
                      return (
                        <button
                          key={condition.code}
                          onClick={() => handleConditionSelect(condition)}
                          className={`w-full text-left p-3 rounded-lg border transition-all ${
                            isSelected
                              ? 'bg-blue-50 border-blue-200 ring-2 ring-blue-500/20'
                              : 'bg-white border-gray-200 hover:bg-gray-50 hover:border-gray-300'
                          }`}
                        >
                          <div className="flex flex-col">
                            <div className={`font-medium text-sm ${
                              isSelected ? 'text-blue-900' : 'text-gray-900'
                            }`}>
                              {condition.code}
                            </div>
                            <div className={`text-xs mt-1 ${
                              isSelected ? 'text-blue-700' : 'text-gray-600'
                            }`}>
                              {condition.description}
                            </div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Right Section - Condition Details Form (70% width) */}
                <div className="w-[70%] bg-white rounded-lg border border-gray-200 overflow-hidden">
                  <div className="p-4 border-b border-gray-200 bg-gray-50">
                    <h3 className="text-base font-medium text-gray-900">Condition Details</h3>
                    <p className="text-xs text-gray-600 mt-1">Complete the form to add the condition</p>
                  </div>
                  
                  <div className="overflow-y-auto h-full p-4 space-y-4">
                    {/* Primary Diagnosis Code */}
                    <div className="flex items-center gap-2 mb-4">
                      <input
                        type="checkbox"
                        id="primaryDiagnosis"
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <label htmlFor="primaryDiagnosis" className="text-sm font-medium text-gray-700">
                        Primary Diagnosis Code
                      </label>
                    </div>

                    {/* Coding */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Coding:</label>
                      <div className="flex gap-2">
                        <Input
                          type="text"
                          value={addConditionForm.coding}
                          onChange={(e) => handleAddConditionInputChange('coding', e.target.value)}
                          placeholder="Enter ICD code"
                          className="flex-1"
                        />
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="px-3"
                          onClick={() => handleAddConditionInputChange('coding', '')}
                        >
                          Clear
                        </Button>
                      </div>
                    </div>

                    {/* Title */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Title:</label>
                      <Input
                        type="text"
                        value={addConditionForm.title}
                        onChange={(e) => handleAddConditionInputChange('title', e.target.value)}
                        placeholder="Enter condition title"
                        className="w-full"
                      />
                    </div>

                    {/* Date Fields */}
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Begin Date:</label>
                        <Input
                          type="date"
                          value={addConditionForm.beginDate}
                          onChange={(e) => handleAddConditionInputChange('beginDate', e.target.value)}
                          className="w-full"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">End Date:</label>
                        <Input
                          type="date"
                          value={addConditionForm.endDate}
                          onChange={(e) => handleAddConditionInputChange('endDate', e.target.value)}
                          className="w-full"
                        />
                      </div>
                    </div>

                    {/* Access Programs */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Access Programs:</label>
                      <Input
                        type="text"
                        value="118 of 178 selected"
                        readOnly
                        className="w-full bg-gray-50"
                      />
                    </div>

                    {/* Pathogen */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Pathogen:</label>
                      <Input
                        type="text"
                        placeholder="Enter pathogen information"
                        className="w-full"
                      />
                    </div>

                    {/* Signs & Symptoms */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Signs & Symptoms:</label>
                      <Textarea
                        placeholder="Enter signs and symptoms"
                        value={addConditionForm.signsSymptoms}
                        onChange={(e) => handleAddConditionInputChange('signsSymptoms', e.target.value)}
                        rows={3}
                        className="w-full"
                      />
                    </div>

                    {/* Occurrence */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Occurrence:</label>
                      <Select value={addConditionForm.occurrence} onValueChange={(value) => handleAddConditionInputChange('occurrence', value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select occurrence" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Unknown or N/A">Unknown or N/A</SelectItem>
                          <SelectItem value="First occurrence">First occurrence</SelectItem>
                          <SelectItem value="Recurring">Recurring</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-between pt-4 border-t border-gray-200 px-6 pb-6">
                <Button
                  variant="outline"
                  onClick={handleBackFromAddCondition}
                  className="px-6"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleSaveCondition}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6"
                >
                  Save Condition
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );

export default ProblemsManagementPage;
                            <div
                              key={encounter.id}
                              className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                                selectedEncounterId === encounter.id
                                  ? 'border-blue-500 bg-blue-50'
                                  : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                              }`}
                              onClick={() => {
                                console.log('Encounter clicked:', encounter.type, encounter.id);
                                setSelectedEncounterId(encounter.id);
                              }}
                            >
                              <div className="flex items-start justify-between">
                                <div className="flex-1 min-w-0">
                                  <div className="font-medium text-sm text-gray-900 truncate">
                                    {encounter.type}
                                  </div>
                                  <div className="text-xs text-gray-500 mt-1">
                                    {encounter.date}
                                  </div>
                                </div>
                                <Badge
                                  variant={
                                    encounter.status === 'Completed' ? 'default' :
                                    encounter.status === 'Scheduled' ? 'secondary' : 'destructive'
                                  }
                                  className="text-xs ml-2"
                                >
                                  {encounter.status}
                                </Badge>
                              </div>
                            </div>
                          ))}
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="text-center text-gray-400 mt-20">
                    <div className="text-sm">Select a clinical item from the left panel</div>
                    <div className="text-xs mt-2">Choose a problem to view its linked encounters</div>
                  </div>
                )
              )}
            </div>

            {/* Right Section - Dynamic based on mode */}
            <div className="flex-1 bg-white rounded-xl border border-gray-200 shadow-sm h-full flex flex-col">
              {/* Content area - dynamic based on mode */}
              <div className="flex-1 p-4 overflow-y-auto">
                {linkingMode === 'clinical-to-encounters' ? (
                  // Mode 1: Encounter Management (when clinical item is selected)
                  linkEncountersDialog.problemId ? (
                  <div className="space-y-6">
                    {/* Currently Linked Encounters */}
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <h4 className="text-sm font-semibold text-gray-900">
                          Currently Linked Encounters ({problems.find(p => p.id === linkEncountersDialog.problemId)?.linkedEncounters.length || 0})
                        </h4>
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-xs"
                          onClick={() => console.log('Add new encounter')}
                        >
                          <PlusCircleIcon className="w-3 h-3 mr-1" />
                          Add Encounter
                        </Button>
                      </div>
                      
                      {/* Linked encounters list */}
                      <div className="space-y-2">
                        {problems.find(p => p.id === linkEncountersDialog.problemId)?.linkedEncounters.map((encounter) => (
                          <div
                            key={encounter.id}
                            className="flex items-center justify-between p-2 border border-gray-200 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors"
                          >
                            <div className="flex items-center justify-between flex-1 gap-3">
                              <div className="font-medium text-sm text-gray-900">
                                {encounter.type}
                              </div>
                              <div className="flex items-center gap-3 text-xs text-gray-500">
                                <span>{encounter.date}</span>

                              </div>
                            </div>
                            <div className="flex items-center gap-2 ml-3">
                              <Badge
                                variant={
                                  encounter.status === 'Completed' ? 'default' :
                                  encounter.status === 'Scheduled' ? 'secondary' : 'destructive'
                                }
                                className="text-xs"
                              >
                                {encounter.status}
                              </Badge>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-6 w-6 p-0 text-red-500 hover:text-red-700"
                                onClick={() => console.log('Unlink encounter:', encounter.id)}
                              >
                                <TrashIcon className="w-3 h-3" />
                              </Button>
                            </div>
                          </div>
                        ))}
                        
                        {(!problems.find(p => p.id === linkEncountersDialog.problemId)?.linkedEncounters.length) && (
                          <div className="text-center text-gray-400 py-8">
                            <div className="text-sm">No encounters linked yet</div>
                            <div className="text-xs mt-1">Click "Add Encounter" to link encounters to this problem</div>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Available Encounters to Link */}
                    <div className="space-y-3">
                      <h4 className="text-sm font-semibold text-gray-900">
                        Available Encounters ({mockAvailableEncounters.length})
                      </h4>
                      
                      {/* Search and filter */}
                      <div className="flex gap-3">
                        <input
                          type="text"
                          placeholder="Search encounters..."
                          className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <Select defaultValue="all-status">
                          <SelectTrigger className="w-40 h-9 text-sm">
                            <SelectValue placeholder="All Status" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all-status">All Status</SelectItem>
                            <SelectItem value="completed">Completed</SelectItem>
                            <SelectItem value="scheduled">Scheduled</SelectItem>
                            <SelectItem value="cancelled">Cancelled</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      {/* Available encounters list */}
                      <div className="space-y-2 max-h-74 overflow-y-auto">
                        {mockAvailableEncounters.map((encounter) => (
                          <div
                            key={encounter.id}
                            className="flex items-center justify-between p-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                          >
                            <div className="flex items-center justify-between flex-1 gap-3">
                              <div className="font-medium text-sm text-gray-900">
                                {encounter.type}
                              </div>
                              <div className="flex items-center gap-3 text-xs text-gray-500">
                                <span>{encounter.date}</span>

                              </div>
                            </div>
                            <div className="flex items-center gap-2 ml-3">
                              <Badge
                                variant={
                                  encounter.status === 'Completed' ? 'default' :
                                  encounter.status === 'Scheduled' ? 'secondary' : 'destructive'
                                }
                                className="text-xs"
                              >
                                {encounter.status}
                              </Badge>
                              <Button
                                variant="outline"
                                size="sm"
                                className="text-xs"
                                onClick={() => handleLinkEncounterToProblem(encounter.id, linkEncountersDialog.problemId)}
                              >
                                Link
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                  ) : (
                    <div className="text-center text-gray-400 mt-20">
                      <div className="text-sm">Select a clinical item from the left panel</div>
                      <div className="text-xs mt-2">Choose a problem, allergy, or medication to manage its encounters</div>
                    </div>
                  )
                ) : (
                  // Mode 2: Clinical Items Management (when encounter is selected)
                  selectedEncounterId ? (
                    <div className="space-y-6">
                      {/* Currently Linked Clinical Items */}
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <h4 className="text-sm font-semibold text-gray-900">
                            Clinical Items Linked to This Encounter
                            {selectedEncounterId && (
                              <span className="text-xs text-gray-500 ml-2">
                                (Encounter ID: {selectedEncounterId})
                              </span>
                            )}
                          </h4>
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-xs"
                            onClick={() => setAddProblemDialog(true)}
                          >
                            <PlusCircleIcon className="w-3 h-3 mr-1" />
                            Add Clinical Item
                          </Button>
                        </div>

                        {/* Show which clinical items are linked to this encounter */}
                        <div className="space-y-2">
                          {(() => {
                            const linkedProblems = problems.filter(problem => 
                              problem.linkedEncounters.some(enc => enc.id === selectedEncounterId)
                            );
                            
                            if (linkedProblems.length === 0) {
                              return (
                                <div className="text-center text-gray-400 py-8">
                                  <div className="text-sm">No clinical items linked to this encounter</div>
                                  <div className="text-xs mt-2">Click "Add Clinical Item" to link problems, allergies, or medications</div>
                                </div>
                              );
                            }
                            
                            return linkedProblems.map((problem) => (
                              <div
                                key={problem.id}
                                className="flex items-center justify-between p-3 border border-gray-200 rounded-lg bg-gray-50"
                              >
                                <div className="flex-1 min-w-0">
                                  <div className="font-medium text-sm text-gray-900 truncate">
                                    {problem.title}
                                  </div>
                                  <div className="text-xs text-gray-500 mt-1">
                                    Problem • {problem.linkedEncounters.length} encounters total
                                  </div>
                                </div>
                                <div className="flex items-center gap-2 ml-3">
                                  <Badge
                                    variant={
                                      problem.status === 'Active' ? 'default' :
                                      problem.status === 'Resolved' ? 'secondary' : 'outline'
                                    }
                                    className="text-xs"
                                  >
                                    {problem.status}
                                  </Badge>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    className="text-xs text-red-600 hover:text-red-700 hover:bg-red-50"
                                    onClick={() => {
                                      // Remove the encounter from this problem's linkedEncounters
                                      setProblems(prevProblems => 
                                        prevProblems.map(p => 
                                          p.id === problem.id 
                                            ? {
                                                ...p,
                                                linkedEncounters: p.linkedEncounters.filter(enc => enc.id !== selectedEncounterId)
                                              }
                                            : p
                                        )
                                      );
                                    }}
                                  >
                                    Unlink
                                  </Button>
                                </div>
                              </div>
                            ));
                          })()}
                        </div>
                      </div>

                      {/* Available Clinical Items to Link */}
                      <div className="space-y-3">
                        <h4 className="text-sm font-semibold text-gray-900">
                          Available Clinical Items to Link
                        </h4>
                        
                        {/* Clinical Items Tabs */}
                        <div className="flex border-b border-gray-100">
                          <button className="px-4 py-2 text-xs font-medium text-blue-600 border-b-2 border-blue-600 bg-blue-50">
                            Problems
                          </button>
                          <button className="px-4 py-2 text-xs font-medium text-gray-500 hover:text-gray-700">
                            Allergies
                          </button>
                          <button className="px-4 py-2 text-xs font-medium text-gray-500 hover:text-gray-700">
                            Medications
                          </button>
                        </div>

                        {/* Clinical items list for linking */}
                        <div className="space-y-2 max-h-64 overflow-y-auto">
                          {problems.filter(problem => 
                            !problem.linkedEncounters.some(enc => enc.id === selectedEncounterId)
                          ).map((problem) => (
                            <div
                              key={problem.id}
                              className="flex items-center justify-between p-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                            >
                              <div className="flex-1 min-w-0">
                                <div className="font-medium text-sm text-gray-900 truncate">
                                  {problem.title}
                                </div>
                                <div className="text-xs text-gray-500 mt-1">
                                  {problem.linkedEncounters.length} encounters linked
                                </div>
                              </div>
                              <div className="flex items-center gap-2 ml-3">
                                <Badge
                                  variant={
                                    problem.status === 'Active' ? 'default' :
                                    problem.status === 'Resolved' ? 'secondary' : 'outline'
                                  }
                                  className="text-xs"
                                >
                                  {problem.status}
                                </Badge>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="text-xs"
                                  onClick={() => {
                                    console.log('=== LINK BUTTON CLICKED ===');
                                    console.log('Problem being linked:', problem.title, 'ID:', problem.id);
                                    console.log('Selected encounter ID:', selectedEncounterId);
                                    console.log('Current linking mode:', linkingMode);
                                    console.log('All available encounters:', mockAvailableEncounters);
                                    console.log('Current problems state:', problems);
                                    
                                    if (!selectedEncounterId) {
                                      console.error('ERROR: No encounter selected! selectedEncounterId is empty');
                                      alert('Please select an encounter first from the left panel');
                                      return;
                                    }
                                    
                                    // Find the selected encounter from mockAvailableEncounters
                                    const selectedEncounter = mockAvailableEncounters.find(enc => enc.id === selectedEncounterId);
                                    console.log('Found encounter:', selectedEncounter);
                                    
                                    if (selectedEncounter) {
                                      console.log('SUCCESS: Found encounter, proceeding to link...');
                                      // Add the encounter to this problem's linkedEncounters (check for duplicates)
                                      setProblems(prevProblems => {
                                        console.log('Previous problems state:', prevProblems);
                                        const updatedProblems = prevProblems.map(p => {
                                          if (p.id === problem.id) {
                                            // Check if encounter is already linked
                                            const isAlreadyLinked = p.linkedEncounters.some(enc => enc.id === selectedEncounterId);
                                            console.log('Is already linked:', isAlreadyLinked);
                                            
                                            if (!isAlreadyLinked) {
                                              const newProblem = {
                                                ...p,
                                                linkedEncounters: [...p.linkedEncounters, selectedEncounter]
                                              };
                                              console.log('Updated problem:', newProblem);
                                              return newProblem;
                                            } else {
                                              console.log('Encounter already linked, skipping...');
                                            }
                                            return p; // Return unchanged if already linked
                                          }
                                          return p;
                                        });
                                        console.log('Final updated problems:', updatedProblems);
                                        return updatedProblems;
                                      });
                                    } else {
                                      console.error('ERROR: No encounter found with ID:', selectedEncounterId);
                                      console.log('Available encounter IDs:', mockAvailableEncounters.map(e => e.id));
                                    }
                                  }}
                                >
                                  Link
                                </Button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center text-gray-400 mt-20">
                      <div className="text-sm">Select an encounter from the left panel</div>
                      <div className="text-xs mt-2">Choose an encounter to manage its clinical items</div>
                    </div>
                  )
                )}
              </div>
            </div>
            </div>

            {/* Footer */}
            <div className="py-2.5 px-4 border-t border-gray-200 bg-white rounded-b-xl">
              <div className="flex justify-between items-center">
                <div className="text-sm text-gray-600">
                  {linkEncountersDialog.problemId 
                    ? `Managing encounters for ${linkEncountersDialog.problemTitle}`
                    : 'Select a clinical item to manage encounters'
                  }
                </div>
                <div className="flex gap-3">
                  <Button
                    variant="ghost"
                    onClick={() => setLinkEncountersDialog(prev => ({ ...prev, open: false }))}
                    className="px-3 h-9 font-normal border-gray-200 text-sm"
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="default"
                    onClick={() => {
                      console.log('Close encounter management for:', linkEncountersDialog.problemId);
                      setLinkEncountersDialog(prev => ({ ...prev, open: false }));
                    }}
                  >
                    Done
                  </Button>
                </div>
              </div>
            </div>
            </>
          )}
          {/* End of conditional for normal Link Encounters mode */}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ProblemsManagementPage;
