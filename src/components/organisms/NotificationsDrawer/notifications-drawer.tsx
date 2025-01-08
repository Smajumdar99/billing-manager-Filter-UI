import { FC } from 'react'
import { BellIcon } from '@heroicons/react/24/outline'
import { cn } from '@/lib/utils'

interface Alert {
  id: string
  title: string
  description: string
  icon?: React.ReactNode
}

interface NotificationsDrawerProps {
  isOpen: boolean
  onClose: () => void
  alerts: Alert[]
  tasks: {
    id: string
    title: string
    description: string
    assignee: string
    dueDate: string
    status?: 'pending' | 'completed'
  }[]
}

export const NotificationsDrawer: FC<NotificationsDrawerProps> = ({
  isOpen,
  onClose,
  alerts,
  tasks
}) => {
  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40"
          onClick={onClose}
        />
      )}
      
      {/* Drawer */}
      <div className={cn(
        "fixed right-0 top-0 h-full w-[400px] bg-white shadow-lg transform transition-transform duration-200 ease-in-out z-50",
        isOpen ? "translate-x-0" : "translate-x-full"
      )}>
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="relative bg-gradient-to-r from-rose-400 via-fuchsia-500 to-indigo-500 p-5">
            <div className="flex flex-col text-white">
              <h2 className="text-xl font-semibold">Good morning!</h2>
              <p className="text-sm mt-1.5 text-white/90 max-w-[85%] leading-relaxed">
                Streamlining your tasks, notifications, & recommendations for an exceptional patient experience, all in one place
              </p>
            </div>
            <div className="absolute top-5 right-5">
              <div className="relative h-9 w-9">
                <img 
                  src="https://ui-avatars.com/api/?name=User" 
                  alt="User"
                  className="h-9 w-9 rounded-full border-2 border-white/20"
                />
                <div className="absolute bottom-0 right-0 h-2 w-2 rounded-full bg-green-500 border-2 border-white"></div>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto">
            {/* Alerts Section */}
            <div className="p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold flex items-center gap-2">
                  <span>GOLDEN THREAD ALERTS</span>
                  <span className="bg-gray-100 px-2 py-0.5 rounded-full text-sm">
                    4
                  </span>
                </h3>
              </div>
              <div className="space-y-4">
                {alerts.map((alert) => (
                  <div 
                    key={alert.id}
                    className="flex gap-3 p-3 border rounded-lg"
                  >
                    <div className="text-red-500">
                      <BellIcon className="h-5 w-5" />
                    </div>
                    <div>
                      <h4 className="font-medium">{alert.title}</h4>
                      <p className="text-sm text-gray-600">{alert.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Tasks Section */}
            <div className="p-4 border-t">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold flex items-center gap-2">
                  <span>MY TASKS</span>
                  <span className="bg-gray-100 px-2 py-0.5 rounded-full text-sm">
                    3
                  </span>
                </h3>
                <button className="text-blue-600">
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                </button>
              </div>
              <div className="space-y-3">
                {tasks.map((task) => (
                  <div 
                    key={task.id}
                    className="p-3.5 rounded-lg space-y-2 bg-gradient-to-r from-gray-100/90 to-gray-50/80 hover:from-gray-100 hover:to-gray-100/70 transition-colors border border-gray-200 shadow-sm"
                  >
                    <div className="flex items-start gap-3">
                      <div className="mt-1.5">
                        <div className="w-2 h-2 rounded-full bg-blue-500" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900">{task.title}</h4>
                        <p className="text-sm text-gray-600 mt-0.5">{task.description}</p>
                      </div>
                    </div>
                    <div className="flex items-center text-sm text-gray-500 gap-4 ml-5 mt-2">
                      <span className="flex items-center gap-1.5">
                        <div className="w-1.5 h-1.5 rounded-full bg-gray-400" />
                        {task.assignee}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <div className="w-1.5 h-1.5 rounded-full bg-gray-400" />
                        {task.dueDate}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
} 