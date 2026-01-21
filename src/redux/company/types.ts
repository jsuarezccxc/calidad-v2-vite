import {
    ICompany,
    IDocumentType,
    ICountry,
    IDepartment,
    ICity,
    ICiiu,
    IResponsibility,
    IForeignExchange,
    ICompanyTaxes,
} from '@models/Company';
import { IArea, IEmployeeDetail, IHistory } from '@models/DataEmployees';
import { IGenericRecord } from '@models/GenericRecord';

export enum ActionKeys {
    SET_COMPANY = 'SET_COMPANY',
    SET_DOCUMENT_TYPES = 'SET_DOCUMENT_TYPES',
    SET_COUNTRIES = 'SET_COUNTRIES',
    SET_DEPARTMENTS = 'SET_DEPARTMENTS',
    SET_CITIES = 'SET_CITIES',
    SET_COUNTRY_DEPARTMENTS = 'SET_COUNTRY_DEPARTMENTS',
    SET_DEPARTMENT_CITIES = 'SET_DEPARTMENT_CITIES',
    SET_CIIUS = 'SET_CIIUS',
    SET_RESPONSIBILITIES = 'SET_RESPONSIBILITIES',
    SET_FOREIGN_EXCHANGE = 'SET_FOREIGN_EXCHANGE',
    SET_DATA = 'SET_DATA',
    SET_TERMS = 'SET_TERMS',
    SET_TAX_DETAILS = 'SET_TAX_DETAILS',
    SET_PERSON_TYPE = 'SET_PERSON_TYPE',
    SET_PHYSICAL_STORES = 'SET_PHYSICAL_STORES',
    SET_ERROR = 'SET_ERROR',
    SET_ACTIVE_MODULES = 'SET_ACTIVE_MODULES',
    SET_DATE_MEMBERSHIP = 'SET_DATE_MEMBERSHIP',
    SET_COMPANY_TAXES = 'SET_COMPANY_TAXES',
    SET_AREAS = 'SET_AREAS',
    SET_EMPLOYEES = 'SET_EMPLOYEES',
    SET_EMPLOYEE = 'SET_EMPLOYEE',
    SET_ADJUSTMENT_HISTORY_EMPLOYEE = 'SET_ADJUSTMENT_HISTORY_EMPLOYEE',
    SET_DATABASE_EMPLOYEE_FIRST_TIME = 'SET_DATABASE_EMPLOYEE_FIRST_TIME',
    SET_PLAN_HISTORY = 'SET_PLAN_HISTORY',
}

export interface ISetData {
    type: ActionKeys.SET_DATA;
    data: IGenericRecord;
}

export interface ISetCompany {
    type: ActionKeys.SET_COMPANY;
    information: ICompany;
}

export interface ISetDocumentTypes {
    type: ActionKeys.SET_DOCUMENT_TYPES;
    document_types: IDocumentType[];
}

export interface ISetCountries {
    type: ActionKeys.SET_COUNTRIES;
    countries: ICountry[];
}

export interface ISetDepartments {
    type: ActionKeys.SET_DEPARTMENTS;
    departments: IDepartment[];
}

export interface ISetCities {
    type: ActionKeys.SET_CITIES;
    cities: ICity[];
}

export interface ISetCountryDepartments {
    type: ActionKeys.SET_COUNTRY_DEPARTMENTS;
    country_departments: IDepartment[];
}

export interface ISetDepartmentCities {
    type: ActionKeys.SET_DEPARTMENT_CITIES;
    department_cities: ICity[];
}

export interface ISetCiius {
    type: ActionKeys.SET_CIIUS;
    ciius: ICiiu[];
}

export interface ISetResponsibilities {
    type: ActionKeys.SET_RESPONSIBILITIES;
    responsibilities: IResponsibility[];
}

export interface ISetForeignExchange {
    type: ActionKeys.SET_FOREIGN_EXCHANGE;
    foreign_exchange: IForeignExchange[];
}

export interface ISetTerms {
    type: ActionKeys.SET_TERMS;
}

export interface ISetTaxDetails {
    type: ActionKeys.SET_TAX_DETAILS;
    tax_details: IGenericRecord[];
}

export interface ISetPersonType {
    type: ActionKeys.SET_PERSON_TYPE;
    person_type: IGenericRecord[];
}

export interface ISetPhysicalStores {
    type: ActionKeys.SET_PHYSICAL_STORES;
    physical_stores: IGenericRecord[];
}

export interface ISetActiveModules {
    type: ActionKeys.SET_ACTIVE_MODULES;
    modules: IGenericRecord;
}

export interface ISetDateMembership {
    type: ActionKeys.SET_DATE_MEMBERSHIP;
    dateMembership: string;
}

export interface ISetCompanyTaxes {
    type: ActionKeys.SET_COMPANY_TAXES;
    companyTaxes: ICompanyTaxes[];
}

export interface ISetAreas {
    type: ActionKeys.SET_AREAS;
    areas: IArea[];
}

export interface ISetEmployees {
    type: ActionKeys.SET_EMPLOYEES;
    employees: IGenericRecord[];
}

export interface ISetEmployee {
    type: ActionKeys.SET_EMPLOYEE;
    employee: IEmployeeDetail | null;
}

export interface ISetAdjustmentHistoryEmployee {
    type: ActionKeys.SET_ADJUSTMENT_HISTORY_EMPLOYEE;
    adjustmentHistoryEmployee: IHistory[];
}

export interface ISetError {
    type: ActionKeys.SET_ERROR;
    error: string;
}

export interface ISetDEFirstTime {
    type: ActionKeys.SET_DATABASE_EMPLOYEE_FIRST_TIME;
    databaseEmployees: boolean;
}

export interface ISetPlanHistory {
    type: ActionKeys.SET_PLAN_HISTORY;
    payload: IGenericRecord[];
}

export type CompanyActions =
    | ISetCompany
    | ISetDocumentTypes
    | ISetCountries
    | ISetDepartments
    | ISetCities
    | ISetCountryDepartments
    | ISetDepartmentCities
    | ISetCiius
    | ISetResponsibilities
    | ISetForeignExchange
    | ISetTerms
    | ISetTaxDetails
    | ISetError
    | ISetData
    | ISetPersonType
    | ISetPhysicalStores
    | ISetDateMembership
    | ISetActiveModules
    | ISetCompanyTaxes
    | ISetEmployees
    | ISetEmployee
    | ISetAdjustmentHistoryEmployee
    | ISetAreas
    | ISetDEFirstTime
    | ISetPlanHistory;
