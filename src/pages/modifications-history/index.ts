//--- Components ---//
import { IBodyTable, IHeaderTable, ITableProps } from '@components/table';
//--- Constants ---//
import { Routes } from '@constants/Paths';
import { ITableFieldType } from '@constants/TableFieldType';
//--- Redux ---//
import { IModifications } from '@redux/modification-history/types';
//--- Models ---//
import { IGenericRecord } from '@models/GenericRecord';
//--- Utils ---//
import { getRouteName } from '@utils/Paths';
import { getUnixFromDate } from '@utils/Date';

export { default } from './ModificationHistory';

/**
 * Data structure Header from table
 */
export const headersTable = (): IHeaderTable[] => [
    {
        title: 'Fecha',
        className: 'w-37',
        wrapperClassName: 'max-w--columns w-37 2xl:w-37',
    },
    {
        title: 'Hora',
        className: 'w-37',
        wrapperClassName: 'max-w--columns w-37 2xl:w-37',
    },
    {
        title: 'Usuario',
        className: 'w-37',
        wrapperClassName: 'max-w--columns w-37 2xl:w-37',
    },
    {
        title: 'Modificación',
        className: 'modification-field',
        wrapperClassName: 'modification-field',
    },
];

/**
 * Data structure Fields from table
 */
export const fieldsBody = (): IBodyTable[] => [
    {
        type: ITableFieldType.DATE,
        field: 'date',
        editableField: false,
        wrapperClassName: 'max-w--columns w-37 h-10 xs:h-7',
    },
    {
        type: ITableFieldType.TEXT,
        field: 'hour',
        editableField: false,
        wrapperClassName: 'max-w--columns w-37 h-10 xs:h-7',
    },
    {
        type: ITableFieldType.TEXT,
        field: 'name',
        editableField: false,
        wrapperClassName: 'max-w--columns w-37 h-10 xs:h-7',
    },
    {
        type: ITableFieldType.TEXT,
        field: 'modification',
        editableField: false,
        wrapperClassName: 'modification-field',
    },
];

/**
 * Constant to get route name
 */
export const ROUTE_MODIFICATION = getRouteName(Routes.MODIFICATION_HISTORY);

/**
 * Generates a file request object for modification history.
 *
 * @param type: string - The type of file.
 * @param data: IModifications[] - Data to render in document.
 * @param module: IModifications[] - Data to render in document.
 * @param date: number | null - The initial date in milliseconds.
 * @param user_name: string | null | undefined - The search string.
 * @param searched_by: string | null - The search string.
 *
 */
export interface IFileRequest {
    type: string;
    data: IModifications[];
    module: string;
    date: number | null;
    user_name: string | null | undefined;
    searched_by: string | null;
}

/**
 * Generates a file request object for modification history.
 *
 * @param type: string - The type of file.
 * @param date: number | null - The initial date in milliseconds.
 * @param data: IModifications[] - Data to render in document.
 * @param search: string | undefined - The search string.
 * @param user_name: string | null | undefined - The search string.
 *
 */
interface IGetRequestFile {
    type: string;
    date: number | null;
    data: IModifications[];
    search: string | null;
    user_name: string | null | undefined;
}

/**
 * This creates the request file
 *
 * @param type: string - The type of file.
 * @param data: IModifications[] - Data to render in document.
 * @param search: string | undefined - The search string.
 * @param user_name: string | null | undefined - The search string.
 * @param date: number | null - The initial date in milliseconds.
 * @returns IFileRequest
 */
export const getRequestFile = ({ type, data, search, user_name, date }: IGetRequestFile): IFileRequest => {
    return {
        type,
        data,
        date,
        module: 'modification-history',
        user_name,
        searched_by: search?.length ? search : null,
    };
};

/**
 * Function to return data with date formatted
 *
 * @param data: IModifications[] - Data table from user
 * @returns IGenericRecord[] - Data formatted
 */
export const formatDate = (data: IModifications[]): IGenericRecord[] =>
    data.map(modification => ({ ...modification, date: getUnixFromDate(modification.date) }));

/**
 * Function that return the table props
 *
 * @param data: IModifications[] - Table data
 * @param reloadPaginator: boolean - Prop for reload paginator
 * @returns ITableProps
 */
export const tableProps = (data: IModifications[], reloadPaginator: boolean): ITableProps => {
    return {
        isNew: true,
        headersTable: headersTable(),
        fieldsBody: fieldsBody(),
        data: formatDate(data),
        reloadPaginator,
        className: 'xs:mt-3 w-max',
    };
};

/**
 * Props for modification view
 */
export const props = { tableProps };
