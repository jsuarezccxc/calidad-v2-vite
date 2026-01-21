import { Section } from '@components/bread-crumb';
import { Routes } from '@constants/Paths';
import { getRoute } from '@utils/Paths';

export * from './Detail';

/**
 * Routes bread crumb pages
 * @returns Section[]
 */
export const routesDetail = (toggleShowDescription: (() => void)): Section[] => {
    return [
        {
            name: 'Ficha técnica',
            route: getRoute(Routes.DATABASE_MENU),
        },
        {
            name: 'Ficha técnica de productos/servicios',
            route: getRoute(Routes.PRODUCT_DATABASE),
            onClick: toggleShowDescription,
        },
        {
            name: 'Detalle del producto/servicio',
            route: '#',
        },
    ];
};
