import { FC } from 'react';
import { Badge } from '@/components/atoms/Badge/badge';
import { ScrollArea } from '@/components/atoms/ScrollArea/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/molecules/Tabs/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/atoms/Table/table';
import { formatDistanceToNow } from 'date-fns';
import { mockAllergies, Allergy } from './mock-data';

export interface AllergiesWidgetProps {
  patientId: string;
  className?: string;
}

export const AllergiesWidget: FC<AllergiesWidgetProps> = ({ patientId, className }) => {
  return (
    <Tabs defaultValue="all" className="flex h-full flex-col">
      <TabsList className="pl-2 shrink-0 w-full justify-start gap-2">
        <TabsTrigger value="all">
          All
          <Badge variant="secondary" className="ml-2 h-4 w-4">
            {mockAllergies.length}
          </Badge>
        </TabsTrigger>
        <TabsTrigger value="medication">
          Medication
          <Badge variant="secondary" className="ml-2 h-4 w-4">
            {mockAllergies.filter(a => a.type === 'medication').length}
          </Badge>
        </TabsTrigger>
        <TabsTrigger value="others">
          Others
          <Badge variant="secondary" className="ml-2 h-4 w-4">
            {mockAllergies.filter(a => a.type === 'food' || a.type === 'environmental').length}
          </Badge>
        </TabsTrigger>
      </TabsList>

      {(['all', 'medication', 'others'] as const).map(tabValue => (
        <TabsContent key={tabValue} value={tabValue} className="flex-1 min-h-0">
          <ScrollArea className="h-full">
            <div className="pl-2 pr-4 pt-2">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Allergen</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Severity</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Reactions</TableHead>
                    <TableHead>Onset Date</TableHead>
                    <TableHead>Last Updated</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockAllergies
                    .filter(allergy => {
                      if (tabValue === 'all') return true;
                      if (tabValue === 'others') return allergy.type === 'food' || allergy.type === 'environmental';
                      return allergy.type === tabValue;
                    })
                    .map(allergy => (
                      <TableRow key={allergy.id}>
                        <TableCell className="font-medium">{allergy.allergen}</TableCell>
                        <TableCell>
                          <Badge variant="outline" className="text-[10px]">
                            {allergy.type}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge 
                            variant={
                              allergy.severity === 'severe' ? 'destructive' : 
                              allergy.severity === 'moderate' ? 'default' : 
                              'secondary'
                            } 
                            className="text-[10px]"
                          >
                            {allergy.severity}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge 
                            variant={allergy.status === 'active' ? 'default' : 'secondary'}
                            className="text-[10px]"
                          >
                            {allergy.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-wrap gap-1">
                            {allergy.reaction.map((reaction, index) => (
                              <Badge key={index} variant="secondary" className="text-[10px]">
                                {reaction}
                              </Badge>
                            ))}
                          </div>
                        </TableCell>
                        <TableCell className="text-xs text-muted-foreground">
                          {new Date(allergy.onsetDate).toLocaleDateString()}
                        </TableCell>
                        <TableCell className="text-xs text-muted-foreground">
                          {allergy.updatedBy} • {formatDistanceToNow(new Date(allergy.lastUpdated), { addSuffix: true })}
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