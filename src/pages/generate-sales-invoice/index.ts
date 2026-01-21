import { Section } from '@components/bread-crumb';
import { Routes } from '@constants/Paths';
import { MODULE_TITLES } from '@constants/ElectronicDocuments';
import { ADJUSTMENT_NOTE, CREDIT_NOTE, DEBIT_NOTE, INVOICE, RETE_IVA, SUPPORTING_DOCUMENT } from '@constants/ElectronicInvoice';
import { IGenericRecord } from '@models/GenericRecord';
import { ITableTaxesAndRetention } from '@models/ElectronicInvoice';
import { IQuoteWithWithholdings } from '@models/QuoteGeneration';
import { getRoute, getRouteName } from '@utils/Paths';

export { default } from './GenerateSalesInvoice';

/**
 * Routes for the breadcrumb
 *
 * @param personTexts: IGenericRecord - Person texts
 * @returns Section[]
 */
export const getRoutes = (personTexts: IGenericRecord, isContingency: boolean): Section[] => [
    {
        name: getRouteName(Routes.ELECTRONIC_DOCUMENTS),
        route: getRoute(Routes.DASHBOARD_ELECTRONIC_DOCUMENT),
    },
    {
        name: MODULE_TITLES.INVOICE,
        route: '#',
    },
    ...(isContingency
        ? [{ name: getRouteName(Routes.GENERATE_CONTINGENCY_INVOICE), route: getRoute(Routes.GENERATE_CONTINGENCY_INVOICE) }]
        : [
              {
                  name: getRouteName(Routes.GENERATE_SALES_INVOICE),
                  route: getRoute(Routes.GENERATE_SALES_INVOICE),
              },
          ]),
    ...(personTexts?.title
        ? [
              {
                  name: personTexts.title,
                  route: '#',
              },
          ]
        : []),
];

/**
 * Keys used to obtain the data used in the person form
 */
export const FORM = 'form';

/**
 * Query parameter value for quote to invoice conversion
 */
export const QUOTE_QUERY_PARAM = 'quote';

/**
 * Query parameter value for client form display
 */
export const CLIENT_QUERY_PARAM = 'client';

/**
 * Type of prefixes
 */
export const PREFIXES: IGenericRecord = {
    with_prefixes: true,
    types: [INVOICE, DEBIT_NOTE, CREDIT_NOTE, SUPPORTING_DOCUMENT, ADJUSTMENT_NOTE],
    only_available: true,
};

/**
 * Template for mapping quote data to form data using AssignDataToObject utility
 * Maps source paths from quote response to target keys in form data
 */
export const QUOTE_DATA_TEMPLATE: Record<string, string> = {
    client_id: 'client_id',
    not_information_customer: 'not_information_customer',
    payment_type_id: 'payment_type_id',
    payment_type_name: 'payment_type_name',
    payment_method_id: 'payment_method_id',
    payment_method_name: 'payment_method_name',
    foreign_exchange_id: 'foreign_exchange_id',
    foreign_exchange_name: 'foreign_exchange_name',
    foreign_exchange_rate: 'foreign_exchange_rate',
    collection_days: 'days_collection',
    days_collection_type: 'days_collection_type',
    retefuente: 'retefuente',
    reteica: 'reteica',
    reteiva: 'reteiva',
    base_retefuente: 'base_retefuente',
    base_reteica: 'base_reteica',
    base_reteiva: 'base_reteiva',
    invoice_details: 'invoice_details',
    note: 'notes',
    notes: 'notes',
    internal_notes: 'terms_conditions',
    terms_conditions: 'terms_conditions',
    sales_manager: 'employee.name',
    document_type_sales_manager: 'employee.document_type',
    document_type_sales_manager_id: 'employee.document_type_id',
    document_number_sales_manager: 'employee.document_number',
    number_purchase_order: 'number_purchase_order',
    operation_type_id: 'operation_type_id',
};

/**
 * Maps backend quote withholding data to component table structure
 * Expects withholdings array to be properly structured from backend
 *
 * @typeParam quote: IQuoteWithWithholdings - Quote data with withholdings array from backend
 * @returns Array with withholding structure for form rendering with UI-specific properties
 */
export const buildWithholdingTable = (quote: IQuoteWithWithholdings): ITableTaxesAndRetention[] => {
    return quote.withholdings.map((withholding) => ({
        ...withholding,
        isTax: false,
        disabled: false,
        isSelectInput: withholding.name === RETE_IVA,
    }));
};

/**
 * Finds and returns the name of an item from a list based on its ID
 *
 * @param list - Array of items to search
 * @param id - ID to match
 * @param nameKey - Key to extract name from (default: 'value')
 * @returns Name of the found item or empty string
 */
export const findNameById = (
    list: IGenericRecord[] | undefined,
    id: string | number | undefined,
    nameKey = 'value'
): string => {
    if (!list || !id) return '';
    const item = list.find((item: IGenericRecord) => item.id === id);
    return item?.[nameKey] || '';
};
