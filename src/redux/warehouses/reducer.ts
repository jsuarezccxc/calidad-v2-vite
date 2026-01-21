import { IGenericPaginationData, paginationDataFormat } from '@constants/PaginationBack';
import { IGenericRecord } from '@models/GenericRecord';
import { IWarehousesWithProducts } from '@models/Warehouse';
import { WarehousesActions, ActionKeys } from './types';

interface IWarehouses {
    warehouses: IGenericRecord[];
    lastCode: IGenericRecord;
    deleteWarehouse?: IGenericRecord[];
    updateWarehouse?: IGenericRecord[];
    warehouseInvoicesKardex: IGenericRecord[];
    getDynamicRequest?: IGenericRecord;
    miniStockWarehouse: IGenericRecord[];
    warehousesWithProducts?: IWarehousesWithProducts[];
    response: number | string;
    statusCode: number;
    withCode: boolean;
    warehouseList: IGenericPaginationData<IGenericRecord>;
    warehouseDetail: IGenericRecord;
    error?: string;
}

const initialState = {
    warehouses: [],
    lastCode: [],
    deleteWarehouse: [],
    updateWarehouse: [],
    getDynamicRequest: [],
    warehousesWithProducts: [],
    miniStockWarehouse: [],
    warehouseInvoicesKardex: [],
    response: '',
    warehouseList: paginationDataFormat,
    statusCode: 0,
    withCode: true,
    warehouseDetail: {},
    error: '',
};

export const reducer = (state: IWarehouses = initialState, action: WarehousesActions): IWarehouses => {
    switch (action.type) {
        case ActionKeys.GET_LAST_CODE:
            return {
                ...state,
                lastCode: action.lastCode,
            };
        case ActionKeys.GET_WAREHOUSES:
            return {
                ...state,
                warehouses: action.warehouses,
                warehouseList: action.warehouses[0]?.warehouses,
            };
        case ActionKeys.DELETE_WAREHOUSE:
            return {
                ...state,
                deleteWarehouse: action.deleteWarehouse,
            };
        case ActionKeys.UPDATE_WAREHOUSE:
            return {
                ...state,
                updateWarehouse: action.updateWarehouse,
            };
        case ActionKeys.GET_DYNAMIC_REQUEST:
            return {
                ...state,
                getDynamicRequest: action.dynamicRequest,
            };
        case ActionKeys.GET_WAREHOUSES_WITH_PRODUCTS:
            return {
                ...state,
                warehousesWithProducts: action.warehousesWithProducts,
            };
        case ActionKeys.GET_MINI_STOCK_WAREHOUSES:
            return {
                ...state,
                miniStockWarehouse: action.miniStockWarehouse,
            };
        case ActionKeys.SET_RESPONSE:
            return {
                ...state,
                response: action.response,
            };
        case ActionKeys.SET_STATUS_CODE_MINIMUM_LEVEL:
            return {
                ...state,
                statusCode: action.statusCode,
            };
        case ActionKeys.SET_WITH_CODE:
            return {
                ...state,
                withCode: !state.withCode,
            };
        case ActionKeys.GET_INVOICES_KARDEX:
            return {
                ...state,
                warehouseInvoicesKardex: action.warehouseInvoicesKardex,
            };
        case ActionKeys.GET_WAREHOUSE_DETAIL:
            return {
                ...state,
                warehouseDetail: action.payload,
            };
        case ActionKeys.ERROR:
            return {
                ...state,
                error: action.error,
            };
        default:
            return state;
    }
};
