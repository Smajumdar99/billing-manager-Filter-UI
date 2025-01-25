import { FC, useState } from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/atoms/Tabs/tabs';
import { Card } from '@/components/atoms/Card/card';
import { Button } from '@/components/atoms/Button/button';
import { Badge } from '@/components/atoms/Badge/badge';
import {
  PencilIcon,
  PhoneIcon,
  EnvelopeIcon,
  MapPinIcon,
  LanguageIcon,
  ExclamationTriangleIcon,
  HeartIcon,
  BuildingOfficeIcon,
  AcademicCapIcon
} from '@heroicons/react/24/outline';

interface DemographicsProps {
  patientId: string;
}

const Demographics: FC<DemographicsProps> = ({ patientId }) => {
  const [activeTab, setActiveTab] = useState('basic');

  return (
    <div className="h-full bg-background p-6">
      {/* Alert Banner for Critical Information */}
      <div className="mb-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <div className="flex items-center gap-3">
          <ExclamationTriangleIcon className="w-5 h-5 text-yellow-600" />
          <div className="flex-1">
            <p className="text-sm font-medium text-yellow-800">
              Important Patient Alerts
            </p>
            <p className="text-sm text-yellow-700">
              Latex Allergy • Hearing Impaired • Requires Interpreter
            </p>
          </div>
        </div>
      </div>

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="bg-gray-100 p-1">
          <TabsTrigger value="basic" className="data-[state=active]:bg-white">Basic Information</TabsTrigger>
          <TabsTrigger value="contact" className="data-[state=active]:bg-white">Contact</TabsTrigger>
          <TabsTrigger value="emergency" className="data-[state=active]:bg-white">Emergency & Family</TabsTrigger>
          <TabsTrigger value="administrative" className="data-[state=active]:bg-white">Administrative</TabsTrigger>
          <TabsTrigger value="social" className="data-[state=active]:bg-white">Social Determinants</TabsTrigger>
          <TabsTrigger value="cultural" className="data-[state=active]:bg-white">Cultural & Preferences</TabsTrigger>
        </TabsList>

        <TabsContent value="basic" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Personal Information */}
            <Card>
              <div className="p-6">
                <h3 className="text-lg font-semibold mb-4">Personal Information</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-500">Name</label>
                    <p className="text-sm">Test Individual</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Language</label>
                    <p className="text-sm">English</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Alias Name</label>
                    <p className="text-sm">-</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Suffix</label>
                    <p className="text-sm">-</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">External ID</label>
                    <p className="text-sm">070782</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Previous Name</label>
                    <p className="text-sm">-</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">DOB</label>
                    <p className="text-sm">07/07/2009</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Gender</label>
                    <p className="text-sm">Male</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">S.S.</label>
                    <p className="text-sm">XXX-XX-8999</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Gender Identity</label>
                    <p className="text-sm">Agender</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">RIN #</label>
                    <p className="text-sm">786</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Sexual Orientation</label>
                    <p className="text-sm">Unassigned</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Medicaid ID Number</label>
                    <p className="text-sm">784261542</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">VA</label>
                    <p className="text-sm">Not a Veteran</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">MRN #</label>
                    <p className="text-sm">74516900</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Client Closed Date</label>
                    <p className="text-sm">01/03/2024</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Lived Name</label>
                    <p className="text-sm">Tester</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Marriage Status</label>
                    <p className="text-sm">Married</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Pronoun Name</label>
                    <p className="text-sm">Not Provided</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">School</label>
                    <p className="text-sm">Academy for College and Career Exploration</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Email</label>
                    <p className="text-sm">kgollapudi@drcloudehr.com</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Military Status</label>
                    <p className="text-sm">Not a Veteran</p>
                  </div>
                </div>
              </div>
            </Card>

            {/* Demographics */}
            <Card>
              <div className="p-6">
                <h3 className="text-lg font-semibold mb-4">Demographics</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-500">Date of Birth</label>
                    <p className="text-sm">07/07/2009</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Gender</label>
                    <p className="text-sm">Male</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Gender Identity</label>
                    <p className="text-sm">Agender</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Sexual Orientation</label>
                    <p className="text-sm">Unassigned</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Language</label>
                    <p className="text-sm">English</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Marriage Status</label>
                    <p className="text-sm">Married</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Radioo</label>
                    <p className="text-sm">No</p>
                  </div>
                  <div className="col-span-2">
                    <label className="text-sm font-medium text-gray-500">Demographic Alert</label>
                    <p className="text-sm">-</p>
                  </div>
                </div>
              </div>
            </Card>

            {/* Testing Information */}
            <Card>
              <div className="p-6">
                <h3 className="text-lg font-semibold mb-4">Testing Information</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-500">Test</label>
                    <p className="text-sm">-</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">My Test</label>
                    <p className="text-sm">-</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Testing Purpose</label>
                    <p className="text-sm">-</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">If Other, please indicate</label>
                    <p className="text-sm">-</p>
                  </div>
                </div>
              </div>
            </Card>

            {/* Identifiers */}
            <Card>
              <div className="p-6">
                <h3 className="text-lg font-semibold mb-4">Identifiers</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-500">MRN #</label>
                    <p className="text-sm">74516900</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">External ID</label>
                    <p className="text-sm">070782</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">SSN</label>
                    <p className="text-sm">XXX-XX-8999</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">RIN #</label>
                    <p className="text-sm">786</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Medicaid ID</label>
                    <p className="text-sm">784261542</p>
                  </div>
                </div>
              </div>
            </Card>

            {/* Additional Information */}
            <Card>
              <div className="p-6">
                <h3 className="text-lg font-semibold mb-4">Additional Information</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-500">Military Status</label>
                    <p className="text-sm">Not a Veteran</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">VA Status</label>
                    <p className="text-sm">Not a Veteran</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">School</label>
                    <p className="text-sm">Academy for College and Career Exploration</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Client Closed Date</label>
                    <p className="text-sm">01/03/2024</p>
                  </div>
                  <div className="col-span-2">
                    <label className="text-sm font-medium text-gray-500">Email</label>
                    <p className="text-sm">kgollapudi@drcloudehr.com</p>
                  </div>
                </div>
              </div>
            </Card>

            {/* Restrictions */}
            <Card>
              <div className="p-6">
                <h3 className="text-lg font-semibold mb-4 text-red-600">Restrictions</h3>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-500">Court Ordered Firearm/Weapon Restriction</label>
                    <p className="text-sm font-medium text-red-600">YES</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">If yes, enter restriction date</label>
                    <p className="text-sm">11/12/2024</p>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="contact" className="space-y-4">
          {/* Client Information */}
          <Card>
            <div className="p-6">
              <h3 className="text-lg font-semibold mb-4">Client Information</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">Guardian's Name</label>
                  <p className="text-sm">-</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Address2</label>
                  <p className="text-sm">-</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Address</label>
                  <p className="text-sm">150 feet road, 10th street</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">State</label>
                  <p className="text-sm">Illinois</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">City</label>
                  <p className="text-sm">Chicago</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">GEOCode</label>
                  <p className="text-sm">-</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Zip Code</label>
                  <p className="text-sm">07863</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Email</label>
                  <p className="text-sm">yellak@drcloudehr.com</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Country</label>
                  <p className="text-sm">USA</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Birthplace</label>
                  <p className="text-sm">asdadadasdasd</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Birth Name (if different)</label>
                  <p className="text-sm">-</p>
                </div>
                <div className="col-span-2">
                  <label className="text-sm font-medium text-gray-500">Contact Email</label>
                  <p className="text-sm">kgollapudi@drcloudehr.com</p>
                  <p className="text-xs text-gray-400">For Email Reminder</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Home #</label>
                  <p className="text-sm">777-777-788</p>
                  <p className="text-xs text-gray-400">For Voice/SMS Reminder</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Work #</label>
                  <p className="text-sm">777-777-7777</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Mobile #</label>
                  <p className="text-sm">777-777-5758</p>
                  <p className="text-xs text-gray-400">For Voice/SMS Reminder</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Other #</label>
                  <p className="text-sm">777777878</p>
                </div>
              </div>
            </div>
          </Card>

          {/* Emergency Contact */}
          <Card>
            <div className="p-6">
              <h3 className="text-lg font-semibold mb-4">Emergency Contact</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">Name</label>
                  <p className="text-sm">-</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Relationship</label>
                  <p className="text-sm">Child</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Address</label>
                  <p className="text-sm">-</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Zip Code</label>
                  <p className="text-sm">-</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">County</label>
                  <p className="text-sm">-</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Home #</label>
                  <p className="text-sm">-</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">State</label>
                  <p className="text-sm">California</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Cell #</label>
                  <p className="text-sm">-</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Work #</label>
                  <p className="text-sm">-</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">DOB</label>
                  <p className="text-sm">-</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Other #</label>
                  <p className="text-sm">-</p>
                </div>
              </div>
            </div>
          </Card>

          {/* Parent/Guardian */}
          <Card>
            <div className="p-6">
              <h3 className="text-lg font-semibold mb-4">Parent/Guardian</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">County</label>
                  <p className="text-sm">-</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">State</label>
                  <p className="text-sm">-</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Mobile #</label>
                  <p className="text-sm">-</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Home #</label>
                  <p className="text-sm">-</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Zip Code</label>
                  <p className="text-sm">-</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Email</label>
                  <p className="text-sm">-</p>
                </div>
              </div>
            </div>
          </Card>

          {/* Pediatrician */}
          <Card>
            <div className="p-6">
              <h3 className="text-lg font-semibold mb-4">Pediatrician</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">Referrer Name</label>
                  <p className="text-sm">-</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Clinic/Office Name</label>
                  <p className="text-sm">sdfsdf</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Referrer Address</label>
                  <p className="text-sm">-</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Referrer Email</label>
                  <p className="text-sm">-</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Referrer City</label>
                  <p className="text-sm">-</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Referrer Zip Code</label>
                  <p className="text-sm">-</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Referrer State</label>
                  <p className="text-sm">California</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Referrer Fax #</label>
                  <p className="text-sm">-</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Referrer Phone #</label>
                  <p className="text-sm">-</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Pediatrician Email</label>
                  <p className="text-sm">-</p>
                </div>
              </div>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="emergency" className="space-y-4">
          <Card>
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold">Emergency Contacts</h2>
                <Button variant="outline" size="sm">Add Contact</Button>
              </div>
              <div className="space-y-4">
                <div className="border rounded-lg p-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-medium">Jane Smith (Spouse)</h3>
                      <p className="text-sm text-gray-500">Primary Emergency Contact</p>
                    </div>
                    <Button variant="ghost" size="sm">Edit</Button>
                  </div>
                  <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className="flex items-center gap-2 text-sm">
                      <PhoneIcon className="w-4 h-4 text-gray-400" />
                      (555) 234-5678
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <EnvelopeIcon className="w-4 h-4 text-gray-400" />
                      jane.smith@email.com
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          <Card>
            <div className="p-6">
              <h2 className="text-lg font-semibold mb-4">Family History</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-2">Medical History</h3>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="outline">Diabetes (Father)</Badge>
                    <Badge variant="outline">Hypertension (Mother)</Badge>
                    <Badge variant="outline">Heart Disease (Grandfather)</Badge>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="administrative" className="space-y-4">
          <Card>
            <div className="p-6">
              <h2 className="text-lg font-semibold mb-4">Insurance Information</h2>
              <div className="space-y-4">
                <div className="border rounded-lg p-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-medium">Blue Cross Blue Shield</h3>
                      <p className="text-sm text-gray-500">Primary Insurance</p>
                    </div>
                    <Badge>Active</Badge>
                  </div>
                  <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <label className="text-sm text-gray-500">Policy Number</label>
                      <p className="text-sm font-medium">BCBS123456789</p>
                    </div>
                    <div>
                      <label className="text-sm text-gray-500">Group Number</label>
                      <p className="text-sm font-medium">GRP987654321</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          <Card>
            <div className="p-6">
              <h2 className="text-lg font-semibold mb-4">Healthcare Providers</h2>
              <div className="space-y-4">
                <div className="border rounded-lg p-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-medium">Dr. Sarah Johnson</h3>
                      <p className="text-sm text-gray-500">Primary Care Physician</p>
                    </div>
                    <Button variant="ghost" size="sm">Change</Button>
                  </div>
                  <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className="flex items-center gap-2 text-sm">
                      <PhoneIcon className="w-4 h-4 text-gray-400" />
                      (555) 345-6789
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <BuildingOfficeIcon className="w-4 h-4 text-gray-400" />
                      City Medical Center
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="social" className="space-y-4">
          <Card>
            <div className="p-6">
              <h2 className="text-lg font-semibold mb-4">Social Determinants</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-3">Education</h3>
                  <div className="flex items-center gap-3">
                    <AcademicCapIcon className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="font-medium">Bachelor's Degree</p>
                      <p className="text-sm text-gray-500">Computer Science</p>
                    </div>
                  </div>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-3">Employment</h3>
                  <div className="flex items-center gap-3">
                    <BuildingOfficeIcon className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="font-medium">Software Engineer</p>
                      <p className="text-sm text-gray-500">Tech Corp Inc.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          <Card>
            <div className="p-6">
              <h2 className="text-lg font-semibold mb-4">Living Situation</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="text-sm font-medium text-gray-500">Housing Status</label>
                  <p className="mt-1">Own Home</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Transportation</label>
                  <p className="mt-1">Personal Vehicle</p>
                </div>
              </div>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="cultural" className="space-y-4">
          <Card>
            <div className="p-6">
              <h2 className="text-lg font-semibold mb-4">Cultural Preferences</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="text-sm font-medium text-gray-500">Religion</label>
                  <p className="mt-1">Christianity</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Dietary Restrictions</label>
                  <p className="mt-1">None</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Language Preference</label>
                  <div className="flex items-center gap-2 mt-1">
                    <LanguageIcon className="w-5 h-5 text-gray-400" />
                    <span>English (Primary)</span>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          <Card>
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold">Advance Directives</h2>
                <Button variant="outline" size="sm">Update</Button>
              </div>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <HeartIcon className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="font-medium">Living Will</p>
                    <p className="text-sm text-gray-500">Last updated: Jan 15, 2023</p>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Demographics; 