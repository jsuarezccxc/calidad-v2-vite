import { v4 as uuid } from 'uuid';
import { Section } from '@components/bread-crumb';
import { IHeaderTable } from '@components/table';
import { Routes } from '@constants/Paths';
import { getRoute, getRouteName } from '@utils/Paths';
import { WEBSITE_DASHBOARD } from '@information-texts/WebsiteDashboard';

export { default } from './SalesReportProductWarehouse';

/**
 * Routes bread crumb pages
 * @returns Section[]
 */
export const routes = (): Section[] => {
    return [
        {
            name: getRouteName(Routes.WEBSITE_MENU),
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
            name: getRouteName(Routes.SALES_REPORT_PRODUCT_WAREHOUSE),
            route: '#',
        },
    ];
};

/**
 * Data header from reports product and warehouse
 */
export const headersTable: IHeaderTable[] = [
    {
        title: 'Fecha de venta',
        className: 'px-2 py-1 xs:p-2 xs:h-8.75',
        wrapperClassName: 'padding-none w-44.25 xs:h-8.75',
    },
    {
        title: 'Unidad de medida',
        className: 'px-2 py-1 xs:p-2 xs:h-8.75',
        wrapperClassName: 'padding-none w-44.25 xs:h-8.75',
    },
    {
        title: 'Cantidad vendida',
        className: 'px-2 py-1 xs:p-2 xs:h-8.75',
        wrapperClassName: 'padding-none w-36 xs:h-8.75',
    },
    {
        title: 'Cantidad devuelta por el cliente',
        className: 'px-2 py-1 xs:p-2 xs:h-8.75',
        wrapperClassName: 'padding-none w-36 xs:h-8.75',
    },
    {
        title: 'Cantidad neta',
        className: 'px-2 py-1 xs:p-2 xs:h-8.75',
        wrapperClassName: 'padding-none w-36 xs:h-8.75',
    },
    {
        title: 'Bodega',
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
        title: 'Total cantidad vendida',
        colSpan: 1,
        total: 23,
        isTitle: false,
        classNameTitle: 'bg-green-bgLight w-86 text-blue',
        classNameTotal: 'bg-white w-32 text-blue font-allerbold',
        name: 'quantity_units',
    },
    {
        id: uuid(),
        title: 'Total cantidad devuelta',
        colSpan: 1,
        total: 4,
        isTitle: false,
        classNameTitle: 'bg-green-bgLight w-86 text-blue',
        classNameTotal: 'bg-white w-32 text-blue font-allerbold',
        name: 'unit_returned',
    },
    {
        id: uuid(),
        title: 'Total cantidad neta',
        colSpan: 1,
        total: 29,
        isTitle: false,
        classNameTitle: 'bg-green-bgLight w-86 text-blue',
        classNameTotal: 'bg-white w-32 text-blue font-allerbold',
        name: 'net_units',
    },
    {
        id: uuid(),
        title: 'Cantidad vendida por bodega',
        colSpan: 2,
        total: 0,
        isTitle: true,
        classNameTitle: 'bg-green-bgLight w-full text-blue',
        classNameTotal: 'bg-white w-32 text-blue font-allerbold',
        name: 'quantity_sold_warehouse',
    },
    {
        id: uuid(),
        title: 'Reposición de cantidad devuelta',
        colSpan: 2,
        total: 0,
        isTitle: true,
        classNameTitle: 'bg-green-bgLight w-full text-blue',
        classNameTotal: 'bg-white w-32 text-blue',
        name: 'replacement_returned_units',
    },
];

/**
 * Tooltip information
 */
export const TOOLTIP_INFORMATION =
    'Las ventas netas son los ingresos totales de su empresa después de restar devoluciones y descuentos por tipo de producto y bodega';

/**
 * Initial data quantity sold
 */
export const INITIAL_QUANTITY_SOLD = {
    id: uuid(),
    title: '',
    colSpan: 1,
    total: 0,
    isTitle: false,
    classNameTitle: 'bg-white w-86 text-gray',
    classNameTotal: 'bg-white w-32 text-gray',
    name: '',
};

/**
 * Initial data quantity returned
 */
export const INITIAL_QUANTITY_RETURNED = {
    id: uuid(),
    title: '',
    colSpan: 1,
    total: 0,
    isTitle: false,
    classNameTitle: 'w-86 text-gray',
    classNameTotal: 'w-32 text-gray',
    name: '',
};

/**
 * Data fake sales
 */
export const dataFakeSales = {
    message: 'Success operation',
    statusCode: 200,
    service: 'INVOICE',
    data: {
        details: [
            {
                date: '0',
                unit_measurements_name: 'Spray pequeno',
                quantities: [
                    {
                        warehouse_id: 'd528f834-27cf-3e15-ab20-11ad828ba372',
                        warehouse: 'Anjali Ortiz',
                        quantity_sold: 15,
                        quantity_return: 5,
                        quantity_total: 10,
                        units_available: 2,
                    },
                    {
                        warehouse_id: 'c391ee5a-9545-34c7-a05d-4cdb15123ac9',
                        warehouse: 'Lacy Kuhlman',
                        quantity_sold: 20,
                        quantity_return: 3,
                        quantity_total: 17,
                        units_available: 2,
                    },
                ],
            },
        ],
        totals: {
            quantity_sold: 35,
            quantity_return: 8,
            quantity_total: 27,
            warehouseTotals: [
                {
                    warehouse_id: 'd528f834-27cf-3e15-ab20-11ad828ba373',
                    warehouse: 'Anjali Ortiz',
                    quantity_sold: 15,
                    quantity_return: 5,
                    quantity_total: 10,
                },
                {
                    warehouse_id: 'c391ee5a-9545-34c7-a05d-4cdb15123ac6',
                    warehouse: 'Lacy Kuhlman',
                    quantity_sold: 20,
                    quantity_return: 3,
                    quantity_total: 17,
                },
            ],
        },
    },
};
