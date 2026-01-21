import { FormEvent } from 'react';
import { IData } from '@models/ScheduleDemo';

export { ContactForm } from './ContactForm';
export { Hours } from './Hours';
export { Scheduling } from './Scheduling';
export { ScheduleSteps } from './ScheduleSteps';


/**
 * This interface describes the props of the contact form
 *
 * @typeParam data: IData - Calendar data
 * @typeParam toggleScheduling: () => void - Function to toggle scheduling
 * @typeParam updateData: (data: IData) => void - This is used to update the data
 * @typeParam toggleCalendar: () => void - Function to toggle calendar
 */
export interface IContactFormProps {
    data: IData;
    toggleScheduling: (state: boolean) => void;
    updateData: (data: IData) => void;
    toggleCalendar: () => void;
}

/**
 * This interface describes the props of the scheduling
 *
 * @typeParam data: IData - Calendar data
 * @typeParam updateData: (data: IData) => void - This is used to update the data
 * @typeParam toggleCalendar: () => void - Function to toggle calendar
 * @typeParam goBack: () => void - Back function
 */
export interface ISchedulingProps {
    data: IData;
    updateData: (data: IData) => void;
    toggleCalendar: () => void;
    goBack: () => void;
}

/**
 * This interface describes the props of the hours
 *
 * @typeParam data: IData - Calendar data
 * @typeParam updateData: (data: IData) => void - This is used to update the data
 * @typeParam scheduleDemo: (e: FormEvent) => void - Function to schedule demo
 * @typeParam validate: boolean - This indicates whether fields need to be validated
 * @typeParam goBack: () => void - Back function
 */
export interface IHoursProps {
    data: IData;
    updateData: (data: IData) => void;
    scheduleDemo: (e: FormEvent) => void;
    validate: boolean;
    goBack: () => void;
}

/**
 * This interface describes option select property
 *
 * @typeParam id: string - Optional option id
 * @typeParam key: string - Option key
 * @typeParam value: string - Option value
 * @typeParam name: string - Optional option name
 */
export interface IOption {
    id?: string;
    key: string;
    value: string;
    name?: string;
}

/**
 * Initial data for the contact form
 */
export const CONTACT_DATA = {
    name: '',
    email: '',
    phone: '',
    phone_prefix: '+57',
    company_name: '',
    data_processing: false,
    hour: '',
    date: '',
};

/**
 * Maximum length of the contact phone
 */
export const MAXIMUM_PHONE_LENGTH = 13;

/**
 * Static props of the calendar
 */
export const CALENDAR_PROPS = {
    initialView: 'dayGridMonth',
    headerToolbar: {
        left: 'prev,next',
        center: 'title',
        right: '',
    },
    locale: 'es',
    longPressDelay: 0.1,
    eventLongPressDelay: 0.1,
    selectLongPressDelay: 0.1,
    selectable: true,
    allDaySlot: true,
    buttonText: {
        today: 'Fecha',
        month: 'Mes',
        week: 'Semana',
        day: 'Día',
        list: 'Lista',
    },
    views: {
        dayGridMonth: {
            buttonText: 'Mes',
            eventDisplay: 'list-item',
        },
        timeGridWeek: {
            buttonText: 'Semana',
        },
        timeGridDay: {
            buttonText: 'Día',
        },
        listYear: {
            buttonText: 'Año',
            listYearFormat: 'YYYY',
        },
    },
    fixedWeekCount: false,
    showNonCurrentDates: false,
};

/**
 * Disabled days of December
 */
const DECEMBER_DAYS_DISABLED = [
    '2024-12-20',
    '2024-12-23',
    '2024-12-24',
    '2024-12-25',
    '2024-12-26',
    '2024-12-27',
    '2024-12-30',
    '2024-12-31',
];

/**
 * Holidays of the year 2025
 */
const HOLIDAYS = [
    '2025-01-01',
    '2025-01-06',
    '2025-03-24',
    '2025-04-17',
    '2025-04-18',
    '2025-05-01',
    '2025-06-02',
    '2025-06-23',
    '2025-06-30',
    '2025-06-30',
    '2025-07-20',
    '2025-08-07',
    '2025-08-18',
    '2025-10-13',
    '2025-11-03',
    '2025-11-17',
    '2025-12-08',
    '2025-12-25',
];

/**
 * List of disabled days
 */
export const DAYS_DISABLED = [...DECEMBER_DAYS_DISABLED, ...HOLIDAYS];

/**
 * Indexes used to disable weekends in the calendar
 */
export const WEEKEND_INDICES = [0, 6];

/**
 * Value used to compare the current month with December
 */
export const DECEMBER_INDICATOR = '12';

/**
 * Maximum value of single digit numbers
 */
export const ONE_DIGIT_LIMIT = 9;

/**
 * Text used to validate the name field
 */
export const NAME = 'name';

/**
* Max length of inputs text
*/
export const MAX_LENGTH_CONTACT_FORM = 100;

/**
* Max length of inputs number phone
*/
export const MAX_LENGTH_CONTACT_NUMBER = 10;

/**
* Max length of inputs number phone
*/
export const DATE_FORMAT_SCHEDULING = 'YYYY-MM-DD';

/**
* Max length of inputs number phone
*/
export const MAX_MONTHS_CALENDAR = 1;