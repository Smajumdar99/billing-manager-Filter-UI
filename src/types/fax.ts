/**
 * Fax Center Type Definitions
 * 
 * Type definitions for behavioral health clinic fax management system.
 * Includes incoming and outgoing fax data structures.
 */

// Status options for incoming faxes in behavioral health workflow
export type FaxStatus = 'new' | 'reviewed' | 'assigned' | 'archived' | 'urgent';

// Status options for outgoing faxes
export type OutgoingFaxStatus = 'draft' | 'queued' | 'sending' | 'sent' | 'delivered' | 'failed' | 'cancelled';

// Priority levels for fax processing
export type FaxPriority = 'low' | 'normal' | 'high' | 'urgent';

// Patient information for fax linking
export interface LinkedPatient {
  id: string;
  name: string;
  dob: string;
  mrn: string; // Medical Record Number
}

// Location information for clinic locations
export interface ClinicLocation {
  id: string;
  name: string;
  address?: string;
  faxNumber: string;
}

// Sender information
export interface FaxSender {
  name?: string;
  organization?: string;
  faxNumber: string;
  phoneNumber?: string;
}

// Main incoming fax data structure
export interface IncomingFax {
  id: string;
  subject: string; // Main message/purpose
  sender: FaxSender;
  recipientFaxNumber: string; // Clinic's fax number that received this
  location: ClinicLocation; // Location where this fax was received
  pageCount: number;
  receivedAt: Date;
  status: FaxStatus;
  priority: FaxPriority;
  linkedPatient?: LinkedPatient; // Optional - can be assigned later
  attachments?: string[]; // File paths or URLs to fax pages
  notes?: string; // Internal notes added by staff
  reviewedBy?: string; // Staff member who reviewed
  reviewedAt?: Date;
  assignedTo?: string; // Staff member assigned to handle this fax
  assignedAt?: Date;
}

// Action handlers for fax management
export interface FaxActionHandlers {
  onView?: (fax: IncomingFax) => void;
  onAssignToPatient?: (fax: IncomingFax) => void;
  onDownload?: (fax: IncomingFax) => void;
  onAddNotes?: (fax: IncomingFax) => void;
  onMarkReviewed?: (fax: IncomingFax) => void;
  onSetPriority?: (fax: IncomingFax, priority: FaxPriority) => void;
  onAssignToStaff?: (fax: IncomingFax, staffMember: string) => void;
  onArchive?: (fax: IncomingFax) => void;
}

// Props for IncomingFaxes component
export interface IncomingFaxesProps {
  faxes: IncomingFax[];
  isLoading?: boolean;
  actionHandlers?: FaxActionHandlers;
  onFaxUpdate?: (fax: IncomingFax) => void;
  className?: string;
}

// Recipient information for outgoing faxes
export interface FaxRecipient {
  name?: string;
  organization?: string;
  faxNumber: string;
  phoneNumber?: string;
}

// Main outgoing fax data structure
export interface OutgoingFax {
  id: string;
  subject: string; // Main message/purpose
  recipient: FaxRecipient;
  senderFaxNumber: string; // Clinic's fax number sending this
  location: ClinicLocation; // Location where this fax is being sent from
  pageCount: number;
  createdAt: Date;
  sentAt?: Date;
  deliveredAt?: Date;
  status: OutgoingFaxStatus;
  priority: FaxPriority;
  linkedPatient?: LinkedPatient; // Optional - can be linked to patient
  attachments?: string[]; // File paths or URLs to fax pages
  notes?: string; // Internal notes
  createdBy: string; // Staff member who created/sent this fax
  attempts?: number; // Number of send attempts
  errorMessage?: string; // Error details if failed
}

// Action handlers for outgoing fax management
export interface OutgoingFaxActionHandlers {
  onView?: (fax: OutgoingFax) => void;
  onEdit?: (fax: OutgoingFax) => void;
  onResend?: (fax: OutgoingFax) => void;
  onCancel?: (fax: OutgoingFax) => void;
  onDownload?: (fax: OutgoingFax) => void;
  onDelete?: (fax: OutgoingFax) => void;
  onAddNotes?: (fax: OutgoingFax) => void;
  onSetPriority?: (fax: OutgoingFax, priority: FaxPriority) => void;
}

// Props for OutgoingFaxes component
export interface OutgoingFaxesProps {
  faxes: OutgoingFax[];
  isLoading?: boolean;
  actionHandlers?: OutgoingFaxActionHandlers;
  onFaxUpdate?: (fax: OutgoingFax) => void;
  className?: string;
}
