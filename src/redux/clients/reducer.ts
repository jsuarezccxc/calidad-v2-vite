import { IPaginatorBackend } from '@components/paginator-backend';
import { paginationDataFormat } from '@constants/PaginationBack';
import { IGenericRecord } from '@models/GenericRecord';
import { ActionKeys, ClientActions } from './types';

const {
    GET_CLIENTS,
    GET_CLIENTS_THIN,
    UPDATE_CLIENT,
    GET_SALE_CORRECTIONS,
    GET_VOUCHER,
    SET_INVOICE_CORRECTION,
    SET_ERROR,
} = ActionKeys;

interface IClients {
    clients: IPaginatorBackend<IGenericRecord>;
    clientsThin: IGenericRecord[];
    dataUpdated: IGenericRecord;
    saleCorrections: IGenericRecord;
    voucherInfo: IGenericRecord[];
    invoiceCorrection: IGenericRecord;
    error: string;
}

const initialState: IClients = {
    clients: paginationDataFormat,
    clientsThin: [],
    dataUpdated: {},
    saleCorrections: {},
    voucherInfo: [],
    invoiceCorrection: {},
    error: '',
};

export const reducer = (state = initialState, action: ClientActions): IClients => {
    switch (action.type) {
        case GET_CLIENTS:
            return {
                ...state,
                clients: action.clients,
            };
        case GET_CLIENTS_THIN:
            return {
                ...state,
                clientsThin: action.clientsThin,
            };
        case UPDATE_CLIENT:
            return {
                ...state,
                dataUpdated: action.dataUpdated,
            };
        case GET_SALE_CORRECTIONS:
            return {
                ...state,
                saleCorrections: action.saleCorrections,
            };
        case GET_VOUCHER:
            return {
                ...state,
                voucherInfo: action.voucherInfo,
            };
        case SET_INVOICE_CORRECTION:
            return {
                ...state,
                invoiceCorrection: action.invoiceCorrection,
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
