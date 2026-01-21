import { Section } from '@components/bread-crumb';
import { Routes } from '@constants/Paths';
import { getRoute } from '@utils/Paths';

export * from './AddImages'

/**
 * Routes bread crumb pages
 * @returns Section[]
 */
export const routes = (ShowCatalog: (() => void),ShowProduct: (() => void)): Section[] => {
    return [
        {
            name: 'Ficha técnica',
            route: getRoute(Routes.DATABASE_MENU),
        },
        {
            name: 'Ficha técnica de productos/servicios',
            route: '#',
            onClick: ShowCatalog,
        },
        {
            name: 'Agregar producto/servicio',
            route: '#',
            onClick: ShowProduct,
        },
        {
            name: 'Agregar imágenes',
            route: '#',
        },
    ];
};
