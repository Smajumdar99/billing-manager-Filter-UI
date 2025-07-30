import React from 'react';
import { PencilSquareIcon } from '@heroicons/react/24/outline';
import { CheckIcon } from '@heroicons/react/24/solid';
import { Button } from '@/components/atoms/Button';
import { TreatmentPlanFormData } from '../../../pages/NewTreatmentPlanPage';

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
  const handleAgreement = (agreed: boolean) => {
    updateFormData({
      agreed,
      agreedDate: agreed ? new Date().toISOString() : '',
      agreedBy: agreed ? 'Patient/Family' : ''
    });
  };

  return (
    <div className="space-y-6">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Signatures Section */}
        <div className="bg-white rounded-lg p-6 border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <PencilSquareIcon className="w-5 h-5 text-gray-600 mr-2" />
            Patient & Family Signatures
          </h3>
          
          <div className="space-y-4">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="font-medium text-blue-900 mb-2">Treatment Plan Agreement</h4>
              <p className="text-sm text-blue-700 mb-4">
                By signing below, the patient and family acknowledge they have reviewed and agree to this treatment plan.
              </p>
              
              <div className="flex items-center gap-4">
                <Button
                  onClick={() => handleAgreement(true)}
                  variant={formData.agreed ? "default" : "outline"}
                  className="flex items-center gap-2"
                >
                  <CheckIcon className="w-4 h-4" />
                  I Agree
                </Button>
                
                <Button
                  onClick={() => handleAgreement(false)}
                  variant={!formData.agreed ? "outline" : "ghost"}
                  className="text-gray-600"
                >
                  Cancel
                </Button>
              </div>
              
              {formData.agreed && (
                <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded">
                  <div className="flex items-center gap-2">
                    <CheckIcon className="w-5 h-5 text-green-600" />
                    <span className="text-sm font-medium text-green-800">
                      Agreement signed on {new Date(formData.agreedDate).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Summary */}
        <div className="bg-gradient-to-r from-emerald-50 to-blue-50 border border-emerald-200 rounded-lg p-6">
          <h4 className="text-lg font-medium text-gray-900 mb-4">Treatment Plan Status</h4>
          <div className={`text-center p-3 rounded-lg ${
            formData.agreed 
              ? 'bg-green-100 text-green-800' 
              : 'bg-yellow-100 text-yellow-800'
          }`}>
            <div className="font-medium">
              {formData.agreed 
                ? '✅ Treatment Plan Ready for Submission' 
                : '⚠️ Please review and sign the agreement'}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignaturesStep;
