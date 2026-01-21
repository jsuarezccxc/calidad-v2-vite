import { IGenericRecord } from '@models/GenericRecord';

export enum ActionKeys {
    SET_PRODUCTS = 'SET_PRODUCTS',
    SET_SERVICES = 'SET_SERVICES',
    SET_REMOVED_PRODUCTS = 'SET_REMOVED_PRODUCTS',
    SET_CRUD_PRODUCTS = 'SET_CRUD_PRODUCTS',
    SET_ADD_PRODUCTS_AND_SERVICES = 'SET_ADD_PRODUCTS_AND_SERVICES',
    SET_EDIT_PRODUCT = 'SET_EDIT_PRODUCT',
    SET_EDIT_SERVICE = 'SET_EDIT_SERVICE',
    SET_PRODUCT_DETAIL = 'SET_PRODUCT_DETAIL',
    SET_ERROR = 'SET_ERROR',
    SET_PRODUCTS_AND_SERVICES = 'SET_PRODUCTS_AND_SERVICES',
    SET_UTILS = 'SET_UTILS',
}

export interface ISetProducts {
    type: ActionKeys.SET_PRODUCTS;
    products: IGenericRecord[];
}

export interface ISetServices {
    type: ActionKeys.SET_SERVICES;
    services: IGenericRecord[];
}

export interface IRemovedProducts {
    type: ActionKeys.SET_REMOVED_PRODUCTS;
    products: IGenericRecord[];
}

export interface ICrudProducts {
    type: ActionKeys.SET_CRUD_PRODUCTS;
    crudProducts: IGenericRecord[];
}

export interface ISetEditProduct {
    type: ActionKeys.SET_EDIT_PRODUCT;
    productToEdit: IGenericRecord;
}

export interface ISetEditService {
    type: ActionKeys.SET_EDIT_SERVICE;
    serviceToEdit: IGenericRecord;
}

export interface ISetError {
    type: ActionKeys.SET_ERROR;
    error: string;
}
export interface ISetAddProductAndService {
    type: ActionKeys.SET_ADD_PRODUCTS_AND_SERVICES;
    addProductsAndServices: IGenericRecord[];
}

export interface ISetProductsAndServices {
    type: ActionKeys.SET_PRODUCTS_AND_SERVICES;
    productsAndServices: IGenericRecord[];
}
export interface ISetProductDetail {
    type: ActionKeys.SET_PRODUCT_DETAIL;
    productDetail: IGenericRecord;
}
export interface ISetUtils {
    type: ActionKeys.SET_UTILS;
    payload: IGenericRecord;
}

export type ProductActions =
    | ISetProducts
    | ISetServices
    | IRemovedProducts
    | ICrudProducts
    | ISetAddProductAndService
    | ISetEditProduct
    | ISetEditService
    | ISetProductsAndServices
    | ISetUtils
    | ISetProductDetail
    | ISetError;
