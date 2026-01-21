import React from 'react';
import { Modal } from '@components/modal';
import { ActionElementType, generateId, ElementType, ModuleApp } from '@utils/GenerateId';
import { FormFields, IModalFormProps } from '.';
import './Styles.scss';

export const ModalForm: React.FC<IModalFormProps> = ({ handleClose, open }) => {
    return (
        <Modal
            id={generateId({
                module: ModuleApp.WEBSITE,
                submodule: `${ModuleApp.MODALS}-editor-composite-element-header-footer-edit`,
                action: ActionElementType.INFO,
                elementType: ElementType.MDL,
            })}
            modalClassName="edit-modal"
            open={open}
            handleClose={handleClose}
        >
            <div className="edit-modal__container">
                <FormFields
                    wrapperClassName="w-full h-full overflow-y-auto overflow-x-hidden bg-green-scrollbar"
                    title="Formulario"
                    itemName="modalForm"
                    showModal={handleClose}
                    isModal={open}
                />
            </div>
        </Modal>
    );
};
