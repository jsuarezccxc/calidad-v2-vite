import { ThunkAction, ThunkDispatch } from 'redux-thunk';
import { RootState } from '@redux/rootReducer';
import {
    ActionKeys,
    IError,
    SalesReportSalesForce,
    ISetSalesReport,
    ISetProductService,
    ISetElectronicDocumentsSalesReport,
    ISetSales,
} from './types';
import { IGenericRecord } from '@models/GenericRecord';
import { FetchRequest } from '@models/Request';
import { urls } from '@api/urls';
import { apiPostInvoice } from '@api/invoice';

export const setSalesReport = (data: IGenericRecord): ISetSalesReport => ({
    type: ActionKeys.SET_SALES_REPORT,
    data,
});

export const setElectronicDocumentSalesReport = (data: IGenericRecord): ISetElectronicDocumentsSalesReport => ({
    type: ActionKeys.SET_ELECTRONIC_DOCUMENTS_SALES_REPORT,
    data,
});

export const setError = (error: string): IError => ({
    type: ActionKeys.SET_ERROR,
    error,
});

export const setProductServiceType = (data: string): ISetProductService => ({
    type: ActionKeys.SET_PRODUCT_SERVICE,
    data,
});

export const setSales = (data: IGenericRecord): ISetSales => ({
    type: ActionKeys.SET_SALES,
    payload: data,
});

export const getSalesReport = (dataRequest: {
    start_date: number;
    finish_date: number;
    type: string;
}): ThunkAction<Promise<void>, RootState, null, SalesReportSalesForce> => {
    return async (dispatch: ThunkDispatch<RootState, null, SalesReportSalesForce>): Promise<void> => {
        try {
            const request = new FetchRequest(urls.invoice.getSalesReport, dataRequest);
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const { data }: any = await apiPostInvoice(request);
            dispatch(setSalesReport(data));
        } catch (error) {
            dispatch(setError(String(error)));
        }
    };
};

export const getElectronicDocumentSalesReport = (dataRequest: {
    start_date: string | undefined;
}): ThunkAction<Promise<void>, RootState, null, SalesReportSalesForce> => {
    return async (dispatch: ThunkDispatch<RootState, null, SalesReportSalesForce>): Promise<void> => {
        try {
            const request = new FetchRequest(urls.invoice.getElectronicDocumentSalesReport, dataRequest);
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const { data }: any = await apiPostInvoice(request);
            dispatch(setElectronicDocumentSalesReport(data));
        } catch (error) {
            dispatch(setError(String(error)));
        }
    };
};

export const getSales = (date: string): ThunkAction<Promise<void>, RootState, null, SalesReportSalesForce> => {
    return async (dispatch: ThunkDispatch<RootState, null, SalesReportSalesForce>): Promise<void> => {
        try {
            const request = new FetchRequest(urls.invoice.getSales, {
                start_date: date,
            });
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const { data }: any = await apiPostInvoice(request);
            dispatch(setSales({ data, date }));
        } catch (error) {
            dispatch(setError(String(error)));
        }
    };
};
