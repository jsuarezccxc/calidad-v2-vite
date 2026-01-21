import { IGenericRecord } from '@models/GenericRecord';

export { SummaryTable } from './SummaryTable';

/**
 * This interface describes the props of summary table
 *
 * @typeParam data: IGenericRecord - Purchase data
 * @typeParam saveData: () => void - Function for save data
 * @typeParam continueToPay: () => void - Function for go to payment
 * @typeParam updateData: (data: IGenericRecord) => void - Function to update purchase data
 * @typeParam toggleModal: (modal: string) => void - Function to toggle modal
 * @typeParam viewPlans: boolean - This indicates whether plans can be viewed
 */
export interface ISummaryTableProps {
    data: IGenericRecord;
    saveData: () => void;
    continueToPay: () => void;
    updateData: (data: IGenericRecord) => void;
    toggleModal: (modal: string) => void;
    viewPlans: boolean;
}

/**
 * Default price of a plan
 */
export const DEFAULT_PRICE = 0;

/** Const for numbers */
export const ZERO = 0;
export const ONE = 1;
export const TWO = 2;
export const YEAR_IN_MONTHS = 12;
