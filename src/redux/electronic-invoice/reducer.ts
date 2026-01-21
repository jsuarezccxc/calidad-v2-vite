import { IGenericRecord } from '@models/GenericRecord';
import { IInvoiceCalculates } from '@models/ElectronicInvoice';
import { INVOICE_CALCULATES } from '@constants/ElectronicInvoice';
import { IGenericPaginationData, paginationDataFormat } from '@constants/PaginationBack';
import { ActionKeys, ElectronicInvoiceActions, IInvoiceQuoteState } from './types';

interface IElectronicInvoiceReducer {
    issuedDocuments: IGenericRecord[];
    documentsRequireAction: IGenericRecord[];
    reportSalesRecords: IGenericRecord[];
    products: IGenericRecord[];
    customer: IGenericRecord;
    invoice: IGenericRecord;
    invoices: IGenericRecord[];
    document: IGenericRecord;
    consecutive: IGenericRecord;
    quantityInvoices: IGenericRecord;
    warningLimitInvoice: number;
    validateClient: IGenericRecord;
    incomeExpenses: IGenericRecord;
    responseList: IGenericPaginationData<IGenericRecord>;
    xml: string;
    storePrefix: IGenericRecord[];
    error?: string;
    invoiceCalculations: IInvoiceCalculates;
    prefixes: IGenericRecord[];
    invoicePrefix: IGenericRecord;
    stateInvoice: IInvoiceQuoteState | IGenericRecord;
}

const initialState = {
    issuedDocuments: [],
    documentsRequireAction: [],
    reportSalesRecords: [],
    products: [],
    invoices: [],
    consecutive: {},
    customer: {},
    invoice: {},
    document: {},
    validateClient: {},
    quantityInvoices: {},
    warningLimitInvoice: 10,
    incomeExpenses: [],
    responseList: paginationDataFormat,
    xml: '',
    storePrefix: [],
    error: '',
    invoiceCalculations: { ...INVOICE_CALCULATES },
    prefixes: [],
    invoicePrefix: {},
    stateInvoice: {},
};

export const reducer = (
    state: IElectronicInvoiceReducer = initialState,
    action: ElectronicInvoiceActions
): IElectronicInvoiceReducer => {
    switch (action.type) {
        case ActionKeys.SET_LIST_ISSUED_DOCUMENT:
            return {
                ...state,
                issuedDocuments: action.issuedDocuments,
            };
        case ActionKeys.GET_CUSTOMER:
            return {
                ...state,
                customer: action.customer,
            };
        case ActionKeys.GET_PRODUCTS:
            return {
                ...state,
                products: action.products,
            };
        case ActionKeys.GET_LIST_INVOICE:
            return {
                ...state,
                invoices: action.invoices,
            };
        case ActionKeys.GET_CONSECUTIVE:
            return {
                ...state,
                consecutive: action.consecutive,
            };
        case ActionKeys.GET_ELECTRONIC_INVOICE:
            return {
                ...state,
                invoice: action.invoice,
            };
        case ActionKeys.GET_REPORT_SALES_RECORDS:
            return {
                ...state,
                reportSalesRecords: action.reportSalesRecords,
            };
        case ActionKeys.SET_SELECTED_DOCUMENT:
            return {
                ...state,
                document: action.document,
            };
        case ActionKeys.SET_LIST_DOCUMENTS_REQUIRE_ACTION:
            return {
                ...state,
                documentsRequireAction: action.documentsRequireAction,
            };
        case ActionKeys.GET_INVOICES_AVAILABLE:
            return {
                ...state,
                quantityInvoices: action.quantityInvoices,
            };
        case ActionKeys.GET_VALIDATE_INFO_CLIENT:
            return {
                ...state,
                validateClient: action.validateClient,
            };
        case ActionKeys.SET_LIST_INCOME_EXPENSES:
            return {
                ...state,
                incomeExpenses: action.incomeExpenses,
            };
        case ActionKeys.SET_XML:
            return {
                ...state,
                xml: action.payload,
            };
        case ActionKeys.SET_LIST:
            return {
                ...state,
                responseList: action.payload,
            };
        case ActionKeys.GET_PREFIX:
            return {
                ...state,
                storePrefix: action.payload,
            };
        case ActionKeys.SET_ERROR:
            return {
                ...state,
                error: action.error,
            };
        case ActionKeys.SET_INVOICE_CALCULATIONS:
            return {
                ...state,
                invoiceCalculations: action.invoiceCalculations,
            };
        case ActionKeys.SET_PREFIXES:
            return {
                ...state,
                prefixes: action.payload,
            };
        case ActionKeys.SET_INVOICE_PREFIX:
            return {
                ...state,
                invoicePrefix: action.payload,
            };
        case ActionKeys.SET_STATE_INVOICE:
            return {
                ...state,
                stateInvoice: action.stateInvoice,
            };
        default:
            return state;
    }
};
