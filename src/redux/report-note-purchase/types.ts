import { IGenericRecord } from '@models/GenericRecord';

export enum ActionKeys {
    SET_NOTES_PURCHASE = 'SET_NOTES_PURCHASE',
    SET_INVOICE_PURCHASE = 'SET_INVOICE_PURCHASE',
    SET_NOTE_PURCHASE = 'SET_NOTE_PURCHASE',
    SET_STATUS_CODE = 'SET_STATUS_CODE',
    SET_ERROR = 'SET_ERROR'
}

/**
 * This interface describes redux type
 * 
 * @typeParam type: string - Redux action
 * @typeParam data: IGenericRecord[] - Redux request data
 */
export interface ISetNotesPurchase {
    type: ActionKeys.SET_NOTES_PURCHASE,
    notes: IGenericRecord[]
}

/**
 * This interface describes redux type
 * 
 * @typeParam type: string - Redux action
 * @typeParam error: string - Redux request error
 */
export interface ISetError {
    type: ActionKeys.SET_ERROR,
    error: string
}

/**
 * This interface describes redux type
 * 
 * @typeParam type: string - Redux action
 * @typeParam statusCode: number - Redux request status code
 */
export interface ISetStatusCode {
    type: ActionKeys.SET_STATUS_CODE,
    statusCode: number
}

/**
 * This interface describes redux type
 * 
 * @typeParam type: string - Redux action
 * @typeParam note: IGenericRecord - Redux request data
 */
export interface ISetInvoicePurchase {
    type: ActionKeys.SET_INVOICE_PURCHASE,
    invoice: IGenericRecord
}

/**
 * This interface describes redux type
 * 
 * @typeParam type: string - Redux action
 * @typeParam note: IGenericRecord - Redux request data
 */
export interface ISetNotePurchase {
    type: ActionKeys.SET_NOTE_PURCHASE,
    note: IGenericRecord
}

export type ReportNotesPurchaseActions = ISetNotesPurchase | ISetInvoicePurchase | ISetNotePurchase | ISetError | ISetStatusCode;