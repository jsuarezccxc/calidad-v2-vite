import { IGenericRecord } from '@models/GenericRecord';
import { ActionKeys, RejectedInvoiceActions } from './types';
const { SET_REJECTED_INVOICES, SET_INVOICE, SET_ERROR } = ActionKeys;

interface ISuppliers {
    invoices: IGenericRecord[];
    invoice: IGenericRecord;
    error: string;
}

const initialState = {
    invoices: [],
    invoice: {},
    error: '',
};

export const reducer = (state: ISuppliers = initialState, action: RejectedInvoiceActions): ISuppliers => {
    switch (action.type) {
        case SET_REJECTED_INVOICES:
            return {
                ...state,
                invoices: action.invoices,
            };
        case SET_INVOICE:
            return {
                ...state,
                invoice: action.invoice,
            };
        case SET_ERROR:
            return {
                ...state,
                error: action.error,
            };
        default:
            return state;
    }
};
