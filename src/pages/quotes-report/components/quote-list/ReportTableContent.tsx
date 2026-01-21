import React, { useCallback, useMemo, useState } from 'react';
import { Icon } from '@components/icon';
import { useReportDownload } from '@hooks/useReportDownload';
import { useReportData } from '../..';
import type { IFilterValues } from '.';
import { CreateQuoteButton, CustomDownloadIcons, ReportFilters, ReportHeader, ReportModals, ReportTable } from './components';
import { useReportNavigation } from '.';
import './QuoteList.scss';

const FILTER_FIELDS = {
    SEARCH: 'search',
    DOCUMENT_STATUS: 'documentStatus',
    START_DATE: 'startDate',
    END_DATE: 'endDate',
} as const;

type DateField = typeof FILTER_FIELDS.START_DATE | typeof FILTER_FIELDS.END_DATE;

const PAGINATION_CONFIG = {
    MIN_PAGE_FOR_ADVANCED_NAV: 2,
    MAX_VISIBLE_PAGES: 5,
    FIRST_PAGE: 1,
    ZERO_BASED_OFFSET: 1,
    PAGES_OFFSET_FOR_CENTERING: 4,
} as const;


const calculatePageNumber = (index: number, currentPage: number, totalPages: number): number | null => {
    let pageNumber = index + PAGINATION_CONFIG.ZERO_BASED_OFFSET;
    const zeroBasedCurrentPage = currentPage - PAGINATION_CONFIG.ZERO_BASED_OFFSET;
    
    if (zeroBasedCurrentPage > PAGINATION_CONFIG.MIN_PAGE_FOR_ADVANCED_NAV && totalPages > PAGINATION_CONFIG.MAX_VISIBLE_PAGES) {
        pageNumber = Math.max(PAGINATION_CONFIG.FIRST_PAGE, zeroBasedCurrentPage - PAGINATION_CONFIG.ZERO_BASED_OFFSET) + index;
        if (pageNumber > totalPages) {
            pageNumber = totalPages - PAGINATION_CONFIG.PAGES_OFFSET_FOR_CENTERING + index;
        }
    }
    return pageNumber > totalPages ? null : pageNumber;
};

const shouldShowPreviousNav = (currentPage: number): boolean => {
    return currentPage > PAGINATION_CONFIG.FIRST_PAGE;
};

const shouldShowNextNav = (currentPage: number, totalPages: number): boolean => {
    return currentPage < totalPages;
};

const createPageClickHandler = (pageNumber: number, setData?: (page: number) => void) => (): void => { if (setData) setData(pageNumber); };

const ReportTableContent: React.FC = () => {
    const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);

    const {
        data,
        search,
        documentStatus,
        startDate,
        endDate,
        isLoading,
        allQuotes,
        setSearch,
        setDocumentStatus,
        setStartDate,
        setEndDate,
        handleCheckboxChange,
        handleDeleteQuotes
    } = useReportData();

    const { state: downloadState, operations: downloadOperations } = useReportDownload({
        data,
        filters: { search, documentStatus, startDate, endDate },
        allQuotes,
    });

    const { showDownloadSuccessModal } = downloadState;
    const { setShowDownloadSuccessModal, handlePDFDownload, handleExcelDownload } = downloadOperations;

    const { handleQuoteClick, handleCreateQuote } = useReportNavigation();

    const hasSelectedQuotes = useMemo(() => {
        return data.data && data.data.some(quote => quote.checked);
    }, [data.data]);

    const handleConfirmDelete = useCallback((): void => { handleDeleteQuotes(); setShowDeleteModal(false); }, [handleDeleteQuotes]);

    if (isLoading) {
        return null;
    }

    return (
        <div className="w-full">
            <ReportHeader />

            <div className="flex justify-end w-full mb-4">
                <div className="flex items-center gap-2">
                    <CreateQuoteButton onClick={handleCreateQuote} />
                    <CustomDownloadIcons 
                        onPdfClick={handlePDFDownload}
                        onXlsClick={handleExcelDownload}
                        className=""
                    />
                </div>
            </div>

            <ReportFilters
                filterValues={{ search, documentStatus, startDate, endDate, hasSelectedQuotes }}
                filterHandlers={{
                    onSearchChange: setSearch,
                    onDocumentStatusChange: setDocumentStatus,
                    onStartDateChange: setStartDate,
                    onEndDateChange: setEndDate,
                    onDeleteClick: (): void => {
                        setShowDeleteModal(true);
                    },
                    handleFilterChange: (field: keyof IFilterValues, value: string): void => {
                        if (field === FILTER_FIELDS.SEARCH) setSearch(value);
                        if (field === FILTER_FIELDS.DOCUMENT_STATUS) setDocumentStatus(value);
                    },
                    handleDateChange: (field: DateField, value: string): void => {
                        if (field === FILTER_FIELDS.START_DATE) setStartDate(value);
                        if (field === FILTER_FIELDS.END_DATE) setEndDate(value);
                    },
                    handleClearFilters: (): void => {
                        setSearch('');
                        setDocumentStatus('');
                        setStartDate('');
                        setEndDate('');
                    },
                    handleApplyFilters: (): void => {
                    },
                }}
            />

            <div className="mt-6">
                <ReportTable 
                    data={data.data} 
                    onCheckboxChange={handleCheckboxChange} 
                    onQuoteClick={handleQuoteClick}
                />
                
                {data && data.meta && data.meta.last_page > 1 && (
                    <div className="flex items-center justify-end xs:pt-0 border-gray-dark margin-paginator">
                        <p className="text-tiny block sm:hidden text-gray-dark mr-1.5 xs:mr-0">
                            Pág. <span className="font-semibold">{data.meta.current_page}</span> de {data.meta.last_page}:
                        </p>
                        <p className="text-tiny hidden sm:block text-gray-dark mr-1.5 xs:mr-0">
                            Página <span className="font-semibold">{data.meta.current_page}</span> de {data.meta.last_page}:
                        </p>
                        
                        {shouldShowPreviousNav(data.meta.current_page) && (
                            <Icon
                                name="arrowLeftDGray"
                                className="bg-transparent w-5.5 h-5.5 cursor-pointer"
                                onClick={createPageClickHandler(data.meta.current_page - PAGINATION_CONFIG.ZERO_BASED_OFFSET, data.setData)}
                            />
                        )}
                        
                        {Array.from({ length: Math.min(PAGINATION_CONFIG.MAX_VISIBLE_PAGES, data.meta.last_page) }, (_, i) => {
                            const pageNumber = calculatePageNumber(i, data.meta.current_page, data.meta.last_page);
                            
                            if (pageNumber === null) return null;
                            
                            const isActive = data.meta.current_page === pageNumber;
                            const activeClass = isActive ? 'bg-green rounded-md text-white' : 'text-gray-dark';
                            
                            return (
                                <span
                                    key={pageNumber}
                                    className={`flex text-tiny cursor-pointer ${activeClass} px-1.5 py-0.75`}
                                    onClick={createPageClickHandler(pageNumber, data.setData)}
                                >
                                    {pageNumber}
                                </span>
                            );
                        }).filter(Boolean)}
                        
                        {data.meta.current_page === data.meta.last_page && <div className="h-5.5 w-5.5" />}
                        
                        {shouldShowNextNav(data.meta.current_page, data.meta.last_page) && (
                            <Icon
                                name="arrowRightDGray"
                                className="bg-transparent w-5.5 h-5.5 cursor-pointer"
                                onClick={createPageClickHandler(data.meta.current_page + 1, data.setData)}
                            />
                        )}
                    </div>
                )}
            </div>

            <ReportModals
                modalStates={{
                    showDeleteModal,
                    showDownloadSuccessModal,
                }}
                modalHandlers={{
                    onCloseDeleteModal: (): void => {
                        setShowDeleteModal(false);
                    },
                    onCloseDownloadModal: (): void => setShowDownloadSuccessModal(false),
                    onConfirmDelete: handleConfirmDelete,
                }}
            />

        </div>
    );
};

export default ReportTableContent;
