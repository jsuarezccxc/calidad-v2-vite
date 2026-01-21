import { IGenericRecord } from '@models/GenericRecord';

export enum ActionKeys {
    GET_TYPE_REJECTION = 'GET_TYPE_REJECTION',
    SET_ERROR = 'SET_ERROR',
}

/**
 * This interface describes redux type
 * @typeParam type: String - Redux type
 * @typeParam payload: IGenericRecord[] - Redux payload
 */
export interface IGetTypeRejection {
    type: ActionKeys.GET_TYPE_REJECTION;
    payload: IGenericRecord[];
}

/**
 * This interface describes redux error type
 * @typeParam type: string - Redux type
 * @typeParam error: string - Redux error
 */
export interface ISetError {
    type: ActionKeys.SET_ERROR;
    error: string;
}

export type InvoiceSummaryActions = IGetTypeRejection | ISetError;
