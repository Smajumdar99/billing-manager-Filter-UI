import { FC, useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogTitle, DialogDescription } from '@/components/atoms/Dialog/dialog';
import { Button } from '@/components/atoms/Button/button';
import { Input } from '@/components/atoms/Input/input';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/atoms/Select/select';
import { CreditCardIcon } from '@heroicons/react/24/outline';
import { Textarea } from '@/components/atoms/Textarea';

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

interface AddCreditCardDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (card: Omit<CreditCard, 'id' | 'addedDate' | 'status'>) => void;
  editingCard?: CreditCard | null;
}

export const AddCreditCardDialog: FC<AddCreditCardDialogProps> = ({
  isOpen,
  onClose,
  onSave,
  editingCard = null
}) => {
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
    if (editingCard) {
      setCardType(editingCard.cardType);
      setCardNumber(`****${editingCard.lastFour}`);
      setExpirationMonth(editingCard.expirationMonth.toString().padStart(2, '0'));
      setExpirationYear(editingCard.expirationYear.toString());
      setNameOnCard(editingCard.nameOnCard);
      setBillingZip(editingCard.billingZip);
      setIsDefault(editingCard.isDefault);
      setNotes(editingCard.notes || '');
    } else {
      // Reset form for new card
      setCardType('visa');
      setCardNumber('');
      setExpirationMonth('');
      setExpirationYear('');
      setNameOnCard('');
      setBillingZip('');
      setIsDefault(false);
      setCvv('');
      setNotes('');
    }
  }, [editingCard, isOpen]);

  const handleSubmit = () => {
    // Extract last 4 digits from card number
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

    onSave(cardData);
    onClose();
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

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] p-0 flex flex-col max-h-[90vh] overflow-auto bg-gradient-to-br from-orange-50 to-blue-100">
        <DialogTitle className="sr-only">{editingCard ? 'Edit' : 'Add'} Credit Card</DialogTitle>
        <DialogDescription className="sr-only">
          {editingCard ? 'Edit' : 'Add'} a new credit card to the patient's account.
        </DialogDescription>
        
        {/* Dialog Header */}
        <div className="px-4 py-2 rounded-t-xl">
          <h2 className="text-base font-semibold text-gray-900 flex items-center gap-3">
            <CreditCardIcon className="w-6 h-6 text-blue-600" />
            {editingCard ? 'Edit Credit Card' : 'Add New Credit Card'}
          </h2>
        </div>
        
        {/* Main content */}
        <div className="flex flex-1 min-h-0 overflow-hidden gap-6 p-4">
          <div className="min-w-0 p-6 bg-white rounded-xl border border-gray-200 shadow-sm w-full space-y-4">
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
                onClick={onClose}
              >
                Cancel
              </Button>
              <Button
                onClick={handleSubmit}
                disabled={!cardType || !cardNumber || !expirationMonth || !expirationYear || !nameOnCard || !billingZip || (!editingCard && !cvv)}
              >
                {editingCard ? 'Update Card' : 'Add Card'}
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

