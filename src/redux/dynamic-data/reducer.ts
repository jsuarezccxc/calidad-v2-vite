import { IGenericRecord } from '@models/GenericRecord';
import { ActionKeys, DynamicDataActions } from './types';

interface IDynamicData {
    dynamicData: IGenericRecord;
    error: string;
}

const initialState = {
    dynamicData: {},
    error: '',
};

export const reducer = (state: IDynamicData = initialState, action: DynamicDataActions): IDynamicData => {
    switch (action.type) {
        case ActionKeys.SET_DYNAMIC_DATA:
            return {
                ...state,
                dynamicData: action.dynamicData,
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
