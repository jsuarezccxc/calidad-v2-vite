import React from 'react';
import { Button } from '@components/button';
import { Icon } from '@components/icon';
import { Modal } from '@components/modal';
import { IReplacementModalProps } from '.';

export const ReplacementModal: React.FC<IReplacementModalProps> = ({
    acceptChanges,
    toggleModal = (): void => {},
    isTemplate = false,
}) => {
    return (
        <Modal modalClassName="template-modal" open handleClose={toggleModal}>
            <div className="template-modal__content bg-gray-light">
                <Icon name="warning" className="mb-2" />
                <h2 className="mb-2 text-xl text-blue font-allerbold">Información</h2>
                <p className="mt-2 text-center text-gray-dark mb-7">
                    Los cambios o componentes que se han agregado hasta el momento serán sobrescritos por &nbsp;
                    {isTemplate ? 'la plantilla seleccionada ' : 'el catálogo'}.
                </p>

                <div className="flex items-center justify-center">
                    <Button onClick={toggleModal} text="Cancelar" classes="mr-7 shadow-templateDesign" />
                    <Button onClick={acceptChanges} text="Aceptar" classes="shadow-templateDesign" />
                </div>
            </div>
        </Modal>
    );
};
