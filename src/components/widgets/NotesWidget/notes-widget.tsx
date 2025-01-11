import { FC } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/molecules/Tabs/tabs';
import { ScrollArea } from '@/components/atoms/ScrollArea/scroll-area';
import { Badge } from '@/components/atoms/Badge/badge';
import { formatDistanceToNow } from 'date-fns';

interface NotesWidgetProps {
  patientId: string;
}

type NoteType = 'progress' | 'consults_procedures' | 'orders';

interface Note {
  id: string;
  type: NoteType;
  category?: 'progress' | 'nursing' | 'consult' | 'procedure' | 'order';
  title: string;
  content: string;
  author: string;
  timestamp: string;
  specialty?: string;
  urgency?: 'routine' | 'urgent' | 'stat';
}

const mockNotes: Note[] = [
  {
    id: '1',
    type: 'progress',
    category: 'progress',
    title: 'Daily Progress Note',
    content: 'Patient continues to improve. Vital signs stable. Afebrile. Lungs clear bilaterally. Cardiovascular: Regular rate and rhythm. Abdomen soft, non-tender. Plan: Continue current medications, advance diet as tolerated.',
    author: 'Dr. Sarah Chen',
    timestamp: '2024-01-10T09:30:00Z',
  },
  {
    id: '2',
    type: 'progress',
    category: 'progress',
    title: 'Follow-up Note',
    content: 'Patient reports improved breathing. No chest pain. Decreased lower extremity edema. SpO2 96% on room air. Continue diuretics, adjust dosing based on response.',
    author: 'Dr. James Wilson',
    timestamp: '2024-01-09T15:45:00Z',
  },
  {
    id: '5',
    type: 'progress',
    category: 'nursing',
    title: 'Nursing Assessment',
    content: 'Patient alert and oriented x3. Pain well controlled (2/10). Medications administered as scheduled. Ambulating with assistance. Tolerating diet well. Foley catheter removed, voiding independently.',
    author: 'RN Jessica Thompson',
    timestamp: '2024-01-10T07:00:00Z',
  },
  {
    id: '3',
    type: 'consults_procedures',
    category: 'consult',
    title: 'Cardiology Consult',
    content: 'Reason for consult: Evaluation of new onset atrial fibrillation. Recommendations: 1. Start beta blocker 2. Anticoagulation with CHAD-VASc score 3 3. Follow-up echo in 2 weeks',
    author: 'Dr. Michael Lee',
    specialty: 'Cardiology',
    timestamp: '2024-01-08T11:20:00Z',
  },
  {
    id: '4',
    type: 'consults_procedures',
    category: 'procedure',
    title: 'Central Line Placement',
    content: 'Procedure: Right internal jugular central line placement. Indication: Need for secure access for medication administration. Complications: None. Ultrasound guidance used. Post-procedure chest x-ray confirms proper positioning.',
    author: 'Dr. Emily Rodriguez',
    timestamp: '2024-01-07T14:15:00Z',
    urgency: 'urgent',
  },
  {
    id: '6',
    type: 'orders',
    category: 'order',
    title: 'Medication Orders',
    content: '1. Lasix 40mg IV daily\n2. Metoprolol 25mg PO BID\n3. Eliquis 5mg PO BID\n4. Continue home medications as listed',
    author: 'Dr. Sarah Chen',
    timestamp: '2024-01-10T10:00:00Z',
    urgency: 'routine',
  },
];

export const NotesWidget: FC<NotesWidgetProps> = ({ patientId }) => {
  return (
    <Tabs defaultValue="progress" className="flex h-full flex-col">
      <TabsList className="shrink-0 w-full justify-start gap-2 px-1">
        <TabsTrigger value="progress" className="relative">
          Progress
          <Badge variant="secondary" className="ml-2 h-4 w-4">
            {mockNotes.filter(note => note.type === 'progress').length}
          </Badge>
        </TabsTrigger>
        <TabsTrigger value="consults_procedures">
          Consults
          <Badge variant="secondary" className="ml-2 h-4 w-4">
            {mockNotes.filter(note => note.type === 'consults_procedures').length}
          </Badge>
        </TabsTrigger>
        <TabsTrigger value="orders">
          Orders
          <Badge variant="secondary" className="ml-2 h-4 w-4">
            {mockNotes.filter(note => note.type === 'orders').length}
          </Badge>
        </TabsTrigger>
      </TabsList>
      
      {(['progress', 'consults_procedures', 'orders'] as NoteType[]).map(type => (
        <TabsContent key={type} value={type} className="flex-1 min-h-0">
          <ScrollArea className="h-full">
            <div className="space-y-4 p-4">
              {mockNotes
                .filter(note => note.type === type)
                .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
                .map(note => (
                  <div key={note.id} className="rounded-lg border p-3 space-y-1.5">
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="text-sm font-medium">{note.title}</h4>
                          {note.category && (
                            <Badge variant="outline" className="text-[10px]">
                              {note.category === 'nursing' ? 'Nursing'
                                : note.category === 'consult' ? 'Consult'
                                : note.category === 'procedure' ? 'Procedure'
                                : note.category === 'order' ? 'Order'
                                : 'Progress'}
                            </Badge>
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground">
                          {note.author} • {formatDistanceToNow(new Date(note.timestamp), { addSuffix: true })}
                          {note.specialty && ` • ${note.specialty}`}
                        </p>
                      </div>
                      {note.urgency && (
                        <Badge variant={note.urgency === 'stat' ? 'destructive' : note.urgency === 'urgent' ? 'default' : 'secondary'} className="text-[10px]">
                          {note.urgency}
                        </Badge>
                      )}
                    </div>
                    <p className="text-xs leading-relaxed whitespace-pre-wrap">{note.content}</p>
                  </div>
                ))}
            </div>
          </ScrollArea>
        </TabsContent>
      ))}
    </Tabs>
  );
}; 