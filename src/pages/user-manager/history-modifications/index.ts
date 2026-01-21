import { IGenericRecord } from '@models/GenericRecord';
import { IFileRequest } from '@models/File';
import { IBodyTable, IHeaderTable } from '@components/table';
import { ITableFieldType } from '@constants/TableFieldType';
import { getRoute, getRouteName } from '@utils/Paths';
import { Routes } from '@constants/Paths';
import { Section } from '@components/bread-crumb';
import { downloadIconsProps } from '@utils/DownloadFile';
import { IDownloadIconsProps } from '@components/icon';
import { IDates } from '@models/Date';
export { default } from './HistoryModifications';

/**
 * Example routes from breadcrumb
 */
export const routes = (): Section[] => [
    {
        name: getRouteName(Routes.HOME),
        route: getRoute(Routes.HOME),
        routeIndex: Routes.HOME,
    },
    {
        name: getRouteName(Routes.HOME),
        route: getRoute(Routes.HOME),
        routeIndex: Routes.HOME,
    },
    {
        name: getRouteName(Routes.HOME),
        route: getRoute(Routes.HOME),
        routeIndex: Routes.HOME,
    },
    {
        name: getRouteName(Routes.HOME),
        routeIndex: Routes.HOME,
        route: '#',
    },
];

/**
 * Fields header of the table
 */
export const tableHeader: IHeaderTable[] = [
    {
        title: 'Usuario',
        wrapperClassName: 'w-48',
    },
    {
        title: 'Módulo',
        wrapperClassName: 'w-48',
    },
    {
        title: 'Fecha',
        wrapperClassName: 'w-32',
    },
    {
        title: 'Hora',
        wrapperClassName: 'w-32',
    },
    {
        title: 'Acción',
        wrapperClassName: 'w-72',
    },
];

/**
 * Fields body of the table
 */
export const tableBody: IBodyTable[] = [
    {
        type: ITableFieldType.TEXT,
        field: 'user',
        editableField: false,
    },
    {
        type: ITableFieldType.TEXT,
        field: 'module',
        editableField: false,
    },
    {
        type: ITableFieldType.DATE,
        field: 'date',
        editableField: false,
        iconName: 'calendarGray',
        doubleDate: true,
    },
    {
        type: ITableFieldType.TEXT,
        field: 'hour',
        editableField: false,
    },
    {
        type: ITableFieldType.TEXT,
        field: 'activity',
        editableField: false,
    },
];

/**
 * This interface describes download icons xls and pdf
 * @typeParam downloadIcons: download: (icon: string) => void - Prop for download files
 */
interface IProps {
    downloadIcons: (download: (icon: string) => void) => IDownloadIconsProps;
}

/**
 * Function that return download icons props
 * @returns IProps
 */
export const props = (): IProps => {
    return {
        downloadIcons: downloadIconsProps,
    };
};

/**
 * Function that return the request file for download the pdf and excel
 * @param type: string - File type
 * @param data: IGenericRecord[] - File data
 * @param dates: IDates - File dates
 * @returns IFileRequest
 */
export const getRequestFile = (type: string, data: IGenericRecord[], dates: IDates): IFileRequest => ({
    type,
    module: 'last modifications',
    data,
    start_date: dates.start_date,
    finish_date: dates.finish_date,
});

/**
 * Function that return hour user's latest modifications
 */
export const timeModification = (date: number): string => {
    return new Date(date * 1000).toLocaleTimeString('en-US');
};

export const keyForSearch = ['activity'];

/**
 * Stores the current user identifier
 */
export const USER = 'user';

/**
 * Represents the initial date key
 */
export const START_DATE = 'start_date';

/**
 * Represents the user module value
 */
export const USERS_MODULE = 'Usuarios';

/**
 * Represents the company profile module value
 */
export const PROFILE_COMPANY_MODULE = 'Perfil de la empresa';

/**
 * Represents the all data value
 */
export const ALL_DATA = 'Todos';

/**
 * Represents the module history modifications key
 */
export const MODULE_HISTORY_MODIFICATIONS = 'module';

/**
 * Represents the user history modifications key
 */
export const USER_HISTORY_MODIFICATIONS = 'user';
