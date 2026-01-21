import React, { useMemo } from 'react';
import { useHistory } from 'react-router';
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

export const Download: React.FC<IDownloadProps> = ({ isPurchaseSupplier, electronicDocument }) => {
    const [history, dispatch] = [useHistory(), useDispatch()];
    const { downloadXML } = useInvoice();
    const { file_name_extension, xml_url } = electronicDocument;
    const pdfUrl = electronicDocument?.invoice_pdf_url;
    const statusHistory = electronicDocument?.status_history_document;
    const isRejectedDIAN: boolean = electronicDocument.answer_dian === DocumentTraceability.REJECTED_DIAN;
    const isPurchaseNote = [CREDIT_NOTE_SUPPLIER, DEBIT_NOTE_SUPPLIER].includes(electronicDocument?.invoice_type);

    const download = (type: string): void => {
        if (type === PDF) FileSaver.saveAs(pdfUrl || '', `${electronicDocument.number}.pdf`);
        if (type === XML && file_name_extension) {
            const [fileName] = file_name_extension.split('.');
            xml_url ? FileSaver.saveAs(xml_url, `${fileName}.xml`) : downloadXML(file_name_extension);
        }
    };

    const handleRedirect = (): void => {
        dispatch(setSelectedDocument(electronicDocument));
        history.push(getRoute(Routes.EDIT_EMAIL_TEMPLATE_DOCUMENT));
    };

    const handleRedirectNote = (noteType: NotesPurchaseType) => (): void => {
        history.push(`${getRoute(Routes.PURCHASE_INVOICE_NOTES)}?id=${electronicDocument.id}&type=${noteType}`);
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
                onClick={(): void => download(PDF)}
            >
                <Icon name="newPdf" className="w-7.5 mr-2" />
                <p className="download__type--text">Descargar PDF</p>
            </div>
            {!isPurchaseSupplier && !isPurchaseNote && !isRejectedDIAN && (
                <div
                    id={generateId({
                        module: ModuleApp.ELECTRONIC_DOCUMENTS,
                        submodule: `preview-xml`,
                        action: ActionElementType.DOWNLOAD,
                        elementType: ElementType.BTN,
                    })}
                    className="download__type"
                    onClick={(): void => download(XML)}
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
            >
                <Icon name="print" className="w-7.5 mr-2" />
                <a target="__blank" className="download__type--text" href={pdfUrl}>
                    Imprimir
                </a>
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
                    <Icon name="email" className="w-7.5 mr-2" />
                    <p className="download__type--text h-8.2">Enviar por correo</p>
                </div>
            )}
        </div>
    );
};
