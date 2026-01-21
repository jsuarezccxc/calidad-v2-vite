import { IGenericRecord } from '@models/GenericRecord';
import { lengthGreaterThanZero } from '@utils/Length';

export { default } from './PageIndex';

/**
 * Refactor report download data
 *
 * @param uncorrected: IGenericRecord - Main uncorrected data
 * @param corrected: IGenericRecord[] - Main corrected data
 * @returns IGenericRecord
 */
export const reportData = (uncorrected: IGenericRecord, corrected: IGenericRecord[]): IGenericRecord => {
    return {
        selected_invoice: {
            invoice_type: uncorrected?.invoice_type,
            number: `${uncorrected?.consecutive.name}${uncorrected?.consecutive.number}`,
            error_histories: uncorrected?.error_histories,
        },
        corrected_invoice: corrected.map((item: IGenericRecord) => ({
            invoice_type: item.invoice_type,
            number: `${item.consecutive.name}${item.consecutive.number}`,
            date: item.date,
            error_histories: item.error_histories,
        })),
    };
};

/**
 *
 * @param data: IGenericRecord[] - Data invoices
 * @returns IGenericRecord
 */
export const getInvoiceData = (data: IGenericRecord[]): IGenericRecord => {
    const uncorrected: IGenericRecord[] = [];
    const corrected: IGenericRecord[] = [];

    data.forEach((item: IGenericRecord) => {
        const filterUncorrected = item.error_histories.filter((error: IGenericRecord) => error.corrected === false);
        const filterCorrected = item.error_histories.filter((error: IGenericRecord) => error.corrected === true);
        if (lengthGreaterThanZero(filterUncorrected)) {
            uncorrected.push({
                ...item,
                error_histories: filterUncorrected,
            });
        }
        if (lengthGreaterThanZero(filterCorrected)) {
            corrected.push({
                ...item,
                error_histories: filterCorrected,
            });
        }
    });

    return {
        corrected,
        uncorrected,
    };
};
