export { PageDirections } from './PageDirections';

/**
 * This describes the props of the form for adding people
 *
 * @typeParam routeIndex: number - Number of the document
 * @typeParam quantityInvoices: { expiration_date?: string; is_unlimited?: boolean; number_invoice?: number } - Property with quantity of invoices information
 * @typeParam includeCounter: boolean - Optional property indicating whether to display the card with the available bill counter
 * @typeParam isEdit?: boolean - Optional property change view
 */
export interface IPageDirectionsProps {
    routeIndex: number;
    quantityInvoices: { expiration_date?: string; is_unlimited?: boolean; number_invoice?: number };
    includeCounter?: boolean;
    isEdit?: boolean;
}
