import { includeArray } from '@utils/Array';

export * from './CreateSupplier';

/**
 * This enum is fields name
 */
export enum FieldsName {
    PHONE = 'phone',
    EMAIL = 'email',
    DATE = 'date',
    ADDRESS = 'address',
    CITY_NAME = 'city_name',
    POSTAL_CODE = 'postal_code',
    COUNTRY_NAME = 'country_name',
    DOCUMENT_NAME = 'document_name',
    DOCUMENT_NUMBER = 'document_number',
    DEPARTMENT_NAME = 'department_name',
    TAX_DETAILS_NAME = 'tax_details_name',
    INVALIDATE_EMAIL = 'invalidate_email',
    TYPE_TAXPAYER_NAME = 'type_taxpayer_name',
    FISCAL_RESPONSIBILITIES = 'fiscal_responsibilities',
}

/**
 * This const is type message
 */
const VALIDATE_MESSAGE: { [key: string]: string } = {
    invalidate_email: '*Ingrese un email válido',
};

/**
 * This const is max length input
 */
const { HUNDRED, TWENTY, THIRTY } = {
    TWENTY: 20,
    THIRTY: 30,
    HUNDRED: 100,
};

/**
 * This enum is for field limits
 */
enum InputFieldsLimits {
    Email = 50,
    Phone = 10,
    ForeignPhone = 12,
}

/**
 * This const is default fields
 */
const DEFAULT_FIELDS = {
    department_id: '',
    department_name: '',
    city_id: '',
    city_name: '',
};

/**
 * This function is validate message input
 *
 * @param key: Key input
 * @param required: Errors
 * @returns undefined | string
 */
const validateRequiredText = (key: string, required: string[]): undefined | string => {
    const keyToValidate = `invalidate_${key}`;
    if (includeArray(required, keyToValidate)) return VALIDATE_MESSAGE[keyToValidate];
    return undefined;
};

/**
 * This const is add supplier
 */
const ADD_SUPPLIER = {
    title: 'Agregar proveedor',
    description: 'Agregue la siguiente información del proveedor',
};

/**
 * This const is edit supplier
 */
const EDIT_SUPPLIER = {
    title: 'Editar proveedor',
    description: 'Editar la información del proveedor',
}

/**
 * This const is utils page
 */
export const UTILS = {
    DEFAULT_FIELDS,
    HUNDRED,
    TWENTY,
    THIRTY,
    InputFieldsLimits,
    validateRequiredText,
    ADD_SUPPLIER,
    EDIT_SUPPLIER,
};
