import { getRoute, getRouteName } from '@utils/Paths';
import { Routes } from '@constants/Paths';
import { Section } from '@components/bread-crumb';
import { currentDateInUnix } from '@utils/Date';
import { CREDIT_DEBIT_CARD_CONSTANT, PSE } from '@constants/PaymentMethods';

export { default } from './PaymentMethods';

export const routes = (routesMembership = false, isPSE = false, anotherRoute = false): Section[] => {
    let newRoutes = [];

    if (routesMembership) {
        newRoutes = [
            {
                name: getRouteName(Routes.PAYMENT_PLANS_MENU),
                route: getRoute(Routes.PAYMENT_PLANS_MENU),
            },
            {
                name: getRouteName(Routes.PAYMENT_METHODS),
                route: getRoute(Routes.PAYMENT_METHODS),
            },
        ];
        if (anotherRoute)
            newRoutes.push({
                name: anotherRoute ? (isPSE ? PSE : CREDIT_DEBIT_CARD_CONSTANT) : '',
                route: '#',
            });
    } else {
        newRoutes = [
            {
                name: getRouteName(Routes.HOME),
                route: getRoute(Routes.HOME),
                routeIndex: Routes.HOME,
            },
            {
                name: getRouteName(Routes.HOME),
                route: getRoute(Routes.HOME),
                routeIndex: Routes.HOME,
            },
            {
                name: getRouteName(Routes.HOME),
                route: getRoute(Routes.HOME),
                routeIndex: Routes.HOME,
            },
            {
                name: isPSE ? PSE : CREDIT_DEBIT_CARD_CONSTANT,
                route: '#',
            },
        ];
    }

    return newRoutes;
};

export const REQUIRED_FIELDS = {
    // REQUIRED FIELDS INFO
    documentType: false,
    documentNumber: false,
    nameClient: false,
    email: false,
    validEmail: false,
    address: false,
    department: false,
    city: false,
    postalCode: false,
    postalCodeLength: false,
    tax: false,
    taxPayerType: false,

    // REQUIRED FIELDS CARD
    number: false,
    securityCode: false,
    securityCodeLessDigits: false,
    expiredDate: false,
    name: false,
    cardType: false,
};

export const INITIAL_DATA = {
    // INFO PERSON
    documentType: '',
    documentNumber: '',
    nameClient: '',
    email: '',
    address: '',
    department: '',
    departmentId: '',
    city: '',
    postalCode: '',
    phone: '',
    tax: '',
    taxPayerType: '',
    responsibilities: [''],

    // INFO CARD
    number: 0,
    securityCode: '',
    expirationDate: currentDateInUnix(),
    name: '',
    cardType: '',
};

export const INITIAL_DATA_CARD_OPTIONS = [
    { name: 'selectedCard', isSelect: false },
    { name: 'otherCard', isSelect: true },
];

export const CARD_TYPES = [
    { value: 'Tarjeta de crédito', name: 'CREDIT_CARD', key: 'CREDIT_CARD' },
    { value: 'Tarjeta debito', name: 'DEBIT_CARD', key: 'DEBIT_CARD' },
];

// Constants
export const MAX_NUMBER_POSTAL_CODE = 6;
export const MAX_NUMBER_SECURITY_CODE = 3;
export const SINGLE_USER = 1;
export const ZERO = 0;
export const MAX_LENGTH_ALPHANUMERIC = 100;
export const MAX_LENGTH_NUMERIC = 20;
export const MAX_LENGTH_EMAIL = 30;
export const URL_PARAM_INFO_PAYMENT = '?info-payment';
