import React, { useMemo } from 'react';
import { useHistory } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import FileSaver from 'file-saver';
import { setSelectedDocument } from '@redux/electronic-invoice/actions';
import useInvoice from '@hooks/useInvoice';
import { Icon } from '@components/icon';
import { getRoute } from '@utils/Paths';
import { lengthEqualOne, lengthEqualToZero } from '@utils/Length';
import { ElementType, generateId, ModuleApp, ActionElementType } from '@utils/GenerateId';
import { Routes } from '@constants/Paths';
import { PDF, XML } from '@constants/DownloadFile';
import { InvoiceState } from '@constants/ElectronicDocuments';
import { DocumentTraceability } from '@constants/ElectronicInvoice';
import { CREDIT_NOTE_SUPPLIER, DEBIT_NOTE_SUPPLIER, NotesPurchaseType } from '@constants/PurchaseInvoiceNotes';
import { IDownloadProps } from '.';

export const Download: React.FC<IDownloadProps> = ({ isPurchaseSupplier, electronicDocument, isQuote = false }) => {
    const [history, dispatch] = [useHistory(), useDispatch()];
    const { downloadXML } = useInvoice();
    const { file_name_extension, xml_url } = electronicDocument;
    const pdfUrl = electronicDocument?.invoice_pdf_url || electronicDocument?.pdf_url;
    const statusHistory = electronicDocument?.status_history_document;
    const isRejectedDIAN: boolean = electronicDocument.answer_dian === DocumentTraceability.REJECTED_DIAN;
    const isPurchaseNote = [CREDIT_NOTE_SUPPLIER, DEBIT_NOTE_SUPPLIER].includes(electronicDocument?.invoice_type);

    const download = async (type: string): Promise<void> => {
        if (type === PDF && pdfUrl) {
            const response = await fetch(pdfUrl);
            const blob = await response.blob();
            FileSaver.saveAs(blob, `${electronicDocument.number}.pdf`);
        }
        if (type === XML && file_name_extension) {
            const [fileName] = file_name_extension.split('.');
            if (xml_url) {
                const response = await fetch(xml_url);
                const blob = await response.blob();
                FileSaver.saveAs(blob, `${fileName}.xml`);
            } else {
                downloadXML(file_name_extension);
            }
        }
    };

    const handleRedirect = (): void => {
        dispatch(setSelectedDocument(electronicDocument));
        if (isQuote) {
            history.push(`${getRoute(Routes.QUOTES_REPORT)}?view=quote-send-mail&id=${electronicDocument.id}`);
        } else {
            history.push(getRoute(Routes.EDIT_EMAIL_TEMPLATE_DOCUMENT));
        }
    };

    const handleGenerateInvoice = (): void => {
        history.push(`${getRoute(Routes.GENERATE_SALES_INVOICE)}?invoice=quote&id=${electronicDocument.id}`);
    };

    const handleRedirectNote = (noteType: NotesPurchaseType) => (): void => {
        history.push(`${getRoute(Routes.PURCHASE_INVOICE_NOTES)}?id=${electronicDocument.id}&type=${noteType}`);
    };

    const handlePrint = async (): Promise<void> => {
        if (pdfUrl) {
            const response = await fetch(pdfUrl);
            const blob = await response.blob();
            const blobUrl = URL.createObjectURL(blob);
            const printWindow = window.open(blobUrl);
            if (printWindow) {
                printWindow.onload = (): void => {
                    printWindow.print();
                };
            }
        }
    };

    const isVoided = useMemo((): boolean => electronicDocument?.invoice_state === InvoiceState.Voided, [
        electronicDocument?.invoice_state,
    ]);

    return (
        <div className="download">
            <div
                id={generateId({
                    module: ModuleApp.ELECTRONIC_DOCUMENTS,
                    submodule: `preview-pdf`,
                    action: ActionElementType.DOWNLOAD,
                    elementType: ElementType.BTN,
                })}
                className="download__type"
                onClick={(): Promise<void> => download(PDF)}
            >
                <Icon name="newPdf" className="w-7.5 mr-2" />
                <p className="download__type--text">Descargar PDF</p>
            </div>
            {!isPurchaseSupplier && !isPurchaseNote && !isRejectedDIAN && !isQuote && (
                <div
                    id={generateId({
                        module: ModuleApp.ELECTRONIC_DOCUMENTS,
                        submodule: `preview-xml`,
                        action: ActionElementType.DOWNLOAD,
                        elementType: ElementType.BTN,
                    })}
                    className="download__type"
                    onClick={(): Promise<void> => download(XML)}
                >
                    <Icon name="xml" className="w-7.5 mr-2" />
                    <p className="download__type--text">Descargar XML</p>
                </div>
            )}
            <div
                id={generateId({
                    module: ModuleApp.ELECTRONIC_DOCUMENTS,
                    submodule: `preview-print`,
                    action: ActionElementType.DOWNLOAD,
                    elementType: ElementType.BTN,
                })}
                className="download__type"
                onClick={handlePrint}
            >
                <Icon name="print" className="w-7.5 mr-2" />
                <p className="download__type--text">Imprimir</p>
            </div>
            {isPurchaseSupplier && !isPurchaseNote && (lengthEqualOne(statusHistory) || lengthEqualToZero(statusHistory)) && (
                <>
                    <button
                        id={generateId({
                            module: ModuleApp.ELECTRONIC_DOCUMENTS,
                            submodule: `preview`,
                            action: ActionElementType.EDIT,
                            elementType: ElementType.BTN,
                        })}
                        className="download__type"
                        onClick={(): void =>
                            history.push(`${getRoute(Routes.GENERATE_PURCHASE_INVOICE)}?id=${electronicDocument?.id}`)
                        }
                    >
                        <Icon name="pencilMulticolor" className="w-7.5 h-8.2 mr-2" />
                        <p className="download__type--text">Editar factura de compra</p>
                    </button>
                    {!isVoided && (
                        <>
                            <button
                                id={generateId({
                                    module: ModuleApp.ELECTRONIC_DOCUMENTS,
                                    submodule: `preview-${ModuleApp.ELECTRONIC_DEBIT_NOTE}`,
                                    action: ActionElementType.ACTION,
                                    elementType: ElementType.BTN,
                                })}
                                className="download__type"
                                onClick={handleRedirectNote(NotesPurchaseType.DebitNote)}
                            >
                                <Icon name="debitNote" className="w-7.5 h-8.2 mr-2" />
                                <p className="download__type--text">Registrar nota débito</p>
                            </button>
                            <button
                                id={generateId({
                                    module: ModuleApp.ELECTRONIC_DOCUMENTS,
                                    submodule: `preview-${ModuleApp.ELECTRONIC_CREDIT_NOTE}`,
                                    action: ActionElementType.ACTION,
                                    elementType: ElementType.BTN,
                                })}
                                className="download__type"
                                onClick={handleRedirectNote(NotesPurchaseType.CreditNote)}
                            >
                                <Icon name="creditNote" className="w-7.5 h-8.2 mr-2" />
                                <p className="download__type--text">Registrar nota crédito</p>
                            </button>
                        </>
                    )}
                </>
            )}
            {!isPurchaseSupplier && !isPurchaseNote && !isRejectedDIAN && (
                <div
                    id={generateId({
                        module: ModuleApp.ELECTRONIC_DOCUMENTS,
                        submodule: `preview-email`,
                        action: ActionElementType.SEND,
                        elementType: ElementType.BTN,
                    })}
                    className="download__type"
                    onClick={handleRedirect}
                >
                    <Icon name="email" className="w-7.5" />
                    <p className="download__type--text">Enviar por correo</p>
                </div>
            )}
            {isQuote && (
                <button
                    id={generateId({
                        module: ModuleApp.ELECTRONIC_DOCUMENTS,
                        submodule: `preview-generate-invoice`,
                        action: ActionElementType.ACTION,
                        elementType: ElementType.BTN,
                    })}
                    className="download__generate-invoice"
                    onClick={handleGenerateInvoice}
                >
                    <Icon name="moneyInvoice" className="w-7.5 h-8.2" />
                    <p className="download__generate-invoice--text">Generar factura electrónica de venta</p>
                </button>
            )}
        </div>
    );
};
