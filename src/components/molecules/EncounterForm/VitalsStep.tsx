import React from 'react';
import { Label } from '@/components/atoms/Label/label';
import { Input } from '@/components/atoms/Input/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/atoms/Select/select';

interface VitalsStepProps {
  data: any;
  updateData: (data: any) => void;
}

export const VitalsStep: React.FC<VitalsStepProps> = ({ data, updateData }) => {
  const handleVitalChange = (field: string, value: string) => {
    const updatedVitals = {
      ...data.vitals,
      [field]: value,
    };

    // Auto-calculate BMI if height and weight are present
    if (field === 'weight' || field === 'height') {
      const weight = field === 'weight' ? parseFloat(value) : parseFloat(updatedVitals.weight || '0');
      const height = field === 'height' ? parseFloat(value) : parseFloat(updatedVitals.height || '0');
      
      if (weight > 0 && height > 0) {
        // BMI = weight (kg) / (height (m))^2
        // Convert height from cm to m
        const heightInMeters = height / 100;
        const bmi = weight / (heightInMeters * heightInMeters);
        updatedVitals.bmi = bmi.toFixed(1);
      }
    }

    updateData({
      ...data,
      vitals: updatedVitals,
    });
  };

  return (
    <div className="space-y-6">
      <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Blood Pressure */}
          <div className="space-y-2">
            <Label htmlFor="bloodPressure" className="text-sm font-medium text-gray-700">
              Blood Pressure <span className="text-red-500">*</span>
            </Label>
            <div className="flex items-center gap-2">
              <Input
                id="bloodPressureSystolic"
                type="number"
                placeholder="120"
                value={data.vitals?.bloodPressureSystolic || ''}
                onChange={(e) => handleVitalChange('bloodPressureSystolic', e.target.value)}
                className="text-sm"
              />
              <span className="text-gray-500">/</span>
              <Input
                id="bloodPressureDiastolic"
                type="number"
                placeholder="80"
                value={data.vitals?.bloodPressureDiastolic || ''}
                onChange={(e) => handleVitalChange('bloodPressureDiastolic', e.target.value)}
                className="text-sm"
              />
            </div>
            <p className="text-xs text-gray-500">mmHg (Systolic/Diastolic)</p>
          </div>

          {/* Heart Rate */}
          <div className="space-y-2">
            <Label htmlFor="heartRate" className="text-sm font-medium text-gray-700">
              Heart Rate <span className="text-red-500">*</span>
            </Label>
            <Input
              id="heartRate"
              type="number"
              placeholder="72"
              value={data.vitals?.heartRate || ''}
              onChange={(e) => handleVitalChange('heartRate', e.target.value)}
              className="text-sm"
            />
            <p className="text-xs text-gray-500">BPM</p>
          </div>

          {/* Temperature */}
          <div className="space-y-2">
            <Label htmlFor="temperature" className="text-sm font-medium text-gray-700">
              Temperature <span className="text-red-500">*</span>
            </Label>
            <div className="flex gap-2">
              <Input
                id="temperature"
                type="number"
                step="0.1"
                placeholder="98.6"
                value={data.vitals?.temperature || ''}
                onChange={(e) => handleVitalChange('temperature', e.target.value)}
                className="text-sm flex-1"
              />
              <Select
                value={data.vitals?.temperatureUnit || 'F'}
                onValueChange={(value) => handleVitalChange('temperatureUnit', value)}
              >
                <SelectTrigger className="w-20 text-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="F">°F</SelectItem>
                  <SelectItem value="C">°C</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Respiratory Rate */}
          <div className="space-y-2">
            <Label htmlFor="respiratoryRate" className="text-sm font-medium text-gray-700">
              Respiratory Rate
            </Label>
            <Input
              id="respiratoryRate"
              type="number"
              placeholder="16"
              value={data.vitals?.respiratoryRate || ''}
              onChange={(e) => handleVitalChange('respiratoryRate', e.target.value)}
              className="text-sm"
            />
            <p className="text-xs text-gray-500">breaths/min</p>
          </div>

          {/* Oxygen Saturation */}
          <div className="space-y-2">
            <Label htmlFor="oxygenSaturation" className="text-sm font-medium text-gray-700">
              Oxygen Saturation (SpO2)
            </Label>
            <Input
              id="oxygenSaturation"
              type="number"
              placeholder="98"
              value={data.vitals?.oxygenSaturation || ''}
              onChange={(e) => handleVitalChange('oxygenSaturation', e.target.value)}
              className="text-sm"
            />
            <p className="text-xs text-gray-500">%</p>
          </div>

          {/* Weight */}
          <div className="space-y-2">
            <Label htmlFor="weight" className="text-sm font-medium text-gray-700">
              Weight
            </Label>
            <div className="flex gap-2">
              <Input
                id="weight"
                type="number"
                step="0.1"
                placeholder="70"
                value={data.vitals?.weight || ''}
                onChange={(e) => handleVitalChange('weight', e.target.value)}
                className="text-sm flex-1"
              />
              <Select
                value={data.vitals?.weightUnit || 'kg'}
                onValueChange={(value) => handleVitalChange('weightUnit', value)}
              >
                <SelectTrigger className="w-20 text-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="kg">kg</SelectItem>
                  <SelectItem value="lbs">lbs</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Height */}
          <div className="space-y-2">
            <Label htmlFor="height" className="text-sm font-medium text-gray-700">
              Height
            </Label>
            <div className="flex gap-2">
              <Input
                id="height"
                type="number"
                step="0.1"
                placeholder="170"
                value={data.vitals?.height || ''}
                onChange={(e) => handleVitalChange('height', e.target.value)}
                className="text-sm flex-1"
              />
              <Select
                value={data.vitals?.heightUnit || 'cm'}
                onValueChange={(value) => handleVitalChange('heightUnit', value)}
              >
                <SelectTrigger className="w-20 text-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="cm">cm</SelectItem>
                  <SelectItem value="in">in</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* BMI (Auto-calculated) */}
          <div className="space-y-2">
            <Label htmlFor="bmi" className="text-sm font-medium text-gray-700">
              BMI (Auto-calculated)
            </Label>
            <Input
              id="bmi"
              type="text"
              value={data.vitals?.bmi || ''}
              readOnly
              className="text-sm bg-gray-50"
              placeholder="--"
            />
            <p className="text-xs text-gray-500">kg/m²</p>
          </div>

          {/* Pain Scale */}
          <div className="space-y-2">
            <Label htmlFor="painScale" className="text-sm font-medium text-gray-700">
              Pain Scale
            </Label>
            <Select
              value={data.vitals?.painScale || ''}
              onValueChange={(value) => handleVitalChange('painScale', value)}
            >
              <SelectTrigger className="text-sm">
                <SelectValue placeholder="Select pain level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="0">0 - No Pain</SelectItem>
                <SelectItem value="1">1</SelectItem>
                <SelectItem value="2">2</SelectItem>
                <SelectItem value="3">3 - Mild</SelectItem>
                <SelectItem value="4">4</SelectItem>
                <SelectItem value="5">5 - Moderate</SelectItem>
                <SelectItem value="6">6</SelectItem>
                <SelectItem value="7">7 - Severe</SelectItem>
                <SelectItem value="8">8</SelectItem>
                <SelectItem value="9">9</SelectItem>
                <SelectItem value="10">10 - Worst Possible</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Additional Notes */}
      <div className="space-y-2">
        <Label htmlFor="vitalsNotes" className="text-sm font-medium text-gray-700">
          Additional Notes
        </Label>
        <textarea
          id="vitalsNotes"
          rows={3}
          placeholder="Any additional observations or notes about the vitals..."
          value={data.vitals?.notes || ''}
          onChange={(e) => handleVitalChange('notes', e.target.value)}
          className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50"
        />
      </div>

      <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
        <p className="text-xs text-amber-800">
          <strong>Tip:</strong> Fields marked with <span className="text-red-500">*</span> are commonly required. Ensure accurate measurements for proper clinical documentation.
        </p>
      </div>
    </div>
  );
};
