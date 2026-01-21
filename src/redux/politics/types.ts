import { IGenericRecord } from '@models/GenericRecord';

export enum ActionKeys {
    SET_STATUS_CODE = 'SET_STATUS_CODE',
    GET_POLITICS = 'GET_POLITICS',
    ERROR = 'ERROR',
    GET_POLITICS_PURPOSES = 'GET_POLITICS_PURPOSES',
}

export interface ISetStatusCode {
    type: ActionKeys.SET_STATUS_CODE;
    statusCode: number | string;
}

export interface IGetPolitics {
    type: ActionKeys.GET_POLITICS;
    politics: IGenericRecord[];
    isDelete: boolean;
}

export interface IError {
    type: ActionKeys.ERROR;
    error: string;
}
export interface ISetPoliticsPurposes {
    type: ActionKeys.GET_POLITICS_PURPOSES;
    politicsPurposes: IGenericRecord[];
}

export type PoliticsActions = ISetStatusCode | IGetPolitics | IError | ISetPoliticsPurposes;
