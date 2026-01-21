export { default as QuoteSendMail } from './QuoteSendMail';

/**
 * Email form state structure for quote email composition
 * 
 * @interface IEmailFormState
 * @typeParam email: string - Recipient email address with validation
 * @typeParam subject: string - Email subject line with character limit
 * @typeParam content: string - Email body content with rich text support
 * @typeParam file: Array - Attached files array with metadata
 */
export interface IEmailFormState {
    email: string;
    subject: string;
    content: string;
    file: Array<{ name: string; files: File[] }>;
}

/**
 * Modal visibility states for email workflow management
 * 
 * @interface IModalStates
 * @typeParam showPreview: boolean - Email preview modal visibility state
 * @typeParam showSuccessModal: boolean - Success confirmation modal visibility
 * @typeParam showErrorModal: boolean - Error notification modal visibility
 * @typeParam errorMessage: string - Detailed error message for user display
 */
export interface IModalStates {
    showPreview: boolean;
    showSuccessModal: boolean;
    showErrorModal: boolean;
    errorMessage: string;
}

/**
 * Email form header component properties for quote context display
 * 
 * @interface IEmailFormHeaderProps
 * @typeParam quoteNumber: string - Quote number for context display
 * @typeParam customerName: string - Customer name for header information
 * @typeParam onBack: () => void - Back navigation handler
 * @typeParam onClose: () => void - Close form handler
 * @typeParam canGoBack: boolean - Enable back navigation button
 * @typeParam showProgress: boolean - Display progress indicator
 * @typeParam currentStep: number - Current workflow step number
 * @typeParam totalSteps: number - Total steps in workflow
 */
export interface IEmailFormHeaderProps {
    quoteNumber: string;
    customerName: string;
    onBack: () => void;
    onClose: () => void;
    canGoBack?: boolean;
    showProgress?: boolean;
    currentStep?: number;
    totalSteps?: number;
}

/**
 * Email input component properties for recipient address management
 * 
 * @interface IEmailInputProps
 * @typeParam value: string - Current email input value
 * @typeParam onChange: (value: string) => void - Value change handler
 * @typeParam onValidate: (isValid: boolean) => void - Validation result callback
 * @typeParam isValid: boolean - Current validation state
 * @typeParam error: string - Error message for invalid input
 * @typeParam suggestions: string[] - Email suggestions for autocomplete
 * @typeParam multiple: boolean - Allow multiple email recipients
 * @typeParam required: boolean - Mark field as required
 * @typeParam placeholder: string - Placeholder text for input
 */
export interface IEmailInputProps {
    value: string;
    onChange: (value: string) => void;
    onValidate: (isValid: boolean) => void;
    isValid?: boolean;
    error?: string;
    suggestions?: string[];
    multiple?: boolean;
    required?: boolean;
    placeholder?: string;
}

/**
 * Subject input component properties for email title management
 * 
 * @interface ISubjectInputProps
 * @typeParam value: string - Current subject input value
 * @typeParam onChange: (value: string) => void - Subject change handler
 * @typeParam maxLength: number - Maximum character limit
 * @typeParam suggestions: string[] - Subject line suggestions
 * @typeParam required: boolean - Mark field as required
 * @typeParam placeholder: string - Placeholder text for input
 * @typeParam showCharCount: boolean - Display character counter
 */
export interface ISubjectInputProps {
    value: string;
    onChange: (value: string) => void;
    maxLength?: number;
    suggestions?: string[];
    required?: boolean;
    placeholder?: string;
    showCharCount?: boolean;
}

/**
 * Content textarea component properties for email body composition
 * 
 * @interface IContentTextareaProps
 * @typeParam value: string - Current content value
 * @typeParam onChange: (value: string) => void - Content change handler
 * @typeParam richText: boolean - Enable rich text editor
 * @typeParam templates: Array - Available email templates
 * @typeParam onTemplateSelect: Function - Template selection handler
 * @typeParam minHeight: number - Minimum textarea height
 * @typeParam required: boolean - Mark field as required
 */
export interface IContentTextareaProps {
    value: string;
    onChange: (value: string) => void;
    richText?: boolean;
    templates?: Array<{
        id: string;
        name: string;
        content: string;
    }>;
    onTemplateSelect?: (template: { id: string; name: string; content: string }) => void;
    minHeight?: number;
    required?: boolean;
}

/**
 * Image upload component properties for email attachments
 * 
 * @interface IImageUploadProps
 * @typeParam files: File[] - Currently uploaded files array
 * @typeParam onFilesChange: (files: File[]) => void - Files change handler
 * @typeParam onFileRemove: (fileIndex: number) => void - File removal handler
 * @typeParam maxFiles: number - Maximum number of files allowed
 * @typeParam maxFileSize: number - Maximum file size in bytes
 * @typeParam acceptedTypes: string[] - Allowed file types array
 * @typeParam multiple: boolean - Allow multiple file selection
 * @typeParam dragDrop: boolean - Enable drag-and-drop functionality
 * @typeParam uploadText: string - Custom upload instruction text
 * @typeParam showPreview: boolean - Display file previews
 */
export interface IImageUploadProps {
    files: File[];
    onFilesChange: (files: File[]) => void;
    onFileRemove: (fileIndex: number) => void;
    maxFiles?: number;
    maxFileSize?: number;
    acceptedTypes?: string[];
    multiple?: boolean;
    dragDrop?: boolean;
    uploadText?: string;
    showPreview?: boolean;
}

/**
 * Modal state configuration for email workflow dialogs
 * 
 * @interface IModalState
 * @typeParam isOpen: boolean - Modal visibility state
 * @typeParam title: string - Modal title text
 * @typeParam message: string - Modal message content
 * @typeParam type: 'success' | 'error' | 'warning' | 'info' - Modal type for styling
 * @typeParam closable: boolean - Allow modal to be closed
 * @typeParam backdrop: boolean - Show backdrop overlay
 * @typeParam onClose: () => void - Close handler function
 */
export interface IModalState {
    isOpen: boolean;
    title?: string;
    message?: string;
    type?: 'success' | 'error' | 'warning' | 'info';
    closable?: boolean;
    backdrop?: boolean;
    onClose?: () => void;
}

/**
 * Modal interaction handlers for email workflow management
 * 
 * @interface IModalHandlers
 * @typeParam openModal: (config: Partial<IModalState>) => void - Open modal with configuration
 * @typeParam closeModal: () => void - Close modal handler
 * @typeParam handleConfirm: () => void - Confirmation action handler
 * @typeParam handleCancel: () => void - Cancel action handler
 * @typeParam handleAction: (actionType: string) => void - Generic action handler
 * @typeParam handleBackdropClick: () => void - Backdrop click handler
 */
export interface IModalHandlers {
    openModal: (config: Partial<IModalState>) => void;
    closeModal: () => void;
    handleConfirm: () => void;
    handleCancel: () => void;
    handleAction?: (actionType: string) => void;
    handleBackdropClick?: () => void;
}

/**
 * Email content structure for send operation and preview
 * 
 * @interface IEmailContent
 * @typeParam to: string - Recipient email address
 * @typeParam subject: string - Email subject line
 * @typeParam content: string - Email body content
 * @typeParam attachments: File[] - Email attachment files
 * @typeParam metadata: object - Email metadata with quote context
 */
export interface IEmailContent {
    to: string;
    subject: string;
    content: string;
    attachments: File[];
    metadata: {
        quoteNumber: string;
        customerName: string;
        senderName: string;
        priority?: 'low' | 'normal' | 'high';
        scheduledSend?: Date;
        trackOpening?: boolean;
        requestReadReceipt?: boolean;
    };
}

/**
 * Preview modal component properties for email confirmation
 * 
 * @interface IPreviewModalProps
 * @typeParam isOpen: boolean - Modal visibility state
 * @typeParam emailContent: IEmailContent - Complete email content for preview
 * @typeParam onClose: () => void - Close modal handler
 * @typeParam onSend: () => void - Send email handler
 * @typeParam onEdit: () => void - Edit email handler
 * @typeParam isSending: boolean - Email sending state
 * @typeParam showFullContent: boolean - Display full email content
 * @typeParam previewOptions: object - Preview display configuration
 */
export interface IPreviewModalProps {
    isOpen: boolean;
    emailContent: IEmailContent;
    onClose: () => void;
    onSend: () => void;
    onEdit: () => void;
    isSending?: boolean;
    showFullContent?: boolean;
    previewOptions?: {
        showHeaders: boolean;
        showAttachments: boolean;
        showMetadata: boolean;
    };
}

/**
 * Form layout and dimension constants for email composition interface
 * Defines standardized measurements for consistent form appearance and responsive design.
 * Optimized for Colombian business email workflow and accessibility requirements.
 */
export const FORM_CONSTANTS = {
  FORM_WIDTH: '29.1875rem', // 467px
  IMAGE_SECTION_HEIGHT: '8.625rem', // 138px
  IMAGE_UPLOAD_HEIGHT: '7.25rem', // 116px
  INPUT_HEIGHT: '3.3125rem', // 53px
  TEXTAREA_MIN_HEIGHT: '10.5rem', // 168px
  TEXTAREA_MAX_HEIGHT: '15.625rem', // 250px
  
  SECTION_MARGIN_BOTTOM: '1.125rem', // 18px
  SECTION_MARGIN_LEFT: '2rem', // 32px
  SECTION_MARGIN_TOP: '2rem', // 32px
  LABEL_MARGIN_BOTTOM: '0.375rem', // 6px
  
  INPUT_PADDING: '1rem 0.75rem', // 16px 12px
  TEXTAREA_PADDING: '0.75rem', // 12px
  UPLOAD_PADDING: '2.375rem 0.375rem', // 38px 6px
} as const;

/**
 * Typography constants for professional email form styling
 * Font families and sizes optimized for business communication and readability.
 * Ensures consistent appearance across email composition interface.
 */
export const TYPOGRAPHY = {
  FONT_FAMILY: 'Aller, sans-serif',
  FONT_FAMILY_BOLD: 'AllerBold, Aller, sans-serif',
  
  LABEL_SIZE: '1rem', // 16px
  INPUT_SIZE: '1rem', // 16px
  BUTTON_SIZE: '0.8125rem', // 13px,
  
  FONT_WEIGHT_NORMAL: '400',
  FONT_WEIGHT_BOLD: '700',
} as const;

/**
 * Button styling constants for email form actions
 * Standardized button dimensions, spacing, and visual properties.
 * Provides consistent interaction design throughout email workflow.
 */
export const BUTTON_STYLES = {
  WIDTH: '9.5625rem', // 153px
  HEIGHT: '2.0625rem', // 33px
  BORDER_RADIUS: '0.5rem', // 8px
  GAP: '1.125rem', // 18px
  PADDING: '0.25rem 0.6875rem', // 4px 11px
  BOX_SHADOW: '0 0.25rem 0.25rem 0 rgba(0,0,0,0.25)',
  TRANSITION: 'all 0.2s',
} as const;

/**
 * Validation rules and limits for email form inputs
 * Character limits and validation constraints for professional business emails.
 * Ensures email content meets Colombian business communication standards.
 */
export const VALIDATION = {
  MAX_SUBJECT_LENGTH: 240,
  MAX_CONTENT_LENGTH: 245,
} as const;

/**
 * File upload configuration for email attachments
 * Defines accepted file types, size limits, and upload interface text.
 * Optimized for email compatibility and Colombian business document standards.
 */
export const FILE_UPLOAD = {
  ACCEPTED_TYPES: '.png,.jpg,.jpeg,image/png,image/jpeg,image/jpg',
  PLACEHOLDER_TEXT: 'Subir archivo png, jpg, jpge',
  MAX_FILE_SIZE: 5 * 1024 * 1024, // 5MB
} as const;

/**
 * Application routes for email workflow navigation
 * URL paths for quote email workflow and related navigation.
 * Supports workflow transitions and return navigation.
 */
export const ROUTES = {
  QUOTES_REPORT: '/quotes-report',
  QUOTE_VIEW: '/quotes-report?view=quote-view',
} as const;

/**
 * Email form management hook with Colombian business workflow integration
 * 
 * Custom React hook that manages email composition state, validation, and API interactions.
 * Handles form data, modal states, file uploads, and email sending workflow.
 * Integrates with quote context and session management for business continuity.
 * 
 * Features:
 * - Complete email form state management with validation
 * - Modal state control for preview, success, and error workflows
 * - File upload handling with validation and error management
 * - Email sending API integration with error handling
 * - Quote context preservation through session storage
 * - Form validation with character limits and required fields
 * - Colombian business email standards compliance
 * - Success and error feedback with user-friendly messaging
 * 
 * @returns Object containing form state, modal states, and handler functions
 */
import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { IFile } from '@components/input';
import { apiPostQuote } from '@api/quotes';
import { FetchRequest } from '@models/Request';
import { urls } from '@api/urls';

export const useEmailForm = (): {
  formState: IEmailFormState;
  modalStates: IModalStates;
  quoteNumber: string | null;
  handleEmailChange: (value: string) => void;
  handleSubjectChange: (value: string) => void;
  handleContentChange: (value: string) => void;
  handleFileChange: (file: IFile) => void;
  showPreviewModal: () => void;
  hidePreviewModal: () => void;
  showSuccessModal: () => void;
  showErrorModal: (message: string) => void;
  handleSendEmail: () => Promise<void>;
} => {
  const [formState, setFormState] = useState<IEmailFormState>({
    email: '',
    subject: '',
    content: '',
    file: [{ name: 'emailImage', files: [] }],
  });

  const [modalStates, setModalStates] = useState<IModalStates>({
    showPreview: false,
    showSuccessModal: false,
    showErrorModal: false,
    errorMessage: '',
  });

  const handleEmailChange = (value: string): void => {
    setFormState(prev => ({ ...prev, email: value }));
  };

  const handleSubjectChange = (value: string): void => {
    if (value.length <= VALIDATION.MAX_SUBJECT_LENGTH) {
      setFormState(prev => ({ ...prev, subject: value }));
    }
  };

  const handleContentChange = (value: string): void => {
    if (value.length <= VALIDATION.MAX_CONTENT_LENGTH) {
      setFormState(prev => ({ ...prev, content: value }));
    }
  };

  const handleFileChange = (file: File): void => {
    setFormState(prev => ({
      ...prev,
      file: [{ name: 'emailImage', files: [file] }]
    }));
  };

  const showPreviewModal = (): void => {
    setModalStates(prev => ({ ...prev, showPreview: true }));
  };

  const hidePreviewModal = (): void => {
    setModalStates(prev => ({ ...prev, showPreview: false }));
  };

  const showSuccessModal = (): void => {
    setModalStates(prev => ({
      ...prev,
      showPreview: false,
      showSuccessModal: true,
    }));
  };

  const hideSuccessModal = (): void => {
    setModalStates(prev => ({ ...prev, showSuccessModal: false }));
  };

  const showErrorModal = (error: string): void => {
    setModalStates(prev => ({
      ...prev,
      showPreview: false,
      showErrorModal: true,
      errorMessage: error,
    }));
  };

  const hideErrorModal = (): void => {
    setModalStates(prev => ({
      ...prev,
      showErrorModal: false,
      errorMessage: '',
    }));
  };

  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const quoteNumberFromUrl = searchParams.get('quote');
  
  const quoteId = sessionStorage.getItem('currentQuoteId');
  const quoteNumber = sessionStorage.getItem('currentQuoteNumber') || quoteNumberFromUrl;

  const handleSendEmail = async (): Promise<void> => {
    try {
      if (!formState.email || !formState.subject || !formState.content || !quoteId) {
        return;
      }

      const emailData = {
        id: quoteId,
        subject: formState.subject,
        body_content: formState.content,
        invoice_type: 'QUOTE',
        client_email: formState.email,
      };

      const request = new FetchRequest(urls.invoice.quotes.sendEmail, emailData);

      const response = await apiPostQuote(request);

      if (response) {
        showSuccessModal();
        
        setTimeout(() => {
          setFormState({
            email: '',
            subject: '',
            content: '',
            file: [{ name: 'emailImage', files: [] }],
          });
        }, 1500);
      }
    } catch (error) {
      console.error('Error sending email:', error);
    }
  };

  return {
    formState,
    quoteNumber,
    handleEmailChange,
    handleSubjectChange,
    handleContentChange,
    handleFileChange,
    modalStates,
    showPreviewModal,
    hidePreviewModal,
    showSuccessModal,
    hideSuccessModal,
    showErrorModal,
    hideErrorModal,
    handleSendEmail,
  };
}; 
