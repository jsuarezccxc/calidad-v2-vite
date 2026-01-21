import React from 'react';
import { Table } from '@components/table';
import { TITLE_TABLE_DETAIL } from '@information-texts/DatabaseEmployees';
import { useTableEmployeeHistory } from '@pages/database-employee-detail/hooks/useTableEmployeeHistory';
import { ITableEmployeeHistory } from '@pages/database-employee-detail/models/TableEmployeeHistory';

export const TableEmployeeHistory: React.FC<ITableEmployeeHistory> = ({ data }) => {
    const { tableProps } = useTableEmployeeHistory();

    return (
        <div className="p-4.5 flex flex-col bg-white rounded-lg shadow-templateDesign">
            <h2 className="text-base text-green font-allerbold mb-4.5">{TITLE_TABLE_DETAIL}</h2>
            <Table {...tableProps(data)} />
        </div>
    );
};
