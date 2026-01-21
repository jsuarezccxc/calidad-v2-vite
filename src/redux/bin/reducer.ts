import { IGenericRecord } from '@models/GenericRecord';
import { ActionKeys, BinActions } from './types';

const { GET_BIN_DATA, SET_ERROR } = ActionKeys;

interface IBin {
    data: IGenericRecord[];
    error: string;
}

const initialState: IBin = {
    data: [],
    error: '',
};

export const reducer = (state = initialState, action: BinActions): IBin => {
    switch (action.type) {
        case GET_BIN_DATA:
            return {
                ...state,
                data: action.data,
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
