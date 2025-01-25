import { FC, useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  useSensor,
  useSensors,
  PointerSensor,
  useDraggable,
  useDroppable,
  DragStartEvent,
} from '@dnd-kit/core';
import { Widget, WidgetType } from '@/types/widget';
import { getWidgetIcon } from '@/components/molecules/WidgetSelector/widget-selector';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';

interface RoleBoxWidget {
  id: string;
  type: WidgetType;
}

interface RoleBox {
  id: string;
  title: string;
  description: string;
  widgets: RoleBoxWidget[];
}

interface WidgetRoleManagerProps {
  availableWidgets: Widget[];
  roleBoxes: RoleBox[];
  onDragEnd: (widgetId: string, targetBoxId: string) => void;
}

const DraggableWidgetCard: FC<{ 
  widget: Widget;
  onDelete?: () => void;
}> = ({ widget, onDelete }) => {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: widget.id,
    data: widget,
  });

  return (
    <div ref={setNodeRef} {...listeners} {...attributes}>
      <WidgetCard widget={widget} isDragging={isDragging} onDelete={onDelete} />
    </div>
  );
};

const WidgetCard: FC<{ 
  widget: Widget; 
  isDragging?: boolean;
  onDelete?: () => void;
}> = ({ widget, isDragging, onDelete }) => {
  const { icon: Icon, colors } = getWidgetIcon(widget.type);
  return (
    <motion.div
      layout
      initial={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      className={`flex items-center gap-2 p-2 rounded-md border bg-white group relative
        ${isDragging ? 'opacity-50 cursor-grabbing' : 'cursor-grab hover:bg-slate-50'}`}
    >
      <div className={`flex items-center justify-center w-5 h-5 rounded-sm ${colors}`}>
        <Icon className="w-3 h-3" />
      </div>
      <span className="text-xs truncate flex-1">{widget.title}</span>
      {onDelete && (
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onDelete();
          }}
          className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-red-50 rounded-sm"
          aria-label="Delete widget"
        >
          <svg className="w-3 h-3 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      )}
    </motion.div>
  );
};

const SearchInput: FC<{
  value: string;
  onChange: (value: string) => void;
}> = ({ value, onChange }) => (
  <div className="relative flex-none mb-3">
    <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
    <input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder="Search widgets..."
      className="w-full pl-9 pr-3 py-2 text-sm bg-white border border-slate-200 rounded-md 
        placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/10 
        focus:border-primary/50"
    />
  </div>
);

const DroppableBox: FC<{
  id: string;
  title: string;
  description: string;
  children: React.ReactNode;
  className?: string;
  showSearch?: boolean;
  searchValue?: string;
  onSearchChange?: (value: string) => void;
  height?: string;
  roleBoxes?: RoleBox[];
  activeWidget?: Widget | null;
}> = ({ 
  id, 
  title, 
  description, 
  children, 
  className = '',
  showSearch = false,
  searchValue = '',
  onSearchChange,
  height = 'h-[400px]',
  roleBoxes = [],
  activeWidget = null,
}) => {
  const { setNodeRef, isOver, active } = useDroppable({
    id,
  });

  // Check if the currently dragged widget would be a duplicate in this box
  const isDuplicate = useMemo(() => {
    if (!isOver || !activeWidget || id === 'available-widgets') return false;
    const currentBox = roleBoxes.find(box => box.id === id);
    if (!currentBox) return false;
    return currentBox.widgets.some(w => w.type === activeWidget.type);
  }, [isOver, activeWidget, id, roleBoxes]);

  return (
    <div
      ref={setNodeRef}
      className={`p-2 rounded-lg border transition-all duration-200 ${height} flex flex-col
        ${isOver && !isDuplicate ? 'ring-2 ring-primary ring-opacity-50 bg-primary/5 scale-[1.02]' : ''}
        ${isOver && isDuplicate ? 'ring-2 ring-red-500 ring-opacity-50 bg-red-50/50 scale-[1.02]' : ''}
        ${!isOver ? 'bg-white' : ''} 
        ${className}`}
    >
      <div className="flex-none">
        <h3 className="text-sm font-semibold text-slate-900 mb-1">{title}</h3>
        <p className="text-xs text-slate-500 mb-3">{description}</p>
        {showSearch && onSearchChange && (
          <SearchInput value={searchValue} onChange={onSearchChange} />
        )}
      </div>
      <div className="overflow-y-auto flex-1 pr-2 scrollbar-thin scrollbar-thumb-slate-200 scrollbar-track-transparent">
        {children}
      </div>
      {isOver && isDuplicate && (
        <div className="absolute inset-0 flex items-center justify-center bg-red-50/10 rounded-lg border-2 border-red-500 border-dashed">
          <div className="bg-white px-3 py-2 rounded-md shadow-sm">
            <p className="text-sm text-red-600 font-medium">Widget already exists in this role</p>
          </div>
        </div>
      )}
    </div>
  );
};

export const WidgetRoleManager: FC<WidgetRoleManagerProps> = ({
  availableWidgets,
  roleBoxes,
  onDragEnd,
}) => {
  const [activeWidget, setActiveWidget] = useState<Widget | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  const filteredWidgets = useMemo(() => {
    if (!searchQuery.trim()) return availableWidgets;
    const query = searchQuery.toLowerCase();
    return availableWidgets.filter(widget => 
      widget.title.toLowerCase().includes(query) ||
      widget.type.toLowerCase().includes(query)
    );
  }, [availableWidgets, searchQuery]);

  const handleDragStart = (event: DragStartEvent) => {
    const widget = availableWidgets.find(w => w.id === event.active.id);
    if (widget) {
      setActiveWidget(widget);
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (over) {
      // Check for duplicates before calling onDragEnd
      const targetBoxId = over.id as string;
      if (targetBoxId !== 'available-widgets') {
        const targetBox = roleBoxes.find(box => box.id === targetBoxId);
        const widget = availableWidgets.find(w => w.id === active.id);
        if (targetBox && widget && targetBox.widgets.some(w => w.type === widget.type)) {
          // Don't proceed with the drop if it's a duplicate
          setActiveWidget(null);
          return;
        }
      }
      onDragEnd(active.id as string, targetBoxId);
    }
    
    setActiveWidget(null);
  };

  const handleDelete = (boxId: string, widgetId: string) => {
    console.log('Deleting widget:', widgetId, 'from box:', boxId);
    onDragEnd(widgetId, 'available-widgets');
  };

  return (
    <DndContext 
      sensors={sensors} 
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="grid grid-cols-5 gap-4 h-[calc(100vh-340px)]">
        {/* Available Widgets Column */}
        <div className="col-span-1 max-h-[calc(100vh-300px)]">
          <DroppableBox
            id="available-widgets"
            title="Available Widgets"
            description="Drag widgets to assign them to roles"
            className="bg-slate-50/50"
            showSearch
            searchValue={searchQuery}
            onSearchChange={setSearchQuery}
            height="h-full"
            roleBoxes={roleBoxes}
            activeWidget={activeWidget}
          >
            <div className="space-y-2">
              {filteredWidgets.map((widget) => (
                <DraggableWidgetCard key={widget.id} widget={widget} />
              ))}
              {filteredWidgets.length === 0 && (
                <div className="text-sm text-slate-500 text-center py-4">
                  No widgets found matching "{searchQuery}"
                </div>
              )}
            </div>
          </DroppableBox>
        </div>

        {/* Role Boxes */}
        <div className="col-span-4 grid grid-cols-2 gap-4">
          {roleBoxes.map((box) => (
            <DroppableBox
              key={box.id}
              id={box.id}
              title={box.title}
              description={box.description}
              height="h-[360px]"
              roleBoxes={roleBoxes}
              activeWidget={activeWidget}
            >
              <div className="grid grid-cols-2 gap-2">
                <AnimatePresence mode="popLayout">
                  {box.widgets.map((boxWidget) => {
                    const widget = availableWidgets.find(w => w.type === boxWidget.type);
                    if (!widget) return null;
                    return (
                      <motion.div
                        key={boxWidget.id}
                        layout
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        transition={{ duration: 0.2, ease: "easeOut" }}
                      >
                        <DraggableWidgetCard 
                          widget={{ ...widget, id: boxWidget.id }}
                          onDelete={() => handleDelete(box.id, boxWidget.id)}
                        />
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
              </div>
            </DroppableBox>
          ))}
        </div>
      </div>

      <DragOverlay>
        {activeWidget ? <WidgetCard widget={activeWidget} isDragging /> : null}
      </DragOverlay>
    </DndContext>
  );
}; 