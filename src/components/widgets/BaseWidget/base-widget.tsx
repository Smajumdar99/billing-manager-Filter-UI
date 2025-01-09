import { FC, ReactNode, useState } from 'react'
import { 
  ArrowsPointingOutIcon,
  Bars2Icon,
  XMarkIcon
} from '@heroicons/react/24/outline'
import { Button } from '@/components/atoms/Button'
import * as Dialog from '@radix-ui/react-dialog'
import { cn } from '@/lib/utils'

export interface BaseWidgetProps {
  className?: string
  title: string
  description?: string
  dragHandleProps?: any
  children?: ReactNode
  onExpand?: () => void
  expandable?: boolean
  headerActions?: ReactNode
  dimensions?: {
    minW?: number | string
    minH?: number | string
    maxW?: number | string
    maxH?: number | string
    defaultW?: number | string
    defaultH?: number | string
  }
}

export const BaseWidget: FC<BaseWidgetProps> = ({
  className,
  title,
  description,
  dragHandleProps,
  children,
  onExpand,
  expandable = true,
  headerActions,
  dimensions = {}
}) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  return (
    <>
      <div
        className={cn(
          "bg-white rounded-lg border shadow-sm overflow-hidden",
          className
        )}
        style={{ 
          minWidth: typeof dimensions.minW === 'number' ? `${dimensions.minW}px` : dimensions.minW, 
          minHeight: typeof dimensions.minH === 'number' ? `${dimensions.minH}px` : dimensions.minH,
          maxWidth: typeof dimensions.maxW === 'number' ? `${dimensions.maxW}px` : dimensions.maxW,
          maxHeight: typeof dimensions.maxH === 'number' ? `${dimensions.maxH}px` : dimensions.maxH,
          width: typeof dimensions.defaultW === 'number' ? `${dimensions.defaultW}px` : dimensions.defaultW,
          height: typeof dimensions.defaultH === 'number' ? `${dimensions.defaultH}px` : dimensions.defaultH
        }}
      >
        <div className="flex flex-col h-full">
          {/* Widget Header */}
          <div className="flex items-center px-4 py-1 border-b bg-primary/5">
            {/* Drag Handle */}
            <div 
              {...dragHandleProps}
              className="cursor-move p-1 -ml-2 hover:bg-gray-100 rounded-md transition-colors"
            >
              <Bars2Icon className="h-4 w-4 text-gray-500" />
            </div>

            <h3 className="text-sm font-semibold ml-2 flex-1">{title}</h3>
            
            <div className="flex items-center gap-2">
              {headerActions}
              {expandable && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => setIsDialogOpen(true)}
                >
                  <ArrowsPointingOutIcon className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>

          {/* Widget Content */}
          <div className="flex-1 p-4 overflow-auto">
            {children}
          </div>
        </div>
      </div>

      {/* Full Screen Dialog */}
      {expandable && (
        <Dialog.Root open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <Dialog.Portal>
            <Dialog.Overlay className="fixed inset-0 bg-black/20 backdrop-blur-sm transition-all duration-100" />
            <Dialog.Content className="fixed left-[50%] top-[50%] translate-x-[-50%] translate-y-[-50%] w-[95vw] max-w-7xl h-[90vh] bg-white rounded-lg shadow-xl border animate-in fade-in-0 zoom-in-95">
              <div className="flex flex-col h-full">
                <div className="flex-shrink-0 p-6 border-b">
                  <Dialog.Title className="text-xl font-semibold">
                    {title}
                  </Dialog.Title>
                  {description && (
                    <Dialog.Description className="text-sm text-muted-foreground mt-1">
                      {description}
                    </Dialog.Description>
                  )}
                </div>

                <div className="flex-1 p-6 overflow-auto">
                  {children}
                </div>

                <Dialog.Close asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute top-4 right-4 h-8 w-8 hover:bg-gray-100 transition-colors"
                  >
                    <XMarkIcon className="h-4 w-4" />
                  </Button>
                </Dialog.Close>
              </div>
            </Dialog.Content>
          </Dialog.Portal>
        </Dialog.Root>
      )}
    </>
  )
} 