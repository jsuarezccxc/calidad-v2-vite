import { Section } from '@components/bread-crumb';
import { Routes } from '@constants/Paths';
import { DATABASE_EMPLOYEE } from '@information-texts/DatabaseEmployees';
import { getRoute, getRouteName } from '@utils/Paths';

export { default } from './DatabaseEmployeeDetail';

/**
 * Function that returns the routes for the breadcrumb
 * @returns Section[]
 */
export const routes = (): Section[] => [
    {
        name: DATABASE_EMPLOYEE.TITLE,
        route: getRoute(Routes.DATABASE_MENU),
    },
    {
        name: getRouteName(Routes.DATABASE_EMPLOYEES),
        route: getRoute(Routes.DATABASE_EMPLOYEES),
    },
    {
        name: getRouteName(Routes.DATABASE_EMPLOYEE_DETAIL),
        route: getRoute(Routes.DATABASE_EMPLOYEE_DETAIL),
    },
];

export const INITIAL_DATA = {
    id: "",
    name: "",
    document_type: "",
    document_type_id: "",
    document_number: "",
    birthday: "",
    code: "",
    phone_number: "",
    address: "",
    country: "",
    country_id: 0,
    department: "",
    department_id: 0,
    city: "",
    city_id: 0,
    postal_code: "",
    email: "",
    contributor_type: "",
    contributor_type_id: "",
    contributor_subtype: "",
    contributor_subtype_id: "",
    eps: "",
    eps_id: "",
    severance_pay: "",
    severance_pay_id: "",
    pension: "",
    pension_id: "",
    compensation_fund: "",
    compensation_fund_id: "",
    risk_level: "",
    risk_level_id: "",
    contract: {
        id: "",
        area: "",
        area_id: "",
        position: "",
        position_id: "",
        contract_type: "",
        contract_type_id: "",
        initial_date: null,
        final_date: null,
        payment_frequency: "",
        payment_frequency_id: "",
        salary: null,
        has_transportation_assistance: null,
        salary_type: "",
        salary_type_id: "",
        payment_method: "",
        payment_method_id: "",
        bank: "",
        bank_id: "",
        account_type: "",
        account_type_id: "",
        account_number: ""
    },
    status: "",
    company_id: ""
}
