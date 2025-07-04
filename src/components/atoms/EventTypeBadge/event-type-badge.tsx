import React from 'react';

// Color mapping for event types
const typeColors: Record<string, string> = {
  Group: 'bg-green-100 text-green-800 border-green-300',
  Individual: 'bg-blue-100 text-blue-800 border-blue-300',
  Provider: 'bg-purple-100 text-purple-800 border-purple-300',
  Default: 'bg-gray-100 text-gray-700 border-gray-300',
};

interface EventTypeBadgeProps {
  type?: 'Group' | 'Individual' | 'Provider' | string;
}

/**
 * EventTypeBadge - Shows a colored badge for event type (Group, Individual, Provider)
 * Usage: <EventTypeBadge type="Group" />
 */
const EventTypeBadge: React.FC<EventTypeBadgeProps> = ({ type }) => {
  const colorClass = typeColors[type || 'Default'] || typeColors.Default;
  return (
    <span
      className={`inline-block px-2 py-0.5 rounded-full border text-xs font-semibold ${colorClass}`}
      aria-label={type ? `${type} event` : 'Event'}
    >
      {type || 'Event'}
    </span>
  );
};

export default EventTypeBadge; 