import { FC, ReactNode } from 'react'
import { Responsive, WidthProvider } from 'react-grid-layout'
import 'react-grid-layout/css/styles.css'
import 'react-resizable/css/styles.css'
import { Layouts, WidgetLayout } from '@/types/layout'

const ResponsiveGridLayout = WidthProvider(Responsive)

interface WidgetGridProps {
  children: ReactNode
  layouts: Layouts
  onLayoutChange?: (currentLayout: WidgetLayout[], allLayouts: Layouts) => void
}

export const WidgetGrid: FC<WidgetGridProps> = ({ children, layouts, onLayoutChange }) => {
  return (
    <div className="min-h-full w-full">
      <ResponsiveGridLayout
        className="layout layout--responsive"
        layouts={layouts}
        breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480 }}
        cols={{ lg: 12, md: 10, sm: 6, xs: 4 }}
        rowHeight={50}
        useCSSTransforms
        transformScale={1}
        onLayoutChange={(_, allLayouts) => onLayoutChange?.(_, allLayouts)}
        isDraggable={true}
        isResizable={true}
        draggableHandle=".widget-drag-handle"
        margin={[8, 8]}
        containerPadding={[8, 8]}
        resizeHandles={['se']}
        preventCollision={false}
        compactType="vertical"
      >
        {children}
      </ResponsiveGridLayout>
    </div>
  )
} 