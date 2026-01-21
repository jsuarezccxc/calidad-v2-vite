import { ThunkAction, ThunkDispatch } from 'redux-thunk';
import { RootState } from '@redux/rootReducer';
import { urls } from '@api/urls';
import { apiGetContingency, apiPostFileContingency, apiPutContingency } from '@api/contingency';
import { FetchRequest } from '@models/Request';
import { IGenericRecord } from '@models/GenericRecord';
import { IContingencyHistory } from '@models/ContingencyHistory';
import { IContingencyActivation, IUpdateContingency } from '@models/ContingencyActivation';
import { createFormData } from '@utils/FormData';
import { isCorrectResponse } from '@utils/Response';
import { ActionKeys, ContingencyActions, ISetContingencies, ISetContingency, ISetError } from './types';

export const setContingencies = (contingencies: IContingencyHistory[]): ISetContingencies => ({
    type: ActionKeys.SetContingencies,
    contingencies,
});

export const setContingency = (contingency: IContingencyHistory): ISetContingency => ({
    type: ActionKeys.SetContingency,
    contingency,
});

export const setError = (error: string): ISetError => ({
    type: ActionKeys.SetError,
    error,
});

export const getContingencyHistory = (): ThunkAction<Promise<void>, RootState, unknown, ContingencyActions> => {
    return async (dispatch: ThunkDispatch<RootState, unknown, ContingencyActions>): Promise<void> => {
        try {
            const request = new FetchRequest(urls.contingency.main);
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const { data, statusCode }: any = await apiGetContingency(request);
            if (isCorrectResponse(statusCode)) dispatch(setContingencies(data));
        } catch (error) {
            dispatch(setError(String(error)));
        }
    };
};

export const postContingencyActivation = (
    contingency: IContingencyActivation
): ThunkAction<Promise<IGenericRecord>, RootState, unknown, ContingencyActions> => {
    return async (dispatch: ThunkDispatch<RootState, unknown, ContingencyActions>): Promise<IGenericRecord> => {
        try {
            const formData = createFormData(
                Object.keys(contingency).map(key => ({
                    key,
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    value: contingency[key as keyof IContingencyActivation] as any,
                }))
            );
            const request = new FetchRequest(urls.contingency.main, formData);
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const response: any = await apiPostFileContingency(request);
            return response;
        } catch (error) {
            dispatch(setError(String(error)));
            return {
                statusCode: 400,
            };
        }
    };
};

export const putContingency = (
    id: string,
    updateContingency: IUpdateContingency
): ThunkAction<Promise<IGenericRecord>, RootState, unknown, ContingencyActions> => {
    return async (dispatch: ThunkDispatch<RootState, unknown, ContingencyActions>): Promise<IGenericRecord> => {
        try {
            const request = new FetchRequest(urls.contingency.put(id), updateContingency);
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const response: any = await apiPutContingency(request);
            return response;
        } catch (error) {
            dispatch(setError(String(error)));
            return {
                statusCode: 400,
            };
        }
    };
};

export const getContingency = (): ThunkAction<Promise<void>, RootState, unknown, ContingencyActions> => {
    return async (dispatch: ThunkDispatch<RootState, unknown, ContingencyActions>): Promise<void> => {
        try {
            const request = new FetchRequest(urls.contingency.getContingency);
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const { data, statusCode }: any = await apiGetContingency(request);
            if (isCorrectResponse(statusCode) && data) dispatch(setContingency(data));
        } catch (error) {
            dispatch(setError(String(error)));
        }
    };
};
