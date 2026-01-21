import { IGenericRecord } from '@models/GenericRecord';

export enum ActionKeys {
    SET_PDF_FILES = 'SET',
    SET_DATA_MASSIVE_UPLOAD = 'SET_DATA_MASSIVE_UPLOAD',
    SET_ERROR = 'SET_ERROR',
    SET_ERROR_MASSIVE_UPLOAD = 'SET_ERROR_MASSIVE_UPLOAD',
}

/**
 * This interface set massive errors upload
 *
 * @typeParam column: string - Prop of column
 * @typeParam row: number - Row of error
 * @typeParam error: string - Error message
 * @typeParam type: number - Type of error
 */
export interface IErrorMassiveUpload {
    column: string;
    row: number;
    error: string;
    type: number;
}

export interface ISetError {
    type: ActionKeys.SET_ERROR;
    error: string;
}

export interface ISetMassiveUpload {
    type: ActionKeys.SET_DATA_MASSIVE_UPLOAD;
    payload: IGenericRecord[];
}
export interface ISetErrorMassiveUpload {
    type: ActionKeys.SET_ERROR_MASSIVE_UPLOAD;
    payload: IErrorMassiveUpload[];
}

export type AssembleProductActions = ISetError | ISetMassiveUpload | ISetErrorMassiveUpload;
