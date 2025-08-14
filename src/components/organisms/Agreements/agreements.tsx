import React, { useState } from 'react'
import { 
  DocumentCheckIcon,
  PlusIcon,
  PencilIcon,
  TrashIcon,
  CheckIcon,
  XMarkIcon,
  InformationCircleIcon
} from '@heroicons/react/24/outline'
import { Button } from '@/components/atoms/Button'
import { Textarea } from '@/components/atoms/Textarea'
import { Label } from '@/components/atoms/Label'

interface AgreementsProps {
  className?: string
}

interface Agreement {
  id: string
  content: string
  createdAt: Date
  isActive: boolean
}

/**
 * Agreements Component
 * 
 * Allows users to create and manage plan agreements and content.
 * Focuses only on agreement content without acknowledgment text.
 */
const Agreements: React.FC<AgreementsProps> = ({ 
  className = '' 
}) => {
  // Sample data - in real app this would come from API
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

  const [isAddingNew, setIsAddingNew] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    content: ''
  })

  const handleStartAdd = () => {
    setFormData({ content: '' })
    setIsAddingNew(true)
    setEditingId(null)
  }

  const handleStartEdit = (agreement: Agreement) => {
    setFormData({
      content: agreement.content
    })
    setEditingId(agreement.id)
    setIsAddingNew(false)
  }

  const handleCancel = () => {
    setIsAddingNew(false)
    setEditingId(null)
    setFormData({ content: '' })
  }

  const handleSave = () => {
    if (!formData.content.trim()) {
      return // Basic validation
    }

    if (isAddingNew) {
      // Add new agreement
      const newAgreement: Agreement = {
        id: Date.now().toString(),
        content: formData.content.trim(),
        createdAt: new Date(),
        isActive: true
      }
      setAgreements([...agreements, newAgreement])
    } else if (editingId) {
      // Update existing agreement
      setAgreements(agreements.map(agreement => 
        agreement.id === editingId 
          ? { 
              ...agreement, 
              content: formData.content.trim()
            }
          : agreement
      ))
    }

    handleCancel()
  }

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this agreement? This action cannot be undone.')) {
      setAgreements(agreements.filter(agreement => agreement.id !== id))
    }
  }

  const toggleActive = (id: string) => {
    setAgreements(agreements.map(agreement => 
      agreement.id === id 
        ? { ...agreement, isActive: !agreement.isActive }
        : agreement
    ))
  }

  const isFormValid = formData.content.trim()

  return (
    <div className={`h-full flex flex-col bg-white ${className}`}>
      {/* Header */}
      <div className="p-3 border-b border-gray-200 bg-white">
        <div className="flex items-center gap-2">
          <div className="flex items-center justify-center w-6 h-6 bg-blue-100 rounded-md">
            <DocumentCheckIcon className="w-3 h-3 text-blue-600" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-gray-900">Agreements</h2>
            <p className="text-xs text-gray-500">Manage plan agreements content for patients</p>
          </div>
        </div>
      </div>

      {/* Content - Scrollable */}
      <div className="flex-1 overflow-auto p-3 pb-8">
        <div className="max-w-4xl space-y-4">
          
          {/* Add New Agreement Button */}
          {!isAddingNew && !editingId && (
            <div className="flex justify-between items-center">
              <h3 className="text-sm font-semibold text-gray-900">Current Agreements ({agreements.length})</h3>
              <Button 
                onClick={handleStartAdd}
                size="sm"
                className="flex items-center gap-2"
              >
                <PlusIcon className="w-4 h-4" />
                Add Agreement
              </Button>
            </div>
          )}

          {/* Add/Edit Form */}
          {(isAddingNew || editingId) && (
            <div className="bg-blue-50 rounded-lg border border-blue-200 p-4">
              <h4 className="text-sm font-semibold text-blue-900 mb-4 flex items-center gap-2">
                <DocumentCheckIcon className="w-4 h-4" />
                {isAddingNew ? 'Add New Agreement' : 'Edit Agreement'}
              </h4>
              
              <div className="space-y-4">
                {/* Agreement Content */}
                <div>
                  <Label htmlFor="content" className="text-xs font-medium text-gray-700">
                    Agreement Content *
                  </Label>
                  <Textarea
                    id="content"
                    value={formData.content}
                    onChange={(e) => setFormData({ ...formData, content: e.target.value })}
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
                    onClick={handleSave}
                    disabled={!isFormValid}
                    size="sm"
                    className="flex items-center gap-2"
                  >
                    <CheckIcon className="w-4 h-4" />
                    {isAddingNew ? 'Add Agreement' : 'Save Changes'}
                  </Button>
                  <Button 
                    onClick={handleCancel}
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
                    
                    {!isAddingNew && !editingId && (
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => toggleActive(agreement.id)}
                          className={`px-2 py-1 text-xs rounded transition-colors ${
                            agreement.isActive
                              ? 'bg-green-100 text-green-700 hover:bg-green-200'
                              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                          }`}
                        >
                          {agreement.isActive ? 'Active' : 'Inactive'}
                        </button>
                        <button
                          onClick={() => handleStartEdit(agreement)}
                          className="p-1 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
                          title="Edit agreement"
                        >
                          <PencilIcon className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(agreement.id)}
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

          {/* Empty State */}
          {agreements.length === 0 && !isAddingNew && (
            <div className="text-center py-8 bg-gray-50 rounded-lg border border-gray-200">
              <DocumentCheckIcon className="w-12 h-12 mx-auto text-gray-300 mb-3" />
              <h3 className="text-sm font-medium text-gray-900 mb-2">No Agreements Created</h3>
              <p className="text-xs text-gray-500 mb-4">
                Create your first agreement content for patient consent requirements.
              </p>
              <Button 
                onClick={handleStartAdd}
                size="sm"
                className="flex items-center gap-2 mx-auto"
              >
                <PlusIcon className="w-4 h-4" />
                Create First Agreement
              </Button>
            </div>
          )}

          {/* Info Section */}
          <div className="bg-blue-50 rounded-lg p-3 border border-blue-200">
            <div className="flex items-start gap-2">
              <InformationCircleIcon className="w-4 h-4 text-blue-600 mt-0.5" />
              <div>
                <p className="text-xs text-blue-800 font-medium">Agreement Guidelines</p>
                <p className="text-xs text-blue-700 mt-1">
                  • Agreements contain specific content that patients must review and accept
                  • Active agreements are presented during the treatment planning process
                  • Each agreement focuses on specific aspects of treatment consent
                  • All agreements are logged with timestamps for compliance tracking
                </p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}

export default Agreements