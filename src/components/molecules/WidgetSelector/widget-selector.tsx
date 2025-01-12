import { FC } from 'react';
import { 
  PlusIcon, 
  MinusIcon, 
  Squares2X2Icon,
  CalendarIcon,
  DocumentIcon,
  ClockIcon,
  CreditCardIcon,
  BanknotesIcon,
  ClipboardDocumentCheckIcon,
  UserCircleIcon,
  BeakerIcon,
  HeartIcon
} from '@heroicons/react/24/outline';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { Widget, WidgetType } from '@/types/widget';

interface WidgetSelectorProps {
  availableWidgets: Widget[];
  activeWidgets: WidgetType[];
  onToggleWidget: (widgetType: WidgetType) => void;
}

const getWidgetIcon = (type: WidgetType) => {
  const iconMap: Record<WidgetType, { icon: React.ElementType; colors: string }> = {
    appointments: { icon: CalendarIcon, colors: 'bg-purple-50 text-purple-600' },
    documents: { icon: DocumentIcon, colors: 'bg-yellow-50 text-yellow-600' },
    patient_timeline: { icon: ClockIcon, colors: 'bg-blue-50 text-blue-600' },
    insurance: { icon: CreditCardIcon, colors: 'bg-green-50 text-green-600' },
    billing: { icon: BanknotesIcon, colors: 'bg-emerald-50 text-emerald-600' },
    disclosures: { icon: ClipboardDocumentCheckIcon, colors: 'bg-indigo-50 text-indigo-600' },
    demographics: { icon: UserCircleIcon, colors: 'bg-pink-50 text-pink-600' },
    implantable_devices: { icon: BeakerIcon, colors: 'bg-cyan-50 text-cyan-600' },
    identified_needs: { icon: HeartIcon, colors: 'bg-rose-50 text-rose-600' },
    patient_performance: { icon: Squares2X2Icon, colors: 'bg-slate-100 text-slate-600' },
    notification_center: { icon: Squares2X2Icon, colors: 'bg-slate-100 text-slate-600' },
    vital_signs: { icon: Squares2X2Icon, colors: 'bg-slate-100 text-slate-600' },
    clinical_notes: { icon: Squares2X2Icon, colors: 'bg-slate-100 text-slate-600' },
    medications: { icon: Squares2X2Icon, colors: 'bg-slate-100 text-slate-600' },
    diagnosis: { icon: Squares2X2Icon, colors: 'bg-slate-100 text-slate-600' },
    allergies: { icon: Squares2X2Icon, colors: 'bg-slate-100 text-slate-600' },
    lab_results: { icon: Squares2X2Icon, colors: 'bg-slate-100 text-slate-600' }
  };

  return iconMap[type] || { icon: Squares2X2Icon, colors: 'bg-slate-100 text-slate-600' };
};

const additionalWidgets: Widget[] = [
  { type: 'appointments' as WidgetType, title: 'Appointments', id: 'appointments' },
  { type: 'documents' as WidgetType, title: 'Documents', id: 'documents' },
  { type: 'patient_timeline' as WidgetType, title: 'Patient Timeline', id: 'patient_timeline' },
  { type: 'insurance' as WidgetType, title: 'Insurance', id: 'insurance' },
  { type: 'billing' as WidgetType, title: 'Billing', id: 'billing' },
  { type: 'disclosures' as WidgetType, title: 'Disclosures & Amendments', id: 'disclosures' },
  { type: 'demographics' as WidgetType, title: 'Demographics', id: 'demographics' },
  { type: 'implantable_devices' as WidgetType, title: 'Implantable Devices', id: 'implantable_devices' },
  { type: 'identified_needs' as WidgetType, title: 'Identified Needs', id: 'identified_needs' }
];

export const WidgetSelector: FC<WidgetSelectorProps> = ({
  availableWidgets,
  activeWidgets,
  onToggleWidget
}) => {
  const allWidgets = [...availableWidgets, ...additionalWidgets];
  const addableWidgets = allWidgets
    .filter(widget => !activeWidgets.includes(widget.type))
    .filter(widget => widget.type !== 'notification_center');
  const removableWidgets = allWidgets.filter(widget => activeWidgets.includes(widget.type));

  return (
    <div className="bg-white/90 backdrop-blur-sm rounded-sm shadow-sm border border-slate-200/50">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className="flex items-center gap-2 px-2 py-1.5 hover:bg-slate-50 rounded-sm transition-colors">
            <Squares2X2Icon className="w-4 h-4 text-slate-600" />
            <span className="text-sm text-slate-600">Widgets</span>
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-[300px] max-h-[500px] overflow-y-auto">
          {addableWidgets.length > 0 && (
            <>
              <DropdownMenuLabel className="text-sm font-semibold text-slate-900 px-2 py-1.5">
                Add Widgets
              </DropdownMenuLabel>
              {addableWidgets.map((widget) => {
                const { icon: Icon, colors } = getWidgetIcon(widget.type);
                return (
                  <DropdownMenuItem
                    key={widget.type}
                    onClick={() => onToggleWidget(widget.type)}
                    className="gap-2 px-2 py-1.5"
                  >
                    <div className={`flex items-center justify-center w-6 h-6 rounded-sm ${colors}`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="flex-1">
                      <div className="text-sm">{widget.title}</div>
                    </div>
                    <PlusIcon className="w-4 h-4 text-slate-400" />
                  </DropdownMenuItem>
                );
              })}
            </>
          )}

          {removableWidgets.length > 0 && (
            <>
              <DropdownMenuSeparator className="my-1" />
              <DropdownMenuLabel className="text-sm font-semibold text-slate-900 px-2 py-1.5">
                Remove Widgets
              </DropdownMenuLabel>
              {removableWidgets.map((widget) => {
                const { icon: Icon, colors } = getWidgetIcon(widget.type);
                return (
                  <DropdownMenuItem
                    key={widget.type}
                    onClick={() => onToggleWidget(widget.type)}
                    className="gap-2 px-2 py-1.5"
                  >
                    <div className={`flex items-center justify-center w-6 h-6 rounded-sm ${colors}`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="flex-1">
                      <div className="text-sm">{widget.title}</div>
                    </div>
                    <MinusIcon className="w-4 h-4 text-red-500" />
                  </DropdownMenuItem>
                );
              })}
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}; 