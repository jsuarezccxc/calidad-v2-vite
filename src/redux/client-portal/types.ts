import { IGenericRecord } from '@models/GenericRecord';

export enum ActionKeys {
    GET_DYNAMIC_REQUEST = 'GET_DYNAMIC_REQUEST',
    CLIENT_SELECTED = 'CLIENT_SELECTED',
    DELETE_ADDRESS = 'DELETE_ADDRESS',
    SET_STATUS_CODE = 'SET_STATUS_CODE',
    SET_ERROR = 'SET_ERROR',
}

export interface IGetDynamicRequest {
    type: ActionKeys.GET_DYNAMIC_REQUEST;
    dynamicData: IGenericRecord;
}

export interface IClientSelected {
    type: ActionKeys.CLIENT_SELECTED;
    clientSelected: IGenericRecord;
}

export interface IDeleteAddress {
    type: ActionKeys.DELETE_ADDRESS;
    addressToDelete: string;
}

export interface ISetStatusCode {
    type: ActionKeys.SET_STATUS_CODE;
    statusCode: number;
}

export interface ISetError {
    type: ActionKeys.SET_ERROR;
    error: string;
}

export type ClientPortalActions = IGetDynamicRequest | IClientSelected | ISetStatusCode |IDeleteAddress | ISetError;
