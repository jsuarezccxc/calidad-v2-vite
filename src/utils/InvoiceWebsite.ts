import { urls } from '@api/urls';
import { IWarehouseQuantities, IWarehouseTable } from '@models/InvoiceWebsite';

/**
 * This key select
 */
export const SELECT_KEY_URL: { [key: string]: string } = {
    sales: urls.invoice.getSaleWebsite,
    shopping: urls.invoice.getShoppingWebsite,
    finalInventoryDay: urls.invoice.getFinalInventoryDay,
    finalInventoryMonth: urls.invoice.getFinalInventoryMonth,
};

/**
 * This type action
 */
export const ACTION_TYPE = {
    SALES: 'sales',
    SHOPPING: 'shopping',
    FINAL_INVENTORY_DAY: 'finalInventoryDay',
    FINAL_INVENTORY_MONTH: 'finalInventoryMonth',
};

export const getTotalWarehouse = (data: IWarehouseQuantities, filterWarehouse = ''): IWarehouseQuantities => {
    const totalWarehouse = data?.warehouseTotals?.filter(item => item?.warehouse_id === filterWarehouse);
    if (!filterWarehouse || !data?.warehouseTotals?.length) return data;

    return {
        quantity_sold: totalWarehouse
            ?.flatMap(item => item.quantity_sold)
            ?.reduce((accumulator, currentValue) => accumulator + currentValue, 0),
        quantity_return: totalWarehouse
            ?.flatMap(item => item.quantity_return)
            ?.reduce((accumulator, currentValue) => accumulator + currentValue, 0),
        quantity_total: totalWarehouse
            ?.flatMap(item => item.quantity_total)
            ?.reduce((accumulator, currentValue) => accumulator + currentValue, 0),
        warehouseTotals: totalWarehouse.length ? totalWarehouse : [],
    };
};

export const getQuantities = (quantities: IWarehouseTable[], filterWarehouse: string): IWarehouseTable[] => {
    return quantities.filter(item => !filterWarehouse || item.warehouse_id === filterWarehouse);
};
