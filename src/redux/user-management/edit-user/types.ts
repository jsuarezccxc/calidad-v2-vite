import { IEditUser } from '@models/EditUser';
import { IGenericRecord } from '@models/GenericRecord';

export enum ActionKeys {
    EDIT_USER = 'EDIT_USER',
    SET_EDIT_USER = 'SET_EDIT_USER',
    ERROR_EDIT_USER = 'ERROR_EDIT_USER',
    SET_RESPONSE = 'SET_RESPONSE',
}

export interface IUpdateUsers {
    type: ActionKeys.EDIT_USER;
    updateUser: IEditUser[];
}

export interface ISetEditUser {
    type: ActionKeys.SET_EDIT_USER;
    setEditUser: IGenericRecord;
}

export interface IErrorEditUser {
    type: ActionKeys.ERROR_EDIT_USER;
    error: string;
}

export interface IResponse {
    type: ActionKeys.SET_RESPONSE;
    response: number | string;
}

export type EditUserActions =
    | IUpdateUsers
    | ISetEditUser
    | IErrorEditUser
    | IResponse;
