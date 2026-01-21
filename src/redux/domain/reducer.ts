import { IGenericRecord } from '@models/GenericRecord';
import { ActionKeys, DomainActions } from './types';
import { SubStepSelection } from '@constants/Domain';

interface IDomain {
    typeDomain: string | null,
    stepsCompleted: SubStepSelection[];
    error: IGenericRecord;
}

const initialState = {
    typeDomain: null,
    stepsCompleted: [],
    error: {},
};

export const reducer = (state: IDomain = initialState, action: DomainActions): IDomain => {
    switch (action.type) {
        case ActionKeys.SET_STEPS_COMPLETED:
            return {
                ...state,
                stepsCompleted: action.payload, 
            }
        case ActionKeys.SET_TYPE_DOMAIN:
            return {
                ...state,
                typeDomain: action.payload, 
            }
        case ActionKeys.SET_ERROR:
            return {
                ...state,
                error: action.payload,
            };
        default:
            return state;
    }
};
