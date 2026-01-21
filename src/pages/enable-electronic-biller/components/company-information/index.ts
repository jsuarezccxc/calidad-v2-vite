import { SelectSearchOption } from 'react-select-search';
import { IOptionSelect } from '@components/input';
import { DEFAULT_RESPONSIBILITY } from '@constants/ElectronicInvoice';
import { COLOMBIA_ID } from '@constants/Location';
import { IGenericRecord } from '@models/GenericRecord';
import { Step } from '@models/EnableElectronicBiller';

export { EconomicActivities } from './EconomicActivities';
export { CompanyInformation } from './CompanyInformation';
export { ResolutionFields } from './ResolutionFields';
export { TaxResponsibilities } from './TaxResponsibilities';
export { Withholdings } from './Withholdings';

/**
 * This interface describes the props of the company information
 *
 * @typeParam returnStep: (showSteps?:boolean) => void - Function to go back one step
 * @typeParam toggleModal: () => void - Function to toggle success modal
 * @typeParam fullStepOne: boolean - Optional prop that validate full data
 * @typeParam selectStep: (step: Step) => void - Optional prop that select step
 */
export interface ICompanyInformationProps {
    returnStep: (showSteps?: boolean) => void;
    toggleModal: () => void;
    fullStepOne?: boolean;
    selectStep?: (step: Step) => void;
    completedStep: (step: Step) => void;
}

/**
 * This interface describes the props of the economic activities
 *
 * @typeParam data: IGenericRecord - Company data
 * @typeParam handleDataChange: (data: IGenericRecord) => void - Function to change the data
 * @typeParam options: SelectSearchOption[] - List of economic activity options
 * @typeParam validate: boolean - This indicates when to validate the fields
 */
export interface IEconomicActivitiesProps {
    data: IGenericRecord;
    handleDataChange: (data: IGenericRecord) => void;
    options: SelectSearchOption[];
    validate: boolean;
}

/**
 * This interface describes the resolution fields props
 *
 * @typeParam data: { date: Date; resolutionNumber: string } - Fields data
 * @typeParam handleChange: (option: IGenericRecord) => void - Function to change the data
 * @typeParam requiredResolution: boolean - Indicates if the resolution number is required
 */
export interface IResolutionFieldsProps {
    data: { date: Date; resolutionNumber: string };
    handleChange: (option: IGenericRecord) => void;
    requiredResolution: boolean;
}

/**
 * This interface describes the tax responsibilities props
 *
 * @typeParam data: IGenericRecord - Fields data
 * @typeParam handleDataChange: (data: IGenericRecord) => void - Function to change the data
 * @typeParam fiscalOptions: IOptionSelect[] - List of tax responsibilities options
 * @typeParam validate: boolean - This indicates when to validate the fields
 */
export interface ITaxResponsibilitiesProps {
    data: IGenericRecord;
    handleDataChange: (data: IGenericRecord) => void;
    fiscalOptions: IOptionSelect[];
    validate: boolean;
}

/**
 * This interface describes the withholding props
 *
 * @typeParam selectRetention: (name: string) => void - Function to select a retention
 * @typeParam validate: boolean - Indicates the moment to validate the data
 * @typeParam withholdings: IGenericRecord[] - Withholding list
 */
export interface IWithholdingsProps {
    selectRetention: (name: string) => void;
    validate: boolean;
    withholdings: IGenericRecord[];
}

/**
 * Name of each field
 */
export enum FieldName {
    Address = 'address',
    CompanyName = 'company_name',
    CountryId = 'country_id',
    DepartmentId = 'department_id',
    DepartmentName = 'department_name',
    CityId = 'city_id',
    CityName = 'city_name',
    DocumentType = 'document_type',
    DocumentNumber = 'document_number',
    CompanyRepresentativeName = 'company_representative_name',
    PostalCode = 'postal_code',
    Phone = 'phone',
    PersonType = 'person_type',
    TaxDetail = 'tax_detail',
    Responsibilities = 'fiscal_responsibilities',
    EconomicActivity = 'economic_activity',
}

/**
 * Dynamic tooltip data
 */
export const TOOLTIP_DATA: { [key: string]: { titleTooltip: string; descTooltip: string } } = {
    [FieldName.CompanyName]: {
        titleTooltip: 'Nombre de la empresa:',
        descTooltip: 'es el nombre de su empresa o razón social que se encuentra en su RUT.',
    },
    [FieldName.CompanyRepresentativeName]: {
        titleTooltip: 'Nombre representante:',
        descTooltip: 'es el nombre de la persona que actúa en nombre de la empresa.',
    },
    [FieldName.Address]: {
        titleTooltip: 'Dirección:',
        descTooltip: 'donde está ubicada la empresa.',
    },
    [FieldName.CountryId]: {
        titleTooltip: 'País:',
        descTooltip: 'es el país donde se registró la empresa en la cámara de comercio.',
    },
    [FieldName.DepartmentId]: {
        titleTooltip: 'Departamento/Estado:',
        descTooltip: 'es el departamento o estado en la que se registró la empresa en la cámara de comercio.',
    },
    [FieldName.CityId]: {
        titleTooltip: 'Ciudad:',
        descTooltip: 'es la ciudad donde se registró la empresa en la cámara de comercio.',
    },
    [FieldName.PostalCode]: {
        titleTooltip: 'Código postal:',
        descTooltip: 'es la combinación de números que representa la zona en la que está ubicada la empresa.',
    },
    [FieldName.Phone]: {
        titleTooltip: 'Teléfono:',
        descTooltip: 'contacto principal de la empresa.',
    },
    [FieldName.PersonType]: {
        titleTooltip: 'Tipo de contribuyente:',
        descTooltip:
            'Persona natural: cuando el cliente actúa a título personal. Persona jurídica: cuando el cliente actúa en representación de una sociedad conformada por una o mas personas.',
    },
    [FieldName.EconomicActivity]: {
        titleTooltip: 'CIIU o Actividad económica: ',
        descTooltip:
            'este dato se encuentra en el RUT de la empresa, en la sección "Clasificación", bajo el título "Actividad económica". Se encuentra en la casilla 46 del RUT.',
    },
    [FieldName.TaxDetail]: {
        titleTooltip: 'Detalle de impuestos:',
        descTooltip: ' es el atributo al que el contribuyente está obligado a facturar, Se encuentra en la casilla 53 del RUT.',
    },
    [FieldName.Responsibilities]: {
        titleTooltip: 'Responsabilidad fiscal:',
        descTooltip:
            ' es la clasificación que la DIAN le da a los contribuyentes, para saber a qué impuestos están obligados. Se encuentra en la casilla 53 del RUT.',
    },
};

/**
 * Dynamic tooltip data
 */
export const POSTAL_CODE_LENGTH = 6;

/**
 * This is used to reset location fields every time a value changes.
 */
export const EMPTY_LOCATION_FIELDS: IGenericRecord = {
    [FieldName.CountryId]: {
        [FieldName.DepartmentId]: '',
        [FieldName.DepartmentName]: '',
        [FieldName.CityId]: '',
        [FieldName.CityName]: '',
    },
    [FieldName.DepartmentId]: {
        [FieldName.DepartmentName]: '',
        [FieldName.CityId]: '',
        [FieldName.CityName]: '',
    },
    [FieldName.PersonType]: {
        [FieldName.Responsibilities]: [DEFAULT_RESPONSIBILITY],
    },
};

/**
 * This is used to save the value of the location with the created keys
 */
export const LOCATION_KEYS: IGenericRecord = {
    [FieldName.DepartmentId]: 'department_name',
    [FieldName.CityId]: 'city_name',
};

/**
 * Options for every type of person
 */
export const PERSON_OPTIONS = [
    {
        id: 'NATURAL_PERSON',
        key: 'NATURAL_PERSON',
        value: 'Persona natural',
        name: 'Persona natural',
    },
    {
        id: 'LEGAL_PERSON',
        key: 'LEGAL_PERSON',
        value: 'Persona jurídica',
        name: 'Persona jurídica',
    },
];

/**
 * Initial state of company data
 */
export const DEFAULT_COMPANY_DATA = {
    fiscal_responsibilities: [DEFAULT_RESPONSIBILITY],
    ciius: [{ value: '' }],
    country_id: COLOMBIA_ID,
};

/**
 * Required fields used to greet when sending data
 */
const REQUIRED_FIELDS = [
    FieldName.CompanyRepresentativeName,
    FieldName.Address,
    FieldName.DepartmentId,
    FieldName.CityId,
    FieldName.PostalCode,
    FieldName.Phone,
    FieldName.TaxDetail,
];

/**
 * Function that indicates if a hold is selected
 *
 * @param withholdings: IGenericRecord[] - Withholding list
 * @returns boolean
 */
export const hasAWithholding = (withholdings: IGenericRecord[]): boolean => withholdings.some(item => item.is_active);

/**
 * This function validates empty fields
 *
 * @param data: IGenericRecord - Company data
 * @returns boolean
 */
export const validateEmptyFields = (data: IGenericRecord): boolean =>
    REQUIRED_FIELDS.some(field => {
        const value = data[field];
        return !value || (Array.isArray(value) && value.length === 0);
    });

/**
 * This const is validate fiscal responsibility
 */
const O_15 = 'O-15';
const VALIDATE_FISCAL_RESPONSIBILITY = ['O-23', O_15, 'O-13'];

/**
 * This function validates empty responsibilities
 *
 * @param fiscalResponsibilities: IGenericRecord[] - Added fiscal responsibilities
 * @returns boolean
 */
export const validateEmptyResponsibilities = (fiscalResponsibilities: IGenericRecord[] = []): boolean => {
    if (fiscalResponsibilities.length)
        return fiscalResponsibilities.some(
            ({ code, ...item }) =>
                !item.name ||
                (VALIDATE_FISCAL_RESPONSIBILITY.includes(code) ? !item.number_resolution : false) ||
                (code === O_15 ? !hasAWithholding(item.withholdings) : false)
        );
    return !fiscalResponsibilities.length;
};

/**
 * This validates empty economic activities
 *
 * @param ciius: IGenericRecord[] - Added economic activities
 * @returns boolean
 */
export const validateEmptyCiius = (ciius: IGenericRecord[]): boolean => ciius.some(item => !item.name);

/**
 * This formats the options by adding the value
 *
 * @param options: IGenericRecord[] - Options
 * @returns SelectSearchOption[]
 */
export const formatOptions = (options: IGenericRecord[] = []): SelectSearchOption[] => {
    return options?.map(item => ({ ...item, value: item.id })) as SelectSearchOption[];
};

/**
 * This is used to make a comparison
 */
export const DATE = 'date';

/**
 * This index is used to aggregate a new fiscal responsibility
 */
export const FIRST_POSITION = 0;

/**
 * This const is for props input type select
 */
export const SELECT_INPUT_PROPS: IGenericRecord = {
    selectIconType: 'arrowDownGreen',
};

/**
 * This const helps to define max inputs ciius
 */
export const MAX_CIIUS = 4;