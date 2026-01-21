import { ThunkAction, ThunkDispatch } from 'redux-thunk';
import { RootState } from '@redux/rootReducer';
import { FetchRequest } from '@models/Request';
import { IDataDashboardElectronicDocuments } from '@models/DashboardElectronicDocuments';
import { urls } from '@api/urls';
import { apiPostInvoice } from '@api/invoice';
import { ActionKeys, DashboardElectronicDocumentActions, ISetDataDashboard, ISetError } from './types';
import { isCorrectResponse } from '@utils/Response';

export const setDataDashboard = (data: IDataDashboardElectronicDocuments): ISetDataDashboard => ({
    type: ActionKeys.SET_DATA_DASHBOARD,
    data,
});

export const setError = (error: string): ISetError => ({
    type: ActionKeys.SET_ERROR,
    error,
});

export const getDataDashboard = (
    date: string
): ThunkAction<Promise<void>, RootState, null, DashboardElectronicDocumentActions> => {
    return async (dispatch: ThunkDispatch<RootState, null, DashboardElectronicDocumentActions>): Promise<void> => {
        try {
            const request = new FetchRequest(urls.invoice.getDataDashboard, {
                date,
            });
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const { data, statusCode }: any = await apiPostInvoice(request);
            if (isCorrectResponse(statusCode)) dispatch(setDataDashboard(data));
        } catch (error) {
            dispatch(setError(String(error)));
        }
    };
};
