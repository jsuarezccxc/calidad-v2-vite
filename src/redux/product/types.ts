import { IGenericRecord } from '@models/GenericRecord';
import { ICategory } from '@models/Inventory';

export enum ActionKeys {
    SET_CATEGORIES = 'SET_CATEGORIES',
    SET_CATEGORY_VARIANTS = 'SET_CATEGORY_VARIANTS',
    SET_CATEGORY_CATALOG = 'SET_CATEGORY_CATALOG',
    SET_BUILT_ITEM = 'SET_BUILT_ITEM',
    SET_SKU_VALIDATION = 'SET_SKU_VALIDATION',
    SET_ERROR = 'SET_ERROR',
}

export interface ISetCategories {
    type: ActionKeys.SET_CATEGORIES;
    payload: ICategory[];
}

export interface ISetCategoryVariants {
    type: ActionKeys.SET_CATEGORY_VARIANTS;
    payload: IGenericRecord[];
}

export interface ISetCategoryCatalog {
    type: ActionKeys.SET_CATEGORY_CATALOG;
    payload: IGenericRecord[];
}

export interface ISetSkuValidation {
    type: ActionKeys.SET_SKU_VALIDATION;
    payload: IGenericRecord;
}
export interface ISetBuiltItem {
    type: ActionKeys.SET_BUILT_ITEM;
    payload: IGenericRecord;
}

export interface ISetError {
    type: ActionKeys.SET_ERROR;
    payload: string;
}

export type ProductActions =
    | ISetCategories
    | ISetCategoryVariants
    | ISetBuiltItem
    | ISetError
    | ISetCategoryCatalog
    | ISetSkuValidation;
