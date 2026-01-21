import { Section } from '@components/bread-crumb';
import { Routes } from '@constants/Paths';
import { getRoute, getRouteName } from '@utils/Paths';

export { default } from './EnableElectronicBiller';

/**
 * Routes for the breadcrumb
 *
 * @returns Section[]
 */
export const getRoutes = (): Section[] => [
    {
        name: getRouteName(Routes.DASHBOARD_ELECTRONIC_DOCUMENT),
        route: getRoute(Routes.DASHBOARD_ELECTRONIC_DOCUMENT),
        routeIndex: Routes.DASHBOARD_ELECTRONIC_DOCUMENT,
    },
    {
        name: getRouteName(Routes.ENABLE_ELECTRONIC_BILLER),
        route: getRoute(Routes.ENABLE_ELECTRONIC_BILLER),
        routeIndex: Routes.ENABLE_ELECTRONIC_BILLER,
    },
];

/**
 * It is fixed for queries on taxes 
 */
export const dynamicDataRequest = ['tax_details'];
