import { Section } from '@components/bread-crumb';
import { MODULE_TITLES } from '@constants/ElectronicDocuments';
import { Routes } from '@constants/Paths';
import { getRoute, getRouteName } from '@utils/Paths';
import { formatNumber } from '@utils/Number';

// Re-export formatNumber as formatCurrency for backward compatibility within module
export { formatNumber as formatCurrency };

export { default as QuotesReport } from './QuotesReport';
export { GenerateQuote } from './components/quote-generate';
export { QuoteView } from './components/quote-view';
export { QuoteSendMail } from './components/quote-send-mail';
export { ReportTableContent } from './components/quote-list';

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
            name: getRouteName(Routes.ELECTRONIC_DOCUMENTS),
            route: getRoute(Routes.DASHBOARD_ELECTRONIC_DOCUMENT),
        },
        {
            name: MODULE_TITLES.INVOICE,
            route: '#',
        },
        {
            name: QUOTES,
            route: getRoute(Routes.QUOTES_REPORT),
        },
];

// Re-export useReportData from local hooks directory
export { useReportData } from './hooks/useReportData';
