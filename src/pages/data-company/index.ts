//--- Libraries ---//
import { ChangeEvent, Dispatch, SetStateAction } from 'react';
//--- Constants ---//
import {
    CIIUS,
    CITIES,
    COUNTRIES,
    TAX_DETAIL,
    DEPARTMENTS,
    TYPE_TAX_PAYER,
    PAYMENT_METHODS,
    FISCAL_RESPONSIBILITIES,
} from '@constants/DynamicRequest';
import { WITHHOLDINGS } from '@constants/ElectronicInvoice';
//--- Models ---//
import { IGenericRecord } from '@models/GenericRecord';
//--- Components ---//
import { IFile, IOptionSelect } from '@components/input';
import { ZERO } from '@constants/UtilsConstants';
//--- Utils ---//
import { lengthGreaterThanZero } from '@utils/Length';

export { default } from './DataCompany';

/**
 * Interface to describe required values
 *
 * @param name: boolean - Company name.
 * @param email: boolean - Company email.
 * @param document_type: boolean - Company document type.
 * @param document_number: boolean - Company document number.
 * @param document_type_name: boolean - Company document name.
 */
export interface IPropsRequired {
    name: boolean;
    email: boolean;
    document_type: boolean;
    document_number: boolean;
    document_type_name: boolean;
}

/**
 * Interface for Data Information
 *
 * @param ciiu: IGenericRecord[] - Array of CIIU records.
 * @param name?: string - Company name.
 * @param phone?: string - Contact phone number.
 * @param email?: string - Contact email address.
 * @param address?: string - Company address.
 * @param city_id?: string - ID of the city.
 * @param city_name?: string - Name of the city.
 * @param country_id?: string - ID of the country.
 * @param postal_code?: string - Postal code.
 * @param country_name?: string - Name of the country.
 * @param department_id?: string - ID of the department.
 * @param document_type?: string - Type of the document.
 * @param department_name?: string - Name of the department.
 * @param document_number?: string - Number of the document.
 * @param params_from_utils?: {
 *      code: string | undefined;
 *      id: string | number | undefined;
 *      name: string | undefined;
 * } - Utility parameters including code, id, and name.
 * @param document_type_name?: string - Name of the document type.
 * @param fiscal_responsibilities: IGenericRecord[] - Array of fiscal responsibility records.
 * @param company_representative_name?: string - Name of the company representative.
 * @param type_tax_payers?: IGenericRecord - Optional type tax payers
 * @param person_type?: string - Optional text person type
 * @param person_type_id?: string - Optional person type id
 * @param has_a_physical_store?: string - Optional flag indicating whether the company has a physical store
 */
export interface IDataInformation {
    ciius: IGenericRecord[];
    name?: string;
    phone?: string;
    email?: string;
    address?: string;
    city_id?: string;
    city_name?: string;
    country_id?: string;
    postal_code?: string;
    country_name?: string;
    department_id?: string;
    document_type?: string;
    department_name?: string;
    document_number?: string;
    params_from_utils?: {
        code: string | undefined;
        id: string | number | undefined;
        name: string | undefined;
    };
    document_type_name?: string;
    fiscal_responsibilities: IGenericRecord[];
    company_representative_name?: string;
    type_tax_payers?: IGenericRecord;
    person_type?: string;
    person_type_id?: string;
    has_a_physical_store?: boolean;
}

/**
 * Interface for data company.
 *
 * @param title: string - Prop for title.
 * @param translate: TFunction - Prop for tranlate function.
 */
export interface IDataCompanyProps {
    title: string;
}

/**
 * Interface for DataCompany component.
 *
 * @param dataInformation: IDataInformation - Prop for data into initial state.
 * @param setDataInformation: Dispatch<SetStateAction<IDataInformation>> - Function to change data into initial state.
 * @param validate: boolean - State to know if it's validated form
 */
export interface ITaxDetailsProps extends IDataCompanyProps {
    dataInformation: IDataInformation;
    setDataInformation: Dispatch<SetStateAction<IDataInformation>>;
    validate: boolean;
}

/**
 * Interface for AdditionalInformation component.
 *
 * @param file: IFile - Prop file to upload.
 * @param setFile: (file: IFile) => void - Function to change file.
 */
export interface IAdditionalInformationProps extends IDataCompanyProps {
    file: IFile;
    setFile: (file: IFile) => void;
}

/**
 * Interface for BasicInformation component.
 *
 * @param requiredFields: IPropsRequired - Prop for required inputs.
 * @param dataInformation: IDataInformation - Prop for data into initial state.
 * @param digitVerification: string - Function to change file.
 * @param onChangeText: (textInput: ChangeEvent<HTMLInputElement>) => void - Function to change file.
 */
export interface IBasicInformationProps extends IDataCompanyProps {
    requiredFields: IPropsRequired;
    dataInformation: IDataInformation;
    digitVerification: string;
    onChangeText: (textInput: ChangeEvent<HTMLInputElement>) => void;
}

/**
 * Interface for ContactInformation component.
 *
 * @param dataInformation: IDataInformation - Prop for data into initial state.
 * @param onChangeText: (textInput: ChangeEvent<HTMLInputElement>) => void - Function to change file.
 * @param setDataInformation: Dispatch<SetStateAction<IDataInformation>> - Function to change data into initial state.
 */
export interface IContactInformationProps extends IDataCompanyProps {
    dataInformation: IDataInformation;
    onChangeText: (e: ChangeEvent<HTMLInputElement>) => void;
    setDataInformation: Dispatch<SetStateAction<IDataInformation>>;
}

/**
 * Interface for ContactInformation component.
 *
 * @param index: number - Prop for index.
 * @param field: TypeFieldInput - Prop for fields selected.
 * @param availableOptions: IOptionSelect[] - Optional prop for available options.
 * @param dataInformationSelected: IDataInformation - Prop for options selected.
 * @param setData: Dispatch<SetStateAction<IDataInformation>> - Function for set data.
 * @param setAvailableOptions: Dispatch<SetStateAction<IOptionSelect[]>> - Optional unction for set available options.
 */
export interface IRemoveOptionSelected {
    index: number;
    field: TypeFieldInput;
    availableOptions?: IOptionSelect[];
    dataInformationSelected: IDataInformation;
    setData: Dispatch<SetStateAction<IDataInformation>>;
    setAvailableOptions?: Dispatch<SetStateAction<IOptionSelect[]>>;
}

/**
 * Interface for handleSelectOptions function.
 *
 * @param options: IOptionSelect- Prop for options selected.
 */
export interface IHandleSelectOptions extends IRemoveOptionSelected {
    options: IOptionSelect;
}

/**
 * Interface for handleSelectOptions function.
 *
 * @param id: string - Store identifier.
 * @param company_id: string - Company identifier.
 * @param name: string - Name store.
 * @param address: string- Company address.
 * @param point_sales: any[]- Prop for options selected.
 * @param country_id: number- ID of the country.
 * @param country_name: string - Name of the country.
 * @param department_id: number - ID of the department.
 * @param department_name: string - Name of the department.
 * @param city_id: number - ID of the city.
 * @param city_name: string - Name of the city.
 * @param phone: string- Contact phone number.
 */
export interface IDataStore {
    id: string;
    company_id: string;
    name: string;
    address: string;
    point_sales: IGenericRecord[];
    country_id: number;
    country_name: string;
    department_id: number;
    department_name: string;
    city_id: number;
    city_name: string;
    phone: string;
}

export const REQUIRED_FIELDS_STORE: Array<keyof IDataStore> = [
    'name',
    'address',
    'country_name',
    'department_name',
    'city_name',
    'phone',
];

/**
 * Enum of each field for upload image
 */
export enum TypeFile {
    Rut = 'RUT',
    Logo = 'logo',
    Certificate = 'certificate',
    LogoInvoice = 'logo-invoice',
    LogoSupport = 'logo-support-documents',
}

/**
 * Enum of each field for location
 */
export enum TypeLocationKey {
    DepartmentId = 'department_id',
    DepartmentName = 'department_name',
    CityId = 'city_id',
    CityName = 'city_name',
}

/**
 * Enum for tax detail type
 */
export enum TypeTaxDetail {
    Ciiu = 'ciius',
    FiscalResponsibilities = 'fiscal_responsibilities',
}

/**
 * Enum for locations
 */
export enum LocationKeys {
    City = 'city',
    Country = 'country',
    Department = 'department',
}

/**
 * Type of each field input
 */
export type TypeFieldInput = TypeTaxDetail.FiscalResponsibilities | TypeTaxDetail.Ciiu;

/**
 * Type of each location input
 */
export type TypeLocation = LocationKeys.Country | LocationKeys.Department | LocationKeys.City;

/**
 * Constant to get route name
 */
export const FILE = [{ name: 'logo', files: [], value: 0 }];

/**
 * Constant to get dynamic data
 */
export const UTILS_DYNAMIC_DATA = [
    CIIUS,
    CITIES,
    COUNTRIES,
    TAX_DETAIL,
    DEPARTMENTS,
    TYPE_TAX_PAYER,
    PAYMENT_METHODS,
    FISCAL_RESPONSIBILITIES,
];

/**
 * Const to manage required values
 */
export const FIELDS_REQUIRED = {
    name: false,
    email: false,
    document_type: false,
    document_number: false,
    document_type_name: false,
};

/**
 * Const to manage initial value
 */
export const INITIAL_STATE = {
    ciius: [
        {
            id: '',
            code: '',
            name: '',
        },
    ],
    name: '',
    phone: '',
    email: '',
    address: '',
    city_id: '',
    city_name: '',
    country_id: '',
    postal_code: '',
    country_name: '',
    department_id: '',
    document_type: '',
    department_name: '',
    document_number: '',
    params_from_utils: {
        code: '',
        id: undefined,
        name: '',
    },
    document_type_name: '',
    fiscal_responsibilities: [
        {
            id: '',
            code: '',
            name: '',
            withholdings: WITHHOLDINGS,
        },
    ],
    company_representative_name: '',
};
/**
 * This constant represent new  physical store
 */
export const DATA_PHYSICAL_STORE: IDataStore = {
    id: '',
    company_id: '',
    name: '',
    address: '',
    point_sales: [],
    country_id: 0,
    country_name: '',
    department_id: 0,
    department_name: '',
    city_id: 0,
    city_name: '',
    phone: '',
};

/**
 * This function return data typed
 *
 * @param physicalStores: IGenericRecord[] - Physical store company
 * @returns IDataStore[]
 */
export const transformData = (physicalStores: IGenericRecord[]): IDataStore[] =>
    physicalStores.map(store => ({
        id: store.id,
        company_id: store.company_id,
        name: store.name,
        address: store.address,
        point_sales: store.point_sales || [],
        country_id: store.country_id,
        country_name: store.country_name,
        department_id: store.department_id,
        department_name: store.department_name,
        city_id: store.city_id,
        city_name: store.city_name,
        phone: store.phone,
    }));

/**
 * Removes keys with falsy values from an object
 *
 * This function filters out all key-value pairs from the input object
 * where the value is falsy (e.g., null, undefined, '', 0, false, NaN).
 *
 * @param obj: IGenericRecord - The input object to be cleaned
 * @returns IGenericRecord - A new object with only truthy values
 */
export const removeEmptyValues = (obj: IDataInformation): IGenericRecord => {
    return Object.fromEntries(
        Object.entries(obj).filter(([key, value]) => {
            if (key === 'ciius' && !value[ZERO].code) return false;
            if (key === 'fiscal_responsibilities' && !value[ZERO].id) return false;
            if (Array.isArray(value)) return lengthGreaterThanZero(value);
            return value && value !== 'null';
        })
    );
};
