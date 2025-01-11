import { FC } from 'react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/atoms/Button/button'
import { 
  AlertCircle, 
  Bell, 
  Clock, 
  FileText, 
  MessageSquare,
  AlertTriangle,
  User,
  Mail
} from 'lucide-react'

export type NotificationType = 'golden-thread' | 'task' | 'message' | 'alert' | 'reminder'

interface Action {
  label: string
  onClick: () => void
}

interface NotificationCardProps {
  type: NotificationType
  title: string
  message: string
  timestamp?: string
  actions?: Action[]
  className?: string
  priority?: 'low' | 'medium' | 'high'
  assignedBy?: string
  status?: 'pending' | 'in-progress' | 'completed'
  deadline?: string
  width?: string | number
  to?: string
  subject?: string
}

export const NotificationCard: FC<NotificationCardProps> = ({
  type,
  title,
  message,
  timestamp,
  actions = [],
  className,
  priority = 'medium',
  assignedBy,
  status = 'pending',
  deadline,
  width,
  to,
  subject
}) => {
  const getTypeConfig = () => {
    switch (type) {
      case 'golden-thread':
        return {
          icon: <AlertCircle className="w-4 h-4 text-yellow-600" />,
          label: 'GT Alert',
          color: 'yellow',
          border: 'border-l-yellow-500'
        }
      case 'task':
        return {
          icon: <FileText className="w-4 h-4 text-blue-600" />,
          label: 'Task',
          color: 'blue',
          border: 'border-l-blue-500'
        }
      case 'message':
        return {
          icon: <MessageSquare className="w-4 h-4 text-blue-500" />,
          label: 'Message',
          color: 'blue',
          border: 'border-l-blue-500'
        }
      case 'reminder':
        return {
          icon: <Bell className="w-4 h-4 text-purple-600" />,
          label: 'Reminder',
          color: 'purple',
          border: 'border-l-purple-500'
        }
      default:
        return {
          icon: <AlertTriangle className="w-4 h-4 text-red-600" />,
          label: 'Alert',
          color: 'red',
          border: 'border-l-red-500'
        }
    }
  }

  const config = getTypeConfig()

  const getStatusBadge = (status: string) => {
    const baseStyles = "px-1.5 py-0.5 rounded-full text-[10px] font-medium"
    switch (status) {
      case 'pending':
        return <span className={cn(baseStyles, "bg-gray-100 text-gray-700")}>Pending</span>
      case 'in-progress':
        return <span className={cn(baseStyles, "bg-blue-100 text-blue-700")}>In Progress</span>
      case 'completed':
        return <span className={cn(baseStyles, "bg-green-100 text-green-700")}>Completed</span>
      default:
        return null
    }
  }

  const getPriorityBadge = (priority: string) => {
    const baseStyles = "px-1.5 py-0.5 rounded-full text-[10px] font-medium"
    switch (priority) {
      case 'high':
        return <span className={cn(baseStyles, "bg-red-100 text-red-700")}>High Priority</span>
      case 'medium':
        return <span className={cn(baseStyles, "bg-yellow-100 text-yellow-700")}>Medium Priority</span>
      case 'low':
        return <span className={cn(baseStyles, "bg-green-100 text-green-700")}>Low Priority</span>
      default:
        return null
    }
  }

  return (
    <div className={cn(
      'p-2 rounded-md border bg-white hover:shadow-md transition-all group',
      type !== 'message' && 'border-l-[3px]',
      type !== 'message' && config.border,
      className
    )}
    style={{ width: width ? width : 'auto' }}
    >
      <div className="flex items-start gap-2">
        <div className="flex-shrink-0">
          {config.icon}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 mb-0.5">
            <span className={cn(
              "text-[10px] font-medium uppercase tracking-wider",
              type === 'message' ? "text-blue-500" : `text-${config.color}-600`
            )}>
              {config.label}
            </span>
            {type === 'task' && getStatusBadge(status)}
            {type !== 'message' && getPriorityBadge(priority)}
          </div>
          {type !== 'task' && (
            <h3 className={cn(
              "text-xs font-medium mb-0.5",
              type === 'golden-thread' 
                ? "text-yellow-600 font-semibold"
                : "text-gray-900"
            )}>{type === 'message' ? subject : title}</h3>
          )}
          {type === 'task' && (
            <div className="grid grid-cols-2 gap-x-4 gap-y-0.5 mb-1.5 text-[10px]">
              {assignedBy && (
                <div className="flex items-center gap-1 text-gray-600">
                  <User className="w-3 h-3" />
                  <span className="font-medium">Assigned by:</span>
                  <span>{assignedBy}</span>
                </div>
              )}
              {deadline && (
                <div className="flex items-center gap-1 text-gray-600">
                  <Clock className="w-3 h-3" />
                  <span className="font-medium">Deadline:</span>
                  <span>{deadline}</span>
                </div>
              )}
            </div>
          )}
          {type === 'message' && (
            <>
              <div className="flex items-center gap-1 text-[10px] text-gray-600 mb-1">
                <Mail className="w-3 h-3" />
                <span className="font-medium">To:</span>
                <span>{to}</span>
              </div>
              <div className="space-y-1 mb-1">
                <div className="flex items-start gap-1">
                  <span className="text-[10px] font-medium text-gray-700">Subject:</span>
                  <span className="text-xs text-gray-600">{subject}</span>
                </div>
                <div className="flex items-start gap-1">
                  <span className="text-[10px] font-medium text-gray-700">Message:</span>
                  <span className="text-xs text-gray-600">{message}</span>
                </div>
              </div>
            </>
          )}
          {type !== 'message' && (
            <p className={cn(
              "text-xs text-gray-600 mb-1.5"
            )}>{message}</p>
          )}
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 text-[10px] text-gray-500">
              {timestamp && (
                <div className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  <span>{timestamp}</span>
                </div>
              )}
            </div>
            {actions.length > 0 && (
              <div className="flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity ml-auto">
                {actions.map((action, index) => (
                  <Button
                    key={index}
                    variant={index === 0 ? "default" : "outline"}
                    size="sm"
                    onClick={action.onClick}
                    className="h-6 text-xs font-medium px-2"
                  >
                    {action.label}
                  </Button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
} 