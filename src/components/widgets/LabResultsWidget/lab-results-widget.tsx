import { FC } from 'react';
import { Badge } from '@/components/atoms/Badge/badge';
import { ScrollArea } from '@/components/atoms/ScrollArea/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/molecules/Tabs/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/atoms/Table/table';
import { formatDistanceToNow } from 'date-fns';

interface LabResultsWidgetProps {
  patientId: string;
  className?: string;
}

interface LabResult {
  id: string;
  testName: string;
  result: string;
  unit: string;
  referenceRange: string;
  status: 'normal' | 'abnormal' | 'critical';
  orderedDate: string;
  reportedDate: string;
  orderedBy: string;
}

const mockLabResults: LabResult[] = [
  {
    id: '1',
    testName: 'Complete Blood Count',
    result: '14.2',
    unit: 'g/dL',
    referenceRange: '12.0-15.5',
    status: 'normal',
    orderedDate: '2024-01-08',
    reportedDate: '2024-01-09T10:30:00Z',
    orderedBy: 'Dr. Sarah Chen'
  },
  {
    id: '2',
    testName: 'Blood Glucose',
    result: '180',
    unit: 'mg/dL',
    referenceRange: '70-140',
    status: 'abnormal',
    orderedDate: '2024-01-08',
    reportedDate: '2024-01-09T11:15:00Z',
    orderedBy: 'Dr. James Wilson'
  },
  {
    id: '3',
    testName: 'Potassium',
    result: '6.8',
    unit: 'mEq/L',
    referenceRange: '3.5-5.0',
    status: 'critical',
    orderedDate: '2024-01-08',
    reportedDate: '2024-01-09T09:45:00Z',
    orderedBy: 'Dr. Michael Lee'
  }
];

export const LabResultsWidget: FC<LabResultsWidgetProps> = ({ patientId, className }) => {
  return (
    <Tabs defaultValue="all" className="flex h-full flex-col">
      <TabsList className="pl-2 shrink-0 w-full justify-start gap-2">
        <TabsTrigger value="all">
          All
          <Badge variant="secondary" className="ml-2 h-4 w-4">
            {mockLabResults.length}
          </Badge>
        </TabsTrigger>
        <TabsTrigger value="abnormal">
          Abnormal
          <Badge variant="secondary" className="ml-2 h-4 w-4">
            {mockLabResults.filter(r => r.status !== 'normal').length}
          </Badge>
        </TabsTrigger>
      </TabsList>

      {(['all', 'abnormal'] as const).map(tabValue => (
        <TabsContent key={tabValue} value={tabValue} className="flex-1 min-h-0">
          <ScrollArea className="h-full">
            <div className="pl-2 pr-4 pt-2">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Test</TableHead>
                    <TableHead>Result</TableHead>
                    <TableHead>Range</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Ordered</TableHead>
                    <TableHead>Reported</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockLabResults
                    .filter(result => tabValue === 'all' || result.status !== 'normal')
                    .map(result => (
                      <TableRow key={result.id}>
                        <TableCell className="font-medium">{result.testName}</TableCell>
                        <TableCell>
                          {result.result} {result.unit}
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          {result.referenceRange}
                        </TableCell>
                        <TableCell>
                          <Badge 
                            variant={
                              result.status === 'critical' ? 'destructive' : 
                              result.status === 'abnormal' ? 'default' : 
                              'secondary'
                            } 
                            className="text-[10px]"
                          >
                            {result.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          {new Date(result.orderedDate).toLocaleDateString()}
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          {formatDistanceToNow(new Date(result.reportedDate), { addSuffix: true })}
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </div>
          </ScrollArea>
        </TabsContent>
      ))}
    </Tabs>
  );
}; 