/* eslint-disable @typescript-eslint/no-explicit-any */
import { ThunkAction, ThunkDispatch } from 'redux-thunk';
import { RootState } from '@redux/rootReducer';
import { PER_PAGE_RANGE } from '@constants/UtilsConstants';
import { IGenericPaginationData } from '@constants/PaginationBack';
import { FetchRequest, HttpMethod } from '@models/Request';
import { IGenericRecord } from '@models/GenericRecord';
import { getUserData } from '@utils/User';
import { isCorrectResponse } from '@utils/Response';
import { urls } from '@api/urls';
import { apiBucketDelete } from '@api/bucket';
import { apiDeleteInventory, apiGetInventory, apiInventoryFiles, apiPostInventory, apiPutInventory } from '@api/inventory';
import {
    ActionKeys,
    ProductCatalogActions,
    ISetProductCatalog,
    ISetProduct,
    IGetProductEdit,
    ISetError,
    ISetInitialInventory,
    IGetProductServices,
    ISetReport,
    ISetCategories,
    ISetErrorDelete,
    ISetUniqueProduct,
    ISetProductCatalogWebsite,
} from './types';

export const uploadImage = (
    image: Blob,
    productId: string
): ThunkAction<Promise<void>, RootState, null, ProductCatalogActions> => {
    return async (dispatch: ThunkDispatch<RootState, null, ProductCatalogActions>): Promise<void> => {
        try {
            const formData = new FormData();
            formData.set('id', productId);
            formData.set('image', image);
            const request = new FetchRequest(urls.products.uploadImage, formData);
            Promise.all([await apiInventoryFiles(request), dispatch(getCatalog())]);
        } catch (error) {
            dispatch(setError(String(error)));
        }
    };
};

export const updateImage = (
    image: Blob,
    productId: string,
    bucketId: string
): ThunkAction<Promise<void>, RootState, null, ProductCatalogActions> => {
    return async (dispatch: ThunkDispatch<RootState, null, ProductCatalogActions>): Promise<void> => {
        try {
            const formData = new FormData();
            formData.set('id', productId);
            formData.set('image', image);
            formData.set('bucket_detail_id', bucketId);
            const request = new FetchRequest(urls.products.updateImage, formData);
            Promise.all([await apiInventoryFiles(request), dispatch(getCatalog())]);
        } catch (error) {
            dispatch(setError(String(error)));
        }
    };
};

export const getCatalog = (filterCatalog = false): ThunkAction<Promise<void>, RootState, null, ProductCatalogActions> => {
    return async (dispatch: ThunkDispatch<RootState, null, ProductCatalogActions>): Promise<void> => {
        try {
            const request = new FetchRequest(urls.products.getCatalog, {
                is_main: filterCatalog,
            });
            const { data }: any = await apiPostInventory(request);
            dispatch(setProductCatalog(data));
        } catch (error) {
            dispatch(setError(String(error)));
        }
    };
};

export const getCatalogWebsite = (isList = false): ThunkAction<Promise<void>, RootState, null, ProductCatalogActions> => {
    return async (dispatch: ThunkDispatch<RootState, null, ProductCatalogActions>): Promise<void> => {
        try {
            const request = new FetchRequest(
                isList ? `${urls.products.getCatalog}?per_page=${PER_PAGE_RANGE}` : urls.products.getCatalog
            );
            const { data }: any = await apiGetInventory(request);
            dispatch(setProductCatalogWebsite(data));
        } catch (error) {
            dispatch(setError(String(error)));
        }
    };
};

export const getInitialInventory = (idProduct: string): ThunkAction<Promise<void>, RootState, null, ProductCatalogActions> => {
    return async (dispatch: ThunkDispatch<RootState, null, ISetInitialInventory>): Promise<void> => {
        try {
            const request = new FetchRequest(urls.products.getInitialInventory(idProduct));
            const { data }: any = await apiGetInventory(request);
            dispatch(setInitialInventory(data));
        } catch (error) {
            dispatch(setInitialInventory([]));
        }
    };
};

export const updateProduct = (product: IGenericRecord): ThunkAction<Promise<void>, RootState, null, ProductCatalogActions> => {
    return async (dispatch: ThunkDispatch<RootState, null, ProductCatalogActions>): Promise<void> => {
        try {
            const request = new FetchRequest(urls.products.updateData, product);
            Promise.all([await apiPostInventory(request), dispatch(getCatalog())]);
        } catch (error) {
            dispatch(setError(String(error)));
        }
    };
};

export const deleteImage = (imageId: string): ThunkAction<Promise<void>, RootState, null, ProductCatalogActions> => {
    return async (dispatch: ThunkDispatch<RootState, null, ProductCatalogActions>): Promise<void> => {
        try {
            const request = new FetchRequest(urls.products.deleteImage(imageId));
            const { statusCode }: any = await apiBucketDelete(request);
            await dispatch(getCatalog());
            return statusCode;
        } catch (error) {
            dispatch(setError(String(error)));
        }
    };
};

export const getProductServices = (isList = false): ThunkAction<Promise<void>, RootState, null, ProductCatalogActions> => {
    return async (dispatch: ThunkDispatch<RootState, null, ProductCatalogActions>): Promise<void> => {
        try {
            const request = new FetchRequest(
                isList ? `${urls.products.getProductServices}?per_page=${PER_PAGE_RANGE}` : urls.products.getProductServices
            );
            const { data, statusCode }: any = await apiGetInventory(request);
            if (isCorrectResponse(statusCode)) {
                await dispatch(setProductServices(data));
            }
        } catch (error) {
            dispatch(setError(String(error)));
        }
    };
};

export const getUpdateProduct = (productId: string): ThunkAction<Promise<void>, RootState, null, ProductCatalogActions> => {
    return async (dispatch: ThunkDispatch<RootState, null, ProductCatalogActions>): Promise<void> => {
        try {
            const request = new FetchRequest(urls.inventory.getProductEdit(productId));
            const { data, statusCode }: any = await apiGetInventory(request);
            if (isCorrectResponse(statusCode)) {
                await dispatch(setProductEdit(data));
            }
        } catch (error) {
            dispatch(setError(String(error)));
        }
    };
};

/**
 * It's used to delete categories and variants
 */
export const deleteCategoryOrVariant = (
    listDelete: IGenericRecord[],
    report = false,
    getData = true
): ThunkAction<Promise<boolean>, RootState, null, ProductCatalogActions> => {
    return async (dispatch: ThunkDispatch<RootState, null, ProductCatalogActions>): Promise<boolean> => {
        try {
            const { company_id } = getUserData();
            const request = new FetchRequest(urls.products.deleteProductService(company_id), listDelete);
            const { statusCode, data }: any = await apiDeleteInventory(request);
            if (isCorrectResponse(statusCode)) {
                await dispatch(setErrorDelete(data));
                if (getData) {
                    const action = report ? getReport() : getProductServices();
                    dispatch(action);
                }
                return !!data.length;
            }
            return false;
        } catch (error) {
            dispatch(setError(String(error)));
            return false;
        }
    };
};

/**
 * It's used to update categories and variants
 */
export const updateCategoryOrVariant = (
    listUpdate: IGenericRecord
): ThunkAction<Promise<boolean>, RootState, boolean, ProductCatalogActions> => {
    return async (dispatch: ThunkDispatch<RootState, boolean, ProductCatalogActions>): Promise<any> => {
        try {
            const request = new FetchRequest(urls.products.getProductServices, listUpdate);
            const { data, statusCode }: any = await apiPutInventory(request);
            if (isCorrectResponse(statusCode)) {
                await dispatch(setProductServices(data));
                await dispatch(setReport(data));
                return true;
            }
        } catch (error) {
            dispatch(setError(String(error)));
        }
    };
};

export const getReport = (search = ''): ThunkAction<Promise<void>, RootState, null, ProductCatalogActions> => {
    return async (dispatch: ThunkDispatch<RootState, null, ProductCatalogActions>): Promise<void> => {
        try {
            const request = new FetchRequest(search ? `${urls.products.getReport}?search=${search}` : urls.products.getReport);
            const { data, statusCode }: any = await apiGetInventory(request);
            if (isCorrectResponse(statusCode)) {
                await dispatch(setReport({ ...data, method: HttpMethod.GET }));
            }
        } catch (error) {
            dispatch(setError(String(error)));
        }
    };
};

export const getCategories = (): ThunkAction<Promise<void>, RootState, null, ProductCatalogActions> => {
    return async (dispatch: ThunkDispatch<RootState, null, ProductCatalogActions>): Promise<void> => {
        try {
            const { company_id } = getUserData();
            const request = new FetchRequest(urls.product.getCatalogCategories(company_id));
            const { data, statusCode }: any = await apiGetInventory(request);
            if (isCorrectResponse(statusCode)) {
                dispatch(setCategories(data));
            }
        } catch (error) {
            dispatch(setError(String(error)));
        }
    };
};

export const getUniqueProductDetail = (
    productId: string,
    editCarrousel?: boolean
): ThunkAction<Promise<void>, RootState, null, ProductCatalogActions> => {
    return async (dispatch: ThunkDispatch<RootState, null, ProductCatalogActions>): Promise<void> => {
        try {
            const request = new FetchRequest(urls.product.getDetailProduct(productId));
            const { data, statusCode }: any = await apiGetInventory(request);
            if (isCorrectResponse(statusCode)) {
                if (editCarrousel) {
                    dispatch(setUniqueProduct({ ...data, editCarrousel }));
                } else {
                    dispatch(setUniqueProduct(data));
                }
            }
        } catch (error) {
            dispatch(setError(String(error)));
        }
    };
};

export const getUniqueProduct = (productId: string): ThunkAction<Promise<void>, RootState, null, ProductCatalogActions> => {
    return async (dispatch: ThunkDispatch<RootState, null, ProductCatalogActions>): Promise<void> => {
        try {
            const request = new FetchRequest(urls.product.getDetailProduct(productId));
            const { data, statusCode }: any = await apiGetInventory(request);
            if (isCorrectResponse(statusCode)) {
                return data;
            }
        } catch (error) {
            dispatch(setError(String(error)));
        }
    };
};

export const setProductCatalog = (catalog: IGenericRecord[]): ISetProductCatalog => ({
    type: ActionKeys.SET_PRODUCT_CATALOG,
    catalog,
});

export const setInitialInventory = (productInventory: IGenericRecord[]): ISetInitialInventory => ({
    type: ActionKeys.SET_PRODUCT_INITIAL_INVENTORY,
    productInventory,
});

export const setProduct = (product: IGenericRecord): ISetProduct => ({
    type: ActionKeys.SET_PRODUCT,
    product,
});

export const setProductEdit = (productEdit: IGenericRecord): IGetProductEdit => ({
    type: ActionKeys.GET_PRODUCT_EDIT,
    productEdit,
});

export const setProductServices = (catalog: IGenericPaginationData<IGenericRecord>): IGetProductServices => ({
    type: ActionKeys.GET_PRODUCT_SERVICES,
    catalog,
});

export const setReport = (report: IGenericPaginationData<IGenericRecord>): ISetReport => ({
    type: ActionKeys.GET_REPORT,
    report,
});

export const setCategories = (categories: IGenericRecord[]): ISetCategories => ({
    type: ActionKeys.SET_CATEGORIES,
    payload: categories,
});

export const setErrorDelete = (error: IGenericRecord[]): ISetErrorDelete => ({
    type: ActionKeys.SET_ERROR_DELETE,
    payload: error,
});

export const setUniqueProduct = (uniqueProduct: IGenericRecord[]): ISetUniqueProduct => ({
    type: ActionKeys.GET_UNIQUE_PRODUCT,
    payload: uniqueProduct,
});

export const setProductCatalogWebsite = (catalogWebsite: IGenericPaginationData<IGenericRecord>): ISetProductCatalogWebsite => ({
    type: ActionKeys.SET_PRODUCT_CATALOG_WEBSITE,
    catalogWebsite,
});

export const setError = (error: string): ISetError => ({
    type: ActionKeys.SET_ERROR,
    error,
});
