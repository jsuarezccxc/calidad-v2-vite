import React from 'react';
import { Icon } from '@components/icon';
import { Button } from '@components/button';
import { ModalCustom } from '@components/modal-custom';
import { ElementType, generateId, ModuleApp, ActionElementType } from '@utils/GenerateId';
import { IActiveDomainModalProps } from '.';
import './ActiveDomainModal.scss';

export const ActiveDomainModal: React.FC<IActiveDomainModalProps> = ({ show, showModal, onClick }) => {
    return (
        <ModalCustom
            id={generateId({
                module: ModuleApp.WEBSITE,
                submodule: `${ModuleApp.MODALS}-active-domain`,
                action: ActionElementType.INFO,
                elementType: ElementType.MDL,
            })}
            show={show}
            showModal={showModal}
            closeIcon={false}
            classesModal="active-modal"
        >
            <div className="active-modal__content">
                <div className="active-modal__content-image">
                    <Icon name="advertisementMulticolor" className="alert--styles" />
                    <h3 className="title--advertisement">Activación en proceso</h3>
                </div>
                <div className="active-modal__content-description">
                    <p className="description">
                        El dominio será activado en el transcurso de 12 horas. Una vez activado, será notificado.
                    </p>
                </div>
                <div className="active-modal__content-button">
                    <Button
                        id={generateId({
                            module: ModuleApp.WEBSITE,
                            submodule: `${ModuleApp.MODALS}-active-domain`,
                            action: ActionElementType.ACCEPT,
                            elementType: ElementType.BTN,
                        })}
                        text="Aceptar"
                        onClick={(): void => (onClick ? onClick() : showModal())}
                    />
                </div>
            </div>
        </ModalCustom>
    );
};
