import { IGenericRecord } from '@models/GenericRecord';

export enum ActionKeys {
    SET_SALES_REPORT = 'SET_SALES_REPORT',
    SET_ELECTRONIC_DOCUMENTS_SALES_REPORT = 'SET_ELECTRONIC_DOCUMENTS_SALES_REPORT',
    SET_ERROR = 'SET_ERROR',
    SET_PRODUCT_SERVICE = 'SET_PRODUCT_SERVICE',
    SET_SALES = 'SET_SALES',
}

export interface ISetSalesReport {
    type: ActionKeys.SET_SALES_REPORT;
    data: IGenericRecord;
}

export interface IError {
    type: ActionKeys.SET_ERROR;
    error: string;
}

export interface ISetProductService {
    type: ActionKeys.SET_PRODUCT_SERVICE;
    data: string;
}

export interface ISetElectronicDocumentsSalesReport {
    type: ActionKeys.SET_ELECTRONIC_DOCUMENTS_SALES_REPORT;
    data: IGenericRecord;
}

export interface ISetSales {
    type: ActionKeys.SET_SALES;
    payload: IGenericRecord;
}

export type SalesReportSalesForce =
    | ISetSalesReport
    | IError
    | ISetProductService
    | ISetElectronicDocumentsSalesReport
    | ISetSales;
