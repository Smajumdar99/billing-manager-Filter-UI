import { FC } from 'react';
import { useNavigate } from 'react-router-dom';
import { DataTable } from '../DataTable';
import { ColDef } from 'ag-grid-community';

interface Patient {
  id: string;
  name: string;
  dateOfBirth: string;
  gender: string;
  phoneNumber: string;
  email: string;
  lastEncounter: string;
  nextAppointment: string | null;
  status: string;
  adminPrograms: string[];
  insurance: string;
}

interface PatientTableProps {
  patients: Patient[];
  className?: string;
}

// Badge styles for consistent look
const badgeStyles = {
  base: "px-2 py-1 rounded-full text-xs font-medium",
  status: {
    Active: "bg-emerald-50 text-emerald-700",
    Inactive: "bg-slate-50 text-slate-700",
    Pending: "bg-amber-50 text-amber-700"
  },
  program: "bg-sky-50 text-sky-700",
  insurance: "bg-violet-50 text-violet-700"
};

export const PatientTable: FC<PatientTableProps> = ({ patients, className }) => {
  const navigate = useNavigate();

  const handleRowClick = (event: any) => {
    const patientId = event.data.id;
    navigate(`/patient-chart/${patientId}`);
  };

  const columnDefs: ColDef[] = [
    {
      field: 'name',
      headerName: 'Patient Name',
      minWidth: 200,
      flex: 2,
      cellRenderer: (params: any) => (
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-medium">
            {params.value.charAt(0)}
          </div>
          <span>{params.value}</span>
        </div>
      ),
    },
    { 
      field: 'dateOfBirth',
      headerName: 'Date of Birth',
      minWidth: 120,
      flex: 1,
      valueFormatter: (params) => new Date(params.value).toLocaleDateString(),
    },
    { 
      field: 'gender',
      headerName: 'Gender',
      minWidth: 100,
      flex: 1,
    },
    { 
      field: 'phoneNumber',
      headerName: 'Phone',
      minWidth: 150,
      flex: 1.5,
    },
    { 
      field: 'email',
      headerName: 'Email',
      minWidth: 200,
      flex: 2,
    },
    {
      field: 'adminPrograms',
      headerName: 'Admin Programs',
      minWidth: 180,
      flex: 1.5,
      cellRenderer: (params: any) => {
        if (!params.value || params.value.length === 0) {
          return (
            <span className={`${badgeStyles.base} bg-slate-50 text-slate-700`}>
              None
            </span>
          );
        }
        return (
          <div className="flex flex-wrap gap-1">
            {params.value.map((program: string, index: number) => (
              <span 
                key={index}
                className={`${badgeStyles.base} ${badgeStyles.program}`}
              >
                {program}
              </span>
            ))}
          </div>
        );
      },
    },
    {
      field: 'insurance',
      headerName: 'Insurance',
      minWidth: 150,
      flex: 1.5,
      cellRenderer: (params: any) => (
        <span className={`${badgeStyles.base} ${badgeStyles.insurance}`}>
          {params.value || 'No Insurance'}
        </span>
      ),
    },
    { 
      field: 'lastEncounter',
      headerName: 'Last Encounter',
      minWidth: 150,
      flex: 1.5,
      valueFormatter: (params) => new Date(params.value).toLocaleDateString(),
    },
    { 
      field: 'nextAppointment',
      headerName: 'Next Appointment',
      minWidth: 150,
      flex: 1.5,
      valueFormatter: (params) => params.value ? new Date(params.value).toLocaleDateString() : 'Not Scheduled',
    },
    {
      field: 'status',
      headerName: 'Status',
      minWidth: 120,
      flex: 1,
      cellRenderer: (params: any) => (
        <span className={`${badgeStyles.base} ${badgeStyles.status[params.value as keyof typeof badgeStyles.status]}`}>
          {params.value}
        </span>
      ),
    },
  ];

  return (
    <DataTable
      rowData={patients}
      columnDefs={columnDefs}
      className={className}
      gridOptions={{
        pagination: true,
        paginationPageSize: 10,
        rowHeight: 60,
        suppressCellFocus: true,
        enableCellTextSelection: true,
        domLayout: 'autoHeight',
        rowStyle: { cursor: 'pointer' },
        onRowClicked: handleRowClick,
      }}
    />
  );
}; 