import { IGenericRecord } from "@models/GenericRecord";
import { IElectronicDocument } from "@models/ElectronicInvoice";

export enum ActionKeys {
    SET_DOCUMENTS = 'SET_DOCUMENTS',
    SET_SPECIFIC_DOCUMENT = 'SET_SPECIFIC_DOCUMENT',
    SET_CONSECUTIVE = 'SET_CONSECUTIVE',
    SET_DOWNLOAD_INVOICE = 'SET_DOWNLOAD_INVOICE',
    SET_TYPES_REASON_REJECTED = 'SET_TYPES_REASON_REJECTED',
    SET_INVOICE_EXCEL = 'SET_INVOICE_EXCEL',
    SET_STATUS = 'SET_STATUS',
    SET_ERROR = 'SET_ERROR',
    SET_NOTE = 'SET_NOTE',
}

export interface ISetSpecificDocument {
    type: ActionKeys.SET_SPECIFIC_DOCUMENT;
    document: IElectronicDocument;
}

export interface ISetDocuments {
    type: ActionKeys.SET_DOCUMENTS;
    data: IGenericRecord[]
}

export interface ISetConsecutive {
    type:ActionKeys.SET_CONSECUTIVE;
    consecutive: IGenericRecord
}

export interface ISetDownloadInvoice {
    type: ActionKeys.SET_DOWNLOAD_INVOICE;
    invoice: IGenericRecord
}

export interface ISetInvoiceExcel {
    type: ActionKeys.SET_INVOICE_EXCEL;
    invoiceExcel: IGenericRecord
}

export interface ISetTypesReasonRejected {
    type: ActionKeys.SET_TYPES_REASON_REJECTED,
    typesReasonRejected: IGenericRecord[]

}

export interface ISetStatus {
    type: ActionKeys.SET_STATUS;
    code: number
}

export interface ISetError {
    type: ActionKeys.SET_ERROR;
    error: string;
}

export interface ISetNote {
    type: ActionKeys.SET_NOTE,
    note: IGenericRecord[]
}

export type CancellationElectronicDocumentActions = ISetDocuments | ISetSpecificDocument | ISetConsecutive | ISetDownloadInvoice | ISetTypesReasonRejected | ISetInvoiceExcel | ISetStatus | ISetError | ISetNote;
