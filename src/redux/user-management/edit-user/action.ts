/* eslint-disable @typescript-eslint/ban-types */
import { ThunkAction, ThunkDispatch } from 'redux-thunk';
import { RootState } from '@redux/rootReducer';
import { apiEditUser } from '@api/userCatalogs';
import { IEditUser } from '@models/EditUser';
import { IGenericRecord } from '@models/GenericRecord';
import { ActionKeys, EditUserActions, IErrorEditUser, IUpdateUsers, IResponse } from './types';
import { FetchRequest } from '@models/Request';
import { urls } from '@api/urls';

export const editUser = (updateUser: IEditUser[]): IUpdateUsers => ({
    type: ActionKeys.EDIT_USER,
    updateUser,
});

export const setToEditUser = (setEditUser: IGenericRecord): IGenericRecord => ({
    type: ActionKeys.SET_EDIT_USER,
    setEditUser,
});

export const errorEditUser = (error: string): IErrorEditUser => ({
    type: ActionKeys.ERROR_EDIT_USER,
    error,
});

export const setResponse = (response: number | string): IResponse => ({
    type: ActionKeys.SET_RESPONSE,
    response,
});

export const userUpdate = (userData: IEditUser): ThunkAction<Promise<void>, RootState, {}, EditUserActions> => {
    return async (dispatch: ThunkDispatch<RootState, {}, EditUserActions>): Promise<void> => {
        try {
            const request = new FetchRequest(urls.user, userData);
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const { data, statusCode }: any = await apiEditUser(request);
            dispatch(editUser(data));
            dispatch(setResponse(statusCode));
        } catch (error) {
            dispatch(errorEditUser('Fallo interno del servidor.'));
        }
    };
};
