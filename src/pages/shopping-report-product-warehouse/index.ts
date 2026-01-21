import { v4 as uuid } from 'uuid';
import { Section } from '@components/bread-crumb';
import { IHeaderTable } from '@components/table';
import { Routes } from '@constants/Paths';
import { getRoute, getRouteName } from '@utils/Paths';
import { WEBSITE_DASHBOARD } from '@information-texts/WebsiteDashboard';

export { default } from './ShoppingReportProductWarehouse';
/**
 * Routes bread crumb pages
 * @returns Section[]
 */
export const routes = (): Section[] => {
    return [
        {
            name: getRouteName(Routes.HOME),
            route: getRoute(Routes.WEBSITE_DASHBOARD),
        },
        {
            name: WEBSITE_DASHBOARD.TITLE,
            route: '#',
        },
        {
            name: 'Reportes contables',
            route: getRoute(Routes.ACCOUNTING_REPORTS_MENU),
        },
        {
            name: getRouteName(Routes.SHOPPING_REPORT_PRODUCT_WAREHOUSE),
            route: '#',
        },
    ];
};

/**
 * Data header from reports product and warehouse
 */
export const headersTable: IHeaderTable[] = [
    {
        title: 'Fecha de compra',
        className: 'px-2 py-1 xs:p-2 xs:h-8.75',
        wrapperClassName: 'padding-none w-44.25 xs:h-8.75',
    },
    {
        title: 'Unidad de medida',
        className: 'px-2 py-1 xs:p-2 xs:h-8.75',
        wrapperClassName: 'padding-none w-44.25 xs:h-8.75',
    },
    {
        title: 'Cantidad comprada',
        className: 'px-2 py-1 xs:p-2 xs:h-8.75',
        wrapperClassName: 'padding-none w-36 xs:h-8.75',
    },
    {
        title: 'Cantidad devuelta al proveedor',
        className: 'px-2 py-1 xs:p-2 xs:h-8.75',
        wrapperClassName: 'padding-none w-36 xs:h-8.75',
    },
    {
        title: 'Cantidad neta comprada',
        className: 'px-2 py-1 xs:p-2 xs:h-8.75',
        wrapperClassName: 'padding-none w-36 xs:h-8.75',
    },
    {
        title: 'Bodegas',
        className: 'px-2 py-1 xs:p-2 xs:h-8.75',
        wrapperClassName: 'padding-none w-36 xs:h-8.75',
    },
];

/**
 * Data table total
 */
export const dataTableTotal = [
    {
        id: uuid(),
        title: 'Total cantidad comprada',
        colSpan: 1,
        total: 0,
        isTitle: false,
        classNameTitle: 'bg-green-bgLight w-86 text-blue',
        classNameTotal: 'bg-white w-32 text-blue font-allerbold',
        name: 'quantity_units',
    },
    {
        id: uuid(),
        title: 'Total cantidad devuelta',
        colSpan: 1,
        total: 0,
        isTitle: false,
        classNameTitle: 'bg-green-bgLight w-86 text-blue',
        classNameTotal: 'bg-white w-32 text-blue font-allerbold',
        name: 'unit_returned',
    },
    {
        id: uuid(),
        title: 'Total cantidad neta comprada',
        colSpan: 1,
        total: 0,
        isTitle: false,
        classNameTitle: 'bg-green-bgLight w-86 text-blue',
        classNameTotal: 'bg-white w-32 text-blue font-allerbold',
        name: 'net_units',
    },
    {
        id: uuid(),
        title: 'Cantidad comprada por bodega',
        colSpan: 2,
        total: 0,
        isTitle: true,
        classNameTitle: 'bg-green-bgLight w-full text-blue',
        classNameTotal: 'bg-white w-32 text-blue font-allerbold',
        name: '',
    },
];

/**
 * Description tooltip
 */
export const TOOLTIP_INFORMATION =
    'Las compras netas es todo lo que ha adquirido su empresa después de restar devoluciones y descuentos por tipo de producto y bodega';

/**
 * Quantity type
 */
export const QUANTITY_TYPE = {
    NET_UNITS: 'net_units',
    QUANTITY_UNITS: 'quantity_units',
    UNIT_RETURNED: 'unit_returned',
};

/**
 * Initial data warehouses in total table
 */
export const INITIAL_ITEM_TOTAL = {
    id: uuid(),
    title: '',
    colSpan: 1,
    total: 0,
    isTitle: false,
    classNameTitle: 'w-86 text-gray',
    classNameTotal: 'w-32 text-gray',
    name: '',
};
