import { IGenericRecord } from '@models/GenericRecord';
import {
    ActionKeys,
    IShowMenu,
    IChangePrincipalLiActive,
    IActiveParentLi,
    ISetModulesMenu,
    IToggleMenu,
    ISetModalRedirectPlans,
} from './types';

/**
 * Change state of menu property of show/hide this
 *
 * @returns Type of action
 */
export const showMenu = (): IShowMenu => ({
    type: ActionKeys.SHOW_MENU,
});

/**
 * Active the next parent three node id to expand sidebar-menu
 *
 * @param activeParentId Identifier of node parent
 *
 * @returns Type of action with reference of node
 */
export const activeParentLi = (activeParentId?: number): IActiveParentLi => ({
    type: ActionKeys.ACTIVE_PARENT_ID,
    liRefParentNodeId: activeParentId,
});

/**
 * Change the principal three node id to collapse others principal's three node id
 *
 * @param liRefPrincipalNodeId Identifier of principal node active
 * @param moduleName Identifier of module name active
 *
 * @returns Type of action with reference of node
 */
export const changePrincipalLiActive = (moduleName: string): IChangePrincipalLiActive => ({
    type: ActionKeys.CHANGE_PRINCIPAL_LI_ACTIVE,
    moduleName,
});

/**
 * Change data in the sidebar menu
 *
 * @param data Identifier of principal node active
 *
 * @returns Type of action with reference of node
 */
export const setModulesMenu = (data: IGenericRecord[]): ISetModulesMenu => ({
    type: ActionKeys.SET_MODULES_MENU,
    data,
});

/**
 * This toggles the menu visibility
 *
 * @returns IToggleMenu
 */
export const toggleMenu = (): IToggleMenu => ({
    type: ActionKeys.TOGGLE_MENU,
});

/**
 * Change state of menu property of show/hide this modal
 *
 * @returns Type of action
 */
export const setModalRedirectPlans = (): ISetModalRedirectPlans => ({
    type: ActionKeys.SET_MODAL_REDIRECT_PLANS,
});
