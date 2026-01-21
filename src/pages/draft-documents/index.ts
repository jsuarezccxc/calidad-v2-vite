import { v4 } from 'uuid';
import { Section } from '@components/bread-crumb';
import { IOptionSelect } from '@components/input';
import { IHeaderTable } from '@components/table';
import { Routes } from '@constants/Paths';
import { MODULE_TITLES } from '@constants/ElectronicDocuments';
import { ADJUSTMENT_NOTE, CREDIT_NOTE, DEBIT_NOTE, INVOICE, SUPPORTING_DOCUMENT } from '@constants/ElectronicInvoice';
import { getRoute, getRouteName } from '@utils/Paths';

export { default } from './DraftDocuments';

/**
 * Function that return the breadcrumb routes
 *
 * @returns Section[]
 */
export const routes = (isDocument: boolean): Section[] => {
    return [
        {
            name: getRouteName(Routes.ELECTRONIC_DOCUMENTS),
            route: getRoute(Routes.ENABLE_ELECTRONIC_BILLER),
        },
        {
            name: isDocument
                ? MODULE_TITLES.INVOICE
                : MODULE_TITLES.NOTE,
            route: '#',
        },
        {
            name: !isDocument ? 'Borradores de corrección de documentos electrónicos' : 'Borradores de documentos electrónicos',
            route: '#',
        },
    ];
};

/**
 * Data header from documents
 */
export const headersTable: IHeaderTable[] = [
    {
        title: 'Documento electrónico',
        wrapperClassName: 'header-title',
    },
    {
        title: 'Fecha de guardado',
        wrapperClassName: 'header-date',
    },
    {
        title: 'Nombre cliente/proveedor',
        wrapperClassName: 'header-title',
    },
    {
        title: 'Número de documento del cliente/proveedor',
        wrapperClassName: 'header-title',
    },
    {
        title: 'Total',
        wrapperClassName: 'header-totals',
    },
];

/**
 * This const represents the types of support documents
 */
export const typesOfSupportDocument = [SUPPORTING_DOCUMENT, INVOICE];

/**
 * This const represents the types of note documents
 */
export const typesOfNoteDocument = [DEBIT_NOTE, CREDIT_NOTE, ADJUSTMENT_NOTE];

/**
 * This const is for compare if queryParam is document
 */
export const DOCUMENT = 'document';

/**
 * This const is for compare if queryParam is note
 */
export const NOTE = 'note';

/**
 * Options to select order for type of note document
 */
export const SelectNoteOrderOptions: IOptionSelect[] = [
    {
        value: 'Nota débito',
        code: DEBIT_NOTE,
        key: v4(),
    },
    {
        value: 'Nota crédito',
        code: CREDIT_NOTE,
        key: v4(),
    },
    {
        value: 'Nota de ajuste',
        code: ADJUSTMENT_NOTE,
        key: v4(),
    },
];

/**
 * Options to select order for type of support document
 */
export const SelectDocumentOrderOptions: IOptionSelect[] = [
    {
        value: 'Documento soporte',
        code: SUPPORTING_DOCUMENT,
        key: v4(),
    },
    {
        value: 'Factura electrónica de venta',
        code: INVOICE,
        key: v4(),
    },
];
