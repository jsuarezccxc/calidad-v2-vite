import { Routes } from '@constants/Paths';
import { MODULE_TITLES } from '@constants/ElectronicDocuments';
import { SUPPORT_DOCUMENTS_SUBTITLE } from '@constants/DocumentTexts';
import { ADJUSTMENT_NOTE, CREDIT_NOTE, DEBIT_NOTE, SUPPORTING_DOCUMENT, INVOICE } from '@constants/ElectronicInvoice';
import { getRoute, getRouteName } from '@utils/Paths';
import { Section } from '@components/bread-crumb';

export { NoteForm } from './NoteForm';

/**
 * This const is breadcrumb page
 */
export const routes = (typeNote: string): Section[] => [
    {
        name: 'Documentos electrónicos',
        route: getRoute(Routes.DASHBOARD_ELECTRONIC_DOCUMENT),
    },
    {
        name: MODULE_TITLES.NOTE,
        route: '#',
    },
    {
        name: typeNote,
        route: '#',
    },
];

/**
 * This const is for information page
 */
const PAGE_TITLE = {
    title: getRouteName(Routes.ELECTRONIC_DOCUMENTS),
    pageContent: SUPPORT_DOCUMENTS_SUBTITLE,
};

/**
 * This enum is for type logo
 */
export enum TypeLogoElectronicDocument {
    LOGO_INVOICE = 'logo-invoice',
    LOGO_SUPPORT = 'logo-support-documents',
}

/**
 * This const is to request back
 */
export const DATE_TO_LIST = {
    annulled: true,
    types: [SUPPORTING_DOCUMENT, INVOICE],
    start_date: 901298644000 // 27 de julio de 1998,
};

/**
 * This const is for utils component
 */
export const UTILS = {
    PAGE_TITLE,
    TYPE_NOTES: [DEBIT_NOTE, CREDIT_NOTE, ADJUSTMENT_NOTE],
};
