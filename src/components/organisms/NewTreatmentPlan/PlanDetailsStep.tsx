import React from 'react';
import { CalendarIcon, UserIcon, DocumentTextIcon } from '@heroicons/react/24/outline';
import { Input } from '@/components/atoms/Input';
import { Select } from '@/components/atoms/Select/select';
import { TreatmentPlanFormData } from '../../../pages/NewTreatmentPlanPage';

/**
 * PlanDetailsStep Component
 * 
 * Step 1 of the New Treatment Plan wizard.
 * Collects basic plan information including plan name, type, dates, and patient details.
 * 
 * Features:
 * - Plan name and type selection
 * - Start and end date inputs
 * - Patient selection and details
 * - Form validation
 * - Apple-style clean design
 */

interface PlanDetailsStepProps {
  formData: TreatmentPlanFormData;
  updateFormData: (data: Partial<TreatmentPlanFormData>) => void;
}

// Mock patient data for selection
const mockPatients = [
  { id: 'P001', name: 'John Smith', livedName: 'Johnny', pronouns: 'he/him', dob: '1995-03-15' },
  { id: 'P002', name: 'Emily Davis', livedName: 'Em', pronouns: 'she/her', dob: '1988-07-22' },
  { id: 'P003', name: 'Michael Johnson', livedName: 'Mike', pronouns: 'he/him', dob: '1992-11-08' },
  { id: 'P004', name: 'Sarah Wilson', livedName: 'Sarah', pronouns: 'they/them', dob: '1985-05-30' },
  { id: 'P005', name: 'David Brown', livedName: 'Dave', pronouns: 'he/him', dob: '1990-09-12' }
];

const PlanDetailsStep: React.FC<PlanDetailsStepProps> = ({
  formData,
  updateFormData
}) => {
  // Handle input changes
  const handleInputChange = (field: keyof TreatmentPlanFormData, value: string) => {
    updateFormData({ [field]: value });
  };

  // Handle patient selection
  const handlePatientSelect = (patientId: string) => {
    const selectedPatient = mockPatients.find(p => p.id === patientId);
    if (selectedPatient) {
      updateFormData({
        patientId: selectedPatient.id,
        patientName: selectedPatient.name,
        patientLivedName: selectedPatient.livedName,
        patientPronouns: selectedPatient.pronouns
      });
    }
  };

  // Calculate minimum end date (6 months from start date)
  const getMinEndDate = () => {
    if (!formData.startDate) return '';
    const startDate = new Date(formData.startDate);
    startDate.setMonth(startDate.getMonth() + 6);
    return startDate.toISOString().split('T')[0];
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Patient Information Section - First section */}
      <div className="bg-white border border-gray-200 rounded-lg p-4">
        <div className="flex items-start space-x-3">
          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
            <UserIcon className="w-5 h-5 text-blue-600" />
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="font-semibold text-gray-900 text-sm">John Smith</h4>
            <div className="mt-1">
              <p className="text-sm text-gray-600">
                <span className="font-medium">Lived Name:</span> Johnny
                <span className="mx-2 text-gray-400">|</span>
                <span className="font-medium">Pronouns:</span> he/him
                <span className="mx-2 text-gray-400">|</span>
                <span className="text-gray-500 font-medium">ID:</span> <span className="text-gray-500">P001</span>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Plan Information Section */}
      <div className="bg-white rounded-lg p-6 border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <DocumentTextIcon className="w-5 h-5 text-gray-600 mr-2" />
            Plan Details
          </h3>
          
          {/* Plan details - full width */}
          <div className="space-y-6">
            {/* Plan Name */}
            <div>
              <label htmlFor="planName" className="block text-sm font-medium text-gray-700 mb-2">
                Plan Name <span className="text-red-500">*</span>
              </label>
              <Input
                id="planName"
                type="text"
                value={formData.planName}
                onChange={(e) => handleInputChange('planName', e.target.value)}
                placeholder="Enter treatment plan name"
                className="w-full"
                required
              />
              <p className="text-xs text-gray-500 mt-1">
                Choose a descriptive name that identifies this treatment plan
              </p>
            </div>

            {/* Plan Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Plan Type <span className="text-red-500">*</span>
              </label>
              <div className="grid grid-cols-2 gap-3">
                {/* Initial Plan Card */}
                <button
                  type="button"
                  onClick={() => handleInputChange('planType', 'Initial')}
                  className={`relative p-4 rounded-lg border-2 transition-all duration-200 text-left ${
                    formData.planType === 'Initial'
                      ? 'border-blue-500 bg-blue-50 shadow-md'
                      : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className={`text-sm font-semibold ${
                        formData.planType === 'Initial' ? 'text-blue-900' : 'text-gray-900'
                      }`}>
                        Initial Plan
                      </h3>
                      <p className={`text-xs mt-1 ${
                        formData.planType === 'Initial' ? 'text-blue-700' : 'text-gray-500'
                      }`}>
                        New treatment plan
                      </p>
                    </div>
                    <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                      formData.planType === 'Initial'
                        ? 'border-blue-500 bg-blue-500'
                        : 'border-gray-300'
                    }`}>
                      {formData.planType === 'Initial' && (
                        <div className="w-2 h-2 bg-white rounded-full" />
                      )}
                    </div>
                  </div>
                </button>

                {/* Review Plan Card */}
                <button
                  type="button"
                  onClick={() => handleInputChange('planType', 'Review')}
                  className={`relative p-4 rounded-lg border-2 transition-all duration-200 text-left ${
                    formData.planType === 'Review'
                      ? 'border-green-500 bg-green-50 shadow-md'
                      : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className={`text-sm font-semibold ${
                        formData.planType === 'Review' ? 'text-green-900' : 'text-gray-900'
                      }`}>
                        Review Plan
                      </h3>
                      <p className={`text-xs mt-1 ${
                        formData.planType === 'Review' ? 'text-green-700' : 'text-gray-500'
                      }`}>
                        Plan review/update
                      </p>
                    </div>
                    <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                      formData.planType === 'Review'
                        ? 'border-green-500 bg-green-500'
                        : 'border-gray-300'
                    }`}>
                      {formData.planType === 'Review' && (
                        <div className="w-2 h-2 bg-white rounded-full" />
                      )}
                    </div>
                  </div>
                </button>
              </div>
              <p className="text-xs text-gray-500 mt-2">
                Select whether this is an initial plan or a review
              </p>
            </div>

            {/* Date Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Start Date */}
              <div>
                <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 mb-2">
                  Start Date <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Input
                    id="startDate"
                    type="date"
                    value={formData.startDate}
                    onChange={(e) => handleInputChange('startDate', e.target.value)}
                    className="w-full pl-10"
                    required
                  />
                  <CalendarIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                </div>
              </div>

              {/* End Date */}
              <div>
                <label htmlFor="endDate" className="block text-sm font-medium text-gray-700 mb-2">
                  End Date <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Input
                    id="endDate"
                    type="date"
                    value={formData.endDate}
                    onChange={(e) => handleInputChange('endDate', e.target.value)}
                    min={getMinEndDate()}
                    className="w-full pl-10"
                    required
                  />
                  <CalendarIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                </div>
              </div>
            </div>

            {/* Date Last Reviewed - Only show for Review Plan */}
            {formData.planType === 'Review' && (
              <div>
                <label htmlFor="dateLastReviewed" className="block text-sm font-medium text-gray-700 mb-2">
                  Date Last Reviewed <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Input
                    id="dateLastReviewed"
                    type="date"
                    value={formData.dateLastReviewed}
                    onChange={(e) => handleInputChange('dateLastReviewed', e.target.value)}
                    className="w-full pl-10"
                    required={formData.planType === 'Review'}
                  />
                  <CalendarIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Date when this treatment plan was last reviewed
                </p>
              </div>
            )}

          </div>
        </div>
    </div>
  );
};

export default PlanDetailsStep;
