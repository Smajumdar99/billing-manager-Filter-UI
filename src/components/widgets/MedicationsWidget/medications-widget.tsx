import { FC } from 'react';
import { Badge } from '@/components/atoms/Badge/badge';
import { ScrollArea } from '@/components/atoms/ScrollArea/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/molecules/Tabs/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/atoms/Table/table';
import { formatDistanceToNow } from 'date-fns';
import { BeakerIcon, ClockIcon, UserIcon, CalendarIcon } from '@heroicons/react/24/outline';

interface MedicationsWidgetProps {
  patientId: string;
  className?: string;
  isFullscreen?: boolean;
}

interface Medication {
  id: string;
  name: string;
  dosage: string;
  frequency: string;
  route: string;
  status: 'active' | 'discontinued' | 'completed';
  prescribedDate: string;
  prescribedBy: string;
  type: 'prescription' | 'otc';
  lastRefill?: string;
  refillsRemaining?: number;
  notes?: string;
}

const mockMedications: Medication[] = [
  {
    id: '1',
    name: 'Lisinopril',
    dosage: '10mg',
    frequency: 'Once daily',
    route: 'Oral',
    status: 'active',
    prescribedDate: '2024-01-01',
    prescribedBy: 'Dr. Sarah Chen',
    type: 'prescription',
    lastRefill: '2024-01-01',
    refillsRemaining: 3
  },
  {
    id: '2',
    name: 'Metformin',
    dosage: '500mg',
    frequency: 'Twice daily',
    route: 'Oral',
    status: 'active',
    prescribedDate: '2023-12-15',
    prescribedBy: 'Dr. James Wilson',
    type: 'prescription',
    lastRefill: '2023-12-15',
    refillsRemaining: 2
  },
  {
    id: '3',
    name: 'Aspirin',
    dosage: '81mg',
    frequency: 'Once daily',
    route: 'Oral',
    status: 'active',
    prescribedDate: '2023-12-01',
    prescribedBy: 'Dr. Michael Lee',
    type: 'otc',
    notes: 'Take with food'
  },
  {
    id: '4',
    name: 'Vitamin D3',
    dosage: '2000 IU',
    frequency: 'Once daily',
    route: 'Oral',
    status: 'active',
    prescribedDate: '2023-11-15',
    prescribedBy: 'Dr. Sarah Chen',
    type: 'otc'
  }
];

const CardView: FC<{ medications: Medication[] }> = ({ medications }) => (
  <div className="grid grid-cols-1 gap-3 p-3">
    {medications.map(med => (
      <div 
        key={med.id} 
        className="bg-white rounded-lg border border-border p-3 hover:shadow-sm transition-shadow"
      >
        <div className="flex items-start justify-between mb-2">
          <div>
            <h4 className="font-medium text-sm">{med.name}</h4>
            <div className="flex items-center gap-1 mt-1">
              <BeakerIcon className="w-3.5 h-3.5 text-muted-foreground" />
              <span className="text-xs text-muted-foreground">
                {med.dosage} · {med.route}
              </span>
            </div>
          </div>
          <Badge 
            variant={med.status === 'active' ? 'default' : 'secondary'}
            className="text-[10px]"
          >
            {med.status}
          </Badge>
        </div>

        <div className="space-y-1.5">
          <div className="flex items-center gap-1.5">
            <ClockIcon className="w-3.5 h-3.5 text-muted-foreground" />
            <span className="text-xs">{med.frequency}</span>
          </div>
          
          <div className="flex items-center gap-1.5">
            <UserIcon className="w-3.5 h-3.5 text-muted-foreground" />
            <span className="text-xs">{med.prescribedBy}</span>
          </div>

          <div className="flex items-center gap-1.5">
            <CalendarIcon className="w-3.5 h-3.5 text-muted-foreground" />
            <span className="text-xs text-muted-foreground">
              Prescribed {formatDistanceToNow(new Date(med.prescribedDate), { addSuffix: true })}
            </span>
          </div>

          {med.refillsRemaining !== undefined && (
            <div className="mt-2">
              <Badge 
                variant="secondary" 
                className="text-[10px]"
              >
                {med.refillsRemaining} refills remaining
              </Badge>
            </div>
          )}

          {med.notes && (
            <div className="mt-2 text-xs text-muted-foreground">
              Note: {med.notes}
            </div>
          )}
        </div>
      </div>
    ))}
  </div>
);

const TableView: FC<{ medications: Medication[] }> = ({ medications }) => (
  <div className="p-3">
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Medication</TableHead>
          <TableHead>Dosage</TableHead>
          <TableHead>Frequency</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Provider</TableHead>
          <TableHead>Last Refill</TableHead>
          <TableHead>Refills</TableHead>
          <TableHead>Notes</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {medications.map(med => (
          <TableRow key={med.id}>
            <TableCell className="font-medium">{med.name}</TableCell>
            <TableCell>{med.dosage}</TableCell>
            <TableCell>
              {med.frequency}
              <div className="text-xs text-muted-foreground">{med.route}</div>
            </TableCell>
            <TableCell>
              <Badge 
                variant={med.status === 'active' ? 'default' : 'secondary'}
                className="text-[10px]"
              >
                {med.status}
              </Badge>
            </TableCell>
            <TableCell>
              {med.prescribedBy}
              <div className="text-xs text-muted-foreground">
                {formatDistanceToNow(new Date(med.prescribedDate), { addSuffix: true })}
              </div>
            </TableCell>
            <TableCell>
              {med.lastRefill ? formatDistanceToNow(new Date(med.lastRefill), { addSuffix: true }) : '-'}
            </TableCell>
            <TableCell>{med.refillsRemaining ?? '-'}</TableCell>
            <TableCell className="text-xs text-muted-foreground">{med.notes || '-'}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  </div>
);

export const MedicationsWidget: FC<MedicationsWidgetProps> = ({ isFullscreen = false }) => {
  return (
    <Tabs defaultValue="active" className="flex h-full flex-col">
      <TabsList className="pl-2 shrink-0 w-full justify-start gap-2">
        <TabsTrigger value="active">
          Active
          <Badge variant="secondary" className="ml-2 h-4 w-4">
            {mockMedications.filter(m => m.status === 'active' && m.type === 'prescription').length}
          </Badge>
        </TabsTrigger>
        <TabsTrigger value="otc">
          OTC
          <Badge variant="secondary" className="ml-2 h-4 w-4">
            {mockMedications.filter(m => m.type === 'otc').length}
          </Badge>
        </TabsTrigger>
      </TabsList>

      {(['active', 'otc'] as const).map(tabValue => (
        <TabsContent key={tabValue} value={tabValue} className="flex-1 min-h-0">
          <ScrollArea className="h-full">
            {isFullscreen ? (
              <TableView 
                medications={mockMedications.filter(med => 
                  tabValue === 'active' 
                    ? med.status === 'active' && med.type === 'prescription'
                    : med.type === 'otc'
                )} 
              />
            ) : (
              <CardView 
                medications={mockMedications.filter(med => 
                  tabValue === 'active' 
                    ? med.status === 'active' && med.type === 'prescription'
                    : med.type === 'otc'
                )} 
              />
            )}
          </ScrollArea>
        </TabsContent>
      ))}
    </Tabs>
  );
}; 