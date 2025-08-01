import React, { useRef } from 'react';
import { Dialog, DialogContent } from '@/components/atoms/Dialog/dialog';
import { Button } from '@/components/atoms/Button';
import { PrinterIcon, DocumentArrowDownIcon } from '@heroicons/react/24/outline';
import TreatmentPlanPrint from './TreatmentPlanPrint';
import { TreatmentPlanFormData } from '../../../pages/NewTreatmentPlanPage';

/**
 * TreatmentPlanPrintDialog Component
 * 
 * A dialog component that provides print preview and printing functionality
 * for the treatment plan. Includes options to print or download as PDF.
 * 
 * Features:
 * - Print preview with A4 format
 * - Direct printing to printer
 * - Download as PDF option
 * - Responsive design for different screen sizes
 * - Professional healthcare document styling
 */

interface TreatmentPlanPrintDialogProps {
  isOpen: boolean;
  onClose: () => void;
  formData: TreatmentPlanFormData;
  patientInfo?: {
    name: string;
    dob: string;
    mrn: string;
    address?: string;
    phone?: string;
  };
  facilityInfo?: {
    name: string;
    address: string;
    phone: string;
    logo?: string;
  };
}

const TreatmentPlanPrintDialog: React.FC<TreatmentPlanPrintDialogProps> = ({
  isOpen,
  onClose,
  formData,
  patientInfo,
  facilityInfo
}) => {
  const printRef = useRef<HTMLDivElement>(null);

  /**
   * Handle direct printing to printer
   * Opens the browser's print dialog with the treatment plan content
   */
  const handlePrint = () => {
    // Create a new window for printing
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      alert('Please allow popups to enable printing');
      return;
    }

    // Get the print content
    const printContent = printRef.current?.innerHTML || '';
    
    // Create the print document
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Treatment Plan - ${formData.patientName || 'Patient'}</title>
          <meta charset="utf-8">
          <style>
            /* Print-specific styles */
            @page {
              size: A4;
              margin: 0.5in;
            }
            
            body {
              font-family: 'Times New Roman', serif;
              font-size: 12pt;
              line-height: 1.4;
              color: black;
              background: white;
              margin: 0;
              padding: 0;
            }
            
            .print-container {
              font-family: 'Times New Roman', serif;
              font-size: 12pt;
              line-height: 1.4;
              color: black;
              background: white;
              margin: 0;
              padding: 0;
            }
            
            .page {
              width: 100%;
              background: white;
            }
            
            .page-header {
              border-bottom: 2px solid black;
              padding-bottom: 10pt;
              margin-bottom: 20pt;
            }
            
            .section {
              margin-bottom: 20pt;
              page-break-inside: avoid;
            }
            
            .section-title {
              font-size: 14pt;
              font-weight: bold;
              border-bottom: 1px solid black;
              padding-bottom: 5pt;
              margin-bottom: 10pt;
            }
            
            .subsection-title {
              font-size: 12pt;
              font-weight: bold;
              margin-bottom: 8pt;
              margin-top: 15pt;
            }
            
            .field-row {
              display: flex;
              margin-bottom: 8pt;
            }
            
            .field-label {
              font-weight: bold;
              width: 150pt;
              flex-shrink: 0;
            }
            
            .field-value {
              flex: 1;
            }
            
            .checkbox-item {
              margin-bottom: 5pt;
            }
            
            .signature-section {
              border: 1px solid black;
              padding: 15pt;
              margin: 15pt 0;
              page-break-inside: avoid;
            }
            
            .signature-image {
              max-width: 200pt;
              max-height: 60pt;
              border: 1px solid #ccc;
              margin: 5pt 0;
            }
            
            .page-footer {
              position: fixed;
              bottom: 0.5in;
              left: 0.5in;
              right: 0.5in;
              text-align: center;
              font-size: 10pt;
              border-top: 1px solid black;
              padding-top: 5pt;
            }
            
            .no-print {
              display: none !important;
            }
          </style>
        </head>
        <body>
          ${printContent}
        </body>
      </html>
    `);
    
    printWindow.document.close();
    
    // Wait for content to load, then print
    printWindow.onload = () => {
      printWindow.focus();
      printWindow.print();
      printWindow.close();
    };
  };

  /**
   * Handle download as PDF
   * Uses the browser's print dialog with "Save as PDF" option
   */
  const handleDownloadPDF = () => {
    // For now, we'll use the same print functionality
    // In a production environment, you might want to use a library like jsPDF or Puppeteer
    handlePrint();
    
    // Show instructions to user
    setTimeout(() => {
      alert('In the print dialog, select "Save as PDF" as your destination to download the treatment plan as a PDF file.');
    }, 500);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-auto bg-gradient-to-br from-orange-50 to-blue-100 p-0">
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 pr-12 bg-white/80 backdrop-blur-sm border-b border-gray-200">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Print Treatment Plan</h2>
              <p className="text-sm text-gray-600">
                Preview and print the complete treatment plan for {formData.patientName || 'patient'}
              </p>
            </div>
            
            {/* Action Buttons */}
            <div className="flex items-center gap-3">
              <div className="text-xs text-gray-500 mr-2">
                <span className="font-medium">Format:</span> A4 Letter
              </div>
              <Button
                onClick={handlePrint}
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white h-9"
              >
                <PrinterIcon className="w-4 h-4" />
                Print
              </Button>
              
              <Button
                onClick={handleDownloadPDF}
                variant="outline"
                className="flex items-center gap-2 h-9"
              >
                <DocumentArrowDownIcon className="w-4 h-4" />
                PDF
              </Button>
            </div>
          </div>

          {/* Print Preview */}
          <div className="flex-1 overflow-auto p-6">
            <div className="bg-white shadow-lg rounded-lg overflow-hidden border border-gray-200">
              <div ref={printRef}>
                <TreatmentPlanPrint
                  formData={formData}
                  patientInfo={patientInfo}
                  facilityInfo={facilityInfo}
                />
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="p-4 border-t border-gray-200 bg-white/80 backdrop-blur-sm">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-600">
                <span className="font-medium">Document Status:</span> Ready for printing
              </div>
              <div className="flex items-center gap-3">
                <Button
                  variant="ghost"
                  onClick={onClose}
                  className="text-gray-600"
                >
                  Close
                </Button>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default TreatmentPlanPrintDialog;
