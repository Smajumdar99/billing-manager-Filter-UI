import React, { FC, ReactNode, useState } from 'react'
import { GripVertical, X } from 'lucide-react'
import { Cog6ToothIcon, ArrowsPointingOutIcon } from '@heroicons/react/24/outline'
import { Button } from '@/components/atoms/Button'
import { Dialog, DialogContent } from '@/components/atoms/Dialog/dialog'
import { cn } from '@/lib/utils'

interface WidgetProps {
  title: string
  children: ReactNode
  onSettingsClick?: () => void
  className?: string
}

export const Widget: FC<WidgetProps> = ({
  title,
  children,
  onSettingsClick,
  className = ''
}) => {
  const [isMaximized, setIsMaximized] = useState(false)

  const content = (
    <div className="p-3 sm:p-4 h-[calc(100%-56px)] sm:h-[calc(100%-65px)] overflow-hidden min-h-0">
      {children}
    </div>
  )

  return (
    <>
      <div className={cn(
        "h-full min-h-0 bg-card rounded-lg border shadow-sm select-none flex flex-col",
        "w-full max-w-full",
        className
      )}>
        <div className="flex items-center justify-between p-3 sm:p-4 border-b shrink-0 min-h-[52px] sm:min-h-[65px]">
          <div className="flex items-center gap-2 min-w-0">
            <div className="widget-drag-handle cursor-move p-1 hover:bg-accent/50 rounded-md touch-manipulation shrink-0">
              <GripVertical className="w-4 h-4 text-muted-foreground" />
            </div>
            <h4 className="font-semibold text-sm sm:text-base truncate">{title}</h4>
          </div>
          
          <div className="flex gap-1 sm:gap-2 shrink-0">
            <Button
              variant="ghost"
              size="icon"
              onClick={onSettingsClick}
              className="text-muted-foreground hover:text-foreground h-8 w-8 sm:h-9 sm:w-9"
              aria-label="Widget settings"
            >
              <Cog6ToothIcon className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMaximized(true)}
              className="text-muted-foreground hover:text-foreground h-8 w-8 sm:h-9 sm:w-9"
              aria-label="Maximize widget"
            >
              <ArrowsPointingOutIcon className="w-4 h-4" />
            </Button>
          </div>
        </div>
        {content}
      </div>

      <Dialog open={isMaximized} onOpenChange={setIsMaximized}>
        <DialogContent className="max-w-6xl w-[90vw] h-[90vh] p-0">
          <div className="flex flex-col h-full">
            <div className="flex items-center justify-between px-6 py-4 border-b">
              <h2 className="text-lg font-semibold">{title}</h2>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsMaximized(false)}
                className="text-muted-foreground hover:text-foreground"
                aria-label="Close dialog"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
            <div className="p-6 flex-1 overflow-auto">
              {children}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
} 