import { IOnboardingRedux } from '@components/onboarding';

export enum ActionKeys {
    GET_ONBOARDING_DATA = 'GET_ONBIARDING_DATA',
    SET_ERROR = 'SET_ERROR',
}

export interface IGetOnboardingData {
    type: ActionKeys.GET_ONBOARDING_DATA;
    data: IOnboardingRedux;
}

export interface ISetError {
    type: ActionKeys.SET_ERROR;
    error: string;
}

export type OnboardingActions = IGetOnboardingData | ISetError;
