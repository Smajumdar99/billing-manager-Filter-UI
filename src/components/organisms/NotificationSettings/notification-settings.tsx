import React, { useState } from 'react'
import { 
  BellIcon,
  UserIcon,
  UserGroupIcon,
  Cog6ToothIcon,
  InformationCircleIcon
} from '@heroicons/react/24/outline'
import { Switch } from '@/components/atoms/Switch'
import { Checkbox } from '@/components/atoms/Checkbox'
import { MultiSelect, MultiSelectOption } from '@/components/atoms/MultiSelect'
import { RadioGroup, RadioGroupItem } from '@/components/atoms/RadioGroup'
import { Label } from '@/components/atoms/Label'

interface NotificationSettingsProps {
  className?: string
}

// Mock data for users and groups
const mockUsers = [
  { id: 'user1', name: 'Dr. Sarah Johnson', role: 'Primary Care Physician' },
  { id: 'user2', name: 'Nurse Thompson', role: 'Registered Nurse' },
  { id: 'user3', name: 'Dr. Michael Chen', role: 'Psychiatrist' },
  { id: 'user4', name: 'Lisa Rodriguez', role: 'Social Worker' },
  { id: 'user5', name: 'Admin User', role: 'Administrator' }
]

const mockGroups = [
  { id: 'group1', name: 'Medical Team', members: 8 },
  { id: 'group2', name: 'Nursing Staff', members: 12 },
  { id: 'group3', name: 'Administration', members: 5 },
  { id: 'group4', name: 'Mental Health Team', members: 6 },
  { id: 'group5', name: 'Case Managers', members: 4 }
]

const serviceCategories = [
  { id: 'admissions', name: 'Admissions & Intake', description: 'New patient admissions and intake processes' },
  { id: 'assessment', name: 'Assessments', description: 'Clinical assessments and evaluations' },
  { id: 'treatment', name: 'Treatment Planning', description: 'Treatment plan updates and milestones' },
  { id: 'documentation', name: 'Documentation', description: 'Progress notes and clinical documentation' },
  { id: 'discharge', name: 'Discharge Planning', description: 'Discharge planning and coordination' },
  { id: 'incidents', name: 'Incident Reports', description: 'Critical incidents and safety reports' },
  { id: 'medication', name: 'Medication Management', description: 'Medication orders and administration' },
  { id: 'appointments', name: 'Appointments', description: 'Appointment scheduling and changes' }
]

/**
 * NotificationSettings Component
 * 
 * Allows configuration of notification preferences for different service categories,
 * with options to notify specific users or groups.
 */
const NotificationSettings: React.FC<NotificationSettingsProps> = ({ 
  className = '' 
}) => {
  const [recipientType, setRecipientType] = useState<'users' | 'groups'>('users')
  const [selectedUsers, setSelectedUsers] = useState<string[]>([])
  const [selectedGroups, setSelectedGroups] = useState<string[]>([])

  // Convert mock data to MultiSelectOption format
  const userOptions: MultiSelectOption[] = mockUsers.map(user => ({
    value: user.id,
    label: user.name,
    description: user.role
  }))

  const groupOptions: MultiSelectOption[] = mockGroups.map(group => ({
    value: group.id,
    label: group.name,
    description: `${group.members} members`
  }))
  
  // Notification settings for each service category
  const [notificationSettings, setNotificationSettings] = useState<Record<string, {
    enabled: boolean
    email: boolean
    inApp: boolean
    whatsapp: boolean
    sms: boolean
    urgentOnly: boolean
  }>>(() => {
    const settings: Record<string, any> = {}
    serviceCategories.forEach(category => {
      settings[category.id] = {
        enabled: true,
        email: true,
        inApp: true,
        whatsapp: false,
        sms: false,
        urgentOnly: false
      }
    })
    return settings
  })



  const updateCategorySetting = (categoryId: string, setting: string, value: boolean) => {
    setNotificationSettings(prev => ({
      ...prev,
      [categoryId]: {
        ...prev[categoryId],
        [setting]: value
      }
    }))
  }



  return (
    <div className={`h-full flex flex-col bg-white ${className}`}>
      {/* Header */}
      <div className="p-3 border-b border-gray-200 bg-white">
        <div className="flex items-center gap-2">
          <div className="flex items-center justify-center w-6 h-6 bg-blue-100 rounded-md">
            <BellIcon className="w-3 h-3 text-blue-600" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-gray-900">Notification Settings</h2>
            <p className="text-xs text-gray-500">Configure notification preferences for service categories</p>
          </div>
        </div>
      </div>

      {/* Settings Content - Scrollable */}
      <div className="flex-1 overflow-auto p-3 pb-8">
        <div className="max-w-4xl space-y-4">
          
          {/* Recipient Selection Section */}
          <div className="bg-gray-50/80 rounded-lg p-4">
            <h3 className="text-sm font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <UserIcon className="w-4 h-4 text-blue-600" />
              Notification Recipients
            </h3>
            
            {/* User/Group Type Selection */}
            <div className="mb-4">
              <label className="text-xs font-medium text-gray-700 mb-2 block">Choose Recipient Type:</label>
              <RadioGroup 
                value={recipientType} 
                onValueChange={(value) => setRecipientType(value as 'users' | 'groups')}
                className="flex gap-6"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="users" id="users" />
                  <Label htmlFor="users" className="text-sm flex items-center gap-1">
                    <UserIcon className="w-4 h-4" />
                    Individual Users
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="groups" id="groups" />
                  <Label htmlFor="groups" className="text-sm flex items-center gap-1">
                    <UserGroupIcon className="w-4 h-4" />
                    User Groups
                  </Label>
                </div>
              </RadioGroup>
            </div>

            {/* User Selection */}
            {recipientType === 'users' && (
              <div className="space-y-3">
                <div>
                  <label className="text-xs font-medium text-gray-700 mb-2 block">Select Users:</label>
                  <MultiSelect
                    options={userOptions}
                    value={selectedUsers}
                    onChange={setSelectedUsers}
                    placeholder="Search and select users..."
                    maxHeight="180px"
                  />
                </div>
              </div>
            )}

            {/* Group Selection */}
            {recipientType === 'groups' && (
              <div className="space-y-3">
                <div>
                  <label className="text-xs font-medium text-gray-700 mb-2 block">Select Groups:</label>
                  <MultiSelect
                    options={groupOptions}
                    value={selectedGroups}
                    onChange={setSelectedGroups}
                    placeholder="Search and select groups..."
                    maxHeight="180px"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Service Categories Section */}
          <div className="bg-gray-50/80 rounded-lg p-4">
            <h3 className="text-sm font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Cog6ToothIcon className="w-4 h-4 text-green-600" />
              Service Categories
            </h3>
            
            <div className="space-y-4">
              {serviceCategories.map(category => (
                <div key={category.id} className="bg-white rounded-lg border border-gray-200 p-3">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <Switch
                          checked={notificationSettings[category.id]?.enabled}
                          onCheckedChange={(checked) => updateCategorySetting(category.id, 'enabled', checked)}
                        />
                        <h4 className="text-sm font-medium text-gray-900">{category.name}</h4>
                      </div>
                      <p className="text-xs text-gray-500 mt-1 ml-6">{category.description}</p>
                    </div>
                  </div>

                  {/* Notification Method Options */}
                  {notificationSettings[category.id]?.enabled && (
                    <div className="ml-6 space-y-2">
                      <div className="flex items-center gap-4 flex-wrap">
                        <div className="flex items-center gap-2">
                          <Checkbox
                            checked={notificationSettings[category.id]?.email}
                            onCheckedChange={(checked) => updateCategorySetting(category.id, 'email', !!checked)}
                          />
                          <span className="text-xs text-gray-700">Email</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Checkbox
                            checked={notificationSettings[category.id]?.inApp}
                            onCheckedChange={(checked) => updateCategorySetting(category.id, 'inApp', !!checked)}
                          />
                          <span className="text-xs text-gray-700">In-App</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Checkbox
                            checked={notificationSettings[category.id]?.whatsapp}
                            onCheckedChange={(checked) => updateCategorySetting(category.id, 'whatsapp', !!checked)}
                          />
                          <span className="text-xs text-gray-700">WhatsApp</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Checkbox
                            checked={notificationSettings[category.id]?.sms}
                            onCheckedChange={(checked) => updateCategorySetting(category.id, 'sms', !!checked)}
                          />
                          <span className="text-xs text-gray-700">SMS</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Checkbox
                          checked={notificationSettings[category.id]?.urgentOnly}
                          onCheckedChange={(checked) => updateCategorySetting(category.id, 'urgentOnly', !!checked)}
                        />
                        <span className="text-xs text-gray-700">Urgent notifications only</span>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Info Section */}
          <div className="bg-blue-50 rounded-lg p-3 border border-blue-200">
            <div className="flex items-start gap-2">
              <InformationCircleIcon className="w-4 h-4 text-blue-600 mt-0.5" />
              <div>
                <p className="text-xs text-blue-800 font-medium">Notification Guidelines</p>
                <p className="text-xs text-blue-700 mt-1">
                  • Selected recipients will receive notifications for enabled service categories
                  • Email notifications are sent immediately for urgent items
                  • In-app notifications appear in the notification center
                  • WhatsApp notifications provide instant messaging capabilities
                  • SMS notifications are reserved for critical alerts only
                </p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}

export default NotificationSettings