import { ISupplier } from './PurchaseInvoice';
import { IInvoiceDetails } from './ElectronicInvoice';
import { IElectronicDocumentTotals } from './ElectronicNote';
import { IApiResponse } from './ResponseApi';

/**
 * Interfaces and types for Purchase Invoice Notes
 * 
 * @typeParam lang: string - Language code
 * @typeParam date: string - Date of the invoice
 * @typeParam is_draft: boolean - Indicates if the invoice is a draft
 * @typeParam time_issue: string - Time of issue
 * @typeParam date_limit: string - Due date for payment
 * @typeParam collection_days: string - Number of days for collection
 * @typeParam days_collection_type: string - Type of days for collection
 * @typeParam document_number_sales_manager: string | null - Document number of the sales manager
 * @typeParam document_type_purchasing_manager: string | null - Document type of the purchasing manager
 * @typeParam document_type_purchasing_manager_name: string | null - Document type ID of the purchasing manager
 * @typeParam document_uuid: string - Unique identifier for the document
 * @typeParam employee_id: string - ID of the employee
 * @typeParam foreign_exchange_id: string - ID of the foreign exchange
 * @typeParam foreign_exchange_name: string - Name of the foreign exchange
 * @typeParam internal_notes: string - Internal notes for the invoice
 * @typeParam is_paid: boolean - Payment status of the invoice
 * @typeParam note: string - Additional notes
 * @typeParam number_purchase_order: string - Purchase order number
 * @typeParam payment_method: string - Payment method used
 * @typeParam payment_method_id: string - ID of the payment method
 * @typeParam payment_type_id: string - ID of the payment type
 * @typeParam payment_type_name: string - Name of the payment type
 * @typeParam person_id: string - ID of the person
 * @typeParam prefix: string - Prefix for the invoice
 * @typeParam number: string - Invoice number
 * @typeParam prefix_id: string | null - ID of the prefix
 * @typeParam sales_manager: string | null - Name of the sales manager
 * @typeParam supplier: ISupplier - Supplier information
 * @typeParam supplier_id: string - ID of the supplier
 * @typeParam supplier_invoice_number: string | null - Supplier's invoice number
 * @typeParam purchasing_manager: string - Name of the purchasing manager
 * @typeParam document_number_purchasing_manager: string - Document number of the purchasing manager
 * @typeParam foreign_exchange_rate: number - Exchange rate for foreign currency
 * @typeParam invoice_state: string - Current state of the invoice
 * @typeParam sale_channel: string - Channel through which the sale was made
 * @typeParam is_electronic_invoice: boolean - Indicates if it's an electronic invoice
 * @typeParam apply_deductible: boolean - Indicates if deductible applies
 * @typeParam source_type: string - Type of source for the invoice
 */
export interface IFormPurchaseInvoiceNote {
    lang: string;
    date: string;
    is_draft: boolean;
    time_issue: string;
    date_limit: string;
    collection_days: string;
    days_collection_type: string;
    document_number_sales_manager: string | null;
    document_type_purchasing_manager: string | null;
    document_type_purchasing_manager_name: string | null;
    document_uuid: string;
    employee_id: string;
    foreign_exchange_id: string;
    foreign_exchange_name: string;
    internal_notes: string;
    is_paid: boolean;
    note: string;
    number_purchase_order: string;
    payment_method: string;
    payment_method_id: string;
    payment_type_id: string;
    payment_type_name: string;
    person_id: string;
    prefix: string;
    number: string;
    prefix_id: string | null;
    sales_manager: string | null;
    supplier: ISupplier;
    supplier_id: string;
    supplier_invoice_number: string | null;
    purchasing_manager: string;
    document_number_purchasing_manager: string;
    foreign_exchange_rate: number;
    invoice_state: string;
    sale_channel: string;
    is_electronic_invoice: boolean;
    apply_deductible: boolean;
    source_type: string;
}

/**
 * Main form interface for Purchase Invoice Notes
 * 
 * @typeParam invoice_id: string - ID of the original invoice
 * @typeParam invoice_type: string - Type of the invoice
 * @typeParam reason_rejection_id: string - ID of the rejection reason
 * @typeParam reason_rejection_description: string - Description of the rejection reason
 * @typeParam code_debit_note: null | number - Code for debit note if applicable
 * @typeParam code_credit_note: null | number - Code for credit note if applicable
 */
export interface IMainFormNote {
    invoice_id: string;
    invoice_type: string;
    reason_rejection_id: string;
    reason_rejection_description: string;
    code_debit_note: null | number;
    code_credit_note: null | number;
}

/**
 * Complete Purchase Invoice Note Request interface
 * Extends IFormPurchaseInvoiceNote, IMainFormNote, and IElectronicDocumentTotals
 * 
 * @typeParam products: IInvoiceDetails[] - Array of invoice details/products
 */
export interface IPurchaseInvoiceNoteRequest extends IFormPurchaseInvoiceNote, IMainFormNote, IElectronicDocumentTotals {
    products: IInvoiceDetails[];
}

/**
 * Complete Purchase Invoice interface with all invoice data
 * 
 * @typeParam cufe: string - Unique fiscal code (CUFE)
 * @typeParam document_uuid: string - Unique document identifier
 * @typeParam supplier_invoice_number: string - Supplier's invoice number
 * @typeParam invoice_id: string - ID of the invoice
 * @typeParam number: string - Invoice number
 * @typeParam date: number - Invoice date as timestamp
 * @typeParam number_purchase_order: string | null - Purchase order number
 * @typeParam date_limit: number - Payment due date as timestamp
 * @typeParam total_invoice: number - Total amount of the invoice
 * @typeParam note: string | null - Additional notes
 * @typeParam apply_deductible: boolean - Indicates if deductible applies
 * @typeParam invoice_state: string - Current state of the invoice
 * @typeParam is_paid: boolean - Payment status
 * @typeParam is_electronic_invoice: boolean - Electronic invoice flag
 * @typeParam country_id: number - Country ID
 * @typeParam department_id: number - Department/state ID
 * @typeParam city_id: number - City ID
 * @typeParam payment_method_id: string - Payment method ID
 * @typeParam payment_method_name: string - Payment method name
 * @typeParam sale_channel: string - Sales channel
 * @typeParam source_type: string - Source type
 * @typeParam total_sale: number - Total sale amount
 * @typeParam total_discount: number - Total discount amount
 * @typeParam sending_charge: number - Shipping charges
 * @typeParam total_sale_value: number - Total sale value
 * @typeParam total_iva: number - Total IVA (VAT) amount
 * @typeParam retefuente: number - Income tax withholding
 * @typeParam reteica: number - ICA tax withholding
 * @typeParam reteiva: number - IVA tax withholding
 * @typeParam base_retefuente: number - Base amount for income tax withholding
 * @typeParam base_reteica: number - Base amount for ICA tax withholding
 * @typeParam base_reteiva: number - Base amount for IVA tax withholding
 * @typeParam state_purchase_order: string | null - Purchase order state
 * @typeParam total: number - Total amount
 * @typeParam total_impoconsumption: number - Total consumption tax
 * @typeParam purchasing_manager: string | null - Purchasing manager name
 * @typeParam document_type_purchasing_manager: string | null - Document type of purchasing manager
 * @typeParam document_type_name_purchasing_manager: string | null - Document type name of purchasing manager
 * @typeParam document_number_purchasing_manager: string | null - Document number of purchasing manager
 * @typeParam sales_manager: string | null - Sales manager name
 * @typeParam document_type_sales_manager: string | null - Document type of sales manager
 * @typeParam document_number_sales_manager: string | null - Document number of sales manager
 * @typeParam time_issue: string - Time of issue
 * @typeParam foreign_exchange_id: string - Foreign exchange ID
 * @typeParam foreign_exchange_rate: number - Exchange rate
 * @typeParam foreign_exchange_name: string - Foreign exchange name
 * @typeParam days_collection: number | null - Collection days
 * @typeParam days_collection_type: string | null - Collection days type
 * @typeParam payment_type_id: string - Payment type ID
 * @typeParam aggregation_method: string - Aggregation method
 * @typeParam payment_type_name: string - Payment type name
 * @typeParam send_address: string - Sending address
 * @typeParam company_address: string - Company address
 * @typeParam postal_code: string | null - Postal code
 * @typeParam company_postal_code: string | null - Company postal code
 * @typeParam person_id: string - Person ID
 * @typeParam prefix: string - Invoice prefix
 * @typeParam taxes: [] - Array of taxes
 * @typeParam withholdings: [] - Array of withholdings
 * @typeParam invoice_pdf_url: string - URL to PDF version of invoice
 * @typeParam invoice_excel_url: string | null - URL to Excel version of invoice
 * @typeParam consecutive: IConsecutive - Consecutive numbering information
 * @typeParam products: IInvoiceDetails[] - Array of invoice products/details
 * @typeParam person: IPerson - Person/customer information
 * @typeParam internal_notes: string | null - Internal notes
 */
export interface IPurchaseInvoice {
    cufe: string;
    document_uuid: string;
    supplier_invoice_number: string;
    invoice_id: string;
    number: string;
    date: number;
    number_purchase_order: string | null;
    date_limit: number;
    total_invoice: number;
    note: string | null;
    apply_deductible: boolean;
    invoice_state: string;
    is_paid: boolean;
    is_electronic_invoice: boolean;
    country_id: number;
    department_id: number;
    city_id: number;
    payment_method_id: string;
    payment_method_name: string;
    sale_channel: string;
    source_type: string;
    total_sale: number;
    total_discount: number;
    sending_charge: number;
    total_sale_value: number;
    total_iva: number;
    retefuente: number;
    reteica: number;
    reteiva: number;
    base_retefuente: number;
    base_reteica: number;
    base_reteiva: number;
    state_purchase_order: string | null;
    total: number;
    total_impoconsumption: number;
    purchasing_manager: string | null;
    document_type_purchasing_manager: string | null;
    document_type_name_purchasing_manager: string | null;
    document_number_purchasing_manager: string | null;
    sales_manager: string | null;
    document_type_sales_manager: string | null;
    document_number_sales_manager: string | null;
    time_issue: string;
    foreign_exchange_id: string;
    foreign_exchange_rate: number;
    foreign_exchange_name: string;
    days_collection: number | null;
    days_collection_type: string | null;
    payment_type_id: string;
    aggregation_method: string;
    payment_type_name: string;
    send_address: string;
    company_address: string;
    postal_code: string | null;
    company_postal_code: string | null;
    person_id: string;
    prefix: string;
    taxes: [];
    withholdings: [];
    invoice_pdf_url: string;
    invoice_excel_url: string | null;
    consecutive: IConsecutive;
    products: IInvoiceDetails[];
    person: IPerson;
    internal_notes: string | null;
}

/**
 * Consecutive numbering interface for invoices
 * 
 * @typeParam id: string - Unique identifier
 * @typeParam invoice_id: string - Associated invoice ID
 * @typeParam money_installment_id: string | null - Money installment ID if applicable
 * @typeParam type: string - Type of consecutive
 * @typeParam prefix_id: string - Prefix ID
 * @typeParam number: number - Current consecutive number
 * @typeParam number_max: string | null - Maximum number allowed
 * @typeParam company_id: string - Company ID
 * @typeParam name: string - Name of the consecutive
 */
export interface IConsecutive {
    id: string;
    invoice_id: string;
    money_installment_id: string | null;
    type: string;
    prefix_id: string;
    number: number;
    number_max: string | null;
    company_id: string;
    name: string;
}

/**
 * Person/Customer information interface
 * 
 * @typeParam id: string - Unique person identifier
 * @typeParam company_id: string - Company ID
 * @typeParam document_type: string - Type of identification document
 * @typeParam country_id: number - Country ID
 * @typeParam country_name: string - Country name
 * @typeParam department_id: number - Department/state ID
 * @typeParam department_name: string - Department/state name
 * @typeParam city_id: number - City ID
 * @typeParam city_name: string - City name
 * @typeParam postal_code: string - Postal code
 * @typeParam document_number: string - Document number
 * @typeParam address: string - Physical address
 * @typeParam indications_address: string | null - Additional address indications
 * @typeParam email: string - Email address
 * @typeParam phone: string - Phone number
 * @typeParam cellphone: string | null - Mobile phone number
 * @typeParam type_taxpayer_id: string - Taxpayer type ID
 * @typeParam type_taxpayer_name: string - Taxpayer type name
 * @typeParam company_name: string | null - Company name if applicable
 * @typeParam electronic_biller: boolean - Electronic billing capability
 * @typeParam name_legal_representative: string | null - Legal representative name
 * @typeParam document_type_name: string - Document type name
 * @typeParam fiscal_responsibilities: Record<string, string>[] - Array of fiscal responsibilities
 * @typeParam supplier: ISupplierPurchase - Associated supplier information
 */
export interface IPerson {
    id: string;
    company_id: string;
    document_type: string;
    country_id: number;
    country_name: string;
    department_id: number;
    department_name: string;
    city_id: number;
    city_name: string;
    postal_code: string;
    document_number: string;
    address: string;
    indications_address: string | null;
    email: string;
    phone: string;
    cellphone: string | null;
    type_taxpayer_id: string;
    type_taxpayer_name: string;
    company_name: string | null;
    electronic_biller: boolean;
    name_legal_representative: string | null;
    document_type_name: string;
    fiscal_responsibilities: Record<string, string>[];
    supplier: ISupplierPurchase;
}

/**
 * Supplier information for purchase operations
 * 
 * @typeParam id: string - Unique supplier identifier
 * @typeParam name: string - Supplier name
 * @typeParam person_id: string - Associated person ID
 * @typeParam buy_responsible: string - Person responsible for purchases
 * @typeParam qualification_id: string - Qualification ID
 * @typeParam tax_details_code: string - Tax details code
 * @typeParam tax_details_name: string - Tax details name
 */
export interface ISupplierPurchase {
    id: string;
    name: string;
    person_id: string;
    buy_responsible: string;
    qualification_id: string;
    tax_details_code: string;
    tax_details_name: string;
}

/**
 * Response interface for Purchase Note creation
 * 
 * @typeParam id: string - Generated purchase note ID
 * @typeParam number: string - Generated purchase note number
 */
export interface IPurchaseNoteResponse {
    id: string;
    number: string;
}

/**
 * State cards interface for UI components
 * 
 * @typeParam number: number - Card number or identifier
 * @typeParam urlLogo: string - URL to the logo image
 * @typeParam logo: File | null - Logo file object
 */
export interface IStateCards {
    number: number;
    urlLogo: string;
    logo: File | null;
}

/**
 * Type alias for API response containing Purchase Note data
 */
export type ResponsePurchaseNote = IApiResponse<IPurchaseNoteResponse>;
