import { Section } from '@components/bread-crumb';
import { IconsNames } from '@components/icon';
import { Routes } from '@constants/Paths';
import { PRODUCT_NAME } from '@constants/ProductName';
import { getRoute, getRouteName } from '@utils/Paths';

export { default } from './InstructionsPayu';

/**
 * This interface describes the props of the state
 *
 * @typeParam icon: IconsNames - Name of icon in step cart
 * @typeParam url: string - Url in step cart
 * @typeParam title: string - Title in step cart
 * @typeParam type: string - Type of instruction
 * @typeParam viewInstructions: IGenericRecord - Optional type of validate instruction view
 */
export interface IStepCartProps {
    icon: IconsNames;
    url: string;
    title: string;
    type: string;
}

/**
 *  Array of Section[] to BreadCrumb component
 */
export const routesInstructions = (): Section[] => [
    {
        name: getRouteName(Routes.WEBSITE_MENU),
        route: getRoute(Routes.WEBSITE_MENU),
    },
    {
        name: getRouteName(Routes.WEBSITE_EDITOR),
        route: getRoute(Routes.WEBSITE_EDITOR),
    },
    {
        name: `Sincronización de PayU con ${PRODUCT_NAME}`,
        route: '',
    },
];

/**
 * Constant for create account param page
 */
export const CREATE_ACCOUNT = 'create-account';

/**
 * Constant for enable account param page
 */
export const ENABLE_ACCOUNT = 'enable-account';

/**
 * Constant for inputs payu param page
 */
export const SYNCHRONIZE_PAYU = 'synchronize-payu';

/**
 * Instructions for steps cart
 */
export const stepCartElements: IStepCartProps[] = [
    {
        icon: 'instructionStepOne',
        url: `/instructions-payu?page=${CREATE_ACCOUNT}`,
        title: 'Paso 1: Crear cuenta en PayU',
        type: CREATE_ACCOUNT,
    },
    {
        icon: 'instructionStepTwo',
        url: `/instructions-payu?page=${ENABLE_ACCOUNT}`,
        title: 'Paso 2: Habilitar su cuenta para recibir pagos',
        type: ENABLE_ACCOUNT,
    },
    {
        icon: 'instructionStepThree',
        url: `/instructions-payu?page=${SYNCHRONIZE_PAYU}`,
        title: `Paso 3: Sincronizar PayU con ${PRODUCT_NAME}`,
        type: SYNCHRONIZE_PAYU,
    },
];

/**
 * Routes for help center
 */
export const ROUTE_HELP_CENTER = '/help-center?name=';
