import { FC } from 'react';

interface MedicationsWidgetProps {
  patientId: string;
  className?: string;
}

export const MedicationsWidget: FC<MedicationsWidgetProps> = ({ patientId, className }) => {
  return (
    <div className={className}>
      <div className="space-y-4">
        {/* Add medications content here */}
      </div>
    </div>
  );
}; 