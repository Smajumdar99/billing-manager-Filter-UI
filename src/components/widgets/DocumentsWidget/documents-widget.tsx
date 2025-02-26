import { FC, useState } from 'react';
import { Button } from '@/components/atoms/Button/button';
import { Input } from '@/components/atoms/Input/input';
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/atoms/Table/table";
import { 
  DocumentIcon, 
  DocumentArrowUpIcon,
  DocumentArrowDownIcon,
  DocumentMagnifyingGlassIcon,
  DocumentCheckIcon,
  DocumentTextIcon,
  FolderIcon,
  PlusIcon,
  MagnifyingGlassIcon
} from '@heroicons/react/24/outline';

interface Document {
  id: string;
  name: string;
  type: 'consent' | 'insurance' | 'clinical' | 'identification' | 'other';
  category: string;
  dateUploaded: string;
  uploadedBy: string;
  status: 'pending' | 'approved' | 'rejected' | 'expired';
  size: string;
}

interface DocumentsWidgetProps {
  patientId: string;
}

// Mock data - Replace with actual API call
const mockDocuments: Document[] = [
  {
    id: '1',
    name: 'Insurance Card Front',
    type: 'insurance',
    category: 'Insurance Documentation',
    dateUploaded: '2024-01-15',
    uploadedBy: 'Front Desk',
    status: 'approved',
    size: '1.2 MB'
  },
  {
    id: '2',
    name: 'Consent Form',
    type: 'consent',
    category: 'Patient Forms',
    dateUploaded: '2024-01-15',
    uploadedBy: 'Patient Portal',
    status: 'pending',
    size: '245 KB'
  },
  {
    id: '3',
    name: 'Driver License',
    type: 'identification',
    category: 'Identification',
    dateUploaded: '2024-01-14',
    uploadedBy: 'Front Desk',
    status: 'approved',
    size: '890 KB'
  },
  {
    id: '4',
    name: 'Medical History Form',
    type: 'clinical',
    category: 'Clinical Documentation',
    dateUploaded: '2024-01-13',
    uploadedBy: 'Patient Portal',
    status: 'approved',
    size: '380 KB'
  },
  {
    id: '5',
    name: 'HIPAA Form',
    type: 'consent',
    category: 'Patient Forms',
    dateUploaded: '2024-01-12',
    uploadedBy: 'Front Desk',
    status: 'approved',
    size: '156 KB'
  }
];

const documentCategories = [
  { id: 'all', name: 'All Documents' },
  { id: 'consent', name: 'Consent Forms' },
  { id: 'insurance', name: 'Insurance Documents' },
  { id: 'clinical', name: 'Clinical Documents' },
  { id: 'identification', name: 'Identification' },
  { id: 'other', name: 'Other Documents' }
];

export const DocumentsWidget: FC<DocumentsWidgetProps> = ({ patientId }) => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredDocuments = mockDocuments.filter(doc => {
    const matchesCategory = selectedCategory === 'all' || doc.type === selectedCategory;
    const matchesSearch = doc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         doc.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const getStatusColor = (status: Document['status']) => {
    switch (status) {
      case 'approved':
        return 'text-green-600';
      case 'pending':
        return 'text-yellow-600';
      case 'rejected':
        return 'text-red-600';
      case 'expired':
        return 'text-gray-600';
      default:
        return 'text-gray-600';
    }
  };

  const getDocumentIcon = (type: Document['type']) => {
    switch (type) {
      case 'consent':
        return <DocumentCheckIcon className="w-5 h-5" />;
      case 'insurance':
        return <DocumentTextIcon className="w-5 h-5" />;
      case 'clinical':
        return <DocumentMagnifyingGlassIcon className="w-5 h-5" />;
      case 'identification':
        return <DocumentIcon className="w-5 h-5" />;
      default:
        return <DocumentIcon className="w-5 h-5" />;
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header with search and filters */}
      <div className="flex items-center justify-between mb-4 gap-4">
        <div className="flex items-center gap-2 flex-1">
          <Input
            type="search"
            placeholder="Search documents..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="max-w-xs"
            icon={<MagnifyingGlassIcon className="w-4 h-4" />}
          />
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="h-9 rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground"
          >
            {documentCategories.map(category => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="gap-2">
            <DocumentArrowDownIcon className="w-4 h-4" />
            Download
          </Button>
          <Button variant="outline" size="sm" className="gap-2">
            <DocumentArrowUpIcon className="w-4 h-4" />
            Upload
          </Button>
          <Button size="sm" className="gap-2">
            <PlusIcon className="w-4 h-4" />
            New Document
          </Button>
        </div>
      </div>

      {/* Documents table */}
      <div className="flex-1 overflow-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Document Name</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Date Uploaded</TableHead>
              <TableHead>Uploaded By</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Size</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredDocuments.map((doc) => (
              <TableRow key={doc.id}>
                <TableCell className="font-medium">
                  <div className="flex items-center gap-2">
                    {getDocumentIcon(doc.type)}
                    {doc.name}
                  </div>
                </TableCell>
                <TableCell>{doc.category}</TableCell>
                <TableCell>{doc.dateUploaded}</TableCell>
                <TableCell>{doc.uploadedBy}</TableCell>
                <TableCell>
                  <span className={getStatusColor(doc.status)}>
                    {doc.status.charAt(0).toUpperCase() + doc.status.slice(1)}
                  </span>
                </TableCell>
                <TableCell>{doc.size}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Empty state */}
      {filteredDocuments.length === 0 && (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <FolderIcon className="w-12 h-12 text-gray-400 mb-4" />
          <h3 className="text-lg font-medium mb-2">No documents found</h3>
          <p className="text-sm text-gray-500 mb-4">
            {searchQuery 
              ? "No documents match your search criteria" 
              : "Upload new documents using the buttons above"}
          </p>
          <Button size="sm" className="gap-2">
            <PlusIcon className="w-4 h-4" />
            Upload Document
          </Button>
        </div>
      )}
    </div>
  );
}; 