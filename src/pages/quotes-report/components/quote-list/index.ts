import { useCallback } from 'react';
import { useHistory } from 'react-router-dom';

import { LinkColor } from '@components/button';
import type { IPaginatorBackend } from '@components/paginator-backend';
import { IBodyTable } from '@components/table';

import { Routes } from '@constants/Paths';
import { ITableFieldType } from '@constants/TableFieldType';

import { getRoute } from '@utils/Paths';

import type { IQuote } from '@models/QuoteGeneration';

export { default as ReportTableContent } from './ReportTableContent';
export { ReportFilters } from './components';


/**
 * Filter state values that IFilterValues interface receives
 *
 * @typeParam search: string - Search term filter
 * @typeParam documentStatus: string - Document status filter
 * @typeParam startDate: Date | null - Start date filter as Date object
 * @typeParam endDate: Date | null - End date filter as Date object
 * @typeParam hasSelectedQuotes: boolean - Whether quotes are selected for deletion
 */
export interface IFilterValues {
    search: string;
    documentStatus: string;
    startDate: Date | null;
    endDate: Date | null;
    hasSelectedQuotes: boolean;
}

/**
 * Filter event handlers that IFilterHandlers interface receives
 *
 * @typeParam onSearchChange: function - Search field change handler
 * @typeParam onDocumentStatusChange: function - Document status filter change handler
 * @typeParam onStartDateChange: function - Start date filter change handler (Date object)
 * @typeParam onEndDateChange: function - End date filter change handler (Date object)
 * @typeParam onDeleteClick: function - Delete selected quotes handler
 * @typeParam handleFilterChange: function - Generic field value change handler
 * @typeParam handleDateChange: function - Generic date field change handler (Date object)
 * @typeParam handleClearFilters: function - Clear all filters handler
 * @typeParam handleApplyFilters: function - Apply filters handler
 */
export interface IFilterHandlers {
    onSearchChange: (value: string) => void;
    onDocumentStatusChange: (value: string) => void;
    onStartDateChange: (value: Date | null) => void;
    onEndDateChange: (value: Date | null) => void;
    onDeleteClick: () => void;
    handleFilterChange: (field: keyof IFilterValues, value: string | Date | null) => void;
    handleDateChange: (field: 'startDate' | 'endDate', value: Date | null) => void;
    handleClearFilters: () => void;
    handleApplyFilters: () => void;
}

/**
 * Report filters component props that IReportFiltersProps interface receives
 * 
 * @typeParam filterValues: IFilterValues - Current filter values
 * @typeParam filterHandlers: IFilterHandlers - Filter event handlers
 * @typeParam isLoading: boolean - Loading state indicator
 * @typeParam disabled: boolean - Disabled state indicator
 */
export interface IReportFiltersProps {
    filterValues: IFilterValues;
    filterHandlers: IFilterHandlers;
    isLoading?: boolean;
    disabled?: boolean;
}

/**
 * Report table component props that IReportTableProps interface receives
 * 
 * @typeParam data: IQuote[] - Quotes data array
 * @typeParam onCheckboxChange: function - Checkbox change handler
 * @typeParam onQuoteClick: function - Quote click handler
 * @typeParam isLoading: boolean - Loading state for table skeleton
 */
export interface IReportTableProps {
    data: IQuote[];
    onCheckboxChange: (id: string, checked: boolean) => void;
    onQuoteClick: (quoteNumber: string) => void;
    isLoading?: boolean;
}

/**
 * Modal visibility states that IModalStates interface receives
 *
 * @typeParam showDeleteModal: boolean - Delete confirmation modal visibility
 */
export interface IModalStates {
    showDeleteModal: boolean;
}

/**
 * Modal event handlers that IModalHandlers interface receives
 *
 * @interface IModalHandlers
 * @typeParam onCloseDeleteModal: function - Close delete confirmation modal handler
 * @typeParam onConfirmDelete: function - Confirm delete action handler
 */
export interface IModalHandlers {
    onCloseDeleteModal: () => void;
    onConfirmDelete: () => void;
}

/**
 * Report modals component props that IReportModalsProps interface receives
 * 
 * @interface IReportModalsProps
 * @typeParam modalStates: IModalStates - Current modal visibility states
 * @typeParam modalHandlers: IModalHandlers - Modal event handlers
 * @typeParam modalContent: object - Optional modal content configuration
 * @typeParam modalContent.title: string - Modal title text
 * @typeParam modalContent.message: string - Modal message text
 * @typeParam modalContent.confirmText: string - Optional confirm button text
 * @typeParam modalContent.cancelText: string - Optional cancel button text
 */
export interface IReportModalsProps {
    modalStates: IModalStates;
    modalHandlers: IModalHandlers;
    modalContent?: {
        title: string;
        message: string;
        confirmText?: string;
        cancelText?: string;
    };
}

/**
 * Custom download icons component props that ICustomDownloadIconsProps interface receives
 * 
 * @interface ICustomDownloadIconsProps
 * @typeParam onPdfClick: function - PDF download click handler
 * @typeParam onXlsClick: function - Excel download click handler
 * @typeParam className: string - Optional additional CSS classes
 */
export interface ICustomDownloadIconsProps {
    onPdfClick: () => void;
    onXlsClick: () => void;
    className?: string;
}

/**
 * Header quotes component props (empty object type)
 * Used for components that don't require props but need type definition
 * 
 * @type IPropsHeaderQuotes
 */
export type IPropsHeaderQuotes = Record<string, never>;

/**
 * Footer quotes component props that IPropsFooterQuotes interface receives
 * 
 * @interface IPropsFooterQuotes
 * @typeParam totalQuotes: number - Total number of quotes for display
 */
export interface IPropsFooterQuotes {
    totalQuotes: number;
}

/**
 * Table quotes component props that IPropsTableQuotes interface receives
 * 
 * @interface IPropsTableQuotes
 * @typeParam props: IPaginatorBackend<IQuote> - Paginated quotes data with backend integration
 * @typeParam isLoadingTable: boolean - Optional table loading state indicator
 */
export interface IPropsTableQuotes {
    props: IPaginatorBackend<IQuote>;
    isLoadingTable?: boolean;
}

/**
 * Timestamp conversion threshold for determining format type
 * 10 digits (10,000,000,000) = Unix timestamp in seconds
 * 13+ digits = Unix timestamp in milliseconds
 */
export const TIMESTAMP_SECONDS_TO_MS_THRESHOLD = 10000000000;

/**
 * Formats timestamp to readable date format (DD/MM/YYYY)
 * Handles both unix timestamps and formatted date strings
 * 
 * @typeParam timestamp: string | number - Unix timestamp or date string to format
 * @returns string - Formatted date in DD/MM/YYYY format
 */
export const formatTimestampToDate = (timestamp: string | number): string => {
    if (!timestamp) return '';
    
    // If already formatted date (contains dashes), return as is
    if (typeof timestamp === 'string' && timestamp.includes('-')) {
        return timestamp;
    }
    
    // Convert unix timestamp to readable date
    const timestampNum = typeof timestamp === 'string' ? parseInt(timestamp) : timestamp;
    
    // If timestamp is in seconds (10 digits), convert to milliseconds
    const timestampMs = timestampNum < TIMESTAMP_SECONDS_TO_MS_THRESHOLD ? timestampNum * 1000 : timestampNum;
    
    const date = new Date(timestampMs);
    
    // Verify if date is valid
    if (isNaN(date.getTime())) return '';
    
    // Format as DD/MM/YYYY
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    
    return `${day}/${month}/${year}`;
};

/**
 * Table field configuration generator for Colombian business formatting standards
 *
 * @returns IBodyTable[]
 */
const fieldsBody = (): IBodyTable[] => [
    {
        type: ITableFieldType.CHECKBOX,
        editableField: false,
        wrapperClassName: 'px-2',
        inputClass: 'quotes-report-table__body__checkbox',
        field: 'checkbox',
    },
    {
        type: ITableFieldType.LINK,
        editableField: false,
        wrapperClassName: 'px-2',
        inputClass: 'quotes-report-table__body__number',
        field: 'number',
        color: LinkColor.PURPLE,
        href: (item): string => `${getRoute(Routes.QUOTES_REPORT)}/${item.id}`,
    },
    {
        type: ITableFieldType.DATE,
        editableField: false,
        wrapperClassName: 'px-2',
        inputClass: 'quotes-report-table__body__date',
        className: 'text-gray',
        field: 'date',
    },
    {
        type: ITableFieldType.TEXT_ACTION,
        editableField: false,
        wrapperClassName: 'px-2',
        inputClass: 'quotes-report-table__body__client',
        className: 'text-gray',
        field: 'client',
    },
    {
        type: ITableFieldType.LINK,
        editableField: false,
        wrapperClassName: 'px-2',
        inputClass: 'quotes-report-table__body__view',
        field: 'view',
        color: LinkColor.PURPLE,
        href: (item): string => `${getRoute(Routes.QUOTES_REPORT)}/view/${item.id}`,
    },
];

/**
 * Utility functions collection for table configuration and Colombian business operations
 */
export const utils = {
    fieldsBody,
};

/**
 * Navigation management hook for quotes workflow routing and URL generation
 *
 * @returns Object with navigation handler functions
 */
export const useReportNavigation = (): {
    handleQuoteClick: (quoteNumber: string) => void;
    handleCreateQuote: () => void;
    handleGoBack: () => void;
    handleGoToGeneratedDocuments: () => void;
} => {
    const history = useHistory();

    const handleQuoteClick = useCallback((quoteNumber: string): void => {
        sessionStorage.removeItem('currentQuoteId');
        sessionStorage.removeItem('currentQuoteNumber');

        const targetUrl = `${getRoute(Routes.QUOTES_REPORT)}?view=quote-view&quote=${quoteNumber}`;
        history.push(targetUrl);
    }, [history]);

    const handleCreateQuote = useCallback((): void => {
        history.push(`${getRoute(Routes.QUOTES_REPORT)}?view=create`);
    }, [history]);

    const handleGoBack = useCallback((): void => {
        history.goBack();
    }, [history]);

    const handleGoToGeneratedDocuments = useCallback((): void => {
        history.push(getRoute(Routes.ELECTRONIC_DOCUMENTS_GENERATED));
    }, [history]);

    return {
        handleQuoteClick,
        handleCreateQuote,
        handleGoBack,
        handleGoToGeneratedDocuments,
    };
};
