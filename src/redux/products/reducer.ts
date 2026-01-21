import { ActionKeys, ProductActions } from './types';
import { IGenericRecord } from '@models/GenericRecord';
const {
    SET_PRODUCTS,
    SET_SERVICES,
    SET_REMOVED_PRODUCTS,
    SET_CRUD_PRODUCTS,
    SET_EDIT_PRODUCT,
    SET_EDIT_SERVICE,
    SET_ERROR,
    SET_ADD_PRODUCTS_AND_SERVICES,
    SET_PRODUCTS_AND_SERVICES,
    SET_PRODUCT_DETAIL,
} = ActionKeys;

interface IProducts {
    error: string;
    products: IGenericRecord[];
    services: IGenericRecord[];
    crudProducts: IGenericRecord[];
    filteredCrudProducts: IGenericRecord[];
    addProductsAndServices: IGenericRecord;
    productToEdit: IGenericRecord;
    serviceToEdit: IGenericRecord;
    productDetail: IGenericRecord;
    productsAndServices: IGenericRecord[];
}

const initialState = {
    error: '',
    products: [],
    services: [],
    crudProducts: [],
    filteredCrudProducts: [],
    addProductsAndServices: [],
    productToEdit: {},
    serviceToEdit: {},
    profitability: {},
    productsAndServices: [],
    productDetail: {},
};

export const reducer = (state: IProducts = initialState, action: ProductActions): IProducts => {
    switch (action.type) {
        case SET_REMOVED_PRODUCTS:
            return {
                ...state,
                products: action.products,
                error: '',
            };
        case SET_CRUD_PRODUCTS:
            return {
                ...state,
                crudProducts: action.crudProducts,
                filteredCrudProducts: action.crudProducts,
                error: '',
            };
        case SET_EDIT_PRODUCT:
            return {
                ...state,
                productToEdit: action.productToEdit,
                serviceToEdit: {},
                error: '',
            };
        case SET_EDIT_SERVICE:
            return {
                ...state,
                serviceToEdit: action.serviceToEdit,
                productToEdit: {},
                error: '',
            };
        case SET_SERVICES:
            return {
                ...state,
                services: action.services,
            };
        case SET_PRODUCTS:
            return {
                ...state,
                products: action.products,
            };
        case SET_PRODUCT_DETAIL:
            return {
                ...state,
                productDetail: action.productDetail,
            };
        case SET_ERROR:
            return {
                ...state,
                error: action.error,
            };
        case SET_ADD_PRODUCTS_AND_SERVICES:
            return {
                ...state,
                addProductsAndServices: action.addProductsAndServices,
            };

        case SET_PRODUCTS_AND_SERVICES:
            return {
                ...state,
                productsAndServices: action.productsAndServices,
            };

        default:
            return state;
    }
};
