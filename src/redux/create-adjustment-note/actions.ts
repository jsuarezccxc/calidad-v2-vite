import { ThunkAction, ThunkDispatch } from 'redux-thunk';
import { RootState } from '@redux/rootReducer';
import { IGenericRecord } from '@models/GenericRecord';
import { FetchRequest } from '@models/Request';
import { apiPostInvoice } from '@api/invoice';
import { urls } from '@api/urls';
import { ActionKeys, CreateAdjustmentNoteActions } from './types';

export const setCreateAdjustmentNoteData = (data: IGenericRecord[]): CreateAdjustmentNoteActions => ({
    type: ActionKeys.SET_ADJUSTMENT_NOTE_DATA,
    data,
});

export const setCreateAdjustmentNoteDataPost = (data: IGenericRecord): CreateAdjustmentNoteActions => ({
    type: ActionKeys.POST_ADJUSTMENT_NOTE_DATA,
    data,
});

export const setError = (error: string): CreateAdjustmentNoteActions => ({
    type: ActionKeys.SET_ERROR,
    error,
});

export const getCreateAdjustmentNoteData = (
    dates: IGenericRecord
): ThunkAction<Promise<void>, RootState, null, CreateAdjustmentNoteActions> => {
    return async (dispatch: ThunkDispatch<RootState, null, CreateAdjustmentNoteActions>): Promise<void> => {
        try {
            const request = new FetchRequest(urls.createAdjustmentNote.getAdjustmentNote, dates);
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const { data }: any = await apiPostInvoice(request);
            dispatch(setCreateAdjustmentNoteData(data));
        } catch (error) {
            dispatch(setError(String(error)));
        }
    };
};

export const postAdjustmentNoteData = (
    dataPost: IGenericRecord
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
): ThunkAction<Promise<any>, RootState, null, CreateAdjustmentNoteActions> => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return async (dispatch: ThunkDispatch<RootState, null, CreateAdjustmentNoteActions>): Promise<any> => {
        try {
            const request = new FetchRequest(urls.createAdjustmentNote.postAdjustmentNote, dataPost);
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const { statusCode, data }: any = await apiPostInvoice(request);
            dispatch(setCreateAdjustmentNoteDataPost(data));
            return { statusCode, data };
        } catch (err) {
            dispatch(setError(String(err)));
            return {};
        }
    };
};
