import { IGenericRecord } from '@models/GenericRecord';

export enum ActionKeys {
    GET_STOCK_WAREHOUSE_PRODUCT_INVENTORY = 'GET_STOCK_WAREHOUSE_PRODUCT_INVENTORY',
    SET_ERROR = 'SET_ERROR',
}

/*
 * This interface describes redux type
 *
 * @typeParam type: string - Redux action
 * @typeParam payload: IGenericRecord[] - Redux request data
 */
export interface IGetStockWarehouseProductInventory {
    type: ActionKeys.GET_STOCK_WAREHOUSE_PRODUCT_INVENTORY;
    payload: IGenericRecord[];
}

/*
 * This interface describes redux error
 *
 * @typeParam type: string - Redux action
 * @typeParam error: string - Redux request error
 */
export interface ISetError {
    type: ActionKeys.SET_ERROR;
    error: string;
}

export type DailyStockWarehouseProductActions = IGetStockWarehouseProductInventory | ISetError;
