import { IGenericRecord } from '@models/GenericRecord';
import { IElectronicDocument } from '@models/ElectronicInvoice';
import { ActionKeys, CancellationElectronicDocumentActions } from './types';

interface ICancellationElectronicDocumentReducer {
    data: IGenericRecord[];
    document: IElectronicDocument;
    consecutive: IGenericRecord;
    invoice: IGenericRecord;
    invoiceExcel: IGenericRecord;
    typesReasonRejected: IGenericRecord[];
    code: number;
    error: string;
    note: IGenericRecord[];
}

const initialState = {
    data: [],
    document: {},
    consecutive: {},
    invoice: {},
    invoiceExcel: {},
    typesReasonRejected: [],
    code: 0,
    error: '',
    note: [],
};

export const reducer = (
    state: ICancellationElectronicDocumentReducer = initialState,
    action: CancellationElectronicDocumentActions
): ICancellationElectronicDocumentReducer => {
    switch (action.type) {
        case ActionKeys.SET_DOCUMENTS:
            return {
                ...state,
                data: action.data,
            };
        case ActionKeys.SET_SPECIFIC_DOCUMENT:
            return {
                ...state,
                document: action.document,
            };
        case ActionKeys.SET_CONSECUTIVE:
            return {
                ...state,
                consecutive: action.consecutive,
            };
        case ActionKeys.SET_DOWNLOAD_INVOICE:
            return {
                ...state,
                invoice: action.invoice,
            };
        case ActionKeys.SET_INVOICE_EXCEL:
            return {
                ...state,
                invoiceExcel: action.invoiceExcel,
            };
        case ActionKeys.SET_TYPES_REASON_REJECTED:
            return {
                ...state,
                typesReasonRejected: action.typesReasonRejected,
            };
        case ActionKeys.SET_STATUS:
            return {
                ...state,
                code: action.code,
            };
        case ActionKeys.SET_ERROR:
            return {
                ...state,
                error: action.error,
            };
        case ActionKeys.SET_NOTE:
            return {
                ...state,
                note: action.note,
            };
        default:
            return state;
    }
};
