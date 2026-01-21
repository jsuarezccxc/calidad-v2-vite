import { Section } from '@components/bread-crumb';
import { Routes } from '@constants/Paths';
import { getRoute, getRouteName } from '@utils/Paths';

export { default } from './PlanMethodPayment';

export const routes = (): Section[] => {
    return [
        {
            name: getRouteName(Routes.PAYMENT_PLAN),
            route: getRoute(Routes.PAYMENT_PLAN),
        },
        {
            name: TAB_CHANGE_METHOD_PAYMENT,
            route: '#',
        },
    ];
};

/**
 * Type modal screen
 */
export type IModalsScreen = {
    success: boolean;
    error: boolean;
    information: boolean;
};

/**
 * Value from enum to show specific type
 */
export enum IModalType {
    SUCCESS = 'success',
    ERROR = 'error',
    INFO = 'information',
}

/**
 * Data form card user
 */
export type IDataForm = {
    name: string;
    documentType: string;
    documentNumber: string;
    email: string;
    numberCard: string;
    expirationDate: string;
    securityCode: string;
    typeCard: string;
};

export const initialDataForm = {
    name: '',
    documentType: '',
    documentNumber: '',
    email: '',
    numberCard: '',
    expirationDate: '',
    securityCode: '',
    typeCard: '',
};

/**
 * Tab purchasing process
 */
export const TAB_CHANGE_METHOD_PAYMENT = 'Cambiar método de pago';
