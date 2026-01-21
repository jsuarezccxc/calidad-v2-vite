import React from 'react';
import { Backdrop, Box, Modal as MuiModal, Fade } from '@mui/material';
import { TitleButtons } from '@constants/Buttons';
import { ModalType as ModalOption } from '@constants/Modal';
import { Icon } from '@components/icon';
import { Button } from '@components/button';
import { ActionElementType, ElementType, generateId, ModuleApp } from '@utils/GenerateId';
import { IModalProps, SHARED_MODAL_PROPS, STYLE_MODAL, ISharedModalProps, IModalTypeProps } from '.';
import './Modal.scss';

export const Modal: React.FC<IModalProps> = ({ id = '', handleClose, open, modalClassName = '', children }) => {
    return (
        <MuiModal
            id={id}
            className={`${modalClassName} font-aller`}
            aria-labelledby="transition-modal-title"
            aria-describedby="transition-modal-description"
            open={open}
            onClose={handleClose}
            closeAfterTransition
            slots={{ backdrop: Backdrop }}
            slotProps={{
                backdrop: {
                    timeout: 500,
                    style: {
                        outline: 'none',
                    },
                },
            }}
            style={{ outline: 'none' }}
        >
            <Fade in={open}>
                <Box sx={STYLE_MODAL}>{children}</Box>
            </Fade>
        </MuiModal>
    );
};

export const SharedModal: React.FC<ISharedModalProps> = ({
    moduleId = '',
    handleClosed = (): void => {},
    open,
    text: customText,
    finalAction,
    leftButton,
    finishButtonText = 'Aceptar',
    iconName,
    type = ModalOption.Success,
    className,
    children,
}) => {
    const isDelete = type === ModalOption.Delete;
    const { text, icon } = SHARED_MODAL_PROPS[type];
    const { description, title } = customText ?? text;
    return (
        <Modal
            id={generateId({
                module: ModuleApp.MODALS,
                submodule: `${moduleId}-shared-modal-container`,
                action: ActionElementType.INFO,
                elementType: ElementType.MDL,
            })}
            modalClassName={`shared-modal ${className}`}
            handleClose={handleClosed}
            open={open}
        >
            <div className={`shared-modal__content ${className}__content`}>
                {children ?? (
                    <>
                        <Icon
                            id={generateId({
                                module: ModuleApp.MODALS,
                                submodule: `${moduleId}-shared-modal`,
                                action: ActionElementType.INFO,
                                elementType: ElementType.ICO,
                            })}
                            name={iconName ?? icon}
                            className="mb-2 w-22.2 h-22.2"
                        />
                        <p
                            id={generateId({
                                module: ModuleApp.MODALS,
                                submodule: `${moduleId}-shared-modal-title`,
                                action: ActionElementType.INFO,
                                elementType: ElementType.TXT,
                            })}
                            className="mb-2 text-xl font-bold text-center leading-xl text-blue font-allerbold w-65"
                        >
                            {title}
                        </p>
                        <p
                            id={generateId({
                                module: ModuleApp.MODALS,
                                submodule: `${moduleId}-shared-modal-description`,
                                action: ActionElementType.INFO,
                                elementType: ElementType.TXT,
                            })}
                            className="text-base text-center text-gray-dark"
                        >
                            {description}
                        </p>
                        <div className="flex justify-center w-full mt-7 gap-x-7">
                            {isDelete && (
                                <Button
                                    id={generateId({
                                        module: ModuleApp.MODALS,
                                        submodule: `${moduleId}-shared-modal-cancel`,
                                        action: ActionElementType.CANCEL,
                                        elementType: ElementType.BTN,
                                    })}
                                    onClick={handleClosed}
                                    text="Cancelar"
                                    classes="shadow-card px-3"
                                />
                            )}
                            {leftButton && (
                                <Button
                                    id={generateId({
                                        module: ModuleApp.MODALS,
                                        submodule: `${moduleId}-shared-modal-left-action`,
                                        action: ActionElementType.OTHER_ACTION,
                                        elementType: ElementType.BTN,
                                    })}
                                    onClick={leftButton.action}
                                    text={leftButton.text}
                                    classes="shadow-card px-3"
                                />
                            )}
                            <Button
                                id={generateId({
                                    module: ModuleApp.MODALS,
                                    submodule: `${moduleId}-shared-modal-final-action`,
                                    action: ActionElementType.OTHER_ACTION,
                                    elementType: ElementType.BTN,
                                })}
                                onClick={finalAction}
                                text={isDelete ? 'Eliminar' : finishButtonText}
                                classes="shadow-card px-3"
                            />
                        </div>
                    </>
                )}
            </div>
        </Modal>
    );
};

export const ModalType: React.FC<IModalTypeProps> = ({
    moduleId = '',
    open,
    otherButton,
    finalAction,
    iconName = 'check',
    text = SHARED_MODAL_PROPS.SUCCESS.text,
    handleClosed = (): void => {},
    textButton = TitleButtons.ACCEPT,
    isChildText = false,
    classContent = '',
    classTitle = '',
    classModal = '',
}) => (
    <Modal
        id={generateId({
            module: ModuleApp.MODALS,
            submodule: `${moduleId}-modal-type-container`,
            action: ActionElementType.INFO,
            elementType: ElementType.MDL,
        })}
        modalClassName={`shared-modal ${classContent}`}
        handleClose={handleClosed}
        open={open}
    >
        <div className={`shared-modal__content ${classModal}`}>
            <Icon
                id={generateId({
                    module: ModuleApp.MODALS,
                    submodule: `${moduleId}-modal-type`,
                    action: ActionElementType.INFO,
                    elementType: ElementType.ICO,
                })}
                name={iconName}
                className="mb-2 w-22.2 h-22.2"
            />
            <p
                id={generateId({
                    module: ModuleApp.MODALS,
                    submodule: `${moduleId}-modal-type-title`,
                    action: ActionElementType.INFO,
                    elementType: ElementType.TXT,
                })}
                className={`mb-2 text-xl font-bold text-center leading-xl text-blue font-allerbold w-65 ${classTitle}`}
            >
                {text.title}
            </p>
            {isChildText ? (
                text.description
            ) : (
                <p
                    id={generateId({
                        module: ModuleApp.MODALS,
                        submodule: `${moduleId}-modal-type-description`,
                        action: ActionElementType.INFO,
                        elementType: ElementType.TXT,
                    })}
                    className="text-base text-center text-gray-dark"
                >
                    {text.description}
                </p>
            )}
            <div className="flex justify-center w-full xs:flex-col xs:items-center gap-y-2 gap-x-7 mt-7">
                {otherButton && (
                    <Button
                        id={generateId({
                            module: ModuleApp.MODALS,
                            submodule: `${moduleId}-modal-type`,
                            action: ActionElementType.OTHER_ACTION,
                            elementType: ElementType.BTN,
                        })}
                        onClick={otherButton.onClick}
                        text={otherButton.textButton}
                        classes="shadow-card"
                    />
                )}
                <Button
                    id={generateId({
                        module: ModuleApp.MODALS,
                        submodule: `${moduleId}-modal-type-final-action`,
                        action: ActionElementType.SUBMIT,
                        elementType: ElementType.BTN,
                    })}
                    onClick={finalAction}
                    text={textButton}
                    classes="shadow-card"
                />
            </div>
        </div>
    </Modal>
);
