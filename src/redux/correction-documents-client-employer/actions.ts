import { ThunkAction, ThunkDispatch } from 'redux-thunk';
import { Dispatch } from 'redux';
import { RootState } from '@redux/rootReducer';
import { IGenericRecord } from '@models/GenericRecord';
import { FetchRequest } from '@models/Request';
import { urls } from '@api/urls';
import { apiDynamicRequest } from '@api/utils';
import { apiGetInvoice, apiPostInvoice, apiSendMailInvoice } from '@api/invoice';
import {
    ActionKeys,
    CorrectionBusinessDocumentActions,
    IConsecutive,
    IGetAllNotes,
    IGetCurrentInvoice,
    IGetPrefixes,
    IHistoryCorrectionDocumentClient,
    ISetCurrentSaveNote,
    ISetError,
    ISetInvoiceCorrection,
    ISetInvoiceDetail,
    ISetInvoiceDisplay,
    ISetReasonRejects,
    ISetTaxValue,
    IShowModalSave,
} from './types';
import { isCorrectResponse } from '@utils/Response';
import { formatTotalTableData } from '@pages/correction-business-document/components/invoice-correction';

export const getHistoryCorrectionDocumentsClient = (): ThunkAction<
    Promise<void>,
    RootState,
    null,
    CorrectionBusinessDocumentActions
> => {
    return async (dispatch: ThunkDispatch<RootState, null, CorrectionBusinessDocumentActions>): Promise<void> => {
        try {
            const request = new FetchRequest(urls.invoice.getInvoicesCorrection);
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const { data }: any = await apiGetInvoice(request);
            dispatch(setHistoryCorrectionDocumentsClient(data));
            dispatch(setAllNotes([]));
        } catch (error) {
            dispatch(setHistoryCorrectionDocumentsClient([]));
            dispatch(setError(String(error)));
        }
    };
};

export const getAllNotes = (
    idInvoice: string
): ThunkAction<Promise<void>, RootState, null, CorrectionBusinessDocumentActions> => {
    return async (dispatch: ThunkDispatch<RootState, null, CorrectionBusinessDocumentActions>): Promise<void> => {
        try {
            const request = new FetchRequest(urls.invoice.getAllNotes(idInvoice));
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const { data }: any = await apiGetInvoice(request);
            dispatch(setAllNotes(data));
        } catch (error) {
            dispatch(setError(String(error)));
        }
    };
};

export const setShowModalSave = (show: boolean) => {
    return (dispatch: Dispatch<CorrectionBusinessDocumentActions>): void => {
        dispatch(showModal(show));
    };
};

export const saveNote = (
    dataRequest: IGenericRecord
): ThunkAction<Promise<void>, RootState, null, CorrectionBusinessDocumentActions> => {
    return async (dispatch: ThunkDispatch<RootState, null, CorrectionBusinessDocumentActions>): Promise<void> => {
        try {
            const request = new FetchRequest(urls.invoice.createNote, dataRequest);
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const { data, statusCode }: any = await apiPostInvoice(request);
            if (isCorrectResponse(statusCode)) {
                const {
                    consecutive: { name, number },
                    time_issue,
                } = data[0];
                dispatch(
                    setSaveDataCurrentNote({
                        consecutive: name,
                        number,
                        time_issue,
                    })
                );
                dispatch(setShowModalSave(true));
            }
        } catch (error) {
            dispatch(setError(String(error)));
        }
    };
};

export const setTaxValues = (data: IGenericRecord[], tableData: IGenericRecord[]) => {
    return (dispatch: Dispatch<CorrectionBusinessDocumentActions>): void => {
        dispatch(setTaxes(formatTotalTableData(tableData, data)));
    };
};

export const getConsecutiveByPrefix = (
    invoiceId: string
): ThunkAction<Promise<void>, RootState, null, CorrectionBusinessDocumentActions> => {
    return async (dispatch: ThunkDispatch<RootState, null, CorrectionBusinessDocumentActions>): Promise<void> => {
        try {
            const request = new FetchRequest(urls.invoice.consecutiveByPrefix(invoiceId));
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const { data }: any = await apiGetInvoice(request);
            dispatch(getConsecutiveInvoice(data));
        } catch (error) {
            dispatch(setError(String(error)));
        }
    };
};

export const setConsecutive = (): ThunkAction<Promise<void>, RootState, null, CorrectionBusinessDocumentActions> => {
    return async (dispatch: ThunkDispatch<RootState, null, CorrectionBusinessDocumentActions>): Promise<void> => {
        dispatch(getConsecutiveInvoice({ number: 0 }));
    };
};

export const getDocumentRequireCorrection = (
    invoice_id: string,
    emptyData = false
): ThunkAction<Promise<void>, RootState, null, CorrectionBusinessDocumentActions> => {
    return async (dispatch: ThunkDispatch<RootState, null, CorrectionBusinessDocumentActions>): Promise<void> => {
        try {
            const request = new FetchRequest(urls.invoice.getInvoiceCorrection(invoice_id));
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const { data }: any = !emptyData ? await apiGetInvoice(request) : { data: {} };
            dispatch(setInvoiceCorrection(data));
        } catch (error) {
            dispatch(setError(String(error)));
        }
    };
};

export const getDocumentRequireCorrectionDisplay = (
    invoice_id: string
): ThunkAction<Promise<void>, RootState, null, CorrectionBusinessDocumentActions> => {
    return async (dispatch: ThunkDispatch<RootState, null, CorrectionBusinessDocumentActions>): Promise<void> => {
        try {
            const request = new FetchRequest(urls.invoice.getInvoiceCorrection(invoice_id));
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const { data }: any = await apiGetInvoice(request);
            dispatch(setInvoiceDetail(data));
        } catch (error) {
            dispatch(setError(String(error)));
        }
    };
};

export const getReasonRejection = (): ThunkAction<Promise<void>, RootState, null, CorrectionBusinessDocumentActions> => {
    return async (dispatch: ThunkDispatch<RootState, null, CorrectionBusinessDocumentActions>): Promise<void> => {
        try {
            const request = new FetchRequest(urls.utils.dynamic_request, ['reason_rejections']);
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const { data }: any = await apiDynamicRequest(request);
            await dispatch(setDynamicRequest(data['reason_rejections']));
        } catch (error) {
            dispatch(setError(String(error)));
        }
    };
};

export const sendEmailInvoiceCorrection = (
    information: IGenericRecord,
    file: FileList,
    body: string
): ThunkAction<Promise<void>, RootState, null, CorrectionBusinessDocumentActions> => {
    return async (dispatch: ThunkDispatch<RootState, null, CorrectionBusinessDocumentActions>): Promise<void> => {
        try {
            const formData = new FormData();
            formData.append('subject', information.subject);
            formData.append('body_content', body);
            formData.append('email', information.client_email);
            formData.append('file', file[0]);
            const request = new FetchRequest(urls.invoice.getInvoiceCorrection(information.invoice_id), formData);
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const { statusCode }: any = await apiSendMailInvoice(request);
            return statusCode;
        } catch (error) {
            dispatch(setError(String(error)));
        }
    };
};

export const getInvoiceCorrectionDisplay = (
    invoice_id: string
): ThunkAction<Promise<void>, RootState, null, CorrectionBusinessDocumentActions> => {
    return async (dispatch: ThunkDispatch<RootState, null, CorrectionBusinessDocumentActions>): Promise<void> => {
        try {
            const request = new FetchRequest(urls.invoice.getInvoiceCorrectionDisplay(invoice_id));
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const { data }: any = await apiGetInvoice(request);
            await dispatch(setInvoiceDisplay(data));
        } catch (error) {
            dispatch(setError(String(error)));
        }
    };
};

export const getCurrentInvoice = (
    id: string
): ThunkAction<Promise<void>, RootState, unknown, CorrectionBusinessDocumentActions> => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return async (dispatch: ThunkDispatch<RootState, any, CorrectionBusinessDocumentActions>): Promise<void> => {
        try {
            const request = new FetchRequest(urls.invoice.getAllNotes(id));
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const responseByNotes: any = await apiGetInvoice(request);
            dispatch(setAllNotes(responseByNotes.data));
        } catch (error) {
            dispatch(setError(String(error)));
        }
    };
};

export const setInvoiceDisplay = (invoiceDisplay: IGenericRecord): ISetInvoiceDisplay => ({
    type: ActionKeys.SET_INVOICE_DISPLAY,
    invoiceDisplay,
});

export const getInvoice = (invoice: IGenericRecord): IGetCurrentInvoice => ({
    type: ActionKeys.GET_CURRENT_INVOiCE,
    invoice,
});

export const setDynamicRequest = (reasonRejections: IGenericRecord[]): ISetReasonRejects => ({
    type: ActionKeys.SET_REASON_REJECTIONS,
    reasonRejections,
});

export const setHistoryCorrectionDocumentsClient = (history: IGenericRecord[]): IHistoryCorrectionDocumentClient => ({
    type: ActionKeys.SET_HISTORY_CORRECTION_DOCUMENT_CLIENT,
    history,
});

export const setInvoiceDetail = (invoiceDetail: IGenericRecord): ISetInvoiceDetail => ({
    type: ActionKeys.SET_INVOICE_DETAIL,
    invoiceDetail,
});

export const setInvoiceCorrection = (invoiceCorrection: IGenericRecord): ISetInvoiceCorrection => ({
    type: ActionKeys.SET_INVOICE_CORRECTION,
    invoiceCorrection,
});

export const getPrefixesOptions = (prefixes: IGenericRecord[]): IGetPrefixes => ({
    type: ActionKeys.GET_PREFIXES,
    prefixes,
});

export const setAllNotes = (notes: IGenericRecord[]): IGetAllNotes => ({
    type: ActionKeys.GET_ALL_NOTES,
    notes,
});

export const getConsecutiveInvoice = (consecutive: IGenericRecord): IConsecutive => ({
    type: ActionKeys.CONSECUTIVE,
    consecutive,
});

export const setTaxes = (taxes: IGenericRecord[]): ISetTaxValue => ({
    type: ActionKeys.SET_TAX_VALUES,
    taxes,
});

export const showModal = (show: boolean): IShowModalSave => ({
    type: ActionKeys.SHOW_MODAL_SAVE,
    show,
});

export const setSaveDataCurrentNote = (note: IGenericRecord): ISetCurrentSaveNote => ({
    type: ActionKeys.SET_CURRENT_SAVE_NOTE,
    note,
});

export const setError = (error: string): ISetError => ({
    type: ActionKeys.SET_ERROR,
    error,
});
