import { ICategory } from '@models/Inventory';
import { IGenericRecord } from '@models/GenericRecord';
import { ActionKeys, ProductActions } from './types';

const { SET_CATEGORIES, SET_CATEGORY_VARIANTS, SET_ERROR, SET_BUILT_ITEM, SET_CATEGORY_CATALOG, SET_SKU_VALIDATION } = ActionKeys;

interface IProduct {
    categories: ICategory[];
    categoryVariants: IGenericRecord[];
    categoryCatalog: IGenericRecord[];
    item: IGenericRecord;
    builtItem: IGenericRecord;
    skuValidation: IGenericRecord;
    error: string;
}

const initialState = {
    categories: [],
    categoryVariants: [],
    categoryCatalog: [],
    item: {},
    builtItem: {
        id: '',
        category_id: '',
        categories: [],
        consumption_tax_id: '',
        ledger_account_id: '',
        type_transaction: '',
        tax_iva_id: '',
        unit_measurement_id: '',
        variants: [],
        name: '',
        tax_consumption_id: '',
        unit_measurement: '',
        is_product: false,
        unique_products: [],
        double: false,
    },
    skuValidation: {},
    error: '',
};

export const reducer = (state: IProduct = initialState, action: ProductActions): IProduct => {
    switch (action.type) {
        case SET_CATEGORIES:
            return {
                ...state,
                categories: action.payload,
            };
        case SET_CATEGORY_VARIANTS:
            return {
                ...state,
                categoryVariants: action.payload,
            };
        case SET_CATEGORY_CATALOG:
            return {
                ...state,
                categoryCatalog: action.payload,
            };
        case SET_BUILT_ITEM:
            return {
                ...state,
                builtItem: action.payload.builtItem,
                item: action.payload.item,
            };
        case SET_SKU_VALIDATION:
            return {
                ...state,
                skuValidation: action.payload,
            };
        case SET_ERROR:
            return {
                ...state,
                error: action.payload,
            };
        default:
            return state;
    }
};
