import { IUtilReasonRequest } from '@models/Utils';
import { IMainFormNote } from '@models/PurchaseInvoiceNotes';
import { CREDIT_NOTE_SUPPLIER, DEBIT_NOTE_SUPPLIER } from '@constants/PurchaseInvoiceNotes';
import { IOption } from '@components/select-search';
import { CUSTOMER_RESPONSE } from '@constants/ElectronicInvoice';

export * from './MainForm';

/**
 * This const is options note
 */
const optionsType = [
    {
        name: 'Nota débito',
        value: DEBIT_NOTE_SUPPLIER,
    },
    {
        name: 'Nota crédito',
        value: CREDIT_NOTE_SUPPLIER,
    },
];

/**
 * This function is create options
 * 
 * @param reasonRejection: IUtilReasonRequest[] - Optional param to reason rejection
 * @param noteType: string - Note type
 * @returns IOption[]
 */
const buildOptionsReason = (reasonRejection: IUtilReasonRequest[] = [], noteType: string): IOption[] => {
    return reasonRejection.flatMap(({ id, name, ...item }) => {
        if (
            (noteType === DEBIT_NOTE_SUPPLIER && item.code_debit_note) ||
            (noteType === CREDIT_NOTE_SUPPLIER && item.code_credit_note)
        ) {
            return {
                name,
                value: id,
            };
        }
        return [];
    });
};

/**
 * This function to create options
 * 
 * @param documents: Record<string, string>[] - 
 * @returns IOption[]
 */
const buildOptionsDocuments = (documents: Record<string, string>[]): IOption[] => {
    return documents.flatMap((item) => {
        if ([CUSTOMER_RESPONSE.VOIDED, 'VOIDED'].includes(item?.invoice_state ?? '')) return [];
        return {
            name: item.number,
            value: item.id,
        };
    });
}

/**
 * This interface is props component
 * 
 * @typeParam submit: boolean - If submit
 * @typeParam mainForm: IMainFormNote - State form
 * @typeParam handleMainForm: (name: string) => (id: string, option: IOption) => void - Handle state
 */
export interface IMainFormProps {
    submit: boolean;
    mainForm: IMainFormNote;
    handleMainForm: (name: string) => (id: string, option: IOption) => void;
}

/**
 * This const is utils page
 */
export const UTILS = {
    optionsType,
    buildOptionsReason,
    buildOptionsDocuments,
};
