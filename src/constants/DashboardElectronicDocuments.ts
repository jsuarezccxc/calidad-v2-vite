import { IDataDashboardElectronicDocuments } from '@models/DashboardElectronicDocuments';

/**
 * This const is init data
 */
export const INIT_DATA: IDataDashboardElectronicDocuments = {
    total_clients: 0,
    other_value: 0,
    total_sales: 0,
    percentage_sales: 0,
    document_available: 0,
    annual_income: {
        January: 0,
        February: 0,
        March: 0,
        April: 0,
        May: 0,
        June: 0,
        July: 0,
        August: 0,
    },
    electronic_document_counting: {
        total_invoice: 0,
        total_supporting_document: 0,
        total_adjustment_note: 0,
        total_debit_note: 0,
        total_credit_note: 0,
    },
    is_unlimited: false,
};

/**
 * This const is months in spanish lineChart
 */
export const MONTH_NAMES: { [key: string]: string } = {
    January: 'Ene',
    February: 'Feb',
    March: 'Mar',
    April: 'Abr',
    May: 'May',
    June: 'Jun',
    July: 'Jul',
    August: 'Ago',
    September: 'Sep',
    October: 'Oct',
    November: 'Nov',
    December: 'Dic',
};
