import { IAddUser } from '@models/UserManagement';

export enum ActionKeys {
    ADD_USER = 'ADD_USER',
    ERROR_ADD_USER = 'ERROR_ADD_USER',
    SET_RESPONSE = 'SET_RESPONSE',
}

export interface IAddUsers {
    type: ActionKeys.ADD_USER;
    user: IAddUser;
}

export interface IErrorAddUser {
    type: ActionKeys.ERROR_ADD_USER;
    error: string;
}

export interface IResponse {
    type: ActionKeys.SET_RESPONSE;
    response: number | string;
}

export type AddUserActions = IAddUsers | IErrorAddUser | IResponse;
