import { IGenericRecord } from "@models/GenericRecord";

export enum ActionKeys {
    SET_ERROR = 'ERROR',
    GET_SALES = 'SALES',
}

export interface IGetSales {
    type: ActionKeys.GET_SALES;
    data: IGenericRecord[];
}

export interface ISetError {
    type: ActionKeys.SET_ERROR;
    error: string;
}

export type FinalInventoryActions =
    | IGetSales
    | ISetError;
