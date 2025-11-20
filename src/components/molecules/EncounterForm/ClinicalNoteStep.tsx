import React from 'react';
import { Label } from '@/components/atoms/Label/label';
import { PaperClipIcon } from '@heroicons/react/24/outline';

interface ClinicalNoteStepProps {
    data: any;
    updateData: (data: any) => void;
}

export const ClinicalNoteStep: React.FC<ClinicalNoteStepProps> = ({ data, updateData }) => {
    const handleChange = (field: string, value: any) => {
        updateData({ ...data, [field]: value });
    };

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Late Note Toggle */}
            <div className="flex items-center justify-between bg-blue-50 p-4 rounded-lg border border-blue-100">
                <div className="flex items-center gap-2">
                    <input
                        type="checkbox"
                        id="lateNote"
                        checked={data.isLateNote}
                        onChange={(e) => handleChange('isLateNote', e.target.checked)}
                        className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                    />
                    <Label htmlFor="lateNote" className="font-medium cursor-pointer">Mark as Late Note</Label>
                </div>
                {data.isLateNote && (
                    <span className="text-xs text-amber-600 font-medium bg-amber-50 px-2 py-1 rounded-full border border-amber-200">
                        Reason required for audit
                    </span>
                )}
            </div>

            <div className="space-y-2">
                <Label htmlFor="serviceNote">Service Note</Label>
                <textarea
                    id="serviceNote"
                    value={data.serviceNote || ''}
                    onChange={(e) => handleChange('serviceNote', e.target.value)}
                    className="w-full min-h-[100px] p-3 rounded-md border border-gray-300 focus:ring-2 focus:ring-primary focus:border-transparent resize-y"
                    placeholder="Enter service note..."
                />
            </div>

            <div className="space-y-2">
                <Label htmlFor="assessment">Assessment</Label>
                <textarea
                    id="assessment"
                    value={data.assessment || ''}
                    onChange={(e) => handleChange('assessment', e.target.value)}
                    className="w-full min-h-[80px] p-3 rounded-md border border-gray-300 focus:ring-2 focus:ring-primary focus:border-transparent resize-y"
                    placeholder="Enter assessment..."
                />
            </div>

            <div className="space-y-2">
                <Label htmlFor="plan">Plan</Label>
                <textarea
                    id="plan"
                    value={data.plan || ''}
                    onChange={(e) => handleChange('plan', e.target.value)}
                    className="w-full min-h-[80px] p-3 rounded-md border border-gray-300 focus:ring-2 focus:ring-primary focus:border-transparent resize-y"
                    placeholder="Enter plan..."
                />
            </div>

            <div className="border-t border-gray-100 my-4"></div>

            <div className="space-y-2">
                <Label htmlFor="instructions" className="text-base font-semibold text-gray-700">After Visit Instructions</Label>
                <p className="text-xs text-muted-foreground mb-2">Instructions provided to the patient (printed on summary).</p>
                <textarea
                    id="instructions"
                    value={data.instructions || ''}
                    onChange={(e) => handleChange('instructions', e.target.value)}
                    className="w-full min-h-[80px] p-3 rounded-md border border-gray-200 bg-gray-50 text-sm focus:bg-white transition-all focus:border-primary"
                    placeholder="E.g., Take medication as prescribed, return in 2 weeks..."
                />
            </div>

            {/* Document Upload Placeholder */}
            <div className="space-y-2">
                <Label className="text-base font-semibold text-gray-700">Documents</Label>
                <div className="border-2 border-dashed border-gray-200 rounded-lg p-6 flex flex-col items-center justify-center text-center hover:bg-gray-50 transition-colors cursor-pointer">
                    <PaperClipIcon className="h-8 w-8 text-gray-400 mb-2" />
                    <span className="text-sm font-medium text-gray-600">Drop files here or click to upload</span>
                    <span className="text-xs text-gray-400 mt-1">PDF, JPG, PNG (Max 10MB)</span>
                </div>
            </div>
        </div>
    );
};
