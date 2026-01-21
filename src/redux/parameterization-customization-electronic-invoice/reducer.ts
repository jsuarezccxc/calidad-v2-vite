import { IFileResponse } from '@models/File';
import { IGenericRecord } from '@models/GenericRecord';
import {
    ActionKeys,
    initialStateFile,
    parameterizationInvoice,
} from '@redux/parameterization-customization-electronic-invoice/types';

const {
    GET_PREFIX_COMPANY,
    GET_PREFIX_SYNCHRONIZE_COMPANY,
    SET_ERROR,
    GET_FILE_RUT,
    GET_FILE_LOGO,
    SET_CERTIFICATE_INFO,
    SET_UTILS,
    GET_PREFIX_PURCHASE_BY_COMPANY,
} = ActionKeys;

interface IParameterizationInvoiceState {
    storePrefix: IGenericRecord[];
    filesRut: IFileResponse;
    filesLogo: IFileResponse;
    certificateInfo: IGenericRecord;
    error: string;
    utils: IGenericRecord;
}

const initialState: IParameterizationInvoiceState = {
    storePrefix: [],
    filesRut: initialStateFile,
    filesLogo: initialStateFile,
    certificateInfo: {},
    utils: { tax_details: [], foreign_exchange: [], fiscal_responsibilities: [] },
    error: '',
};

export const reducer = (state = initialState, action: parameterizationInvoice): IParameterizationInvoiceState => {
    switch (action.type) {
        case GET_PREFIX_COMPANY:
            return {
                ...state,
                storePrefix: action.payload,
            };
        case GET_PREFIX_PURCHASE_BY_COMPANY:
            return {
                ...state,
                storePrefix: action.payload.map(item => {
                    return {
                        id: item.id,
                        name: item.prefix,
                        company_id: item.company_id,
                    };
                }),
            };
        case GET_PREFIX_SYNCHRONIZE_COMPANY:
            return {
                ...state,
                storePrefix: action.payload,
            };
        case GET_FILE_RUT:
            return {
                ...state,
                filesRut: action.file,
            };
        case GET_FILE_LOGO:
            return {
                ...state,
                filesLogo: action.file,
            };
        case SET_CERTIFICATE_INFO:
            return {
                ...state,
                certificateInfo: action.certificateInfo,
            };
        case SET_UTILS:
            return {
                ...state,
                utils: action.payload,
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
