import { ActionKeys, ReportDocumentPaymentActions } from './types';
import { IGenericRecord } from '@models/GenericRecord';

interface IReportDocumentPaymentState {
    data: IGenericRecord[];
    statusCode: number;
    documentsStore: IGenericRecord[];
    paymentMethods: IGenericRecord[];
    documentsReceivable: IGenericRecord[];
    documentsPayable: IGenericRecord[];
    error: string;
}

const initialState = {
    data: [],
    statusCode: 0,
    documentsStore: [],
    paymentMethods: [],
    documentsReceivable: [],
    documentsPayable: [],
    error: '',
};

export const reducer = (
    state: IReportDocumentPaymentState = initialState,
    action: ReportDocumentPaymentActions
): IReportDocumentPaymentState => {
    switch (action.type) {
        case ActionKeys.SET_DOCUMENT_PAYMENT:
            return {
                ...state,
                data: action.data,
            };
        case ActionKeys.SET_STATUS_CODE:
            return {
                ...state,
                statusCode: action.statusCode,
            };
        case ActionKeys.SET_DOCUMENTS_STORE:
            return {
                ...state,
                documentsStore: action.documentsStore,
            };
        case ActionKeys.SET_PAYMENT_METHODS:
            return {
                ...state,
                paymentMethods: action.paymentMethods,
            };
        case ActionKeys.SET_DOCUMENTS_PAYABLE:
            return {
                ...state,
                documentsPayable: action.documentsPayable,
            };
        case ActionKeys.SET_DOCUMENTS_RECEIVABLE:
            return {
                ...state,
                documentsReceivable: action.documentsReceivable,
            };
        case ActionKeys.SET_ERROR:
            return {
                ...state,
                error: action.error,
            };
        default:
            return state;
    }
};
