import { IDocumentType } from '@models/Company';

export { default } from './CreateAccount';

/**
 * Initial data registration user
 */
export const INITIAL_DATA = {
    document_type: '',
    nit: '',
    name: '',
    company_representative_name: '',
    email: '',
    password: '',
    password_confirmation: '',
    phone: '',
    accept_policy: false,
    accept_terms: false,
};

/**
 * Initial data validation fields
 */
export const REQUIRED_DATA = {
    document_type: {
        error: false,
        text: '',
    },
    nit: {
        error: false,
        text: '',
    },
    name: {
        error: false,
        text: '',
    },
    email: {
        error: false,
        text: '',
    },
    password: {
        error: false,
        text: '',
    },
    password_confirmation: {
        error: false,
        text: '',
    },
    phone: {
        error: false,
        text: '',
    },
    accept_policy: {
        error: false,
        text: '',
    },
    accept_terms: {
        error: false,
        text: '',
    },
};

/**
 * Data document types
 *
 * @param documents_type:  IDocumentType[]
 * @param types: string[]
 * @returns IGenericRecord[]
 */
export const validateTypeDocument = (
    documents_type: IDocumentType[],
    types = ['CC', 'CE', 'NIT', 'PA', 'NIT PERSONA NATURAL COMERCIANTE']
): IDocumentType[] =>
    documents_type
        ?.filter(type => types.includes(type.name.toLocaleUpperCase()))
        ?.sort((a, b) => a?.name?.localeCompare(b?.name));

//Message error document number register
export const MESSAGE_CREATE_USER_NUMBER = '*Número de documento ya registrado';
export const INVALID_NUMBER_PHONE = 'El teléfono no puede comenzar con 0';

/**
 * ZERO VALIDATE NUMBER PHONE
 */
export const VALIDATE_NUMBER_ZERO = '0';

//Max length for inputs
export const MAX_LENGTH_NAMES = 255;
export const MAX_LENGHT_NUMBER = 13;
/**
 * Exclude niup by employer
 */
export const NIUP = 'NUIP';
