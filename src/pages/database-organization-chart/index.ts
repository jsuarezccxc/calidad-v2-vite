import { Section } from '@components/bread-crumb';
import { Routes } from '@constants/Paths';
import { DATABASE_EMPLOYEE } from '@information-texts/DatabaseEmployees';
import { getRoute, getRouteName } from '@utils/Paths';

export { default } from './DatabaseOrganizationChart';

/**
 * Function that returns the routes for the breadcrumb
 * @returns Section[]
 */
export const routes = (): Section[] => [
    {
        name: DATABASE_EMPLOYEE.TITLE,
        route: getRoute(Routes.DATABASE_MENU),
    },
    {
        name: getRouteName(Routes.DATABASE_EMPLOYEES),
        route: getRoute(Routes.DATABASE_EMPLOYEES),
    },
    {
        name: getRouteName(Routes.DATABASE_ORGANIZATION_CHART),
        route: getRoute(Routes.DATABASE_ORGANIZATION_CHART),
    },
];
