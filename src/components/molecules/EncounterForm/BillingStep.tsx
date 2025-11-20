import React from 'react';
import { Label } from '@/components/atoms/Label/label';
import { Input } from '@/components/atoms/Input/input';
import { PlusIcon, XMarkIcon, ArrowPathIcon } from '@heroicons/react/24/outline';

interface BillingStepProps {
    data: any;
    updateData: (data: any) => void;
}

export const BillingStep: React.FC<BillingStepProps> = ({ data, updateData }) => {
    const [cptInput, setCptInput] = React.useState('');
    const [icdInput, setIcdInput] = React.useState('');

    const cptCodes = data.cptCodes || [];
    const icdCodes = data.icdCodes || [];

    const addCpt = () => {
        if (cptInput.trim()) {
            updateData({ ...data, cptCodes: [...cptCodes, cptInput.trim()] });
            setCptInput('');
        }
    };

    const removeCpt = (index: number) => {
        const newCodes = [...cptCodes];
        newCodes.splice(index, 1);
        updateData({ ...data, cptCodes: newCodes });
    };

    const addIcd = () => {
        if (icdInput.trim()) {
            updateData({ ...data, icdCodes: [...icdCodes, icdInput.trim()] });
            setIcdInput('');
        }
    };

    const removeIcd = (index: number) => {
        const newCodes = [...icdCodes];
        newCodes.splice(index, 1);
        updateData({ ...data, icdCodes: newCodes });
    };

    const importHistory = () => {
        // Simulated import from patient history
        const historyCodes = ['F32.9', 'F41.1'];
        const newCodes = Array.from(new Set([...icdCodes, ...historyCodes]));
        updateData({ ...data, icdCodes: newCodes });
    };

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">

            {/* Billing Config moved to VisitDetailsStep */}
            <div className={data.notBillable ? "opacity-50 pointer-events-none filter grayscale transition-all" : "transition-all"}>
                {/* CPT Codes Section */}
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <Label className="text-base font-semibold text-primary">CPT Codes (Procedures)</Label>
                        <span className="text-xs text-muted-foreground">Add procedure codes</span>
                    </div>

                    <div className="flex gap-2">
                        <Input
                            value={cptInput}
                            onChange={(e) => setCptInput(e.target.value)}
                            placeholder="e.g. 90837"
                            className="flex-1"
                            onKeyDown={(e) => e.key === 'Enter' && addCpt()}
                        />
                        <button
                            onClick={addCpt}
                            className="p-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
                        >
                            <PlusIcon className="h-5 w-5" />
                        </button>
                    </div>

                    <div className="flex flex-wrap gap-2 min-h-[40px] p-2 bg-muted/30 rounded-md border border-dashed border-muted-foreground/20">
                        {cptCodes.length === 0 && (
                            <span className="text-sm text-muted-foreground italic self-center px-2">No CPT codes added</span>
                        )}
                        {cptCodes.map((code: string, index: number) => (
                            <div key={index} className="flex items-center gap-1 bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm border border-blue-100 animate-in zoom-in duration-200">
                                <span>{code}</span>
                                <button onClick={() => removeCpt(index)} className="hover:text-blue-900">
                                    <XMarkIcon className="h-3 w-3" />
                                </button>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="border-t border-border/50 my-6" />

                {/* ICD-10 Codes Section */}
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <Label className="text-base font-semibold text-primary">ICD-10 Codes (Diagnosis)</Label>
                        <button
                            onClick={importHistory}
                            className="text-xs flex items-center gap-1 text-primary hover:underline"
                        >
                            <ArrowPathIcon className="h-3 w-3" />
                            Import from History
                        </button>
                    </div>

                    <div className="flex gap-2">
                        <Input
                            value={icdInput}
                            onChange={(e) => setIcdInput(e.target.value)}
                            placeholder="e.g. F32.9"
                            className="flex-1"
                            onKeyDown={(e) => e.key === 'Enter' && addIcd()}
                        />
                        <button
                            onClick={addIcd}
                            className="p-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
                        >
                            <PlusIcon className="h-5 w-5" />
                        </button>
                    </div>

                    <div className="flex flex-wrap gap-2 min-h-[40px] p-2 bg-muted/30 rounded-md border border-dashed border-muted-foreground/20">
                        {icdCodes.length === 0 && (
                            <span className="text-sm text-muted-foreground italic self-center px-2">No ICD codes added</span>
                        )}
                        {icdCodes.map((code: string, index: number) => (
                            <div key={index} className="flex items-center gap-1 bg-green-50 text-green-700 px-3 py-1 rounded-full text-sm border border-green-100 animate-in zoom-in duration-200">
                                <span>{code}</span>
                                <button onClick={() => removeIcd(index)} className="hover:text-green-900">
                                    <XMarkIcon className="h-3 w-3" />
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};
