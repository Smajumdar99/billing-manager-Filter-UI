import { FC } from 'react'
import { cn } from '@/lib/utils'

interface Message {
  id: string
  sender: {
    name: string
    type: 'Patient' | 'Clinician'
    avatar: string
  }
  content: string
  time: string
  unreadCount?: number
}

interface MessagesWidgetProps {
  messages: Message[]
  onCreateMessage?: () => void
}

export const MessagesWidget: FC<MessagesWidgetProps> = ({ 
  messages,
  onCreateMessage 
}) => {
  return (
    <div className="h-full flex flex-col overflow-hidden min-h-0">
      <div className="flex-1 overflow-y-auto min-h-0">
        <div className="space-y-1">
          {messages.map((message) => (
            <div
              key={message.id}
              className={cn(
                "flex items-start gap-2 sm:gap-3 p-2 rounded-lg",
                "hover:bg-gray-50/80 transition-colors duration-200"
              )}
            >
              <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-gray-100 flex-shrink-0 flex items-center justify-center text-gray-600 mt-0.5 text-xs sm:text-sm">
                {message.sender.name.charAt(0)}
              </div>
              
              <div className="flex-1 min-w-0 overflow-hidden">
                <div className="flex items-start justify-between gap-1 sm:gap-2">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-1 sm:gap-2">
                      <span className="font-medium text-gray-900 text-xs sm:text-sm truncate">
                        {message.sender.name}
                      </span>
                      <span className={cn(
                        "text-xs px-2 py-0.5 rounded-full",
                        message.sender.type === 'Patient' ? "text-secondary" : "text-primary"
                      )}>
                        {message.sender.type}
                      </span>
                    </div>
                    <p className="text-xs sm:text-sm text-gray-600 truncate mt-0.5">
                      {message.content}
                    </p>
                  </div>
                  <div className="flex flex-col items-end gap-1 shrink-0">
                    <span className="text-[10px] sm:text-xs text-gray-500">
                      {message.time}
                    </span>
                    {message.unreadCount && (
                      <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center">
                        <span className="text-xs text-primary-foreground font-medium">
                          {message.unreadCount}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
} 