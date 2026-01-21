import { Section } from '@components/bread-crumb';
import { Routes } from '@constants/Paths';
import { getRoute } from '@utils/Paths';

export { default } from './ReportElectronicDocuments';

/**
 * This constant represents a title message to consult accounting reports.
 */
export const CONSULT_ACCOUNTING_REPORTS = 'Consulte los reportes contables';

export const routes = (): Section[] => {
    return [
        {
            name: 'Documentos electrónicos',
            route: getRoute(Routes.DASHBOARD_ELECTRONIC_DOCUMENT),
        },
        {
            name: 'Consulte los reportes contables ',
            route: '#',
        },
        {
            name: 'Reporte de movimiento de inventario por documentos electrónicos',
            route: '#',
        },
    ];
};
