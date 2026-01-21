import { IGenericRecord } from '@models/GenericRecord';
import { ActionType, CorrectionBusinessDocumentActions } from './types';

interface IInitialState {
    invoiceCorrection: IGenericRecord;
    generalInvoices: IGenericRecord[];
    utilsData: IGenericRecord;
    currentErrors: IGenericRecord[];
}

const initialState: IInitialState = {
    invoiceCorrection: {},
    generalInvoices: [],
    utilsData: {},
    currentErrors: [],
};

export const reducer = (state = initialState, action: CorrectionBusinessDocumentActions): IInitialState => {
    switch (action.type) {
        case ActionType.GET_INVOICE_CORRECTION:
            return {
                ...state,
                invoiceCorrection: action.invoice,
            };
        case ActionType.GET_GENERAL_INVOICES:
            return {
                ...state,
                generalInvoices: action.invoices,
            };
        case ActionType.GET_UTILS_DATA:
            return {
                ...state,
                utilsData: action.utils,
            };
        case ActionType.GET_CURRENT_ERRORS:
            return {
                ...state,
                currentErrors: action.errors,
            };
        default:
            return state;
    }
};
