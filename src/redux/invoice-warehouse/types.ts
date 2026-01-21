import { IGenericRecord } from '@models/GenericRecord';

export enum ActionKeys {
    SET_ERROR = 'SET_ERROR',
    SET_SUCCESS = 'SET_SUCCESS',
    SET_MESSAGE = 'SET_MESSAGE',
    GET_ALL_PRODUCTS = 'GET_ALL_PRODUCTS',
    SET_PRODUCT_DETAIL = 'SET_PRODUCT_DETAIL',
    SET_INVOICE_DETAIL = 'SET_INVOICE_DETAIL',
}

export interface IInvoiveState {
    error: string;
    success: boolean;
    message: string;
    products: IGenericRecord[];
    invoice: IGenericRecord;
    productDetail: {
        prefix: string;
        number: number;
    };
}

export interface ISetError {
    type: ActionKeys.SET_ERROR;
    error: string;
}

export interface ISetSuccess {
    type: ActionKeys.SET_SUCCESS;
    success: string;
}

export interface ISetMessage {
    type: ActionKeys.SET_MESSAGE;
    message: string;
}

export interface ISetProducts {
    type: ActionKeys.GET_ALL_PRODUCTS;
    products: IGenericRecord[];
}

export interface ISetProductDetail {
    type: ActionKeys.SET_PRODUCT_DETAIL;
    product: {
        prefix: string;
        number: number;
    };
}

export interface ISetInvoiceDetail {
    type: ActionKeys.SET_INVOICE_DETAIL;
    invoice: IGenericRecord;
}

export type InvoiceSummaryActions = ISetMessage | ISetSuccess | ISetError | ISetProducts | ISetProductDetail | ISetInvoiceDetail;
