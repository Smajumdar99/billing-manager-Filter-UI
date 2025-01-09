import { FC } from 'react'
import { BaseWidget, BaseWidgetProps } from '@/components/widgets/BaseWidget'
import { cn } from '@/lib/utils'

interface NotificationCenterProps extends Omit<BaseWidgetProps, 'title' | 'description'> {
  className?: string
  dragHandleProps?: any
}

export const NotificationCenter: FC<NotificationCenterProps> = ({
  className,
  dragHandleProps,
  dimensions,
  ...rest
}) => {
  return (
    <BaseWidget
      title="Notification Control Center"
      description="View and manage all notifications"
      className={className}
      dragHandleProps={dragHandleProps}
      dimensions={{
        minW: 300,
        minH: 800,
        maxW: 800,
        maxH: 900,
        ...dimensions
      }}
      {...rest}
    >
      <div className="flex items-center justify-center h-full">
        <p className="text-sm text-muted-foreground">Coming soon...</p>
      </div>
    </BaseWidget>
  )
} 