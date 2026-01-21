import { Section } from '@components/bread-crumb';
import { IOptionSelect } from '@components/input';
import { Routes } from '@constants/Paths';
import { MODULE_TITLES } from '@constants/ElectronicDocuments';
import { getRoute, getRouteName } from '@utils/Paths';

export { default } from './NumberRange';

/**
 * Function that returns the routes for the breadcrumb
 * @returns Section[]
 */
export const routes = (): Section[] => [
    {
        name: 'Documentos electrónicos',
        route: getRoute(Routes.DASHBOARD_ELECTRONIC_DOCUMENT),
    },
    {
        name: MODULE_TITLES.INVOICE,
        route: '#',
    },
    {
        name: getRouteName(Routes.NUMBER_RANGE),
        route: getRoute(Routes.NUMBER_RANGE),
    },
];

/**
 * Type of documents for prefix
 */
export enum DocumentsTypePrefix {
    INVOICE = 'INVOICE',
    SUPPORTING_DOCUMENT = 'SUPPORTING_DOCUMENT',
    RECEIPT_INVOICE = 'RECEIPT_INVOICE ',
}

/**
 * Options for select prefix
 */
export const OPTIONS_PREFIX: IOptionSelect[] = [
    { value: 'Factura de venta', key: DocumentsTypePrefix.INVOICE },
    { value: 'Documento de soporte', key: DocumentsTypePrefix.SUPPORTING_DOCUMENT },
    { value: 'Factura talonario o papel', key: DocumentsTypePrefix.RECEIPT_INVOICE },
];

/**
 * Max length inputs table
 */
export const MAXIMUM_LENGTH_FIELDS = {
    RESOLUTION_NUMBER: 14,
    PREFIX: 4,
    RANGE: 10,
};
