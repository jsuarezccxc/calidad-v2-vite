/**
 * * This interface describes that properties custom table
 *
 * @typeParam id: string - Require table id
 * @typeParam date: string - Require sales date
 * @typeParam unit_measurements_name: string - Require unit measurement
 * @typeParam quantities: IWarehouseTable[] - Require data warehouse
 */
export interface ITableCustom {
    id: string;
    date: string;
    unit_measurements_name: string;
    quantities: IWarehouseTable[];
}

/**
 * * This interface describes that properties warehouse quantities
 *
 * @typeParam warehouseTotals: IWarehouseTable[] - Require warehouse totals
 * @typeParam quantity_sold: number - Require quantity units product
 * @typeParam quantity_return: number - Require unit returned product
 * @typeParam quantity_total: number - Require net units product
 */
export interface IWarehouseQuantities {
    warehouseTotals: IWarehouseTable[];
    quantity_sold: number;
    quantity_return: number;
    quantity_total: number;
}

/**
 * * This interface describes that properties warehouse table
 *
 * @typeParam warehouse_id: string - Require warehouse id
 * @typeParam warehouse: string - Require warehouse name
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
 * * This interface describes that properties custom table
 *
 * @typeParam id: string - Require table id
 * @typeParam date: string - Require sales date
 * @typeParam unit_measurements_name: string - Require unit measurement
 * @typeParam quantities: IQuantities[] - Require data warehouse
 * @typeParam is_initial:boolean - Require is initial operation
 * @typeParam operation: string - Require type operation
 * @typeParam quantity_total: number - Require quantity total
 */
export interface IFinalInventoryDay {
    id?: string;
    date: string;
    unit_measurements_name: string;
    quantities: IQuantities[];
    is_initial?: boolean;
    operation: string;
    quantity_total: number;
}

/**
 * * This interface describes that properties warehouse table
 *
 * @typeParam warehouse_id: string - Require warehouse id
 * @typeParam warehouse: string - Require warehouse name
 * @typeParam quantity: number - Require quantity units product
 * @typeParam daily_final_inventory: number - Require daily final inventory product
 */
export interface IQuantities {
    warehouse_id?: string;
    warehouse?: string;
    quantity: number;
    daily_final_inventory: number;
}
