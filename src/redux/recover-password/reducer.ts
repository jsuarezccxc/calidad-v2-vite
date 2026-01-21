import { ActionKeys, RecoverPasswordActions } from './types';

interface IRecoverPasswordState {
    response?: number | string;
    email?: string;
    token?: string;
    password?: string;
    passwordConfirmation?: string;
    changePassword?: boolean;
    error?: string;
}

const initialState = {
    error: '',
    changePassword: false,
};

export const reducer = (
    state: IRecoverPasswordState = initialState,
    action: RecoverPasswordActions
): IRecoverPasswordState => {
    switch (action.type) {
        case ActionKeys.RECOVER_PASSWORD:
            return {
                ...state,
                response: action.response,
            };
        case ActionKeys.CHANGE_PASSWORD:
            return { 
                ...state,
                changePassword: action.changePassword,
            };
        case ActionKeys.FAILED:
            return {
                ...state,
                error: action.error,
                response: 422,
            };
        case ActionKeys.CLEAR_ERRORS:
            return { ...state, error: '', response: '' };
        default:
            return state;
    }
};
