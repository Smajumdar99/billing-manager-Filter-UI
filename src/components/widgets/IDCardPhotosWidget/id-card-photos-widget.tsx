import { FC } from 'react';
import { PhotoIcon, PlusIcon, ArrowUpTrayIcon, TrashIcon } from '@heroicons/react/24/outline';
import { Button } from '@/components/atoms/Button/button';
import { mockPatients } from '@/data/mockPatients';
import { calculateAge } from '@/utils/date';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/molecules/Tabs/tabs';

// Mock photos data
const mockPhotos = [
  {
    id: '1',
    url: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=500&auto=format',
    type: 'id',
    uploadedAt: '2024-01-15T10:30:00Z',
    description: 'Patient ID Photo'
  },
  {
    id: '2',
    url: 'https://images.unsplash.com/photo-1618498082410-b4aa22193b38?w=500&auto=format',
    type: 'insurance',
    uploadedAt: '2024-01-15T10:31:00Z',
    description: 'Insurance Card Front'
  },
  {
    id: '3',
    url: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=500&auto=format',
    type: 'insurance',
    uploadedAt: '2024-01-15T10:32:00Z',
    description: 'Insurance Card Back'
  },
  {
    id: '4',
    url: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=500&auto=format',
    type: 'medical',
    uploadedAt: '2024-01-15T10:33:00Z',
    description: 'Medical Record'
  },
  {
    id: '5',
    url: 'https://images.unsplash.com/photo-1583911650428-3aacc566dc8c?w=500&auto=format',
    type: 'prescription',
    uploadedAt: '2024-01-15T10:34:00Z',
    description: 'Prescription'
  }
];

interface IDCardPhotosWidgetProps {
  patientId: string;
  isFullscreen?: boolean;
}

export const IDCardPhotosWidget: FC<IDCardPhotosWidgetProps> = ({ patientId, isFullscreen }) => {
  // Find patient data from mock data
  const patient = mockPatients.find(p => p.id === patientId);
  
  if (!patient) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-4">
        <PhotoIcon className="w-12 h-12 text-slate-400 mb-4" />
        <h3 className="text-lg font-medium mb-2">Patient Not Found</h3>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <Tabs defaultValue="id-card" className="flex-1 flex flex-col">
        <TabsList>
          <TabsTrigger value="id-card">Patient ID Card</TabsTrigger>
          <TabsTrigger value="uploads">Photos</TabsTrigger>
        </TabsList>

        <TabsContent value="id-card" className="flex-1 p-4 overflow-auto">
          <div className="flex flex-col items-center max-w-full">
            {/* ID Card - Sleeker Design */}
            <div className="w-full max-w-[400px] aspect-[1.6/1] bg-[#2563eb] rounded-xl shadow-lg relative overflow-hidden mb-6">
              {/* Background Pattern */}
              <div className="absolute inset-0">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-transparent" />
                <div className="absolute inset-0 bg-[linear-gradient(120deg,rgba(255,255,255,0.3)_0%,rgba(255,255,255,0)_40%)]" />
                <div className="absolute right-0 inset-y-0 w-1/2 bg-[radial-gradient(circle_at_70%_50%,rgba(255,255,255,0.2)_0%,transparent_60%)]" />
              </div>

              {/* Content Container */}
              <div className="relative h-full p-5 flex flex-col">
                {/* Header */}
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-white/90 font-semibold tracking-wide">DrCloud EHR</h3>
                    <p className="text-[10px] text-white/60 uppercase tracking-wider">Patient Identification</p>
                  </div>
                  <div className="w-10 h-10 rounded-lg bg-white/10 backdrop-blur-sm flex items-center justify-center">
                    <span className="text-xl">🏥</span>
                  </div>
                </div>

                {/* Main Content */}
                <div className="flex-1 flex items-center gap-4 my-3">
                  {/* Photo */}
                  <div className="w-20 h-20 rounded-xl bg-white/10 backdrop-blur-sm flex items-center justify-center ring-1 ring-white/20">
                    <PhotoIcon className="w-10 h-10 text-white/40" />
                  </div>

                  {/* Patient Info */}
                  <div className="flex-1 min-w-0">
                    <h4 className="text-lg text-white font-medium tracking-wide truncate mb-2">
                      {patient.name}
                    </h4>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <p className="text-[10px] text-white/50 uppercase tracking-wider">ID Number</p>
                        <p className="text-sm text-white/90 truncate">{patient.id}</p>
                      </div>
                      <div>
                        <p className="text-[10px] text-white/50 uppercase tracking-wider">Date of Birth</p>
                        <p className="text-sm text-white/90 truncate">
                          {new Date(patient.dateOfBirth).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Footer */}
                <div className="flex justify-between items-center pt-2 border-t border-white/10">
                  <div>
                    <p className="text-[10px] text-white/50 uppercase tracking-wider">Gender</p>
                    <p className="text-sm text-white/90">{patient.gender}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] text-white/50 uppercase tracking-wider">Emergency Contact</p>
                    <p className="text-sm text-white/90">{patient.phoneNumber}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Insurance Card Preview */}
            <div className="w-full max-w-[400px] bg-white border rounded-lg p-4">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-sm font-medium">Insurance Card</h3>
                <Button variant="outline" size="sm" className="gap-1">
                  <ArrowUpTrayIcon className="w-4 h-4" />
                  Upload New
                </Button>
              </div>
              <div className="aspect-video bg-slate-100 rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <PhotoIcon className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                  <p className="text-sm text-slate-600">No insurance card uploaded</p>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="uploads" className="flex-1 p-4 overflow-auto">
          <div className="space-y-6">
            {/* Photos Grid */}
            <div>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-sm font-medium">Patient Photos</h3>
                <Button variant="outline" size="sm" className="gap-1">
                  <PlusIcon className="w-4 h-4" />
                  Upload New
                </Button>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {mockPhotos.map((photo) => (
                  <div 
                    key={photo.id} 
                    className="group aspect-square bg-slate-100 rounded-lg overflow-hidden relative hover:ring-2 hover:ring-blue-500 transition-all cursor-pointer"
                  >
                    {/* Photo */}
                    <img 
                      src={photo.url} 
                      alt={photo.description}
                      className="w-full h-full object-cover"
                    />
                    {/* Type Badge */}
                    <div className="absolute top-2 left-2 px-2 py-1 bg-black/50 rounded-full">
                      <p className="text-[10px] text-white uppercase tracking-wider">{photo.type}</p>
                    </div>
                    {/* Hover overlay */}
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity">
                      {/* Info */}
                      <div className="absolute top-2 left-2 right-2">
                        <p className="text-sm text-white font-medium truncate">{photo.description}</p>
                        <p className="text-xs text-white/70">
                          {new Date(photo.uploadedAt).toLocaleDateString()}
                        </p>
                      </div>
                      {/* Actions */}
                      <div className="absolute bottom-2 right-2 flex items-center gap-2">
                        <button className="p-1.5 bg-white/10 rounded-full hover:bg-white/20 transition-colors">
                          <ArrowUpTrayIcon className="w-4 h-4 text-white" />
                        </button>
                        <button className="p-1.5 bg-white/10 rounded-full hover:bg-white/20 transition-colors">
                          <TrashIcon className="w-4 h-4 text-white" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Upload Section */}
            <div className="border-2 border-dashed border-slate-200 rounded-lg p-6 bg-slate-50/50">
              <div className="text-center">
                <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center mx-auto mb-4">
                  <ArrowUpTrayIcon className="w-6 h-6 text-blue-500" />
                </div>
                <h3 className="text-sm font-medium mb-2">Upload New Photos</h3>
                <p className="text-sm text-slate-600 mb-4">
                  Drag and drop photos here, or click to select files
                </p>
                <div className="flex gap-2 justify-center">
                  <Button variant="outline" size="sm" className="gap-2">
                    <PlusIcon className="w-4 h-4" />
                    Browse Files
                  </Button>
                  <Button variant="outline" size="sm" className="gap-2">
                    <PhotoIcon className="w-4 h-4" />
                    Take Photo
                  </Button>
                </div>
                <p className="text-xs text-slate-500 mt-4">
                  Supported formats: JPG, PNG, HEIC • Max file size: 10MB
                </p>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}; 