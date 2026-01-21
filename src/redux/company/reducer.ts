import { ActionKeys, CompanyActions } from './types';
import { IGenericRecord } from '@models/GenericRecord';
import { IArea, IEmployeeDetail, IHistory } from '@models/DataEmployees';
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
import { groupCities } from '@utils/Cities';
import { IPaginatorBackend } from '@components/paginator-backend';
import { paginationDataFormat } from '@constants/PaginationBack';

interface ICompanyState {
    information: ICompany | null;
    document_types: IDocumentType[];
    countries: ICountry[];
    departments: IDepartment[];
    cities: ICity[];
    country_departments: IDepartment[];
    department_cities: ICity[];
    ciius: ICiiu[];
    responsibilities: IResponsibility[];
    foreign_exchange: IForeignExchange[];
    terms: boolean;
    tax_details: IGenericRecord[];
    error: string;
    person_type: IGenericRecord[];
    groupedCities: IGenericRecord;
    physicalStores: IGenericRecord[];
    activeMemberships: IGenericRecord[];
    inactiveMemberships: IGenericRecord[];
    membershipWebsiteDetails: IGenericRecord | null;
    dateMembership: string;
    companyTaxes: ICompanyTaxes[];
    employees: IPaginatorBackend<IGenericRecord>;
    employee: IEmployeeDetail | null;
    adjustmentHistoryEmployee: IHistory[];
    areas: IPaginatorBackend<IArea>;
    databaseEmployees: boolean;
    planHistory: IGenericRecord;
}

const initialState: ICompanyState = {
    information: null,
    document_types: [],
    countries: [],
    departments: [],
    cities: [],
    country_departments: [],
    department_cities: [],
    ciius: [],
    responsibilities: [],
    foreign_exchange: [],
    terms: false,
    tax_details: [],
    person_type: [],
    groupedCities: {},
    physicalStores: [],
    error: '',
    activeMemberships: [],
    inactiveMemberships: [],
    membershipWebsiteDetails: null,
    dateMembership: '',
    companyTaxes: [],
    employees: paginationDataFormat,
    employee: null,
    adjustmentHistoryEmployee: [],
    areas: paginationDataFormat,
    databaseEmployees: false,
    planHistory: [],
};

export const reducer = (state: ICompanyState = initialState, action: CompanyActions): ICompanyState => {
    switch (action.type) {
        case ActionKeys.SET_COMPANY:
            return {
                ...state,
                information: action.information,
            };
        case ActionKeys.SET_DOCUMENT_TYPES:
            return {
                ...state,
                document_types: action.document_types,
            };
        case ActionKeys.SET_COUNTRIES:
            return {
                ...state,
                countries: action.countries,
            };
        case ActionKeys.SET_DEPARTMENTS:
            return {
                ...state,
                departments: action.departments,
            };
        case ActionKeys.SET_CITIES:
            return {
                ...state,
                cities: action.cities,
                groupedCities: groupCities(action.cities),
            };
        case ActionKeys.SET_COUNTRY_DEPARTMENTS:
            return {
                ...state,
                country_departments: action.country_departments,
            };
        case ActionKeys.SET_DEPARTMENT_CITIES:
            return {
                ...state,
                department_cities: action.department_cities,
            };
        case ActionKeys.SET_CIIUS:
            return {
                ...state,
                ciius: action.ciius,
            };
        case ActionKeys.SET_RESPONSIBILITIES:
            return {
                ...state,
                responsibilities: action.responsibilities,
            };
        case ActionKeys.SET_DATA:
            return {
                ...state,
                countries: action.data.countries,
                ciius: action.data.ciius,
                document_types: action.data.document_types,
                foreign_exchange: action.data.foreign_exchange,
            };
        case ActionKeys.SET_TERMS:
            return {
                ...state,
                terms: true,
            };
        case ActionKeys.SET_TAX_DETAILS:
            return {
                ...state,
                tax_details: action.tax_details,
            };
        case ActionKeys.SET_ERROR:
            return {
                ...state,
                error: action.error,
            };
        case ActionKeys.SET_PERSON_TYPE:
            return {
                ...state,
                person_type: action.person_type,
            };
        case ActionKeys.SET_PHYSICAL_STORES:
            return {
                ...state,
                physicalStores: action.physical_stores,
            };
        case ActionKeys.SET_ACTIVE_MODULES:
            return {
                ...state,
                activeMemberships: action.modules.active_memberships,
                inactiveMemberships: action.modules.inactive_memberships,
                membershipWebsiteDetails: action.modules.membership_website_details,
            };
        case ActionKeys.SET_DATE_MEMBERSHIP:
            return {
                ...state,
                dateMembership: action.dateMembership,
            };
        case ActionKeys.SET_COMPANY_TAXES:
            return {
                ...state,
                companyTaxes: action.companyTaxes,
            };
        case ActionKeys.SET_EMPLOYEES:
            return {
                ...state,
                employees: action.employees,
            };
        case ActionKeys.SET_EMPLOYEE:
            return {
                ...state,
                employee: action.employee,
            };
        case ActionKeys.SET_AREAS:
            return {
                ...state,
                areas: action.areas,
            };
        case ActionKeys.SET_ADJUSTMENT_HISTORY_EMPLOYEE:
            return {
                ...state,
                adjustmentHistoryEmployee: action.adjustmentHistoryEmployee,
            };
        case ActionKeys.SET_DATABASE_EMPLOYEE_FIRST_TIME:
            return {
                ...state,
                databaseEmployees: action.databaseEmployees,
            };
        case ActionKeys.SET_PLAN_HISTORY:
            return {
                ...state,
                planHistory: action.payload,
            };
        default:
            return state;
    }
};
