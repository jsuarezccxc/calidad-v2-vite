import { v4 as uuid } from 'uuid';
import { Section } from '@components/bread-crumb';
import { Routes } from '@constants/Paths';
import { getRoute, getRouteName } from '@utils/Paths';
import { IconsNames } from '@components/icon';

export { default } from './AccountingReportsMenu';

/**
 * Routes bread crumb pages
 *
 * @returns Section[]
 */
export const getRoutes = (isWebsitePage: boolean): Section[] => {
    const parentModule = isWebsitePage ? Routes.WEBSITE_DASHBOARD : Routes.ACCOUNTING_FINANCE;
    const pageName = isWebsitePage ? 'Consulte los reportes del sitio web' : getRouteName(Routes.ACCOUNTING_REPORTS);

    return [
        {
            name: getRouteName(parentModule),
            route: getRoute(parentModule),
        },
        {
            name: pageName,
            route: '#',
        },
    ];
};

/**
 * * This interface describes that properties card reports
 *
 * @typeParam id: string - Require card id
 * @typeParam name: string - Require card name
 * @typeParam route: string - Require report rout
 * @typeParam icon: IconsNames - Require icon name
 */
export interface ICardReport {
    id: string;
    name: string;
    route: string;
    icon: IconsNames;
}

/**
 * Data name reports
 */
export const nameReports: ICardReport[] = [
    {
        id: uuid(),
        name: getRouteName(Routes.SALES_REPORT_PRODUCT_WAREHOUSE),
        route: getRoute(Routes.SALES_REPORT_PRODUCT_WAREHOUSE),
        icon: 'salesReport',
    },
    {
        id: uuid(),
        name: getRouteName(Routes.SHOPPING_REPORT_PRODUCT_WAREHOUSE),
        route: getRoute(Routes.SHOPPING_REPORT_PRODUCT_WAREHOUSE),
        icon: 'shoppingReport',
    },
    {
        id: uuid(),
        name: getRouteName(Routes.DAILY_ENDING_INVENTORY),
        route: getRoute(Routes.DAILY_ENDING_INVENTORY),
        icon: 'dailyEndingInventory',
    },
    {
        id: uuid(),
        name: getRouteName(Routes.ENDING_INVENTORY_ACCOUNTING_MONTH),
        route: getRoute(Routes.ENDING_INVENTORY_ACCOUNTING_MONTH),
        icon: 'endingInventoryMonth',
    },
    {
        id: uuid(),
        name: getRouteName(Routes.FINAL_INVENTORY_CALCULATION),
        route: getRoute(Routes.FINAL_INVENTORY_CALCULATION),
        icon: 'totalInventoryCalculation',
    },
];
