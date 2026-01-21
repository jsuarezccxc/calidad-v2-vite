import { ThunkAction, ThunkDispatch } from 'redux-thunk';
import { RootState } from '@redux/rootReducer';
import {
    ActionKeys,
    IError,
    IGetPurchasingManager,
    IGetSupportDocumentById,
    ISetSupportForm,
    SupportDocumentActions,
} from './types';
import { FetchRequest } from '@models/Request';
import { IGenericRecord } from '@models/GenericRecord';
import { urls } from '@api/urls';
import { apiGetInvoice, apiPostInvoice } from '@api/invoice';

export const setSupportForm = (form: IGenericRecord): ISetSupportForm => ({
    type: ActionKeys.SET_FORM,
    form,
});

export const setSupportDocumentById = (data: IGenericRecord): IGetSupportDocumentById => ({
    type: ActionKeys.GET_SUPPORT_DOCUMENT_BY_ID,
    data,
});

export const setPurchasingManager = (data: IGenericRecord[]): IGetPurchasingManager => ({
    type: ActionKeys.GET_PURCHASING_MANAGER,
    data,
});

export const setError = (error: string): IError => ({
    type: ActionKeys.SET_ERROR,
    error,
});

export const getDataPurchasingManager = (): ThunkAction<Promise<void>, RootState, null, IGetPurchasingManager> => {
    return async (dispatch: ThunkDispatch<RootState, null, SupportDocumentActions>): Promise<void> => {
        try {
            const request = new FetchRequest(urls.support.purchasingManager);
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const { data }: any = await apiGetInvoice(request);
            dispatch(setPurchasingManager(data));
        } catch (error) {
            dispatch(setError(String(error)));
        }
    };
};

export const storeSupportDocument = (
    store: IGenericRecord
): ThunkAction<Promise<void>, RootState, null, IGetPurchasingManager> => {
    return async (
        dispatch: ThunkDispatch<RootState, null, SupportDocumentActions>
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ): Promise<any> => {
        try {
            const request = new FetchRequest(urls.support.storeSupportDocument, store);
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const { statusCode, data }: any = await apiPostInvoice(request);
            return { statusCode, data };
        } catch (error) {
            dispatch(setError(String(error)));
        }
    };
};

export const getSupportDocumentById = (idDS: string): ThunkAction<Promise<void>, RootState, null, IGetSupportDocumentById> => {
    return async (dispatch: ThunkDispatch<RootState, null, SupportDocumentActions>): Promise<void> => {
        try {
            const request = new FetchRequest(urls.support.getSupportDocumentById(idDS));
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const { data }: any = await apiGetInvoice(request);
            dispatch(setSupportDocumentById(data));
        } catch (error) {
            dispatch(setError(String(error)));
        }
    };
};
