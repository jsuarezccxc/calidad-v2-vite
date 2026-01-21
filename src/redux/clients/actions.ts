import { ThunkAction, ThunkDispatch } from 'redux-thunk';
import { apiDeleteInvoice, apiGetInvoice, apiPostInvoice, apiPutInvoice, apiUpdateFile } from '@api/invoice';
import { urls } from '@api/urls';
import { FILE } from '@constants/File';
import { SUCCESS_RESPONSE } from '@constants/StatusCodes';
import { CUSTOMER } from '@constants/Supplier';
import { PER_PAGE_RANGE } from '@constants/UtilsConstants';
import { IGenericRecord } from '@models/GenericRecord';
import { IDateData } from '@models/Inventory';
import { FetchRequest } from '@models/Request';
import { IApiResponse } from '@models/ResponseApi';
import { IConsultClient, IConsultClientResponse } from '@models/ImportClient';
import { getClientById, setStatusCode } from '@redux/client-portal/actions';
import { ClientPortalActions } from '@redux/client-portal/types';
import { RootState } from '@redux/rootReducer';
import { getUserData } from '@utils/User';
import { createFormData } from '@utils/FormData';
import { isCorrectResponse } from '@utils/Response';
import {
    ActionKeys,
    ClientActions,
    IGetClients,
    IGetClientsThin,
    IGetSaleCorrections,
    IGetVoucher,
    ISetError,
    ISetInvoiceCorrection,
} from './types';

export const setClientsData = (clients: IGenericRecord[]): IGetClients => ({
    type: ActionKeys.GET_CLIENTS,
    clients,
});

export const setClientsThin = (clientsThin: IGenericRecord[]): IGetClientsThin => ({
    type: ActionKeys.GET_CLIENTS_THIN,
    clientsThin,
});

export const setSaleCorrections = (saleCorrections: IGenericRecord): IGetSaleCorrections => ({
    type: ActionKeys.GET_SALE_CORRECTIONS,
    saleCorrections,
});

export const setVoucherInfo = (voucherInfo: IGenericRecord[]): IGetVoucher => ({
    type: ActionKeys.GET_VOUCHER,
    voucherInfo,
});

export const setInvoiceCorrection = (invoiceCorrection: IGenericRecord): ISetInvoiceCorrection => ({
    type: ActionKeys.SET_INVOICE_CORRECTION,
    invoiceCorrection,
});

export const setError = (error: string): ISetError => ({
    type: ActionKeys.SET_ERROR,
    error,
});

export const getClients = (isList = false, search =''): ThunkAction<Promise<void>, RootState, unknown, ClientActions> => {
    return async (dispatch: ThunkDispatch<RootState, unknown, ClientActions>): Promise<void> => {
        try {
            const request = new FetchRequest(isList? `${urls.clients.getAllClients}?per_page=${PER_PAGE_RANGE}` : search? `${urls.clients.getAllClients}?search=${search}` : urls.clients.getAllClients);
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const { data }: any = await apiGetInvoice(request);
            dispatch(setClientsData(data));
        } catch (error) {
            dispatch(setError(String(error)));
        }
    };
};

export const getClientsThin = (): ThunkAction<Promise<void>, RootState, unknown, ClientActions> => {
    return async (dispatch: ThunkDispatch<RootState, unknown, ClientActions>): Promise<void> => {
        try {
            const request = new FetchRequest(urls.clients.getAllClientsThin);
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const { data }: any = await apiGetInvoice(request);
            dispatch(setClientsThin(data));
        } catch (error) {
            dispatch(setError(String(error)));
        }
    };
};

export const updateClient = (
    clientId: string,
    clientToUpdate: IGenericRecord,
    customerId = ''
): ThunkAction<Promise<void>, RootState, unknown, ClientActions> => {
    return async (dispatch: ThunkDispatch<RootState, unknown, ClientActions | ClientPortalActions>): Promise<void> => {
        try {
            const request = new FetchRequest(urls.clients.updateClient(customerId), clientToUpdate);
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const { statusCode }: any = await apiPutInvoice(request);
            if (SUCCESS_RESPONSE.includes(statusCode)) {
                dispatch(getClientById(clientId, true));
                dispatch(getClients());
            } else {
                dispatch(setStatusCode(statusCode));
            }
            return statusCode;
        } catch (error) {
            dispatch(setError(String(error)));
        }
    };
};

export const getVoucherInformation = (
    invoiceId: string,
    type: string
): ThunkAction<Promise<void>, RootState, unknown, ClientActions> => {
    return async (dispatch: ThunkDispatch<RootState, unknown, ClientActions | ClientPortalActions>): Promise<void> => {
        try {
            const request = new FetchRequest(urls.clients.getVoucherInfo(invoiceId, type));
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const { data }: any = await apiGetInvoice(request);
            dispatch(setVoucherInfo(data));
        } catch (error) {
            dispatch(setError(String(error)));
        }
    };
};

export const getSaleCorrections = (dataRequest: IDateData): ThunkAction<Promise<void>, RootState, unknown, ClientActions> => {
    return async (dispatch: ThunkDispatch<RootState, unknown, ClientActions>): Promise<void> => {
        try {
            const request = new FetchRequest(urls.invoice.saleCorrections, dataRequest);
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const { data, statusCode }: any = await apiPostInvoice(request);
            if (SUCCESS_RESPONSE.includes(statusCode)) {
                const newData = data.table?.map((item: IGenericRecord) => {
                    item.client_name = `${item?.client?.name || ''} ${item?.client?.last_name || ''}`;
                    return { ...item };
                });
                dispatch(setSaleCorrections({ ...data, table: newData }));
            }
        } catch (error) {
            dispatch(setError(String(error)));
        }
    };
};

export const deleteClients = (ids: IGenericRecord[]): ThunkAction<Promise<IGenericRecord>, RootState, unknown, ClientActions> => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return async (dispatch: ThunkDispatch<RootState, unknown, ClientActions>): Promise<any> => {
        try {
            const request = new FetchRequest(urls.clients.deleteClients, ids);
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const { statusCode, data }: any = await apiDeleteInvoice(request);
            return { statusCode, data };
        } catch (error) {
            dispatch(setError(String(error)));
        }
    };
};

export const createClient = (data: IGenericRecord): ThunkAction<Promise<void>, RootState, unknown, ClientActions> => {
    return async (dispatch: ThunkDispatch<RootState, unknown, ClientActions>): Promise<void> => {
        try {
            const request = new FetchRequest(urls.clients.createClient, data);
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const response: any = await apiPostInvoice(request);
            return response;
        } catch (error) {
            dispatch(setError(String(error)));
        }
    };
};

export const validateCustomerFile = (xls: Blob, user: string): ThunkAction<Promise<void>, RootState, unknown, ClientActions> => {
    return async (dispatch: ThunkDispatch<RootState, unknown, ClientActions>): Promise<void> => {
        try {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const formData = createFormData([{ key: FILE, value: xls }]);

            const url = user === CUSTOMER ? urls.clients.validateFileCustomer : urls.suppliers.validateFileSuppliers;

            const request = new FetchRequest(url, formData);

            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const response: any = await apiUpdateFile(request);
            return response;
        } catch (error) {
            dispatch(setError(String(error)));
        }
    };
};

export const createCustomerFile = (
    data: IGenericRecord,
    isCustomer = true
): ThunkAction<Promise<void>, RootState, unknown, ClientActions> => {
    return async (dispatch: ThunkDispatch<RootState, unknown, ClientActions>): Promise<void> => {
        try {
            const request = new FetchRequest(
                isCustomer ? urls.clients.createFileCustomer : urls.suppliers.createFileSuppliers,
                data
            );
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const { statusCode }: any = await apiPostInvoice(request);
            return statusCode;
        } catch (error) {
            dispatch(setError(String(error)));
        }
    };
};

export const validateExistence = (client: IGenericRecord): ThunkAction<Promise<void>, RootState, unknown, ClientActions> => {
    return async (dispatch: ThunkDispatch<RootState, unknown, ClientActions>): Promise<void> => {
        try {
            const { company_id } = getUserData();
            const request = new FetchRequest(urls.clients.validateExistence(company_id), client);
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const { data }: any = await apiPostInvoice(request);
            return data;
        } catch (error) {
            dispatch(setError(String(error)));
        }
    };
};

export const postConsultClientInDIAN = (clientSearch: Required<IConsultClient>): ThunkAction<Promise<IConsultClientResponse | void>, RootState, unknown, ClientActions> => {
    return async (dispatch: ThunkDispatch<RootState, unknown, ClientActions>): Promise<IConsultClientResponse | void> => {
        try {
            const request = new FetchRequest(urls.clients.postConsultClient, clientSearch);
            const { data, statusCode } = await apiPostInvoice(request) as IApiResponse<IConsultClientResponse>;
            if (isCorrectResponse(statusCode) && data) return data;
        } catch (error) {
            dispatch(setError(String(error)));
        }
    };
}

export const postImportClientInDIAN = (clientDIAN: IConsultClientResponse): ThunkAction<Promise<IGenericRecord | void>, RootState, unknown, ClientActions> => {
    return async (dispatch: ThunkDispatch<RootState, unknown, ClientActions>): Promise<IGenericRecord | void> => {
        try {
            const request = new FetchRequest(urls.clients.postImportClient, clientDIAN);
            const { statusCode, data } = await apiPostInvoice(request) as IApiResponse<IGenericRecord>;
            if (isCorrectResponse(statusCode)) return data;
        } catch (error) {
            dispatch(setError(String(error)));
        }
    };
}
