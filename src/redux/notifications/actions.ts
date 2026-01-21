/* eslint-disable @typescript-eslint/no-explicit-any */
import { ThunkAction, ThunkDispatch } from 'redux-thunk';
import { sendMessage } from '@api/contactUs';
import { apiGetNotification, apiPostNotification } from '@api/notification';
import { urls } from '@api/urls';
import { IPaginatorBackend } from '@components/paginator-backend';
import { SUCCESS_RESPONSE } from '@constants/StatusCodes';
import { PER_PAGE_RANGE } from '@constants/UtilsConstants';
import { IFormatContactData } from '@models/ContactUs';
import { INotificationHistory, INotificationParameterization, INotifications, IPrefixNumber } from '@models/Notification';
import { FetchRequest, ServiceType } from '@models/Request';
import { RootState } from '@redux/rootReducer';
import { getUserData } from '@utils/User';
import {
    ActionKeys,
    ISetAllNotifications,
    ISetDailyNotifications,
    ISetError,
    ISetNotifications,
    ISetNotificationsHistory,
    ISetNumberNotifications,
    ISetParameterization,
    ISetPrefixNumber,
    ISetStatusCode,
    NotificationActions,
} from './types';

export const getParameterizationSupportDocument = (): ThunkAction<Promise<void>, RootState, null, NotificationActions> => {
    return async (dispatch: ThunkDispatch<RootState, null, NotificationActions>): Promise<void> => {
        try {
            const request = new FetchRequest(urls.notification.setUpSupportingDocument, {
                supporting_document_notification: true,
                consecutive_invoice_authorized_supporting_document: 10,
                resolution_expiration_date_supporting_document: 20,
            });
            const { data }: any = await apiPostNotification(request);
            dispatch(setParameterization(data));
        } catch (error) {
            dispatch(setError(String(error)));
        }
    };
};

export const getParameterization = (): ThunkAction<Promise<void>, RootState, null, NotificationActions> => {
    return async (dispatch: ThunkDispatch<RootState, null, NotificationActions>): Promise<void> => {
        try {
            const request = new FetchRequest(urls.notification.set_up);
            const { data }: any = await apiGetNotification(request);
            dispatch(setParameterization(data));
        } catch (error) {
            dispatch(setError(String(error)));
        }
    };
};

export const getNotifications = (
    date: number,
    isDaily = false,
    urlDaily = urls.notification.daily_notification,
    validatePage = { isElectronic: false, isSupport: false }
): ThunkAction<Promise<void>, RootState, null, NotificationActions> => {
    return async (dispatch: ThunkDispatch<RootState, null, NotificationActions>): Promise<void> => {
        try {
            const dataRequest = validatePage.isSupport
                ? { date, types: [ServiceType.SUPPORT_DOCUMENT] }
                : validatePage.isElectronic
                ? { date, types: [ServiceType.ELECTRONIC_INVOICE] }
                : { date };
            const request = new FetchRequest(isDaily ? urlDaily : urls.notification.company, dataRequest);
            const { data }: any = await apiPostNotification(request);
            dispatch(isDaily ? setDailyNotifications(data) : setNotifications(data));
        } catch (error) {
            dispatch(setError(String(error)));
        }
    };
};

export const getNotificationsHistory = (
    date: number,
    isList = false,
    search = ''
): ThunkAction<Promise<void>, RootState, null, NotificationActions> => {
    return async (dispatch: ThunkDispatch<RootState, null, NotificationActions>): Promise<void> => {
        try {
            const request = new FetchRequest(
                `${urls.notification.history}${isList ? `?per_page=${PER_PAGE_RANGE}` : search ? `?search=${search}` : ''} `,
                { date }
            );
            const { data }: any = await apiPostNotification(request);
            dispatch(setNotificationsHistory(data));
        } catch (error) {
            dispatch(setError(String(error)));
        }
    };
};

export const getAllNotifications = (): ThunkAction<Promise<void>, RootState, null, NotificationActions> => {
    return async (dispatch: ThunkDispatch<RootState, null, NotificationActions>): Promise<void> => {
        try {
            const request = new FetchRequest(urls.notification.latest);
            const { data }: any = await apiGetNotification(request);
            dispatch(setAllNotifications(data));
        } catch (error) {
            dispatch(setError(String(error)));
        }
    };
};

export const getNumberNotifications = (): ThunkAction<Promise<void>, RootState, null, NotificationActions> => {
    return async (dispatch: ThunkDispatch<RootState, null, NotificationActions>): Promise<void> => {
        try {
            const request = new FetchRequest(urls.notification.unread);
            const { data }: any = await apiGetNotification(request);
            if (data?.unread_notifications !== undefined) dispatch(setNumberNotifications(data.unread_notifications));
        } catch (error) {
            dispatch(setError(String(error)));
        }
    };
};

export const getPrefixNumber = (): ThunkAction<Promise<void>, RootState, unknown, NotificationActions> => {
    return async (dispatch: ThunkDispatch<RootState, unknown, NotificationActions>): Promise<void> => {
        try {
            const request = new FetchRequest(urls.notification.prefix_number);
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const { data, statusCode }: any = await apiGetNotification(request);
            if (SUCCESS_RESPONSE.includes(statusCode)) {
                dispatch(setPrefixNumber(data));
            }
        } catch (error) {
            dispatch(setError(String(error)));
        }
    };
};

export const updateNotifications = (
    notifications: string[]
): ThunkAction<Promise<void>, RootState, null, NotificationActions> => {
    return async (dispatch: ThunkDispatch<RootState, null, NotificationActions>): Promise<void> => {
        try {
            const request = new FetchRequest(urls.notification.updateNotifications, notifications);
            await apiPostNotification(request);
            await dispatch(getAllNotifications());
            await dispatch(getNumberNotifications());
        } catch (error) {
            dispatch(setError(String(error)));
        }
    };
};

export const postParameterization = (
    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
    parameterization: any,
    url: string
): ThunkAction<Promise<void>, RootState, null, NotificationActions> => {
    return async (dispatch: ThunkDispatch<RootState, null, NotificationActions>): Promise<void> => {
        try {
            const { company_id } = getUserData();
            const request = new FetchRequest(url, {
                ...parameterization,
                company_id,
            });
            const { statusCode, data }: any = await apiPostNotification(request);
            dispatch(setStatusCode(statusCode));
            dispatch(setParameterization(data));
        } catch (error) {
            dispatch(setError(String(error)));
        }
    };
};

export const sendContactMessage = (
    data: IFormatContactData,
    action: () => void
): ThunkAction<Promise<void>, RootState, null, NotificationActions> => {
    return async (dispatch: ThunkDispatch<RootState, null, NotificationActions>): Promise<void> => {
        try {
            const request = new FetchRequest(urls.notification.contact_landing, data);
            await sendMessage(request);
            action();
        } catch (error) {
            dispatch(setError(String(error)));
        }
    };
};

export const setPrefixNumber = (prefix: IPrefixNumber[]): ISetPrefixNumber => ({
    type: ActionKeys.SET_PREFIX_NUMBER,
    prefix,
});

export const setParameterization = (data: INotificationParameterization): ISetParameterization => ({
    type: ActionKeys.SET_PARAMETERIZATION,
    data,
});

export const setAllNotifications = (allNotifications: INotifications[]): ISetAllNotifications => ({
    type: ActionKeys.SET_ALL_NOTIFICATIONS,
    allNotifications,
});

export const setNotifications = (data: INotifications[]): ISetNotifications => ({
    type: ActionKeys.SET_NOTIFICATIONS,
    data,
});

export const setDailyNotifications = (dailyNotifications: INotifications[]): ISetDailyNotifications => ({
    type: ActionKeys.SET_DAILY_NOTIFICATIONS,
    dailyNotifications,
});

export const setStatusCode = (status: number): ISetStatusCode => ({
    type: ActionKeys.SET_STATUS_CODE,
    status,
});

export const setNotificationsHistory = (notificationsHistory: IPaginatorBackend<INotificationHistory>): ISetNotificationsHistory => ({
    type: ActionKeys.SET_NOTIFICATIONS_HISTORY,
    notificationsHistory,
});

export const setNumberNotifications = (numberNotifications: number): ISetNumberNotifications => ({
    type: ActionKeys.SET_NUMBER_NOTIFICATIONS,
    numberNotifications,
});

export const setError = (error: string): ISetError => ({
    type: ActionKeys.SET_ERROR,
    error,
});
