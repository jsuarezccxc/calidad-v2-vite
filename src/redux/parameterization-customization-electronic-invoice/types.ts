import { IFileResponse } from '@models/File';
import { IGenericRecord } from '@models/GenericRecord';

export enum ActionKeys {
    GET_PREFIX_COMPANY = 'GET_PREFIX_COMPANY',
    GET_PREFIX_SYNCHRONIZE_COMPANY = 'GET_PREFIX_SYNCHRONIZE_COMPANY',
    STORE_PREFIX = 'STORE_PREFIX',
    STORE_PREFIX_NOTES = 'STORE_PREFIX_NOTES',
    SET_ERROR = 'SET_ERROR',
    GET_FILE_RUT = 'GET_FILE_RUT',
    GET_FILE_LOGO = 'GET_FILE_LOGO',
    SET_CERTIFICATE_INFO = 'SET_CERTIFICATE_INFO',
    SET_UTILS = 'SET_UTILS',
    GET_PREFIX_PURCHASE_BY_COMPANY = 'GET_PREFIX_PURCHASE_BY_COMPANY',
}

/*
 * This interface describes redux type
 *
 * @typeParam type: string - Redux action
 * @typeParam payload: IGenericRecord[] - Redux request data
 */
export interface IGetPrefixCompany {
    type: ActionKeys.GET_PREFIX_COMPANY;
    payload: IGenericRecord[];
}

/*
 * This interface describes redux type
 *
 * @typeParam type: string - Redux action
 * @typeParam payload: IGenericRecord[] - Redux request data
 */
export interface IGetPrefixPurchaseByCompany {
    type: ActionKeys.GET_PREFIX_PURCHASE_BY_COMPANY;
    payload: IGenericRecord[];
}

/*
 * This interface describes redux type
 *
 * @typeParam type: string - Redux action
 * @typeParam payload: IGenericRecord[] - Redux request data
 */
export interface IGetPrefixSynchronizeCompany {
    type: ActionKeys.GET_PREFIX_SYNCHRONIZE_COMPANY;
    payload: IGenericRecord[];
}

/*
 * This interface describes redux type
 *
 * @typeParam type: string - Redux action
 * @typeParam file: IFileResponse - Redux request data
 */
export interface IGetFileRut {
    type: ActionKeys.GET_FILE_RUT;
    file: IFileResponse;
}

/*
 * This interface describes redux type
 *
 * @typeParam type: string - Redux action
 * @typeParam file: IFileResponse - Redux request data
 */
export interface IGetFileLogo {
    type: ActionKeys.GET_FILE_LOGO;
    file: IFileResponse;
}

/*
 * This interface describes redux error
 *
 * @typeParam type: string - Redux action
 * @typeParam error: string - Redux request error
 */
export interface ISetError {
    type: ActionKeys.SET_ERROR;
    error: string;
}

/*
 * This interface describes redux type
 *
 * @typeParam type: string - Redux action
 * @typeParam certificateInfo: IGenericRecord - Redux request data
 */
export interface IGetCertificateInfo {
    type: ActionKeys.SET_CERTIFICATE_INFO;
    certificateInfo: IGenericRecord;
}

/*
 * This interface describes a redux action
 *
 * @typeParam type: string - Action type
 * @typeParam payload: IGenericRecord - Payload to change the state
 */
export interface ISetUtils {
    type: ActionKeys.SET_UTILS;
    payload: IGenericRecord;
}

export const initialStateFile = {
    id: '',
    url: '',
    type: '',
    name: '',
    file_type: '',
    file_original_name: '',
};

export type parameterizationInvoice =
    | IGetPrefixCompany
    | IGetPrefixPurchaseByCompany
    | IGetFileLogo
    | IGetFileRut
    | IGetCertificateInfo
    | IGetPrefixSynchronizeCompany
    | ISetUtils
    | ISetError;
