import { IGenericRecord } from "@models/GenericRecord";

export const TYPE_DEBIT_ERRORS:Array<IGenericRecord> = [
    {
        key: 'Cambio del valor',
        error: 'error_unit_value_check',
    },
    {
        key: 'Otros',
        error: 'error_quantity',
    },
    {
        key: 'Gastos por cobrar',
        error: 'error_shipping_charge'
    },
    {
        key: 'Intereses',
        error: 'error_shipping_charge',
    },
    {
        key: 'Intereses',
        error: 'error_shipping_charge',
    },
];

export const TYPE_CREDIT_ERRORS:Array<IGenericRecord> = [
    {
        key: 'Rebaja o descuento parcial o total',
        error: 'error_discount',
    },
    {
        key: 'Devolución parcial de los bienes y/o no aceptación parcial del servicio',
        error: 'error_quantity_check',
    },
    {
        key: 'Ajuste de precio',
        error: 'error_unit_value_check',
    },
];

/**
 * This const is email no sent
 */
export const ACCEPT_EMAIL_NO_SENT = 'Aceptada, pendiente de envío al cliente';
