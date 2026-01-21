import { IGenericRecord } from '@models/GenericRecord';

export enum ActionKeys {
    GET_CLIENTS = 'GET_CLIENTS',
    GET_CLIENTS_THIN = 'GET_CLIENTS_THIN',
    UPDATE_CLIENT = 'UPDATE_CLIENT',
    GET_SALE_CORRECTIONS = 'GET_SALE_CORRECTIONS',
    SET_INVOICE_CORRECTION = 'SET_INVOICE_CORRECTION',
    GET_VOUCHER = 'GET_VOUCHER',
    SET_ERROR = 'SET_ERROR',
}

export interface IGetClients {
    type: ActionKeys.GET_CLIENTS;
    clients: IGenericRecord[];
}
export interface IGetClientsThin {
    type: ActionKeys.GET_CLIENTS_THIN;
    clientsThin: IGenericRecord[];
}
export interface IUpdateClient {
    type: ActionKeys.UPDATE_CLIENT;
    dataUpdated: IGenericRecord;
}

export interface IGetSaleCorrections {
    type: ActionKeys.GET_SALE_CORRECTIONS;
    saleCorrections: IGenericRecord;
}

export interface IGetVoucher {
    type: ActionKeys.GET_VOUCHER;
    voucherInfo: IGenericRecord[];
}

export interface ISetInvoiceCorrection {
    type: ActionKeys.SET_INVOICE_CORRECTION;
    invoiceCorrection: IGenericRecord;
}

export interface ISetError {
    type: ActionKeys.SET_ERROR;
    error: string;
}

export type ClientActions =
    | IGetClients
    | IUpdateClient
    | IGetSaleCorrections
    | IGetVoucher
    | ISetInvoiceCorrection
    | IGetClientsThin
    | ISetError;
