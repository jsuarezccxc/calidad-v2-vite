import { IFormPurchaseInvoiceNote, IMainFormNote } from '@models/PurchaseInvoiceNotes';
import { getDateFromUnix, getTodaysTime } from '@utils/Date';

/**
 * This constants is to type note in purchase invoice
 */
export const DEBIT_NOTE_SUPPLIER = 'DEBIT_NOTE_SUPPLIER';
export const CREDIT_NOTE_SUPPLIER = 'CREDIT_NOTE_SUPPLIER';

/**
 * This const is for purchase invoice notes
 */
export const NOTE_TYPE: Record<string, string> = {
    [DEBIT_NOTE_SUPPLIER]: 'nota débito',
    [CREDIT_NOTE_SUPPLIER]: 'nota crédito',
} as const;

/**
 * This enum is for purchase invoice notes
 */
export enum NotesPurchaseType {
    DebitNote = 'DEBIT_NOTE_SUPPLIER',
    CreditNote = 'CREDIT_NOTE_SUPPLIER',
}

/**
 * This enum is for inputs names in purchase invoice notes
 */
export enum NameInputs {
    DocumentUuid = 'document_uuid',
    Number = 'number',
    Prefix = 'prefix',
    Date = 'date',
    DateLimit = 'date_limit',
    InvoiceType = 'invoice_type',
    InvoiceId = 'invoice_id',
    ReasonRejectionId = 'reason_rejection_id',
}

/**
 * This const is for form purchase invoice notes
 */
export const FORM_PURCHASE_INVOICE_NOTE: IFormPurchaseInvoiceNote = {
    lang: 'es',
    date: getDateFromUnix().formatYearMonthDay || '',
    is_draft: false,
    time_issue: getTodaysTime(),
    date_limit: getDateFromUnix().formatYearMonthDay || '',
    collection_days: '',
    days_collection_type: '',
    document_number_sales_manager: null,
    document_type_purchasing_manager: null,
    document_type_purchasing_manager_name: null,
    document_uuid: '',
    employee_id: '',
    foreign_exchange_id: '',
    foreign_exchange_name: '',
    foreign_exchange_rate: 0,
    internal_notes: '',
    note: '',
    is_paid: true,
    number_purchase_order: '',
    payment_method_id: '',
    payment_method: '',
    payment_type_id: '',
    payment_type_name: '',
    person_id: '',
    prefix: '',
    number: '',
    prefix_id: null,
    sales_manager: null,
    supplier: {
        id: '',
        company_id: '',
        document_type: '',
        document_number: '',
        address: '',
        email: '',
        phone: '',
        fiscal_responsibilities: [],
        document_name: '',
        postal_code: '',
        country_id: null,
        country_name: '',
        department_id: null,
        department_name: '',
        city_id: null,
        city_name: '',
        type_taxpayer_id: '',
        type_taxpayer_name: '',
        indications_address: '',
        electronic_biller: false,
        cellphone: '',
        name: '',
    },
    supplier_id: '',
    supplier_invoice_number: '',
    purchasing_manager: '',
    document_number_purchasing_manager: '',
    invoice_state: 'ACCEPTED',
    sale_channel: '',
    is_electronic_invoice: false,
    apply_deductible: false,
    source_type: 'VENDORS',
};

/**
 * This const is for main form purchase invoice notes
 */
export const FORM_MAIN_PURCHASE_INVOICE_NOTE: IMainFormNote = {
    code_credit_note: null,
    code_debit_note: null,
    invoice_id: '',
    invoice_type: '',
    reason_rejection_description: '',
    reason_rejection_id: '',
};

/**
 * This const is for template purchase invoice notes
 */
export const PURCHASE_INVOICE_NOTE_TEMPLATE: Record<string, string> = {
    collection_days: 'days_collection',
    days_collection_type: 'days_collection_type',
    document_number_sales_manager: 'document_number_sales_manager',
    document_type_purchasing_manager: 'document_type_purchasing_manager',
    document_type_purchasing_manager_name: 'document_type_name_purchasing_manager',
    employee_id: 'no source',
    foreign_exchange_id: 'foreign_exchange_id',
    foreign_exchange_name: 'foreign_exchange_name',
    internal_notes: 'internal_notes',
    is_paid: 'is_paid',
    note: 'note',
    number_purchase_order: 'number_purchase_order',
    payment_method: 'payment_method_name',
    payment_method_id: 'payment_method_id',
    payment_type_id: 'payment_type_id',
    payment_type_name: 'payment_type_name',
    person_id: 'person_id',
    prefix_id: 'consecutive.prefix_id',
    sales_manager: 'sales_manager',
    supplier_id: 'person.supplier.id',
    supplier_invoice_number: 'supplier_invoice_number',
    purchasing_manager: 'purchasing_manager',
    document_number_purchasing_manager: 'document_number_purchasing_manager',
    foreign_exchange_rate: 'foreign_exchange_rate',
    invoice_state: 'invoice_state',
    sale_channel: 'sale_channel',
    is_electronic_invoice: 'is_electronic_invoice',
    apply_deductible: 'apply_deductible',
    source_type: 'source_type',
};

/**
 * This const is for template supplier in purchase invoice notes
 */
export const SUPPLIER_TEMPLATE: Record<string, string> = {
    id: 'id',
    company_id: 'company_id',
    document_type: 'document_type',
    document_number: 'document_number',
    address: 'address',
    email: 'email',
    phone: 'phone',
    fiscal_responsibilities: 'fiscal_responsibilities',
    document_name: 'document_type_name',
    postal_code: 'postal_code',
    country_id: 'country_id',
    country_name: 'country_name',
    department_id: 'department_id',
    department_name: 'department_name',
    city_id: 'city_id',
    city_name: 'city_name',
    type_taxpayer_id: 'type_taxpayer_id',
    type_taxpayer_name: 'type_taxpayer_name',
    indications_address: 'indications_address',
    electronic_biller: 'electronic_biller',
    cellphone: 'cellphone',
    name: 'supplier.name',
};

/**
 * Default values
 */
export const DEFAULT_MAIN_FORM: IMainFormNote = {
    code_credit_note: null,
    code_debit_note: null,
    invoice_id: '',
    invoice_type: '',
    reason_rejection_description: '',
    reason_rejection_id: '',
} as const;

/**
 * This enum is for modals in purchase invoice notes
 */
export enum Modals {
    Save = 'save',
    Delete = 'delete',
}

/**
 * This const is for state modals in purchase invoice notes
 */
export const STATE_MODALS = {
    [Modals.Delete]: false,
    [Modals.Save]: false,
};

/**
 * This enum is for maximum length of fields in purchase invoice notes
 */
export enum MaxLengthFields {
    Prefix = 4,
    Cude = 96,
}
