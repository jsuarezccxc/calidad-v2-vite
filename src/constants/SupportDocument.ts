import { IFieldsAssign, ISupportDocument, ISupportDocumentForm } from '@models/SupportDocument';
import { getDateFromUnix } from '@utils/Date';
import { IDataTableTotals } from '@components/table-totals';
import { IOptionsSupportForm } from '@components/support-document-and-buy';
import { INIT_STATE_OPTIONS } from '@constants/CorrectCancelElectronicDocument';
import { COLOMBIA, COLOMBIA_ID } from './Location';
import { typeInvoice as TypeInvoice } from './ElectronicInvoice';

/**
 * Titles from total table
 */
export const DATA_TABLE_TOTALS: IDataTableTotals[] = [
    {
        id: 'dp-electronic-invoice-cesi-total-sale',
        title: 'Subtotal',
        field: 'subtotal',
        disabled: true,
        value: 0,
        className: 'body__bg-green',
    },
    {
        id: 'dp-electronic-invoice-cesi-total-discount',
        title: 'Total descuento',
        field: 'total_discount',
        symbol: '-',
        disabled: true,
        value: 0,
        className: '',
    },
    {
        id: 'dp-electronic-invoice-cesi-shipping-cost',
        title: 'Costo de entrega',
        field: 'total_charge_amount',
        disabled: false,
        value: 0,
        className: '',
    },
    {
        id: 'dp-electronic-invoice-cesi-total-sale-value',
        title: 'Total bruto',
        field: 'total_gross',
        disabled: true,
        value: 0,
        className: 'body__bg-green',
    },
    {
        id: 'dp-electronic-invoice-cesi-total-iva',
        title: 'Total IVA',
        field: 'total_iva',
        disabled: true,
        value: 0,
        className: '',
    },
    {
        id: 'dp-electronic-invoice-cesi-retefuente',
        title: 'Total neto',
        field: 'total_payable',
        disabled: true,
        value: 0,
        className: 'body__bg-green',
    },
    {
        id: 'dp-electronic-invoice-cesi-retefuente',
        title: 'Retefuente',
        field: 'retefuente',
        symbol: '-',
        disabled: true,
        value: 0,
        className: '',
    },

    {
        id: 'dp-electronic-invoice-cesi-reteica',
        title: 'Reteica',
        field: 'reteica',
        symbol: '-',
        disabled: true,
        value: 0,
        className: '',
    },
    {
        id: 'dp-electronic-invoice-cesi-reteiva',
        title: 'Reteiva',
        field: 'reteiva',
        symbol: '-',
        disabled: true,
        value: 0,
        className: '',
    },
    {
        id: 'dp-electronic-invoice-cesi-total',
        title: 'Total',
        field: 'total',
        disabled: true,
        value: 0,
        className: 'body__bg-green',
    },
];

/**
 * This const is for state support document form
 */
export const INIT_SUPPORT_DOCUMENT: ISupportDocumentForm = {
    add_warehouse: false,
    address: '',
    aggregation_method: TypeInvoice.ELECTRONICS,
    apply_deductible: false,
    apply_electronic_invoice: true,
    city_id: '',
    city_name: '',
    client_id: '',
    company_address: '',
    country_id: String(COLOMBIA_ID),
    country_name: COLOMBIA,
    customer_id: '',
    date: getDateFromUnix().formatYearMonthDay || '',
    date_limit: getDateFromUnix().formatYearMonthDay || '',
    days_collection: '',
    days_collection_type: '',
    department_id: '',
    department_name: '',
    document_number_purchasing_manager: '',
    document_number_sales_manager: '',
    document_number: '',
    document_type_purchasing_manager: '',
    document_name_purchasing_manager: '',
    document_type_sales_manager: '',
    document_type: '',
    document_name: '',
    electronic_billing: true,
    email: '',
    foreign_exchange_id: '',
    foreign_exchange_name: '',
    foreign_exchange_rate: 0,
    invoice_state: 'ACCEPTED',
    invoice_type: 'SUPPORTING_DOCUMENT',
    is_electronic_invoice: true,
    is_paid: true,
    loaded_inventory: false,
    name: '',
    note: '',
    number_max: 2000,
    number_purchase_order: '',
    number: '',
    payment_method_id: '',
    payment_method_name: '',
    payment_type_id: '',
    payment_type_name: '',
    person_id: '', //If it already exists
    phone: '',
    postal_code: '',
    prefix_id: '', //Required when  apply_electronic_invoice == true
    prefix_name: '',
    product_classification: '',
    purchasing_manager: '',
    sale_channel: 'PHYSICAL_STORE',
    sales_manager: '',
    send_address: '',
    source_type: 'CUSTOMERS',
    tax_details_code: '',
    tax_details_name: '',
    time_issue: '',
    type_taxpayer_id: '',
    type_taxpayer_name: '',
    warehouse_id: '',
    warehouseInput: {
        id: '',
        value: '',
    },
    fiscal_responsibilities: [],
    invoice_number_supplier: '',
    company_postal_code: '',
    internal_notes: '',
};

/**
 * This const is create support document
 */
export const SUPPORT_DOCUMENT: ISupportDocument = {
    ...INIT_SUPPORT_DOCUMENT,
    lang: 'es',
    taxes: [],
    withholdings: [],
    base_retefuente: 0,
    base_reteiva: 0,
    products: [],
    retefuente: 0,
    reteiva: 0,
    sending_charge: 0,
    total: 0,
    total_discount: 0,
    total_impoconsumption: 0,
    total_invoice: 0,
    total_iva: 0,
    total_sale: 0,
    total_sale_value: 0,
};

/**
 * This const support options
 */
export const INIT_SUPPORT_OPTIONS: IOptionsSupportForm = {
    ...INIT_STATE_OPTIONS,
    suppliers: [],
};

/**
 * This const is key assign supplier
 */
export const KEYS_ASSIGN_SUPPLIER: IFieldsAssign = {
    tree: {
        person: [
            { keyOrigin: 'email' },
            { keyOrigin: 'address' },
            { keyOrigin: 'country_id' },
            { keyOrigin: 'country_name' },
            { keyOrigin: 'document_type' },
            { keyOrigin: 'department_id' },
            { keyOrigin: 'department_name' },
            { keyOrigin: 'type_taxpayer_id' },
            { keyOrigin: 'type_taxpayer_name' },
            { keyOrigin: 'city_id' },
            { keyOrigin: 'city_name' },
            { keyOrigin: 'postal_code' },
            { keyOrigin: 'phone' },
            { keyOrigin: 'fiscal_responsibilities' },
            { keyOrigin: 'document_name' },
        ],
    },
    base: [{ keyOrigin: 'document_number' }, { keyOrigin: 'tax_details_code' }, { keyOrigin: 'tax_details_name' }, { keyOrigin: 'name' }],
};

/**
 * This enum support field names
 */
export enum SupportingDocumentFieldNames {
    NAME = 'name',
    PREFIX_ID = 'prefix_id',
    SUPPLIER = 'supplier',
    PAYMENT_TYPE_ID = 'payment_type_id',
    DOCUMENT_NAME = 'document_name',
    PAYMENT_METHOD_ID = 'payment_method_id',
    DAYS_COLLECTION = 'days_collection',
    FOREIGN_EXCHANGE_ID = 'foreign_exchange_id',
    PURCHASING_MANAGER = 'purchasing_manager',
    TYPE_TAXPAYER_NAME = 'type_taxpayer_name',
    DAYS_COLLECTION_TYPE = 'days_collection_type',
    FOREIGN_EXCHANGE_RATE = 'foreign_exchange_rate',
    INVOICE_NUMBER_SUPPLIER = 'invoice_number_supplier',
    DOCUMENT_TYPE_PURCHASING_MANAGER = 'document_type_purchasing_manager',
    DOCUMENT_NUMBER_PURCHASING_MANAGER = 'document_number_purchasing_manager',
}

/**
 * This const colombia peso
 */
export const COLOMBIAN_PESO = 'Peso colombiano';

export const KEYS_ASSIGN_DRAFT: IFieldsAssign = {
    tree: {
        person: [
            ...KEYS_ASSIGN_SUPPLIER.tree.person,
            { keyOrigin: 'document_number' },
            { keyOrigin: 'document_type_name', keyValue: 'document_name' },
            {
                keyOrigin: 'supplier',
                skip: true,
                children: {
                    tree: {
                        supplier: [
                            { keyOrigin: 'name' },
                            { keyOrigin: 'tax_details_code' },
                            { keyOrigin: 'tax_details_name' },
                        ],
                    },
                },
            },
        ],
        consecutive: [
            { keyOrigin: 'name', keyValue: 'prefix_name' },
            { keyOrigin: 'prefix_id' },
        ],
    },
    base: [
        { keyOrigin: 'payment_type_id' },
        { keyOrigin: 'payment_type_name' },
        { keyOrigin: 'payment_method_id' },
        { keyOrigin: 'payment_method_name' },
        { keyOrigin: 'note' },
        { keyOrigin: 'withholdings' },
        { keyOrigin: 'sending_charge' },
        { keyOrigin: 'internal_notes' },
        { keyOrigin: 'days_collection' },
        { keyOrigin: 'purchasing_manager' },
        { keyOrigin: 'foreign_exchange_id' },
        { keyOrigin: 'days_collection_type' },
        { keyOrigin: 'foreign_exchange_name' },
        { keyOrigin: 'foreign_exchange_rate' },
        { keyOrigin: 'number_purchase_order' },
        { keyOrigin: 'invoice_number_supplier' },
        { keyOrigin: 'document_number_purchasing_manager' },
        { keyOrigin: 'products', keyValue: 'invoice_details' },
        { keyOrigin: 'document_type_purchasing_manager', keyValue: 'document_type_purchasing_manager' },
        { keyOrigin: 'document_type_name_purchasing_manager', keyValue: 'document_name_purchasing_manager' },
        { keyOrigin: 'company_postal_code' },
        { keyOrigin: 'company_address' },
        { keyOrigin: 'send_address' },
        { keyOrigin: 'person_id' },
    ],
};
