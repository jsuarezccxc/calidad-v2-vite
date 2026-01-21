import { Routes } from '@constants/Paths';
import { getRoute } from '@utils/Paths';

export * from './WarehouseDetail';

/**
 * Indexes of the routes used for the breadcrumb
 */
export const routesWarehouseDetail = [
    {
        name: 'Ficha técnica',
        route: getRoute(Routes.DATABASE_MENU),
    },
    {
        name: 'Ficha técnica de bodegas',
        route: getRoute(Routes.WAREHOUSES),
    },
    {
        name: 'Detalle de la bodega',
        route: '#',
    },
];
