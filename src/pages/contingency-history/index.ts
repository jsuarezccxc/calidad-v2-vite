import { Section } from '@components/bread-crumb';
import { Routes } from '@constants/Paths';
import { MODULE_TITLES } from '@constants/ElectronicDocuments';
import { getRoute, getRouteName } from '@utils/Paths';
import { INFORMATION_PAGE } from '@information-texts/ContingencyHistory';

export { default } from './ContingencyHistory';

/**
 * This const is bread crumbs page
 */
const ROUTES: Section[] = [
    {
        name: MODULE_TITLES.CONTINGENCY,
        route: '#',
    },
    {
        name: getRouteName(Routes.CONTINGENCY_HISTORY),
        route: getRoute(Routes.CONTINGENCY_HISTORY),
    },
];

/**
 * This interface is state form
 * 
 * @typeParam search: string - Search column
 * @typeParam date: string | null - Date start
 */
export interface IFormState {
    search: string;
    date: string | null;
}

/**
 * This const is utils page
 */
export const UTILS = {
    PAGE_TITLE: MODULE_TITLES.CONTINGENCY,
    ROUTES,
    SUB_INFORMATION: INFORMATION_PAGE,
    NEXT_PAGE: ''
};
