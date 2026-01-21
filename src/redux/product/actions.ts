/* eslint-disable @typescript-eslint/no-explicit-any */
import { ThunkAction, ThunkDispatch } from 'redux-thunk';
import { RootState } from '@redux/rootReducer';
import { FetchRequest } from '@models/Request';
import { IGenericRecord } from '@models/GenericRecord';
import { ICategory } from '@models/Inventory';
import { apiDeleteInventory, apiGetInventory, apiPostInventory, apiPutInventory } from '@api/inventory';
import { urls } from '@api/urls';
import {
    ISetError,
    ActionKeys,
    ProductActions,
    ISetCategories,
    ISetCategoryVariants,
    ISetBuiltItem,
    ISetCategoryCatalog,
    ISetSkuValidation,
} from './types';
import { getUserData } from '@utils/User';
import { isCorrectResponse } from '@utils/Response';
import { currentDateInUnix } from '@utils/Date';
import { IVariant } from '@models/Taxes';
import { urlsToDeleteVariants, SKU_UNIQUE_PRODUCT } from '@constants/Product';

const getProductPostUrl = ({ is_product: isProduct, is_perishable: isPerishable }: IGenericRecord): string => {
    const { postService, postNonPerishableProduct, postPerishable } = urls.product;
    return isProduct ? (isPerishable ? postPerishable : postNonPerishableProduct) : postService;
};

export const setCategories = (categories: ICategory[]): ISetCategories => ({
    type: ActionKeys.SET_CATEGORIES,
    payload: categories,
});

export const setCategoryVariants = (variants: IGenericRecord[]): ISetCategoryVariants => ({
    type: ActionKeys.SET_CATEGORY_VARIANTS,
    payload: variants,
});

export const setBuiltItem = (builtItem: IGenericRecord): ISetBuiltItem => ({
    type: ActionKeys.SET_BUILT_ITEM,
    payload: builtItem,
});

export const setCategoryCatalog = (category: IGenericRecord[]): ISetCategoryCatalog => ({
    type: ActionKeys.SET_CATEGORY_CATALOG,
    payload: category,
});

export const setSkuValidation = (validation: IGenericRecord): ISetSkuValidation => ({
    type: ActionKeys.SET_SKU_VALIDATION,
    payload: validation,
});

export const setError = (error: string): ISetError => ({
    type: ActionKeys.SET_ERROR,
    payload: error,
});

export const getCategories = (): ThunkAction<Promise<void>, RootState, null, ProductActions> => {
    return async (dispatch: ThunkDispatch<RootState, null, ProductActions>): Promise<void> => {
        try {
            const { company_id } = getUserData();
            const request = new FetchRequest(urls.product.getCategories(company_id));
            const { data }: any = await apiGetInventory(request);
            if (data) dispatch(setCategories(data?.filter((item: IGenericRecord) => item.product_types.length)));
        } catch (error) {
            dispatch(setCategories([]));
        }
    };
};

export const getCategoryVariants = (productTypeId: string): ThunkAction<Promise<void>, RootState, null, ProductActions> => {
    return async (dispatch: ThunkDispatch<RootState, null, ProductActions>): Promise<void> => {
        try {
            const request = new FetchRequest(urls.product.getCategoryVariants(productTypeId));
            const { data }: any = await apiGetInventory(request);
            dispatch(setCategoryVariants(data || []));
        } catch (error) {
            dispatch(setCategoryVariants([]));
        }
    };
};

export const updateCategory = ({
    id,
    value: name,
}: IGenericRecord): ThunkAction<Promise<boolean>, RootState, null, ProductActions> => {
    // return async (dispatch: ThunkDispatch<RootState, null, ProductActions>): Promise<boolean> => {
    return async (dispatch: ThunkDispatch<RootState, null, ProductActions>): Promise<boolean> => {
        try {
            const { company_id } = getUserData();
            const request = new FetchRequest(urls.product.updateCategory(id), {
                company_id,
                name,
            });
            const { statusCode }: any = await apiPutInventory(request);
            await Promise.all([dispatch(getCategories()), dispatch(getCategoryCatalog())]);
            return isCorrectResponse(statusCode);
        } catch (error) {
            dispatch(setError(String(error)));
            return false;
        }
    };
};

export const postCategory = (category: IGenericRecord): ThunkAction<Promise<boolean>, RootState, null, ProductActions> => {
    return async (dispatch: ThunkDispatch<RootState, null, ProductActions>): Promise<boolean> => {
        try {
            const { company_id } = getUserData();
            const request = new FetchRequest(urls.product.postCategory, {
                ...category,
                company_id,
            });
            const { data, statusCode }: any = await apiPostInventory(request);
            if (data) await dispatch(getCategories());
            return isCorrectResponse(statusCode);
        } catch (error) {
            dispatch(setError(String(error)));
            return false;
        }
    };
};

/**
 * It's used to update the variants and variant details
 */
export const updateVariant = ({
    id,
    name,
    product_type_id,
    variant_id = '',
}: IGenericRecord): ThunkAction<Promise<boolean>, RootState, null, ProductActions> => {
    return async (dispatch: ThunkDispatch<RootState, null, ProductActions>): Promise<boolean> => {
        try {
            const params = {
                item: variant_id ? { name, variant_id } : { name, product_type_id },
                url: variant_id ? urls.product.updateVariantDetail : urls.product.updateVariant,
            };
            const request = new FetchRequest(params.url(id), params.item);
            const { data, statusCode }: any = await apiPutInventory(request);
            if (data) await dispatch(getCategoryVariants(product_type_id));
            return isCorrectResponse(statusCode);
        } catch (error) {
            dispatch(setError(String(error)));
            return false;
        }
    };
};

export const postVariant = (variant: IGenericRecord): ThunkAction<Promise<boolean>, RootState, null, ProductActions> => {
    return async (dispatch: ThunkDispatch<RootState, null, ProductActions>): Promise<boolean> => {
        try {
            const request = new FetchRequest(urls.product.postVariant, variant);
            const { statusCode }: any = await apiPostInventory(request);
            await dispatch(getCategoryVariants(variant.product_type_id));
            return isCorrectResponse(statusCode);
        } catch (error) {
            dispatch(setError(String(error)));
            return false;
        }
    };
};

export const postVariantDetail = (detail: IGenericRecord): ThunkAction<Promise<boolean>, RootState, null, ProductActions> => {
    return async (dispatch: ThunkDispatch<RootState, null, ProductActions>): Promise<boolean> => {
        try {
            const request = new FetchRequest(urls.product.postVariantDetail, detail);
            const { statusCode }: any = await apiPostInventory(request);
            await dispatch(getCategoryVariants(detail.product_type_id));
            return isCorrectResponse(statusCode);
        } catch (error) {
            dispatch(setError(String(error)));
            return false;
        }
    };
};

/**
 * It's used to delete categories and variants
 */
export const deleteCategoryOrVariant = ({
    id,
    type,
    productTypeId = '',
}: IVariant): ThunkAction<Promise<void>, RootState, null, ProductActions> => {
    return async (dispatch: ThunkDispatch<RootState, null, ProductActions>): Promise<void> => {
        try {
            const request = new FetchRequest(urlsToDeleteVariants[type](id));
            const action = productTypeId ? getCategoryVariants(productTypeId) : getCategories();
            await apiDeleteInventory(request);
            await dispatch(action);
        } catch (error) {
            dispatch(setError(String(error)));
        }
    };
};

export const postProductOrService = (
    product: IGenericRecord
): ThunkAction<Promise<IGenericRecord>, RootState, null, ProductActions> => {
    return async (dispatch: ThunkDispatch<RootState, null, ProductActions>): Promise<IGenericRecord> => {
        try {
            const { company_id } = getUserData();
            if (!product.update) delete product.id;
            const request = new FetchRequest(getProductPostUrl(product), {
                ...product,
                company_id,
                date: currentDateInUnix(),
            });
            const { data, errors = {} }: any = await apiPostInventory(request);

            return {
                errors,
                success: !!data,
            };
        } catch (error) {
            dispatch(setError(String(error)));
            return {
                errors: String(error),
                success: false,
            };
        }
    };
};

/**
 * It's used to get categories of catalog
 */
export const getCategoryCatalog = (): ThunkAction<Promise<void>, RootState, null, ProductActions> => {
    return async (dispatch: ThunkDispatch<RootState, null, ProductActions>): Promise<void> => {
        try {
            const { company_id } = getUserData();
            const request = new FetchRequest(urls.product.getCategoryCatalog(company_id));
            const { data, statusCode }: any = await apiGetInventory(request);
            if (isCorrectResponse(statusCode)) {
                await dispatch(setCategoryCatalog(data));
            }
        } catch (error) {
            dispatch(setError(String(error)));
        }
    };
};

/**
 * It's used to validate duplicate products by sku
 */
export const validateSku = (sku: string): ThunkAction<Promise<void>, RootState, null, ProductActions> => {
    return async (dispatch: ThunkDispatch<RootState, null, ProductActions>): Promise<void> => {
        try {
            const request = new FetchRequest(urls.products.validateSku(sku));
            const { statusCode, data }: any = await apiGetInventory(request);
            if (isCorrectResponse(statusCode)) {
                localStorage.setItem(SKU_UNIQUE_PRODUCT, sku);
                dispatch(setSkuValidation(data));
            }
        } catch (error) {
            dispatch(setError(String(error)));
        }
    };
};

/**
 * It's used to get categories of catalog
 */
export const addCategoryCatalog = (category: IGenericRecord): ThunkAction<Promise<void>, RootState, null, ProductActions> => {
    return async (dispatch: ThunkDispatch<RootState, null, ProductActions>): Promise<void> => {
        try {
            const { company_id } = getUserData();
            const request = new FetchRequest(urls.product.postCategory, {
                ...category,
                company_id,
            });
            const { statusCode, data }: any = await apiPostInventory(request);
            if (isCorrectResponse(statusCode)) {
                dispatch(getCategoryCatalog());
                return data;
            }
        } catch (error) {
            dispatch(setError(String(error)));
        }
    };
};
