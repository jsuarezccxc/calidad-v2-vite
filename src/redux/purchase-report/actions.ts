import { ThunkAction, ThunkDispatch } from 'redux-thunk';
import { RootState } from '@redux/rootReducer';
import { ActionKeys, PurchaseReportActions, ISetError } from '@redux/purchase-report/types';
import { IGenericRecord } from '@models/GenericRecord';
import { FetchRequest } from '@models/Request';
import { apiPostInvoice } from '@api/invoice';
import { urls } from '@api/urls';

export const setError = (error: string): ISetError => ({
    type: ActionKeys.SET_ERROR,
    error,
});

export const postSaveEvent = (data: IGenericRecord): ThunkAction<Promise<void>, RootState, null, PurchaseReportActions> => {
    return async (dispatch: ThunkDispatch<RootState, null, PurchaseReportActions>): Promise<void> => {
        try {
            const request = new FetchRequest(urls.suppliers.saveEvent, data);

            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const { statusCode }: any = await apiPostInvoice(request);
            return statusCode;
        } catch (error) {
            dispatch(setError(String(error)));
        }
    };
};
