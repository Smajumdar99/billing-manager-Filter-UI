import { FC } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/molecules/Tabs/tabs';
import { ScrollArea } from '@/components/atoms/ScrollArea/scroll-area';
import { Badge } from '@/components/atoms/Badge/badge';
import { formatDistanceToNow } from 'date-fns';

interface DiagnosisWidgetProps {
  patientId: string;
  className?: string;
}

interface Diagnosis {
  id: string;
  code: string;
  description: string;
  type: 'primary' | 'secondary' | 'history';
  status: 'active' | 'resolved' | 'inactive';
  onsetDate: string;
  lastUpdated: string;
  updatedBy: string;
  notes?: string;
  severity?: 'mild' | 'moderate' | 'severe';
}

const mockDiagnoses: Diagnosis[] = [
  {
    id: '1',
    code: 'I10',
    description: 'Essential (primary) hypertension',
    type: 'primary',
    status: 'active',
    onsetDate: '2020-03-15',
    lastUpdated: '2024-01-10T09:30:00Z',
    updatedBy: 'Dr. Sarah Chen',
    severity: 'moderate'
  },
  {
    id: '2',
    code: 'E11.9',
    description: 'Type 2 diabetes mellitus without complications',
    type: 'primary',
    status: 'active',
    onsetDate: '2019-06-20',
    lastUpdated: '2024-01-09T14:20:00Z',
    updatedBy: 'Dr. James Wilson',
    severity: 'mild'
  },
  {
    id: '3',
    code: 'J45.909',
    description: 'Unspecified asthma, uncomplicated',
    type: 'secondary',
    status: 'active',
    onsetDate: '2018-08-10',
    lastUpdated: '2023-12-15T11:45:00Z',
    updatedBy: 'Dr. Michael Lee',
    notes: 'Well controlled with current medications'
  }
];

export const DiagnosisWidget: FC<DiagnosisWidgetProps> = ({ patientId, className }) => {
  return (
    <Tabs defaultValue="active" className="flex h-full flex-col">
      <TabsList className="shrink-0 w-full justify-start gap-2 px-1">
        <TabsTrigger value="active">
          Active
          <Badge variant="secondary" className="ml-2 h-4 w-4">
            {mockDiagnoses.filter(d => d.status === 'active').length}
          </Badge>
        </TabsTrigger>
        <TabsTrigger value="resolved">
          Resolved
          <Badge variant="secondary" className="ml-2 h-4 w-4">
            {mockDiagnoses.filter(d => d.status === 'resolved').length}
          </Badge>
        </TabsTrigger>
        <TabsTrigger value="all">
          All
          <Badge variant="secondary" className="ml-2 h-4 w-4">
            {mockDiagnoses.length}
          </Badge>
        </TabsTrigger>
      </TabsList>

      <TabsContent value="active" className="flex-1 min-h-0">
        <ScrollArea className="h-full">
          <div className="space-y-4 p-4">
            {mockDiagnoses
              .filter(diagnosis => diagnosis.status === 'active')
              .map(diagnosis => (
                <div key={diagnosis.id} className="rounded-lg border p-3 space-y-1.5">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-sm font-medium">{diagnosis.description}</h4>
                        <Badge variant="outline" className="text-[10px]">
                          {diagnosis.type}
                        </Badge>
                        {diagnosis.severity && (
                          <Badge 
                            variant={
                              diagnosis.severity === 'severe' ? 'destructive' : 
                              diagnosis.severity === 'moderate' ? 'default' : 
                              'secondary'
                            } 
                            className="text-[10px]"
                          >
                            {diagnosis.severity}
                          </Badge>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Code: {diagnosis.code} • Onset: {new Date(diagnosis.onsetDate).toLocaleDateString()}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Updated by {diagnosis.updatedBy} {formatDistanceToNow(new Date(diagnosis.lastUpdated), { addSuffix: true })}
                      </p>
                    </div>
                  </div>
                  {diagnosis.notes && (
                    <p className="text-xs leading-relaxed text-muted-foreground">{diagnosis.notes}</p>
                  )}
                </div>
              ))}
          </div>
        </ScrollArea>
      </TabsContent>

      <TabsContent value="resolved" className="flex-1 min-h-0">
        <ScrollArea className="h-full">
          <div className="space-y-4 p-4">
            {mockDiagnoses
              .filter(diagnosis => diagnosis.status === 'resolved')
              .map(diagnosis => (
                <div key={diagnosis.id} className="rounded-lg border p-3 space-y-1.5">
                  {/* Same content structure as active tab */}
                </div>
              ))}
          </div>
        </ScrollArea>
      </TabsContent>

      <TabsContent value="all" className="flex-1 min-h-0">
        <ScrollArea className="h-full">
          <div className="space-y-4 p-4">
            {mockDiagnoses.map(diagnosis => (
                <div key={diagnosis.id} className="rounded-lg border p-3 space-y-1.5">
                  {/* Same content structure as active tab */}
                </div>
            ))}
          </div>
        </ScrollArea>
      </TabsContent>
    </Tabs>
  );
}; 