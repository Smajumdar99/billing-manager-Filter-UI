import React, { useState, useImperativeHandle, forwardRef } from 'react'
import { Responsive, WidthProvider, Layout } from 'react-grid-layout'
import { PlusIcon, Cog6ToothIcon, PlusCircleIcon, ArrowsPointingOutIcon, TrashIcon } from '@heroicons/react/24/outline'
import { NotificationCenter } from '@/components/widgets/NotificationCenter/notification-center';
import { FunctionalStatusWidget } from '@/components/widgets/FunctionalStatusWidget/functional-status-widget';
import { DiagnosisWidget } from '@/components/widgets/DiagnosisWidget/diagnosis-widget';
import { DemographicsWidget } from '@/components/widgets/DemographicsWidget/demographics-widget';
import { InsuranceWidget } from '@/components/widgets/InsuranceWidget/insurance-widget';
import { MedicationsWidget } from '@/components/widgets/MedicationsWidget/medications-widget';
import { ProblemsWidget } from '@/components/widgets/ProblemsWidget/problems-widget';
import { BillingWidget } from '@/components/widgets/BillingWidget/billing-widget';
import AddProblemDialog from '@/components/molecules/AddProblemDialog/AddProblemDialog';
import { NewPaymentDialog } from '@/components/molecules/NewPaymentDialog/NewPaymentDialog';
import { CreditCardsDialog } from '@/components/molecules/CreditCardsDialog/CreditCardsDialog';
import { Button } from '@/components/atoms/Button/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/atoms/Dialog/dialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';
import { CreditCard, FileSignature, GripVertical } from 'lucide-react';
import 'react-grid-layout/css/styles.css'

// Create responsive grid layout component
const ResponsiveGridLayout = WidthProvider(Responsive)

/**
 * Widget configuration interface
 */
interface WidgetConfig {
  id: string
  type: string
  title: string
  component: React.ComponentType<any>
  defaultSize: { w: number; h: number }
}

/**
 * Available widgets configuration
 * Starting with NotificationCenter widget as requested
 */
const availableWidgets: WidgetConfig[] = [
  {
    id: 'notification-center',
    type: 'notification_center',
    title: 'Notifications',
    component: NotificationCenter,
    defaultSize: { w: 6, h: 8 } // 6 columns wide, 8 rows tall
  },
  {
    id: 'functional-status',
    type: 'functional_status',
    title: 'Functional Status',
    component: FunctionalStatusWidget,
    defaultSize: { w: 6, h: 8 } // 6 columns wide, 8 rows tall
  },
  {
    id: 'diagnosis',
    type: 'diagnosis',
    title: 'Diagnosis',
    component: DiagnosisWidget,
    defaultSize: { w: 6, h: 8 } // 6 columns wide, 8 rows tall
  },
  {
    id: 'demographics',
    type: 'demographics',
    title: 'Demographics',
    component: DemographicsWidget,
    defaultSize: { w: 6, h: 8 } // 6 columns wide, 8 rows tall
  },
  {
    id: 'insurance',
    type: 'insurance',
    title: 'Insurance',
    component: InsuranceWidget,
    defaultSize: { w: 6, h: 8 } // 6 columns wide, 8 rows tall
  },
  {
    id: 'medications',
    type: 'medications',
    title: 'Medications',
    component: MedicationsWidget,
    defaultSize: { w: 6, h: 8 } // 6 columns wide, 8 rows tall
  },
  {
    id: 'problems',
    type: 'problems',
    title: 'Problems',
    component: ProblemsWidget,
    defaultSize: { w: 6, h: 8 } // 6 columns wide, 8 rows tall
  },
  {
    id: 'billing',
    type: 'billing',
    title: 'Quick actions',
    component: BillingWidget,
    defaultSize: { w: 6, h: 1 } // quick-actions (compact single row)
  }
]

/**
 * Props for ClientSummaryChartPage component
 */
interface ClientSummaryChartPageProps {
  externalEditMode?: boolean;
  externalActiveWidgets?: string[];
  externalAddWidget?: (widgetId: string) => void;
  externalRemoveWidget?: (widgetId: string) => void;
  onWidgetExpandStateChange?: (expanded: boolean) => void;
}

/**
 * ClientSummaryChartPage Component
 * 
 * Widgets dashboard with drag-and-drop functionality using react-grid-layout.
 * Allows users to add, remove, and rearrange widgets in a responsive grid.
 * Follows Apple-style design principles with clean, professional layout.
 */
const ClientSummaryChartPage = forwardRef<ClientSummaryChartPageRef, ClientSummaryChartPageProps>(({
  externalEditMode = false,
  externalActiveWidgets,
  externalAddWidget,
  externalRemoveWidget,
  onWidgetExpandStateChange
}, ref) => {
  
  // Use external active widgets if provided, otherwise fallback to internal state
  const [internalActiveWidgets, setInternalActiveWidgets] = useState<string[]>(['notification-center', 'functional-status', 'diagnosis', 'demographics', 'insurance', 'billing'])
  const activeWidgets = externalActiveWidgets || internalActiveWidgets
  
  // State for widget expand/collapse
  const [widgetsExpanded, setWidgetsExpanded] = useState<boolean>(true)
  const [collapsedWidgets, setCollapsedWidgets] = useState<Set<string>>(new Set())
  
  // State for grid layouts (responsive breakpoints)
  // Updated to use 3 columns instead of 4 for wider widgets
  // Demographics widget spans 6 columns (2/3 width) for better content display
  // Insurance widget added to second row alongside demographics
  const [layouts, setLayouts] = useState<{ [key: string]: Layout[] }>({
    lg: [
      { i: 'notification-center', x: 0, y: 0, w: 3, h: 8, minW: 3, minH: 6 },
      { i: 'functional-status', x: 3, y: 0, w: 3, h: 8, minW: 3, minH: 6 },
      { i: 'diagnosis', x: 6, y: 0, w: 3, h: 8, minW: 3, minH: 6 },
      { i: 'demographics', x: 0, y: 8, w: 6, h: 8, minW: 4, minH: 6 },
      { i: 'insurance', x: 6, y: 8, w: 3, h: 8, minW: 3, minH: 6 },
      { i: 'billing', x: 0, y: 16, w: 3, h: 1, minW: 3, minH: 1 },
      { i: 'medications', x: 3, y: 16, w: 3, h: 8, minW: 3, minH: 6 },
      { i: 'problems', x: 6, y: 16, w: 3, h: 8, minW: 3, minH: 6 }
    ],
    md: [
      { i: 'notification-center', x: 0, y: 0, w: 4, h: 8, minW: 3, minH: 6 },
      { i: 'functional-status', x: 4, y: 0, w: 4, h: 8, minW: 3, minH: 6 },
      { i: 'diagnosis', x: 8, y: 0, w: 4, h: 8, minW: 3, minH: 6 },
      { i: 'demographics', x: 0, y: 8, w: 8, h: 8, minW: 4, minH: 6 },
      { i: 'insurance', x: 8, y: 8, w: 4, h: 8, minW: 3, minH: 6 },
      { i: 'billing', x: 0, y: 16, w: 4, h: 1, minW: 3, minH: 1 },
      { i: 'medications', x: 4, y: 16, w: 4, h: 8, minW: 3, minH: 6 },
      { i: 'problems', x: 8, y: 16, w: 4, h: 8, minW: 3, minH: 6 }
    ],
    sm: [
      { i: 'notification-center', x: 0, y: 0, w: 9, h: 8, minW: 9, minH: 6 },
      { i: 'functional-status', x: 0, y: 8, w: 9, h: 8, minW: 9, minH: 6 },
      { i: 'diagnosis', x: 0, y: 16, w: 9, h: 8, minW: 9, minH: 6 },
      { i: 'demographics', x: 0, y: 24, w: 9, h: 8, minW: 9, minH: 6 },
      { i: 'insurance', x: 0, y: 32, w: 9, h: 8, minW: 9, minH: 6 },
      { i: 'billing', x: 0, y: 40, w: 9, h: 1, minW: 9, minH: 1 },
      { i: 'medications', x: 0, y: 48, w: 9, h: 8, minW: 9, minH: 6 },
      { i: 'problems', x: 0, y: 56, w: 9, h: 8, minW: 9, minH: 6 }
    ]
  })

  // State for dashboard settings - use external props when available
  const [internalEditMode] = useState(false)
  const [maximizedWidget, setMaximizedWidget] = useState<string | null>(null)
  
  // Toggle expand/collapse all widgets
  const toggleExpandAll = () => {
    const newExpanded = !widgetsExpanded
    setWidgetsExpanded(newExpanded)
    
    if (newExpanded) {
      // Expand all - clear collapsed widgets
      setCollapsedWidgets(new Set())
    } else {
      // Collapse all - add all active widgets to collapsed set
      setCollapsedWidgets(new Set(activeWidgets))
    }
    
    // Notify parent component
    onWidgetExpandStateChange?.(newExpanded)
  }
  
  // Expose toggle function to parent via ref
  useImperativeHandle(ref, () => ({
    toggleExpandAll
  }))
  
  // Update layouts when widgets are collapsed/expanded
  const getAdjustedLayouts = () => {
    const adjustedLayouts: { [key: string]: Layout[] } = {}
    
    Object.keys(layouts).forEach(breakpoint => {
      adjustedLayouts[breakpoint] = layouts[breakpoint].map(layout => {
        const isCollapsed = collapsedWidgets.has(layout.i)
        return {
          ...layout,
          h: isCollapsed ? 1 : layout.h // Collapsed widgets have height of 1
        }
      })
    })
    
    return adjustedLayouts
  }
  
  const adjustedLayouts = getAdjustedLayouts()
  
  // State for AddProblemDialog
  const [isAddProblemDialogOpen, setIsAddProblemDialogOpen] = useState(false)
  const [problems, setProblems] = useState<any[]>([])
  const [editingProblem, setEditingProblem] = useState<any | null>(null)
  
  // State for NewPaymentDialog
  const [isNewPaymentDialogOpen, setIsNewPaymentDialogOpen] = useState(false)
  
  // State for CreditCardsDialog
  const [isCreditCardsDialogOpen, setIsCreditCardsDialogOpen] = useState(false)
  
  // Use external props if provided, otherwise use internal state
  const isEditMode = externalEditMode || internalEditMode

  /**
   * Handle layout changes when widgets are dragged/resized
   */
  const handleLayoutChange = (_layout: Layout[], allLayouts: { [key: string]: Layout[] }) => {
    setLayouts(allLayouts)
    // Save to localStorage for persistence
    localStorage.setItem('clientSummaryDashboardLayouts', JSON.stringify(allLayouts))
  }

  /**
   * Handle opening AddProblemDialog
   */
  const handleAddProblem = () => {
    setIsAddProblemDialogOpen(true)
  }

  /**
   * Handle closing AddProblemDialog
   */
  const handleCloseAddProblemDialog = () => {
    setIsAddProblemDialogOpen(false)
    setEditingProblem(null) // Reset editing state when closing
  }

  /**
   * Handle adding a new problem
   */
  const handleAddNewProblem = (problem: any) => {
    if (editingProblem) {
      // Update existing problem
      setProblems(prev => prev.map(p => p.id === editingProblem.id ? { ...problem, id: editingProblem.id } : p))
      console.log('Problem updated:', problem)
      setEditingProblem(null)
    } else {
      // Add new problem
      setProblems(prev => [...prev, { ...problem, id: Date.now().toString() }])
      console.log('New problem added:', problem)
    }
  }

  /**
   * Handle editing a problem from the widget
   */
  const handleEditProblemFromWidget = (problem: any) => {
    setEditingProblem(problem)
    setIsAddProblemDialogOpen(true)
  }

  /**
   * Handle deleting a problem from the widget
   */
  const handleDeleteProblemFromWidget = (problemId: string) => {
    setProblems(prev => prev.filter(p => p.id !== problemId))
    console.log('Problem deleted:', problemId)
  }

  /**
   * Handle navigation to Problems Management page
   */
  const handleViewEditAllProblems = () => {
    // TODO: Implement navigation to Problems Management page
    // This would typically use React Router or Next.js router
    console.log('Navigate to Problems Management page')
    window.location.href = '/problems-management'
  }

  /**
   * Add a new widget to the dashboard
   */
  const addWidget = (widgetId: string) => {
    // Use external function if provided, otherwise use internal logic
    if (externalAddWidget) {
      externalAddWidget(widgetId)
      return
    }
    
    if (!activeWidgets.includes(widgetId)) {
      const widget = availableWidgets.find(w => w.id === widgetId)
      if (widget) {
        setInternalActiveWidgets((prev: string[]) => [...prev, widgetId])
        
        // Add to layouts for all breakpoints
        const newLayouts = { ...layouts }
        Object.keys(newLayouts).forEach(breakpoint => {
          const layout = newLayouts[breakpoint]
          const cols = breakpoint === 'sm' ? 12 : 12 // Total columns available
          const widgetWidth = breakpoint === 'sm' ? 12 : widget.defaultSize.w
          
          // Find the best position for the new widget
          let bestX = 0
          let bestY = 0
          let found = false
          
          // Try to place widget in the same row as existing widgets first
          for (let y = 0; y <= Math.max(...layout.map(item => item.y + item.h), 0); y++) {
            for (let x = 0; x <= cols - widgetWidth; x++) {
              // Check if this position conflicts with existing widgets
              const conflicts = layout.some(item => 
                x < item.x + item.w && x + widgetWidth > item.x &&
                y < item.y + item.h && y + widget.defaultSize.h > item.y
              )
              
              if (!conflicts) {
                bestX = x
                bestY = y
                found = true
                break
              }
            }
            if (found) break
          }
          
          const isBillingQuickActions = widgetId === 'billing'
          newLayouts[breakpoint] = [
            ...layout,
            {
              i: widgetId,
              x: bestX,
              y: bestY,
              w: widgetWidth,
              h: widget.defaultSize.h,
              minW: breakpoint === 'sm' ? 12 : 4,
              minH: isBillingQuickActions ? 1 : 6
            }
          ]
        })
        
        setLayouts(newLayouts)
      }
    }
    // Widget selector is now managed externally
  }

  /**
   * Remove a widget from the dashboard
   */
  const removeWidget = (widgetId: string) => {
    // Use external function if provided, otherwise use internal logic
    if (externalRemoveWidget) {
      externalRemoveWidget(widgetId)
      return
    }
    
    setInternalActiveWidgets((prev: string[]) => prev.filter((id: string) => id !== widgetId))
    
    // Remove from layouts
    const newLayouts = { ...layouts }
    Object.keys(newLayouts).forEach(breakpoint => {
      newLayouts[breakpoint] = newLayouts[breakpoint].filter(item => item.i !== widgetId)
    })
    
    setLayouts(newLayouts)
  }

  /**
   * Render widget footer with action buttons based on widget type
   */
  const renderWidgetFooter = (widgetType: string) => {
    switch (widgetType) {
      case 'notification_center':
        return (
          <div className="flex items-center gap-3 px-4 py-3 border-t border-gray-100 bg-gray-50">
            <Button
              onClick={() => console.log('New Task')}
              variant="link"
              className="gap-2 shrink-0 text-primary hover:brightness-110 h-auto py-2 text-sm font-normal"
            >
              <PlusCircleIcon className="w-5 h-5" />
              New Task
            </Button>
            <Button
              onClick={() => console.log('New Reminder')}
              variant="link"
              className="gap-2 shrink-0 text-primary hover:brightness-110 h-auto py-2 text-sm font-normal"
            >
              <PlusCircleIcon className="w-5 h-5" />
              New Reminder
            </Button>
          </div>
        )
      case 'diagnosis':
        return (
          <div className="flex items-center gap-3 px-4 py-3 border-t border-gray-100 bg-gray-50">
            <Button
              onClick={() => console.log('Add Diagnosis')}
              variant="link"
              className="gap-2 shrink-0 text-primary hover:brightness-110 h-auto py-2 text-sm font-normal"
            >
              <PlusCircleIcon className="w-5 h-5" />
              Add Diagnosis
            </Button>
            <Button
              onClick={() => console.log('View History')}
              variant="link"
              className="gap-2 shrink-0 text-primary hover:brightness-110 h-auto py-2 text-sm font-normal"
            >
              View History
            </Button>
          </div>
        )
      case 'demographics':
        return (
          <div className="flex items-center gap-3 px-4 py-3 border-t border-gray-100 bg-gray-50">
            <Button
              onClick={() => {
                // Find the Edit Demographics button in the widget and click it
                const editButton = document.querySelector('[data-testid="edit-demographics-button"]') as HTMLButtonElement;
                if (editButton) {
                  editButton.click();
                } else {
                  console.log('Edit Demographics button not found in widget');
                }
              }}
              variant="link"
              className="gap-2 shrink-0 text-primary hover:brightness-110 h-auto py-2 text-sm font-normal"
            >
              <PlusCircleIcon className="w-5 h-5" />
              Edit Demographics
            </Button>
            <Button
              onClick={() => console.log('View Full Profile')}
              variant="link"
              className="gap-2 shrink-0 text-primary hover:brightness-110 h-auto py-2 text-sm font-normal"
            >
              View Full Profile
            </Button>
          </div>
        )
      case 'insurance':
        return (
          <div className="flex items-center gap-3 px-4 py-3 border-t border-gray-100 bg-gray-50">
            <Button
              onClick={() => console.log('Add Insurance')}
              variant="link"
              className="gap-2 shrink-0 text-primary hover:brightness-110 h-auto py-2 text-sm font-normal"
            >
              <PlusCircleIcon className="w-5 h-5" />
              Add Insurance
            </Button>
            <Button
              onClick={() => console.log('Verify Coverage')}
              variant="link"
              className="gap-2 shrink-0 text-primary hover:brightness-110 h-auto py-2 text-sm font-normal"
            >
              Verify Coverage
            </Button>
          </div>
        )
      case 'medications':
        return (
          <div className="flex items-center gap-3 px-4 py-3 border-t border-gray-100 bg-gray-50">
            <Button
              onClick={() => console.log('Add Medication')}
              variant="link"
              className="gap-2 shrink-0 text-primary hover:brightness-110 h-auto py-2 text-sm font-normal"
            >
              <PlusCircleIcon className="w-5 h-5" />
              Add Medication
            </Button>
            <Button
              onClick={() => console.log('Refill Request')}
              variant="link"
              className="gap-2 shrink-0 text-primary hover:brightness-110 h-auto py-2 text-sm font-normal"
            >
              Refill Request
            </Button>
          </div>
        )
      case 'problems':
        return (
          <div className="flex items-center gap-3 px-4 py-3 border-t border-gray-100 bg-gray-50">
            <Button
              onClick={handleAddProblem}
              variant="link"
              className="gap-2 shrink-0 text-primary hover:brightness-110 h-auto py-2 text-sm font-normal"
            >
              <PlusCircleIcon className="w-5 h-5" />
              Add Problem
            </Button>
            <Button
              onClick={handleViewEditAllProblems}
              variant="link"
              className="gap-2 shrink-0 text-primary hover:brightness-110 h-auto py-2 text-sm font-normal"
            >
              View/Edit All
            </Button>
            <Button
              onClick={() => console.log('Preview & Print Problems')}
              variant="link"
              className="gap-2 shrink-0 text-primary hover:brightness-110 h-auto py-2 text-sm font-normal"
            >
              Preview & Print
            </Button>
          </div>
        )
      default:
        return null
    }
  }

  /** Action buttons row (shared by grid tile and maximize dialog). */
  const renderBillingQuickActionsButtons = () => (
    <div className="flex flex-row items-center gap-3 w-full">
      <button
        type="button"
        className="flex flex-1 items-center justify-center gap-2 whitespace-nowrap px-4 py-3 text-[14px] font-semibold text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
        onClick={() => console.log('Authorization')}
      >
        <FileSignature size={16} className="shrink-0 text-slate-500" />
        Authorization
      </button>
      <button
        type="button"
        className="flex flex-1 items-center justify-center gap-2 whitespace-nowrap px-4 py-3 text-[14px] font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
        onClick={() => setIsNewPaymentDialogOpen(true)}
      >
        <CreditCard size={16} className="shrink-0 text-white" />
        New Payment
      </button>
    </div>
  )

  /**
   * Render individual widget with proper Widget wrapper
   */
  const renderWidget = (widgetId: string) => {
    const widget = availableWidgets.find(w => w.id === widgetId)
    if (!widget) return null

    const WidgetComponent = widget.component
    const isCollapsed = collapsedWidgets.has(widgetId)

    if (widget.type === 'billing') {
      if (isCollapsed) {
        return <div key={widgetId} className="h-max min-h-0" aria-hidden />
      }
      return (
        <div
          key={widgetId}
          className={cn(
            'relative bg-white rounded-xl border border-slate-200 w-full h-fit self-start p-5 pl-12',
            isEditMode && 'ring-2 ring-blue-500 ring-opacity-50'
          )}
        >
          <div
            className="widget-drag-handle absolute top-3 left-3 cursor-grab text-slate-400 active:cursor-grabbing hover:text-slate-600"
            aria-hidden
          >
            <GripVertical size={18} />
          </div>
          {renderBillingQuickActionsButtons()}
          {isEditMode && (
            <button
              type="button"
              onClick={() => removeWidget(widgetId)}
              className="absolute top-3 right-3 z-20 flex h-6 w-6 items-center justify-center rounded-full bg-red-500 text-sm text-white transition-colors hover:bg-red-600"
              title="Remove widget"
            >
              ×
            </button>
          )}
        </div>
      )
    }

    return (
      <div 
        key={widgetId}
        className={cn(
          "h-full relative",
          isEditMode && "ring-2 ring-blue-500 ring-opacity-50 rounded-lg"
        )}
      >
        <div className={cn(
          "h-full flex flex-col bg-white rounded-lg border shadow-sm transition-all duration-300",
          isCollapsed && "overflow-hidden"
        )}>
          {/* Widget Header with actions */}
          <div className="flex items-center justify-between p-4 border-b">
            <div className="flex items-center gap-2">
              <div className="widget-drag-handle cursor-move p-1 hover:bg-accent/50 rounded-md">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 text-muted-foreground">
                  <circle cx="9" cy="12" r="1"></circle>
                  <circle cx="9" cy="5" r="1"></circle>
                  <circle cx="9" cy="19" r="1"></circle>
                  <circle cx="15" cy="12" r="1"></circle>
                  <circle cx="15" cy="5" r="1"></circle>
                  <circle cx="15" cy="19" r="1"></circle>
                </svg>
              </div>
              <h4 className="font-semibold">{widget.title}</h4>
            </div>
            
            <div className="flex gap-2">
              {/* Widget Settings Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button
                    className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 hover:bg-accent h-9 w-9 text-muted-foreground hover:text-foreground"
                    aria-label="Widget settings"
                  >
                    <Cog6ToothIcon className="w-4 h-4" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuItem onClick={() => console.log(`Configure ${widget.title}`)}>
                    <Cog6ToothIcon className="w-4 h-4 mr-2" />
                    Configure Widget
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => console.log(`Export ${widget.title}`)}>
                    Export
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    onClick={() => removeWidget(widgetId)}
                    className="text-red-600 focus:text-red-600"
                  >
                    <TrashIcon className="w-4 h-4 mr-2" />
                    Remove Widget
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              
              {/* Maximize Button */}
              <button
                onClick={() => setMaximizedWidget(widgetId)}
                className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 hover:bg-accent h-9 w-9 text-muted-foreground hover:text-foreground"
                aria-label="Maximize widget"
              >
                <ArrowsPointingOutIcon className="w-4 h-4" />
              </button>
            </div>
          </div>
          
          {/* Widget Content */}
          {!isCollapsed && (
            <div className="flex-1 p-4 overflow-hidden">
              <WidgetComponent 
                patientId="demo-patient" 
                className="h-full"
                userRole="clinician"
                isFullscreen={false}
                {...(widget.type === 'problems' && {
                  onEditProblem: handleEditProblemFromWidget,
                  onDeleteProblem: handleDeleteProblemFromWidget
                })}
              />
            </div>
          )}
          
          {/* Widget Footer Actions */}
          {renderWidgetFooter(widget.type)}
        </div>
        
        {/* Remove button for edit mode */}
        {isEditMode && (
          <button
            onClick={() => removeWidget(widgetId)}
            className="absolute top-2 right-2 z-10 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-sm hover:bg-red-600 transition-colors"
            title="Remove widget"
          >
            ×
          </button>
        )}
      </div>
    )
  }

  // Grid breakpoints configuration
  // Updated to use 9 columns for 3-widget layout instead of 12 columns for 4-widget layout
  const breakpoints = { lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }
  const cols = { lg: 9, md: 12, sm: 9, xs: 9, xxs: 9 }

  return (
    <div className="h-full flex flex-col bg-gray-50 relative">

      {/* Dashboard Grid */}
      <div className="flex-1 p-6 overflow-auto">
        {activeWidgets.length === 0 ? (
          // Empty state
          <div className="h-full flex flex-col items-center justify-center text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <PlusIcon className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No widgets added</h3>
            <p className="text-sm text-gray-600 mb-4 max-w-md">
              Start building your dashboard by adding widgets. Click "Add Widget" in the breadcrumb above to get started.
            </p>
          </div>
        ) : (
          // Grid layout with widgets
          <ResponsiveGridLayout
            className="layout"
            layouts={adjustedLayouts}
            onLayoutChange={handleLayoutChange}
            breakpoints={breakpoints}
            cols={cols}
            rowHeight={90}
            isDraggable={true}
            isResizable={isEditMode}
            draggableHandle=".widget-drag-handle"
            margin={[16, 16]}
            containerPadding={[0, 0]}
            useCSSTransforms={true}
          >
            {activeWidgets.map(renderWidget)}
          </ResponsiveGridLayout>
        )}
      </div>

      {/* Maximize Dialog */}
      <Dialog open={maximizedWidget !== null} onOpenChange={() => setMaximizedWidget(null)}>
        <DialogContent className="max-w-7xl w-[95vw] h-[95vh] p-0 gap-0">
          <DialogHeader className="px-6 py-4 border-b">
            <DialogTitle className="text-lg font-semibold">
              {maximizedWidget && availableWidgets.find(w => w.id === maximizedWidget)?.title}
            </DialogTitle>
          </DialogHeader>
          <div className="flex-1 overflow-auto px-6 py-6">
            {maximizedWidget && (() => {
              const widget = availableWidgets.find(w => w.id === maximizedWidget)
              if (!widget) return null
              if (widget.type === 'billing') {
                return (
                  <div className="relative flex items-center h-fit w-full max-w-4xl bg-white p-5 pl-12 rounded-xl border border-slate-200">
                    <div className="absolute top-3 left-3 text-slate-400" aria-hidden>
                      <GripVertical size={18} />
                    </div>
                    {renderBillingQuickActionsButtons()}
                  </div>
                )
              }
              const WidgetComponent = widget.component
              return (
                <div className="h-full [&_.space-y-2]:pt-0">
                  <WidgetComponent
                    patientId="12345"
                    userRole="clinician"
                    className="h-full"
                    isFullscreen={true}
                  />
                </div>
              )
            })()}
          </div>
        </DialogContent>
      </Dialog>

      {/* Add Problem Dialog */}
      <AddProblemDialog
        open={isAddProblemDialogOpen}
        onClose={handleCloseAddProblemDialog}
        onAddProblem={handleAddNewProblem}
        existingProblems={problems}
        editingProblem={editingProblem}
      />

      {/* New Payment Dialog */}
      <NewPaymentDialog
        isOpen={isNewPaymentDialogOpen}
        onClose={() => setIsNewPaymentDialogOpen(false)}
        patientId="1003619"
      />

      {/* Credit Cards Dialog */}
      <CreditCardsDialog
        isOpen={isCreditCardsDialogOpen}
        onClose={() => setIsCreditCardsDialogOpen(false)}
        patientId="1003619"
      />
    </div>
  )
})

ClientSummaryChartPage.displayName = 'ClientSummaryChartPage'

export default ClientSummaryChartPage
