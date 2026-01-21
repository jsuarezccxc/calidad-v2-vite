import { RootState } from '@redux/rootReducer';
import { ThunkAction, ThunkDispatch } from 'redux-thunk';
import { FetchRequest } from '@models/Request';
import { IGenericRecord } from '@models/GenericRecord';
import { urls } from '@api/urls';
import { apiGetInvoice, apiPostInvoice, apiPutInvoice } from '@api/invoice';
import { ActionKeys, ISetError, ISetProducts, InvoiceSummaryActions, ISetProductDetail, ISetInvoiceDetail } from './types';


export const setFailedError = (error: string): ISetError => ({
    type: ActionKeys.SET_ERROR,
    error,
});

export const getProductsInvoice = (products: IGenericRecord[]): ISetProducts => ({
    type: ActionKeys.GET_ALL_PRODUCTS,
    products,
});

export const setProductDetail = (product: IGenericRecord): ISetProductDetail => ({
    type: ActionKeys.SET_PRODUCT_DETAIL,
    product: {
        prefix: product.prefix,
        number: product.number,
    },
});

export const setInvoice = (invoice: IGenericRecord): ISetInvoiceDetail => ({
    type: ActionKeys.SET_INVOICE_DETAIL,
    invoice,
});

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/no-explicit-any
export const createInvoiceWarehouse = (data: any): ThunkAction<Promise<unknown>, RootState, unknown, InvoiceSummaryActions> => {
    return async (dispatch: ThunkDispatch<RootState, unknown, InvoiceSummaryActions>): Promise<unknown> => {
        try {
            const request = new FetchRequest(urls.suppliersPurchase.postSupplierPurchase, data);
            return await apiPostInvoice(request);
        } catch (error) {
            dispatch(setFailedError(String(error)));
        }
    };
};

export const getAllProductsInvoice = ({
    supplier_id,
    start_date,
    finish_date,
}: IGenericRecord): ThunkAction<Promise<void>, RootState, null, InvoiceSummaryActions> => {
    return async (dispatch: ThunkDispatch<RootState, null, InvoiceSummaryActions>): Promise<void> => {
        const data = { supplier_id, start_date, finish_date };
        if (!start_date) delete data.start_date;
        if (!finish_date) delete data.finish_date;
        if (!supplier_id) delete data.supplier_id;
        try {
            const request = new FetchRequest(urls.suppliers.reports, data);

            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const { data: result }: any = await apiPostInvoice(request);
            dispatch(getProductsInvoice(result));
        } catch (error) {
            dispatch(setFailedError(String(error)));
        }
    };
};

export const getInvoiceDocument = (
    invoiceId: string
): ThunkAction<Promise<void | unknown>, RootState, null, InvoiceSummaryActions> => {
    return async (dispatch: ThunkDispatch<RootState, null, InvoiceSummaryActions>): Promise<void | unknown> => {
        try {
            const request = new FetchRequest(urls.invoice.getDetails(invoiceId));
            const response = await apiGetInvoice(request);
            return response;
        } catch (error) {
            dispatch(setFailedError(String(error)));
        }
    };
};

export const putPurchaseInvoice = (
    id: string,
    data: IGenericRecord
): ThunkAction<Promise<IGenericRecord>, RootState, null, InvoiceSummaryActions> => {
    return async (dispatch: ThunkDispatch<RootState, null, InvoiceSummaryActions>): Promise<IGenericRecord> => {
        try {
            const request = new FetchRequest(urls.suppliers.putPurchaseInvoice(id), data);
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const response: any = await apiPutInvoice(request);
            return response;
        } catch (error) {
            dispatch(setFailedError(String(error)));
            return {};
        }
    };
};
