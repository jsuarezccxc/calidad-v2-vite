import { IGenericRecord } from '@models/GenericRecord';

export enum ActionKeys {
    LOGOUT = 'LOGOUT',
    SET_USERS = 'SET_USERS',
    SET_AREA = 'SET_AREA',
    SET_SHOW_PQRSF = 'SET_SHOW_PQRSF',
    ERROR = 'ERROR',
}

export interface ILogoutUser {
    type: ActionKeys.LOGOUT;
}

export interface ISetUsers {
    type: ActionKeys.SET_USERS;
    users: IGenericRecord[];
}

export interface IError {
    type: ActionKeys.ERROR;
    error: string;
}
export interface ISetArea {
    type: ActionKeys.SET_AREA;
    area: IGenericRecord[];
}

export interface ISetShowPQRSF {
    type: ActionKeys.SET_SHOW_PQRSF;
}

// Export actions from module User
export type UserActions = ILogoutUser | ISetUsers | IError | ISetArea | ISetShowPQRSF;
