/**
 * Type modals in employee from
 */
export enum TypeModal {
    SAVE = 'save',
    INFORMATION = 'information'
}

/**
 * Current type to show modal
 */
export type CurrentModal = TypeModal.SAVE | TypeModal.INFORMATION

/**
 * Max length by fields in form
 */
export const MAX_LENGTH = {
    NAME: 240,
    DOCUMENT_NUMBER: 10,
    PHONE: 10,
    ADDRESS: 240,
    POSTAL_CODE: 6,
    EMAIL: 240,
    ACCOUNT_NUMBER: 30,
    MONEY: 999,
}

/**
 * Name fields form
 */
export enum FIELDS_EMPLOYEE_FORM {
    ID = 'id',
    NAME = 'name',
    DOCUMENT_TYPE_ID = 'document_type_id',
    DOCUMENT_NUMBER = 'document_number',
    BIRTHDAY = 'birthday',
    CODE = 'code',
    PHONE_NUMBER = 'phone_number',
    ADDRESS = 'address',
    COUNTRY_ID = 'country_id',
    DEPARTMENT_ID = 'department_id',
    CITY_ID = 'city_id',
    DEPARTMENT = 'department',
    CITY = 'city',
    POSTAL_CODE = 'postal_code',
    EMAIL = 'email',
    CONTRIBUTOR_TYPE_ID = 'contributor_type_id',
    CONTRIBUTOR_SUBTYPE_ID = 'contributor_subtype_id',
    EPS_ID = 'eps_id',
    SEVERANCE_PAY_ID = 'severance_pay_id',
    PENSION_ID = 'pension_id',
    COMPENSATION_FUND_ID = 'compensation_fund_id',
    RISK_LEVEL_ID = 'risk_level_id',
    CONTRACT_ID = 'contract_id',
    STATUS = 'status',
    COMPANY_ID = 'company_id',
    AREA_ID = 'area_id',
    POSITION_ID = 'position_id',
    CONTRACT_TYPE_ID = 'contract_type_id',
    INITIAL_DATE = 'initial_date',
    FINAL_DATE = 'final_date',
    PAYMENT_FREQUENCY_ID = 'payment_frequency_id',
    SALARY = 'salary',
    IS_SALARY = 'is_salary',
    HAS_TRANSPORTATION_ASSISTANCE = 'has_transportation_assistance',
    SALARY_TYPE_ID = 'salary_type_id',
    PAYMENT_METHOD_ID = 'payment_method_id',
    BANK_ID = 'bank_id',
    ACCOUNT_TYPE_ID = 'account_type_id',
    ACCOUNT_NUMBER = 'account_number',
}

export const DYNAMIC_REQUEST = [
    'document_types',
    'countries',
    'departments',
    'cities',
    'contributor_type',
    'contributor_subtype',
    'eps',
    'severance_pay',
    'pension',
    'compensation_fund',
    'risk_classes',
    'contract_types',
    'salary_types',
    'payment_methods_payroll',
    'bank_account_types',
]

export const UNDEFINED_TERM_ID = "42355599-7734-4d58-b39c-0ce786e87845";
export const STUDENTS_CONTRACTS_IDS = ["b6fbdaa5-6aa2-4be7-8a20-146ad3a30caa", "8a631b98-e963-45a7-bd4d-2e5ff44bdf60"];
export const TRANSFER_ID = "c4024910-a753-43a1-995d-e927c5846e6a"
export enum SalaryType {
    INTEGRAL = '7f17277d-0abb-3c2a-85a4-8e54f71434fe',
    VARIABLE = '948444bf-f57e-30df-b3bd-2f52f0160e5b',
}
export enum TypesInputs {
    NUMBER = 'NUMBER',
    TEXT = 'TEXT',
    MONEY = 'MONEY',
    RADIO_BUTTON = 'RADIO_BUTTON',
    DATE = 'DATE',
    SELECT = 'SELECT',
}
export type TypeInput = keyof typeof TypesInputs;

export const allowedCharsRegex = /^[a-zA-ZñÑáéíóúÁÉÍÓÚ\s]*$/;
