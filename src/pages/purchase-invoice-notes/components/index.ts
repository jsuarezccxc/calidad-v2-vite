import { PURCHASE_SUPPLIER } from '@constants/ElectronicInvoice';
import { NameInputs } from '@constants/PurchaseInvoiceNotes';

export * from './main-form';
export * from './note-form';

/**
 * This constant is to define the date to list in the purchase invoice notes
 */
export const DATE_TO_LIST = {
    ccxc: false,
    start_date: 901298644000, // 27 de julio de 1998,
    types: [PURCHASE_SUPPLIER],
};

/**
 * This constant is to define the required fields in the purchase invoice note form
 */
export const REQUIRED_TEXT = [NameInputs.Prefix, NameInputs.Number, NameInputs.InvoiceId, NameInputs.InvoiceType, NameInputs.ReasonRejectionId];
