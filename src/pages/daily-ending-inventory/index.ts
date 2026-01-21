import { Section } from '@components/bread-crumb';
import { IPageButtonsFooterProps } from '@components/page-buttons-footer';
import { IHeaderTable } from '@components/table';
import { Routes } from '@constants/Paths';
import { buttonsFooterProps } from '@utils/Button';
import { ModuleApp } from '@utils/GenerateId';
import { getRoute, getRouteName } from '@utils/Paths';

export { default } from './DailyEndingInventory';

/**
 * Function that returns the routes for the breadcrumb
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
        name: 'Inventario final diario',
        route: getRoute(Routes.DAILY_ENDING_INVENTORY),
    },
];

/**
 * Data header for ending inventory accounting month
 */
export const headersTable: IHeaderTable[] = [
    {
        title: 'Fecha de operación',
        className: 'header-text',
        wrapperClassName: 'ending-inventory__header ending-inventory__header-first',
    },
    {
        title: 'Operación',
        className: 'header-text',
        wrapperClassName: 'ending-inventory__header ending-inventory__header-second',
    },
    {
        title: 'Unidad de medida',
        className: 'header-text',
        wrapperClassName: 'ending-inventory__header ending-inventory__header-third',
    },
    {
        title: 'Cantidad',
        className: 'header-text',
        wrapperClassName: 'ending-inventory__header ending-inventory__header-second',
    },
    {
        title: 'Bodega',
        className: 'header-text',
        wrapperClassName: 'ending-inventory__header ending-inventory__header-four',
    },
    {
        title: 'Inventario Final diario por bodega',
        className: 'header-text',
        wrapperClassName: 'ending-inventory__header ending-inventory__header-first',
    },
    {
        title: 'Inventario final diario total por cantidad de venta disponible',
        className: 'header-text',
        wrapperClassName: 'ending-inventory__header ending-inventory__header-five',
    },
];

/**
 * Function that returns the button props
 *
 * @param history: History - Hook for change page
 * @param saveChanges: () => void - Function for save changes
 * @param backAction: () => void - Function for the back action
 * @returns IPageButtonsFooterProps
 */
export const buttonProps = (history: History, saveChanges: () => void, backAction: () => void): IPageButtonsFooterProps => ({
    ...buttonsFooterProps(ModuleApp.ANALYTICAL_REPORTS, history, saveChanges, {
        name: getRouteName(Routes.WEBSITE_EDITOR),
        moduleName: getRouteName(Routes.WEBSITE_MENU),
    }),
    threeButtons: false,
    onClickButtonLeft: backAction,
});
