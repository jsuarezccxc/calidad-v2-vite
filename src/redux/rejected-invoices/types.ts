import { IGenericRecord } from '@models/GenericRecord';

export enum ActionKeys {
    SET_REJECTED_INVOICES = 'SET_REJECTED_INVOICES',
    SET_INVOICE = 'SET_INVOICE',
    SET_ERROR = 'SET_ERROR',
}

export interface ISetRejectedInvoices {
    type: ActionKeys.SET_REJECTED_INVOICES;
    invoices: IGenericRecord[];
}

export interface ISetInvoice {
    type: ActionKeys.SET_INVOICE;
    invoice: IGenericRecord;
}

export interface ISetError {
    type: ActionKeys.SET_ERROR;
    error: string;
}

export type RejectedInvoiceActions = ISetRejectedInvoices | ISetInvoice | ISetError;
