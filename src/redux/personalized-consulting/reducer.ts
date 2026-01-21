import { IGenericRecord } from '@models/GenericRecord';
import { ActionKeys, PersonalizedConsultingActions } from './types';

interface ISetPersonalizedConsultingOptions {
    option: IGenericRecord;
    type: IGenericRecord;
    pqrTypes: IGenericRecord[];
    consultingTypes: IGenericRecord[];
    error?: string;
}

const initialState = {
    option: {},
    type: {},
    pqrTypes: [],
    consultingTypes: [],
    error: '',
};

export const reducer = (
    state: ISetPersonalizedConsultingOptions = initialState,
    action: PersonalizedConsultingActions
): ISetPersonalizedConsultingOptions => {
    switch (action.type) {
        case ActionKeys.SET_PERSONALIZED_CONSULTING_OPTION:
            return {
                ...state,
                option: {
                    id: action.option.id,
                    name: action.option.icon,
                    title: action.option.title,
                },
            };
        case ActionKeys.ERROR:
            return {
                ...state,
                error: action.error,
            };
        case ActionKeys.SET_TYPE_PERSONALIZED_CONSULTING:
            return {
                ...state,
                type: action.option,
            };
        case ActionKeys.GET_PQR_TYPE:
            return {
                ...state,
                pqrTypes: action.data,
            };
        case ActionKeys.GET_CONSULTING_TYPE:
            return {
                ...state,
                consultingTypes: action.data,
            };
        default:
            return state;
    }
};
