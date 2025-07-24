import React, { useState } from 'react';
import { UserGroupIcon, PencilSquareIcon, CheckCircleIcon } from '@heroicons/react/24/outline';
import { PlusIcon, XMarkIcon } from '@heroicons/react/24/solid';
import { Input } from '@/components/atoms/Input';
import { Button } from '@/components/atoms/Button';
import { Badge } from '@/components/atoms/Badge';
import { Select } from '@/components/atoms/Select/select';
import { TreatmentPlanFormData } from '../../../pages/NewTreatmentPlanPage';

/**
 * ProvidersSignaturesStep Component
 * 
 * Step 4 of the New Treatment Plan wizard.
 * Handles provider assignments and required signatures.
 * 
 * Features:
 * - Provider selection and role assignment
 * - Required signatures tracking
 * - Digital signature simulation
 * - Provider contact information
 * - Apple-style clean design
 */

interface ProvidersSignaturesStepProps {
  formData: TreatmentPlanFormData;
  updateFormData: (data: Partial<TreatmentPlanFormData>) => void;
}

// Mock providers data
const mockProviders = [
  {
    id: 'P001',
    name: 'Dr. Sarah Johnson',
    title: 'Clinical Psychologist',
    specialties: ['Behavioral Therapy', 'Autism Spectrum Disorders'],
    email: 'sarah.johnson@clinic.com',
    phone: '(555) 123-4567'
  },
  {
    id: 'P002',
    name: 'Michael Chen, LCSW',
    title: 'Licensed Clinical Social Worker',
    specialties: ['Family Therapy', 'Group Therapy'],
    email: 'michael.chen@clinic.com',
    phone: '(555) 234-5678'
  },
  {
    id: 'P003',
    name: 'Dr. Emily Rodriguez',
    title: 'Speech-Language Pathologist',
    specialties: ['Communication Disorders', 'Language Development'],
    email: 'emily.rodriguez@clinic.com',
    phone: '(555) 345-6789'
  },
  {
    id: 'P004',
    name: 'James Wilson, OTR/L',
    title: 'Occupational Therapist',
    specialties: ['Sensory Integration', 'Daily Living Skills'],
    email: 'james.wilson@clinic.com',
    phone: '(555) 456-7890'
  },
  {
    id: 'P005',
    name: 'Dr. Lisa Thompson',
    title: 'Psychiatrist',
    specialties: ['Medication Management', 'Mental Health'],
    email: 'lisa.thompson@clinic.com',
    phone: '(555) 567-8901'
  }
];

// Provider roles
const providerRoles = [
  'Primary Therapist',
  'Secondary Therapist',
  'Supervisor',
  'Consultant',
  'Case Manager',
  'Medical Provider'
];

// Required signature types
const signatureTypes = [
  { id: 'patient', label: 'Patient/Guardian Signature', required: true },
  { id: 'primary_therapist', label: 'Primary Therapist Signature', required: true },
  { id: 'supervisor', label: 'Clinical Supervisor Signature', required: true },
  { id: 'medical_director', label: 'Medical Director Signature', required: false },
  { id: 'case_manager', label: 'Case Manager Signature', required: false }
];

const ProvidersSignaturesStep: React.FC<ProvidersSignaturesStepProps> = ({
  formData,
  updateFormData
}) => {
  const [selectedProviderId, setSelectedProviderId] = useState('');
  const [selectedRole, setSelectedRole] = useState('');
  const [signatureNote, setSignatureNote] = useState('');

  // Add provider to treatment plan
  const addProvider = () => {
    if (selectedProviderId && selectedRole) {
      const provider = mockProviders.find(p => p.id === selectedProviderId);
      if (provider) {
        const newAssignment = {
          id: Date.now().toString(),
          providerId: provider.id,
          providerName: provider.name,
          providerTitle: provider.title,
          role: selectedRole,
          assignedDate: new Date().toISOString().split('T')[0]
        };

        updateFormData({
          assignedProviders: [...formData.assignedProviders, newAssignment]
        });

        setSelectedProviderId('');
        setSelectedRole('');
      }
    }
  };

  // Remove provider from treatment plan
  const removeProvider = (assignmentId: string) => {
    const updatedProviders = formData.assignedProviders.filter(
      assignment => assignment.id !== assignmentId
    );
    updateFormData({ assignedProviders: updatedProviders });
  };

  // Handle signature
  const handleSignature = (signatureId: string, signed: boolean, signerName?: string) => {
    const updatedSignatures = { ...formData.signatures };
    
    if (signed && signerName) {
      updatedSignatures[signatureId] = {
        signed: true,
        signerName,
        signedDate: new Date().toISOString(),
        notes: signatureNote
      };
    } else {
      delete updatedSignatures[signatureId];
    }

    updateFormData({ signatures: updatedSignatures });
    setSignatureNote('');
  };

  // Get available providers (not already assigned)
  const availableProviders = mockProviders.filter(
    provider => !formData.assignedProviders.some(
      assignment => assignment.providerId === provider.id
    )
  );

  return (
    <div className="space-y-6">
      {/* Form Content */}
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Assigned Providers Section */}
        <div className="bg-gray-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <UserGroupIcon className="w-5 h-5 text-gray-600 mr-2" />
            Assigned Providers
          </h3>
          
          {/* Add Provider */}
          <div className="bg-white rounded-lg border border-gray-200 p-4 mb-4">
            <h4 className="text-sm font-medium text-gray-700 mb-3">Add Provider</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
              <div>
                <Select
                  value={selectedProviderId}
                  onValueChange={setSelectedProviderId}
                >
                  <option value="">Select a provider...</option>
                  {availableProviders.map((provider) => (
                    <option key={provider.id} value={provider.id}>
                      {provider.name} - {provider.title}
                    </option>
                  ))}
                </Select>
              </div>
              <div>
                <Select
                  value={selectedRole}
                  onValueChange={setSelectedRole}
                >
                  <option value="">Select role...</option>
                  {providerRoles.map((role) => (
                    <option key={role} value={role}>
                      {role}
                    </option>
                  ))}
                </Select>
              </div>
            </div>
            <Button
              onClick={addProvider}
              disabled={!selectedProviderId || !selectedRole}
              size="sm"
            >
              <PlusIcon className="w-4 h-4 mr-1" />
              Add Provider
            </Button>
          </div>

          {/* Current Assignments */}
          <div className="space-y-3">
            {formData.assignedProviders.map((assignment) => {
              const provider = mockProviders.find(p => p.id === assignment.providerId);
              return (
                <div key={assignment.id} className="bg-white rounded-lg border border-gray-200 p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h4 className="font-medium text-gray-900">{assignment.providerName}</h4>
                        <Badge variant="secondary" className="bg-indigo-100 text-indigo-800">
                          {assignment.role}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600 mb-1">{assignment.providerTitle}</p>
                      {provider && (
                        <div className="text-xs text-gray-500 space-y-1">
                          <div>Email: {provider.email}</div>
                          <div>Phone: {provider.phone}</div>
                          <div>Specialties: {provider.specialties.join(', ')}</div>
                          <div>Assigned: {assignment.assignedDate}</div>
                        </div>
                      )}
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => removeProvider(assignment.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <XMarkIcon className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>

          {formData.assignedProviders.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <UserGroupIcon className="w-12 h-12 mx-auto mb-2 text-gray-300" />
              <p>No providers assigned yet</p>
            </div>
          )}
        </div>

        {/* Required Signatures Section */}
        <div className="bg-gray-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <PencilSquareIcon className="w-5 h-5 text-gray-600 mr-2" />
            Required Signatures
          </h3>
          
          {/* Signature Note Input */}
          <div className="mb-4">
            <label htmlFor="signatureNote" className="block text-sm font-medium text-gray-700 mb-2">
              Signature Notes (Optional)
            </label>
            <Input
              id="signatureNote"
              type="text"
              value={signatureNote}
              onChange={(e) => setSignatureNote(e.target.value)}
              placeholder="Add any notes for the signature..."
            />
          </div>

          {/* Signatures List */}
          <div className="space-y-3">
            {signatureTypes.map((signatureType) => {
              const signature = formData.signatures[signatureType.id];
              const isSigned = signature?.signed || false;

              return (
                <div key={signatureType.id} className="bg-white rounded-lg border border-gray-200 p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-medium text-gray-900">{signatureType.label}</h4>
                        {signatureType.required && (
                          <Badge variant="secondary" className="bg-red-100 text-red-800 text-xs">
                            Required
                          </Badge>
                        )}
                        {isSigned && (
                          <Badge variant="secondary" className="bg-green-100 text-green-800 text-xs">
                            <CheckCircleIcon className="w-3 h-3 mr-1" />
                            Signed
                          </Badge>
                        )}
                      </div>
                      
                      {isSigned && signature && (
                        <div className="text-xs text-gray-500 space-y-1">
                          <div>Signed by: {signature.signerName}</div>
                          <div>Date: {new Date(signature.signedDate).toLocaleDateString()}</div>
                          {signature.notes && <div>Notes: {signature.notes}</div>}
                        </div>
                      )}
                    </div>
                    
                    <div className="flex gap-2">
                      {!isSigned ? (
                        <div className="flex gap-2">
                          <Input
                            type="text"
                            placeholder="Signer name"
                            className="w-32"
                            onKeyPress={(e) => {
                              if (e.key === 'Enter') {
                                const signerName = (e.target as HTMLInputElement).value;
                                if (signerName.trim()) {
                                  handleSignature(signatureType.id, true, signerName.trim());
                                  (e.target as HTMLInputElement).value = '';
                                }
                              }
                            }}
                          />
                          <Button
                            size="sm"
                            onClick={() => {
                              const input = document.querySelector(`input[placeholder="Signer name"]`) as HTMLInputElement;
                              const signerName = input?.value.trim();
                              if (signerName) {
                                handleSignature(signatureType.id, true, signerName);
                                input.value = '';
                              }
                            }}
                          >
                            Sign
                          </Button>
                        </div>
                      ) : (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleSignature(signatureType.id, false)}
                          className="text-red-600 hover:text-red-700"
                        >
                          Remove
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Summary */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h4 className="text-sm font-medium text-blue-900 mb-2">Section Summary</h4>
          <div className="text-sm text-blue-800 space-y-1">
            <div>
              <strong>Assigned Providers:</strong> {formData.assignedProviders.length}
            </div>
            <div>
              <strong>Signatures Collected:</strong> {Object.keys(formData.signatures).length} of {signatureTypes.length}
            </div>
            <div>
              <strong>Required Signatures:</strong> {
                signatureTypes.filter(s => s.required).every(s => formData.signatures[s.id]?.signed)
                  ? 'All collected ✓'
                  : 'Incomplete'
              }
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProvidersSignaturesStep;
