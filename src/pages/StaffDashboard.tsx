import React, { useState, useMemo } from 'react';
import TopNavigationBar from '@/components/old-ui/TopNavigationBar';
import MainNavigationBar from '@/components/old-ui/MainNavigationBar';
import { 
  UserGroupIcon, 
  MagnifyingGlassIcon,
  EyeIcon,
  DocumentTextIcon,
  CalendarIcon,
  ClockIcon,
  CheckCircleIcon,
  FunnelIcon,
  ArrowPathIcon,
  DocumentArrowDownIcon,
  BellIcon,
  ExclamationTriangleIcon,
  ChartBarIcon,
  UserIcon,
  DocumentDuplicateIcon,
  ClipboardDocumentListIcon,
  AdjustmentsHorizontalIcon,
  UserGroupIcon as UsersIcon,
  XCircleIcon
} from '@heroicons/react/24/outline';
import { DataTable } from '@/components/organisms/DataTable';
import { ColumnMenuTab, GridOptions } from 'ag-grid-community';
import { Badge } from '@/components/atoms/Badge';
import { Button } from '@/components/atoms/Button';
import { Input } from '@/components/atoms/Input';
import { Tabs } from '@/components/atoms/Tabs';
import { Switch } from '@/components/atoms/Switch/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/atoms/Select/select';
import { TableSkeleton } from '@/components/atoms/TableSkeleton';
import { cn } from '@/lib/utils';
import { useMediaQuery } from '@/hooks/useMediaQuery';
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
  TooltipProvider,
  TooltipRoot,
  TooltipTrigger,
  TooltipContent
} from '@/components/atoms/Tooltip/tooltip';
import ColumnCustomizer, { ColumnConfig } from '@/components/molecules/ColumnCustomizer';
import { Combobox, ComboboxOption } from '@/components/atoms/Combobox/Combobox';

/**
 * StaffDashboard Page Component
 * 
 * Modern behavioral health staff dashboard with intuitive UX
 * Focuses on quick client access, status overview, and efficient workflows
 * I will use atomic design principles for all components
 * 
 * Treatment Plan Types:
 * - 14-Day Plan: Initial treatment plan required within 14 days of admission
 * - MDTP: Multidisciplinary Treatment Plan - comprehensive plan developed by 
 *   team of healthcare professionals (psychiatrists, therapists, social workers, etc.)
 * - Encounter Numbers: Unique identifiers for each treatment plan session/document
 */

// Client interface matching real behavioral health clinic structure
interface Client {
  id: string;
  provider: string;
  program: string;
  lastName: string;
  firstName: string;
  pid: string;
  clientStatus: 'Active' | 'Discharged' | 'On Hold';
  dob: string;
  lastSeen: string;
  admittedDate: string;
  dischargedDate: string;
  treatmentPlan14Day: string;
  treatmentPlan14DayEncounter?: string; // Encounter number for 14-day plan
  mdtp: string; // Multidisciplinary Treatment Plan
  mdtpEncounter?: string; // Encounter number for MDTP
  facility: string;
  location: string;
  isIncomplete: boolean;
  riskLevel: 'Low' | 'Medium' | 'High';
  nextAppointment: string;
  // Additional fields for column customization
  levelOfCare?: string;
  dateLastSeenByMe?: string;
  individualSession?: string;
  groupSession?: string;
  cancelNoShow?: string;
  tentativeDischargeDate?: string;
  erVisitsInfo?: string;
  admitLocation?: string;
}

// Mock data with enhanced behavioral health structure - expanded dataset
const mockClients: Client[] = [
  {
    id: '001',
    provider: 'Sarah Wilson, LCSW',
    program: 'Intensive Outpatient Program (IOP)',
    lastName: 'Johnson',
    firstName: 'Sarah',
    pid: '1002762',
    clientStatus: 'Active',
    dob: '02/24/1989',
    lastSeen: '12/15/2023',
    admittedDate: '02/24/2023',
    dischargedDate: '',
    treatmentPlan14Day: 'Not yet',
    treatmentPlan14DayEncounter: '',
    mdtp: '05/16/2024',
    mdtpEncounter: '#E240516001',
    facility: 'Main Campus',
    location: 'Unit A',
    isIncomplete: true,
    riskLevel: 'High',
    nextAppointment: 'Today 2:00 PM',
    levelOfCare: 'Intensive Outpatient',
    dateLastSeenByMe: '12/10/2023',
    individualSession: 'Weekly',
    groupSession: '3x/week',
    cancelNoShow: '2 cancellations',
    tentativeDischargeDate: '03/15/2024',
    erVisitsInfo: 'None',
    admitLocation: 'Emergency Department'
  },
  {
    id: '002',
    provider: 'Michael Chen, LPC',
    program: 'Partial Hospitalization Program (PHP)',
    lastName: 'Rodriguez',
    firstName: 'Miguel',
    pid: '1002716',
    clientStatus: 'Active',
    dob: '01/18/1986',
    lastSeen: '04/22/2024',
    admittedDate: '06/16/2023',
    dischargedDate: '',
    treatmentPlan14Day: '03/17/2024',
    treatmentPlan14DayEncounter: '#E240317002',
    mdtp: '02/27/2025',
    mdtpEncounter: '#E250227001',
    facility: 'Outpatient Center',
    location: 'Building B',
    isIncomplete: false,
    riskLevel: 'Medium',
    nextAppointment: 'Tomorrow 10:00 AM',
    levelOfCare: 'Partial Hospitalization',
    dateLastSeenByMe: '04/20/2024',
    individualSession: 'Bi-weekly',
    groupSession: 'Daily',
    cancelNoShow: 'None',
    tentativeDischargeDate: '',
    erVisitsInfo: '1 visit - 03/15/2024',
    admitLocation: 'Direct Admission'
  },
  {
    id: '003',
    provider: 'Emma Davis, LMFT',
    program: 'Residential Treatment Program',
    lastName: 'Thompson',
    firstName: 'Ashley',
    pid: '1003047',
    clientStatus: 'Active',
    dob: '06/01/1993',
    lastSeen: '12/19/2023',
    admittedDate: '06/16/2023',
    dischargedDate: '',
    treatmentPlan14Day: 'Not yet',
    mdtp: '06/19/2025',
    facility: 'Main Campus',
    location: 'Unit C',
    isIncomplete: true,
    riskLevel: 'High',
    nextAppointment: 'Today 4:00 PM'
  },
  {
    id: '004',
    provider: 'James Wilson, LCADC',
    program: 'Substance Abuse Treatment',
    lastName: 'Martinez',
    firstName: 'Carlos',
    pid: '1003589',
    clientStatus: 'Active',
    dob: '01/20/1971',
    lastSeen: '07/04/2024',
    admittedDate: '01/20/2024',
    dischargedDate: '',
    treatmentPlan14Day: '05/28/2024',
    treatmentPlan14DayEncounter: '#E240528003',
    mdtp: '06/19/2025',
    mdtpEncounter: '#E250619002',
    facility: 'Rehabilitation Center',
    location: 'Floor 2',
    isIncomplete: false,
    riskLevel: 'Low',
    nextAppointment: 'Friday 9:00 AM'
  },
  {
    id: '005',
    provider: 'Lisa Brown, PNP',
    program: 'Medication Management',
    lastName: 'Williams',
    firstName: 'Jennifer',
    pid: '1004456',
    clientStatus: 'Discharged',
    dob: '01/30/1986',
    lastSeen: '11/10/2024',
    admittedDate: '11/10/2024',
    dischargedDate: '12/01/2024',
    treatmentPlan14Day: '10/17/2024',
    mdtp: '06/19/2025',
    facility: 'Outpatient Center',
    location: 'Building A',
    isIncomplete: false,
    riskLevel: 'Medium',
    nextAppointment: ''
  },
  {
    id: '006',
    provider: 'Maria Garcia, LCSW',
    program: 'Individual Therapy',
    lastName: 'Anderson',
    firstName: 'David',
    pid: '1004506',
    clientStatus: 'Active',
    dob: '12/21/1993',
    lastSeen: '11/10/2024',
    admittedDate: '11/10/2024',
    dischargedDate: '',
    treatmentPlan14Day: '10/07/2024',
    mdtp: 'Not yet',
    facility: 'Main Campus',
    location: 'Unit B',
    isIncomplete: true,
    riskLevel: 'High',
    nextAppointment: 'Today 1:00 PM'
  },
  {
    id: '007',
    provider: 'Carlos Martinez, LCSW',
    program: 'Crisis Intervention Services',
    lastName: 'Taylor',
    firstName: 'Michelle',
    pid: '1002779',
    clientStatus: 'Active',
    dob: '03/10/1992',
    lastSeen: '03/10/2023',
    admittedDate: '03/01/2023',
    dischargedDate: '',
    treatmentPlan14Day: 'Not yet',
    mdtp: '06/19/2025',
    facility: 'Crisis Center',
    location: 'Emergency Wing',
    isIncomplete: true,
    riskLevel: 'High',
    nextAppointment: 'Today 3:00 PM'
  },
  {
    id: '008',
    provider: 'David Taylor, LPC',
    program: 'Group Therapy Program',
    lastName: 'Jackson',
    firstName: 'Robert',
    pid: '1004868',
    clientStatus: 'Active',
    dob: '02/19/2004',
    lastSeen: '06/11/2025',
    admittedDate: '04/07/2025',
    dischargedDate: '',
    treatmentPlan14Day: '06/11/2025',
    mdtp: '03/11/2025',
    facility: 'Rehabilitation Center',
    location: 'Floor 3',
    isIncomplete: false,
    riskLevel: 'Low',
    nextAppointment: 'Monday 11:00 AM'
  },
  {
    id: '009',
    provider: 'Jennifer Anderson, BCBA',
    program: 'Behavioral Therapy Program',
    lastName: 'White',
    firstName: 'Amanda',
    pid: '1004645',
    clientStatus: 'Discharged',
    dob: '04/15/2005',
    lastSeen: '04/14/2025',
    admittedDate: '04/15/2025',
    dischargedDate: '04/20/2025',
    treatmentPlan14Day: '04/14/2025',
    mdtp: '06/19/2025',
    facility: 'Outpatient Center',
    location: 'Building C',
    isIncomplete: false,
    riskLevel: 'Low',
    nextAppointment: ''
  },
  {
    id: '010',
    provider: 'Robert Thompson, LMFT',
    program: 'Family Therapy Program',
    lastName: 'Davis',
    firstName: 'Kevin',
    pid: '1004682',
    clientStatus: 'Active',
    dob: '01/27/2006',
    lastSeen: '02/18/2025',
    admittedDate: '03/06/2025',
    dischargedDate: '',
    treatmentPlan14Day: '02/18/2025',
    mdtp: '06/19/2025',
    facility: 'Main Campus',
    location: 'Unit D',
    isIncomplete: false,
    riskLevel: 'Medium',
    nextAppointment: 'Wednesday 2:30 PM'
  },
  {
    id: '011',
    provider: 'Patricia Moore, LCSW',
    program: 'Trauma-Informed Care',
    lastName: 'Miller',
    firstName: 'Jessica',
    pid: '1005123',
    clientStatus: 'Active',
    dob: '08/15/1990',
    lastSeen: '12/20/2023',
    admittedDate: '09/12/2023',
    dischargedDate: '',
    treatmentPlan14Day: '12/15/2023',
    mdtp: 'Not yet',
    facility: 'Main Campus',
    location: 'Unit A',
    isIncomplete: true,
    riskLevel: 'High',
    nextAppointment: 'Today 11:00 AM'
  },
  {
    id: '012',
    provider: 'Anthony Lewis, LCADC',
    program: 'Dual Diagnosis Treatment',
    lastName: 'Brown',
    firstName: 'Christopher',
    pid: '1005234',
    clientStatus: 'Active',
    dob: '11/03/1985',
    lastSeen: '12/18/2023',
    admittedDate: '08/22/2023',
    dischargedDate: '',
    treatmentPlan14Day: '12/10/2023',
    mdtp: '03/15/2024',
    facility: 'Rehabilitation Center',
    location: 'Floor 1',
    isIncomplete: false,
    riskLevel: 'Medium',
    nextAppointment: 'Thursday 3:00 PM'
  },
  {
    id: '013',
    provider: 'Rachel Green, LPC',
    program: 'Adolescent Mental Health',
    lastName: 'Wilson',
    firstName: 'Tyler',
    pid: '1005345',
    clientStatus: 'Active',
    dob: '05/22/2007',
    lastSeen: '12/19/2023',
    admittedDate: '10/05/2023',
    dischargedDate: '',
    treatmentPlan14Day: 'Not yet',
    mdtp: '12/20/2023',
    facility: 'Youth Center',
    location: 'Wing A',
    isIncomplete: true,
    riskLevel: 'High',
    nextAppointment: 'Tomorrow 2:00 PM'
  },
  {
    id: '014',
    provider: 'Steven Clark, LMFT',
    program: 'Couples Therapy',
    lastName: 'Garcia',
    firstName: 'Maria',
    pid: '1005456',
    clientStatus: 'Active',
    dob: '07/12/1988',
    lastSeen: '12/17/2023',
    admittedDate: '11/15/2023',
    dischargedDate: '',
    treatmentPlan14Day: '12/01/2023',
    mdtp: '02/28/2024',
    facility: 'Outpatient Center',
    location: 'Building B',
    isIncomplete: false,
    riskLevel: 'Low',
    nextAppointment: 'Friday 1:30 PM'
  },
  {
    id: '015',
    provider: 'Diana Rodriguez, PNP',
    program: 'Geriatric Mental Health',
    lastName: 'Johnson',
    firstName: 'Eleanor',
    pid: '1005567',
    clientStatus: 'Discharged',
    dob: '03/08/1945',
    lastSeen: '11/30/2023',
    admittedDate: '07/20/2023',
    dischargedDate: '12/01/2023',
    treatmentPlan14Day: '11/25/2023',
    mdtp: '11/28/2023',
    facility: 'Senior Care Unit',
    location: 'East Wing',
    isIncomplete: false,
    riskLevel: 'Low',
    nextAppointment: ''
  },
  {
    id: '016',
    provider: 'Marcus Washington, LCADC',
    program: 'Outpatient Detox Program',
    lastName: 'Lee',
    firstName: 'Brandon',
    pid: '1005678',
    clientStatus: 'Active',
    dob: '09/14/1992',
    lastSeen: '12/20/2023',
    admittedDate: '12/18/2023',
    dischargedDate: '',
    treatmentPlan14Day: 'Not yet',
    mdtp: 'Not yet',
    facility: 'Detox Center',
    location: 'Secure Unit',
    isIncomplete: true,
    riskLevel: 'High',
    nextAppointment: 'Today 9:00 AM'
  },
  {
    id: '017',
    provider: 'Nicole Adams, LCSW',
    program: 'Women\'s Support Group',
    lastName: 'Turner',
    firstName: 'Stephanie',
    pid: '1005789',
    clientStatus: 'Active',
    dob: '12/25/1991',
    lastSeen: '12/19/2023',
    admittedDate: '10/30/2023',
    dischargedDate: '',
    treatmentPlan14Day: '11/15/2023',
    mdtp: '01/30/2024',
    facility: 'Women\'s Center',
    location: 'Group Room 1',
    isIncomplete: false,
    riskLevel: 'Medium',
    nextAppointment: 'Monday 10:00 AM'
  },
  {
    id: '018',
    provider: 'Thomas Baker, LPC',
    program: 'PTSD Treatment Program',
    lastName: 'Phillips',
    firstName: 'James',
    pid: '1005890',
    clientStatus: 'Active',
    dob: '04/18/1980',
    lastSeen: '12/18/2023',
    admittedDate: '09/25/2023',
    dischargedDate: '',
    treatmentPlan14Day: '12/05/2023',
    mdtp: 'Not yet',
    facility: 'Veterans Center',
    location: 'Therapy Suite 3',
    isIncomplete: true,
    riskLevel: 'High',
    nextAppointment: 'Wednesday 11:30 AM'
  },
  {
    id: '019',
    provider: 'Amanda Foster, LCSW',
    program: 'Eating Disorder Treatment',
    lastName: 'Cooper',
    firstName: 'Emma',
    pid: '1006001',
    clientStatus: 'Active',
    dob: '09/12/1995',
    lastSeen: '12/20/2023',
    admittedDate: '11/08/2023',
    dischargedDate: '',
    treatmentPlan14Day: '11/22/2023',
    mdtp: '12/15/2023',
    facility: 'Specialized Care Unit',
    location: 'ED Wing',
    isIncomplete: false,
    riskLevel: 'High',
    nextAppointment: 'Today 10:30 AM'
  },
  {
    id: '020',
    provider: 'Kevin Rodriguez, LCADC',
    program: 'Opioid Treatment Program (OTP)',
    lastName: 'Mitchell',
    firstName: 'Ryan',
    pid: '1006112',
    clientStatus: 'Active',
    dob: '07/03/1987',
    lastSeen: '12/19/2023',
    admittedDate: '08/14/2023',
    dischargedDate: '',
    treatmentPlan14Day: '08/28/2023',
    treatmentPlan14DayEncounter: '#E230828004',
    mdtp: '11/20/2023',
    mdtpEncounter: '#E231120001',
    facility: 'Addiction Treatment Center',
    location: 'MAT Clinic',
    isIncomplete: false,
    riskLevel: 'Medium',
    nextAppointment: 'Tomorrow 8:00 AM'
  },
  {
    id: '021',
    provider: 'Dr. Rebecca Stone, MD',
    program: 'Psychiatric Evaluation & Management',
    lastName: 'Hayes',
    firstName: 'Michael',
    pid: '1006223',
    clientStatus: 'Active',
    dob: '03/15/1978',
    lastSeen: '12/18/2023',
    admittedDate: '12/01/2023',
    dischargedDate: '',
    treatmentPlan14Day: 'Not yet',
    mdtp: 'Not yet',
    facility: 'Psychiatric Unit',
    location: 'Evaluation Room 2',
    isIncomplete: true,
    riskLevel: 'High',
    nextAppointment: 'Today 3:30 PM'
  },
  {
    id: '022',
    provider: 'Samantha Lee, LMFT',
    program: 'Dialectical Behavior Therapy (DBT)',
    lastName: 'Parker',
    firstName: 'Olivia',
    pid: '1006334',
    clientStatus: 'Active',
    dob: '11/28/1991',
    lastSeen: '12/17/2023',
    admittedDate: '10/12/2023',
    dischargedDate: '',
    treatmentPlan14Day: '10/26/2023',
    mdtp: '12/10/2023',
    facility: 'Outpatient Center',
    location: 'Group Room 3',
    isIncomplete: false,
    riskLevel: 'Medium',
    nextAppointment: 'Thursday 1:00 PM'
  },
  {
    id: '023',
    provider: 'Jonathan Wright, LPC',
    program: 'Anxiety & Depression Treatment',
    lastName: 'Bell',
    firstName: 'Nathan',
    pid: '1006445',
    clientStatus: 'Active',
    dob: '05/07/1984',
    lastSeen: '12/16/2023',
    admittedDate: '09/30/2023',
    dischargedDate: '',
    treatmentPlan14Day: '10/14/2023',
    mdtp: '12/01/2023',
    facility: 'Main Campus',
    location: 'Unit B',
    isIncomplete: false,
    riskLevel: 'Low',
    nextAppointment: 'Friday 2:30 PM'
  },
  {
    id: '024',
    provider: 'Dr. Maria Santos, PsyD',
    program: 'Neuropsychological Assessment',
    lastName: 'Reed',
    firstName: 'Isabella',
    pid: '1006556',
    clientStatus: 'Active',
    dob: '12/09/1999',
    lastSeen: '12/19/2023',
    admittedDate: '12/15/2023',
    dischargedDate: '',
    treatmentPlan14Day: 'Not yet',
    mdtp: 'Not yet',
    facility: 'Assessment Center',
    location: 'Testing Suite A',
    isIncomplete: true,
    riskLevel: 'Low',
    nextAppointment: 'Monday 9:00 AM'
  },
  {
    id: '025',
    provider: 'Timothy Johnson, LCADC',
    program: 'Alcohol Treatment Program',
    lastName: 'Morgan',
    firstName: 'Daniel',
    pid: '1006667',
    clientStatus: 'Active',
    dob: '08/22/1976',
    lastSeen: '12/20/2023',
    admittedDate: '11/05/2023',
    dischargedDate: '',
    treatmentPlan14Day: '11/19/2023',
    mdtp: '12/18/2023',
    facility: 'Rehabilitation Center',
    location: 'Floor 1',
    isIncomplete: false,
    riskLevel: 'Medium',
    nextAppointment: 'Today 4:30 PM'
  },
  {
    id: '026',
    provider: 'Grace Kim, LCSW',
    program: 'Bipolar Disorder Treatment',
    lastName: 'Rivera',
    firstName: 'Sofia',
    pid: '1006778',
    clientStatus: 'Active',
    dob: '01/14/1990',
    lastSeen: '12/18/2023',
    admittedDate: '07/28/2023',
    dischargedDate: '',
    treatmentPlan14Day: '08/11/2023',
    mdtp: '11/15/2023',
    facility: 'Mood Disorders Unit',
    location: 'Wing C',
    isIncomplete: false,
    riskLevel: 'High',
    nextAppointment: 'Tomorrow 11:30 AM'
  },
  {
    id: '027',
    provider: 'Dr. Alan Foster, MD',
    program: 'Schizophrenia Treatment Program',
    lastName: 'Cox',
    firstName: 'Alexander',
    pid: '1006889',
    clientStatus: 'Active',
    dob: '06/30/1982',
    lastSeen: '12/19/2023',
    admittedDate: '05/20/2023',
    dischargedDate: '',
    treatmentPlan14Day: '06/03/2023',
    mdtp: '09/18/2023',
    facility: 'Psychiatric Unit',
    location: 'Secure Ward',
    isIncomplete: false,
    riskLevel: 'High',
    nextAppointment: 'Wednesday 10:00 AM'
  },
  {
    id: '028',
    provider: 'Melissa Carter, LMFT',
    program: 'Child & Adolescent Therapy',
    lastName: 'Ward',
    firstName: 'Ethan',
    pid: '1006990',
    clientStatus: 'Active',
    dob: '03/25/2008',
    lastSeen: '12/17/2023',
    admittedDate: '11/12/2023',
    dischargedDate: '',
    treatmentPlan14Day: 'Not yet',
    mdtp: '12/05/2023',
    facility: 'Youth Center',
    location: 'Adolescent Wing',
    isIncomplete: true,
    riskLevel: 'Medium',
    nextAppointment: 'Thursday 3:00 PM'
  },
  {
    id: '029',
    provider: 'Brian Murphy, LPC',
    program: 'Anger Management Program',
    lastName: 'Torres',
    firstName: 'Gabriel',
    pid: '1007001',
    clientStatus: 'Active',
    dob: '10/11/1985',
    lastSeen: '12/20/2023',
    admittedDate: '10/25/2023',
    dischargedDate: '',
    treatmentPlan14Day: '11/08/2023',
    mdtp: '12/20/2023',
    facility: 'Behavioral Health Center',
    location: 'Group Room 2',
    isIncomplete: false,
    riskLevel: 'Medium',
    nextAppointment: 'Friday 10:00 AM'
  },
  {
    id: '030',
    provider: 'Dr. Linda Chen, PNP',
    program: 'Geriatric Psychiatry',
    lastName: 'Peterson',
    firstName: 'Dorothy',
    pid: '1007112',
    clientStatus: 'Active',
    dob: '02/18/1938',
    lastSeen: '12/19/2023',
    admittedDate: '09/08/2023',
    dischargedDate: '',
    treatmentPlan14Day: '09/22/2023',
    mdtp: '12/01/2023',
    facility: 'Senior Care Unit',
    location: 'Memory Care',
    isIncomplete: false,
    riskLevel: 'High',
    nextAppointment: 'Monday 2:00 PM'
  },
  {
    id: '031',
    provider: 'Ashley Brooks, BCBA',
    program: 'Autism Spectrum Disorder Support',
    lastName: 'Gray',
    firstName: 'Lucas',
    pid: '1007223',
    clientStatus: 'Active',
    dob: '07/14/2010',
    lastSeen: '12/18/2023',
    admittedDate: '08/30/2023',
    dischargedDate: '',
    treatmentPlan14Day: '09/13/2023',
    mdtp: '11/28/2023',
    facility: 'Developmental Center',
    location: 'ASD Unit',
    isIncomplete: false,
    riskLevel: 'Low',
    nextAppointment: 'Tuesday 1:30 PM'
  },
  {
    id: '032',
    provider: 'Victor Ramirez, LCSW',
    program: 'Homeless Outreach Program',
    lastName: 'Stewart',
    firstName: 'Marcus',
    pid: '1007334',
    clientStatus: 'Active',
    dob: '04/02/1973',
    lastSeen: '12/16/2023',
    admittedDate: '11/20/2023',
    dischargedDate: '',
    treatmentPlan14Day: 'Not yet',
    mdtp: 'Not yet',
    facility: 'Community Outreach',
    location: 'Mobile Unit',
    isIncomplete: true,
    riskLevel: 'High',
    nextAppointment: 'Today 1:00 PM'
  },
  {
    id: '033',
    provider: 'Dr. Sarah Mitchell, MD',
    program: 'Electroconvulsive Therapy (ECT)',
    lastName: 'Powell',
    firstName: 'Catherine',
    pid: '1007445',
    clientStatus: 'Active',
    dob: '09/05/1965',
    lastSeen: '12/20/2023',
    admittedDate: '11/28/2023',
    dischargedDate: '',
    treatmentPlan14Day: '12/12/2023',
    mdtp: '12/19/2023',
    facility: 'Inpatient Unit',
    location: 'ECT Suite',
    isIncomplete: false,
    riskLevel: 'High',
    nextAppointment: 'Tomorrow 7:00 AM'
  },
  {
    id: '034',
    provider: 'Hannah Price, LPC',
    program: 'Grief & Loss Counseling',
    lastName: 'Hughes',
    firstName: 'Rachel',
    pid: '1007556',
    clientStatus: 'Active',
    dob: '12/31/1983',
    lastSeen: '12/17/2023',
    admittedDate: '10/15/2023',
    dischargedDate: '',
    treatmentPlan14Day: '10/29/2023',
    mdtp: '12/12/2023',
    facility: 'Outpatient Center',
    location: 'Building A',
    isIncomplete: false,
    riskLevel: 'Medium',
    nextAppointment: 'Wednesday 4:00 PM'
  },
  {
    id: '035',
    provider: 'Carlos Mendez, LCADC',
    program: 'Cocaine Addiction Treatment',
    lastName: 'Fisher',
    firstName: 'Anthony',
    pid: '1007667',
    clientStatus: 'Discharged',
    dob: '05/19/1989',
    lastSeen: '12/01/2023',
    admittedDate: '06/12/2023',
    dischargedDate: '12/01/2023',
    treatmentPlan14Day: '06/26/2023',
    mdtp: '09/15/2023',
    facility: 'Addiction Treatment Center',
    location: 'Intensive Unit',
    isIncomplete: false,
    riskLevel: 'Medium',
    nextAppointment: ''
  },
  {
    id: '036',
    provider: 'Dr. Jennifer Walsh, PsyD',
    program: 'Personality Disorder Treatment',
    lastName: 'Russell',
    firstName: 'Samantha',
    pid: '1007778',
    clientStatus: 'Active',
    dob: '08/08/1986',
    lastSeen: '12/19/2023',
    admittedDate: '07/15/2023',
    dischargedDate: '',
    treatmentPlan14Day: '07/29/2023',
    mdtp: '10/20/2023',
    facility: 'Personality Disorders Unit',
    location: 'Therapy Wing',
    isIncomplete: false,
    riskLevel: 'High',
    nextAppointment: 'Thursday 2:00 PM'
  },
  {
    id: '037',
    provider: 'Monica Taylor, LMFT',
    program: 'Sexual Trauma Recovery',
    lastName: 'Bennett',
    firstName: 'Nicole',
    pid: '1007889',
    clientStatus: 'Active',
    dob: '11/16/1992',
    lastSeen: '12/18/2023',
    admittedDate: '09/18/2023',
    dischargedDate: '',
    treatmentPlan14Day: '10/02/2023',
    mdtp: '12/15/2023',
    facility: 'Trauma Center',
    location: 'Safe Space Unit',
    isIncomplete: false,
    riskLevel: 'High',
    nextAppointment: 'Friday 11:00 AM'
  },
  {
    id: '038',
    provider: 'Robert Kim, LPC',
    program: 'Obsessive-Compulsive Disorder (OCD)',
    lastName: 'Wood',
    firstName: 'Jonathan',
    pid: '1007990',
    clientStatus: 'Active',
    dob: '01/23/1994',
    lastSeen: '12/20/2023',
    admittedDate: '11/01/2023',
    dischargedDate: '',
    treatmentPlan14Day: '11/15/2023',
    mdtp: 'Not yet',
    facility: 'Anxiety Disorders Center',
    location: 'OCD Clinic',
    isIncomplete: true,
    riskLevel: 'Medium',
    nextAppointment: 'Monday 3:30 PM'
  },
  {
    id: '039',
    provider: 'Dr. Patricia Adams, MD',
    program: 'Transcranial Magnetic Stimulation (TMS)',
    lastName: 'Barnes',
    firstName: 'William',
    pid: '1008001',
    clientStatus: 'Active',
    dob: '06/12/1971',
    lastSeen: '12/19/2023',
    admittedDate: '10/20/2023',
    dischargedDate: '',
    treatmentPlan14Day: '11/03/2023',
    mdtp: '12/18/2023',
    facility: 'Neuromodulation Center',
    location: 'TMS Suite',
    isIncomplete: false,
    riskLevel: 'Medium',
    nextAppointment: 'Tuesday 9:30 AM'
  },
  {
    id: '040',
    provider: 'Elizabeth Moore, LCSW',
    program: 'Domestic Violence Recovery',
    lastName: 'Henderson',
    firstName: 'Amanda',
    pid: '1008112',
    clientStatus: 'Active',
    dob: '04/27/1988',
    lastSeen: '12/17/2023',
    admittedDate: '08/25/2023',
    dischargedDate: '',
    treatmentPlan14Day: '09/08/2023',
    mdtp: '11/30/2023',
    facility: 'Women\'s Center',
    location: 'Crisis Support',
    isIncomplete: false,
    riskLevel: 'High',
    nextAppointment: 'Wednesday 1:30 PM'
  },
  {
    id: '041',
    provider: 'James Cooper, LCADC',
    program: 'Methamphetamine Recovery Program',
    lastName: 'Collins',
    firstName: 'Tyler',
    pid: '1008223',
    clientStatus: 'Discharged',
    dob: '02/14/1990',
    lastSeen: '11/25/2023',
    admittedDate: '04/10/2023',
    dischargedDate: '11/25/2023',
    treatmentPlan14Day: '04/24/2023',
    mdtp: '07/20/2023',
    facility: 'Addiction Treatment Center',
    location: 'Recovery Unit',
    isIncomplete: false,
    riskLevel: 'Low',
    nextAppointment: ''
  },
  {
    id: '042',
    provider: 'Dr. Michael Torres, PNP',
    program: 'Attention Deficit Hyperactivity Disorder (ADHD)',
    lastName: 'Evans',
    firstName: 'Madison',
    pid: '1008334',
    clientStatus: 'Active',
    dob: '10/03/2005',
    lastSeen: '12/20/2023',
    admittedDate: '09/12/2023',
    dischargedDate: '',
    treatmentPlan14Day: '09/26/2023',
    mdtp: '12/10/2023',
    facility: 'Youth Center',
    location: 'ADHD Clinic',
    isIncomplete: false,
    riskLevel: 'Low',
    nextAppointment: 'Thursday 10:30 AM'
  },
  {
    id: '043',
    provider: 'Sandra Williams, LMFT',
    program: 'Perinatal Mental Health',
    lastName: 'Murphy',
    firstName: 'Jessica',
    pid: '1008445',
    clientStatus: 'Active',
    dob: '07/21/1993',
    lastSeen: '12/18/2023',
    admittedDate: '11/30/2023',
    dischargedDate: '',
    treatmentPlan14Day: 'Not yet',
    mdtp: 'Not yet',
    facility: 'Women\'s Health Center',
    location: 'Maternal Unit',
    isIncomplete: true,
    riskLevel: 'Medium',
    nextAppointment: 'Today 2:30 PM'
  },
  {
    id: '044',
    provider: 'Derek Johnson, LPC',
    program: 'Sleep Disorders & Mental Health',
    lastName: 'Rogers',
    firstName: 'Christopher',
    pid: '1008556',
    clientStatus: 'Active',
    dob: '12/07/1979',
    lastSeen: '12/19/2023',
    admittedDate: '10/08/2023',
    dischargedDate: '',
    treatmentPlan14Day: '10/22/2023',
    mdtp: '12/15/2023',
    facility: 'Sleep Medicine Center',
    location: 'Behavioral Sleep Unit',
    isIncomplete: false,
    riskLevel: 'Low',
    nextAppointment: 'Friday 1:00 PM'
  },
  {
    id: '045',
    provider: 'Dr. Angela Davis, MD',
    program: 'Treatment-Resistant Depression',
    lastName: 'Cook',
    firstName: 'Robert',
    pid: '1008667',
    clientStatus: 'Active',
    dob: '03/29/1968',
    lastSeen: '12/20/2023',
    admittedDate: '08/15/2023',
    dischargedDate: '',
    treatmentPlan14Day: '08/29/2023',
    mdtp: '11/25/2023',
    facility: 'Mood Disorders Unit',
    location: 'Treatment Resistant',
    isIncomplete: false,
    riskLevel: 'High',
    nextAppointment: 'Monday 1:30 PM'
  }
];

// Helper functions for styling
const getStatusBadgeStyles = (status: string) => {
  switch (status) {
    case 'Active':
      return "bg-green-50 text-green-700 border-green-200";
    case 'Discharged':
      return "bg-gray-50 text-gray-700 border-gray-200";
    case 'On Hold':
      return "bg-yellow-50 text-yellow-700 border-yellow-200";
    default:
      return "bg-blue-50 text-blue-700 border-blue-200";
  }
};

const getRiskBadgeStyles = (risk: string) => {
  switch (risk) {
    case 'High':
      return "bg-red-50 text-red-700 border-red-200";
    case 'Medium':
      return "bg-yellow-50 text-yellow-700 border-yellow-200";
    case 'Low':
      return "bg-green-50 text-green-700 border-green-200";
    default:
      return "bg-gray-50 text-gray-700 border-gray-200";
  }
};

// Category tabs for filtering
const CATEGORIES = [
  { id: 'admitted', label: 'Admitted', icon: <CheckCircleIcon /> },
  { id: 'discharged', label: 'Discharged', icon: <ChartBarIcon /> }
];

// Mobile Client Card Component
const ClientCard: React.FC<{ client: Client; onSelect: (client: Client) => void }> = ({ client, onSelect }) => {
  return (
    <div 
      className="bg-white rounded-lg border border-gray-100 p-4 mb-3 shadow-sm hover:shadow-md transition-shadow cursor-pointer"
      onClick={() => onSelect(client)}
    >
      {/* Header with name and status */}
      <div className="flex justify-between items-start mb-3">
        <div>
          <h3 className="text-sm font-semibold text-gray-900">{client.firstName} {client.lastName}</h3>
          <p className="text-xs text-gray-500">PID: {client.pid}</p>
        </div>
        <div className="flex gap-2">
          <Badge variant="outline" className={cn('text-xs h-6', getStatusBadgeStyles(client.clientStatus))}>
            {client.clientStatus}
          </Badge>
        </div>
      </div>
      
      {/* Program and Provider */}
      <div className="mb-3">
        <span className="text-xs font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded">
          {client.program}
        </span>
        <p className="text-xs text-gray-600 mt-1">Provider: {client.provider}</p>
      </div>
      
      {/* Key Information Grid */}
      <div className="grid grid-cols-2 gap-2 text-xs text-gray-600 mb-3">
        <div>
          <span className="font-medium">DOB:</span><br/>
          {client.dob}
        </div>
        <div>
          <span className="font-medium">Admitted:</span><br/>
          {client.admittedDate}
        </div>
        <div>
          <span className="font-medium">Discharged:</span><br/>
          {client.dischargedDate || 'N/A'}
        </div>
        <div>
          <span className="font-medium">Last Seen:</span><br/>
          {client.lastSeen}
        </div>
        <div>
          <span className="font-medium">Next Appt:</span><br/>
          {client.nextAppointment || 'None scheduled'}
        </div>
        <div>
          <span className="font-medium">Location:</span><br/>
          {client.facility}
        </div>
      </div>
      
      {/* Treatment Plans */}
      <div className="mb-3 p-2 bg-gray-50 rounded">
        <div className="text-xs font-medium text-gray-700 mb-1">Treatment Plans:</div>
        <div className="space-y-1">
          {/* 14-Day Treatment Plan */}
          <div className="flex items-center gap-1 text-xs">
            {client.treatmentPlan14Day === 'Not yet' ? 
              <ExclamationTriangleIcon className="w-3 h-3 text-amber-600" /> : 
              <CheckCircleIcon className="w-3 h-3 text-green-600" />
            }
            <div className="flex-1">
              <span>14-Day: {client.treatmentPlan14Day}</span>
              {client.treatmentPlan14DayEncounter && (
                <div className="text-blue-600 font-mono text-[10px]">{client.treatmentPlan14DayEncounter}</div>
              )}
            </div>
            {client.treatmentPlan14Day !== 'Not yet' && (
              <TooltipRoot>
                <TooltipTrigger asChild>
                  <button
                    className="text-blue-600 hover:text-blue-900 p-1 rounded hover:bg-blue-50"
                    onClick={(e) => {
                      e.stopPropagation();
                      console.log('View 14-Day Encounter Form for:', client.firstName, client.lastName, client.treatmentPlan14DayEncounter);
                    }}
                  >
                    <DocumentDuplicateIcon className="w-3.5 h-3.5" />
                  </button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>View Encounter Form</p>
                </TooltipContent>
              </TooltipRoot>
            )}
          </div>
          
          {/* MDTP - Multidisciplinary Treatment Plan */}
          <div className="flex items-center gap-1 text-xs">
            {client.mdtp === 'Not yet' ? 
              <ExclamationTriangleIcon className="w-3 h-3 text-amber-600" /> : 
              <CheckCircleIcon className="w-3 h-3 text-green-600" />
            }
            <div className="flex-1">
              <span>MDTP: {client.mdtp}</span>
              {client.mdtpEncounter && (
                <div className="text-blue-600 font-mono text-[10px]">{client.mdtpEncounter}</div>
              )}
            </div>
            {client.mdtp !== 'Not yet' && (
              <TooltipRoot>
                <TooltipTrigger asChild>
                  <button
                    className="text-purple-600 hover:text-purple-900 p-1 rounded hover:bg-purple-50"
                    onClick={(e) => {
                      e.stopPropagation();
                      console.log('View MDTP Form for:', client.firstName, client.lastName, client.mdtpEncounter);
                    }}
                  >
                    <ClipboardDocumentListIcon className="w-3.5 h-3.5" />
                  </button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>View MDTP Form</p>
                </TooltipContent>
              </TooltipRoot>
            )}
          </div>
        </div>
      </div>
      
      {/* Quick Actions */}
      <div className="flex gap-2 pt-3 border-t border-gray-100">
        <Button variant="outline" size="sm" className="text-xs flex-1">
          <EyeIcon className="w-3 h-3 mr-1" />
          Chart
        </Button>
        <Button variant="outline" size="sm" className="text-xs flex-1">
          <DocumentTextIcon className="w-3 h-3 mr-1" />
          Plan
        </Button>
        <Button variant="outline" size="sm" className="text-xs flex-1">
          <CalendarIcon className="w-3 h-3 mr-1" />
          Schedule
        </Button>
      </div>
    </div>
  );
};

const StaffDashboard: React.FC = () => {
  // Modern state management
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('admitted');
  const [activeFilter, setActiveFilter] = useState('all');
  const [selectedClinician, setSelectedClinician] = useState<string[]>([]);
  const [selectedFacility, setSelectedFacility] = useState<string[]>([]);
  const [selectedLocation, setSelectedLocation] = useState<string[]>([]);
  const [selectedDueDateBy, setSelectedDueDateBy] = useState<string[]>([]);
  const [showIncompleteDetails, setShowIncompleteDetails] = useState(true);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const isMobile = useMediaQuery('(max-width: 640px)');

  // Column customization state
  const [columnConfigs, setColumnConfigs] = useState<ColumnConfig[]>([
    { id: 'client', label: 'Client', visible: true, category: 'basic', required: true },
    { id: 'provider', label: 'Provider', visible: true, category: 'basic' },
    { id: 'program', label: 'Program', visible: true, category: 'basic' },
    { id: 'lastName', label: 'Last Name', visible: false, category: 'basic' },
    { id: 'firstName', label: 'First Name', visible: false, category: 'basic' },
    { id: 'pid', label: 'PID', visible: false, category: 'basic' },
    { id: 'clientStatus', label: 'Person Status', visible: true, category: 'basic' },
    { id: 'dob', label: 'DOB', visible: true, category: 'dates' },
    { id: 'levelOfCare', label: 'Level of Care', visible: false, category: 'additional' },
    { id: 'lastSeen', label: 'Last Seen', visible: true, category: 'dates' },
    { id: 'dateLastSeenByMe', label: 'Date last seen by me', visible: false, category: 'dates' },
    { id: 'nextAppointment', label: 'Next Appointment', visible: true, category: 'appointments' },
    { id: 'individualSession', label: 'Individual Session', visible: false, category: 'appointments' },
    { id: 'groupSession', label: 'Group Session', visible: false, category: 'appointments' },
    { id: 'cancelNoShow', label: 'Cancel/NoShow', visible: false, category: 'appointments' },
    { id: 'admittedDate', label: 'Admit Date', visible: true, category: 'dates' },
    { id: 'tentativeDischargeDate', label: 'Tentative Discharge Date', visible: false, category: 'dates' },
    { id: 'dischargedDate', label: 'Discharge Date', visible: true, category: 'dates' },
    { id: 'erVisitsInfo', label: 'ER Visits Information', visible: false, category: 'additional' },
    { id: 'admitLocation', label: 'Admit Location', visible: false, category: 'additional' },
    { id: 'treatmentPlans', label: '14-Day Treatment Plan', visible: true, category: 'forms' },
    { id: 'mdtpPlan', label: 'Multidisciplinary Treatment Plan (MDTP)', visible: true, category: 'forms' },
    { id: 'location', label: 'Location', visible: true, category: 'basic' },
    { id: 'actions', label: 'Actions', visible: true, category: 'basic', required: true }
  ]);

  // Get unique clinicians for dropdown
  const clinicianOptions = useMemo((): ComboboxOption[] => {
    const clinicians = [...new Set(mockClients.map(client => client.provider))];
    return clinicians.sort().map(clinician => ({
      value: clinician,
      label: clinician,
      type: 'staff' as const
    }));
  }, []);

  // Get unique facilities for dropdown
  const facilityOptions = useMemo((): ComboboxOption[] => {
    const facilities = [...new Set(mockClients.map(client => client.facility))];
    return facilities.sort().map(facility => ({
      value: facility,
      label: facility
    }));
  }, []);

  // Get unique locations for dropdown
  const locationOptions = useMemo((): ComboboxOption[] => {
    const locations = [...new Set(mockClients.map(client => client.location))];
    return locations.sort().map(location => ({
      value: location,
      label: location
    }));
  }, []);

  // Due date options for dropdown
  const dueDateOptions = useMemo((): ComboboxOption[] => {
    return [
      { value: 'day', label: 'Due Today' },
      { value: 'week', label: 'Due This Week' },
      { value: 'month', label: 'Due This Month' },
      { value: 'year', label: 'Due This Year' }
    ];
  }, []);

  // Smart filtering logic
  const filteredClients = useMemo(() => {
    return mockClients.filter(client => {
      // Search functionality
      const matchesSearch = searchQuery === '' || 
        client.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        client.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        client.pid.includes(searchQuery) ||
        client.program.toLowerCase().includes(searchQuery.toLowerCase()) ||
        client.provider.toLowerCase().includes(searchQuery.toLowerCase());
      
      // Clinician filtering
      const matchesClinician = selectedClinician.length === 0 || selectedClinician.includes(client.provider);
      
      // Facility filtering
      const matchesFacility = selectedFacility.length === 0 || selectedFacility.includes(client.facility);
      
      // Location filtering
      const matchesLocation = selectedLocation.length === 0 || selectedLocation.includes(client.location);
      
      // Due Date filtering
      const matchesDueDate = (() => {
        if (selectedDueDateBy.length === 0) return true;
        
        const now = new Date();
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        
        // Check if client has appointments or treatment plan dates that fall within the selected period
        const hasAppointmentToday = client.nextAppointment.includes('Today');
        const hasAppointmentTomorrow = client.nextAppointment.includes('Tomorrow');
        
        return selectedDueDateBy.some(dueDateFilter => {
          switch (dueDateFilter) {
            case 'day':
              return hasAppointmentToday;
            case 'week':
              return hasAppointmentToday || hasAppointmentTomorrow || client.nextAppointment.includes('Monday') || 
                     client.nextAppointment.includes('Tuesday') || client.nextAppointment.includes('Wednesday') || 
                     client.nextAppointment.includes('Thursday') || client.nextAppointment.includes('Friday');
            case 'month':
              return client.nextAppointment !== '' || client.treatmentPlan14Day === 'Not yet' || client.mdtp === 'Not yet';
            case 'year':
              return true; // Show all clients for yearly view
            default:
              return true;
          }
        });
      })();
      
      // Incomplete details filtering
      const hasIncompleteDetails = client.isIncomplete || client.treatmentPlan14Day === 'Not yet' || client.mdtp === 'Not yet';
      const matchesIncompleteFilter = !showIncompleteDetails || hasIncompleteDetails;
      
      // Category filtering
      let matchesCategory = true;
      switch (activeCategory) {
        case 'admitted':
          matchesCategory = client.clientStatus === 'Active';
          break;
        case 'discharged':
          matchesCategory = client.clientStatus === 'Discharged';
          break;
        case 'high-risk':
          matchesCategory = client.riskLevel === 'High';
          break;
        case 'incomplete':
          matchesCategory = client.isIncomplete || client.treatmentPlan14Day === 'Not yet' || client.mdtp === 'Not yet';
          break;
        case 'today':
          matchesCategory = client.nextAppointment.includes('Today');
          break;
        default:
          matchesCategory = true;
      }
      
      // Additional filter
      let matchesFilter = true;
      if (activeFilter !== 'all') {
        switch (activeFilter) {
          case 'urgent':
            matchesFilter = client.riskLevel === 'High' || client.nextAppointment.includes('Today');
            break;
          case 'overdue':
            matchesFilter = client.treatmentPlan14Day === 'Not yet' || client.mdtp === 'Not yet';
            break;
          default:
            matchesFilter = true;
        }
      }
      
      return matchesSearch && matchesClinician && matchesFacility && matchesLocation && matchesDueDate && matchesIncompleteFilter && matchesCategory && matchesFilter;
    });
  }, [searchQuery, selectedClinician, selectedFacility, selectedLocation, selectedDueDateBy, showIncompleteDetails, activeCategory, activeFilter]);

  // Calculate metrics
  const metrics = useMemo(() => {
    const total = mockClients.length;
    const admitted = mockClients.filter(c => c.clientStatus === 'Active').length;
    const discharged = mockClients.filter(c => c.clientStatus === 'Discharged').length;
    const highRisk = mockClients.filter(c => c.riskLevel === 'High').length;
    const todayAppts = mockClients.filter(c => c.nextAppointment.includes('Today')).length;
    
    return { total, admitted, discharged, highRisk, todayAppts };
  }, []);

  // Handle client selection
  const handleClientSelect = (client: Client) => {
    setSelectedClient(client);
    console.log('Selected client:', client);
  };

  // Handle refresh
  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
      console.log('Data refreshed');
    }, 2000);
  };

  // Simulate initial data loading
  React.useEffect(() => {
    const loadData = () => {
      setTimeout(() => {
        setIsLoading(false);
        console.log('Initial data loaded');
      }, 1500);
    };
    
    loadData();
  }, []);

  // AG Grid configuration
  const gridOptions: GridOptions = {
    suppressCellFocus: true,
    animateRows: true,
    pagination: true,
    paginationPageSize: 15,
    paginationPageSizeSelector: [10, 15, 25, 50],
    domLayout: 'normal',
    rowHeight: 52,
    headerHeight: 44,
    onRowClicked: (params: any) => handleClientSelect(params.data),
    rowSelection: 'multiple',
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

  // All available column definitions
  const allColumnDefs = [
    {
      headerName: 'Client',
      field: 'name',
      minWidth: 180,
      pinned: 'left' as const,
      cellRenderer: (params: any) => (
        <div className="flex items-center py-2">
          <div className="flex-1">
            <div className="text-sm font-semibold text-gray-900">
              {params.data.firstName} {params.data.lastName}
            </div>
            <div className="text-xs text-gray-500">PID: {params.data.pid}</div>
          </div>
        </div>
      )
    },
    {
      headerName: 'Program',
      field: 'program',
      minWidth: 200,
      cellRenderer: (params: any) => (
        <div className="py-2">
          <span className="text-sm font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded">
            {params.data.program}
          </span>
        </div>
      )
    },
    {
      headerName: 'Provider',
      field: 'provider',
      minWidth: 160,
      cellRenderer: (params: any) => (
        <div className="py-2">
          <div className="text-sm text-gray-700 font-medium">{params.data.provider}</div>
        </div>
      )
    },
    {
      headerName: 'Client Status',
      field: 'clientStatus',
      minWidth: 120,
      cellRenderer: (params: any) => (
        <div className="py-2">
          <Badge variant="outline" className={cn('text-xs h-5 w-fit', getStatusBadgeStyles(params.data.clientStatus))}>
            {params.data.clientStatus}
          </Badge>
        </div>
      )
    },
    {
      headerName: 'DOB',
      field: 'dob',
      minWidth: 100,
      cellRenderer: (params: any) => (
        <div className="text-sm text-gray-700 py-2">{params.data.dob}</div>
      )
    },
    {
      headerName: 'Admitted On',
      field: 'admittedDate',
      minWidth: 120,
      cellRenderer: (params: any) => (
        <div className="text-sm text-gray-700 py-2">{params.data.admittedDate}</div>
      )
    },
    {
      headerName: 'Discharged On',
      field: 'dischargedDate',
      minWidth: 130,
      cellRenderer: (params: any) => (
        <div className="text-sm text-gray-700 py-2">
          {params.data.dischargedDate || '-'}
        </div>
      )
    },
    {
      headerName: 'Last Seen',
      field: 'lastSeen',
      minWidth: 120,
      cellRenderer: (params: any) => (
        <div className="text-sm text-gray-700 py-2">{params.data.lastSeen}</div>
      )
    },
    {
      headerName: 'Next Appointment',
      field: 'nextAppointment',
      minWidth: 140,
      cellRenderer: (params: any) => {
        const isToday = params.data.nextAppointment.includes('Today');
        return (
          <div className={cn(
            'text-sm py-2 flex items-center gap-1',
            isToday ? 'text-orange-600 font-medium' : 'text-gray-700'
          )}>
            {isToday && <ClockIcon className="w-4 h-4" />}
            {params.data.nextAppointment || 'None scheduled'}
          </div>
        );
      }
    },
    {
      headerName: 'Treatment Plans',
      field: 'plans',
      minWidth: 240,
      cellRenderer: (params: any) => {
        const plan14Incomplete = params.data.treatmentPlan14Day === 'Not yet';
        const mdtpIncomplete = params.data.mdtp === 'Not yet';
        
        return (
          <div className="py-2 space-y-1">
            {/* 14-Day Treatment Plan */}
            <div className={cn(
              'text-xs flex items-center gap-1',
              plan14Incomplete ? 'text-amber-600' : 'text-green-600'
            )}>
              {plan14Incomplete ? <ExclamationTriangleIcon className="w-3 h-3" /> : <CheckCircleIcon className="w-3 h-3" />}
              <div className="flex flex-col flex-1">
                <span>14-Day: {params.data.treatmentPlan14Day}</span>
                {params.data.treatmentPlan14DayEncounter && (
                  <span className="text-blue-600 font-mono text-[10px]">
                    {params.data.treatmentPlan14DayEncounter}
                  </span>
                )}
              </div>
              {!plan14Incomplete && (
                <TooltipRoot>
                  <TooltipTrigger asChild>
                    <button
                      className="text-blue-600 hover:text-blue-900 p-1 rounded hover:bg-blue-50"
                      onClick={(e) => {
                        e.stopPropagation();
                        console.log('View 14-Day Encounter Form for:', params.data.firstName, params.data.lastName, params.data.treatmentPlan14DayEncounter);
                      }}
                    >
                      <DocumentDuplicateIcon className="w-3.5 h-3.5" />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>View Encounter Form</p>
                  </TooltipContent>
                </TooltipRoot>
              )}
            </div>
            
            {/* MDTP - Multidisciplinary Treatment Plan */}
            <div className={cn(
              'text-xs flex items-center gap-1',
              mdtpIncomplete ? 'text-amber-600' : 'text-green-600'
            )}>
              {mdtpIncomplete ? <ExclamationTriangleIcon className="w-3 h-3" /> : <CheckCircleIcon className="w-3 h-3" />}
              <div className="flex flex-col flex-1">
                <span>MDTP: {params.data.mdtp}</span>
                {params.data.mdtpEncounter && (
                  <span className="text-blue-600 font-mono text-[10px]">
                    {params.data.mdtpEncounter}
                  </span>
                )}
              </div>
              {!mdtpIncomplete && (
                <TooltipRoot>
                  <TooltipTrigger asChild>
                    <button
                      className="text-purple-600 hover:text-purple-900 p-1 rounded hover:bg-purple-50"
                      onClick={(e) => {
                        e.stopPropagation();
                        console.log('View MDTP Form for:', params.data.firstName, params.data.lastName, params.data.mdtpEncounter);
                      }}
                    >
                      <ClipboardDocumentListIcon className="w-3.5 h-3.5" />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>View MDTP Form</p>
                  </TooltipContent>
                </TooltipRoot>
              )}
            </div>
          </div>
        );
      }
    },
    {
      headerName: 'Location',
      field: 'location',
      minWidth: 140,
      cellRenderer: (params: any) => (
        <div className="py-2">
          <div className="text-sm text-gray-700">{params.data.facility}</div>
          <div className="text-xs text-gray-500">{params.data.location}</div>
        </div>
      )
    },
    {
      headerName: 'Last Name',
      field: 'lastName',
      minWidth: 120,
      cellRenderer: (params: any) => (
        <div className="text-sm text-gray-700 py-2">{params.data.lastName}</div>
      )
    },
    {
      headerName: 'First Name',
      field: 'firstName',
      minWidth: 120,
      cellRenderer: (params: any) => (
        <div className="text-sm text-gray-700 py-2">{params.data.firstName}</div>
      )
    },
    {
      headerName: 'PID',
      field: 'pid',
      minWidth: 100,
      cellRenderer: (params: any) => (
        <div className="text-sm text-gray-700 py-2 font-mono">{params.data.pid}</div>
      )
    },
    {
      headerName: 'Level of Care',
      field: 'levelOfCare',
      minWidth: 140,
      cellRenderer: (params: any) => (
        <div className="text-sm text-gray-700 py-2">{params.data.levelOfCare || '-'}</div>
      )
    },
    {
      headerName: 'Date last seen by me',
      field: 'dateLastSeenByMe',
      minWidth: 160,
      cellRenderer: (params: any) => (
        <div className="text-sm text-gray-700 py-2">{params.data.dateLastSeenByMe || '-'}</div>
      )
    },
    {
      headerName: 'Individual Session',
      field: 'individualSession',
      minWidth: 140,
      cellRenderer: (params: any) => (
        <div className="text-sm text-gray-700 py-2">{params.data.individualSession || '-'}</div>
      )
    },
    {
      headerName: 'Group Session',
      field: 'groupSession',
      minWidth: 130,
      cellRenderer: (params: any) => (
        <div className="text-sm text-gray-700 py-2">{params.data.groupSession || '-'}</div>
      )
    },
    {
      headerName: 'Cancel/NoShow',
      field: 'cancelNoShow',
      minWidth: 120,
      cellRenderer: (params: any) => (
        <div className="text-sm text-gray-700 py-2">{params.data.cancelNoShow || '-'}</div>
      )
    },
    {
      headerName: 'Tentative Discharge Date',
      field: 'tentativeDischargeDate',
      minWidth: 180,
      cellRenderer: (params: any) => (
        <div className="text-sm text-gray-700 py-2">{params.data.tentativeDischargeDate || '-'}</div>
      )
    },
    {
      headerName: 'ER Visits Information',
      field: 'erVisitsInfo',
      minWidth: 160,
      cellRenderer: (params: any) => (
        <div className="text-sm text-gray-700 py-2">{params.data.erVisitsInfo || '-'}</div>
      )
    },
    {
      headerName: 'Admit Location',
      field: 'admitLocation',
      minWidth: 140,
      cellRenderer: (params: any) => (
        <div className="text-sm text-gray-700 py-2">{params.data.admitLocation || '-'}</div>
      )
    },
    {
      headerName: 'Actions',
      field: 'actions',
      minWidth: 140,
      filter: false,
      menuTabs: [] as ColumnMenuTab[],
      suppressMenu: true,
      resizable: false,
      cellRenderer: (params: any) => (
        <div className="flex items-center justify-center gap-1 h-full">
          <TooltipRoot>
            <TooltipTrigger asChild>
              <button 
                className="text-blue-600 hover:text-blue-900 p-1.5 rounded-lg hover:bg-blue-50"
                onClick={(e) => {
                  e.stopPropagation();
                  console.log('View chart for:', params.data.firstName, params.data.lastName);
                }}
              >
                <EyeIcon className="w-4 h-4" />
              </button>
            </TooltipTrigger>
            <TooltipContent>
              <p>View Chart</p>
            </TooltipContent>
          </TooltipRoot>
          
          <TooltipRoot>
            <TooltipTrigger asChild>
              <button 
                className="text-green-600 hover:text-green-900 p-1.5 rounded-lg hover:bg-green-50"
                onClick={(e) => {
                  e.stopPropagation();
                  console.log('View treatment plan for:', params.data.firstName, params.data.lastName);
                }}
              >
                <DocumentTextIcon className="w-4 h-4" />
              </button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Treatment Plan</p>
            </TooltipContent>
          </TooltipRoot>
          
          <TooltipRoot>
            <TooltipTrigger asChild>
              <button 
                className="text-purple-600 hover:text-purple-900 p-1.5 rounded-lg hover:bg-purple-50"
                onClick={(e) => {
                  e.stopPropagation();
                  console.log('Schedule appointment for:', params.data.firstName, params.data.lastName);
                }}
              >
                <CalendarIcon className="w-4 h-4" />
              </button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Schedule Appointment</p>
            </TooltipContent>
          </TooltipRoot>
        </div>
      )
    }
  ];

  // Filter columns based on visibility settings
  const columnDefs = allColumnDefs.filter(col => {
    // Map column field names to config IDs
    const fieldToConfigMap: Record<string, string> = {
      'name': 'client',
      'provider': 'provider',
      'program': 'program',
      'lastName': 'lastName',
      'firstName': 'firstName',
      'pid': 'pid',
      'clientStatus': 'clientStatus',
      'dob': 'dob',
      'levelOfCare': 'levelOfCare',
      'lastSeen': 'lastSeen',
      'dateLastSeenByMe': 'dateLastSeenByMe',
      'nextAppointment': 'nextAppointment',
      'individualSession': 'individualSession',
      'groupSession': 'groupSession',
      'cancelNoShow': 'cancelNoShow',
      'admittedDate': 'admittedDate',
      'tentativeDischargeDate': 'tentativeDischargeDate',
      'dischargedDate': 'dischargedDate',
      'erVisitsInfo': 'erVisitsInfo',
      'admitLocation': 'admitLocation',
      'plans': 'treatmentPlans',
      'location': 'location',
      'actions': 'actions'
    };
    
    const configId = fieldToConfigMap[col.field];
    const config = columnConfigs.find(config => config.id === configId);
    return config?.visible ?? true;
  });

  return (
    <TooltipProvider>
      <div className="min-h-screen bg-gray-50">
        {/* Top Navigation Bar */}
        <TopNavigationBar
          hospitalName="DrCloud EHR"
          userAvatarUrl="/profile-placeholder.jpg"
          onSearch={(searchTerm) => {
            console.log('Global search term:', searchTerm);
          }}
        />

      {/* Main Navigation Bar */}
      <MainNavigationBar
        activeItem="Staff Dashboard"
        onNavigate={(itemName) => {
          console.log('Navigating to:', itemName);
          return true;
        }}
      />

      {/* Main Content */}
      <div className="flex-1 p-6">
        <div className="max-w-full mx-auto">
          {/* Header Section */}
          <div className="mb-4">
            {/* Compact Title Row with Inline Metrics and Actions */}
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3 bg-white rounded-lg border border-gray-200 p-3 shadow-sm">
              
              {/* Left Side - Title and Subtitle */}
              <div className="flex-shrink-0">
                <h1 className="text-xl font-bold text-gray-900">Staff Dashboard</h1>
                <p className="text-xs text-gray-600">Manage your behavioral health clients efficiently</p>
              </div>
              
              {/* Center - Compact Metrics Badges */}
              <div className="flex flex-wrap items-center gap-2 lg:gap-3">
                <div className="flex items-center gap-1.5 bg-blue-50 rounded-full px-2.5 py-1 border border-blue-200">
                  <UserGroupIcon className="w-3.5 h-3.5 text-blue-600" />
                  <span className="text-sm font-semibold text-blue-700">{metrics.total}</span>
                  <span className="text-xs text-blue-600">Total</span>
                </div>
                
                <div className="flex items-center gap-1.5 bg-green-50 rounded-full px-2.5 py-1 border border-green-200">
                  <CheckCircleIcon className="w-3.5 h-3.5 text-green-600" />
                  <span className="text-sm font-semibold text-green-700">{metrics.admitted}</span>
                  <span className="text-xs text-green-600">Active Since 2024</span>
                </div>
                
                <div className="flex items-center gap-1.5 bg-gray-50 rounded-full px-2.5 py-1 border border-gray-200">
                  <UserIcon className="w-3.5 h-3.5 text-gray-600" />
                  <span className="text-sm font-semibold text-gray-700">{metrics.discharged}</span>
                  <span className="text-xs text-gray-600">Discharged This Month</span>
                </div>
                
                <div className="flex items-center gap-1.5 bg-red-50 rounded-full px-2.5 py-1 border border-red-200">
                  <ExclamationTriangleIcon className="w-3.5 h-3.5 text-red-600" />
                  <span className="text-sm font-semibold text-red-700">{metrics.highRisk}</span>
                  <span className="text-xs text-red-600">High Risk</span>
                </div>
              </div>
              
              {/* Right Side - Compact Action Buttons */}
              <div className="flex gap-1.5 flex-shrink-0">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleRefresh}
                  disabled={isRefreshing}
                  className="flex items-center gap-1 text-xs px-2.5 py-1.5"
                >
                  <ArrowPathIcon className={cn("w-3 h-3", isRefreshing && "animate-spin")} />
                  Refresh
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-1 text-xs px-2.5 py-1.5"
                >
                  <DocumentArrowDownIcon className="w-3 h-3" />
                  Export
                </Button>
              </div>
            </div>
          </div>

          {/* Unified Content Section */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            {/* Search and Filter Controls */}
            <div className="flex flex-col lg:flex-row lg:items-center gap-4 mb-6">
              {/* Search Bar */}
              <div className="relative w-full lg:w-80">
                <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Search clients by name, PID, program, or provider..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              
              {/* Separator */}
              <div className="hidden lg:block w-px h-8 bg-gray-200"></div>
              
              {/* Category Tabs */}
              <div className="flex-shrink-0">
                <Tabs
                  tabs={CATEGORIES}
                  activeTab={activeCategory}
                  onTabChange={setActiveCategory}
                  className="w-fit"
                />
              </div>
              
              {/* Separator */}
              <div className="hidden lg:block w-px h-8 bg-gray-200"></div>
              
              {/* Filter Dropdowns */}
              <div className="flex flex-wrap items-center gap-3">
                <Combobox
                  options={clinicianOptions}
                  value={selectedClinician}
                  onChange={setSelectedClinician}
                  placeholder="All Clinicians"
                  className="w-[180px]"
                  multiple={true}
                  hideFilters={true}
                />

                <Combobox
                  options={facilityOptions}
                  value={selectedFacility}
                  onChange={setSelectedFacility}
                  placeholder="All Facilities"
                  className="w-[160px]"
                  multiple={true}
                  hideFilters={true}
                />

                <Combobox
                  options={locationOptions}
                  value={selectedLocation}
                  onChange={setSelectedLocation}
                  placeholder="All Locations"
                  className="w-[140px]"
                  multiple={true}
                  hideFilters={true}
                />

                <Combobox
                  options={dueDateOptions}
                  value={selectedDueDateBy}
                  onChange={setSelectedDueDateBy}
                  placeholder="All Due Dates"
                  className="w-[150px]"
                  multiple={true}
                  hideFilters={true}
                />
              </div>
              
              {/* Separator */}
              <div className="hidden lg:block w-px h-8 bg-gray-200"></div>
              
              {/* Incomplete Details Switch */}
              <div className="flex items-center gap-2 flex-shrink-0">
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 cursor-pointer">
                  <Switch
                    checked={showIncompleteDetails}
                    onCheckedChange={setShowIncompleteDetails}
                  />
                  Only show incomplete
                </label>
              </div>
              
              {/* Separator */}
              <div className="hidden lg:block w-px h-8 bg-gray-200"></div>
              
              {/* Column Customizer */}
              <div className="flex-shrink-0">
                <ColumnCustomizer
                  columns={columnConfigs}
                  onColumnsChange={setColumnConfigs}
                  className="text-xs"
                />
              </div>
            </div>
            


            {/* Client Table/Cards */}
            {isLoading || isRefreshing ? (
              // Show skeleton during loading or refresh
              <div>
                {/* Desktop Skeleton */}
                <div className="hidden lg:block">
                  <TableSkeleton 
                    variant="desktop" 
                    rows={8}
                    className="w-full"
                  />
                </div>
                
                {/* Mobile Skeleton */}
                <div className="lg:hidden">
                  <TableSkeleton 
                    variant="mobile" 
                    rows={6}
                    className="w-full"
                  />
                </div>
              </div>
            ) : filteredClients.length > 0 ? (
              <div className="border border-gray-200 rounded-lg overflow-hidden">
                {/* Desktop View - AG Grid */}
                <div className="hidden lg:block w-full overflow-x-auto">
                  <div className="min-w-[1400px] h-[calc(100vh-400px)]">
                    <DataTable
                      rowData={filteredClients}
                      columnDefs={columnDefs}
                      className="w-full h-full rounded-lg"
                      gridOptions={gridOptions}
                    />
                  </div>
                </div>
                
                {/* Mobile/Tablet View - Cards */}
                <div className="lg:hidden p-4">
                  {filteredClients.map((client) => (
                    <ClientCard 
                      key={client.id} 
                      client={client}
                      onSelect={handleClientSelect}
                    />
                  ))}
                </div>
              </div>
            ) : (
              <div className="border border-gray-200 rounded-lg p-12 text-center">
                <UserGroupIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No clients found</h3>
                <p className="text-gray-500">
                  {searchQuery 
                    ? `No clients match "${searchQuery}" in the selected category.`
                    : "No clients match the current filters."
                  }
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
      </div>
    </TooltipProvider>
  );
};

export default StaffDashboard; 