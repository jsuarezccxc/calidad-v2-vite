import { NumberFormatValues } from 'react-number-format';
import { KeysInvoiceCalculates } from '@models/ElectronicInvoice';
export { TableTotals } from './TableTotals';

/**
 * Defining the interface for the props of the component.
 * 
 * @typeParam id: string - Optional identifier
 * @typeParam dataTotals: IDataTableTotals[] - Data table totals
 * @typeParam totalValues: KeysInvoiceCalculates - Keys invoice calculates
 * @typeParam onChange?: (e: NumberFormatValues, nameField: string) => void - Optional prop handle change in input
 * @typeParam isTotalGreatValidation?: boolean - Optional prop for total great value
 * @typeParam isDisabledTotals?: boolean - Optional prop to disabled table
 * @typeParam isSupportOrAdjustment: boolean - Optional prop to show retentions
 * @typeParam symbol: string - Currency symbol
 */
export interface ITableTotalsProps {
    id?: string;
    dataTotals: IDataTableTotals[];
    totalValues: KeysInvoiceCalculates;
    onChange?: (e: NumberFormatValues, nameField: string) => void;
    isTotalGreatValidation?: boolean;
    isDisabledTotals?: boolean;
    isSupportOrAdjustment?: boolean;
    symbol: string;
}

/**
 * This interface for object item data
 *
 * @typeParam id: string - Optional identifier
 * @typeParam title: string - Title input
 * @typeParam field: string - Name input
 * @typeParam symbol: string - Optional symbol input
 * @typeParam value: number -  Value input
 * @typeParam disabled: boolean - State input
 * @typeParam className: string - Style class input
 * @typeParam omitElement?: boolean - Optional prop rt
 */
export interface IDataTableTotals {
    id: string;
    title: string;
    field: string;
    symbol?: string;
    value: number;
    disabled: boolean;
    className: string;
    omitElement?: boolean;
}

/**
 * This const is title in table total
 */
export const total = 'Total';
