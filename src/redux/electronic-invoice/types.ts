import { IInvoiceCalculates } from '@models/ElectronicInvoice';
import { IGenericRecord } from '@models/GenericRecord';

export enum ActionKeys {
    SET_SELECTED_DOCUMENT = 'SET_SELECTED_DOCUMENT',
    SET_LIST_ISSUED_DOCUMENT = 'SET_LIST_ISSUED_DOCUMENT',
    SET_LIST_DOCUMENTS_REQUIRE_ACTION = 'SET_LIST_DOCUMENTS_REQUIRE_ACTION',
    GET_REPORT_SALES_RECORDS = 'GET_REPORT_SALES_RECORDS',
    GET_ELECTRONIC_INVOICE = 'GET_ELECTRONIC_INVOICE',
    GET_LIST_INVOICE = 'GET_LIST_INVOICE',
    GET_CONSECUTIVE = 'GET_CONSECUTIVE',
    GET_CUSTOMER = 'GET_CUSTOMER',
    GET_PRODUCTS = 'GET_PRODUCTS',
    GET_INVOICES_AVAILABLE = 'GET_INVOICES_AVAILABLE',
    GET_VALIDATE_INFO_CLIENT = 'GET_VALIDATE_INFO_CLIENT',
    GET_PREFIX = 'GET_PREFIX',
    SET_LIST_INCOME_EXPENSES = 'SET_LIST_INCOME_EXPENSES',
    SET_XML = 'SET_XML',
    SET_AGREEMENT = 'SET_AGREEMENT',
    SET_LIST = 'SET_LIST',
    SET_ERROR = 'SET_ERROR',
    SET_INVOICE_CALCULATIONS = 'SET_INVOICE_CALCULATIONS',
    SET_PREFIXES = 'SET_PREFIXES',
    SET_INVOICE_PREFIX = 'SET_INVOICE_PREFIX',
    SET_STATE_INVOICE = 'SET_STATE_INVOICE',
}

export interface ISetListIssuedDocument {
    type: ActionKeys.SET_LIST_ISSUED_DOCUMENT;
    issuedDocuments: IGenericRecord[];
}

export interface ISetSelectedDocument {
    type: ActionKeys.SET_SELECTED_DOCUMENT;
    document: IGenericRecord;
}

export interface ISetListInvoice {
    type: ActionKeys.GET_LIST_INVOICE;
    invoices: IGenericRecord[];
}

export interface ISetCustomer {
    type: ActionKeys.GET_CUSTOMER;
    customer: IGenericRecord;
}

export interface ISetProducts {
    type: ActionKeys.GET_PRODUCTS;
    products: IGenericRecord[];
}

export interface ISetConsecutive {
    type: ActionKeys.GET_CONSECUTIVE;
    consecutive: IGenericRecord;
}

export interface ISetElectronicInvoice {
    type: ActionKeys.GET_ELECTRONIC_INVOICE;
    invoice: IGenericRecord;
}

export interface ISetReportSalesRecords {
    type: ActionKeys.GET_REPORT_SALES_RECORDS;
    reportSalesRecords: IGenericRecord[];
}

export interface ISetListDocumentsRequireAction {
    type: ActionKeys.SET_LIST_DOCUMENTS_REQUIRE_ACTION;
    documentsRequireAction: IGenericRecord[];
}

export interface ISetInvoicesAvailable {
    type: ActionKeys.GET_INVOICES_AVAILABLE;
    quantityInvoices: IGenericRecord;
}

export interface ISetValidateClient {
    type: ActionKeys.GET_VALIDATE_INFO_CLIENT;
    validateClient: IGenericRecord;
}

export interface ISetListIncomeExpenses {
    type: ActionKeys.SET_LIST_INCOME_EXPENSES;
    incomeExpenses: IGenericRecord;
}

export interface ISetXml {
    type: ActionKeys.SET_XML;
    payload: string;
}

export interface ISetAGreement {
    type: ActionKeys.SET_AGREEMENT;
    payload: string;
}

export interface ISetList {
    type: ActionKeys.SET_LIST;
    payload: IGenericRecord[];
}

export interface ISetPrefixCompany {
    type: ActionKeys.GET_PREFIX;
    payload: IGenericRecord[];
}

export interface IError {
    type: ActionKeys.SET_ERROR;
    error: string;
}

export interface ISetInvoiceCalculations {
    type: ActionKeys.SET_INVOICE_CALCULATIONS;
    invoiceCalculations: IInvoiceCalculates;
}

export interface ISetPrefixes {
    type: ActionKeys.SET_PREFIXES;
    payload: IGenericRecord[];
}

export interface ISetInvoicePrefix {
    type: ActionKeys.SET_INVOICE_PREFIX;
    payload: IGenericRecord;
}

/**
 * This interface is to save react state in redux
 * 
 * @typeParam type: ActionKeys.SET_STATE_INVOICE - Action type
 * @typeParam stateInvoice: IGenericRecord - React state to invoice
 */
export interface ISetInvoiceState {
    type: ActionKeys.SET_STATE_INVOICE;
    stateInvoice: IGenericRecord;
}

export type ElectronicInvoiceActions =
    | ISetListIssuedDocument
    | ISetSelectedDocument
    | ISetCustomer
    | ISetListDocumentsRequireAction
    | ISetReportSalesRecords
    | ISetElectronicInvoice
    | ISetProducts
    | ISetConsecutive
    | ISetListInvoice
    | ISetInvoicesAvailable
    | ISetValidateClient
    | ISetListIncomeExpenses
    | ISetXml
    | ISetAGreement
    | ISetList
    | ISetPrefixCompany
    | IError
    | ISetInvoiceCalculations
    | ISetPrefixes
    | ISetInvoicePrefix
    | ISetInvoiceState;
