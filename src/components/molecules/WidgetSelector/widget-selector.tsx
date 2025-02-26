import { FC, useState } from 'react';
import { useToast } from '@/components/ui/use-toast';
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
  HeartIcon,
  ShieldCheckIcon,
  PhotoIcon,
  ChatBubbleLeftRightIcon,
  EnvelopeIcon,
  BellIcon,
  DocumentTextIcon,
  DocumentDuplicateIcon,
  ChartBarIcon,
  ArrowPathIcon,
  ExclamationTriangleIcon,
  ClipboardDocumentListIcon,
  IdentificationIcon,
  RectangleStackIcon,
  CurrencyDollarIcon,
  CreditCardIcon as CCIcon,
  ArchiveBoxXMarkIcon,
  PencilSquareIcon,
  MagnifyingGlassIcon,
  SparklesIcon,
  XMarkIcon
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

export const getWidgetIcon = (type: WidgetType) => {
  const iconMap: Record<WidgetType, { icon: React.ElementType; colors: string }> = {
    patient_performance: { icon: ChartBarIcon, colors: 'bg-blue-50 text-blue-600' },
    quick_action_bar: { icon: Squares2X2Icon, colors: 'bg-indigo-50 text-indigo-600' },
    notification_center: { icon: BellIcon, colors: 'bg-rose-50 text-rose-600' },
    activity: { icon: ArrowPathIcon, colors: 'bg-green-50 text-green-600' },
    clinical_insights_carousel: { icon: SparklesIcon, colors: 'bg-violet-50 text-violet-600' },
    vital_signs: { icon: HeartIcon, colors: 'bg-red-50 text-red-600' },
    diagnosis: { icon: ClipboardDocumentListIcon, colors: 'bg-indigo-50 text-indigo-600' },
    clinical_notes: { icon: DocumentTextIcon, colors: 'bg-blue-50 text-blue-600' },
    allergies: { icon: BeakerIcon, colors: 'bg-orange-50 text-orange-600' },
    medications: { icon: BeakerIcon, colors: 'bg-cyan-50 text-cyan-600' },
    lab_results: { icon: BeakerIcon, colors: 'bg-purple-50 text-purple-600' },
    appointments: { icon: CalendarIcon, colors: 'bg-purple-50 text-purple-600' },
    documents: { icon: DocumentIcon, colors: 'bg-blue-50 text-blue-600' },
    patient_timeline: { icon: ClockIcon, colors: 'bg-indigo-50 text-indigo-600' },
    insurance: { icon: ShieldCheckIcon, colors: 'bg-purple-50 text-purple-600' },
    billing: { icon: BanknotesIcon, colors: 'bg-emerald-50 text-emerald-600' },
    disclosures: { icon: ClipboardDocumentCheckIcon, colors: 'bg-violet-50 text-violet-600' },
    demographics: { icon: UserCircleIcon, colors: 'bg-pink-50 text-pink-600' },
    implantable_devices: { icon: BeakerIcon, colors: 'bg-cyan-50 text-cyan-600' },
    identified_needs: { icon: ClipboardDocumentListIcon, colors: 'bg-amber-50 text-amber-600' },
    problems: { icon: ExclamationTriangleIcon, colors: 'bg-red-50 text-red-600' },
    procedures: { icon: ClipboardDocumentListIcon, colors: 'bg-indigo-50 text-indigo-600' },
    immunizations: { icon: BeakerIcon, colors: 'bg-teal-50 text-teal-600' },
    id_card_photos: { icon: IdentificationIcon, colors: 'bg-yellow-50 text-yellow-600' },
    clinical_reminders: { icon: BellIcon, colors: 'bg-rose-50 text-rose-600' },
    inbox_reminders: { icon: BellIcon, colors: 'bg-purple-50 text-purple-600' },
    notes: { icon: DocumentTextIcon, colors: 'bg-blue-50 text-blue-600' },
    intra_office_messages: { icon: ChatBubbleLeftRightIcon, colors: 'bg-green-50 text-green-600' },
    patient_portal_messages: { icon: EnvelopeIcon, colors: 'bg-indigo-50 text-indigo-600' },
    patient_reminders: { icon: BellIcon, colors: 'bg-amber-50 text-amber-600' },
    amendments: { icon: DocumentDuplicateIcon, colors: 'bg-fuchsia-50 text-fuchsia-600' },
    vitals: { icon: HeartIcon, colors: 'bg-red-50 text-red-600' },
    functional_status: { icon: ChartBarIcon, colors: 'bg-emerald-50 text-emerald-600' },
    cognitive_status: { icon: ChartBarIcon, colors: 'bg-blue-50 text-blue-600' },
    diagnostic_imaging: { icon: PhotoIcon, colors: 'bg-purple-50 text-purple-600' },
    active_directives: { icon: ClipboardDocumentCheckIcon, colors: 'bg-indigo-50 text-indigo-600' },
    golden_thread_alerts: { icon: ExclamationTriangleIcon, colors: 'bg-yellow-50 text-yellow-600' },
    appointment_reminders: { icon: BellIcon, colors: 'bg-blue-50 text-blue-600' },
    prescriptions: { icon: DocumentTextIcon, colors: 'bg-green-50 text-green-600' },
    billing_payment_receipts: { icon: CurrencyDollarIcon, colors: 'bg-emerald-50 text-emerald-600' },
    billing_statement: { icon: DocumentTextIcon, colors: 'bg-blue-50 text-blue-600' },
    billing_prior_auth: { icon: ClipboardDocumentCheckIcon, colors: 'bg-purple-50 text-purple-600' },
    billing_new_payment: { icon: BanknotesIcon, colors: 'bg-green-50 text-green-600' },
    billing_credit_cards: { icon: CCIcon, colors: 'bg-indigo-50 text-indigo-600' },
    billing_write_off: { icon: ArchiveBoxXMarkIcon, colors: 'bg-red-50 text-red-600' },
    billing_notes: { icon: PencilSquareIcon, colors: 'bg-gray-50 text-gray-600' }
  };

  return iconMap[type] || { icon: Squares2X2Icon, colors: 'bg-slate-100 text-slate-600' };
};

export const additionalWidgets: Widget[] = [
  // Clinical widgets
  {
    type: 'activity',
    title: 'Activity',
    id: 'activity',
    description: 'Patient activity timeline and history'
  },
  {
    type: 'clinical_insights_carousel',
    title: 'Clinical Insights',
    id: 'clinical-insights-carousel',
    description: 'Key clinical insights and trends for the patient'
  },
  { type: 'vital_signs', title: 'Vital Signs', id: 'vital-signs' },
  { type: 'clinical_notes', title: 'Clinical Notes', id: 'clinical-notes' },
  { type: 'medications', title: 'Medications', id: 'medications' },
  { type: 'diagnosis', title: 'Diagnosis', id: 'diagnosis' },
  { type: 'allergies', title: 'Allergies', id: 'allergies' },
  { type: 'lab_results', title: 'Lab Results', id: 'lab-results' },
  { type: 'appointments', title: 'Appointments', id: 'appointments' },
  
  // Administrative widgets
  { type: 'documents', title: 'Documents', id: 'documents' },
  { type: 'patient_timeline', title: 'Patient Timeline', id: 'patient-timeline' },
  { type: 'insurance', title: 'Insurance', id: 'insurance' },
  
  // Billing widgets
  { type: 'billing', title: 'Billing Overview', id: 'billing' },
  { type: 'billing_payment_receipts', title: 'Payment Receipts', id: 'billing-payment-receipts' },
  { type: 'billing_statement', title: 'Billing Statement', id: 'billing-statement' },
  { type: 'billing_prior_auth', title: 'Prior Authorization', id: 'billing-prior-auth' },
  { type: 'billing_new_payment', title: 'New Payment', id: 'billing-new-payment' },
  { type: 'billing_credit_cards', title: 'Credit Cards', id: 'billing-credit-cards' },
  { type: 'billing_write_off', title: 'Write Off', id: 'billing-write-off' },
  { type: 'billing_notes', title: 'Billing Notes', id: 'billing-notes' },
  
  // Other widgets
  { type: 'demographics', title: 'Demographics', id: 'demographics' },
  { type: 'problems', title: 'Problems (Diagnoses)', id: 'problems' },
  { type: 'procedures', title: 'Procedures', id: 'procedures' },
  { type: 'immunizations', title: 'Immunizations', id: 'immunizations' },
  { type: 'id_card_photos', title: 'ID/Card Photos', id: 'id_card_photos' },
  { type: 'clinical_reminders', title: 'Clinical Reminders', id: 'clinical_reminders' },
  { type: 'inbox_reminders', title: 'Inbox Reminders', id: 'inbox_reminders' },
  { type: 'notes', title: 'Notes', id: 'notes' },
  { type: 'intra_office_messages', title: 'Intra-Office Messages', id: 'intra_office_messages' },
  { type: 'patient_portal_messages', title: 'Patient Portal Messages', id: 'patient_portal_messages' },
  { type: 'patient_reminders', title: 'Patient Reminders (MU)', id: 'patient_reminders' },
  { type: 'disclosures', title: 'Disclosures (MU)', id: 'disclosures', description: 'Manage patient disclosures and consents' },
  { type: 'amendments', title: 'Amendments (MU)', id: 'amendments', description: 'Track and manage amendments to patient records' },
  { type: 'vitals', title: 'Vitals', id: 'vitals' },
  { type: 'implantable_devices', title: 'Implantable Devices (MU)', id: 'implantable_devices' },
  { type: 'functional_status', title: 'Functional Status (MU)', id: 'functional_status' },
  { type: 'cognitive_status', title: 'Cognitive Status (MU)', id: 'cognitive_status' },
  { type: 'diagnostic_imaging', title: 'Diagnostic Imaging Report (MU)', id: 'diagnostic_imaging' },
  { type: 'active_directives', title: 'Active Directives', id: 'active_directives' },
  { type: 'golden_thread_alerts', title: 'Golden Thread Alerts', id: 'golden_thread_alerts' },
  { type: 'appointment_reminders', title: 'Appointment Reminders', id: 'appointment_reminders' },
  { type: 'prescriptions', title: 'Prescriptions', id: 'prescriptions' }
];

export const WidgetSelector: FC<WidgetSelectorProps> = ({
  availableWidgets,
  activeWidgets,
  onToggleWidget
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const allWidgets = [...availableWidgets, ...additionalWidgets];
  
  const filterWidgets = (widgets: Widget[]) => {
    return widgets.filter(widget => 
      widget.title.toLowerCase().includes(searchQuery.toLowerCase())
    );
  };

  const addableWidgets = filterWidgets(
    allWidgets.filter(widget => !activeWidgets.includes(widget.type))
  );
  
  const removableWidgets = filterWidgets(
    allWidgets.filter(widget => activeWidgets.includes(widget.type))
  );

  const handleWidgetToggle = async (widgetType: WidgetType) => {
    try {
      setIsLoading(true);
      
      // Check if widget is being added or removed
      const isAdding = !activeWidgets.includes(widgetType);
      
      // Get widget details for the toast message
      const widget = allWidgets.find(w => w.type === widgetType);
      
      await onToggleWidget(widgetType);
      
      const { icon: Icon, colors } = getWidgetIcon(widgetType);
      
      toast({
        title: (
          <div className="flex items-center gap-2">
            <div className={`flex items-center justify-center w-6 h-6 rounded-sm ${colors}`}>
              <Icon className="w-4 h-4" />
            </div>
            <span>{isAdding ? 'Widget Added' : 'Widget Removed'}</span>
          </div>
        ),
        description: (
          <div className="mt-1">
            <p className="text-sm font-medium">{widget?.title}</p>
            <p className="text-sm text-slate-500">
              {isAdding 
                ? 'The widget has been added to your dashboard. You can now view and interact with it.'
                : 'The widget has been removed from your dashboard. You can add it back anytime.'}
            </p>
          </div>
        ),
        variant: 'default',
      });
      
    } catch (error) {
      console.error('Error toggling widget:', error);
      toast({
        title: (
          <div className="flex items-center gap-2 text-white">
            <XMarkIcon className="w-5 h-5" />
            <span>Error Managing Widget</span>
          </div>
        ),
        description: 'There was an error managing your widgets. Please try again or contact support if the issue persists.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white/90 backdrop-blur-sm rounded-sm shadow-sm border border-slate-200/50">
      <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
        <DropdownMenuTrigger asChild>
          <button 
            className="flex items-center gap-2 px-2 py-1.5 hover:bg-slate-50 rounded-sm transition-colors"
            disabled={isLoading}
          >
            <Squares2X2Icon className="w-4 h-4 text-slate-600" />
            <span className="text-sm text-slate-600">
              {isLoading ? 'Processing...' : 'Widgets'}
            </span>
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-[600px] max-h-[500px]">
          <div className="sticky top-0 z-10 bg-white border-b border-slate-100 p-2">
            <div className="relative">
              <MagnifyingGlassIcon className="absolute left-2 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search widgets..."
                value={searchQuery}
                onChange={(e) => {
                  e.stopPropagation();
                  setSearchQuery(e.target.value);
                }}
                onClick={(e) => e.stopPropagation()}
                onKeyDown={(e) => e.stopPropagation()}
                className="w-full pl-8 pr-4 py-1.5 text-sm bg-slate-50 border border-slate-200 rounded-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500/50"
              />
            </div>
          </div>

          <div className="flex">
            <div className="flex-1 border-r border-slate-100">
              <DropdownMenuLabel className="text-sm font-semibold text-slate-900 px-2 py-1.5">
                Add Widgets
              </DropdownMenuLabel>
              <div className="overflow-y-auto max-h-[400px]">
                {addableWidgets.map((widget) => {
                  const { icon: Icon, colors } = getWidgetIcon(widget.type);
                  return (
                    <DropdownMenuItem
                      key={widget.type}
                      onClick={() => handleWidgetToggle(widget.type)}
                      className="gap-2 px-2 py-1.5"
                      disabled={isLoading}
                    >
                      <div className={`flex items-center justify-center w-6 h-6 rounded-sm ${colors}`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <div className="flex-1">
                        <div className="text-sm">{widget.title}</div>
                        {widget.description && (
                          <p className="text-xs text-slate-500">{widget.description}</p>
                        )}
                      </div>
                      {isLoading ? (
                        <ArrowPathIcon className="w-4 h-4 animate-spin" />
                      ) : (
                        <PlusIcon className="w-4 h-4 text-slate-400" />
                      )}
                    </DropdownMenuItem>
                  );
                })}
                {addableWidgets.length === 0 && (
                  <div className="px-2 py-4 text-center text-sm text-slate-500">
                    No widgets to add
                  </div>
                )}
              </div>
            </div>

            <div className="flex-1">
              <DropdownMenuLabel className="text-sm font-semibold text-slate-900 px-2 py-1.5">
                Remove Widgets
              </DropdownMenuLabel>
              <div className="overflow-y-auto max-h-[400px]">
                {removableWidgets.map((widget) => {
                  const { icon: Icon, colors } = getWidgetIcon(widget.type);
                  return (
                    <DropdownMenuItem
                      key={widget.type}
                      onClick={() => handleWidgetToggle(widget.type)}
                      className="gap-2 px-2 py-1.5"
                      disabled={isLoading}
                    >
                      <div className={`flex items-center justify-center w-6 h-6 rounded-sm ${colors}`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <div className="flex-1">
                        <div className="text-sm">{widget.title}</div>
                        {widget.description && (
                          <p className="text-xs text-slate-500">{widget.description}</p>
                        )}
                      </div>
                      {isLoading ? (
                        <ArrowPathIcon className="w-4 h-4 animate-spin" />
                      ) : (
                        <MinusIcon className="w-4 h-4 text-red-500" />
                      )}
                    </DropdownMenuItem>
                  );
                })}
                {removableWidgets.length === 0 && (
                  <div className="px-2 py-4 text-center text-sm text-slate-500">
                    No widgets to remove
                  </div>
                )}
              </div>
            </div>
          </div>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}; 