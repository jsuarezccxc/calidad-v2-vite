import { IModalTypeProps } from '@components/modal-custom';
import { ActionType } from '@constants/ActionType';
import { DELETE_DESCRIPTION_NUMBER, MODAL_INFORMATION } from '@information-texts/Modal';
import { ModuleApp, ActionElementType, generateId, ElementType } from '@utils/GenerateId';

/**
 * Function that return the modal save props
 *
 * @param show: boolean - Show the modal
 * @param showModal: () => void - Function for show and hide the modal
 * @param moduleId: string - Id parent module
 * @returns IModalTypeProps
 */
export const saveModalProps = (show: boolean, showModal: () => void, moduleId: string): IModalTypeProps => ({
    id: generateId({
        module: ModuleApp.MODALS,
        submodule: moduleId,
        action: ActionElementType.SAVE,
        elementType: ElementType.MDL,
    }),
    type: ActionType.SAVE,
    title: 'Información guardada',
    text: '¡Su información ha sido guardada con éxito!',
    show,
    showModal,
});

/**
 * Function that return the modal delete props
 *
 * @param moduleId: string - Id parent module
 * @param show: boolean - Show the modal
 * @param showModal: () => void - Function for toggle modal
 * @param mainAction: () => void - Function executed when accept button is clicked
 * @param items: number - Selected items for delete
 * @param showTrashMessage: boolean - Show trash message
 * @returns IModalTypeProps
 */
export const modalDeleteProps = (
    moduleId: string,
    show: boolean,
    showModal: () => void,
    mainAction?: () => void,
    items = 1,
    showTrashMessage = true,
): IModalTypeProps => ({
    id: generateId({
        module: ModuleApp.MODALS,
        submodule: moduleId,
        action: ActionElementType.DELETE,
        elementType: ElementType.MDL,
    }),
    type: ActionType.DELETE,
    title: MODAL_INFORMATION.DELETE_TITLE,
    text: DELETE_DESCRIPTION_NUMBER(items, false, undefined, showTrashMessage),
    show,
    showModal,
    mainAction,
});

export const defaultModalProps = { show: true, showModal: (): void => {} };
