import { Section } from '@components/bread-crumb';
import { IOptionSelect } from '@components/input';
import { IPaginatorBackendObj } from '@components/paginator-backend';
import { IHeaderTable } from '@components/table';
import { IGenericRecord } from '@models/GenericRecord';
import { ISalesData } from '@redux/invoice-website/types';

export * from './SalesAndPurchaseAccountingReport';

/**
 * * This interface describes that properties SalesAndPurchaseReportProps
 *
 * @typeParam routes: Section[] - Require list routes to bread crumb
 * @typeParam title: string - Require title component
 * @typeParam description: string - Require description component
 * @typeParam headersTableProduct: IHeaderTable[] - Require data table header
 * @typeParam dataTableProduct: ITableCustom[] - Require data table product component
 * @typeParam dataTableTotal: ITableTotal[] - Require data table total component
 * @typeParam tooltipInformation: string - Require tooltip information
 * @typeParam onChangeOption: () => void - Require function change filters
 * @typeParam nextPage: string - Require next page
 * @typeParam downloadFile: (type: string) => void - Require function download file
 * @typeParam warehouseOptions: IOptionSelect[] - Require warehouse options
 * @typeParam paginatorBackend?: IPaginatorBackendObj<ISalesData> - Optional data to  paginator backend
 */
export interface ISalesAndPurchaseReportProps {
    routes: Section[];
    title: string;
    description: string;
    headersTableProduct: IHeaderTable[];
    dataTableProduct: ITableCustom[];
    dataTableTotal: ITableTotal[];
    tooltipInformation: string;
    onChangeOption: (option: IOptionSelect | IGenericRecord) => void;
    nextPage: string;
    downloadFile: (type: string) => void;
    warehouseOptions: IOptionSelect[];
    paginatorBackend?:IPaginatorBackendObj<ISalesData>;
}

/**
 * * This interface describes that properties custom table
 *
 * @typeParam id: string - Require table id
 * @typeParam date: string - Require sales date
 * @typeParam unit_measurements_name: string - Require unit measurement
 * @typeParam quantities: IWarehouseTable[] - Require data warehouse
 * @typeParam productId: string - Optional product id
 */
export interface ITableCustom {
    id: string;
    date: string;
    unit_measurements_name: string;
    quantities: IWarehouseTable[];
    productId?: string;
}

/**
 * * This interface describes that properties warehouse table
 *
 * @typeParam warehouse_id: string - Optional warehouse id
 * @typeParam warehouse: string - Optional warehouse name
 * @typeParam quantity_sold: number - Require quantity units product
 * @typeParam quantity_return: number - Require unit returned product
 * @typeParam quantity_total: number - Require net units product
 */
export interface IWarehouseTable {
    warehouse_id?: string;
    warehouse?: string;
    quantity_sold: number;
    quantity_return: number;
    quantity_total: number;
}

/**
 * * This interface describes that properties total table
 *
 * @typeParam id: string - Require table id
 * @typeParam title: string - Require title component
 * @typeParam colSpan: number - Require column span table
 * @typeParam total: number - Require total products
 * @typeParam isTitle: boolean - Require element is title
 * @typeParam classNameTitle: string - Require custom title
 * @typeParam classNameTotal: string - Require custom total element
 * @typeParam name: string - Require item name
 */
export interface ITableTotal {
    id: string;
    title: string;
    colSpan: number;
    total: number;
    isTitle: boolean;
    classNameTitle: string;
    classNameTotal: string;
    name: string;
}

/**
 * Initial options
 */
export const INITIAL_OPTIONS = {
    key: '0',
    id: '',
    value: 'Todas',
    name: 'warehouse',
};

/**
 * Constant date option
 */
export const DATE_OPTION = 'date';

/**
 * Constant product option
 */
export const PRODUCT_OPTION = 'product';

/**
 * Constant warehouse option
 */
export const WAREHOUSE_OPTION = 'warehouse';

/**
 * Constant warehouse index
 */
export const INDEX_WAREHOUSE = 3;

/**
 * Constant warehouse without item
 */
export const WITHOUT_ITEM = 0;

/**
 * Default data sales and shopping
 */
export const DEFAULT_DATA = {
    details: [],
    totals: { quantity_sold: 0, quantity_return: 0, quantity_total: 0, warehouseTotals: [] },
};

/**
 * This key select
 */
export const SELECT_KEY_REPORT: { [key: string]: string } = {
    sales: 'net-sale-product-type-warehouse-report',
    shopping: 'net-buy-product-type-warehouse-report',
    finalInventoryDay: 'final-daily-inventory-report',
    finalInventoryMonth: 'final-inventory-month-report',
    peps: 'report_final_inventory_peps',
    cpp: 'report_final_inventory_cpp',
};

/**
 * Function that returns the warehouse options
 *
 * @param warehouseList: IGenericRecord[] - Warehouse list
 * @param dataProducts: ITableCustom[] - Data products
 * @returns IOptionSelect[]
 */
export const createWarehouseOptions = (warehouseList: IGenericRecord[], dataProducts: ITableCustom[]): IOptionSelect[] => {
    const options: IOptionSelect[] = [INITIAL_OPTIONS];
    warehouseList?.forEach((warehouse, index) => {
        dataProducts
            ?.flatMap(item => item.quantities)
            ?.forEach(item => {
                const listOption = options.flatMap(item => item.id);
                if (item.warehouse_id === warehouse.id && !listOption.includes(item.warehouse_id)) {
                    options.push({
                        key: (index + 1).toString(),
                        id: warehouse.id,
                        value: warehouse.name,
                        name: 'warehouse',
                    });
                }
            });
    });
    return options;
};
