import { ThunkAction, ThunkDispatch } from 'redux-thunk';
import { IGenericRecord } from '@models/GenericRecord';
import { RootState } from '@redux/rootReducer';
import { ActionKeys, DynamicDataActions, ISetDynamicData, ISetError } from './types';
import { urls } from '@api/urls';
import { apiPostUtils } from '@api/utils';
import { FetchRequest } from '@models/Request';

export const setDynamicData = (dynamicData: IGenericRecord): ISetDynamicData => ({
    type: ActionKeys.SET_DYNAMIC_DATA,
    dynamicData,
});

export const setError = (error: string): ISetError => ({
    type: ActionKeys.ERROR,
    error,
});

export const getDynamicRequest = (
    utilsRequest: string[]
): ThunkAction<Promise<boolean>, RootState, unknown, DynamicDataActions> => {
    return async (dispatch: ThunkDispatch<RootState, unknown, DynamicDataActions>): Promise<boolean> => {
        try {
            const request = new FetchRequest(urls.utils.dynamic_request, utilsRequest);
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const { data }: any = await apiPostUtils(request);
            await dispatch(setDynamicData(data));
            return true;
        } catch (error) {
            dispatch(setError(String(error)));
            return false;
        }
    };
};
