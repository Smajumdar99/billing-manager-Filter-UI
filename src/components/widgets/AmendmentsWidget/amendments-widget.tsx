import { FC, useState, useEffect } from 'react';
import { Badge } from '@/components/atoms/Badge/badge';
import { ScrollArea } from '@/components/atoms/ScrollArea/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/molecules/Tabs/tabs';
import { formatDistanceToNow } from 'date-fns';
import { Button } from '@/components/atoms/Button/button';
import { cn } from '@/lib/utils';
import { 
  DocumentTextIcon, 
  ClockIcon, 
  UserIcon, 
  PencilSquareIcon,
  DocumentDuplicateIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  XCircleIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  CalendarIcon,
  DocumentIcon,
  UserCircleIcon,
  ClipboardDocumentListIcon
} from '@heroicons/react/24/outline';

interface AmendmentsWidgetProps {
  patientId: string;
  className?: string;
  isFullscreen?: boolean;
}

interface Amendment {
  id: string;
  type: 'billing_correction' | 'diagnosis_update' | 'insurance_update' | 'documentation_request' | 'information_correction';
  description: string;
  status: 'pending' | 'approved' | 'rejected';
  requestedBy: string;
  requestDate: string;
  reviewedBy?: string;
  reviewDate?: string;
  category: 'billing' | 'clinical' | 'administrative';
  priority: 'high' | 'medium' | 'low';
  affectedDocuments: string[];
  notes?: string;
  reason?: string;
  impact?: string;
}

const mockAmendments: Amendment[] = [
  {
    id: 'AMD-2024-001',
    type: 'billing_correction',
    description: 'Correction to CPT code for office visit',
    status: 'approved',
    requestedBy: 'Sarah Martinez, CPC',
    requestDate: '2024-03-10',
    reviewedBy: 'Dr. James Wilson',
    reviewDate: '2024-03-11',
    category: 'billing',
    priority: 'high',
    affectedDocuments: ['Invoice #INV-2024-1234', 'Encounter Note #EN-2024-5678'],
    notes: 'CPT code updated from 99213 to 99214 based on documented complexity',
    reason: 'Initial code did not reflect the full scope of services provided',
    impact: 'Affects reimbursement rate and insurance claim accuracy'
  },
  {
    id: 'AMD-2024-002',
    type: 'insurance_update',
    description: 'Secondary insurance information correction',
    status: 'pending',
    requestedBy: 'John Smith, Billing Coordinator',
    requestDate: '2024-03-12',
    category: 'administrative',
    priority: 'medium',
    affectedDocuments: ['Insurance Record #INS-2024-789'],
    notes: 'Patient provided updated secondary insurance card with new group number',
    reason: 'Insurance information outdated in system',
    impact: 'Required for accurate claim submission to secondary payer'
  },
  {
    id: 'AMD-2024-003',
    type: 'documentation_request',
    description: 'Additional documentation for prior authorization',
    status: 'approved',
    requestedBy: 'Emily Chen, Authorization Specialist',
    requestDate: '2024-03-08',
    reviewedBy: 'Dr. Michael Lee',
    reviewDate: '2024-03-09',
    category: 'clinical',
    priority: 'high',
    affectedDocuments: ['Prior Auth #PA-2024-456', 'Clinical Notes #CN-2024-789'],
    notes: 'Additional clinical documentation added to support medical necessity',
    reason: 'Insurance requires more documentation for approval',
    impact: 'Necessary for procedure authorization'
  },
  {
    id: 'AMD-2024-004',
    type: 'information_correction',
    description: 'Correction to date of service',
    status: 'rejected',
    requestedBy: 'David Wilson, Claims Specialist',
    requestDate: '2024-03-05',
    reviewedBy: 'Dr. Sarah Chen',
    reviewDate: '2024-03-06',
    category: 'billing',
    priority: 'medium',
    affectedDocuments: ['Claim #CLM-2024-234', 'Encounter Note #EN-2024-567'],
    notes: 'Request to change date of service rejected - original date confirmed correct',
    reason: 'Suspected date entry error',
    impact: 'Would affect claim processing timeline'
  },
  {
    id: 'AMD-2024-005',
    type: 'diagnosis_update',
    description: 'Addition of secondary diagnosis code',
    status: 'pending',
    requestedBy: 'Lisa Johnson, Coding Specialist',
    requestDate: '2024-03-13',
    category: 'clinical',
    priority: 'medium',
    affectedDocuments: ['Encounter Note #EN-2024-890', 'Claim #CLM-2024-567'],
    notes: 'Request to add documented comorbidity ICD-10 code',
    reason: 'Secondary condition affects treatment plan',
    impact: 'May affect medical necessity determination'
  }
];

export const AmendmentsWidget: FC<AmendmentsWidgetProps> = ({ patientId, className = '', isFullscreen }) => {
  const [expandedCards, setExpandedCards] = useState<string[]>([]);

  useEffect(() => {
    if (isFullscreen) {
      setExpandedCards(mockAmendments.map(a => a.id));
    } else {
      setExpandedCards([]);
    }
  }, [isFullscreen]);

  const renderNormalView = (amendment: Amendment) => (
    <div 
      key={amendment.id} 
      className="rounded-xl border bg-white hover:shadow-md transition-all duration-200"
    >
      <div className="p-4">
        <div className="flex items-start gap-3">
          <div className="shrink-0">
            {amendment.status === 'pending' ? (
              <ClockIcon className="h-6 w-6 text-yellow-500" />
            ) : amendment.status === 'approved' ? (
              <CheckCircleIcon className="h-6 w-6 text-green-500" />
            ) : (
              <XCircleIcon className="h-6 w-6 text-red-500" />
            )}
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="text-base font-semibold text-gray-900 leading-6 mb-1">
              {amendment.description}
            </h3>
            <div className="flex flex-wrap items-center gap-2 mb-3">
              <Badge 
                variant="outline" 
                className="capitalize bg-gray-50/50"
              >
                {amendment.type.replace(/_/g, ' ')}
              </Badge>
              <Badge 
                variant={
                  amendment.priority === 'high' ? 'destructive' :
                  amendment.priority === 'medium' ? 'default' :
                  'secondary'
                }
                className="capitalize"
              >
                {amendment.priority} priority
              </Badge>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <DocumentIcon className="h-4 w-4 text-gray-400" />
                <span className="font-medium">{amendment.id}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <UserCircleIcon className="h-4 w-4 text-gray-400" />
                <span className="font-medium">{amendment.requestedBy.split(',')[0]}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <CalendarIcon className="h-4 w-4 text-gray-400" />
                <span>{formatDistanceToNow(new Date(amendment.requestDate), { addSuffix: true })}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <ClipboardDocumentListIcon className="h-4 w-4 text-gray-400" />
                <span>{amendment.affectedDocuments.length} document(s)</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {amendment.status === 'pending' && (
        <div className="px-4 py-3 bg-gray-50/50 border-t flex justify-end gap-2">
          <Button 
            variant="outline" 
            size="sm"
            className="text-gray-700 hover:text-gray-900"
          >
            Review
          </Button>
          <Button 
            size="sm"
            className="bg-blue-500 hover:bg-blue-600"
          >
            Process Amendment
          </Button>
        </div>
      )}
    </div>
  );

  const renderFullscreenView = (amendment: Amendment) => {
    const isExpanded = expandedCards.includes(amendment.id);
    return (
      <div 
        key={amendment.id} 
        className={cn(
          "rounded-lg border transition-all duration-200 ease-in-out",
          isExpanded ? "p-4" : "p-3",
          "hover:bg-gray-50"
        )}
      >
        <div className="flex items-start justify-between">
          <div className="space-y-1 flex-1">
            <div className="flex items-center gap-2">
              <h4 className="text-sm font-medium">{amendment.description}</h4>
              <Badge 
                variant={
                  amendment.status === 'approved' ? 'default' :
                  amendment.status === 'pending' ? 'secondary' :
                  'destructive'
                }
              >
                {amendment.status}
              </Badge>
              <Badge variant="outline" className="capitalize">
                {amendment.type.replace(/_/g, ' ')}
              </Badge>
            </div>
            
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <DocumentTextIcon className="h-4 w-4" />
                <span>{amendment.id}</span>
              </div>
              <div className="flex items-center gap-1">
                <Badge variant={
                  amendment.priority === 'high' ? 'destructive' :
                  amendment.priority === 'medium' ? 'default' :
                  'secondary'
                }>
                  {amendment.priority} priority
                </Badge>
              </div>
            </div>
          </div>
        </div>

        <div className="grid gap-4 mt-4">
          <div className="min-h-0">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-muted-foreground">Requested By</p>
                <p className="font-medium">{amendment.requestedBy}</p>
                <p className="text-xs text-muted-foreground">
                  {formatDistanceToNow(new Date(amendment.requestDate), { addSuffix: true })}
                </p>
              </div>
              {amendment.reviewedBy && (
                <div>
                  <p className="text-muted-foreground">Reviewed By</p>
                  <p className="font-medium">{amendment.reviewedBy}</p>
                  <p className="text-xs text-muted-foreground">
                    {formatDistanceToNow(new Date(amendment.reviewDate!), { addSuffix: true })}
                  </p>
                </div>
              )}
            </div>

            <div className="space-y-2 mt-4">
              <div>
                <p className="text-sm text-muted-foreground">Reason</p>
                <p className="text-sm">{amendment.reason}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Impact</p>
                <p className="text-sm">{amendment.impact}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Affected Documents</p>
                <div className="flex flex-wrap gap-2 mt-1">
                  {amendment.affectedDocuments.map((doc, index) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      {doc}
                    </Badge>
                  ))}
                </div>
              </div>
              {amendment.notes && (
                <div>
                  <p className="text-sm text-muted-foreground">Notes</p>
                  <p className="text-sm">{amendment.notes}</p>
                </div>
              )}
            </div>

            {amendment.status === 'pending' && (
              <div className="flex justify-end gap-2 mt-4">
                <Button variant="outline" size="sm">Review</Button>
                <Button size="sm">Process Amendment</Button>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className={`flex flex-col h-full ${className}`}>
      <Tabs defaultValue="pending" className="flex-1 flex flex-col min-h-0">
        <div className="px-1 mb-2">
          <TabsList className="w-full justify-start gap-2">
            <TabsTrigger value="pending" className="relative">
              Pending
              <Badge variant="secondary" className="ml-2 bg-white">
                {mockAmendments.filter(a => a.status === 'pending').length}
              </Badge>
            </TabsTrigger>
            <TabsTrigger value="approved">
              Approved
              <Badge variant="secondary" className="ml-2 bg-white">
                {mockAmendments.filter(a => a.status === 'approved').length}
              </Badge>
            </TabsTrigger>
            <TabsTrigger value="rejected">
              Rejected
              <Badge variant="secondary" className="ml-2 bg-white">
                {mockAmendments.filter(a => a.status === 'rejected').length}
              </Badge>
            </TabsTrigger>
            <TabsTrigger value="all">
              All
              <Badge variant="secondary" className="ml-2 bg-white">
                {mockAmendments.length}
              </Badge>
            </TabsTrigger>
          </TabsList>
        </div>

        {(['pending', 'approved', 'rejected', 'all'] as const).map(tabValue => (
          <TabsContent 
            key={tabValue} 
            value={tabValue} 
            className="flex-1 min-h-0"
          >
            <ScrollArea className="h-full">
              <div className="p-4 space-y-4">
                {mockAmendments
                  .filter(amendment => tabValue === 'all' || amendment.status === tabValue)
                  .map(amendment => 
                    isFullscreen ? renderFullscreenView(amendment) : renderNormalView(amendment)
                  )}
              </div>
            </ScrollArea>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}; 