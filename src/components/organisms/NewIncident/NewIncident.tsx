import React, { useState } from 'react'
import { 
  ExclamationCircleIcon, 
  CalendarIcon, 
  ClockIcon, 
  UserIcon,
  MapPinIcon,
  DocumentTextIcon,
  PhotoIcon,
  PaperClipIcon
} from '@heroicons/react/24/outline'
import { Button } from '@/components/atoms/Button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/atoms/Dialog'

/**
 * NewIncident Component
 * 
 * A comprehensive incident reporting form for healthcare facilities.
 * Allows staff to report and document various types of incidents including:
 * - Patient incidents (falls, medication errors, etc.)
 * - Safety incidents (equipment failures, hazards)
 * - Security incidents (unauthorized access, theft)
 * - Environmental incidents (spills, contamination)
 */

interface IncidentFormData {
  incidentType: string
  severity: string
  dateTime: string
  location: string
  involvedPersons: string[]
  description: string
  immediateActions: string
  witnessName: string
  witnessContact: string
  reporterName: string
  reporterRole: string
  attachments: File[]
}

interface NewIncidentProps {
  isOpen: boolean;
  onClose: () => void;
}

const NewIncident: React.FC<NewIncidentProps> = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState<IncidentFormData>({
    incidentType: '',
    severity: 'Low',
    dateTime: '',
    location: '',
    involvedPersons: [],
    description: '',
    immediateActions: '',
    witnessName: '',
    witnessContact: '',
    reporterName: '',
    reporterRole: '',
    attachments: []
  })

  const [isSubmitting, setIsSubmitting] = useState(false)

  // Incident types for healthcare facilities
  const incidentTypes = [
    'Patient Fall',
    'Medication Error',
    'Equipment Failure',
    'Security Breach',
    'Environmental Hazard',
    'Staff Injury',
    'Patient Complaint',
    'Infection Control',
    'Documentation Error',
    'Other'
  ]

  // Severity levels
  const severityLevels = [
    { value: 'Low', color: 'text-green-600 bg-green-50', description: 'Minor incident, no harm' },
    { value: 'Medium', color: 'text-yellow-600 bg-yellow-50', description: 'Moderate incident, potential harm' },
    { value: 'High', color: 'text-orange-600 bg-orange-50', description: 'Serious incident, harm occurred' },
    { value: 'Critical', color: 'text-red-600 bg-red-50', description: 'Critical incident, severe harm' }
  ]

  const handleInputChange = (field: keyof IncidentFormData, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // Simulate API call
      console.log('Submitting incident report:', formData)
      
      // Here you would typically send the data to your backend
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      alert('Incident report submitted successfully!')
      
      // Close modal and reset form
      onClose()
      
      // Reset form
      setFormData({
        incidentType: '',
        severity: 'Low',
        dateTime: '',
        location: '',
        involvedPersons: [],
        description: '',
        immediateActions: '',
        witnessName: '',
        witnessContact: '',
        reporterName: '',
        reporterRole: '',
        attachments: []
      })
    } catch (error) {
      console.error('Error submitting incident report:', error)
      alert('Error submitting incident report. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto p-6">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <ExclamationCircleIcon className="h-6 w-6 text-red-600" />
            New Incident Report
          </DialogTitle>
          <p className="text-gray-600 text-sm">
            Report any incidents, safety concerns, or unusual events that occur in the facility.
            All fields marked with * are required.
          </p>
        </DialogHeader>

        {/* Incident Report Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4 flex items-center gap-2">
              <DocumentTextIcon className="h-5 w-5 text-gray-500" />
              Basic Information
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Incident Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Incident Type *
                </label>
                <select
                  value={formData.incidentType}
                  onChange={(e) => handleInputChange('incidentType', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                >
                  <option value="">Select incident type...</option>
                  {incidentTypes.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>

              {/* Severity */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Severity Level *
                </label>
                <div className="space-y-2">
                  {severityLevels.map(level => (
                    <label key={level.value} className="flex items-center">
                      <input
                        type="radio"
                        name="severity"
                        value={level.value}
                        checked={formData.severity === level.value}
                        onChange={(e) => handleInputChange('severity', e.target.value)}
                        className="mr-3"
                      />
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${level.color}`}>
                        {level.value}
                      </span>
                      <span className="ml-2 text-sm text-gray-600">{level.description}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Date & Time */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Date & Time of Incident *
                </label>
                <div className="relative">
                  <CalendarIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="datetime-local"
                    value={formData.dateTime}
                    onChange={(e) => handleInputChange('dateTime', e.target.value)}
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
              </div>

              {/* Location */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Location *
                </label>
                <div className="relative">
                  <MapPinIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) => handleInputChange('location', e.target.value)}
                    placeholder="e.g., Room 205, Nursing Station A, Cafeteria"
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Incident Details */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Incident Details</h2>
            
            {/* Description */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Detailed Description *
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                placeholder="Provide a detailed description of what happened, including circumstances leading up to the incident..."
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            {/* Immediate Actions */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Immediate Actions Taken
              </label>
              <textarea
                value={formData.immediateActions}
                onChange={(e) => handleInputChange('immediateActions', e.target.value)}
                placeholder="Describe any immediate actions taken in response to the incident..."
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Reporter Information */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4 flex items-center gap-2">
              <UserIcon className="h-5 w-5 text-gray-500" />
              Reporter Information
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Reporter Name *
                </label>
                <input
                  type="text"
                  value={formData.reporterName}
                  onChange={(e) => handleInputChange('reporterName', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Role/Position *
                </label>
                <input
                  type="text"
                  value={formData.reporterRole}
                  onChange={(e) => handleInputChange('reporterRole', e.target.value)}
                  placeholder="e.g., Nurse, Doctor, Administrator"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Witness Name
                </label>
                <input
                  type="text"
                  value={formData.witnessName}
                  onChange={(e) => handleInputChange('witnessName', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Witness Contact
                </label>
                <input
                  type="text"
                  value={formData.witnessContact}
                  onChange={(e) => handleInputChange('witnessContact', e.target.value)}
                  placeholder="Phone or email"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-600">
                By submitting this report, you confirm that the information provided is accurate to the best of your knowledge.
              </p>
              <Button
                type="submit"
                variant="default"
                size="lg"
                disabled={isSubmitting}
                className="flex items-center gap-2 min-w-[140px]"
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Submitting...
                  </>
                ) : (
                  <>
                    <ExclamationCircleIcon className="h-4 w-4" />
                    Submit Report
                  </>
                )}
              </Button>
            </div>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export default NewIncident
