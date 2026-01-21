import { Section } from '@components/bread-crumb';

import { MODULE_TITLES } from '@constants/ElectronicDocuments';
import { Routes } from '@constants/Paths';

import { PaginationData } from '@models/QuoteGeneration';

import { getRoute, getRouteName } from '@utils/Paths';
import { formatNumber } from '@utils/Number';

// Re-export formatNumber as formatCurrency for backward compatibility within module
export { formatNumber as formatCurrency };

export { default as QuotesReport } from './QuotesReport';
export { GenerateQuote } from './components/quote-generate';
export { ReportTableContent } from './components/quote-list';

// Re-export PaginationData type for backward compatibility within module
export type { PaginationData };

// Re-export useReportData from local hooks directory
export { useReportData } from './hooks/useReportData';

/**
 * Module title constant for quotes section
 * Used throughout the application for consistent labeling of quotes functionality
 */
export const QUOTES = 'Cotizaciones';

/**
 * Breadcrumb navigation routes configuration
 * 
 * Defines the hierarchical navigation path for quotes within the electronic documents system.
 * Provides contextual navigation from main dashboard through invoice module to quotes section.
 * 
 * @constant routes
 * @type {Section[]}
 * @returns Configured breadcrumb sections for quotes navigation
 */
export const routes: Section[] = [
        {
            name: getRouteName(Routes.DASHBOARD_ELECTRONIC_DOCUMENT),
            route: getRoute(Routes.DASHBOARD_ELECTRONIC_DOCUMENT),
        },
        {
            name: MODULE_TITLES.INVOICE,
            route: getRoute(Routes.DASHBOARD_ELECTRONIC_DOCUMENT),
        },
        {
            name: QUOTES,
            route: getRoute(Routes.QUOTES_REPORT),
        },
];

/**
 * Quote filters interface for backend API requests
 * Defines the structure for filtering quotes in list/export operations
 *
 * @interface IQuoteFilters
 * @typeParam paginate: boolean - Whether to paginate results (false for export/all data)
 * @typeParam search: string | undefined - Optional search term for customer name, email, or quote number
 * @typeParam is_send_email: boolean | undefined - Optional filter by email send status (true=Sent, false=Unsent)
 * @typeParam start_date: number | undefined - Optional Unix timestamp for date range start
 * @typeParam finish_date: number | undefined - Optional Unix timestamp for date range end
 */
export interface IQuoteFilters {
    paginate: boolean;
    search?: string;
    is_send_email?: boolean;
    start_date?: number;
    finish_date?: number;
}
