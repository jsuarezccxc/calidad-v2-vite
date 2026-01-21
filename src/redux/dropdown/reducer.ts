import { ActionKeys, DropdownActions } from './types';

const { SET_DROPDOWN } = ActionKeys;

interface IDropdownState {
    dropdown: boolean;
}

const initialState = {
    dropdown: false,
};

export const reducer = (state: IDropdownState = initialState, action: DropdownActions): IDropdownState => {
    switch (action.type) {
        case SET_DROPDOWN:
            return {
                ...state,
                dropdown: action.dropdown,
            };
        default:
            return state;
    }
};
