export { ReportFilters } from './ReportFilters';
export { ReportTable } from './ReportTable';
export { QuotesTableHeader } from './QuotesTableHeader';
export { ReportModals } from './ReportModals';
export { ReportHeader } from './ReportHeader';

/**
 * Validation constants for quote report operations
 */
export const VALIDATION_CONSTANTS = {
    EMPTY_COUNT: 0,
    MIN_VISIBLE_PAGES: 3,
    MAX_VISIBLE_PAGES: 5,
    PAGES_OFFSET: 2,
    PAGES_OFFSET_FOR_CENTERING: 4,
} as const;
