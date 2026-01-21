import { VirtualStoreSalesActions, ActionKeys } from './types';

interface IVirtualStore {
    error: string;
}

const initialState = {
    error: '',
};

export const reducer = (
    state: IVirtualStore = initialState,
    action: VirtualStoreSalesActions
): IVirtualStore => {
    switch (action.type) {
        case ActionKeys.SET_ERROR:
            return {
                ...state,
                error: action.error,
            };
        default:
            return state;
    }
};
