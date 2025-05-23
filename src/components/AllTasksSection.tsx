import React, { useState, useMemo } from 'react';
import { Badge } from '@/components/atoms/Badge';
import { Button } from '@/components/atoms/Button';
import { Input } from '@/components/atoms/Input';
import { Tabs } from '@/components/atoms/Tabs';
import { cn } from '@/lib/utils';
import { DataTable } from '@/components/organisms/DataTable';
import {
  MagnifyingGlassIcon,
  AdjustmentsHorizontalIcon,
  ClockIcon,
  CheckCircleIcon,
  BellIcon,
  DocumentTextIcon,
  CalendarIcon,
  DocumentCheckIcon,
  PresentationChartLineIcon,
  UserIcon,
  ChatBubbleLeftRightIcon,
  RectangleStackIcon,
  PlusIcon
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
import { useMediaQuery } from '@/hooks/useMediaQuery';
import TaskDetailsPanel from '@/components/TaskDetailsPanel';

// Task interface for the table
interface Task {
  id: string;
  title: string;
  description: string;
  message: string;
  date: string;
  priority: 'High' | 'Medium' | 'Low';
  dueDate: string;
  assignedTo: string;
  status: 'Pending' | 'In Progress' | 'Completed' | 'Overdue';
  program: string;
  person: string;
}

// Mock data for tasks
const mockTasks: Task[] = [
  // Reminders (10 items)
  {
    id: 'rem1',
    title: 'Medication Review Due',
    description: 'Monthly medication review required for patient John Smith',
    message: 'Medication review deadline approaching for patient',
    date: '04/15/2024',
    priority: 'High',
    dueDate: 'Today',
    assignedTo: 'Dr. Sarah Wilson',
    status: 'Pending',
    program: 'Reminder',
    person: 'John Smith'
  },
  {
    id: 'rem2',
    title: 'Follow-up Appointment',
    description: 'Schedule follow-up for post-surgery consultation',
    message: 'Patient needs follow-up appointment scheduling',
    date: '04/16/2024',
    priority: 'Medium',
    dueDate: 'Tomorrow',
    assignedTo: 'Nurse Johnson',
    status: 'Pending',
    program: 'Reminder',
    person: 'Emma Davis'
  },
  {
    id: 'rem3',
    title: 'Vaccination Due',
    description: 'Annual flu vaccination reminder for elderly patient',
    message: 'Schedule annual flu shot',
    date: '04/17/2024',
    priority: 'Medium',
    dueDate: '2 days',
    assignedTo: 'Nurse Martinez',
    status: 'Pending',
    program: 'Reminder',
    person: 'George Brown'
  },
  {
    id: 'rem4',
    title: 'Lab Test Reminder',
    description: 'Quarterly blood work due for diabetes monitoring',
    message: 'Schedule routine lab work',
    date: '04/18/2024',
    priority: 'High',
    dueDate: '3 days',
    assignedTo: 'Dr. Thompson',
    status: 'Pending',
    program: 'Reminder',
    person: 'Linda White'
  },
  {
    id: 'rem5',
    title: 'Physical Therapy Session',
    description: 'Weekly PT session reminder for knee rehabilitation',
    message: 'Confirm PT appointment',
    date: '04/15/2024',
    priority: 'Medium',
    dueDate: 'Today',
    assignedTo: 'PT Staff',
    status: 'In Progress',
    program: 'Reminder',
    person: 'Robert Johnson'
  },
  {
    id: 'rem6',
    title: 'Prescription Refill Due',
    description: 'Blood pressure medication refill needed',
    message: 'Process prescription refill',
    date: '04/16/2024',
    priority: 'High',
    dueDate: 'Tomorrow',
    assignedTo: 'Dr. Garcia',
    status: 'Pending',
    program: 'Reminder',
    person: 'Mary Wilson'
  },
  {
    id: 'rem7',
    title: 'Annual Check-up Due',
    description: 'Routine annual physical examination reminder',
    message: 'Schedule annual check-up',
    date: '04/19/2024',
    priority: 'Low',
    dueDate: '4 days',
    assignedTo: 'Dr. Anderson',
    status: 'Pending',
    program: 'Reminder',
    person: 'James Taylor'
  },
  {
    id: 'rem8',
    title: 'Dental Cleaning Reminder',
    description: 'Six-month dental cleaning and check-up',
    message: 'Schedule dental appointment',
    date: '04/20/2024',
    priority: 'Low',
    dueDate: '5 days',
    assignedTo: 'Dental Staff',
    status: 'Pending',
    program: 'Reminder',
    person: 'Sarah Miller'
  },
  {
    id: 'rem9',
    title: 'Eye Examination Due',
    description: 'Annual vision check and prescription update',
    message: 'Schedule eye exam',
    date: '04/21/2024',
    priority: 'Medium',
    dueDate: '6 days',
    assignedTo: 'Dr. Lee',
    status: 'Pending',
    program: 'Reminder',
    person: 'David Clark'
  },
  {
    id: 'rem10',
    title: 'Immunization Update',
    description: 'Childhood vaccination schedule update needed',
    message: 'Review immunization records',
    date: '04/22/2024',
    priority: 'High',
    dueDate: '7 days',
    assignedTo: 'Dr. Roberts',
    status: 'Pending',
    program: 'Reminder',
    person: 'Emily Young'
  },

  // Review Forms (10 items)
  {
    id: 'form1',
    title: 'Insurance Claim Form Review',
    description: 'Review and approve insurance claim form for recent procedure',
    message: 'Insurance claim form pending review',
    date: '04/15/2024',
    priority: 'High',
    dueDate: 'Today',
    assignedTo: 'Admin Staff',
    status: 'In Progress',
    program: 'Form Review',
    person: 'Michael Brown'
  },
  {
    id: 'form2',
    title: 'Patient Intake Form',
    description: 'New patient intake form needs review and approval',
    message: 'New patient documentation pending',
    date: '04/17/2024',
    priority: 'Medium',
    dueDate: '2 days',
    assignedTo: 'Dr. Roberts',
    status: 'Pending',
    program: 'Form Review',
    person: 'Sarah Johnson'
  },
  {
    id: 'form3',
    title: 'Medical History Update',
    description: 'Annual medical history form update required',
    message: 'Update patient history',
    date: '04/16/2024',
    priority: 'Medium',
    dueDate: 'Tomorrow',
    assignedTo: 'Nurse Wilson',
    status: 'Pending',
    program: 'Form Review',
    person: 'Thomas Anderson'
  },
  {
    id: 'form4',
    title: 'Surgical Consent Form',
    description: 'Pre-surgery consent form needs physician review',
    message: 'Review surgical documentation',
    date: '04/15/2024',
    priority: 'High',
    dueDate: 'Today',
    assignedTo: 'Dr. Martinez',
    status: 'In Progress',
    program: 'Form Review',
    person: 'Patricia Moore'
  },
  {
    id: 'form5',
    title: 'Insurance Pre-authorization',
    description: 'Complete pre-authorization form for upcoming procedure',
    message: 'Process insurance pre-auth',
    date: '04/18/2024',
    priority: 'High',
    dueDate: '3 days',
    assignedTo: 'Admin Staff',
    status: 'Pending',
    program: 'Form Review',
    person: 'Robert Taylor'
  },
  {
    id: 'form6',
    title: 'Medicare Claim Form',
    description: 'Review Medicare claim submission for recent visit',
    message: 'Process Medicare claim',
    date: '04/19/2024',
    priority: 'Medium',
    dueDate: '4 days',
    assignedTo: 'Billing Staff',
    status: 'Pending',
    program: 'Form Review',
    person: 'James Wilson'
  },
  {
    id: 'form7',
    title: 'Lab Request Form',
    description: 'Complete laboratory test request documentation',
    message: 'Process lab request',
    date: '04/15/2024',
    priority: 'High',
    dueDate: 'Today',
    assignedTo: 'Dr. Thompson',
    status: 'In Progress',
    program: 'Form Review',
    person: 'Emily White'
  },
  {
    id: 'form8',
    title: 'Physical Therapy Referral',
    description: 'Review and complete PT referral documentation',
    message: 'Process PT referral',
    date: '04/16/2024',
    priority: 'Medium',
    dueDate: 'Tomorrow',
    assignedTo: 'Dr. Garcia',
    status: 'Pending',
    program: 'Form Review',
    person: 'David Miller'
  },
  {
    id: 'form9',
    title: 'Disability Form Review',
    description: 'Complete disability documentation for patient claim',
    message: 'Process disability paperwork',
    date: '04/20/2024',
    priority: 'High',
    dueDate: '5 days',
    assignedTo: 'Dr. Anderson',
    status: 'Pending',
    program: 'Form Review',
    person: 'Lisa Wilson'
  },
  {
    id: 'form10',
    title: 'Release of Records',
    description: 'Process medical records release request',
    message: 'Handle records release',
    date: '04/21/2024',
    priority: 'Low',
    dueDate: '6 days',
    assignedTo: 'Medical Records',
    status: 'Pending',
    program: 'Form Review',
    person: 'John Smith'
  },

  // Agenda (10 items)
  {
    id: 'ag1',
    title: 'Team Meeting',
    description: 'Weekly staff meeting to discuss patient cases',
    message: 'Prepare updates for weekly meeting',
    date: '04/16/2024',
    priority: 'Medium',
    dueDate: 'Tomorrow',
    assignedTo: 'All Staff',
    status: 'Pending',
    program: 'Meeting',
    person: 'Team'
  },
  {
    id: 'ag2',
    title: 'Patient Consultation',
    description: 'Scheduled consultation for treatment plan review',
    message: 'Prepare patient history and treatment options',
    date: '04/15/2024',
    priority: 'High',
    dueDate: 'Today',
    assignedTo: 'Dr. Anderson',
    status: 'In Progress',
    program: 'Schedule',
    person: 'Lisa Wilson'
  },
  {
    id: 'ag3',
    title: 'Department Review',
    description: 'Monthly department performance review meeting',
    message: 'Prepare department metrics',
    date: '04/17/2024',
    priority: 'Medium',
    dueDate: '2 days',
    assignedTo: 'Department Heads',
    status: 'Pending',
    program: 'Meeting',
    person: 'Management'
  },
  {
    id: 'ag4',
    title: 'New Patient Orientation',
    description: 'Group orientation session for new patients',
    message: 'Prepare orientation materials',
    date: '04/18/2024',
    priority: 'Low',
    dueDate: '3 days',
    assignedTo: 'Nurse Johnson',
    status: 'Pending',
    program: 'Schedule',
    person: 'Group'
  },
  {
    id: 'ag5',
    title: 'Board Meeting',
    description: 'Quarterly board meeting for hospital updates',
    message: 'Prepare quarterly reports',
    date: '04/19/2024',
    priority: 'High',
    dueDate: '4 days',
    assignedTo: 'Executive Team',
    status: 'Pending',
    program: 'Meeting',
    person: 'Board'
  },
  {
    id: 'ag6',
    title: 'Staff Training',
    description: 'Mandatory staff training on new procedures',
    message: 'Coordinate training session',
    date: '04/20/2024',
    priority: 'Medium',
    dueDate: '5 days',
    assignedTo: 'HR Department',
    status: 'Pending',
    program: 'Schedule',
    person: 'Staff'
  },
  {
    id: 'ag7',
    title: 'Patient Support Group',
    description: 'Weekly support group meeting for chronic conditions',
    message: 'Prepare group session materials',
    date: '04/15/2024',
    priority: 'Medium',
    dueDate: 'Today',
    assignedTo: 'Dr. Thompson',
    status: 'In Progress',
    program: 'Meeting',
    person: 'Support Group'
  },
  {
    id: 'ag8',
    title: 'Emergency Response Drill',
    description: 'Scheduled emergency response practice session',
    message: 'Coordinate emergency drill',
    date: '04/21/2024',
    priority: 'High',
    dueDate: '6 days',
    assignedTo: 'Safety Team',
    status: 'Pending',
    program: 'Schedule',
    person: 'All Staff'
  },
  {
    id: 'ag9',
    title: 'Quality Assurance Meeting',
    description: 'Monthly quality metrics review session',
    message: 'Prepare quality reports',
    date: '04/22/2024',
    priority: 'Medium',
    dueDate: '7 days',
    assignedTo: 'QA Team',
    status: 'Pending',
    program: 'Meeting',
    person: 'Department Heads'
  },
  {
    id: 'ag10',
    title: 'Community Outreach Event',
    description: 'Health awareness program for local community',
    message: 'Prepare community event',
    date: '04/23/2024',
    priority: 'Low',
    dueDate: '8 days',
    assignedTo: 'Outreach Team',
    status: 'Pending',
    program: 'Schedule',
    person: 'Community'
  },

  // Prescriptions (10 items)
  {
    id: 'rx1',
    title: 'Prescription Renewal',
    description: 'Review and approve medication renewal request',
    message: 'Patient requested medication renewal',
    date: '04/15/2024',
    priority: 'High',
    dueDate: 'Today',
    assignedTo: 'Dr. Martinez',
    status: 'Pending',
    program: 'Prescription Review',
    person: 'Robert Taylor'
  },
  {
    id: 'rx2',
    title: 'New Medication Order',
    description: 'Process new medication order and verify interactions',
    message: 'New prescription needs verification',
    date: '04/16/2024',
    priority: 'High',
    dueDate: 'Tomorrow',
    assignedTo: 'Pharmacy Staff',
    status: 'In Progress',
    program: 'Pharmacy',
    person: 'James Wilson'
  },
  {
    id: 'rx3',
    title: 'Medication Adjustment',
    description: 'Review dosage adjustment for current medication',
    message: 'Evaluate medication dosage',
    date: '04/17/2024',
    priority: 'High',
    dueDate: '2 days',
    assignedTo: 'Dr. Thompson',
    status: 'Pending',
    program: 'Prescription Review',
    person: 'Emily White'
  },
  {
    id: 'rx4',
    title: 'Prior Authorization',
    description: 'Process insurance prior authorization for medication',
    message: 'Handle medication authorization',
    date: '04/18/2024',
    priority: 'Medium',
    dueDate: '3 days',
    assignedTo: 'Pharmacy Staff',
    status: 'Pending',
    program: 'Pharmacy',
    person: 'David Miller'
  },
  {
    id: 'rx5',
    title: 'Controlled Substance Review',
    description: 'Review controlled substance prescription request',
    message: 'Evaluate controlled medication',
    date: '04/15/2024',
    priority: 'High',
    dueDate: 'Today',
    assignedTo: 'Dr. Garcia',
    status: 'In Progress',
    program: 'Prescription Review',
    person: 'Thomas Anderson'
  },
  {
    id: 'rx6',
    title: 'Medication Interaction Check',
    description: 'Review potential drug interactions for new prescription',
    message: 'Check medication interactions',
    date: '04/19/2024',
    priority: 'High',
    dueDate: '4 days',
    assignedTo: 'Pharmacy Staff',
    status: 'Pending',
    program: 'Pharmacy',
    person: 'Patricia Moore'
  },
  {
    id: 'rx7',
    title: 'Prescription Transfer',
    description: 'Process prescription transfer from another pharmacy',
    message: 'Handle prescription transfer',
    date: '04/20/2024',
    priority: 'Medium',
    dueDate: '5 days',
    assignedTo: 'Pharmacy Staff',
    status: 'Pending',
    program: 'Pharmacy',
    person: 'Sarah Johnson'
  },
  {
    id: 'rx8',
    title: 'Medication Review',
    description: 'Comprehensive medication review for multiple prescriptions',
    message: 'Review medication list',
    date: '04/21/2024',
    priority: 'Medium',
    dueDate: '6 days',
    assignedTo: 'Dr. Wilson',
    status: 'Pending',
    program: 'Prescription Review',
    person: 'Michael Brown'
  },
  {
    id: 'rx9',
    title: 'Emergency Prescription',
    description: 'Process emergency medication request',
    message: 'Handle urgent prescription',
    date: '04/15/2024',
    priority: 'High',
    dueDate: 'Today',
    assignedTo: 'Dr. Lee',
    status: 'In Progress',
    program: 'Prescription Review',
    person: 'Linda White'
  },
  {
    id: 'rx10',
    title: 'Medication Substitution',
    description: 'Review generic substitution request',
    message: 'Evaluate medication change',
    date: '04/22/2024',
    priority: 'Low',
    dueDate: '7 days',
    assignedTo: 'Pharmacy Staff',
    status: 'Pending',
    program: 'Pharmacy',
    person: 'George Brown'
  },

  // Messages (10 items)
  {
    id: 'msg1',
    title: 'Lab Results Discussion',
    description: 'Review and discuss recent lab results with patient',
    message: 'Lab results ready for review',
    date: '04/15/2024',
    priority: 'Medium',
    dueDate: 'Today',
    assignedTo: 'Dr. Thompson',
    status: 'Pending',
    program: 'Message',
    person: 'Emily White'
  },
  {
    id: 'msg2',
    title: 'Treatment Plan Update',
    description: 'Communicate treatment plan changes to care team',
    message: 'Update team on modified treatment approach',
    date: '04/16/2024',
    priority: 'Medium',
    dueDate: 'Tomorrow',
    assignedTo: 'Dr. Garcia',
    status: 'Pending',
    program: 'Communication',
    person: 'David Miller'
  },
  {
    id: 'msg3',
    title: 'Appointment Request',
    description: 'Patient requesting urgent appointment',
    message: 'Handle urgent appointment request',
    date: '04/15/2024',
    priority: 'High',
    dueDate: 'Today',
    assignedTo: 'Scheduling Staff',
    status: 'In Progress',
    program: 'Message',
    person: 'Robert Taylor'
  },
  {
    id: 'msg4',
    title: 'Medication Question',
    description: 'Patient inquiry about medication side effects',
    message: 'Address medication concerns',
    date: '04/17/2024',
    priority: 'Medium',
    dueDate: '2 days',
    assignedTo: 'Dr. Martinez',
    status: 'Pending',
    program: 'Message',
    person: 'James Wilson'
  },
  {
    id: 'msg5',
    title: 'Insurance Inquiry',
    description: 'Patient question about insurance coverage',
    message: 'Handle insurance question',
    date: '04/18/2024',
    priority: 'Low',
    dueDate: '3 days',
    assignedTo: 'Billing Staff',
    status: 'Pending',
    program: 'Communication',
    person: 'Sarah Johnson'
  },
  {
    id: 'msg6',
    title: 'Test Results Follow-up',
    description: 'Follow up on abnormal test results',
    message: 'Discuss test findings',
    date: '04/15/2024',
    priority: 'High',
    dueDate: 'Today',
    assignedTo: 'Dr. Anderson',
    status: 'In Progress',
    program: 'Message',
    person: 'Thomas Anderson'
  },
  {
    id: 'msg7',
    title: 'Referral Request',
    description: 'Patient requesting specialist referral',
    message: 'Process referral request',
    date: '04/19/2024',
    priority: 'Medium',
    dueDate: '4 days',
    assignedTo: 'Dr. Wilson',
    status: 'Pending',
    program: 'Communication',
    person: 'Patricia Moore'
  },
  {
    id: 'msg8',
    title: 'Prescription Clarification',
    description: 'Pharmacy requesting prescription clarification',
    message: 'Address prescription query',
    date: '04/20/2024',
    priority: 'High',
    dueDate: '5 days',
    assignedTo: 'Dr. Lee',
    status: 'Pending',
    program: 'Message',
    person: 'Linda White'
  },
  {
    id: 'msg9',
    title: 'Care Plan Discussion',
    description: 'Family discussion about long-term care plan',
    message: 'Review care planning',
    date: '04/21/2024',
    priority: 'Medium',
    dueDate: '6 days',
    assignedTo: 'Dr. Roberts',
    status: 'Pending',
    program: 'Communication',
    person: 'George Brown'
  },
  {
    id: 'msg10',
    title: 'Medical Records Request',
    description: 'Patient requesting copies of medical records',
    message: 'Process records request',
    date: '04/22/2024',
    priority: 'Low',
    dueDate: '7 days',
    assignedTo: 'Medical Records',
    status: 'Pending',
    program: 'Message',
    person: 'Mary Wilson'
  },

  // Assessments (10 items)
  {
    id: 'asmt1',
    title: 'Annual Health Assessment',
    description: 'Complete annual health evaluation and documentation',
    message: 'Annual assessment due for patient',
    date: '04/15/2024',
    priority: 'Medium',
    dueDate: 'Today',
    assignedTo: 'Dr. Lee',
    status: 'In Progress',
    program: 'Assessment',
    person: 'Thomas Anderson'
  },
  {
    id: 'asmt2',
    title: 'Mental Health Evaluation',
    description: 'Conduct scheduled mental health assessment',
    message: 'Regular evaluation appointment',
    date: '04/16/2024',
    priority: 'High',
    dueDate: 'Tomorrow',
    assignedTo: 'Dr. Williams',
    status: 'Pending',
    program: 'Evaluation',
    person: 'Patricia Moore'
  },
  {
    id: 'asmt3',
    title: 'Physical Therapy Assessment',
    description: 'Initial PT evaluation for new patient',
    message: 'Complete PT evaluation',
    date: '04/17/2024',
    priority: 'Medium',
    dueDate: '2 days',
    assignedTo: 'PT Staff',
    status: 'Pending',
    program: 'Assessment',
    person: 'Robert Taylor'
  },
  {
    id: 'asmt4',
    title: 'Cognitive Function Test',
    description: 'Perform cognitive assessment for elderly patient',
    message: 'Complete cognitive evaluation',
    date: '04/18/2024',
    priority: 'High',
    dueDate: '3 days',
    assignedTo: 'Dr. Thompson',
    status: 'Pending',
    program: 'Evaluation',
    person: 'James Wilson'
  },
  {
    id: 'asmt5',
    title: 'Diabetes Risk Assessment',
    description: 'Evaluate diabetes risk factors and current status',
    message: 'Complete diabetes screening',
    date: '04/15/2024',
    priority: 'Medium',
    dueDate: 'Today',
    assignedTo: 'Dr. Martinez',
    status: 'In Progress',
    program: 'Assessment',
    person: 'Emily White'
  },
  {
    id: 'asmt6',
    title: 'Pain Management Evaluation',
    description: 'Assess chronic pain management effectiveness',
    message: 'Review pain management',
    date: '04/19/2024',
    priority: 'High',
    dueDate: '4 days',
    assignedTo: 'Dr. Garcia',
    status: 'Pending',
    program: 'Evaluation',
    person: 'David Miller'
  },
  {
    id: 'asmt7',
    title: 'Nutritional Assessment',
    description: 'Complete dietary and nutritional evaluation',
    message: 'Perform nutrition review',
    date: '04/20/2024',
    priority: 'Low',
    dueDate: '5 days',
    assignedTo: 'Nutritionist',
    status: 'Pending',
    program: 'Assessment',
    person: 'Sarah Johnson'
  },
  {
    id: 'asmt8',
    title: 'Fall Risk Evaluation',
    description: 'Assess patient mobility and fall risk factors',
    message: 'Complete fall risk screening',
    date: '04/21/2024',
    priority: 'Medium',
    dueDate: '6 days',
    assignedTo: 'PT Staff',
    status: 'Pending',
    program: 'Evaluation',
    person: 'Linda White'
  },
  {
    id: 'asmt9',
    title: 'Medication Assessment',
    description: 'Review current medications and effectiveness',
    message: 'Evaluate medication regime',
    date: '04/22/2024',
    priority: 'High',
    dueDate: '7 days',
    assignedTo: 'Dr. Wilson',
    status: 'Pending',
    program: 'Assessment',
    person: 'George Brown'
  },
  {
    id: 'asmt10',
    title: 'Post-Surgery Evaluation',
    description: 'Assess post-operative recovery progress',
    message: 'Complete post-op assessment',
    date: '04/23/2024',
    priority: 'High',
    dueDate: '8 days',
    assignedTo: 'Dr. Anderson',
    status: 'Pending',
    program: 'Evaluation',
    person: 'Mary Wilson'
  },

  // Add some tasks without subjects in different categories
  {
    id: 'msg11',
    title: '', // Empty subject
    description: 'Patient called regarding appointment rescheduling for next week',
    message: 'Handle appointment reschedule request',
    date: '04/15/2024',
    priority: 'Medium',
    dueDate: 'Today',
    assignedTo: 'Front Desk',
    status: 'Pending',
    program: 'Message',
    person: 'Alice Johnson'
  },
  {
    id: 'rem11',
    title: '', // Empty subject
    description: 'Follow up on lab results from annual physical examination',
    message: 'Check lab results',
    date: '04/16/2024',
    priority: 'High',
    dueDate: 'Tomorrow',
    assignedTo: 'Dr. Wilson',
    status: 'Pending',
    program: 'Reminder',
    person: 'Bob Smith'
  },
  {
    id: 'form11',
    title: '', // Empty subject
    description: 'New insurance verification form received for processing',
    message: 'Process insurance form',
    date: '04/17/2024',
    priority: 'Medium',
    dueDate: '2 days',
    assignedTo: 'Admin Staff',
    status: 'Pending',
    program: 'Form Review',
    person: 'Carol Davis'
  },
  {
    id: 'rx11',
    title: '', // Empty subject
    description: 'Urgent request for pain medication refill from overnight nurse',
    message: 'Review medication request',
    date: '04/15/2024',
    priority: 'High',
    dueDate: 'Today',
    assignedTo: 'Dr. Martinez',
    status: 'In Progress',
    program: 'Prescription Review',
    person: 'David Wilson'
  },
  {
    id: 'asmt11',
    title: '', // Empty subject
    description: 'Routine blood pressure check and vital signs monitoring required',
    message: 'Complete vital signs check',
    date: '04/16/2024',
    priority: 'Low',
    dueDate: 'Tomorrow',
    assignedTo: 'Nurse Johnson',
    status: 'Pending',
    program: 'Assessment',
    person: 'Eva Brown'
  }
];

// Helper to get priority badge styles
const getPriorityBadgeStyles = (priority: string) => {
  switch (priority) {
    case 'High':
      return "bg-red-50 text-red-700 border-red-200";
    case 'Medium':
      return "bg-amber-50 text-amber-700 border-amber-200";
    case 'Low':
      return "bg-green-50 text-green-700 border-green-200";
    default:
      return "bg-gray-50 text-gray-700 border-gray-200";
  }
};

// Helper to get status badge styles
const getStatusBadgeStyles = (status: string) => {
  switch (status) {
    case 'Completed':
      return "bg-green-50 text-green-700 border-green-200";
    case 'In Progress':
      return "bg-blue-50 text-blue-700 border-blue-200";
    case 'Pending':
      return "bg-amber-50 text-amber-700 border-amber-200";
    case 'Overdue':
      return "bg-red-50 text-red-700 border-red-200";
    default:
      return "bg-gray-50 text-gray-700 border-gray-200";
  }
};

const PRIORITY_LABELS: Record<string, string> = {
  high: 'High Priority',
  medium: 'Medium Priority',
  low: 'Low Priority'
};

const CATEGORIES = [
  { id: 'reminders', label: 'Reminders', icon: <BellIcon /> },
  { id: 'review-form', label: 'Review Form', icon: <DocumentTextIcon /> },
  { id: 'agenda', label: 'Agenda', icon: <CalendarIcon /> },
  { id: 'prescriptions', label: 'Review Prescriptions', icon: <DocumentCheckIcon /> },
  { id: 'message', label: 'Message', icon: <ChatBubbleLeftRightIcon /> },
  { id: 'assessment', label: 'Assessment', icon: <PresentationChartLineIcon /> },
];

// Add new TaskCard component for mobile view
const TaskCard: React.FC<{ task: Task; onSelect: (task: Task) => void }> = ({ task, onSelect }) => {
  return (
    <div 
      className="bg-white rounded-lg border border-gray-100 p-4 mb-3 shadow-sm active:bg-gray-50"
      onClick={() => onSelect(task)}
    >
      {/* Title and Priority */}
      <div className="flex justify-between items-start mb-2">
        <h3 className="text-sm font-medium text-gray-900 flex-1 mr-2">
          {task.title || <span className="text-gray-400 italic">No subject</span>}
        </h3>
        <Badge variant="outline" className={cn('text-xs h-6 shrink-0', getPriorityBadgeStyles(task.priority))}>
          {PRIORITY_LABELS[task.priority.toLowerCase()] || 'Unknown'}
        </Badge>
      </div>
      
      {/* Description */}
      <p className="text-sm text-gray-600 mb-3 line-clamp-2">
        {task.description}
      </p>
      
      {/* Meta Information */}
      <div className="grid grid-cols-2 gap-2 text-xs text-gray-600 mb-3">
        <div className="flex items-center">
          <ClockIcon className="h-3.5 w-3.5 mr-1 text-gray-400" />
          {task.dueDate}
        </div>
        <div className="flex items-center">
          <UserIcon className="h-3.5 w-3.5 mr-1 text-blue-400" />
          {task.assignedTo}
        </div>
      </div>
      
      {/* Status and Actions */}
      <div className="flex items-center justify-between">
        <Badge variant="outline" className={cn('text-xs h-6', getStatusBadgeStyles(task.status))}>
          {task.status}
        </Badge>
        <div className="flex gap-2">
          <button className="text-blue-600 hover:text-blue-800 text-xs font-medium underline px-1 py-0.5">
            Reply
          </button>
          <button className="text-gray-400 hover:text-gray-600 p-1 rounded-sm hover:bg-gray-50">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

/**
 * AllTasksSection Component
 * 
 * A collapsible section that displays all tasks in a tabular format.
 * Includes filtering and search functionality.
 */
const AllTasksSection: React.FC = () => {
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeFilter, setActiveFilter] = useState<string>('all');
  const [activeCategory, setActiveCategory] = useState<string>('reminders');
  const [showFilters, setShowFilters] = useState<boolean>(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const isMobile = useMediaQuery('(max-width: 640px)');

  // Handle task selection
  const handleTaskSelect = (task: Task) => {
    setSelectedTask(task);
  };

  // Handle panel close
  const handlePanelClose = () => {
    setSelectedTask(null);
  };

  // Helper function to match task program with category
  const matchesCategory = (program: string, categoryId: string): boolean => {
    const categoryMapping: Record<string, string[]> = {
      'reminders': ['Reminder', 'Alert', 'Notification'],
      'review-form': ['Form Review', 'Document Review'],
      'agenda': ['Meeting', 'Group Sessions', 'Schedule'],
      'prescriptions': ['Prescription Review', 'Medication', 'Pharmacy'],
      'message': ['Message', 'Communication', 'Chat'],
      'assessment': ['Assessment', 'Evaluation', 'Test']
    };

    return categoryMapping[categoryId]?.some(keyword => 
      program.toLowerCase().includes(keyword.toLowerCase())
    ) || false;
  };

  // Filter tasks based on search query, active filter and category
  const filteredTasks = useMemo(() => {
    return mockTasks.filter(task => {
      const matchesSearch = searchQuery === '' || 
        task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        task.assignedTo.toLowerCase().includes(searchQuery.toLowerCase()) ||
        task.program.toLowerCase().includes(searchQuery.toLowerCase());
      
      let matchesFilter = true;
      if (activeFilter === 'no_subject') {
        matchesFilter = !task.title;
      } else if (activeFilter !== 'all') {
        matchesFilter = task.priority.toLowerCase() === activeFilter.toLowerCase() ||
          task.status.toLowerCase() === activeFilter.toLowerCase();
      }
      
      const matchesCategoryType = matchesCategory(task.program, activeCategory);
      
      return matchesSearch && matchesFilter && matchesCategoryType;
    });
  }, [searchQuery, activeFilter, activeCategory]);

  const columnDefs = [
    {
      headerName: '',
      field: 'checkbox',
      colId: 'checkbox',
      width: 35,
      minWidth: 35,
      maxWidth: 35,
      checkboxSelection: true,
      headerCheckboxSelection: true,
      pinned: 'left' as const
    },
    {
      headerName: 'Subject',
      field: 'title',
      colId: 'title',
      flex: 1.5,
      cellRenderer: (params: any) => (
        <div className="text-sm font-medium text-gray-900 truncate" title={params.data.title || 'No subject'}>
          {params.data.title || <span className="text-gray-400 italic">No subject</span>}
        </div>
      )
    },
    {
      headerName: 'Message',
      field: 'description',
      colId: 'description',
      flex: 2,
      cellRenderer: (params: any) => (
        <div className="text-sm text-gray-600 line-clamp-2" title={params.data.description}>
          {params.data.description}
        </div>
      )
    },
    {
      headerName: 'Priority',
      field: 'priority',
      flex: 1,
      cellRenderer: (params: any) => {
        const value = (params.data.priority || '').toLowerCase();
        const label = PRIORITY_LABELS[value] || 'Unknown';
        return (
          <Badge variant="outline" className={cn('text-sm h-6', getPriorityBadgeStyles(params.data.priority))}>
            {label}
          </Badge>
        );
      }
    },
    {
      headerName: 'Due',
      field: 'dueDate',
      flex: 0.8,
      cellRenderer: (params: any) => (
        <div className="flex items-center text-sm text-gray-600">
          <ClockIcon className="h-3.5 w-3.5 mr-1 text-gray-400" />
          {params.data.dueDate}
        </div>
      )
    },
    {
      headerName: 'Status',
      field: 'status',
      flex: 1,
      cellRenderer: (params: any) => (
        <Badge variant="outline" className={cn('text-sm h-6', getStatusBadgeStyles(params.data.status))}>
          {params.data.status}
        </Badge>
      )
    },
    {
      headerName: 'Received from',
      field: 'assignedTo',
      flex: 1,
      cellRenderer: (params: any) => (
        <div className="flex items-center text-sm text-gray-600">
          <UserIcon className="h-3.5 w-3.5 mr-1 text-blue-400" />
          {params.data.assignedTo}
        </div>
      )
    },
    {
      headerName: 'Person',
      field: 'person',
      flex: 1,
      cellRenderer: (params: any) => (
        <div
          className="flex items-center text-sm text-blue-600 hover:text-blue-800 hover:underline cursor-pointer"
          tabIndex={0}
          role="button"
          title={`View patient chart for ${params.data.person}`}
        >
          <UserIcon className="h-3.5 w-3.5 mr-1 text-blue-400" />
          {params.data.person}
        </div>
      )
    },
    {
      headerName: 'Actions',
      field: 'actions',
      flex: 0.8,
      cellRenderer: (params: any) => (
        <div className="flex gap-2 items-center justify-end">
          <button
            className="text-blue-600 hover:text-blue-800 text-xs font-medium underline px-1 py-0.5"
            tabIndex={0}
            title="Reply to task"
          >
            Reply
          </button>
          <button
            className="text-gray-400 hover:text-gray-600 p-1 rounded-sm hover:bg-gray-50"
            title="Complete task"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
          </button>
        </div>
      )
    }
  ];

  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100 mt-2">
      <div 
        className="p-5 border-b border-gray-100 flex justify-between items-center cursor-pointer hover:bg-gray-50/50 transition-colors"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center">
          <h2 className="text-lg font-semibold text-gray-800">All Items</h2>
          <div className="ml-2 p-1 text-gray-500">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              {isExpanded ? (
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              )}
            </svg>
          </div>
        </div>
      </div>
      
      {isExpanded && (
        <div className="p-4">
          {/* Search and Controls - Mobile Optimized */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 mb-4">
            <Input
              type="text"
              placeholder="Search"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full sm:w-64"
            />
            <div className="flex-1 min-w-0 overflow-x-auto">
              <Tabs
                tabs={CATEGORIES}
                activeTab={activeCategory}
                onTabChange={setActiveCategory}
                className="w-full"
              />
            </div>
            <Menubar className="bg-white border rounded-lg px-2 py-1 shrink-0">
              <MenubarMenu>
                <MenubarTrigger>Filters</MenubarTrigger>
                <MenubarContent>
                  <MenubarItem onClick={() => setActiveFilter('all')}>
                    All
                  </MenubarItem>
                  <MenubarItem onClick={() => setActiveFilter('High')}>
                    High Priority
                  </MenubarItem>
                  <MenubarItem onClick={() => setActiveFilter('Overdue')}>
                    Overdue
                  </MenubarItem>
                  <MenubarItem onClick={() => setActiveFilter('no_subject')}>
                    No Subject
                  </MenubarItem>
                  <MenubarSeparator />
                  <MenubarLabel>Status</MenubarLabel>
                  {['Pending', 'In Progress', 'Completed', 'Overdue'].map(status => (
                    <MenubarItem key={status} onClick={() => setActiveFilter(status)}>
                      {status}
                    </MenubarItem>
                  ))}
                </MenubarContent>
              </MenubarMenu>
            </Menubar>
          </div>
          
          {filteredTasks.length > 0 ? (
            <>
              {/* Desktop View */}
              <div className="hidden sm:block w-full h-[calc(100vh-350px)]">
                <DataTable
                  rowData={filteredTasks}
                  columnDefs={columnDefs}
                  className="w-full h-full rounded-lg"
                  gridOptions={{
                    suppressCellFocus: true,
                    animateRows: true,
                    pagination: true,
                    paginationPageSize: 20,
                    domLayout: 'autoHeight',
                    rowHeight: 48,
                    headerHeight: 40,
                    suppressHorizontalScroll: true,
                    onRowClicked: (params) => handleTaskSelect(params.data)
                  }}
                />
              </div>
              
              {/* Mobile View */}
              <div className="sm:hidden">
                {filteredTasks.map((task) => (
                  <TaskCard 
                    key={task.id} 
                    task={task}
                    onSelect={handleTaskSelect}
                  />
                ))}
              </div>
              
              {/* Task Details Panel */}
              {selectedTask && (
                <TaskDetailsPanel
                  blockId={activeCategory}
                  tasks={[selectedTask]}
                  onClose={handlePanelClose}
                />
              )}
              
              <div className="flex justify-between items-center text-sm text-gray-500 px-2 mt-4">
                <div>
                  Showing {filteredTasks.length} {filteredTasks.length === 1 ? 'task' : 'tasks'}
                </div>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="h-8 text-xs flex items-center gap-1"
                >
                  <PlusIcon className="h-3.5 w-3.5" />
                  Add New Task
                </Button>
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center text-center h-48">
              <RectangleStackIcon className="h-10 w-10 text-gray-300 mb-2" />
              <p className="text-gray-500">
                {searchQuery.trim() 
                  ? `No tasks found matching "${searchQuery}"` 
                  : "No tasks found for the selected filter."}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AllTasksSection;
