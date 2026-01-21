import { IGenericPaginationData, paginationDataFormat } from '@constants/PaginationBack';
import { IGenericRecord } from '@models/GenericRecord';
import { ActionKeys, ProductCatalogActions } from './types';

const {
    SET_PRODUCT_CATALOG,
    SET_PRODUCT,
    GET_PRODUCT_EDIT,
    SET_ERROR,
    SET_PRODUCT_INITIAL_INVENTORY,
    GET_PRODUCT_SERVICES,
    GET_REPORT,
    SET_CATEGORIES,
    SET_ERROR_DELETE,
    GET_UNIQUE_PRODUCT,
    SET_PRODUCT_CATALOG_WEBSITE,
} = ActionKeys;

interface IProductCatalogState {
    error: string;
    catalog: IGenericRecord[];
    product: IGenericRecord;
    initial_inventory: IGenericRecord[];
    productServices: IGenericPaginationData<IGenericRecord>;
    productEdit: IGenericRecord;
    report: IGenericPaginationData<IGenericRecord>;
    categories: IGenericRecord[];
    errorDelete: IGenericRecord[];
    uniqueProduct: IGenericRecord;
    catalogWebsite:IGenericPaginationData<IGenericRecord>;
}

const initialState = {
    error: '',
    catalog: [],
    product: {},
    initial_inventory: [],
    productServices: paginationDataFormat,
    productEdit: {},
    report: paginationDataFormat,
    categories: [],
    uniqueProduct: {},
    errorDelete: [],
    catalogWebsite: paginationDataFormat,
};

export const reducer = (state: IProductCatalogState = initialState, action: ProductCatalogActions): IProductCatalogState => {
    switch (action.type) {
        case SET_PRODUCT_CATALOG:
            return {
                ...state,
                catalog: action.catalog,
            };
        case SET_PRODUCT:
            return {
                ...state,
                product: action.product,
            };
        case GET_PRODUCT_EDIT:
            return {
                ...state,
                productEdit: action.productEdit,
            };
        case SET_PRODUCT_INITIAL_INVENTORY:
            return {
                ...state,
                initial_inventory: action.productInventory,
            };
        case GET_PRODUCT_SERVICES:
            return {
                ...state,
                productServices: action.catalog,
            };
        case GET_REPORT:
            return {
                ...state,
                report: action.report,
            };
        case SET_CATEGORIES:
            return {
                ...state,
                categories: action.payload,
            };
        case SET_ERROR_DELETE:
            return {
                ...state,
                errorDelete: action.payload,
            };
        case GET_UNIQUE_PRODUCT:
            return {
                ...state,
                uniqueProduct: action.payload,
            };
        case SET_PRODUCT_CATALOG_WEBSITE:
            return {
                ...state,
                catalogWebsite: action.catalogWebsite,
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
