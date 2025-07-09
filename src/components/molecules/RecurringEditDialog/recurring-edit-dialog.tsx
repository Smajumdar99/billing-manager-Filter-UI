import { FC, Fragment } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { CalendarIcon, CalendarDaysIcon } from '@heroicons/react/24/outline'
import { Button } from '@/components/atoms/Button'

interface RecurringEditDialogProps {
  isOpen: boolean
  onClose: () => void
  onEditThis: () => void
  onEditAll: () => void
  appointmentTitle?: string
}

export const RecurringEditDialog: FC<RecurringEditDialogProps> = ({
  isOpen,
  onClose,
  onEditThis,
  onEditAll,
  appointmentTitle = 'appointment'
}) => {
  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/25" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-lg bg-white p-6 text-left align-middle shadow-xl transition-all">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100">
                    <CalendarIcon className="h-6 w-6 text-blue-600" />
                  </div>
                  <Dialog.Title as="h3" className="text-lg font-semibold leading-6 text-gray-900">
                    Edit Recurring Appointment
                  </Dialog.Title>
                </div>

                <div className="mt-4">
                  <p className="text-sm text-gray-600 mb-4">
                    This is a recurring appointment. Would you like to edit just this occurrence or all occurrences in the series?
                  </p>
                  
                  {appointmentTitle && (
                    <div className="bg-gray-50 rounded-md p-3 mb-4">
                      <p className="text-sm font-medium text-gray-700">
                        {appointmentTitle}
                      </p>
                    </div>
                  )}
                </div>

                <div className="mt-6 space-y-3">
                  {/* Edit This Occurrence Button */}
                  <Button 
                    variant="outline" 
                    onClick={onEditThis}
                    className="w-full justify-start gap-3 h-12 border-gray-300 hover:bg-gray-50"
                  >
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-orange-100">
                      <CalendarIcon className="h-4 w-4 text-orange-600" />
                    </div>
                    <div className="text-left">
                      <div className="font-medium text-gray-900">Edit This Event</div>
                      <div className="text-xs text-gray-500">Only this occurrence will be changed</div>
                    </div>
                  </Button>

                  {/* Edit All Occurrences Button */}
                  <Button 
                    variant="outline" 
                    onClick={onEditAll}
                    className="w-full justify-start gap-3 h-12 border-gray-300 hover:bg-gray-50"
                  >
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100">
                      <CalendarDaysIcon className="h-4 w-4 text-blue-600" />
                    </div>
                    <div className="text-left">
                      <div className="font-medium text-gray-900">Edit All Events</div>
                      <div className="text-xs text-gray-500">All occurrences in the series will be changed</div>
                    </div>
                  </Button>

                  {/* Cancel Button */}
                  <div className="pt-2 border-t border-gray-200">
                    <Button 
                      variant="ghost" 
                      onClick={onClose}
                      className="w-full text-gray-600 hover:text-gray-800"
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  )
}
