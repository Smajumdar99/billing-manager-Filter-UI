import { FC } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/molecules/Tabs/tabs';
import { ScrollArea } from '@/components/atoms/ScrollArea/scroll-area';
import { Badge } from '@/components/atoms/Badge/badge';
import { Button } from '@/components/atoms/Button/button';
import { formatDistanceToNow } from 'date-fns';
import {
  PlusIcon,
  DocumentTextIcon,
  CalendarIcon,
  ClockIcon,
  CheckCircleIcon,
  XCircleIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon
} from '@heroicons/react/24/outline';
import { WidgetType } from '@/types/widget';

interface ImplantableDevicesWidgetProps {
  patientId: string;
  isFullscreen?: boolean;
  type?: WidgetType;
}

interface ImplantableDevice {
  id: string;
  name: string;
  type: string;
  manufacturer: string;
  model: string;
  serialNumber: string;
  lotNumber: string;
  status: 'active' | 'explanted' | 'end_of_life' | 'recalled';
  implantDate: string;
  explantDate?: string;
  implantingPhysician: string;
  implantLocation: string;
  lastChecked?: string;
  nextCheckDue?: string;
  batteryStatus?: string;
  mriSafetyStatus: 'safe' | 'conditional' | 'unsafe';
  notes?: string;
  alerts?: string[];
  maintenanceHistory?: {
    date: string;
    type: string;
    performedBy: string;
    findings: string;
  }[];
}

const mockImplantableDevices: ImplantableDevice[] = [
  {
    id: '1',
    name: 'Cardiac Pacemaker',
    type: 'Pacemaker',
    manufacturer: 'Medtronic',
    model: 'Azure XT DR MRI',
    serialNumber: 'MDT12345678',
    lotNumber: 'LOT2024001',
    status: 'active',
    implantDate: '2024-01-15',
    implantingPhysician: 'Dr. Robert Smith',
    implantLocation: 'Left Upper Chest',
    lastChecked: '2024-03-01',
    nextCheckDue: '2024-06-01',
    batteryStatus: '95%',
    mriSafetyStatus: 'conditional',
    notes: 'Dual chamber pacemaker with MRI conditional approval',
    alerts: ['Battery check recommended in 3 months'],
    maintenanceHistory: [
      {
        date: '2024-03-01',
        type: 'Routine Check',
        performedBy: 'Dr. Sarah Chen',
        findings: 'Device functioning normally, battery at 95%'
      }
    ]
  },
  {
    id: '2',
    name: 'Orthopedic Implant',
    type: 'Hip Replacement',
    manufacturer: 'Stryker',
    model: 'Accolade II',
    serialNumber: 'STR98765432',
    lotNumber: 'LOT2023089',
    status: 'active',
    implantDate: '2023-08-15',
    implantingPhysician: 'Dr. James Wilson',
    implantLocation: 'Left Hip',
    lastChecked: '2024-02-15',
    mriSafetyStatus: 'safe',
    notes: 'Total hip replacement with ceramic bearing',
    maintenanceHistory: [
      {
        date: '2024-02-15',
        type: 'Follow-up X-ray',
        performedBy: 'Dr. James Wilson',
        findings: 'Implant well positioned, no signs of loosening'
      }
    ]
  }
];

export const ImplantableDevicesWidget: FC<ImplantableDevicesWidgetProps> = ({ 
  patientId, 
  isFullscreen = false,
  type = 'implantable_devices'
}) => {
  const getStatusBadgeVariant = (status: ImplantableDevice['status']) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'explanted':
        return 'bg-gray-100 text-gray-800';
      case 'end_of_life':
        return 'bg-yellow-100 text-yellow-800';
      case 'recalled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getMRISafetyBadgeVariant = (status: ImplantableDevice['mriSafetyStatus']) => {
    switch (status) {
      case 'safe':
        return 'bg-green-100 text-green-800';
      case 'conditional':
        return 'bg-yellow-100 text-yellow-800';
      case 'unsafe':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="h-full flex flex-col">
      <Tabs defaultValue="active" className="flex-1 flex flex-col overflow-hidden">
        <TabsList className="shrink-0 w-full flex justify-start gap-2 bg-gray-50 border-b px-2">
          <TabsTrigger value="active" className="data-[state=active]:bg-white text-xs">
            Active Devices
            <Badge variant="secondary" className="ml-2 h-4 w-4 text-xs">
              {mockImplantableDevices.filter(d => d.status === 'active').length}
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="all" className="data-[state=active]:bg-white text-xs">All Devices</TabsTrigger>
          <TabsTrigger value="maintenance" className="data-[state=active]:bg-white text-xs">Maintenance</TabsTrigger>
        </TabsList>

        <div className="flex-1 relative overflow-hidden">
          <TabsContent value="active" className="absolute inset-0">
            <ScrollArea className="h-full">
              <div className="p-3 space-y-3">
                {mockImplantableDevices
                  .filter(device => device.status === 'active')
                  .map(device => (
                    <div key={device.id} className="rounded-lg border p-3 space-y-2">
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="flex items-center gap-1.5">
                            <h4 className="text-sm font-medium">{device.name}</h4>
                            <Badge className={`${getStatusBadgeVariant(device.status)} text-xs px-1.5 py-0`}>
                              {device.status.replace('_', ' ')}
                            </Badge>
                            <Badge className={`${getMRISafetyBadgeVariant(device.mriSafetyStatus)} text-xs px-1.5 py-0`}>
                              MRI {device.mriSafetyStatus}
                            </Badge>
                          </div>
                          <div className="text-xs text-gray-500 mt-0.5">
                            {device.manufacturer} - {device.model}
                          </div>
                        </div>
                        {device.batteryStatus && (
                          <Badge variant="outline" className="text-xs px-1.5 py-0">
                            Battery: {device.batteryStatus}
                          </Badge>
                        )}
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <div className="text-xs text-gray-500 mb-1">Device Details</div>
                          <div className="space-y-1">
                            <div className="text-xs">Serial: {device.serialNumber}</div>
                            <div className="text-xs">Lot: {device.lotNumber}</div>
                            <div className="text-xs">Location: {device.implantLocation}</div>
                          </div>
                        </div>
                        <div>
                          <div className="text-xs text-gray-500 mb-1">Dates</div>
                          <div className="space-y-1">
                            <div className="flex items-center gap-1.5 text-xs">
                              <CalendarIcon className="w-3.5 h-3.5 text-gray-400" />
                              Implanted: {new Date(device.implantDate).toLocaleDateString()}
                            </div>
                            {device.lastChecked && (
                              <div className="flex items-center gap-1.5 text-xs">
                                <ClockIcon className="w-3.5 h-3.5 text-gray-400" />
                                Last Check: {new Date(device.lastChecked).toLocaleDateString()}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                      {device.alerts && device.alerts.length > 0 && (
                        <div className="mt-2 pt-2 border-t">
                          <div className="text-xs font-medium mb-1">Alerts</div>
                          <div className="space-y-1.5">
                            {device.alerts.map((alert, index) => (
                              <div
                                key={index}
                                className="flex items-center gap-1.5 text-xs text-yellow-700 bg-yellow-50 rounded p-1.5"
                              >
                                <ExclamationTriangleIcon className="w-3.5 h-3.5" />
                                {alert}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {device.notes && (
                        <div className="mt-2 pt-2 border-t">
                          <div className="flex items-center gap-1.5 text-xs text-gray-600">
                            <InformationCircleIcon className="w-3.5 h-3.5" />
                            {device.notes}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
              </div>
            </ScrollArea>
          </TabsContent>

          <TabsContent value="all" className="absolute inset-0">
            <ScrollArea className="h-full">
              <div className="p-3 space-y-3">
                {mockImplantableDevices.map(device => (
                  <div key={device.id} className="rounded-lg border p-3 space-y-2">
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-1.5">
                          <h4 className="text-sm font-medium">{device.name}</h4>
                          <Badge className={`${getStatusBadgeVariant(device.status)} text-xs px-1.5 py-0`}>
                            {device.status.replace('_', ' ')}
                          </Badge>
                          <Badge className={`${getMRISafetyBadgeVariant(device.mriSafetyStatus)} text-xs px-1.5 py-0`}>
                            MRI {device.mriSafetyStatus}
                          </Badge>
                        </div>
                        <div className="text-xs text-gray-500 mt-0.5">
                          {device.manufacturer} - {device.model}
                        </div>
                      </div>
                      {device.batteryStatus && (
                        <Badge variant="outline" className="text-xs px-1.5 py-0">
                          Battery: {device.batteryStatus}
                        </Badge>
                      )}
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <div className="text-xs text-gray-500 mb-1">Device Details</div>
                        <div className="space-y-1">
                          <div className="text-xs">Serial: {device.serialNumber}</div>
                          <div className="text-xs">Lot: {device.lotNumber}</div>
                          <div className="text-xs">Location: {device.implantLocation}</div>
                        </div>
                      </div>
                      <div>
                        <div className="text-xs text-gray-500 mb-1">Dates</div>
                        <div className="space-y-1">
                          <div className="flex items-center gap-1.5 text-xs">
                            <CalendarIcon className="w-3.5 h-3.5 text-gray-400" />
                            Implanted: {new Date(device.implantDate).toLocaleDateString()}
                          </div>
                          {device.lastChecked && (
                            <div className="flex items-center gap-1.5 text-xs">
                              <ClockIcon className="w-3.5 h-3.5 text-gray-400" />
                              Last Check: {new Date(device.lastChecked).toLocaleDateString()}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {device.alerts && device.alerts.length > 0 && (
                      <div className="mt-2 pt-2 border-t">
                        <div className="text-xs font-medium mb-1">Alerts</div>
                        <div className="space-y-1.5">
                          {device.alerts.map((alert, index) => (
                            <div
                              key={index}
                              className="flex items-center gap-1.5 text-xs text-yellow-700 bg-yellow-50 rounded p-1.5"
                            >
                              <ExclamationTriangleIcon className="w-3.5 h-3.5" />
                              {alert}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {device.notes && (
                      <div className="mt-2 pt-2 border-t">
                        <div className="flex items-center gap-1.5 text-xs text-gray-600">
                          <InformationCircleIcon className="w-3.5 h-3.5" />
                          {device.notes}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </ScrollArea>
          </TabsContent>

          <TabsContent value="maintenance" className="absolute inset-0">
            <ScrollArea className="h-full">
              <div className="p-3 space-y-3">
                {mockImplantableDevices
                  .filter(device => device.maintenanceHistory && device.maintenanceHistory.length > 0)
                  .map(device => (
                    <div key={device.id} className="rounded-lg border p-3 space-y-2">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="text-sm font-medium">{device.name}</h4>
                          <div className="text-xs text-gray-500">
                            {device.manufacturer} - {device.model}
                          </div>
                        </div>
                        <Badge className={`${getStatusBadgeVariant(device.status)} text-xs px-1.5 py-0`}>
                          {device.status.replace('_', ' ')}
                        </Badge>
                      </div>

                      <div className="space-y-3">
                        {device.maintenanceHistory?.map((record, index) => (
                          <div key={index} className="border-t pt-2">
                            <div className="flex items-center justify-between mb-1">
                              <div className="text-xs font-medium">{record.type}</div>
                              <div className="text-xs text-gray-500">
                                {new Date(record.date).toLocaleDateString()}
                              </div>
                            </div>
                            <div className="text-xs text-gray-600">
                              Performed by: {record.performedBy}
                            </div>
                            <div className="mt-1.5 text-xs bg-gray-50 rounded p-1.5">
                              {record.findings}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
              </div>
            </ScrollArea>
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
}; 