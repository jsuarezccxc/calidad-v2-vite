import {
    ActionKeys,
    LatestModificationsActions,
} from '@redux/latest-modifications/type';
import { IGenericRecord } from '@models/GenericRecord';

interface IModificationsState {
    modifications: IGenericRecord[];
    error?: string;
}

const initialState = {
    modifications: [],
    error: '',
};

export const reducer = (
    state: IModificationsState = initialState,
    action: LatestModificationsActions
): IModificationsState => {
    switch (action.type) {
        case ActionKeys.SET_MODIFICATIONS:
            return {
                ...state,
                modifications: action.modifications,
            };
        case ActionKeys.FAILED_MODIFICATIONS:
            return {
                ...state,
                error: action.error,
            };
        default:
            return state;
    }
};
