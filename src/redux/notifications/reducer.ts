import { INotificationHistory, INotificationParameterization, INotifications, IPrefixNumber } from '@models/Notification';
import { IPaginatorBackend } from '@components/paginator-backend/index';
import { paginationDataFormatDynamic } from '@constants/PaginationBack';
import { ActionKeys, NotificationActions } from './types';
const { SET_PARAMETERIZATION, SET_ALL_NOTIFICATIONS, SET_NOTIFICATIONS, SET_DAILY_NOTIFICATIONS, SET_NOTIFICATIONS_HISTORY, SET_STATUS_CODE, SET_ERROR, SET_NUMBER_NOTIFICATIONS, SET_PREFIX_NUMBER } = ActionKeys;

interface INotificationState {
    error: string;
    parameterization?: INotificationParameterization;
    allNotifications: INotifications[];
    notifications?: INotifications[];
    dailyNotifications: INotifications[];
    notificationsHistory: IPaginatorBackend<INotificationHistory>;
    numberNotifications: number;
    prefix: IPrefixNumber[];
    status: number;
}

const initialState = {
    error: '',
    allNotifications: [],
    dailyNotifications: [],
    notificationsHistory: paginationDataFormatDynamic<INotificationHistory>(),
    prefix: [],
    numberNotifications: 0,
    status: 0,
};

export const reducer = (state: INotificationState = initialState, action: NotificationActions): INotificationState => {
    switch (action.type) {
        case SET_PARAMETERIZATION:
            return {
                ...state,
                parameterization: action.data,
            };
        case SET_ALL_NOTIFICATIONS:
            return {
                ...state,
                allNotifications: action.allNotifications,
            };
        case SET_NOTIFICATIONS:
            return {
                ...state,
                notifications: action.data,
            };
        case SET_DAILY_NOTIFICATIONS:
            return {
                ...state,
                dailyNotifications: action.dailyNotifications,
            };
        case SET_STATUS_CODE:
            return {
                ...state,
                status: action.status,
            };
        case SET_NOTIFICATIONS_HISTORY:
            return {
                ...state,
                notificationsHistory: action.notificationsHistory,
            }
        case SET_NUMBER_NOTIFICATIONS:
            return {
                ...state,
                numberNotifications: action.numberNotifications,
            }
        case SET_PREFIX_NUMBER:
            return {
                ...state,
                prefix: action.prefix,
            }
        case SET_ERROR:
            return {
                ...state,
                error: action.error,
            };
        default:
            return state;
    }
};
