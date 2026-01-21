import { FinalInventoryActions, ActionKeys } from './types';
import { IGenericRecord } from '@models/GenericRecord';

interface IFinalInventory {
    data: IGenericRecord[];
    error: string;
}

const initialState = {
    data: [],
    error: '',
};

export const reducer = (
    state: IFinalInventory = initialState,
    action: FinalInventoryActions
): IFinalInventory => {
    switch (action.type) {
        case ActionKeys.GET_SALES: {
            return {
                ...state,
                data: action.data,
            };
        }
        case ActionKeys.SET_ERROR:
            return {
                ...state,
                error: action.error,
            };
        default:
            return state;
    }
};
