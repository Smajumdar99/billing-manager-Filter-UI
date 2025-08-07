import React, { useState } from 'react'
import { 
  DocumentTextIcon,
  DocumentCheckIcon,
  PlusIcon,
  PencilIcon,
  TrashIcon,
  CheckIcon,
  XMarkIcon,
  InformationCircleIcon
} from '@heroicons/react/24/outline'
import { Button } from '@/components/atoms/Button'
import { Input } from '@/components/atoms/Input'
import { Textarea } from '@/components/atoms/Textarea'
import { Label } from '@/components/atoms/Label'

interface AcknowledgementsAgreementsProps {
  className?: string
}

interface Acknowledgement {
  id: string
  title: string
  content: string
  testament: string
  createdAt: Date
  isActive: boolean
}

interface Agreement {
  id: string
  content: string
  createdAt: Date
  isActive: boolean
}

/**
 * Combined Acknowledgements & Agreements Component
 * 
 * Manages both patient acknowledgements (title, content, testament) 
 * and agreements (content only) in a single tabbed interface.
 */
const AcknowledgementsAgreements: React.FC<AcknowledgementsAgreementsProps> = ({ 
  className = '' 
}) => {
  const [activeTab, setActiveTab] = useState<'acknowledgements' | 'agreements'>('acknowledgements')

  // Single Acknowledgement State
  const [acknowledgement, setAcknowledgement] = useState<Acknowledgement>({
    id: '1',
    title: 'Treatment Plan Acknowledgement',
    content: 'I have been provided with information about my treatment plan, including the goals, objectives, and expected outcomes. I understand the treatment modalities that may be used and the potential risks and benefits.',
    testament: 'I acknowledge that I have received, reviewed, and understand the treatment plan information provided to me.',
    createdAt: new Date('2024-01-15'),
    isActive: true
  })

  const [isEditingAcknowledgement, setIsEditingAcknowledgement] = useState(false)
  const [acknowledgementFormData, setAcknowledgementFormData] = useState({
    title: acknowledgement.title,
    content: acknowledgement.content,
    testament: acknowledgement.testament
  })

  // Agreements State
  const [agreements, setAgreements] = useState<Agreement[]>([
    {
      id: '1',
      content: 'I understand and agree to participate in the treatment planning process. I acknowledge that my treatment plan will be developed collaboratively with my care team and may include various therapeutic interventions, medications, and support services.',
      createdAt: new Date('2024-01-15'),
      isActive: true
    },
    {
      id: '2', 
      content: 'I understand that my personal health information will be kept confidential in accordance with HIPAA regulations. Information may only be shared with authorized members of my care team or as required by law.',
      createdAt: new Date('2024-01-10'),
      isActive: true
    }
  ])

  const [isAddingAgreement, setIsAddingAgreement] = useState(false)
  const [editingAgreementId, setEditingAgreementId] = useState<string | null>(null)
  const [agreementFormData, setAgreementFormData] = useState({
    content: ''
  })

  // Acknowledgement Handlers
  const handleStartEditAcknowledgement = () => {
    setAcknowledgementFormData({
      title: acknowledgement.title,
      content: acknowledgement.content,
      testament: acknowledgement.testament
    })
    setIsEditingAcknowledgement(true)
  }

  const handleCancelAcknowledgement = () => {
    setIsEditingAcknowledgement(false)
    setAcknowledgementFormData({
      title: acknowledgement.title,
      content: acknowledgement.content,
      testament: acknowledgement.testament
    })
  }

  const handleSaveAcknowledgement = () => {
    if (!acknowledgementFormData.title.trim() || !acknowledgementFormData.content.trim() || !acknowledgementFormData.testament.trim()) {
      return
    }

    setAcknowledgement({
      ...acknowledgement,
      title: acknowledgementFormData.title.trim(),
      content: acknowledgementFormData.content.trim(),
      testament: acknowledgementFormData.testament.trim()
    })

    setIsEditingAcknowledgement(false)
  }

  const toggleAcknowledgementActive = () => {
    setAcknowledgement({
      ...acknowledgement,
      isActive: !acknowledgement.isActive
    })
  }

  // Agreement Handlers
  const handleStartAddAgreement = () => {
    setAgreementFormData({ content: '' })
    setIsAddingAgreement(true)
    setEditingAgreementId(null)
  }

  const handleStartEditAgreement = (agreement: Agreement) => {
    setAgreementFormData({
      content: agreement.content
    })
    setEditingAgreementId(agreement.id)
    setIsAddingAgreement(false)
  }

  const handleCancelAgreement = () => {
    setIsAddingAgreement(false)
    setEditingAgreementId(null)
    setAgreementFormData({ content: '' })
  }

  const handleSaveAgreement = () => {
    if (!agreementFormData.content.trim()) {
      return
    }

    if (isAddingAgreement) {
      const newAgreement: Agreement = {
        id: Date.now().toString(),
        content: agreementFormData.content.trim(),
        createdAt: new Date(),
        isActive: true
      }
      setAgreements([...agreements, newAgreement])
    } else if (editingAgreementId) {
      setAgreements(agreements.map(agreement => 
        agreement.id === editingAgreementId 
          ? { 
              ...agreement, 
              content: agreementFormData.content.trim()
            }
          : agreement
      ))
    }

    handleCancelAgreement()
  }

  const handleDeleteAgreement = (id: string) => {
    if (window.confirm('Are you sure you want to delete this agreement? This action cannot be undone.')) {
      setAgreements(agreements.filter(agreement => agreement.id !== id))
    }
  }

  const toggleAgreementActive = (id: string) => {
    setAgreements(agreements.map(agreement => 
      agreement.id === id 
        ? { ...agreement, isActive: !agreement.isActive }
        : agreement
    ))
  }

  const isAcknowledgementFormValid = acknowledgementFormData.title.trim() && acknowledgementFormData.content.trim() && acknowledgementFormData.testament.trim()
  const isAgreementFormValid = agreementFormData.content.trim()

  return (
    <div className={`h-full flex flex-col bg-white ${className}`}>
      {/* Header */}
      <div className="p-3 border-b border-gray-200 bg-white">
        <div className="flex items-center gap-2">
          <div className="flex items-center justify-center w-6 h-6 bg-blue-100 rounded-md">
            <DocumentCheckIcon className="w-3 h-3 text-blue-600" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-gray-900">Acknowledgements & Agreements</h2>
            <p className="text-xs text-gray-500">Manage patient acknowledgements and agreement content</p>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-gray-200 bg-white px-3">
        <div className="flex space-x-8">
          <button
            onClick={() => setActiveTab('acknowledgements')}
            className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
              activeTab === 'acknowledgements'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <div className="flex items-center gap-2">
              <DocumentTextIcon className="w-4 h-4" />
              Acknowledgement
            </div>
          </button>
          <button
            onClick={() => setActiveTab('agreements')}
            className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
              activeTab === 'agreements'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <div className="flex items-center gap-2">
              <DocumentCheckIcon className="w-4 h-4" />
              Agreements ({agreements.length})
            </div>
          </button>
        </div>
      </div>

      {/* Content - Scrollable */}
      <div className="flex-1 overflow-auto p-3 pb-8">
        <div className="max-w-4xl space-y-4">
          
          {activeTab === 'acknowledgements' && (
            <>
              {/* Acknowledgement Section Header */}
              {!isEditingAcknowledgement && (
                <div className="flex justify-between items-center">
                  <h3 className="text-sm font-semibold text-gray-900">Patient Acknowledgement</h3>
                  <Button 
                    onClick={handleStartEditAcknowledgement}
                    size="sm"
                    className="flex items-center gap-2"
                  >
                    <PencilIcon className="w-4 h-4" />
                    Edit Acknowledgement
                  </Button>
                </div>
              )}

              {/* Edit Acknowledgement Form */}
              {isEditingAcknowledgement && (
                <div className="bg-blue-50 rounded-lg border border-blue-200 p-4">
                  <h4 className="text-sm font-semibold text-blue-900 mb-4 flex items-center gap-2">
                    <DocumentTextIcon className="w-4 h-4" />
                    Edit Acknowledgement
                  </h4>
                  
                  <div className="space-y-4">
                    {/* Acknowledgement Title */}
                    <div>
                      <Label htmlFor="ack-title" className="text-xs font-medium text-gray-700">
                        Acknowledgement Title *
                      </Label>
                      <Input
                        id="ack-title"
                        value={acknowledgementFormData.title}
                        onChange={(e) => setAcknowledgementFormData({ ...acknowledgementFormData, title: e.target.value })}
                        placeholder="e.g., Treatment Plan Review, Rights and Responsibilities..."
                        className="mt-1"
                      />
                    </div>

                    {/* Acknowledgement Content */}
                    <div>
                      <Label htmlFor="ack-content" className="text-xs font-medium text-gray-700">
                        Acknowledgement Content *
                      </Label>
                      <Textarea
                        id="ack-content"
                        value={acknowledgementFormData.content}
                        onChange={(e) => setAcknowledgementFormData({ ...acknowledgementFormData, content: e.target.value })}
                        placeholder="Enter the detailed content that patients need to acknowledge..."
                        rows={5}
                        className="mt-1 resize-none"
                      />
                    </div>

                    {/* Testament */}
                    <div>
                      <Label htmlFor="ack-testament" className="text-xs font-medium text-gray-700">
                        Testament *
                      </Label>
                      <Textarea
                        id="ack-testament"
                        value={acknowledgementFormData.testament}
                        onChange={(e) => setAcknowledgementFormData({ ...acknowledgementFormData, testament: e.target.value })}
                        placeholder="Enter the testament statement that patients will acknowledge..."
                        rows={3}
                        className="mt-1 resize-none"
                      />
                    </div>

                    {/* Form Actions */}
                    <div className="flex items-center gap-2 pt-2">
                      <Button 
                        onClick={handleSaveAcknowledgement}
                        disabled={!isAcknowledgementFormValid}
                        size="sm"
                        className="flex items-center gap-2"
                      >
                        <CheckIcon className="w-4 h-4" />
                        Save Changes
                      </Button>
                      <Button 
                        onClick={handleCancelAcknowledgement}
                        variant="outline"
                        size="sm"
                        className="flex items-center gap-2"
                      >
                        <XMarkIcon className="w-4 h-4" />
                        Cancel
                      </Button>
                    </div>
                  </div>
                </div>
              )}

              {/* Single Acknowledgement Display */}
              {!isEditingAcknowledgement && (
                <div 
                  className={`bg-white rounded-lg border p-4 ${
                    acknowledgement.isActive 
                      ? 'border-gray-200 shadow-sm' 
                      : 'border-gray-100 bg-gray-50 opacity-75'
                  }`}
                >
                  {/* Acknowledgement Header */}
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h4 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
                        {acknowledgement.title}
                        {!acknowledgement.isActive && (
                          <span className="text-xs px-2 py-0.5 bg-gray-200 text-gray-600 rounded-full">
                            Inactive
                          </span>
                        )}
                      </h4>
                      <p className="text-xs text-gray-500 mt-1">
                        Last updated: {acknowledgement.createdAt.toLocaleDateString()}
                      </p>
                    </div>
                    
                    <div className="flex items-center gap-1">
                      <button
                        onClick={toggleAcknowledgementActive}
                        className={`px-2 py-1 text-xs rounded transition-colors ${
                          acknowledgement.isActive
                            ? 'bg-green-100 text-green-700 hover:bg-green-200'
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                      >
                        {acknowledgement.isActive ? 'Active' : 'Inactive'}
                      </button>
                    </div>
                  </div>

                  {/* Acknowledgement Content */}
                  <div className="space-y-3">
                    <div>
                      <p className="text-xs font-medium text-gray-700 mb-1">Content:</p>
                      <p className="text-xs text-gray-600 bg-gray-50 p-3 rounded border">
                        {acknowledgement.content}
                      </p>
                    </div>
                    
                    <div>
                      <p className="text-xs font-medium text-gray-700 mb-1">Testament:</p>
                      <p className="text-xs text-gray-600 bg-blue-50 p-3 rounded border border-blue-200">
                        {acknowledgement.testament}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}

          {activeTab === 'agreements' && (
            <>
              {/* Add New Agreement Button */}
              {!isAddingAgreement && !editingAgreementId && (
                <div className="flex justify-between items-center">
                  <h3 className="text-sm font-semibold text-gray-900">Current Agreements ({agreements.length})</h3>
                  <Button 
                    onClick={handleStartAddAgreement}
                    size="sm"
                    className="flex items-center gap-2"
                  >
                    <PlusIcon className="w-4 h-4" />
                    Add Agreement
                  </Button>
                </div>
              )}

              {/* Add/Edit Agreement Form */}
              {(isAddingAgreement || editingAgreementId) && (
                <div className="bg-blue-50 rounded-lg border border-blue-200 p-4">
                  <h4 className="text-sm font-semibold text-blue-900 mb-4 flex items-center gap-2">
                    <DocumentCheckIcon className="w-4 h-4" />
                    {isAddingAgreement ? 'Add New Agreement' : 'Edit Agreement'}
                  </h4>
                  
                  <div className="space-y-4">
                    {/* Agreement Content */}
                    <div>
                      <Label htmlFor="agr-content" className="text-xs font-medium text-gray-700">
                        Agreement Content *
                      </Label>
                      <Textarea
                        id="agr-content"
                        value={agreementFormData.content}
                        onChange={(e) => setAgreementFormData({ ...agreementFormData, content: e.target.value })}
                        placeholder="Enter the full text of the agreement that patients will need to review and understand..."
                        rows={8}
                        className="mt-1 resize-none"
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        This content will be presented to patients for review and agreement.
                      </p>
                    </div>

                    {/* Form Actions */}
                    <div className="flex items-center gap-2 pt-2">
                      <Button 
                        onClick={handleSaveAgreement}
                        disabled={!isAgreementFormValid}
                        size="sm"
                        className="flex items-center gap-2"
                      >
                        <CheckIcon className="w-4 h-4" />
                        {isAddingAgreement ? 'Add Agreement' : 'Save Changes'}
                      </Button>
                      <Button 
                        onClick={handleCancelAgreement}
                        variant="outline"
                        size="sm"
                        className="flex items-center gap-2"
                      >
                        <XMarkIcon className="w-4 h-4" />
                        Cancel
                      </Button>
                    </div>
                  </div>
                </div>
              )}

              {/* Agreements List */}
              {agreements.length > 0 && (
                <div className="space-y-3">
                  {agreements.map(agreement => (
                    <div 
                      key={agreement.id}
                      className={`bg-white rounded-lg border p-4 ${
                        agreement.isActive 
                          ? 'border-gray-200 shadow-sm' 
                          : 'border-gray-100 bg-gray-50 opacity-75'
                      }`}
                    >
                      {/* Agreement Header */}
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <h4 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
                            Agreement #{agreement.id}
                            {!agreement.isActive && (
                              <span className="text-xs px-2 py-0.5 bg-gray-200 text-gray-600 rounded-full">
                                Inactive
                              </span>
                            )}
                          </h4>
                          <p className="text-xs text-gray-500 mt-1">
                            Created: {agreement.createdAt.toLocaleDateString()}
                          </p>
                        </div>
                        
                        {!isAddingAgreement && !editingAgreementId && (
                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => toggleAgreementActive(agreement.id)}
                              className={`px-2 py-1 text-xs rounded transition-colors ${
                                agreement.isActive
                                  ? 'bg-green-100 text-green-700 hover:bg-green-200'
                                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                              }`}
                            >
                              {agreement.isActive ? 'Active' : 'Inactive'}
                            </button>
                            <button
                              onClick={() => handleStartEditAgreement(agreement)}
                              className="p-1 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
                              title="Edit agreement"
                            >
                              <PencilIcon className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteAgreement(agreement.id)}
                              className="p-1 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                              title="Delete agreement"
                            >
                              <TrashIcon className="w-4 h-4" />
                            </button>
                          </div>
                        )}
                      </div>

                      {/* Agreement Content Preview */}
                      <div>
                        <p className="text-xs font-medium text-gray-700 mb-1">Agreement Content:</p>
                        <p className="text-xs text-gray-600 bg-gray-50 p-3 rounded border">
                          {agreement.content.length > 300 
                            ? `${agreement.content.substring(0, 300)}...` 
                            : agreement.content
                          }
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Agreements Empty State */}
              {agreements.length === 0 && !isAddingAgreement && (
                <div className="text-center py-8 bg-gray-50 rounded-lg border border-gray-200">
                  <DocumentCheckIcon className="w-12 h-12 mx-auto text-gray-300 mb-3" />
                  <h3 className="text-sm font-medium text-gray-900 mb-2">No Agreements Created</h3>
                  <p className="text-xs text-gray-500 mb-4">
                    Create your first agreement content for patient consent requirements.
                  </p>
                  <Button 
                    onClick={handleStartAddAgreement}
                    size="sm"
                    className="flex items-center gap-2 mx-auto"
                  >
                    <PlusIcon className="w-4 h-4" />
                    Create First Agreement
                  </Button>
                </div>
              )}
            </>
          )}

          {/* Info Section */}
          <div className="bg-blue-50 rounded-lg p-3 border border-blue-200">
            <div className="flex items-start gap-2">
              <InformationCircleIcon className="w-4 h-4 text-blue-600 mt-0.5" />
              <div>
                <p className="text-xs text-blue-800 font-medium">
                  {activeTab === 'acknowledgements' ? 'Acknowledgement Guidelines' : 'Agreement Guidelines'}
                </p>
                <p className="text-xs text-blue-700 mt-1">
                  {activeTab === 'acknowledgements' ? (
                    <>
                      • <strong>Single Acknowledgement:</strong> One acknowledgement that applies to all patients<br/>
                      • <strong>Title:</strong> Brief descriptive name for the acknowledgement<br/>
                      • <strong>Content:</strong> Detailed information that patients need to understand<br/>
                      • <strong>Testament:</strong> Formal statement that patients will acknowledge<br/>
                      • Active acknowledgement will be presented to patients during treatment planning
                    </>
                  ) : (
                    <>
                      • Agreements contain specific content that patients must review and accept<br/>
                      • Active agreements are presented during the treatment planning process<br/>
                      • Each agreement focuses on specific aspects of treatment consent<br/>
                      • All agreements are logged with timestamps for compliance tracking
                    </>
                  )}
                </p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}

export default AcknowledgementsAgreements
