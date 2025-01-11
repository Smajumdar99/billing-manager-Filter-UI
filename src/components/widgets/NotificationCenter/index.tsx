import { FC } from 'react';

export interface NotificationCenterProps {
  children?: React.ReactNode;
}

export const NotificationCenter: FC<NotificationCenterProps> = () => {
  return (
    <div className="h-full">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">Notification Control Center</h2>
      </div>
      <div className="space-y-4">
        {/* Add your notification content here */}
      </div>
    </div>
  );
}; 