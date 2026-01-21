import { ActionType, INotesReducer } from '@models/CorrectCancelElectronicDocument';
import { INIT_STATE } from '@constants/CorrectCancelElectronicDocument';
import { NotesAction } from './types';

export const NotesReducer = (state = { ...INIT_STATE }, action: NotesAction): INotesReducer => {
    switch (action.type) {
        case ActionType.SET_NOTE:
            return {
                ...state,
                note: action.note,
            };
        case ActionType.SET_SUBMIT:
            return {
                ...state,
                submit: action.submit,
            };
        case ActionType.SET_MAIN_FORM:
            return {
                ...state,
                mainForm: action.mainForm,
            };
        case ActionType.SET_TYPE_NOTE:
            return {
                ...state,
                typeNote: action.typeNote,
            };
        default:
            return state;
    }
};
