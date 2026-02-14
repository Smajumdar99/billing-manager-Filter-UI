import React from 'react';
import { Label } from '@/components/atoms/Label/label';
import { RadioGroup, RadioGroupItem } from '@/components/atoms/RadioGroup/radio-group';

interface AdditionalInfoStepProps {
  data: any;
  updateData: (data: any) => void;
}

const ambulatoryQuestions = [
  { id: 'newAllergies', text: 'Have you developed any new allergies?' },
  { id: 'medicationsChange', text: 'Have there been any medications change?' },
  { id: 'newMedicalProblems', text: 'Have you had any new medical problems since your last visit?' },
  { id: 'seenOtherProvider', text: 'Have you been seen by another provider since your last visit?' },
  { id: 'hospitalized', text: 'Have you been hospitalized since your last visit?' },
  { id: 'newSurgeries', text: 'Have you had any new surgeries or procedures since your last visit?' },
];

export const AdditionalInfoStep: React.FC<AdditionalInfoStepProps> = ({ data, updateData }) => {
  const handleResponseChange = (questionId: string, value: string) => {
    updateData({
      ...data,
      additionalInfo: {
        ...data.additionalInfo,
        [questionId]: value === 'yes',
      },
    });
  };

  return (
    <div className="space-y-6">
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
        <h3 className="text-sm font-semibold text-gray-700 mb-4">For Ambulatory Only:</h3>
        <p className="text-xs text-gray-500 mb-6">
          Please answer the following screening questions. These are optional but help us provide better care.
        </p>

        <div className="space-y-5">
          {ambulatoryQuestions.map((question) => (
            <div key={question.id} className="flex items-start justify-between gap-4 pb-4 border-b border-gray-200 last:border-0">
              <Label className="text-sm text-gray-700 flex-1 leading-relaxed">
                {question.text}
              </Label>
              <RadioGroup
                value={data.additionalInfo?.[question.id] === true ? 'yes' : data.additionalInfo?.[question.id] === false ? 'no' : ''}
                onValueChange={(value) => handleResponseChange(question.id, value)}
                className="flex gap-4"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="yes" id={`${question.id}-yes`} />
                  <Label htmlFor={`${question.id}-yes`} className="text-sm font-normal cursor-pointer">
                    Yes
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="no" id={`${question.id}-no`} />
                  <Label htmlFor={`${question.id}-no`} className="text-sm font-normal cursor-pointer">
                    No
                  </Label>
                </div>
              </RadioGroup>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <p className="text-xs text-blue-700">
          <strong>Note:</strong> This section is optional. You can skip it if not applicable or return to it later before finalizing the encounter.
        </p>
      </div>
    </div>
  );
};
