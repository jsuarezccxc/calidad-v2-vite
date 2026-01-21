import { IGenericPaginationData } from '@constants/PaginationBack';
import { IGenericRecord } from '@models/GenericRecord';

export enum ActionKeys {
    GET_PRODUCT_SERVICES = 'GET_PRODUCT_SERVICES',
    SET_PRODUCT_CATALOG = 'SET_PRODUCT_CATALOG',
    SET_PRODUCT_INITIAL_INVENTORY = 'SET_PRODUCT_INITIAL_INVENTORY',
    SET_PRODUCT = 'SET_PRODUCT',
    GET_PRODUCT_EDIT = 'GET_PRODUCT_EDIT',
    GET_REPORT = 'GET_REPORT',
    SET_ERROR = 'SET_ERROR',
    SET_CATEGORIES = 'SET_CATEGORIES',
    SET_ERROR_DELETE = 'SET_ERROR_DELETE',
    GET_UNIQUE_PRODUCT = 'GET_UNIQUE_PRODUCT',
    SET_PRODUCT_CATALOG_WEBSITE = 'SET_PRODUCT_CATALOG_WEBSITE',
}

export interface IGetProductServices {
    type: ActionKeys.GET_PRODUCT_SERVICES;
    catalog: IGenericPaginationData<IGenericRecord>;
}
export interface ISetProductCatalog {
    type: ActionKeys.SET_PRODUCT_CATALOG;
    catalog: IGenericRecord[];
}
export interface ISetInitialInventory {
    type: ActionKeys.SET_PRODUCT_INITIAL_INVENTORY;
    productInventory: IGenericRecord[];
}

export interface ISetReport {
    type: ActionKeys.GET_REPORT;
    report:IGenericPaginationData<IGenericRecord>;
}

export interface IGetProductEdit {
    type: ActionKeys.GET_PRODUCT_EDIT;
    productEdit: IGenericRecord;
}

export interface ISetProduct {
    type: ActionKeys.SET_PRODUCT;
    product: IGenericRecord;
}

export interface ISetCategories {
    type: ActionKeys.SET_CATEGORIES;
    payload: IGenericRecord[];
}

export interface ISetErrorDelete {
    type: ActionKeys.SET_ERROR_DELETE;
    payload: IGenericRecord[];
}
export interface ISetUniqueProduct {
    type: ActionKeys.GET_UNIQUE_PRODUCT;
    payload: IGenericRecord;
}

export interface ISetProductCatalogWebsite {
    type: ActionKeys.SET_PRODUCT_CATALOG_WEBSITE;
    catalogWebsite: IGenericPaginationData<IGenericRecord>;
}
export interface ISetError {
    type: ActionKeys.SET_ERROR;
    error: string;
}

export interface IProductCatalog {
    data: IGenericRecord[];
    meta: IGenericRecord;
    links: IGenericRecord;
}

export type ProductCatalogActions =
    | ISetProductCatalog
    | ISetProduct
    | IGetProductEdit
    | ISetError
    | ISetInitialInventory
    | IGetProductServices
    | ISetReport
    | ISetErrorDelete
    | ISetUniqueProduct
    | ISetCategories
    | ISetProductCatalogWebsite;
