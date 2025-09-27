import React, { useState } from 'react';
import { Dialog, DialogContent, DialogFooter, DialogTitle, DialogDescription } from '@/components/atoms/Dialog/dialog';
import { Button } from '@/components/atoms/Button';
import { Input } from '@/components/atoms/Input';
import { Textarea } from '@/components/atoms/Textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/atoms/Select';
import { Badge } from '@/components/atoms/Badge';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faPaperPlane, 
  faTimes, 
  faPlus, 
  faTrash, 
  faUpload, 
  faFile,
  faEnvelope,
  faBuilding,
  faUser,
  faPaperclip
} from '@fortawesome/free-solid-svg-icons';
import { mockClinicLocations } from '@/data/mockFaxes';
import { ClinicLocation } from '@/types/fax';

/**
 * Send Fax Dialog Interface
 */
interface SendFaxDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSend: (faxData: SendFaxData) => void;
  defaultLocation?: ClinicLocation;
}

/**
 * Send Fax Form Data Interface
 */
export interface SendFaxData {
  fromLocation: ClinicLocation;
  toFaxNumbers: string[];
  contactPerson: string;
  subject: string;
  coverNote?: string;
  shareViaEmail?: string[];
  attachments: File[];
}

/**
 * SendFaxDialog Molecule Component
 * 
 * I will use atomic design principles for all components.
 * Comprehensive dialog for sending faxes with location selection, recipients, and attachments.
 */
const SendFaxDialog: React.FC<SendFaxDialogProps> = ({
  isOpen,
  onClose,
  onSend,
  defaultLocation
}) => {
  // Form state
  const [formData, setFormData] = useState<SendFaxData>({
    fromLocation: defaultLocation || mockClinicLocations[0],
    toFaxNumbers: [''],
    contactPerson: '',
    subject: '',
    coverNote: '',
    shareViaEmail: [''],
    attachments: []
  });

  // Validation state
  const [errors, setErrors] = useState<Record<string, string>>({});

  // File upload state
  const [dragActive, setDragActive] = useState(false);

  // Supported file formats
  const supportedFormats = ['jpg', 'jpeg', 'png', 'pdf', 'doc', 'docx'];
  const maxFileSize = 10 * 1024 * 1024; // 10MB

  if (!isOpen) return null;

  // Handle form field changes
  const handleFieldChange = (field: keyof SendFaxData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  // Handle fax number changes
  const handleFaxNumberChange = (index: number, value: string) => {
    const newFaxNumbers = [...formData.toFaxNumbers];
    newFaxNumbers[index] = value;
    setFormData(prev => ({ ...prev, toFaxNumbers: newFaxNumbers }));
  };

  // Add new fax number field
  const addFaxNumber = () => {
    setFormData(prev => ({
      ...prev,
      toFaxNumbers: [...prev.toFaxNumbers, '']
    }));
  };

  // Remove fax number field
  const removeFaxNumber = (index: number) => {
    if (formData.toFaxNumbers.length > 1) {
      const newFaxNumbers = formData.toFaxNumbers.filter((_, i) => i !== index);
      setFormData(prev => ({ ...prev, toFaxNumbers: newFaxNumbers }));
    }
  };

  // Handle email changes
  const handleEmailChange = (index: number, value: string) => {
    const newEmails = [...(formData.shareViaEmail || [''])];
    newEmails[index] = value;
    setFormData(prev => ({ ...prev, shareViaEmail: newEmails }));
  };

  // Add new email field
  const addEmail = () => {
    setFormData(prev => ({
      ...prev,
      shareViaEmail: [...(prev.shareViaEmail || ['']), '']
    }));
  };

  // Remove email field
  const removeEmail = (index: number) => {
    if ((formData.shareViaEmail?.length || 0) > 1) {
      const newEmails = formData.shareViaEmail?.filter((_, i) => i !== index) || [];
      setFormData(prev => ({ ...prev, shareViaEmail: newEmails }));
    }
  };

  // Validate file format and size
  const validateFile = (file: File): string | null => {
    const extension = file.name.split('.').pop()?.toLowerCase();
    if (!extension || !supportedFormats.includes(extension)) {
      return `Unsupported file format. Supported: ${supportedFormats.join(', ')}`;
    }
    if (file.size > maxFileSize) {
      return 'File size must be less than 10MB';
    }
    return null;
  };

  // Handle file upload
  const handleFileUpload = (files: FileList | null) => {
    if (!files) return;

    const validFiles: File[] = [];
    const fileErrors: string[] = [];

    Array.from(files).forEach(file => {
      const error = validateFile(file);
      if (error) {
        fileErrors.push(`${file.name}: ${error}`);
      } else {
        validFiles.push(file);
      }
    });

    if (fileErrors.length > 0) {
      setErrors(prev => ({ ...prev, attachments: fileErrors.join('; ') }));
    } else {
      setErrors(prev => ({ ...prev, attachments: '' }));
    }

    setFormData(prev => ({
      ...prev,
      attachments: [...prev.attachments, ...validFiles]
    }));
  };

  // Remove attachment
  const removeAttachment = (index: number) => {
    setFormData(prev => ({
      ...prev,
      attachments: prev.attachments.filter((_, i) => i !== index)
    }));
  };

  // Handle drag and drop
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    handleFileUpload(e.dataTransfer.files);
  };

  // Form validation
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.fromLocation) {
      newErrors.fromLocation = 'Please select a location';
    }

    const validFaxNumbers = formData.toFaxNumbers.filter(num => num.trim());
    if (validFaxNumbers.length === 0) {
      newErrors.toFaxNumbers = 'At least one fax number is required';
    }

    if (!formData.contactPerson.trim()) {
      newErrors.contactPerson = 'Contact person is required';
    }

    if (!formData.subject.trim()) {
      newErrors.subject = 'Subject is required';
    }

    // Validate email format if provided
    const validEmails = formData.shareViaEmail?.filter(email => email.trim()) || [];
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const invalidEmails = validEmails.filter(email => !emailRegex.test(email));
    if (invalidEmails.length > 0) {
      newErrors.shareViaEmail = 'Please enter valid email addresses';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSend = () => {
    if (validateForm()) {
      // Filter out empty values
      const cleanedData = {
        ...formData,
        toFaxNumbers: formData.toFaxNumbers.filter(num => num.trim()),
        shareViaEmail: formData.shareViaEmail?.filter(email => email.trim()) || []
      };
      onSend(cleanedData);
      onClose();
    }
  };

  // Reset form and close
  const handleClose = () => {
    setFormData({
      fromLocation: defaultLocation || mockClinicLocations[0],
      toFaxNumbers: [''],
      contactPerson: '',
      subject: '',
      coverNote: '',
      shareViaEmail: [''],
      attachments: []
    });
    setErrors({});
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent
        className="sm:max-w-[800px] p-0 flex flex-col max-h-[90vh] overflow-auto bg-gradient-to-br from-orange-50 to-blue-100"
      >
        {/* Accessible dialog title for screen readers, visually hidden */}
        <DialogTitle className="sr-only">Send Fax</DialogTitle>
        {/* Accessible dialog description for screen readers, visually hidden */}
        <DialogDescription className="sr-only">
          Send a fax to external recipients with attachments and cover notes
        </DialogDescription>
        
        {/* Dialog Title */}
        <div className="px-4 py-2 rounded-t-xl">
          <h2 className="text-base font-semibold text-gray-900 flex items-center gap-2">
            <FontAwesomeIcon icon={faPaperPlane} className="h-5 w-5 text-blue-600" />
            Send Fax
          </h2>
        </div>
        
        {/* Main content */}
        <div className="flex flex-1 min-h-0 overflow-hidden p-4">
          <div className="w-full p-6 space-y-6 bg-white rounded-xl border border-gray-200 shadow-sm h-full flex flex-col overflow-y-auto">
          {/* From Location */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide flex items-center gap-2">
              <FontAwesomeIcon icon={faBuilding} className="h-4 w-4" />
              From Location *
            </label>
            <Select
              value={formData.fromLocation.id}
              onValueChange={(value) => {
                const location = mockClinicLocations.find(loc => loc.id === value);
                if (location) handleFieldChange('fromLocation', location);
              }}
            >
              <SelectTrigger className={errors.fromLocation ? 'border-red-500' : ''}>
                <SelectValue placeholder="Select clinic location" />
              </SelectTrigger>
              <SelectContent>
                {mockClinicLocations.map((location) => (
                  <SelectItem key={location.id} value={location.id}>
                    <div>
                      <div className="font-medium">{location.name}</div>
                      <div className="text-sm text-gray-500">{location.faxNumber}</div>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.fromLocation && (
              <p className="text-sm text-red-600">{errors.fromLocation}</p>
            )}
          </div>

          {/* To Fax Numbers */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">To Fax Numbers *</label>
            {formData.toFaxNumbers.map((faxNumber, index) => (
              <div key={index} className="flex items-center gap-2">
                <Input
                  type="tel"
                  placeholder="(555) 123-4567"
                  value={faxNumber}
                  onChange={(e) => handleFaxNumberChange(index, e.target.value)}
                  className={errors.toFaxNumbers ? 'border-red-500' : ''}
                />
                {formData.toFaxNumbers.length > 1 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeFaxNumber(index)}
                    className="h-10 w-10 p-0 text-red-600"
                  >
                    <FontAwesomeIcon icon={faTrash} className="h-4 w-4" />
                  </Button>
                )}
              </div>
            ))}
            <Button
              variant="outline"
              size="sm"
              onClick={addFaxNumber}
              className="flex items-center gap-2"
            >
              <FontAwesomeIcon icon={faPlus} className="h-3 w-3" />
              Add Fax Number
            </Button>
            {errors.toFaxNumbers && (
              <p className="text-sm text-red-600">{errors.toFaxNumbers}</p>
            )}
          </div>

          {/* Contact Person */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide flex items-center gap-2">
              <FontAwesomeIcon icon={faUser} className="h-4 w-4" />
              Contact Person *
            </label>
            <Input
              placeholder="Dr. John Smith"
              value={formData.contactPerson}
              onChange={(e) => handleFieldChange('contactPerson', e.target.value)}
              className={errors.contactPerson ? 'border-red-500' : ''}
            />
            {errors.contactPerson && (
              <p className="text-sm text-red-600">{errors.contactPerson}</p>
            )}
          </div>

          {/* Subject */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Subject *</label>
            <Input
              placeholder="Patient Treatment Plan Update"
              value={formData.subject}
              onChange={(e) => handleFieldChange('subject', e.target.value)}
              className={errors.subject ? 'border-red-500' : ''}
            />
            {errors.subject && (
              <p className="text-sm text-red-600">{errors.subject}</p>
            )}
          </div>

          {/* Cover Note */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Cover Note (Optional)</label>
            <Textarea
              placeholder="Please find attached the patient treatment plan update. Contact me if you have any questions."
              rows={3}
              value={formData.coverNote}
              onChange={(e) => handleFieldChange('coverNote', e.target.value)}
            />
          </div>

          {/* Share via Email */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide flex items-center gap-2">
              <FontAwesomeIcon icon={faEnvelope} className="h-4 w-4" />
              Share via Email (Optional)
            </label>
            {(formData.shareViaEmail || ['']).map((email, index) => (
              <div key={index} className="flex items-center gap-2">
                <Input
                  type="email"
                  placeholder="doctor@example.com"
                  value={email}
                  onChange={(e) => handleEmailChange(index, e.target.value)}
                  className={errors.shareViaEmail ? 'border-red-500' : ''}
                />
                {(formData.shareViaEmail?.length || 0) > 1 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeEmail(index)}
                    className="h-10 w-10 p-0 text-red-600"
                  >
                    <FontAwesomeIcon icon={faTrash} className="h-4 w-4" />
                  </Button>
                )}
              </div>
            ))}
            <Button
              variant="outline"
              size="sm"
              onClick={addEmail}
              className="flex items-center gap-2"
            >
              <FontAwesomeIcon icon={faPlus} className="h-3 w-3" />
              Add Email
            </Button>
            {errors.shareViaEmail && (
              <p className="text-sm text-red-600">{errors.shareViaEmail}</p>
            )}
          </div>

          {/* File Attachments */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide flex items-center gap-2">
              <FontAwesomeIcon icon={faPaperclip} className="h-4 w-4" />
              File Attachments
            </label>
            
            {/* Drop Zone */}
            <div
              className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
                dragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
              }`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              <FontAwesomeIcon icon={faUpload} className="h-8 w-8 text-gray-400 mb-2" />
              <p className="text-sm text-gray-600 mb-2">
                Drag and drop files here, or{' '}
                <label className="text-blue-600 hover:text-blue-700 cursor-pointer">
                  click to browse
                  <input
                    type="file"
                    multiple
                    accept=".jpg,.jpeg,.png,.pdf,.doc,.docx"
                    onChange={(e) => handleFileUpload(e.target.files)}
                    className="hidden"
                  />
                </label>
              </p>
              <p className="text-xs text-gray-500">
                Supported formats: {supportedFormats.join(', ')} (Max 10MB each)
              </p>
            </div>

            {errors.attachments && (
              <p className="text-sm text-red-600">{errors.attachments}</p>
            )}

            {/* Attached Files */}
            {formData.attachments.length > 0 && (
              <div className="space-y-2">
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Attached Files:</label>
                {formData.attachments.map((file, index) => (
                  <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                    <div className="flex items-center gap-2">
                      <FontAwesomeIcon icon={faFile} className="h-4 w-4 text-blue-600" />
                      <span className="text-sm">{file.name}</span>
                      <Badge variant="secondary" className="text-xs">
                        {(file.size / 1024 / 1024).toFixed(1)}MB
                      </Badge>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeAttachment(index)}
                      className="h-8 w-8 p-0 text-red-600"
                    >
                      <FontAwesomeIcon icon={faTrash} className="h-3 w-3" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>

          </div>
        </div>
        
        {/* Footer */}
        <DialogFooter className="py-2.5 px-4">
          <Button variant="ghost" onClick={handleClose} className="px-3 h-9 font-normal border-gray-200 text-sm">Cancel</Button>
          <Button variant="default" onClick={handleSend} className="flex items-center gap-2">
            <FontAwesomeIcon icon={faPaperPlane} className="h-4 w-4" />
            Send Fax
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default SendFaxDialog;
