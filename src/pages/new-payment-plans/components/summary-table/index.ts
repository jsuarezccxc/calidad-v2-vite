import { IGenericRecord } from '@models/GenericRecord';

export { SummaryTable } from './SummaryTable';

/**
 * This interface describes the props of summary table
 *
 * @typeParam data: IGenericRecord - Purchase data
 * @typeParam goToPayment: () => void - Function for go to payment
 * @typeParam updateData: (data: IGenericRecord) => void - Function to update purchase data
 * @typeParam toggleModal: (modal: string) => void - Function to toggle modal
 * @typeParam viewPlans: boolean - This indicates whether plans can be viewed
 */
export interface ISummaryTableProps {
    data: IGenericRecord;
    goToPayment: () => void;
    updateData: (data: IGenericRecord) => void;
    toggleModal: (modal: string) => void;
    viewPlans: boolean;
}

/**
 * Default price of a plan
 */
export const DEFAULT_PRICE = 0;
