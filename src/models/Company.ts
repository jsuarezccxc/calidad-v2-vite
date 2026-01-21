import { IGenericRecord } from './GenericRecord';
import { IMembership } from './Membership';

/**
 * This interface describes data of company
 *
 * @typeParam id: string - Id's company
 * @typeParam name: string - Name's company
 * @typeParam person_type: string - Person type's company
 * @typeParam person_type_name: string - Optional person type name's company
 * @typeParam document_type: string - Document type's representative company
 * @typeParam document_type_id: string - Optional - Document type's id representative company
 * @typeParam document_type_name: string - Optional document type name's company
 * @typeParam document_number: string - Document number's representative company
 * @typeParam company_representative_name: string - Company representative name's company
 * @typeParam ciius: { ciiu_id?: number; code: string; name: string; number_resolution: string; }[]: IGenericRecord[] - Ciiu's object from company
 * @typeParam ciiu_code: string - Ciiu's code company
 * @typeParam ciiu_name: string - Optional Ciiu name's company
 * @typeParam phone: number - Phone's company
 * @typeParam country_id: string - Country id's company
 * @typeParam country_name: string - Country name's company
 * @typeParam department_id: string - Department id's company
 * @typeParam department_name: string - Department name's company
 * @typeParam city_id: string - City id's company
 * @typeParam city_name: string - City name's company
 * @typeParam postal_code: string - Postal code's company
 * @typeParam address: string - Address's company
 * @typeParam domain: string - Domain's company
 * @typeParam make_web_page_type: string - Make web page type's company
 * @typeParam brand_established_service: boolean - Brand established service's company
 * @typeParam accept_company_privacy: boolean - Accept company privacy's company
 * @typeParam company_privacy_acceptation_date: number - Company privacy acceptation date's company
 * @typeParam created_at: boolean - Created date's company
 * @typeParam updated_at: boolean - Updated date's company
 * @typeParam whatsapp: string - Whatsapp's company
 * @typeParam fiscal_responsibility: string - Fiscal responsibility company
 * @typeParam memberships: IMembership[] - List of membership from company
 * @typeParam foreign_exchange: string - Name foreign exchange
 * @typeParam foreign_exchange_id: string - Foreign exchange id
 * @typeParam foreign_exchange_code: string - Foreign exchange code
 * @typeParam params_from_utils_tax_detail: string - Tax detail's company
 * @typeParam tax_detail_code: string - Tax detail's code company
 * @typeParam params_from_utils_fiscal_responsibility_code: string - Tax detail's fiscal responsibility company
 * @typeParam logo_extension: string - Logo extension
 * @typeParam has_a_physical_store: boolean -  has a physical store
 * @typeParam has_e_commerce: boolean - has e commerce
 * @typeParam active_memberships: IGenericRecord - Membership's active
 * @typeParam companies_foreign_exchange: Optional ICompaniesForeignExchange[] - List foreign exchange
 * @typeParam company_devices?: IGenericRecord[]: Company's device
 * @typeParam is_billing_us: boolean - Optional If the company handles electronic invoices with FamiEfi
 * @typeParam email: boolean - Optional company email
 * @typeParam step_instructions:  IGenericRecord - company steps to electronic documents
 */
export interface ICompany {
    id: string;
    name: string;
    person_type: string;
    person_type_name?: string;
    document_type: string;
    document_type_id?: string;
    document_type_name?: string;
    document_number: string;
    company_representative_name: string;
    ciius: {
        ciiu_id?: number;
        code: string;
        name: string;
        number_resolution: string;
    }[];
    phone: string;
    country_id: string;
    country_name: string;
    department_id: string;
    department_name: string;
    city_id: string;
    city_name: string;
    postal_code: string;
    address: string;
    domain: string;
    make_web_page_type: string;
    brand_established_service: boolean;
    accept_company_privacy: boolean;
    company_privacy_acceptation_date: number;
    created_at: boolean |number;
    updated_at: boolean;
    whatsapp: string;
    fiscal_responsibilities: IFiscal[];
    memberships: IMembership[];
    foreign_exchange: string;
    foreign_exchange_id: string;
    foreign_exchange_code: string;
    tax_detail: string;
    tax_detail_code: string;
    params_from_utils?: {
        id: number;
        code: string;
        name: string;
    };
    logo_extension: string;
    has_a_physical_store: boolean;
    active_memberships?: IGenericRecord;
    no_active_memberships?: IGenericRecord;
    companies_foreign_exchange?: ICompaniesForeignExchange[];
    company_devices: IGenericRecord[];
    is_billing_us?: boolean;
    email?: string;
    step_instructions: IGenericRecord;
}

/**
 * This interface describes data of document type
 *
 * @typeParam id: string - Id's document type
 * @typeParam name: string - Name's document type
 * @typeParam description: string - Description's document type
 * @typeParam created_at: number - Created date's document type
 * @typeParam updated_at: number - Updated date's document type
 */
export interface IDocumentType {
    id: string;
    name: string;
    description: string;
    created_at: number;
    updated_at: number;
}

/**
 * This interface describes data of country
 *
 * @typeParam id: string - Id's country
 * @typeParam name: string - Name's country
 * @typeParam code: string - Code's country
 * @typeParam created_at: string - Created date's country
 * @typeParam updated_at: string - Updated date's country
 */
export interface ICountry {
    id: string;
    name: string;
    code: string;
    created_at: string;
    updated_at: string;
}

/**
 * This interface describes data of department
 *
 * @typeParam id: string - Id's department
 * @typeParam name: string - Name's department
 * @typeParam code: string - Code's department
 * @typeParam created_at: string - Created date's department
 * @typeParam updated_at: string - Updated date's department
 */
export interface IDepartment {
    id: string;
    name: string;
    code: string;
    created_at: string;
    updated_at: string;
}

/**
 * This interface describes data of city
 *
 * @typeParam id: string - Id's city
 * @typeParam name: string - Name's city
 * @typeParam code: string - Code's city
 * @typeParam description: string - Description's city
 * @typeParam created_at: string - Created date's city
 * @typeParam updated_at: string - Updated date's city
 */
export interface ICity {
    id: string;
    name: string;
    code: string;
    description: string;
    created_at: string;
    updated_at: string;
}

/**
 * This interface describes data of ciiu
 *
 * @typeParam id: string - Id's ciiu
 * @typeParam name: string - Name's ciiu
 * @typeParam code: string - Code's ciiu
 * @typeParam created_at: string - Created date's ciiu
 * @typeParam updated_at: string - Updated date's ciiu
 */
export interface ICiiu {
    id: string;
    name: string;
    code: string;
    created_at: string;
    updated_at: string;
}

/**
 * This interface describes data of responsibilities
 *
 * @typeParam id: string - Id's responsibility
 * @typeParam name: string - Name's responsibility
 * @typeParam code_fiscal_responsibility: number - Code's responsibility
 */
export interface IResponsibility {
    id: string;
    name: string;
    code_fiscal_responsibility: number;
}

/**
 * This interface describes data of fiscal responsibilities
 *
 * @typeParam id_fiscal: string - Id item
 * @typeParam number_resolution: Optional number resolution from responsibility
 * @typeParam date: string - Optional date responsibility
 * @typeParam name: string - Name fiscal responsibility
 * @typeParam code: string - Code responsibility
 * @typeParam id: string - id fiscal responsibility
 * @typeParam withholdings: IWithholdings[] - withholdings
 * @typeParam meaning: string - meaning fiscal responsibilities
 * @typeParam isRequiredResponsibilities: boolean - validation fiscal responsibilities
 * @typeParam vat_withholding: boolean - Vat withholding
 * @typeParam withholding_at_source: boolean - Withholding at source
 * @typeParam withholding_ica: boolean - withholding ICA
 */
export interface IFiscal {
    id_fiscal: string;
    number_resolution?: string;
    date?: string;
    name: string;
    code: string;
    id: string;
    withholdings: IWithholdings[];
    meaning?: string;
    isRequiredResponsibilities?: boolean;
    vat_withholding: boolean;
    withholding_at_source: boolean;
    withholding_ica: boolean;
}

/**
 * This interface describes data of Foreign Exchange
 *
 * @typeParam id: string - Foreign exchange id
 * @typeParam name: string - Name's Foreign exchange
 * @typeParam code: string - Code's Foreign exchange
 */
export interface IForeignExchange {
    id: string;
    name: string;
    code: string;
}

/**
 * This interface describes data of company website
 *
 * @typeParam company_name: string - Company name
 * @typeParam company_id: string - Company id
 */
export interface ICompanyWebsiteData {
    company_name: string;
    company_id: string;
}

/**
 * This interface describes data of withholdings
 *
 * @typeParam is_active: boolean - Check status
 * @typeParam name: string - Name withholding
 */
export interface IWithholdings {
    is_active: boolean;
    name: string;
}

/**
 * This interface describes data of foreign exchange
 *
 * @typeParam code: string - Check foreign exchange
 * @typeParam created_at: string - Optional creation date
 * @typeParam description: string - Optional description foreign exchange
 * @typeParam id: string - Id foreign exchange
 * @typeParam is_active: string - Foreign exchange status
 * @typeParam name: string - Name currency
 * @typeParam update_at: string - Update date
 * @typeParam companies_foreign_exchange_id: string - Optional id foreign exchange in the company
 */
export interface ICompaniesForeignExchange {
    code: string;
    created_at?: string;
    description?: string;
    id: string;
    is_active: string;
    name: string;
    update_at: string;
    companies_foreign_exchange_id?: string;
}

/**
 * This interface define table data
 *
 * @typeParam company_id: string - Company's ID
 * @typeParam description: string - Description tax
 * @typeParam id: string - Tax's ID
 * @typeParam rate: number - Percentage tax
 * @typeParam rate_name: string - Percentage name
 * @typeParam tax_id: string - Tax's ID by utils
 * @typeParam tax_name: string - Name tax
 * @typeParam is_customized: boolean - Type tax
 * @typeParam is_selected: boolean - If selected tax
 * @typeParam is_new: boolean - If new tax
 * @typeParam is_active: boolean - If active tax
 */
export interface ICompanyTaxes {
    company_id: string;
    description: string;
    id: string;
    rate: number;
    rate_name: string;
    tax_id: string;
    tax_name: string;
    is_customized: boolean;
    is_selected: boolean;
    is_new: boolean;
    is_active: boolean;
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
    ClientName = 'name',
    InvoiceType = 'operation_type_id',
    Prefix = 'prefix',
    PaymentType = 'payment_type',
    PaymentMethod = 'payment_method',
    ForeignExchangeId = 'foreign_exchange_id',
    Supplier = 'supplier',
    Taxes = 'taxes',
    ClientId = 'client_id',
    Name = 'name',
    Email = 'email',
    NameLegal = 'name_legal_representative',
}

/**
 * This interface is param for build options
 *
 * @typeParam util?: IGenericRecord[] - Param utils data
 * @typeParam keyId?: string - Key ID
 * @typeParam keyValue?: string - Key value
 */
export interface IParamBuildGlobalOption {
    util?: IGenericRecord[];
    keyId?: string;
    keyValue?: string;
}
