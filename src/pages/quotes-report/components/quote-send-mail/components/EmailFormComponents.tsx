import React, { useState } from 'react';
import { TextInput, FileInput } from '@components/input';
import { QUOTE_EMAIL_FORM_UI_CONFIG } from '@constants/QuoteViewLabels';
import { UI_MESSAGES } from '@information-texts/QuoteSendMail';
import { validateEmail } from '@utils/Validation';
import { ModuleApp, ActionElementType, generateId, ElementType } from '@utils/GenerateId';
import infoIcon from '@assets/images/info-green.svg';
import type { IEmailInputProps, ISubjectInputProps, IContentTextareaProps, IImageUploadProps } from '..';
import { VALIDATION, FILE_UPLOAD } from '..';
import '../QuoteSendMail.scss';

export const EmailInput: React.FC<IEmailInputProps> = ({
    value,
    onChange,
    disabled = false,
    placeholder = UI_MESSAGES.EMAIL.PLACEHOLDER,
}) => {
    const [isValid, setIsValid] = React.useState(QUOTE_EMAIL_FORM_UI_CONFIG.VALIDATION_STATES.VALID);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
        const newValue = e.target.value;
        onChange(newValue);
        if (newValue.trim()) {
            setIsValid(validateEmail(newValue));
        } else {
            setIsValid(QUOTE_EMAIL_FORM_UI_CONFIG.VALIDATION_STATES.VALID);
        }
    };

    return (
        <div className="quote-send-mail__input-section">
            <div className="quote-send-mail__label-container">
                <div className="quote-send-mail__email-form--info-icon">
                    <img src={infoIcon} alt="Info" className="w-full h-full cursor-pointer" title={UI_MESSAGES.EMAIL.TOOLTIP} />
                </div>
                <label className="quote-send-mail__input-label">{UI_MESSAGES.EMAIL.LABEL}</label>
            </div>

            <TextInput
                id={generateId({
                    module: ModuleApp.QUOTES,
                    submodule: `form-email`,
                    action: ActionElementType.INPUT,
                    elementType: ElementType.TXT,
                })}
                type="email"
                value={value}
                onChange={handleChange}
                placeholder={placeholder}
                disabled={disabled}
                hasError={!isValid && value.trim() !== ''}
                classesInput={!isValid && value.trim() ? 'quote-send-mail__input-error' : ''}
            />

            {!isValid && value.trim() && <div className="quote-send-mail__error-message">{UI_MESSAGES.EMAIL.ERROR}</div>}
        </div>
    );
};

export const SubjectInput: React.FC<ISubjectInputProps> = ({
    value,
    onChange,
    disabled = false,
    placeholder = UI_MESSAGES.SUBJECT.PLACEHOLDER,
}) => {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
        const newValue = e.target.value;
        if (newValue.length <= VALIDATION.MAX_SUBJECT_LENGTH) {
            onChange(newValue);
        }
    };

    return (
        <div className="quote-send-mail__input-section">
            <label className="quote-send-mail__input-label quote-send-mail__block-label">{UI_MESSAGES.SUBJECT.LABEL}</label>

            <TextInput
                id={generateId({
                    module: ModuleApp.QUOTES,
                    submodule: `form-subject`,
                    action: ActionElementType.INPUT,
                    elementType: ElementType.TXT,
                })}
                type="text"
                value={value}
                onChange={handleChange}
                placeholder={placeholder}
                maxLength={VALIDATION.MAX_SUBJECT_LENGTH}
                disabled={disabled}
            />
        </div>
    );
};

export const ContentTextarea: React.FC<IContentTextareaProps> = ({
    value,
    onChange,
    placeholder = UI_MESSAGES.CONTENT.PLACEHOLDER,
}) => {
    const [editorContent, setEditorContent] = React.useState(value);
    const contentEditableRef = React.useRef<HTMLDivElement>(null);

    const handleRichTextChange = (): void => {
        if (contentEditableRef.current) {
            const newContent = contentEditableRef.current.innerHTML;
            if (newContent.length <= VALIDATION.MAX_CONTENT_LENGTH) {
                onChange(newContent);
                setEditorContent(newContent);
            }
        }
    };

    const executeCommand = (command: string, value?: string): void => {
        document.execCommand(command, QUOTE_EMAIL_FORM_UI_CONFIG.VALIDATION_STATES.INVALID, value);
        handleRichTextChange();
    };

    const isOverLimit = value.length > VALIDATION.MAX_CONTENT_LENGTH;

    return (
        <div className="quote-send-mail__input-section">
            <label className="quote-send-mail__input-label quote-send-mail__block-label">{UI_MESSAGES.CONTENT.LABEL}</label>

            <div className="quote-send-mail__textarea-container">
                <div className="quote-send-mail__rich-text-editor">
                    <div className="quote-send-mail__rich-text-toolbar">
                        <button
                            type="button"
                            className="quote-send-mail__toolbar-button"
                            onClick={(): void => executeCommand('bold')}
                            title={UI_MESSAGES.CONTENT.TOOLBAR_TOOLTIPS.BOLD}
                        >
                            <strong>B</strong>
                        </button>
                        <button
                            type="button"
                            className="quote-send-mail__toolbar-button"
                            onClick={(): void => executeCommand('italic')}
                            title={UI_MESSAGES.CONTENT.TOOLBAR_TOOLTIPS.ITALIC}
                        >
                            <em>I</em>
                        </button>
                        <button
                            type="button"
                            className="quote-send-mail__toolbar-button"
                            onClick={(): void => executeCommand('underline')}
                            title={UI_MESSAGES.CONTENT.TOOLBAR_TOOLTIPS.UNDERLINE}
                        >
                            <u>U</u>
                        </button>
                        <button
                            type="button"
                            className="quote-send-mail__toolbar-button"
                            onClick={(): void => executeCommand('insertUnorderedList')}
                            title={UI_MESSAGES.CONTENT.TOOLBAR_TOOLTIPS.BULLET_LIST}
                        >
                            {UI_MESSAGES.CONTENT.BULLET_SYMBOL}
                        </button>
                        <button
                            type="button"
                            className="quote-send-mail__toolbar-button"
                            onClick={(): void => executeCommand('insertOrderedList')}
                            title={UI_MESSAGES.CONTENT.TOOLBAR_TOOLTIPS.NUMBERED_LIST}
                        >
                            {UI_MESSAGES.CONTENT.NUMBER_SYMBOL}
                        </button>
                        <button
                            type="button"
                            className="quote-send-mail__toolbar-button"
                            onClick={(): void => executeCommand('createLink', prompt(UI_MESSAGES.CONTENT.LINK_PROMPT) || '')}
                            title={UI_MESSAGES.CONTENT.TOOLBAR_TOOLTIPS.LINK}
                        >
                            {UI_MESSAGES.CONTENT.LINK_SYMBOL}
                        </button>
                        <select
                            className="quote-send-mail__toolbar-button"
                            onChange={(e): void => executeCommand('fontName', e.target.value)}
                            title={UI_MESSAGES.CONTENT.TOOLBAR_TOOLTIPS.FONT}
                        >
                            <option value={UI_MESSAGES.CONTENT.FONTS.HELVETICA}>{UI_MESSAGES.CONTENT.FONTS.HELVETICA}</option>
                            <option value={UI_MESSAGES.CONTENT.FONTS.ARIAL}>{UI_MESSAGES.CONTENT.FONTS.ARIAL}</option>
                            <option value={UI_MESSAGES.CONTENT.FONTS.TIMES}>{UI_MESSAGES.CONTENT.FONTS.TIMES}</option>
                            <option value={UI_MESSAGES.CONTENT.FONTS.COURIER}>{UI_MESSAGES.CONTENT.FONTS.COURIER}</option>
                        </select>
                    </div>
                    <div
                        ref={contentEditableRef}
                        className="quote-send-mail__rich-text-content"
                        contentEditable
                        onInput={handleRichTextChange}
                        dangerouslySetInnerHTML={{ __html: editorContent }}
                        data-placeholder={placeholder}
                    />
                </div>

                <div
                    className={`quote-send-mail__character-counter ${
                        isOverLimit ? 'quote-send-mail__character-counter--over-limit' : ''
                    }`}
                >
                    {UI_MESSAGES.CHARACTER_COUNTER.TEMPLATE.replace('{current}', value.length.toString()).replace(
                        '{max}',
                        VALIDATION.MAX_CONTENT_LENGTH.toString()
                    )}
                </div>
            </div>
        </div>
    );
};

export const ImageUpload: React.FC<IImageUploadProps> = ({ fileName, onFileSelect, disabled = false }) => {
    const [file, setFile] = useState([
        {
            name: 'email-attachment',
            files: fileName ? [{ name: fileName }] : [],
            value: 0,
        },
    ]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
        if (e.target.files && e.target.files[0]) {
            const selectedFile = e.target.files[0];

            if (selectedFile.size > FILE_UPLOAD.MAX_FILE_SIZE) {
                const sizeInMB = FILE_UPLOAD.MAX_FILE_SIZE / QUOTE_EMAIL_FORM_UI_CONFIG.FILE_SIZE_MB_DIVISOR;
                alert(UI_MESSAGES.UPLOAD.SIZE_LIMIT_ERROR.replace('{size}', sizeInMB.toString()));
                return;
            }

            onFileSelect(selectedFile);
        }
    };

    const handleFileDelete = (): void => {
        onFileSelect(null);
        setFile([
            {
                name: 'email-attachment',
                files: [],
                value: 0,
            },
        ]);
    };

    return (
        <div className="quote-send-mail__input-section">
            <FileInput
                id={generateId({
                    module: ModuleApp.QUOTES,
                    submodule: `form-image`,
                    action: ActionElementType.UPLOAD,
                    elementType: ElementType.TXT,
                })}
                labelText={UI_MESSAGES.UPLOAD.LABEL}
                name="email-attachment"
                file={file}
                setFile={setFile}
                fileExtensionAccept={FILE_UPLOAD.ACCEPTED_TYPES}
                disabled={disabled}
                instructions={<span className="quote-send-mail__upload-main-text">{UI_MESSAGES.UPLOAD.UPLOAD_TEXT}</span>}
                placeholder={UI_MESSAGES.UPLOAD.SIZE_TEXT.replace(
                    '{size}',
                    (FILE_UPLOAD.MAX_FILE_SIZE / QUOTE_EMAIL_FORM_UI_CONFIG.FILE_SIZE_MB_DIVISOR).toString()
                )}
                sizeMaxMB={FILE_UPLOAD.MAX_FILE_SIZE / QUOTE_EMAIL_FORM_UI_CONFIG.FILE_SIZE_MB_DIVISOR}
                isValidateSize={true}
                getFile={handleFileChange}
                onClick={handleFileDelete}
                classesWrapper="quote-send-mail__file-upload-wrapper"
                classNameFiles="quote-send-mail__file-upload-container"
            />
        </div>
    );
};
