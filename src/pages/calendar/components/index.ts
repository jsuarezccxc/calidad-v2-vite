import React from 'react';
import { IGenericRecord } from '@models/GenericRecord';
import { IEntity } from '@components/radiobutton';

export * from './EventForm';

/**
 * This interface describes the form event props
 *
 * @typeParam showModal: boolean - Indicates whether to show or hide
 * @typeParam toggleModal: () => void - Function to the toggle modal
 * @typeParam saveEvent: () => void - Function to save an event
 * @typeParam deleteEvent: () => void - Function to delete an event
 * @typeParam requiredFieldsValidate: IGenericRecord - Object with the selected validation
 * @typeParam setRequiredFieldsValidate: React.Dispatch<React.SetStateAction<IGenericRecord>> - Function to set required fields validation
 * @typeParam event: IGenericRecord - Object with the selected event
 * @typeParam setEvent: React.Dispatch<React.SetStateAction<IGenericRecord>> - Function to set a new event
 * @typeParam validate: boolean - Indicates the moment to validate the form
 * @typeParam events: IGenericRecord[] - Object with the selected events
 */
export interface IEventFormProps {
    showModal: boolean;
    toggleModal: () => void;
    saveEvent: () => void;
    deleteEvent: () => void;
    requiredFieldsValidate: IGenericRecord;
    setRequiredFieldsValidate: React.Dispatch<React.SetStateAction<IGenericRecord>>;
    event: IGenericRecord;
    setEvent: React.Dispatch<React.SetStateAction<IGenericRecord>>;
    validate: boolean;
    events: IGenericRecord[];
}

/**
 * The `export interface IHourRange` is defining an interface named `IHourRange`. It describes the
structure of an object that represents a range of hours for a specific day. 

 * @typeParam startHour: number - Starting time in 12 hour format
 * @typeParam endHour: number - Final time in 12 hour format
 * @typeParam interval: number - Time interval displayed
 * @typeParam day: string - weekday in Spanish
*/
export interface IHourRange {
    startHour: number;
    endHour: number;
    interval: number;
    day: string;
}

/** 
 * is defining an enumeration named `namesSelectInput`. It is used
 * to represent a set of named constants.
*/
export enum namesSelectInput {
    NAME_APPOINTMENT = 'name_appointment',
    LOCATION = 'location',
    DURATION = 'duration',
}

/** 
 * Enum representing types of events. The `export enum typeEvents` is defining an enumeration named `typeEvents`. It is used to represent
 * a set of named constants.
*/
export enum typeEvents {
    TASK = 'task',
    APPOINTMENT = 'appointment',
}

/* 
 * represents the initial data for a task event.
*/
export const INITIAL_DATA_TASK = {
    title: '',
    end: '',
    start: '',
    backgroundColor: '',
};

/**
 * Data in radio button options
 */
 export const dataRadioButton: IEntity[] = [
    {
        name: 'task',
        label: 'Tarea',
    },
    {
        name: 'appointment',
        label: 'Cita',
    },
];

/* Represents the initial data for
an appointment event. */
export const INITIAL_DATA_APPOINTMENT = {
    title: '',
    end: '',
    start: '',
    jsEvent: {
        address: '',
        date: '',
        duration_time: '',
        email: '',
        hour: '',
        lastname_customer: '',
        link: '',
        location: '',
        name_appointment: '',
        name_customer: '',
        observation_appointment: [''],
        scheduled: 'COMPANY',
        status_appointment: 'ACCEPTED',
        type_appointment: 'ON_SITE',
    },
};

/* This constant is likely used as a format string for
dates in the code.*/
export const formatDate = 'YYYY-MM-DD';

/* An array of strings. Each string
represents a day of the week in Spanish. */
export const dayNames = ['Domingo', 'Lunes', 'Martes', 'Miercoles', 'Jueves', 'Viernes', 'Sabado'];

/*This constant is likely used as a default color value in
the code. */
export const DEFAULT_COLOR = '#81319B';

/*This constant is likely used to represent the time period of "pm" (post meridiem) in the code. */
export const PM = 'pm';

/*This constant is likely used as a value for a property or parameter in the
code. */
export const ON_SITE = 'ON_SITE';

/*This constant can be used in other parts of the code to represent the number 60. */
export const SIXTY = 60;

/* 
This constant can be used in other parts of the code to represent the number 10. */
export const TEN = 10;

/**
 * The function `parseHour` takes an object `hour` with properties `schedule` and `hour`, and returns
 * the hour in 24-hour format.
 * @typeParam {IGenericRecord} hour - The parameter `hour` is of type `IGenericRecord`.
 */
export const parseHour = (hour: IGenericRecord): number =>
    hour.schedule === PM
        ? parseInt(hour.hour) === 12
            ? 12
            : parseInt(hour.hour) + 12
        : parseInt(hour.hour) === 12
        ? 0
        : parseInt(hour.hour);

/**
 * The function `compareHours` compares two time values and returns true if the difference between them
 * is greater than 3500000 milliseconds.
 * @typeParam {IGenericRecord} hour1 - hour1 is an object of type IGenericRecord, which likely has the
 * following properties:
 * @typeParam {IGenericRecord} hour2 - hour2 is an object of type IGenericRecord.
 * @typeParam return a boolean value.
 */
export const compareHours = (hour1: IGenericRecord, hour2: IGenericRecord): boolean => {
    const milisegundos1 = parseInt(hour1.minutes) * 60000 + parseHour(hour1) * 3600000;
    const milisegundos2 = parseInt(hour2.minutes) * 60000 + parseHour(hour2) * 3600000;
    return !(milisegundos2 - milisegundos1 <= 3500000);
};
