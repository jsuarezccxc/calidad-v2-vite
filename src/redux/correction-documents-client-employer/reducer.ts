import { IGenericRecord } from '@models/GenericRecord';
import { ActionKeys, CorrectionBusinessDocumentActions } from './types';

interface ICorrectionDocumentsClientEmployerState {
    currentInvoice: IGenericRecord;
    historyDocuments: IGenericRecord[];
    invoiceCorrection: IGenericRecord;
    invoiceDetail: IGenericRecord;
    invoiceDisplay: IGenericRecord;
    reasonRejections: IGenericRecord[];
    prefixes: IGenericRecord[];
    consecutive: IGenericRecord;
    taxValues: IGenericRecord[];
    showModalSave: boolean;
    allNotes: IGenericRecord[];
    currentSaveNote: IGenericRecord;
    error: string;
}

const initialState = {
    currentInvoice: {},
    historyDocuments: [],
    invoiceCorrection: {},
    reasonRejections: [],
    invoiceDetail: {},
    invoiceDisplay: {},
    prefixes: [],
    consecutive: {},
    taxValues: [],
    showModalSave: false,
    allNotes: [],
    currentSaveNote: {},
    error: '',
};

export const reducer = (
    state: ICorrectionDocumentsClientEmployerState = initialState,
    action: CorrectionBusinessDocumentActions
): ICorrectionDocumentsClientEmployerState => {
    switch (action.type) {
        case ActionKeys.SET_TAX_VALUES:
            return {
                ...state,
                taxValues: action.taxes,
            };
        case ActionKeys.GET_CURRENT_INVOiCE:
            return {
                ...state,
                currentInvoice: action.invoice,
            };
        case ActionKeys.SET_HISTORY_CORRECTION_DOCUMENT_CLIENT:
            return {
                ...state,
                historyDocuments: action.history,
            };
        case ActionKeys.SET_INVOICE_CORRECTION:
            return {
                ...state,
                invoiceCorrection: action.invoiceCorrection,
            };
        case ActionKeys.SET_INVOICE_DETAIL:
            return {
                ...state,
                invoiceDetail: action.invoiceDetail,
            };
        case ActionKeys.SET_REASON_REJECTIONS:
            return {
                ...state,
                reasonRejections: action.reasonRejections,
            };
        case ActionKeys.SET_INVOICE_DISPLAY:
            return {
                ...state,
                invoiceDisplay: action.invoiceDisplay,
            };
        case ActionKeys.GET_PREFIXES:
            return {
                ...state,
                prefixes: action.prefixes,
            };
        case ActionKeys.CONSECUTIVE:
            return {
                ...state,
                consecutive: action.consecutive,
            };

        case ActionKeys.SHOW_MODAL_SAVE:
            return {
                ...state,
                showModalSave: action.show,
            };
        case ActionKeys.GET_ALL_NOTES:
            return {
                ...state,
                allNotes: action.notes,
            };
        case ActionKeys.SET_CURRENT_SAVE_NOTE:
            return {
                ...state,
                currentSaveNote: action.note,
            };
        case ActionKeys.SET_ERROR:
            return {
                ...state,
                error: state.error,
            };

        default:
            return state;
    }
};
