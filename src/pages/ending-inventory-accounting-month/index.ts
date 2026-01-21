import { Section } from '@components/bread-crumb';
import { IHeaderTable } from '@components/table';
import { Routes } from '@constants/Paths';
import { getRoute, getRouteName } from '@utils/Paths';

export { default } from './EndingInventoryAccountingMonth';

/**
 * Routes for the breadcrumb
 *
 * @returns Section[]
 */
export const routes = (): Section[] => [
    {
        name: getRouteName(Routes.WEBSITE_MENU),
        route: getRoute(Routes.WEBSITE_DASHBOARD),
    },
    {
        name: 'Consulte los reportes del sitio web',
        route: '#',
    },
    {
        name: 'Reportes contables',
        route: getRoute(Routes.ACCOUNTING_REPORTS_MENU),
    },
    {
        name: getRouteName(Routes.ENDING_INVENTORY_ACCOUNTING_MONTH),
        route: getRoute(Routes.ENDING_INVENTORY_ACCOUNTING_MONTH),
    },
];

/**
 * Data header for ending inventory accounting month
 */
export const headersTable: IHeaderTable[] = [
    {
        title: 'Fecha de cierre del mes contable',
        wrapperClassName: 'ending-inventory-month__table-title__first',
    },
    {
        title: 'Operación',
        wrapperClassName: 'ending-inventory-month__table-title__first',
    },
    {
        title: 'Unidad de medida',
        wrapperClassName: 'ending-inventory-month__table-title__second',
    },
    {
        title: 'Cantidad',
        wrapperClassName: 'ending-inventory-month__table-title__third',
    },
    {
        title: 'Bodega',
        wrapperClassName: 'ending-inventory-month__table-title__second',
    },
];

/**
 * Fake data for the table
 */
export const mockData = {
    message: 'Success operation',
    statusCode: 200,
    service: 'INVOICE',
    data: {
        date: 1713312000,
        operation: 'Inventario final contable',
        unit_measurements_name: 'Spray peque\u00f1o',
        quantities: [
            {
                warehouse_id: 'ceb7ffc0-fc55-4a95-bcea-f0a4431e6c22',
                warehouse: 'Bodega Center',
                quantity: 15,
                daily_final_inventory: 135,
            },
            {
                warehouse_id: 'c3dc84bf-c559-4dbb-8ceb-61d1e806dea5',
                warehouse: 'Bodega JM',
                quantity: 20,
                daily_final_inventory: 95,
            },
        ],
        quantity_total: 230,
    },
};

/**
 * Default data report
 */
export const DEFAULT_DATA_REPORT = { date: '', operation: '', unit_measurements_name: '', quantities: [], quantity_total: 0 };

/**
 * Const day unix
 */
export const DAY_UNIX = 86400;
