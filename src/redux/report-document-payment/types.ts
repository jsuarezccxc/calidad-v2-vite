import { IGenericRecord } from '@models/GenericRecord';

export enum ActionKeys {
    SET_DOCUMENT_PAYMENT = 'SET_DOCUMENT_PAYMENT',
    SET_STATUS_CODE = 'SET_STATUS_CODE',
    SET_DOCUMENTS_STORE = 'SET_DOCUMENTS_STORE',
    SET_PAYMENT_METHODS = 'SET_PAYMENT_METHODS',
    SET_DOCUMENTS_RECEIVABLE = 'SET_DOCUMENTS_RECEIVABLE',
    SET_DOCUMENTS_PAYABLE = 'SET_DOCUMENTS_PAYABLE',
    SET_ERROR = 'SET_ERROR',
}

/**
 * This interface describes redux type
 *
 * @typeParam type: string - Redux action
 * @typeParam data: IGenericRecord[] - Redux request data
 */
export interface IDocumentPayment {
    type: ActionKeys.SET_DOCUMENT_PAYMENT;
    data: IGenericRecord[];
}

/**
 * This interface describes redux type
 *
 * @typeParam type: string - Redux action
 * @typeParam documentsStore: IGenericRecord[] - Redux request documents store installment
 */
export interface IDocumentsStore {
    type: ActionKeys.SET_DOCUMENTS_STORE;
    documentsStore: IGenericRecord[];
}

/**
 * This interface describes redux type
 *
 * @typeParam type: string - Redux action
 * @typeParam paymentMethods: IGenericRecord[] - Redux request documents store installment
 */
export interface ISetPaymentMethods {
    type: ActionKeys.SET_PAYMENT_METHODS;
    paymentMethods: IGenericRecord[];
}

/**
 * This interface describes redux type
 *
 * @typeParam type: string - Redux action
 * @typeParam documentsReceivable: IGenericRecord[] - Redux request documents store installment
 */
export interface ISetDocumentsReceivable {
    type: ActionKeys.SET_DOCUMENTS_RECEIVABLE;
    documentsReceivable: IGenericRecord[];
}

/**
 * This interface describes redux type
 *
 * @typeParam type: string - Redux action
 * @typeParam documentsPayable: IGenericRecord[] - Redux request documents store installment
 */
export interface ISetDocumentsPayable {
    type: ActionKeys.SET_DOCUMENTS_PAYABLE;
    documentsPayable: IGenericRecord[];
}

/*
 * This interface describes redux error
 *
 * @typeParam type: string - Redux action
 * @typeParam error: string - Redux request error
 */
export interface ISetError {
    type: ActionKeys.SET_ERROR;
    error: string;
}

/*
 * This interface describes redux statusCode
 *
 * @typeParam type: string - Redux action
 * @typeParam statusCode: number - Redux request error
 */
export interface ISetStatusCode {
    type: ActionKeys.SET_STATUS_CODE;
    statusCode: number;
}

export type ReportDocumentPaymentActions =
    | IDocumentPayment
    | IDocumentsStore
    | ISetPaymentMethods
    | ISetDocumentsReceivable
    | ISetDocumentsPayable
    | ISetError
    | ISetStatusCode;
