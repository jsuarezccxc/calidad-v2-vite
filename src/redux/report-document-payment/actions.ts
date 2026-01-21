import { ThunkAction, ThunkDispatch } from 'redux-thunk';
import { RootState } from '@redux/rootReducer';
import { FetchRequest, ServiceType } from '@models/Request';
import { IGenericRecord } from '@models/GenericRecord';
import { urls } from '@api/urls';
import { apiPostUtils } from '@api/inventory';
import { apiPostInvoice, apiPutInvoice, apiUploadInvoice } from '@api/invoice';
import {
    ActionKeys,
    IDocumentPayment,
    ISetError,
    ReportDocumentPaymentActions,
    IDocumentsStore,
    ISetPaymentMethods,
    ISetStatusCode,
    ISetDocumentsPayable,
    ISetDocumentsReceivable,
} from './types';
import { CUSTOMER_TYPE, SUPPLIER_TYPE } from '@constants/InvoiceType';
import { getUserData } from '@utils/User';

export const getReportDocumentPayments = (
    date: number
): ThunkAction<Promise<void>, RootState, null, ReportDocumentPaymentActions> => {
    return async (dispatch: ThunkDispatch<RootState, null, ReportDocumentPaymentActions>): Promise<void> => {
        try {
            const request = new FetchRequest(urls.invoice.reportDocumentPayment, {
                date,
                invoice_type: CUSTOMER_TYPE,
            });
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const { data }: any = await apiPostInvoice(request);
            dispatch(setDocumentPayments(data));
        } catch (error) {
            dispatch(setError(String(error)));
        }
    };
};

export const postEditPayment = (
    isFile: boolean,
    payment: IGenericRecord,
    file: Blob
): ThunkAction<Promise<void>, RootState, null, ReportDocumentPaymentActions> => {
    return async (dispatch: ThunkDispatch<RootState, null, ReportDocumentPaymentActions>): Promise<void> => {
        try {
            const { company_id } = getUserData();
            const response = {
                statusCode: 0,
            };
            if (isFile) {
                const formData = new FormData();
                formData.append('company_id', company_id);
                formData.append('folder', 'money-installments');
                formData.append('file', file);
                formData.append('service', ServiceType.INVOICE);
                Object.keys(payment).forEach((item: string) => {
                    formData.append(`${item}`, payment[item]);
                });
                const request = new FetchRequest(urls.invoice.updatePayment, formData);
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const responseApi: any = await apiUploadInvoice(request);
                response.statusCode = responseApi.statusCode;
            } else {
                const request = new FetchRequest(urls.invoice.updatePayment, payment);
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const responseApi: any = await apiPostInvoice(request);
                response.statusCode = responseApi.statusCode;
            }
            dispatch(setStatusCode(response.statusCode));
        } catch (error) {
            dispatch(setError(String(error)));
        }
    };
};

export const getReportDocumentsStoreInstallment = (): ThunkAction<
    Promise<void>,
    RootState,
    null,
    ReportDocumentPaymentActions
> => {
    return async (dispatch: ThunkDispatch<RootState, null, ReportDocumentPaymentActions>): Promise<void> => {
        try {
            const request = new FetchRequest(urls.invoice.documentsStoreInstallment, {
                invoice_type: CUSTOMER_TYPE,
            });
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const { data }: any = await apiPostInvoice(request);
            dispatch(setDocumentsStore(data));
        } catch (error) {
            dispatch(setError(String(error)));
        }
    };
};

export const deleteFilePayment = (
    idPayment: string
): ThunkAction<Promise<void>, RootState, null, ReportDocumentPaymentActions> => {
    return async (dispatch: ThunkDispatch<RootState, null, ReportDocumentPaymentActions>): Promise<void> => {
        try {
            const request = new FetchRequest(urls.invoice.deletePayment(idPayment));
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const { data }: any = await apiPutInvoice(request);
            dispatch(setDocumentsStore(data));
        } catch (error) {
            dispatch(setError(String(error)));
        }
    };
};

export const getPaymentMethodsByType = (): ThunkAction<Promise<void>, RootState, null, ReportDocumentPaymentActions> => {
    return async (dispatch: ThunkDispatch<RootState, null, ReportDocumentPaymentActions>): Promise<void> => {
        try {
            const request = new FetchRequest(urls.utils.paymentMethods, {
                type: ServiceType.PHYSICAL_STORE,
            });
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const { data }: any = await apiPostUtils(request);
            dispatch(setPaymentMethods(data));
        } catch (error) {
            dispatch(setError(String(error)));
        }
    };
};

export const getDocumentsStoreMoneyInstallments = (
    supplier: boolean
): ThunkAction<Promise<void>, RootState, null, ReportDocumentPaymentActions> => {
    return async (dispatch: ThunkDispatch<RootState, null, ReportDocumentPaymentActions>): Promise<void> => {
        try {
            const request = new FetchRequest(urls.invoice.documentsStoreInstallment, {
                invoice_type: supplier ? SUPPLIER_TYPE : CUSTOMER_TYPE,
            });
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const { data }: any = await apiPostInvoice(request);
            if (supplier) {
                dispatch(setDocumentsPayable(data));
            } else {
                dispatch(setDocumentsReceivable(data));
            }
        } catch (error) {
            dispatch(setError(String(error)));
        }
    };
};

export const setStatusCode = (statusCode: number): ISetStatusCode => ({
    type: ActionKeys.SET_STATUS_CODE,
    statusCode,
});

export const setDocumentPayments = (data: IGenericRecord[]): IDocumentPayment => ({
    type: ActionKeys.SET_DOCUMENT_PAYMENT,
    data,
});

export const setDocumentsStore = (documentsStore: IGenericRecord[]): IDocumentsStore => ({
    type: ActionKeys.SET_DOCUMENTS_STORE,
    documentsStore,
});

export const setPaymentMethods = (paymentMethods: IGenericRecord[]): ISetPaymentMethods => ({
    type: ActionKeys.SET_PAYMENT_METHODS,
    paymentMethods,
});

export const setDocumentsReceivable = (documentsReceivable: IGenericRecord[]): ISetDocumentsReceivable => ({
    type: ActionKeys.SET_DOCUMENTS_RECEIVABLE,
    documentsReceivable,
});

export const setDocumentsPayable = (documentsPayable: IGenericRecord[]): ISetDocumentsPayable => ({
    type: ActionKeys.SET_DOCUMENTS_PAYABLE,
    documentsPayable,
});

export const setError = (error: string): ISetError => ({
    type: ActionKeys.SET_ERROR,
    error,
});
