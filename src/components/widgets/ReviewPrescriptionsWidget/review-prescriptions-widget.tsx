import { FC } from 'react';
import { DataTable } from '@/components/organisms/DataTable';
import { useNavigate } from 'react-router-dom';

interface NotificationItem {
  type: string;
  count: number;
  path: string;
}

const notifications: NotificationItem[] = [
  { type: 'Renewals', count: 0, path: '/prescriptions/renewals' },
  { type: 'Prescription change requests only', count: 0, path: '/prescriptions/change-requests' },
  { type: 'Pending Prescriptions', count: 17, path: '/prescriptions/pending' }
];

export const ReviewPrescriptionsWidget: FC = () => {
  const navigate = useNavigate();

  const handleNotificationClick = (path: string) => {
    navigate(path);
  };

  const columnDefs = [
    {
      headerName: 'Notification Type',
      field: 'type',
      flex: 2,
      cellRenderer: (params: any) => (
        <div 
          className="text-sm text-blue-600 hover:text-blue-800 hover:underline cursor-pointer"
          onClick={() => handleNotificationClick(params.data.path)}
        >
          {params.value}
        </div>
      )
    },
    {
      headerName: 'Count',
      field: 'count',
      flex: 1,
      cellRenderer: (params: any) => (
        <div className="text-sm text-gray-900">{params.value}</div>
      )
    }
  ];

  return (
    <div className="p-4">
      <div className="bg-white rounded-lg border border-gray-200 h-[calc(100vh-200px)]">
        <DataTable
          rowData={notifications}
          columnDefs={columnDefs}
          className="w-full h-full rounded-lg"
          gridOptions={{
            suppressCellFocus: true,
            animateRows: true,
            domLayout: 'autoHeight',
            rowHeight: 48,
            headerHeight: 40,
            pagination: false,
            defaultColDef: {
              sortable: true,
              resizable: true
            }
          }}
        />
      </div>
    </div>
  );
}; 