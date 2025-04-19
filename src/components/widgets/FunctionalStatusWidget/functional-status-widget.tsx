import { FC } from 'react';
import { Button } from '@/components/atoms/Button/button';
import { PlusIcon, PencilSquareIcon, PrinterIcon } from '@heroicons/react/24/outline';
import { Checkbox } from '@/components/atoms/Checkbox/checkbox';
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/atoms/Table/table";
import { cn } from '@/lib/utils';

interface StatusItem {
  code: string;
  description: string;
  beginDate: string;
  endDate: string;
  status: string;
  comments: string;
  encounter: number;
  reportedByClient: boolean;
}

interface FunctionalStatusWidgetProps {
  patientId: string;
  isFullscreen?: boolean;
}

export const FunctionalStatusWidget: FC<FunctionalStatusWidgetProps> = ({ patientId, isFullscreen = false }) => {
  const mockFunctionalStatus: StatusItem[] = [
    {
      code: "ICD10:P05.04",
      description: "Newborn light for gestational age, 1000-1249 grams",
      beginDate: "03/17/2025 16:51:52",
      endDate: "03/24/2025 16:51:55",
      status: "Active",
      comments: "Dummy Status",
      encounter: 0,
      reportedByClient: false
    },
    {
      code: "ICD10:S43.121A",
      description: "Dislocation of right acromioclavicular joint, 100%-200% displacement, initial encounter",
      beginDate: "03/18/2025 17:33:40",
      endDate: "03/26/2025 17:33:42",
      status: "Active",
      comments: "",
      encounter: 0,
      reportedByClient: false
    },
    {
      code: "ICD10:R26.2",
      description: "Difficulty in walking, not elsewhere classified",
      beginDate: "03/19/2025 09:15:30",
      endDate: "03/27/2025 09:15:30",
      status: "Active",
      comments: "Requires assistance",
      encounter: 0,
      reportedByClient: true
    },
    {
      code: "ICD10:R27.0",
      description: "Ataxia, unspecified",
      beginDate: "03/20/2025 14:22:10",
      endDate: "03/28/2025 14:22:10",
      status: "Active",
      comments: "Under evaluation",
      encounter: 0,
      reportedByClient: false
    }
  ];

  if (!isFullscreen) {
    return (
      <div className="h-full flex flex-col overflow-hidden">
        <div className="flex-1 overflow-y-auto">
          <div className="grid grid-cols-1 gap-4 p-1">
            {mockFunctionalStatus.map((status, index) => (
              <div 
                key={index}
                className="p-4 rounded-lg border border-gray-200 bg-white"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="font-medium flex items-center gap-2 text-blue-600">
                      {status.code}
                    </h4>
                    <p className="text-sm text-gray-600 mt-1">{status.description}</p>
                  </div>
                  <span className={cn(
                    "text-xs px-2 py-1 rounded-full",
                    status.status === "Active" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-700"
                  )}>
                    {status.status}
                  </span>
                </div>
                <div className="mt-3 text-sm text-gray-500">
                  <div className="flex flex-col gap-1">
                    {status.comments && (
                      <span>Comments: {status.comments}</span>
                    )}
                    <div className="flex justify-between items-center">
                      <span>Begin: {status.beginDate}</span>
                      <span>End: {status.endDate}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Enc: {status.encounter}</span>
                      <span>Reported by Client: {status.reportedByClient ? "Yes" : "No"}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="h-14 border-t bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/75 flex items-center px-4 gap-2">
          <Button
            variant="link"
            size="sm"
            className="gap-1.5 shrink-0"
            onClick={() => console.log('Add Status')}
          >
            <PlusIcon className="w-4 h-4" />
            Add
          </Button>
          <Button
            variant="link"
            size="sm"
            className="gap-1.5 shrink-0"
            onClick={() => console.log('Edit Status')}
          >
            <PencilSquareIcon className="w-4 h-4" />
            Edit
          </Button>
          <Button
            variant="link"
            size="sm"
            className="gap-1.5 shrink-0"
            onClick={() => console.log('Preview/Print Status')}
          >
            <PrinterIcon className="w-4 h-4" />
            Preview / Print
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      <div className="flex-1 overflow-auto rounded-xl border border-gray-200 dark:border-gray-700">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50 dark:bg-gray-800">
              <TableHead className="w-[40px] pl-4">
                <div className="flex items-center justify-center">
                  <Checkbox />
                </div>
              </TableHead>
              <TableHead className="font-semibold text-left">Title</TableHead>
              <TableHead className="font-semibold text-left">Begin</TableHead>
              <TableHead className="font-semibold text-left">End</TableHead>
              <TableHead className="font-semibold text-left">Status</TableHead>
              <TableHead className="font-semibold text-left">Comments</TableHead>
              <TableHead className="font-semibold text-left">Enc</TableHead>
              <TableHead className="font-semibold text-left">Reported by Client</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {mockFunctionalStatus.map((status, index) => (
              <TableRow 
                key={index}
                className="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors duration-200"
              >
                <TableCell className="w-[40px] pl-4 py-4">
                  <div className="flex items-center justify-center">
                    <Checkbox />
                  </div>
                </TableCell>
                <TableCell className="font-medium py-4">
                  <div className="text-blue-600 hover:underline cursor-pointer">
                    {status.code}
                  </div>
                  <div className="text-sm text-gray-600 mt-1">
                    {status.description}
                  </div>
                </TableCell>
                <TableCell className="py-4 text-sm">{status.beginDate}</TableCell>
                <TableCell className="py-4 text-sm">{status.endDate}</TableCell>
                <TableCell className="py-4">
                  <span className="text-red-600 text-sm">{status.status}</span>
                </TableCell>
                <TableCell className="py-4 text-sm">{status.comments}</TableCell>
                <TableCell className="py-4 text-sm">{status.encounter}</TableCell>
                <TableCell className="py-4 text-sm">
                  {status.reportedByClient ? "Yes" : "No"}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <div className="h-14 border-t bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/75 flex items-center px-4 gap-2">
        <Button
          variant="link"
          size="sm"
          className="gap-1.5 shrink-0"
          onClick={() => console.log('Add Status')}
        >
          <PlusIcon className="w-4 h-4" />
          Add
        </Button>
        <Button
          variant="link"
          size="sm"
          className="gap-1.5 shrink-0"
          onClick={() => console.log('Edit Status')}
        >
          <PencilSquareIcon className="w-4 h-4" />
          Edit
        </Button>
        <Button
          variant="link"
          size="sm"
          className="gap-1.5 shrink-0"
          onClick={() => console.log('Preview/Print Status')}
        >
          <PrinterIcon className="w-4 h-4" />
          Preview / Print
        </Button>
      </div>
    </div>
  );
}; 