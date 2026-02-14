import React from 'react';
import { Label } from '@/components/atoms/Label/label';
import { CheckCircleIcon, UserIcon, PencilSquareIcon } from '@heroicons/react/24/outline';

interface SignaturesStepProps {
    data: any;
    updateData: (data: any) => void;
}

export const SignaturesStep: React.FC<SignaturesStepProps> = ({ data, updateData }) => {
    const handleChange = (field: string, value: any) => {
        updateData({ ...data, [field]: value });
    };

    const handleStaffSign = () => {
        if (!data.staffSignature) {
            updateData({
                ...data,
                staffSignature: true,
                staffSignDate: new Date().toLocaleString()
            });
        } else {
            updateData({
                ...data,
                staffSignature: false,
                staffSignDate: ''
            });
        }
    };

    const handlePatientSign = () => {
        if (!data.patientSignature) {
            updateData({
                ...data,
                patientSignature: true,
                patientSignDate: new Date().toLocaleString()
            });
        } else {
            updateData({
                ...data,
                patientSignature: false,
                patientSignDate: ''
            });
        }
    };

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="bg-yellow-50 border border-yellow-100 rounded-lg p-4">
                <p className="text-sm text-yellow-800">
                    <strong>Compliance Notice:</strong> All encounters must be signed by the provider within 24 hours of service.
                </p>
            </div>

            {/* Staff Signature */}
            <div className="border rounded-xl p-6 bg-white shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between">
                    <div className="flex gap-4">
                        <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                            <UserIcon className="h-6 w-6" />
                        </div>
                        <div>
                            <h3 className="text-base font-semibold text-gray-900">Staff Signature</h3>
                            <p className="text-sm text-gray-500">Sign as <strong>Admin, Ensoftek</strong></p>

                            {data.staffSignature && (
                                <div className="mt-2 flex items-center gap-2 text-green-600 bg-green-50 px-3 py-1 rounded-full w-fit">
                                    <CheckCircleIcon className="h-4 w-4" />
                                    <span className="text-xs font-medium">Signed on {data.staffSignDate}</span>
                                </div>
                            )}
                        </div>
                    </div>

                    <button
                        onClick={handleStaffSign}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${data.staffSignature
                                ? 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                : 'bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm'
                            }`}
                    >
                        {data.staffSignature ? 'Revoke Signature' : 'Sign Electronically'}
                    </button>
                </div>
            </div>

            {/* Patient Signature */}
            <div className="border rounded-xl p-6 bg-white shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between">
                    <div className="flex gap-4">
                        <div className="h-12 w-12 rounded-full bg-purple-100 flex items-center justify-center text-purple-600">
                            <PencilSquareIcon className="h-6 w-6" />
                        </div>
                        <div>
                            <h3 className="text-base font-semibold text-gray-900">Patient / Guardian Signature</h3>
                            <p className="text-sm text-gray-500">Capture patient acknowledgment</p>

                            {data.patientSignature && (
                                <div className="mt-2 flex items-center gap-2 text-green-600 bg-green-50 px-3 py-1 rounded-full w-fit">
                                    <CheckCircleIcon className="h-4 w-4" />
                                    <span className="text-xs font-medium">Signed on {data.patientSignDate}</span>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="flex flex-col items-end gap-2">
                        <div className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                id="patientSign"
                                checked={data.patientSignature}
                                onChange={handlePatientSign}
                                className="h-5 w-5 rounded border-gray-300 text-primary focus:ring-primary"
                            />
                            <Label htmlFor="patientSign" className="cursor-pointer">Signature on File / eSign</Label>
                        </div>
                        <span className="text-xs text-gray-400">Check to confirm patient signature</span>
                    </div>
                </div>
            </div>
        </div>
    );
};
