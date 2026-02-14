import { FC, useState } from 'react';
import { Dialog, DialogContent, DialogTitle, DialogDescription } from '@/components/atoms/Dialog/dialog';
import { Button } from '@/components/atoms/Button/button';
import { Input } from '@/components/atoms/Input/input';
import { Textarea } from '@/components/atoms/Textarea';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/atoms/Select/select';
import { 
  BanknotesIcon,
  CreditCardIcon,
  DocumentTextIcon
} from '@heroicons/react/24/outline';
import { DataTable } from '@/components/organisms/DataTable';
import { ColDef } from 'ag-grid-community';

interface PaymentRow {
  dos: string;
  encounter: string;
  totalCharge: number;
  clientPayment: number;
  personBalance: number;
  paying: number;
}

interface NewPaymentDialogProps {
  isOpen: boolean;
  onClose: () => void;
  patientId?: string;
}

export const NewPaymentDialog: FC<NewPaymentDialogProps> = ({
  isOpen,
  onClose,
  patientId = '1003619'
}) => {
  const [paymentMethod, setPaymentMethod] = useState('check');
  const [location, setLocation] = useState('');
  const [checkRefNumber, setCheckRefNumber] = useState('');
  const [description, setDescription] = useState('');
  
  const [paymentRows, setPaymentRows] = useState<PaymentRow[]>([
    { dos: '11/21/2025', encounter: '', totalCharge: 0, clientPayment: 0, personBalance: 0, paying: 0 },
    { dos: '12/11/2024', encounter: '100202510', totalCharge: 0, clientPayment: 0, personBalance: 0, paying: 0 },
    { dos: '03/01/2024', encounter: '100186356', totalCharge: 0, clientPayment: 0, personBalance: 0, paying: 0 },
    { dos: '01/30/2024', encounter: '100182012', totalCharge: 12000.00, clientPayment: 0, personBalance: 12000.00, paying: 0 },
    { dos: '01/30/2024', encounter: '100182011', totalCharge: 100.00, clientPayment: 0, personBalance: 100.00, paying: 0 },
    { dos: '01/30/2024', encounter: '100182010', totalCharge: 12000.00, clientPayment: 0, personBalance: 12000.00, paying: 0 },
    { dos: '01/30/2024', encounter: '100182009', totalCharge: 0, clientPayment: 0, personBalance: 0, paying: 0 },
    { dos: '01/30/2024', encounter: '100182008', totalCharge: 0, clientPayment: 0, personBalance: 0, paying: 0 },
  ]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(amount);
  };

  const handlePayingChange = (rowIndex: number, value: string) => {
    const numValue = parseFloat(value) || 0;
    const newRows = [...paymentRows];
    if (newRows[rowIndex]) {
      newRows[rowIndex].paying = numValue;
      setPaymentRows(newRows);
    }
  };

  const totalPaying = paymentRows.reduce((sum, row) => sum + row.paying, 0);

  const handleGenerateInvoice = () => {
    console.log('Generate Invoice', {
      paymentMethod,
      location,
      checkRefNumber,
      description,
      payments: paymentRows.filter(r => r.paying > 0)
    });
    // TODO: Implement invoice generation
    onClose();
  };

  const tableColumns: ColDef[] = [
    {
      headerName: 'DOS',
      field: 'dos',
      width: 120,
    },
    {
      headerName: 'Encounter',
      field: 'encounter',
      width: 120,
    },
    {
      headerName: 'Total Charge',
      field: 'totalCharge',
      width: 130,
      valueFormatter: (params: any) => params.value ? formatCurrency(params.value) : '',
    },
    {
      headerName: 'Client Payment',
      field: 'clientPayment',
      width: 130,
      valueFormatter: (params: any) => params.value ? formatCurrency(params.value) : '',
    },
    {
      headerName: 'Person Balance',
      field: 'personBalance',
      width: 130,
      valueFormatter: (params: any) => params.value ? formatCurrency(params.value) : '',
    },
    {
      headerName: 'Paying',
      field: 'paying',
      width: 120,
      pinned: 'right',
      cellRenderer: (params: any) => {
        const rowIndex = params.node.rowIndex;
        return (
          <input
            type="number"
            step="0.01"
            min="0"
            value={params.data?.paying || ''}
            onChange={(e) => handlePayingChange(rowIndex, e.target.value)}
            className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="0.00"
          />
        );
      },
      editable: false,
      lockPosition: true,
    },
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[1000px] lg:max-w-[1200px] p-0 flex flex-col h-[800px] max-h-[90vh] overflow-auto bg-gradient-to-br from-orange-50 to-blue-100">
        <DialogTitle className="sr-only">Accept Payment</DialogTitle>
        <DialogDescription className="sr-only">
          Accept payment for patient encounters and generate invoice.
        </DialogDescription>
        
        {/* Dialog Header */}
        <div className="px-4 py-2 rounded-t-xl">
          <h2 className="text-base font-semibold text-gray-900 flex items-center gap-3">
            <BanknotesIcon className="w-6 h-6 text-blue-600" />
            Accept Payment for: ({patientId})
          </h2>
        </div>
        
        {/* Main content */}
        <div className="flex flex-1 min-h-0 overflow-hidden gap-6 p-4">
          <div className="min-w-0 p-6 bg-white rounded-xl border border-gray-200 shadow-sm h-full flex flex-col w-full overflow-hidden">
            <div className="flex flex-col h-full overflow-hidden">
              {/* Two Column Layout: Form on Left, Table on Right */}
              <div className="flex-1 min-h-0 flex gap-6 mb-4">
                {/* Left Column - Form Fields */}
                <div className="w-[30%] flex-shrink-0 space-y-4 overflow-y-auto pr-2">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Payment Method</label>
                    <Select value={paymentMethod} onValueChange={setPaymentMethod}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select payment method" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="check">Check Payment</SelectItem>
                        <SelectItem value="cash">Cash</SelectItem>
                        <SelectItem value="credit">Credit Card</SelectItem>
                        <SelectItem value="debit">Debit Card</SelectItem>
                        <SelectItem value="ach">ACH Transfer</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">
                      Location <span className="text-red-500">*</span>
                    </label>
                    <Select value={location} onValueChange={setLocation}>
                      <SelectTrigger>
                        <SelectValue placeholder="-- Select Location --" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="location1">Main Office</SelectItem>
                        <SelectItem value="location2">Branch Office</SelectItem>
                        <SelectItem value="location3">Remote Location</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Check/Ref Number</label>
                    <Input
                      value={checkRefNumber}
                      onChange={(e) => setCheckRefNumber(e.target.value)}
                      placeholder="Enter check or reference number"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Description</label>
                    <Textarea
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Enter payment description"
                      rows={4}
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Person Coverage</label>
                    <div className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-md text-sm text-gray-700">
                      Self
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Payment against</label>
                    <div className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-md text-sm text-gray-700">
                      Encounter Payment
                    </div>
                  </div>
                </div>

                {/* Right Column - Payment Details Table */}
                <div className="flex-1 flex flex-col min-h-0">
                  <h3 className="text-sm font-semibold text-gray-700 mb-3 flex-shrink-0">Payment Details</h3>
                  <div className="flex-1 min-h-0 border border-gray-200 rounded-md overflow-hidden">
                    <DataTable
                      rowData={paymentRows}
                      columnDefs={tableColumns}
                      gridOptions={{
                        defaultColDef: {
                          resizable: true,
                          sortable: false,
                          filter: false,
                        },
                        suppressRowClickSelection: true,
                        rowSelection: 'multiple',
                        domLayout: 'normal',
                      }}
                      className="h-full"
                    />
                  </div>
                </div>
              </div>

              {/* Total and Generate Invoice Button - Fixed at bottom */}
              <div className="flex items-center justify-between pt-4 border-t border-gray-200 flex-shrink-0">
                <div className="flex items-center gap-4">
                  <span className="text-sm font-semibold text-gray-700">Total:</span>
                  <div className="px-4 py-2 bg-gray-50 border border-gray-300 rounded-md text-sm font-medium text-gray-900 min-w-[120px]">
                    {formatCurrency(totalPaying)}
                  </div>
                </div>
                <Button
                  onClick={handleGenerateInvoice}
                  className="gap-2"
                  disabled={totalPaying === 0 || !location}
                >
                  <DocumentTextIcon className="w-4 h-4" />
                  Generate Invoice
                </Button>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

