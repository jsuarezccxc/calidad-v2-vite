import { Dispatch, SetStateAction } from 'react';
import { getRoute, getRouteName } from '@utils/Paths';
import { IGenericRecord } from '@models/GenericRecord';
import { Routes } from '@constants/Paths';
import { ADJUSTMENT_NOTE } from '@constants/ElectronicInvoice';
import { Section } from '@components/bread-crumb';

export { default } from './CorrectionBusinessDocument';

/**
 * This constan's describes query parameters
 */
export const COMPONENT = 'component';
export const CREDIT_NOTE = 'CREDIT_NOTE';
export const DEBIT_NOTE = 'DEBIT_NOTE';
export const INVOICE = 'INVOICE';
export const VIEW = 'view';
export const ID = 'id';
export const EMPTY = 'Seleccione tipo de documento';
export const RETEIVA = '08 ReteIVA';

/**
 * This interface describes the properties of the data table component
 *
 * @typeParam data: IGenericRecord[] - Current data
 * @typeParam invoiceType: string - Optional type of invoice
 * @typeParam dataInput: number - Optional date
 * @typeParam setDataInput: Dispatch<SetStateAction<number>> - Optional Action date
 */
export interface IDataTable {
    data: IGenericRecord[];
    invoiceType?: string;
    dateInput?: number;
    setDateInput?: Dispatch<SetStateAction<number>>;
}

/**
 * This interface describes the properties of the invoice type
 *
 * @typeParam type: string - Type of invoice
 * @typeParam abbreviation: string - Abbreviation type invoice
 */
interface IGetTypeInvoice {
    type: string;
    abbreviation: string;
}

/**
 * This enum describe type query components
 */
export enum TypeComponent {
    VIEW_INVOICE = 'view-invoice',
    INVOICE_CORRECTION = 'invoice-correction',
    DOCUMENT_CORRECTION = 'document-correction',
}

/**
 * This function return routes
 *
 * @returns Section[]
 */
export const routes = (): Section[] => [
    { name: getRouteName(Routes.CORRECTION_BUSINESS_DOCUMENT), route: getRoute(Routes.CORRECTION_BUSINESS_DOCUMENT) },
];

/**
 * This function check type invoice
 *
 * @param type: string - Type invoice
 * @returns IGetTypeInvoice
 */
export const getTypeInvoice = (type: string): IGetTypeInvoice => {
    switch (type) {
        case DEBIT_NOTE:
            return {
                type: 'Nota débito',
                abbreviation: 'ND',
            };
        case CREDIT_NOTE:
            return {
                type: 'Nota crédito',
                abbreviation: 'NC',
            };
        case ADJUSTMENT_NOTE:
            return {
                type: 'Nota de ajuste',
                abbreviation: 'NC',
            };
        default:
            return {
                type: 'Información para facturar',
                abbreviation: 'FV',
            };
    }
};
