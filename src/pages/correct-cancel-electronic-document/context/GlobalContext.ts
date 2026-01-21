import { createContext } from 'react';
import { INIT_STATE, INIT_STATE_OPTIONS, INIT_VALIDATE } from '@constants/CorrectCancelElectronicDocument';
import { INotesContext } from '.';

const initContext: INotesContext = {
    state: { ...INIT_STATE },
    dispatch: (): void => {},
    optionsTypeNote: [],
    optionsDocuments: [],
    resetNote: (): void => {},
    electronicDocument: {},
    validations: {
        validationMainForm: [],
        validateNote: { ...INIT_VALIDATE },
    },
    products: [],
    optionsForm: { ...INIT_STATE_OPTIONS },
};

export const NotesContext = createContext<INotesContext>(initContext);
