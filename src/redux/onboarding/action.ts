import { ThunkAction, ThunkDispatch } from 'redux-thunk';
import { urls } from '@api/urls';
import { apiGetBinnacle } from '@api/binnacle';
import { IGenericRecord } from '@models/GenericRecord';
import { FetchRequest } from '@models/Request';
import { RootState } from '@redux/rootReducer';
import { apiPutInstructions } from '@api/instructions';
import { ActionKeys, OnboardingActions, ISetError, IGetOnboardingData } from './types';

export const setOnboardingData = (data: IGenericRecord[]): IGetOnboardingData => ({
    type: ActionKeys.GET_ONBOARDING_DATA,
    data,
});

export const setError = (error: string): ISetError => ({
    type: ActionKeys.SET_ERROR,
    error,
});

export const getOnboardingInformation = (): ThunkAction<Promise<void>, RootState, null, OnboardingActions> => {
    return async (dispatch: ThunkDispatch<RootState, null, OnboardingActions>): Promise<void> => {
        try {
            const request = new FetchRequest(urls.onboarding.get);

            // eslint-disable-next-line
            const { data }: any = await apiGetBinnacle(request);
            dispatch(setOnboardingData(data));
            return data;
        } catch (error) {
            dispatch(setError(String(error)));
        }
    };
};

export const updateOnboardingFinalModal = (isWebsite = false): ThunkAction<Promise<void>, RootState, null, OnboardingActions> => {
    return async (dispatch: ThunkDispatch<RootState, null, OnboardingActions>): Promise<void> => {
        try {
            const payload = isWebsite
                ? { status_modal_website: true }
                : { status_modal_electronic: true };
            const request = new FetchRequest(urls.instructions.main, payload);
            // eslint-disable-next-line
            const { status }: any = await apiPutInstructions(request);
            return status;
        } catch (error) {
            dispatch(setError(String(error)));
        }
    };
};
