/* eslint-disable @typescript-eslint/no-explicit-any */
import FileSaver from 'file-saver';
import { ThunkAction, ThunkDispatch } from 'redux-thunk';
import { apiFile } from '@api/file';
import { apiDeleteInventory, apiGetInventory, apiPostInventory } from '@api/inventory';
import { urls } from '@api/urls';
import { DELETE_COUNTRY_CITIES, DEPARTMENT } from '@constants/Inventory';
import { IGenericPaginationData } from '@constants/PaginationBack';
import { SUCCESS_RESPONSE } from '@constants/StatusCodes';
import { PER_PAGE_RANGE } from '@constants/UtilsConstants';
import { IFileRequest, IFileType } from '@models/File';
import { IGenericRecord } from '@models/GenericRecord';
import {
    ICategory,
    ICitiesProvisionServices,
    ICompanyShipping,
    IKardexMovement,
    IKardexMovementSaleOrPurchase,
    IQuantitiesProductWarehouse,
    ITaxes,
    IUnitMeasurement,
    IVariant,
    IWarehouseControlReport,
} from '@models/Inventory';
import { FetchRequest } from '@models/Request';
import { getUniqueProductStock } from '@redux/electronic-invoice/actions';
import { ElectronicInvoiceActions } from '@redux/electronic-invoice/types';
import { getAllNotifications } from '@redux/notifications/actions';
import { NotificationActions } from '@redux/notifications/types';
import { RootState } from '@redux/rootReducer';
import { fileType } from '@utils/File';
import { deleteShippingCost } from '@utils/Inventory';
import { isCorrectResponse } from '@utils/Response';
import { getUserData } from '@utils/User';
import {
    ActionKeys,
    IDeleteShippingCost,
    InventoryActions,
    ISetCategories,
    ISetFailedError,
    ISetKardexPoduct,
    ISetProvisionServices,
    ISetQuantitiesProductWarehouse,
    ISetShippingCost,
    ISetTaxes,
    ISetUniqueProductInventory,
    ISetUniqueProducts,
    ISetUnitMeasurements,
    ISetVariants,
    ISetWarehouseControlReport,
} from './types';

export const setCategories = (categories: ICategory[]): ISetCategories => ({
    type: ActionKeys.SET_CATEGORIES,
    categories,
});

export const setVariants = (variants: IVariant[]): ISetVariants => ({
    type: ActionKeys.SET_VARIANTS,
    variants,
});

export const setWarehouseControlReport = (warehouse_report: IWarehouseControlReport[]): ISetWarehouseControlReport => ({
    type: ActionKeys.SET_WAREHOUSE_CONTROL_REPORT,
    warehouse_report,
});

export const setUnitMeasurements = (unit_measurements: IUnitMeasurement[]): ISetUnitMeasurements => ({
    type: ActionKeys.SET_UNIT_MEASUREMENTS,
    unit_measurements,
});

export const setTaxes = (taxes: ITaxes[]): ISetTaxes => ({
    type: ActionKeys.SET_TAXES,
    taxes,
});

export const setKardexMovement = (kardexMovement: IGenericPaginationData<IKardexMovement>): ISetKardexPoduct => ({
    type: ActionKeys.SET_KARDEX_MOVEMENT,
    kardexMovement,
});

export const setFailedError = (error: string): ISetFailedError => ({
    type: ActionKeys.SET_FAILED_ERROR,
    error,
});

export const setProvisionServices = (provisionService: ICitiesProvisionServices[]): ISetProvisionServices => ({
    type: ActionKeys.SET_PROVISION_SERVICES,
    provisionService,
});

export const setProductShippingCost = (shipping_cost: ICompanyShipping): ISetShippingCost => ({
    type: ActionKeys.SET_SHIPPING_COST,
    shipping_cost,
});

export const setQuantitiesProductWarehouse = (
    quantitiesProductWarehouse: IQuantitiesProductWarehouse[]
): ISetQuantitiesProductWarehouse => ({
    type: ActionKeys.SET_QUANTITIES_PRODUCT_WAREHOUSE,
    quantitiesProductWarehouse,
});

export const setUniqueProducts = (unique_products: IGenericRecord[]): ISetUniqueProducts => ({
    type: ActionKeys.SET_UNIQUE_PRODUCTS,
    unique_products,
});

export const setUniqueProductInventory = (payload: IGenericRecord): ISetUniqueProductInventory => ({
    type: ActionKeys.SET_UNIQUE_PRODUCT_INVENTORY,
    payload,
});

export const deleteProductShippingCost = (delete_shipping_cost: number): IDeleteShippingCost => ({
    type: ActionKeys.DELETE_SHIPPING_COST,
    delete_shipping_cost,
});

export const getWarehouseControlReport = (
    start_date: Date | number,
    finish_date: Date | number
): ThunkAction<Promise<void>, RootState, unknown, InventoryActions> => {
    return async (dispatch: ThunkDispatch<RootState, unknown, InventoryActions>): Promise<void> => {
        try {
            const request = new FetchRequest(urls.inventory.warehouseControlReport, {
                start_date,
                finish_date,
            });
            const { data }: any = await apiPostInventory(request);
            dispatch(setWarehouseControlReport(data));
        } catch (error) {
            dispatch(setFailedError(String(error)));
        }
    };
};

export const getReportWarehouseControl = (
    dataFile: IFileRequest
): ThunkAction<Promise<void>, RootState, unknown, InventoryActions> => {
    return async (dispatch: ThunkDispatch<RootState, unknown, InventoryActions>): Promise<void> => {
        try {
            const request = new FetchRequest(urls.getFile, dataFile);
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const response: any = await apiFile(request);
            const blob = new Blob([response], {
                type: fileType[dataFile.type as keyof IFileType],
            });
            FileSaver.saveAs(blob, `warehouse-control-report.${dataFile.type}`);
        } catch (error) {
            dispatch(setFailedError(String(error)));
        }
    };
};

export const postSaveKardexDailyInventoryMovement = (
    movements: IKardexMovementSaleOrPurchase[],
    date: number
): ThunkAction<Promise<boolean>, RootState, null, InventoryActions> => {
    return async (
        dispatch: ThunkDispatch<RootState, null, InventoryActions | ElectronicInvoiceActions | NotificationActions>
    ): Promise<boolean> => {
        try {
            const request = new FetchRequest(urls.inventory.saveDailyMovementsInventory, movements);
            const { statusCode }: any = await apiPostInventory(request);
            if (SUCCESS_RESPONSE.includes(statusCode)) {
                await dispatch(getKardexDailyInventoryMovement(date, date));
                await dispatch(getUniqueProductStock());
                await dispatch(getAllNotifications());
                return true;
            }
            return false;
        } catch (error) {
            dispatch(setFailedError(String(error)));
            return false;
        }
    };
};

export const getKardexDailyInventoryMovement = (
    start_date: number,
    finish_date: number,
    isList = false,
    search = '',
    concept = '',
    order = ''
): ThunkAction<Promise<void>, RootState, unknown, InventoryActions> => {
    return async (dispatch: ThunkDispatch<RootState, unknown, InventoryActions>): Promise<void> => {
        try {
            const request = new FetchRequest(isList? `${urls.inventory.uniqueProducts('daily-movement')}?per_page=${PER_PAGE_RANGE}` : search ? `${urls.inventory.uniqueProducts('daily-movement')}?search=${search}` : urls.inventory.uniqueProducts('daily-movement'), {
                start_date,
                finish_date,
                concept, 
                order
            });
            const { data, statusCode }: any = await apiPostInventory(request);
            if (SUCCESS_RESPONSE.includes(statusCode)) {
                dispatch(setKardexMovement(data));
            }
        } catch (error) {
            dispatch(setFailedError(String(error)));
        }
    };
};

export const getReportKardexInventory = (
    dataFile: IFileRequest
): ThunkAction<Promise<void>, RootState, unknown, InventoryActions> => {
    return async (dispatch: ThunkDispatch<RootState, unknown, InventoryActions>): Promise<void> => {
        try {
            const request = new FetchRequest(urls.getFile, dataFile);
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const response: any = await apiFile(request);

            const blob = await response.blob();
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `Reporte de movimiento de inventario por documentos electrónicos.${dataFile.type}`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        } catch (error) {
            dispatch(setFailedError(String(error)));
        }
    };
};

export const postInformationProvisionServices = (
    data: IGenericRecord
): ThunkAction<Promise<void>, RootState, null, InventoryActions> => {
    return async (dispatch: ThunkDispatch<RootState, null, InventoryActions>): Promise<void> => {
        try {
            const request = new FetchRequest(urls.inventory.provisionServices, data);
            const { statusCode }: any = await apiPostInventory(request);
            return statusCode;
        } catch (error) {
            dispatch(setFailedError(String(error)));
        }
    };
};

export const getInformationProvisionServices = (): ThunkAction<Promise<void>, RootState, null, InventoryActions> => {
    return async (dispatch: ThunkDispatch<RootState, null, InventoryActions>): Promise<void> => {
        try {
            const request = new FetchRequest(urls.inventory.provisionServices);
            const { data }: any = await apiGetInventory(request);
            dispatch(setProvisionServices(data));
            dispatch(setFailedError(''));
        } catch (error) {
            dispatch(setFailedError(String(error)));
        }
    };
};

export const deleteProvisionServices = (
    data: IGenericRecord,
    type: string
): ThunkAction<Promise<void>, RootState, null, InventoryActions> => {
    return async (dispatch: ThunkDispatch<RootState, null, InventoryActions>): Promise<void> => {
        try {
            const url = type === DEPARTMENT ? urls.inventory.deleteDepartmentServices : urls.inventory.provisionServices;
            const request = new FetchRequest(url, data);
            const { statusCode }: any = await apiDeleteInventory(request);
            return statusCode;
        } catch (error) {
            dispatch(setFailedError(String(error)));
        }
    };
};

export const getQuantitiesProductWarehouse = (date: string): ThunkAction<Promise<void>, RootState, null, InventoryActions> => {
    return async (dispatch: ThunkDispatch<RootState, null, InventoryActions>): Promise<void> => {
        try {
            const request = new FetchRequest(urls.inventory.quantitiesProductWarehouse, { date });
            const { data }: any = await apiPostInventory(request);
            dispatch(setQuantitiesProductWarehouse(data));
            dispatch(setFailedError(''));
        } catch (error) {
            dispatch(setFailedError(String(error)));
        }
    };
};

export const getUniqueProducts = (): ThunkAction<Promise<void>, RootState, null, InventoryActions> => {
    return async (dispatch: ThunkDispatch<RootState, null, InventoryActions>): Promise<void> => {
        try {
            const { company_id } = getUserData();
            const request = new FetchRequest(urls.productsCompanyOnly(company_id));
            const { data }: any = await apiGetInventory(request);
            dispatch(setUniqueProducts(data));
            dispatch(setFailedError(''));
        } catch (error) {
            dispatch(setFailedError(String(error)));
        }
    };
};

export const getProductShippingCost = (): ThunkAction<Promise<void>, RootState, null, InventoryActions> => {
    return async (dispatch: ThunkDispatch<RootState, null, InventoryActions>): Promise<void> => {
        try {
            const { company_id } = getUserData();
            const request = new FetchRequest(urls.productShippingCost.getShippingCost(company_id));
            const { data }: any = await apiGetInventory(request);
            dispatch(setProductShippingCost(data));
            dispatch(setFailedError(''));
        } catch (error) {
            dispatch(setFailedError(String(error)));
        }
    };
};

export const postProductShipping = (data: IGenericRecord): ThunkAction<Promise<void>, RootState, null, InventoryActions> => {
    return async (dispatch: ThunkDispatch<RootState, null, InventoryActions>): Promise<any> => {
        try {
            const { company_id } = getUserData();
            const request = new FetchRequest(urls.productShippingCost.post, {
                ...data,
                company_id,
            });
            const { statusCode }: any = await apiPostInventory(request);
            dispatch(getProductShippingCost());
            return isCorrectResponse(statusCode);
        } catch (error) {
            dispatch(setFailedError(String(error)));
            return false;
        }
    };
};

export const deleteAdditionalProducts = (products: string[]): ThunkAction<Promise<void>, RootState, null, InventoryActions> => {
    return async (dispatch: ThunkDispatch<RootState, null, InventoryActions>): Promise<any> => {
        try {
            const request = new FetchRequest(urls.productShippingCost.deleteProduct, products);
            const { statusCode }: any = await apiDeleteInventory(request);
            await dispatch(getProductShippingCost());
            return isCorrectResponse(statusCode);
        } catch (error) {
            dispatch(setFailedError(String(error)));
            return false;
        }
    };
};

export const deleteProductShipping = (
    data: IGenericRecord,
    type = DELETE_COUNTRY_CITIES
): ThunkAction<Promise<void>, RootState, null, InventoryActions> => {
    return async (dispatch: ThunkDispatch<RootState, null, InventoryActions>): Promise<any> => {
        try {
            const resource = deleteShippingCost(type);
            const request = new FetchRequest(resource, data);
            const { statusCode }: any = await apiDeleteInventory(request);
            if (isCorrectResponse(statusCode)) await dispatch(getProductShippingCost());
            dispatch(deleteProductShippingCost(statusCode));
            return isCorrectResponse(statusCode);
        } catch (error) {
            dispatch(setFailedError(String(error)));
        }
    };
};

export const getUniqueProductInventory = (
    uniqueProductId: string
): ThunkAction<Promise<void>, RootState, null, InventoryActions> => {
    return async (dispatch: ThunkDispatch<RootState, null, InventoryActions>): Promise<void> => {
        try {
            const request = new FetchRequest(urls.inventory.getUniqueProductInventory(uniqueProductId));
            const { data }: any = await apiGetInventory(request);
            dispatch(setUniqueProductInventory(data));
        } catch (error) {
            dispatch(setFailedError(String(error)));
        }
    };
};

export const postUniqueProductInventory = (
    warehousesInventory: IGenericRecord[]
): ThunkAction<Promise<void>, RootState, null, InventoryActions> => {
    return async (dispatch: ThunkDispatch<RootState, null, InventoryActions>): Promise<void> => {
        try {
            const request = new FetchRequest(urls.warehouses.createInitialInventories, warehousesInventory);
            await apiPostInventory(request);
            dispatch(getUniqueProductInventory(warehousesInventory[0].unique_product_id));
        } catch (error) {
            dispatch(setFailedError(String(error)));
        }
    };
};
