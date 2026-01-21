import { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { hideLoader, showLoader } from '@redux/loader/actions';
import { deleteQuote, getQuotes } from '@redux/quotes/actions';
import { RootState } from '@redux/rootReducer';

import { IQuote } from '@models/QuoteGeneration';
import { IPaginatorBackend } from '@components/paginator-backend';

import { paginationDataFormat } from '@constants/PaginationBack';
import { 
    QUOTES_DEFAULTS,
    QUOTES_PAGINATION 
} from '@constants/QuoteViewLabels';

import { isValidPageNumber } from '@utils/quoteHelpers';
import { getUnixFromDate } from '@utils/Date';

import type { IQuoteFilters, PaginationData } from '@pages/quotes-report';

/**
 * Return type interface for useReportData custom hook
 * Provides comprehensive state management and operations for quote report listing
 *
 * @interface IUseReportDataReturn
 * @typeParam search: string - Current search term filter for quote numbers
 * @typeParam documentStatus: string - Current document status filter (Sent/Unsent)
 * @typeParam startDate: Date | null - Filter start date as Date object
 * @typeParam endDate: Date | null - Filter end date as Date object
 * @typeParam isLoading: boolean - Loading state indicator for async operations
 * @typeParam currentPage: number - Current active page number in pagination
 * @typeParam data: IPaginatorBackend<IQuote> - Paginated quote data with metadata
 * @typeParam allQuotes: IQuote[] - Complete unfiltered quotes array for export
 * @typeParam quotesPerPage: number - Number of quotes displayed per page
 * @typeParam setSearch: function - Update search filter value
 * @typeParam setDocumentStatus: function - Update document status filter
 * @typeParam setStartDate: function - Update start date filter (Date object)
 * @typeParam setEndDate: function - Update end date filter (Date object)
 * @typeParam setCurrentPage: function - Update current pagination page
 * @typeParam handlePaginationChange: function - Process pagination navigation events
 * @typeParam loadQuotes: function - Fetch quotes from backend with current filters
 * @typeParam handleCheckboxChange: function - Toggle checkbox state for quote selection
 * @typeParam handleDeleteQuotes: function - Delete selected quotes with confirmation
 * @typeParam loadAllQuotesForExport: function - Load complete quote dataset for export operations
 */
interface IUseReportDataReturn {
    search: string;
    documentStatus: string;
    startDate: Date | null;
    endDate: Date | null;
    isLoading: boolean;
    currentPage: number;
    data: IPaginatorBackend<IQuote>;
    allQuotes: IQuote[];
    quotesPerPage: number;
    setSearch: (value: string) => void;
    setDocumentStatus: (value: string) => void;
    setStartDate: (value: Date | null) => void;
    setEndDate: (value: Date | null) => void;
    setCurrentPage: (value: number) => void;
    handlePaginationChange: (pageData?: PaginationData) => void;
    loadQuotes: () => Promise<void>;
    handleCheckboxChange: (quoteId: string, checked: boolean) => void;
    handleDeleteQuotes: () => Promise<void>;
    loadAllQuotesForExport: () => Promise<IQuote[]>;
}

/**
 * Custom hook for managing quote report list data and operations
 *
 * Provides comprehensive state management for quote listing including:
 * - Multi-criteria filtering (search, status, date range)
 * - Client-side pagination with sorting
 * - Bulk selection and deletion
 * - Export data preparation
 *
 * Features:
 * - Automatic data fetching on filter changes
 * - Smart pagination with exact/partial search prioritization
 * - Descending sort by quote number (most recent first)
 * - Optimistic UI updates with Redux integration
 *
 * @returns {IUseReportDataReturn} Complete quote report management interface
 */
export const useReportData = (): IUseReportDataReturn => {
    const dispatch = useDispatch();
    
    const [search, setSearch] = useState<string>('');
    const [documentStatus, setDocumentStatus] = useState<string>('');
    const [startDate, setStartDate] = useState<Date | null>(null);
    const [endDate, setEndDate] = useState<Date | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [currentPage, setCurrentPage] = useState<number>(QUOTES_PAGINATION.INITIAL_PAGE);

    const quotesData = useSelector((state: RootState) => state.quotes?.responseList || {});

    const extractPageNumber = useCallback((pageData: PaginationData): number => {
        if (typeof pageData === 'number') {
            return pageData + 1;
        }

        if (typeof pageData === 'string') {
            if (pageData === 'next') return currentPage + 1;
            if (pageData === 'prev') return currentPage - 1;
            return Number(pageData);
        }

        if (typeof pageData === 'object' && pageData !== null) {
            return pageData.page || pageData.meta?.current_page || pageData.params?.page || currentPage;
        }

        return currentPage;
    }, [currentPage]);

    const handlePaginationChange = useCallback((pageData?: PaginationData) => {
        if (!pageData) return;

        const newPage = extractPageNumber(pageData);
        if (isValidPageNumber(newPage, currentPage)) {
            setCurrentPage(newPage);
        }
    }, [currentPage, extractPageNumber]);

    const [data, setData] = useState<IPaginatorBackend<IQuote>>({
        ...paginationDataFormat,
        data: [],
        meta: {
            ...QUOTES_DEFAULTS.INITIAL_PAGINATION,
            path: '/quotes',
        },
        links: {
            first: '',
            last: '',
            next: '',
            prev: '',
        },
        setData: handlePaginationChange,
    });

    const [allQuotes, setAllQuotes] = useState<IQuote[]>([]);
    const quotesPerPage = QUOTES_PAGINATION.QUOTES_PER_PAGE;

    
    useEffect(() => {
        setCurrentPage(QUOTES_PAGINATION.INITIAL_PAGE);
    }, [search, documentStatus, startDate, endDate]);

    const loadQuotes = useCallback(async (): Promise<void> => {
        dispatch(showLoader());
        setIsLoading(true);

        try {
            const filters: IQuoteFilters = {
                paginate: false,
            };

            if (startDate || endDate) {
                const effectiveStartDate = startDate || new Date(0);
                const effectiveEndDate = endDate || new Date();

                filters.start_date = getUnixFromDate(effectiveStartDate);
                filters.finish_date = getUnixFromDate(effectiveEndDate);
            }

            await dispatch(getQuotes(filters));
        } finally {
            setIsLoading(false);
            dispatch(hideLoader());
        }
    }, [documentStatus, startDate, endDate, dispatch]);

    useEffect(() => {
        loadQuotes();
    }, [loadQuotes]);

    useEffect(() => {
        if (quotesData?.data && Array.isArray(quotesData.data)) {
            let transformedQuotes = (quotesData.data as IQuote[]).map((quote: IQuote) => ({
                ...quote,
                state: quote.is_send_email === QUOTES_DEFAULTS.DOCUMENT_STATES.SENT
                    ? QUOTES_DEFAULTS.DOCUMENT_STATES.SENT
                    : QUOTES_DEFAULTS.DOCUMENT_STATES.NOT_SENT
            }));

            if (search && search.trim() !== '') {
                const searchTerm = search.trim().toLowerCase();

                transformedQuotes = transformedQuotes.filter((quote: IQuote) => {
                    const customerName = quote.client_name || quote.customer || '';
                    const customerEmail = quote.client_email || quote.email || '';
                    const quoteNumber = quote.number || '';

                    const customerMatch = customerName.toLowerCase().includes(searchTerm);
                    const emailMatch = customerEmail.toLowerCase().includes(searchTerm);
                    const numberMatch = quoteNumber.toLowerCase().includes(searchTerm);

                    return customerMatch || emailMatch || numberMatch;
                });
            }

            if (documentStatus) {
                const isSent = documentStatus === 'sent';
                transformedQuotes = transformedQuotes.filter((quote: IQuote) => {
                    const quoteIsSent = quote.is_send_email === QUOTES_DEFAULTS.DOCUMENT_STATES.SENT;
                    return isSent ? quoteIsSent : !quoteIsSent;
                });
            }

            const sortedQuotes = [...transformedQuotes].sort((a, b) => {
                const numberA = parseInt(a.number) || 0;
                const numberB = parseInt(b.number) || 0;
                return numberB - numberA;
            });

            setAllQuotes(sortedQuotes);

            const effectiveCurrentPage = currentPage;
            const startIndex = (effectiveCurrentPage - 1) * quotesPerPage;
            const endIndex = startIndex + quotesPerPage;
            const paginatedData = sortedQuotes.slice(startIndex, endIndex);
            
            setData((prev: IPaginatorBackend<IQuote>) => ({
                ...prev,
                data: paginatedData,
                meta: {
                    ...QUOTES_DEFAULTS.INITIAL_PAGINATION,
                    current_page: effectiveCurrentPage,
                    last_page: Math.ceil(sortedQuotes.length / quotesPerPage),
                    per_page: quotesPerPage,
                    total: sortedQuotes.length,
                    from: startIndex + 1,
                    to: Math.min(endIndex, sortedQuotes.length),
                    path: '/quotes',
                },
                links: {
                    first: '',
                    last: '',
                    next: '',
                    prev: '',
                },
                setData: handlePaginationChange,
            }));
        } else {
            setAllQuotes([]);
            setData((prev: IPaginatorBackend<IQuote>) => ({
                ...prev,
                data: [],
                meta: {
                    ...QUOTES_DEFAULTS.INITIAL_PAGINATION,
                    path: '',
                },
                links: {
                    first: '',
                    last: '',
                    next: '',
                    prev: '',
                },
                setData: handlePaginationChange,
            }));
        }
    }, [quotesData, currentPage, quotesPerPage, handlePaginationChange, search, documentStatus]);

    const handleCheckboxChange = useCallback((quoteId: string, checked: boolean) => {
        setData(prev => {
            const updatedData = prev.data.map((quote: IQuote) => {
                if (quote.id === quoteId) {
                    return { ...quote, checked };
                }
                return quote;
            });
            
            return {
                ...prev,
                data: updatedData,
            };
        });
    }, []);

    const handleDeleteQuotes = useCallback(async () => {
        try {
            const selectedQuotes = data.data.filter((quote: IQuote) => quote.checked);
            
            if (selectedQuotes.length === QUOTES_PAGINATION.EMPTY_STATE_VALUE) {
                return;
            }
            
            dispatch(showLoader());
            
            const deletePromises = selectedQuotes.map((quote: IQuote) => 
                dispatch(deleteQuote(quote.id))
            );
            
            await Promise.all(deletePromises);
            
            await loadQuotes();
            
            dispatch(hideLoader());
            
        } catch (error) {
            dispatch(hideLoader());
        }
    }, [data.data, dispatch, loadQuotes]);

    const loadAllQuotesForExport = useCallback(async (): Promise<IQuote[]> => {
        const transformedQuotes = allQuotes.map((quote: IQuote) => ({
            id: quote.id?.toString() || '',
            person_id: quote.person_id || undefined,
            number: quote.number || '',
            date: quote.date || '',
            customer: quote.customer || '',
            email: quote.email || '',
            state: quote.state || '',
            total: quote.total || 0,
            is_send_email: quote.is_send_email || undefined,
            created_at: quote.created_at || '',
            updated_at: quote.updated_at || '',
            status: quote.status || '',
            items: quote.items || [],
        }));

        return transformedQuotes;
    }, [allQuotes]);

    return {
        search,
        documentStatus,
        startDate,
        endDate,
        isLoading,
        currentPage,
        data,
        allQuotes,
        quotesPerPage,
        setSearch,
        setDocumentStatus,
        setStartDate,
        setEndDate,
        setCurrentPage,
        handlePaginationChange,
        loadQuotes,
        handleCheckboxChange,
        handleDeleteQuotes,
        loadAllQuotesForExport,
    };
};
