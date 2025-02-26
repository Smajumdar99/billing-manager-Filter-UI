import { FC } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/molecules/Tabs/tabs';
import { ScrollArea } from '@/components/atoms/ScrollArea/scroll-area';
import { Badge } from '@/components/atoms/Badge/badge';
import { formatDistanceToNow } from 'date-fns';
import { cn } from '@/lib/utils';

interface PrescriptionsWidgetProps {
  patientId: string;
  className?: string;
}

interface Prescription {
  id: string;
  medication: string;
  drugClass: string;
  therapeuticCategory: string;
  dosage: string;
  frequency: string;
  route: string;
  status: 'active' | 'discontinued' | 'completed';
  startDate: string;
  endDate?: string;
  prescribedBy: string;
  prescriberSpecialty: string;
  lastUpdated: string;
  priority: 'routine' | 'urgent' | 'stat';
  refills: number;
  pharmacy?: string;
  notes?: string;
  indication: string;
  lastFillDate?: string;
  nextRefillDue?: string;
  adherenceRate?: number;
  isHighRisk: boolean;
  interactions?: string[];
  contraindications?: string[];
  reconciliationStatus: 'verified' | 'pending' | 'needs_review';
}

const mockPrescriptions: Prescription[] = [
  {
    id: '1',
    medication: 'Lisinopril',
    drugClass: 'ACE Inhibitor',
    therapeuticCategory: 'Cardiovascular',
    dosage: '10mg',
    frequency: 'Once daily',
    route: 'Oral',
    status: 'active',
    startDate: '2024-01-01',
    prescribedBy: 'Dr. Sarah Chen',
    prescriberSpecialty: 'Internal Medicine',
    lastUpdated: '2024-01-10T09:30:00Z',
    priority: 'routine',
    refills: 3,
    pharmacy: 'CVS Pharmacy',
    notes: 'Take in the morning',
    indication: 'Hypertension',
    lastFillDate: '2024-01-01',
    nextRefillDue: '2024-02-01',
    adherenceRate: 95,
    isHighRisk: false,
    interactions: ['Potassium supplements', 'NSAIDs'],
    contraindications: ['History of angioedema', 'Pregnancy'],
    reconciliationStatus: 'verified'
  },
  {
    id: '2',
    medication: 'Metformin',
    drugClass: 'Biguanide',
    therapeuticCategory: 'Diabetes',
    dosage: '500mg',
    frequency: 'Twice daily',
    route: 'Oral',
    status: 'active',
    startDate: '2023-12-15',
    prescribedBy: 'Dr. James Wilson',
    prescriberSpecialty: 'Endocrinology',
    lastUpdated: '2024-01-09T14:20:00Z',
    priority: 'routine',
    refills: 2,
    pharmacy: 'Walgreens',
    notes: 'Take with meals',
    indication: 'Type 2 Diabetes',
    lastFillDate: '2023-12-15',
    nextRefillDue: '2024-01-15',
    adherenceRate: 88,
    isHighRisk: false,
    interactions: ['Contrast media', 'Alcohol'],
    contraindications: ['Renal dysfunction', 'Metabolic acidosis'],
    reconciliationStatus: 'verified'
  },
  {
    id: '3',
    medication: 'Warfarin',
    drugClass: 'Anticoagulant',
    therapeuticCategory: 'Hematology',
    dosage: '5mg',
    frequency: 'Once daily',
    route: 'Oral',
    status: 'active',
    startDate: '2023-12-01',
    prescribedBy: 'Dr. Michael Lee',
    prescriberSpecialty: 'Cardiology',
    lastUpdated: '2024-01-12T11:45:00Z',
    priority: 'urgent',
    refills: 2,
    pharmacy: 'CVS Pharmacy',
    notes: 'Take at the same time each day. Monitor INR closely.',
    indication: 'Atrial Fibrillation',
    lastFillDate: '2024-01-01',
    nextRefillDue: '2024-02-01',
    adherenceRate: 100,
    isHighRisk: true,
    interactions: ['NSAIDs', 'Aspirin', 'Antibiotics'],
    contraindications: ['Active bleeding', 'Severe thrombocytopenia'],
    reconciliationStatus: 'verified'
  }
];

export const PrescriptionsWidget: FC<PrescriptionsWidgetProps> = ({ patientId }) => {
  return (
    <div className="h-full flex flex-col">
      <Tabs defaultValue="active" className="fflex-1 flex flex-col overflow-hidden">
        <div className="px-1 shrink-0">
          <TabsList className="w-full justify-start gap-2">
            <TabsTrigger value="active">
              Active
              <Badge variant="secondary" className="ml-2 h-4 w-4">
                {mockPrescriptions.filter(p => p.status === 'active').length}
              </Badge>
            </TabsTrigger>
            <TabsTrigger value="high-risk">
              High Risk
              <Badge variant="destructive" className="ml-2 h-4 w-4">
                {mockPrescriptions.filter(p => p.isHighRisk && p.status === 'active').length}
              </Badge>
            </TabsTrigger>
            <TabsTrigger value="needs-review">
              Needs Review
              <Badge variant="destructive" className="ml-2 h-4 w-4">
                {mockPrescriptions.filter(p => p.reconciliationStatus === 'needs_review').length}
              </Badge>
            </TabsTrigger>
            <TabsTrigger value="all">
              All
              <Badge variant="secondary" className="ml-2 h-4 w-4">
                {mockPrescriptions.length}
              </Badge>
            </TabsTrigger>
          </TabsList>
        </div>

        <div className="flex-1 relative overflow-hidden">
          {(['active', 'high-risk', 'needs-review', 'all'] as const).map(tabValue => (
            <TabsContent key={tabValue} value={tabValue} className="h-full p-0 m-0 data-[state=inactive]:hidden">
              <ScrollArea className="h-full">
                <div className="space-y-4 p-4">
                  {mockPrescriptions
                    .filter(prescription => {
                      switch (tabValue) {
                        case 'active':
                          return prescription.status === 'active';
                        case 'high-risk':
                          return prescription.isHighRisk && prescription.status === 'active';
                        case 'needs-review':
                          return prescription.reconciliationStatus === 'needs_review';
                        default:
                          return true;
                      }
                    })
                    .map(prescription => (
                      <div 
                        key={prescription.id} 
                        className={cn(
                          "rounded-lg border p-3 space-y-2",
                          prescription.isHighRisk && "border-red-200 bg-red-50/50",
                          prescription.reconciliationStatus === 'needs_review' && "border-yellow-200 bg-yellow-50/50"
                        )}
                      >
                        <div className="flex items-start justify-between">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <h4 className="text-sm font-medium">{prescription.medication}</h4>
                              <Badge 
                                variant={prescription.isHighRisk ? "destructive" : "outline"} 
                                className="text-[10px]"
                              >
                                {prescription.drugClass}
                              </Badge>
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
                            </div>
                            
                            <div className="flex items-center gap-4 text-xs text-muted-foreground">
                              <span>{prescription.dosage} • {prescription.frequency} • {prescription.route}</span>
                              <span>For: {prescription.indication}</span>
                            </div>
                            
                            <div className="flex items-center gap-2 text-xs">
                              <Badge variant={prescription.adherenceRate && prescription.adherenceRate < 80 ? "destructive" : "outline"} className="text-[10px]">
                                Adherence: {prescription.adherenceRate}%
                              </Badge>
                              {prescription.nextRefillDue && (
                                <Badge variant="secondary" className="text-[10px]">
                                  Next Refill: {new Date(prescription.nextRefillDue).toLocaleDateString()}
                                </Badge>
                              )}
                            </div>
                          </div>

                          <Badge 
                            variant={
                              prescription.reconciliationStatus === 'verified' ? 'default' :
                              prescription.reconciliationStatus === 'needs_review' ? 'destructive' :
                              'secondary'
                            } 
                            className="text-[10px]"
                          >
                            {prescription.reconciliationStatus.replace('_', ' ')}
                          </Badge>
                        </div>

                        <div className="grid grid-cols-2 gap-4 text-xs">
                          <div>
                            <p className="text-muted-foreground mb-1">Prescribed by</p>
                            <p>{prescription.prescribedBy} ({prescription.prescriberSpecialty})</p>
                            <p className="text-muted-foreground">
                              Updated {formatDistanceToNow(new Date(prescription.lastUpdated), { addSuffix: true })}
                            </p>
                          </div>
                          
                          <div>
                            <p className="text-muted-foreground mb-1">Dates</p>
                            <p>Start: {new Date(prescription.startDate).toLocaleDateString()}</p>
                            {prescription.endDate && (
                              <p>End: {new Date(prescription.endDate).toLocaleDateString()}</p>
                            )}
                          </div>
                        </div>

                        {(prescription.interactions?.length || prescription.contraindications?.length) ? (
                          <div className="space-y-2 pt-2 border-t">
                            {prescription.interactions?.length ? (
                              <div>
                                <p className="text-xs font-medium mb-1">Interactions</p>
                                <div className="flex flex-wrap gap-1">
                                  {prescription.interactions.map((interaction, idx) => (
                                    <Badge key={idx} variant="secondary" className="text-[10px]">
                                      {interaction}
                                    </Badge>
                                  ))}
                                </div>
                              </div>
                            ) : null}
                            
                            {prescription.contraindications?.length ? (
                              <div>
                                <p className="text-xs font-medium mb-1">Contraindications</p>
                                <div className="flex flex-wrap gap-1">
                                  {prescription.contraindications.map((contraindication, idx) => (
                                    <Badge key={idx} variant="destructive" className="text-[10px]">
                                      {contraindication}
                                    </Badge>
                                  ))}
                                </div>
                              </div>
                            ) : null}
                          </div>
                        ) : null}

                        {prescription.notes && (
                          <div className="pt-2 border-t">
                            <p className="text-xs text-muted-foreground">{prescription.notes}</p>
                          </div>
                        )}
                      </div>
                    ))}
                </div>
              </ScrollArea>
            </TabsContent>
          ))}
        </div>
      </Tabs>
    </div>
  );
}; 