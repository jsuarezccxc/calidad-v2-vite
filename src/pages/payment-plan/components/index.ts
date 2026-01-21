import { IGenericRecord } from '@models/GenericRecord';

export { ActivePlans } from './ActivePlans';
export { PlansHistory } from './PlansHistory';
export * from './ModalsPaymentPlan';

/**
 * It's used to build the header of the active plans table
 */
export const ACTIVE_PLAN_HEADERS = [
    {
        title: 'Plan de pago',
        className: 'plan',
    },
    {
        title: 'Fecha de compra',
        className: 'purchase-date',
    },
    {
        title: 'Fecha de vencimiento',
        className: 'expiration-date',
    },
    {
        title: '',
        className: 'button',
    },
    {
        title: '',
        className: 'button',
    },
    {
        title: '',
        className: 'button',
    }
    
];

/**
 * It's used to build the header for the payment plan history table
 */
export const PLAN_HISTORY_HEADERS = [
    {
        title: 'Fecha de compra',
        className: 'purchase-date',
    },
    {
        title: 'Plan de pago',
        className: 'plan',
    },
    {
        title: 'Valor unitario',
        className: 'unit-value',
    },
    {
        title: 'Descuento',
        className: 'discount',
    },
    {
        title: 'Valor total',
        className: 'total-value',
    },
    {
        title: 'Fecha de vencimiento',
        className: 'expiration-date',
    },
];

/**
 * Downloaded file name
 */
export const FILE_TITLE = 'Historial de Planes de pago';

/**
 * This creates the request file
 *
 * @param data: IGenericRecord - Request data
 * @returns IGenericRecord
 */
export const getRequestFile = ({ type, data, formattedDates }: IGenericRecord): IGenericRecord => ({
    type,
    module: 'payment-plan',
    data,
    range: formattedDates,
    searched_by: '...',
    concept_type: '..',
});

/**
 * This formats the report data
 *
 * @param data: IGenericRecord[] - Reporting data
 * @returns IGenericRecord[]
 */
export const formatReportData = (data: IGenericRecord[]): IGenericRecord[] => {
    return data.map(({ netPrice, name, nameModule, expiration_date, ...item }) => {
        return {
            ...item,
            name_module: nameModule || name,
            price: netPrice,
            total_value: netPrice - item.discount,
            expiration_date: Number(expiration_date),
        };
    });
};
