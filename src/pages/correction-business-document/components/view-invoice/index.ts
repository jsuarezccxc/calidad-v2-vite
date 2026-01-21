import { Section } from '@components/bread-crumb';
import { Routes } from '@constants/Paths';
import { getRoute, getRouteName } from '@utils/Paths';

export { default } from './ViewInvoice';

/**
 *
 * @Param
 * @returns Section[]
 */
export const routes = (): Section[] => [
    { name: getRouteName(Routes.ELECTRONIC_INVOICE), route: getRoute(Routes.ELECTRONIC_INVOICE) },
    { name: getRouteName(Routes.HOME), route: getRoute(Routes.HOME) },
    { name: getRouteName(Routes.CORRECTION_BUSINESS_DOCUMENT), route: getRoute(Routes.CORRECTION_BUSINESS_DOCUMENT) },
    { name: 'Visualización del documento electrónico', route: '#' },
];
