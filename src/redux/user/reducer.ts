import { ActionKeys, UserActions } from './types';
import { IGenericRecord } from '@models/GenericRecord';

// States from reducer User
interface IUserState {
    isLogin?: boolean;
    error: string;
    users: IGenericRecord;
    area: IGenericRecord[];
    showPQRSF?: boolean;
}

// State User default attributes values
const initialState: IUserState = {
    isLogin: false,
    error: '',
    users: [],
    area:[],
    showPQRSF: false,
};

/**
 * Reducer module user
 * 
 * @param state Global state from reducer User
 * @param action Actions to be executed by module User
 * @returns return reducer module and change the state by the action executed
 */
export const reducer = (
    state: IUserState = initialState,
    action: UserActions,
): IUserState => {
    // The type action executed
    switch (action.type) {
        case ActionKeys.LOGOUT:
            // return a new state with assigned values for this case
            return {
                ...state,
                isLogin: false,
                error: '',
            };
        case ActionKeys.SET_USERS:
            return {
                ...state,
                users: action.users,
                error: '',
            };
        case ActionKeys.SET_AREA:
            return {
                ...state,
                area: action.area,
                error: '',
            };
        case ActionKeys.SET_SHOW_PQRSF:
            return {
                ...state,
                showPQRSF: true,
                error: '',
            };
        case ActionKeys.ERROR:
            return {
                ...state,
                error: action.error,
            };
        default:
            return state;
    }
};
