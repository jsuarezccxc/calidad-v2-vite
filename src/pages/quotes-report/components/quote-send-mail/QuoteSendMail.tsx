import React from 'react';
import { useHistory } from 'react-router-dom';
import { SharedModal } from '@components/modal';
import { PageButtonsFooter } from '@components/page-buttons-footer';
import { QUOTE_SEND_MAIL_UI_CONFIG } from '@constants/QuoteViewLabels';
import { UI_MESSAGES } from '@information-texts/QuoteSendMail';
import { ModuleApp } from '@utils/GenerateId';
import { EmailFormHeader, ImageUpload, EmailInput, SubjectInput, ContentTextarea, PreviewModal } from './components';
import { useEmailForm } from '.';
import { ROUTES } from '.';
import './QuoteSendMail.scss';

const QuoteSendMail: React.FC = () => {
    const history = useHistory();

    const {
        formState,
        quoteNumber,
        handleEmailChange,
        handleSubjectChange,
        handleContentChange,
        handleFileChange,
        modalStates,
        showPreviewModal,
        hidePreviewModal,
        hideSuccessModal,
        hideErrorModal,
        handleSendEmail,
    } = useEmailForm();

    const handleGoBack = (): void => {
        history.goBack();
    };

    const handleGoNext = (): void => {
        hideSuccessModal();
        history.push(ROUTES.QUOTES_REPORT);
    };

    const handleFileSelect = (file: File): void => {
        handleFileChange(file);
    };

    const getCurrentFileName = (): string | null => {
        return (
            formState.file[QUOTE_SEND_MAIL_UI_CONFIG.ARRAY_INDICES.FIRST_ELEMENT]?.files?.[
                QUOTE_SEND_MAIL_UI_CONFIG.ARRAY_INDICES.FIRST_ELEMENT
            ]?.name || null
        );
    };

    const getImagePreviewUrl = (): string | undefined => {
        return formState.file[QUOTE_SEND_MAIL_UI_CONFIG.ARRAY_INDICES.FIRST_ELEMENT]?.files?.[
            QUOTE_SEND_MAIL_UI_CONFIG.ARRAY_INDICES.FIRST_ELEMENT
        ]
            ? URL.createObjectURL(
                  formState.file[QUOTE_SEND_MAIL_UI_CONFIG.ARRAY_INDICES.FIRST_ELEMENT].files[
                      QUOTE_SEND_MAIL_UI_CONFIG.ARRAY_INDICES.FIRST_ELEMENT
                  ]
              )
            : undefined;
    };

    return (
        <div className="quote-send-mail__container">
            <EmailFormHeader
                title={
                    quoteNumber ? UI_MESSAGES.SEND_EMAIL_TITLE.replace('{number}', quoteNumber) : UI_MESSAGES.EDIT_TEMPLATE_TITLE
                }
            />

            <div className="quote-send-mail__form-container">
                <ImageUpload fileName={getCurrentFileName()} onFileSelect={handleFileSelect} />

                <EmailInput value={formState.email} onChange={handleEmailChange} />

                <SubjectInput value={formState.subject} onChange={handleSubjectChange} />

                <ContentTextarea value={formState.content} onChange={handleContentChange} />
            </div>

            <PageButtonsFooter
                moduleId={ModuleApp.QUOTES}
                titleButtonLeft={UI_MESSAGES.BUTTON_LABELS.BACK}
                titleButtonCenter={UI_MESSAGES.BUTTON_LABELS.PREVIEW}
                titleButtonRight={UI_MESSAGES.BUTTON_LABELS.SEND_EMAIL}
                onClickButtonLeft={handleGoBack}
                onClickButtonCenter={showPreviewModal}
                onClickButtonRight={handleSendEmail}
                threeButtons={QUOTE_SEND_MAIL_UI_CONFIG.FORM_STATES.THREE_BUTTONS_ENABLED}
                bgColorCenterButton={UI_MESSAGES.BACKGROUND_COLOR}
                className="quote-send-mail__page-buttons-footer"
                classButton="quote-send-mail__button"
            />

            {modalStates.showPreview && (
                <PreviewModal
                    modalState={{
                        open: modalStates.showPreview,
                    }}
                    modalHandlers={{
                        onClose: hidePreviewModal,
                        onSend: handleSendEmail,
                    }}
                    emailContent={{
                        email: formState.email,
                        subject: formState.subject,
                        content: formState.content,
                        imagePreview: getImagePreviewUrl(),
                    }}
                />
            )}

            <SharedModal
                moduleId={`${ModuleApp.QUOTES}-success`}
                open={modalStates.showSuccessModal}
                finalAction={handleGoNext}
                text={{
                    title: UI_MESSAGES.MODALS.SUCCESS.TITLE,
                    description: UI_MESSAGES.MODALS.SUCCESS.DESCRIPTION,
                }}
                iconName="check"
                finishButtonText={UI_MESSAGES.BUTTON_LABELS.ACCEPT}
            />

            <SharedModal
                moduleId={`${ModuleApp.QUOTES}-error`}
                open={modalStates.showErrorModal}
                finalAction={hideErrorModal}
                text={{
                    title: UI_MESSAGES.MODALS.ERROR.TITLE,
                    description: modalStates.errorMessage || UI_MESSAGES.MODALS.ERROR.DESCRIPTION,
                }}
                iconName="triangleInfoMulticolor"
                finishButtonText={UI_MESSAGES.BUTTON_LABELS.ACCEPT}
            />
        </div>
    );
};

export default QuoteSendMail;
