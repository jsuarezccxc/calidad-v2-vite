import { IAdjustmentNote } from '@models/AdjustmentNote';
import { IElectronicNote } from '@models/ElectronicNote';
import { ActionType, INoteTypeForm, IValidateNote, TypeNote } from '@models/CorrectCancelElectronicDocument';

export interface ISetNote {
    type: ActionType.SET_NOTE;
    note: IElectronicNote | IAdjustmentNote;
}

export interface ISetSubmit {
    type: ActionType.SET_SUBMIT;
    submit: boolean;
}

export interface ISetTypeNote {
    type: ActionType.SET_TYPE_NOTE;
    typeNote: TypeNote;
}

export interface ISetMainForm {
    type: ActionType.SET_MAIN_FORM;
    mainForm: INoteTypeForm;
}

export interface ISetValidateNote {
    type: ActionType.SET_VALIDATE_NOTE;
    validateNote: IValidateNote;
}

export type NotesAction =
    | ISetNote
    | ISetTypeNote
    | ISetValidateNote
    | ISetMainForm
    | ISetSubmit;
