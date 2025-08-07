import React, { useState } from 'react'
import { 
  DocumentTextIcon, 
  Cog6ToothIcon, 
  BellIcon, 
  DocumentCheckIcon,
  ChevronRightIcon,
  PlusIcon,
  XMarkIcon,
  FunnelIcon,
  CheckIcon,
  MagnifyingGlassIcon
} from '@heroicons/react/24/outline'
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/atoms/Select'
import { Button } from '@/components/atoms/Button'
import { Input } from '@/components/atoms/Input'
import BasicPlanSettings from '@/components/organisms/BasicPlanSettings'
import NotificationSettings from '@/components/organisms/NotificationSettings'
import AcknowledgementsAgreements from '@/components/organisms/AcknowledgementsAgreements'

/**
 * Plan Settings Page Component
 * Global treatment plan configuration settings for all patients
 * This is a critical business feature for managing plan templates, workflows, and defaults
 */

// Available forms data
const availableForms = [
  { id: 1, name: '14-Day Treatment Plan', program: 'Treatment Planning', category: 'Assessment' },
  { id: 2, name: '24 Hour Incident Report', program: 'Incident Management', category: 'Documentation' },
  { id: 3, name: 'A&D and Mental Health Assessment', program: 'Assessment', category: 'Clinical' },
  { id: 4, name: 'A&D and Mental Health Assessment', program: 'Assessment', category: 'Clinical' },
  { id: 5, name: 'A&D Assessment', program: 'Assessment', category: 'Clinical' },
  { id: 6, name: 'A&D Assessment Update', program: 'Assessment', category: 'Clinical' },
  { id: 7, name: 'Admission Assessment', program: 'Admissions', category: 'Initial' },
  { id: 8, name: 'Discharge Planning Form', program: 'Discharge', category: 'Planning' },
  { id: 9, name: 'Daily Progress Note', program: 'Documentation', category: 'Progress' },
  { id: 10, name: 'Medication Administration Record', program: 'Medical', category: 'Documentation' },
  { id: 11, name: 'Therapy Session Notes', program: 'Therapy', category: 'Clinical' },
  { id: 12, name: 'Risk Assessment Form', program: 'Safety', category: 'Assessment' }
]

// Programs for filtering
const programs = [
  'All Programs',
  'Treatment Planning',
  'Incident Management', 
  'Assessment',
  'Admissions',
  'Discharge',
  'Documentation',
  'Medical',
  'Therapy',
  'Safety'
]

// Settings sections configuration
const settingsSections = [
  {
    id: 'forms',
    name: 'Forms to use in Progress Notes',
    icon: DocumentTextIcon,
    description: 'Configure default forms and templates for progress documentation'
  },
  {
    id: 'basic',
    name: 'Basic Plan Settings',
    icon: Cog6ToothIcon,
    description: 'Set organization-wide defaults for plan duration, objectives, and measures'
  },
  {
    id: 'notifications',
    name: 'Notification Settings',
    icon: BellIcon,
    description: 'Manage notification preferences for plan milestones and deadlines'
  },
  {
    id: 'acknowledgements-agreements',
    name: 'Acknowledgements & Agreements',
    icon: DocumentCheckIcon,
    description: 'Manage patient acknowledgements and agreement content'
  }
]

const PlanSettingsPage: React.FC = () => {
  const [activeSection, setActiveSection] = useState('forms')
  
  // Forms management state
  const [selectedForms, setSelectedForms] = useState<typeof availableForms>([
    availableForms[0], // Pre-select first form as example
    availableForms[2]  // Pre-select third form as example
  ])
  const [selectedProgram, setSelectedProgram] = useState('All Programs')
  const [searchTerm, setSearchTerm] = useState('')
  
  // Save functionality state
  const [isSaving, setIsSaving] = useState(false)
  const [lastSaved, setLastSaved] = useState<Date | null>(null)

  // Add form to selected forms
  const addForm = (form: typeof availableForms[0]) => {
    if (!selectedForms.find(f => f.id === form.id)) {
      setSelectedForms([...selectedForms, form])
    }
  }

  // Remove form from selected forms  
  const removeForm = (formId: number) => {
    setSelectedForms(selectedForms.filter(f => f.id !== formId))
  }

  // Filter available forms by program and search term
  const getFilteredForms = () => {
    let filtered = availableForms
    
    // Filter by program
    if (selectedProgram !== 'All Programs') {
      filtered = filtered.filter(form => form.program === selectedProgram)
    }
    
    // Filter by search term
    if (searchTerm.trim()) {
      const search = searchTerm.toLowerCase()
      filtered = filtered.filter(form => 
        form.name.toLowerCase().includes(search) ||
        form.program.toLowerCase().includes(search) ||
        form.category.toLowerCase().includes(search)
      )
    }
    
    return filtered
  }

  // Handle save all settings
  const handleSaveSettings = async () => {
    setIsSaving(true)
    try {
      // Simulate API call to save all settings
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      // In a real implementation, this would save:
      // - Selected forms for progress notes
      // - Basic plan settings from BasicPlanSettings component
      // - Notification settings
      // - Acknowledgments and agreements settings
      
      console.log('Saving Plan Settings:', {
        activeSection,
        selectedForms: selectedForms.map(f => f.id),
        selectedProgram,
        timestamp: new Date().toISOString()
      })
      
      setLastSaved(new Date())
      // You could add a toast notification here for success feedback
    } catch (error) {
      console.error('Error saving plan settings:', error)
      // You could add error handling/toast notification here
    } finally {
      setIsSaving(false)
    }
  }

  // Render Forms section content
  const renderFormsContent = () => {
    const filteredForms = getFilteredForms()
    const availableFormsToShow = filteredForms.filter(form => 
      !selectedForms.find(selected => selected.id === form.id)
    )

    return (
      <div className="h-full flex flex-col">
        {/* Compact Section Header */}
        <div className="p-3 border-b border-gray-200 bg-white">
          <div className="flex items-center gap-2">
            <div className="flex items-center justify-center w-6 h-6 bg-blue-100 rounded-md">
              <DocumentTextIcon className="w-3 h-3 text-blue-600" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-gray-900">Forms to use in Progress Notes</h2>
              <p className="text-xs text-gray-500">Configure default forms and templates for progress documentation</p>
            </div>
          </div>
        </div>

        {/* Dual Panel Layout */}
        <div className="flex-1 flex overflow-hidden">
          {/* Left Panel - Available Forms */}
          <div className="w-1/2 border-r border-gray-200 flex flex-col bg-white">
            {/* Available Forms Header with Program Filter */}
            <div className="p-2 border-b border-gray-200 bg-gray-50">
              <div className="flex items-center justify-between mb-2">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-gray-900 text-xs">Available Forms</h3>
                    <div className="flex items-center gap-1">
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {availableFormsToShow.length}
                      </span>
                      <span className="text-xs text-gray-400">/</span>
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
                        {filteredForms.length}
                      </span>
                    </div>
                  </div>
                  <p className="text-xs text-gray-500">Click + to add forms to progress notes</p>
                </div>
              </div>
              
              {/* Search and Filter Controls */}
              <div className="flex items-center gap-2">
                <MagnifyingGlassIcon className="w-4 h-4 text-gray-500" />
                <div className="relative flex-1">
                  <Input
                    type="text"
                    placeholder="Search forms by name, program, or category..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Escape') {
                        setSearchTerm('')
                      }
                    }}
                    className="h-8 text-xs pr-8"
                  />
                  {searchTerm && (
                    <button
                      onClick={() => setSearchTerm('')}
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      <XMarkIcon className="w-3 h-3" />
                    </button>
                  )}
                </div>
                <FunnelIcon className="w-4 h-4 text-gray-500" />
                <Select value={selectedProgram} onValueChange={setSelectedProgram}>
                  <SelectTrigger className="w-48 h-8 text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {programs.map(program => (
                      <SelectItem key={program} value={program} className="text-xs">
                        {program}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="flex-1 overflow-auto p-2 pb-6">
              <div className="space-y-2">
                {availableFormsToShow.map(form => (
                  <div 
                    key={form.id} 
                    className="flex items-center justify-between p-2 bg-gray-50 rounded-lg border border-gray-200 hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex-1">
                      <p className="font-medium text-gray-900 text-sm">{form.name}</p>
                      <div className="flex items-center gap-1 mt-1">
                        <span className="text-xs px-2 py-0.5 bg-blue-100 text-blue-700 rounded-full">
                          {form.program}
                        </span>
                        <span className="text-xs px-2 py-0.5 bg-gray-100 text-gray-600 rounded-full">
                          {form.category}
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={() => addForm(form)}
                      className="flex items-center justify-center w-7 h-7 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors ml-2"
                      title="Add form"
                    >
                      <PlusIcon className="w-3 h-3" />
                    </button>
                  </div>
                ))}
                
                {availableFormsToShow.length === 0 && (
                  <div className="text-center py-6 text-gray-500">
                    <DocumentTextIcon className="w-10 h-10 mx-auto mb-2 text-gray-300" />
                    <p className="text-xs">
                      {searchTerm.trim() 
                        ? `No forms found matching "${searchTerm}"`
                        : selectedProgram === 'All Programs' 
                          ? 'All available forms have been added' 
                          : `No more forms available for ${selectedProgram}`
                      }
                    </p>
                    {searchTerm.trim() && (
                      <button
                        onClick={() => setSearchTerm('')}
                        className="text-xs text-blue-600 hover:text-blue-800 mt-2 underline"
                      >
                        Clear search
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

                      {/* Right Panel - Selected Forms */}
            <div className="w-1/2 flex flex-col bg-white">
              <div className="p-2 border-b border-gray-200 bg-blue-50">
                <h3 className="font-semibold text-gray-900 text-xs">Selected Forms for Progress Notes</h3>
                <p className="text-xs text-gray-500">
                  {selectedForms.length} form{selectedForms.length !== 1 ? 's' : ''} selected
                </p>
              </div>
              
              <div className="flex-1 overflow-auto p-2 pb-6">
                <div className="space-y-2">
                {selectedForms.map(form => (
                  <div 
                    key={form.id} 
                    className="flex items-center justify-between p-2 bg-blue-50 rounded-lg border border-blue-200"
                  >
                    <div className="flex-1">
                      <p className="font-medium text-gray-900 text-sm">{form.name}</p>
                      <div className="flex items-center gap-1 mt-1">
                        <span className="text-xs px-2 py-0.5 bg-blue-100 text-blue-700 rounded-full">
                          {form.program}
                        </span>
                        <span className="text-xs px-2 py-0.5 bg-gray-100 text-gray-600 rounded-full">
                          {form.category}
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={() => removeForm(form.id)}
                      className="flex items-center justify-center w-7 h-7 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors ml-2"
                      title="Remove form"
                    >
                      <XMarkIcon className="w-3 h-3" />
                    </button>
                  </div>
                ))}
                
                {selectedForms.length === 0 && (
                  <div className="text-center py-6 text-gray-500">
                    <DocumentTextIcon className="w-10 h-10 mx-auto mb-2 text-gray-300" />
                    <p className="text-xs">No forms selected for progress notes</p>
                    <p className="text-xs mt-1">Add forms from the left panel</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Render content for the selected section
  const renderSectionContent = () => {
    const section = settingsSections.find(s => s.id === activeSection)
    if (!section) return null

    // Special handling for forms section
    if (activeSection === 'forms') {
      return renderFormsContent()
    }

    // Special handling for basic plan settings section
    if (activeSection === 'basic') {
      return <BasicPlanSettings />
    }

    // Special handling for notification settings section
    if (activeSection === 'notifications') {
      return <NotificationSettings />
    }

    // Special handling for acknowledgements & agreements section
    if (activeSection === 'acknowledgements-agreements') {
      return <AcknowledgementsAgreements />
    }

    // Default content for other sections
    return (
      <div className="p-4 pb-8">
        {/* Compact Section Header */}
        <div className="mb-4">
          <div className="flex items-center gap-2 mb-3">
            <div className="flex items-center justify-center w-6 h-6 bg-blue-100 rounded-md">
              <section.icon className="w-3 h-3 text-blue-600" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-gray-900">{section.name}</h2>
              <p className="text-xs text-gray-500">{section.description}</p>
            </div>
          </div>
        </div>

        {/* Compact Coming Soon Content */}
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full flex items-center justify-center mb-4">
            <section.icon className="w-6 h-6 text-blue-600" />
          </div>
          
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            {section.name}
          </h3>
          
          <p className="text-gray-600 mb-4 max-w-md text-sm">
            {section.description}
          </p>
          
          <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
              <span className="text-blue-800 font-medium text-sm">Coming Today!</span>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="h-full bg-gray-50 p-4 pb-24">
      {/* Main Container with Border */}
      <div className="h-full max-w-7xl mx-auto bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
        <div className="flex h-full">
          {/* Left Navigation Sidebar */}
          <div className="w-72 bg-zinc-50 border-r border-gray-200 flex flex-col">
            {/* Header */}
            <div className="p-3 border-b border-gray-200 bg-white">
              <div className="flex items-center gap-2">
                <div className="flex items-center justify-center w-6 h-6 bg-blue-100 rounded-md">
                  <Cog6ToothIcon className="w-3 h-3 text-blue-600" />
                </div>
                <div>
                  <h1 className="text-sm font-semibold text-gray-900">Plan Settings</h1>
                  <p className="text-xs text-gray-500">Global Configuration</p>
                </div>
              </div>
            </div>

            {/* Navigation Menu */}
            <div className="flex-1 p-3">
              <nav className="space-y-2">
                {settingsSections.map((section) => {
                  const Icon = section.icon
                  const isActive = activeSection === section.id
                  
                  return (
                    <button
                      key={section.id}
                      onClick={() => setActiveSection(section.id)}
                      className={`w-full flex items-center justify-between p-3 rounded-lg text-left transition-all duration-200 group ${
                        isActive
                          ? 'bg-blue-50 border border-blue-200 text-blue-900 shadow-sm'
                          : 'hover:bg-white hover:shadow-sm border border-transparent text-gray-700 hover:text-gray-900'
                      }`}
                    >
                      <div className="flex items-center gap-2 flex-1">
                        <div className={`flex items-center justify-center w-6 h-6 rounded-md transition-colors ${
                          isActive 
                            ? 'bg-blue-100 text-blue-600' 
                            : 'bg-gray-100 text-gray-500 group-hover:bg-gray-200'
                        }`}>
                          <Icon className="w-3 h-3" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className={`font-medium text-xs leading-tight ${
                            isActive ? 'text-blue-900' : 'text-gray-900'
                          }`}>
                            {section.name}
                          </p>
                        </div>
                      </div>
                      <ChevronRightIcon className={`w-3 h-3 transition-colors ${
                        isActive ? 'text-blue-600' : 'text-gray-400 group-hover:text-gray-600'
                      }`} />
                    </button>
                  )
                })}
              </nav>
            </div>

            {/* Footer Info */}
            <div className="p-2 border-t border-gray-200 bg-zinc-50">
              <div className="text-xs text-gray-500 text-center">
                <p>Critical business settings</p>
                <p className="mt-0.5">Secure access required</p>
              </div>
            </div>
          </div>

          {/* Right Content Area */}
          <div className="flex-1 overflow-auto">
            {renderSectionContent()}
          </div>
        </div>
      </div>
      
      {/* Sticky Save Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-6 py-4 shadow-lg z-50">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            {lastSaved && (
              <div className="text-sm text-gray-600">
                Last saved: {lastSaved.toLocaleTimeString()}
              </div>
            )}
          </div>
          
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              onClick={() => {
                // Reset to defaults or cancel changes
                console.log('Cancel changes')
              }}
              disabled={isSaving}
            >
              Cancel Changes
            </Button>
            
            <Button
              onClick={handleSaveSettings}
              disabled={isSaving}
              className="flex items-center gap-2 min-w-[120px]"
            >
              {isSaving ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Saving...
                </>
              ) : (
                <>
                  <CheckIcon className="w-4 h-4" />
                  Save Settings
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PlanSettingsPage