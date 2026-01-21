import { ActionKeys, OnboardingActions } from './types';
import { IOnboardingRedux } from '@components/onboarding';

const { GET_ONBOARDING_DATA, SET_ERROR } = ActionKeys;

interface IOnboarding {
    onboardingData: IOnboardingRedux;
    error: string;
}

const initialState: IOnboarding = {
    onboardingData: {
        electronic_documents: {setToggleOnboarding: () => {}, steps: []},
        website: {setToggleOnboarding: () => {}, steps: []},
    },
    error: '',
};

export const reducer = (state = initialState, action: OnboardingActions): IOnboarding => {
    switch (action.type) {
        case GET_ONBOARDING_DATA:
            return {
                ...state,
                onboardingData: action.data,
            };
        case SET_ERROR:
            return {
                ...state,
                error: action.error,
            };
        default:
            return state;
    }
};
