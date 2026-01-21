import { Section } from '@components/bread-crumb';
import { Routes } from '@constants/Paths';
import { getRoute, getRouteName } from '@utils/Paths';

export { default } from './HelpCenter';

/**
 * Routes for the breadcrumb
 *
 * @param title: string - Page title
 * @returns Section[]
 */
export const getRoutes = (title: string): Section[] => [
    {
        name: getRouteName(Routes.HELP_CENTER),
        route: getRoute(Routes.HELP_CENTER),
        routeIndex: Routes.HELP_CENTER,
    },
    {
        name: title,
        route: '',
    },
];

/**
 * Query param used to show each step
 */
export const NAME = 'name';

/**
 * Query param used to show each step
 */
export const WORDS = 'words';

/**
 * Property to store the main page texts
 */
export const MAIN = 'main';

/**
 * Regex for validate text
 */
export const NAME_VALIDATION_REGEX = /^[a-zA-Z\s]*$/;

/**
 * Regex for validate text
 */
export const NFD_VALIDATION_REX = /[\u0300-\u036f]/g;

/**
 * Regex for validate text
 */
export const NFD = 'NFD';
