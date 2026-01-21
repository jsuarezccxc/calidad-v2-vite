import { IInvoiceDetails, ITableTaxesAndRetention } from './ElectronicInvoice';

/**
 * This interface is customer information
 * 
 * @typeParam id: string - ID customer
 * @typeParam name: string - Name customer
 * @typeParam last_name: string | null - Last name customer
 * @typeParam description: string | null - Description
 * @typeParam tax_details_code: string - Tax details code customer
 * @typeParam tax_details_name: string - Tax details customer
 * @typeParam receive_email: boolean - If receive email
 * @typeParam receive_products: boolean - If receive products
 * @typeParam receive_printed_invoice: boolean - If receive printed documents
 * @typeParam company_device_name: string | null - Company device
 * @typeParam company_device_id: string | null - Company device id
 */
export interface ICustomer {
    id: string;
    name: string;
    last_name: string | null;
    description: string | null;
    tax_details_code: string;
    tax_details_name: string;
    receive_email: boolean;
    receive_products: boolean;
    receive_printed_invoice: boolean;
    company_device_name: string | null;
    company_device_id: string | null;
}

/**
 * This interface id fiscal responsibility
 * 
 * @typeParam id: string - ID fiscal responsibility
 * @typeParam name: string - Name fiscal responsibility
 */
export interface IFiscalResponsibility {
    id: string;
    name: string;
}

/**
 * This interface is for electronic note form
 * 
 * @typeParam address: string | null - Form property for create electronic note
 * @typeParam aggregation_method: string | null - Form property for create electronic note
 * @typeParam amount_paid: number - Form property for create electronic note
 * @typeParam answer_client: string | null - Form property for create electronic note
 * @typeParam answer_dian: string | null - Form property for create electronic note
 * @typeParam apply_deductible: boolean - Form property for create electronic note
 * @typeParam apply_electronic_invoice: boolean - Form property for create electronic note
 * @typeParam cellphone: string | null - Form property for create electronic note
 * @typeParam city_id: string | null - Form property for create electronic note
 * @typeParam city_name: string | null - Form property for create electronic note
 * @typeParam company_address: string | null - Form property for create electronic note
 * @typeParam company_postal_code: string | null - Form property for create electronic note
 * @typeParam country_id: string | null - Form property for create electronic note
 * @typeParam country_name: string | null - Form property for create electronic note
 * @typeParam customer_id: string - Form property for create electronic note
 * @typeParam client_id: string - Form property for create electronic note
 * @typeParam customer: ICustomer - Form property for create electronic note
 * @typeParam tax_details_code: string - Form property for create electronic note
 * @typeParam tax_details_name: string - Form property for create electronic note
 * @typeParam date: string - Form property for create electronic note
 * @typeParam date_limit: string - Form property for create electronic note
 * @typeParam date_purchase_order: string | null - Form property for create electronic note
 * @typeParam days_collection: number - Form property for create electronic note
 * @typeParam department_id: string | null - Form property for create electronic note
 * @typeParam department_name: string | null - Form property for create electronic note
 * @typeParam document_number: string - Form property for create electronic note
 * @typeParam document_number_purchasing_manager: string | null - Form property for create electronic note
 * @typeParam document_number_sales_manager: string | null - Form property for create electronic note
 * @typeParam document_type: string - Form property for create electronic note
 * @typeParam document_type_name: string - Form property for create electronic note
 * @typeParam document_type_name_purchasing_manager: string | null - Form property for create electronic note
 * @typeParam document_type_name_sales_manager: string | null - Form property for create electronic note
 * @typeParam document_type_purchasing_manager: string | null - Form property for create electronic note
 * @typeParam document_type_sales_manager: string | null - Form property for create electronic note
 * @typeParam electronic_billing: boolean - Form property for create electronic note
 * @typeParam email: string | null - Form property for create electronic note
 * @typeParam fiscal_responsibilities: IFiscalResponsibility[] - Form property for create electronic note
 * @typeParam foreign_exchange_id: string - Form property for create electronic note
 * @typeParam foreign_exchange_name: string - Form property for create electronic note
 * @typeParam foreign_exchange_rate: number - Form property for create electronic note
 * @typeParam invoice_id: string | null - Form property for create electronic note
 * @typeParam invoice_state: string - Form property for create electronic note
 * @typeParam is_electronic_invoice: boolean - Form property for create electronic note
 * @typeParam is_paid: boolean - Form property for create electronic note
 * @typeParam name: string - Form property for create electronic note
 * @typeParam note: string - Form property for create electronic note
 * @typeParam number: string - Form property for create electronic note
 * @typeParam number_associated: string - Form property for create electronic note
 * @typeParam number_max: number - Form property for create electronic note
 * @typeParam number_purchase_order: string | null - Form property for create electronic note
 * @typeParam payment_method_id: string - Form property for create electronic note
 * @typeParam payment_method_name: string - Form property for create electronic note
 * @typeParam payment_type_id: string - Form property for create electronic note
 * @typeParam payment_type_name: string - Form property for create electronic note
 * @typeParam person_id: string - Form property for create electronic note
 * @typeParam phone: string | null - Form property for create electronic note
 * @typeParam postal_code: string | null - Form property for create electronic note
 * @typeParam prefix_id: string - Form property for create electronic note
 * @typeParam prefix_id_associated: string - Form property for create electronic note
 * @typeParam purchasing_manager: string - Form property for create electronic note
 * @typeParam sale_channel: string - Form property for create electronic note
 * @typeParam sales_manager: string - Form property for create electronic note
 * @typeParam send_address: string - Form property for create electronic note
 * @typeParam source_type: string - Form property for create electronic note
 * @typeParam shop_cart_id: string | null - Form property for create electronic note
 * @typeParam state_purchase_order: string | null - Form property for create electronic note
 * @typeParam time_issue: string - Form property for create electronic note
 * @typeParam type_taxpayer_id: string - Form property for create electronic note
 * @typeParam type_taxpayer_name: string - Form property for create electronic note
 * @typeParam reason_rejection_id: string - Form property for create electronic note
 * @typeParam reason_rejection_description: string - Form property for create electronic note
 * @typeParam code_debit_note: number | null - Form property for create electronic note
 * @typeParam code_credit_note: number | null - Form property for create electronic note
 * @typeParam acceptance_agreement: boolean - Form property for create electronic note
 * @typeParam accepted_customer: boolean - Form property for create electronic note
 * @typeParam associated_date: string - Form property for create electronic note
 * @typeParam associated_expiration_date: string - Form property for create electronic note
 * @typeParam associated_document_prefix: string - Form property for create electronic note
 * @typeParam prefix_name: string - Form property for create electronic note
 * @typeParam operation_type_id: string - Form property for crate electronic note
 * @typeParam name_legal_representative: string | null - Form property for create electronic note
 * @typeParam internal_notes: string - Form property for internal note
 */
export interface IElectronicNoteForm {
    address: string | null;
    aggregation_method: string | null;
    amount_paid: number;
    answer_client: string | null;
    answer_dian: string | null;
    apply_deductible: boolean;
    apply_electronic_invoice: boolean;
    cellphone: string | null;
    city_id: string | null;
    city_name: string | null;
    company_address: string | null;
    company_postal_code: string | null;
    country_id: string | null;
    country_name: string | null;
    customer_id: string;
    client_id: string;
    customer: ICustomer;
    tax_details_code: string;
    tax_details_name: string;
    date: string;
    date_limit: string;
    date_purchase_order: string | null;
    days_collection: number;
    department_id: string | null;
    department_name: string | null;
    document_number: string;
    document_number_purchasing_manager: string | null;
    document_number_sales_manager: string | null;
    document_type: string;
    document_type_name: string;
    document_type_name_purchasing_manager: string | null;
    document_type_name_sales_manager: string | null;
    document_type_purchasing_manager: string | null;
    document_type_sales_manager: string | null;
    electronic_billing: boolean;
    email: string | null;
    fiscal_responsibilities: IFiscalResponsibility[];
    foreign_exchange_id: string;
    foreign_exchange_name: string;
    foreign_exchange_rate: number;
    invoice_id: string | null;
    invoice_state: string;
    is_electronic_invoice: boolean;
    is_paid: boolean;
    name: string;
    note: string;
    number: string;
    number_associated: string;
    number_max: number;
    number_purchase_order: string | null;
    payment_method_id: string;
    payment_method_name: string;
    payment_type_id: string;
    payment_type_name: string;
    person_id: string;
    phone: string | null;
    postal_code: string | null;
    prefix_id: string;
    prefix_id_associated: string;
    purchasing_manager: string;
    sale_channel: string;
    sales_manager: string;
    send_address: string;
    source_type: string;
    shop_cart_id: string | null;
    state_purchase_order: string | null;
    time_issue: string;
    type_taxpayer_id: string;
    type_taxpayer_name: string;
    reason_rejection_id: string;
    reason_rejection_description: string;
    code_debit_note: number | null;
    code_credit_note: number | null;
    acceptance_agreement: boolean;
    accepted_customer: boolean;
    associated_date: string;
    associated_expiration_date: string;
    associated_document_prefix: string;
    prefix_name: string;
    operation_type_id: string;
    name_legal_representative: string | null;
    internal_notes?: string;
}

/**
 * This interface is totals note
 * 
 * @typeParam base_reteica: number - Optional Base reteica
 * @typeParam base_reteiva: number - Base reteiva
 * @typeParam base_retefuente: number - Base retefuente
 * @typeParam total_sale_before_tax: number - Total sale before tax 
 * @typeParam total_sale: number - Total sale
 * @typeParam total_discount: number - Total discount
 * @typeParam sending_charge: number - Sending charge
 * @typeParam total_invoice: number - Total invoice
 * @typeParam total_iva: number - Total IVA
 * @typeParam total_icui: number - Total ICUI
 * @typeParam total_ibua: number - Total IBUA
 * @typeParam total_impoconsumption: number - Total impoconsumption
 * @typeParam total_sale_value: number - Total sale value
 * @typeParam retefuente: number - Retefuente
 * @typeParam reteica: number - Optional Reteica
 * @typeParam reteiva: number - Reteiva
 * @typeParam total: number - Total
 */
export interface IElectronicDocumentTotals {
    base_reteica?: number;
    base_reteiva: number;
    base_retefuente: number;
    total_sale_before_tax: number;
    total_sale: number;
    total_discount: number;
    sending_charge: number;
    total_invoice: number;
    total_iva: number;
    total_icui: number;
    total_ibua: number;
    total_impoconsumption: number;
    total_sale_value: number;
    retefuente: number;
    reteica?: number;
    reteiva: number;
    total: number;
}

/**
 * This interface is save electronic note
 * 
 * @typeParam products: IInvoiceDetails[] - Invoice details
 * @typeParam taxes: ITableTaxesAndRetention[] - Taxes products
 * @typeParam withholdings: ITableTaxesAndRetention[] - Retentions
 */
export interface IElectronicNote extends IElectronicNoteForm, IElectronicDocumentTotals {
    products: IInvoiceDetails[];
    taxes: ITableTaxesAndRetention[];
    withholdings: ITableTaxesAndRetention[];
}
