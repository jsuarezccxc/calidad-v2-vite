import { IGenericRecord } from '@models/GenericRecord';
import { ActionKeys, SupportDocumentActions } from './types';

interface ISupportDocumentState {
    form: IGenericRecord;
    purchasingManager: IGenericRecord[];
    supportDocumentId: IGenericRecord;
}

const initialState: ISupportDocumentState = {
    form: {},
    purchasingManager: [],
    supportDocumentId: {},
};

export const reducer = (state: ISupportDocumentState = initialState, action: SupportDocumentActions): ISupportDocumentState => {
    switch (action.type) {
        case ActionKeys.GET_PURCHASING_MANAGER:
            return {
                ...state,
                purchasingManager: action.data,
            };
        case ActionKeys.GET_SUPPORT_DOCUMENT_BY_ID:
            return {
                ...state,
                supportDocumentId: action.data,
            };
        case ActionKeys.SET_FORM:
            return {
                ...state,
                form: action.form,
            };
        default:
            return state;
    }
};
