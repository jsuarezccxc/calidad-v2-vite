import { ActionKeys, DropdownActions } from './types';

export const setDropdown = (dropdown: boolean): DropdownActions => ({
    type: ActionKeys.SET_DROPDOWN,
    dropdown,
});
