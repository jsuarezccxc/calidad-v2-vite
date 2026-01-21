import { ThunkAction, ThunkDispatch } from 'redux-thunk';
import { RootState } from '@redux/rootReducer';
import { ActionKeys, BinActions, ISetError, IGetBinData } from './types';
import { IGenericRecord } from '@models/GenericRecord';
import { urls } from '@api/urls';
import { apiGetBinnacle } from '@api/binnacle';
import { FetchRequest } from '@models/Request';

export const setBinData = (data: IGenericRecord[]): IGetBinData => ({
    type: ActionKeys.GET_BIN_DATA,
    data,
});

export const setError = (error: string): ISetError => ({
    type: ActionKeys.SET_ERROR,
    error,
});

export const getBinInformation = (): ThunkAction<Promise<void>, RootState, null, BinActions> => {
    return async (dispatch: ThunkDispatch<RootState, null, BinActions>): Promise<void> => {
        try {
            const request = new FetchRequest(urls.bin.get);
            // eslint-disable-next-line
            const { data }: any = await apiGetBinnacle(request);
            dispatch(setBinData(data));
        } catch (error) {
            dispatch(setError(String(error)));
        }
    };
};

export const restoreInformation = (restoreId: string): ThunkAction<Promise<void>, RootState, null, BinActions> => {
    return async (dispatch: ThunkDispatch<RootState, null, BinActions>): Promise<void> => {
        try {
            const request = new FetchRequest(urls.bin.restore(restoreId));
            await apiGetBinnacle(request);
            await dispatch(getBinInformation());
        } catch (error) {
            dispatch(setError(String(error)));
        }
    };
};
