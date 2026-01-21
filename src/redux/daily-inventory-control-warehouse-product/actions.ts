import { FetchRequest } from '@models/Request';
import { ThunkAction, ThunkDispatch } from 'redux-thunk';
import { RootState } from '@redux/rootReducer';
import {
    ActionKeys,
    DailyStockWarehouseProductActions,
    IGetStockWarehouseProductInventory,
    ISetError,
} from '@redux/daily-inventory-control-warehouse-product/types';
import { IGenericRecord } from '@models/GenericRecord';
import { apiPostInventory } from '@api/inventory';
import { urls } from '@api/urls';

export const getStockDailyWarehouseProduct = (payload: IGenericRecord[]): IGetStockWarehouseProductInventory => ({
    type: ActionKeys.GET_STOCK_WAREHOUSE_PRODUCT_INVENTORY,
    payload,
});

export const setError = (error: string): ISetError => ({
    type: ActionKeys.SET_ERROR,
    error,
});

export const getStockWarehouseProducts = (data: {
    date: number;
}): ThunkAction<Promise<void>, RootState, null, DailyStockWarehouseProductActions> => {
    return async (dispatch: ThunkDispatch<RootState, null, DailyStockWarehouseProductActions>): Promise<void> => {
        try {
            const request = new FetchRequest(urls.inventory.dailyStock, data);
            // eslint-disable-next-line
            const response: any = await apiPostInventory(request);
            dispatch(getStockDailyWarehouseProduct(response.statusCode === 200 ? removeEmptyStock(response.data) : []));
        } catch (error) {
            dispatch(getStockDailyWarehouseProduct([]));
            dispatch(setError(String(error)));
        }
    };
};

/**
 * Function that removes the items with empty stock
 *
 * @param stockList: IGenericRecord[] - Stock list
 * @returns IGenericRecord[]
 */
export const removeEmptyStock = (stockList: IGenericRecord[]): IGenericRecord[] => {
    return stockList?.map(item => ({
        ...item,
        products: item.products
            ?.map((product: IGenericRecord) => ({
                ...product,
                unique_products: product.unique_products?.filter((uniqueProduct: IGenericRecord) => uniqueProduct),
            }))
            ?.filter((product: IGenericRecord) => product.unique_products?.length),
    }));
};
