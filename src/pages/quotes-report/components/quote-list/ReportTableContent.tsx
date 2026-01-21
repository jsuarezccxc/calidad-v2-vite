import React, { useCallback, useMemo, useState } from 'react';

import { ButtonWithIcon } from '@components/button';
import { DownloadIcons } from '@components/icon';
import { PageButtonsFooter } from '@components/page-buttons-footer';
import { PaginatorBackend } from '@components/paginator-backend';

import { IQuote } from '@models/QuoteGeneration';

import { useReportDownload } from '@hooks/useReportDownload';

import { generateId, ModuleApp, ElementType, ActionElementType } from '@utils/GenerateId';

import { ReportFilters, ReportHeader, ReportModals, ReportTable, VALIDATION_CONSTANTS } from './components';
import { useReportData } from '../..';
import { useReportNavigation } from '.';
import type { IFilterValues } from '.';

const FILTER_FIELDS = {
    SEARCH: 'search',
    DOCUMENT_STATUS: 'documentStatus',
    START_DATE: 'startDate',
    END_DATE: 'endDate',
} as const;

type DateField = typeof FILTER_FIELDS.START_DATE | typeof FILTER_FIELDS.END_DATE;

const ReportTableContent: React.FC = () => {
    const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);

    const {
        data,
        search,
        documentStatus,
        startDate,
        endDate,
        allQuotes,
        isLoading,
        setSearch,
        setDocumentStatus,
        setStartDate,
        setEndDate,
        handleCheckboxChange,
        handleDeleteQuotes,
    } = useReportData();

    const { operations: downloadOperations } = useReportDownload({
        data,
        filters: { search, documentStatus, startDate, endDate },
        allQuotes,
    });

    const { handlePDFDownload, handleExcelDownload } = downloadOperations;

    const { handleQuoteClick, handleCreateQuote, handleGoBack, handleGoToGeneratedDocuments } = useReportNavigation();

    const hasSelectedQuotes = useMemo(() => {
        return data.data && data.data.some((quote: IQuote) => quote.checked);
    }, [data.data]);

    const handleConfirmDelete = useCallback((): void => {
        handleDeleteQuotes();
        setShowDeleteModal(false);
    }, [handleDeleteQuotes]);

    return (
        <div className="w-full">
            <ReportHeader />

            <div className="flex justify-end w-full mb-4">
                <div className="flex items-center gap-2">
                    <ButtonWithIcon
                        id={generateId({
                            module: ModuleApp.QUOTES,
                            submodule: 'report',
                            action: ActionElementType.CREATE,
                            elementType: ElementType.BTN,
                        })}
                        onClick={handleCreateQuote}
                        nameIcon="addGreen"
                        className="quote-list__create-button"
                    >
                        Crear cotización
                    </ButtonWithIcon>
                    <DownloadIcons
                        moduleId="quotes-report"
                        download={{
                            pdf: handlePDFDownload,
                            excel: handleExcelDownload,
                        }}
                        withoutText
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
                    handleFilterChange: (field: keyof IFilterValues, value: string | Date | null): void => {
                        if (field === FILTER_FIELDS.SEARCH) setSearch(value as string);
                        if (field === FILTER_FIELDS.DOCUMENT_STATUS) setDocumentStatus(value as string);
                    },
                    handleDateChange: (field: DateField, value: Date | null): void => {
                        if (field === FILTER_FIELDS.START_DATE) setStartDate(value);
                        if (field === FILTER_FIELDS.END_DATE) setEndDate(value);
                    },
                    handleClearFilters: (): void => {
                        setSearch('');
                        setDocumentStatus('');
                        setStartDate(null);
                        setEndDate(null);
                    },
                    handleApplyFilters: (): void => {},
                }}
            />

            <div className="mt-12">
                <ReportTable
                    data={data.data}
                    onCheckboxChange={handleCheckboxChange}
                    onQuoteClick={handleQuoteClick}
                    isLoading={isLoading}
                />

                {data.meta && data.meta.total > VALIDATION_CONSTANTS.EMPTY_COUNT && (
                    <PaginatorBackend
                        data={data.data}
                        meta={data.meta}
                        links={data.links}
                        setData={data.setData}
                        wrapperClassName="mt-6"
                    />
                )}

                <PageButtonsFooter
                    moduleId={ModuleApp.QUOTES}
                    onClickButtonLeft={handleGoBack}
                    titleButtonLeft="Atrás"
                    onClickButtonRight={handleGoToGeneratedDocuments}
                    titleButtonRight="Siguiente"
                    validationPermission={{ name: '', moduleName: '' }}
                />
            </div>

            <ReportModals
                modalStates={{
                    showDeleteModal,
                }}
                modalHandlers={{
                    onCloseDeleteModal: (): void => {
                        setShowDeleteModal(false);
                    },
                    onConfirmDelete: handleConfirmDelete,
                }}
            />
        </div>
    );
};

export default ReportTableContent;
