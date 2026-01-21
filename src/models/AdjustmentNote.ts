import { IInvoiceDetails, ITableTaxesAndRetention } from "./ElectronicInvoice";
import { IElectronicDocumentTotals, IFiscalResponsibility } from "./ElectronicNote";

/**
 * This interface for adjustment note form
 * 
 * @typeParam date_associated: string - Property form for create adjustment note
 * @typeParam date_limit: string - Property form for create adjustment note
 * @typeParam date_purchase_order: string - Property form for create adjustment note
 * @typeParam date: string - Property form for create adjustment note
 * @typeParam invoice_id: string - Property form for create adjustment note
 * @typeParam total_discount: number - Property form for create adjustment note
 * @typeParam aggregation_method: string - Property form for create adjustment note
 * @typeParam amount_paid: number - Property form for create adjustment note
 * @typeParam answer_client: string - Property form for create adjustment note
 * @typeParam answer_dian: string - Property form for create adjustment note
 * @typeParam apply_deductible: boolean - Property form for create adjustment note
 * @typeParam city_id: number - Property form for create adjustment note
 * @typeParam city_name: string - Property form for create adjustment note
 * @typeParam company_address: string - Property form for create adjustment note
 * @typeParam company_postal_code: string - Property form for create adjustment note
 * @typeParam country_id: number - Property form for create adjustment note
 * @typeParam country_name: string - Property form for create adjustment note
 * @typeParam cufe: string - Property form for create adjustment note
 * @typeParam dian_url: string - Property form for create adjustment note
 * @typeParam product_classification: string - Property form for create adjustment note
 * @typeParam warehouse_id: string - Property form for create adjustment note
 * @typeParam days_collection: any - Property form for create adjustment note
 * @typeParam days_collection_type: any - Property form for create adjustment note
 * @typeParam department_id: number - Property form for create adjustment note
 * @typeParam department_name: string - Property form for create adjustment note
 * @typeParam document_number_purchasing_manager: string - Property form for create adjustment note
 * @typeParam document_number_sales_manager: any - Property form for create adjustment note
 * @typeParam document_type_name_purchasing_manager: string - Property form for create adjustment note
 * @typeParam document_type_name_sales_manager: any - Property form for create adjustment note
 * @typeParam document_type_purchasing_manager: string - Property form for create adjustment note
 * @typeParam document_type_sales_manager: any - Property form for create adjustment note
 * @typeParam event_status: string - Property form for create adjustment note
 * @typeParam foreign_exchange_id: string - Property form for create adjustment note
 * @typeParam foreign_exchange_name: string - Property form for create adjustment note
 * @typeParam invoice_excel_url: any - Property form for create adjustment note
 * @typeParam invoice_number_supplier: string - Property form for create adjustment note
 * @typeParam invoice_pdf_url: string - Property form for create adjustment note
 * @typeParam invoice_state: string - Property form for create adjustment note
 * @typeParam invoice_type: string - Property form for create adjustment note
 * @typeParam is_electronic_invoice: boolean - Property form for create adjustment note
 * @typeParam is_paid: boolean - Property form for create adjustment note
 * @typeParam loaded_inventory: boolean - Property form for create adjustment note
 * @typeParam note: any - Property form for create adjustment note
 * @typeParam number_purchase_order: any - Property form for create adjustment note
 * @typeParam number: string - Property form for create adjustment note
 * @typeParam operation_type_id: string - Property form for create adjustment note
 * @typeParam payment_method_id: string - Property form for create adjustment note
 * @typeParam payment_method_name: string - Property form for create adjustment note
 * @typeParam payment_type_id: string - Property form for create adjustment note
 * @typeParam payment_type_name: string - Property form for create adjustment note
 * @typeParam person_id: string - Property form for create adjustment note
 * @typeParam person: IPerson - Property form for create adjustment note
 * @typeParam postal_code: string - Property form for create adjustment note
 * @typeParam prefix_id_associated: string - Property form for create adjustment note
 * @typeParam prefix_name_associated: string - Property form for create adjustment note
 * @typeParam prefix_number_associated: number - Property form for create adjustment note
 * @typeParam purchasing_manager: string - Property form for create adjustment note
 * @typeParam reason_rejected: any - Property form for create adjustment note
 * @typeParam sale_channel: string - Property form for create adjustment note
 * @typeParam sales_manager: any - Property form for create adjustment note
 * @typeParam send_address: string - Property form for create adjustment note
 * @typeParam shop_cart_id: any - Property form for create adjustment note
 * @typeParam source_type: string - Property form for create adjustment note
 * @typeParam state_purchase_order: any - Property form for create adjustment note
 * @typeParam support_bucket_id: any - Property form for create adjustment note
 * @typeParam time_associated: string - Property form for create adjustment note
 * @typeParam time_issue: string - Property form for create adjustment note
 * @typeParam foreign_exchange_rate: number - Property form for create adjustment note
 * @typeParam answer_dian_date: number - Property form for create adjustment note
 * @typeParam answer_client_date: any - Property form for create adjustment note
 * @typeParam status_history_document: IStatusHistoryDocument[] - Property form for create adjustment note
 * @typeParam file_name_extension: string - Property form for create adjustment note
 * @typeParam annulment: boolean - Property form for create adjustment note
 * @typeParam prefix_id: string - Property form for create adjustment note
 * @typeParam prefix_name: string - Property form for create adjustment note
 * @typeParam preview: boolean - Property form for create adjustment note
 * @typeParam internal_notes: string - Property form for create adjustment note
 * @typeParam fiscal_responsibilities: IFiscalResponsibility[] - Fiscal responsibilities
 * @typeParam name_legal_representative: string | null - Name legal representative
 */
export interface IAdjustmentNoteForm {
    date_associated: string;
    date_limit: string;
    date_purchase_order: string;
    date: string;
    invoice_id: string;
    total_discount: number;
    aggregation_method: string;
    amount_paid: number;
    answer_client: string;
    answer_dian: string;
    apply_deductible: boolean;
    city_id: number;
    city_name: string;
    company_address: string;
    company_postal_code: string;
    country_id: number;
    country_name: string;
    cufe: string;
    dian_url: string;
    product_classification: string;
    warehouse_id: string;
    days_collection: any;
    days_collection_type: any;
    department_id: number;
    department_name: string;
    document_number_purchasing_manager: string;
    document_number_sales_manager: any;
    document_type_name_purchasing_manager: string;
    document_type_name_sales_manager: any;
    document_type_purchasing_manager: string;
    document_type_sales_manager: any;
    event_status: string;
    foreign_exchange_id: string;
    foreign_exchange_name: string;
    invoice_excel_url: any;
    invoice_number_supplier: string;
    invoice_pdf_url: string;
    invoice_state: string;
    invoice_type: string;
    is_electronic_invoice: boolean;
    is_paid: boolean;
    loaded_inventory: boolean;
    note: any;
    number_purchase_order: any;
    number: string;
    operation_type_id: string;
    payment_method_id: string;
    payment_method_name: string;
    payment_type_id: string;
    payment_type_name: string;
    person_id: string;
    person: IPerson;
    postal_code: string;
    prefix_id_associated: string;
    prefix_name_associated: string;
    prefix_number_associated: number;
    purchasing_manager: string;
    reason_rejected: any;
    sale_channel: string;
    sales_manager: any;
    send_address: string;
    shop_cart_id: any;
    source_type: string;
    state_purchase_order: any;
    support_bucket_id: any;
    time_associated: string;
    time_issue: string;
    foreign_exchange_rate: number;
    answer_dian_date: number;
    answer_client_date: any;
    status_history_document: IStatusHistoryDocument[];
    file_name_extension: string;
    annulment: boolean;
    prefix_id: string;
    prefix_name: string;
    preview: boolean;
    internal_notes: string;
    fiscal_responsibilities: IFiscalResponsibility[];
    name_legal_representative: string | null;
}

/**
 * This interface person data
 * 
 * @typeParam supplier: ISupplier - Supplier information
 * @typeParam id: string - Id person
 * @typeParam company_id: string - Company id
 * @typeParam document_type: string - Document type person
 * @typeParam country_id: number - Country id
 * @typeParam country_name: string - Country
 * @typeParam department_id: number - Department id
 * @typeParam department_name: string - Department 
 * @typeParam city_id: number - City id
 * @typeParam city_name: string - City 
 * @typeParam postal_code: string - Postal code
 * @typeParam document_number: string - Document number
 * @typeParam document_type_name: string - Document type
 * @typeParam address: string - Address
 * @typeParam email: string - Email
 * @typeParam phone: string - Phone
 * @typeParam cellphone: string - Cellphone
 * @typeParam type_taxpayer_id: string - Type taxpayer Id
 * @typeParam type_taxpayer_name: string - Type taxpayer
 * @typeParam electronic_biller: boolean - Electronic biller
 * @typeParam fiscal_responsibilities: IFiscalResponsibility[] - Fiscal responsibilities
 */
export interface IPerson {
    supplier: ISupplier;
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
    document_type_name: string;
    address: string;
    email: string;
    phone: string;
    cellphone: string;
    type_taxpayer_id: string;
    type_taxpayer_name: string;
    electronic_biller: boolean;
    fiscal_responsibilities: IFiscalResponsibility[];
}

/**
 * This interface is supplier data
 * 
 * @typeParam id: string  - Id
 * @typeParam name: string  - Name supplier
 * @typeParam buy_responsible: string  - Buy responsible
 * @typeParam qualification_id: string  - Qualification id
 * @typeParam tax_details_code: string  - Tax details code
 * @typeParam tax_details_name: string  - Tax details
 */
export interface ISupplier {
    id: string;
    name: string;
    buy_responsible: string;
    qualification_id: string;
    tax_details_code: string;
    tax_details_name: string;
}

/**
 * This interface is status history document
 * 
 * @typeParam id: string - Id
 * @typeParam answer_ccxc: string | null - Answer ccxc
 * @typeParam answer_dian: string - Answer DIAN
 * @typeParam answer_client: string - Answer client
 * @typeParam answer_company: any - Answer company
 * @typeParam answer_ccxc: string | null - Answer ccxc
 * @typeParam invoice_id: string - Invoice id
 * @typeParam date: number - Date
 */
export interface IStatusHistoryDocument {
    id: string;
    answer_ccxc: string | null;
    answer_dian: string | null;
    answer_client: string | null;
    answer_company: any;
    invoice_id: string;
    date: number;
}

/**
 * This interface is totals adjustment note
 * 
 * @typeParam base_reteica: number - Base reteica
 * @typeParam base_reteiva: number - Base reteiva
 * @typeParam base_retefuente: number - Base retefuente
 */
export interface IAdjustmentNote extends IAdjustmentNoteForm, IElectronicDocumentTotals {
    products: IInvoiceDetails[];
    taxes: ITableTaxesAndRetention[];
    withholdings: ITableTaxesAndRetention[];
}
