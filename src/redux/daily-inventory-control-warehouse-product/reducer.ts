import { IGenericRecord } from '@models/GenericRecord';
import { ActionKeys, DailyStockWarehouseProductActions } from '@redux/daily-inventory-control-warehouse-product/types';

const { GET_STOCK_WAREHOUSE_PRODUCT_INVENTORY, SET_ERROR } = ActionKeys;

interface IDailyStockWarehouseProductState {
    stockWarehouseProducts: IGenericRecord[];
    error: string;
}

const initialState: IDailyStockWarehouseProductState = {
    stockWarehouseProducts: [],
    error: '',
};

export const reducer = (
    state = initialState,
    action: DailyStockWarehouseProductActions
): IDailyStockWarehouseProductState => {
    switch (action.type) {
        case GET_STOCK_WAREHOUSE_PRODUCT_INVENTORY:
            return {
                ...state,
                stockWarehouseProducts: action.payload,
            };
        case SET_ERROR:
            return {
                ...state,
                error: action.error,
            };
        default:
            return state;
    }
};
