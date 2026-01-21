import { IBodyTable, IHeaderTable, ITableProps } from "@components/table";
import { ITableFieldType } from "@constants/TableFieldType";
import { IHistory } from "@models/DataEmployees";

export const useTableEmployeeHistory = (): {
    tableProps: (data: IHistory[]) => ITableProps
} => {
    /**
     * Data header from products and services table
     */
    const headersTable: IHeaderTable[] = [
        {
            title: 'Fecha',
            wrapperClassName: 'col-width',
        },
        {
            title: 'Ajustes información  y novedades del empleado',
            wrapperClassName: 'col-width',
        },
        {
            title: 'Usuario',
            wrapperClassName: 'col-width',
        },
    ];

    /**
     * Fields body of the table
     */
    const fieldsBody = (): IBodyTable[] => [
        {
            type: ITableFieldType.DATE,
            field: 'date',
            wrapperClassName: 'h-10 xs:h-8.2',
            editableField: false,
        },
        {
            type: ITableFieldType.TEXT,
            field: 'activity',
            wrapperClassName: 'h-10 xs:h-8.2',
            editableField: false,
        },
        {
            type: ITableFieldType.TEXT,
            field: 'user',
            wrapperClassName: 'h-10 xs:h-8.2',
            editableField: false,
        },
    ];

    /**
     * Table props
     * @param data - Data table 
     * @returns ITableProps - props table
     */
    const tableProps = (data: IHistory[]): ITableProps => {
        return {
            headersTable,
            fieldsBody: fieldsBody(),
            data,
            isNew: true,
            className: 'xs:mt-3 w-max',
        };
    };

    return {
        tableProps
    }
}
