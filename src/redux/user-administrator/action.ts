import { ThunkAction, ThunkDispatch } from 'redux-thunk';
import { IRoles } from '@models/user-administrator';
import {
    ActionKeys,
    IAddUser,
    IDeleteUser,
    IEditUser,
    IErrorUser,
    IGetUser,
    IGetUsersPermissions,
    UserAdministratorActions,
} from '../user-administrator/types';
import { RootState } from '@redux/rootReducer';
import { apiDeleteUser, apiUserPermissions } from '@api/userCatalogs';
import { IGenericRecord } from '@models/GenericRecord';
import { FetchRequest } from '@models/Request';
import { urls } from '@api/urls';

export const getUser = (userAdmin: IGenericRecord): IGetUser => ({
    type: ActionKeys.GET_USER,
    userAdmin,
});

export const addUser = (name: string, companyId: string, email: string, roles: IRoles[], password: string): IAddUser => ({
    type: ActionKeys.ADD_USER,
    name,
    companyId,
    email,
    roles,
    password,
});

export const editUser = (id: string, name: string, email: string, roles: IRoles[]): IEditUser => ({
    type: ActionKeys.EDIT_USER,
    id,
    name,
    email,
    roles,
});

export const deleteUser = (id: string[]): IDeleteUser => ({
    type: ActionKeys.DELETE_USER,
    id,
});

export const setUsersPermissions = (usersPermissions: IGenericRecord[]): IGetUsersPermissions => ({
    type: ActionKeys.GET_USERS_PERMISSIONS,
    usersPermissions,
});

export const errorUser = (error: string): IErrorUser => ({
    type: ActionKeys.ERROR_USER,
    error,
});

export const DeleteUser = (id: IGenericRecord[]): ThunkAction<Promise<void>, RootState, unknown, UserAdministratorActions> => {
    return async (dispatch: ThunkDispatch<RootState, unknown, UserAdministratorActions>): Promise<void> => {
        try {
            const request = new FetchRequest(urls.user, id);
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const response: any = await apiDeleteUser(request);
            dispatch(getUser(response.data));
        } catch (error) {
            dispatch(errorUser('Inténtelo de nuevo'));
        }
    };
};

export const getUserPermissions = (): ThunkAction<Promise<void>, RootState, unknown, UserAdministratorActions> => {
    return async (dispatch: ThunkDispatch<RootState, unknown, UserAdministratorActions>): Promise<void> => {
        try {
            //eslint-disable-next-line @typescript-eslint/no-explicit-any
            const { data }: any = await apiUserPermissions();
            dispatch(setUsersPermissions(data));
        } catch (error) {
            dispatch(errorUser('Inténtelo de nuevo'));
        }
    };
};
