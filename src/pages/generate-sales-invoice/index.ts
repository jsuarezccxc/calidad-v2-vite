import { Section } from '@components/bread-crumb';
import { Routes } from '@constants/Paths';
import { MODULE_TITLES } from '@constants/ElectronicDocuments';
import { ADJUSTMENT_NOTE, CREDIT_NOTE, DEBIT_NOTE, INVOICE, SUPPORTING_DOCUMENT } from '@constants/ElectronicInvoice';
import { IGenericRecord } from '@models/GenericRecord';
import { getRoute, getRouteName } from '@utils/Paths';

export { default } from './GenerateSalesInvoice';

/**
 * Routes for the breadcrumb
 *
 * @param personTexts: IGenericRecord - Person texts
 * @returns Section[]
 */
export const getRoutes = (personTexts: IGenericRecord, isContingency: boolean): Section[] => [
    {
        name: getRouteName(Routes.ELECTRONIC_DOCUMENTS),
        route: getRoute(Routes.DASHBOARD_ELECTRONIC_DOCUMENT),
    },
    {
        name: MODULE_TITLES.INVOICE,
        route: '#',
    },
    ...(isContingency
        ? [{ name: getRouteName(Routes.GENERATE_CONTINGENCY_INVOICE), route: getRoute(Routes.GENERATE_CONTINGENCY_INVOICE) }]
        : [
              {
                  name: getRouteName(Routes.GENERATE_SALES_INVOICE),
                  route: getRoute(Routes.GENERATE_SALES_INVOICE),
              },
          ]),
    ...(personTexts?.title
        ? [
              {
                  name: personTexts.title,
                  route: '#',
              },
          ]
        : []),
];

/**
 * Keys used to obtain the data used in the person form
 */
export const FORM = 'form';

/**
 * Type of prefixes
 */
export const PREFIXES: IGenericRecord = {
    with_prefixes: true,
    types: [INVOICE, DEBIT_NOTE, CREDIT_NOTE, SUPPORTING_DOCUMENT, ADJUSTMENT_NOTE],
    only_available: true,
};
