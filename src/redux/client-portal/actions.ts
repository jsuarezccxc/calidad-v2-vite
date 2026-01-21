import { ThunkAction, ThunkDispatch } from 'redux-thunk';
import { RootState } from '@redux/rootReducer';
import { ActionKeys, ClientPortalActions, IClientSelected, IGetDynamicRequest, ISetError, ISetStatusCode } from './types';
import { IGenericRecord } from '@models/GenericRecord';
import { FetchRequest } from '@models/Request';
import { urls } from '@api/urls';
import { apiPostUtils } from '@api/inventory';
import { apiDeleteInvoice, apiGetInvoice, apiPostInvoice, apiPutInvoice } from '@api/invoice';

export const setDynamicData = (dynamicData: IGenericRecord[]): IGetDynamicRequest => ({
    type: ActionKeys.GET_DYNAMIC_REQUEST,
    dynamicData,
});

export const setClientSelected = (clientSelected: IGenericRecord): IClientSelected => ({
    type: ActionKeys.CLIENT_SELECTED,
    clientSelected,
});

export const setStatusCode = (statusCode: number): ISetStatusCode => ({
    type: ActionKeys.SET_STATUS_CODE,
    statusCode,
});

export const setError = (error: string): ISetError => ({
    type: ActionKeys.SET_ERROR,
    error,
});

export const getDynamicRequest = (
    utilsRequest: string[]
): ThunkAction<Promise<void>, RootState, unknown, ClientPortalActions> => {
    return async (dispatch: ThunkDispatch<RootState, unknown, ClientPortalActions>): Promise<void> => {
        try {
            const request = new FetchRequest(urls.utils.dynamic_request, utilsRequest);
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const { data }: any = await apiPostUtils(request);
            dispatch(setDynamicData(data));
        } catch (error) {
            dispatch(setError(String(error)));
        }
    };
};

export const getClientById = (
    clientId: string,
    isAfterToSave = false
): ThunkAction<Promise<void>, RootState, unknown, ClientPortalActions> => {
    return async (dispatch: ThunkDispatch<RootState, unknown, ClientPortalActions>): Promise<void> => {
        try {
            const request = new FetchRequest(urls.clients.informationClient(clientId));
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const { data, statusCode }: any = await apiGetInvoice(request);
            dispatch(setClientSelected(data));
            isAfterToSave && dispatch(setStatusCode(statusCode));
        } catch (error) {
            dispatch(setError(String(error)));
        }
    };
};

export const createUpdateClientAddresses = (
    data: IGenericRecord[],
    isUpdate = false
): ThunkAction<Promise<void>, RootState, unknown, ClientPortalActions> => {
    return async (dispatch: ThunkDispatch<RootState, unknown, ClientPortalActions>): Promise<void> => {
        try {
            const request = new FetchRequest(urls.clientPortal.createUpdateAddress, data);
            const action = isUpdate ? apiPutInvoice : apiPostInvoice;
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const { statusCode }: any = await action(request);
            return statusCode;
        } catch (error) {
            dispatch(setError(String(error)));
        }
    };
};

export const deleteClientAddress = (
    addressId: string,
    customerId: string
): ThunkAction<Promise<void>, RootState, unknown, ClientPortalActions> => {
    return async (dispatch: ThunkDispatch<RootState, unknown, ClientPortalActions>): Promise<void> => {
        try {
            const request = new FetchRequest(urls.clientPortal.deleteAddress(addressId), []);
            await apiDeleteInvoice(request);
            await dispatch(getClientById(customerId));
        } catch (error) {
            dispatch(setError(String(error)));
        }
    };
};
