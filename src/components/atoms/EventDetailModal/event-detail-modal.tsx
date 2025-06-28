import React from 'react';

// Generic event type
export type TimelineEventType =
  | 'program'
  | 'assessment'
  | 'documentation'
  | 'services'
  | 'medication'
  | 'claims';

export interface EventDetailModalProps {
  open: boolean;
  onClose: () => void;
  type: TimelineEventType;
  event: any; // Accepts any event object, type-checked in render
}

export const EventDetailModal: React.FC<EventDetailModalProps> = ({
  open,
  onClose,
  type,
  event,
}) => {
  if (!open || !event) return null;

  // Render content based on event type
  let content: React.ReactNode = null;

  if (type === 'program') {
    // Program event (behavioral program)
    content = (
      <>
        <h2 className="text-2xl font-bold text-blue-900 mb-1">{event.title}</h2>
        <div className="text-sm text-gray-600 mb-4">Patient: <span className="font-semibold text-gray-800">Jane Doe</span></div>
        {event.missedSessions > 0 && (
          <div className="mb-4 bg-yellow-100 text-yellow-800 px-3 py-2 rounded text-sm flex items-center">
            <span className="mr-2">⚠️</span> {event.missedSessions} missed session{event.missedSessions > 1 ? 's' : ''} in this program.
          </div>
        )}
        <div className="mb-4 grid grid-cols-2 gap-4">
          <div>
            <div className="text-xs text-gray-500">Diagnosis</div>
            <div className="font-medium text-gray-800">Major Depressive Disorder, Generalized Anxiety Disorder</div>
          </div>
          <div>
            <div className="text-xs text-gray-500">Progress</div>
            <div className="font-medium text-gray-800">{event.progressPercentage}% ({event.completedSessions}/{event.totalSessions} sessions)</div>
          </div>
          <div>
            <div className="text-xs text-gray-500">Start Date</div>
            <div className="font-medium text-gray-800">{event.startDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</div>
          </div>
          <div>
            <div className="text-xs text-gray-500">End Date</div>
            <div className="font-medium text-gray-800">{event.endDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</div>
          </div>
          <div>
            <div className="text-xs text-gray-500">Missed Sessions</div>
            <div className="font-medium text-red-600">{event.missedSessions}</div>
          </div>
          <div>
            <div className="text-xs text-gray-500">Next Appointment</div>
            <div className="font-medium text-gray-800">Therapy Session on Dec 15, 2022, 2:00 PM</div>
          </div>
        </div>
        <div className="mb-2">
          <div className="text-xs text-gray-500 mb-1">Care Team</div>
          <ul className="list-disc list-inside text-sm text-gray-800">
            <li><span className="font-medium">Dr. Emily Smith</span> – Psychiatrist</li>
            <li><span className="font-medium">John Carter, LCSW</span> – Therapist</li>
            <li><span className="font-medium">Sarah Lee, RN</span> – Nurse</li>
          </ul>
        </div>
      </>
    );
  } else if (type === 'assessment') {
    // Assessment event (e.g., PHQ9)
    content = (
      <>
        <h2 className="text-xl font-bold text-teal-900 mb-1">{event.title}</h2>
        <div className="text-sm text-gray-600 mb-2">Patient: <span className="font-semibold text-gray-800">Jane Doe</span></div>
        <div className="mb-2">
          <div className="text-xs text-gray-500">Assessment Date</div>
          <div className="font-medium text-gray-800">{event.date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</div>
        </div>
        <div className="mb-2">
          <div className="text-xs text-gray-500">Status</div>
          <div className="font-medium text-gray-800">{event.status === 'completed' ? 'Completed' : event.status}</div>
        </div>
        {event.info && (
          <div className="mb-2">
            <div className="text-xs text-gray-500">Score/Notes</div>
            <div className="font-medium text-gray-800">{event.info}</div>
          </div>
        )}
      </>
    );
  } else if (type === 'documentation') {
    // Documentation event
    content = (
      <>
        <h2 className="text-xl font-bold text-purple-900 mb-1">{event.title}</h2>
        <div className="text-sm text-gray-600 mb-2">Patient: <span className="font-semibold text-gray-800">Jane Doe</span></div>
        <div className="mb-2">
          <div className="text-xs text-gray-500">Document Date</div>
          <div className="font-medium text-gray-800">{event.date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</div>
        </div>
        <div className="mb-2">
          <div className="text-xs text-gray-500">Status</div>
          <div className="font-medium text-gray-800">{event.status === 'completed' ? 'Completed' : event.status}</div>
        </div>
      </>
    );
  } else if (type === 'claims') {
    // Claims event
    content = (
      <>
        <h2 className="text-xl font-bold text-green-900 mb-1">{event.title}</h2>
        <div className="text-sm text-gray-600 mb-2">Patient: <span className="font-semibold text-gray-800">Jane Doe</span></div>
        <div className="mb-2">
          <div className="text-xs text-gray-500">Claim Date</div>
          <div className="font-medium text-gray-800">{event.date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</div>
        </div>
        {event.info && (
          <div className="mb-2">
            <div className="text-xs text-gray-500">Amount</div>
            <div className="font-medium text-gray-800">{event.info}</div>
          </div>
        )}
        <div className="mb-2">
          <div className="text-xs text-gray-500">Status</div>
          <div className="font-medium text-gray-800">{event.status === 'completed' ? 'Completed' : event.status}</div>
        </div>
      </>
    );
  } else {
    // Fallback for other types
    content = (
      <>
        <h2 className="text-xl font-bold text-gray-900 mb-1">{event.title}</h2>
        <div className="text-sm text-gray-600 mb-2">Patient: <span className="font-semibold text-gray-800">Jane Doe</span></div>
        <div className="mb-2">
          <div className="text-xs text-gray-500">Event Date</div>
          <div className="font-medium text-gray-800">{event.date ? event.date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '-'}</div>
        </div>
      </>
    );
  }

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center pointer-events-none">
      <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full p-6 relative animate-fade-in pointer-events-auto">
        <button
          className="absolute top-3 right-3 text-gray-400 hover:text-gray-700 text-2xl font-bold focus:outline-none"
          aria-label="Close"
          onClick={onClose}
        >
          ×
        </button>
        {content}
      </div>
    </div>
  );
}; 