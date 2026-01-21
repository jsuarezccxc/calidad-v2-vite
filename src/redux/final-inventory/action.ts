import { ThunkAction, ThunkDispatch } from 'redux-thunk';
import { RootState } from '@redux/rootReducer';
import { IGenericRecord } from '@models/GenericRecord';
import { FetchRequest } from '@models/Request';
import { urls } from '@api/urls';
import { apiPostInvoice } from '@api/invoice';
import { ActionKeys, ISetError, FinalInventoryActions, IGetSales } from './types';

export const setFinalInventorySales = (data: IGenericRecord[]): IGetSales => ({
    type: ActionKeys.GET_SALES,
    data,
});

export const setError = (error: string): ISetError => ({
    type: ActionKeys.SET_ERROR,
    error,
});

export const getFinalInventorySales = (
    types: IGenericRecord
): ThunkAction<Promise<void>, RootState, unknown, FinalInventoryActions> => {
    return async (dispatch: ThunkDispatch<RootState, unknown, FinalInventoryActions>): Promise<void> => {
        try {
            const request = new FetchRequest(urls.invoice.getFinalInventory, types);
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const { data }: any = await apiPostInvoice(request);
            dispatch(setFinalInventorySales(data));
        } catch (error) {
            dispatch(setError(String(error)));
        }
    };
};
