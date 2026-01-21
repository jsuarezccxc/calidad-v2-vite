import { NumberFormatValues } from 'react-number-format';
import { IconsNames } from '@components/icon';
import { ChangeEvent } from '@components/input';
import { IFormPurchaseInvoiceNote } from '@models/PurchaseInvoiceNotes';

export * from './NoteForm';

/**
 * This interface is props component
 * 
 * @typeParam submit: boolean - If submit form
 * @typeParam customErrors: string[] - Errors custom
 * @typeParam formPurchaseNote: IFormPurchaseInvoiceNote - State form
 * @typeParam handleText: (e: ChangeEvent) => void - Handle state
 * @typeParam handleDate: (date: Date, name: string) => void - Handle state date
 * @typeParam handleTime: (time: string) => void - Handle state time
 * @typeParam handleNumber: (name: string) => (values: NumberFormatValues) => void - Handle state number
 */
export interface INoteFormProps {
    submit: boolean;
    customErrors: string[];
    formPurchaseNote: IFormPurchaseInvoiceNote;
    handleText: (e: ChangeEvent) => void;
    handleDate: (date: Date, name: string) => void;
    handleTime: (time: string) => void;
    handleNumber: (name: string) => (values: NumberFormatValues) => void;
}

/**
 * This const is props repeated
 */
export const PROPS_TO_INPUTS = {
    selectIconType: 'arrowDownGreen' as IconsNames,
    classesWrapper: 'input-style',
    disabled: true,
};
