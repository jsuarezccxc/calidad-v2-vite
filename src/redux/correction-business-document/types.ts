import { IGenericRecord } from '@models/GenericRecord';

export enum ActionType {
    GET_INVOICE_CORRECTION = 'GET_INVOICE_CORRECTION',
    GET_GENERAL_INVOICES = 'GET_GENERAL_INVOICES',
    GET_UTILS_DATA = 'GET_UTILS_DATA',
    GET_CURRENT_ERRORS = 'GET_CURRENT_ERRORS',
    SET_ERROR = 'SET_ERROR',
}

export interface IGetInvoiceCorrection {
    type: ActionType.GET_INVOICE_CORRECTION;
    invoice: IGenericRecord;
}

export interface IGetGeneralInvoices {
    type: ActionType.GET_GENERAL_INVOICES;
    invoices: IGenericRecord[];
}

export interface IGetUtilsData {
    type: ActionType.GET_UTILS_DATA;
    utils: IGenericRecord;
}

export interface IGetCurrentErrors {
    type: ActionType.GET_CURRENT_ERRORS;
    errors: IGenericRecord[];
}

export interface ISetError {
    type: ActionType.SET_ERROR;
    error: string;
}

export type CorrectionBusinessDocumentActions =
    | IGetInvoiceCorrection
    | ISetError
    | IGetGeneralInvoices
    | IGetUtilsData
    | IGetCurrentErrors;
