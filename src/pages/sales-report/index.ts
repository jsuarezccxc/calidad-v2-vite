import { Section } from '@components/bread-crumb';
import { Routes } from '@constants/Paths';
import { ONE } from '@constants/Numbers';
import { getRoute, getRouteName } from '@utils/Paths';

export { default } from './SalesReport';

/**
 * Function that return the breadcrumb routes
 *
 * @returns Section[]
 */
export const routes = (): Section[] => {
    return [
        {
            name: getRouteName(Routes.ELECTRONIC_DOCUMENTS) ,
            route: getRoute(Routes.DASHBOARD_ELECTRONIC_DOCUMENT),
        },
        {
            name: getRouteName(Routes.REPORT_ELECTRONIC_DOCUMENTS),
            route: '#',
        },
        {
            name: getRouteName(Routes.SALES_REPORT),
            route: '#',
        },
    ];
};

/**
 * Positions in array for top buyer card
 */
export enum Positions {
    First = 0,
    Second = 1,
}

/**
 * Represents the current date subtracted by one day.
 */
export const TODAY_DATE = new Date();
TODAY_DATE.setDate(TODAY_DATE.getDate() - ONE);

/**
 * Represents a current day
 */
const CURRENT_DATE = new Date();

/**
 * Represents a date one month in the past from 'today'
 */
export const FIRST_DAY_OF_MOTH = new Date(CURRENT_DATE.getFullYear(), CURRENT_DATE.getMonth(), 1);

/**
 * Use to validate the number of digits to make the letter smaller
 */
export const MAX_DIGITS = 8;

/**
 * Represents all months of de year in spanish with equivalent in english
 */
export const MONTH_NAMES = {
    January: 'Ene',
    February: 'Feb',
    March: 'Mar',
    April: 'Abr',
    May: 'May',
    June: 'Jun',
    July: 'Jul',
    August: 'Ago',
    September: 'Sep',
    October: 'Oct',
    November: 'Nov',
    December: 'Dic',
};
