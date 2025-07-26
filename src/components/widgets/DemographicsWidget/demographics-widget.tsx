import { FC, useState } from 'react';
import { 
  UserIcon,
  IdentificationIcon,
  CalendarIcon,
  GlobeAltIcon,
  HomeIcon,
  PhoneIcon,
  EnvelopeIcon,
  ExclamationTriangleIcon,
  LanguageIcon,
  HeartIcon,
  BuildingOfficeIcon,
  AcademicCapIcon,
  GlobeAmericasIcon,
  BriefcaseIcon,
  HashtagIcon,
  PencilIcon,
  Cog6ToothIcon,
  ChartBarIcon,
  InformationCircleIcon,
  ScaleIcon,
  UsersIcon,
  DocumentTextIcon,
  ClipboardDocumentCheckIcon,
  TruckIcon,
  CpuChipIcon
} from '@heroicons/react/24/outline';
import { Badge } from '@/components/atoms/Badge/badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/atoms/Tabs/tabs';
import { DemographicsEditor } from './demographics-editor';

interface DemographicsWidgetProps {
  isFullscreen?: boolean;
}

export const DemographicsWidget: FC<DemographicsWidgetProps> = ({ isFullscreen = false }) => {
  // Enhanced demographic info with more fields
  const demographicData = {
    name: 'Test Individual',
    preferredName: 'Test',
    dob: '07/07/2009',
    age: '14',
    birthSex: 'Male',
    gender: 'Male',
    genderIdentity: 'Agender',
    pronouns: 'They/Them',
    race: 'Asian',
    ethnicity: 'Not Hispanic or Latino',
    language: 'English',
    preferredLanguage: 'English',
    maritalStatus: 'Married',
    employmentStatus: 'Full-time',
    occupation: 'Software Engineer',
    employer: 'Tech Company Inc.',
    workStatus: 'Active',
    educationLevel: 'Bachelor\'s Degree',
    schoolName: 'University of Illinois',
    graduationYear: '2020',
    religion: 'Buddhist',
    placeOfBirth: 'Chicago, IL',
    citizenship: 'US Citizen',
    veteranStatus: 'Not a Veteran',
    preferredPharmacy: 'CVS Pharmacy - Downtown',
    preferredProvider: 'Dr. Sarah Smith',
    careTeam: ['Dr. Sarah Smith', 'Dr. John Doe', 'Nurse Jane'],
    livingArrangement: 'Lives with Family',
    housingStatus: 'Permanent Housing',
    familySize: '4',
    emergencyContact: {
      name: 'Jane Doe',
      relationship: 'Spouse',
      phone: '777-777-7777'
    },
    address: '150 feet road, 10th street',
    city: 'Chicago',
    state: 'Illinois',
    zipCode: '07863',
    country: 'USA',
    email: 'kgollapudi@drcloudehr.com',
    phone: {
      home: '777-777-788',
      work: '777-777-7777',
      mobile: '777-777-5758'
    },
    identifiers: {
      mrn: '74516900',
      ssn: 'XXX-XX-8999',
      medicaidId: '784261542'
    },
    alerts: [
      'Latex Allergy',
      'Hearing Impaired',
      'Requires Interpreter'
    ],
    restrictions: {
      hasFirearmRestriction: true,
      restrictionDate: '11/12/2024'
    }
  };

  // State management for edit functionality
  const [activeTab, setActiveTab] = useState('who');
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [currentDemographicData, setCurrentDemographicData] = useState(demographicData);

  // Handle save from editor
  const handleSave = (updatedData: any) => {
    setCurrentDemographicData(updatedData);
    console.log('Demographics updated:', updatedData);
    // TODO: Implement API call to save data
  };

  const renderCompactView = () => (
    <div className="space-y-1.5 h-full overflow-y-auto">
      {/* Alerts Section with Edit Button */}
      <div className="flex items-center justify-between mb-1">
        <div className="flex-1">
          {currentDemographicData.alerts.length > 0 && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-1">
              <div className="flex items-center gap-1">
                <ExclamationTriangleIcon className="w-3 h-3 text-yellow-600 shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-[10px] font-medium text-yellow-800">
                    {currentDemographicData.alerts.join(' • ')}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
        <button
          onClick={() => setIsEditorOpen(true)}
          className="ml-2 p-1 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
          title="Edit Demographics"
          data-testid="edit-demographics-button"
        >
          <PencilIcon className="w-4 h-4" />
        </button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        {/* Primary Tabs Row */}
        <TabsList className="bg-gray-100/80 p-0.5 h-8 rounded-lg grid w-full grid-cols-7 gap-0.5 sticky top-0 z-10 mb-1">
          <TabsTrigger value="who" className="text-[11px] px-1 rounded data-[state=active]:bg-blue-500 data-[state=active]:text-white">WHO</TabsTrigger>
          <TabsTrigger value="contact" className="text-[11px] px-1 rounded data-[state=active]:bg-blue-500 data-[state=active]:text-white">CONTACT</TabsTrigger>
          <TabsTrigger value="choices" className="text-[11px] px-1 rounded data-[state=active]:bg-blue-500 data-[state=active]:text-white">CHOICES</TabsTrigger>
          <TabsTrigger value="employer" className="text-[11px] px-1 rounded data-[state=active]:bg-blue-500 data-[state=active]:text-white">EMPLOYER</TabsTrigger>
          <TabsTrigger value="stats" className="text-[11px] px-1 rounded data-[state=active]:bg-blue-500 data-[state=active]:text-white">STATS</TabsTrigger>
          <TabsTrigger value="misc" className="text-[11px] px-1 rounded data-[state=active]:bg-blue-500 data-[state=active]:text-white">MISC</TabsTrigger>
          <TabsTrigger value="pregnancy" className="text-[11px] px-1 rounded data-[state=active]:bg-blue-500 data-[state=active]:text-white">PREGNANCY</TabsTrigger>
        </TabsList>

        {/* Secondary Tabs Row */}
        <TabsList className="bg-gray-100/80 p-0.5 h-8 rounded-lg grid w-full grid-cols-6 gap-0.5 sticky top-9 z-10 mb-2">
          <TabsTrigger value="duii2" className="text-[11px] px-1 rounded data-[state=active]:bg-blue-500 data-[state=active]:text-white">DUII2</TabsTrigger>
          <TabsTrigger value="legal" className="text-[11px] px-1 rounded data-[state=active]:bg-blue-500 data-[state=active]:text-white">LEGAL</TabsTrigger>
          <TabsTrigger value="other_contacts" className="text-[10px] px-1 rounded data-[state=active]:bg-blue-500 data-[state=active]:text-white">OTHER CONTACTS</TabsTrigger>
          <TabsTrigger value="birth_history" className="text-[10px] px-1 rounded data-[state=active]:bg-blue-500 data-[state=active]:text-white">BIRTH HISTORY</TabsTrigger>
          <TabsTrigger value="screening_tool" className="text-[10px] px-1 rounded data-[state=active]:bg-blue-500 data-[state=active]:text-white">SCREENING TOOL</TabsTrigger>
          <TabsTrigger value="roads" className="text-[11px] px-1 rounded data-[state=active]:bg-blue-500 data-[state=active]:text-white">ROADS</TabsTrigger>
        </TabsList>

        {/* Additional Tab */}
        <TabsList className="bg-gray-100/80 p-0.5 h-8 rounded-lg grid w-full grid-cols-1 gap-0.5 sticky top-18 z-10 mb-2">
          <TabsTrigger value="mcrt" className="text-[11px] px-1 rounded data-[state=active]:bg-blue-500 data-[state=active]:text-white">MCRT</TabsTrigger>
        </TabsList>

        <TabsContent value="who" className="mt-1.5">
          <div className="grid grid-cols-2 gap-x-3 gap-y-1.5">
            {/* Personal Information Section */}
            <div className="col-span-2 mb-1">
              <p className="text-[10px] font-medium text-gray-600 mb-1">Personal Information</p>
              <div className="grid grid-cols-2 gap-x-3 gap-y-1.5">
                <div>
                  <div className="flex items-center gap-0.5">
                    <UserIcon className="w-2.5 h-2.5 text-gray-400" />
                    <p className="text-[10px] text-gray-500">Name</p>
                  </div>
                  <p className="text-xs pl-3">{currentDemographicData.name}</p>
                  <p className="text-[10px] pl-3 text-gray-500">Preferred: {currentDemographicData.preferredName}</p>
                </div>
                <div>
                  <div className="flex items-center gap-0.5">
                    <CalendarIcon className="w-2.5 h-2.5 text-gray-400" />
                    <p className="text-[10px] text-gray-500">DOB</p>
                  </div>
                  <p className="text-xs pl-3">{currentDemographicData.dob}</p>
                  <p className="text-[10px] pl-3 text-gray-500">Age: {currentDemographicData.age}</p>
                </div>
                <div>
                  <div className="flex items-center gap-0.5">
                    <GlobeAltIcon className="w-2.5 h-2.5 text-gray-400" />
                    <p className="text-[10px] text-gray-500">Place of Birth</p>
                  </div>
                  <p className="text-xs pl-3">{currentDemographicData.placeOfBirth}</p>
                </div>
                <div>
                  <div className="flex items-center gap-0.5">
                    <IdentificationIcon className="w-2.5 h-2.5 text-gray-400" />
                    <p className="text-[10px] text-gray-500">Citizenship</p>
                  </div>
                  <p className="text-xs pl-3">{currentDemographicData.citizenship}</p>
                </div>
              </div>
            </div>

            {/* Gender & Identity Section */}
            <div className="col-span-2">
              <p className="text-[10px] font-medium text-gray-600 mb-1">Gender & Identity</p>
              <div className="grid grid-cols-2 gap-x-3 gap-y-1.5">
                <div>
                  <div className="flex items-center gap-0.5">
                    <IdentificationIcon className="w-2.5 h-2.5 text-gray-400" />
                    <p className="text-[10px] text-gray-500">Birth Sex</p>
                  </div>
                  <p className="text-xs pl-3">{currentDemographicData.birthSex}</p>
                </div>
                <div>
                  <div className="flex items-center gap-0.5">
                    <IdentificationIcon className="w-2.5 h-2.5 text-gray-400" />
                    <p className="text-[10px] text-gray-500">Gender</p>
                  </div>
                  <p className="text-xs pl-3">{currentDemographicData.gender}</p>
                </div>
                <div>
                  <div className="flex items-center gap-0.5">
                    <BuildingOfficeIcon className="w-2.5 h-2.5 text-gray-400" />
                    <p className="text-[10px] text-gray-500">Gender Identity</p>
                  </div>
                  <p className="text-xs pl-3">{currentDemographicData.genderIdentity}</p>
                  <p className="text-[10px] pl-3 text-gray-500">Pronouns: {currentDemographicData.pronouns}</p>
                </div>
                <div>
                  <div className="flex items-center gap-0.5">
                    <GlobeAmericasIcon className="w-2.5 h-2.5 text-gray-400" />
                    <p className="text-[10px] text-gray-500">Race/Ethnicity</p>
                  </div>
                  <p className="text-xs pl-3">{currentDemographicData.race}</p>
                  <p className="text-[10px] pl-3 text-gray-500">{currentDemographicData.ethnicity}</p>
                </div>
              </div>
            </div>

            {/* Language & Culture Section */}
            <div className="col-span-2">
              <p className="text-[10px] font-medium text-gray-600 mb-1">Language & Culture</p>
              <div className="grid grid-cols-2 gap-x-3 gap-y-1.5">
                <div>
                  <div className="flex items-center gap-0.5">
                    <LanguageIcon className="w-2.5 h-2.5 text-gray-400" />
                    <p className="text-[10px] text-gray-500">Language</p>
                  </div>
                  <p className="text-xs pl-3">{currentDemographicData.language}</p>
                  {currentDemographicData.preferredLanguage !== currentDemographicData.language && (
                    <p className="text-[10px] pl-3 text-gray-500">Preferred: {currentDemographicData.preferredLanguage}</p>
                  )}
                </div>
                <div>
                  <div className="flex items-center gap-0.5">
                    <HeartIcon className="w-2.5 h-2.5 text-gray-400" />
                    <p className="text-[10px] text-gray-500">Religion</p>
                  </div>
                  <p className="text-xs pl-3">{currentDemographicData.religion}</p>
                </div>
              </div>
            </div>

            {/* Social Status Section */}
            <div className="col-span-2">
              <p className="text-[10px] font-medium text-gray-600 mb-1">Social Status</p>
              <div className="grid grid-cols-2 gap-x-3 gap-y-1.5">
                <div>
                  <div className="flex items-center gap-0.5">
                    <HeartIcon className="w-2.5 h-2.5 text-gray-400" />
                    <p className="text-[10px] text-gray-500">Marital Status</p>
                  </div>
                  <p className="text-xs pl-3">{currentDemographicData.maritalStatus}</p>
                </div>
                <div>
                  <div className="flex items-center gap-0.5">
                    <HomeIcon className="w-2.5 h-2.5 text-gray-400" />
                    <p className="text-[10px] text-gray-500">Living Arrangement</p>
                  </div>
                  <p className="text-xs pl-3">{currentDemographicData.livingArrangement}</p>
                  <p className="text-[10px] pl-3 text-gray-500">Family Size: {currentDemographicData.familySize}</p>
                </div>
              </div>
            </div>

            {/* Employment & Education Section */}
            <div className="col-span-2">
              <p className="text-[10px] font-medium text-gray-600 mb-1">Employment & Education</p>
              <div className="grid grid-cols-2 gap-x-3 gap-y-1.5">
                <div>
                  <div className="flex items-center gap-0.5">
                    <BriefcaseIcon className="w-2.5 h-2.5 text-gray-400" />
                    <p className="text-[10px] text-gray-500">Employment</p>
                  </div>
                  <p className="text-xs pl-3">{currentDemographicData.employmentStatus}</p>
                  <p className="text-[10px] pl-3 text-gray-500">{currentDemographicData.occupation}</p>
                  <p className="text-[10px] pl-3 text-gray-500">{currentDemographicData.employer}</p>
                </div>
                <div>
                  <div className="flex items-center gap-0.5">
                    <AcademicCapIcon className="w-2.5 h-2.5 text-gray-400" />
                    <p className="text-[10px] text-gray-500">Education</p>
                  </div>
                  <p className="text-xs pl-3">{currentDemographicData.educationLevel}</p>
                  <p className="text-[10px] pl-3 text-gray-500">{currentDemographicData.schoolName}</p>
                  <p className="text-[10px] pl-3 text-gray-500">Class of {currentDemographicData.graduationYear}</p>
                </div>
              </div>
            </div>

            {/* Care Team Section */}
            <div className="col-span-2">
              <p className="text-[10px] font-medium text-gray-600 mb-1">Care Preferences</p>
              <div className="grid grid-cols-2 gap-x-3 gap-y-1.5">
                <div>
                  <div className="flex items-center gap-0.5">
                    <UserIcon className="w-2.5 h-2.5 text-gray-400" />
                    <p className="text-[10px] text-gray-500">Preferred Provider</p>
                  </div>
                  <p className="text-xs pl-3">{currentDemographicData.preferredProvider}</p>
                </div>
                <div>
                  <div className="flex items-center gap-0.5">
                    <BuildingOfficeIcon className="w-2.5 h-2.5 text-gray-400" />
                    <p className="text-[10px] text-gray-500">Preferred Pharmacy</p>
                  </div>
                  <p className="text-xs pl-3">{currentDemographicData.preferredPharmacy}</p>
                </div>
              </div>
            </div>

            {/* Emergency Contact Section */}
            <div className="col-span-2">
              <p className="text-[10px] font-medium text-gray-600 mb-1">Emergency Contact</p>
              <div className="grid grid-cols-2 gap-x-3 gap-y-1.5">
                <div>
                  <div className="flex items-center gap-0.5">
                    <UserIcon className="w-2.5 h-2.5 text-gray-400" />
                    <p className="text-[10px] text-gray-500">Name & Relationship</p>
                  </div>
                  <p className="text-xs pl-3">{currentDemographicData.emergencyContact.name}</p>
                  <p className="text-[10px] pl-3 text-gray-500">{currentDemographicData.emergencyContact.relationship}</p>
                </div>
                <div>
                  <div className="flex items-center gap-0.5">
                    <PhoneIcon className="w-2.5 h-2.5 text-gray-400" />
                    <p className="text-[10px] text-gray-500">Phone</p>
                  </div>
                  <p className="text-xs pl-3">{currentDemographicData.emergencyContact.phone}</p>
                </div>
              </div>
            </div>

            {/* Restrictions Section */}
            {currentDemographicData.restrictions?.hasFirearmRestriction && (
              <div className="col-span-2">
                <div className="flex items-center gap-0.5">
                  <ExclamationTriangleIcon className="w-2.5 h-2.5 text-red-500" />
                  <p className="text-[10px] text-red-500">Firearm Restriction until {currentDemographicData.restrictions.restrictionDate}</p>
                </div>
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="contact" className="mt-1.5">
          <div className="space-y-2">
            <div className="bg-white border border-gray-200 rounded-lg p-3">
              <h4 className="text-[10px] font-medium text-gray-600 mb-2 flex items-center gap-1">
                <HomeIcon className="w-3 h-3" />
                Address Information
              </h4>
              <div className="grid grid-cols-2 gap-x-3 gap-y-1.5">
                <div>
                  <p className="text-[9px] text-gray-500">Street Address</p>
                  <p className="text-[10px] font-medium">{currentDemographicData.address}</p>
                </div>
                <div>
                  <p className="text-[9px] text-gray-500">City</p>
                  <p className="text-[10px] font-medium">{currentDemographicData.city}</p>
                </div>
                <div>
                  <p className="text-[9px] text-gray-500">State</p>
                  <p className="text-[10px] font-medium">{currentDemographicData.state}</p>
                </div>
                <div>
                  <p className="text-[9px] text-gray-500">ZIP Code</p>
                  <p className="text-[10px] font-medium">{currentDemographicData.zipCode}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white border border-gray-200 rounded-lg p-3">
              <h4 className="text-[10px] font-medium text-gray-600 mb-2 flex items-center gap-1">
                <PhoneIcon className="w-3 h-3" />
                Phone Numbers
              </h4>
              <div className="grid grid-cols-1 gap-1.5">
                <div className="flex justify-between">
                  <span className="text-[9px] text-gray-500">Mobile:</span>
                  <span className="text-[10px] font-medium">{currentDemographicData.phone.mobile}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[9px] text-gray-500">Home:</span>
                  <span className="text-[10px] font-medium">{currentDemographicData.phone.home}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[9px] text-gray-500">Work:</span>
                  <span className="text-[10px] font-medium">{currentDemographicData.phone.work}</span>
                </div>
              </div>
            </div>
            
            <div className="bg-white border border-gray-200 rounded-lg p-3">
              <h4 className="text-[10px] font-medium text-gray-600 mb-2 flex items-center gap-1">
                <EnvelopeIcon className="w-3 h-3" />
                Email
              </h4>
              <p className="text-[10px] font-medium">{currentDemographicData.email}</p>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="choices" className="mt-1.5">
          <div className="space-y-2">
            <div className="bg-white border border-gray-200 rounded-lg p-3">
              <h4 className="text-[10px] font-medium text-gray-600 mb-2">Personal Choices & Preferences</h4>
              <div className="grid grid-cols-2 gap-x-3 gap-y-1.5">
                <div>
                  <p className="text-[9px] text-gray-500">Preferred Language</p>
                  <p className="text-[10px] font-medium">{currentDemographicData.preferredLanguage}</p>
                </div>
                <div>
                  <p className="text-[9px] text-gray-500">Religion</p>
                  <p className="text-[10px] font-medium">{currentDemographicData.religion}</p>
                </div>
                <div>
                  <p className="text-[9px] text-gray-500">Preferred Pharmacy</p>
                  <p className="text-[10px] font-medium">{currentDemographicData.preferredPharmacy}</p>
                </div>
                <div>
                  <p className="text-[9px] text-gray-500">Preferred Provider</p>
                  <p className="text-[10px] font-medium">{currentDemographicData.preferredProvider}</p>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="employer" className="mt-1.5">
          <div className="space-y-2">
            <div className="bg-white border border-gray-200 rounded-lg p-3">
              <h4 className="text-[10px] font-medium text-gray-600 mb-2 flex items-center gap-1">
                <BriefcaseIcon className="w-3 h-3" />
                Employment Information
              </h4>
              <div className="grid grid-cols-2 gap-x-3 gap-y-1.5">
                <div>
                  <p className="text-[9px] text-gray-500">Employment Status</p>
                  <p className="text-[10px] font-medium">{currentDemographicData.employmentStatus}</p>
                </div>
                <div>
                  <p className="text-[9px] text-gray-500">Occupation</p>
                  <p className="text-[10px] font-medium">{currentDemographicData.occupation}</p>
                </div>
                <div>
                  <p className="text-[9px] text-gray-500">Employer</p>
                  <p className="text-[10px] font-medium">{currentDemographicData.employer}</p>
                </div>
                <div>
                  <p className="text-[9px] text-gray-500">Work Status</p>
                  <p className="text-[10px] font-medium">{currentDemographicData.workStatus}</p>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="stats" className="mt-1.5">
          <div className="space-y-2">
            <div className="bg-white border border-gray-200 rounded-lg p-3">
              <h4 className="text-[10px] font-medium text-gray-600 mb-2">Demographics & Statistics</h4>
              <div className="grid grid-cols-2 gap-x-3 gap-y-1.5">
                <div>
                  <p className="text-[9px] text-gray-500">Race</p>
                  <p className="text-[10px] font-medium">{currentDemographicData.race}</p>
                </div>
                <div>
                  <p className="text-[9px] text-gray-500">Ethnicity</p>
                  <p className="text-[10px] font-medium">{currentDemographicData.ethnicity}</p>
                </div>
                <div>
                  <p className="text-[9px] text-gray-500">Marital Status</p>
                  <p className="text-[10px] font-medium">{currentDemographicData.maritalStatus}</p>
                </div>
                <div>
                  <p className="text-[9px] text-gray-500">Family Size</p>
                  <p className="text-[10px] font-medium">{currentDemographicData.familySize}</p>
                </div>
                <div>
                  <p className="text-[9px] text-gray-500">Housing Status</p>
                  <p className="text-[10px] font-medium">{currentDemographicData.housingStatus}</p>
                </div>
                <div>
                  <p className="text-[9px] text-gray-500">Veteran Status</p>
                  <p className="text-[10px] font-medium">{currentDemographicData.veteranStatus}</p>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="misc" className="mt-1.5">
          <div className="space-y-2">
            <div className="bg-white border border-gray-200 rounded-lg p-3">
              <h4 className="text-[10px] font-medium text-gray-600 mb-2">Miscellaneous Information</h4>
              <div className="grid grid-cols-2 gap-x-3 gap-y-1.5">
                <div>
                  <p className="text-[9px] text-gray-500">Place of Birth</p>
                  <p className="text-[10px] font-medium">{currentDemographicData.placeOfBirth}</p>
                </div>
                <div>
                  <p className="text-[9px] text-gray-500">Citizenship</p>
                  <p className="text-[10px] font-medium">{currentDemographicData.citizenship}</p>
                </div>
                <div>
                  <p className="text-[9px] text-gray-500">Education Level</p>
                  <p className="text-[10px] font-medium">{currentDemographicData.educationLevel}</p>
                </div>
                <div>
                  <p className="text-[9px] text-gray-500">School Name</p>
                  <p className="text-[10px] font-medium">{currentDemographicData.schoolName}</p>
                </div>
              </div>
            </div>
            
            {/* Alerts Section */}
            {currentDemographicData.alerts.length > 0 && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                <h4 className="text-[10px] font-medium text-yellow-800 mb-2 flex items-center gap-1">
                  <ExclamationTriangleIcon className="w-3 h-3" />
                  Active Alerts
                </h4>
                <div className="space-y-1">
                  {currentDemographicData.alerts.map((alert, index) => (
                    <Badge key={index} variant="outline" className="text-[9px] bg-yellow-100 text-yellow-800 border-yellow-300">
                      {alert}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="pregnancy" className="mt-1.5">
          <div className="space-y-2">
            <div className="bg-white border border-gray-200 rounded-lg p-3">
              <h4 className="text-[10px] font-medium text-gray-600 mb-2 flex items-center gap-1">
                <HeartIcon className="w-3 h-3" />
                Pregnancy Information
              </h4>
              <div className="text-center py-4">
                <p className="text-[10px] text-gray-500">No pregnancy information available</p>
                <p className="text-[9px] text-gray-400 mt-1">Patient gender: {currentDemographicData.gender}</p>
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="duii2" className="mt-1.5">
          <div className="space-y-2">
            <div className="bg-white border border-gray-200 rounded-lg p-3">
              <h4 className="text-[10px] font-medium text-gray-600 mb-2">DUII Assessment</h4>
              <div className="text-center py-4">
                <p className="text-[10px] text-gray-500">No DUII assessment data available</p>
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="legal" className="mt-1.5">
          <div className="space-y-2">
            <div className="bg-white border border-gray-200 rounded-lg p-3">
              <h4 className="text-[10px] font-medium text-gray-600 mb-2">Legal Information</h4>
              <div className="grid grid-cols-1 gap-1.5">
                {currentDemographicData.restrictions?.hasFirearmRestriction && (
                  <div className="bg-red-50 border border-red-200 rounded p-2">
                    <div className="flex items-center gap-2">
                      <ExclamationTriangleIcon className="w-3 h-3 text-red-600" />
                      <div>
                        <p className="text-[10px] font-medium text-red-800">Firearm Restriction</p>
                        <p className="text-[9px] text-red-600">Until: {currentDemographicData.restrictions.restrictionDate}</p>
                      </div>
                    </div>
                  </div>
                )}
                <div className="text-center py-2">
                  <p className="text-[10px] text-gray-500">No additional legal information</p>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="other_contacts" className="mt-1.5">
          <div className="space-y-2">
            <div className="bg-white border border-gray-200 rounded-lg p-3">
              <h4 className="text-[10px] font-medium text-gray-600 mb-2">Emergency Contact</h4>
              <div className="grid grid-cols-2 gap-x-3 gap-y-1.5">
                <div>
                  <p className="text-[9px] text-gray-500">Name</p>
                  <p className="text-[10px] font-medium">{currentDemographicData.emergencyContact.name}</p>
                </div>
                <div>
                  <p className="text-[9px] text-gray-500">Relationship</p>
                  <p className="text-[10px] font-medium">{currentDemographicData.emergencyContact.relationship}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-[9px] text-gray-500">Phone</p>
                  <p className="text-[10px] font-medium">{currentDemographicData.emergencyContact.phone}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white border border-gray-200 rounded-lg p-3">
              <h4 className="text-[10px] font-medium text-gray-600 mb-2">Care Team</h4>
              <div className="space-y-1">
                {currentDemographicData.careTeam.map((member, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <UserIcon className="w-3 h-3 text-gray-400" />
                    <p className="text-[10px]">{member}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="birth_history" className="mt-1.5">
          <div className="space-y-2">
            <div className="bg-white border border-gray-200 rounded-lg p-3">
              <h4 className="text-[10px] font-medium text-gray-600 mb-2">Birth History</h4>
              <div className="grid grid-cols-2 gap-x-3 gap-y-1.5">
                <div>
                  <p className="text-[9px] text-gray-500">Date of Birth</p>
                  <p className="text-[10px] font-medium">{currentDemographicData.dob}</p>
                </div>
                <div>
                  <p className="text-[9px] text-gray-500">Place of Birth</p>
                  <p className="text-[10px] font-medium">{currentDemographicData.placeOfBirth}</p>
                </div>
                <div>
                  <p className="text-[9px] text-gray-500">Birth Sex</p>
                  <p className="text-[10px] font-medium">{currentDemographicData.birthSex}</p>
                </div>
                <div>
                  <p className="text-[9px] text-gray-500">Current Age</p>
                  <p className="text-[10px] font-medium">{currentDemographicData.age} years</p>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="screening_tool" className="mt-1.5">
          <div className="space-y-2">
            <div className="bg-white border border-gray-200 rounded-lg p-3">
              <h4 className="text-[10px] font-medium text-gray-600 mb-2">Screening Tools</h4>
              <div className="text-center py-4">
                <p className="text-[10px] text-gray-500">No screening assessments completed</p>
                <p className="text-[9px] text-gray-400 mt-1">Available tools: PHQ-9, GAD-7, AUDIT</p>
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="roads" className="mt-1.5">
          <div className="space-y-2">
            <div className="bg-white border border-gray-200 rounded-lg p-3">
              <h4 className="text-[10px] font-medium text-gray-600 mb-2">ROADS Assessment</h4>
              <div className="text-center py-4">
                <p className="text-[10px] text-gray-500">No ROADS assessment data available</p>
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="mcrt" className="mt-1.5">
          <div className="space-y-2">
            <div className="bg-white border border-gray-200 rounded-lg p-3">
              <h4 className="text-[10px] font-medium text-gray-600 mb-2">MCRT Information</h4>
              <div className="text-center py-4">
                <p className="text-[10px] text-gray-500">No MCRT data available</p>
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="ids" className="mt-1.5">
          <div className="space-y-1">
            <div>
              <div className="flex items-center gap-0.5">
                <HomeIcon className="w-2.5 h-2.5 text-gray-400" />
                <p className="text-[10px] text-gray-500">Address</p>
              </div>
              <p className="text-xs pl-3">{currentDemographicData.address}</p>
              <p className="text-xs pl-3">{`${currentDemographicData.city}, ${currentDemographicData.state} ${currentDemographicData.zipCode}`}</p>
              <p className="text-xs pl-3">{currentDemographicData.country}</p>
            </div>
            <div>
              <div className="flex items-center gap-0.5">
                <PhoneIcon className="w-2.5 h-2.5 text-gray-400" />
                <p className="text-[10px] text-gray-500">Phone</p>
              </div>
              <div className="grid grid-cols-3 gap-x-2 pl-3">
                <div>
                  <p className="text-[9px] text-gray-500">Mobile</p>
                  <p className="text-xs">{currentDemographicData.phone.mobile}</p>
                </div>
                <div>
                  <p className="text-[9px] text-gray-500">Home</p>
                  <p className="text-xs">{currentDemographicData.phone.home}</p>
                </div>
                <div>
                  <p className="text-[9px] text-gray-500">Work</p>
                  <p className="text-xs">{currentDemographicData.phone.work}</p>
                </div>
              </div>
            </div>
            <div>
              <div className="flex items-center gap-0.5">
                <EnvelopeIcon className="w-2.5 h-2.5 text-gray-400" />
                <p className="text-[10px] text-gray-500">Email</p>
              </div>
              <p className="text-xs pl-3">{currentDemographicData.email}</p>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="ids" className="mt-1.5">
          <div className="space-y-1">
            <div>
              <div className="flex items-center gap-0.5">
                <HashtagIcon className="w-2.5 h-2.5 text-gray-400" />
                <p className="text-[10px] text-gray-500">MRN</p>
              </div>
              <p className="text-xs pl-3 font-medium">{currentDemographicData.identifiers.mrn}</p>
            </div>
            <div>
              <div className="flex items-center gap-0.5">
                <IdentificationIcon className="w-2.5 h-2.5 text-gray-400" />
                <p className="text-[10px] text-gray-500">SSN</p>
              </div>
              <p className="text-xs pl-3 font-medium">{currentDemographicData.identifiers.ssn}</p>
            </div>
            <div>
              <div className="flex items-center gap-0.5">
                <BriefcaseIcon className="w-2.5 h-2.5 text-gray-400" />
                <p className="text-[10px] text-gray-500">Medicaid ID</p>
              </div>
              <p className="text-xs pl-3 font-medium">{currentDemographicData.identifiers.medicaidId}</p>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );

  const renderFullscreenView = () => (
    <div className="space-y-4 h-full overflow-y-auto flex flex-col items-start">
      {/* Alerts Section */}
      {currentDemographicData.alerts.length > 0 && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex items-center gap-3">
            <ExclamationTriangleIcon className="w-6 h-6 text-yellow-600" />
            <div className="flex-1">
              <p className="text-sm font-medium text-yellow-800">Important Patient Alerts</p>
              <p className="text-sm text-yellow-700 mt-1">
                {currentDemographicData.alerts.join(' • ')}
              </p>
            </div>
          </div>
        </div>
      )}

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
      {/* Primary Tabs Row */}
      <TabsList className="bg-gray-100/80 p-0.5 h-10 rounded-lg grid w-full grid-cols-7 gap-1 sticky top-0 z-10 mb-2">
        <TabsTrigger value="who" className="text-sm px-2 rounded data-[state=active]:bg-blue-500 data-[state=active]:text-white">WHO</TabsTrigger>
        <TabsTrigger value="contact" className="text-sm px-2 rounded data-[state=active]:bg-blue-500 data-[state=active]:text-white">CONTACT</TabsTrigger>
        <TabsTrigger value="choices" className="text-sm px-2 rounded data-[state=active]:bg-blue-500 data-[state=active]:text-white">CHOICES</TabsTrigger>
        <TabsTrigger value="employer" className="text-sm px-2 rounded data-[state=active]:bg-blue-500 data-[state=active]:text-white">EMPLOYER</TabsTrigger>
        <TabsTrigger value="stats" className="text-sm px-2 rounded data-[state=active]:bg-blue-500 data-[state=active]:text-white">STATS</TabsTrigger>
        <TabsTrigger value="misc" className="text-sm px-2 rounded data-[state=active]:bg-blue-500 data-[state=active]:text-white">MISC</TabsTrigger>
        <TabsTrigger value="pregnancy" className="text-sm px-2 rounded data-[state=active]:bg-blue-500 data-[state=active]:text-white">PREGNANCY</TabsTrigger>
      </TabsList>

      {/* Secondary Tabs Row */}
      <TabsList className="bg-gray-100/80 p-0.5 h-10 rounded-lg grid w-full grid-cols-6 gap-1 sticky top-12 z-10 mb-2">
        <TabsTrigger value="duii2" className="text-sm px-2 rounded data-[state=active]:bg-blue-500 data-[state=active]:text-white">DUII2</TabsTrigger>
        <TabsTrigger value="legal" className="text-sm px-2 rounded data-[state=active]:bg-blue-500 data-[state=active]:text-white">LEGAL</TabsTrigger>
        <TabsTrigger value="other_contacts" className="text-xs px-1 rounded data-[state=active]:bg-blue-500 data-[state=active]:text-white">OTHER CONTACTS</TabsTrigger>
        <TabsTrigger value="birth_history" className="text-xs px-1 rounded data-[state=active]:bg-blue-500 data-[state=active]:text-white">BIRTH HISTORY</TabsTrigger>
        <TabsTrigger value="screening_tool" className="text-xs px-1 rounded data-[state=active]:bg-blue-500 data-[state=active]:text-white">SCREENING TOOL</TabsTrigger>
        <TabsTrigger value="roads" className="text-sm px-2 rounded data-[state=active]:bg-blue-500 data-[state=active]:text-white">ROADS</TabsTrigger>
      </TabsList>

      {/* Additional Tab */}
      <TabsList className="bg-gray-100/80 p-0.5 h-10 rounded-lg grid w-full grid-cols-1 gap-1 sticky top-24 z-10 mb-4">
        <TabsTrigger value="mcrt" className="text-sm px-2 rounded data-[state=active]:bg-blue-500 data-[state=active]:text-white">MCRT</TabsTrigger>
      </TabsList>

        <TabsContent value="who" className="mt-4">
          <div className="bg-white rounded-lg p-6 border border-gray-200">
            <div className="flex items-center gap-3 mb-6">
              <UserIcon className="w-6 h-6 text-blue-600" />
              <h3 className="text-xl font-semibold">WHO - Personal Information</h3>
            </div>
            <div className="grid grid-cols-4 gap-6">
              <div>
                <label className="text-sm font-medium text-gray-500">Legal Name</label>
                <p className="text-base font-medium">{currentDemographicData.name}</p>
                <p className="text-sm text-gray-500 mt-1">Preferred: {currentDemographicData.preferredName}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Date of Birth</label>
                <p className="text-base">{currentDemographicData.dob}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Birth Sex</label>
                <p className="text-base">{currentDemographicData.birthSex}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Gender</label>
                <p className="text-base">{currentDemographicData.gender}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Gender Identity</label>
                <p className="text-base">{currentDemographicData.genderIdentity}</p>
                <p className="text-sm text-gray-500 mt-1">Pronouns: {currentDemographicData.pronouns}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Age</label>
                <p className="text-base">32 years old</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">MRN #</label>
                <p className="text-base font-mono">{currentDemographicData.identifiers.mrn}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">SSN</label>
                <p className="text-base font-mono">{currentDemographicData.identifiers.ssn}</p>
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="contact" className="mt-4">
          <div className="bg-white rounded-lg p-6 border border-gray-200">
            <div className="flex items-center gap-3 mb-6">
              <PhoneIcon className="w-6 h-6 text-blue-600" />
              <h3 className="text-xl font-semibold">CONTACT - Address & Communication</h3>
            </div>
            <div className="grid grid-cols-2 gap-8">
              <div>
                <label className="text-sm font-medium text-gray-500">Primary Address</label>
                <div className="mt-2">
                  <p className="text-base">{currentDemographicData.address}</p>
                  <p className="text-base">{`${currentDemographicData.city}, ${currentDemographicData.state} ${currentDemographicData.zipCode}`}</p>
                  <p className="text-base">{currentDemographicData.country}</p>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Phone Numbers</label>
                <div className="mt-2 space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">Mobile:</span>
                    <span className="text-base font-mono">{currentDemographicData.phone.mobile}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">Home:</span>
                    <span className="text-base font-mono">{currentDemographicData.phone.home}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">Work:</span>
                    <span className="text-base font-mono">{currentDemographicData.phone.work}</span>
                  </div>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Email Address</label>
                <p className="text-base mt-2">{currentDemographicData.email}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Preferred Contact Method</label>
                <p className="text-base mt-2">Mobile Phone</p>
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="choices" className="mt-4">
          <div className="bg-white rounded-lg p-6 border border-gray-200">
            <div className="flex items-center gap-3 mb-6">
              <Cog6ToothIcon className="w-6 h-6 text-blue-600" />
              <h3 className="text-xl font-semibold">CHOICES - Preferences & Settings</h3>
            </div>
            <div className="grid grid-cols-3 gap-6">
              <div>
                <label className="text-sm font-medium text-gray-500">Primary Language</label>
                <p className="text-base mt-2">{currentDemographicData.language}</p>
                {currentDemographicData.preferredLanguage !== currentDemographicData.language && (
                  <p className="text-sm text-gray-500 mt-1">Preferred: {currentDemographicData.preferredLanguage}</p>
                )}
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Religion</label>
                <p className="text-base mt-2">{currentDemographicData.religion}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Pharmacy</label>
                <p className="text-base mt-2">CVS Pharmacy - Main St</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Communication Preference</label>
                <p className="text-base mt-2">Phone calls preferred</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Interpreter Needed</label>
                <p className="text-base mt-2">No</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Portal Access</label>
                <p className="text-base mt-2">Active</p>
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="employer" className="mt-4">
          <div className="bg-white rounded-lg p-6 border border-gray-200">
            <div className="flex items-center gap-3 mb-6">
              <BuildingOfficeIcon className="w-6 h-6 text-blue-600" />
              <h3 className="text-xl font-semibold">EMPLOYER - Employment Information</h3>
            </div>
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="text-sm font-medium text-gray-500">Employment Status</label>
                <p className="text-base mt-2">{currentDemographicData.employmentStatus}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Occupation</label>
                <p className="text-base mt-2">{currentDemographicData.occupation}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Employer Name</label>
                <p className="text-base mt-2">Tech Solutions Inc.</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Work Phone</label>
                <p className="text-base mt-2 font-mono">{currentDemographicData.phone.work}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Education Level</label>
                <p className="text-base mt-2">{currentDemographicData.educationLevel}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Income Level</label>
                <p className="text-base mt-2">Not specified</p>
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="stats" className="mt-4">
          <div className="bg-white rounded-lg p-6 border border-gray-200">
            <div className="flex items-center gap-3 mb-6">
              <ChartBarIcon className="w-6 h-6 text-blue-600" />
              <h3 className="text-xl font-semibold">STATS - Demographics & Statistics</h3>
            </div>
            <div className="grid grid-cols-3 gap-6">
              <div>
                <label className="text-sm font-medium text-gray-500">Race</label>
                <p className="text-base mt-2">{currentDemographicData.race}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Ethnicity</label>
                <p className="text-base mt-2">{currentDemographicData.ethnicity}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Marital Status</label>
                <p className="text-base mt-2">{currentDemographicData.maritalStatus}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Housing Status</label>
                <p className="text-base mt-2">Stable Housing</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Veteran Status</label>
                <p className="text-base mt-2">Non-veteran</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Disability Status</label>
                <p className="text-base mt-2">None reported</p>
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="misc" className="mt-4">
          <div className="bg-white rounded-lg p-6 border border-gray-200">
            <div className="flex items-center gap-3 mb-6">
              <InformationCircleIcon className="w-6 h-6 text-blue-600" />
              <h3 className="text-xl font-semibold">MISC - Miscellaneous Information</h3>
            </div>
            {/* Active Alerts */}
            {currentDemographicData.alerts.length > 0 && (
              <div className="mb-6">
                <h4 className="text-lg font-medium mb-3 text-red-600">Active Alerts</h4>
                <div className="space-y-2">
                  {currentDemographicData.alerts.map((alert, index) => (
                    <div key={index} className="flex items-center gap-3 p-3 bg-red-50 border border-red-200 rounded-lg">
                      <ExclamationTriangleIcon className="w-5 h-5 text-red-600" />
                      <Badge variant="destructive" className="text-xs">{alert}</Badge>
                    </div>
                  ))}
                </div>
              </div>
            )}
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="text-sm font-medium text-gray-500">Special Notes</label>
                <p className="text-base mt-2">Patient requires wheelchair access</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Advance Directives</label>
                <p className="text-base mt-2">On file</p>
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="pregnancy" className="mt-4">
          <div className="bg-white rounded-lg p-6 border border-gray-200">
            <div className="flex items-center gap-3 mb-6">
              <HeartIcon className="w-6 h-6 text-blue-600" />
              <h3 className="text-xl font-semibold">PREGNANCY - Pregnancy Information</h3>
            </div>
            <div className="text-center py-8">
              <p className="text-lg text-gray-500">N/A - Patient is male</p>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="legal" className="mt-4">
          <div className="bg-white rounded-lg p-6 border border-gray-200">
            <div className="flex items-center gap-3 mb-6">
              <ScaleIcon className="w-6 h-6 text-blue-600" />
              <h3 className="text-xl font-semibold">LEGAL - Legal Information & Restrictions</h3>
            </div>
            {currentDemographicData.restrictions?.hasFirearmRestriction && (
              <div className="mb-6">
                <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-lg">
                  <ExclamationTriangleIcon className="w-6 h-6 text-red-600" />
                  <div>
                    <p className="text-lg font-medium text-red-800">Firearm Restriction Active</p>
                    <p className="text-sm text-red-600">Restriction until {currentDemographicData.restrictions.restrictionDate}</p>
                  </div>
                </div>
              </div>
            )}
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="text-sm font-medium text-gray-500">Legal Guardian</label>
                <p className="text-base mt-2">Self</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Power of Attorney</label>
                <p className="text-base mt-2">None on file</p>
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="other_contacts" className="mt-4">
          <div className="bg-white rounded-lg p-6 border border-gray-200">
            <div className="flex items-center gap-3 mb-6">
              <UsersIcon className="w-6 h-6 text-blue-600" />
              <h3 className="text-xl font-semibold">OTHER CONTACTS - Emergency & Care Team</h3>
            </div>
            <div className="space-y-6">
              <div>
                <h4 className="text-lg font-medium mb-3">Emergency Contact</h4>
                <div className="grid grid-cols-1 gap-4">
                  <div className="p-4 border border-gray-200 rounded-lg">
                    <p className="font-medium">{currentDemographicData.emergencyContact.name}</p>
                    <p className="text-sm text-gray-500">{currentDemographicData.emergencyContact.relationship}</p>
                    <p className="text-sm font-mono">{currentDemographicData.emergencyContact.phone}</p>
                  </div>
                </div>
              </div>
              <div>
                <h4 className="text-lg font-medium mb-3">Care Team</h4>
                <div className="grid grid-cols-2 gap-4">
                  {currentDemographicData.careTeam.map((member: string, index: number) => (
                    <div key={index} className="p-4 border border-gray-200 rounded-lg">
                      <p className="font-medium">{member}</p>
                      <p className="text-sm text-gray-500">Healthcare Provider</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="birth_history" className="mt-4">
          <div className="bg-white rounded-lg p-6 border border-gray-200">
            <div className="flex items-center gap-3 mb-6">
              <CalendarIcon className="w-6 h-6 text-blue-600" />
              <h3 className="text-xl font-semibold">BIRTH HISTORY - Birth Details</h3>
            </div>
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="text-sm font-medium text-gray-500">Date of Birth</label>
                <p className="text-base mt-2">{currentDemographicData.dob}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Current Age</label>
                <p className="text-base mt-2">32 years old</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Birth Place</label>
                <p className="text-base mt-2">Portland, Oregon</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Birth Weight</label>
                <p className="text-base mt-2">7 lbs 3 oz</p>
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="duii2" className="mt-4">
          <div className="bg-white rounded-lg p-6 border border-gray-200">
            <div className="flex items-center gap-3 mb-6">
              <DocumentTextIcon className="w-6 h-6 text-blue-600" />
              <h3 className="text-xl font-semibold">DUII2 - Assessment Tool</h3>
            </div>
            <div className="text-center py-8">
              <p className="text-lg text-gray-500">No DUII2 assessment completed</p>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="screening_tool" className="mt-4">
          <div className="bg-white rounded-lg p-6 border border-gray-200">
            <div className="flex items-center gap-3 mb-6">
              <ClipboardDocumentCheckIcon className="w-6 h-6 text-blue-600" />
              <h3 className="text-xl font-semibold">SCREENING TOOL - Health Screening</h3>
            </div>
            <div className="text-center py-8">
              <p className="text-lg text-gray-500">No screening assessments completed</p>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="roads" className="mt-4">
          <div className="bg-white rounded-lg p-6 border border-gray-200">
            <div className="flex items-center gap-3 mb-6">
              <TruckIcon className="w-6 h-6 text-blue-600" />
              <h3 className="text-xl font-semibold">ROADS - Assessment</h3>
            </div>
            <div className="text-center py-8">
              <p className="text-lg text-gray-500">No ROADS assessment completed</p>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="mcrt" className="mt-4">
          <div className="bg-white rounded-lg p-6 border border-gray-200">
            <div className="flex items-center gap-3 mb-6">
              <CpuChipIcon className="w-6 h-6 text-blue-600" />
              <h3 className="text-xl font-semibold">MCRT - Assessment Tool</h3>
            </div>
            <div className="text-center py-8">
              <p className="text-lg text-gray-500">No MCRT assessment completed</p>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );

  return (
    <>
      <div className="h-full">
        {isFullscreen ? renderFullscreenView() : renderCompactView()}
      </div>
      
      {/* Demographics Editor Modal */}
      <DemographicsEditor
        isOpen={isEditorOpen}
        onClose={() => setIsEditorOpen(false)}
        patientData={currentDemographicData}
        onSave={handleSave}
      />
    </>
  );
}; 