import { IGenericRecord } from '@models/GenericRecord';

export enum ActionKeys {
    SET_HISTORY_CORRECTION_DOCUMENT_CLIENT = 'GET_HISTORY_CORRECTION_DOCUMENT_CLIENT',
    SET_INVOICE_DISPLAY = 'SET_INVOICE_DISPLAY',
    SET_INVOICE_CORRECTION = 'SET_INVOICE_CORRECTION',
    SET_INVOICE_DETAIL = 'SET_INVOICE_DETAIL',
    SET_REASON_REJECTIONS = 'SET_REASON_REJECTIONS',
    SET_TAX_VALUES = 'SET_TAX_VALUES',
    SET_ERROR = 'ERROR',
    GET_CURRENT_INVOiCE = 'GET_CURRENT_INVOiCE',
    GET_PREFIXES = 'GET_PREFIXES',
    CONSECUTIVE = 'CONSECUTIVE',
    SHOW_MODAL_SAVE = 'SHOW_MODAL_SAVE',
    SET_CURRENT_SAVE_NOTE = 'SET_CURRENT_SAVE_NOTE',
    GET_ALL_NOTES = 'GET_ALL_NOTES',
}

export interface IHistoryCorrectionDocumentClient {
    type: ActionKeys.SET_HISTORY_CORRECTION_DOCUMENT_CLIENT;
    history: IGenericRecord[];
}

export interface ISetInvoiceDisplay {
    type: ActionKeys.SET_INVOICE_DISPLAY;
    invoiceDisplay: IGenericRecord;
}

export interface ISetInvoiceCorrection {
    type: ActionKeys.SET_INVOICE_CORRECTION;
    invoiceCorrection: IGenericRecord;
}

export interface ISetInvoiceDetail {
    type: ActionKeys.SET_INVOICE_DETAIL;
    invoiceDetail: IGenericRecord;
}

export interface ISetReasonRejects {
    type: ActionKeys.SET_REASON_REJECTIONS;
    reasonRejections: IGenericRecord[];
}

export interface IGetPrefixes {
    type: ActionKeys.GET_PREFIXES;
    prefixes: IGenericRecord[];
}

export interface IConsecutive {
    type: ActionKeys.CONSECUTIVE;
    consecutive: IGenericRecord;
}

export interface ISetTaxValue {
    type: ActionKeys.SET_TAX_VALUES;
    taxes: IGenericRecord[];
}

export interface IShowModalSave {
    type: ActionKeys.SHOW_MODAL_SAVE;
    show: boolean;
}

export interface IGetAllNotes {
    type: ActionKeys.GET_ALL_NOTES;
    notes: IGenericRecord[];
}

export interface IGetCurrentInvoice {
    type: ActionKeys.GET_CURRENT_INVOiCE;
    invoice: IGenericRecord;
}

export interface ISetCurrentSaveNote {
    type: ActionKeys.SET_CURRENT_SAVE_NOTE;
    note: IGenericRecord;
}

export interface ISetError {
    type: ActionKeys.SET_ERROR;
    error: string;
}

export type CorrectionBusinessDocumentActions =
    | IHistoryCorrectionDocumentClient
    | ISetInvoiceDisplay
    | ISetInvoiceDetail
    | ISetInvoiceCorrection
    | ISetReasonRejects
    | IGetPrefixes
    | ISetTaxValue
    | IConsecutive
    | IShowModalSave
    | IGetAllNotes
    | IGetCurrentInvoice
    | ISetCurrentSaveNote
    | ISetError;
