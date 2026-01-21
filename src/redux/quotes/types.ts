import { IGenericRecord } from '@models/GenericRecord';
import { IGenericPaginationData } from '@constants/PaginationBack';

/**
 * Action types for quotes redux state management
 */
export enum ActionKeys {
    SET_QUOTES_LIST = 'SET_QUOTES_LIST',
    SET_QUOTE_DATA = 'SET_QUOTE_DATA',
    SET_ERROR = 'SET_ERROR',
    FAILED_MODIFICATIONS = 'FAILED_MODIFICATIONS',
    SEND_EMAIL_TEMPLATE = 'SEND_EMAIL_TEMPLATE',
}

export interface ISetQuotesList {
    type: ActionKeys.SET_QUOTES_LIST;
    responseList: IGenericPaginationData<IGenericRecord>;
}

export interface ISetQuoteData {
    type: ActionKeys.SET_QUOTE_DATA;
    quoteData: IGenericRecord;
}

export interface ISetError {
    type: ActionKeys.SET_ERROR;
    error: string;
}

export interface ISetFailedModifications {
    type: ActionKeys.FAILED_MODIFICATIONS;
    error: string;
}

export interface ISetEmailTemplateResponse {
    type: ActionKeys.SEND_EMAIL_TEMPLATE;
    response: IGenericRecord;
}

export interface IQuoteApiResponse {
    statusCode: number;
    data: IGenericRecord;
    message?: string;
}

export interface IQuoteListApiResponse {
    statusCode: number;
    data: IGenericPaginationData<IGenericRecord>;
    message?: string;
}

export interface IQuoteCreateResponse {
    statusCode: number;
    data: IGenericRecord;
    message?: string;
}

export interface IQuoteDeleteResponse {
    statusCode?: number;
    success: boolean;
    message?: string;
}

export type QuotesActions = 
    | ISetQuotesList
    | ISetQuoteData
    | ISetError
    | ISetFailedModifications
    | ISetEmailTemplateResponse;
