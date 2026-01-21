import { ActionKeys, IModificationHistoryState, ModificationHistoryActions } from './types';

const initialState: IModificationHistoryState = {
    modificationsHistory: {
        meta: {
            current_page: 1,
            from: 1,
            last_page: 1,
            path: '',
            per_page: 1,
            to: 1,
            total: 1,
        },
        data: [],
        links: {
            prev: '',
            first: '',
            last: '',
            next: '',
        },
    },
};

export const reducer = (state = initialState, action: ModificationHistoryActions): IModificationHistoryState => {
    switch (action.type) {
        case ActionKeys.SET_MODIFICATION_HISTORY:
            return {
                ...state,
                modificationsHistory: action.modificationsHistory,
            };
        default:
            return state;
    }
};
