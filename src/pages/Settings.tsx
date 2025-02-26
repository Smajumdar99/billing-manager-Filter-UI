import { FC, useState, useEffect } from 'react'
import { Header } from '@/components/organisms/Header'
import { Breadcrumb } from '@/components/atoms/Breadcrumb/breadcrumb'
import { Cog6ToothIcon } from '@heroicons/react/24/outline'
import { ExpandableTabs } from '@/components/ui/expandable-tabs'
import { Settings as SettingsIcon, Globe, Sparkles, Calendar, Bell, User, Info, ChevronDown, ChevronUp } from 'lucide-react'
import { WidgetRoleManager } from '@/components/molecules/WidgetRoleManager/widget-role-manager'
import { additionalWidgets } from '@/components/molecules/WidgetSelector/widget-selector'
import { WidgetType } from '@/types/widget'
import { saveWidgetRoles, getWidgetRoles } from '../lib/firestore/widget-roles'
import { useToast } from '../components/ui/use-toast.tsx'
import { Sidebar } from '@/components/organisms/Sidebar'
import { navigation } from '@/components/organisms/SidebarMenu'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/atoms/Table/table'
import { defaultWidgets, widgetPermissions } from '@/config/widgets'
import { Button } from '@/components/atoms/Button'

interface RoleBoxWidget {
  id: string;  // Unique ID for each instance
  type: WidgetType;
}

const Settings: FC = () => {
  const [selectedTab, setSelectedTab] = useState<number>(0);
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());
  const [roleBoxes, setRoleBoxes] = useState([
    {
      id: 'clinician',
      title: 'Clinician',
      description: 'Widgets available for clinical staff',
      widgets: [] as RoleBoxWidget[]
    },
    {
      id: 'biller',
      title: 'Biller',
      description: 'Widgets available for billing staff',
      widgets: [] as RoleBoxWidget[]
    },
    {
      id: 'clinical-admin',
      title: 'Clinical Admin',
      description: 'Widgets available for clinical administrators',
      widgets: [] as RoleBoxWidget[]
    },
    {
      id: 'front-desk',
      title: 'Front Desk',
      description: 'Widgets available for front desk staff',
      widgets: [] as RoleBoxWidget[]
    }
  ]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const loadWidgetRoles = async () => {
      console.log('Loading saved widget roles...');
      try {
        const savedRoles = await getWidgetRoles();
        console.log('Loaded widget roles:', savedRoles);
        if (savedRoles) {
          setRoleBoxes(savedRoles);
          toast({
            title: "Success",
            description: "Widget assignments loaded successfully",
          });
        }
      } catch (error) {
        console.error('Error loading widget roles:', error);
        toast({
          title: "Error",
          description: "Failed to load widget assignments",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadWidgetRoles();
  }, [toast]);

  const settingsTabs = [
    { title: "User", icon: SettingsIcon },
    { title: "Locale", icon: Globe },
    { type: "separator" as const },
    { title: "Features", icon: Sparkles },
    { title: "Calendar", icon: Calendar },
    { title: "Notifications", icon: Bell },
    { title: "DrFirst", icon: User },
    { type: "separator" as const },
    { title: "Misc", icon: Info },
  ];

  const handleTabChange = (index: number) => {
    setSelectedTab(index);
  };

  const handleDragEnd = async (widgetId: string, targetBoxId: string) => {
    console.log('Drag/Delete operation:', { widgetId, targetBoxId });
    
    // Create new state
    const newRoleBoxes = [...roleBoxes];
    
    // If moving to available-widgets (or deleting), remove from all boxes
    if (targetBoxId === 'available-widgets') {
      console.log('Removing widget from all boxes:', widgetId);
      newRoleBoxes.forEach(box => {
        box.widgets = box.widgets.filter(w => w.id !== widgetId);
      });
    } else {
      // Find the widget in available widgets
      const widget = additionalWidgets.find(w => w.id === widgetId);
      if (!widget) {
        console.warn('Widget not found:', widgetId);
        return;
      }

      // Add to target box with a unique ID
      const targetBox = newRoleBoxes.find(box => box.id === targetBoxId);
      if (targetBox) {
        const uniqueId = `${widget.id}-${Date.now()}`;
        console.log('Adding widget to box:', targetBox.id, 'with uniqueId:', uniqueId);
        targetBox.widgets.push({
          id: uniqueId,
          type: widget.type
        });
      }
    }

    // Update state
    setRoleBoxes(newRoleBoxes);
    console.log('Updated role boxes:', newRoleBoxes);

    // Save to Firestore
    try {
      console.log('Saving to Firestore...');
      const saved = await saveWidgetRoles(newRoleBoxes);
      if (saved) {
        console.log('Successfully saved to Firestore');
        toast({
          title: "Success",
          description: targetBoxId === 'available-widgets' 
            ? "Widget removed successfully" 
            : "Widget assignments saved successfully",
        });
      } else {
        console.error('Failed to save to Firestore');
        toast({
          title: "Error",
          description: "Failed to save widget assignments. Please try again.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error saving to Firestore:', error);
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    }
  };

  const getWidgetDesignRationale = (widgetType: WidgetType): string => {
    const rationales: Partial<Record<WidgetType, string>> = {
      patient_performance: 'Designed with visual metrics and trends to quickly assess patient progress and identify areas needing attention',
      quick_action_bar: 'Contextual quick actions that adapt to the user role and current workflow, providing instant access to frequently used functions',
      notification_center: 'Centralized notification system to ensure critical updates are never missed and to reduce alert fatigue',
      activity: 'Chronological activity feed to maintain a clear audit trail and provide context for patient care decisions',
      clinical_insights_carousel: 'Rotating insights display to surface key clinical information without overwhelming the user',
      vital_signs: 'Visual presentation of vital trends with color-coded indicators for quick status assessment',
      clinical_notes: 'Structured note-taking interface with templates to ensure consistent and complete documentation',
      medications: 'Comprehensive medication management with built-in safety checks and interaction warnings',
      diagnosis: 'Hierarchical diagnosis display with active/resolved categorization for clear patient history',
      allergies: 'Prominent allergy information with severity indicators for patient safety',
      lab_results: 'Trending lab results with visual indicators for out-of-range values',
      appointments: 'Calendar-based scheduling with resource management and conflict prevention',
      documents: 'Categorized document management with quick search and filter capabilities',
      patient_timeline: 'Visual timeline to understand the sequence and relationship of patient events',
      insurance: 'Detailed insurance tracking with coverage verification and expiration alerts',
      billing: 'Integrated billing workflow with payment tracking and automated reconciliation',
      billing_payment_receipts: 'Organized receipt management for audit and tracking purposes',
      billing_statement: 'Clear statement presentation with detailed breakdown of charges',
      billing_prior_auth: 'Streamlined prior authorization workflow to reduce care delays',
      billing_new_payment: 'Simple payment entry interface with validation and receipt generation',
      billing_credit_cards: 'Secure credit card management with tokenization for patient convenience',
      billing_write_off: 'Controlled write-off process with required documentation',
      billing_notes: 'Structured billing notes for better communication and tracking',
      demographics: 'Comprehensive patient information with emergency contact details',
      implantable_devices: 'Detailed device tracking with maintenance schedules and safety alerts',
      disclosures: 'Consent management with expiration tracking and renewal reminders',
      amendments: 'Structured amendment process with approval workflow and audit trail',
      identified_needs: 'Care gap identification and tracking for population health management',
      id_card_photos: 'Secure storage of patient identification with easy retrieval',
      prescriptions: 'E-prescribing interface with drug interaction checking and renewal tracking',
      golden_thread_alerts: 'Automated alerts for documentation consistency and compliance',
      clinical_reminders: 'Proactive care reminders based on patient conditions and protocols'
    };

    return rationales[widgetType] || 'Designed for efficient workflow and user experience';
  };

  const toggleRowExpansion = (widgetId: string) => {
    const newExpandedRows = new Set(expandedRows);
    if (newExpandedRows.has(widgetId)) {
      newExpandedRows.delete(widgetId);
    } else {
      newExpandedRows.add(widgetId);
    }
    setExpandedRows(newExpandedRows);
  };

  const renderContent = () => {
    switch (selectedTab) {
      case 0: // User tab
        return (
          <div className="h-full bg-zinc-50 rounded-lg shadow-sm border p-4 pb-24">
            <h2 className="text-xl font-medium text-foreground mb-1">Widget Access Management</h2>
            <p className="text-muted-foreground mb-4">
              Drag and drop widgets to assign them to different user roles. Each role will only see the widgets assigned to them.
            </p>
            <WidgetRoleManager
              availableWidgets={additionalWidgets}
              roleBoxes={roleBoxes}
              onDragEnd={handleDragEnd}
            />
          </div>
        );
      case 8: // About Widgets tab
        return (
          <div className="h-full bg-zinc-50 rounded-lg shadow-sm border p-4">
            <h2 className="text-xl font-medium text-foreground mb-1">Widget Documentation</h2>
            <p className="text-muted-foreground mb-4">
              Comprehensive documentation of all widgets in the DrCloudEHR system, including their purpose and design rationale.
            </p>
            <div className="overflow-auto">
              <Table className="border">
                <TableHeader>
                  <TableRow className="bg-muted/50 hover:bg-muted/50">
                    <TableHead className="w-[250px] text-sm font-semibold p-4">Widget Name</TableHead>
                    <TableHead className="w-[300px] text-sm font-semibold p-4">Description</TableHead>
                    <TableHead className="w-[400px] text-sm font-semibold p-4">Design Rationale</TableHead>
                    <TableHead className="w-[100px] text-sm font-semibold p-4">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {defaultWidgets.map((widget, index) => {
                    const designRationale = getWidgetDesignRationale(widget.type);
                    const isExpanded = expandedRows.has(widget.id);
                    
                    return (
                      <>
                        <TableRow 
                          key={widget.id}
                          className={index % 2 === 0 ? 'bg-white' : 'bg-muted/5'}
                        >
                          <TableCell className="text-sm font-medium text-primary p-4">
                            {widget.title}
                          </TableCell>
                          <TableCell className="text-sm text-muted-foreground p-4 leading-relaxed">
                            {widget.description || 'Manage and view patient ' + widget.title.toLowerCase()}
                          </TableCell>
                          <TableCell className="text-sm text-muted-foreground p-4 leading-relaxed">
                            {designRationale}
                          </TableCell>
                          <TableCell className="text-sm p-4">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => toggleRowExpansion(widget.id)}
                              className="flex items-center gap-1"
                            >
                              {isExpanded ? (
                                <>
                                  <span>Show less</span>
                                  <ChevronUp className="w-4 h-4" />
                                </>
                              ) : (
                                <>
                                  <span>Show more</span>
                                  <ChevronDown className="w-4 h-4" />
                                </>
                              )}
                            </Button>
                          </TableCell>
                        </TableRow>
                        {isExpanded && (
                          <TableRow className="bg-muted/5">
                            <TableCell colSpan={4} className="p-4">
                              <div className="rounded-lg bg-white p-4 shadow-sm border">
                                {widget.type === 'patient_performance' ? (
                                  <div className="space-y-4">
                                    <div>
                                      <h4 className="text-sm font-semibold mb-2">Features & Capabilities</h4>
                                      <div className="grid grid-cols-2 gap-6">
                                        <div>
                                          <h5 className="text-sm font-medium text-muted-foreground mb-2">Quick Actions</h5>
                                          <ul className="space-y-1 text-sm text-muted-foreground">
                                            <li>• Role-based contextual actions (clinician, front desk, billing)</li>
                                            <li>• Dynamic action menu with icon-based interface</li>
                                            <li>• Support for 8 quick actions per role</li>
                                          </ul>
                                        </div>
                                        <div>
                                          <h5 className="text-sm font-medium text-muted-foreground mb-2">Performance Metrics</h5>
                                          <ul className="space-y-1 text-sm text-muted-foreground">
                                            <li>• Interactive gauge visualization</li>
                                            <li>• 5-star rating system</li>
                                            <li>• Real-time objective tracking</li>
                                            <li>• Progress percentage calculation</li>
                                          </ul>
                                        </div>
                                      </div>
                                    </div>
                                    <div>
                                      <h4 className="text-sm font-semibold mb-2">Interactive Elements</h4>
                                      <div className="grid grid-cols-2 gap-6">
                                        <div>
                                          <h5 className="text-sm font-medium text-muted-foreground mb-2">Carousel Navigation</h5>
                                          <ul className="space-y-1 text-sm text-muted-foreground">
                                            <li>• Auto-rotating content with 5s interval</li>
                                            <li>• Manual navigation controls</li>
                                            <li>• Pause on hover functionality</li>
                                          </ul>
                                        </div>
                                        <div>
                                          <h5 className="text-sm font-medium text-muted-foreground mb-2">Visual Feedback</h5>
                                          <ul className="space-y-1 text-sm text-muted-foreground">
                                            <li>• Color-coded performance indicators</li>
                                            <li>• Animated gauge needle</li>
                                            <li>• Interactive hover states</li>
                                          </ul>
                                        </div>
                                      </div>
                                    </div>
                                    <div>
                                      <h4 className="text-sm font-semibold mb-2">Role-Specific Actions</h4>
                                      <div className="grid grid-cols-3 gap-6">
                                        <div>
                                          <h5 className="text-sm font-medium text-muted-foreground mb-2">Clinician Actions</h5>
                                          <ul className="space-y-1 text-sm text-muted-foreground">
                                            <li>• New Encounter</li>
                                            <li>• Add Note</li>
                                            <li>• Add Vitals</li>
                                            <li>• Add Medication</li>
                                            <li>• Schedule Visit</li>
                                            <li>• View Labs</li>
                                            <li>• Add Diagnosis</li>
                                            <li>• Care Plan</li>
                                          </ul>
                                        </div>
                                        <div>
                                          <h5 className="text-sm font-medium text-muted-foreground mb-2">Front Desk Actions</h5>
                                          <ul className="space-y-1 text-sm text-muted-foreground">
                                            <li>• Demographics</li>
                                            <li>• Schedule</li>
                                            <li>• Payments</li>
                                            <li>• Check In</li>
                                            <li>• Contact</li>
                                            <li>• Documents</li>
                                            <li>• Insurance</li>
                                          </ul>
                                        </div>
                                        <div>
                                          <h5 className="text-sm font-medium text-muted-foreground mb-2">Billing Actions</h5>
                                          <ul className="space-y-1 text-sm text-muted-foreground">
                                            <li>• Process Payment</li>
                                            <li>• View Receipts</li>
                                            <li>• View Statement</li>
                                            <li>• Prior Auth</li>
                                            <li>• New Payment</li>
                                            <li>• Manage Cards</li>
                                            <li>• Write Off</li>
                                            <li>• Add Note</li>
                                          </ul>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                ) : widget.type === 'notification_center' ? (
                                  <div className="space-y-4">
                                    <div>
                                      <h4 className="text-sm font-semibold mb-2">Core Features</h4>
                                      <div className="grid grid-cols-2 gap-6">
                                        <div>
                                          <h5 className="text-sm font-medium text-muted-foreground mb-2">Notification Types</h5>
                                          <ul className="space-y-1 text-sm text-muted-foreground">
                                            <li>• Golden Thread Alerts (Clinical alerts, medication interactions)</li>
                                            <li>• Tasks (Documentation updates, order management)</li>
                                            <li>• Messages (Consultation requests, patient communications)</li>
                                            <li>• Reminders (Appointments, immunizations, follow-ups)</li>
                                          </ul>
                                        </div>
                                        <div>
                                          <h5 className="text-sm font-medium text-muted-foreground mb-2">Priority System</h5>
                                          <ul className="space-y-1 text-sm text-muted-foreground">
                                            <li>• High priority for critical alerts</li>
                                            <li>• Medium priority for standard updates</li>
                                            <li>• Low priority for informational items</li>
                                            <li>• Real-time count tracking per category</li>
                                          </ul>
                                        </div>
                                      </div>
                                    </div>
                                    <div>
                                      <h4 className="text-sm font-semibold mb-2">Interactive Features</h4>
                                      <div className="grid grid-cols-2 gap-6">
                                        <div>
                                          <h5 className="text-sm font-medium text-muted-foreground mb-2">Notification Management</h5>
                                          <ul className="space-y-1 text-sm text-muted-foreground">
                                            <li>• Mark as read/unread functionality</li>
                                            <li>• View detailed information for each notification</li>
                                            <li>• Action buttons for quick responses</li>
                                            <li>• Empty state handling with visual feedback</li>
                                          </ul>
                                        </div>
                                        <div>
                                          <h5 className="text-sm font-medium text-muted-foreground mb-2">User Experience</h5>
                                          <ul className="space-y-1 text-sm text-muted-foreground">
                                            <li>• Smart timestamp formatting (minutes/hours/days)</li>
                                            <li>• Scrollable interface with virtual scrolling</li>
                                            <li>• Advanced sorting (priority + timestamp)</li>
                                            <li>• Visual indicators for priority levels</li>
                                          </ul>
                                        </div>
                                      </div>
                                    </div>
                                    <div>
                                      <h4 className="text-sm font-semibold mb-2">Data Model</h4>
                                      <div className="grid grid-cols-2 gap-6">
                                        <div>
                                          <h5 className="text-sm font-medium text-muted-foreground mb-2">Required Fields</h5>
                                          <ul className="space-y-1 text-sm text-muted-foreground">
                                            <li>• Unique identifier for each notification</li>
                                            <li>• Type classification (GT/Task/Message/Reminder)</li>
                                            <li>• Priority level (High/Medium/Low)</li>
                                            <li>• Title and detailed message</li>
                                            <li>• Timestamp tracking</li>
                                            <li>• Read/unread status</li>
                                          </ul>
                                        </div>
                                        <div>
                                          <h5 className="text-sm font-medium text-muted-foreground mb-2">Optional Fields</h5>
                                          <ul className="space-y-1 text-sm text-muted-foreground">
                                            <li>• Sender information</li>
                                            <li>• Category classification</li>
                                            <li>• Action required flags</li>
                                            <li>• Recipient details</li>
                                            <li>• Subject line for messages</li>
                                          </ul>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                ) : widget.type === 'activity' ? (
                                  <div className="space-y-4">
                                    <div>
                                      <h4 className="text-sm font-semibold mb-2">Core Features</h4>
                                      <div className="grid grid-cols-2 gap-6">
                                        <div>
                                          <h5 className="text-sm font-medium text-muted-foreground mb-2">Activity Types</h5>
                                          <ul className="space-y-1 text-sm text-muted-foreground">
                                            <li>• Claims (denied, submitted)</li>
                                            <li>• Appointments (scheduling)</li>
                                            <li>• Encounters (creation)</li>
                                            <li>• Patient Events (first visit, onboarding)</li>
                                          </ul>
                                        </div>
                                        <div>
                                          <h5 className="text-sm font-medium text-muted-foreground mb-2">Timeline Features</h5>
                                          <ul className="space-y-1 text-sm text-muted-foreground">
                                            <li>• Chronological activity display</li>
                                            <li>• Visual timeline connectors</li>
                                            <li>• Error state handling</li>
                                            <li>• Timestamp formatting</li>
                                          </ul>
                                        </div>
                                      </div>
                                    </div>
                                    <div>
                                      <h4 className="text-sm font-semibold mb-2">Activity Details</h4>
                                      <div className="grid grid-cols-2 gap-6">
                                        <div>
                                          <h5 className="text-sm font-medium text-muted-foreground mb-2">Information Display</h5>
                                          <ul className="space-y-1 text-sm text-muted-foreground">
                                            <li>• Title and subtitle structure</li>
                                            <li>• Error indicators and messages</li>
                                            <li>• Formatted timestamps (dd MMM, HH:mm)</li>
                                            <li>• Patient-specific activity filtering</li>
                                          </ul>
                                        </div>
                                        <div>
                                          <h5 className="text-sm font-medium text-muted-foreground mb-2">Visual Elements</h5>
                                          <ul className="space-y-1 text-sm text-muted-foreground">
                                            <li>• Timeline dots and connectors</li>
                                            <li>• Warning icons for errors</li>
                                            <li>• Responsive layout design</li>
                                            <li>• Scrollable activity feed</li>
                                          </ul>
                                        </div>
                                      </div>
                                    </div>
                                    <div>
                                      <h4 className="text-sm font-semibold mb-2">Data Structure</h4>
                                      <div className="grid grid-cols-2 gap-6">
                                        <div>
                                          <h5 className="text-sm font-medium text-muted-foreground mb-2">Required Fields</h5>
                                          <ul className="space-y-1 text-sm text-muted-foreground">
                                            <li>• Unique activity ID</li>
                                            <li>• Activity type classification</li>
                                            <li>• Activity title</li>
                                            <li>• Timestamp</li>
                                          </ul>
                                        </div>
                                        <div>
                                          <h5 className="text-sm font-medium text-muted-foreground mb-2">Optional Fields</h5>
                                          <ul className="space-y-1 text-sm text-muted-foreground">
                                            <li>• Subtitle/description</li>
                                            <li>• Error flag</li>
                                            <li>• Error message</li>
                                            <li>• Patient ID reference</li>
                                          </ul>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                ) : widget.type === 'clinical_insights_carousel' ? (
                                  <div className="space-y-4">
                                    <div>
                                      <h4 className="text-sm font-semibold mb-2">Core Features</h4>
                                      <div className="grid grid-cols-2 gap-6">
                                        <div>
                                          <h5 className="text-sm font-medium text-muted-foreground mb-2">Insight Types</h5>
                                          <ul className="space-y-1 text-sm text-muted-foreground">
                                            <li>• Warnings (e.g., Blood Pressure Alerts)</li>
                                            <li>• Trends (Up/Down patterns)</li>
                                            <li>• Due Items (Medication Reviews)</li>
                                            <li>• Lab Results</li>
                                            <li>• Metrics (Depression Screening)</li>
                                            <li>• Vitals (Heart Rate Variability)</li>
                                            <li>• Success Indicators (Care Plan Goals)</li>
                                          </ul>
                                        </div>
                                        <div>
                                          <h5 className="text-sm font-medium text-muted-foreground mb-2">Carousel Features</h5>
                                          <ul className="space-y-1 text-sm text-muted-foreground">
                                            <li>• Horizontal scrolling navigation</li>
                                            <li>• Left/right navigation buttons</li>
                                            <li>• Gradient masks for scroll indicators</li>
                                            <li>• Fullscreen mode support</li>
                                          </ul>
                                        </div>
                                      </div>
                                    </div>
                                    <div>
                                      <h4 className="text-sm font-semibold mb-2">Interactive Elements</h4>
                                      <div className="grid grid-cols-2 gap-6">
                                        <div>
                                          <h5 className="text-sm font-medium text-muted-foreground mb-2">Navigation Controls</h5>
                                          <ul className="space-y-1 text-sm text-muted-foreground">
                                            <li>• Dynamic scroll button visibility</li>
                                            <li>• Smooth scroll behavior</li>
                                            <li>• Scroll position tracking</li>
                                            <li>• Responsive scroll amount (320px)</li>
                                          </ul>
                                        </div>
                                        <div>
                                          <h5 className="text-sm font-medium text-muted-foreground mb-2">Visual Feedback</h5>
                                          <ul className="space-y-1 text-sm text-muted-foreground">
                                            <li>• Card hover effects with shadow</li>
                                            <li>• Button hover states</li>
                                            <li>• Gradient scroll indicators</li>
                                            <li>• Backdrop blur effects</li>
                                          </ul>
                                        </div>
                                      </div>
                                    </div>
                                    <div>
                                      <h4 className="text-sm font-semibold mb-2">Data Structure</h4>
                                      <div className="grid grid-cols-2 gap-6">
                                        <div>
                                          <h5 className="text-sm font-medium text-muted-foreground mb-2">Required Fields</h5>
                                          <ul className="space-y-1 text-sm text-muted-foreground">
                                            <li>• Unique insight ID</li>
                                            <li>• Insight type classification</li>
                                            <li>• Title</li>
                                            <li>• Description</li>
                                          </ul>
                                        </div>
                                        <div>
                                          <h5 className="text-sm font-medium text-muted-foreground mb-2">Optional Fields</h5>
                                          <ul className="space-y-1 text-sm text-muted-foreground">
                                            <li>• Numerical/percentage value</li>
                                            <li>• Timestamp/date information</li>
                                            <li>• Patient ID reference</li>
                                            <li>• Fullscreen mode flag</li>
                                          </ul>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                ) : (
                                  <p className="text-sm text-muted-foreground">Detailed behavior information will be added for this widget type.</p>
                                )}
                                <h4 className="text-sm font-semibold mt-4 mb-2">Available To</h4>
                                <div className="flex flex-wrap gap-2">
                                  {Object.entries(widgetPermissions)
                                    .filter(([_, widgets]) => widgets.includes(widget.type))
                                    .map(([role]) => (
                                      <span
                                        key={role}
                                        className="inline-flex items-center rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary"
                                      >
                                        {role.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                                      </span>
                                    ))
                                  }
                                </div>
                              </div>
                            </TableCell>
                          </TableRow>
                        )}
                      </>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          </div>
        );
      default:
        return (
          <div className="flex flex-col items-center justify-center p-8 bg-zinc-50 rounded-lg shadow-sm border">
            <Cog6ToothIcon className="w-16 h-16 text-muted-foreground/30" />
            <h2 className="mt-4 text-xl font-medium text-foreground">Settings Coming Soon</h2>
            <p className="mt-2 text-muted-foreground text-center max-w-md">
              We're working on bringing you a comprehensive settings panel to customize your DrCloudEHR experience. Stay tuned!
            </p>
          </div>
        );
    }
  };

  return (
    <div className="flex h-screen bg-background">
      <Sidebar 
        logo="/logo.svg"
        navigation={navigation}
        userInfo={{
          name: "Admin User",
          role: "Administrator"
        }}
      />
      <div className="flex-1 flex flex-col min-h-screen overflow-hidden">
        <Header variant="default" />
        <main className="flex-1 overflow-y-auto">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between mb-4">
              <Breadcrumb
                items={[
                  { label: 'Settings', href: '/settings' }
                ]}
              />
              <ExpandableTabs 
                tabs={settingsTabs} 
                className="bg-white/50 backdrop-blur-sm border-gray-100"
                activeColor="text-primary"
                onChange={handleTabChange}
                defaultSelected={selectedTab}
              />
            </div>

            {renderContent()}
          </div>
        </main>
      </div>
    </div>
  )
}

export default Settings 