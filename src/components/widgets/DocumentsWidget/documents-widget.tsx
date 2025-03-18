import React, { FC, useState } from 'react';
import { Button } from '@/components/atoms/Button/button';
import { Input } from '@/components/atoms/Input/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/atoms/Dialog/dialog';
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
  MagnifyingGlassIcon,
  ChevronDownIcon,
  ChevronRightIcon,
  CheckIcon,
  ClipboardDocumentCheckIcon,
  IdentificationIcon,
  ClipboardDocumentListIcon,
  DocumentDuplicateIcon,
  ShieldCheckIcon,
  UserIcon,
  CreditCardIcon,
  ClipboardIcon,
  BeakerIcon,
  HeartIcon,
  ArrowPathIcon
} from '@heroicons/react/24/outline';
import { cn } from '@/lib/utils';
import { Checkbox } from "@/components/atoms/Checkbox/checkbox";

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

interface CategoryNode {
  id: string;
  name: string;
  children?: CategoryNode[];
  type?: Document['type'];
  parent?: CategoryNode;
}

// Helper function to add parent references
const addParentReferences = (nodes: CategoryNode[], parent?: CategoryNode): CategoryNode[] => {
  return nodes.map(node => {
    const nodeWithParent = { ...node, parent };
    if (node.children) {
      nodeWithParent.children = addParentReferences(node.children, nodeWithParent);
    }
    return nodeWithParent;
  });
};

const getNodeIcon = (type: string, isParent: boolean = false) => {
  if (isParent) {
    switch (type) {
      case 'consent':
        return <ClipboardDocumentCheckIcon className="w-4 h-4 text-green-500" />;
      case 'insurance':
        return <DocumentDuplicateIcon className="w-4 h-4 text-blue-500" />;
      case 'clinical':
        return <ClipboardDocumentListIcon className="w-4 h-4 text-purple-500" />;
      case 'identification':
        return <IdentificationIcon className="w-4 h-4 text-orange-500" />;
      default:
        return <FolderIcon className="w-4 h-4 text-gray-500" />;
    }
  }

  switch (type) {
    case 'hipaa':
      return <ShieldCheckIcon className="w-4 h-4 text-green-500" />;
    case 'treatment':
      return <ClipboardIcon className="w-4 h-4 text-green-500" />;
    case 'release':
      return <UserIcon className="w-4 h-4 text-green-500" />;
    case 'cards':
      return <CreditCardIcon className="w-4 h-4 text-blue-500" />;
    case 'claims':
      return <DocumentTextIcon className="w-4 h-4 text-blue-500" />;
    case 'authorization':
      return <DocumentCheckIcon className="w-4 h-4 text-blue-500" />;
    case 'history':
      return <ClipboardDocumentListIcon className="w-4 h-4 text-purple-500" />;
    case 'results':
      return <BeakerIcon className="w-4 h-4 text-purple-500" />;
    case 'notes':
      return <HeartIcon className="w-4 h-4 text-purple-500" />;
    default:
      return <DocumentIcon className="w-4 h-4 text-gray-500" />;
  }
};

// Update the document category tree with sub-children
const documentCategoryTree: CategoryNode[] = addParentReferences([
  {
    id: 'consent',
    name: 'Consent Forms',
    type: 'consent',
    children: [
      { id: 'hipaa', name: 'HIPAA Forms', type: 'consent' },
      { 
        id: 'treatment', 
        name: 'Treatment Consent', 
        type: 'consent',
        children: [
          { id: 'surgical', name: 'Surgical Consent', type: 'consent' },
          { id: 'medication', name: 'Medication Consent', type: 'consent' },
          { id: 'procedure', name: 'Procedure Consent', type: 'consent' }
        ]
      },
      { id: 'release', name: 'Release Forms', type: 'consent' }
    ]
  },
  {
    id: 'insurance',
    name: 'Insurance Documents',
    type: 'insurance',
    children: [
      { id: 'cards', name: 'Insurance Cards', type: 'insurance' },
      { id: 'claims', name: 'Claims Documentation', type: 'insurance' },
      { id: 'authorization', name: 'Pre-authorizations', type: 'insurance' }
    ]
  },
  {
    id: 'clinical',
    name: 'Clinical Documents',
    type: 'clinical',
    children: [
      { id: 'history', name: 'Medical History', type: 'clinical' },
      { id: 'results', name: 'Test Results', type: 'clinical' },
      { id: 'notes', name: 'Clinical Notes', type: 'clinical' }
    ]
  },
  {
    id: 'identification',
    name: 'Identification',
    type: 'identification',
    children: [
      { id: 'govt', name: 'Government ID', type: 'identification' },
      { id: 'photo', name: 'Photo ID', type: 'identification' }
    ]
  }
]);

interface TreeNodeProps {
  node: CategoryNode;
  level?: number;
  onSelect: (node: CategoryNode) => void;
  selectedIds: string[];
  searchQuery?: string;
}

const TreeNode: FC<TreeNodeProps> = ({ node, level = 0, onSelect, selectedIds, searchQuery }) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const hasChildren = node.children && node.children.length > 0;
  const isSelected = selectedIds.includes(node.id);
  
  // Get the full path of selected node
  const isInSelectedPath = React.useMemo(() => {
    let current: CategoryNode | undefined = node;
    while (current) {
      if (selectedIds.includes(current.id)) return true;
      current = current.parent;
    }
    return false;
  }, [node, selectedIds]);
  
  // Filter nodes based on search
  const matchesSearch = !searchQuery || 
    node.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    node.children?.some(child => 
      child.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

  if (!matchesSearch) return null;

  return (
    <div className="w-full">
      <div 
        className={cn(
          "flex items-center py-2 px-3 transition-all duration-200 cursor-pointer bg-white dark:bg-gray-900",
          "hover:bg-gray-50 dark:hover:bg-gray-800",
          isSelected ? "bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400" : "",
          isInSelectedPath ? "bg-blue-50/50 dark:bg-blue-900/20" : ""
        )}
        style={{ paddingLeft: `${level * 20}px` }}
        onClick={(e) => {
          e.stopPropagation();
          onSelect(node);
          if (hasChildren) {
            setIsExpanded(!isExpanded);
          }
        }}
      >
        <span className="w-6 h-6 flex items-center justify-center">
          {hasChildren ? (
            isExpanded ? 
              <ChevronDownIcon className="w-4 h-4 transition-transform duration-200" /> : 
              <ChevronRightIcon className="w-4 h-4 transition-transform duration-200" />
          ) : null}
        </span>
        <span className="w-6 h-6 flex items-center justify-center">
          {getNodeIcon(node.id, hasChildren)}
        </span>
        <span className="flex-1 font-medium">{node.name}</span>
        {isSelected && (
          <CheckIcon className="w-4 h-4 text-blue-600 dark:text-blue-400 ml-2 transition-opacity duration-200" />
        )}
      </div>
      <div className={cn(
        "overflow-hidden transition-all duration-200",
        isExpanded ? "max-h-screen opacity-100" : "max-h-0 opacity-0"
      )}>
        {node.children?.map((child) => (
          <TreeNode
            key={child.id}
            node={child}
            level={level + 1}
            onSelect={onSelect}
            selectedIds={selectedIds}
            searchQuery={searchQuery}
          />
        ))}
      </div>
    </div>
  );
};

export const DocumentsWidget: FC<DocumentsWidgetProps> = ({ patientId }) => {
  const [selectedCategories, setSelectedCategories] = useState<string[]>(['all']);
  const [searchQuery, setSearchQuery] = useState('');
  const [categorySearchQuery, setCategorySearchQuery] = useState('');
  const [isFilterDialogOpen, setIsFilterDialogOpen] = useState(false);
  const [selectedDocuments, setSelectedDocuments] = useState<string[]>([]);

  const filteredDocuments = mockDocuments.filter(doc => {
    const matchesCategory = selectedCategories.includes('all') || 
                          selectedCategories.includes(doc.type) ||
                          selectedCategories.some(catId => {
                            const findNode = (nodes: CategoryNode[]): boolean => {
                              for (const node of nodes) {
                                if (node.id === catId && node.type === doc.type) return true;
                                if (node.children && findNode(node.children)) return true;
                              }
                              return false;
                            };
                            return findNode(documentCategoryTree);
                          });
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

  const handleCategorySelect = (node: CategoryNode) => {
    setSelectedCategories(prev => {
      if (node.id === 'all') {
        return ['all'];
      }
      
      const newSelection = prev.filter(id => id !== 'all');
      const nodeIndex = newSelection.indexOf(node.id);
      
      if (nodeIndex === -1) {
        return [...newSelection, node.id];
      } else {
        return newSelection.filter(id => id !== node.id);
      }
    });
  };

  const getSelectedNodesDisplay = () => {
    if (selectedCategories.includes('all')) {
      return 'All Documents';
    }

    if (selectedCategories.length === 0) {
      return 'Select Categories';
    }

    const findNodeNames = (nodes: CategoryNode[], ids: string[]): string[] => {
      const names: string[] = [];
      for (const node of nodes) {
        if (ids.includes(node.id)) {
          names.push(node.name);
        }
        if (node.children) {
          names.push(...findNodeNames(node.children, ids));
        }
      }
      return names;
    };

    const selectedNames = findNodeNames(documentCategoryTree, selectedCategories);
    
    if (selectedNames.length === 1) {
      return selectedNames[0];
    }
    
    return `${selectedNames.length} categories selected`;
  };

  const handleSelectAllDocuments = (checked: boolean) => {
    if (checked) {
      setSelectedDocuments(filteredDocuments.map(doc => doc.id));
    } else {
      setSelectedDocuments([]);
    }
  };

  const handleSelectDocument = (documentId: string, checked: boolean) => {
    if (checked) {
      setSelectedDocuments(prev => [...prev, documentId]);
    } else {
      setSelectedDocuments(prev => prev.filter(id => id !== documentId));
    }
  };

  const isAllSelected = filteredDocuments.length > 0 && 
    filteredDocuments.every(doc => selectedDocuments.includes(doc.id));

  const isSomeSelected = selectedDocuments.length > 0 && !isAllSelected;

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between mb-2 gap-2">
        <div className="flex items-center gap-3 flex-1">
          <div className="relative flex-1 max-w-xs">
            <Input
              type="search"
              placeholder="Search documents..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-lg border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition-all duration-200"
            />
            <MagnifyingGlassIcon className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          </div>
          <div className="flex items-center gap-2">
            <Dialog open={isFilterDialogOpen} onOpenChange={setIsFilterDialogOpen}>
              <DialogTrigger asChild>
                <Button 
                  variant="outline" 
                  className={cn(
                    "gap-2 px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700",
                    "hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors duration-200",
                    "focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400",
                    selectedCategories.length > 0 && !selectedCategories.includes('all') && 
                    "bg-blue-50 dark:bg-blue-900/30 border-blue-200 dark:border-blue-800"
                  )}
                >
                  <FolderIcon className="w-4 h-4" />
                  <span className="font-medium">{getSelectedNodesDisplay()}</span>
                  <ChevronDownIcon className="w-4 h-4 opacity-50" />
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md p-2 overflow-hidden rounded-xl border-0 shadow-xl dark:bg-gray-900">
                <div className="p-4 border-b border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900">
                  <DialogTitle className="text-lg font-semibold mb-3">Filter Documents</DialogTitle>
                  <div className="flex items-center gap-2">
                    <div className="relative flex-1">
                      <Input
                        type="search"
                        placeholder="Search categories..."
                        value={categorySearchQuery}
                        onChange={(e) => setCategorySearchQuery(e.target.value)}
                        className="w-full pl-9 h-9 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition-all duration-200"
                      />
                      <MagnifyingGlassIcon className="w-4 h-4 absolute left-2.5 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    </div>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => {
                        setSelectedCategories(['all']);
                        setCategorySearchQuery('');
                        setIsFilterDialogOpen(false);
                      }}
                      className="h-9 px-4 border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors duration-200"
                    >
                      Reset
                    </Button>
                  </div>
                </div>
                <div className="p-2 bg-white dark:bg-gray-900">
                  <div className="rounded-lg border border-gray-100 dark:border-gray-800 overflow-hidden bg-white dark:bg-gray-900">
                    <div 
                      className={cn(
                        "py-2 px-3 cursor-pointer transition-colors duration-200 bg-white dark:bg-gray-900",
                        "hover:bg-gray-50 dark:hover:bg-gray-800",
                        selectedCategories.includes('all') ? "bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400" : ""
                      )}
                      onClick={() => {
                        handleCategorySelect({ id: 'all', name: 'All Documents' });
                        setIsFilterDialogOpen(false);
                      }}
                    >
                      <div className="flex items-center">
                        <span className="flex-1 font-medium">All Documents</span>
                        {selectedCategories.includes('all') && (
                          <CheckIcon className="w-4 h-4 text-blue-600 dark:text-blue-400 ml-2" />
                        )}
                      </div>
                    </div>
                    <div className="max-h-[400px] overflow-y-auto bg-white dark:bg-gray-900">
                      {documentCategoryTree.map((node) => (
                        <TreeNode
                          key={node.id}
                          node={node}
                          onSelect={handleCategorySelect}
                          selectedIds={selectedCategories}
                          searchQuery={categorySearchQuery}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
            {!selectedCategories.includes('all') && selectedCategories.length > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setSelectedCategories(['all']);
                  setCategorySearchQuery('');
                }}
                className={cn(
                  "w-9 h-9 p-0 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800",
                  "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200",
                  "transition-all duration-200 hover:rotate-180"
                )}
                title="Reset filters"
              >
                <ArrowPathIcon className="w-4 h-4" />
              </Button>
            )}
          </div>
        </div>
        <div className="flex items-center gap-4">
          {selectedDocuments.length > 0 && (
            <>
              <span className="text-sm text-gray-500">
                {selectedDocuments.length} selected
              </span>
              <Button 
                variant="outline" 
                size="sm" 
                className="gap-2 px-4 py-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors duration-200"
                onClick={() => setSelectedDocuments([])}
              >
                Clear selection
              </Button>
            </>
          )}
          <Button 
            variant="outline" 
            size="sm" 
            className="gap-2 px-4 py-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors duration-200"
            disabled={selectedDocuments.length === 0}
          >
            <DocumentArrowDownIcon className="w-4 h-4" />
            Download
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            className="gap-2 px-4 py-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors duration-200"
          >
            <DocumentArrowUpIcon className="w-4 h-4" />
            Upload
          </Button>
          <Button 
            size="sm" 
            className="gap-2 px-4 py-2 rounded-lg bg-blue-500 hover:bg-blue-600 text-white transition-colors duration-200"
          >
            <PlusIcon className="w-4 h-4" />
            New Document
          </Button>
        </div>
      </div>

      {/* Documents table */}
      <div className="flex-1 overflow-auto rounded-xl border border-gray-200 dark:border-gray-700">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50 dark:bg-gray-800">
              <TableHead className="w-[40px] pl-4">
                <div className="flex items-center justify-center">
                  <Checkbox
                    checked={isAllSelected}
                    indeterminate={isSomeSelected}
                    onCheckedChange={handleSelectAllDocuments}
                    aria-label="Select all documents"
                  />
                </div>
              </TableHead>
              <TableHead className="font-semibold text-left">Document Name</TableHead>
              <TableHead className="font-semibold text-left">Category</TableHead>
              <TableHead className="font-semibold text-left">Date Uploaded</TableHead>
              <TableHead className="font-semibold text-left">Uploaded By</TableHead>
              <TableHead className="font-semibold text-left">Status</TableHead>
              <TableHead className="font-semibold text-left">Size</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredDocuments.map((doc) => (
              <TableRow 
                key={doc.id}
                className={cn(
                  "hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors duration-200",
                  selectedDocuments.includes(doc.id) && "bg-blue-50/50 dark:bg-blue-900/20"
                )}
              >
                <TableCell className="w-[40px] pl-4 py-4">
                  <div className="flex items-center justify-center">
                    <Checkbox
                      checked={selectedDocuments.includes(doc.id)}
                      onCheckedChange={(checked: boolean) => handleSelectDocument(doc.id, checked)}
                      aria-label={`Select ${doc.name}`}
                    />
                  </div>
                </TableCell>
                <TableCell className="font-medium py-4">
                  <div className="flex items-center gap-3">
                    {getDocumentIcon(doc.type)}
                    {doc.name}
                  </div>
                </TableCell>
                <TableCell className="py-4">{doc.category}</TableCell>
                <TableCell className="py-4">{doc.dateUploaded}</TableCell>
                <TableCell className="py-4">{doc.uploadedBy}</TableCell>
                <TableCell className="py-4">
                  <span className={cn(
                    "px-2 py-1 rounded-full text-sm font-medium",
                    getStatusColor(doc.status)
                  )}>
                    {doc.status.charAt(0).toUpperCase() + doc.status.slice(1)}
                  </span>
                </TableCell>
                <TableCell className="text-gray-500 py-4">{doc.size}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Empty state with updated styling */}
      {filteredDocuments.length === 0 && (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mb-4">
            <FolderIcon className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold mb-2">No documents found</h3>
          <p className="text-sm text-gray-500 mb-6 max-w-sm">
            {searchQuery 
              ? "No documents match your search criteria" 
              : "Upload new documents using the buttons above"}
          </p>
          <Button 
            size="sm" 
            className="gap-2 px-4 py-2 rounded-lg bg-blue-500 hover:bg-blue-600 text-white transition-colors duration-200"
          >
            <PlusIcon className="w-4 h-4" />
            Upload Document
          </Button>
        </div>
      )}
    </div>
  );
}; 