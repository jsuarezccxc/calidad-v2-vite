import type { IQuote } from '@models/QuoteGeneration';
import { formatNumber } from '@utils/Number';

/**
 * Magic number constants for quotes helper functions
 * Eliminates hardcoded values throughout the utility functions
 */
export const DATE_PAD_LENGTH = 2;
export const DATE_PAD_CHARACTER = '0';
export const EMPTY_ARRAY_LENGTH = 0;
const MONTH_OFFSET = 1; // JavaScript months are 0-based

/**
 * Status color constants for consistent UI styling across quotes module
 */
const QUOTE_STATUS_COLORS = {
    SUCCESS_GREEN: '#00a99d',
    GRAY_TEXT: '#6b7280', 
    GRAY_DARK: '#4b4b4b',
} as const;

/**
 * Report metadata structure for display configuration
 * Information used in report headers and download metadata
 *
 * @typeParam title: string - Main report title for display
 * @typeParam subtitle: string - Report subtitle for context
 * @typeParam breadcrumb: string - Navigation breadcrumb path
 * @typeParam downloadDate: string - Date when report was generated
 * @typeParam sectionTitle: string - Section title for report organization
 * @typeParam pageTitle: string - Page title for document metadata
 */
export interface IQuoteReportInfo {
    title: string;
    subtitle: string;
    breadcrumb: string;
    downloadDate: string;
    sectionTitle: string;
    pageTitle: string;
}

/**
 * Validates if a page number is valid for pagination
 * Checks for numeric validity, positive value, and difference from current page
 * 
 * @typeParam pageNumber: number - Page number to validate
 * @typeParam currentPage: number - Current active page number
 * @typeParam return: boolean - True if page number is valid for navigation
 */
export const isValidPageNumber = (pageNumber: number, currentPage: number): boolean => {
    return pageNumber && !isNaN(pageNumber) && pageNumber > 0 && pageNumber !== currentPage;
};

/**
 * Formats dates according to Colombian locale standards
 * Converts various date formats to readable Spanish format
 * 
 * @typeParam dateString: string | number - Date string or timestamp to format in Colombian locale
 * @typeParam return: string - Formatted date string in Colombian Spanish locale
 */
export const formatDate = (dateString: string | number): string => {
    const date = typeof dateString === 'number' ? new Date(dateString * 1000) : new Date(dateString);
    return date.toLocaleDateString('es-CO', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });
};

/**
 * Formats date input for API consumption
 * Converts DD/MM/YYYY format to YYYY-MM-DD format required by backend
 * 
 * @typeParam dateValue: string - Date string in DD/MM/YYYY format from user input
 * @typeParam return: string - Date string in YYYY-MM-DD format for API consumption or empty string
 */
export const formatDateForAPI = (dateValue: string): string => {
    if (!dateValue) return '';
    const parts = dateValue.split('/');
    if (parts.length === 3) {
        return `${parts[2]}-${parts[1].padStart(DATE_PAD_LENGTH, DATE_PAD_CHARACTER)}-${parts[0].padStart(DATE_PAD_LENGTH, DATE_PAD_CHARACTER)}`;
    }
    return '';
};

/**
 * Gets current date formatted for Colombian locale
 * Used for default date values and quote creation timestamps
 * 
 * @typeParam return: string - Current date in Colombian DD/MM/YYYY format
 */
export const getCurrentDate = (): string => {
    return new Date().toLocaleDateString('es-CO');
};

/**
 * Gets current date formatted in DD/MM/YYYY format
 * Consistent formatting for form inputs and display
 * 
 * @typeParam return: string - Current date formatted as DD/MM/YYYY
 */
export const getCurrentDateFormatted = (): string => {
    const today = new Date();
    const day = String(today.getDate()).padStart(DATE_PAD_LENGTH, DATE_PAD_CHARACTER);
    const month = String(today.getMonth() + MONTH_OFFSET).padStart(DATE_PAD_LENGTH, DATE_PAD_CHARACTER);
    const year = today.getFullYear();
    return `${day}/${month}/${year}`;
};

/**
 * Generates next sequential quote number
 * Auto-increments based on existing quote numbers in the system
 * 
 * @typeParam existingQuotes: IQuote[] | { data?: IQuote[] } - Array of existing quotes or paginated object with data array
 * @typeParam return: string - Next sequential quote number as string for new quote creation
 */
export const generateQuoteNumber = (existingQuotes: IQuote[] | { data?: IQuote[] } = []): string => {
    // Handle both array and paginated object structures
    const quotesArray = Array.isArray(existingQuotes) 
        ? existingQuotes 
        : (existingQuotes.data || []);
        
    if (quotesArray.length === EMPTY_ARRAY_LENGTH) return '1';
    
    const maxNumber = quotesArray.reduce((max, quote) => {
        const num = parseInt(quote.number) || 0;
        return Math.max(max, num);
    }, 0);
    
    return (maxNumber + 1).toString();
};

/**
 * Sorts quotes array by number in descending order
 * Extracts numeric values from quote numbers and handles non-numeric cases
 * 
 * @typeParam quotes: Array<{number: string}> - Array of objects with number property to sort
 * @typeParam return: Array<{number: string}> - Sorted array with highest numbers first
 */
export const sortQuotesByNumber = <T extends { number: string }>(quotes: T[]): T[] => {
    return quotes.sort((a, b) => {
        const numA = parseInt(a.number) || 0;
        const numB = parseInt(b.number) || 0;
        return numB - numA;
    });
};

/**
 * Returns appropriate color for quote status display
 * Provides consistent color coding across all submódulos
 * 
 * @typeParam status: string - Quote status string for color determination
 * @typeParam return: string - Color constant from QUOTE_STATUS_COLORS for consistent UI styling
 */
export const getQuoteStatusColor = (status: string): string => {
    switch (status) {
        case 'Enviado':
            return QUOTE_STATUS_COLORS.SUCCESS_GREEN;
        case 'Sin enviar':
            return QUOTE_STATUS_COLORS.GRAY_TEXT;
        default:
            return QUOTE_STATUS_COLORS.GRAY_DARK;
    }
};

/**
 * Creates CSV-compatible data structure for quote exports
 * Formats quote data for Excel and PDF generation
 * 
 * @typeParam quotes: IQuote[] - Array of quotes to format for export compatibility
 * @typeParam return: object[] - Array of objects suitable for CSV/Excel export with Colombian formatting
 */
export const createCSVData = (quotes: IQuote[]): Array<{
    'No. Cotización': string;
    'Fecha de Emisión': string;
    'Cliente': string;
    'Email': string;
    'Estado': string;
    'Total': string;
}> => {
    return quotes.map((quote) => ({
        'No. Cotización': quote.number,
        'Fecha de Emisión': formatDate(quote.date),
        'Cliente': quote.customer,
        'Email': quote.email,
        'Estado': quote.state,
        'Total': quote.total ? formatNumber(quote.total) : '$0'
    }));
};

/**
 * Generates report metadata for downloads
 * Creates consistent report information across PDF and Excel exports
 * 
 * @typeParam return: IQuoteReportInfo - Report metadata object for download consistency
 */
export const generateReportInfo = (): IQuoteReportInfo => {
    const currentDate = getCurrentDate();
    return {
        title: 'Reporte de Cotizaciones',
        subtitle: 'Sistema de Gestión de Documentos Electrónicos',
        breadcrumb: 'Documentos Electrónicos > Facturas > Cotizaciones',
        downloadDate: currentDate,
        sectionTitle: 'Listado de Cotizaciones',
        pageTitle: `Reporte generado el ${currentDate}`
    };
};
