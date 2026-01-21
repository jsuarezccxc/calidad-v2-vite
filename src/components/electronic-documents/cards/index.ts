import { IGenericRecord } from '@models/GenericRecord';

export { PurchaseInvoiceCards } from './PurchaseInvoiceCards';
export { SalesCards } from './SalesCards';
export { InvoiceCardAvailable } from './InvoiceCardAvailable';

/**
 * This describes the props of the cards
 *
 * @typeParam invoiceData: IGenericRecord - Invoice data
 * @typeParam updateInvoiceData: (data: IGenericRecord) => void - This is to update the invoice data
 * @typeParam companyData: IGenericRecord | null - Company data
 * @typeParam isEdit?: boolean - Optional param if page is edit
 */
export interface ICardsProps {
    invoiceData: IGenericRecord;
    updateInvoiceData: (data: IGenericRecord) => void;
    companyData: IGenericRecord | null;
    isEdit?: boolean;
}

/**
 * Index to find the prefix
 */
export const PREFIX_INDEX = 0;

/**
 * First invoice of a prefix
 */
export const FIRST_PURCHASE_INVOICE = 1;

/**
 * It is used to cut the currency symbol on the number of bills available
 */
export const DIGITS_REMOVED = 1;
