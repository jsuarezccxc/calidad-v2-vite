import React from 'react';
import { IGenericRecord } from '@models/GenericRecord';
import usePermissions from '@hooks/usePermissions';
import { TitleButtons } from '@constants/Buttons';
import { Button } from '@components/button';
import { Modal } from '@components/modal';
import { ElementType, generateId, ModuleApp, ActionElementType } from '@utils/GenerateId';
import { escapeHtml, IMAGE_INDEX, ImageTitle } from '..';
import './ModalPreview.scss';

export const ModalPreview: React.FC<IGenericRecord> = ({
    show = false,
    showModal = (): void => {},
    urlImage = '',
    contentArticle = '',
    data = {},
    handleSendEmail = (): void => {},
    isNew = false,
}) => {
    const { disabledInputs } = usePermissions();
    return (
        <Modal
            id={generateId({
                module: ModuleApp.MODALS,
                submodule: `preview-email-template`,
                action: ActionElementType.INFO,
                elementType: ElementType.MDL,
            })}
            open={show}
            handleClose={showModal}
        >
            <div className="modal-preview">
                <div className="modal-preview__content">
                    <h3 className="modal-preview__title">Previsualización</h3>
                    <div className="modal-preview__content-body">
                        <div className="modal-preview__content-body__content-img">
                            {(urlImage.files && urlImage.files[IMAGE_INDEX]) || (isNew && urlImage) ? (
                                <img
                                    src={isNew ? urlImage : window.URL.createObjectURL(urlImage.files[IMAGE_INDEX])}
                                    className="modal-preview__content-body__content-img--img"
                                    alt="preview"
                                    id="preview"
                                />
                            ) : (
                                <label className="text-base text-gray-dark">({ImageTitle.ImagePreview})</label>
                            )}
                        </div>
                        <div className="modal-preview__mail-body">
                            <h3 className="mb-2 modal-preview__mail-body__title">Correo electrónico</h3>
                            <p className="mb-2.5 break-all text-gray-dark">{data.client_email || ''}</p>
                            <h3 className="modal-preview__mail-body__title mb-6.25">{data.subject || ''}</h3>
                            <p className="break-all modal-preview-content text-gray-dark" id="content">
                                {escapeHtml(contentArticle)}
                            </p>
                        </div>
                    </div>
                </div>
                <div className="modal-preview__footer">
                    <Button
                        id={generateId({
                            module: ModuleApp.MODALS,
                            submodule: `preview-email-template`,
                            action: ActionElementType.BACK,
                            elementType: ElementType.BTN,
                        })}
                        text={TitleButtons.BACK}
                        onClick={showModal}
                        classes="mr-5 btn-back-preview"
                    />
                    <Button
                        id={generateId({
                            module: ModuleApp.MODALS,
                            submodule: `preview-email-template`,
                            action: ActionElementType.SEND,
                            elementType: ElementType.BTN,
                        })}
                        text="Enviar correo"
                        {...(!disabledInputs && {
                            onClick: (): void => {
                                handleSendEmail();
                                showModal();
                            },
                        })}
                        disabled={disabledInputs}
                    />
                </div>
            </div>
        </Modal>
    );
};
