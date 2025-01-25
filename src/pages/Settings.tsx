import { FC, useState, useEffect } from 'react'
import { Header } from '@/components/organisms/Header'
import { Breadcrumb } from '@/components/atoms/Breadcrumb/breadcrumb'
import { Cog6ToothIcon } from '@heroicons/react/24/outline'
import { ExpandableTabs } from '@/components/ui/expandable-tabs'
import { Settings as SettingsIcon, Globe, Sparkles, Calendar, Bell, User } from 'lucide-react'
import { WidgetRoleManager } from '@/components/molecules/WidgetRoleManager/widget-role-manager'
import { additionalWidgets } from '@/components/molecules/WidgetSelector/widget-selector'
import { WidgetType } from '@/types/widget'
import { saveWidgetRoles, getWidgetRoles } from '../lib/firestore/widget-roles'
import { useToast } from '../components/ui/use-toast.tsx'
import { Sidebar } from '@/components/organisms/Sidebar'
import { navigation } from '@/components/organisms/SidebarMenu'

interface RoleBoxWidget {
  id: string;  // Unique ID for each instance
  type: WidgetType;
}

const Settings: FC = () => {
  const [selectedTab, setSelectedTab] = useState<number>(0);
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
  ];

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
                onChange={setSelectedTab}
                defaultSelected={0}
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