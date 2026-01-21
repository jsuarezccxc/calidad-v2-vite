import { IRoles } from '@models/user-administrator';
import { IGenericRecord } from '@models/GenericRecord';

export enum ActionKeys {
    EDIT_USER = 'EDIT_USER',
    ADD_USER = 'ADD_USER',
    DELETE_USER = 'DELETE_USER',
    GET_USER = 'GET_USER',
    ERROR_USER = 'ERROR_USER',
    GET_USERS_PERMISSIONS = 'GET_USERS_PERMISSIONS',
}

export interface IGetUser {
    type: ActionKeys.GET_USER;
    userAdmin: IGenericRecord;
}

export interface IEditUser {
    type: ActionKeys.EDIT_USER;
    id: string;
    name: string;
    email: string;
    roles: IRoles[];
}

export interface IDeleteUser {
    type: ActionKeys.DELETE_USER;
    id: string[];
}

export interface IAddUser {
    type: ActionKeys.ADD_USER;
    name: string;
    companyId: string;
    email: string;
    roles: IRoles[];
    password: string;
}

export interface IGetUsersPermissions {
    type: ActionKeys.GET_USERS_PERMISSIONS;
    usersPermissions: IGenericRecord[];
}

export interface IErrorUser {
    type: ActionKeys.ERROR_USER;
    error: string;
}

export type UserAdministratorActions =
    | IGetUser
    | IEditUser
    | IDeleteUser
    | IAddUser
    | IGetUsersPermissions
    | IErrorUser;
