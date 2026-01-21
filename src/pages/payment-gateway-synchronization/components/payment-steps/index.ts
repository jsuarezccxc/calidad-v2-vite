import { Routes } from '@constants/Paths';
import { PRODUCT_NAME } from '@constants/ProductName';
import { ParamPaymentGateway } from '@constants/PaymentGatewaySynchronization';
import { getRoute, getRouteName } from '@utils/Paths';
import { IconsNames } from '@components/icon';

export { PaymentSteps } from './PaymentSteps';

/**
 * This interface is structure to objet
 * 
 * @typeParam iconStep: IconsNames - Icon name
 * @typeParam title: string - Title step
 */
interface ICardOptions {
    iconStep: IconsNames;
    title: string;
}

/**
 * This const is wompi options
 */
const WOMPI_CARD_OPTIONS: ICardOptions[] = [
    {
        iconStep: 'instructionStepOne',
        title: 'Paso 1: Crear cuenta en Wompi',
    },
    {
        iconStep: 'instructionStepTwo',
        title: `Paso 2: Sincronizar Wompi con ${PRODUCT_NAME}`,
    },
];

/**
 * This const is mercado options
 */
const MERCADO_CARD_OPTIONS: ICardOptions[] = [
    {
        iconStep: 'instructionStepOne',
        title: 'Paso 1: Crear cuenta en Mercado Pago',
    },
    {
        iconStep: 'instructionStepTwo', 
        title: 'Paso 2: Habilitar su cuenta para recibir pagos',
    },
    {
        iconStep: 'instructionStepThree',
        title: `Paso 3: Sincronizar Mercado Pago con ${PRODUCT_NAME}`,
    },
];

/**
 * This const is for cards information
 */
const CARD_OPTIONS: Record<string, ICardOptions[]> = {
    [ParamPaymentGateway.Wompi]: WOMPI_CARD_OPTIONS,
    [ParamPaymentGateway.MercadoPago]: MERCADO_CARD_OPTIONS,
}

/**
 * This interface is for structure props component
 * 
 * @typeParam type: string - Type payment
 */
export interface IPaymentInstructionsProps {
    type: string;
}

/**
 * This const is page's utils
 */
export const UTILS = {
    CARD_OPTIONS,
    getRouteName,
    getRoute,
    Routes,
};
