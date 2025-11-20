import React from 'react';
import { Label } from '@/components/atoms/Label/label';
import { Input } from '@/components/atoms/Input/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/atoms/Select/select';
import { Switch } from '@/components/ui/switch'; // Assuming we have a switch component, or I'll use a checkbox
import { VideoCameraIcon, MapPinIcon } from '@heroicons/react/24/outline';

interface VisitDetailsStepProps {
    data: any;
    updateData: (data: any) => void;
}

export const VisitDetailsStep: React.FC<VisitDetailsStepProps> = ({ data, updateData }) => {
    const handleChange = (field: string, value: any) => {
        updateData({ ...data, [field]: value });
    };

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                {/* SECTION: Billing & Program */}
                <div className="md:col-span-2 pb-2 border-b border-gray-100 mb-2">
                    <h3 className="text-sm font-semibold text-gray-900">Billing & Program</h3>
                </div>

                {/* Row 1: Not Billable & Bill To */}
                <div className="flex flex-col justify-end pb-1">
                    <div className="flex items-center space-x-2 h-10">
                        <input
                            type="checkbox"
                            id="notBillable"
                            checked={data.notBillable}
                            onChange={(e) => handleChange('notBillable', e.target.checked)}
                            className="h-5 w-5 rounded border-gray-300 text-primary focus:ring-primary"
                        />
                        <Label htmlFor="notBillable" className="font-medium cursor-pointer text-base">
                            Not Billable
                        </Label>
                    </div>
                </div>

                <div className="space-y-2">
                    <div className="flex justify-between items-center h-5">
                        <Label htmlFor="billTo" className={data.notBillable ? "text-gray-400" : ""}>Bill-To</Label>
                        {!data.notBillable && <span className="text-xs text-red-500 font-medium">No Valid Primary Insurance</span>}
                    </div>
                    <div className="flex gap-2">
                        <Select
                            value={data.billTo}
                            onValueChange={(value) => handleChange('billTo', value)}
                            disabled={data.notBillable}
                        >
                            <SelectTrigger id="billTo" className="bg-white flex-1">
                                <SelectValue placeholder="Select Payor" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="insurance">Person</SelectItem>
                                <SelectItem value="medicaid">Medicaid</SelectItem>
                                <SelectItem value="self">Self Pay</SelectItem>
                                <SelectItem value="grant">Grant Funding</SelectItem>
                            </SelectContent>
                        </Select>
                        <button className="text-xs font-medium text-primary border border-primary px-3 py-2 rounded-md hover:bg-blue-50 whitespace-nowrap transition-colors">
                            Add Insurance
                        </button>
                    </div>
                </div>

                {/* Row 2: Category & Program */}
                <div className="space-y-2">
                    <Label htmlFor="category">Category</Label>
                    <Select
                        value={data.category}
                        onValueChange={(value) => handleChange('category', value)}
                    >
                        <SelectTrigger id="category">
                            <SelectValue placeholder="Select Category" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="mental_health">Mental Health</SelectItem>
                            <SelectItem value="substance_abuse">Substance Abuse</SelectItem>
                            <SelectItem value="general">General Health</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <div className="space-y-2">
                    <Label htmlFor="program">Program <span className="text-red-500">*</span></Label>
                    <Select
                        value={data.program}
                        onValueChange={(value) => handleChange('program', value)}
                    >
                        <SelectTrigger id="program" className={!data.program ? "border-red-200 bg-red-50/50" : ""}>
                            <SelectValue placeholder="Select Program" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="A-METH">A-METH (Methadone Maintenance)</SelectItem>
                            <SelectItem value="OP">Outpatient</SelectItem>
                            <SelectItem value="IOP">Intensive Outpatient</SelectItem>
                            <SelectItem value="RES">Residential</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                {/* SECTION: Visit Details */}
                <div className="md:col-span-2 pb-2 border-b border-gray-100 mt-4 mb-2">
                    <h3 className="text-sm font-semibold text-gray-900">Visit Details</h3>
                </div>

                {/* Row 3: Date & Time */}
                <div className="space-y-2">
                    <Label htmlFor="date">Date of Service</Label>
                    <Input
                        id="date"
                        type="date"
                        value={data.date || new Date().toISOString().split('T')[0]}
                        onChange={(e) => handleChange('date', e.target.value)}
                        className="w-full"
                    />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="time">Start Time</Label>
                    <Input
                        id="time"
                        type="time"
                        value={data.time || '09:00'}
                        onChange={(e) => handleChange('time', e.target.value)}
                        className="w-full"
                    />
                </div>

                {/* Row 4: Duration & Provider */}
                <div className="space-y-2">
                    <Label htmlFor="duration">Duration (minutes)</Label>
                    <Select
                        value={data.duration || '60'}
                        onValueChange={(value) => handleChange('duration', value)}
                    >
                        <SelectTrigger id="duration">
                            <SelectValue placeholder="Select duration" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="15">15 mins</SelectItem>
                            <SelectItem value="30">30 mins</SelectItem>
                            <SelectItem value="45">45 mins</SelectItem>
                            <SelectItem value="60">60 mins</SelectItem>
                            <SelectItem value="90">90 mins</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <div className="space-y-2">
                    <Label htmlFor="provider">Provider</Label>
                    <Select
                        value={data.provider}
                        onValueChange={(value) => handleChange('provider', value)}
                    >
                        <SelectTrigger id="provider">
                            <SelectValue placeholder="Select Provider" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="Admin, Ensoftek">Admin, Ensoftek (You)</SelectItem>
                            <SelectItem value="Smith, John">Smith, John (MD)</SelectItem>
                            <SelectItem value="Doe, Jane">Doe, Jane (LCSW)</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                {/* SECTION: Location */}
                <div className="md:col-span-2 pb-2 border-b border-gray-100 mt-4 mb-2">
                    <h3 className="text-sm font-semibold text-gray-900">Location</h3>
                </div>

                <div className="space-y-2 md:col-span-2">
                    <div className="flex items-center justify-between mb-2">
                        <Label htmlFor="location">Location <span className="text-red-500">*</span></Label>
                        <div className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                id="telehealth"
                                checked={data.isTelehealth}
                                onChange={(e) => handleChange('isTelehealth', e.target.checked)}
                                className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                            />
                            <Label htmlFor="telehealth" className="font-normal text-sm cursor-pointer flex items-center gap-1">
                                <VideoCameraIcon className="h-4 w-4 text-blue-500" />
                                This is a Telehealth Visit
                            </Label>
                        </div>
                    </div>

                    <Select
                        value={data.location || 'office'}
                        onValueChange={(value) => handleChange('location', value)}
                        disabled={data.isTelehealth}
                    >
                        <SelectTrigger id="location" className={data.isTelehealth ? "bg-gray-100 text-gray-400" : ""}>
                            <SelectValue placeholder="Select location" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="office">11005 Spain Rd NE, Reseda, DC - 32111</SelectItem>
                            <SelectItem value="satellite">Satellite Clinic - West Wing</SelectItem>
                            <SelectItem value="community">Community Center</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <div className="space-y-2">
                    <Label htmlFor="placeOfService">Place of Service</Label>
                    <Select
                        value={data.placeOfService}
                        onValueChange={(value) => handleChange('placeOfService', value)}
                    >
                        <SelectTrigger id="placeOfService">
                            <SelectValue placeholder="Select Place Of Service" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="11">11 - Office</SelectItem>
                            <SelectItem value="12">12 - Home</SelectItem>
                            <SelectItem value="02">02 - Telehealth</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <div className="space-y-2">
                    <Label htmlFor="billingLocation">Billing Location <span className="text-red-500">*</span></Label>
                    <Select
                        value={data.billingLocation}
                        onValueChange={(value) => handleChange('billingLocation', value)}
                    >
                        <SelectTrigger id="billingLocation">
                            <SelectValue placeholder="Select Billing Location" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="main">1 New Facilityss LOCATION</SelectItem>
                            <SelectItem value="secondary">Secondary Billing Office</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                {/* SECTION: Referral & Intake */}
                <div className="md:col-span-2 pb-2 border-b border-gray-100 mt-4 mb-2">
                    <h3 className="text-sm font-semibold text-gray-900">Referral & Intake</h3>
                </div>

                <div className="space-y-2">
                    <Label htmlFor="referralSource">Referral Source</Label>
                    <Select
                        value={data.referralSource}
                        onValueChange={(value) => handleChange('referralSource', value)}
                    >
                        <SelectTrigger id="referralSource">
                            <SelectValue placeholder="Select Referral Source" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="self">Self Referral</SelectItem>
                            <SelectItem value="court">Court Order</SelectItem>
                            <SelectItem value="hospital">Hospital Discharge</SelectItem>
                            <SelectItem value="pcp">Primary Care Physician</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <div className="space-y-2">
                    <Label htmlFor="sensitivity">Sensitivity Level</Label>
                    <Select
                        value={data.sensitivity || 'standard'}
                        onValueChange={(value) => handleChange('sensitivity', value)}
                    >
                        <SelectTrigger id="sensitivity">
                            <SelectValue placeholder="Select Sensitivity" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="standard">Standard (HIPAA)</SelectItem>
                            <SelectItem value="confidential">Confidential (42 CFR Part 2)</SelectItem>
                            <SelectItem value="restricted">Restricted Access</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <div className="space-y-2">
                    <Label htmlFor="referringProvider">Referring Provider</Label>
                    <Select
                        value={data.referringProvider}
                        onValueChange={(value) => handleChange('referringProvider', value)}
                    >
                        <SelectTrigger id="referringProvider">
                            <SelectValue placeholder="-- Unassigned --" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="unassigned">-- Unassigned --</SelectItem>
                            <SelectItem value="dr_smith">Dr. Smith</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <div className="space-y-2">
                    <Label htmlFor="referringNPI">Referring NPI</Label>
                    <Input
                        id="referringNPI"
                        value={data.referringNPI || ''}
                        onChange={(e) => handleChange('referringNPI', e.target.value)}
                        placeholder="Enter NPI"
                    />
                </div>

                {/* SECTION: Additional Info */}
                <div className="md:col-span-2 pb-2 border-b border-gray-100 mt-4 mb-2">
                    <h3 className="text-sm font-semibold text-gray-900">Additional Info</h3>
                </div>

                <div className="space-y-2">
                    <Label htmlFor="onsetDate">Onset/Hosp. Date</Label>
                    <Input
                        id="onsetDate"
                        type="date"
                        value={data.onsetDate || ''}
                        onChange={(e) => handleChange('onsetDate', e.target.value)}
                    />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="checkOutDate">Check-Out Date</Label>
                    <Input
                        id="checkOutDate"
                        type="date"
                        value={data.checkOutDate || ''}
                        onChange={(e) => handleChange('checkOutDate', e.target.value)}
                    />
                </div>

                <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="dartsProgram">Darts Program Number</Label>
                    <Select
                        value={data.dartsProgram}
                        onValueChange={(value) => handleChange('dartsProgram', value)}
                    >
                        <SelectTrigger id="dartsProgram">
                            <SelectValue placeholder="Select Assessment" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="assessment">Assessment</SelectItem>
                            <SelectItem value="treatment">Treatment</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                {/* Telehealth Specifics (Progressive Disclosure) */}
                {data.isTelehealth && (
                    <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6 bg-blue-50/50 p-4 rounded-lg border border-blue-100 animate-in fade-in slide-in-from-top-2">
                        <div className="space-y-2">
                            <Label htmlFor="telehealthOption">Telehealth Platform</Label>
                            <Select
                                value={data.telehealthOption}
                                onValueChange={(value) => handleChange('telehealthOption', value)}
                            >
                                <SelectTrigger id="telehealthOption" className="bg-white">
                                    <SelectValue placeholder="Select Platform" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="zoom">Zoom Healthcare</SelectItem>
                                    <SelectItem value="doxy">Doxy.me</SelectItem>
                                    <SelectItem value="phone">Telephone Only</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="personLocation">Patient Location (at time of visit)</Label>
                            <Select
                                value={data.personLocation}
                                onValueChange={(value) => handleChange('personLocation', value)}
                            >
                                <SelectTrigger id="personLocation" className="bg-white">
                                    <SelectValue placeholder="Select Patient Location" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="home">Home</SelectItem>
                                    <SelectItem value="work">Work</SelectItem>
                                    <SelectItem value="other">Other Private Location</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};
