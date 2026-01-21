import { Routes } from '@constants/Paths';
import { SUPPORT_DOCUMENTS_SUBTITLE } from '@constants/DocumentTexts';
import { ADJUSTMENT_NOTE, CREDIT_NOTE, DEBIT_NOTE } from '@constants/ElectronicInvoice';
import { CREDIT_NOTE_SUPPLIER, DEBIT_NOTE_SUPPLIER } from '@constants/PurchaseInvoiceNotes';
import { getRoute, getRouteName, getRoutes } from '@utils/Paths';
import { IOptionSelect } from '@components/input';
export { default } from './CorrectedDocuments';

/**
 * This interface is for state table
 *
 * @typeParam id: string - Id invoice
 * @typeParam number: number - Prefix number
 * @typeParam invoice_type: string - Type invoice
 * @typeParam name: string - Client/Supplier name
 * @typeParam date: string - Date
 * @typeParam number_sold: number - Quantity sale
 * @typeParam total: number - Total invoice
 * @typeParam DIAN_response: string | JSX.Element - Answer DIAN
 * @typeParam message: boolean - Show message in table
 */
export interface ICorrectionNotes {
    id: string;
    number: number;
    invoice_type: string;
    name: string;
    date: string;
    number_sold: number;
    total: number;
    DIAN_response: string | JSX.Element;
    message: boolean;
}

/**
 * This const is information page
 */
const PAGE_TITLE = {
    title: getRouteName(Routes.ELECTRONIC_DOCUMENTS),
    pageContent: SUPPORT_DOCUMENTS_SUBTITLE,
};

/**
 * This const is documents electronics
 */
const TYPE_DOCUMENTS = [DEBIT_NOTE_SUPPLIER, CREDIT_NOTE_SUPPLIER, DEBIT_NOTE, CREDIT_NOTE, ADJUSTMENT_NOTE];

/**
 * This const  is assign keys and values
 */
const { KEYS_REPORT, KEY_CLIENT, KEY_SUPPLIER } = {
    KEYS_REPORT: [
        {
            keyOrigin: 'id',
        },
        {
            keyOrigin: 'number',
        },
        {
            keyOrigin: 'invoice_type',
        },
        {
            keyOrigin: 'date',
        },
        {
            keyOrigin: 'number_sold',
            keyValue: 'number_sold',
        },
        {
            keyOrigin: 'total',
        },
        {
            keyOrigin: 'DIAN_response',
        },
        {
            keyOrigin: 'customer_response',
        },
    ],
    KEY_SUPPLIER: [
        {
            keyOrigin: 'supplier_name',
            keyValue: 'name',
        },
    ],
    KEY_CLIENT: [
        {
            keyOrigin: 'client_name',
            keyValue: 'name',
        },
    ],
};

/**
 * This const is keys searchs
 */
const KEYS_FILTER: string[] = ['number', 'quantity', 'total', 'name'];

/**
 * This const is options input select
 */
const OPTIONS_INPUT: IOptionSelect[] = [
    {
        key: ADJUSTMENT_NOTE,
        value: 'Nota de ajuste',
    },
    {
        key: DEBIT_NOTE,
        value: 'Nota débito',
    },
    {
        key: CREDIT_NOTE,
        value: 'Nota crédito',
    },
];

/**
 * This const is keys to endpoint
 */
const OPTION_KEY: Record<string, string[]> = {
    [DEBIT_NOTE]: [DEBIT_NOTE, DEBIT_NOTE_SUPPLIER],
    [CREDIT_NOTE]: [CREDIT_NOTE, CREDIT_NOTE_SUPPLIER],
    [ADJUSTMENT_NOTE]: [ADJUSTMENT_NOTE],
}

/**
 * This const is name file
 */
const FILE_NAME = getRouteName(Routes.CORRECTED_DOCUMENTS);

/**
 * This const utils page
 */
export const utils = {
    FILE_NAME,
    OPTION_KEY,
    PAGE_TITLE,
    KEY_CLIENT,
    KEYS_REPORT,
    KEYS_FILTER,
    KEY_SUPPLIER,
    OPTIONS_INPUT,
    BREAD_CRUMB: getRoutes([Routes.DASHBOARD_ELECTRONIC_DOCUMENT, Routes.CORRECTED_DOCUMENTS]),
    TYPE_DOCUMENTS,
    NEXT_PAGE: getRoute(Routes.REPORT_ELECTRONIC_DOCUMENTS),
    VALIDATE_MODULE: getRouteName(Routes.ELECTRONIC_DOCUMENTS),
};
