import React from 'react';
import { useTranslation } from 'react-i18next';
import { LANGUAGE_KEY } from '@constants/Translate';
import { IModalTypeProps } from '@components/modal-custom';
import { IGenericRecord } from '@models/GenericRecord';
import { ModuleApp, ActionElementType, generateId, ElementType } from '@utils/GenerateId';

/**
 * This interface describes the object return by this hook
 *
 * @typeParam [key: string]: IModalTypeProps - This is each modal with his props
 */
interface IUseTextModal {
    [key: string]: IModalTypeProps;
}

/**
 * Custom hook that returns the props of the modals
 *
 * @typeParam { showModal, toggleModal, moduleId }: IGenericRecord) - Modal props
 * @typeParam itemsToDelete: number - Optional prop with the items to delete
 * @returns IUseTextModal
 */
const useModalProps = ({ showModal, toggleModal, moduleId, ...restProps }: IGenericRecord, itemsToDelete = 1): IUseTextModal => {
    const [translate] = useTranslation(LANGUAGE_KEY);

    const modalProps = { show: showModal, showModal: toggleModal };

    const deleteText = (
        <>
            <p>
                ¿{translate('modal.are-you-sure-to-delete')} &nbsp;
                {translate(`modal.${itemsToDelete === ONE_ELEMENT ? 'selected-item' : 'selected-items'}`)}?
            </p>
            <p className="mt-4.5">
                {translate(`modal.${itemsToDelete === ONE_ELEMENT ? 'deleted-item-is-carried' : 'deleted-items-are-carried'}`)}
                &nbsp; {translate('modal.to-the-trash')}.
            </p>
        </>
    );

    const deleteModal: IModalTypeProps = {
        id: generateId({
            module: ModuleApp.MODALS,
            submodule: moduleId,
            action: ActionElementType.DELETE,
            elementType: ElementType.MDL,
        }),
        type: 'delete',
        text: deleteText,
        title: translate('modal.delete'),
        ...modalProps,
        ...restProps,
    };

    const saveModal: IModalTypeProps = {
        id: generateId({
            module: ModuleApp.MODALS,
            submodule: moduleId,
            action: ActionElementType.SAVE,
            elementType: ElementType.MDL,
        }),
        type: 'save',
        title: translate('modal.save-title'),
        text: translate('modal.save-description'),
        ...modalProps,
        ...restProps,
    };

    return {
        deleteModal,
        saveModal,
    };
};

export default useModalProps;

export const ONE_ELEMENT = 1;
