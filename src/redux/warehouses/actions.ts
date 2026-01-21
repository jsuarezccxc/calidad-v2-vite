/* eslint-disable @typescript-eslint/no-explicit-any */
import { ThunkAction, ThunkDispatch } from 'redux-thunk';
import { apiDeleteInventory, apiGetInventory, apiPostInventory, apiPutInventory } from '@api/inventory';
import { urls } from '@api/urls';
import { apiDynamicRequest } from '@api/utils';
import { PER_PAGE_RANGE } from '@constants/UtilsConstants';
import { IGenericRecord } from '@models/GenericRecord';
import { FetchRequest, HttpMethod } from '@models/Request';
import { IDataWarehouses, IWarehousesWithProducts } from '@models/Warehouse';
import { RootState } from '@redux/rootReducer';
import { isCorrectResponse } from '@utils/Response';
import { getNewWarehouses } from '@utils/Warehouse';
import {
    ActionKeys,
    ICreateInitialInventory,
    ICreateWarehouse,
    IDeleteWarehouse,
    IError,
    IGetDynamicRequest,
    IGetLastCode,
    IGetMiniStockWarehouse,
    IGetWarehouseDetail,
    IGetWarehouses,
    IGetWarehousesWithProducts,
    IResponse,
    ISetInvoicesKardex,
    ISetStatusCodeMinimumLevel,
    ISetWithCode,
    IUpdateWarehouse,
    WarehousesActions,
} from './types';

export const setWarehouses = (warehouses: IGenericRecord[]): IGetWarehouses => ({
    type: ActionKeys.GET_WAREHOUSES,
    warehouses,
});
export const setLastCode = (lastCode: IGenericRecord): IGetLastCode => ({
    type: ActionKeys.GET_LAST_CODE,
    lastCode,
});

export const setWarehousesWithProducts = (warehousesWithProducts: IWarehousesWithProducts[]): IGetWarehousesWithProducts => ({
    type: ActionKeys.GET_WAREHOUSES_WITH_PRODUCTS,
    warehousesWithProducts,
});

export const setMiniStockWarehouse = (miniStockWarehouse: IGenericRecord[]): IGetMiniStockWarehouse => ({
    type: ActionKeys.GET_MINI_STOCK_WAREHOUSES,
    miniStockWarehouse,
});

export const createWarehouses = (createWarehouse: IGenericRecord[]): ICreateWarehouse => ({
    type: ActionKeys.CREATE_WAREHOUSE,
    createWarehouse,
});
export const createInitialInventorys = (createInitialInventory: IGenericRecord[]): ICreateInitialInventory => ({
    type: ActionKeys.CREATE_WAREHOUSE_INITIAL_INVENTORY,
    createInitialInventory,
});

export const deleteWarehouse = (deleteWarehouse: IGenericRecord[]): IDeleteWarehouse => ({
    type: ActionKeys.DELETE_WAREHOUSE,
    deleteWarehouse,
});

export const updateWarehouses = (updateWarehouse: IGenericRecord[]): IUpdateWarehouse => ({
    type: ActionKeys.UPDATE_WAREHOUSE,
    updateWarehouse,
});

export const getDynamicRequest = (dynamicRequest: IGenericRecord[]): IGetDynamicRequest => ({
    type: ActionKeys.GET_DYNAMIC_REQUEST,
    dynamicRequest,
});

export const setResponse = (response: number | string): IResponse => ({
    type: ActionKeys.SET_RESPONSE,
    response,
});

export const setWithCode = (): ISetWithCode => ({
    type: ActionKeys.SET_WITH_CODE,
});

export const setInvoicesKardex = (warehouseInvoicesKardex: IGenericRecord[]): ISetInvoicesKardex => ({
    type: ActionKeys.GET_INVOICES_KARDEX,
    warehouseInvoicesKardex,
});

export const setWarehouseDetail = (payload: IGenericRecord): IGetWarehouseDetail => ({
    type: ActionKeys.GET_WAREHOUSE_DETAIL,
    payload,
});

export const setError = (error: string): IError => ({
    type: ActionKeys.ERROR,
    error,
});

export const getWarehousesData = (
    isList = false,
    search = ''
): ThunkAction<Promise<void>, RootState, null, WarehousesActions> => {
    return async (dispatch: ThunkDispatch<RootState, null, WarehousesActions>): Promise<void> => {
        try {
            const request = new FetchRequest(
                isList
                    ? `${urls.warehouses.get}?per_page=${PER_PAGE_RANGE}`
                    : search
                    ? `${urls.warehouses.get}?search=${search}`
                    : urls.warehouses.get
            );
            const { data }: any = await apiGetInventory(request);
            dispatch(setWarehouses(data));
            dispatch(setError(''));
        } catch (error) {
            dispatch(setError(String(error)));
        }
    };
};

export const getProductBatches = (unique_product_id: string): ThunkAction<Promise<void>, RootState, null, WarehousesActions> => {
    return async (dispatch: ThunkDispatch<RootState, null, WarehousesActions>): Promise<void> => {
        try {
            const request = new FetchRequest(urls.warehouses.getProductBatches, {
                unique_product_id,
            });
            const { data }: any = await apiPostInventory(request);
            return data || [];
        } catch (error) {
            dispatch(setError('Fallo interno del servidor'));
        }
    };
};

export const getLastCode = (): ThunkAction<Promise<void>, RootState, null, WarehousesActions> => {
    return async (dispatch: ThunkDispatch<RootState, null, WarehousesActions>): Promise<void> => {
        try {
            const request = new FetchRequest(urls.warehouses.getLastCodeWarehouse);
            const { data }: any = await apiGetInventory(request);
            dispatch(setLastCode(data));
        } catch (error) {
            dispatch(setError('Fallo interno del servidor'));
        }
    };
};

export const createWarehouse = (
    warehouses: IDataWarehouses[] | IGenericRecord[],
    runMethod: boolean
): ThunkAction<Promise<void>, RootState, null, WarehousesActions> => {
    return async (dispatch: ThunkDispatch<RootState, null, WarehousesActions>): Promise<void> => {
        try {
            const request = new FetchRequest(urls.inventory.warehouses, getNewWarehouses(warehouses));
            const { statusCode }: any = await apiPostInventory(request);

            if (runMethod && isCorrectResponse(statusCode)) {
                dispatch(getWarehousesData());
                dispatch(getLastCode());
            }
            return statusCode;
        } catch (error) {
            dispatch(setError('Fallo interno del servidor'));
        }
    };
};
export const createInitialInventory = (
    warehousesInventories: IGenericRecord[]
): ThunkAction<Promise<boolean>, RootState, null, WarehousesActions> => {
    return async (dispatch: ThunkDispatch<RootState, null, WarehousesActions>): Promise<boolean> => {
        try {
            const request = new FetchRequest(urls.warehouses.createInitialInventories, warehousesInventories);
            const { statusCode }: any = await apiPostInventory(request);
            if (isCorrectResponse(statusCode)) return true;
            return false;
        } catch (error) {
            dispatch(setError('Fallo interno del servidor'));
            return false;
        }
    };
};

export const updateWarehouse = (
    dataWarehouse: IDataWarehouses[]
): ThunkAction<Promise<void>, RootState, null, WarehousesActions> => {
    return async (dispatch: ThunkDispatch<RootState, null, WarehousesActions>): Promise<void> => {
        try {
            const request = new FetchRequest(urls.inventory.warehousesList, dataWarehouse);
            const { statusCode }: any = await apiPutInventory(request);
            if (isCorrectResponse(statusCode)) dispatch(getWarehousesData());
            return statusCode;
        } catch (error) {
            dispatch(setError('Fallo interno del servidor'));
        }
    };
};

export const updateUniqueWarehouse = (
    warehouse: IGenericRecord
): ThunkAction<Promise<void>, RootState, null, WarehousesActions> => {
    return async (dispatch: ThunkDispatch<RootState, null, WarehousesActions>): Promise<void> => {
        try {
            const request = new FetchRequest(urls.warehouses.putWarehouse(warehouse.id), warehouse);
            const { statusCode }: any = await apiPutInventory(request);
            if (isCorrectResponse(statusCode)) return statusCode;
        } catch (error) {
            dispatch(setError('Fallo interno del servidor'));
        }
    };
};

export const deleteWarehouses = (
    warehouse_id: IGenericRecord[] | string[]
): ThunkAction<Promise<boolean>, RootState, null, WarehousesActions> => {
    return async (dispatch: ThunkDispatch<RootState, null, WarehousesActions>): Promise<boolean> => {
        try {
            const request = new FetchRequest(urls.inventory.warehousesList, warehouse_id);
            const { data }: any = await apiDeleteInventory(request);
            dispatch(deleteWarehouse(data));
            await dispatch(getWarehousesData());
            if (!data.filter((row: IGenericRecord) => row.status === false).length) {
                return true;
            }
            return false;
        } catch (error) {
            dispatch(setError(String(error)));
            return false;
        }
    };
};

export const deleteWarehousesDataBase = (
    warehouse_id: string[]
): ThunkAction<Promise<any>, RootState, null, WarehousesActions> => {
    return async (dispatch: ThunkDispatch<RootState, null, WarehousesActions>): Promise<any> => {
        try {
            const request = new FetchRequest(urls.inventory.warehousesList, warehouse_id);

            const { data }: any = await apiDeleteInventory(request);
            dispatch(deleteWarehouse(data));
            await dispatch(getWarehousesData());
            return {
                inventory: data.by_strocks?.filter((row: IGenericRecord) => row.status === false) || [],
                invoices: data.by_invoices?.filter((row: IGenericRecord) => row.status === false) || [],
            };
        } catch (error) {
            dispatch(setError(String(error)));
        }
    };
};

export const getDynamicData = (
    dataRequest: string[] | IGenericRecord[]
): ThunkAction<Promise<void>, RootState, null, WarehousesActions> => {
    return async (dispatch: ThunkDispatch<RootState, null, WarehousesActions>): Promise<void> => {
        try {
            const request = new FetchRequest(urls.utils.dynamic_request, dataRequest);

            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const { data }: any = await apiDynamicRequest(request);
            dispatch(getDynamicRequest(data));
        } catch (error) {
            dispatch(setError(String(error)));
        }
    };
};

export const getWarehousesWithProducts = (): ThunkAction<Promise<void>, RootState, null, WarehousesActions> => {
    return async (dispatch: ThunkDispatch<RootState, null, WarehousesActions>): Promise<void> => {
        try {
            const request = new FetchRequest(urls.warehouses.getWarehousesProduct);
            const { data }: any = await apiGetInventory(request);
            dispatch(setWarehousesWithProducts(data));
        } catch (error) {
            dispatch(setError(String(error)));
        }
    };
};

export const getWarehousesMinimumProducts = (
    type: HttpMethod,
    dataMiniStock?: IGenericRecord,
    productWarehouse?: string,
    nextToSave = false
): ThunkAction<Promise<void>, RootState, null, WarehousesActions> => {
    return async (dispatch: ThunkDispatch<RootState, null, WarehousesActions>): Promise<void> => {
        try {
            const { warehouseMiniStock } = urls.warehouses;

            const url = HttpMethod.DELETE ? warehouseMiniStock(productWarehouse || '') : warehouseMiniStock('');
            const request = new FetchRequest(url, dataMiniStock || []);

            const action =
                type === HttpMethod.GET ? apiGetInventory : type === HttpMethod.POST ? apiPostInventory : apiDeleteInventory;

            const { data, statusCode }: any = await action(request);

            if (type === HttpMethod.GET) {
                dispatch(setMiniStockWarehouse(data));
                nextToSave && dispatch(setStatusCodeMinimumLevel(statusCode));
            }

            return statusCode;
        } catch (error) {
            dispatch(setError(String(error)));
        }
    };
};

export const setStatusCodeMinimumLevel = (statusCode: number): ISetStatusCodeMinimumLevel => ({
    type: ActionKeys.SET_STATUS_CODE_MINIMUM_LEVEL,
    statusCode,
});

export const getInvoiceKardex = (): ThunkAction<Promise<void>, RootState, null, WarehousesActions> => {
    return async (dispatch: ThunkDispatch<RootState, null, WarehousesActions>): Promise<void> => {
        try {
            const request = new FetchRequest(urls.warehouses.getInvoicesKardex);
            const { data }: any = await apiGetInventory(request);
            dispatch(setInvoicesKardex(data));
            dispatch(setError(''));
        } catch (error) {
            dispatch(setError(String(error)));
        }
    };
};

export const updateKardexWarehouse = (
    dataWarehouse: IDataWarehouses[]
): ThunkAction<Promise<boolean>, RootState, null, WarehousesActions> => {
    return async (dispatch: ThunkDispatch<RootState, null, WarehousesActions>): Promise<boolean> => {
        try {
            const request = new FetchRequest(urls.warehouses.updateWarehouseKardex, dataWarehouse);
            const { statusCode }: any = await apiPostInventory(request);
            if (isCorrectResponse(statusCode)) {
                dispatch(getInvoiceKardex());
                return true;
            }
            return false;
        } catch (error) {
            dispatch(setError('Fallo interno del servidor'));
            return false;
        }
    };
};

export const getWarehouseInitialInventory = (
    unique_product_id: string
): ThunkAction<Promise<void>, RootState, null, WarehousesActions> => {
    return async (dispatch: ThunkDispatch<RootState, null, WarehousesActions>): Promise<void> => {
        try {
            const request = new FetchRequest(urls.warehouses.getWarehouseInitialInventory(unique_product_id));
            const { data }: any = await apiGetInventory(request);
            return data || [];
        } catch (error) {
            dispatch(setError('Fallo interno del servidor'));
        }
    };
};

export const saveWarehouseInitialInventory = (
    inventoryData: IGenericRecord
): ThunkAction<Promise<boolean>, RootState, null, WarehousesActions> => {
    return async (dispatch: ThunkDispatch<RootState, null, WarehousesActions>): Promise<boolean> => {
        try {
            const request = new FetchRequest(urls.warehouses.saveWarehouseInitialInventory, inventoryData);
            const { statusCode }: any = await apiPostInventory(request);
            return isCorrectResponse(statusCode);
        } catch (error) {
            dispatch(setError('Fallo interno del servidor'));
            return false;
        }
    };
};

export const getDetailWarehouse = (idWarehouse: string): ThunkAction<Promise<void>, RootState, null, WarehousesActions> => {
    return async (dispatch: ThunkDispatch<RootState, null, WarehousesActions>): Promise<void> => {
        try {
            const request = new FetchRequest(urls.warehouses.getDetailWarehouse(idWarehouse));
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const { data, statusCode }: any = await apiGetInventory(request);
            if (isCorrectResponse(statusCode)) dispatch(setWarehouseDetail(data));
        } catch (error) {
            dispatch(setError('Fallo interno del servidor'));
        }
    };
};

export const validateDeletion = (
    dataWarehouses: IGenericRecord[]
): ThunkAction<Promise<IGenericRecord[]>, RootState, null, WarehousesActions> => {
    return async (dispatch: ThunkDispatch<RootState, null, WarehousesActions>): Promise<IGenericRecord[]> => {
        try {
            const request = new FetchRequest(urls.warehouses.validateDeletion, dataWarehouses);

            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const { data }: any = await apiDeleteInventory(request);
            return data || [];
        } catch (error) {
            dispatch(setError('Fallo interno del servidor'));
            return [];
        }
    };
};
