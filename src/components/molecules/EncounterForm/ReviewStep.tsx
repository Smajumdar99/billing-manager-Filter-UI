import React from 'react';
import { CheckCircleIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline';

interface ReviewStepProps {
    data: any;
}

export const ReviewStep: React.FC<ReviewStepProps> = ({ data }) => {
    const isReady = data.staffSignature;

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {isReady ? (
                <div className="bg-green-50 border border-green-100 rounded-lg p-4 flex items-start gap-3">
                    <CheckCircleIcon className="h-6 w-6 text-green-600 mt-0.5" />
                    <div>
                        <h3 className="font-medium text-green-900">Ready to Submit</h3>
                        <p className="text-sm text-green-700 mt-1">Please review the encounter details below before submitting.</p>
                    </div>
                </div>
            ) : (
                <div className="bg-amber-50 border border-amber-100 rounded-lg p-4 flex items-start gap-3">
                    <ExclamationTriangleIcon className="h-6 w-6 text-amber-600 mt-0.5" />
                    <div>
                        <h3 className="font-medium text-amber-900">Missing Signature</h3>
                        <p className="text-sm text-amber-700 mt-1">You must sign the encounter in the "Signatures" tab before submitting.</p>
                    </div>
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Logistics Summary */}
                <div className="space-y-4">
                    <h3 className="font-semibold text-lg border-b pb-2">Logistics</h3>
                    <dl className="space-y-2 text-sm">
                        <div className="flex justify-between">
                            <dt className="text-muted-foreground">Date & Time:</dt>
                            <dd className="font-medium">{data.date} at {data.time}</dd>
                        </div>
                        <div className="flex justify-between">
                            <dt className="text-muted-foreground">Program:</dt>
                            <dd className="font-medium">{data.program || <span className="text-red-500">Missing</span>}</dd>
                        </div>
                        <div className="flex justify-between">
                            <dt className="text-muted-foreground">Provider:</dt>
                            <dd className="font-medium">{data.provider}</dd>
                        </div>
                        <div className="flex justify-between">
                            <dt className="text-muted-foreground">Location:</dt>
                            <dd className="font-medium capitalize">
                                {data.isTelehealth ? `Telehealth (${data.telehealthOption})` : data.location}
                            </dd>
                        </div>
                    </dl>
                </div>

                {/* Billing Summary */}
                <div className="space-y-4">
                    <h3 className="font-semibold text-lg border-b pb-2">Billing</h3>
                    {data.notBillable ? (
                        <div className="bg-gray-100 p-2 rounded text-center text-sm font-medium text-gray-600">
                            Marked as Not Billable
                        </div>
                    ) : (
                        <div className="space-y-3">
                            <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">Bill To:</span>
                                <span className="font-medium capitalize">{data.billTo}</span>
                            </div>
                            <div>
                                <span className="text-sm text-muted-foreground block mb-1">CPT Codes:</span>
                                <div className="flex flex-wrap gap-1">
                                    {data.cptCodes?.length > 0 ? (
                                        data.cptCodes.map((code: string, i: number) => (
                                            <span key={i} className="bg-blue-50 text-blue-700 px-2 py-0.5 rounded text-xs border border-blue-100">{code}</span>
                                        ))
                                    ) : (
                                        <span className="text-sm italic text-muted-foreground">None</span>
                                    )}
                                </div>
                            </div>
                            <div>
                                <span className="text-sm text-muted-foreground block mb-1">ICD-10 Codes:</span>
                                <div className="flex flex-wrap gap-1">
                                    {data.icdCodes?.length > 0 ? (
                                        data.icdCodes.map((code: string, i: number) => (
                                            <span key={i} className="bg-green-50 text-green-700 px-2 py-0.5 rounded text-xs border border-green-100">{code}</span>
                                        ))
                                    ) : (
                                        <span className="text-sm italic text-muted-foreground">None</span>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Clinical Summary */}
                <div className="col-span-1 md:col-span-2 space-y-4">
                    <div className="flex items-center justify-between border-b pb-2">
                        <h3 className="font-semibold text-lg">Clinical Documentation</h3>
                        {data.isLateNote && (
                            <span className="bg-red-100 text-red-700 text-xs px-2 py-1 rounded-full font-medium">Late Entry</span>
                        )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="bg-muted/30 p-3 rounded-md">
                            <span className="text-xs font-bold text-primary uppercase tracking-wider block mb-1">Subjective</span>
                            <p className="text-sm whitespace-pre-wrap">{data.subjective || <span className="italic text-muted-foreground">No entry</span>}</p>
                        </div>
                        <div className="bg-muted/30 p-3 rounded-md">
                            <span className="text-xs font-bold text-primary uppercase tracking-wider block mb-1">Objective</span>
                            <p className="text-sm whitespace-pre-wrap">{data.objective || <span className="italic text-muted-foreground">No entry</span>}</p>
                        </div>
                        <div className="bg-muted/30 p-3 rounded-md">
                            <span className="text-xs font-bold text-primary uppercase tracking-wider block mb-1">Assessment</span>
                            <p className="text-sm whitespace-pre-wrap">{data.assessment || <span className="italic text-muted-foreground">No entry</span>}</p>
                        </div>
                        <div className="bg-muted/30 p-3 rounded-md">
                            <span className="text-xs font-bold text-primary uppercase tracking-wider block mb-1">Plan</span>
                            <p className="text-sm whitespace-pre-wrap">{data.plan || <span className="italic text-muted-foreground">No entry</span>}</p>
                        </div>
                    </div>

                    {data.instructions && (
                        <div className="bg-gray-50 p-3 rounded-md border border-gray-200">
                            <span className="text-xs font-bold text-gray-600 uppercase tracking-wider block mb-1">Patient Instructions</span>
                            <p className="text-sm whitespace-pre-wrap">{data.instructions}</p>
                        </div>
                    )}
                </div>

                {/* Diagnosis & Allergies Summary */}
                {data.diagnosisAllergies && data.diagnosisAllergies.length > 0 && (
                    <div className="col-span-1 md:col-span-2 space-y-4">
                        <h3 className="font-semibold text-lg border-b pb-2">Diagnosis & Allergies</h3>
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm border border-gray-200 rounded-lg overflow-hidden">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-3 py-2 text-left font-semibold text-gray-700">Type</th>
                                        <th className="px-3 py-2 text-left font-semibold text-gray-700">Title</th>
                                        <th className="px-3 py-2 text-left font-semibold text-gray-700">Code</th>
                                        <th className="px-3 py-2 text-left font-semibold text-gray-700">Start Date</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                    {data.diagnosisAllergies.map((item: any, index: number) => (
                                        <tr key={index} className="hover:bg-gray-50">
                                            <td className="px-3 py-2 capitalize">{item.type.replace('_', ' ')}</td>
                                            <td className="px-3 py-2 font-medium">{item.title}</td>
                                            <td className="px-3 py-2 text-gray-600">{item.diagnosisCode || '—'}</td>
                                            <td className="px-3 py-2 text-gray-600">
                                                {item.startDate ? new Date(item.startDate).toLocaleDateString() : '—'}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};
