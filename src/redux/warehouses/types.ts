import { IGenericRecord } from '@models/GenericRecord';
import { IWarehousesWithProducts } from '@models/Warehouse';
export enum ActionKeys {
    GET_WAREHOUSES = 'GET_WAREHOUSES',
    GET_LAST_CODE = 'GET_LAST_CODE',
    GET_PRODUCT_BATCHES = 'GET_PRODUCT_BATCHES',
    CREATE_WAREHOUSE = 'CREATE_WAREHOUSE',
    CREATE_WAREHOUSE_INITIAL_INVENTORY = 'CREATE_WAREHOUSE_INITIAL_INVENTORY',
    DELETE_WAREHOUSE = 'DELETE_WAREHOUSE',
    UPDATE_WAREHOUSE = 'UPDATE_WAREHOUSE',
    WAREHOUSE_CONFIG = 'WAREHOUSE_CONFIG',
    GET_DYNAMIC_REQUEST = 'GET_DYNAMIC_REQUEST',
    GET_WAREHOUSES_WITH_PRODUCTS = 'GET_WAREHOUSES_WITH_PRODUCTS',
    GET_MINI_STOCK_WAREHOUSES = 'GET_MINI_STOCK_WAREHOUSES',
    SET_RESPONSE = 'SET_RESPONSE',
    SET_STATUS_CODE_MINIMUM_LEVEL = 'SET_STATUS_CODE_MINIMUM_LEVEL',
    SET_WITH_CODE = 'SET_WITH_CODE',
    GET_INVOICES_KARDEX = 'GET_INVOICES_KARDEX',
    GET_WAREHOUSE_DETAIL = 'GET_WAREHOUSE_DETAIL',
    ERROR = 'ERROR',
}

export interface IGetWarehouses {
    type: ActionKeys.GET_WAREHOUSES;
    warehouses: IGenericRecord[];
}

export interface ICreateWarehouse {
    type: ActionKeys.CREATE_WAREHOUSE;
    createWarehouse: IGenericRecord;
}
export interface ICreateInitialInventory {
    type: ActionKeys.CREATE_WAREHOUSE_INITIAL_INVENTORY;
    createInitialInventory: IGenericRecord;
}

export interface IDeleteWarehouse {
    type: ActionKeys.DELETE_WAREHOUSE;
    deleteWarehouse: IGenericRecord[];
}

export interface IUpdateWarehouse {
    type: ActionKeys.UPDATE_WAREHOUSE;
    updateWarehouse: IGenericRecord[];
}

export interface IWarehouseConfig {
    type: ActionKeys.WAREHOUSE_CONFIG;
    warehouseConfig: IGenericRecord[];
}
export interface IGetLastCode {
    type: ActionKeys.GET_LAST_CODE;
    lastCode: IGenericRecord;
}

export interface IGetDynamicRequest {
    type: ActionKeys.GET_DYNAMIC_REQUEST;
    dynamicRequest: IGenericRecord[];
}

export interface IGetWarehousesWithProducts {
    type: ActionKeys.GET_WAREHOUSES_WITH_PRODUCTS;
    warehousesWithProducts: IWarehousesWithProducts[];
}

export interface IGetMiniStockWarehouse {
    type: ActionKeys.GET_MINI_STOCK_WAREHOUSES;
    miniStockWarehouse: IGenericRecord[];
}

export interface IResponse {
    type: ActionKeys.SET_RESPONSE;
    response: number | string;
}

export interface IGetWarehouseDetail {
    type: ActionKeys.GET_WAREHOUSE_DETAIL;
    payload: IGenericRecord;
}

export interface IError {
    type: ActionKeys.ERROR;
    error: string;
}

export interface ISetStatusCodeMinimumLevel {
    type: ActionKeys.SET_STATUS_CODE_MINIMUM_LEVEL;
    statusCode: number;
}

export interface ISetInvoicesKardex {
    type: ActionKeys.GET_INVOICES_KARDEX;
    warehouseInvoicesKardex: IGenericRecord[];
}

export interface ISetWithCode {
    type: ActionKeys.SET_WITH_CODE;
}

export type WarehousesActions =
    | IGetWarehouses
    | ICreateWarehouse
    | ICreateInitialInventory
    | IDeleteWarehouse
    | IUpdateWarehouse
    | IGetDynamicRequest
    | IWarehouseConfig
    | IGetWarehousesWithProducts
    | IGetMiniStockWarehouse
    | IResponse
    | ISetStatusCodeMinimumLevel
    | ISetWithCode
    | IGetLastCode
    | ISetInvoicesKardex
    | IGetWarehouseDetail
    | IError;
