import React from 'react';
import { Modal } from '@components/modal';
import { ElementType, generateId, ModuleApp, ActionElementType } from '@utils/GenerateId';
import type { IPreviewModalProps } from '..';

export const PreviewModal: React.FC<IPreviewModalProps> = ({ modalState, modalHandlers, emailContent }) => {
    const { open } = modalState;
    const { onClose, onSend } = modalHandlers;
    const { email, subject, content, imagePreview } = emailContent;

    const renderContent = (): { __html: string } => {
        return { __html: content || '' };
    };

    const formatEmails = (emailString: string): string => {
        if (!emailString) return '';
        const emails = emailString
            .split(';')
            .map(e => e.trim())
            .filter(e => e);
        return emails.join(' ; ');
    };

    return (
        <Modal
            id={generateId({
                module: ModuleApp.QUOTES,
                submodule: ModuleApp.MODALS,
                action: ActionElementType.PREVIEW,
                elementType: ElementType.MDL,
            })}
            modalClassName="quote-modal-wrapper"
            handleClose={onClose}
            open={open}
        >
            <div className="quote-send-mail__preview-modal--container">
                <h2 className="quote-send-mail__preview-modal--title">Previsualización</h2>

                <div className="quote-send-mail__preview-modal--white-container">
                    {imagePreview ? (
                        <div className="quote-send-mail__preview-modal--image-section">
                            <img src={imagePreview} alt="Vista previa" className="preview-modal__image" />
                        </div>
                    ) : (
                        <div className="quote-send-mail__preview-modal--image-placeholder">(Previsualización imagen)</div>
                    )}

                    <div className="quote-send-mail__preview-modal--section quote-send-mail__preview-modal--section--email">
                        <h3 className="quote-send-mail__preview-modal--section-label">Correo electrónico</h3>
                        <p className="quote-send-mail__preview-modal--section-text">{formatEmails(email)}</p>
                    </div>

                    <div className="quote-send-mail__preview-modal--section quote-send-mail__preview-modal--section--title">
                        <h3 className="quote-send-mail__preview-modal--section-label">Título agregado</h3>
                        <p className="quote-send-mail__preview-modal--section-text">{subject || 'Sin asunto'}</p>
                    </div>

                    <div className="quote-send-mail__preview-modal--content-section">
                        <div className="quote-send-mail__preview-modal--content-text" dangerouslySetInnerHTML={renderContent()} />
                    </div>
                </div>

                <div className="quote-send-mail__preview-modal--buttons-container">
                    <button
                        id={generateId({
                            module: ModuleApp.QUOTES,
                            submodule: `${ModuleApp.MODALS}-preview`,
                            action: ActionElementType.BACK,
                            elementType: ElementType.BTN,
                        })}
                        type="button"
                        onClick={onClose}
                        className="quote-send-mail__preview-modal--button"
                    >
                        Atrás
                    </button>

                    <button
                        id={generateId({
                            module: ModuleApp.QUOTES,
                            submodule: `${ModuleApp.MODALS}-preview`,
                            action: ActionElementType.SEND,
                            elementType: ElementType.BTN,
                        })}
                        type="button"
                        onClick={onSend}
                        className="quote-send-mail__preview-modal--button"
                    >
                        Enviar correo
                    </button>
                </div>
            </div>
        </Modal>
    );
};
