import { Section } from '@components/bread-crumb';
import { Routes } from '@constants/Paths';
import { getRoute, getRouteName } from '@utils/Paths';

export { Definitions } from './Definitions';

/**
 * Function that returns the routes for the breadcrumb
 * @returns Section[]
 */
export const routes = (): Section[] => [
    {
        name: getRouteName(Routes.HELP_CENTER),
        route: getRoute(Routes.HELP_CENTER),
    },

    {
        name: getRouteName(Routes.EASY_MANAGEMENT),
        route: getRoute(Routes.EASY_MANAGEMENT),
    },
];

/**
 * Name for inputs type search
 */
export enum searchInputsName {
    card = 'card',
    definition = 'definition',
}

/**
 * Default values for input type search
 */
export const DEFAULT_SEARCH_INPUTS = { [searchInputsName.card]: '', [searchInputsName.definition]: '' };

/**
 * This constant select definition in array 
 */
export const DEFINITIONS = 0

/**
 * This constant represent electronic documents
 */
export const ELECTRONIC_DOCUMENTS = 'electronic-documents'


