import { FC, useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogTitle, DialogDescription, DialogBody } from '@/components/atoms/Dialog/dialog';
import { Button } from '@/components/atoms/Button/button';
import { Badge } from '@/components/atoms/Badge/badge';
import { Input } from '@/components/atoms/Input/input';
import { Textarea } from '@/components/atoms/Textarea';
import { DataTable } from '@/components/organisms/DataTable';
import { ColDef } from 'ag-grid-community';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/atoms/Select/select';
import { 
  CreditCardIcon,
  PlusIcon,
  TrashIcon,
  PencilIcon,
  ArrowLeftIcon
} from '@heroicons/react/24/outline';

interface CreditCard {
  id: string;
  cardType: 'visa' | 'mastercard' | 'amex' | 'discover';
  lastFour: string;
  expirationMonth: number;
  expirationYear: number;
  nameOnCard: string;
  billingZip: string;
  isDefault: boolean;
  addedDate: string;
  lastUsed?: string;
  status: 'active' | 'expired' | 'declined';
  notes?: string;
}

interface CreditCardsDialogProps {
  isOpen: boolean;
  onClose: () => void;
  patientId?: string;
}

const mockCreditCards: CreditCard[] = [
  {
    id: 'CC-001',
    cardType: 'visa',
    lastFour: '4242',
    expirationMonth: 12,
    expirationYear: 2025,
    nameOnCard: 'John Doe',
    billingZip: '12345',
    isDefault: true,
    addedDate: '2024-01-15',
    lastUsed: '2024-03-14',
    status: 'active',
    notes: 'Primary payment method'
  },
  {
    id: 'CC-002',
    cardType: 'mastercard',
    lastFour: '8888',
    expirationMonth: 8,
    expirationYear: 2026,
    nameOnCard: 'John Doe',
    billingZip: '12345',
    isDefault: false,
    addedDate: '2023-11-20',
    lastUsed: '2024-02-28',
    status: 'active',
    notes: 'Backup card'
  },
  {
    id: 'CC-003',
    cardType: 'amex',
    lastFour: '1234',
    expirationMonth: 6,
    expirationYear: 2024,
    nameOnCard: 'John Doe',
    billingZip: '12345',
    isDefault: false,
    addedDate: '2023-08-10',
    status: 'expired',
    notes: 'Card expired, needs renewal'
  }
];

export const CreditCardsDialog: FC<CreditCardsDialogProps> = ({
  isOpen,
  onClose,
  patientId = '1003619'
}) => {
  const [creditCards, setCreditCards] = useState<CreditCard[]>(mockCreditCards);
  const [view, setView] = useState<'list' | 'form'>('list');
  const [editingCard, setEditingCard] = useState<CreditCard | null>(null);
  
  // Form state
  const [cardType, setCardType] = useState<'visa' | 'mastercard' | 'amex' | 'discover'>('visa');
  const [cardNumber, setCardNumber] = useState('');
  const [expirationMonth, setExpirationMonth] = useState('');
  const [expirationYear, setExpirationYear] = useState('');
  const [nameOnCard, setNameOnCard] = useState('');
  const [billingZip, setBillingZip] = useState('');
  const [isDefault, setIsDefault] = useState(false);
  const [cvv, setCvv] = useState('');
  const [notes, setNotes] = useState('');

  useEffect(() => {
    if (!isOpen) {
      setView('list');
      setEditingCard(null);
      resetForm();
    }
  }, [isOpen]);

  useEffect(() => {
    if (editingCard && view === 'form') {
      setCardType(editingCard.cardType);
      setCardNumber(`****${editingCard.lastFour}`);
      setExpirationMonth(editingCard.expirationMonth.toString().padStart(2, '0'));
      setExpirationYear(editingCard.expirationYear.toString());
      setNameOnCard(editingCard.nameOnCard);
      setBillingZip(editingCard.billingZip);
      setIsDefault(editingCard.isDefault);
      setNotes(editingCard.notes || '');
    } else if (view === 'form' && !editingCard) {
      resetForm();
    }
  }, [editingCard, view]);

  const resetForm = () => {
    setCardType('visa');
    setCardNumber('');
    setExpirationMonth('');
    setExpirationYear('');
    setNameOnCard('');
    setBillingZip('');
    setIsDefault(false);
    setCvv('');
    setNotes('');
  };

  const handleBackToList = () => {
    setView('list');
    setEditingCard(null);
    resetForm();
  };

  const handleAddCard = () => {
    setEditingCard(null);
    resetForm();
    setView('form');
  };

  const handleEditCard = (card: CreditCard) => {
    setEditingCard(card);
    setView('form');
  };

  const handleSaveCard = () => {
    const lastFour = cardNumber.replace(/\s/g, '').slice(-4);
    
    const cardData: Omit<CreditCard, 'id' | 'addedDate' | 'status'> = {
      cardType,
      lastFour: lastFour || '0000',
      expirationMonth: parseInt(expirationMonth) || 1,
      expirationYear: parseInt(expirationYear) || new Date().getFullYear(),
      nameOnCard,
      billingZip,
      isDefault,
      lastUsed: editingCard?.lastUsed,
      notes: notes.trim() || undefined
    };

    if (editingCard) {
      // Update existing card
      setCreditCards(creditCards.map(card => 
        card.id === editingCard.id 
          ? { ...cardData, id: editingCard.id, addedDate: editingCard.addedDate, status: editingCard.status }
          : card
      ));
    } else {
      // Add new card
      const newCard: CreditCard = {
        ...cardData,
        id: `CC-${Date.now()}`,
        addedDate: new Date().toISOString().split('T')[0],
        status: 'active'
      };
      setCreditCards([...creditCards, newCard]);
    }
    
    handleBackToList();
  };

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = matches && matches[0] || '';
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    if (parts.length) {
      return parts.join(' ');
    } else {
      return v;
    }
  };

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCardNumber(e.target.value);
    setCardNumber(formatted);
  };

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 20 }, (_, i) => currentYear + i);

  const handleDeleteCard = (cardId: string) => {
    setCreditCards(creditCards.filter(card => card.id !== cardId));
  };

  const handleSetDefault = (cardId: string) => {
    setCreditCards(creditCards.map(card => ({
      ...card,
      isDefault: card.id === cardId
    })));
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const tableColumns: ColDef[] = [
    {
      headerName: 'Card Type',
      field: 'cardType',
      width: 120,
      cellRenderer: (params: any) => {
        const cardType = params.data.cardType;
        return (
          <div className="flex items-center gap-2">
            <CreditCardIcon className="w-4 h-4 text-gray-500" />
            <span className="capitalize">{cardType}</span>
          </div>
        );
      },
    },
    {
      headerName: 'Card Number',
      field: 'lastFour',
      width: 140,
      cellRenderer: (params: any) => {
        return `****${params.data.lastFour}`;
      },
    },
    {
      headerName: 'Expires',
      field: 'expirationMonth',
      width: 100,
      cellRenderer: (params: any) => {
        const month = params.data.expirationMonth.toString().padStart(2, '0');
        const year = params.data.expirationYear;
        return `${month}/${year}`;
      },
    },
    {
      headerName: 'Name on Card',
      field: 'nameOnCard',
      width: 150,
    },
    {
      headerName: 'Billing ZIP',
      field: 'billingZip',
      width: 110,
    },
    {
      headerName: 'Status',
      field: 'status',
      width: 100,
      cellRenderer: (params: any) => {
        const status = params.data.status;
        const isDefault = params.data.isDefault;
        return (
          <div className="flex items-center gap-2">
            {isDefault && (
              <Badge className="bg-green-100 text-green-800 text-xs">Default</Badge>
            )}
            <Badge className={
              status === 'active' ? 'bg-green-100 text-green-800' :
              status === 'expired' ? 'bg-red-100 text-red-800' :
              'bg-gray-100 text-gray-800'
            }>
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </Badge>
          </div>
        );
      },
    },
    {
      headerName: 'Added Date',
      field: 'addedDate',
      width: 120,
      cellRenderer: (params: any) => {
        return formatDate(params.data.addedDate);
      },
    },
    {
      headerName: 'Last Used',
      field: 'lastUsed',
      width: 120,
      cellRenderer: (params: any) => {
        return params.data.lastUsed ? formatDate(params.data.lastUsed) : 'Never';
      },
    },
    {
      headerName: 'Notes',
      field: 'notes',
      flex: 1,
      cellRenderer: (params: any) => {
        return (
          <div className="text-sm text-gray-700">
            {params.data.notes || '-'}
          </div>
        );
      },
    },
    {
      headerName: 'Actions',
      field: 'actions',
      width: 120,
      pinned: 'right',
      cellRenderer: (params: any) => {
        const card = params.data;
        return (
          <div className="flex items-center gap-2 h-full">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleEditCard(card)}
              className="h-7 px-2"
            >
              <PencilIcon className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleDeleteCard(card.id)}
              className="h-7 px-2 text-red-600 hover:text-red-700 hover:bg-red-50"
            >
              <TrashIcon className="w-4 h-4" />
            </Button>
          </div>
        );
      },
      lockPosition: true,
    },
  ];

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-[800px] lg:max-w-[900px] p-0 flex flex-col h-[700px] max-h-[90vh] overflow-auto bg-gradient-to-br from-orange-50 to-blue-100">
          <DialogTitle className="sr-only">Credit Cards on File</DialogTitle>
          <DialogDescription className="sr-only">
            View and manage credit cards on file for patient.
          </DialogDescription>
          
          {/* Dialog Header */}
          <div className="px-4 py-2 rounded-t-xl pr-12">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {view === 'form' && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleBackToList}
                    className="gap-2 -ml-2"
                  >
                    <ArrowLeftIcon className="w-4 h-4" />
                  </Button>
                )}
                <h2 className="text-base font-semibold text-gray-900 flex items-center gap-3">
                  <CreditCardIcon className="w-6 h-6 text-blue-600" />
                  {view === 'form' 
                    ? (editingCard ? 'Edit Credit Card' : 'Add New Credit Card')
                    : 'Credit Cards on File'}
                </h2>
              </div>
              {view === 'list' && (
                <Button
                  onClick={handleAddCard}
                  className="gap-2 shrink-0"
                  size="sm"
                >
                  <PlusIcon className="w-4 h-4" />
                  Add New Card
                </Button>
              )}
            </div>
          </div>
          
          {/* Main content */}
          <DialogBody>
            <div className="min-w-0 p-6 bg-white rounded-xl border border-gray-200 shadow-sm h-full flex flex-col w-full overflow-auto">
              {view === 'list' ? (
                <>
                  {creditCards.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-center">
                      <CreditCardIcon className="w-16 h-16 text-gray-300 mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">No credit cards on file</h3>
                      <p className="text-sm text-gray-600 mb-4">Add a credit card to get started.</p>
                      <Button
                        onClick={handleAddCard}
                        className="gap-2"
                      >
                        <PlusIcon className="w-4 h-4" />
                        Add Credit Card
                      </Button>
                    </div>
                  ) : (
                    <div className="flex-1 min-h-0 flex flex-col">
                      <div className="flex-1 min-h-0 border border-gray-200 rounded-md overflow-hidden">
                        <DataTable
                          rowData={creditCards}
                          columnDefs={tableColumns}
                          gridOptions={{
                            defaultColDef: {
                              resizable: true,
                              sortable: true,
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
                  )}
                </>
              ) : (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">
                      Card Type <span className="text-red-500">*</span>
                    </label>
                    <Select value={cardType} onValueChange={(value: any) => setCardType(value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select card type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="visa">Visa</SelectItem>
                        <SelectItem value="mastercard">Mastercard</SelectItem>
                        <SelectItem value="amex">American Express</SelectItem>
                        <SelectItem value="discover">Discover</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">
                      Card Number <span className="text-red-500">*</span>
                    </label>
                    <Input
                      value={cardNumber}
                      onChange={handleCardNumberChange}
                      placeholder="1234 5678 9012 3456"
                      maxLength={19}
                      disabled={!!editingCard}
                    />
                    {editingCard && (
                      <p className="text-xs text-gray-500">Card number cannot be changed for security reasons.</p>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">
                        Expiration Month <span className="text-red-500">*</span>
                      </label>
                      <Select value={expirationMonth} onValueChange={setExpirationMonth}>
                        <SelectTrigger>
                          <SelectValue placeholder="MM" />
                        </SelectTrigger>
                        <SelectContent>
                          {Array.from({ length: 12 }, (_, i) => {
                            const month = (i + 1).toString().padStart(2, '0');
                            return (
                              <SelectItem key={month} value={month}>
                                {month}
                              </SelectItem>
                            );
                          })}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">
                        Expiration Year <span className="text-red-500">*</span>
                      </label>
                      <Select value={expirationYear} onValueChange={setExpirationYear}>
                        <SelectTrigger>
                          <SelectValue placeholder="YYYY" />
                        </SelectTrigger>
                        <SelectContent>
                          {years.map(year => (
                            <SelectItem key={year} value={year.toString()}>
                              {year}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {!editingCard && (
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">
                        CVV <span className="text-red-500">*</span>
                      </label>
                      <Input
                        type="password"
                        value={cvv}
                        onChange={(e) => setCvv(e.target.value.replace(/\D/g, '').slice(0, 4))}
                        placeholder="123"
                        maxLength={4}
                      />
                    </div>
                  )}

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">
                      Name on Card <span className="text-red-500">*</span>
                    </label>
                    <Input
                      value={nameOnCard}
                      onChange={(e) => setNameOnCard(e.target.value)}
                      placeholder="John Doe"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">
                      Billing ZIP Code <span className="text-red-500">*</span>
                    </label>
                    <Input
                      value={billingZip}
                      onChange={(e) => setBillingZip(e.target.value.replace(/\D/g, '').slice(0, 10))}
                      placeholder="12345"
                      maxLength={10}
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Notes</label>
                    <Textarea
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="Add any notes about this card (optional)"
                      rows={3}
                    />
                  </div>

                  <div className="flex items-center space-x-2 pt-2">
                    <input
                      type="checkbox"
                      id="isDefault"
                      checked={isDefault}
                      onChange={(e) => setIsDefault(e.target.checked)}
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <label htmlFor="isDefault" className="text-sm font-medium text-gray-700">
                      Set as default payment method
                    </label>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200">
                    <Button
                      variant="outline"
                      onClick={handleBackToList}
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={handleSaveCard}
                      disabled={!cardType || !cardNumber || !expirationMonth || !expirationYear || !nameOnCard || !billingZip || (!editingCard && !cvv)}
                    >
                      {editingCard ? 'Update Card' : 'Add Card'}
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </DialogBody>
        </DialogContent>
      </Dialog>
    </>
  );
};

