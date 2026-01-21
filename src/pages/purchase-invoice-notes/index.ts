import { Section } from '@components/bread-crumb';
import { SUPPORT_DOCUMENTS_SUBTITLE } from '@constants/DocumentTexts';
import { Routes } from '@constants/Paths';
import { NOTE_TYPE } from '@constants/PurchaseInvoiceNotes';
import { getRoute, getRouteName } from '@utils/Paths';

export { default } from './PurchaseInvoiceNotes';

/**
 * This const is for information page
 */
const PAGE_TITLE = {
    title: getRouteName(Routes.ELECTRONIC_DOCUMENTS),
    pageContent: SUPPORT_DOCUMENTS_SUBTITLE,
    classContainer: 'lg:mb-0',
    classTitle: 'leading-19.38px',
};

/**
 * This const is for the routes of the breadCrumb
 */
const ROUTES = [Routes.DASHBOARD_ELECTRONIC_DOCUMENT, Routes.ELECTRONIC_DOCUMENTS_GENERATED];

interface IBreadCrumbParams {
    routes: Section[];
    type: string;
    id: string;
}

/**
 * This function generates the breadcrumb for the purchase invoice notes
 *
 * @param routes: Section[] - The routes to be included in the breadcrumb
 * @param type: string - The type of note (e.g., 'CREDIT_NOTE', 'DEBIT_NOTE')
 * @returns Section[]
 */
const breadCrumbs = ({ routes, type, id }: IBreadCrumbParams): Section[] => {
    return [
        ...routes,
        { name: 'Visualización factura de compra', route: `${getRoute(Routes.CONSULT_ELECTRONIC_DOCUMENT)}?id=${id}` },
        { name: `Registrar ${NOTE_TYPE[type]}.`, route: '#' },
    ];
};

/**
 * This const is for utils component
 */
export const UTILS = {
    PAGE_TITLE,
    ROUTES,
    breadCrumbs,
};
