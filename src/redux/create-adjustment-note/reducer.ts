import { ActionKeys, CreateAdjustmentNoteActions } from './types';
import { IGenericRecord } from '@models/GenericRecord';

interface ICreateAdjustmentNoteActions {
    data: IGenericRecord[];
    previewData: IGenericRecord;
    error: string;
}

const initialState = {
    data: [],
    previewData: {},
    error: '',
};

export const reducer = (
    state: ICreateAdjustmentNoteActions = initialState,
    action: CreateAdjustmentNoteActions
): ICreateAdjustmentNoteActions => {
    switch (action.type) {
        case ActionKeys.SET_ADJUSTMENT_NOTE_DATA:
            return {
                ...state,
                data: action?.data,
            };
        case ActionKeys.POST_ADJUSTMENT_NOTE_DATA:
            return {
                ...state,
                previewData: action?.data || {},
            };
        case ActionKeys.SET_ERROR:
            return {
                ...state,
                error: action?.error,
            };
        default:
            return state;
    }
};
