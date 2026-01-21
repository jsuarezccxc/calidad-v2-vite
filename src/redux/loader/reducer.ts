import { ActionKeys, LoaderActions } from './types';

interface ILoaderState {
    loader: boolean;
}

const initialState: ILoaderState = {
    loader: false,
};

export const reducer = (state: ILoaderState = initialState, action: LoaderActions): ILoaderState => {
    switch (action.type) {
        case ActionKeys.SHOW_LOADER:
            return {
                ...state,
                loader: true,
            };
        case ActionKeys.HIDE_LOADER:
            return {
                ...state,
                loader: false,
            };
        default:
            return state;
    }
};
