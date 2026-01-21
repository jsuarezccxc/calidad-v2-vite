/**
 * Interface data employee detail
 *
 * @typeParam id: string - Id employee
 * @typeParam name: string - Name of the employee
 * @typeParam document_type: string - Type of identification document
 * @typeParam document_type_id: string - ID type of identification document
 * @typeParam document_number: string - Number of identification document
 * @typeParam birthday: number - Employee's birthday as a Unix timestamp
 * @typeParam code: number - Employee code or identifier
 * @typeParam phone_number: string - Employee's phone number
 * @typeParam address: string - Employee's residential address
 * @typeParam country: string - Country of residence
 * @typeParam country_id: string - Id country of residence
 * @typeParam department: string - Department or state of residence
 * @typeParam department_id: string - ID department or state of residence
 * @typeParam city: string - City of residence
 * @typeParam city: string - Id city of residence
 * @typeParam postal_code: string - Postal code for the employee's address
 * @typeParam email: string - Employee's email address
 * @typeParam contributor_type: string - Type of contributor
 * @typeParam contributor_type_id: string - Id type of contributor
 * @typeParam contributor_subtype: string - Subtype of contributor
 * @typeParam contributor_subtype_id: string - Id subtype of contributor
 * @typeParam eps: string - Employee's EPS (Health Provider Entity)
 * @typeParam eps_id: string - Id employee's EPS (Health Provider Entity)
 * @typeParam severance_pay: string - Severance pay affiliation
 * @typeParam severance_pay_id: string - Id severance pay affiliation
 * @typeParam pension: string - Pension fund affiliation
 * @typeParam pension_id: string - Id pension fund affiliation
 * @typeParam compensation_fund: string - Compensation fund affiliation
 * @typeParam compensation_fund_id: string - Id compensation fund affiliation
 * @typeParam risk_level: string - Risk level associated with the job
 * @typeParam risk_level_id: string - Id risk level associated with the job
 * @typeParam contract: IContract - Employee's contract details
 * @typeParam status: string - Employment status (e.g., active, inactive)
 * @typeParam company_id: string - Identifier for the company the employee belongs to
 */
export interface IEmployeeDetail {
    id: string;
    name: string;
    document_type: string;
    document_type_id: string;
    document_number: string;
    birthday: number;
    code: string;
    phone_number: string;
    address: string;
    country: string;
    country_id: number;
    department: string;
    department_id: number;
    city: string;
    city_id: number;
    postal_code: string;
    email: string;
    contributor_type: string;
    contributor_type_id: string;
    contributor_subtype: string;
    contributor_subtype_id: string;
    eps: string;
    eps_id: string;
    severance_pay: string;
    severance_pay_id: string;
    pension: string;
    pension_id: string;
    compensation_fund: string;
    compensation_fund_id: string;
    risk_level: string;
    risk_level_id: string;
    contract: IContractDetail;
    status: string;
    company_id: string;
}

/**
 * Interface for contract information detail
 *
 * @typeParam id: string - Contract identifier
 * @typeParam area: string - Area or department of the employee
 * @typeParam area_id: string - Id area or department of the employee
 * @typeParam position: string - Job position of the employee
 * @typeParam position_id: string - Id job position of the employee
 * @typeParam contract_type: string - Type of the contract
 * @typeParam contract_type_id: string - Id type of the contract
 * @typeParam initial_date: number - Start date of the contract as a Unix timestamp
 * @typeParam final_date: number - End date of the contract as a Unix timestamp
 * @typeParam payment_frequency: string - Frequency of payment
 * @typeParam payment_frequency_id: string - id frequency of payment
 * @typeParam salary: number - Salary amount for the employee
 * @typeParam has_transportation_assistance: boolean - Indicates if transportation assistance is provided
 * @typeParam salary_type: string - Type of salary (e.g., fixed, variable)
 * @typeParam salary_type_id: string - Id type of salary (e.g., fixed, variable)
 * @typeParam payment_method: string - Method of payment
 * @typeParam payment_method_id: string - Id method of payment
 * @typeParam bank: string - Bank associated with the payment method
 * @typeParam bank_id: string - Id bank associated with the payment method
 * @typeParam account_type: string - Type of bank account
 * @typeParam account_type_id: string - Id type of bank account
 * @typeParam account_number: string - Bank account number for salary deposits
 */
export interface IContractDetail {
    id: string;
    area: string;
    area_id: string;
    position: string;
    position_id: string;
    contract_type: string;
    contract_type_id: string;
    initial_date: number;
    final_date: number;
    payment_frequency: string;
    payment_frequency_id: string;
    salary: number;
    has_transportation_assistance: boolean;
    salary_type: string;
    salary_type_id: string;
    payment_method: string;
    payment_method_id: string;
    bank: string;
    bank_id: string;
    account_type: string;
    account_type_id: string;
    account_number: string;
}

/**
 * Interface for an employee profile object
 *
 * @typeParam id - Unique identifier for the employee
 * @typeParam name - Full name of the employee
 * @typeParam document_type_id - Identifier for the type of document the employee has
 * @typeParam document_number - Document number of the employee
 * @typeParam birthday - Date of birth of the employee in YYYY-MM-DD format
 * @typeParam code - Unique code associated with the employee (0 in this case)
 * @typeParam phone_number - Phone number of the employee
 * @typeParam address - Address of the employee
 * @typeParam country_id - Identifier for the country where the employee resides
 * @typeParam department_id - Identifier for the department within the country
 * @typeParam city_id - Identifier for the city where the employee resides
 * @typeParam postal_code - Postal code for the employee's address
 * @typeParam email - Email address of the employee
 * @typeParam contributor_type_id - Identifier for the type of contributor
 * @typeParam contributor_subtype_id - Identifier for the subtype of contributor
 * @typeParam eps_id - Identifier for the EPS (health insurance provider)
 * @typeParam severance_pay_id - Identifier for the severance pay provider
 * @typeParam pension_id - Identifier for the pension provider
 * @typeParam compensation_fund_id - Identifier for the compensation fund provider
 * @typeParam risk_level_id - Identifier for the risk level classification of the employee
 * @typeParam contract_id - Identifier for the employee's contract
 * @typeParam status - Current status of the employee
 * @typeParam company_id - Identifier for the company where the employee is employed
 * @typeParam department - Optional field to write department
 * @typeParam city - Optional field to write city
 */
export interface IEmployee {
    id: string | null;
    name: string;
    document_type_id: string;
    document_number: string;
    birthday: string;
    code: number;
    phone_number: string;
    address: string;
    country_id: number;
    department_id: number;
    city_id: number;
    postal_code: string | null;
    email: string;
    contributor_type_id: string;
    contributor_subtype_id: string;
    eps_id: string;
    severance_pay_id: string;
    pension_id: string;
    compensation_fund_id: string;
    risk_level_id: string;
    contract_id: string;
    status: string;
    company_id: string;
    department?: string;
    city?: string;
}

/**
 * Interface for a contract object associated with an employee
 *
 * @typeParam id - Unique identifier for the contract
 * @typeParam area_id - Identifier for the area in which the employee works
 * @typeParam position_id - Identifier for the employee's position
 * @typeParam contract_type_id - Identifier for the type of contract
 * @typeParam initial_date - Start date of the contract in YYYY-MM-DD format
 * @typeParam final_date - End date of the contract in YYYY-MM-DD format
 * @typeParam payment_frequency_id - Identifier for the frequency of payments
 * @typeParam salary - Salary amount for the employee
 * @typeParam is_salary - Boolean indicating if the salary is fixed (true) or variable (false)
 * @typeParam has_transportation_assistance - Boolean indicating if the employee receives transportation assistance
 * @typeParam salary_type_id - Identifier for the type of salary (e.g., hourly, monthly)
 * @typeParam payment_method_id - Identifier for the payment method
 * @typeParam bank_id - Identifier for the bank where the salary is deposited
 * @typeParam account_type_id - Identifier for the type of bank account
 * @typeParam account_number - Bank account number for salary deposits
 */
export interface IContract {
    id: string;
    area_id: string;
    position_id: string;
    contract_type_id: string;
    initial_date: string;
    final_date: string;
    payment_frequency_id: string;
    salary: number;
    is_salary: boolean;
    has_transportation_assistance: boolean;
    salary_type_id: string;
    payment_method_id: string;
    bank_id: string | null;
    account_type_id: string | null;
    account_number: string | null;
}

/**
 * Interface form to create employee
 *
 * @typeParam employee: IEmployee - Data employee
 * @typeParam employee: IContract - Data contract employee
 */
export interface IFormEmployee {
    employee: IEmployee;
    contract: IContract | IContract[];
}

/**
 * Interface history object
 *
 * @typeParam date: number - Date register
 * @typeParam activity: string - Description activity
 * @typeParam user: string - User that made the activity
 */
export interface IHistory {
    date: number;
    activity: string;
    user: string;
}

/**
 * Interface representing a position object.
 *
 * @typeParam id: string | null - Unique identifier for the position.
 * @typeParam name: string - Name of the position.
 * @typeParam area_id: string - Optional identifier of the area to which the position belongs.
 */
export interface IPosition {
    id: string | null;
    name: string;
    area_id?: string;
}

/**
 * Interface representing an area object.
 *
 * @typeParam id: string | null - Unique identifier for the area.
 * @typeParam name: string - Name of the area.
 * @typeParam company_id - Company id
 * @typeParam positions: IPosition[] - List of positions within the area.
 */
export interface IArea {
    id: string | null;
    name: string;
    company_id?: string;
    positions: IPosition[];
}

/**
 * Interface data to delete from organization chart
 *
 * @typeParam areas: string[] - List areas to delete
 * @typeParam positions: string[] - List positions to delete
 */
export interface IDeleteData {
    areas: string[];
    positions: string[];
}
