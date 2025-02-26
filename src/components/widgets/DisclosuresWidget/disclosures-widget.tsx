import { FC } from 'react';
import { Badge } from '@/components/atoms/Badge/badge';
import { ScrollArea } from '@/components/atoms/ScrollArea/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/molecules/Tabs/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/atoms/Table/table';
import { formatDistanceToNow } from 'date-fns';

interface DisclosuresWidgetProps {
  patientId: string;
  className?: string;
  isFullscreen?: boolean;
}

interface Disclosure {
  id: string;
  type: 'hipaa' | 'consent' | 'authorization' | 'directive' | 'acknowledgment';
  category: 'privacy' | 'treatment' | 'research' | 'financial' | 'communication';
  name: string;
  status: 'active' | 'expired' | 'revoked';
  signedBy: string;
  signedDate: string;
  expirationDate: string;
  notes?: string;
}

const mockDisclosures: Disclosure[] = [
  {
    id: '1',
    type: 'hipaa',
    category: 'privacy',
    name: 'Notice of Privacy Practices Acknowledgment',
    status: 'active',
    signedBy: 'John Doe',
    signedDate: '2024-01-15',
    expirationDate: '2025-01-15',
    notes: 'Annual renewal required'
  },
  {
    id: '2',
    type: 'authorization',
    category: 'communication',
    name: 'Authorization to Release Information to Family Members',
    status: 'active',
    signedBy: 'John Doe',
    signedDate: '2024-01-15',
    expirationDate: '2025-01-15',
    notes: 'Authorized: Spouse - Jane Doe'
  },
  {
    id: '3',
    type: 'consent',
    category: 'treatment',
    name: 'General Consent for Treatment',
    status: 'active',
    signedBy: 'John Doe',
    signedDate: '2024-01-15',
    expirationDate: '2025-01-15'
  },
  {
    id: '4',
    type: 'acknowledgment',
    category: 'financial',
    name: 'Financial Responsibility Agreement',
    status: 'active',
    signedBy: 'John Doe',
    signedDate: '2024-01-15',
    expirationDate: '2025-01-15'
  },
  {
    id: '5',
    type: 'directive',
    category: 'treatment',
    name: 'Advance Directive / Living Will',
    status: 'active',
    signedBy: 'John Doe',
    signedDate: '2023-06-15',
    expirationDate: '2028-06-15',
    notes: 'Full code status'
  },
  {
    id: '6',
    type: 'consent',
    category: 'research',
    name: 'Clinical Trial Participation Consent',
    status: 'expired',
    signedBy: 'John Doe',
    signedDate: '2023-01-15',
    expirationDate: '2024-01-15',
    notes: 'Study ID: CT2023-456'
  },
  {
    id: '7',
    type: 'authorization',
    category: 'communication',
    name: 'Telehealth Consent',
    status: 'active',
    signedBy: 'John Doe',
    signedDate: '2024-01-15',
    expirationDate: '2025-01-15'
  },
  {
    id: '8',
    type: 'authorization',
    category: 'privacy',
    name: 'Authorization to Release Records to External Provider',
    status: 'revoked',
    signedBy: 'John Doe',
    signedDate: '2023-12-01',
    expirationDate: '2024-12-01',
    notes: 'Previously authorized: Dr. Smith Clinic'
  }
];

export const DisclosuresWidget: FC<DisclosuresWidgetProps> = ({ patientId, className = '', isFullscreen }) => {
  return (
    <Tabs defaultValue="active" className={`flex h-full flex-col ${className}`}>
      <TabsList className="shrink-0 w-full justify-start gap-2 px-1">
        <TabsTrigger value="active">
          Active
          <Badge variant="secondary" className="ml-2 h-4 w-4">
            {mockDisclosures.filter(d => d.status === 'active').length}
          </Badge>
        </TabsTrigger>
        <TabsTrigger value="expired">
          Expired
          <Badge variant="secondary" className="ml-2 h-4 w-4">
            {mockDisclosures.filter(d => d.status === 'expired').length}
          </Badge>
        </TabsTrigger>
        <TabsTrigger value="revoked">
          Revoked
          <Badge variant="secondary" className="ml-2 h-4 w-4">
            {mockDisclosures.filter(d => d.status === 'revoked').length}
          </Badge>
        </TabsTrigger>
        <TabsTrigger value="all">
          All
          <Badge variant="secondary" className="ml-2 h-4 w-4">
            {mockDisclosures.length}
          </Badge>
        </TabsTrigger>
      </TabsList>

      {(['active', 'expired', 'revoked', 'all'] as const).map(tabValue => (
        <TabsContent key={tabValue} value={tabValue} className="flex-1 min-h-0">
          <ScrollArea className="h-full">
            <div className="p-4">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Signed By</TableHead>
                    <TableHead>Signed Date</TableHead>
                    <TableHead>Expiration</TableHead>
                    <TableHead>Notes</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockDisclosures
                    .filter(disclosure => tabValue === 'all' || disclosure.status === tabValue)
                    .map(disclosure => (
                      <TableRow key={disclosure.id}>
                        <TableCell className="font-medium">{disclosure.name}</TableCell>
                        <TableCell>
                          <Badge variant="outline" className="capitalize">
                            {disclosure.type}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge 
                            variant={
                              disclosure.status === 'active' ? 'default' :
                              disclosure.status === 'expired' ? 'secondary' :
                              'destructive'
                            }
                            className={
                              disclosure.status === 'active' ? 'bg-green-100 text-green-800' :
                              disclosure.status === 'expired' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-red-100 text-red-800'
                            }
                          >
                            {disclosure.status}
                          </Badge>
                        </TableCell>
                        <TableCell>{disclosure.signedBy}</TableCell>
                        <TableCell>{new Date(disclosure.signedDate).toLocaleDateString()}</TableCell>
                        <TableCell>
                          <span className={
                            new Date(disclosure.expirationDate) < new Date() ? 'text-red-600' :
                            new Date(disclosure.expirationDate) < new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) ? 'text-yellow-600' :
                            'text-green-600'
                          }>
                            {formatDistanceToNow(new Date(disclosure.expirationDate), { addSuffix: true })}
                          </span>
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          {disclosure.notes}
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