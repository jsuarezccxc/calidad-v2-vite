
import { IOptionSelect } from '@components/input';
import { IGenericRecord } from '@models/GenericRecord';
import { INotesReducer, ISelectSearchOption, IOptionsForm, IValidations } from '@models/CorrectCancelElectronicDocument';
import { NotesAction } from '../reducer/types';

export { NotesContext } from './GlobalContext';

/**
 * This interface is notes context
 * 
 * @typeParam state: INotesReducer - Context prop state reducer
 * @typeParam resetNote: () => void - Context prop reset note
 * @typeParam optionsTypeNote: IOptionSelect[] - Context prop options form
 * @typeParam dispatch: React.Dispatch<NotesAction> - Context prop dispatch reducer
 * @typeParam optionsDocuments: ISelectSearchOption[] - Context prop options form
 * @typeParam electronicDocument: IGenericRecord - Context prop electronic document
 * @typeParam validations: IValidations - Context prop validations
 * @typeParam products: IGenericRecord[] - Context prop products
 * @typeParam optionsForm: IOptionsForm - Context prop options form
 */
export interface INotesContext {
    state: INotesReducer;
    resetNote: () => void;
    optionsTypeNote: IOptionSelect[];
    dispatch: React.Dispatch<NotesAction>;
    optionsDocuments: ISelectSearchOption[];
    electronicDocument: IGenericRecord;
    validations: IValidations;
    products: IGenericRecord[];
    optionsForm: IOptionsForm;
}
