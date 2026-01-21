import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { downloadQuoteReportWithFilters } from '@redux/quotes/actions';
import type {
    IUseReportDownloadParams,
    IUseReportDownloadReturn
} from '@models/QuoteGeneration';

/**
 * Downloads a blob file by creating a temporary download link
 * @param blob - The blob to download
 * @param fileName - The name for the downloaded file
 */
const downloadBlob = (blob: Blob, fileName: string): void => {
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
};

/**
 * Custom hook for managing quote report downloads
 * 
 * @typeParam params: IUseReportDownloadParams - Configuration object containing data and filter parameters
 * @typeParam return: IUseReportDownloadReturn - Object containing download state and operations
 */
export const useReportDownload = (params: IUseReportDownloadParams): IUseReportDownloadReturn => {
    const dispatch = useDispatch();
    const [showDownloadSuccessModal, setShowDownloadSuccessModal] = useState<boolean>(false);

    const { filters } = params;

    /**
     * Handle PDF download functionality
     * Uses Redux action for all business logic and API calls
     */
    const handlePDFDownload = async (): Promise<void> => {
        const fileName = `cotizaciones-reporte-${new Date().toISOString().split('T')[0]}.pdf`;
        const blob = await dispatch(downloadQuoteReportWithFilters('pdf', filters, filters.startDate, filters.endDate));
        
        if (blob instanceof Blob && blob.size > 0) {
            downloadBlob(blob, fileName);
            setShowDownloadSuccessModal(true);
        }
    };

    /**
     * Handle Excel download functionality  
     * Uses Redux action for all business logic and API calls
     */
    const handleExcelDownload = async (): Promise<void> => {
        const fileName = `cotizaciones-reporte-${new Date().toISOString().split('T')[0]}.xlsx`;
        const blob = await dispatch(downloadQuoteReportWithFilters('xlsx', filters, filters.startDate, filters.endDate));
        
        if (blob instanceof Blob && blob.size > 0) {
            downloadBlob(blob, fileName);
            setShowDownloadSuccessModal(true);
        }
    };

    return {
        state: {
            showDownloadSuccessModal,
        },
        operations: {
            setShowDownloadSuccessModal,
            handlePDFDownload,
            handleExcelDownload,
        },
    };
};
