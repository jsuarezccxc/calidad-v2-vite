import { ActionKeys, PoliticsActions } from './types';
import { IGenericRecord } from '@models/GenericRecord';

interface IPoliticsReducer {
    statusCode: number | string;
    politics: IGenericRecord[];
    politicsPurposes: IGenericRecord[];
    isDelete: boolean;
    error?: string;
}

const initialState = {
    statusCode: '',
    politics: [],
    politicsPurposes: [],
    isDelete: false,
    error: '',
};

export const reducer = (state: IPoliticsReducer = initialState, action: PoliticsActions): IPoliticsReducer => {
    switch (action.type) {
        case ActionKeys.SET_STATUS_CODE:
            return {
                ...state,
                statusCode: action.statusCode,
            };
        case ActionKeys.GET_POLITICS:
            return {
                ...state,
                politics: action.politics,
                isDelete: action.isDelete,
            };
        case ActionKeys.GET_POLITICS_PURPOSES:
            return {
                ...state,
                politicsPurposes: action.politicsPurposes,
            };
        case ActionKeys.ERROR:
            return {
                ...state,
                error: action.error,
            };
        default:
            return state;
    }
};
