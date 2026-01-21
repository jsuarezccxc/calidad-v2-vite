import {ActionKeys, UserAdministratorActions,} from '@redux/user-administrator/types';
import {IRoles} from '@models/user-administrator';
import {IGenericRecord} from '@models/GenericRecord';

interface IUserAdministratorState {
    id?: string[] | string;
    name?: string;
    email?: string;
    idCompany?: string;
    roles?: IRoles[];
    password?: string;
    error?: string;
    userAdmin?: IGenericRecord;
    usersPermissions?: IGenericRecord[];
}

export const reducer = (
    state: IUserAdministratorState = {},
    action: UserAdministratorActions
): IUserAdministratorState => {
    switch (action.type) {
        case ActionKeys.GET_USER:
            return {
                ...state,
                userAdmin: action.userAdmin,
            };
        case ActionKeys.EDIT_USER:
            return {
                ...state,
                id: action.id,
                name: action.name,
                email: action.email,
                roles: action.roles,
            };
        case ActionKeys.ADD_USER:
            return {
                ...state,
                idCompany: action.companyId,
                name: action.name,
                email: action.email,
                roles: action.roles,
                password: action.password,
            };
        case ActionKeys.DELETE_USER:
            return {
                ...state,
                id: action.id,
            };
        case ActionKeys.GET_USERS_PERMISSIONS:
            return {
                ...state,
                usersPermissions: action.usersPermissions,
            };
        case ActionKeys.ERROR_USER:
            return {
                ...state,
                error: action.error,
            };
        default:
            return {
                ...state,
            };
    }
};
