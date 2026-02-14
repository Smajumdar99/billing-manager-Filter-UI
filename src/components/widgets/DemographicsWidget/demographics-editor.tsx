import { FC, useState, useEffect, useMemo } from 'react';
import { Dialog, DialogContent, DialogFooter, DialogTitle, DialogDescription } from '@/components/atoms/Dialog/dialog';
import { Button } from '@/components/atoms/Button';
import { Input } from '@/components/atoms/Input';
import { Switch } from '@/components/atoms/Switch';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/atoms/Select/select';
import { 
  UserIcon,
  PhoneIcon,
  BuildingOfficeIcon,
  IdentificationIcon,
  ExclamationTriangleIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/atoms/Tabs/tabs';

// Demographics data interface
interface DemographicData {
  name: string;
  preferredName: string;
  dob: string;
  age: string;
  birthSex: string;
  gender: string;
  genderIdentity: string;
  pronouns: string;
  race: string;
  ethnicity: string;
  language: string;
  preferredLanguage: string;
  maritalStatus: string;
  employmentStatus: string;
  occupation: string;
  employer: string;
  educationLevel: string;
  religion: string;
  placeOfBirth: string;
  citizenship: string;
  veteranStatus: string;
  preferredPharmacy: string;
  preferredProvider: string;
  livingArrangement: string;
  housingStatus: string;
  familySize: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  email: string;
  phone: {
    home: string;
    work: string;
    mobile: string;
  };
  identifiers: {
    mrn: string;
    ssn: string;
    medicaidId: string;
  };
  emergencyContact: {
    name: string;
    relationship: string;
    phone: string;
  };
  alerts: string[];
  restrictions: {
    hasFirearmRestriction: boolean;
    restrictionDate: string;
  };
  careTeam?: string[];
}

interface DemographicsEditorProps {
  isOpen: boolean;
  onClose: () => void;
  patientData: DemographicData;
  onSave: (data: DemographicData) => void;
}

export const DemographicsEditor: FC<DemographicsEditorProps> = ({
  isOpen,
  onClose,
  patientData,
  onSave
}) => {
  const [activeTab, setActiveTab] = useState('who');
  const [showValidationBar, setShowValidationBar] = useState(false);
  const [enabledSections, setEnabledSections] = useState({
    who: true,
    contact: true,
    choices: true,
    employer: true,
    stats: true,
    misc: true,
    pregnancy: true
  });

  // Toggle section visibility
  const toggleSection = (section: string) => {
    setEnabledSections(prev => ({
      ...prev,
      [section]: !prev[section as keyof typeof prev]
    }));
  };
  const [formData, setFormData] = useState<DemographicData>({
    name: patientData?.name || '',
    preferredName: patientData?.preferredName || '',
    dob: patientData?.dob || '',
    age: patientData?.age || '',
    birthSex: patientData?.birthSex || '',
    gender: patientData?.gender || '',
    genderIdentity: patientData?.genderIdentity || '',
    pronouns: patientData?.pronouns || '',
    race: patientData?.race || '',
    ethnicity: patientData?.ethnicity || '',
    language: patientData?.language || '',
    preferredLanguage: patientData?.preferredLanguage || '',
    maritalStatus: patientData?.maritalStatus || '',
    employmentStatus: patientData?.employmentStatus || '',
    occupation: patientData?.occupation || '',
    employer: patientData?.employer || '',
    educationLevel: patientData?.educationLevel || '',
    religion: patientData?.religion || '',
    placeOfBirth: patientData?.placeOfBirth || '',
    citizenship: patientData?.citizenship || '',
    veteranStatus: patientData?.veteranStatus || '',
    preferredPharmacy: patientData?.preferredPharmacy || '',
    preferredProvider: patientData?.preferredProvider || '',
    livingArrangement: patientData?.livingArrangement || '',
    housingStatus: patientData?.housingStatus || '',
    familySize: patientData?.familySize || '',
    address: patientData?.address || '',
    city: patientData?.city || '',
    state: patientData?.state || '',
    zipCode: patientData?.zipCode || '',
    country: patientData?.country || '',
    email: patientData?.email || '',
    phone: {
      home: patientData?.phone?.home || '',
      work: patientData?.phone?.work || '',
      mobile: patientData?.phone?.mobile || ''
    },
    identifiers: {
      mrn: patientData?.identifiers?.mrn || '',
      ssn: patientData?.identifiers?.ssn || '',
      medicaidId: patientData?.identifiers?.medicaidId || ''
    },
    emergencyContact: {
      name: patientData?.emergencyContact?.name || '',
      relationship: patientData?.emergencyContact?.relationship || '',
      phone: patientData?.emergencyContact?.phone || ''
    },
    alerts: patientData?.alerts || [],
    restrictions: {
      hasFirearmRestriction: patientData?.restrictions?.hasFirearmRestriction || false,
      restrictionDate: patientData?.restrictions?.restrictionDate || ''
    },
    careTeam: patientData?.careTeam || []
  });
  const [hasChanges, setHasChanges] = useState(false);

  // Track changes
  useEffect(() => {
    const hasChanged = JSON.stringify(formData) !== JSON.stringify(patientData);
    setHasChanges(hasChanged);
  }, [formData, patientData]);

  // Validation logic - define mandatory fields per tab
  const tabValidation = useMemo(() => {
    return {
      who: {
        label: 'WHO',
        fields: [
          { name: 'name', label: 'Full Name', value: formData.name },
          { name: 'dob', label: 'Date of Birth', value: formData.dob }
        ]
      },
      contact: {
        label: 'CONTACT',
        fields: [
          { name: 'address', label: 'Address', value: formData.address },
          { name: 'city', label: 'City', value: formData.city },
          { name: 'state', label: 'State', value: formData.state },
          { name: 'zipCode', label: 'ZIP Code', value: formData.zipCode }
        ]
      },
      choices: {
        label: 'CHOICES',
        fields: []
      },
      employer: {
        label: 'EMPLOYER',
        fields: []
      },
      stats: {
        label: 'STATS',
        fields: []
      },
      misc: {
        label: 'MISC',
        fields: []
      },
      pregnancy: {
        label: 'PREGNANCY',
        fields: []
      }
    };
  }, [formData]);

  // Check which tabs have missing mandatory fields
  const tabsWithErrors = useMemo(() => {
    const errors: { [key: string]: string[] } = {};
    
    Object.entries(tabValidation).forEach(([tabKey, tabData]) => {
      const missingFields = tabData.fields
        .filter(field => !field.value || field.value.trim() === '')
        .map(field => field.label);
      
      if (missingFields.length > 0) {
        errors[tabKey] = missingFields;
      }
    });
    
    return errors;
  }, [tabValidation]);

  // Get all missing fields across all tabs
  const allMissingFields = useMemo(() => {
    const missing: { tab: string; fields: string[] }[] = [];
    
    Object.entries(tabsWithErrors).forEach(([tabKey, fields]) => {
      if (fields.length > 0) {
        missing.push({
          tab: tabValidation[tabKey as keyof typeof tabValidation].label,
          fields
        });
      }
    });
    
    return missing;
  }, [tabsWithErrors, tabValidation]);

  // Show validation bar when there are missing fields
  useEffect(() => {
    setShowValidationBar(allMissingFields.length > 0);
  }, [allMissingFields]);

  // Handle input changes
  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    setHasChanges(true);
  };

  // Handle nested object changes (e.g., phone.home, emergencyContact.name)
  const handleNestedChange = (parent: string, field: string, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      [parent]: {
        ...prev[parent as keyof typeof prev] as object,
        [field]: value
      }
    }));
    setHasChanges(true);
  };

  // Handle array changes for alerts
  const handleArrayChange = (arrayName: string, index: number, value: string) => {
    setFormData(prev => {
      const newArray = [...(prev[arrayName as keyof typeof prev] as string[])];
      newArray[index] = value;
      return {
        ...prev,
        [arrayName]: newArray
      };
    });
    setHasChanges(true);
  };

  // Add new alert
  const addAlert = () => {
    setFormData(prev => ({
      ...prev,
      alerts: [...prev.alerts, '']
    }));
    setHasChanges(true);
  };

  // Remove alert
  const removeAlert = (index: number) => {
    setFormData(prev => ({
      ...prev,
      alerts: prev.alerts.filter((_, i) => i !== index)
    }));
    setHasChanges(true);
  };

  // Handle save
  const handleSave = () => {
    onSave(formData);
    onClose();
  };

  // Handle cancel
  const handleCancel = () => {
    if (hasChanges) {
      if (window.confirm('You have unsaved changes. Are you sure you want to cancel?')) {
        setFormData({
          name: patientData?.name || '',
          preferredName: patientData?.preferredName || '',
          dob: patientData?.dob || '',
          age: patientData?.age || '',
          birthSex: patientData?.birthSex || '',
          gender: patientData?.gender || '',
          genderIdentity: patientData?.genderIdentity || '',
          pronouns: patientData?.pronouns || '',
          race: patientData?.race || '',
          ethnicity: patientData?.ethnicity || '',
          language: patientData?.language || '',
          preferredLanguage: patientData?.preferredLanguage || '',
          maritalStatus: patientData?.maritalStatus || '',
          employmentStatus: patientData?.employmentStatus || '',
          occupation: patientData?.occupation || '',
          employer: patientData?.employer || '',
          educationLevel: patientData?.educationLevel || '',
          religion: patientData?.religion || '',
          placeOfBirth: patientData?.placeOfBirth || '',
          citizenship: patientData?.citizenship || '',
          veteranStatus: patientData?.veteranStatus || '',
          preferredPharmacy: patientData?.preferredPharmacy || '',
          preferredProvider: patientData?.preferredProvider || '',
          livingArrangement: patientData?.livingArrangement || '',
          housingStatus: patientData?.housingStatus || '',
          familySize: patientData?.familySize || '',
          address: patientData?.address || '',
          city: patientData?.city || '',
          state: patientData?.state || '',
          zipCode: patientData?.zipCode || '',
          country: patientData?.country || '',
          email: patientData?.email || '',
          phone: {
            home: patientData?.phone?.home || '',
            work: patientData?.phone?.work || '',
            mobile: patientData?.phone?.mobile || ''
          },
          identifiers: {
            mrn: patientData?.identifiers?.mrn || '',
            ssn: patientData?.identifiers?.ssn || '',
            medicaidId: patientData?.identifiers?.medicaidId || ''
          },
          emergencyContact: {
            name: patientData?.emergencyContact?.name || '',
            relationship: patientData?.emergencyContact?.relationship || '',
            phone: patientData?.emergencyContact?.phone || ''
          },
          alerts: patientData?.alerts || [],
          restrictions: {
            hasFirearmRestriction: patientData?.restrictions?.hasFirearmRestriction || false,
            restrictionDate: patientData?.restrictions?.restrictionDate || ''
          },
          careTeam: patientData?.careTeam || []
        });
        setHasChanges(false);
        onClose();
      }
    } else {
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[1000px] lg:max-w-[1200px] p-0 flex flex-col h-[800px] max-h-[90vh] overflow-auto bg-gradient-to-br from-orange-50 to-blue-100">
        {/* Accessible dialog title for screen readers, visually hidden */}
        <DialogTitle className="sr-only">Edit Demographics</DialogTitle>
        {/* Accessible dialog description for screen readers, visually hidden */}
        <DialogDescription className="sr-only">
          Update patient demographic information including personal details, contact information, and alerts.
        </DialogDescription>
        
        {/* Dialog Title */}
        <div className="p-4 rounded-t-xl">
          <h2 className="text-base font-semibold text-gray-900 flex items-center gap-3">
            <UserIcon className="w-6 h-6 text-blue-600" />
            Edit Demographics
          </h2>
        </div>

        {/* Universal Validation Notification Bar */}
        {showValidationBar && (
          <div className="mx-4 bg-amber-50 border border-amber-200 rounded-lg p-3 animate-in slide-in-from-top-2 duration-300">
            <div className="flex items-start gap-3">
              <ExclamationTriangleIcon className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <h4 className="text-sm font-semibold text-amber-900 mb-1">Missing Required Fields</h4>
                <div className="space-y-1">
                  {allMissingFields.map((item, index) => (
                    <div key={index} className="text-xs text-amber-800">
                      <span className="font-medium">{item.tab}:</span>{' '}
                      <span>{item.fields.join(', ')}</span>
                    </div>
                  ))}
                </div>
              </div>
              <button
                onClick={() => setShowValidationBar(false)}
                className="text-amber-600 hover:text-amber-800 transition-colors"
                aria-label="Dismiss notification"
              >
                <XMarkIcon className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
        
        {/* Main content */}
        <div className="flex flex-1 min-h-0 overflow-hidden gap-2 px-4 pt-2 pb-2">
          {/* Sidebar Navigation */}
          <div className="w-64 flex-shrink-0 bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="px-4 py-3 border-b border-gray-200 bg-gray-50">
              <h3 className="text-xs font-semibold text-gray-700 uppercase tracking-wide">Sections</h3>
            </div>
            <div className="divide-y divide-gray-200">
              {/* WHO Section */}
              <div className="group">
                <div className={`flex items-center gap-3 px-4 py-3 transition-all ${
                  activeTab === 'who' && enabledSections.who
                    ? 'bg-blue-50 text-blue-700 border-l-4 border-l-blue-500'
                    : enabledSections.who
                    ? 'text-gray-700 hover:bg-gray-50'
                    : 'text-gray-400 bg-gray-50'
                }`}>
                  <button
                    onClick={() => enabledSections.who && setActiveTab('who')}
                    disabled={!enabledSections.who}
                    className="flex items-center gap-3 flex-1 text-left"
                  >
                    <UserIcon className="w-4 h-4 flex-shrink-0" />
                    <span className="text-sm font-medium">WHO</span>
                  </button>
                  {tabsWithErrors.who && enabledSections.who && (
                    <span className="flex h-2 w-2 mr-1">
                      <span className="animate-ping absolute inline-flex h-2 w-2 rounded-full bg-amber-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
                    </span>
                  )}
                  <Switch
                    checked={enabledSections.who}
                    onCheckedChange={() => toggleSection('who')}
                    className="scale-75"
                  />
                </div>
              </div>

              {/* CONTACT Section */}
              <div className="group">
                <div className={`flex items-center gap-3 px-4 py-3 transition-all ${
                  activeTab === 'contact' && enabledSections.contact
                    ? 'bg-blue-50 text-blue-700 border-l-4 border-l-blue-500'
                    : enabledSections.contact
                    ? 'text-gray-700 hover:bg-gray-50'
                    : 'text-gray-400 bg-gray-50'
                }`}>
                  <button
                    onClick={() => enabledSections.contact && setActiveTab('contact')}
                    disabled={!enabledSections.contact}
                    className="flex items-center gap-3 flex-1 text-left"
                  >
                    <PhoneIcon className="w-4 h-4 flex-shrink-0" />
                    <span className="text-sm font-medium">CONTACT</span>
                  </button>
                  {tabsWithErrors.contact && enabledSections.contact && (
                    <span className="flex h-2 w-2 mr-1">
                      <span className="animate-ping absolute inline-flex h-2 w-2 rounded-full bg-amber-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
                    </span>
                  )}
                  <Switch
                    checked={enabledSections.contact}
                    onCheckedChange={() => toggleSection('contact')}
                    className="scale-75"
                  />
                </div>
              </div>

              {/* CHOICES Section */}
              <div className="group">
                <div className={`flex items-center gap-3 px-4 py-3 transition-all ${
                  activeTab === 'choices' && enabledSections.choices
                    ? 'bg-blue-50 text-blue-700 border-l-4 border-l-blue-500'
                    : enabledSections.choices
                    ? 'text-gray-700 hover:bg-gray-50'
                    : 'text-gray-400 bg-gray-50'
                }`}>
                  <button
                    onClick={() => enabledSections.choices && setActiveTab('choices')}
                    disabled={!enabledSections.choices}
                    className="flex items-center gap-3 flex-1 text-left"
                  >
                    <BuildingOfficeIcon className="w-4 h-4 flex-shrink-0" />
                    <span className="text-sm font-medium">CHOICES</span>
                  </button>
                  {tabsWithErrors.choices && enabledSections.choices && (
                    <span className="flex h-2 w-2 mr-1">
                      <span className="animate-ping absolute inline-flex h-2 w-2 rounded-full bg-amber-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
                    </span>
                  )}
                  <Switch
                    checked={enabledSections.choices}
                    onCheckedChange={() => toggleSection('choices')}
                    className="scale-75"
                  />
                </div>
              </div>

              {/* EMPLOYER Section */}
              <div className="group">
                <div className={`flex items-center gap-3 px-4 py-3 transition-all ${
                  activeTab === 'employer' && enabledSections.employer
                    ? 'bg-blue-50 text-blue-700 border-l-4 border-l-blue-500'
                    : enabledSections.employer
                    ? 'text-gray-700 hover:bg-gray-50'
                    : 'text-gray-400 bg-gray-50'
                }`}>
                  <button
                    onClick={() => enabledSections.employer && setActiveTab('employer')}
                    disabled={!enabledSections.employer}
                    className="flex items-center gap-3 flex-1 text-left"
                  >
                    <IdentificationIcon className="w-4 h-4 flex-shrink-0" />
                    <span className="text-sm font-medium">EMPLOYER</span>
                  </button>
                  {tabsWithErrors.employer && enabledSections.employer && (
                    <span className="flex h-2 w-2 mr-1">
                      <span className="animate-ping absolute inline-flex h-2 w-2 rounded-full bg-amber-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
                    </span>
                  )}
                  <Switch
                    checked={enabledSections.employer}
                    onCheckedChange={() => toggleSection('employer')}
                    className="scale-75"
                  />
                </div>
              </div>

              {/* STATS Section */}
              <div className="group">
                <div className={`flex items-center gap-3 px-4 py-3 transition-all ${
                  activeTab === 'stats' && enabledSections.stats
                    ? 'bg-blue-50 text-blue-700 border-l-4 border-l-blue-500'
                    : enabledSections.stats
                    ? 'text-gray-700 hover:bg-gray-50'
                    : 'text-gray-400 bg-gray-50'
                }`}>
                  <button
                    onClick={() => enabledSections.stats && setActiveTab('stats')}
                    disabled={!enabledSections.stats}
                    className="flex items-center gap-3 flex-1 text-left"
                  >
                    <ExclamationTriangleIcon className="w-4 h-4 flex-shrink-0" />
                    <span className="text-sm font-medium">STATS</span>
                  </button>
                  {tabsWithErrors.stats && enabledSections.stats && (
                    <span className="flex h-2 w-2 mr-1">
                      <span className="animate-ping absolute inline-flex h-2 w-2 rounded-full bg-amber-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
                    </span>
                  )}
                  <Switch
                    checked={enabledSections.stats}
                    onCheckedChange={() => toggleSection('stats')}
                    className="scale-75"
                  />
                </div>
              </div>

              {/* MISC Section */}
              <div className="group">
                <div className={`flex items-center gap-3 px-4 py-3 transition-all ${
                  activeTab === 'misc' && enabledSections.misc
                    ? 'bg-blue-50 text-blue-700 border-l-4 border-l-blue-500'
                    : enabledSections.misc
                    ? 'text-gray-700 hover:bg-gray-50'
                    : 'text-gray-400 bg-gray-50'
                }`}>
                  <button
                    onClick={() => enabledSections.misc && setActiveTab('misc')}
                    disabled={!enabledSections.misc}
                    className="flex items-center gap-3 flex-1 text-left"
                  >
                    <UserIcon className="w-4 h-4 flex-shrink-0" />
                    <span className="text-sm font-medium">MISC</span>
                  </button>
                  {tabsWithErrors.misc && enabledSections.misc && (
                    <span className="flex h-2 w-2 mr-1">
                      <span className="animate-ping absolute inline-flex h-2 w-2 rounded-full bg-amber-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
                    </span>
                  )}
                  <Switch
                    checked={enabledSections.misc}
                    onCheckedChange={() => toggleSection('misc')}
                    className="scale-75"
                  />
                </div>
              </div>

              {/* PREGNANCY Section */}
              <div className="group">
                <div className={`flex items-center gap-3 px-4 py-3 transition-all ${
                  activeTab === 'pregnancy' && enabledSections.pregnancy
                    ? 'bg-blue-50 text-blue-700 border-l-4 border-l-blue-500'
                    : enabledSections.pregnancy
                    ? 'text-gray-700 hover:bg-gray-50'
                    : 'text-gray-400 bg-gray-50'
                }`}>
                  <button
                    onClick={() => enabledSections.pregnancy && setActiveTab('pregnancy')}
                    disabled={!enabledSections.pregnancy}
                    className="flex items-center gap-3 flex-1 text-left"
                  >
                    <PhoneIcon className="w-4 h-4 flex-shrink-0" />
                    <span className="text-sm font-medium">PREGNANCY</span>
                  </button>
                  {tabsWithErrors.pregnancy && enabledSections.pregnancy && (
                    <span className="flex h-2 w-2 mr-1">
                      <span className="animate-ping absolute inline-flex h-2 w-2 rounded-full bg-amber-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
                    </span>
                  )}
                  <Switch
                    checked={enabledSections.pregnancy}
                    onCheckedChange={() => toggleSection('pregnancy')}
                    className="scale-75"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Content Area */}
          <div className="flex-1 min-w-0 p-6 space-y-4 bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden flex flex-col">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full flex flex-col">
            {/* Tab Content */}
            <div className="flex-1 overflow-y-auto">
              {/* WHO Tab - Personal Information */}
              {enabledSections.who && (
              <TabsContent value="who" className="space-y-6 mt-0">
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Full Name *</label>
                    <Input
                      type="text"
                      value={formData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Preferred Name</label>
                    <Input
                      type="text"
                      value={formData.preferredName}
                      onChange={(e) => handleInputChange('preferredName', e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Date of Birth *</label>
                    <Input
                      type="date"
                      value={formData.dob.split('/').reverse().join('-')}
                      onChange={(e) => {
                        const date = new Date(e.target.value);
                        const formatted = `${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getDate().toString().padStart(2, '0')}/${date.getFullYear()}`;
                        handleInputChange('dob', formatted);
                      }}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Birth Sex</label>
                    <Select value={formData.birthSex} onValueChange={(value) => handleInputChange('birthSex', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select..." />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Male">Male</SelectItem>
                        <SelectItem value="Female">Female</SelectItem>
                        <SelectItem value="Intersex">Intersex</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Gender</label>
                    <Select value={formData.gender} onValueChange={(value) => handleInputChange('gender', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select..." />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Male">Male</SelectItem>
                        <SelectItem value="Female">Female</SelectItem>
                        <SelectItem value="Non-binary">Non-binary</SelectItem>
                        <SelectItem value="Other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Pronouns</label>
                    <Select value={formData.pronouns} onValueChange={(value) => handleInputChange('pronouns', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select..." />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="He/Him">He/Him</SelectItem>
                        <SelectItem value="She/Her">She/Her</SelectItem>
                        <SelectItem value="They/Them">They/Them</SelectItem>
                        <SelectItem value="Other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Race</label>
                    <Select value={formData.race} onValueChange={(value) => handleInputChange('race', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select..." />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="White">White</SelectItem>
                        <SelectItem value="Black or African American">Black or African American</SelectItem>
                        <SelectItem value="Asian">Asian</SelectItem>
                        <SelectItem value="American Indian or Alaska Native">American Indian or Alaska Native</SelectItem>
                        <SelectItem value="Native Hawaiian or Other Pacific Islander">Native Hawaiian or Other Pacific Islander</SelectItem>
                        <SelectItem value="Other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Ethnicity</label>
                    <Select value={formData.ethnicity} onValueChange={(value) => handleInputChange('ethnicity', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select..." />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Hispanic or Latino">Hispanic or Latino</SelectItem>
                        <SelectItem value="Not Hispanic or Latino">Not Hispanic or Latino</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Marital Status</label>
                    <Select value={formData.maritalStatus} onValueChange={(value) => handleInputChange('maritalStatus', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select..." />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Single">Single</SelectItem>
                        <SelectItem value="Married">Married</SelectItem>
                        <SelectItem value="Divorced">Divorced</SelectItem>
                        <SelectItem value="Widowed">Widowed</SelectItem>
                        <SelectItem value="Separated">Separated</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Language</label>
                    <Input
                      type="text"
                      value={formData.language}
                      onChange={(e) => handleInputChange('language', e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Religion</label>
                    <input
                      type="text"
                      value={formData.religion}
                      onChange={(e) => handleInputChange('religion', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Place of Birth</label>
                    <input
                      type="text"
                      value={formData.placeOfBirth}
                      onChange={(e) => handleInputChange('placeOfBirth', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </TabsContent>
              )}

              {/* Contact Information Tab */}
              {enabledSections.contact && (
              <TabsContent value="contact" className="space-y-6 mt-0">
                <div className="space-y-6">
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Address *</label>
                      <Input
                        type="text"
                        value={formData.address}
                        onChange={(e) => handleInputChange('address', e.target.value)}
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">City *</label>
                      <Input
                        type="text"
                        value={formData.city}
                        onChange={(e) => handleInputChange('city', e.target.value)}
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">State *</label>
                      <Input
                        type="text"
                        value={formData.state}
                        onChange={(e) => handleInputChange('state', e.target.value)}
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">ZIP Code *</label>
                      <Input
                        type="text"
                        value={formData.zipCode}
                        onChange={(e) => handleInputChange('zipCode', e.target.value)}
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                      <Input
                        type="email"
                        value={formData.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                  
                  <div className="border-t pt-6">
                    <h4 className="text-lg font-medium text-gray-900 mb-4">Phone Numbers</h4>
                    <div className="grid grid-cols-3 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Home Phone</label>
                        <input
                          type="tel"
                          value={formData.phone.home}
                          onChange={(e) => handleNestedChange('phone', 'home', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Work Phone</label>
                        <input
                          type="tel"
                          value={formData.phone.work}
                          onChange={(e) => handleNestedChange('phone', 'work', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Mobile Phone</label>
                        <input
                          type="tel"
                          value={formData.phone.mobile}
                          onChange={(e) => handleNestedChange('phone', 'mobile', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="border-t pt-6">
                    <h4 className="text-lg font-medium text-gray-900 mb-4">Emergency Contact</h4>
                    <div className="grid grid-cols-3 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                        <input
                          type="text"
                          value={formData.emergencyContact.name}
                          onChange={(e) => handleNestedChange('emergencyContact', 'name', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Relationship</label>
                        <input
                          type="text"
                          value={formData.emergencyContact.relationship}
                          onChange={(e) => handleNestedChange('emergencyContact', 'relationship', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                        <input
                          type="tel"
                          value={formData.emergencyContact.phone}
                          onChange={(e) => handleNestedChange('emergencyContact', 'phone', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>
              )}

              {/* Employment Tab */}
              {enabledSections.employer && (
              <TabsContent value="employer" className="space-y-6 mt-0">
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Employment Status</label>
                    <select
                      value={formData.employmentStatus}
                      onChange={(e) => handleInputChange('employmentStatus', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Select...</option>
                      <option value="Full-time">Full-time</option>
                      <option value="Part-time">Part-time</option>
                      <option value="Unemployed">Unemployed</option>
                      <option value="Retired">Retired</option>
                      <option value="Student">Student</option>
                      <option value="Disabled">Disabled</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Occupation</label>
                    <input
                      type="text"
                      value={formData.occupation}
                      onChange={(e) => handleInputChange('occupation', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Employer</label>
                    <input
                      type="text"
                      value={formData.employer}
                      onChange={(e) => handleInputChange('employer', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Education Level</label>
                    <select
                      value={formData.educationLevel}
                      onChange={(e) => handleInputChange('educationLevel', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Select...</option>
                      <option value="Less than High School">Less than High School</option>
                      <option value="High School Diploma">High School Diploma</option>
                      <option value="Some College">Some College</option>
                      <option value="Associate's Degree">Associate's Degree</option>
                      <option value="Bachelor's Degree">Bachelor's Degree</option>
                      <option value="Master's Degree">Master's Degree</option>
                      <option value="Doctoral Degree">Doctoral Degree</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Veteran Status</label>
                    <select
                      value={formData.veteranStatus}
                      onChange={(e) => handleInputChange('veteranStatus', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Select...</option>
                      <option value="Not a Veteran">Not a Veteran</option>
                      <option value="Veteran">Veteran</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Living Arrangement</label>
                    <input
                      type="text"
                      value={formData.livingArrangement}
                      onChange={(e) => handleInputChange('livingArrangement', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </TabsContent>
              )}

              {/* Identifiers Tab */}
              {enabledSections.choices && (
              <TabsContent value="choices" className="space-y-6 mt-0">
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Medical Record Number (MRN)</label>
                    <input
                      type="text"
                      value={formData.identifiers.mrn}
                      onChange={(e) => handleNestedChange('identifiers', 'mrn', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      readOnly
                    />
                    <p className="text-xs text-gray-500 mt-1">MRN cannot be modified</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Social Security Number</label>
                    <input
                      type="text"
                      value={formData.identifiers.ssn}
                      onChange={(e) => handleNestedChange('identifiers', 'ssn', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="XXX-XX-XXXX"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Medicaid ID</label>
                    <input
                      type="text"
                      value={formData.identifiers.medicaidId}
                      onChange={(e) => handleNestedChange('identifiers', 'medicaidId', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Citizenship</label>
                    <select
                      value={formData.citizenship}
                      onChange={(e) => handleInputChange('citizenship', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Select...</option>
                      <option value="US Citizen">US Citizen</option>
                      <option value="Permanent Resident">Permanent Resident</option>
                      <option value="Temporary Resident">Temporary Resident</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                </div>
              </TabsContent>
              )}

              {/* Alerts Tab */}
              {enabledSections.stats && (
              <TabsContent value="stats" className="space-y-6 mt-0">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="text-lg font-medium text-gray-900">Patient Alerts</h4>
                    <button
                      onClick={addAlert}
                      className="px-3 py-1 text-sm font-medium text-blue-600 bg-blue-50 border border-blue-200 rounded-md hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      Add Alert
                    </button>
                  </div>
                  
                  <div className="space-y-3">
                    {formData.alerts.map((alert, index) => (
                      <div key={index} className="flex items-center gap-3">
                        <input
                          type="text"
                          value={alert}
                          onChange={(e) => handleArrayChange('alerts', index, e.target.value)}
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="Enter alert description"
                        />
                        <button
                          onClick={() => removeAlert(index)}
                          className="px-3 py-2 text-sm font-medium text-red-600 bg-red-50 border border-red-200 rounded-md hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-red-500"
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                  </div>

                  <div className="border-t pt-6">
                    <h4 className="text-lg font-medium text-gray-900 mb-4">Restrictions</h4>
                    <div className="space-y-4">
                      <div className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          checked={formData.restrictions.hasFirearmRestriction}
                          onChange={(e) => handleNestedChange('restrictions', 'hasFirearmRestriction', e.target.checked.toString())}
                          className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                        />
                        <label className="text-sm font-medium text-gray-700">Firearm Restriction</label>
                      </div>
                      {formData.restrictions.hasFirearmRestriction && (
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Restriction Date</label>
                          <input
                            type="date"
                            value={formData.restrictions.restrictionDate.split('/').reverse().join('-')}
                            onChange={(e) => {
                              const date = new Date(e.target.value);
                              const formatted = `${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getDate().toString().padStart(2, '0')}/${date.getFullYear()}`;
                              handleNestedChange('restrictions', 'restrictionDate', formatted);
                            }}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </TabsContent>
              )}

              {/* MISC Tab */}
              {enabledSections.misc && (
              <TabsContent value="misc" className="space-y-6 mt-0">
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Religion</label>
                    <Input
                      type="text"
                      value={formData.religion}
                      onChange={(e) => handleInputChange('religion', e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Birth Place</label>
                    <Input
                      type="text"
                      value={formData.placeOfBirth}
                      onChange={(e) => handleInputChange('placeOfBirth', e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Living Arrangement</label>
                    <Input
                      type="text"
                      value={formData.livingArrangement}
                      onChange={(e) => handleInputChange('livingArrangement', e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Housing Status</label>
                    <Input
                      type="text"
                      value={formData.housingStatus}
                      onChange={(e) => handleInputChange('housingStatus', e.target.value)}
                    />
                  </div>
                </div>
              </TabsContent>
              )}

              {/* PREGNANCY Tab */}
              {enabledSections.pregnancy && (
              <TabsContent value="pregnancy" className="space-y-6 mt-0">
                <div className="space-y-4">
                  <h4 className="text-lg font-medium text-gray-900">Pregnancy Information</h4>
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Pregnancy Status</label>
                      <Select value="" onValueChange={(value) => {}}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="not-pregnant">Not Pregnant</SelectItem>
                          <SelectItem value="pregnant">Pregnant</SelectItem>
                          <SelectItem value="postpartum">Postpartum</SelectItem>
                          <SelectItem value="unknown">Unknown</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Due Date</label>
                      <Input
                        type="date"
                        placeholder="Select due date"
                      />
                    </div>
                  </div>
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <p className="text-sm text-blue-800">
                      Pregnancy information is used for appropriate care planning and medication safety.
                    </p>
                  </div>
                </div>
              </TabsContent>
              )}
            </div>
          </Tabs>
          </div>
        </div>

        {/* Footer */}
        <DialogFooter className="p-4">
          <Button variant="ghost" onClick={handleCancel} className="px-3 h-9 font-normal border-gray-200 text-sm">Cancel</Button>
          <Button variant="default" onClick={handleSave} disabled={!hasChanges}>Save Changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
