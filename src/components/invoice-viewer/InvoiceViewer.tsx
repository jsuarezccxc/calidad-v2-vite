import React, { useMemo } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import { DownloadIcons, DownloadOneIcon, TypeIconDownloadEnum } from '@components/icon';
import { remToPx } from '@utils/Size';
import { ModuleApp } from '@utils/GenerateId';
import { IGenericRecord } from '@models/GenericRecord';
import { IInvoiceViewerProps } from '.';

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

import './InvoiceViewer.scss';

export const InvoiceViewer: React.FC<IInvoiceViewerProps> = ({
    invoiceNumber,
    invoicePDFUrl = '',
    invoiceXLSUrl = '',
    download,
    downloadIcons = true,
    classContainer,
    classWrapper,
    titleClass = '',
    cardClass = 'xs:hidden',
    isPDF = false,
    onlyOneIcon = false,
    iconType = TypeIconDownloadEnum.PDF,
    text = 'el comprobante de pago',
    classesDownloadIcon,
    hiddenMobile = true,
    fixFlex = false,
    overFlowYHidden = false,
    textColor = 'text-purple',
    noIcons = false,
    fileName = '',
    downloadXml,
}) => {
    const [width] = useMemo(() => {
        return [remToPx(38.25)];
    }, [document.body.clientWidth]);

    return (
        <div className={`flex-1 body ${classContainer}`}>
            <p className={`mb-2 ${titleClass} ${textColor} text-sm`}>{invoiceNumber}</p>
            <div className={`${!fixFlex ? 'flex' : ''} ${hiddenMobile ? 'xs:hidden' : ''}  ${classWrapper}`}>
                {invoicePDFUrl ? (
                    <>
                        {isPDF ? (
                            <Document file={invoicePDFUrl}>
                                <Page
                                    pageNumber={1}
                                    width={width}
                                    className={`${noIcons ? 'file' : ''} scrollbar ${overFlowYHidden && 'xs:overflow-y-hidden'}`}
                                />
                            </Document>
                        ) : (
                            <img src={invoicePDFUrl} alt="view" className="bg-gray-softLight w-120 h-60" />
                        )}
                    </>
                ) : (
                    <div className={`${cardClass}`} />
                )}
                {!noIcons && (
                    <DownloadIconsViewer
                        downloadIcons={downloadIcons}
                        onlyOneIcon={onlyOneIcon}
                        download={download}
                        isPDF={isPDF}
                        invoicePDFUrl={invoicePDFUrl}
                        invoiceXLSUrl={invoiceXLSUrl}
                        iconType={iconType}
                        classesDownloadIcon={classesDownloadIcon}
                        fileName={fileName}
                        downloadXml={downloadXml}
                    />
                )}
            </div>
            {!noIcons && (
                <div className={`hidden ${hiddenMobile ? 'xs:block' : ''}`}>
                    <p className="mb-2 text-gray-dark">
                        Para visualizar {text} haga click en el ícono de descarga correspondiente.
                    </p>
                    <DownloadIconsViewer
                        downloadIcons={downloadIcons}
                        onlyOneIcon={onlyOneIcon}
                        download={download}
                        isPDF={isPDF}
                        invoicePDFUrl={invoicePDFUrl}
                        invoiceXLSUrl={invoiceXLSUrl}
                        iconType={iconType}
                        classesDownloadIcon={classesDownloadIcon}
                        downloadXml={downloadXml}
                    />
                </div>
            )}
        </div>
    );
};

const DownloadIconsViewer: React.FC<IGenericRecord> = ({
    downloadIcons,
    onlyOneIcon = false,
    download,
    isPDF,
    invoicePDFUrl,
    invoiceXLSUrl,
    iconType,
    classesDownloadIcon,
    downloadXml,
    fileName,
}) => {
    return (
        downloadIcons &&
        (onlyOneIcon ? (
            <DownloadOneIcon
                moduleId={ModuleApp.ELECTRONIC_INVOICE}
                download={download}
                pdfUrl={isPDF ? invoicePDFUrl : ''}
                className={`ml-5 ${classesDownloadIcon}`}
                typeIconDownload={iconType}
                fileName={fileName}
            />
        ) : (
            <DownloadIcons
                moduleId={ModuleApp.ELECTRONIC_INVOICE}
                download={download}
                pdfUrl={isPDF ? invoicePDFUrl : ''}
                xlsUrl={invoiceXLSUrl || ''}
                className={`ml-5 ${classesDownloadIcon}`}
                downloadXml={downloadXml}
            />
        ))
    );
};
