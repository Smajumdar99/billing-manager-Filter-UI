import { FC } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/molecules/Tabs/tabs';
import { ScrollArea } from '@/components/atoms/ScrollArea/scroll-area';
import { Badge } from '@/components/atoms/Badge/badge';
import { formatDistanceToNow } from 'date-fns';
import { ExclamationTriangleIcon, CalendarIcon, UserIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline';

interface ProblemsWidgetProps {
  patientId: string;
  className?: string;
  onEditProblem?: (problem: Problem) => void;
  onDeleteProblem?: (problemId: string) => void;
}

interface Problem {
  id: string;
  coding: string;
  title: string;
  details: string;
  priority: 'High' | 'Medium' | 'Low' | 'Urgent';
  status: 'active' | 'resolved' | 'deferred' | 'ongoing';
  beginDate: string;
  endDate?: string;
  provider: string;
  lastUpdated: string;
  outcome?: string;
  relatedTo?: string;
  accessPrograms?: string;
}

// Mock problems data for demonstration
const mockProblems: Problem[] = [
  {
    id: '1',
    coding: 'P001',
    title: 'Increased Freedom from Substances',
    details: 'Patient struggling with substance use affecting daily functioning and relationships',
    priority: 'High',
    status: 'active',
    beginDate: '2024-01-15',
    provider: 'Sarah Chen, LCSW',
    lastUpdated: '2024-01-20T10:30:00Z',
    relatedTo: 'Substance Use Disorder',
    accessPrograms: 'Outpatient Therapy, Group Therapy'
  },
  {
    id: '2',
    coding: 'P002',
    title: 'Stable Emotional/Behavioral Functioning',
    details: 'Patient exhibits mood swings and behavioral challenges that interfere with treatment progress',
    priority: 'High',
    status: 'active',
    beginDate: '2024-01-10',
    provider: 'James Wilson, LMFT',
    lastUpdated: '2024-01-18T14:20:00Z',
    relatedTo: 'Mood Disorder',
    accessPrograms: 'Individual Therapy, Medication Management'
  },
  {
    id: '3',
    coding: 'P003',
    title: 'Effective Social Functioning',
    details: 'Patient has difficulty maintaining healthy relationships and social interactions',
    priority: 'Medium',
    status: 'ongoing',
    beginDate: '2024-01-05',
    provider: 'Lisa Martinez, LCSW',
    lastUpdated: '2024-01-16T11:15:00Z',
    relatedTo: 'Social Anxiety',
    accessPrograms: 'Social Skills Training, Group Therapy'
  },
  {
    id: '4',
    coding: 'P004',
    title: 'Reduced Family Stress',
    details: 'Family dynamics causing stress and impacting patient\'s recovery process',
    priority: 'Medium',
    status: 'active',
    beginDate: '2023-12-20',
    provider: 'Maria Rodriguez, LMHC',
    lastUpdated: '2024-01-12T09:45:00Z',
    relatedTo: 'Family Conflict',
    accessPrograms: 'Family Therapy, Parent Training'
  },
  {
    id: '5',
    coding: 'P005',
    title: 'Improved Physical Health',
    details: 'Patient needs to address physical health concerns that impact mental health treatment',
    priority: 'Low',
    status: 'resolved',
    beginDate: '2023-11-15',
    endDate: '2024-01-10',
    provider: 'Robert Kim, LCPC',
    lastUpdated: '2024-01-10T16:30:00Z',
    outcome: 'Patient successfully established primary care routine and improved physical health markers',
    relatedTo: 'Physical Health',
    accessPrograms: 'Medical Coordination'
  }
];

/**
 * ProblemsWidget Component
 * 
 * Displays patient problems in a comprehensive widget format.
 * Shows active problems, resolved problems, and problem history.
 * Follows Apple-style design principles with clean, professional healthcare UI.
 * 
 * Features:
 * - Tabbed interface for different problem views
 * - Priority-based color coding
 * - Status indicators with appropriate styling
 * - Provider information and timestamps
 * - Detailed problem information with outcomes
 */
const ProblemsWidget: FC<ProblemsWidgetProps> = ({ patientId: _patientId, className, onEditProblem, onDeleteProblem }) => {
  // Filter problems by status for different tabs
  const activeProblems = mockProblems.filter(p => p.status === 'active' || p.status === 'ongoing');
  const resolvedProblems = mockProblems.filter(p => p.status === 'resolved');
  const deferredProblems = mockProblems.filter(p => p.status === 'deferred');

  // Handler functions for problem actions
  const handleEditProblem = (problemId: string) => {
    const problem = mockProblems.find(p => p.id === problemId);
    if (problem && onEditProblem) {
      onEditProblem(problem);
    } else {
      console.log('Edit problem:', problemId);
    }
  };

  const handleDeleteProblem = (problemId: string) => {
    if (onDeleteProblem) {
      onDeleteProblem(problemId);
    } else {
      console.log('Delete problem:', problemId);
    }
  };

  // Get priority badge variant
  const getPriorityVariant = (priority: string) => {
    switch (priority) {
      case 'Urgent': return 'destructive';
      case 'High': return 'destructive';
      case 'Medium': return 'default';
      case 'Low': return 'secondary';
      default: return 'outline';
    }
  };

  // Get status badge variant
  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'active': return 'destructive';
      case 'ongoing': return 'default';
      case 'resolved': return 'secondary';
      case 'deferred': return 'outline';
      default: return 'outline';
    }
  };

  // Render problem card
  const renderProblemCard = (problem: Problem) => (
    <div key={problem.id} className="p-4 border border-gray-200 rounded-lg bg-white hover:bg-gray-50 transition-colors">
      {/* Header with title and badges */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-medium text-gray-500">{problem.coding}</span>
            <Badge variant={getPriorityVariant(problem.priority)} className="text-xs">
              {problem.priority}
            </Badge>
            <Badge variant={getStatusVariant(problem.status)} className="text-xs">
              {problem.status}
            </Badge>
          </div>
          <h4 className="font-medium text-gray-900 text-sm leading-tight">{problem.title}</h4>
        </div>
        
        {/* Action buttons */}
        <div className="flex items-center gap-1 ml-2">
          <button
            onClick={() => handleEditProblem(problem.id)}
            className="p-1 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
            title="Edit problem"
          >
            <PencilIcon className="w-4 h-4" />
          </button>
          <button
            onClick={() => handleDeleteProblem(problem.id)}
            className="p-1 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
            title="Delete problem"
          >
            <TrashIcon className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Problem details */}
      <p className="text-sm text-gray-600 mb-3 line-clamp-2">{problem.details}</p>

      {/* Related information */}
      {problem.relatedTo && (
        <div className="flex items-center gap-1 mb-2">
          <ExclamationTriangleIcon className="w-3 h-3 text-gray-400" />
          <span className="text-xs text-gray-500">Related to: {problem.relatedTo}</span>
        </div>
      )}

      {/* Access programs */}
      {problem.accessPrograms && (
        <div className="mb-3">
          <p className="text-xs text-gray-500 mb-1">Programs:</p>
          <div className="flex flex-wrap gap-1">
            {problem.accessPrograms.split(', ').map((program, index) => (
              <Badge key={index} variant="outline" className="text-xs">
                {program}
              </Badge>
            ))}
          </div>
        </div>
      )}

      {/* Outcome for resolved problems */}
      {problem.outcome && (
        <div className="mb-3 p-2 bg-green-50 border border-green-200 rounded">
          <p className="text-xs font-medium text-green-800 mb-1">Outcome:</p>
          <p className="text-xs text-green-700">{problem.outcome}</p>
        </div>
      )}

      {/* Footer with provider and dates */}
      <div className="flex items-center justify-between text-xs text-gray-500 pt-2 border-t border-gray-100">
        <div className="flex items-center gap-1">
          <UserIcon className="w-3 h-3" />
          <span>{problem.provider}</span>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1">
            <CalendarIcon className="w-3 h-3" />
            <span>Started: {new Date(problem.beginDate).toLocaleDateString()}</span>
          </div>
          {problem.endDate && (
            <span>Ended: {new Date(problem.endDate).toLocaleDateString()}</span>
          )}
          <span>Updated {formatDistanceToNow(new Date(problem.lastUpdated))} ago</span>
        </div>
      </div>
    </div>
  );

  return (
    <div className={className}>
      <Tabs defaultValue="active" className="h-full flex flex-col">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="active" className="text-xs">
            Active ({activeProblems.length})
          </TabsTrigger>
          <TabsTrigger value="resolved" className="text-xs">
            Resolved ({resolvedProblems.length})
          </TabsTrigger>
          <TabsTrigger value="deferred" className="text-xs">
            Deferred ({deferredProblems.length})
          </TabsTrigger>
        </TabsList>

        {/* Active Problems Tab */}
        <TabsContent value="active" className="flex-1 mt-4">
          <ScrollArea className="h-[400px]">
            <div className="space-y-3 pr-4">
              {activeProblems.length > 0 ? (
                activeProblems.map(renderProblemCard)
              ) : (
                <div className="text-center py-8">
                  <ExclamationTriangleIcon className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-sm text-gray-500">No active problems</p>
                </div>
              )}
            </div>
          </ScrollArea>
        </TabsContent>

        {/* Resolved Problems Tab */}
        <TabsContent value="resolved" className="flex-1 mt-4">
          <ScrollArea className="h-[300px]">
            <div className="space-y-3 pr-4">
              {resolvedProblems.length > 0 ? (
                resolvedProblems.map(renderProblemCard)
              ) : (
                <div className="text-center py-8">
                  <ExclamationTriangleIcon className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-sm text-gray-500">No resolved problems</p>
                </div>
              )}
            </div>
          </ScrollArea>
        </TabsContent>

        {/* Deferred Problems Tab */}
        <TabsContent value="deferred" className="flex-1 mt-4">
          <ScrollArea className="h-[300px]">
            <div className="space-y-3 pr-4">
              {deferredProblems.length > 0 ? (
                deferredProblems.map(renderProblemCard)
              ) : (
                <div className="text-center py-8">
                  <ExclamationTriangleIcon className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-sm text-gray-500">No deferred problems</p>
                </div>
              )}
            </div>
          </ScrollArea>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export { ProblemsWidget };
