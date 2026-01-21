import React, { useState } from 'react';
import { Document as PdfDocument, Page } from 'react-pdf';
import { BreadCrumb } from '@components/bread-crumb';
import { Icon } from '@components/icon';
import { Modal } from '@components/modal';
import { PageTitle } from '@components/page-title';
import { Routes } from '@constants/Paths';
import { SUPPORT_DOCUMENTS_SUBTITLE } from '@constants/DocumentTexts';
import { getRouteName } from '@utils/Paths';
import { ModuleApp, ElementType, ActionElementType, generateId } from '@utils/GenerateId';
import emailIcon from '@assets/images/email.svg';
import loadingIcon from '@assets/images/loading.svg';
import moneyInvoiceIcon from '@assets/images/add-money-invoice.svg';
import newPdfIcon from '@assets/images/new-pdf.svg';
import printIcon from '@assets/images/print.svg';
import { BUTTON_CONFIG, IActionButtonProps, IActionButtonsBarProps, IQuotePreviewContainerProps } from '..';
import '../QuoteView.scss';

export const ActionButton: React.FC<IActionButtonProps> = ({
    id,
    label,
    iconSrc,
    iconAlt,
    onClick,
    width = 'auto',
    multiline = false,
    ariaLabel,
    disabled = false,
    className,
}) => {
    return (
        <button
            id={id}
            type="button"
            onClick={onClick}
            disabled={disabled}
            aria-label={ariaLabel || label.replace(/\n/g, ' ')}
            className={`quote-view__action-button ${
                width === 'fixed' ? 'quote-view__action-button--fixed-width' : 'quote-view__action-button--auto'
            } ${className ? `quote-view__action-button--${className}` : ''}`}
        >
            <img src={iconSrc} alt={iconAlt} className="quote-view__icon" />
            <span
                className={`button-text ${multiline ? 'button-text--multi-line' : 'button-text--single-line'}`}
                dangerouslySetInnerHTML={{ __html: label.replace(/\n/g, '<br />') }}
            />
        </button>
    );
};

export const QuoteViewHeader: React.FC = () => {
    const routes = [
        {
            name: getRouteName(Routes.ELECTRONIC_DOCUMENTS),
            route: '/documentos-electronicos',
        },
        {
            name: 'Cómo generar y transmitir Factura electrónica de venta y Documento soporte',
            route: '/documentos-electronicos/factura-electronica',
        },
        {
            name: 'Cotizaciones',
            route: '/documentos-electronicos/factura-electronica/cotizaciones',
        },
        {
            name: 'Visualizar cotización',
            route: '#',
        },
    ];

    return (
        <>
            <PageTitle title={getRouteName(Routes.ELECTRONIC_DOCUMENTS)} pageContent={SUPPORT_DOCUMENTS_SUBTITLE} />
            <BreadCrumb routes={routes} />
            <h2 className="quote-view__page-subtitle">
                Cómo generar y transmitir Factura electrónica de venta y Documento soporte
            </h2>

            <div className="quote-view__title">
                <h3>Visualizar cotización</h3>
            </div>

            <p className="quote-view__description">
                A continuación, revise en detalle la cotización y seleccione la acción que desea realizar.
            </p>
        </>
    );
};

export const ActionButtonsBar: React.FC<IActionButtonsBarProps> = ({
    onExportPDF,
    onPrint,
    onSendEmail,
    onGenerateInvoice,
    disabled = {},
}) => {
    return (
        <div className="quote-view__action-buttons">
            <ActionButton
                id={generateId({
                    module: ModuleApp.QUOTES,
                    submodule: `pdf`,
                    action: ActionElementType.DOWNLOAD,
                    elementType: ElementType.BTN,
                })}
                label={BUTTON_CONFIG.DOWNLOAD_PDF.label}
                iconSrc={newPdfIcon}
                iconAlt="PDF"
                onClick={onExportPDF}
                width="auto"
                ariaLabel={BUTTON_CONFIG.DOWNLOAD_PDF.ariaLabel}
                disabled={disabled.exportPDF}
            />

            <ActionButton
                id={generateId({
                    module: ModuleApp.QUOTES,
                    action: ActionElementType.PRINT,
                    elementType: ElementType.BTN,
                })}
                label={BUTTON_CONFIG.PRINT.label}
                iconSrc={printIcon}
                iconAlt="Print"
                onClick={onPrint}
                width="fixed"
                ariaLabel={BUTTON_CONFIG.PRINT.ariaLabel}
                disabled={disabled.print}
            />

            <ActionButton
                id={generateId({
                    module: ModuleApp.QUOTES,
                    submodule: `email`,
                    action: ActionElementType.SEND,
                    elementType: ElementType.BTN,
                })}
                label={BUTTON_CONFIG.SEND_EMAIL.label}
                iconSrc={emailIcon}
                iconAlt="Email"
                onClick={onSendEmail}
                width="auto"
                multiline={BUTTON_CONFIG.SEND_EMAIL.multiline}
                ariaLabel={BUTTON_CONFIG.SEND_EMAIL.ariaLabel}
                disabled={disabled.sendEmail}
            />

            <ActionButton
                id={generateId({
                    module: ModuleApp.QUOTES,
                    submodule: `generate-electronic-invoice`,
                    action: ActionElementType.REDIRECT,
                    elementType: ElementType.BTN,
                })}
                label={BUTTON_CONFIG.GENERATE_INVOICE.label}
                iconSrc={moneyInvoiceIcon}
                iconAlt="Icon generar FV DS"
                onClick={onGenerateInvoice}
                width="auto"
                multiline={BUTTON_CONFIG.GENERATE_INVOICE.multiline}
                ariaLabel={BUTTON_CONFIG.GENERATE_INVOICE.ariaLabel}
                disabled={disabled.generateInvoice}
                className="generateInvoice"
            />
        </div>
    );
};

export const QuotePreviewContainer: React.FC<IQuotePreviewContainerProps> = ({ quoteData }) => {
    const hasPdfUrl = quoteData?.pdfUrl && quoteData.pdfUrl.length > 0;
    const [localShowModal, setLocalShowModal] = useState(false);

    return (
        <div className="quote-view__preview-container">
            <div className="quote-view__preview-wrapper">
                <div className="quote-view__preview-background">
                    <div className="quote-view__preview-content">
                        {hasPdfUrl ? (
                            <>
                                <div className="quote-view__document-container">
                                    <div className="quote-view__document-scaled">
                                        <PdfDocument file={quoteData.pdfUrl}>
                                            <Page
                                                pageNumber={1}
                                                width={450}
                                                renderTextLayer={false}
                                                renderAnnotationLayer={false}
                                            />
                                        </PdfDocument>
                                    </div>
                                </div>
                                <div className="quote-view__hover-overlay" onClick={(): void => setLocalShowModal(true)}>
                                    <Icon name="searchPlusBlue" className="quote-view__search-icon" />
                                </div>
                            </>
                        ) : (
                            <div className="quote-view__document-container">
                                <div className="flex flex-col items-center justify-center h-full">
                                    <img src={loadingIcon} alt="Cargando documento" className="w-12 h-12 mb-4 animate-spin" />
                                    <p className="text-lg font-medium text-gray-600">Cargando documento...</p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <Modal
                id={generateId({
                    module: ModuleApp.QUOTES,
                    action: ActionElementType.PREVIEW,
                    elementType: ElementType.MDL,
                })}
                handleClose={(): void => setLocalShowModal(false)}
                open={localShowModal}
            >
                <div className="quote-view__modal">
                    <PdfDocument file={quoteData?.pdfUrl}>
                        <Icon
                            name="closeHeader"
                            onClick={(): void => setLocalShowModal(false)}
                            className="quote-view__close-icon"
                        />
                        <Page pageNumber={1} />
                    </PdfDocument>
                </div>
            </Modal>
        </div>
    );
};
