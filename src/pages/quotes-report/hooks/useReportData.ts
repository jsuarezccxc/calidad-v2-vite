import { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { hideLoader, showLoader } from '@redux/loader/actions';
import { deleteQuote, getQuotes } from '@redux/quotes/actions';
import { RootState } from '@redux/rootReducer';
import { IGenericRecord } from '@models/GenericRecord';
import { IPaginatorBackend, IQuote } from '@models/Quotes';
import { paginationDataFormat } from '@constants/PaginationBack';
import { 
    QUOTES_DEFAULTS,
    QUOTES_PAGINATION 
} from '@constants/QuoteViewLabels';
import { isValidPageNumber } from '@utils/quoteHelpers';
import type { PaginationData } from '@pages/quotes-report';

/**
 * Return interface for useReportData hook
 * Provides complete state management and operations for quotes report functionality
 * 
 * @interface IUseReportDataReturn
 * @typeParam search: string - Current search filter value for quote lookup
 * @typeParam documentStatus: string - Current document status filter (Enviado/Sin enviar)
 * @typeParam startDate: string - Start date filter for date range filtering
 * @typeParam endDate: string - End date filter for date range filtering
 * @typeParam isLoading: boolean - Loading state indicator for UI feedback
 * @typeParam currentPage: number - Current page number for pagination
 * @typeParam data: IPaginatorBackend<IGenericRecord> - Paginated quote data from backend
 * @typeParam allQuotes: IGenericRecord[] - Complete quote dataset for export operations
 * @typeParam quotesPerPage: number - Number of quotes per page for pagination
 * @typeParam setSearch: (value: string) => void - Updates search filter
 * @typeParam setDocumentStatus: (value: string) => void - Updates document status filter
 * @typeParam setStartDate: (value: string) => void - Updates start date filter
 * @typeParam setEndDate: (value: string) => void - Updates end date filter
 * @typeParam setCurrentPage: (value: number) => void - Updates current page for pagination
 * @typeParam handlePaginationChange: (pageData?: PaginationData) => void - Handles pagination navigation
 * @typeParam loadQuotes: () => Promise<void> - Loads quotes data from backend with current filters
 * @typeParam handleCheckboxChange: (quoteId: string, checked: boolean) => void - Toggles quote selection for batch operations
 * @typeParam handleDeleteQuotes: () => Promise<void> - Deletes selected quotes with confirmation
 * @typeParam loadAllQuotesForExport: () => Promise<IQuote[]> - Loads all quotes data for export operations
 */
interface IUseReportDataReturn {
    search: string;
    documentStatus: string;
    startDate: string;
    endDate: string;
    isLoading: boolean;
    currentPage: number;
    data: IPaginatorBackend<IGenericRecord>;
    allQuotes: IGenericRecord[];
    quotesPerPage: number;
    setSearch: (value: string) => void;
    setDocumentStatus: (value: string) => void;
    setStartDate: (value: string) => void;
    setEndDate: (value: string) => void;
    setCurrentPage: (value: number) => void;
    handlePaginationChange: (pageData?: PaginationData) => void;
    loadQuotes: () => Promise<void>;
    handleCheckboxChange: (quoteId: string, checked: boolean) => void;
    handleDeleteQuotes: () => Promise<void>;
    loadAllQuotesForExport: () => Promise<IQuote[]>;
}

/**
 * Custom hook for managing quotes report data and operations
 * 
 * This hook provides comprehensive data management functionality for the quotes report,
 * including loading, filtering, pagination, and CRUD operations on quotes data.
 * It uses backend pagination for optimal performance and scalability.
 * 
 * @typeParam IUseReportDataReturn - Object containing state, filter setters, and data operations
 */
export const useReportData = (): IUseReportDataReturn => {
    const dispatch = useDispatch();
    
    const [search, setSearch] = useState<string>('');
    const [documentStatus, setDocumentStatus] = useState<string>('');
    const [startDate, setStartDate] = useState<string>('');
    const [endDate, setEndDate] = useState<string>('');
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [currentPage, setCurrentPage] = useState<number>(QUOTES_PAGINATION.INITIAL_PAGE);

    const quotesData = useSelector((state: RootState) => state.quotes?.responseList || {});

    const extractPageNumber = useCallback((pageData: PaginationData): number => {
        if (typeof pageData === 'number') return pageData;
        
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
        
        try {
            const newPage = extractPageNumber(pageData);
            if (isValidPageNumber(newPage, currentPage)) {
                setCurrentPage(newPage);
            }
        } catch (error) {
            console.error('Pagination error:', error);
        }
    }, [currentPage, extractPageNumber]);

    const [data, setData] = useState<IPaginatorBackend<IGenericRecord>>({
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

    const [allQuotes, setAllQuotes] = useState<IGenericRecord[]>([]);
    const quotesPerPage = QUOTES_PAGINATION.QUOTES_PER_PAGE;

    
    useEffect(() => {
        setCurrentPage(QUOTES_PAGINATION.INITIAL_PAGE);
    }, [search, documentStatus, startDate, endDate]);

    const loadQuotes = useCallback(async (): Promise<void> => {
        dispatch(showLoader());
        setIsLoading(true);
        
        const filters: IGenericRecord = {
            paginate: false,
        };
        
        if (search && search.trim() !== '') {
            filters.search = search.trim();
        }
        
        if (documentStatus && documentStatus !== '') {
            filters.is_send_email = documentStatus;
        }
        
        if (startDate) {
            filters.start_date = Math.floor(new Date(startDate).getTime() / 1000);
        }
        
        if (endDate) {
            filters.finish_date = Math.floor(new Date(endDate).getTime() / 1000);
        }

        await dispatch(getQuotes(filters));
        
        setIsLoading(false);
        dispatch(hideLoader());
    }, [search, documentStatus, startDate, endDate, dispatch]);

    useEffect(() => {
        loadQuotes();
    }, [loadQuotes]);

    useEffect(() => {
        if (quotesData?.data && Array.isArray(quotesData.data)) {
            // Transform quotes data to include correct state mapping
            const transformedQuotes = quotesData.data.map((quote: IGenericRecord) => ({
                ...quote,
                state: quote.is_send_email === QUOTES_DEFAULTS.DOCUMENT_STATES.SENT 
                    ? QUOTES_DEFAULTS.DOCUMENT_STATES.SENT 
                    : QUOTES_DEFAULTS.DOCUMENT_STATES.NOT_SENT
            }));
            
            const sortedQuotes = [...transformedQuotes].sort((a, b) => {
                const numberA = parseInt(a.number) || 0;
                const numberB = parseInt(b.number) || 0;
                return numberB - numberA;
            });
            
            setAllQuotes(sortedQuotes);
            
            const startIndex = (currentPage - 1) * quotesPerPage;
            const endIndex = startIndex + quotesPerPage;
            const paginatedData = sortedQuotes.slice(startIndex, endIndex);
            
            setData(prev => ({
                ...prev,
                data: paginatedData,
                meta: {
                    ...QUOTES_DEFAULTS.INITIAL_PAGINATION,
                    current_page: currentPage,
                    last_page: Math.ceil(sortedQuotes.length / quotesPerPage),
                    per_page: quotesPerPage,
                    total: sortedQuotes.length,
                    from: startIndex + 1,
                    to: Math.min(endIndex, sortedQuotes.length),
                    path: '/quotes',
                },
                links: {
                    first: currentPage === QUOTES_PAGINATION.INITIAL_PAGE ? '' : '1',
                    last: currentPage === Math.ceil(sortedQuotes.length / quotesPerPage) ? '' : Math.ceil(sortedQuotes.length / quotesPerPage).toString(),
                    next: currentPage < Math.ceil(sortedQuotes.length / quotesPerPage) ? (currentPage + 1).toString() : '',
                    prev: currentPage > QUOTES_PAGINATION.INITIAL_PAGE ? (currentPage - 1).toString() : '',
                },
                setData: handlePaginationChange,
            }));
        } else {
            setAllQuotes([]);
            setData(prev => ({
                ...prev,
                data: [],
                meta: QUOTES_DEFAULTS.INITIAL_PAGINATION,
                links: {
                    first: '',
                    last: '',
                    next: '',
                    prev: '',
                },
                setData: handlePaginationChange,
            }));
        }
    }, [quotesData, currentPage, quotesPerPage, handlePaginationChange]);

    const handleCheckboxChange = useCallback((quoteId: string, checked: boolean) => {
        setData(prev => {
            const updatedData = prev.data.map((quote) => {
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
            const selectedQuotes = data.data.filter(quote => quote.checked);
            
            if (selectedQuotes.length === QUOTES_PAGINATION.EMPTY_STATE_VALUE) {
                return;
            }
            
            dispatch(showLoader());
            
            const deletePromises = selectedQuotes.map(quote => 
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
        const transformedQuotes = allQuotes.map((quote: IGenericRecord) => ({
            id: quote.id?.toString() || '',
            person_id: quote.person_id || null,
            number: quote.number || '',
            date: quote.date || '',
            customer: quote.customer || '',
            total: quote.total || 0,
            is_send_email: quote.is_send_email || false,
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
