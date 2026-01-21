import { Routes } from '@constants/Paths';
import { getRoute } from '@utils/Paths';

export * from './WarehouseList';

/**
 * Indexes of the routes used for the breadcrumb
 */
export const routesWarehouseList = [
    {
        name: 'Ficha técnica',
        route: getRoute(Routes.DATABASE_MENU),
    },
    {
        name: 'Ficha técnica de bodegas',
        route: getRoute(Routes.WAREHOUSES),
    },
];
