import { Dispatch, SetStateAction } from 'react';
import dayjs from '@utils/Dayjs';
import { IGenericRecord } from '@models/GenericRecord';
import { AM, PM } from '@constants/Calendar';
import { TWELVE_MONTHS as TWELVE } from '@constants/PaymentPlans';
import { ZERO_DAYS as ZERO } from '@constants/Memberships';
import { getHourValue } from './Date';

/**
 * TimePicker hour initial state
 */
export const INITIAL_HOUR = {
    hour: 0,
    minutes: 0,
    schedule: 'am',
};

/**
 * This interface describes the properties of the time object
 *
 * @typeParam hour: number - Time hour
 * @typeParam minutes: number - Time minutes
 * @typeParam seconds?: number - Optional time seconds
 * @typeParam schedule: string - Time schedule
 */
export interface ITime {
    hour: number;
    minutes: number;
    seconds?: number;
    schedule: string;
}

/**
 * @typeParam SetTime - Action that change the current time
 */
export type SetTime = React.Dispatch<SetStateAction<ITime>>;

/**
 * @typeParam SetTimePicker - Action that change the current TimePicker
 */
export type SetTimePicker = React.Dispatch<SetStateAction<boolean>>;

/**
 * This interface describes the properties for the get time
 *
 * @typeParam time: ITime - Time of the TimePicker
 * @typeParam setTime: SetTime - Action for change time of the TimePicker
 */
export interface IGetTime {
    time: ITime;
    setTime: SetTime;
}

/**
 * Function that return the time of the TimePickers
 *
 * @param storeTime: ITime - Store TimePicker
 * @param setStoreTime: SetTime - Function that change the time of the store TimePicker
 * @returns IGetTime
 */
export const getTime = (storeTime: ITime, setStoreTime: SetTime): IGetTime => ({
    time: storeTime,
    setTime: setStoreTime,
});

export const initTimeByTimePicker = (showSeconds = false): ITime => {
    const now = dayjs();
    const hour = Number(now.format('hh'));
    const minutes = Number(now.format('mm'));
    const seconds = Number(now.format('ss'));
    const schedule = now.format('a');
    return {
        hour,
        schedule,
        ...(showSeconds ? { seconds } : {}),
        minutes,
    };
};

/**
 * Function close timepicker
 *
 * @param setTimePicker: SetStateAction<boolean> - Dispatch state
 * @param eventClass: string - Optional param to search class style
 * @returns void
 */
export const closeTimePicker = (setTimePicker: Dispatch<SetStateAction<boolean>>, eventClass = ''): void => {
    const { body } = document;
    body.addEventListener('click', (e: IGenericRecord) => {
        setTimePicker(e.target.classList.contains(eventClass || 'timepicker-handler'));
    });
};

/**
 * Function convert 24 hour to convert Time Format 12
 *
 * @param hour24: string - hour time format 24
 * @returns void
 */
export const convertTimeFormat12 = (hour24: string): string => {
    const [hour, minutes] = hour24.split(':');
    const date = new Date();
    date.setHours(Number(hour));
    date.setMinutes(Number(minutes));
    const hour12 = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });
    return hour12;
};

/**
 * Function convert 24 hour to convert Time Format 12 in interface ITime
 *
 * @param hour24: string - hour time format 24
 * @returns void
 */
export const convertTime = (time24: string): IGenericRecord => {
    const [hours, minutes] = time24.split(':');
    const amPm = Number(hours) >= TWELVE ? PM : AM;

    let hours12 = Number(hours) % TWELVE;
    if (hours12 === ZERO) {
        hours12 = TWELVE;
    }
    return {
        hours12: String(hours12).padStart(2, '0'),
        minutes: minutes.padStart(2, '0'),
        amPm,
    };
};

/**
 * Function convert 12 hour to convert Time Format 24
 *
 * @param time12Hour: string - hour time format 12
 * @returns void
 */
export const convertTo24HourFormat = (time12Hour: string): string => {
    const timeParts = time12Hour.split(':');
    let hour = parseInt(timeParts[0]);
    const minutes = parseInt(timeParts[1]);

    if (time12Hour.includes(PM.toUpperCase()) || time12Hour.includes(PM)) {
        if (hour !== TWELVE) {
            hour += TWELVE;
        }
    } else if (hour === TWELVE && (time12Hour.includes(AM.toUpperCase()) || time12Hour.includes(AM))) {
        hour = ZERO;
    }

    const hour24 = hour.toString().padStart(2, '0');
    const minutes24 = minutes.toString().padStart(2, '0');

    return `${hour24}:${minutes24}`;
};

/**
 * Function convert 12 hour to convert Time Format 24
 *
 * @param time12Hour: string - hour time format 12
 * @returns void
 */
export const addAnHour = (initialTime: string): string => {
    const timeParts = initialTime.split(':');
    const hour = timeParts[0];
    const minutes = timeParts[1];

    const newHour = (parseInt(hour) + 1) % 24;

    const newHourFormatted = newHour.toString().padStart(2, '0');
    const minutesFormatted = parseInt(minutes).toString().padStart(2, '0');

    // Create the resulting time
    return `${newHourFormatted}:${minutesFormatted}`;
};

/**
 * This formats the time
 *
 * @param time: ITime - Selected time
 * @returns string
 */
export const formatTime = (time: ITime = initTimeByTimePicker()): string => {
    return `${getHourValue(time.hour || 0)}:${getHourValue(time.minutes || 0)}:${getHourValue(time.seconds || 0)}`;
};

/**
 * This function string to time
 *
 * @param value: Optional parameter that expects the military time format
 * @returns ITime
 */
export const stringToTime = (value = ''): ITime => {
    if (value) {
        const time = dayjs(value, 'HH:mm:ss');
        return {
            hour: Number(time.format('h')),
            minutes: time.minute(),
            seconds: time.second(),
            schedule: time.format('a'),
        };
    }
    return initTimeByTimePicker();
};
