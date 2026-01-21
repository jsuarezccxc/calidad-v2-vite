export enum ActionKeys {
	SET_DROPDOWN = 'SET_DROPDOWN',
}

export interface ISetDropdown {
	type: ActionKeys.SET_DROPDOWN;
	dropdown: boolean,
}

export type DropdownActions = ISetDropdown;
