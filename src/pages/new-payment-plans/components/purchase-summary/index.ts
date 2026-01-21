import { IGenericRecord } from '@models/GenericRecord';

export { Field } from './Field';
export { PurchaseSummary } from './PurchaseSummary';

/**
 * This indicates when the purchase was approved or pending
 */
export const APPROVED = 'Aprobada';
export const PENDING = 'Pendiente';
export const REJECTED = 'Rechazada';

/**
 * Purchase response parameters
 */
export const PURCHASE_PARAMS = [
    'processingDate',
    'polResponseCode',
    'referenceCode',
    'transactionId',
    'cus',
    'pseBank',
    'TX_VALUE',
    'currency',
    'description',
    'pseReference1',
    'message',
    'reference_pol',
];

/**
 * This formats the report data
 *
 * @param data: IGenericRecord[] - Reporting data
 * @returns IGenericRecord[]
 */
const formatReportData = (data: IGenericRecord): IGenericRecord => ({
    client_name: data?.client_name,
    document_type: data?.document_type,
    document_number: data?.document_number,
    date: data?.processingDate,
    state: data?.message,
    reference_code: data?.referenceCode,
    cus: data?.cus,
    transaction_id: data?.transactionId,
    bank: data?.pseBank,
    value: data?.TX_VALUE,
    currency: data?.currency,
    description: data?.description,
});

/**
 * This creates the request file
 *
 * @param data: IGenericRecord - Request data
 * @returns IGenericRecord
 */
export const getRequestFile = (data: IGenericRecord): IGenericRecord => ({
    type: 'pdf',
    module: 'payment-method-pse',
    data: formatReportData(data),
    searched_by: '...',
    concept_type: '..',
});

/**
 * This returns the transaction id
 *
 * @param url: string - Current url
 * @returns string
 */
export const getReferenceId = (url: string): string => {
    return url.replace('transactionId', '').split('&')[TRANSACTION_INDEX].slice(TRANSACTION_INDEX);
};

/**
 * Used to get the transaction id from url
 */
const TRANSACTION_INDEX = 1;

/**
 * Downloaded file name
 */
export const FILE_TITLE = 'Comprobante de pago';
