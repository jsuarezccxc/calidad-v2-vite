import { IGenericRecord } from '@models/GenericRecord';

export enum ActionKeys {
    SET_ADJUSTMENT_NOTE_DATA = 'SET_ADJUSTMENT_NOTE_DATA',
    POST_ADJUSTMENT_NOTE_DATA= 'POST_ADJUSTMENT_NOTE_DATA',
    SET_ERROR = 'SET_ERROR'
}

/**
 * This interface describes redux type
 * 
 * @typeParam type: string - Redux action
 * @typeParam data: IGenericRecord[] - Redux request data
 */
export interface ISetAdjustmentNoteData {
    type: ActionKeys.SET_ADJUSTMENT_NOTE_DATA,
    data: IGenericRecord[]
}

/**
 * This interface describes redux type
 * 
 * @typeParam type: string - Redux action
 * @typeParam data: IGenericRecord[] - Redux request data
 */
export interface ISetAdjustmentNoteDataPost {
    type: ActionKeys.POST_ADJUSTMENT_NOTE_DATA,
    data: IGenericRecord
}

/**
 * This interface describes redux type
 * 
 * @typeParam type: string - Redux action
 * @typeParam error: string - Redux request error
 */
export interface ISetError {
    type: ActionKeys.SET_ERROR,
    error: string
}

export type CreateAdjustmentNoteActions = ISetAdjustmentNoteData | ISetError | ISetAdjustmentNoteDataPost;