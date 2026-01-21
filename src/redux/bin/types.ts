import { IGenericRecord } from '@models/GenericRecord';

export enum ActionKeys {
    GET_BIN_DATA = 'GET_BIN_DATA',
    SET_ERROR = 'SET_ERROR',
}

export interface IGetBinData {
    type: ActionKeys.GET_BIN_DATA;
    data: IGenericRecord[];
}

export interface ISetError {
    type: ActionKeys.SET_ERROR;
    error: string;
}

export type BinActions = IGetBinData | ISetError;
