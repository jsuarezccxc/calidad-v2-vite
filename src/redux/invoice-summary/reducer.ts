import { IGenericRecord } from '@models/GenericRecord';
import { ActionKeys, InvoiceSummaryActions } from './types';

export interface IInitialState {
    reasonRejections: IGenericRecord[];
}

const initialState: IInitialState = {
    reasonRejections: [],
};

export const reducer = (state = initialState, action: InvoiceSummaryActions): IInitialState => {
    switch (action.type) {
        case ActionKeys.GET_TYPE_REJECTION:
            return {
                ...state,
                reasonRejections: action.payload,
            };
        default:
            return state;
    }
};
