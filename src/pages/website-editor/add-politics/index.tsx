import { Section } from '@components/bread-crumb';

import { Routes } from '@constants/Paths';
import { DATA_PRIVACY_POLICY, TERMS_AND_CONDITIONS } from '@constants/website';

import { getRoute, getRouteName } from '@utils/Paths';

export * from './AddPolitics';

/**
 * This is used to render the file inputs
 */
export const FILES = [
    { name: DATA_PRIVACY_POLICY, files: [] },
    { name: TERMS_AND_CONDITIONS, files: [] },
];

/**
 * Interface for validations
 *
 * @typeParam data_privacy_policy: boolean - Prop for data privacy file
 * @typeParam terms_and_conditions: boolean - Prop for terms and conditions file
 */
export interface IPolitics {
    data_privacy_policy: boolean;
    terms_and_conditions: boolean;
}

/**
 * This is used to render the file inputs
 */
export const VALIDATION_TEXT = {
    data_privacy_policy: false,
    terms_and_conditions: false,
};

/**
 * constant to validate first position in array
 */
export const ZERO = 0;

/**
 * Used to validate type extension in documents
 */
export const APPLICATION_PDF = 'application/pdf';

/**
 * Add or edit politics constant
 */
export const ADD_OR_EDIT_POLITICS = 'Agregue y/o edite las política de su sitio web';

/**
 *  Array of Section[] to BreadCrumb component
 */
export const routesAddPolitics = (): Section[] => [
    {
        name: getRouteName(Routes.WEBSITE_MENU),
        route: getRoute(Routes.WEBSITE_MENU),
    },
    {
        name: getRouteName(Routes.WEBSITE_EDITOR),
        route: getRoute(Routes.WEBSITE_EDITOR),
    },
    {
        name: ADD_OR_EDIT_POLITICS,
        route: '',
    },
];

/**
 * Add text to normalize
 */
export const NORMALIZE_TEXT = 'NFC';
