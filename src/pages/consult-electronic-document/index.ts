import { Section } from '@components/bread-crumb';
import { ALL_NOTES } from '@constants/ElectronicInvoice';
import { Routes } from '@constants/Paths';
import { getRoute, getRouteName } from '@utils/Paths';

export { default } from './ConsultElectronicDocument';

export const TYPE_NAVIGATION = {
        CREATED_INVOICE: 'CREATED_INVOICE',
        CREATED_INVOICE_PURCHASE: 'CREATED_INVOICE_PURCHASE',
        CREATED_DEBIT_NOTE: 'CREATED_DEBIT_NOTE',
        CREATED_CREDIT_NOTE: 'CREATED_CREDIT_NOTE',
        CREATED_SUPPORT_DOCUMENT: 'CREATED_SUPPORT_DOCUMENT',
        CREATED_ADJUSTMENT_NOTE: 'CREATED_ADJUSTMENT_NOTE',
        GENERATED: 'GENERATED',
        CORRECTED: 'CORRECTED',
        QUOTE_VIEW: 'QUOTE_VIEW',
};

/**
 * This function is breadcrumbs
 *
 * @param documentType: string  - Optional param
 * @param isQuote: boolean - Optional param to indicate if it's a quote
 * @returns Section[]
 */
export const routes = (documentType = '', isQuote = false): Section[] => {
    if (isQuote) {
        return [
            {
                name: 'Documentos electrónicos',
                route: getRoute(Routes.DASHBOARD_ELECTRONIC_DOCUMENT),
            },
            {
                name: 'Cómo generar y transmitir Factura electrónica de venta y Documento soporte',
                route: getRoute(Routes.DASHBOARD_ELECTRONIC_DOCUMENT),
            },
            {
                name: 'Cotizaciones',
                route: getRoute(Routes.QUOTES_REPORT),
            },
            {
                name: 'Visualización cotización',
                route: '#',
            },
        ];
    }

    return [
        {
            name: 'Documentos electrónicos',
            route: getRoute(Routes.DASHBOARD_ELECTRONIC_DOCUMENT),
        },
        ...[
            ALL_NOTES.includes(documentType)
                ? {
                      name: getRouteName(Routes.CORRECTED_DOCUMENTS),
                      route: getRoute(Routes.CORRECTED_DOCUMENTS),
                  }
                : {
                      name: getRouteName(Routes.ELECTRONIC_DOCUMENTS_GENERATED),
                      route: getRoute(Routes.ELECTRONIC_DOCUMENTS_GENERATED),
                  },
        ],
        {
            name: 'Estado del documento',
            route: '#',
        },
    ];
};

/**
 * This const is principal title page
 *
 * @param documentType: string - Optional param
 * @param isQuote: boolean - Optional param to indicate if it's a quote
 * @returns string
 */
export const principalTitle = (documentType = '', isQuote = false): string => {
    if (isQuote) return 'Cómo generar y transmitir Factura electrónica de venta y Documento soporte';
    if (ALL_NOTES.includes(documentType)) return getRouteName(Routes.CORRECTED_DOCUMENTS);
    return getRouteName(Routes.ELECTRONIC_DOCUMENTS_GENERATED);
};

/**
 * This function returns the next route to next button in consult electronic documents
 *
 * @typeParam typeNavigation: string | null - Optional param
 * @returns nextRoute
 */
export const nextPage = (typeNavigation: string | null = ''): string => {
    let nextRoute = '';
    switch (typeNavigation) {
        case TYPE_NAVIGATION.CREATED_INVOICE:
            nextRoute = getRoute(Routes.GENERATE_PURCHASE_INVOICE);
            break;
        case TYPE_NAVIGATION.CREATED_INVOICE_PURCHASE:
            nextRoute = getRoute(Routes.GENERATE_SUPPORT_DOCUMENT);
            break;
        case TYPE_NAVIGATION.CREATED_DEBIT_NOTE:
            nextRoute = getRoute(Routes.GENERATE_CREDIT_NOTE);
            break;
        case TYPE_NAVIGATION.CREATED_CREDIT_NOTE:
            nextRoute = getRoute(Routes.GENERATE_ADJUSTMENT_NOTE);
            break;
        case TYPE_NAVIGATION.CREATED_SUPPORT_DOCUMENT:
            nextRoute = getRoute(Routes.DRAFT_DOCUMENTS);
            break;
        case TYPE_NAVIGATION.CREATED_ADJUSTMENT_NOTE:
            nextRoute = getRoute(Routes.DRAFT_DOCUMENTS_NOTE);
            break;
        case TYPE_NAVIGATION.GENERATED:
            nextRoute = getRoute(Routes.PREFIX_NOTE);
            break;
        case TYPE_NAVIGATION.QUOTE_VIEW:
            nextRoute = getRoute(Routes.ELECTRONIC_DOCUMENTS_GENERATED);
            break;
        default:
            nextRoute = getRoute(Routes.REPORT_ELECTRONIC_DOCUMENTS);
            break;
    }
    return nextRoute;
};

/**
 * This function returns the back route for back button in consult electronic documents
 *
 * @param typeNavigation: string | null - Optional param
 * @returns backRoute
 */
export const backPage = (typeNavigation: string | null = ''): string => {
    if (typeNavigation === TYPE_NAVIGATION.QUOTE_VIEW) {
        return getRoute(Routes.QUOTES_REPORT);
    }
    return '';
};
