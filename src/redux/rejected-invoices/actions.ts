/* eslint-disable @typescript-eslint/no-explicit-any */
import { ThunkAction, ThunkDispatch } from 'redux-thunk';
import { RootState } from '@redux/rootReducer';
import { FetchRequest } from '@models/Request';
import { IGenericRecord } from '@models/GenericRecord';
import { apiGetInvoice, apiPostInvoice } from '@api/invoice';
import { urls } from '@api/urls';
import { isCorrectResponse } from '@utils/Response';
import { ActionKeys, ISetError, RejectedInvoiceActions, ISetRejectedInvoices, ISetInvoice } from './types';

export const setRejectedInvoices = (invoices: IGenericRecord[]): ISetRejectedInvoices => ({
    type: ActionKeys.SET_REJECTED_INVOICES,
    invoices,
});

export const setInvoice = (invoice: IGenericRecord): ISetInvoice => ({
    type: ActionKeys.SET_INVOICE,
    invoice,
});

export const setError = (error: string): ISetError => ({
    type: ActionKeys.SET_ERROR,
    error,
});

export const getRejectedInvoices = (
    dates: IGenericRecord
): ThunkAction<Promise<void>, RootState, unknown, RejectedInvoiceActions> => {
    return async (dispatch: ThunkDispatch<RootState, unknown, RejectedInvoiceActions>): Promise<void> => {
        try {
            const request = new FetchRequest(urls.invoice.getRejectedInvoices, dates);
            const { data }: any = await apiPostInvoice(request);
            dispatch(setRejectedInvoices(data));
        } catch (error) {
            dispatch(setError(String(error)));
        }
    };
};

export const getInvoice = (
    invoiceId: string,
    isExcel = false,
    companyId?: string
): ThunkAction<Promise<void>, RootState, unknown, RejectedInvoiceActions> => {
   return async (dispatch: ThunkDispatch<RootState, unknown, RejectedInvoiceActions>): Promise<void> => {
        try {
            const url = isExcel ? urls.invoice.getExcel(invoiceId) : urls.invoice.getDetails(invoiceId);
            const request = new FetchRequest(url);
            const { data, statusCode }: any = await apiGetInvoice(request, companyId);
            if (isExcel && isCorrectResponse(statusCode)) return data;
            dispatch(setInvoice(isCorrectResponse(statusCode) ? data : {}));
        } catch (error) {
            dispatch(setError(String(error)));
        }
    };
};
