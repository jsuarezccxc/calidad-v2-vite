import { IGenericRecord } from '@models/GenericRecord';

export enum ActionKeys {
    SET_SUPPORT_DOCUMENT_REPORT = 'SET_SUPPORT_DOCUMENT_REPORT',
    SET_ERROR = 'SET_ERROR'
}

/**
 * This interface describes redux type
 * 
 * @typeParam type: string - Redux action
 * @typeParam data: IGenericRecord[] - Redux request data
 */
export interface ISetSupportDocumentReport {
    type: ActionKeys.SET_SUPPORT_DOCUMENT_REPORT,
    data: IGenericRecord[]
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

export type ReportIssuedDocumentsSupportDocumentActions = ISetSupportDocumentReport | ISetError;