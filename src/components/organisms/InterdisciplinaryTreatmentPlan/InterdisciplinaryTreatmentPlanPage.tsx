import React, { useState, useMemo, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { GridOptions } from 'ag-grid-community';
import { MagnifyingGlassIcon, ArrowPathIcon, XMarkIcon, PencilIcon, CheckIcon } from '@heroicons/react/24/outline';
import { PlusIcon } from '@heroicons/react/24/solid';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faEdit, 
  faChartLine, 
  faPowerOff, 
  faEye, 
  faPrint, 
  faSignature,
  faTrash,
  faInfoCircle,
  faTable,
  faThLarge,
  faClipboardList
} from '@fortawesome/free-solid-svg-icons';
import { DataTable } from '@/components/organisms/DataTable';
import { Badge } from '@/components/atoms/Badge';
import { Button } from '@/components/atoms/Button';
import { Input } from '@/components/atoms/Input';
import { Checkbox } from '@/components/atoms/Checkbox';
import { TableSkeleton } from '@/components/atoms/TableSkeleton';

import { TooltipProvider, TooltipRoot, TooltipTrigger, TooltipContent } from '@/components/atoms/Tooltip/tooltip';
import { ConfirmDialog } from '@/components/molecules/ConfirmDialog/confirm-dialog';
import { useOngoingPlanCheck } from '@/hooks/useOngoingPlanCheck';

/**
 * InterdisciplinaryTreatmentPlanPage Component
 * 
 * Modern treatment plan management dashboard for healthcare facilities
 * Features comprehensive plan tracking, filtering, and management capabilities
 * 
 * Key Features:
 * - Comprehensive treatment plan filtering and search
 * - Integrated table within filters section for unified layout
 * - Modal-based new plan creation
 * - Mobile-responsive design with card view
 * - Professional healthcare UI standards
 */

// Treatment Plan interface for healthcare facility plan management
interface TreatmentPlan {
  id: string;
  planNumber: string;
  patientId?: string;
  patientName?: string;
  planTitle: string;
  program: string;
  startDate: string;
  endDate?: string;
  isActive: boolean;
  visits: number;
  createdDate: string;
  createdBy: string;
  supervisorReview?: {
    status: 'Pending' | 'Approved' | 'Rejected' | 'In Review';
    reviewDate?: string;
    reviewer?: string;
    comments?: string;
  };
  objectives: number;
  measures: number;
  isCompleted: boolean;
  lastModified: string;
  assignedTherapists: string[];
  planType: 'Individual' | 'Group' | 'Family';
  priority: 'Low' | 'Medium' | 'High' | 'Urgent';
  tags: string[];
  // Detailed plan information for row expansion
  planDetails?: {
    goal: string;
    objectivesList: {
      id: string;
      title: string;
      description: string;
      targetDate: string;
      status: 'Not Started' | 'In Progress' | 'Completed';
    }[];
    problemsList: {
      id: string;
      title: string;
      description: string;
      severity: 'Low' | 'Medium' | 'High';
      status: 'Active' | 'Resolved' | 'Monitoring';
    }[];
  };
}

// Function to determine if a plan is active based on end date
const isPlanActive = (endDate?: string): boolean => {
  if (!endDate) return true; // No end date means active
  const today = new Date();
  const planEndDate = new Date(endDate);
  return planEndDate >= today;
};

// Plan Details Dropdown Component for completed plans
const PlanDetailsDropdown: React.FC<{ 
  plan: TreatmentPlan;
}> = ({ plan }) => {
  const [isOpen, setIsOpen] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [position, setPosition] = useState({ top: 0, left: 0 });

  const calculatePosition = () => {
    if (buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      const dropdownWidth = 400; // Width of dropdown
      const dropdownHeight = 500; // Max height of dropdown
      const viewportHeight = window.innerHeight;
      const viewportWidth = window.innerWidth;
      
      // Try to position to the right of the icon first
      let leftPosition = rect.right + window.scrollX + 8; // 8px gap from icon
      
      // Check if dropdown would go off the right edge of screen
      if (leftPosition + dropdownWidth > window.scrollX + viewportWidth - 20) {
        // Position to the left of the icon instead
        leftPosition = rect.left + window.scrollX - dropdownWidth - 8;
      }
      
      // Center vertically relative to the icon, but keep within viewport
      let topPosition = rect.top + window.scrollY + (rect.height / 2) - (dropdownHeight / 2);
      
      // Ensure dropdown stays within viewport bounds
      const minTop = window.scrollY + 20; // 20px from top of viewport
      const maxTop = window.scrollY + viewportHeight - dropdownHeight - 20; // 20px from bottom
      
      topPosition = Math.max(minTop, Math.min(topPosition, maxTop));
      
      setPosition({
        top: topPosition,
        left: leftPosition
      });
    }
  };

  const handleMouseEnter = () => {
    calculatePosition();
    setIsOpen(true);
  };

  const handleMouseLeave = () => {
          setIsOpen(false);
  };

  // Add a slight delay before hiding to prevent flickering when moving between icon and dropdown
  const [hoverTimeout, setHoverTimeout] = useState<NodeJS.Timeout | null>(null);

  const handleMouseEnterWithDelay = () => {
    if (hoverTimeout) {
      clearTimeout(hoverTimeout);
      setHoverTimeout(null);
    }
    handleMouseEnter();
  };

  const handleMouseLeaveWithDelay = () => {
    const timeout = setTimeout(() => {
      handleMouseLeave();
    }, 150); // 150ms delay
    setHoverTimeout(timeout);
  };

  const handleDropdownMouseEnter = () => {
    if (hoverTimeout) {
      clearTimeout(hoverTimeout);
      setHoverTimeout(null);
    }
  };

  const handleDropdownMouseLeave = () => {
    handleMouseLeave();
  };

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (hoverTimeout) {
        clearTimeout(hoverTimeout);
      }
    };
  }, [hoverTimeout]);

  // Show info icon for all plans
  // For plans without detailed plan data, we'll show basic plan information

  return (
    <>
      <button
        ref={buttonRef}
        onMouseEnter={handleMouseEnterWithDelay}
        onMouseLeave={handleMouseLeaveWithDelay}
        className="p-1 rounded-full hover:bg-blue-50 transition-colors"
        title="View Plan Details"
      >
        <FontAwesomeIcon 
          icon={faInfoCircle} 
          className="w-4 h-4 text-blue-600 hover:text-blue-700" 
        />
      </button>

      {isOpen && createPortal(
        <div 
          id={`plan-details-dropdown-${plan.id}`}
          onMouseEnter={handleDropdownMouseEnter}
          onMouseLeave={handleDropdownMouseLeave}
          style={{
            position: 'fixed',
            top: position.top,
            left: position.left,
            width: '400px',
            backgroundColor: 'white',
            borderRadius: '8px',
            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
            border: '1px solid #e5e7eb',
            zIndex: 999999,
            padding: '16px',
            display: 'block',
            visibility: 'visible',
            maxHeight: '500px',
            overflowY: 'auto'
          }}
        >
          <div className="space-y-4">
            {/* Header */}
            <div className="border-b border-gray-100 pb-2">
              <h3 className="font-semibold text-gray-900 text-sm">Treatment Plan Details</h3>
              <p className="text-xs text-gray-500">{plan.planNumber} • {plan.planTitle}</p>
            </div>

            {/* Basic Plan Information */}
            <div>
              <h4 className="font-semibold text-gray-900 text-sm mb-2 flex items-center">
                <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                Plan Information
              </h4>
              <div className="bg-blue-50 p-3 rounded border space-y-2">
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div><span className="font-medium">Program:</span> {plan.program}</div>
                  <div><span className="font-medium">Type:</span> {plan.planType}</div>
                  <div><span className="font-medium">Priority:</span> {plan.priority}</div>
                  <div><span className="font-medium">Visits:</span> {plan.visits}</div>
                  <div><span className="font-medium">Objectives:</span> {plan.objectives}</div>
                  <div><span className="font-medium">Measures:</span> {plan.measures}</div>
                </div>
                <div className="text-xs">
                  <span className="font-medium">Assigned Therapists:</span> {plan.assignedTherapists.join(', ')}
                </div>
                {plan.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {plan.tags.map((tag: string, index: number) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Detailed Plan Information - Only if available */}
            {plan.planDetails && (
              <>
                {/* Goal Section */}
                <div>
                  <h4 className="font-semibold text-gray-900 text-sm mb-2 flex items-center">
                    <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                Treatment Goal
              </h4>
                  <p className="text-xs text-gray-700 leading-relaxed bg-green-50 p-3 rounded border">
                {plan.planDetails.goal}
              </p>
            </div>
            
            {/* Objectives Section */}
            <div>
              <h4 className="font-semibold text-gray-900 text-sm mb-2 flex items-center">
                    <span className="w-2 h-2 bg-orange-500 rounded-full mr-2"></span>
                Objectives ({plan.planDetails.objectivesList.length})
              </h4>
              <div className="space-y-2">
                {plan.planDetails.objectivesList.map((objective: any, index: number) => (
                      <div key={objective.id} className="bg-orange-50 p-2 rounded border">
                    <div className="flex items-center gap-1 mb-1">
                          <Badge variant="outline" className="text-xs bg-orange-100 text-orange-700 border-orange-200">
                        Obj {index + 1}
                      </Badge>
                      <Badge 
                        variant={objective.status === 'Completed' ? 'default' : 'secondary'}
                        className={`text-xs ${
                          objective.status === 'Completed' 
                            ? 'bg-green-100 text-green-800 border-green-200' 
                            : 'bg-yellow-100 text-yellow-800 border-yellow-200'
                        }`}
                      >
                        {objective.status}
                      </Badge>
                    </div>
                    <h5 className="font-medium text-gray-900 text-xs mb-1">{objective.title}</h5>
                    <p className="text-xs text-gray-600 leading-relaxed">{objective.description}</p>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Problems Section */}
            <div>
              <h4 className="font-semibold text-gray-900 text-sm mb-2 flex items-center">
                <span className="w-2 h-2 bg-red-500 rounded-full mr-2"></span>
                Problems ({plan.planDetails.problemsList.length})
              </h4>
              <div className="space-y-2">
                {plan.planDetails.problemsList.map((problem: any) => (
                  <div key={problem.id} className="bg-red-50 p-2 rounded border">
                    <div className="flex items-center gap-1 mb-1">
                      <Badge variant="outline" className="text-xs bg-red-100 text-red-700 border-red-200">
                        Problem
                      </Badge>
                      <Badge 
                        variant={problem.status === 'Resolved' ? 'default' : 'secondary'}
                        className={`text-xs ${
                          problem.status === 'Resolved' 
                            ? 'bg-green-100 text-green-800 border-green-200' 
                            : 'bg-orange-100 text-orange-800 border-orange-200'
                        }`}
                      >
                        {problem.status}
                      </Badge>
                      <Badge 
                        variant="outline"
                        className={`text-xs ${
                          problem.severity === 'High' 
                            ? 'bg-red-100 text-red-700 border-red-200'
                            : problem.severity === 'Medium'
                            ? 'bg-yellow-100 text-yellow-700 border-yellow-200'
                            : 'bg-gray-100 text-gray-700 border-gray-200'
                        }`}
                      >
                        {problem.severity}
                      </Badge>
                    </div>
                    <h5 className="font-medium text-gray-900 text-xs mb-1">{problem.title}</h5>
                    <p className="text-xs text-gray-600 leading-relaxed">{problem.description}</p>
                  </div>
                ))}
              </div>
            </div>
              </>
            )}
          </div>
        </div>,
        document.body
      )}
    </>
  );
};

// Mock treatment plan data for development and testing
const mockTreatmentPlans: TreatmentPlan[] = [
  {
    id: '1',
    planNumber: 'TP-2024-001',
    patientId: 'P001',
    patientName: 'John Smith',
    planTitle: 'Comprehensive Behavioral Intervention Plan',
    program: 'ABA Therapy',
    startDate: '2024-01-15',
    endDate: '2024-07-15', // Past end date - should be inactive
    isActive: isPlanActive('2024-07-15'),
    visits: 24,
    createdDate: '2024-01-10',
    createdBy: 'Sarah Johnson',
    supervisorReview: {
      status: 'Approved',
      reviewDate: '2024-01-12',
      reviewer: 'Michael Wilson',
      comments: 'Comprehensive plan with clear objectives'
    },
    objectives: 8,
    measures: 12,
    isCompleted: true, // Changed to completed to show expansion
    lastModified: '2024-01-20',
    assignedTherapists: ['Sarah Johnson', 'Mike Davis', 'Emily Chen'],
    planType: 'Individual',
    priority: 'High',
    tags: ['autism', 'behavioral', 'communication'],
    planDetails: {
      goal: 'Improve behavioral regulation and communication skills to enhance social interactions and reduce challenging behaviors in structured and unstructured environments.',
      objectivesList: [
        {
          id: 'obj-1',
          title: 'Reduce Aggressive Behaviors',
          description: 'Patient will demonstrate a 75% reduction in aggressive behaviors (hitting, kicking, throwing) during therapy sessions.',
          targetDate: '2024-04-15',
          status: 'Completed'
        },
        {
          id: 'obj-2',
          title: 'Improve Verbal Communication',
          description: 'Patient will use 2-3 word phrases to request preferred items in 80% of opportunities.',
          targetDate: '2024-05-15',
          status: 'Completed'
        },
        {
          id: 'obj-3',
          title: 'Enhance Social Interaction',
          description: 'Patient will initiate social interaction with peers at least 5 times per session.',
          targetDate: '2024-06-15',
          status: 'In Progress'
        }
      ],
      problemsList: [
        {
          id: 'prob-1',
          title: 'Aggressive Behavior Patterns',
          description: 'Patient exhibits frequent aggressive behaviors including hitting and throwing objects when frustrated.',
          severity: 'High',
          status: 'Resolved'
        },
        {
          id: 'prob-2',
          title: 'Limited Verbal Communication',
          description: 'Patient has difficulty expressing needs and wants verbally, leading to frustration.',
          severity: 'Medium',
          status: 'Monitoring'
        }
      ]
    }
  },
  {
    id: '2',
    planNumber: 'TP-2024-002',
    patientId: 'P002',
    patientName: 'Emily Davis',
    planTitle: 'Social Skills Development Program',
    program: 'Social Skills Training',
    startDate: '2024-01-20',
    endDate: undefined, // No end date - active
    isActive: isPlanActive(undefined),
    visits: 18,
    createdDate: '2024-01-18',
    createdBy: 'Amanda Rodriguez',
    supervisorReview: {
      status: 'In Review',
      reviewer: 'Michael Wilson'
    },
    objectives: 6,
    measures: 9,
    isCompleted: false,
    lastModified: '2024-01-22',
    assignedTherapists: ['Amanda Rodriguez', 'Lisa Park'],
    planType: 'Group',
    priority: 'Medium',
    tags: ['social-skills', 'group-therapy'],
    planDetails: {
      goal: 'Enhance social communication skills and peer interaction abilities to improve social relationships and reduce social isolation in structured and natural environments.',
      objectivesList: [
        {
          id: 'obj-13',
          title: 'Initiate Social Interactions',
          description: 'Patient will initiate conversations with peers using appropriate greetings and topic starters in 75% of opportunities.',
          targetDate: '2024-04-01',
          status: 'In Progress'
        },
        {
          id: 'obj-14',
          title: 'Maintain Conversations',
          description: 'Patient will engage in back-and-forth conversation for at least 5 exchanges with peers during group activities.',
          targetDate: '2024-05-01',
          status: 'In Progress'
        },
        {
          id: 'obj-15',
          title: 'Share and Take Turns',
          description: 'Patient will demonstrate appropriate turn-taking and sharing behaviors during group games and activities.',
          targetDate: '2024-03-15',
          status: 'Completed'
        },
        {
          id: 'obj-16',
          title: 'Express Emotions Appropriately',
          description: 'Patient will use appropriate words and tone to express feelings and emotions during social interactions.',
          targetDate: '2024-04-15',
          status: 'In Progress'
        },
        {
          id: 'obj-17',
          title: 'Follow Group Instructions',
          description: 'Patient will follow multi-step group instructions and participate in structured activities for 15+ minutes.',
          targetDate: '2024-03-30',
          status: 'Completed'
        },
        {
          id: 'obj-18',
          title: 'Problem-Solving with Peers',
          description: 'Patient will work collaboratively with peers to solve simple problems or complete group tasks.',
          targetDate: '2024-05-15',
          status: 'Not Started'
        }
      ],
      problemsList: [
        {
          id: 'prob-10',
          title: 'Social Communication Delays',
          description: 'Patient has difficulty initiating and maintaining appropriate social interactions with peers and adults.',
          severity: 'Medium',
          status: 'Active'
        },
        {
          id: 'prob-11',
          title: 'Limited Peer Relationships',
          description: 'Patient struggles to form and maintain friendships due to social skill deficits.',
          severity: 'Medium',
          status: 'Active'
        },
        {
          id: 'prob-12',
          title: 'Emotional Regulation in Social Settings',
          description: 'Patient becomes frustrated or overwhelmed in group settings when interactions don\'t go as expected.',
          severity: 'High',
          status: 'Monitoring'
        }
      ]
    }
  },
  {
    id: '3',
    planNumber: 'TP-2024-003',
    patientId: 'P003',
    patientName: 'Michael Johnson',
    planTitle: 'Completed Autism Spectrum Intervention',
    program: 'ABA Therapy',
    startDate: '2023-06-01',
    endDate: '2023-12-31',
    isActive: false,
    visits: 48,
    createdDate: '2023-05-25',
    createdBy: 'Jennifer Lee',
    supervisorReview: {
      status: 'Approved',
      reviewDate: '2023-05-28',
      reviewer: 'Michael Wilson',
      comments: 'Excellent progress achieved'
    },
    objectives: 10,
    measures: 15,
    isCompleted: true,
    lastModified: '2024-01-05',
    assignedTherapists: ['Jennifer Lee', 'Robert Kim'],
    planType: 'Individual',
    priority: 'High',
    tags: ['autism', 'completed', 'successful'],
    planDetails: {
      goal: 'Develop independent living skills and improve social communication abilities to support successful community integration and academic participation.',
      objectivesList: [
        {
          id: 'obj-4',
          title: 'Independent Task Completion',
          description: 'Patient will complete multi-step tasks independently with 90% accuracy across 3 consecutive sessions.',
          targetDate: '2023-09-30',
          status: 'Completed'
        },
        {
          id: 'obj-5',
          title: 'Social Communication Skills',
          description: 'Patient will engage in reciprocal conversation for 5+ exchanges with peers and adults.',
          targetDate: '2023-11-15',
          status: 'Completed'
        },
        {
          id: 'obj-6',
          title: 'Emotional Regulation',
          description: 'Patient will use coping strategies when experiencing frustration in 85% of observed situations.',
          targetDate: '2023-12-15',
          status: 'Completed'
        }
      ],
      problemsList: [
        {
          id: 'prob-3',
          title: 'Difficulty with Transitions',
          description: 'Patient shows resistance and anxiety when transitioning between activities or environments.',
          severity: 'Medium',
          status: 'Resolved'
        },
        {
          id: 'prob-4',
          title: 'Sensory Processing Issues',
          description: 'Patient demonstrates over-responsiveness to auditory and tactile stimuli affecting daily functioning.',
          severity: 'High',
          status: 'Resolved'
        },
        {
          id: 'prob-5',
          title: 'Limited Peer Interaction',
          description: 'Patient avoids social interactions with peers and prefers solitary activities.',
          severity: 'Medium',
          status: 'Resolved'
        }
      ]
    }
  },
  {
    id: '4',
    planNumber: 'TP-2024-004',
    patientId: 'P004',
    patientName: 'Sarah Wilson',
    planTitle: 'Family-Centered Behavioral Support',
    program: 'Family Therapy',
    startDate: '2024-02-01',
    endDate: '2025-02-01', // Future end date - should be active
    isActive: isPlanActive('2025-02-01'),
    visits: 12,
    createdDate: '2024-01-25',
    createdBy: 'Maria Garcia',
    supervisorReview: {
      status: 'Pending',
      reviewer: 'Michael Wilson'
    },
    objectives: 7,
    measures: 10,
    isCompleted: false,
    lastModified: '2024-02-03',
    assignedTherapists: ['Maria Garcia', 'David Thompson'],
    planType: 'Family',
    priority: 'Medium',
    tags: ['family-therapy', 'parent-training']
  },
  {
    id: '5',
    planNumber: 'TP-2024-005',
    patientId: 'P005',
    patientName: 'Alex Chen',
    planTitle: 'Communication Enhancement Program',
    program: 'Speech Therapy',
    startDate: '2024-03-01',
    endDate: '2024-09-01', // Future end date - should be active
    isActive: isPlanActive('2024-09-01'),
    visits: 32,
    createdDate: '2024-02-25',
    createdBy: 'Lisa Park',
    supervisorReview: {
      status: 'Approved',
      reviewDate: '2024-02-28',
      reviewer: 'Michael Wilson',
      comments: 'Excellent communication goals established'
    },
    objectives: 5,
    measures: 8,
    isCompleted: false,
    lastModified: '2024-03-15',
    assignedTherapists: ['Lisa Park', 'James Wilson'],
    planType: 'Individual',
    priority: 'High',
    tags: ['speech-therapy', 'communication', 'language']
  },
  {
    id: '6',
    planNumber: 'TP-2024-006',
    patientId: 'P006',
    patientName: 'Maya Patel',
    planTitle: 'Sensory Integration Therapy Plan',
    program: 'Occupational Therapy',
    startDate: '2024-01-10',
    endDate: '2024-05-10', // Past end date - should be inactive
    isActive: isPlanActive('2024-05-10'),
    visits: 28,
    createdDate: '2024-01-05',
    createdBy: 'Rachel Green',
    supervisorReview: {
      status: 'Approved',
      reviewDate: '2024-01-08',
      reviewer: 'Michael Wilson',
      comments: 'Comprehensive sensory assessment completed'
    },
    objectives: 6,
    measures: 11,
    isCompleted: false,
    lastModified: '2024-05-12',
    assignedTherapists: ['Rachel Green', 'Tom Anderson'],
    planType: 'Individual',
    priority: 'Medium',
    tags: ['occupational-therapy', 'sensory-integration'],
    planDetails: {
      goal: 'Improve sensory processing and motor planning skills to enhance participation in daily activities and reduce sensory-seeking and sensory-avoidant behaviors. Target 80% improvement in sensory regulation during structured activities.',
      objectivesList: [
        {
          id: 'obj1',
          title: 'Improve Tactile Processing',
          status: 'Completed',
          targetDate: '2024-03-10',
          description: 'Increase tolerance for various textures during play and daily activities without adverse reactions.'
        },
        {
          id: 'obj2',
          title: 'Enhance Proprioceptive Awareness',
          status: 'Completed',
          targetDate: '2024-04-10',
          description: 'Develop better body awareness and motor planning skills through proprioceptive activities.'
        },
        {
          id: 'obj3',
          title: 'Regulate Vestibular Input',
          status: 'Completed',
          targetDate: '2024-04-25',
          description: 'Improve balance and movement tolerance while maintaining organized behavior.'
        },
        {
          id: 'obj4',
          title: 'Develop Coping Strategies',
          status: 'Completed',
          targetDate: '2024-05-10',
          description: 'Learn and utilize self-regulation techniques when experiencing sensory overload.'
        }
      ],
      problemsList: [
        {
          id: 'prob1',
          title: 'Sensory Over-Responsivity',
          severity: 'High',
          status: 'Resolved',
          description: 'Extreme reactions to light touch, loud sounds, and visual stimuli affecting daily participation.'
        },
        {
          id: 'prob2',
          title: 'Motor Planning Difficulties',
          severity: 'Medium',
          status: 'Resolved',
          description: 'Challenges with coordinating movements for complex tasks and following multi-step activities.'
        },
        {
          id: 'prob3',
          title: 'Sensory Seeking Behaviors',
          severity: 'Medium',
          status: 'Resolved',
          description: 'Excessive movement seeking, jumping, and crashing behaviors that interfere with focused attention.'
        }
      ]
    }
  },
  {
    id: '7',
    planNumber: 'TP-2024-007',
    patientId: 'P007',
    patientName: 'Jordan Martinez',
    planTitle: 'Intensive Behavioral Support',
    program: 'ABA Therapy',
    startDate: '2024-04-01',
    endDate: '2024-09-01', // Changed to have end date
    isActive: isPlanActive('2024-09-01'),
    visits: 15,
    createdDate: '2024-03-25',
    createdBy: 'Kevin Brown',
    supervisorReview: {
      status: 'In Review',
      reviewer: 'Michael Wilson'
    },
    objectives: 9,
    measures: 14,
    isCompleted: false,
    lastModified: '2024-04-20',
    assignedTherapists: ['Kevin Brown', 'Sandra Lee'],
    planType: 'Individual',
    priority: 'Urgent',
    tags: ['aba-therapy', 'behavioral', 'intensive']
  },
  {
    id: '8',
    planNumber: 'TP-2023-015',
    patientId: 'P008',
    patientName: 'Emma Thompson',
    planTitle: 'Early Intervention Program',
    program: 'Early Intervention',
    startDate: '2023-09-01',
    endDate: '2024-03-01', // Past end date - should be inactive
    isActive: isPlanActive('2024-03-01'),
    visits: 42,
    createdDate: '2023-08-25',
    createdBy: 'Nancy White',
    supervisorReview: {
      status: 'Approved',
      reviewDate: '2023-08-30',
      reviewer: 'Michael Wilson',
      comments: 'Age-appropriate developmental goals set'
    },
    objectives: 8,
    measures: 12,
    isCompleted: true,
    lastModified: '2024-03-05',
    assignedTherapists: ['Nancy White', 'Peter Clark'],
    planType: 'Individual',
    priority: 'High',
    tags: ['early-intervention', 'developmental'],
    planDetails: {
      goal: 'Support early developmental milestones and prepare child for successful transition to preschool environment. Achieve 90% of age-appropriate developmental targets across all domains by program completion.',
      objectivesList: [
        {
          id: 'obj1',
          title: 'Language Development',
          status: 'Completed',
          targetDate: '2023-12-01',
          description: 'Increase expressive vocabulary to 100+ words and use 2-3 word phrases consistently.'
        },
        {
          id: 'obj2',
          title: 'Social Interaction Skills',
          status: 'Completed',
          targetDate: '2024-01-15',
          description: 'Engage in parallel play with peers and demonstrate joint attention behaviors.'
        },
        {
          id: 'obj3',
          title: 'Motor Skill Development',
          status: 'Completed',
          targetDate: '2024-02-01',
          description: 'Master age-appropriate fine and gross motor skills including walking up stairs and using utensils.'
        },
        {
          id: 'obj4',
          title: 'Self-Care Independence',
          status: 'Completed',
          targetDate: '2024-02-15',
          description: 'Develop basic self-care skills including feeding, toileting readiness, and following routines.'
        },
        {
          id: 'obj5',
          title: 'Cognitive Development',
          status: 'Completed',
          targetDate: '2024-03-01',
          description: 'Demonstrate problem-solving skills and understanding of cause-and-effect relationships.'
        }
      ],
      problemsList: [
        {
          id: 'prob1',
          title: 'Language Delays',
          severity: 'High',
          status: 'Resolved',
          description: 'Significant delays in expressive and receptive language development affecting communication.'
        },
        {
          id: 'prob2',
          title: 'Social Engagement Difficulties',
          severity: 'Medium',
          status: 'Resolved',
          description: 'Limited interest in social interactions and difficulty with peer engagement.'
        },
        {
          id: 'prob3',
          title: 'Motor Planning Challenges',
          severity: 'Medium',
          status: 'Resolved',
          description: 'Delays in fine and gross motor skill development affecting play and daily activities.'
        }
      ]
    }
  },
  {
    id: '9',
    planNumber: 'TP-2024-008',
    patientId: 'P009',
    patientName: 'Ryan O\'Connor',
    planTitle: 'Transition to Adulthood Support',
    program: 'Life Skills Training',
    startDate: '2024-06-01',
    endDate: '2025-06-01', // Future end date - should be active
    isActive: isPlanActive('2025-06-01'),
    visits: 8,
    createdDate: '2024-05-20',
    createdBy: 'Michelle Davis',
    supervisorReview: {
      status: 'Pending',
      reviewer: 'Michael Wilson'
    },
    objectives: 12,
    measures: 18,
    isCompleted: false,
    lastModified: '2024-06-15',
    assignedTherapists: ['Michelle Davis', 'Carlos Rodriguez'],
    planType: 'Individual',
    priority: 'Medium',
    tags: ['life-skills', 'vocational', 'transition']
  },
  {
    id: '10',
    planNumber: 'TP-2024-009',
    patientId: 'P010',
    patientName: 'Sophia Kim',
    planTitle: 'Group Social Skills Workshop',
    program: 'Group Therapy',
    startDate: '2024-07-01',
    endDate: '2024-09-01', // Changed to have end date
    isActive: isPlanActive('2024-09-01'),
    visits: 4,
    createdDate: '2024-06-25',
    createdBy: 'Amanda Rodriguez',
    supervisorReview: {
      status: 'Approved',
      reviewDate: '2024-06-28',
      reviewer: 'Michael Wilson',
      comments: 'Group dynamics assessment completed'
    },
    objectives: 4,
    measures: 6,
    isCompleted: false,
    lastModified: '2024-07-10',
    assignedTherapists: ['Amanda Rodriguez', 'Lisa Park'],
    planType: 'Group',
    priority: 'Low',
    tags: ['group-therapy', 'social-skills', 'peer-interaction']
  },
  {
    id: '11',
    planNumber: 'TP-2024-011',
    patientId: 'P011',
    patientName: 'Alex Thompson',
    planTitle: 'Physical Therapy Recovery Program',
    program: 'Physical Therapy',
    startDate: '2024-03-01',
    endDate: '2024-08-15', // Future end date - active
    isActive: isPlanActive('2024-08-15'),
    visits: 32,
    createdDate: '2024-02-25',
    createdBy: 'Jennifer Walsh',
    supervisorReview: {
      status: 'Approved',
      reviewDate: '2024-02-28',
      reviewer: 'Michael Wilson',
      comments: 'Post-injury rehabilitation plan approved'
    },
    objectives: 5,
    measures: 8,
    isCompleted: false,
    lastModified: '2024-07-20',
    assignedTherapists: ['Jennifer Walsh', 'Mark Stevens'],
    planType: 'Individual',
    priority: 'High',
    tags: ['physical-therapy', 'rehabilitation', 'recovery']
  },
  {
    id: '12',
    planNumber: 'TP-2024-012',
    patientId: 'P012',
    patientName: 'Sophia Chen',
    planTitle: 'Anxiety Management Protocol',
    program: 'Group Therapy',
    startDate: '2024-05-01',
    endDate: '2024-11-01', // Future end date - active
    isActive: isPlanActive('2024-11-01'),
    visits: 16,
    createdDate: '2024-04-28',
    createdBy: 'Lisa Park',
    supervisorReview: {
      status: 'In Review',
      reviewDate: '2024-07-15',
      reviewer: 'Michael Wilson',
      comments: 'Progress review scheduled for next month'
    },
    objectives: 6,
    measures: 9,
    isCompleted: false,
    lastModified: '2024-07-25',
    assignedTherapists: ['Lisa Park', 'David Kim', 'Sarah Martinez'],
    planType: 'Family',
    priority: 'Medium',
    tags: ['anxiety', 'family-therapy', 'group-support'],
    planDetails: {
      goal: 'Develop effective anxiety management strategies and coping mechanisms to reduce anxiety symptoms and improve family dynamics and social functioning.',
      objectivesList: [
        {
          id: 'obj-7',
          title: 'Anxiety Symptom Reduction',
          description: 'Patient will demonstrate a 50% reduction in anxiety symptoms as measured by standardized anxiety assessment tools.',
          targetDate: '2024-08-15',
          status: 'In Progress'
        },
        {
          id: 'obj-8',
          title: 'Coping Strategies Implementation',
          description: 'Patient will effectively use 3 different coping strategies (deep breathing, progressive muscle relaxation, cognitive restructuring) when experiencing anxiety.',
          targetDate: '2024-09-01',
          status: 'In Progress'
        },
        {
          id: 'obj-9',
          title: 'Family Communication Improvement',
          description: 'Family members will engage in effective communication patterns during sessions with 80% success rate.',
          targetDate: '2024-10-01',
          status: 'Not Started'
        },
        {
          id: 'obj-10',
          title: 'Social Interaction Increase',
          description: 'Patient will participate in group activities for at least 30 minutes per session without significant anxiety symptoms.',
          targetDate: '2024-09-15',
          status: 'In Progress'
        },
        {
          id: 'obj-11',
          title: 'Sleep Pattern Normalization',
          description: 'Patient will maintain consistent sleep schedule with 7-8 hours of sleep per night for 2 consecutive weeks.',
          targetDate: '2024-08-30',
          status: 'In Progress'
        },
        {
          id: 'obj-12',
          title: 'School Performance Stabilization',
          description: 'Patient will complete school assignments on time and maintain grades above 80% average.',
          targetDate: '2024-10-15',
          status: 'Not Started'
        }
      ],
      problemsList: [
        {
          id: 'prob-6',
          title: 'Generalized Anxiety Symptoms',
          description: 'Patient experiences persistent worry, restlessness, and physical symptoms of anxiety including rapid heartbeat and sweating.',
          severity: 'High',
          status: 'Active'
        },
        {
          id: 'prob-7',
          title: 'Social Withdrawal Behavior',
          description: 'Patient avoids social situations and group activities due to fear of judgment and increased anxiety.',
          severity: 'Medium',
          status: 'Active'
        },
        {
          id: 'prob-8',
          title: 'Sleep Disturbances',
          description: 'Patient has difficulty falling asleep and staying asleep due to racing thoughts and worry.',
          severity: 'Medium',
          status: 'Monitoring'
        },
        {
          id: 'prob-9',
          title: 'Family Stress and Conflict',
          description: 'Family experiences increased stress and conflict related to managing patient\'s anxiety symptoms.',
          severity: 'Medium',
          status: 'Active'
        }
      ]
    }
  },
  {
    id: '13',
    planNumber: 'TP-2023-045',
    patientId: 'P013',
    patientName: 'Marcus Williams',
    planTitle: 'Completed ADHD Management Plan',
    program: 'Behavioral Intervention',
    startDate: '2023-09-01',
    endDate: '2024-06-30', // Past end date - inactive
    isActive: isPlanActive('2024-06-30'),
    visits: 45,
    createdDate: '2023-08-25',
    createdBy: 'Kevin Brown',
    supervisorReview: {
      status: 'Approved',
      reviewDate: '2024-06-25',
      reviewer: 'Michael Wilson',
      comments: 'Successfully completed all objectives'
    },
    objectives: 7,
    measures: 14,
    isCompleted: true,
    lastModified: '2024-06-30',
    assignedTherapists: ['Kevin Brown', 'Amanda Rodriguez'],
    planType: 'Individual',
    priority: 'High',
    tags: ['adhd', 'behavioral', 'completed'],
    planDetails: {
      goal: 'Improve attention span, reduce hyperactive behaviors, and develop self-regulation strategies to enhance academic performance and social relationships. Target 85% improvement in focus and 70% reduction in disruptive behaviors.',
      objectivesList: [
        {
          id: 'obj1',
          title: 'Increase Sustained Attention',
          status: 'Completed',
          targetDate: '2024-01-30',
          description: 'Maintain focused attention on tasks for 20-30 minutes without frequent breaks or redirection.'
        },
        {
          id: 'obj2',
          title: 'Reduce Hyperactive Behaviors',
          status: 'Completed',
          targetDate: '2024-03-15',
          description: 'Decrease fidgeting, out-of-seat behaviors, and excessive talking during structured activities.'
        },
        {
          id: 'obj3',
          title: 'Develop Self-Monitoring Skills',
          status: 'Completed',
          targetDate: '2024-04-30',
          description: 'Use self-regulation techniques and recognize when losing focus or becoming overwhelmed.'
        },
        {
          id: 'obj4',
          title: 'Improve Academic Performance',
          status: 'Completed',
          targetDate: '2024-05-30',
          description: 'Complete assignments independently and demonstrate improved organization skills.'
        },
        {
          id: 'obj5',
          title: 'Enhance Social Interactions',
          status: 'Completed',
          targetDate: '2024-06-15',
          description: 'Follow social rules, take turns in conversations, and maintain appropriate peer relationships.'
        }
      ],
      problemsList: [
        {
          id: 'prob1',
          title: 'Attention Deficits',
          severity: 'High',
          status: 'Resolved',
          description: 'Significant difficulty maintaining focus on tasks, easily distracted by environmental stimuli.'
        },
        {
          id: 'prob2',
          title: 'Hyperactivity',
          severity: 'High',
          status: 'Resolved',
          description: 'Excessive motor activity, difficulty remaining seated, and impulsive behaviors.'
        },
        {
          id: 'prob3',
          title: 'Academic Challenges',
          severity: 'Medium',
          status: 'Resolved',
          description: 'Poor task completion, disorganization, and difficulty following multi-step instructions.'
        },
        {
          id: 'prob4',
          title: 'Social Difficulties',
          severity: 'Medium',
          status: 'Resolved',
          description: 'Interrupting others, difficulty waiting turns, and challenges maintaining friendships.'
        }
      ]
    }
  },
  {
    id: '14',
    planNumber: 'TP-2024-014',
    patientId: 'P014',
    patientName: 'Isabella Garcia',
    planTitle: 'Autism Spectrum Support Program',
    program: 'ABA Therapy',
    startDate: '2024-02-15',
    endDate: '2024-12-15', // Future end date - active
    isActive: isPlanActive('2024-12-15'),
    visits: 28,
    createdDate: '2024-02-10',
    createdBy: 'Amanda Rodriguez',
    supervisorReview: {
      status: 'Approved',
      reviewDate: '2024-02-12',
      reviewer: 'Michael Wilson',
      comments: 'Comprehensive autism support plan'
    },
    objectives: 9,
    measures: 15,
    isCompleted: false,
    lastModified: '2024-07-28',
    assignedTherapists: ['Amanda Rodriguez', 'Sarah Johnson', 'Tom Anderson'],
    planType: 'Individual',
    priority: 'Urgent',
    tags: ['autism', 'aba-therapy', 'sensory-integration']
  },
  {
    id: '15',
    planNumber: 'TP-2024-015',
    patientId: 'P015',
    patientName: 'Ethan Davis',
    planTitle: 'Short-Term Crisis Intervention',
    program: 'Behavioral Intervention',
    startDate: '2024-07-01',
    endDate: '2024-08-01', // Near future end date - active but ending soon
    isActive: isPlanActive('2024-08-01'),
    visits: 8,
    createdDate: '2024-06-28',
    createdBy: 'Rachel Green',
    supervisorReview: {
      status: 'Pending',
      reviewDate: undefined,
      reviewer: 'Michael Wilson',
      comments: 'Urgent intervention plan pending review'
    },
    objectives: 3,
    measures: 5,
    isCompleted: false,
    lastModified: '2024-07-30',
    assignedTherapists: ['Rachel Green', 'Lisa Park'],
    planType: 'Family',
    priority: 'Urgent',
    tags: ['crisis-intervention', 'short-term', 'urgent']
  }
];

// Program options for filtering
const allProgramOptions = [
  'ABA Therapy',
  'Speech Therapy', 
  'Occupational Therapy',
  'Physical Therapy',
  'Social Skills Training',
  'Group Therapy',
  'Family Therapy',
  'Parent Training',
  'Language Development',
  'Sensory Integration',
  'Behavioral Intervention',
  'Early Intervention',
  'Developmental Therapy',
  'Life Skills Training',
  'Vocational Therapy',
  'Peer Interaction'
];

// Plan type options for filtering
const allPlanTypeOptions = [
  'Individual',
  'Group', 
  'Family'
];

// Priority options for filtering
const allPriorityOptions = [
  'Low',
  'Medium',
  'High',
  'Urgent'
];

// Component props interface
interface InterdisciplinaryTreatmentPlanPageProps {
  onBack?: () => void;
  onNewPlan?: () => void; // Callback for when user wants to create a new plan
  treatmentPlansData?: any[]; // Treatment plans data from parent
  onTreatmentPlansChange?: (plans: any[]) => void; // Callback to update parent state
}

const InterdisciplinaryTreatmentPlanPage: React.FC<InterdisciplinaryTreatmentPlanPageProps> = ({ 
  onNewPlan, 
  treatmentPlansData, 
  onTreatmentPlansChange 
}) => {
  // State for filters and search
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPrograms, setSelectedPrograms] = useState<string[]>([]);
  const [selectedPlanTypes, setSelectedPlanTypes] = useState<string[]>([]);
  const [selectedPriorities, setSelectedPriorities] = useState<string[]>([]);
  const [includeInactivePlans, setIncludeInactivePlans] = useState(true);
  const [showSettingsChanges, setShowSettingsChanges] = useState(false);
  const [includeCompletedPlans, setIncludeCompletedPlans] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  
  // View state for table vs card view
  const [viewMode, setViewMode] = useState<'table' | 'card'>('table');
  
  // State for editing end dates
  const [editingEndDate, setEditingEndDate] = useState<{
    planId: string;
    value: string;
  } | null>(null);

  // State for expanded rows - tracks which rows are expanded

  
  // Initialize treatment plans from props or use mock data
  const [treatmentPlans, setTreatmentPlans] = useState(
    treatmentPlansData && treatmentPlansData.length > 0 ? treatmentPlansData : mockTreatmentPlans
  );
  
  // Sync parent data with full mock data on mount
  React.useEffect(() => {
    if (onTreatmentPlansChange && (!treatmentPlansData || treatmentPlansData.length <= 1)) {
      // Parent has minimal data, sync with full mock data
      onTreatmentPlansChange(mockTreatmentPlans);
      setTreatmentPlans(mockTreatmentPlans);
    }
  }, [onTreatmentPlansChange, treatmentPlansData]);
  
  // Update parent state when treatment plans change
  const updateTreatmentPlans = (newPlans: any[]) => {
    setTreatmentPlans(newPlans);
    if (onTreatmentPlansChange) {
      onTreatmentPlansChange(newPlans);
    }
  };
  
        // Use custom hook for active plan check
  const {
    showOngoingPlanWarning,
    ongoingPlans,
    handleNewPlanWithCheck,
    handleConfirmNewPlan,
    handleCancelNewPlan
  } = useOngoingPlanCheck();
  
  // Typeahead search states
  const [programSearch, setProgramSearch] = useState('');
  const [planTypeSearch, setPlanTypeSearch] = useState('');
  const [prioritySearch, setPrioritySearch] = useState('');
  
  // Filter options based on search
  const filteredProgramOptions = allProgramOptions.filter(program =>
    program.toLowerCase().includes(programSearch.toLowerCase()) &&
    !selectedPrograms.includes(program)
  );
  
  const filteredPlanTypeOptions = allPlanTypeOptions.filter(planType =>
    planType.toLowerCase().includes(planTypeSearch.toLowerCase()) &&
    !selectedPlanTypes.includes(planType)
  );
  
  const filteredPriorityOptions = allPriorityOptions.filter(priority =>
    priority.toLowerCase().includes(prioritySearch.toLowerCase()) &&
    !selectedPriorities.includes(priority)
  );
  
  // Helper functions for adding/removing filter options
  const addProgram = (program: string) => {
    setSelectedPrograms([...selectedPrograms, program]);
    setProgramSearch('');
  };
  
  const removeProgram = (program: string) => {
    setSelectedPrograms(selectedPrograms.filter(p => p !== program));
  };
  
  const addPlanType = (planType: string) => {
    setSelectedPlanTypes([...selectedPlanTypes, planType]);
    setPlanTypeSearch('');
  };
  
  const removePlanType = (planType: string) => {
    setSelectedPlanTypes(selectedPlanTypes.filter(p => p !== planType));
  };
  
  const addPriority = (priority: string) => {
    setSelectedPriorities([...selectedPriorities, priority]);
    setPrioritySearch('');
  };
  
  const removePriority = (priority: string) => {
    setSelectedPriorities(selectedPriorities.filter(p => p !== priority));
  };

  // Column definitions for AG Grid
  const columnDefs: any[] = [
    {
      headerName: 'Plans',
      field: 'planTitle',
      flex: 2,
      minWidth: 200,
      cellRenderer: (_params: any) => {
        try {
          const plan = _params.data;
          
          if (!plan || !plan.id) {
            console.warn('Invalid plan data in cell renderer:', plan);
            return <div className="py-2">Invalid data</div>;
          }
          
          return (
            <div className="py-2">
              <div className="flex items-center">
                {/* Dedicated space for info icon - always reserved */}
                <div className="w-6 flex justify-center">
                  <PlanDetailsDropdown plan={plan} />
                </div>
                
                {/* Plan content - consistently left-aligned */}
                <div className="flex-1 ml-2">
                  <div className="font-medium text-gray-900">{plan.planTitle}</div>
                  <div className="text-sm text-gray-500">#{plan.planNumber}</div>
                </div>
              </div>
            </div>
          );
        } catch (error) {
          console.error('Error in Plans cell renderer:', error, _params);
          return <div className="py-2">Error rendering cell</div>;
        }
      }
    },
    {
      headerName: 'Program',
      field: 'program',
      flex: 1.5,
      minWidth: 180,
      cellRenderer: (_params: any) => (
        <div className="py-2">
          <Badge variant="secondary" className="text-xs">
            {_params.data.program}
            </Badge>
        </div>
      )
    },
    {
      headerName: 'Start Date',
      field: 'startDate',
      flex: 1,
      minWidth: 120,
      cellRenderer: (_params: any) => (
        <div className="py-2">
          <div className="text-sm text-gray-900">
            {new Date(_params.data.startDate).toLocaleDateString()}
          </div>
        </div>
      )
    },
    {
      headerName: 'End Date',
      field: 'endDate',
      flex: 1,
      minWidth: 160,
      cellRenderer: (_params: any) => {
        const plan = _params.data;
        const isEditing = editingEndDate?.planId === plan.id;
        
        if (isEditing) {
          return (
            <div className="py-2 flex items-center gap-2">
              <Input
                type="date"
                value={editingEndDate?.value || ''}
                onChange={(e) => handleEndDateChange(e.target.value)}
                className="text-xs h-7 w-28"
                autoFocus
              />
              <Button
                size="sm"
                variant="outline"
                onClick={handleSaveEndDate}
                className="p-1 h-7 w-7"
              >
                <CheckIcon className="w-3 h-3 text-green-600" />
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={handleCancelEditEndDate}
                className="p-1 h-7 w-7"
              >
                <XMarkIcon className="w-3 h-3 text-red-600" />
              </Button>
            </div>
          );
        }
        
        return (
          <div className="py-2 flex items-center justify-between group">
            <div className="text-sm text-gray-900">
              {plan.endDate ? new Date(plan.endDate).toLocaleDateString() : ''}
            </div>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => handleStartEditEndDate(plan.id, plan.endDate)}
              className="opacity-0 group-hover:opacity-100 p-1 h-6 w-6 transition-opacity"
            >
              <PencilIcon className="w-3 h-3 text-gray-500" />
            </Button>
          </div>
        );
      }
    },
    {
      headerName: 'Status',
      field: 'isActive',
      flex: 1,
      minWidth: 100,
      cellRenderer: (_params: any) => {
        const plan = _params.data;
        const today = new Date();
        const endDate = plan.endDate ? new Date(plan.endDate) : null;
        
        let status = 'Active';
        let variant: 'default' | 'destructive' | 'secondary' | 'success' | 'outline' = 'default';
        
        // Determine status based on end date and active state
        if (!plan.endDate) {
          status = 'Active';
          variant = 'success';
        } else if (endDate && endDate < today) {
          status = 'Inactive';
          variant = 'secondary';
        } else if (!plan.isActive) {
          status = 'Inactive';
          variant = 'secondary';
        }
        
        return (
          <div className="py-2">
            <Badge variant={variant}>
              {status}
            </Badge>

          </div>
        );
      }
    },
    {
      headerName: 'Visits',
      field: 'visits',
      flex: 0.8,
      minWidth: 80,
      cellRenderer: (_params: any) => (
        <div className="py-2 text-center">
          <div className="text-sm font-medium text-gray-900">{_params.data.visits}</div>
        </div>
      )
    },
    {
      headerName: 'Created Date',
      field: 'createdDate',
      flex: 1,
      minWidth: 120,
      cellRenderer: (_params: any) => (
        <div className="py-2">
          <div className="text-sm text-gray-900">
            {new Date(_params.data.createdDate).toLocaleDateString()}
          </div>
          <div className="text-xs text-gray-500">
            by {_params.data.createdBy}
          </div>
        </div>
      )
    },
    {
      headerName: 'Supervisor Review Details',
      field: 'supervisorReview',
      flex: 1.5,
      minWidth: 180,
      cellRenderer: (params: any) => {
        const review = params.data.supervisorReview;
        if (!review) return <div className="py-2 text-sm text-gray-400">No review</div>;
        
        const statusColors: Record<string, 'default' | 'destructive' | 'secondary' | 'outline'> = {
          'Approved': 'default',
          'Rejected': 'destructive',
          'In Review': 'secondary',
          'Pending': 'outline'
        };
        
        return (
          <div className="py-2">
            <Badge variant={statusColors[review.status] || 'default'} className="mb-1">
              {review.status}
            </Badge>
            {review.reviewer && (
              <div className="text-xs text-gray-600">by {review.reviewer}</div>
            )}
            {review.reviewDate && (
              <div className="text-xs text-gray-500">
                {new Date(review.reviewDate).toLocaleDateString()}
              </div>
            )}
          </div>
        );
      }
    },
    {
      headerName: 'Actions Available',
      field: 'actions',
      width: 280,
      minWidth: 280,
      maxWidth: 280,
      pinned: 'right',
      suppressSizeToFit: true,
      cellRenderer: (_params: any) => (
        <TooltipProvider>
          <div className="py-2 flex flex-wrap gap-1">
            <TooltipRoot>
              <TooltipTrigger asChild>
                <Button size="sm" variant="outline" className="p-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50">
                  <FontAwesomeIcon icon={faEdit} className="w-3 h-3" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Edit Plan</p>
              </TooltipContent>
            </TooltipRoot>
            
            <TooltipRoot>
              <TooltipTrigger asChild>
                <Button size="sm" variant="outline" className="p-2 text-green-600 hover:text-green-700 hover:bg-green-50">
                  <FontAwesomeIcon icon={faChartLine} className="w-3 h-3" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Progress</p>
              </TooltipContent>
            </TooltipRoot>
            
            <TooltipRoot>
              <TooltipTrigger asChild>
                <Button size="sm" variant="outline" className="p-2 text-orange-600 hover:text-orange-700 hover:bg-orange-50">
                  <FontAwesomeIcon icon={faPowerOff} className="w-3 h-3" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Deactivate Plan</p>
              </TooltipContent>
            </TooltipRoot>
            
            <TooltipRoot>
              <TooltipTrigger asChild>
                <Button size="sm" variant="outline" className="p-2 text-gray-600 hover:text-gray-700 hover:bg-gray-50">
                  <FontAwesomeIcon icon={faEye} className="w-3 h-3" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Review Plan</p>
              </TooltipContent>
            </TooltipRoot>
            
            <TooltipRoot>
              <TooltipTrigger asChild>
                <Button size="sm" variant="outline" className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50">
                  <FontAwesomeIcon icon={faTrash} className="w-3 h-3" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Delete Plan</p>
              </TooltipContent>
            </TooltipRoot>
            
            <TooltipRoot>
              <TooltipTrigger asChild>
                <Button size="sm" variant="outline" className="p-2 text-purple-600 hover:text-purple-700 hover:bg-purple-50">
                  <FontAwesomeIcon icon={faPrint} className="w-3 h-3" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Print Plan</p>
              </TooltipContent>
            </TooltipRoot>
            
            <TooltipRoot>
              <TooltipTrigger asChild>
                <Button size="sm" variant="outline" className="p-2 text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50">
                  <FontAwesomeIcon icon={faSignature} className="w-3 h-3" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Request Person Signature</p>
              </TooltipContent>
            </TooltipRoot>
          </div>
        </TooltipProvider>
      )
    }
  ];



  // Grid options with custom row expansion
  const gridOptions: GridOptions = {
    defaultColDef: {
      resizable: true,
      sortable: true,
      filter: true
    },
    // rowHeight will be determined dynamically by getRowHeight
    headerHeight: 48,
    animateRows: true,
    pagination: false,
    domLayout: 'autoHeight',
    suppressRowHoverHighlight: false,
    rowSelection: 'multiple',
    suppressRowClickSelection: true,
    
    // Standard row height since we're using hover overlay instead of inline expansion
    rowHeight: 80
  };

  // Filter treatment plans based on search and filters
  const filteredTreatmentPlans = useMemo(() => {
    let filtered = treatmentPlans;

    // Search filter
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter(plan => 
        plan.planTitle.toLowerCase().includes(searchLower) ||
        plan.planNumber.toLowerCase().includes(searchLower) ||
        plan.program.toLowerCase().includes(searchLower) ||
        plan.createdBy.toLowerCase().includes(searchLower)
      );
    }

    // Program filter
    if (selectedPrograms.length > 0) {
      filtered = filtered.filter(plan => 
        selectedPrograms.includes(plan.program)
      );
    }

    // Plan type filter
    if (selectedPlanTypes.length > 0) {
      filtered = filtered.filter(plan => selectedPlanTypes.includes(plan.planType));
    }

    // Priority filter
    if (selectedPriorities.length > 0) {
      filtered = filtered.filter(plan => selectedPriorities.includes(plan.priority));
    }

    // Include inactive plans filter
    if (!includeInactivePlans) {
      filtered = filtered.filter(plan => plan.isActive);
    }

    // Include completed plans filter
    if (!includeCompletedPlans) {
      filtered = filtered.filter(plan => !plan.isCompleted);
    }

    // Sort plans to show Active plans at the top
    filtered = filtered.sort((a, b) => {
      // Determine status for plan a
      const aIsActive = !a.endDate || (a.endDate && new Date(a.endDate) >= new Date());
      // Determine status for plan b
      const bIsActive = !b.endDate || (b.endDate && new Date(b.endDate) >= new Date());
      
      // Active plans come first
      if (aIsActive && !bIsActive) return -1;
      if (!aIsActive && bIsActive) return 1;
      
      // If both have same status, sort by creation date (newest first)
      return new Date(b.createdDate).getTime() - new Date(a.createdDate).getTime();
    });

    return filtered;
  }, [treatmentPlans, searchTerm, selectedPrograms, selectedPlanTypes, selectedPriorities, includeInactivePlans, includeCompletedPlans]);

  // Use filtered treatment plans directly for now
  const gridRowData = filteredTreatmentPlans;

  // Check if any filters are active (different from default state)
  const hasActiveFilters = searchTerm || selectedPrograms.length > 0 || selectedPlanTypes.length > 0 || 
    selectedPriorities.length > 0 || !includeInactivePlans || showSettingsChanges || !includeCompletedPlans;

  // Handle refresh functionality
  const handleRefresh = () => {
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  };

  // Clear all filters
  const clearAllFilters = () => {
    setSearchTerm('');
    setSelectedPrograms([]);
    setSelectedPlanTypes([]);
    setSelectedPriorities([]);
    setIncludeInactivePlans(true);
    setShowSettingsChanges(false);
    setIncludeCompletedPlans(true);
    // Clear typeahead search states
    setProgramSearch('');
    setPlanTypeSearch('');
    setPrioritySearch('');
  };

  // Handle treatment plan selection
  const handleTreatmentPlanSelect = (plan: TreatmentPlan) => {
    console.log('Selected treatment plan:', plan);
  };

  // Note: New Plan button warning logic is now handled by the parent component (OldUI.tsx)
  // The real "New Plan" button in the UI calls the warning logic before navigation



  // Handle end date editing functions
  const handleStartEditEndDate = (planId: string, currentEndDate: string | undefined) => {
    setEditingEndDate({
      planId,
      value: currentEndDate ? new Date(currentEndDate).toISOString().split('T')[0] : ''
    });
  };

  const handleEndDateChange = (value: string) => {
    if (editingEndDate) {
      setEditingEndDate({ ...editingEndDate, value });
    }
  };

  const handleSaveEndDate = () => {
    if (editingEndDate && onTreatmentPlansChange) {
      const updatedPlans = treatmentPlans.map(plan => 
        plan.id === editingEndDate.planId 
          ? { ...plan, endDate: editingEndDate.value, lastModified: new Date().toISOString() }
          : plan
      );
      setTreatmentPlans(updatedPlans);
      onTreatmentPlansChange(updatedPlans);
    }
    setEditingEndDate(null);
  };

  const handleCancelEditEndDate = () => {
    setEditingEndDate(null);
  };



  return (
    <div className="min-h-full bg-gray-50 p-6 pt-0 pb-24">
      <div className="w-full max-w-7xl mx-auto">
        {/* Filters Section */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
          {/* Search Bar */}
          <div className="mb-4">
            <div className="relative">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                type="text"
                placeholder="Search treatment plans, patients, or programs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {/* Filter Controls */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
            {/* Program Filter */}
            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">Program</label>
              <div className="relative">
                <Input
                  type="text"
                  placeholder="Search programs..."
                  value={programSearch}
                  onChange={(e) => setProgramSearch(e.target.value)}
                  className="w-full"
                />
                
                {/* Search Results Overlay */}
                {programSearch && (
                  <div className="absolute top-full left-0 right-0 z-50 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                    {filteredProgramOptions.map((program) => (
                      <button
                        key={program}
                        onClick={() => addProgram(program)}
                        className="w-full text-left p-3 hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-b-0"
                      >
                        <div className="flex items-center justify-between">
                          <div className="font-medium text-sm">{program}</div>
                          <PlusIcon className="w-4 h-4 text-gray-400" />
                        </div>
                      </button>
                    ))}
                    {filteredProgramOptions.length === 0 && (
                      <p className="text-sm text-gray-500 text-center py-4">No matching programs found</p>
                    )}
                  </div>
                )}
              </div>
              
              {/* Selected Programs */}
              {selectedPrograms.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-1">
                  {selectedPrograms.map(program => (
                    <div key={program} className="flex items-center bg-blue-50 border border-blue-200 rounded-md px-2 py-1">
                      <span className="text-xs text-blue-700">{program}</span>
                      <button
                        onClick={() => removeProgram(program)}
                        className="ml-1 text-blue-600 hover:text-blue-800"
                      >
                        <XMarkIcon className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Plan Type Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Plan Type</label>
              <div className="relative">
                <Input
                  type="text"
                  placeholder="Search plan types..."
                  value={planTypeSearch}
                  onChange={(e) => setPlanTypeSearch(e.target.value)}
                  className="w-full"
                />
                
                {/* Search Results Overlay */}
                {planTypeSearch && (
                  <div className="absolute top-full left-0 right-0 z-50 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                    {filteredPlanTypeOptions.map((planType) => (
                      <button
                        key={planType}
                        onClick={() => addPlanType(planType)}
                        className="w-full text-left p-3 hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-b-0"
                      >
                        <div className="flex items-center justify-between">
                          <div className="font-medium text-sm">{planType}</div>
                          <PlusIcon className="w-4 h-4 text-gray-400" />
                        </div>
                      </button>
                    ))}
                    {filteredPlanTypeOptions.length === 0 && (
                      <p className="text-sm text-gray-500 text-center py-4">No matching plan types found</p>
                    )}
                  </div>
                )}
              </div>
              
              {/* Selected Plan Types */}
              {selectedPlanTypes.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-1">
                  {selectedPlanTypes.map(planType => (
                    <div key={planType} className="flex items-center bg-green-50 border border-green-200 rounded-md px-2 py-1">
                      <span className="text-xs text-green-700">{planType}</span>
                      <button
                        onClick={() => removePlanType(planType)}
                        className="ml-1 text-green-600 hover:text-green-800"
                      >
                        <XMarkIcon className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Priority Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Priority</label>
              <div className="relative">
                <Input
                  type="text"
                  placeholder="Search priorities..."
                  value={prioritySearch}
                  onChange={(e) => setPrioritySearch(e.target.value)}
                  className="w-full"
                />
                
                {/* Search Results Overlay */}
                {prioritySearch && (
                  <div className="absolute top-full left-0 right-0 z-50 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                    {filteredPriorityOptions.map((priority) => (
                      <button
                        key={priority}
                        onClick={() => addPriority(priority)}
                        className="w-full text-left p-3 hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-b-0"
                      >
                        <div className="flex items-center justify-between">
                          <div className="font-medium text-sm">{priority}</div>
                          <PlusIcon className="w-4 h-4 text-gray-400" />
                        </div>
                      </button>
                    ))}
                    {filteredPriorityOptions.length === 0 && (
                      <p className="text-sm text-gray-500 text-center py-4">No matching priorities found</p>
                    )}
                  </div>
                )}
              </div>
              
              {/* Selected Priorities */}
              {selectedPriorities.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-1">
                  {selectedPriorities.map(priority => (
                    <div key={priority} className="flex items-center bg-purple-50 border border-purple-200 rounded-md px-2 py-1">
                      <span className="text-xs text-purple-700">{priority}</span>
                      <button
                        onClick={() => removePriority(priority)}
                        className="ml-1 text-purple-600 hover:text-purple-800"
                      >
                        <XMarkIcon className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Checkbox Filters */}
          <div className="flex flex-wrap gap-6 mb-4">
            <div className="flex items-center">
              <Checkbox
                id="includeInactive"
                checked={includeInactivePlans}
                onCheckedChange={setIncludeInactivePlans}
              />
              <label htmlFor="includeInactive" className="ml-2 text-sm text-gray-700">
                Include Inactive Plans
              </label>
            </div>

            <div className="flex items-center">
              <Checkbox
                id="showSettings"
                checked={showSettingsChanges}
                onCheckedChange={setShowSettingsChanges}
              />
              <label htmlFor="showSettings" className="ml-2 text-sm text-gray-700">
                Show Settings Changes
              </label>
            </div>

            <div className="flex items-center">
              <Checkbox
                id="includeCompleted"
                checked={includeCompletedPlans}
                onCheckedChange={setIncludeCompletedPlans}
              />
              <label htmlFor="includeCompleted" className="ml-2 text-sm text-gray-700">
                Include Completed Plans/Objectives/Measures
              </label>
            </div>
          </div>

          {/* Filter Actions */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600">
                {filteredTreatmentPlans.length} of {treatmentPlans.length} plans
              </span>
              {hasActiveFilters && (
                <Button variant="outline" size="sm" onClick={clearAllFilters}>
                  <XMarkIcon className="w-4 h-4 mr-1" />
                  Clear Filters
                </Button>
              )}
            </div>
            <div className="flex items-center gap-3">
              {/* View Mode Tab Bar */}
              <div className="flex bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setViewMode('table')}
                  className={`flex items-center px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                    viewMode === 'table'
                      ? 'bg-white text-gray-900 shadow-sm'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <FontAwesomeIcon icon={faTable} className="w-4 h-4 mr-1.5" />
                  Table
                </button>
                <button
                  onClick={() => setViewMode('card')}
                  className={`flex items-center px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                    viewMode === 'card'
                      ? 'bg-white text-gray-900 shadow-sm'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <FontAwesomeIcon icon={faThLarge} className="w-4 h-4 mr-1.5" />
                  Card
                </button>
              </div>
              
            <Button variant="outline" size="sm" onClick={handleRefresh} disabled={isLoading}>
              <ArrowPathIcon className={`w-4 h-4 mr-1 ${isLoading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
            </div>
          </div>

          {/* Content Section - Table or Card View */}
          <div className="mt-6">
            {isLoading ? (
              <div className="p-6">
                <TableSkeleton />
              </div>
            ) : viewMode === 'table' ? (
              <div className="h-[600px]">
                <DataTable
                  columnDefs={columnDefs}
                  rowData={gridRowData}
                  gridOptions={gridOptions}
                  className="ag-theme-alpine h-full"
              />
            </div>
            ) : (
              /* Enhanced Horizontal Card View */
            <div className="space-y-4">
                {filteredTreatmentPlans.map((plan) => {
                    const today = new Date();
                    const endDate = plan.endDate ? new Date(plan.endDate) : null;
                    
                    let status = 'Active';
                  let variant: 'default' | 'destructive' | 'secondary' | 'success' | 'outline' = 'default';
                    
                    if (!plan.endDate) {
                    status = 'Active';
                    variant = 'success';
                    } else if (endDate && endDate < today) {
                    status = 'Inactive';
                      variant = 'secondary';
                    } else if (!plan.isActive) {
                      status = 'Inactive';
                    variant = 'secondary';
                    }
                    
                    return (
                    <div
                      key={plan.id}
                      className="bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200"
                    >
                      {/* Compact Horizontal Layout */}
                      <div className="p-4">
                        {/* Header Row - Title with Status Badge, Actions */}
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center">
                            <div className="flex items-center justify-center w-8 h-8 bg-blue-50 rounded-lg border border-blue-200">
                              <FontAwesomeIcon icon={faClipboardList} className="w-4 h-4 text-blue-600" />
                            </div>
                            <div className="ml-2">
                              <div className="flex items-center gap-2">
                                <h3 className="font-semibold text-gray-900 text-lg leading-tight">{plan.planTitle}</h3>
                                <Badge variant={variant} className="text-sm px-3 py-1 font-medium">
                          {status}
                        </Badge>
                          </div>
                              <p className="text-xs text-gray-600">#{plan.planNumber}</p>
                      </div>
                </div>
                          <div className="flex items-center gap-1">
                <TooltipProvider>
                    <TooltipRoot>
                      <TooltipTrigger asChild>
                                    <Button 
                                      size="sm" 
                                      variant="outline" 
                                      className="p-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        // Handle edit action
                                      }}
                                    >
                          <FontAwesomeIcon icon={faEdit} className="w-3 h-3" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Edit Plan</p>
                      </TooltipContent>
                    </TooltipRoot>
                    
                    <TooltipRoot>
                      <TooltipTrigger asChild>
                                    <Button 
                                      size="sm" 
                                      variant="outline" 
                                      className="p-2 text-green-600 hover:text-green-700 hover:bg-green-50"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        // Handle progress action
                                      }}
                                    >
                          <FontAwesomeIcon icon={faChartLine} className="w-3 h-3" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Progress</p>
                      </TooltipContent>
                    </TooltipRoot>
                    
                    <TooltipRoot>
                      <TooltipTrigger asChild>
                                    <Button 
                                      size="sm" 
                                      variant="outline" 
                                      className="p-2 text-orange-600 hover:text-orange-700 hover:bg-orange-50"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        // Handle deactivate action
                                      }}
                                    >
                          <FontAwesomeIcon icon={faPowerOff} className="w-3 h-3" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Deactivate Plan</p>
                      </TooltipContent>
                    </TooltipRoot>
                    
                    <TooltipRoot>
                      <TooltipTrigger asChild>
                                    <Button 
                                      size="sm" 
                                      variant="outline" 
                                      className="p-2 text-gray-600 hover:text-gray-700 hover:bg-gray-50"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        // Handle review action
                                      }}
                                    >
                          <FontAwesomeIcon icon={faEye} className="w-3 h-3" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Review Plan</p>
                      </TooltipContent>
                    </TooltipRoot>
                    
                    <TooltipRoot>
                      <TooltipTrigger asChild>
                                    <Button 
                                      size="sm" 
                                      variant="outline" 
                                      className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        // Handle delete action
                                      }}
                                    >
                          <FontAwesomeIcon icon={faTrash} className="w-3 h-3" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Delete Plan</p>
                      </TooltipContent>
                    </TooltipRoot>
                    
                    <TooltipRoot>
                      <TooltipTrigger asChild>
                                    <Button 
                                      size="sm" 
                                      variant="outline" 
                                      className="p-2 text-purple-600 hover:text-purple-700 hover:bg-purple-50"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        // Handle print action
                                      }}
                                    >
                          <FontAwesomeIcon icon={faPrint} className="w-3 h-3" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Print Plan</p>
                      </TooltipContent>
                    </TooltipRoot>
                    
                    <TooltipRoot>
                      <TooltipTrigger asChild>
                                    <Button 
                                      size="sm" 
                                      variant="outline" 
                                      className="p-2 text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        // Handle signature request action
                                      }}
                                    >
                          <FontAwesomeIcon icon={faSignature} className="w-3 h-3" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Request Person Signature</p>
                      </TooltipContent>
                    </TooltipRoot>
                </TooltipProvider>
              </div>
                        </div>

                        {/* Plan Details Table */}
                        <div className="mb-3">
                          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                            <table className="w-full text-xs">
                              <tbody>
                                <tr className="border-b border-gray-200">
                                  <td className="px-3 py-2 font-medium text-gray-600 bg-gray-100 w-24">Program</td>
                                  <td className="px-3 py-2">
                                    <Badge variant="outline" className="text-xs px-2 py-0.5">{plan.program}</Badge>
                                  </td>
                                  <td className="px-3 py-2 font-medium text-gray-600 bg-gray-100 w-20">Type</td>
                                  <td className="px-3 py-2">
                                    <Badge variant="outline" className="text-xs px-2 py-0.5">{plan.planType}</Badge>
                                  </td>
                                  <td className="px-3 py-2 font-medium text-gray-600 bg-gray-100 w-20">Priority</td>
                                  <td className="px-3 py-2">
                                    <Badge 
                                      variant="outline" 
                                      className={`text-xs px-2 py-0.5 ${
                                        plan.priority === 'Urgent' ? 'border-red-300 text-red-700 bg-red-50' :
                                        plan.priority === 'High' ? 'border-orange-300 text-orange-700 bg-orange-50' :
                                        plan.priority === 'Medium' ? 'border-yellow-300 text-yellow-700 bg-yellow-50' :
                                        'border-gray-300 text-gray-700 bg-gray-50'
                                      }`}
                                    >
                                      {plan.priority}
                                    </Badge>
                                  </td>
                                </tr>
                                <tr className="border-b border-gray-200">
                                  <td className="px-3 py-2 font-medium text-gray-600 bg-gray-100">Visits</td>
                                  <td className="px-3 py-2">
                                    <span className="text-sm font-bold text-blue-600">{plan.visits}</span>
                                  </td>
                                  <td className="px-3 py-2 font-medium text-gray-600 bg-gray-100">Objectives</td>
                                  <td className="px-3 py-2">
                                    <span className="text-sm font-bold text-green-600">{plan.objectives}</span>
                                  </td>
                                  <td className="px-3 py-2 font-medium text-gray-600 bg-gray-100">Measures</td>
                                  <td className="px-3 py-2">
                                    <span className="text-sm font-bold text-purple-600">{plan.measures}</span>
                                  </td>
                                </tr>
                                <tr className="border-b border-gray-200">
                                  <td className="px-3 py-2 font-medium text-gray-600 bg-gray-100">Start Date</td>
                                  <td className="px-3 py-2 text-gray-900">{new Date(plan.startDate).toLocaleDateString()}</td>
                                  <td className="px-3 py-2 font-medium text-gray-600 bg-gray-100">End Date</td>
                                  <td className="px-3 py-2 text-gray-900">{plan.endDate ? new Date(plan.endDate).toLocaleDateString() : ''}</td>
                                  <td className="px-3 py-2 font-medium text-gray-600 bg-gray-100">Created</td>
                                  <td className="px-3 py-2 text-gray-900">{new Date(plan.createdDate).toLocaleDateString()}</td>
                                </tr>
                                <tr className="border-b border-gray-200">
                                  <td className="px-3 py-2 font-medium text-gray-600 bg-gray-100">Created By</td>
                                  <td className="px-3 py-2 text-gray-900 font-medium">{plan.createdBy}</td>
                                  <td className="px-3 py-2 font-medium text-gray-600 bg-gray-100">Supervisor Review</td>
                                  <td colSpan={3} className="px-3 py-2">
                                    {plan.supervisorReview ? (
                                      <div className="flex items-center gap-3">
                                        <Badge 
                                          variant={(() => {
                                            const statusMap: Record<string, 'default' | 'destructive' | 'secondary' | 'outline'> = {
                                              'Approved': 'default',
                                              'Rejected': 'destructive',
                                              'In Review': 'secondary',
                                              'Pending': 'outline'
                                            };
                                            return statusMap[plan.supervisorReview.status] || 'default';
                                          })()}
                                          className="text-xs px-2 py-1"
                                        >
                                          {plan.supervisorReview.status}
                                        </Badge>
                                        {plan.supervisorReview.reviewer && (
                                          <span className="text-xs text-gray-600">by {plan.supervisorReview.reviewer}</span>
                                        )}
                                        {plan.supervisorReview.reviewDate && (
                                          <span className="text-xs text-gray-500">
                                            {new Date(plan.supervisorReview.reviewDate).toLocaleDateString()}
                                          </span>
                                        )}
                                      </div>
                                    ) : (
                                      <span className="text-xs text-gray-500">No review</span>
                                    )}
                                  </td>
                                </tr>
                                {plan.tags.length > 0 && (
                                  <tr>
                                    <td className="px-3 py-2 font-medium text-gray-600 bg-gray-100">Tags</td>
                                    <td colSpan={5} className="px-3 py-2">
                                      <div className="flex flex-wrap gap-1">
                                        {plan.tags.slice(0, 5).map((tag: string, index: number) => (
                                          <Badge key={index} variant="outline" className="text-xs px-1 py-0 bg-orange-50 border-orange-200 text-orange-700">
                                            {tag}
                                          </Badge>
                                        ))}
                                        {plan.tags.length > 5 && (
                                          <Badge variant="outline" className="text-xs px-1 py-0">
                                            +{plan.tags.length - 5}
                                          </Badge>
                                        )}
            </div>
                                    </td>
                                  </tr>
                                )}
                              </tbody>
                            </table>
          </div>
          </div>



                        {/* Treatment Plan Details - Horizontal Multi-Column Layout */}
                        {plan.planDetails && (
                          <div className="border-t border-gray-200 mt-3 -mx-4 -mb-4 bg-zinc-50/50  p-4 rounded-b-lg">
                            <h4 className="font-medium text-gray-900 text-xs mb-3 text-indigo-700 uppercase tracking-wide">
                              Treatment Plan Details
                            </h4>
                            
                            <div className="grid grid-cols-3 gap-6">
                              {/* Goal Column */}
                              <div>
                                <div className="flex items-center mb-2">
                                  <span className="text-xs font-semibold text-indigo-700 uppercase tracking-wide">Goal</span>
                                </div>
                                <div className="bg-white p-3 rounded border border-gray-200 border-l-2 border-l-indigo-500">
                                  <p className="text-xs text-gray-700 leading-relaxed">
                                    {plan.planDetails.goal}
                                  </p>
        </div>
      </div>

                              {/* Objectives Column */}
                              <div>
                                <div className="flex items-center justify-between mb-2">
                                  <span className="text-xs font-semibold text-green-700 uppercase tracking-wide">Objectives</span>
                                  <Badge variant="outline" className="text-xs px-2 py-0.5 bg-green-50 text-green-700">
                                    {plan.planDetails.objectivesList.length} items
                                  </Badge>
                                </div>
                                <div className="space-y-2 max-h-32 overflow-y-auto">
                                  {plan.planDetails.objectivesList.slice(0, 3).map((objective: any, index: number) => (
                                    <div key={objective.id} className="bg-white p-2 rounded border border-gray-200 border-l-2 border-l-green-500">
                                      <div className="flex items-center justify-between mb-1">
                                        <span className="text-xs font-medium text-green-800">
                                          {index + 1}. {objective.title}
                                        </span>
                                        <Badge 
                                          variant="outline"
                                          className={`text-xs px-1.5 py-0.5 ${
                                            objective.status === 'Completed' 
                                              ? 'bg-green-100 text-green-800 border-green-300' 
                                              : objective.status === 'In Progress'
                                              ? 'bg-yellow-100 text-yellow-800 border-yellow-300'
                                              : 'bg-gray-100 text-gray-800 border-gray-300'
                                          }`}
                                        >
                                          {objective.status === 'In Progress' ? 'IP' : 
                                           objective.status === 'Completed' ? 'C' : 'NS'}
                                        </Badge>
                                      </div>
                                      <p className="text-xs text-gray-600 leading-relaxed">{objective.description}</p>
                                    </div>
                                  ))}
                                  {plan.planDetails.objectivesList.length > 3 && (
                                    <div className="text-xs text-green-700 font-medium text-center py-1">
                                      +{plan.planDetails.objectivesList.length - 3} more objectives
                                    </div>
                                  )}
                                </div>
                              </div>

                              {/* Problems Column */}
                              <div>
                                <div className="flex items-center justify-between mb-2">
                                  <span className="text-xs font-semibold text-red-700 uppercase tracking-wide">Problems</span>
                                  <Badge variant="outline" className="text-xs px-2 py-0.5 bg-red-50 text-red-700">
                                    {plan.planDetails.problemsList.length} items
                                  </Badge>
                                </div>
                                <div className="space-y-2 max-h-32 overflow-y-auto">
                                  {plan.planDetails.problemsList.slice(0, 3).map((problem: any) => (
                                    <div key={problem.id} className="bg-white p-2 rounded border border-gray-200 border-l-2 border-l-red-500">
                                      <div className="flex items-center justify-between mb-1">
                                        <span className="text-xs font-medium text-red-800">{problem.title}</span>
                                        <div className="flex items-center gap-1">
                                          <Badge 
                                            variant="outline"
                                            className={`text-xs px-1.5 py-0.5 ${
                                              problem.severity === 'High' 
                                                ? 'bg-red-100 text-red-700 border-red-300'
                                                : problem.severity === 'Medium'
                                                ? 'bg-yellow-100 text-yellow-700 border-yellow-300'
                                                : 'bg-gray-100 text-gray-700 border-gray-300'
                                            }`}
                                          >
                                            {problem.severity}
                                          </Badge>
                                          <Badge 
                                            variant="outline"
                                            className={`text-xs px-1.5 py-0.5 ${
                                              problem.status === 'Resolved' 
                                                ? 'bg-green-100 text-green-800 border-green-300' 
                                                : problem.status === 'Active'
                                                ? 'bg-orange-100 text-orange-800 border-orange-300'
                                                : 'bg-blue-100 text-blue-800 border-blue-300'
                                            }`}
                                          >
                                            {problem.status}
                                          </Badge>
                                        </div>
                                      </div>
                                      <p className="text-xs text-gray-600 leading-relaxed">{problem.description}</p>
                                    </div>
                                  ))}
                                  {plan.planDetails.problemsList.length > 3 && (
                                    <div className="text-xs text-red-700 font-medium text-center py-1">
                                      +{plan.planDetails.problemsList.length - 3} more problems
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>

                      {/* Active Plan Warning Dialog */}
      <ConfirmDialog
        isOpen={showOngoingPlanWarning}
        onClose={handleCancelNewPlan}
        onConfirm={handleConfirmNewPlan}
                        title="Active Plans Detected"
                        message={`You have ${ongoingPlans.length} active treatment plan${ongoingPlans.length > 1 ? 's' : ''} without end dates. Creating a new plan while existing plans are active may cause conflicts. Would you like to proceed anyway?`}
        confirmButtonText="Proceed"
      />
    </div>
  );
};

export default InterdisciplinaryTreatmentPlanPage;
