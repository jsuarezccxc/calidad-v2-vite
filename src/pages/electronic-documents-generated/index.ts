import { Section } from '@components/bread-crumb';
import { PURCHASE_SUPPLIER } from '@constants/ElectronicInvoice';
import { INVOICE } from '@constants/Invoice';
import { Routes } from '@constants/Paths';
import { IGenericRecord } from '@models/GenericRecord';
import { currentDateInUnix, getUnixFromDate } from '@utils/Date';
import { getRoute, getRouteName } from '@utils/Paths';

export { default } from './ElectronicDocumentsGenerated';

/**
 * This interface describes the dates
 *
 * @typeParam start?: Date - Optional start date
 * @typeParam end?: Date - Optional end date
 */
export interface IDates {
    start?: Date;
    end?: Date;
}

/**
 * Routes for the breadcrumb
 *
 * @returns Section[]
 */
export const getRoutes = (): Section[] => [
    {
        name: getRouteName(Routes.DASHBOARD_ELECTRONIC_DOCUMENT),
        route: getRoute(Routes.DASHBOARD_ELECTRONIC_DOCUMENT),
        routeIndex: Routes.DASHBOARD_ELECTRONIC_DOCUMENT,
    },
    {
        name: getRouteName(Routes.ELECTRONIC_DOCUMENTS_GENERATED),
        route: getRoute(Routes.ELECTRONIC_DOCUMENTS_GENERATED),
        routeIndex: Routes.ELECTRONIC_DOCUMENTS_GENERATED,
    },
];

/**
 * This formats the dates
 *
 * @param dates: IDates - Filter dates
 * @returns IGenericRecord
 */
export const formatDates = (dates: IDates): IGenericRecord => ({
    start_date: dates.start ? getUnixFromDate(dates.start) : currentDateInUnix(),
    finish_date: dates.end ? getUnixFromDate(dates.end) : currentDateInUnix(),
});

/**
 * List of documents sent at the time of obtaining the records
 */
export const DOCUMENT_TYPES = ['INVOICE', 'SUPPORTING_DOCUMENT', 'PURCHASE_SUPPLIER'];

/**
 * Module required to download files
 */
export const FILE_MODULE = 'list-generated-documents';

/**
 * Downloaded file name
 */
export const FILE_TITLE = getRouteName(Routes.ELECTRONIC_DOCUMENTS_GENERATED);

/**
 * These options are used to filter by document type
 */
export const DOCUMENT_OPTIONS = [
    {
        key: INVOICE,
        value: 'Factura electrónica de venta',
    },
    {
        key: "SUPPORTING_DOCUMENT",
        value: 'Documento soporte',
    },
    {
        key: PURCHASE_SUPPLIER,
        value: 'Factura de compra',
    },
];

/**
 * This creates the request file
 *
 * @param data: IGenericRecord - Request data
 * @returns IGenericRecord
 */
export const getRequestFile = ({
    type,
    data,
    formattedDates,
    searchValue,
    selectedDocument,
}: IGenericRecord): IGenericRecord => ({
    type,
    module: FILE_MODULE,
    data,
    range: formattedDates,
    searched_by: searchValue ?? '...',
    concept_type: selectedDocument ?? '',
});
