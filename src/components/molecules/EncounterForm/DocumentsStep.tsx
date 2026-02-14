import React, { useState } from 'react';
import { Label } from '@/components/atoms/Label/label';
import { Button } from '@/components/atoms/Button';
import { 
  DocumentArrowUpIcon, 
  XMarkIcon,
  DocumentTextIcon,
  PhotoIcon,
  DocumentIcon
} from '@heroicons/react/24/outline';

interface DocumentsStepProps {
  data: any;
  updateData: (data: any) => void;
}

interface UploadedFile {
  id: string;
  name: string;
  size: number;
  type: string;
  uploadedAt: Date;
}

export const DocumentsStep: React.FC<DocumentsStepProps> = ({ data, updateData }) => {
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>(data.documents || []);
  const [isDragging, setIsDragging] = useState(false);

  const handleFileUpload = (files: FileList | null) => {
    if (!files) return;

    const newFiles: UploadedFile[] = Array.from(files).map(file => ({
      id: `${Date.now()}-${file.name}`,
      name: file.name,
      size: file.size,
      type: file.type,
      uploadedAt: new Date(),
    }));

    const updatedFiles = [...uploadedFiles, ...newFiles];
    setUploadedFiles(updatedFiles);
    updateData({ ...data, documents: updatedFiles });
  };

  const handleRemoveFile = (fileId: string) => {
    const updatedFiles = uploadedFiles.filter(f => f.id !== fileId);
    setUploadedFiles(updatedFiles);
    updateData({ ...data, documents: updatedFiles });
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    handleFileUpload(e.dataTransfer.files);
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  const getFileIcon = (type: string) => {
    if (type.startsWith('image/')) return PhotoIcon;
    if (type.includes('pdf')) return DocumentTextIcon;
    return DocumentIcon;
  };

  return (
    <div className="space-y-6">
      {/* Upload Area */}
      <div className="space-y-3">
        <Label className="text-base font-semibold text-gray-800">
          Upload Documents
        </Label>
        <p className="text-sm text-gray-600">
          Attach relevant documents such as lab results, referrals, consent forms, or other clinical documentation.
        </p>

        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`border-2 border-dashed rounded-lg p-8 flex flex-col items-center justify-center text-center transition-all cursor-pointer ${
            isDragging
              ? 'border-primary bg-primary/5 scale-[1.02]'
              : 'border-gray-300 hover:border-primary/50 hover:bg-gray-50'
          }`}
        >
          <DocumentArrowUpIcon className="h-12 w-12 text-gray-400 mb-3" />
          <span className="text-sm font-medium text-gray-700 mb-1">
            Drag and drop files here
          </span>
          <span className="text-xs text-gray-500 mb-4">or</span>
          
          <label htmlFor="file-upload">
            <Button
              type="button"
              variant="outline"
              className="cursor-pointer"
              onClick={() => document.getElementById('file-upload')?.click()}
            >
              Browse Files
            </Button>
          </label>
          
          <input
            id="file-upload"
            type="file"
            multiple
            accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
            onChange={(e) => handleFileUpload(e.target.files)}
            className="hidden"
          />
          
          <p className="text-xs text-gray-400 mt-3">
            Supported formats: PDF, JPG, PNG, DOC, DOCX (Max 10MB per file)
          </p>
        </div>
      </div>

      {/* Uploaded Files List */}
      {uploadedFiles.length > 0 && (
        <div className="space-y-3">
          <Label className="text-base font-semibold text-gray-800">
            Uploaded Documents ({uploadedFiles.length})
          </Label>
          
          <div className="space-y-2">
            {uploadedFiles.map((file) => {
              const FileIcon = getFileIcon(file.type);
              
              return (
                <div
                  key={file.id}
                  className="flex items-center gap-3 p-3 bg-white border border-gray-200 rounded-lg hover:shadow-sm transition-shadow"
                >
                  <div className="flex-shrink-0">
                    <FileIcon className="h-8 w-8 text-primary" />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {file.name}
                    </p>
                    <p className="text-xs text-gray-500">
                      {formatFileSize(file.size)} • Uploaded {file.uploadedAt.toLocaleTimeString()}
                    </p>
                  </div>
                  
                  <button
                    onClick={() => handleRemoveFile(file.id)}
                    className="flex-shrink-0 p-1.5 hover:bg-red-50 rounded-full transition-colors group"
                    title="Remove file"
                  >
                    <XMarkIcon className="h-5 w-5 text-gray-400 group-hover:text-red-600" />
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Info Box */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <p className="text-xs text-blue-800">
          <strong>Note:</strong> All uploaded documents will be securely stored in the patient's chart and can be accessed from the Documents tab.
        </p>
      </div>
    </div>
  );
};
