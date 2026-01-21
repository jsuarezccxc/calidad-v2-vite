import teAdministramos from '@assets/images/landing/te-administramos-logo.svg';
import asDogCat from '@assets/images/landing/as-dog-cat-review.svg';
import cendaCol from '@assets/images/landing/cendacol-review.svg';
export * from './Contact';

/**
 * Options select form
 */
export const optionSelectForm = [
    { key: '1', value: 'Asuntos administrativos' },
    { key: '2', value: 'Asuntos jurídicos' },
    { key: '3', value: 'Diseño UI/UX' },
    { key: '4', value: 'Desarrollo de software' },
    { key: '5', value: 'Fotografía de producto' },
    { key: '6', value: 'Identidad de marca' },
    { key: '7', value: 'Planeación estratégica' },
    { key: '8', value: 'Planeación financiera' },
    { key: '9', value: 'Productividad y competitividad' },
    { key: '10', value: 'Publicidad y mercadeo' },
    { key: '11', value: 'Recursos humanos y control interno' },
    { key: '12', value: 'Tecnología' },
    { key: '13', value: 'Otro' },
];

/**
 * Initial data prefix
 */
const initialDataPrefix = {
    id: 46,
    country: 'Colombia',
    countryCode: '+57',
};

/**
 * Initial form values
 */
export const INITIAL_VALUES: IFormData[] = [
    { name: 'name_surname', required: false, value: '' },
    { name: 'email', required: false, value: '' },
    { name: 'prefix_number', required: false, value: initialDataPrefix.countryCode },
    { name: 'phone', required: false, value: '' },
    { name: 'company_name', required: false, value: '' },
    { name: 'affair', required: false, value: '' },
    { name: 'description', required: false, value: '' },
];

/**
 * This interface describes the properties of the form data.
 *
 * @typeParam value: string - Field value
 * @typeParam required: boolean - Check field value
 * @typeParam name: Field name
 */
export interface IFormData {
    value: string;
    required: boolean;
    name: string;
}

/**
 * Form data indexes
 */
export enum FormDataIndexes {
    NAME_SURNAME,
    EMAIL,
    PREFIX,
    PHONE,
    COMPANY_NAME,
    AFFAIR,
    DESCRIPTION,
}

/**
 * Max length for the text input and text input 255
 */
export const MAX_LENGTH_CONTACT_FORM = 255;

/**
 * Max lenght number contact
 */
export const MAX_LENGHT_NUMBER = 13;

/**
 * Error messages
 */
export const ERROR_MESSAGES = {
    REQUIRED: '*Campo obligatorio',
    INVALID_EMAIL: 'El email no es válido',
    INVALID_NUMBER_PHONE: 'El teléfono de contacto no puede comenzar con 0',
};

/**
 * Inputs names
 */
export const INPUT_NAMES = {
    NAME_SURNAME: 'name_surname',
    EMAIL: 'email',
    PREFIX: 'prefix_number',
    PHONE: 'phone',
    COMPANY_NAME: 'company_name',
    AFFAIR: 'affair',
    DESCRIPTION: 'description',
};

/**
 * ZERO VALIDATE NUMBER PHONE
 */
export const VALIDATE_NUMBER_ZERO = '0';

/**
 * Regex for validate text
 */
export const CONTACT_NAME_VALIDATION_REGEX = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]*$/;

/**
 * Regex for validate text
 */
export const PHONE_VALIDATION_REGEX = /^[0-9]*$/;

/**
 * Diggi Pymes contact type
 */
export const DIGGIPYMES = 'DIGGIPYMES';

/**
 * Input data type
 */
export const DATA_TYPE = 'Text';

/**
 * Images reviews
 */
export const IMAGES_REVIEWS = [teAdministramos, asDogCat, cendaCol];
