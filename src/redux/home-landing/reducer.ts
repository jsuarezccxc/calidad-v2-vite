import { ActionKeys, HomeLandingActions } from './types';
import { IGenericRecord } from '@models/GenericRecord';

const { SET_ECONOMIC_DETAILS, SET_TRM_DATA, SET_USER_DATA, SET_FAILED_ERROR } = ActionKeys;

interface IEconomicState {
    economicDetails: IGenericRecord;
    trm: IGenericRecord;
    userData: IGenericRecord;
    error: string;
}

const initialState: IEconomicState = {
    economicDetails: [],
    trm: [],
    userData: {},
    error: '',
};

export const reducer = (state: IEconomicState = initialState, action: HomeLandingActions): IEconomicState => {
    switch (action.type) {
        case SET_ECONOMIC_DETAILS:
            return {
                ...state,
                economicDetails: action.economicDetails,
            };
        case SET_TRM_DATA:
            return {
                ...state,
                trm: action.trm,
            };
        case SET_USER_DATA:
            return {
                ...state,
                userData: action.userData,
            };
        case SET_FAILED_ERROR:
            return {
                ...state,
                error: action.error,
            };
        default:
            return state;
    }
};
