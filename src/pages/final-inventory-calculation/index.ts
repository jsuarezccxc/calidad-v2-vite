import { Section } from '@components/bread-crumb';
import { Routes } from '@constants/Paths';
import { getRoute, getRouteName } from '@utils/Paths';

export { default } from './FinalInventoryCalculation';

/**
 * Routes bread crumb pages
 * 
 * @returns Section[]
 */
export const getRoutes = (): Section[] => {
    return [
        {
            name: getRouteName(Routes.WEBSITE_MENU),
            route: getRoute(Routes.WEBSITE_DASHBOARD),
        },
        {
            name: 'Consulte los reportes del sitio web',
            route: '#',
        },
        {
            name: 'Reportes contables',
            route: getRoute(Routes.ACCOUNTING_REPORTS_MENU),
        },
    ];
};

/**
 * This key select
 */
export const DATE_KEY: { [key: string]: string } = {
    '01': 'Enero 31',
    '02': 'Febrero 28',
    '03': 'Marzo 31',
    '04': 'Abril 30',
    '05': 'Mayo 31',
    '06': 'Junio 30',
    '07': 'Julio 31',
    '08': 'Agosto 31',
    '09': 'Septiembre 30',
    '10': 'Octubre 31',
    '11': 'Noviembre 30',
    '12': 'Diciembre 31',
};
