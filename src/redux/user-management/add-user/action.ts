import { ThunkAction, ThunkDispatch } from 'redux-thunk';
import { ActionKeys, AddUserActions, IAddUsers, IErrorAddUser, IResponse } from './types';
import { RootState } from '@redux/rootReducer';
import { apiAddUser } from '@api/userCatalogs';
import { IAddUser } from '@models/UserManagement';
import { FetchRequest } from '@models/Request';
import { urls } from '@api/urls';

export const addUser = (user: IAddUser): IAddUsers => ({
    type: ActionKeys.ADD_USER,
    user,
});

export const errorAddUser = (error: string): IErrorAddUser => ({
    type: ActionKeys.ERROR_ADD_USER,
    error,
});

export const setResponse = (response: number | string): IResponse => ({
    type: ActionKeys.SET_RESPONSE,
    response,
});

export const userAdded = (userData: IAddUser): ThunkAction<Promise<void>, RootState, unknown, AddUserActions> => {
    return async (dispatch: ThunkDispatch<RootState, unknown, AddUserActions>): Promise<void> => {
        try {
            const request = new FetchRequest(urls.user, userData);
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const { data, statusCode }: any = await apiAddUser(request);
            dispatch(addUser(data));
            dispatch(setResponse(statusCode));
        } catch (error) {
            dispatch(errorAddUser('Inténtelo de nuevo'));
        }
    };
};
