import { ActionKeys, CalendarActions } from './types';
import { IGenericRecord } from '@models/GenericRecord';

const { SET_EVENTS, SET_LOCATIONS, SET_APPOINTMENTS, SET_WORK_HOURS, SET_JOURNEYS, SET_DAILY_SCHEDULES, SET_LOADING } = ActionKeys;

interface ICalendar {
    events: IGenericRecord[];
    locations: IGenericRecord[];
    appointments: IGenericRecord[];
    workHours: IGenericRecord[];
    journeysReducer: IGenericRecord[];
    dailySchedules: string[];
    loading: boolean;
}

const initialState = {
    events: [],
    locations: [],
    appointments: [],
    workHours: [],
    journeysReducer: [],
    dailySchedules: [],
    loading: false,
};

export const reducer = (state: ICalendar = initialState, action: CalendarActions): ICalendar => {
    switch (action.type) {
        case SET_LOCATIONS:
            return {
                ...state,
                locations: action.payload,
            };
        case SET_APPOINTMENTS:
            return {
                ...state,
                appointments: action.payload,
            };
        case SET_WORK_HOURS:
            return {
                ...state,
                workHours: action.payload,
            };

        case SET_JOURNEYS:
            return {
                ...state,
                journeysReducer: action.payload,
            };
        case SET_EVENTS:
            return {
                ...state,
                events: action.payload,
            };
        case SET_DAILY_SCHEDULES:
            return {
                ...state,
                dailySchedules: action.payload,
            };
        case SET_LOADING:
            return {
                ...state,
                loading: action.payload,
            };
        default:
            return state;
    }
};
