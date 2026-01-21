import { ThunkAction, ThunkDispatch } from 'redux-thunk';
import { RootState } from '@redux/rootReducer';
import { IRecoverPassword, IChangePassword, IFailed, IClearErrors, ActionKeys, RecoverPasswordActions } from './types';
import { UNAUTHORIZED } from '@constants/StatusCodes';
import { IRecoverPasswordData, IChangePassword as IChangePasswordData } from 'models/Login';
import { apiPostUsers } from '@api/users';
import { FetchRequest } from '@models/Request';
import { urls } from '@api/urls';

export const setRecoverPassword = (response: number): IRecoverPassword => ({
    type: ActionKeys.RECOVER_PASSWORD,
    response,
});

export const setDataForChangePassword = (changePassword: boolean): IChangePassword => ({
    type: ActionKeys.CHANGE_PASSWORD,
    changePassword,
});

export const failedRecoverPassword = (error: string): IFailed => ({
    type: ActionKeys.FAILED,
    error,
});

export const clearErrors = (): IClearErrors => ({
    type: ActionKeys.CLEAR_ERRORS,
});

export const recoverPassword = ({
    email,
}: IRecoverPasswordData): ThunkAction<Promise<void>, RootState, unknown, RecoverPasswordActions> => {
    return async (dispatch: ThunkDispatch<RootState, unknown, RecoverPasswordActions>): Promise<void> => {
        try {
            const request = new FetchRequest(urls.password.recoverPassword, { email });
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const response: any = await apiPostUsers(request);
            dispatch(setRecoverPassword(response.statusCode || UNAUTHORIZED));
        } catch (error) {
            dispatch(failedRecoverPassword(String(error)));
        }
    };
};

export const changePassword = (
    data: IChangePasswordData
): ThunkAction<Promise<void>, RootState, unknown, RecoverPasswordActions> => {
    return async (dispatch: ThunkDispatch<RootState, unknown, RecoverPasswordActions>): Promise<void> => {
        try {
            const request = new FetchRequest(urls.password.changePassword, data);
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const response: any = await apiPostUsers(request);
            dispatch(setDataForChangePassword(response ? true : false));
            const { statusCode } = response;
            return statusCode;
        } catch (error) {
            dispatch(failedRecoverPassword('*Token inválido'));
        }
    };
};
