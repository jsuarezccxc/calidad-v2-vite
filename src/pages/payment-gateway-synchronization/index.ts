import { Routes } from '@constants/Paths';
import { getRouteName } from '@utils/Paths';

export { default } from './PaymentGatewaySynchronization';

/**
 * This const is page's utils
 */
export const UTILS = {
    PAGE_TITLE: getRouteName(Routes.WEBSITE_MENU),
    SUB_TITLE: 'Cómo armar el sitio web',
};
