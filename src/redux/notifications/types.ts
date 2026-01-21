import { IPaginatorBackend } from '@components/paginator-backend';
import { INotificationHistory, INotificationParameterization, INotifications, IPrefixNumber } from '@models/Notification';

export enum ActionKeys {
    SET_PARAMETERIZATION = 'SET_PARAMETERIZATION',
    SET_ALL_NOTIFICATIONS = 'SET_ALL_NOTIFICATIONS',
    SET_PREFIX_NUMBER = 'SET_PREFIX_NUMBER',
    SET_NOTIFICATIONS = 'SET_NOTIFICATIONS',
    SET_DAILY_NOTIFICATIONS = 'SET_DAILY_NOTIFICATIONS',
    SET_STATUS_CODE = 'SET_STATUS_CODE',
    SET_NOTIFICATIONS_HISTORY = 'SET_NOTIFICATIONS_HISTORY',
    SET_NUMBER_NOTIFICATIONS = 'SET_NUMBER_NOTIFICATIONS',
    SET_ERROR = 'SET_ERROR',
}

export interface ISetParameterization {
    type: ActionKeys.SET_PARAMETERIZATION;
    data: INotificationParameterization;
}

export interface ISetPrefixNumber {
    type: ActionKeys.SET_PREFIX_NUMBER;
    prefix: IPrefixNumber[];
}

export interface ISetAllNotifications {
    type: ActionKeys.SET_ALL_NOTIFICATIONS;
    allNotifications: INotifications[];
}

export interface ISetNotifications {
    type: ActionKeys.SET_NOTIFICATIONS;
    data: INotifications[];
}

export interface ISetDailyNotifications {
    type: ActionKeys.SET_DAILY_NOTIFICATIONS;
    dailyNotifications: INotifications[];
}

export interface ISetStatusCode {
    type: ActionKeys.SET_STATUS_CODE;
    status: number;
}

export interface ISetNotificationsHistory {
    type: ActionKeys.SET_NOTIFICATIONS_HISTORY;
    notificationsHistory: IPaginatorBackend<INotificationHistory>;
}

export interface ISetError {
    type: ActionKeys.SET_ERROR;
    error: string;
}

export interface ISetNumberNotifications {
    type: ActionKeys.SET_NUMBER_NOTIFICATIONS;
    numberNotifications: number;
}

export type NotificationActions = ISetParameterization | ISetAllNotifications | ISetNotifications | ISetDailyNotifications | ISetStatusCode | ISetNotificationsHistory | ISetNumberNotifications | ISetPrefixNumber | ISetError;
