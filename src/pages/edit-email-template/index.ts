import { Section } from '@components/bread-crumb';
import { MODULE_TITLES } from '@constants/ElectronicDocuments';
import { Routes } from '@constants/Paths';
import { getRoute, getRouteName } from '@utils/Paths';

export { default } from './EditEmailTemplate';

/**
 * This function return bread crumbs page
 *
 * @returns Section[]
 */
export const routes = (): Section[] => {
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
