import React, { useState } from 'react';
import { DocumentCheckIcon, UserIcon, UserGroupIcon } from '@heroicons/react/24/outline';
import { CheckIcon } from '@heroicons/react/24/solid';
import { Button } from '@/components/atoms/Button';
import { TreatmentPlanFormData } from '../../../pages/NewTreatmentPlanPage';
import SignatureDrawing from '../../molecules/SignatureDrawing/SignatureDrawing';

/**
 * SignaturesStep Component
 * 
 * Step 6 of the New Treatment Plan wizard.
 * Handles patient/family agreements and final signatures.
 */

interface SignaturesStepProps {
  formData: TreatmentPlanFormData;
  updateFormData: (data: Partial<TreatmentPlanFormData>) => void;
}

const SignaturesStep: React.FC<SignaturesStepProps> = ({
  formData,
  updateFormData
}) => {
  const [isSignatureDrawingOpen, setIsSignatureDrawingOpen] = useState(false);
  const handlePatientAgreement = (field: string, value: boolean) => {
    updateFormData({
      patientAgreements: {
        ...formData.patientAgreements,
        [field]: value
      }
    });
  };

  const handlePlanAgreement = (field: string, value: boolean) => {
    updateFormData({
      planAgreements: {
        ...formData.planAgreements,
        [field]: value
      }
    });
  };

  const handlePersonSignature = () => {
    // Open signature drawing dialog instead of immediately signing
    setIsSignatureDrawingOpen(true);
  };

  const handleSignatureSave = (signatureData: string) => {
    updateFormData({
      signatures: {
        ...formData.signatures,
        personSignature: {
          signed: true,
          signedBy: 'Patient/Guardian',
          signedDate: new Date().toISOString(),
          signatureData
        }
      }
    });
  };

  return (
    <div className="space-y-6">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Patient Agreements Section */}
        <div className="bg-white rounded-lg p-6 border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <DocumentCheckIcon className="w-5 h-5 text-blue-600 mr-2" />
            Patient Agreements
          </h3>
          
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Agreement 1 */}
              <div className="flex items-start space-x-3">
                <input
                  type="checkbox"
                  id="adhereToRecommendations"
                  checked={formData.patientAgreements?.adhereToRecommendations || false}
                  onChange={(e) => handlePatientAgreement('adhereToRecommendations', e.target.checked)}
                  className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="adhereToRecommendations" className="text-sm text-gray-700 cursor-pointer">
                  I agree to adhere to the recommendations and conditions outlined in this plan.
                </label>
              </div>

              {/* Agreement 2 */}
              <div className="flex items-start space-x-3">
                <input
                  type="checkbox"
                  id="agreeWithServicesTypes"
                  checked={formData.patientAgreements?.agreeWithServicesTypes || false}
                  onChange={(e) => handlePatientAgreement('agreeWithServicesTypes', e.target.checked)}
                  className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="agreeWithServicesTypes" className="text-sm text-gray-700 cursor-pointer">
                  Yes, I am agreement with the types and levels of services included in the plan.
                </label>
              </div>

              {/* Agreement 3 */}
              <div className="flex items-start space-x-3">
                <input
                  type="checkbox"
                  id="receivedCopyOfPlan"
                  checked={formData.patientAgreements?.receivedCopyOfPlan || false}
                  onChange={(e) => handlePatientAgreement('receivedCopyOfPlan', e.target.checked)}
                  className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="receivedCopyOfPlan" className="text-sm text-gray-700 cursor-pointer">
                  Yes, I have received a copy of this plan.
                </label>
              </div>

              {/* Agreement 4 */}
              <div className="flex items-start space-x-3">
                <input
                  type="checkbox"
                  id="textForAgreement"
                  checked={formData.patientAgreements?.textForAgreement || false}
                  onChange={(e) => handlePatientAgreement('textForAgreement', e.target.checked)}
                  className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="textForAgreement" className="text-sm text-gray-700 cursor-pointer">
                  Text for Agreement
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Plan Agreements Section */}
        <div className="bg-white rounded-lg p-6 border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <DocumentCheckIcon className="w-5 h-5 text-green-600 mr-2" />
            Plan Agreements
          </h3>
          
          <div className="space-y-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-700 mb-3">I agree to follow this plan.</p>
              
              <div className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  id="agreeToFollowPlan"
                  checked={formData.planAgreements?.agreeToFollowPlan || false}
                  onChange={(e) => handlePlanAgreement('agreeToFollowPlan', e.target.checked)}
                  className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                />
                <label htmlFor="agreeToFollowPlan" className="text-sm text-gray-700 cursor-pointer">
                  I agree to follow this plan
                </label>
              </div>
            </div>
            
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-xs text-blue-700">
                A testament typically refers to a will, which is a legal document that outlines a person's wishes regarding the distribution of their assets, care of minor children, and other end-of-life matters. In some contexts, "testament" can also refer to a declaration of beliefs or principles, but the most common use is related to legal documents.
              </p>
            </div>
          </div>
        </div>

        {/* Patient/Guardian/Agency Signatures Section */}
        <div className="bg-white rounded-lg p-6 border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <UserIcon className="w-5 h-5 text-purple-600 mr-2" />
            Patient/Guardian/Agency Signatures
          </h3>
          
          <div className="space-y-4">
            {/* Person Signature */}
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
              <h4 className="font-medium text-purple-900 mb-3">Person Signature</h4>
              
              <div className="flex items-center gap-4">
                <Button
                  onClick={handlePersonSignature}
                  variant={formData.signatures?.personSignature?.signed ? "default" : "outline"}
                  className="flex items-center gap-2"
                >
                  <CheckIcon className="w-4 h-4" />
                  {formData.signatures?.personSignature?.signed ? 'Signed' : 'Sign'}
                </Button>
                
                {formData.signatures?.personSignature?.signed && (
                  <div className="space-y-2">
                    <div className="text-sm text-purple-700">
                      Signed by {formData.signatures.personSignature.signedBy} on {new Date(formData.signatures.personSignature.signedDate).toLocaleDateString()}
                    </div>
                    {formData.signatures.personSignature.signatureData && (
                      <div className="bg-white border border-purple-200 rounded p-2">
                        <img 
                          src={formData.signatures.personSignature.signatureData} 
                          alt="Patient/Guardian Signature" 
                          className="max-w-full h-auto max-h-20"
                        />
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Care Team Signatures Section */}
        <div className="bg-white rounded-lg p-6 border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <UserGroupIcon className="w-5 h-5 text-blue-600 mr-2" />
            Care Team Signatures
          </h3>
          
          <div className="space-y-4">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm text-blue-700 mb-4">
                To view updated signatures from modified care team, save and reopen plan.
              </p>
              
              <div className="space-y-3">
                {(formData.signatures?.careTeamSignatures || []).map((provider) => (
                  <div key={provider.id} className="flex items-center justify-between bg-white p-3 rounded border">
                    <div className="flex items-center space-x-3">
                      <div>
                        <div className="font-medium text-gray-900">{provider.providerName}</div>
                        <div className="text-sm text-gray-500">{provider.title}</div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      {provider.signed ? (
                        <div className="flex items-center space-x-2">
                          <CheckIcon className="w-4 h-4 text-green-600" />
                          <span className="text-sm text-green-700">Signed</span>
                        </div>
                      ) : (
                        <span className="text-sm text-gray-500">Pending</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Summary */}
        <div className="bg-gradient-to-r from-emerald-50 to-blue-50 border border-emerald-200 rounded-lg p-6">
          <h4 className="text-lg font-medium text-gray-900 mb-4">Treatment Plan Status</h4>
          <div className={`text-center p-3 rounded-lg ${
            formData.signatures?.personSignature?.signed 
              ? 'bg-green-100 text-green-800' 
              : 'bg-yellow-100 text-yellow-800'
          }`}>
            <div className="font-medium">
              {formData.signatures?.personSignature?.signed 
                ? '✅ Treatment Plan Ready for Submission' 
                : '⚠️ Please complete all required signatures'}
            </div>
          </div>
        </div>
      </div>
      
      {/* Signature Drawing Dialog */}
      <SignatureDrawing
        isOpen={isSignatureDrawingOpen}
        onClose={() => setIsSignatureDrawingOpen(false)}
        onSave={handleSignatureSave}
        title="Patient/Guardian Signature"
        description="Please draw your signature in the box below to confirm your agreement with the treatment plan."
      />
    </div>
  );
};

export default SignaturesStep;
