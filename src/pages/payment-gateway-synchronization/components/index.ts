import { Routes } from '@constants/Paths';
import { PRODUCT_NAME } from '@constants/ProductName';
import { ParamPaymentGateway } from '@constants/PaymentGatewaySynchronization';
import LocalStorage from '@utils/LocalStorage';
import { getRoute, getRouteName } from '@utils/Paths';
import { Section } from '@components/bread-crumb';

export { PaymentCategories } from './payment-categories';
export { PaymentSteps } from './payment-steps';
export { PaymentInstructions } from './payment-instructions';

/**
 * This interface define structure to object
 *
 * @typeParam upperType: string - Upper text type
 * @typeParam stepComplete: string[] -  History steps
 */
interface IHistoryInstructions {
    upperType: string;
    stepComplete: string[];
}

/**
 * This function return bread crumbs page
 *
 * @param type: string - Type payment
 * @returns: Section[]
 */
export const routesToSteps = (type: string): Section[] => {
    const paymentRoute = getRoute(Routes.PAYMENT_GATEWAY_SYNCHRONIZATION);
    const gatewayRoute = `${paymentRoute}?type=${type}`;
    const route: Section[] = [
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
            route: paymentRoute,
        },
    ];
    if (type === ParamPaymentGateway.MercadoPago)
        route.push({ name: `Sincronización de Mercado Pago con ${PRODUCT_NAME}`, route: gatewayRoute });
    if (type === ParamPaymentGateway.Wompi)
        route.push({ name: `Sincronización de Wompi con ${PRODUCT_NAME}`, route: gatewayRoute });
    return route;
};

/**
 * This function get local store to save
 *
 * @param type: string - Type instruction
 * @returns IHistoryInstructions
 */
export const getLocalStorage = (type: string): IHistoryInstructions => {
    const upperType = type.toUpperCase();
    const stepComplete = LocalStorage.get(upperType)?.split(',') || [];
    return { upperType, stepComplete };
};
