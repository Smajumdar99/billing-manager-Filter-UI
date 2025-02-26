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
  HashtagIcon
} from '@heroicons/react/24/outline';
import { Badge } from '@/components/atoms/Badge/badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/atoms/Tabs/tabs';

interface DemographicsWidgetProps {
  patientId: string;
  isFullscreen?: boolean;
}

export const DemographicsWidget: FC<DemographicsWidgetProps> = ({ patientId, isFullscreen = false }) => {
  const [activeTab, setActiveTab] = useState('basic');

  // Enhanced demographic info with more fields
  const demographicInfo = {
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

  const renderCompactView = () => (
    <div className="space-y-1.5 h-full overflow-y-auto">
      {/* Alerts Section */}
      {demographicInfo.alerts.length > 0 && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-1">
          <div className="flex items-center gap-1">
            <ExclamationTriangleIcon className="w-3 h-3 text-yellow-600 shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-[10px] font-medium text-yellow-800">
                {demographicInfo.alerts.join(' • ')}
              </p>
            </div>
          </div>
        </div>
      )}

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="bg-gray-100/80 p-0.5 h-8 rounded-lg grid w-full grid-cols-3 gap-1 sticky top-0 z-10">
          <TabsTrigger value="basic" className="text-[10px] rounded data-[state=active]:bg-white">Basic</TabsTrigger>
          <TabsTrigger value="contact" className="text-[10px] rounded data-[state=active]:bg-white">Contact</TabsTrigger>
          <TabsTrigger value="ids" className="text-[10px] rounded data-[state=active]:bg-white">IDs</TabsTrigger>
        </TabsList>

        <TabsContent value="basic" className="mt-1.5">
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
                  <p className="text-xs pl-3">{demographicInfo.name}</p>
                  <p className="text-[10px] pl-3 text-gray-500">Preferred: {demographicInfo.preferredName}</p>
                </div>
                <div>
                  <div className="flex items-center gap-0.5">
                    <CalendarIcon className="w-2.5 h-2.5 text-gray-400" />
                    <p className="text-[10px] text-gray-500">DOB</p>
                  </div>
                  <p className="text-xs pl-3">{demographicInfo.dob}</p>
                  <p className="text-[10px] pl-3 text-gray-500">Age: {demographicInfo.age}</p>
                </div>
                <div>
                  <div className="flex items-center gap-0.5">
                    <GlobeAltIcon className="w-2.5 h-2.5 text-gray-400" />
                    <p className="text-[10px] text-gray-500">Place of Birth</p>
                  </div>
                  <p className="text-xs pl-3">{demographicInfo.placeOfBirth}</p>
                </div>
                <div>
                  <div className="flex items-center gap-0.5">
                    <IdentificationIcon className="w-2.5 h-2.5 text-gray-400" />
                    <p className="text-[10px] text-gray-500">Citizenship</p>
                  </div>
                  <p className="text-xs pl-3">{demographicInfo.citizenship}</p>
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
                  <p className="text-xs pl-3">{demographicInfo.birthSex}</p>
                </div>
                <div>
                  <div className="flex items-center gap-0.5">
                    <IdentificationIcon className="w-2.5 h-2.5 text-gray-400" />
                    <p className="text-[10px] text-gray-500">Gender</p>
                  </div>
                  <p className="text-xs pl-3">{demographicInfo.gender}</p>
                </div>
                <div>
                  <div className="flex items-center gap-0.5">
                    <BuildingOfficeIcon className="w-2.5 h-2.5 text-gray-400" />
                    <p className="text-[10px] text-gray-500">Gender Identity</p>
                  </div>
                  <p className="text-xs pl-3">{demographicInfo.genderIdentity}</p>
                  <p className="text-[10px] pl-3 text-gray-500">Pronouns: {demographicInfo.pronouns}</p>
                </div>
                <div>
                  <div className="flex items-center gap-0.5">
                    <GlobeAmericasIcon className="w-2.5 h-2.5 text-gray-400" />
                    <p className="text-[10px] text-gray-500">Race/Ethnicity</p>
                  </div>
                  <p className="text-xs pl-3">{demographicInfo.race}</p>
                  <p className="text-[10px] pl-3 text-gray-500">{demographicInfo.ethnicity}</p>
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
                  <p className="text-xs pl-3">{demographicInfo.language}</p>
                  {demographicInfo.preferredLanguage !== demographicInfo.language && (
                    <p className="text-[10px] pl-3 text-gray-500">Preferred: {demographicInfo.preferredLanguage}</p>
                  )}
                </div>
                <div>
                  <div className="flex items-center gap-0.5">
                    <HeartIcon className="w-2.5 h-2.5 text-gray-400" />
                    <p className="text-[10px] text-gray-500">Religion</p>
                  </div>
                  <p className="text-xs pl-3">{demographicInfo.religion}</p>
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
                  <p className="text-xs pl-3">{demographicInfo.maritalStatus}</p>
                </div>
                <div>
                  <div className="flex items-center gap-0.5">
                    <HomeIcon className="w-2.5 h-2.5 text-gray-400" />
                    <p className="text-[10px] text-gray-500">Living Arrangement</p>
                  </div>
                  <p className="text-xs pl-3">{demographicInfo.livingArrangement}</p>
                  <p className="text-[10px] pl-3 text-gray-500">Family Size: {demographicInfo.familySize}</p>
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
                  <p className="text-xs pl-3">{demographicInfo.employmentStatus}</p>
                  <p className="text-[10px] pl-3 text-gray-500">{demographicInfo.occupation}</p>
                  <p className="text-[10px] pl-3 text-gray-500">{demographicInfo.employer}</p>
                </div>
                <div>
                  <div className="flex items-center gap-0.5">
                    <AcademicCapIcon className="w-2.5 h-2.5 text-gray-400" />
                    <p className="text-[10px] text-gray-500">Education</p>
                  </div>
                  <p className="text-xs pl-3">{demographicInfo.educationLevel}</p>
                  <p className="text-[10px] pl-3 text-gray-500">{demographicInfo.schoolName}</p>
                  <p className="text-[10px] pl-3 text-gray-500">Class of {demographicInfo.graduationYear}</p>
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
                  <p className="text-xs pl-3">{demographicInfo.preferredProvider}</p>
                </div>
                <div>
                  <div className="flex items-center gap-0.5">
                    <BuildingOfficeIcon className="w-2.5 h-2.5 text-gray-400" />
                    <p className="text-[10px] text-gray-500">Preferred Pharmacy</p>
                  </div>
                  <p className="text-xs pl-3">{demographicInfo.preferredPharmacy}</p>
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
                  <p className="text-xs pl-3">{demographicInfo.emergencyContact.name}</p>
                  <p className="text-[10px] pl-3 text-gray-500">{demographicInfo.emergencyContact.relationship}</p>
                </div>
                <div>
                  <div className="flex items-center gap-0.5">
                    <PhoneIcon className="w-2.5 h-2.5 text-gray-400" />
                    <p className="text-[10px] text-gray-500">Phone</p>
                  </div>
                  <p className="text-xs pl-3">{demographicInfo.emergencyContact.phone}</p>
                </div>
              </div>
            </div>

            {/* Restrictions Section */}
            {demographicInfo.restrictions?.hasFirearmRestriction && (
              <div className="col-span-2">
                <div className="flex items-center gap-0.5">
                  <ExclamationTriangleIcon className="w-2.5 h-2.5 text-red-500" />
                  <p className="text-[10px] text-red-500">Firearm Restriction until {demographicInfo.restrictions.restrictionDate}</p>
                </div>
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="contact" className="mt-1.5">
          <div className="space-y-1">
            <div>
              <div className="flex items-center gap-0.5">
                <HomeIcon className="w-2.5 h-2.5 text-gray-400" />
                <p className="text-[10px] text-gray-500">Address</p>
              </div>
              <p className="text-xs pl-3">{demographicInfo.address}</p>
              <p className="text-xs pl-3">{`${demographicInfo.city}, ${demographicInfo.state} ${demographicInfo.zipCode}`}</p>
              <p className="text-xs pl-3">{demographicInfo.country}</p>
            </div>
            <div>
              <div className="flex items-center gap-0.5">
                <PhoneIcon className="w-2.5 h-2.5 text-gray-400" />
                <p className="text-[10px] text-gray-500">Phone</p>
              </div>
              <div className="grid grid-cols-3 gap-x-2 pl-3">
                <div>
                  <p className="text-[9px] text-gray-500">Mobile</p>
                  <p className="text-xs">{demographicInfo.phone.mobile}</p>
                </div>
                <div>
                  <p className="text-[9px] text-gray-500">Home</p>
                  <p className="text-xs">{demographicInfo.phone.home}</p>
                </div>
                <div>
                  <p className="text-[9px] text-gray-500">Work</p>
                  <p className="text-xs">{demographicInfo.phone.work}</p>
                </div>
              </div>
            </div>
            <div>
              <div className="flex items-center gap-0.5">
                <EnvelopeIcon className="w-2.5 h-2.5 text-gray-400" />
                <p className="text-[10px] text-gray-500">Email</p>
              </div>
              <p className="text-xs pl-3">{demographicInfo.email}</p>
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
              <p className="text-xs pl-3 font-medium">{demographicInfo.identifiers.mrn}</p>
            </div>
            <div>
              <div className="flex items-center gap-0.5">
                <IdentificationIcon className="w-2.5 h-2.5 text-gray-400" />
                <p className="text-[10px] text-gray-500">SSN</p>
              </div>
              <p className="text-xs pl-3 font-medium">{demographicInfo.identifiers.ssn}</p>
            </div>
            <div>
              <div className="flex items-center gap-0.5">
                <BriefcaseIcon className="w-2.5 h-2.5 text-gray-400" />
                <p className="text-[10px] text-gray-500">Medicaid ID</p>
              </div>
              <p className="text-xs pl-3 font-medium">{demographicInfo.identifiers.medicaidId}</p>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );

  const renderFullscreenView = () => (
    <div className="space-y-4 h-full overflow-y-auto">
      {/* Alerts Section */}
      {demographicInfo.alerts.length > 0 && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex items-center gap-3">
            <ExclamationTriangleIcon className="w-6 h-6 text-yellow-600" />
            <div className="flex-1">
              <p className="text-sm font-medium text-yellow-800">Important Patient Alerts</p>
              <p className="text-sm text-yellow-700 mt-1">
                {demographicInfo.alerts.join(' • ')}
              </p>
            </div>
          </div>
        </div>
      )}

      <Tabs defaultValue="basic" className="w-full">
        <TabsList className="bg-gray-100/80 p-0.5 h-10 rounded-lg grid w-full grid-cols-3 gap-1 sticky top-0 z-10">
          <TabsTrigger value="basic" className="rounded data-[state=active]:bg-white">Basic</TabsTrigger>
          <TabsTrigger value="contact" className="rounded data-[state=active]:bg-white">Contact</TabsTrigger>
          <TabsTrigger value="ids" className="rounded data-[state=active]:bg-white">IDs</TabsTrigger>
        </TabsList>

        <TabsContent value="basic" className="mt-4">
          <div className="bg-white rounded-lg p-4">
            <h3 className="text-lg font-semibold mb-4">Basic Information</h3>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-500">Legal Name</label>
                <p className="text-sm">{demographicInfo.name}</p>
                <p className="text-xs text-gray-500 mt-0.5">Preferred: {demographicInfo.preferredName}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Date of Birth</label>
                <p className="text-sm">{demographicInfo.dob}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Birth Sex</label>
                <p className="text-sm">{demographicInfo.birthSex}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Gender</label>
                <p className="text-sm">{demographicInfo.gender}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Gender Identity</label>
                <p className="text-sm">{demographicInfo.genderIdentity}</p>
                <p className="text-xs text-gray-500 mt-0.5">Pronouns: {demographicInfo.pronouns}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Race</label>
                <p className="text-sm">{demographicInfo.race}</p>
                <p className="text-xs text-gray-500 mt-0.5">{demographicInfo.ethnicity}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Primary Language</label>
                <p className="text-sm">{demographicInfo.language}</p>
                {demographicInfo.preferredLanguage !== demographicInfo.language && (
                  <p className="text-xs text-gray-500 mt-0.5">Preferred: {demographicInfo.preferredLanguage}</p>
                )}
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Marital Status</label>
                <p className="text-sm">{demographicInfo.maritalStatus}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Religion</label>
                <p className="text-sm">{demographicInfo.religion}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Employment Status</label>
                <p className="text-sm">{demographicInfo.employmentStatus}</p>
                <p className="text-xs text-gray-500 mt-0.5">{demographicInfo.occupation}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Education Level</label>
                <p className="text-sm">{demographicInfo.educationLevel}</p>
              </div>
              {demographicInfo.restrictions?.hasFirearmRestriction && (
                <div className="col-span-3">
                  <div className="flex items-center gap-2 text-red-600">
                    <ExclamationTriangleIcon className="w-5 h-5" />
                    <p className="text-sm font-medium">Firearm Restriction until {demographicInfo.restrictions.restrictionDate}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="contact" className="mt-4">
          <div className="bg-white rounded-lg p-4">
            <h3 className="text-lg font-semibold mb-4">Contact Information</h3>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-500">Address</label>
                <p className="text-sm">{demographicInfo.address}</p>
                <p className="text-sm">{`${demographicInfo.city}, ${demographicInfo.state} ${demographicInfo.zipCode}`}</p>
                <p className="text-sm">{demographicInfo.country}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Phone Numbers</label>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <p className="text-xs text-gray-500">Mobile</p>
                    <p className="text-sm">{demographicInfo.phone.mobile}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Home</p>
                    <p className="text-sm">{demographicInfo.phone.home}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Work</p>
                    <p className="text-sm">{demographicInfo.phone.work}</p>
                  </div>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Email</label>
                <p className="text-sm">{demographicInfo.email}</p>
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="ids" className="mt-4">
          <div className="bg-white rounded-lg p-4">
            <h3 className="text-lg font-semibold mb-4">Identifiers</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-500">MRN #</label>
                <p className="text-sm">{demographicInfo.identifiers.mrn}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">SSN</label>
                <p className="text-sm">{demographicInfo.identifiers.ssn}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Medicaid ID</label>
                <p className="text-sm">{demographicInfo.identifiers.medicaidId}</p>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );

  return (
    <div className="h-full">
      {isFullscreen ? renderFullscreenView() : renderCompactView()}
    </div>
  );
}; 