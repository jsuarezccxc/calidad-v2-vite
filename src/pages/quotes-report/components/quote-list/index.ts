export { default as ReportTableContent } from './ReportTableContent';
export { ReportFilters } from './components';
import type { IQuote } from '../../index';
import type { IPaginatorBackend } from '@components/paginator-backend';
import { useCallback } from 'react';
import { useHistory } from 'react-router-dom';
import { Routes } from '@constants/Paths';
import { getRoute } from '@utils/Paths';
import { LinkColor } from '@components/button';
import { IBodyTable } from '@components/table';
import { ITableFieldType } from '@constants/TableFieldType';


/**
 * Filter state values that IFilterValues interface receives
 * 
 * @typeParam search: string - Search term filter
 * @typeParam documentStatus: string - Document status filter
 * @typeParam startDate: string - Start date filter
 * @typeParam endDate: string - End date filter
 * @typeParam hasSelectedQuotes: boolean - Whether quotes are selected for deletion
 */
export interface IFilterValues {
    search: string;
    documentStatus: string;
    startDate: string;
    endDate: string;
    hasSelectedQuotes: boolean;
}

/**
 * Filter event handlers that IFilterHandlers interface receives
 * 
 * @typeParam handleFilterChange: function - Field value change handler
 * @typeParam handleDateChange: function - Date field change handler
 * @typeParam handleClearFilters: function - Clear all filters handler
 * @typeParam handleApplyFilters: function - Apply filters handler
 * @typeParam handleDateFocus: function - Date field focus handler
 * @typeParam handleDateBlur: function - Date field blur handler
 */
export interface IFilterHandlers {
    handleFilterChange: (field: keyof IFilterValues, value: string) => void;
    handleDateChange: (field: 'startDate' | 'endDate', value: string) => void;
    handleClearFilters: () => void;
    handleApplyFilters: () => void;
    handleDateFocus?: () => void;
    handleDateBlur?: () => void;
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
 */
export interface IReportTableProps {
    data: IQuote[];
    onCheckboxChange: (id: string, checked: boolean) => void;
    onQuoteClick: (quoteNumber: string) => void;
}

/**
 * Create quote button props that ICreateQuoteButtonProps interface receives
 * 
 * @typeParam onClick: function - Button click handler
 * @typeParam disabled: boolean - Button disabled state
 * @typeParam isLoading: boolean - Loading state indicator
 * @typeParam className: string - Additional CSS classes
 */
export interface ICreateQuoteButtonProps {
    onClick: () => void;
    disabled?: boolean;
    isLoading?: boolean;
    className?: string;
}

/**
 * Modal visibility states that IModalStates interface receives
 * 
 * @typeParam showSuccess: boolean - Success modal visibility
 * @typeParam showError: boolean - Error modal visibility
 * @typeParam showConfirm: boolean - Confirm modal visibility
 * @typeParam showInfo: boolean - Info modal visibility
 * @typeParam showWarning: boolean - Warning modal visibility
 * @typeParam showLoading: boolean - Loading modal visibility
 */
export interface IModalStates {
    showSuccess: boolean;
    showError: boolean;
    showConfirm: boolean;
    showInfo: boolean;
    showWarning?: boolean;
    showLoading?: boolean;
}

/**
 * Modal event handlers that IModalHandlers interface receives
 * 
 * @interface IModalHandlers
 * @typeParam handleCloseModal: function - Close any modal handler
 * @typeParam handleShowModal: function - Show specific modal by type handler
 * @typeParam handleConfirmAction: function - Confirm action in modal handler
 * @typeParam handleCancelAction: function - Cancel action in modal handler
 * @typeParam handleSuccessAction: function - Optional success action handler
 * @typeParam handleErrorAction: function - Optional error action handler
 */
export interface IModalHandlers {
    handleCloseModal: () => void;
    handleShowModal: (modalType: keyof IModalStates) => void;
    handleConfirmAction: () => void;
    handleCancelAction: () => void;
    handleSuccessAction?: () => void;
    handleErrorAction?: () => void;
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
} => {
    const history = useHistory();

    const handleQuoteClick = useCallback((quoteNumber: string): void => {
        const targetUrl = `${getRoute(Routes.QUOTES_REPORT)}?view=quote-view&quote=${quoteNumber}`;
        history.push(targetUrl);
    }, [history]);

    const handleCreateQuote = useCallback((): void => {
        history.push(`${getRoute(Routes.QUOTES_REPORT)}?view=create`);
    }, [history]);

    return {
        handleQuoteClick,
        handleCreateQuote,
    };
};
