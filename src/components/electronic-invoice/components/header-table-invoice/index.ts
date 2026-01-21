export { HeaderTableInvoice } from './HeaderTableInvoice';

/**
 * This interface describe props to the component
 * 
 * @typeParam isMandate: boolean - Prop to display headers by mandate
 * @typeParam isDocument?: boolean - Optional prop to render checkbox in electronicDocument
 * @typeParam isSupplierNote?: boolean - Optional prop to notes supplier
 */
export interface IHeaderTableInvoice {
    isMandate: boolean;
    isDocument?: boolean;
    isSupplierNote?: boolean;
}
