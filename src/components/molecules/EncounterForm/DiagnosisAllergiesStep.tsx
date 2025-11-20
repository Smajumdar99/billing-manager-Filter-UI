import React, { useState } from 'react';
import { Label } from '@/components/atoms/Label/label';
import { Input } from '@/components/atoms/Input/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/atoms/Select/select';
import { Button } from '@/components/atoms/Button';
import { PencilIcon, TrashIcon, PlusIcon } from '@heroicons/react/24/outline';

interface DiagnosisAllergy {
    id: string;
    type: 'allergy' | 'medication' | 'diagnosis' | 'identified_needs';
    title: string;
    diagnosisCode?: string;
    startDate: string;
    endDate?: string;
    program?: string;
}

interface DiagnosisAllergiesStepProps {
    data: any;
    updateData: (data: any) => void;
}

export const DiagnosisAllergiesStep: React.FC<DiagnosisAllergiesStepProps> = ({ data, updateData }) => {
    const [isAdding, setIsAdding] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [formData, setFormData] = useState<Partial<DiagnosisAllergy>>({
        type: 'allergy',
        title: '',
        diagnosisCode: '',
        startDate: '',
        endDate: '',
        program: ''
    });

    // Default items to show
    const defaultItems: DiagnosisAllergy[] = [
        {
            id: 'default-1',
            type: 'allergy',
            title: 'Fevadryl',
            startDate: '2025-03-10'
        },
        {
            id: 'default-2',
            type: 'medication',
            title: 'blood-glucose meter',
            diagnosisCode: '',
            startDate: '2025-03-10'
        },
        {
            id: 'default-3',
            type: 'medication',
            title: 'testosterone cyp, micro (bulk)',
            diagnosisCode: '',
            startDate: '2025-03-10'
        },
        {
            id: 'default-4',
            type: 'medication',
            title: 'ICD10:A01.09(Typhoid fever with other complications)',
            diagnosisCode: 'ICD10:A01.09',
            startDate: '2025-03-10'
        },
        {
            id: 'default-5',
            type: 'medication',
            title: 'ICD10:A01.2(Paratyphoid fever B)',
            diagnosisCode: 'ICD10:A01.2',
            startDate: '2025-03-10'
        }
    ];

    const items: DiagnosisAllergy[] = data.diagnosisAllergies?.length > 0 ? data.diagnosisAllergies : defaultItems;



    const handleEdit = (item: DiagnosisAllergy) => {
        setIsAdding(true);
        setEditingId(item.id);
        setFormData(item);
    };

    const handleSave = () => {
        if (!formData.title || !formData.startDate) {
            alert('Please fill in required fields (Title and Start Date)');
            return;
        }

        const newItem: DiagnosisAllergy = {
            id: editingId || `item-${Date.now()}`,
            type: formData.type as DiagnosisAllergy['type'],
            title: formData.title,
            diagnosisCode: formData.diagnosisCode,
            startDate: formData.startDate,
            endDate: formData.endDate,
            program: formData.program
        };

        let updatedItems;
        if (editingId) {
            updatedItems = items.map(item => item.id === editingId ? newItem : item);
        } else {
            updatedItems = [...items, newItem];
        }

        updateData({ ...data, diagnosisAllergies: updatedItems });
        setIsAdding(false);
        setEditingId(null);
    };

    const handleDelete = (id: string) => {
        if (confirm('Are you sure you want to delete this item?')) {
            const updatedItems = items.filter(item => item.id !== id);
            updateData({ ...data, diagnosisAllergies: updatedItems });
        }
    };

    const handleCancel = () => {
        setIsAdding(false);
        setEditingId(null);
    };

    const getTypeLabel = (type: string) => {
        const labels: Record<string, string> = {
            allergy: 'Allergy',
            medication: 'Medication',
            diagnosis: 'Diagnosis',
            identified_needs: 'Identified Needs'
        };
        return labels[type] || type;
    };

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Add New Button */}
            <div className="flex justify-end -mt-12">
                <Button
                    onClick={() => {/* Not implemented yet */ }}
                    className="bg-primary hover:bg-primary/90 text-primary-foreground h-9 text-sm"
                >
                    <PlusIcon className="h-4 w-4 mr-1" />
                    Add New
                </Button>
            </div>

            {/* Add/Edit Form */}
            {isAdding && (
                <div className="bg-blue-50/50 border border-blue-200 rounded-lg p-4 space-y-4 animate-in fade-in slide-in-from-top-2">
                    <h4 className="text-sm font-semibold text-gray-900">
                        {editingId ? 'Edit Entry' : 'Add New Entry'}
                    </h4>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="type">Type <span className="text-red-500">*</span></Label>
                            <Select
                                value={formData.type}
                                onValueChange={(value) => setFormData({ ...formData, type: value as DiagnosisAllergy['type'] })}
                            >
                                <SelectTrigger id="type" className="bg-white">
                                    <SelectValue placeholder="Select Type" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="allergy">Allergy</SelectItem>
                                    <SelectItem value="medication">Medication</SelectItem>
                                    <SelectItem value="diagnosis">Diagnosis</SelectItem>
                                    <SelectItem value="identified_needs">Identified Needs</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="title">Title <span className="text-red-500">*</span></Label>
                            <Input
                                id="title"
                                value={formData.title}
                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                placeholder="e.g., Penicillin, Diabetes Type 2"
                                className="bg-white"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="diagnosisCode">Diagnosis/ICD-10 Code</Label>
                            <Input
                                id="diagnosisCode"
                                value={formData.diagnosisCode || ''}
                                onChange={(e) => setFormData({ ...formData, diagnosisCode: e.target.value })}
                                placeholder="e.g., ICD10:A01.09"
                                className="bg-white"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="program">Program</Label>
                            <Select
                                value={formData.program || ''}
                                onValueChange={(value) => setFormData({ ...formData, program: value })}
                            >
                                <SelectTrigger id="program" className="bg-white">
                                    <SelectValue placeholder="Select Program (Optional)" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="A-METH">A-METH</SelectItem>
                                    <SelectItem value="OP">Outpatient</SelectItem>
                                    <SelectItem value="IOP">Intensive Outpatient</SelectItem>
                                    <SelectItem value="RES">Residential</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="startDate">Start Date <span className="text-red-500">*</span></Label>
                            <Input
                                id="startDate"
                                type="date"
                                value={formData.startDate}
                                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                                className="bg-white"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="endDate">End Date</Label>
                            <Input
                                id="endDate"
                                type="date"
                                value={formData.endDate || ''}
                                onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                                className="bg-white"
                            />
                        </div>
                    </div>

                    <div className="flex gap-3 justify-end pt-2">
                        <Button variant="outline" onClick={handleCancel} className="h-9 text-sm">
                            Cancel
                        </Button>
                        <Button onClick={handleSave} className="bg-primary hover:bg-primary/90 text-primary-foreground h-9 text-sm">
                            {editingId ? 'Update' : 'Add'}
                        </Button>
                    </div>
                </div>
            )}

            {/* Table */}
            <div className="border border-gray-200 rounded-lg overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead className="bg-gray-50 border-b border-gray-200">
                            <tr>
                                <th className="px-4 py-3 text-left font-semibold text-gray-700">Type</th>
                                <th className="px-4 py-3 text-left font-semibold text-gray-700">Title</th>
                                <th className="px-4 py-3 text-left font-semibold text-gray-700">Diagnosis</th>
                                <th className="px-4 py-3 text-left font-semibold text-gray-700">Start Date</th>
                                <th className="px-4 py-3 text-left font-semibold text-gray-700">End Date</th>
                                <th className="px-4 py-3 text-left font-semibold text-gray-700">Program</th>
                                <th className="px-4 py-3 text-right font-semibold text-gray-700">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {items.length === 0 ? (
                                <tr>
                                    <td colSpan={7} className="px-4 py-8 text-center text-gray-500">
                                        No entries yet. Click "Add New" to get started.
                                    </td>
                                </tr>
                            ) : (
                                items.map((item) => (
                                    <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-4 py-3 text-gray-900">{getTypeLabel(item.type)}</td>
                                        <td className="px-4 py-3 text-gray-900 font-medium">{item.title}</td>
                                        <td className="px-4 py-3 text-gray-600">{item.diagnosisCode || '—'}</td>
                                        <td className="px-4 py-3 text-gray-600">
                                            {item.startDate ? new Date(item.startDate).toLocaleDateString() : '—'}
                                        </td>
                                        <td className="px-4 py-3 text-gray-600">
                                            {item.endDate ? new Date(item.endDate).toLocaleDateString() : '—'}
                                        </td>
                                        <td className="px-4 py-3 text-gray-600">{item.program || '—'}</td>
                                        <td className="px-4 py-3 text-right">
                                            <div className="flex gap-2 justify-end">
                                                <button
                                                    onClick={() => handleEdit(item)}
                                                    className="text-primary hover:text-primary/80 p-1.5 hover:bg-primary/5 rounded transition-colors"
                                                    title="Edit"
                                                >
                                                    <PencilIcon className="h-4 w-4" />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(item.id)}
                                                    className="text-red-600 hover:text-red-700 p-1.5 hover:bg-red-50 rounded transition-colors"
                                                    title="Delete"
                                                >
                                                    <TrashIcon className="h-4 w-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {items.length > 0 && (
                <div className="text-xs text-gray-500">
                    Total entries: {items.length}
                </div>
            )}
        </div>
    );
};
