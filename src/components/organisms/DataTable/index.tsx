import { FC, useEffect } from 'react';
import { AgGridReact } from 'ag-grid-react';
import { ModuleRegistry } from '@ag-grid-community/core';
import { ClientSideRowModelModule } from '@ag-grid-community/client-side-row-model';
import { ColDef, GridOptions } from 'ag-grid-community';

// Import AG Grid CSS
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';

// Register AG Grid Modules
ModuleRegistry.registerModules([
  ClientSideRowModelModule
]);

interface DataTableProps {
  rowData: any[];
  columnDefs: ColDef[];
  gridOptions?: GridOptions;
  className?: string;
}

export const DataTable: FC<DataTableProps> = ({
  rowData,
  columnDefs,
  gridOptions,
  className = ''
}) => {
  return (
    <div 
      className={`ag-theme-alpine ${className}`}
      style={{ width: '100%', height: '100%' }}
    >
      <AgGridReact
        rowData={rowData}
        columnDefs={columnDefs}
        defaultColDef={{
          sortable: true,
          filter: true,
          resizable: true,
          minWidth: 100,
          flex: 1,
        }}
        suppressCellFocus={true}
        animateRows={true}
        pagination={true}
        paginationPageSize={10}
        domLayout={'autoHeight'}
        {...gridOptions}
      />
    </div>
  );
}; 