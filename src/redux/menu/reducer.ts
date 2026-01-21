import { IGenericRecord } from '@models/GenericRecord';
import { ActionKeys, MenuActions } from './types';

/**
 * Attributes of state of menu
 *
 * @typeParam show: boolean - Define if show/hide menu
 * @typeParam liRefParentNodeId: number - Optional next node li to active on sidebar-menu
 * @typeParam liRefPrincipalNodeId: number - Optional principal node li to active on sidebar-menu
 * @typeParam moduleName: string - Module name according to principal node selected
 * @typeParam modules: IGenericRecord[] - Modules sidebarMenu
 * @typeParam open: boolean - This indicates whether it should be opened
 * @typeParam modalRedirectPlans: boolean - This indicates whether it should be opened the modal to redirect to section payments in landing
 */
interface IMenuState {
    show: boolean;
    liRefParentNodeId?: number;
    liRefPrincipalNodeId?: number;
    moduleName: string;
    modules: IGenericRecord[];
    open: boolean;
    modalRedirectPlans: boolean;
}

/**
 * Initial state of menu
 */
const initialState: IMenuState = {
    show: false,
    moduleName: '',
    modules: [],
    open: true,
    modalRedirectPlans: false,
};

/**
 * Process state of menu
 *
 * @param state
 * @param action Action to execute
 *
 * @returns The menu state
 */
export const reducer = (state: IMenuState = initialState, action: MenuActions): IMenuState => {
    switch (action.type) {
        case ActionKeys.ACTIVE_PARENT_ID:
            return {
                ...state,
                liRefParentNodeId: action.liRefParentNodeId,
            };
        case ActionKeys.CHANGE_PRINCIPAL_LI_ACTIVE:
            return {
                ...state,
                liRefPrincipalNodeId: action.liRefPrincipalNodeId,
                moduleName: action.moduleName,
            };
        case ActionKeys.SHOW_MENU:
            return { ...state, show: !state.show };
        case ActionKeys.SET_MODULES_MENU:
            return {
                ...state,
                modules: action.data,
            };
        case ActionKeys.TOGGLE_MENU:
            return {
                ...state,
                open: !state.open,
            };
        case ActionKeys.SET_MODAL_REDIRECT_PLANS:
            return { ...state, modalRedirectPlans: !state.modalRedirectPlans };
        default:
            return state;
    }
};
