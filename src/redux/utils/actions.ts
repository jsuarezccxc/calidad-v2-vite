/* eslint-disable @typescript-eslint/no-explicit-any */
import { ThunkAction, ThunkDispatch } from 'redux-thunk';
import { apiGetUtils } from '@api/inventory';
import { urls } from '@api/urls';
import { apiCustomQuery, apiDynamicRequest } from '@api/utils';
import { IGenericRecord } from '@models/GenericRecord';
import { FetchRequest, HttpMethod } from '@models/Request';
import { ILedgerAccount } from '@models/Utils';
import { RootState } from '@redux/rootReducer';
import { formatUtils } from '@utils/DynamicData';
import { ActionKeys, IGetCustomQuery, ISetError, ISetInflation, ISetLedgerAccounts, ISetUtils, UtilsActions } from './types';

export const setCustomQuery = (payload: IGenericRecord): IGetCustomQuery => ({
    type: ActionKeys.SET_CUSTOM_QUERY,
    infoCustomQuery: payload,
});

export const setUtils = (utils: IGenericRecord): ISetUtils => ({
    type: ActionKeys.SET_UTILS,
    payload: utils,
});

export const setLedgerAccounts = (ledgerAccounts: ILedgerAccount[]): ISetLedgerAccounts => ({
    type: ActionKeys.SET_LEDGER_ACCOUNTS,
    payload: ledgerAccounts,
});

export const setError = (error: string): ISetError => ({
    type: ActionKeys.SET_ERROR,
    error,
});

export const setInflation = (inflation: IGenericRecord): ISetInflation => ({
    type: ActionKeys.SET_INFLATION,
    payload: inflation,
});

export const getCustomQueryAction = (query: IGenericRecord): ThunkAction<Promise<void>, RootState, null, UtilsActions> => {
    return async (dispatch: ThunkDispatch<RootState, null, UtilsActions>): Promise<void> => {
        try {
            const request = new FetchRequest(urls.utils.customQuery, query);
            if (query) {
                const { data }: any = await apiCustomQuery(request);
                dispatch(setCustomQuery(data));
            }
        } catch (error) {
            dispatch(setError(String(error)));
        }
    };
};

export const getUtils = (utils: string[]): ThunkAction<Promise<void>, RootState, null, UtilsActions> => {
    return async (dispatch: ThunkDispatch<RootState, null, UtilsActions>): Promise<void> => {
        try {
            const request = new FetchRequest(urls.utils.dynamic_request, utils);
            const { data }: any = await apiDynamicRequest(request);
            if (data) dispatch(setUtils(formatUtils(data)));
        } catch (error) {
            dispatch(setError(String(error)));
        }
    };
};

export const getPaginationUrl = (param : IGenericRecord): ThunkAction<Promise<void>, RootState, null, UtilsActions>  => {
    return async (dispatch: ThunkDispatch<RootState, null, any>): Promise<void> => {
        try {
           const {
                url,
                setData,
                type,
                dataPost
            } = param;
            const request = type === HttpMethod.POST && dataPost? new FetchRequest('/'+url, dataPost) : new FetchRequest('/'+url);
            const { data }: any = await apiDynamicRequest(request, type);
            if (data) setData(data);
        } catch (error) {
            dispatch(setError(String(error)));
        }
    };
};

export const getLedgerAccounts = (): ThunkAction<Promise<void>, RootState, null, UtilsActions> => {
    return async (dispatch: ThunkDispatch<RootState, null, UtilsActions>): Promise<void> => {
        try {
            const request = new FetchRequest(urls.utils.getLedgerAccounts);
            const { data }: any = await apiGetUtils(request);
            if (data) dispatch(setLedgerAccounts(data));
        } catch (error) {
            dispatch(setLedgerAccounts([]));
        }
    };
};

export const getInflation = (): ThunkAction<Promise<void>, RootState, unknown, UtilsActions> => {
    return async (dispatch: ThunkDispatch<RootState, unknown, UtilsActions>): Promise<void> => {
        try {
            const request = new FetchRequest(urls.utils.getInflation);
            const { data }: any = await apiGetUtils(request);
            dispatch(setInflation(data));
        } catch (error) {
            dispatch(setError(String(error)));
        }
    };
};
