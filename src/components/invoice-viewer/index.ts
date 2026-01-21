import { IDownloadFile, TypeIconDownloadEnum } from '@components/icon';

export * from './InvoiceViewer';

/**
 * Properties that invoice viewer component receives
 *
 * @typeParam invoiceNumber?: string - Optional Invoice number
 * @typeParam invoicePDFUrl?: string - Optional prop for view the invoice PDF through the url
 * @typeParam invoiceXLSUrl?: string - Optional prop for view the invoice EXCEL through the url
 * @typeParam download?: string - Optional prop for download the invoice in format pdf or xlsx
 * @typeParam downloadIcons?: boolean - Optional prop for disable DownloadIcons
 * @typeParam classContainer?: string - Optional prop for add classes to the container
 * @typeParam classWrapper?: string - Optional prop for add classes to the wrapper
 * @typeParam titleClass?: string - Optional prop for title className
 * @typeParam CardClass?: string - Optional prop for card className
 * @typeParam isPDF?: boolean - Optional prop state to show pdf
 * @typeParam onlyOneIcon?: boolean - Optional prop state to show only one icon
 * @typeParam iconType?: TypeIconDownloadEnum - Optional prop state to select only one icon showing (PDF or XLSX)
 * @typeParam text?: string - Optional prop for showing text in mobile
 * @typeParam classesDownloadIcon?: string - Optional prop for style download icons
 * @typeParam hiddenMobile?: boolean - Optional hidden pdf in mobile
 * @typeParam fixFlex?: boolean - Optional fix class flex
 * @typeParam overFlowYHidden?: boolean - Optional overflow x hidden
 * @typeParam textColor?: boolean - Optional text color
 * @typeParam noIcons?: boolean - Optional no icons
 * @typeParam downloadXml?: () => void - Optional douwnload xml
 *  * @typeParam fileName?: string - Optional prop for pdf name
 */
export interface IInvoiceViewerProps {
    invoiceNumber?: string;
    invoicePDFUrl?: string;
    invoiceXLSUrl?: string;
    download?: IDownloadFile;
    downloadIcons?: boolean;
    classContainer?: string;
    classWrapper?: string;
    titleClass?: string;
    cardClass?: string;
    isPDF?: boolean;
    onlyOneIcon?: boolean;
    iconType?: TypeIconDownloadEnum;
    text?: string;
    classesDownloadIcon?: string;
    hiddenMobile?: boolean;
    fixFlex?: boolean;
    overFlowYHidden?: boolean;
    textColor?: string;
    fileName?: string;
    noIcons?: boolean;
    downloadXml?: () => void;
}
