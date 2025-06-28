import React from 'react';

interface ProgramEventDetailModalProps {
  open: boolean;
  onClose: () => void;
  // Realistic program event data for a behavioral health clinic
  patientName: string;
  programName: string;
  diagnosis: string;
  startDate: Date;
  endDate: Date;
  progressPercentage: number;
  totalSessions: number;
  completedSessions: number;
  missedSessions: number;
  careTeam: { name: string; role: string }[];
  nextAppointment: { date: Date; type: string } | null;
  alerts?: string[];
}

export const ProgramEventDetailModal: React.FC<ProgramEventDetailModalProps> = ({
  open,
  onClose,
  patientName,
  programName,
  diagnosis,
  startDate,
  endDate,
  progressPercentage,
  totalSessions,
  completedSessions,
  missedSessions,
  careTeam,
  nextAppointment,
  alerts = [],
}) => {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full p-6 relative animate-fade-in">
        {/* Close Button */}
        <button
          className="absolute top-3 right-3 text-gray-400 hover:text-gray-700 text-2xl font-bold focus:outline-none"
          aria-label="Close"
          onClick={onClose}
        >
          ×
        </button>
        {/* Header */}
        <h2 className="text-2xl font-bold text-blue-900 mb-1">{programName}</h2>
        <div className="text-sm text-gray-600 mb-4">Patient: <span className="font-semibold text-gray-800">{patientName}</span></div>
        {/* Alerts */}
        {alerts.length > 0 && (
          <div className="mb-4">
            {alerts.map((alert, idx) => (
              <div key={idx} className="bg-yellow-100 text-yellow-800 px-3 py-2 rounded mb-1 text-sm flex items-center">
                <span className="mr-2">⚠️</span> {alert}
              </div>
            ))}
          </div>
        )}
        {/* Program Info */}
        <div className="mb-4 grid grid-cols-2 gap-4">
          <div>
            <div className="text-xs text-gray-500">Diagnosis</div>
            <div className="font-medium text-gray-800">{diagnosis}</div>
          </div>
          <div>
            <div className="text-xs text-gray-500">Progress</div>
            <div className="font-medium text-gray-800">{progressPercentage}% ({completedSessions}/{totalSessions} sessions)</div>
          </div>
          <div>
            <div className="text-xs text-gray-500">Start Date</div>
            <div className="font-medium text-gray-800">{startDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</div>
          </div>
          <div>
            <div className="text-xs text-gray-500">End Date</div>
            <div className="font-medium text-gray-800">{endDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</div>
          </div>
          <div>
            <div className="text-xs text-gray-500">Missed Sessions</div>
            <div className="font-medium text-red-600">{missedSessions}</div>
          </div>
          {nextAppointment && (
            <div>
              <div className="text-xs text-gray-500">Next Appointment</div>
              <div className="font-medium text-gray-800">{nextAppointment.type} on {nextAppointment.date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</div>
            </div>
          )}
        </div>
        {/* Care Team */}
        <div className="mb-2">
          <div className="text-xs text-gray-500 mb-1">Care Team</div>
          <ul className="list-disc list-inside text-sm text-gray-800">
            {careTeam.map((member, idx) => (
              <li key={idx}><span className="font-medium">{member.name}</span> – {member.role}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}; 