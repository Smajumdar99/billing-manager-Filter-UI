import React, { useState } from 'react'
import { Switch } from '@/components/atoms/Switch'
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/atoms/Select'
import { Input } from '@/components/atoms/Input'
import { Label } from '@/components/atoms/Label'
import { 
  Cog6ToothIcon,
  InformationCircleIcon
} from '@heroicons/react/24/outline'

/**
 * Basic Plan Settings Component
 * Comprehensive treatment plan configuration settings
 * I will use atomic design principles and our custom components
 */

interface BasicPlanSettingsProps {
  className?: string
}

const BasicPlanSettings: React.FC<BasicPlanSettingsProps> = ({ className }) => {
  // State for all settings - using the actual values from the screenshot
  const [settings, setSettings] = useState({
    // Plan Type and Structure
    enablePlanType: true,
    basedOnDiagnoses: true,
    includeStrengths: true,
    includeWeaknesses: true,
    hideConditionList: false,
    showIdentifiedNeeds: true,
    includeActiveDiagnoses: true,
    hideCulturalIssues: false,
    showStrengthsTextarea: false,
    includeInterventions: true,
    allSectionsExpanded: true,
    
    // Minimum Requirements
    minimumStrengths: 0,
    minimumWeaknesses: 0,
    hideInitialDischargePlan: false,
    minimumInitialDischargePlan: 0,
    hideInitialDischargeCriteria: false,
    minimumInitialDischargeCriteria: 0,
    minimumServiceCategories: 0,
    
    // Service Category Settings
    serviceCategoryTitle: 'Duration',
    planNamesEditable: true,
    hideServiceCodeNeeds: false,
    notifyAdditionalProviders: false,
    enableAddendum: true,
    gracePeroidProgressNotes: 2,
    allowEncounterCreation: 'Do Nothing',
    identifiedNeedLabel: 'Goal - in client\'s own words',
    showServiceCategoriesBelowInterventions: false,
    promptEndEarlierPlan: true,
    hideTreatmentGoal: false,
    hideNotableItems: false,
    restrictSingleActiveMDTP: true,
    showPatientAdmittedFacility: true,
    showCareTeamAdmission: true,
    enablePlanStartStopTime: true,
    hideGuardianSignatures: true,
    alertWhenAddingNewPlan: 'Warn and Allow',
    enableNotesGoalsObjectives: false,
    includeCompletedPlansObjectives: true,
    includeCompletedByDefault: false,
    includeInactivePlans: false,
    showCreatedByColumn: false,
    guideButtonShow: 'Goals/Needs',
    hideMeasuresSection: false,
    hideAddInterventionButton: false,
    enableGuardianSignatureMinor: false,
    accessFacilityDefault: '--Select--'
  })

  // Update individual setting
  const updateSetting = (key: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }))
  }

  return (
    <div className={`h-full flex flex-col bg-white ${className}`}>
      {/* Header */}
      <div className="p-3 border-b border-gray-200 bg-white">
        <div className="flex items-center gap-2">
          <div className="flex items-center justify-center w-6 h-6 bg-blue-100 rounded-md">
            <Cog6ToothIcon className="w-3 h-3 text-blue-600" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-gray-900">Basic Plan Settings</h2>
            <p className="text-xs text-gray-500">Set organization-wide defaults for plan duration, objectives, and measures</p>
          </div>
        </div>
      </div>

      {/* Settings Content - Scrollable */}
      <div className="flex-1 overflow-auto p-3 pb-8">
        <div className="max-w-4xl space-y-4">
          
          {/* Plan Structure Section */}
          <div className="bg-gray-50/0 rounded-lg p-4">
            <h3 className="text-sm font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <InformationCircleIcon className="w-4 h-4 text-blue-600" />
              Plan Structure & Content
            </h3>
            <div className="space-y-4">
              
              {/* Enable Plan Type */}
              <div className="flex items-center justify-between py-2">
                <div className="flex-1">
                  <Label className="text-sm font-medium text-gray-700">
                    Enable Plan Type i.e. Initial, Review.
                  </Label>
                </div>
                <Switch
                  checked={settings.enablePlanType}
                  onCheckedChange={(checked) => updateSetting('enablePlanType', checked)}
                />
              </div>

              {/* Based on Diagnoses */}
              <div className="flex items-center justify-between py-2">
                <div className="flex-1">
                  <Label className="text-sm font-medium text-gray-700">
                    Plans, Objectives, Needs, and Goals are based on a patient's existing diagnoses
                  </Label>
                </div>
                <Switch
                  checked={settings.basedOnDiagnoses}
                  onCheckedChange={(checked) => updateSetting('basedOnDiagnoses', checked)}
                />
              </div>

              {/* Include Strengths */}
              <div className="flex items-center justify-between py-2">
                <div className="flex-1">
                  <Label className="text-sm font-medium text-gray-700">
                    Include Strengths - Plans will include a section with a multiple selection of strengths to highlight positive attributes and support an individualized treatment plan.
                  </Label>
                </div>
                <Switch
                  checked={settings.includeStrengths}
                  onCheckedChange={(checked) => updateSetting('includeStrengths', checked)}
                />
              </div>

              {/* Include Weaknesses */}
              <div className="flex items-center justify-between py-2">
                <div className="flex-1">
                  <Label className="text-sm font-medium text-gray-700">
                    Include Weaknesses - Plans will include a section with a multiple selection of Weaknesses to augment a treatment plan
                  </Label>
                </div>
                <Switch
                  checked={settings.includeWeaknesses}
                  onCheckedChange={(checked) => updateSetting('includeWeaknesses', checked)}
                />
              </div>

              {/* Hide Condition List */}
              <div className="flex items-center justify-between py-2">
                <div className="flex-1">
                  <Label className="text-sm font-medium text-gray-700">
                    Hide Condition List
                  </Label>
                </div>
                <Switch
                  checked={settings.hideConditionList}
                  onCheckedChange={(checked) => updateSetting('hideConditionList', checked)}
                />
              </div>

              {/* Show Identified Needs */}
              <div className="flex items-center justify-between py-2">
                <div className="flex-1">
                  <Label className="text-sm font-medium text-gray-700">
                    Show Identified Needs
                  </Label>
                </div>
                <Switch
                  checked={settings.showIdentifiedNeeds}
                  onCheckedChange={(checked) => updateSetting('showIdentifiedNeeds', checked)}
                />
              </div>

              {/* Include Active Diagnoses */}
              <div className="flex items-center justify-between py-2">
                <div className="flex-1">
                  <Label className="text-sm font-medium text-gray-700">
                    Include a readonly list of all ACTIVE patient diagnoses in plan interface and printouts
                  </Label>
                </div>
                <Switch
                  checked={settings.includeActiveDiagnoses}
                  onCheckedChange={(checked) => updateSetting('includeActiveDiagnoses', checked)}
                />
              </div>

              {/* Hide Cultural Issues */}
              <div className="flex items-center justify-between py-2">
                <div className="flex-1">
                  <Label className="text-sm font-medium text-gray-700">
                    Hide Cultural Issues, Preferences, Abilities and Others Involved
                  </Label>
                </div>
                <Switch
                  checked={settings.hideCulturalIssues}
                  onCheckedChange={(checked) => updateSetting('hideCulturalIssues', checked)}
                />
              </div>

              {/* Show Strengths Textarea */}
              <div className="flex items-center justify-between py-2">
                <div className="flex-1">
                  <Label className="text-sm font-medium text-gray-700">
                    Show textarea for strengths section instead of list of checkboxes
                  </Label>
                </div>
                <Switch
                  checked={settings.showStrengthsTextarea}
                  onCheckedChange={(checked) => updateSetting('showStrengthsTextarea', checked)}
                />
              </div>

              {/* Include Interventions */}
              <div className="flex items-center justify-between py-2">
                <div className="flex-1">
                  <Label className="text-sm font-medium text-gray-700">
                    Include interventions
                  </Label>
                </div>
                <Switch
                  checked={settings.includeInterventions}
                  onCheckedChange={(checked) => updateSetting('includeInterventions', checked)}
                />
              </div>

              {/* All Sections Expanded */}
              <div className="flex items-center justify-between py-2">
                <div className="flex-1">
                  <Label className="text-sm font-medium text-gray-700">
                    All sections expanded by default
                  </Label>
                </div>
                <Switch
                  checked={settings.allSectionsExpanded}
                  onCheckedChange={(checked) => updateSetting('allSectionsExpanded', checked)}
                />
              </div>
            </div>
          </div>

          {/* Minimum Requirements Section */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="text-sm font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <InformationCircleIcon className="w-4 h-4 text-orange-600" />
              Minimum Requirements
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              
              {/* Minimum Strengths */}
              <div className="flex items-center gap-3">
                <Input
                  type="number"
                  value={settings.minimumStrengths}
                  onChange={(e) => updateSetting('minimumStrengths', parseInt(e.target.value) || 0)}
                  className="w-16 h-8 text-center"
                  min="0"
                />
                <Label className="text-sm text-gray-700">Minimum strengths required</Label>
              </div>

              {/* Minimum Weaknesses */}
              <div className="flex items-center gap-3">
                <Input
                  type="number"
                  value={settings.minimumWeaknesses}
                  onChange={(e) => updateSetting('minimumWeaknesses', parseInt(e.target.value) || 0)}
                  className="w-16 h-8 text-center"
                  min="0"
                />
                <Label className="text-sm text-gray-700">Minimum Weaknesses required</Label>
              </div>

              {/* Hide Initial Discharge Plan */}
              <div className="flex items-center gap-3">
                <Switch
                  checked={settings.hideInitialDischargePlan}
                  onCheckedChange={(checked) => updateSetting('hideInitialDischargePlan', checked)}
                />
                <Label className="text-sm text-gray-700">Hide Initial Discharge Plan</Label>
              </div>

              {/* Minimum Initial Discharge Plan */}
              <div className="flex items-center gap-3">
                <Input
                  type="number"
                  value={settings.minimumInitialDischargePlan}
                  onChange={(e) => updateSetting('minimumInitialDischargePlan', parseInt(e.target.value) || 0)}
                  className="w-16 h-8 text-center"
                  min="0"
                />
                <Label className="text-sm text-gray-700">Minimum initial discharge plan required</Label>
              </div>

              {/* Hide Initial Discharge Criteria */}
              <div className="flex items-center gap-3">
                <Switch
                  checked={settings.hideInitialDischargeCriteria}
                  onCheckedChange={(checked) => updateSetting('hideInitialDischargeCriteria', checked)}
                />
                <Label className="text-sm text-gray-700">Hide Initial Discharge Criteria</Label>
              </div>

              {/* Minimum Initial Discharge Criteria */}
              <div className="flex items-center gap-3">
                <Input
                  type="number"
                  value={settings.minimumInitialDischargeCriteria}
                  onChange={(e) => updateSetting('minimumInitialDischargeCriteria', parseInt(e.target.value) || 0)}
                  className="w-16 h-8 text-center"
                  min="0"
                />
                <Label className="text-sm text-gray-700">Minimum initial discharge criteria required</Label>
              </div>

              {/* Minimum Service Categories */}
              <div className="flex items-center gap-3">
                <Input
                  type="number"
                  value={settings.minimumServiceCategories}
                  onChange={(e) => updateSetting('minimumServiceCategories', parseInt(e.target.value) || 0)}
                  className="w-16 h-8 text-center"
                  min="0"
                />
                <Label className="text-sm text-gray-700">Minimum service categories required</Label>
              </div>
            </div>
          </div>

          {/* Service & Configuration Section */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="text-sm font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <InformationCircleIcon className="w-4 h-4 text-green-600" />
              Service & Configuration Settings
            </h3>
            <div className="space-y-4">
              
              {/* Service Category Title */}
              <div className="flex items-center gap-3">
                <Input
                  value={settings.serviceCategoryTitle}
                  onChange={(e) => updateSetting('serviceCategoryTitle', e.target.value)}
                  className="w-32 h-8"
                  maxLength={255}
                />
                <Label className="text-sm text-gray-700">
                  Title for Service Category table for objectives (Cannot exceed 255 characters).
                </Label>
              </div>

              {/* Plan Names Editable */}
              <div className="flex items-center justify-between py-2">
                <div className="flex-1">
                  <Label className="text-sm font-medium text-gray-700">
                    Plan names are editable and configurable
                  </Label>
                </div>
                <Switch
                  checked={settings.planNamesEditable}
                  onCheckedChange={(checked) => updateSetting('planNamesEditable', checked)}
                />
              </div>

              {/* Hide Service Code at Needs */}
              <div className="flex items-center justify-between py-2">
                <div className="flex-1">
                  <Label className="text-sm font-medium text-gray-700">
                    Hide Service Code at Needs
                  </Label>
                </div>
                <Switch
                  checked={settings.hideServiceCodeNeeds}
                  onCheckedChange={(checked) => updateSetting('hideServiceCodeNeeds', checked)}
                />
              </div>

              {/* Notify Additional Providers */}
              <div className="flex items-center justify-between py-2">
                <div className="flex-1">
                  <Label className="text-sm font-medium text-gray-700">
                    Send Notifications to additional Providers who need to sign plan after it is signed by first Provider.
                  </Label>
                </div>
                <Switch
                  checked={settings.notifyAdditionalProviders}
                  onCheckedChange={(checked) => updateSetting('notifyAdditionalProviders', checked)}
                />
              </div>

              {/* Enable Addendum */}
              <div className="flex items-center justify-between py-2">
                <div className="flex-1">
                  <Label className="text-sm font-medium text-gray-700">
                    Enable Addendum feature.
                  </Label>
                </div>
                <Switch
                  checked={settings.enableAddendum}
                  onCheckedChange={(checked) => updateSetting('enableAddendum', checked)}
                />
              </div>

              {/* Grace Period Progress Notes */}
              <div className="flex items-center gap-3">
                <Input
                  type="number"
                  value={settings.gracePeroidProgressNotes}
                  onChange={(e) => updateSetting('gracePeroidProgressNotes', parseInt(e.target.value) || 0)}
                  className="w-16 h-8 text-center"
                  min="0"
                />
                <Label className="text-sm text-gray-700">
                  Grace period for adding a Progress Note after the Plan's end date.
                </Label>
              </div>

              {/* Allow Encounter Creation */}
              <div className="flex items-center gap-3">
                <Select
                  value={settings.allowEncounterCreation}
                  onValueChange={(value) => updateSetting('allowEncounterCreation', value)}
                >
                  <SelectTrigger className="w-48 h-8">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Do Nothing">Do Nothing</SelectItem>
                    <SelectItem value="Warn Only">Warn Only</SelectItem>
                    <SelectItem value="Block">Block</SelectItem>
                  </SelectContent>
                </Select>
                <Label className="text-sm text-gray-700">Allow Encounter Creation Outside Treatment Plan.</Label>
              </div>

              {/* Identified Need Label */}
              <div className="flex items-center gap-3">
                <Input
                  value={settings.identifiedNeedLabel}
                  onChange={(e) => updateSetting('identifiedNeedLabel', e.target.value)}
                  className="w-64 h-8"
                />
                <Label className="text-sm text-gray-700">Identified Need Label in MDTP</Label>
              </div>
            </div>
          </div>

          {/* Plan Management Section */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="text-sm font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <InformationCircleIcon className="w-4 h-4 text-purple-600" />
              Plan Management & Display
            </h3>
            <div className="space-y-4">
              
              {/* Show Service Categories Below Interventions */}
              <div className="flex items-center justify-between py-2">
                <div className="flex-1">
                  <Label className="text-sm font-medium text-gray-700">
                    Show the service categories below the 'Interventions' section.
                  </Label>
                </div>
                <Switch
                  checked={settings.showServiceCategoriesBelowInterventions}
                  onCheckedChange={(checked) => updateSetting('showServiceCategoriesBelowInterventions', checked)}
                />
              </div>

              {/* Prompt End Earlier Plan */}
              <div className="flex items-center justify-between py-2">
                <div className="flex-1">
                  <Label className="text-sm font-medium text-gray-700">
                    Prompt to end the earlier plan on Duplicate Plan.
                  </Label>
                </div>
                <Switch
                  checked={settings.promptEndEarlierPlan}
                  onCheckedChange={(checked) => updateSetting('promptEndEarlierPlan', checked)}
                />
              </div>

              {/* Hide Treatment Goal */}
              <div className="flex items-center justify-between py-2">
                <div className="flex-1">
                  <Label className="text-sm font-medium text-gray-700">
                    Hide Treatment Goal / Recovery Goal/Person-Family vision.
                  </Label>
                </div>
                <Switch
                  checked={settings.hideTreatmentGoal}
                  onCheckedChange={(checked) => updateSetting('hideTreatmentGoal', checked)}
                />
              </div>

              {/* Hide Notable Items */}
              <div className="flex items-center justify-between py-2">
                <div className="flex-1">
                  <Label className="text-sm font-medium text-gray-700">
                    Hide Notable Items / Others Present.
                  </Label>
                </div>
                <Switch
                  checked={settings.hideNotableItems}
                  onCheckedChange={(checked) => updateSetting('hideNotableItems', checked)}
                />
              </div>

              {/* Restrict Single Active MDTP */}
              <div className="flex items-center justify-between py-2">
                <div className="flex-1">
                  <Label className="text-sm font-medium text-gray-700">
                    Restrict Single Active MDTP Per Program / Facility
                  </Label>
                </div>
                <Switch
                  checked={settings.restrictSingleActiveMDTP}
                  onCheckedChange={(checked) => updateSetting('restrictSingleActiveMDTP', checked)}
                />
              </div>

              {/* Show Patient Admitted Facility */}
              <div className="flex items-center justify-between py-2">
                <div className="flex-1">
                  <Label className="text-sm font-medium text-gray-700">
                    Show Patient Admitted Facility as the default option for Programs covered by the plan
                  </Label>
                </div>
                <Switch
                  checked={settings.showPatientAdmittedFacility}
                  onCheckedChange={(checked) => updateSetting('showPatientAdmittedFacility', checked)}
                />
              </div>

              {/* Show Care Team Admission */}
              <div className="flex items-center justify-between py-2">
                <div className="flex-1">
                  <Label className="text-sm font-medium text-gray-700">
                    Show Care Team from Admission with admit provider as default.
                  </Label>
                </div>
                <Switch
                  checked={settings.showCareTeamAdmission}
                  onCheckedChange={(checked) => updateSetting('showCareTeamAdmission', checked)}
                />
              </div>

              {/* Enable Plan Start/Stop Time */}
              <div className="flex items-center justify-between py-2">
                <div className="flex-1">
                  <Label className="text-sm font-medium text-gray-700">
                    Enable Plan Start/Stop Time
                  </Label>
                </div>
                <Switch
                  checked={settings.enablePlanStartStopTime}
                  onCheckedChange={(checked) => updateSetting('enablePlanStartStopTime', checked)}
                />
              </div>

              {/* Hide Guardian Signatures */}
              <div className="flex items-center justify-between py-2">
                <div className="flex-1">
                  <Label className="text-sm font-medium text-gray-700">
                    Hide Guardian and Outside Agency Signatures by Default
                  </Label>
                </div>
                <Switch
                  checked={settings.hideGuardianSignatures}
                  onCheckedChange={(checked) => updateSetting('hideGuardianSignatures', checked)}
                />
              </div>

              {/* Alert When Adding New Plan */}
              <div className="flex items-center gap-3">
                <Select
                  value={settings.alertWhenAddingNewPlan}
                  onValueChange={(value) => updateSetting('alertWhenAddingNewPlan', value)}
                >
                  <SelectTrigger className="w-48 h-8">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Warn and Allow">Warn and Allow</SelectItem>
                    <SelectItem value="Block">Block</SelectItem>
                    <SelectItem value="Allow">Allow</SelectItem>
                  </SelectContent>
                </Select>
                <Label className="text-sm text-gray-700">Show an alert/warning when adding a new plan if a plan is active.</Label>
              </div>

              {/* Enable Notes for Goals & Objectives */}
              <div className="flex items-center justify-between py-2">
                <div className="flex-1">
                  <Label className="text-sm font-medium text-gray-700">
                    Enable Notes for Goals & Objectives
                  </Label>
                </div>
                <Switch
                  checked={settings.enableNotesGoalsObjectives}
                  onCheckedChange={(checked) => updateSetting('enableNotesGoalsObjectives', checked)}
                />
              </div>

              {/* Include Completed Plans/Objectives */}
              <div className="flex items-center justify-between py-2">
                <div className="flex-1">
                  <Label className="text-sm font-medium text-gray-700">
                    When enabled, by default, includes completed Plans / Objectives / Measures.
                  </Label>
                </div>
                <Switch
                  checked={settings.includeCompletedPlansObjectives}
                  onCheckedChange={(checked) => updateSetting('includeCompletedPlansObjectives', checked)}
                />
              </div>

              {/* Include Completed by Default */}
              <div className="flex items-center justify-between py-2">
                <div className="flex-1">
                  <Label className="text-sm font-medium text-gray-700">
                    By default, include completed Plans / Objectives / Measures.
                  </Label>
                </div>
                <Switch
                  checked={settings.includeCompletedByDefault}
                  onCheckedChange={(checked) => updateSetting('includeCompletedByDefault', checked)}
                />
              </div>

              {/* Include Inactive Plans */}
              <div className="flex items-center justify-between py-2">
                <div className="flex-1">
                  <Label className="text-sm font-medium text-gray-700">
                    By default, include inactive Plans.
                  </Label>
                </div>
                <Switch
                  checked={settings.includeInactivePlans}
                  onCheckedChange={(checked) => updateSetting('includeInactivePlans', checked)}
                />
              </div>

              {/* Show Created By Column */}
              <div className="flex items-center justify-between py-2">
                <div className="flex-1">
                  <Label className="text-sm font-medium text-gray-700">
                    Show 'Created By' column in MDTP list
                  </Label>
                </div>
                <Switch
                  checked={settings.showCreatedByColumn}
                  onCheckedChange={(checked) => updateSetting('showCreatedByColumn', checked)}
                />
              </div>

              {/* Guide Button Show */}
              <div className="flex items-center gap-3">
                <Select
                  value={settings.guideButtonShow}
                  onValueChange={(value) => updateSetting('guideButtonShow', value)}
                >
                  <SelectTrigger className="w-48 h-8">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Goals/Needs">Goals/Needs</SelectItem>
                    <SelectItem value="Objectives">Objectives</SelectItem>
                    <SelectItem value="Measures">Measures</SelectItem>
                  </SelectContent>
                </Select>
                <Label className="text-sm text-gray-700">Guide button to show the list</Label>
              </div>

              {/* Hide Measures Section */}
              <div className="flex items-center justify-between py-2">
                <div className="flex-1">
                  <Label className="text-sm font-medium text-gray-700">
                    Hide Measures section
                  </Label>
                </div>
                <Switch
                  checked={settings.hideMeasuresSection}
                  onCheckedChange={(checked) => updateSetting('hideMeasuresSection', checked)}
                />
              </div>

              {/* Hide Add Intervention Button */}
              <div className="flex items-center justify-between py-2">
                <div className="flex-1">
                  <Label className="text-sm font-medium text-gray-700">
                    Hide Add Intervention button
                  </Label>
                </div>
                <Switch
                  checked={settings.hideAddInterventionButton}
                  onCheckedChange={(checked) => updateSetting('hideAddInterventionButton', checked)}
                />
              </div>

              {/* Enable Guardian Signature for Minor */}
              <div className="flex items-center justify-between py-2">
                <div className="flex-1">
                  <Label className="text-sm font-medium text-gray-700">
                    Enable Guardian Signature for Minor Patients
                  </Label>
                </div>
                <Switch
                  checked={settings.enableGuardianSignatureMinor}
                  onCheckedChange={(checked) => updateSetting('enableGuardianSignatureMinor', checked)}
                />
              </div>

              {/* Access Facility Default */}
              <div className="flex items-center gap-3">
                <Select
                  value={settings.accessFacilityDefault}
                  onValueChange={(value) => updateSetting('accessFacilityDefault', value)}
                >
                  <SelectTrigger className="w-48 h-8">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="--Select--">--Select--</SelectItem>
                    <SelectItem value="Current Facility">Current Facility</SelectItem>
                    <SelectItem value="All Programs">All Programs</SelectItem>
                  </SelectContent>
                </Select>
                <Label className="text-sm text-gray-700">The access facility will default to</Label>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default BasicPlanSettings