import { ThunkAction, ThunkDispatch } from 'redux-thunk';
import { RootState } from '@redux/rootReducer';
import { FetchRequest } from '@models/Request';
import { IGenericRecord } from '@models/GenericRecord';
import { apiGetInvoice, apiPostInvoice, apiPutInvoice } from '@api/invoice';
import { apiDynamicRequest } from '@api/utils';
import { urls } from '@api/urls';
import {
    CITIES,
    COUNTRIES,
    DEPARTMENTS,
    DOCUMENT_TYPES,
    FISCAL_RESPONSIBILITIES,
    FOREIGN_EXCHANGE,
    PAYMENT_METHODS,
    PAYMENT_TYPES,
    REASON_REJECTIONS,
    TAX_DETAIL,
    TYPE_TAX_PAYER,
    WITHHOLDINGS,
} from '@constants/DynamicRequest';
import { LANGUAGES } from '@constants/UtilsConstants';
import {
    ActionType,
    CorrectionBusinessDocumentActions,
    IGetInvoiceCorrection,
    ISetError,
    IGetGeneralInvoices,
    IGetUtilsData,
    IGetCurrentErrors,
} from './types';

export const invoiceCorrection = (payload: IGenericRecord): IGetInvoiceCorrection => ({
    type: ActionType.GET_INVOICE_CORRECTION,
    invoice: payload,
});

export const generalInvoicesDispatch = (payload: IGenericRecord[]): IGetGeneralInvoices => ({
    type: ActionType.GET_GENERAL_INVOICES,
    invoices: payload,
});

export const utilsDataDispatch = (payload: IGenericRecord): IGetUtilsData => ({
    type: ActionType.GET_UTILS_DATA,
    utils: payload,
});

export const currentErrors = (errors: IGenericRecord[]): IGetCurrentErrors => ({
    type: ActionType.GET_CURRENT_ERRORS,
    errors,
});

export const setError = (error: string): ISetError => ({
    type: ActionType.SET_ERROR,
    error,
});

export const getInvoiceCorrection = (
    invoice: IGenericRecord
): ThunkAction<Promise<void>, RootState, unknown, CorrectionBusinessDocumentActions> => {
    return async (dispatch: ThunkDispatch<RootState, unknown, CorrectionBusinessDocumentActions>): Promise<void> => {
        dispatch(invoiceCorrection(invoice));
    };
};

export const getGeneralInvoices = (
    CCXC: boolean,
    date?: number
): ThunkAction<Promise<void>, RootState, unknown, CorrectionBusinessDocumentActions> => {
    return async (dispatch: ThunkDispatch<RootState, unknown, CorrectionBusinessDocumentActions>): Promise<void> => {
        try {
            const request = new FetchRequest(urls.invoice.errorHistories, {
                date,
                CCXC,
            });
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const response: any = await apiPostInvoice(request);
            dispatch(generalInvoicesDispatch(response.data));
            return response;
        } catch (error) {
            dispatch(setError(String(error)));
        }
    };
};

export const getCurrentInvoiceCorrection = (
    id: string
): ThunkAction<Promise<void>, RootState, unknown, CorrectionBusinessDocumentActions> => {
    return async (dispatch: ThunkDispatch<RootState, unknown, CorrectionBusinessDocumentActions>): Promise<void> => {
        try {
            const request = new FetchRequest(urls.invoice.getElectronicInvoice(id));
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const { data }: any = await apiGetInvoice(request);
            dispatch(invoiceCorrection(data));
        } catch (error) {
            dispatch(setError(String(error)));
        }
    };
};

export const getCurrentErrors = (
    id: string
): ThunkAction<Promise<void>, RootState, unknown, CorrectionBusinessDocumentActions> => {
    return async (dispatch: ThunkDispatch<RootState, unknown, CorrectionBusinessDocumentActions>): Promise<void> => {
        try {
            const request = new FetchRequest(urls.invoice.getErrorHistoriesById(id));
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const { data }: any = await apiGetInvoice(request);
            dispatch(currentErrors(data.error_histories));
        } catch (error) {
            dispatch(setError(String(error)));
        }
    };
};
export const updateCorrectedInvoice = (
    id: string,
    mainData: IGenericRecord,
    dateInput: number
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
): ThunkAction<Promise<any>, RootState, unknown, CorrectionBusinessDocumentActions> => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return async (dispatch: ThunkDispatch<RootState, unknown, CorrectionBusinessDocumentActions>): Promise<any> => {
        try {
            const request = new FetchRequest(urls.invoice.getErrorHistoriesById(id), mainData);
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const { statusCode, data }: any = await apiPutInvoice(request);
            await dispatch(getGeneralInvoices(false, dateInput));
            return { statusCode, data };
        } catch (error) {
            dispatch(setError(String(error)));
        }
    };
};

export const getUtilsData = (): ThunkAction<Promise<void>, RootState, unknown, CorrectionBusinessDocumentActions> => {
    return async (dispatch: ThunkDispatch<RootState, unknown, CorrectionBusinessDocumentActions>): Promise<void> => {
        try {
            const request = new FetchRequest(urls.utils.dynamic_request, [
                COUNTRIES,
                TYPE_TAX_PAYER,
                FOREIGN_EXCHANGE,
                DEPARTMENTS,
                CITIES,
                FISCAL_RESPONSIBILITIES,
                DOCUMENT_TYPES,
                PAYMENT_METHODS,
                TAX_DETAIL,
                PAYMENT_TYPES,
                REASON_REJECTIONS,
                WITHHOLDINGS,
                LANGUAGES,
            ]);
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const response: any = await apiDynamicRequest(request);
            dispatch(utilsDataDispatch(response.data));
        } catch (error) {
            dispatch(setError(String(error)));
        }
    };
};

export const rebroadcastDocument = (
    invoice_id: string
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
): ThunkAction<Promise<any>, RootState, unknown, CorrectionBusinessDocumentActions> => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return async (dispatch: ThunkDispatch<RootState, unknown, CorrectionBusinessDocumentActions>): Promise<any> => {
        try {
            const request = new FetchRequest(urls.invoice.getRebroadcast(invoice_id));
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const { statusCode, data }: any = await apiGetInvoice(request);
            return { statusCode, data };
        } catch (error) {
            dispatch(setError(String(error)));
        }
    };
};
