import { IGenericRecord } from '@models/GenericRecord';

export enum ActionKeys {
    GET_LIST_PRODUCTS = 'GET_LIST_PRODUCTS',
    DELETE_LIST_PRODUCT = 'DELETE_LIST_PRODUCTS',
    SET_ERROR = 'SET_ERROR',
}

/**
 * This interface describes redux type
 *
 * @typeParam type: string - Redux type
 * @typeParam payload: IGenericRecord - Redux request data
 */
export interface IGetListProducts {
    type: ActionKeys.GET_LIST_PRODUCTS;
    payload: IGenericRecord;
}

/**
 * This interface describes redux type
 *
 * @typeParam type: string - Redux type
 */
export interface IDeleteListProduct {
    type: ActionKeys.DELETE_LIST_PRODUCT;
}

/**
 * This interface describes redux error
 *
 * @typeParam type: string - Redux action
 * @typeParam error: string - Redux request error
 */
export interface ISetError {
    type: ActionKeys.SET_ERROR;
    error: string;
}

export type PurchaseReportActions = IGetListProducts | IDeleteListProduct | ISetError;
