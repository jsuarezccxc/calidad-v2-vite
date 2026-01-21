/* eslint-disable @typescript-eslint/no-explicit-any */
import { ThunkAction, ThunkDispatch } from 'redux-thunk';
import { apiGetBinnacle, apiPostBinnacle, apiPutBinnacle, apiDeleteBinnacle } from '@api/binnacle';
import { apiGetSchedules, apiPostAppointment } from '@api/calendar';
import { urls } from '@api/urls';
import { FetchRequest } from '@models/Request';
import { IData } from '@models/ScheduleDemo';
import { RootState } from '@redux/rootReducer';
import { IGenericRecord } from '@models/GenericRecord';
import { getUserData } from '@utils/User';
import { isCorrectResponse } from '@utils/Response';
import {
    ActionKeys,
    ISetEvents,
    CalendarActions,
    ISetLocations,
    ISetAppointments,
    ISetWorkHour,
    ISetJourneys,
    ISetDailySchedules,
    ISetLoading,
} from './types';

export const setEvents = (events: IGenericRecord[]): ISetEvents => ({
    type: ActionKeys.SET_EVENTS,
    payload: events,
});

export const setLocations = (locations: IGenericRecord[]): ISetLocations => ({
    type: ActionKeys.SET_LOCATIONS,
    payload: locations,
});

export const setAppointment = (appointments: IGenericRecord[]): ISetAppointments => ({
    type: ActionKeys.SET_APPOINTMENTS,
    payload: appointments,
});

export const setWorkHours = (workHours: IGenericRecord[]): ISetWorkHour => ({
    type: ActionKeys.SET_WORK_HOURS,
    payload: workHours,
});

export const setJourneys = (journeys: IGenericRecord[]): ISetJourneys => ({
    type: ActionKeys.SET_JOURNEYS,
    payload: journeys,
});

export const setDailySchedules = (schedules: string[]): ISetDailySchedules => ({
    type: ActionKeys.SET_DAILY_SCHEDULES,
    payload: schedules,
});

export const setLoading = (loading: boolean): ISetLoading => ({
    type: ActionKeys.SET_LOADING,
    payload: loading,
});

export const getEvents = (): ThunkAction<Promise<void>, RootState, null, CalendarActions> => {
    return async (dispatch: ThunkDispatch<RootState, null, CalendarActions>): Promise<void> => {
        try {
            const { company_id } = getUserData();
            const getEventsFromCalendarUrl = urls.calendar.getEvents(company_id);
            const request = new FetchRequest(getEventsFromCalendarUrl);
            const { data }: any = await apiGetBinnacle(request);
            dispatch(setEvents(data));
        } catch (error) {
            dispatch(setEvents([]));
        }
    };
};

export const postEvent = (event: IGenericRecord): ThunkAction<Promise<boolean>, RootState, null, CalendarActions> => {
    return async (dispatch: ThunkDispatch<RootState, null, CalendarActions>): Promise<boolean> => {
        const eventsUrl = urls.calendar.events;
        const apiCallMethod = event.id ? apiPutBinnacle : apiPostBinnacle;
        const request = new FetchRequest(eventsUrl, event);
        const { data, statusCode }: any = await apiCallMethod(request);
        if (data) await dispatch(getEvents());
        return isCorrectResponse(statusCode);
    };
};

export const deleteEvent = (eventId: string): ThunkAction<Promise<void>, RootState, null, CalendarActions> => {
    return async (dispatch: ThunkDispatch<RootState, null, CalendarActions>): Promise<void> => {
        const deleteEventFromCalendarUrl = urls.calendar.deleteEvent(eventId);
        const request = new FetchRequest(deleteEventFromCalendarUrl);
        const { data }: any = await apiDeleteBinnacle(request);
        if (data) await dispatch(getEvents());
    };
};

/**
 * Method to get locations data
 *
 * @returns Promise<void>
 *  */
export const getLocations = (): ThunkAction<Promise<void>, RootState, null, CalendarActions> => {
    return async (dispatch: ThunkDispatch<RootState, null, CalendarActions>): Promise<void> => {
        try {
            const locationsUrl = urls.calendar.locations;
            const request = new FetchRequest(locationsUrl);
            const { data }: any = await apiGetBinnacle(request);
            dispatch(setLocations(data));
        } catch (error) {
            dispatch(setLocations([]));
        }
    };
};

/**
 * Method to send locations data
 *
 * @param devices: IGenericRecord - device list
 * @returns Promise<void>
 *  */
export const postCompanyLocationsAction = (
    devices: IGenericRecord[]
): ThunkAction<Promise<void>, RootState, null, CalendarActions> => {
    return async (dispatch: ThunkDispatch<RootState, null, CalendarActions>): Promise<void> => {
        const locationsUrl = urls.calendar.locations;
        const request = new FetchRequest(locationsUrl, devices);
        const { statusCode, data }: any = await apiPostBinnacle(request);
        dispatch(setLocations(data));
        return statusCode;
    };
};

/**
 * Method to delete locations data
 *
 * @param devices: IGenericRecord[] - device list
 *  */
export const deleteLocationAction = (
    devices: IGenericRecord[]
): ThunkAction<Promise<void>, RootState, unknown, CalendarActions> => {
    return async (dispatch: ThunkDispatch<RootState, any, CalendarActions>): Promise<void> => {
        const locationsUrl = urls.calendar.locations;
        const request = new FetchRequest(locationsUrl, devices);
        const { statusCode, data }: any = await apiDeleteBinnacle(request);
        dispatch(setLocations(data));
        return statusCode;
    };
};

/**
 * Method to send locations data
 *
 * @param devices: IGenericRecord - device list
 * @returns Promise<void>
 *  */
export const postCompanyAppointmentAction = (
    appointments: IGenericRecord[]
): ThunkAction<Promise<void>, RootState, null, CalendarActions> => {
    return async (dispatch: ThunkDispatch<RootState, null, CalendarActions>): Promise<void> => {
        const appointmentUrl = urls.calendar.appointment;
        const request = new FetchRequest(appointmentUrl, appointments);
        const { statusCode, data }: any = await apiPostBinnacle(request);
        dispatch(setLocations(data));
        return statusCode;
    };
};

/**
 * Method to delete locations data
 *
 * @param devices: IGenericRecord[] - device list
 *  */
export const deleteAppointmentAction = (
    appointments: IGenericRecord[]
): ThunkAction<Promise<void>, RootState, unknown, CalendarActions> => {
    return async (dispatch: ThunkDispatch<RootState, any, CalendarActions>): Promise<void> => {
        const appointmentUrl = urls.calendar.appointment;
        const request = new FetchRequest(appointmentUrl, appointments);
        const { statusCode, data }: any = await apiDeleteBinnacle(request);
        dispatch(setAppointment(data));
        return statusCode;
    };
};

/**
 * Method to get locations data
 *
 * @returns Promise<void>
 *  */
export const getAppointment = (): ThunkAction<Promise<void>, RootState, null, CalendarActions> => {
    return async (dispatch: ThunkDispatch<RootState, null, CalendarActions>): Promise<void> => {
        try {
            const baseAppoinmentsUrl = urls.calendar.appointment;
            const request = new FetchRequest(baseAppoinmentsUrl);
            const { data }: any = await apiGetBinnacle(request);
            dispatch(setAppointment(data));
        } catch (error) {
            dispatch(setAppointment([]));
        }
    };
};

/**
 * Method to send locations data
 *
 * @param devices: IGenericRecord - device list
 * @returns Promise<void>
 *  */
export const postCompanyWorkHourAction = (
    hours: IGenericRecord
): ThunkAction<Promise<void>, RootState, null, CalendarActions> => {
    return async (dispatch: ThunkDispatch<RootState, null, CalendarActions>): Promise<void> => {
        const workHoursUrl = urls.calendar.workHours;
        const request = new FetchRequest(workHoursUrl, hours);
        const { statusCode, data }: any = await apiPostBinnacle(request);
        dispatch(setWorkHours(data));
        return statusCode;
    };
};

/**
 * Method to get locations data
 *
 * @returns Promise<void>
 *  */
export const getCompanyWorkHourAction = (): ThunkAction<Promise<void>, RootState, null, CalendarActions> => {
    return async (dispatch: ThunkDispatch<RootState, null, CalendarActions>): Promise<void> => {
        try {
            const workHoursUrl = urls.calendar.workHours;
            const request = new FetchRequest(workHoursUrl);
            const { data }: any = await apiGetBinnacle(request);
            dispatch(setWorkHours(data));
        } catch (error) {
            dispatch(setWorkHours([]));
        }
    };
};

/**
 * Method to delete locations data
 *
 * @param devices: IGenericRecord[] - device list
 *  */
export const deleteCompanyWorkHourAction = (hour: string): ThunkAction<Promise<void>, RootState, unknown, CalendarActions> => {
    return async (dispatch: ThunkDispatch<RootState, any, CalendarActions>): Promise<void> => {
        const workHoursUrl = urls.calendar.workHours;
        const bodyRequest = [hour];
        const request = new FetchRequest(workHoursUrl, bodyRequest);
        const { statusCode, data }: any = await apiDeleteBinnacle(request);
        dispatch(setWorkHours(data));
        return statusCode;
    };
};

/**
 * Method to send journey data
 *
 * @param journeys: IGenericRecord[] - journey list
 * @returns Promise<void>
 *  */
export const postCompanyJourneyAction = (
    journeys: IGenericRecord[]
): ThunkAction<Promise<void>, RootState, null, CalendarActions> => {
    return async (dispatch: ThunkDispatch<RootState, null, CalendarActions>): Promise<void> => {
        const journeysUrl = urls.calendar.journeys;
        const request = new FetchRequest(journeysUrl, journeys);
        const { statusCode, data }: any = await apiPostBinnacle(request);
        dispatch(setJourneys(data));
        return statusCode;
    };
};

/**
 * Method to get locations data
 *
 * @returns Promise<void>
 *  */
export const getCompanyJourneyAction = (): ThunkAction<Promise<void>, RootState, null, CalendarActions> => {
    return async (dispatch: ThunkDispatch<RootState, null, CalendarActions>): Promise<void> => {
        try {
            const journeysUrl = urls.calendar.journeys;
            const request = new FetchRequest(journeysUrl);
            const { data }: any = await apiGetBinnacle(request);
            dispatch(setJourneys(data));
        } catch (error) {
            dispatch(setJourneys([]));
        }
    };
};

/**
 * Method to delete locations data
 *
 * @param devices: IGenericRecord[] - device list
 *  */
export const deleteCompanyJourneyAction = (
    journeys: string[]
): ThunkAction<Promise<void>, RootState, unknown, CalendarActions> => {
    return async (dispatch: ThunkDispatch<RootState, any, CalendarActions>): Promise<void> => {
        const journeysUrl = urls.calendar.journeys;
        const request = new FetchRequest(journeysUrl, journeys);
        const { statusCode, data }: any = await apiDeleteBinnacle(request);
        dispatch(setAppointment(data));
        return statusCode;
    };
};

/**
 * Method to send locations data
 *
 * @param devices: IGenericRecord - device list
 * @returns Promise<void>
 *  */
export const postSendEmailCalendarAction = (
    event: IGenericRecord
): ThunkAction<Promise<boolean>, RootState, null, CalendarActions> => {
    return async (dispatch: ThunkDispatch<RootState, null, CalendarActions>): Promise<boolean> => {
        const emailUrl = urls.calendar.email;
        const bodyRequest = event?.jsEvent;
        const request = new FetchRequest(emailUrl, bodyRequest);
        const { statusCode }: any = await apiPostBinnacle(request);
        if (isCorrectResponse(Number(statusCode))) {
            dispatch(postEvent(event));
        }
        return statusCode;
    };
};

/**
 * This returns the daily schedules
 *
 * @param date: string - Date on which the schedules will be obtained
 * @returns Promise<void>
 */
export const getDailySchedules = (date: string): ThunkAction<Promise<void>, RootState, null, CalendarActions> => {
    return async (dispatch: ThunkDispatch<RootState, null, CalendarActions>): Promise<void> => {
        try {
            const { data }: any = await apiGetSchedules(new FetchRequest(urls.calendar.getDailySchedules(date)));
            if (data) dispatch(setDailySchedules(data));
        } catch (error) {
            dispatch(setDailySchedules([]));
        }
    };
};

/**
 * This method creates an appointment
 *
 * @param data: IData - Contact data
 * @returns Promise<void>
 */
export const createAppointment = (data: IData): ThunkAction<Promise<boolean>, RootState, null, CalendarActions> => {
    return async (): Promise<boolean> => {
        try {
            const request = new FetchRequest(urls.calendar.createAppointment, data);
            const { statusCode }: any = await apiPostAppointment(request);
            return isCorrectResponse(statusCode);
        } catch (error) {
            return false;
        }
    };
};
