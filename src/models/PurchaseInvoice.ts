import { IGenericRecord } from './GenericRecord';
import { IInvoiceDetails } from './ElectronicInvoice';

/**
 * Name of each field
 */
export enum FieldName {
    Cufe = 'cufe',
    IssueDate = 'issue_date',
    InvoiceNumber = 'supplier_invoice_number',
    Prefix = 'prefix',
    ExpirationDate = 'expiration_date',
    BroadcastTime = 'broadcast_time',
    BroadcastDate = 'date',
    Supplier = 'supplier',
    DocumentType = 'document_type',
    DocumentNumber = 'document_number',
    PersonType = 'person_type',
    PaymentType = 'payment_type_name',
    PaymentMethod = 'payment_method',
    ForeignExchange = 'foreign_exchange_id',
    Comment = 'comment',
    Sku = 'sku_internal',
    Quantity = 'quantity',
    PurchaseOrderNumber = 'number_purchase_order',
    SalesManager = 'sales_manager',
    ManagerDocumentNumber = 'document_number_sales_manager',
    ManagerDocumentType = 'document_type_purchasing_manager',
    SalesManagerDocumentTypeId = 'document_type_sales_manager',
    InternalNotes = 'internal_notes',
    Note = 'note',
    ForeignExchangeRate = 'foreign_exchange_rate',
    UnitCost = 'unit_cost',
    DocumentUuid = 'document_uuid',
    Warehouse = 'warehouse_name',
    Batch = 'batch_number',
    DateExpiration = 'date_expiration',
    PurchasingManager = 'purchasing_manager',
    PurchasingDocumentNumber = 'document_number_purchasing_manager'
}

/**
 * This interface is form purchase
 * 
 * @typeParam lang: string - Value to purchase invoice
 * @typeParam logo: IGenericRecord - Value to purchase invoice
 * @typeParam urlLogo: string - Value to purchase invoice
 * @typeParam date: number - Value to purchase invoice
 * @typeParam is_draft: boolean - Value to purchase invoice
 * @typeParam time_issue: string - Value to purchase invoice
 * @typeParam expiration_date: number - Value to purchase invoice
 * @typeParam person_id: string - Value to purchase invoice
 * @typeParam cufe: string - Value to purchase invoice
 * @typeParam supplier_invoice_number: string - Value to purchase invoice
 * @typeParam prefix: string - Value to purchase invoice
 * @typeParam prefix_id: string - Value to purchase invoice
 * @typeParam supplier: ISupplier - Value to purchase invoice
 * @typeParam supplier_id: string - Value to purchase invoice
 * @typeParam payment_type_name: string - Value to purchase invoice
 * @typeParam payment_type_id: string - Value to purchase invoice
 * @typeParam collection_days: string - Value to purchase invoice
 * @typeParam days_collection_type: string - Value to purchase invoice
 * @typeParam payment_method: string - Value to purchase invoice
 * @typeParam payment_method_id: string - Value to purchase invoice
 * @typeParam foreign_exchange_id: string - Value to purchase invoice
 * @typeParam foreign_exchange_name: string - Value to purchase invoice
 * @typeParam number_purchase_order: string - Value to purchase invoice
 * @typeParam sales_manager: string - Value to purchase invoice
 * @typeParam document_type_purchasing_manager: string - Value to purchase invoice
 * @typeParam document_type_purchasing_manager_id: string - Value to purchase invoice
 * @typeParam document_number_sales_manager: string - Value to purchase invoice
 * @typeParam note: string - Value to purchase invoice
 * @typeParam internal_notes: string - Value to purchase invoice
 * @typeParam foreign_exchange_rate: number - Value to purchase invoice
 * @typeParam is_paid: boolean - Value to purchase invoice
 * @typeParam document_uuid: string - Value to purchase invoice
 * @typeParam employee_id: string - Value to purchase invoice
 */
export interface IFormPurchaseInvoice {
    lang: string;
    logo: IGenericRecord;
    urlLogo: string;
    date: number;
    is_draft: boolean;
    time_issue: string;
    expiration_date: number;
    person_id: string;
    cufe: string;
    supplier_invoice_number: string;
    prefix: string;
    prefix_id: string;
    supplier: ISupplier;
    supplier_id: string;
    payment_type_name: string;
    payment_type_id: string;
    collection_days: string;
    days_collection_type: string;
    payment_method: string;
    payment_method_id: string;
    foreign_exchange_id: string;
    foreign_exchange_name: string;
    number_purchase_order: string;
    sales_manager: string;
    document_type_purchasing_manager: string;
    document_type_purchasing_manager_id: string;
    document_number_sales_manager: string;
    note: string;
    internal_notes: string;
    foreign_exchange_rate: number;
    is_paid: boolean;
    document_uuid: string;
    employee_id: string;
}

/**
 * This interface is supplier information
 * 
 * @typeParam id: string - Value to supplier
 * @typeParam name?: string - Value to supplier
 * @typeParam company_id: string - Value to supplier
 * @typeParam document_type: string - Value to supplier
 * @typeParam document_number: string - Value to supplier
 * @typeParam address: string - Value to supplier
 * @typeParam email: string - Value to supplier
 * @typeParam phone: string - Value to supplier
 * @typeParam fiscal_responsibilities: IFiscalResponsibility[] - Value to supplier
 * @typeParam cellphone: string - Value to supplier
 * @typeParam document_name: string - Value to supplier
 * @typeParam postal_code: string - Value to supplier
 * @typeParam country_id: number | null - Value to supplier
 * @typeParam country_name: string - Value to supplier
 * @typeParam department_id: number | null - Value to supplier
 * @typeParam department_name: string - Value to supplier
 * @typeParam city_id: number | null - Value to supplier
 * @typeParam city_name: string - Value to supplier
 * @typeParam type_taxpayer_id: string - Value to supplier
 * @typeParam type_taxpayer_name: string - Value to supplier
 * @typeParam indications_address: string - Value to supplier
 * @typeParam electronic_biller: boolean - Value to supplier
 */
export interface ISupplier {
    id: string;
    name?: string;
    company_id: string;
    document_type: string;
    document_number: string;
    address: string;
    email: string;
    phone: string;
    fiscal_responsibilities: IFiscalResponsibility[];
    cellphone: string;
    document_name: string;
    postal_code: string;
    country_id: number | null;
    country_name: string;
    department_id: number | null;
    department_name: string;
    city_id: number | null;
    city_name: string;
    type_taxpayer_id: string;
    type_taxpayer_name: string;
    indications_address: string;
    electronic_biller: boolean;
}

/**
 * This interface is fiscal responsibility
 * 
 * @typeParam id: number - Id responsibility
 * @typeParam name: string - Name responsibility
 * @typeParam code: string - Code responsibility
 * @typeParam meaning: string - Meaning responsibility
 * @typeParam tax_details: string - Tax details responsibility
 * @typeParam withholdings: IGenericRecord[] - Responsibility responsibility
 */
export interface IFiscalResponsibility {
    id: number;
    name: string;
    code: string;
    meaning: string;
    tax_details: string;
    withholdings: IGenericRecord[];
}

/**
 * This interface is create and edit purchase invoice
 * 
 * @typeParam products: IInvoiceDetails[] - Value to purchase invoice
 * @typeParam sending_charge: number - Value to purchase invoice
 * @typeParam total_discount: number - Value to purchase invoice
 * @typeParam total_invoice: number - Value to purchase invoice
 * @typeParam total_sale: number - Value to purchase invoice
 * @typeParam total_sale_value: number - Value to purchase invoice
 * @typeParam total_ibua: number - Value to purchase invoice
 * @typeParam total_icui: number - Value to purchase invoice
 * @typeParam total_impoconsumption: number - Value to purchase invoice
 * @typeParam total_iva: number - Value to purchase invoice
 * @typeParam total: number - Value to purchase invoice
 * @typeParam retefuente: number - Value to purchase invoice
 * @typeParam reteica: number - Value to purchase invoice
 * @typeParam reteiva: number - Value to purchase invoice
 */
export interface IPurchaseInvoice extends IFormPurchaseInvoice {
    products: IInvoiceDetails[];
    sending_charge: number;
    total_discount: number;
    total_invoice: number;
    total_sale: number;
    total_sale_value: number;
    total_ibua: number;
    total_icui: number;
    total_impoconsumption: number;
    total_iva: number;
    total: number;
    retefuente: number;
    reteica: number;
    reteiva: number;
}
