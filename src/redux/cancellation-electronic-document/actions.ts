/* eslint-disable @typescript-eslint/no-explicit-any */
import { ThunkAction, ThunkDispatch } from 'redux-thunk';
import { RootState } from '@redux/rootReducer';
import { IElectronicDocument } from '@models/ElectronicInvoice';
import {
    ISetError,
    ActionKeys,
    ISetDocuments,
    CancellationElectronicDocumentActions,
    ISetSpecificDocument,
    ISetStatus,
    ISetConsecutive,
    ISetDownloadInvoice,
    ISetInvoiceExcel,
    ISetTypesReasonRejected,
    ISetNote,
} from './types';
import { IGenericRecord } from '@models/GenericRecord';
import { FetchRequest } from '@models/Request';
import { apiGetInvoice, apiPostInvoice } from '@api/invoice';
import { urls } from '@api/urls';
import { apiGetUtils } from '@api/inventory';
import { isCorrectResponse } from '@utils/Response';

export const setDocuments = (data: IGenericRecord[]): ISetDocuments => ({
    type: ActionKeys.SET_DOCUMENTS,
    data,
});

export const setSpecificDocument = (document: IElectronicDocument): ISetSpecificDocument => ({
    type: ActionKeys.SET_SPECIFIC_DOCUMENT,
    document,
});

export const setConsecutive = (consecutive: IGenericRecord): ISetConsecutive => ({
    type: ActionKeys.SET_CONSECUTIVE,
    consecutive,
});

export const setDownloadInvoice = (invoice: IGenericRecord): ISetDownloadInvoice => ({
    type: ActionKeys.SET_DOWNLOAD_INVOICE,
    invoice,
});

export const setInvoiceExcel = (invoiceExcel: IGenericRecord): ISetInvoiceExcel => ({
    type: ActionKeys.SET_INVOICE_EXCEL,
    invoiceExcel,
});

export const setTypesReasonRejected = (typesReasonRejected: IGenericRecord[]): ISetTypesReasonRejected => ({
    type: ActionKeys.SET_TYPES_REASON_REJECTED,
    typesReasonRejected,
});

export const setStatus = (code: number): ISetStatus => ({
    type: ActionKeys.SET_STATUS,
    code,
});

export const setError = (error: string): ISetError => ({
    type: ActionKeys.SET_ERROR,
    error,
});

export const setNote = (note: IGenericRecord[]): ISetNote => ({
    type: ActionKeys.SET_NOTE,
    note,
});

export const getSpecificDocument = (
    idDoc: string
): ThunkAction<Promise<void>, RootState, null, CancellationElectronicDocumentActions> => {
    return async (dispatch: ThunkDispatch<RootState, null, CancellationElectronicDocumentActions>): Promise<void> => {
        try {
            const request = new FetchRequest(urls.invoice.getSpecificElectronic(idDoc));
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const { data, statusCode }: any = await apiGetInvoice(request);
            if (isCorrectResponse(statusCode)) dispatch(setSpecificDocument(data));
        } catch (error) {
            dispatch(setError(String(error)));
        }
    };
};

export const getInvoiceExcel = (
    invoice_id: string
): ThunkAction<Promise<void>, RootState, null, CancellationElectronicDocumentActions> => {
    return async (dispatch: ThunkDispatch<RootState, null, CancellationElectronicDocumentActions>): Promise<void> => {
        try {
            const request = new FetchRequest(urls.invoice.dataInvoiceExcel(invoice_id));
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const { data }: any = await apiGetInvoice(request);
            await dispatch(setInvoiceExcel(data));
        } catch (error) {
            dispatch(setError(String(error)));
        }
    };
};

export const postCreateNote = (
    note: IGenericRecord
): ThunkAction<Promise<any>, RootState, null, CancellationElectronicDocumentActions> => {
    return async (dispatch: ThunkDispatch<RootState, null, CancellationElectronicDocumentActions>): Promise<any> => {
        try {
            const request = new FetchRequest(urls.invoice.createNote, note);
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const { data, statusCode }: any = await apiPostInvoice(request);
            dispatch(setNote(data));
            dispatch(setStatus(statusCode));
            return { statusCode, data, status: isCorrectResponse(statusCode) };
        } catch (error) {
            dispatch(setError(String(error)));
            return false;
        }
    };
};

export const getConsecutives = (
    prefix_id: IGenericRecord
): ThunkAction<Promise<void>, RootState, null, CancellationElectronicDocumentActions> => {
    return async (dispatch: ThunkDispatch<RootState, null, CancellationElectronicDocumentActions>): Promise<void> => {
        try {
            const request = new FetchRequest(urls.invoice.consecutives(String(prefix_id)));
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const { data }: any = await apiGetInvoice(request);
            dispatch(setConsecutive(data));
        } catch (error) {
            dispatch(setError(String(error)));
        }
    };
};

export const getDownloadInvoice = (
    invoice_id: string
): ThunkAction<Promise<void>, RootState, null, CancellationElectronicDocumentActions> => {
    return async (dispatch: ThunkDispatch<RootState, null, CancellationElectronicDocumentActions>): Promise<void> => {
        try {
            const request = new FetchRequest(urls.invoice.downloadInvoice(invoice_id));
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const { data }: any = await apiGetInvoice(request);
            dispatch(setDownloadInvoice(data));
        } catch (error) {
            dispatch(setError(String(error)));
        }
    };
};

export const getTypesReasonRejected = (): ThunkAction<Promise<void>, RootState, null, CancellationElectronicDocumentActions> => {
    return async (dispatch: ThunkDispatch<RootState, null, CancellationElectronicDocumentActions>): Promise<void> => {
        try {
            const request = new FetchRequest(urls.utils.annulation);
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const { data }: any = await apiGetUtils(request);
            await dispatch(setTypesReasonRejected(data));
        } catch (error) {
            dispatch(setError(String(error)));
        }
    };
};
