import { IGenericRecord } from '@models/GenericRecord';
import { ActionKeys, AssembleProductActions, IErrorMassiveUpload } from './types';

interface IAssembleProduct {
    massiveUpload: IGenericRecord;
    error: string;
    errorsMassiveUpload: IErrorMassiveUpload[];
}

const initialState = {
    massiveUpload: [],
    error: '',
    errorsMassiveUpload: [],
};

export const reducer = (state: IAssembleProduct = initialState, action: AssembleProductActions): IAssembleProduct => {
    switch (action.type) {
        case ActionKeys.SET_DATA_MASSIVE_UPLOAD:
            return {
                ...state,
                massiveUpload: action.payload,
            };

        case ActionKeys.SET_ERROR:
            return {
                ...state,
                error: action.error,
            };
        case ActionKeys.SET_ERROR_MASSIVE_UPLOAD:
            return {
                ...state,
                errorsMassiveUpload: action.payload,
            };
        default:
            return state;
    }
};
