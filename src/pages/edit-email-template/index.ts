import { Section } from '@components/bread-crumb';
import { MODULE_TITLES } from '@constants/ElectronicDocuments';
import { Routes } from '@constants/Paths';
import { getRoute, getRouteName } from '@utils/Paths';

export { default } from './EditEmailTemplate';

/**
 * This function return bread crumbs page
 *
 * @typeParam isQuote: boolean - Optional param to indicate if it's a quote
 * @typeParam documentId: string - Optional document ID for building quote view route
 * @returns Section[]
 */
export const routes = (isQuote = false, documentId = ''): Section[] => {
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
                route: documentId ? `${getRoute(Routes.CONSULT_ELECTRONIC_DOCUMENT)}?id=${documentId}&type=QUOTE_VIEW` : '#',
            },
            {
                name: 'Editar plantilla de correo',
                route: '#',
            },
        ];
    }

    return [
        {
            name: getRouteName(Routes.ELECTRONIC_DOCUMENTS),
            route: getRoute(Routes.ELECTRONIC_DOCUMENTS),
        },
        {
            name: MODULE_TITLES.NOTE,
            route: '/#',
        },
        {
            name: 'Estado del documento',
            route: '/#',
        },
        {
            name: 'Editar plantilla de correo',
            route: '/#',
        },
    ];
};

/**
 * This constants is for page text
 */
export const TITLE_INFORMATION = 'Editar plantilla de correo';
export const DESCRIPTION_INFORMATION =
    'Agregue una imagen en caso que lo requiera, complete el asunto y la descripción del correo correspondiente. Además, asegúrese de incluir las direcciones de correo electrónico de las personas a las que enviará el mensaje.';
export const REJECTED = 'REJECTED';
