import { Section } from '@components/bread-crumb';
import { Routes } from '@constants/Paths';
import { DATABASE_EMPLOYEE, EDIT_CONTENT } from '@information-texts/DatabaseEmployees';
import { getRoute, getRouteName } from '@utils/Paths';

export { default } from './DatabaseEmployeesForm';

/**
 * Function that returns the routes for the breadcrumb
 * @returns Section[]
 */
export const routes = (id: string | null): Section[] => [
    {
        name: DATABASE_EMPLOYEE.TITLE,
        route: getRoute(Routes.DATABASE_MENU),
    },
    {
        name: getRouteName(Routes.DATABASE_EMPLOYEES),
        route: getRoute(Routes.DATABASE_EMPLOYEES),
    },
    {
        name: id ? EDIT_CONTENT.TITLE : getRouteName(Routes.DATABASE_EMPLOYEES_FORM),
        route: getRoute(Routes.DATABASE_EMPLOYEES_FORM),
    },
];

export const INITIAL_DATA = {
    id: '',
    name: '',
    document_type_id: '',
    document_number: '',
    birthday: '',
    code: 0,
    phone_number: '',
    address: '',
    country_id: 0,
    department_id: 0,
    city_id: 0,
    postal_code: '',
    email: '',
    contributor_type_id: '',
    contributor_subtype_id: '',
    eps_id: '',
    severance_pay_id: '',
    pension_id: '',
    compensation_fund_id: '',
    risk_level_id: '',
    contract_id: '',
    status: 'ACTIVE',
    company_id: '',
    area_id: '',
    position_id: '',
    contract_type_id: '',
    initial_date: '',
    final_date: '',
    payment_frequency_id: 'aff3ec29-2451-3f5f-816e-31d1206fd982',
    salary: 0,
    is_salary: false,
    has_transportation_assistance: false,
    salary_type_id: '',
    payment_method_id: '',
    bank_id: '',
    account_type_id: '',
    account_number: '',
};

export const optionsDefault = {
    documentTypes: [],
    areas: [],
    positions: [],
    countries: [],
    departments: [],
    cities: [],
    contributorTypes: [],
    contributorSubtypes: [],
    epsOptions: [],
    severancesPay: [],
    pensions: [],
    compensationsFunds: [],
    riskClasses: [],
    contractTypes: [],
    salaryTypes: [],
    paymentMethods: [],
    bankAccountTypes: [],
    banks: [],
};
