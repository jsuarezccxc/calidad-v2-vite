/* eslint-disable @typescript-eslint/no-explicit-any */
import { ThunkAction, ThunkDispatch } from 'redux-thunk';
import { RootState } from '@redux/rootReducer';
import { FetchRequest } from '@models/Request';
import { IDateData, IProductAndService } from '@models/Inventory';
import { IGenericRecord } from '@models/GenericRecord';
import {
    ISetProducts,
    ISetError,
    IRemovedProducts,
    ICrudProducts,
    ActionKeys,
    ProductActions,
    ISetAddProductAndService,
    ISetEditProduct,
    ISetEditService,
    ISetServices,
    ISetProductsAndServices,
    ISetProductDetail,
} from './types';
import { apiDeleteInventory, apiGetInventory, apiPostInventory } from '@api/inventory';
import { urls } from '@api/urls';
import { apiUploadRejectSupport } from '@api/invoice';
import { lengthGreaterThanZero } from '@utils/Length';
import { getUserData } from '@utils/User';
import { createFormData } from '@utils/FormData';
import { isCorrectResponse } from '@utils/Response';
import { SUCCESS_RESPONSE } from '@constants/StatusCodes';

export const getProducts = (): ThunkAction<Promise<void>, RootState, null, ProductActions> => {
    return async (dispatch: ThunkDispatch<RootState, null, ProductActions>): Promise<void> => {
        try {
            const { company_id } = getUserData();
            const request = new FetchRequest(urls.products.get(company_id));
            const { data }: any = await apiGetInventory(request);
            const [{ products = [], services = [] }] = data;
            await dispatch(setProducts(uniqueBatch(data[0]?.products)));
            dispatch(setServices(data[0]?.services));
            dispatch(setProductsAndServices([...products, ...services]));
        } catch (error) {
            dispatch(setError('error'));
        }
    };
};
export const transformBatches = (dataBatch: IGenericRecord[], isPerishable: boolean): IGenericRecord[] => {
    let batches: IGenericRecord[] = [];
    if (isPerishable) {
        dataBatch?.forEach(batch => {
            const batchID = batch?.batch_detail?.batch_id;
            if (batchID) {
                const currentBatch = batches?.find(batchFind => batchFind?.batch_id === batchID);
                if (currentBatch) {
                    batches = batches?.map((batchMap: IGenericRecord) => ({
                        ...batchMap,
                        dates:
                            batchMap?.batch_id === batch?.batch_detail?.batch_id
                                ? [
                                      ...batchMap?.dates,
                                      {
                                          date_expired: batch.batch_detail?.date_expired,
                                          date_purchase: batch.batch_detail?.date_purchase,
                                          date_id: batch.batch_detail?.id,
                                      },
                                  ]
                                : batchMap?.dates,
                    }));
                } else {
                    batches.push({
                        ...batch?.batch_detail,
                        dates: [
                            {
                                date_expired: batch?.batch_detail.date_expired,
                                date_purchase: batch?.batch_detail?.date_purchase,
                                date_id: batch.batch_detail?.id,
                            },
                        ],
                    });
                }
            }
        });

        return batches;
    }
    return [];
};

export const uniqueBatch = (data: IGenericRecord[]): IGenericRecord[] => {
    return lengthGreaterThanZero(data)
        ? data.map((itemMap: IGenericRecord) => {
              return { ...itemMap, unique_batch: transformBatches(itemMap.purchase_details, itemMap.is_perishable) };
          })
        : [];
};

export const deleteProducts = (ids: IGenericRecord[]): ThunkAction<Promise<void>, RootState, null, ProductActions> => {
    return async (dispatch: ThunkDispatch<RootState, null, ProductActions>): Promise<void> => {
        try {
            const { company_id } = getUserData();
            const request = new FetchRequest(urls.products.get(company_id), ids);
            await apiDeleteInventory(request);
            await dispatch(getProducts());
        } catch (error) {
            dispatch(setError(String(error)));
        }
    };
};

export const setProducts = (products: IGenericRecord[]): ISetProducts => ({
    type: ActionKeys.SET_PRODUCTS,
    products,
});

export const setServices = (services: IGenericRecord[]): ISetServices => ({
    type: ActionKeys.SET_SERVICES,
    services,
});

export const setCrudProducts = (crudProducts: IGenericRecord[]): ICrudProducts => ({
    type: ActionKeys.SET_CRUD_PRODUCTS,
    crudProducts,
});

export const setRemovedProducts = (products: IGenericRecord[]): IRemovedProducts => ({
    type: ActionKeys.SET_REMOVED_PRODUCTS,
    products,
});

export const setProductToEdit = (productToEdit: IGenericRecord): ISetEditProduct => ({
    type: ActionKeys.SET_EDIT_PRODUCT,
    productToEdit,
});

export const setServiceToEdit = (serviceToEdit: IGenericRecord): ISetEditService => ({
    type: ActionKeys.SET_EDIT_SERVICE,
    serviceToEdit,
});
export const setProductDetail = (productDetail: IGenericRecord): ISetProductDetail => ({
    type: ActionKeys.SET_PRODUCT_DETAIL,
    productDetail,
});

export const setProductsAndServices = (productsAndServices: IGenericRecord[]): ISetProductsAndServices => ({
    type: ActionKeys.SET_PRODUCTS_AND_SERVICES,
    productsAndServices,
});

export const setError = (error: string): ISetError => ({
    type: ActionKeys.SET_ERROR,
    error,
});

export const getAddProductsAndService = (
    data: IDateData,
    url: string
): ThunkAction<Promise<void>, RootState, null, ProductActions> => {
    return async (dispatch: ThunkDispatch<RootState, null, ProductActions>): Promise<void> => {
        try {
            const resourceParam: { [key: string]: string } = {
                added: 'adds',
                edited: 'updates',
                removed: 'deletes',
            };
            const request = new FetchRequest(urls.inventory.uniqueProducts(resourceParam[url]), data);
            const response: any = await apiPostInventory(request);
            if (SUCCESS_RESPONSE.includes(response.statusCode)) {
                dispatch(setAddProductsAndService(response.data));
            }
        } catch (error) {
            dispatch(setError(String(error)));
        }
    };
};

export const setAddProductsAndService = (addProductsAndServices: IProductAndService[]): ISetAddProductAndService => ({
    type: ActionKeys.SET_ADD_PRODUCTS_AND_SERVICES,
    addProductsAndServices,
});

export const postProduct = (
    product: IGenericRecord,
    images: IGenericRecord[]
): ThunkAction<Promise<boolean | void>, RootState, null, ProductActions> => {
    return async (dispatch: ThunkDispatch<RootState, null, ProductActions>): Promise<boolean | void> => {
        try {
            const { company_id } = getUserData();

            const formData = createFormData([
                { key: 'product', value: JSON.stringify({ ...product, company_id }) },
                ...images.map((image: IGenericRecord, index: number) => ({ key: `image${index}`, value: image.file })),
            ]);
            const request = new FetchRequest(urls.products.postProduct, formData);
            const { data, statusCode }: any = await apiUploadRejectSupport(request);
            if (isCorrectResponse(statusCode)) {
                dispatch(setProducts(data));
                return true;
            }
        } catch (error) {
            dispatch(setError(String(error)));
        }
    };
};

export const getProductDetails = (productId: string): ThunkAction<Promise<void>, RootState, null, ProductActions> => {
    return async (dispatch: ThunkDispatch<RootState, null, ProductActions>): Promise<void> => {
        try {
            const request = new FetchRequest(urls.product.getDetailProduct(productId));
            const { data, statusCode }: any = await apiGetInventory(request);
            if (isCorrectResponse(statusCode)) {
                await dispatch(setProductDetail(data));
            }
        } catch (error) {
            dispatch(setError(String(error)));
        }
    };
};
