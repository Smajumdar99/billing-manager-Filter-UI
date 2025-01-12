import { FC } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/molecules/Tabs/tabs';
import { ScrollArea } from '@/components/atoms/ScrollArea/scroll-area';
import { Badge } from '@/components/atoms/Badge/badge';
import { formatDistanceToNow } from 'date-fns';

interface PrescriptionsWidgetProps {
  patientId: string;
  className?: string;
}

interface Prescription {
  id: string;
  medication: string;
  dosage: string;
  frequency: string;
  route: string;
  status: 'active' | 'discontinued' | 'completed';
  startDate: string;
  endDate?: string;
  prescribedBy: string;
  lastUpdated: string;
  priority: 'routine' | 'urgent' | 'stat';
  refills: number;
  pharmacy?: string;
  notes?: string;
}

const mockPrescriptions: Prescription[] = [
  {
    id: '1',
    medication: 'Lisinopril',
    dosage: '10mg',
    frequency: 'Once daily',
    route: 'Oral',
    status: 'active',
    startDate: '2024-01-01',
    prescribedBy: 'Dr. Sarah Chen',
    lastUpdated: '2024-01-10T09:30:00Z',
    priority: 'routine',
    refills: 3,
    pharmacy: 'CVS Pharmacy',
    notes: 'Take in the morning'
  },
  {
    id: '2',
    medication: 'Metformin',
    dosage: '500mg',
    frequency: 'Twice daily',
    route: 'Oral',
    status: 'active',
    startDate: '2023-12-15',
    prescribedBy: 'Dr. James Wilson',
    lastUpdated: '2024-01-09T14:20:00Z',
    priority: 'routine',
    refills: 2,
    pharmacy: 'Walgreens',
    notes: 'Take with meals'
  },
  {
    id: '3',
    medication: 'Amoxicillin',
    dosage: '500mg',
    frequency: 'Three times daily',
    route: 'Oral',
    status: 'completed',
    startDate: '2023-12-01',
    endDate: '2023-12-10',
    prescribedBy: 'Dr. Michael Lee',
    lastUpdated: '2023-12-15T11:45:00Z',
    priority: 'urgent',
    refills: 0,
    notes: 'Complete course as prescribed'
  }
];

export const PrescriptionsWidget: FC<PrescriptionsWidgetProps> = ({ patientId, className }) => {
  return (
    <Tabs defaultValue="active" className="flex h-full flex-col">
      <TabsList className="shrink-0 w-full justify-start gap-2 px-1">
        <TabsTrigger value="active">
          Active
          <Badge variant="secondary" className="ml-2 h-4 w-4">
            {mockPrescriptions.filter(p => p.status === 'active').length}
          </Badge>
        </TabsTrigger>
        <TabsTrigger value="completed">
          Completed
          <Badge variant="secondary" className="ml-2 h-4 w-4">
            {mockPrescriptions.filter(p => p.status === 'completed').length}
          </Badge>
        </TabsTrigger>
        <TabsTrigger value="discontinued">
          Discontinued
          <Badge variant="secondary" className="ml-2 h-4 w-4">
            {mockPrescriptions.filter(p => p.status === 'discontinued').length}
          </Badge>
        </TabsTrigger>
        <TabsTrigger value="all">
          All
          <Badge variant="secondary" className="ml-2 h-4 w-4">
            {mockPrescriptions.length}
          </Badge>
        </TabsTrigger>
      </TabsList>

      {(['active', 'completed', 'discontinued', 'all'] as const).map(tabValue => (
        <TabsContent key={tabValue} value={tabValue} className="flex-1 min-h-0">
          <ScrollArea className="h-full">
            <div className="space-y-4 p-4">
              {mockPrescriptions
                .filter(prescription => tabValue === 'all' || prescription.status === tabValue)
                .map(prescription => (
                  <div key={prescription.id} className="rounded-lg border p-3 space-y-1.5">
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="text-sm font-medium">{prescription.medication}</h4>
                          <Badge 
                            variant={
                              prescription.priority === 'stat' ? 'destructive' : 
                              prescription.priority === 'urgent' ? 'default' : 
                              'secondary'
                            } 
                            className="text-[10px]"
                          >
                            {prescription.priority}
                          </Badge>
                          <Badge 
                            variant={
                              prescription.status === 'active' ? 'default' :
                              prescription.status === 'discontinued' ? 'destructive' :
                              'secondary'
                            } 
                            className="text-[10px]"
                          >
                            {prescription.status}
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          {prescription.dosage} • {prescription.frequency} • {prescription.route}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Start: {new Date(prescription.startDate).toLocaleDateString()}
                          {prescription.endDate && ` • End: ${new Date(prescription.endDate).toLocaleDateString()}`}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Prescribed by {prescription.prescribedBy} • 
                          Updated {formatDistanceToNow(new Date(prescription.lastUpdated), { addSuffix: true })}
                        </p>
                      </div>
                      {prescription.refills > 0 && (
                        <Badge variant="outline" className="text-[10px]">
                          Refills: {prescription.refills}
                        </Badge>
                      )}
                    </div>
                    {(prescription.pharmacy || prescription.notes) && (
                      <div className="text-xs text-muted-foreground space-y-1">
                        {prescription.pharmacy && <p>Pharmacy: {prescription.pharmacy}</p>}
                        {prescription.notes && <p>Notes: {prescription.notes}</p>}
                      </div>
                    )}
                  </div>
                ))}
            </div>
          </ScrollArea>
        </TabsContent>
      ))}
    </Tabs>
  );
}; 