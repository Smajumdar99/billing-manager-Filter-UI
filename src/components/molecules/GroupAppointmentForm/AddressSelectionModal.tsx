"use client"

import React, { useState, useMemo } from 'react';
import { Dialog, DialogContent, DialogFooter, DialogTitle, DialogDescription } from '../../atoms/Dialog/dialog';
import { Button } from '../../atoms/Button';
import { Input } from '../../atoms/Input';
import { Label } from '../../atoms/Label';
import { Card, CardContent } from '../../atoms/Card';
import { Badge } from '../../atoms/Badge';
import { 
  MagnifyingGlassIcon,
  MapPinIcon,
  PlusIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline';

// Address interface for type safety
interface Address {
  id: string;
  name: string;
  street: string;
  city: string;
  state: string;
  zipCode: string;
  type: 'clinic' | 'hospital' | 'home' | 'community' | 'other';
  isActive: boolean;
  lastUsed?: string;
}

interface AddressSelectionModalProps {
  open: boolean;
  onClose: () => void;
  onAddressSelected: (address: Address) => void;
  selectedAddress?: Address | null;
}

// Mock address data - replace with actual data source
const mockAddresses: Address[] = [
  {
    id: '1',
    name: 'Main Behavioral Health Clinic',
    street: '145, 8th Avenue',
    city: 'Portland',
    state: 'FL',
    zipCode: '433323455',
    type: 'clinic',
    isActive: true,
    lastUsed: '2024-01-15'
  },
  {
    id: '2',
    name: 'Downtown Therapy Center',
    street: '892 Oak Street, Suite 200',
    city: 'Portland',
    state: 'FL',
    zipCode: '433324567',
    type: 'clinic',
    isActive: true,
    lastUsed: '2024-01-10'
  },
  {
    id: '3',
    name: 'Community Health Hub',
    street: '456 Maple Drive',
    city: 'Jacksonville',
    state: 'FL',
    zipCode: '432234567',
    type: 'community',
    isActive: true,
    lastUsed: '2024-01-08'
  },
  {
    id: '4',
    name: 'Riverside Medical Center',
    street: '789 River Road',
    city: 'Tampa',
    state: 'FL',
    zipCode: '433445678',
    type: 'hospital',
    isActive: true,
    lastUsed: '2024-01-05'
  },
  {
    id: '5',
    name: 'Westside Counseling Services',
    street: '321 Pine Street',
    city: 'Miami',
    state: 'FL',
    zipCode: '433556789',
    type: 'clinic',
    isActive: true,
    lastUsed: '2023-12-20'
  }
];

const AddressSelectionModal: React.FC<AddressSelectionModalProps> = ({
  open,
  onClose,
  onAddressSelected,
  selectedAddress
}) => {
  // State management
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddNew, setShowAddNew] = useState(false);
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(
    selectedAddress?.id || null
  );

  // New address form state
  const [newAddress, setNewAddress] = useState({
    name: '',
    street: '',
    city: '',
    state: '',
    zipCode: '',
    type: 'clinic' as Address['type']
  });

  // Filter addresses based on search query
  const filteredAddresses = useMemo(() => {
    if (!searchQuery.trim()) return mockAddresses;
    
    const query = searchQuery.toLowerCase();
    return mockAddresses.filter(address =>
      address.name.toLowerCase().includes(query) ||
      address.street.toLowerCase().includes(query) ||
      address.city.toLowerCase().includes(query) ||
      address.state.toLowerCase().includes(query) ||
      address.zipCode.includes(query)
    );
  }, [searchQuery]);

  // Handle address selection
  const handleAddressSelect = (address: Address) => {
    setSelectedAddressId(address.id);
  };

  // Handle confirm selection
  const handleConfirmSelection = () => {
    const address = mockAddresses.find(addr => addr.id === selectedAddressId);
    if (address) {
      onAddressSelected(address);
      onClose();
    }
  };

  // Handle add new address
  const handleAddNewAddress = () => {
    if (newAddress.name && newAddress.street && newAddress.city && newAddress.state && newAddress.zipCode) {
      const address: Address = {
        id: `new-${Date.now()}`,
        ...newAddress,
        isActive: true,
        lastUsed: new Date().toISOString().split('T')[0]
      };
      
      // In real implementation, you would save this to backend
      console.log('Adding new address:', address);
      onAddressSelected(address);
      onClose();
    }
  };

  // Get address type badge color
  const getTypeColor = (type: Address['type']) => {
    switch (type) {
      case 'clinic': return 'bg-blue-100 text-blue-800';
      case 'hospital': return 'bg-red-100 text-red-800';
      case 'community': return 'bg-green-100 text-green-800';
      case 'home': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // Reset form when modal closes
  const handleClose = () => {
    setShowAddNew(false);
    setSearchQuery('');
    setNewAddress({
      name: '',
      street: '',
      city: '',
      state: '',
      zipCode: '',
      type: 'clinic'
    });
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent 
        className="sm:max-w-[900px] lg:max-w-[1000px] p-0 flex flex-col h-[700px] max-h-[90vh] overflow-auto bg-gradient-to-br from-orange-50 to-blue-100"
        aria-describedby="address-selection-dialog-desc"
      >
        {/* Accessible dialog title for screen readers, visually hidden */}
        <DialogTitle className="sr-only">Select Address for Appointment</DialogTitle>
        {/* Accessible dialog description for screen readers, visually hidden */}
        <DialogDescription id="address-selection-dialog-desc" className="sr-only">
          Search and select an existing address or add a new address for the appointment location
        </DialogDescription>
        
        {/* Dialog Header */}
        <div className="px-4 py-3 border-b border-gray-200 bg-white/50 rounded-t-xl">
          <h2 className="text-lg font-semibold text-gray-900">
            {showAddNew ? 'Add New Address' : 'Select Address'}
          </h2>
          <p className="text-sm text-gray-600 mt-1">
            {showAddNew 
              ? 'Enter details for the new appointment location'
              : 'Choose where the provider will see the participant'
            }
          </p>
        </div>
        
        {/* Main Content */}
        <div className="flex flex-1 min-h-0 overflow-hidden p-4">
          <div className="w-full p-6 space-y-6 bg-white rounded-xl border border-gray-200 shadow-sm h-full flex flex-col">
            
            {!showAddNew ? (
              <>
                {/* Search and Add New Button */}
                <div className="flex items-center gap-3">
                  <div className="flex-1 relative">
                    <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Search addresses by name, street, city..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10 h-10"
                    />
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowAddNew(true)}
                    className="flex items-center gap-2 h-10 px-4"
                  >
                    <PlusIcon className="h-4 w-4" />
                    Add New
                  </Button>
                </div>

                {/* Address List */}
                <div className="flex-1 overflow-y-auto space-y-3">
                  {filteredAddresses.length === 0 ? (
                    <div className="text-center py-12">
                      <MapPinIcon className="mx-auto h-12 w-12 text-gray-300" />
                      <h3 className="mt-4 text-sm font-medium text-gray-900">No addresses found</h3>
                      <p className="mt-2 text-sm text-gray-500">
                        {searchQuery ? 'Try a different search term' : 'No addresses available'}
                      </p>
                    </div>
                  ) : (
                    filteredAddresses.map((address) => (
                      <Card
                        key={address.id}
                        className={`cursor-pointer transition-all duration-200 hover:shadow-md ${
                          selectedAddressId === address.id
                            ? 'ring-2 ring-blue-500 bg-blue-50'
                            : 'hover:bg-gray-50'
                        }`}
                        onClick={() => handleAddressSelect(address)}
                      >
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                <h3 className="font-medium text-gray-900">{address.name}</h3>
                                <Badge className={`text-xs ${getTypeColor(address.type)}`}>
                                  {address.type}
                                </Badge>
                                {selectedAddressId === address.id && (
                                  <CheckCircleIcon className="h-5 w-5 text-blue-600" />
                                )}
                              </div>
                              <div className="text-sm text-gray-600 space-y-1">
                                <div className="flex items-center gap-1">
                                  <MapPinIcon className="h-4 w-4 text-gray-400" />
                                  <span>{address.street}</span>
                                </div>
                                <div className="ml-5">
                                  {address.city}, {address.state} {address.zipCode}
                                </div>
                              </div>
                              {address.lastUsed && (
                                <div className="mt-2 text-xs text-gray-500">
                                  Last used: {new Date(address.lastUsed).toLocaleDateString()}
                                </div>
                              )}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))
                  )}
                </div>

                {/* Selected Address Summary */}
                {selectedAddressId && (
                  <div className="border-t pt-4">
                    <div className="text-sm text-gray-600 mb-2">Selected Address:</div>
                    {(() => {
                      const selected = mockAddresses.find(addr => addr.id === selectedAddressId);
                      return selected ? (
                        <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
                          <div className="font-medium text-blue-900">{selected.name}</div>
                          <div className="text-sm text-blue-700">
                            {selected.street}, {selected.city}, {selected.state} {selected.zipCode}
                          </div>
                        </div>
                      ) : null;
                    })()}
                  </div>
                )}
              </>
            ) : (
              /* Add New Address Form */
              <div className="space-y-4">
                <div className="grid grid-cols-1 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="address-name" className="text-sm font-medium text-gray-700">
                      Address Name *
                    </Label>
                    <Input
                      id="address-name"
                      placeholder="e.g., Downtown Therapy Center"
                      value={newAddress.name}
                      onChange={(e) => setNewAddress(prev => ({ ...prev, name: e.target.value }))}
                      className="h-10"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="street" className="text-sm font-medium text-gray-700">
                      Street Address *
                    </Label>
                    <Input
                      id="street"
                      placeholder="e.g., 123 Main Street, Suite 200"
                      value={newAddress.street}
                      onChange={(e) => setNewAddress(prev => ({ ...prev, street: e.target.value }))}
                      className="h-10"
                    />
                  </div>

                  <div className="grid grid-cols-3 gap-3">
                    <div className="space-y-2">
                      <Label htmlFor="city" className="text-sm font-medium text-gray-700">
                        City *
                      </Label>
                      <Input
                        id="city"
                        placeholder="Portland"
                        value={newAddress.city}
                        onChange={(e) => setNewAddress(prev => ({ ...prev, city: e.target.value }))}
                        className="h-10"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="state" className="text-sm font-medium text-gray-700">
                        State *
                      </Label>
                      <Input
                        id="state"
                        placeholder="FL"
                        value={newAddress.state}
                        onChange={(e) => setNewAddress(prev => ({ ...prev, state: e.target.value }))}
                        className="h-10"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="zipCode" className="text-sm font-medium text-gray-700">
                        ZIP Code *
                      </Label>
                      <Input
                        id="zipCode"
                        placeholder="12345"
                        value={newAddress.zipCode}
                        onChange={(e) => setNewAddress(prev => ({ ...prev, zipCode: e.target.value }))}
                        className="h-10"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="type" className="text-sm font-medium text-gray-700">
                      Address Type
                    </Label>
                    <select
                      id="type"
                      value={newAddress.type}
                      onChange={(e) => setNewAddress(prev => ({ ...prev, type: e.target.value as Address['type'] }))}
                      className="w-full h-10 px-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="clinic">Clinic</option>
                      <option value="hospital">Hospital</option>
                      <option value="community">Community Center</option>
                      <option value="home">Home Visit</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                </div>

                {/* Back Button */}
                <div className="pt-4 border-t">
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => setShowAddNew(false)}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    ← Back to Address List
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
        
        {/* Footer */}
        <DialogFooter className="py-2.5 px-4">
          <Button 
            variant="ghost" 
            onClick={handleClose}
            className="px-3 h-9 font-normal border-gray-200 text-sm"
          >
            Cancel
          </Button>
          {!showAddNew ? (
            <Button 
              variant="default" 
              onClick={handleConfirmSelection}
              disabled={!selectedAddressId}
            >
              Select Address
            </Button>
          ) : (
            <Button 
              variant="default" 
              onClick={handleAddNewAddress}
              disabled={!newAddress.name || !newAddress.street || !newAddress.city || !newAddress.state || !newAddress.zipCode}
            >
              Add Address
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddressSelectionModal;
