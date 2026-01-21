import { ThunkAction, ThunkDispatch } from 'redux-thunk';
import { RootState } from '@redux/rootReducer';
import { getUserData } from '@utils/User';
import { isCorrectResponse } from '@utils/Response';
import { IGenericRecord } from '@models/GenericRecord';
import { FetchRequest, ServiceType } from '@models/Request';
import { IPurchaseInvoiceNoteRequest, ResponsePurchaseNote } from '@models/PurchaseInvoiceNotes';
import { urls } from '@api/urls';
import { apiGetInvoice, apiPostInvoice, apiPutInvoice, apiUploadInvoice } from '@api/invoice';
import {
    ActionKeys,
    ISetNotesPurchase,
    ISetError,
    ISetStatusCode,
    ReportNotesPurchaseActions,
    ISetInvoicePurchase,
    ISetNotePurchase,
} from './types';

export const setReportNotesPurchase = (notes: IGenericRecord[]): ISetNotesPurchase => ({
    type: ActionKeys.SET_NOTES_PURCHASE,
    notes,
});

export const setInvoicePurchase = (invoice: IGenericRecord): ISetInvoicePurchase => ({
    type: ActionKeys.SET_INVOICE_PURCHASE,
    invoice,
});

export const setNotePurchase = (note: IGenericRecord): ISetNotePurchase => ({
    type: ActionKeys.SET_NOTE_PURCHASE,
    note,
});

export const setError = (error: string): ISetError => ({
    type: ActionKeys.SET_ERROR,
    error,
});

export const setStatusCode = (statusCode: number): ISetStatusCode => ({
    type: ActionKeys.SET_STATUS_CODE,
    statusCode,
});

export const getReportNotesPurchase = (): ThunkAction<Promise<void>, RootState, null, ReportNotesPurchaseActions> => {
    return async (dispatch: ThunkDispatch<RootState, null, ReportNotesPurchaseActions>): Promise<void> => {
        try {
            const request = new FetchRequest(urls.suppliers.reportNotes);
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const { data }: any = await apiGetInvoice(request);
            dispatch(setReportNotesPurchase(data));
        } catch (error) {
            dispatch(setError(String(error)));
        }
    };
};

export const getInvoicePurchase = (note_id: string): ThunkAction<Promise<void>, RootState, null, ReportNotesPurchaseActions> => {
    return async (dispatch: ThunkDispatch<RootState, null, ReportNotesPurchaseActions>): Promise<void> => {
        try {
            const request = new FetchRequest(urls.suppliers.getInvoicePurchase(note_id));
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const { data, statusCode }: any = await apiGetInvoice(request);
            if (isCorrectResponse(statusCode)) dispatch(setInvoicePurchase(data));
        } catch (error) {
            dispatch(setError(String(error)));
        }
    };
};

export const saveEditNotePurchase = (
    note: IGenericRecord,
    isEdit: boolean,
    noteId: string
): ThunkAction<Promise<void>, RootState, null, ReportNotesPurchaseActions> => {
    return async (dispatch: ThunkDispatch<RootState, null, ReportNotesPurchaseActions>): Promise<void> => {
        try {
            const url = isEdit ? urls.suppliers.saveNote : urls.suppliers.editNote(noteId);
            const request = new FetchRequest(url, note);
            const action = !isEdit ? apiPostInvoice : apiPutInvoice;
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const { data }: any = await action(request);
            await dispatch(setNotePurchase(data));
            //await dispatch(setStatusCode(statusCode));
        } catch (error) {
            dispatch(setError(String(error)));
        }
    };
};

export const updateSupportNote = (
    invoice_id: string,
    file: Blob
): ThunkAction<Promise<void>, RootState, null, ReportNotesPurchaseActions> => {
    return async (dispatch: ThunkDispatch<RootState, null, ReportNotesPurchaseActions>): Promise<void> => {
        try {
            const { company_id } = getUserData();
            const formData = new FormData();
            formData.append('service', ServiceType.INVOICE);
            formData.append('company_id', company_id);
            formData.append('invoice_id', invoice_id);
            formData.append('folder', 'support-notes');
            formData.append('file', file);
            const request = new FetchRequest(urls.suppliers.updateSupport, formData);
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const { statusCode }: any = await apiUploadInvoice(request);
            dispatch(setStatusCode(statusCode));
        } catch (error) {
            dispatch(setError(String(error)));
        }
    };
};

export const deleteSupportNote = (invoiceId: string): ThunkAction<Promise<void>, RootState, null, ReportNotesPurchaseActions> => {
    return async (dispatch: ThunkDispatch<RootState, null, ReportNotesPurchaseActions>): Promise<void> => {
        try {
            const request = new FetchRequest(urls.suppliers.deleteSupport(invoiceId));
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            await apiPutInvoice(request);
        } catch (error) {
            dispatch(setError(String(error)));
        }
    };
};

export const postPurchaseNote = (
    note: IPurchaseInvoiceNoteRequest
): ThunkAction<Promise<ResponsePurchaseNote | void>, RootState, null, ReportNotesPurchaseActions> => {
    return async (
        dispatch: ThunkDispatch<RootState, null, ReportNotesPurchaseActions>
    ): Promise<ResponsePurchaseNote | void> => {
        try {
            const request = new FetchRequest(urls.suppliers.saveNote, note);
            return (await apiPostInvoice(request)) as ResponsePurchaseNote;
        } catch (error) {
            dispatch(setError(String(error)));
        }
    };
};
