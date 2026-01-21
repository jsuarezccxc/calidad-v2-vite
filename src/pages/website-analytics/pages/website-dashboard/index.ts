import { Section } from '@components/bread-crumb';
import { Routes } from '@constants/Paths';
import { IGenericRecord } from '@models/GenericRecord';
import { getRoute, getRouteName } from '@utils/Paths';

export { default } from './WebsiteDashboard';

/**
 * Function that returns the routes for the breadcrumb
 * @returns Section[]
 */
export const routes = (): Section[] => [
    {
        name: getRouteName(Routes.WEBSITE_MENU),
        route: getRoute(Routes.WEBSITE_DASHBOARD),
    },
    {
        name: 'Consulte los Reportes ',
        route: '#',
    },
    {
        name: getRouteName(Routes.WEBSITE_ANALYTICS),
        route: getRoute(Routes.WEBSITE_ANALYTICS),
    },
];

/**
 * Placeholder data for representing an empty table of cities with active users
 */
export const PLACEHOLDER_TABLE_CITY = [
    { city: '-', activeUsers: '-' },
    { city: '-', activeUsers: '-' },
    { city: '-', activeUsers: '-' },
];

/**
 * * This interface describes that properties for charts
 *
 * @typeParam data: IGenericRecord[] - Data for chart
 * @typeParam height?: number - Optional height for table
 * @typeParam fontSize?: number - Optional font size text
 */
export interface IDataChart {
    data: IGenericRecord[];
    height?: number;
    fontSize?: number;
}

/**
 * Represents the current date subtracted by one day.
 */
export const TODAY_DATE = new Date();
TODAY_DATE.setDate(TODAY_DATE.getDate());

/**
 * Represents a date one month in the past from 'today'
 */
export const ONE_MONT_IN_PAST = new Date(TODAY_DATE);
ONE_MONT_IN_PAST.setDate(ONE_MONT_IN_PAST.getDate() - 30);

/**
 * Constant value representing one thousand.
 */
export const THOUSAND = 1000;
