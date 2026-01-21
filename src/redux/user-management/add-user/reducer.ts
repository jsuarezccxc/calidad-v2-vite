import { IAddUser } from '@models/UserManagement';
import { ActionKeys, AddUserActions } from './types';

interface IAddUserState {
    user?: IAddUser | null;
    error?: string;
    response: number | string;
}

const initialState = {
    user: null,
    error: '',
    response: '',
};

export const reducer = (
    state: IAddUserState = initialState,
    action: AddUserActions
): IAddUserState => {
    switch (action.type) {
        case ActionKeys.ADD_USER:
            return {
                ...state,
                user: action.user,
            };
        case ActionKeys.ERROR_ADD_USER:
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
