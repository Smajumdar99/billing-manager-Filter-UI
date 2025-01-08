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
    <div className="h-full flex flex-col overflow-hidden">
      <div className="flex-1 overflow-y-auto">
        <div className="space-y-1">
          {messages.map((message) => (
            <div
              key={message.id}
              className={cn(
                "flex items-start gap-3 p-2 rounded-lg",
                "hover:bg-gray-50/80 transition-colors duration-200"
              )}
            >
              <div className="w-8 h-8 rounded-full bg-gray-100 flex-shrink-0 flex items-center justify-center text-gray-600 mt-0.5">
                {message.sender.name.charAt(0)}
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-gray-900 text-sm">
                        {message.sender.name}
                      </span>
                      <span className={cn(
                        "text-xs px-2 py-0.5 rounded-full",
                        message.sender.type === 'Patient' ? "text-purple-600" : "text-blue-600"
                      )}>
                        {message.sender.type}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 truncate mt-0.5">
                      {message.content}
                    </p>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <span className="text-xs text-gray-500">
                      {message.time}
                    </span>
                    {message.unreadCount && (
                      <div className="w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center">
                        <span className="text-xs text-white font-medium">
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