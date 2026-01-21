import { IGenericRecord } from '@models/GenericRecord';

/**
 * Enum representing the available action keys for managing the menu state.
 */
export enum ActionKeys {
    ACTIVE_PARENT_ID = 'ACTIVE_PARENT_ID',
    CHANGE_PRINCIPAL_LI_ACTIVE = 'CHANGE_PRINCIPAL_LI_ACTIVE',
    SHOW_MENU = 'SHOW_MENU',
    SET_MODULES_MENU = 'SET_MODULES_MENU',
    TOGGLE_MENU = 'TOGGLE_MENU',
    SET_MODAL_REDIRECT_PLANS = 'SET_MODAL_REDIRECT_PLANS',
}

/**
 * Action for activating a parent menu item.
 */
export interface IActiveParentLi {
    type: ActionKeys.ACTIVE_PARENT_ID;
    liRefParentNodeId?: number;
}

/**
 * Action for changing the active state of a principal menu item.
 */
export interface IChangePrincipalLiActive {
    type: ActionKeys.CHANGE_PRINCIPAL_LI_ACTIVE;
    liRefPrincipalNodeId?: number;
    moduleName: string;
}

/**
 * Action for displaying the menu.
 */
export interface IShowMenu {
    type: ActionKeys.SHOW_MENU;
}

/**
 * Action for setting the modules available in the menu.
 */
export interface ISetModulesMenu {
    type: ActionKeys.SET_MODULES_MENU;
    data: IGenericRecord[];
}

/**
 * Action for toggling the menu visibility.
 */
export interface IToggleMenu {
    type: ActionKeys.TOGGLE_MENU;
}

/**
 * Action for setting the redirection modal for plans.
 */
export interface ISetModalRedirectPlans {
    type: ActionKeys.SET_MODAL_REDIRECT_PLANS;
}

/**
 * Type representing all possible actions that can modify the menu state.
 */
export type MenuActions =
    | IActiveParentLi
    | IChangePrincipalLiActive
    | IShowMenu
    | ISetModulesMenu
    | IToggleMenu
    | ISetModalRedirectPlans;
