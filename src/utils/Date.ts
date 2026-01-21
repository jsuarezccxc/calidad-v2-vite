/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable-next-line @typescript-eslint/no-explicit-any */
import dayjs from './Dayjs';
import type { Dayjs } from 'dayjs';
import { IDates } from '@models/Date';
import { IGenericRecord } from '@models/GenericRecord';
import { AM, PM } from '@constants/Calendar';
import { VARIABLE_TYPE } from '@constants/DataTypes';
import { DAYS, MONTHS, DAY_SECONDS, businessDaysColombia, TWELVE, FORMAT_YYYY_MM_DD } from '@constants/Date';
import { ITime } from './TimePicker';

const fromUnix = (sec: number): Dayjs => dayjs(sec * 1000);
export const toUnix = (d: Dayjs | Date | string | number): number => Math.floor(dayjs(d).valueOf() / 1000);

/**
 * This interface describes obtained date after parsing
 * @typeParam date: string - Defines the date
 * @typeParam day: string - Defines the day
 * @typeParam month: string - Defines the month
 * @typeParam year: string - Defines the year
 * @typeParam dateFormat: string - Defines the date format variable
 * @typeParam format: string - Optional prop that defines format for date
 * @typeParam formattedDate: string - Formatted date
 * @typeParam formatYearMonthDay: string - Formatted date YYYY-MM-DD
 */
interface IGetDate {
    date: string;
    day: string;
    month: string;
    year: string;
    dateFormat: string;
    format?: string;
    formattedDate: string;
    formatYearMonthDay?: string;
}

/**
 * This interface describes obtained date after parsing
 * @typeParam day: number - Defines the day
 * @typeParam month: number - Defines the month
 * @typeParam year: number - Defines the year
 * @typeParam formattedDate: string - Formatted date
 * @typeParam dateWithDash: string - Defines a format date with dash
 * @typeParam hour: string - Optional hour
 */
interface IDateFormat {
    day: number;
    month: number;
    year: number;
    formattedDate?: string;
    dateWithDash?: string;
    hour?: string;
}

export const getDateFromUnix = (unix = 0, format = 'DD/MM/YYYY'): IGetDate => {
    const currentUnix = unix || currentDateInUnix();

    const date = fromUnix(currentUnix).local().format();
    const day = fromUnix(currentUnix).local().format('DD');
    const month = fromUnix(currentUnix).local().format('MM');
    const year = fromUnix(currentUnix).local().format('YYYY');
    const dateFormat = fromUnix(currentUnix).local().format(format);
    const formatYearMonthDay = `${year}-${month}-${day}`;
    const formattedDate = `${day}/${month}/${year}`;

    return { date, day, month, year, dateFormat, formattedDate, formatYearMonthDay };
};

export const getTimePicker = (dateFormat: Date, withSeconds = false): ITime => {
    const hour = dayjs(dateFormat).hour();
    const minutes = dateFormat.getUTCMinutes();
    const seconds = dayjs(dateFormat).second();
    const schedule = hour >= 12 ? 'pm' : 'am';

    return { hour: hour % 12, minutes, ...(withSeconds ? { seconds } : {}), schedule };
};

/**
 * This function convert military hour in value picker
 *
 * @param dateFormat: string - Time
 * @returns ITime
 */
export const getTimePickerString = (dateFormat: string): ITime => {
    const [hour, minutes] = dateFormat?.split(':');
    const isMilitaryHour = Number(hour) > TWELVE;
    return {
        hour: isMilitaryHour ? Number(hour) % TWELVE : Number(hour),
        minutes: Number(minutes),
        schedule: isMilitaryHour ? PM : AM,
    };
};

export const getDateFormat = (dateFormat: any, addMonth = false): IDateFormat => {
    const date = dateFormat instanceof Date ? dateFormat : new Date(String(dateFormat));

    const day = date.getDate();
    const month = date.getMonth();
    const year = date.getFullYear();

    return {
        day,
        month,
        year,
        dateWithDash: `${year}-${month + 1 < DIGIT_LIMIT ? `${ZERO}${month + 1}` : month + 1}-${
            day < DIGIT_LIMIT ? `${ZERO}${day}` : day
        }`,
        formattedDate: `${day}/${month + (addMonth ? 1 : 0)}/${year}`,
        hour: `${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`,
    };
};

export const getUnixFromDate = (date: string | Date = new Date()): number => {
    return Number(toUnix(date));
};

export const getDateTablePicker = (dateFormat: any): string => {
    const date = dateFormat instanceof Date ? dateFormat : new Date(String(dateFormat));
    return getDateFromUnix(getUnixFromDate(date)).dateFormat;
};

export const parseDateToUTC = (date: IDateFormat): string => {
    return new Date(Date.UTC(date.year, date.month, date.day, 0, 0, 0)).toUTCString();
};

export const parseDate = ({ start_date, finish_date }: IDates): IDates => {
    return {
        start_date: Number(getUnixFromDate(getDateFromUnix(start_date).date)),
        finish_date: Number(getUnixFromDate(getDateFromUnix(finish_date).date)),
    };
};

export const parseDateOfData = (data: IGenericRecord[], key = 'date'): IGenericRecord[] =>
    data.map(item => ({
        ...item,
        [key]: getDateFromUnix(item[key]).dateFormat,
    }));

/**
 * Function that return the max date of the input
 * @param name: string - Input name
 * @param finish_date: number - Input finish date in unix format
 * @returns Date
 */
export const getMaxDate = (name: string, finish_date: number): Date => {
    const { dateFormat } = getDateFromUnix(finish_date, 'MM-DD-YYYY');
    return name === 'start_date' ? new Date(dateFormat) : new Date();
};

export const getMinDate = (name: string, finish_date: number, range: number): Date => {
    const dateFormat = fromUnix(finish_date).subtract(range, 'year').utc().format('MM-DD-YYYY');
    return name === 'start_date' ? new Date(dateFormat) : new Date();
};

export const getDateFormatUnix = (date: string): IGetDate => {
    return getDateFromUnix(getUnix(new Date(date)));
};

export const getHourValue = (value: number): string => (String(value).length < 2 ? `0${value}` : String(value));

export const getDateOrText = (date?: number): string => {
    if (date) {
        const { dateFormat } = getDateFromUnix(date, 'DD/MM/YYYY - h:mm:ss');
        return dateFormat;
    }
    return 'dd/mm/aaaa - 00:00:00';
};

export const getUnix = (value: string | Date): number => {
    const date = value instanceof Date ? value : new Date(String(value));
    return toUnix(dayjs(date).local());
};

export const getUnixCalendar = (date: number, start: boolean): number => {
    if (start) {
        const startDate = fromUnix(date).add(5, 'hour').format('DD-MM-YYYY');
        return toUnix(dayjs(startDate, 'DD-MM-YYYY'));
    } else {
        const finishDate = fromUnix(date).add(5, 'hour').format('DD-MM-YYYY');
        return toUnix(dayjs(`${finishDate}, 23:59:00 pm`, 'DD-MM-YYYY, h:mm:ss a'));
    }
};

export const getDateNow = Date.now();

export const getCurrentDate = (): IDateFormat => {
    const date = new Date();
    return { day: date.getDate(), month: date.getMonth() + 1, year: date.getFullYear() };
};

export const getDateString = (date: Date): string => {
    const day = DAYS[date.getDay()];
    const month = MONTHS[date.getMonth()];
    return `${day} ${date.getDate()} DE ${month} ${date.getFullYear()}`.toUpperCase();
};

export const getDateWithoutHours = (date = 0): string => fromUnix(date).format('MM/DD/YYYY');

export const ExcelDateToJSDate = (serial: number): Date => {
    const utc_days = Math.floor(serial - 25569);
    const utc_value = utc_days * 86400;
    const date_info = new Date(utc_value * 1000);
    const fractional_day = serial - Math.floor(serial) + 0.0000001;
    let total_seconds = Math.floor(86400 * fractional_day);
    const seconds = total_seconds % 60;
    total_seconds -= seconds;
    const hours = Math.floor(total_seconds / (60 * 60));
    const minutes = Math.floor(total_seconds / 60) % 60;
    return new Date(date_info.getFullYear(), date_info.getMonth(), date_info.getDate(), hours, minutes, seconds);
};

/**
 * This function create date to string
 * @param dateString: string - Param date string
 * @returns Date
 */
export const getDateToString = (dateString: string): Date => dayjs(dateString).toDate();

export const getDateToUnix = (dateUnix: number): Date => fromUnix(dateUnix).toDate();

/**
 * This function create limited date
 * @param date: Date - Param init date
 * @param limited: number - Optinal param days limited
 * @returns Date
 */
export const limitedDay = (date: Date, limited = 10): Date => dayjs(date).subtract(limited, 'day').startOf('day').toDate();

/**
 * This function return the remainder of two days
 *
 * @param startDay: number - Start day
 * @param finishDay: number - Finish day
 * @returns number
 */
export const SubtractDays = (startDay: number, finishDay: number): number => Math.ceil((finishDay - startDay) / 86400000) + 1;

/**
 * This function return the current date in unix
 *
 * @returns number
 */
export const currentDateInUnix = (): number => toUnix(dayjs().startOf('day'));

/**
 * This function return number of days between two dates
 *
 * @param startDay: number - Start day
 * @param finishDay: number - Finish day
 * @returns string
 */
export const differenceDate = (startDay: number, finishDay: number): string => {
    const diffInDays = finishDay - startDay;

    return String(Math.ceil(diffInDays / DAY_SECONDS));
};

/**
 * This function return number of days between two dates
 *
 * @param startDay: number - Start day
 * @param finishDay: number - Finish day
 * @returns string
 */
export const differenceDateExpirationDate = (startDay: number, finishDay: number): number => {
    const diffTime = Math.abs(startDay - finishDay);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
};

/**
 * This function return number of days between two dates
 *
 * @param date: string - date for format
 * @returns string
 */
export const formatString = (date: string): string => {
    const dateFormat = dayjs(date, 'ddd MMM DD YYYY HH:mm:ss [GMT]ZZ').format('YYYY/MM/DD');
    return dateFormat;
};

/**
 * This function returns a date the days between two dates
 *
 * @param date: Date - Date init
 * @param dateLimit: Date - Date limit
 * @param type: unitOfTime.Diff - Optional param type different
 * @returns number
 */
export const getDaysFromTwoDates = (date: Date, dateLimit: Date, type: any = 'days'): number =>
    dayjs(dateLimit).diff(dayjs(date), type.replace(/s$/, '') as 'day' | 'month' | 'year' | 'hour' | 'minute' | 'second') + 1;

/**
 * This function returns a date for the future days
 *
 * @param date: number - Date unix
 * @param days: number - Days add
 * @returns number
 */
export const getDateFromDays = (date: number, days: number): number =>
    toUnix(dayjs(getDateFromUnix(date, 'YYYY-MM-DD').dateFormat, 'YYYY-MM-DD').add(days, 'day'));

/*
 * This function returns the current time of day
 *
 * @param format: string - Optional param format time
 * @returns string
 */
export const getTodaysTime = (format = 'HH:mm:ss'): string => dayjs().format(format);

/**
 * This function returns the time of a specific date
 *
 * @param hour: string - Hour param
 * @param date: string - Optional param date
 * @param format: string - Optional param format date
 * @returns string
 */
export const getTimeDate = (hour: string, date = 'Wed Aug 02 2023', format = 'LTS'): string =>
    dayjs(`${date} ${hour}`).format(format);

/**
 * Calculate the easter day of the year by Gaussian algorithm
 *
 * @param year: number - Year
 * @returns string
 */
export const getCalculateEaster = (year: number): string => {
    // Gregorian Calendar (any year after 1583)
    const a = year % 19;
    const b = Math.floor(year / 100);
    const c = year % 100;
    const d = Math.floor(b / 4);
    const e = b % 4;
    const f = Math.floor((b + 8) / 25);
    const g = Math.floor((b - f + 1) / 3);
    const h = (19 * a + b - d - g + 15) % 30;
    const i = Math.floor(c / 4);
    const k = c % 4;
    const l = (32 + 2 * e + 2 * i - h - k) % 7;
    const m = Math.floor((a + 11 * h + 22 * l) / 451);
    const p = h + l - 7 * m + 114;
    return dayjs(`${year}-${Math.floor(p / 31)}-${(p % 31) + 1}`).format('YYYY-MM-DD');
};

/**
 * Get fixed date of Colombia
 *
 * @param year: number - Year
 * @returns string[]
 */
export const getFixedDateColombia = (year: number): string[] => [
    dayjs(`${year}-1-1`).format('YYYY-MM-DD'), // New year
    dayjs(`${year}-5-1`).format('YYYY-MM-DD'), // Working day
    dayjs(`${year}-7-20`).format('YYYY-MM-DD'), // Independency day
    dayjs(`${year}-8-7`).format('YYYY-MM-DD'), // Battle of Boyaca
    dayjs(`${year}-12-8`).format('YYYY-MM-DD'), // Immaculate Conception
    dayjs(`${year}-12-25`).format('YYYY-MM-DD'), // Christmas
];

/**
 * Get easter weekend
 *
 * @param  year: number - Year
 * @return string[]
 */
export const getEasterWeekend = (year: number): string[] => {
    if (year > 1583 && year < 2499) {
        const easter = getCalculateEaster(year);
        return [
            dayjs(easter).subtract(3, 'day').format('YYYY-MM-DD'), // Holy Thursday
            dayjs(easter).subtract(2, 'day').format('YYYY-MM-DD'), // Holy Friday
            dayjs(easter).add(43, 'day').format('YYYY-MM-DD'), // Ascension of jesus
            dayjs(easter).add(64, 'day').format('YYYY-MM-DD'), // Corpus Christi
            dayjs(easter).add(71, 'day').format('YYYY-MM-DD'), // Sacred Heart of Jesus
        ];
    }
    return [];
};

/**
 * Set next monday
 *
 * @param day: number - Day
 * @param month: number - Month
 * @param year: number - Year
 * @returns string
 */
export const setAtMonday = (day: number, month: number, year: number): string => {
    const holiday = dayjs(`${year}-${month}-${day}`);
    if (holiday.day() !== 1) {
        return holiday.startOf('isoWeek').add(1, 'week').format('YYYY-MM-DD');
    }
    return holiday.format('YYYY-MM-DD');
};

/**
 * Get remaining holidays
 *
 * @param year: number - Year
 * @returns string[]
 */
export const getRemainingHolidays = (year: number): string[] => [
    setAtMonday(6, 1, year), // Three kings day
    setAtMonday(19, 3, year), // St. joseph's day
    setAtMonday(29, 6, year), // Saint peter's day
    setAtMonday(15, 8, year), // Day of assumption of the virgin
    setAtMonday(12, 10, year), // Day of race
    setAtMonday(1, 11, year), // All saints day
    setAtMonday(11, 11, year), // Cartagena independence day
];

/**
 * Get all holidays by Colombia
 *
 * @param year?: number - Year
 * @returns array
 */
export const getAllHolidaysByColombia = (year?: number): string[] => {
    const yearFinal = year ?? dayjs().year();
    const dates = [...getFixedDateColombia(yearFinal), ...getEasterWeekend(yearFinal), ...getRemainingHolidays(yearFinal)];
    return dates.sort();
};

/**
 * This function will validate if it is a business day
 *
 * @param date: string - Date
 * @returns boolean
 */
export const isBusinessDay = (date: string): boolean => businessDaysColombia.includes(dayjs(date).day());

/**
 * This function searches for the next business day
 *
 * @param date: string - Date
 * @param days: string - Add days
 * @param format: string - Format
 * @returns string
 */
export const nextBusinessDay = (date: string, days: number, format = 'YYYY-MM-DD'): string => {
    const dateLimit = dayjs(date);
    for (let day = 1; day <= days; day++) {
        dateLimit.add(1, 'day').format('YYYY-MM-DD');
        const dateFormat = dateLimit.format('YYYY-MM-DD');
        if (!isBusinessDay(dateFormat) || getAllHolidaysByColombia().includes(dateFormat)) day -= 1;
    }
    return dateLimit.format(format);
};

/**
 * This function validate unix format or date
 *
 * @param date: string -  param date
 * @returns boolean
 */
export const validateDateOrUnix = (date: string): boolean => {
    const iso8601DateTimePattern = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z$/;
    if (iso8601DateTimePattern.test(date)) {
        return true;
    } else {
        return false;
    }
};

/**
 * This function returns the current date in the format DD/MM/YYYY HH:mm AM/PM
 * @returns string
 */
export const getCurrentFormattedDate = (): string => {
    const date = new Date();
    const days = date.getDate().toString().padStart(2, '0');
    const months = (date.getMonth() + 1).toString().padStart(2, '0');
    const years = date.getFullYear().toString();
    let hours = date.getHours();
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const indication = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    const formattedHours = hours ? hours.toString().padStart(2, '0') : '12';

    return `${days}/${months}/${years} ${formattedHours}:${minutes} ${indication}`;
};

/**
 * This function create any format date
 *
 * @param date: any - Param any date
 * @param format: string - Optional param format date
 * @returns string
 */
export const getDateAnyFormat = (date: any, format = 'DD/MM/YYYY'): string => {
    if (typeof date === VARIABLE_TYPE.NUMBER) return fromUnix(date).format(format);
    return dayjs(date || new Date()).format(format);
};

/**
 * Date digit limit
 */
const DIGIT_LIMIT = 10;

/**
 * This is used to complete incomplete date values
 */
const ZERO = 0;

/**
 * This indicates if the date sent is in the past
 *
 * @param date: Date - Date to be evaluated
 * @returns boolean
 */
export const isPreviousDate = (date: Date): boolean => {
    const comparisonDate = new Date(date);
    const currentDate = new Date();
    currentDate.setHours(0, 0, 0);
    date.setHours(0, 0, 0);
    return getUnixFromDate(comparisonDate) < getUnixFromDate(currentDate);
};

/**
 * This function get date ISO 8601
 *
 * @param date: string - Date any format
 * @param format: string - Optional format date
 * @returns: string
 */
export const getDateISO8601ToDate = (date: string, format = 'DD/MM/YYYY'): string => dayjs(date, format).format();

/**
 * This function get date created
 *
 * @param createdAt: number | boolean - Date created
 * @returns: Date
 */
export const getDateCreated = (createdAt: number | boolean): Date => {
    const minDate = typeof createdAt === 'number' ? createdAt : 0;
    return new Date(minDate * 1000);
};

/**
 * Extracts the date and hours from a given start and end datetime string.
 *
 * @param initialDateStr
 * @param finishDateStr
 * @returns IGenericRecord
 */
export const extractDateAndTimes = (initialDateStr: string, finishDateStr: string): IGenericRecord => {
    return {
        date: dayjs(initialDateStr, 'YYYY-MM-DD HH:mm:ss').format('YYYY-MM-DD'),
        startTime: dayjs(initialDateStr, 'YYYY-MM-DD HH:mm:ss').format('HH:mm'),
        endTime: dayjs(finishDateStr, 'YYYY-MM-DD HH:mm:ss').format('HH:mm'),
    };
};

/**
 * This function validate to dates
 *
 * @param date: Date | string - First date
 * @param nextDate: Date | string - Second date
 * @returns boolean
 */
export const isAfter = (date: Date | string, nextDate: Date | string): boolean => dayjs(date).isAfter(dayjs(nextDate));

/**
 * This function to get month by unix date
 *
 * @param unix: number - Date in unix
 * @param format: string - Format for date
 * @returns string
 */
export const getDateForMonth = (unix = 0, format = 'YYYY-MM-DD'): string => {
    const currentUnix = unix || toUnix(dayjs());
    const date = fromUnix(currentUnix).startOf('month').format(format);

    return date;
};

/**
 * This function is to any date convert a unix
 *
 * @param date: string - Date
 * @param format: string - Format date
 * @returns number
 */
export const anyDateToUnix = (date: string, format = FORMAT_YYYY_MM_DD): number => toUnix(dayjs(date, format));
