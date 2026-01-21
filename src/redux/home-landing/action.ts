import { ActionKeys, HomeLandingActions, ISetEconomicDetails, ISetFailedError, ISetTrmData, ISetUserData } from './types';
import { ThunkAction, ThunkDispatch } from 'redux-thunk';
import { RootState } from '@redux/rootReducer';
import { IGenericRecord } from '@models/GenericRecord';
import { urls } from '@api/urls';
import { apiGetUser, apiUpdateUser } from '@api/users';
import { FetchRequest } from '@models/Request';
import { getUserData as getUserDataUtils } from '@utils/User';

export const setFailedError = (error: string): ISetFailedError => ({
    type: ActionKeys.SET_FAILED_ERROR,
    error,
});

export const setEconomicData = (economicDetails: IGenericRecord): ISetEconomicDetails => ({
    type: ActionKeys.SET_ECONOMIC_DETAILS,
    economicDetails,
});

export const setUserData = (userData: IGenericRecord): ISetUserData => ({
    type: ActionKeys.SET_USER_DATA,
    userData,
});

export const setTrmData = (trm: IGenericRecord): ISetTrmData => ({
    type: ActionKeys.SET_TRM_DATA,
    trm,
});

export const getEconomicData = (): ThunkAction<Promise<void>, RootState, unknown, HomeLandingActions> => {
    return async (dispatch: ThunkDispatch<RootState, unknown, HomeLandingActions>): Promise<void> => {
        try {
            const res = await fetch(urls.homeLanding.trm);
            if (!res.ok) throw new Error(String(res.status));
            const data = (await res.json()) as IGenericRecord;
            dispatch(setTrmData(data));
        } catch (error) {
            dispatch(setFailedError(String(error)));
        }
    };
};

export const setIsNotFirstLogin = (): ThunkAction<Promise<void>, RootState, unknown, HomeLandingActions> => {
    return async (dispatch: ThunkDispatch<RootState, unknown, HomeLandingActions>): Promise<void> => {
        try {
            const { id: user_id } = getUserDataUtils();
            const request = new FetchRequest(urls.updateIsFirstLogin(user_id), []);
            await apiUpdateUser(request);
        } catch (error) {
            dispatch(setFailedError(String(error)));
        }
    };
};

export const getUserData = (): ThunkAction<Promise<void>, RootState, unknown, HomeLandingActions> => {
    return async (dispatch: ThunkDispatch<RootState, unknown, HomeLandingActions>): Promise<void> => {
        try {
            const request = new FetchRequest(urls.userData);
            const data = (await apiGetUser(request)) as IGenericRecord;
            dispatch(setUserData(data));
        } catch (error) {
            dispatch(setFailedError(String(error)));
        }
    };
};
