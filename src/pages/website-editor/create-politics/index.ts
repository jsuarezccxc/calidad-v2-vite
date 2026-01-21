import { Section } from '@components/bread-crumb';
import { Routes } from '@constants/Paths';
import { getRoute, getRouteName } from '@utils/Paths';
import { ADD_OR_EDIT_POLITICS } from '../add-politics';
import { ADD_POLITICS } from '../preview';

export * from './CreatePolitics';

/**
 * Constant for privacy politics text
 */
export const PRIVACY_POLICY_AND_DATA_PROCESSING = 'Política de privacidad y tratamiento de datos';

/**
 *  Array of Section[] to BreadCrumb component
 */
export const routesCreatePolitics = (): Section[] => [
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
        route: `${getRoute(Routes.WEBSITE_EDITOR)}?page=${ADD_POLITICS}`,
    },
    {
        name: PRIVACY_POLICY_AND_DATA_PROCESSING,
        route: '',
    },
];

/**
 * This interface defines structure when create a politic
 *
 * @typeParam name: string - Politic's name
 * @typeParam type_document: string - Politic's type document
 * @typeParam number_document: string - Politic's number document
 * @typeParam address: string - Politic's address
 * @typeParam email: string - Politic's email
 * @typeParam city: string - Politic's city
 * @typeParam commissioned_area_email: string | null -  Optional prop for politic's commissioned area email
 * @typeParam commissioned_address: string | null - Optional prop for politic's commissioned address
 * @typeParam phone: string - Politic's phone
 * @typeParam day: string - Politic's day
 * @typeParam month: string - Politic's month
 * @typeParam year: string - Politic's year
 * @typeParam company_id: string - Company's id
 */
export interface ICreatePolitic {
    name: string;
    type_document: string;
    number_document: string;
    address: string;
    email: string;
    city: string;
    commissioned_area_email?: string | null;
    commissioned_address?: string | null;
    phone: string;
    day: string;
    month: string;
    year: string;
    company_id: string;
}

/**
 * Max length of inputs in create politics
 */
export const MAX_LENGTH_INPUTS_POLITICS = 240;

/**
 * Commissioned email key
 */
export const COMMISSIONED_EMAIL = 'commissioned_area_email';
