import { IGenericRecord } from '@models/GenericRecord';
export enum ActionKeys {
    SET_EVENTS = 'SET_EVENTS',
    SET_LOCATIONS = 'SET_LOCATIONS',
    SET_APPOINTMENTS = 'SET_APPOINTMENTS',
    SET_WORK_HOURS = 'SET_WORK_HOURS',
    SET_JOURNEYS = 'SET_JOURNEYS',
    SET_ERROR = 'SET_ERROR',
    SET_DAILY_SCHEDULES = 'SET_DAILY_SCHEDULES',
    SET_LOADING = 'SET_LOADING',
}

export interface ISetEvents {
    type: ActionKeys.SET_EVENTS;
    payload: IGenericRecord[];
}

export interface ISetLocations {
    type: ActionKeys.SET_LOCATIONS;
    payload: IGenericRecord[];
}
export interface ISetAppointments {
    type: ActionKeys.SET_APPOINTMENTS;
    payload: IGenericRecord[];
}

export interface ISetWorkHour {
    type: ActionKeys.SET_WORK_HOURS;
    payload: IGenericRecord[];
}

export interface ISetJourneys {
    type: ActionKeys.SET_JOURNEYS;
    payload: IGenericRecord[];
}

export interface ISetDailySchedules {
    type: ActionKeys.SET_DAILY_SCHEDULES;
    payload: string[];
}

export interface ISetLoading {
    type: ActionKeys.SET_LOADING;
    payload: boolean;
}

export type CalendarActions = ISetEvents | ISetLocations | ISetAppointments | ISetWorkHour | ISetJourneys | ISetDailySchedules | ISetLoading;
