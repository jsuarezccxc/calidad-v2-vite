import { ADJUSTMENT_NOTE, CREDIT_NOTE, DEBIT_NOTE } from './ElectronicInvoice';
import { REQUIRED_FIELD } from './FieldsValidation';

/**
 * This enum is keys fields
 */
export enum keysFields {
    TYPE = 'type',
    CHECK = 'check',
    PREFIX = 'prefix',
    TYPE_NAME = 'type_name',
    PREFIX_COPY = 'prefix_copy',
}

/**
 * This const is prefix init
 */
export const PREFIX = {
    id: '',
    type: '',
    prefix: '',
    errors: [],
    check: false,
    type_name: '',
    isChange: true,
};

/**
 * This enum is keys modals
 */
export enum KeyModals {
    SAVE = 'MODAL_SAVE',
    DELETE = 'MODAL_DELETE',
}

/**
 * This const is types note label
 */
export const TYPES_NOTE: { [key: string]: string } = {
    ADJUSTMENT_NOTE: 'Nota de ajuste',
    CREDIT_NOTE: 'Nota crédito',
    DEBIT_NOTE: 'Nota debito',
};

/**
 * This const options table
 */
export const TYPE_OPTIONS = [
    {
        id: CREDIT_NOTE,
        key: CREDIT_NOTE,
        value: TYPES_NOTE[CREDIT_NOTE],
    },
    {
        id: DEBIT_NOTE,
        key: DEBIT_NOTE,
        value: TYPES_NOTE[DEBIT_NOTE],
    },
];

/**
 * This option adjustment
 */
export const OPTION_ADJUSTMENT = [
    {
        id: ADJUSTMENT_NOTE,
        key: ADJUSTMENT_NOTE,
        value: TYPES_NOTE[ADJUSTMENT_NOTE],
    },
];

/**
 * This const is message validation
 */
export const VALIDATION_MESSAGES: { [key: string]: string } = {
    [keysFields.PREFIX_COPY]: 'Existen dos tipo de documento con un mismo prefijo, es necesario verificar',
    [keysFields.PREFIX]: REQUIRED_FIELD,
    [keysFields.TYPE_NAME]: REQUIRED_FIELD,
}

/**
 * This const is state modal init
 */
export const MODALS = {
    [KeyModals.SAVE]: false,
    [KeyModals.DELETE]: false,
};
