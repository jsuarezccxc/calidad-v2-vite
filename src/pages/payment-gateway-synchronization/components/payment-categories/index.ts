import { Section } from '@components/bread-crumb';
import { Routes } from '@constants/Paths';
import { ParamPaymentGateway } from '@constants/PaymentGatewaySynchronization';
import { getRoute, getRouteName } from '@utils/Paths';

export { PaymentCategories } from './PaymentCategories';

/**
 * This function return bread crumb to component
 * 
 * @returns Section[]
 */
const routes = (): Section[] => [
    {
        name: getRouteName(Routes.WEBSITE_MENU),
        route: getRoute(Routes.WEBSITE_MENU),
    },
    {
        name: 'Cómo armar el sitio web',
        route: '#',
    },
    {
        name: getRouteName(Routes.PAYMENT_GATEWAY_SYNCHRONIZATION),
        route: getRoute(Routes.PAYMENT_GATEWAY_SYNCHRONIZATION),
    },
];

/**
 * This const is cards to show
 */
const CARDS = [
    {
        img: 'payu',
        label: 'Sincronización con PayU',
        route: getRoute(Routes.INSTRUCTIONS_PAYU),
    },
    {
        img: 'mercado-pago',
        label: 'Sincronización con Mercado Pago',
        route: `${getRoute(Routes.PAYMENT_GATEWAY_SYNCHRONIZATION)}?type=${ParamPaymentGateway.MercadoPago}`,
    },
    {
        img: 'wompi',
        label: 'Sincronización con Wompi',
        route: `${getRoute(Routes.PAYMENT_GATEWAY_SYNCHRONIZATION)}?type=${ParamPaymentGateway.Wompi}`,
    },
];

/**
 * This const is page's utils
 */
export const UTILS = {
    CARDS,
    routes,
    NEXT_PAGE: getRoute(Routes.PRODUCT_DATABASE),
    VALIDATION_MODULE: {
        name: getRouteName(Routes.PAYMENT_GATEWAY_SYNCHRONIZATION),
        moduleName: getRouteName(Routes.WEBSITE_MENU),
    },
};
