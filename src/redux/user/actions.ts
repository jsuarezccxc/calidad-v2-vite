/* eslint-disable @typescript-eslint/no-explicit-any */ /* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { ThunkAction, ThunkDispatch } from 'redux-thunk';
import { RootState } from '@redux/rootReducer';
import { apiGetUser } from '@api/userCatalogs';
import { apiFile } from '@api/file';
import { urls } from '@api/urls';
import { apiUpdateUser } from '@api/users';
import { apiGetNotification, apiPostNotification } from '@api/notification';
import { ICreateRequest, Request, FetchRequest } from '@models/Request';
import { IArea, INotificationData } from '@models/User';
import { IGenericRecord } from '@models/GenericRecord';
import { SUCCESS_RESPONSE } from '@constants/StatusCodes';
import { PER_PAGE_RANGE } from '@constants/UtilsConstants';
import { getUserData } from '@utils/User';
import { previewFile } from '@utils/DownloadFile';
import { ILogoutUser, ISetUsers, ActionKeys, UserActions, IError, ISetArea, ISetShowPQRSF } from './types';
// Declaration actions with the format established in the Types.ts

/**
 * Logout module user
 *
 * @returns Declaration logoutUser action and type action
 */
export const logoutUser = (): ILogoutUser => ({
    type: ActionKeys.LOGOUT,
});

export const setUsers = (users: IGenericRecord[]): ISetUsers => ({
    type: ActionKeys.SET_USERS,
    users,
});

export const setShowPQRSF = (): ISetShowPQRSF => ({
    type: ActionKeys.SET_SHOW_PQRSF,
});

export const setError = (error: string): IError => ({
    type: ActionKeys.ERROR,
    error,
});

export const getUsers = (perPage = false): ThunkAction<Promise<void>, RootState, unknown, UserActions> => {
    return async (dispatch: ThunkDispatch<RootState, unknown, UserActions>): Promise<void> => {
        try {
            const { company_id } = getUserData();
            const request = new FetchRequest(perPage? `${urls.user}?per_page=${PER_PAGE_RANGE}` : urls.user, { idCompany: company_id });
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const { data }: any = await apiGetUser(request);
            dispatch(setUsers(data));
        } catch (error) {
            dispatch(setError(String(error)));
        }
    };
};

export const updatePassword = (data: IGenericRecord): ThunkAction<Promise<void>, RootState, unknown, UserActions> => {
    return async (dispatch: ThunkDispatch<RootState, unknown, UserActions>): Promise<void> => {
        try {
            const request = new FetchRequest(urls.user, data);
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const { statusCode }: any = await apiUpdateUser(request);
            return statusCode;
        } catch (error) {
            dispatch(setError(String(error)));
        }
    };
};

export const getFile = (
    dataFile: any,
    fileName: string,
    urlGetFile = urls.getFile
): ThunkAction<Promise<void>, RootState, null, UserActions> => {
    return async (dispatch: ThunkDispatch<RootState, null, UserActions>): Promise<void> => {
        try {
            const request = new FetchRequest(urlGetFile, dataFile);
            const response: any = await apiFile(request);
            previewFile(response, fileName);
        } catch (error) {
            dispatch(setError(String(error)));
        }
    };
};

export const createRequest = ({
    url,
    method,
    service_type,
    api,
    action,
    action_with_await,
    data_request,
    action_response,
}: ICreateRequest): ThunkAction<Promise<void>, RootState, unknown, UserActions> => {
    return async (dispatch: ThunkDispatch<RootState, unknown, UserActions>): Promise<void> => {
        try {
            const { id, company_id } = getUserData();
            const request = new Request(url, method, service_type, id, company_id, data_request);
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const { data, response }: any = await api(request);
            {
                action_with_await ? await dispatch(action_with_await) : dispatch(action(data));
            }
            {
                action_response && dispatch(action_response(response));
            }
        } catch (error) {
            dispatch(setError(String(error)));
        }
    };
};

export const setArea = (area: IArea[]): ISetArea => ({
    type: ActionKeys.SET_AREA,
    area,
});

export const getCompanyArea = (): ThunkAction<Promise<void>, RootState, unknown, UserActions> => {
    return async (dispatch: ThunkDispatch<RootState, unknown, UserActions>): Promise<void> => {
        try {
            const request = new FetchRequest(urls.utils.consulting_area);
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const { data, statusCode }: any = await apiGetNotification(request);
            if (SUCCESS_RESPONSE.includes(statusCode)) {
                dispatch(setArea(data));
            }
        } catch (error) {
            dispatch(setError(String(error)));
        }
    };
};

export const postNotificationConsultancy = (
    data: INotificationData
): ThunkAction<Promise<void>, RootState, unknown, UserActions> => {
    return async (dispatch: ThunkDispatch<RootState, unknown, UserActions>): Promise<void> => {
        try {
            const request = new FetchRequest(urls.notification.notification_email, data);
            const response: any = await apiPostNotification(request);
            if (SUCCESS_RESPONSE.includes(response.statusCode)) {
                return response.statusCode;
            }
        } catch (error) {
            dispatch(setError(String(error)));
        }
    };
};
