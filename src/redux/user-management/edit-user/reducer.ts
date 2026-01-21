import { ActionKeys, EditUserActions } from './types';
import { IEditUser } from '@models/EditUser';
import { IGenericRecord } from '@models/GenericRecord';

interface IEditUserState {
    updateUser?: IEditUser[];
    setEditUser?: IGenericRecord;
    error?: string;
    response: number | string;
}

const initialState = {
    updateUser: [],
    setEditUsers: null,
    error: '',
    response: '',
};

export const reducer = (
    state: IEditUserState = initialState,
    action: EditUserActions
): IEditUserState => {
    switch (action.type) {
        case ActionKeys.EDIT_USER:
            return {
                ...state,
                updateUser: action.updateUser,
            };
        case ActionKeys.SET_EDIT_USER:
            return {
                ...state,
                setEditUser: action.setEditUser,
            };
        case ActionKeys.ERROR_EDIT_USER:
            return {
                ...state,
                error: action.error,
            };
        case ActionKeys.SET_RESPONSE:
            return {
                ...state,
                response: action.response,
            };
        default:
            return state;
    }
};
