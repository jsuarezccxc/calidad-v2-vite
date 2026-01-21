import React, { Dispatch, SetStateAction } from 'react';
import { v4 as uuid } from 'uuid';
import { COLOMBIA, COLOMBIA_ID } from '@constants/Location';
import { IGenericRecord } from '@models/GenericRecord';
import { getTimeIssue } from '@components/electronic-note';
import { IHeaderTable } from '@components/table';
import { ISelectedNote } from '@models/ElectronicInvoice';
import { stringToFloat } from '@utils/ElectronicInvoice';
import { currentDateInUnix, getDateFromUnix } from '@utils/Date';

export * from './PurchaseNote';

/**
 * This interface describes that properties the component 'PurchaseNote' receives.
 *
 * @typeParam invoiceSelected: ISelectedNote - Prop with info for selected Invoice
 * @typeParam setInvoice: Dispatch<SetStateAction<ISelectedNote>> - Prop with set action for selected Invoice
 * @typeParam typeNote: string - Prop with type note "credit or debit"
 * @typeParam isEdit: boolean - Prop with type create or edit
 */
export interface IPurchaseNoteProps {
    invoiceSelected: ISelectedNote;
    setInvoice: Dispatch<SetStateAction<ISelectedNote>>;
    typeNote: string;
    isEdit: boolean;
}

/**
 * This interface describes that properties the component 'TableNoteSupplier' receives.
 *
 * @typeParam productsInvoice: IGenericRecord[] - Prop with products of invoice
 * @typeParam is_annulled: boolean - Prop with is annulled  credit note
 * @typeParam productsNote: IGenericRecord[] - Prop with products of this note
 * @typeParam setProductsNote: React.Dispatch<React.SetStateAction<IGenericRecord[]>> - Prop with set action of products of this note
 * @typeParam totals: IGenericRecord - Prop to manage totals
 * @typeParam checkSelect: IGenericRecord[] - Prop with check products of this note
 * @typeParam setCheckSelect:React.Dispatch<React.SetStateAction<IGenericRecord[]>>; - Prop with set action of check products of this note
 * @typeParam showTrashModal: boolean - Prop of open the trash modal
 * @typeParam setShowTrashModal: React.Dispatch<React.SetStateAction<boolean>> - Prop of set action for open the trash modal
 * @typeParam validate: () => boolean - Prop to validate  empty fields, discount validation and credit validation
 * @typeParam emptyFieldsError: () => boolean - Prop to show error for empty fields
 * @typeParam discountError: () => boolean - Prop to show error for discount
 * @typeParam quantityError: () => boolean - Prop to show error for credit quantity
 * @typeParam isCredit: () => boolean - Prop to show note is credit o not
 */
export interface ITableNotePurchaseProps {
    productsInvoice: IGenericRecord[];
    is_annulled: boolean;
    productsNote: IGenericRecord[];
    setProductsNote: React.Dispatch<React.SetStateAction<IGenericRecord[]>>;
    totals: IGenericRecord;
    setCheckSelect: React.Dispatch<React.SetStateAction<IGenericRecord[]>>;
    checkSelect: IGenericRecord[];
    setShowTrashModal: React.Dispatch<React.SetStateAction<boolean>>;
    showTrashModal: boolean;
    validate: boolean;
    emptyFieldsError: boolean;
    discountError: boolean;
    quantityError: IGenericRecord;
    isCredit: boolean;
}
/**
 * Const to set Debit type on Note
 */
export const DEBIT = 'Nota débito';

/**
 * Const to set Credit type on Note
 */
export const CREDIT = 'Nota crédito';

/**
 * Const to manage required values into invoice
 */
export const FIELDS_REQUIRED = {
    prefix_note: false,
    prefix: false,
    prefix_id: false,
    number: false,
    foreign_exchange_id: false,
    foreign_exchange_rate: false,
    name: false,
    document_name: false,
    document_number: false,
    email: false,
    address: false,
    country_id: false,
    country_name: false,
    department_id: false,
    department_name: false,
    city_id: false,
    city_name: false,
    postal_code: false,
    phone: false,
    payment_type_id: false,
    payment_method_id: false,
    days_payment: false,
    type_taxpayer_name: false,
    fiscal_responsibilities: false,
    taxes_details: false,
    number_purchase_order: false,
};

/**
 * Const to manage invoice initial values
 */
export const INITIAL_VALUES = {
    cufe: '',
    prefix: '',
    prefix_id: '',
    number: '',
    foreign_exchange_id: '',
    foreign_exchange_name: '',
    foreign_exchange_rate: '',
    date: currentDateInUnix(),
    date_limit: 0,
    time_issue: '',
    number_purchase_order: '',
    sales_manager: '',
    document_type_sales_manager: '',
    document_number_sales_manager: '',
    purchasing_manager: '',
    document_type_purchasing_manager: '',
    document_number_purchasing_manager: '',
    days_payment: '',
    payment_method_id: '',
    payment_type_id: '',
    payment_type_name: '',
    type_taxpayer_name: '',
    taxes_details: '',
    note: '',
    is_paid: true,
    total_sale: 1,
    total_discount: 1,
    sending_charge: 1,
    total_sale_value: 1,
    total_iva: 1,
    retefuente: 0,
    reteica: 0,
    reteiva: 0,
    total: 1,
    total_impoconsumption: 0,
    total_invoice: 0,
    supplier: {
        id: '',
        name: '',
        address: '',
        document_name: '',
        document_type: '',
        document_number: '',
        person_id: '',
        email: '',
        phone: '',
        country_id: '',
        country_name: '',
        department_id: '',
        department_name: '',
        city_id: 0,
        city_name: '',
        postal_code: '',
        fiscal_responsibilities: [{ id_fiscal: uuid(), id: '', name: '' }],
        type_taxpayer_id: 0,
        type_taxpayer_name: '',
    },
};

/**
 * Dynamic data for queries
 */
export const dynamicData = [
    'fiscal_responsibilities',
    'document_types',
    'countries',
    'departments',
    'cities',
    'ciius',
    'foreign_exchange',
    'payment_types',
    'tax_details',
    'payment_methods',
    'type_tax_payer',
    'unit_measurements',
];

/**
 * Const to manage supplier initial values
 */
export const SUPPLIER_VALUES = {
    id: '',
    name: '',
    email: '',
    person_id: '',
    document_name: '',
    document_number: '',
    address: '',
    country_id: COLOMBIA_ID,
    country_name: COLOMBIA,
    department_id: 0,
    department_name: '',
    city_id: 0,
    city_name: '',
    postal_code: '',
    phone: '',
    type_taxpayer_id: 0,
    type_taxpayer_name: '',
    fiscal_responsibilities: [{ id_fiscal: uuid(), id: '', name: '' }],
    tax_details_code: 0,
    tax_details_name: '',
};

/**
 * Data structure Header from table
 */
export const headersTable: IHeaderTable[] = [
    {
        title: 'No',
        className: 'header__w-no',
    },
    {
        title: '*SKU',
        wrapperClassName: 'without-padding',
        className: 'header__w-sku',
    },
    {
        title: '*Producto/Servicio',
        wrapperClassName: 'without-padding',
        className: 'header__w-product',
    },
    {
        title: '*Cantidad',
        wrapperClassName: 'without-padding',
        className: 'header__w-quantity',
    },
    {
        title: '*Costo unitario',
        wrapperClassName: 'without-padding',
        className: 'header__w-unit_const',
    },

    {
        title: 'Dto',
        wrapperClassName: 'without-padding',
        className: 'header__w-discount',
    },
    {
        title: '*IVA',
        wrapperClassName: 'without-padding',
        className: 'header__w-iva',
    },
    {
        title: '',
        wrapperClassName: 'without-padding w-12 xlg:w-15 border-none',
    },
];

/**
 * Data for inputs names in table
 */
export const nameInputsTable: IGenericRecord = {
    sku: 'product_sku',
    productName: 'unique_product_name',
    quantity: 'quantity',
    unitCost: 'unit_cost',
    discount: 'discount',
    iva: 'iva',
};

/**
 * This function describes New empty row for component "Table".
 *
 * @param Number: string - Prop with last number for add in the table
 * @returns IGenericRecord - Empty row for Table
 */
export const newEmpty = (Number: string): IGenericRecord => ({
    key: uuid(),
    id: uuid(),
    No: Number,
    product_id: '',
    product_sku: '',
    unique_product_name: '',
    quantity: '',
    unit_cost: '',
    discount: '',
    iva: '',
    isNewProduct: false,
});

/**
 *
 * This const is for default value or non error value for quantity validation
 *
 */
export const NO_QUANTITY_ERROR = { flag: false, name_product: '', max_quantity: 0 };

/**
 *
 * This const contain de array with the names of fields required in the component "Table"
 *
 */
export const REQUEST_FIELDS = ['product_sku', 'unique_product_name', 'product_reference', 'quantity', 'unit_cost', 'iva'];

/**
 * 
This interface describes the properties of the purchase invoice products - vendor products.
 *
 */
export interface IProductSupplier {
    id: string;
    invoice_id: string;
    discount: number;
    created_at?: string;
    is_inventoriable?: boolean;
    is_product?: boolean;
    iva?: string;
    pending_quantity?: number;
    quantity: number;
    sale: number;
    sku_internal: string;
    total_buy: number;
    unique_product_name: string;
    unique_products_id: string;
    unit_cost: number;
    unit_measurement_name: string;
    unit_measurements_id: string;
    unit_value: number;
    updated_at?: string;
}

/**
 * This interface describes properties for totals.
 *
 * @typeParam totalIva: number - Prop to manage total iva
 * @typeParam totalProducts: number - Prop to manage total products
 * @typeParam totalFinal: number - Prop to manage final total
 * @typeParam totalDiscount: number - Prop to manage total discount
 */
export interface ITotalProps {
    totalIva: number;
    totalProducts: number;
    totalFinal: number;
    totalDiscount: number;
}

/**
 * This interface describes that properties the component 'TableProduct' receives.
 *
 * @typeParam products: boolean - Prop with products
 * @typeParam totals: IGenericRecord - Prop to manage totals
 * @typeParam setProducts: (e: IProducts[]) => void - Prop to manage products
 * @typeParam addNewProduct: () => void - Prop add a new product
 * @typeParam validateProducts: () => Boolean - Prop to validate empty products
 */
export interface ITableNoteProps {
    products: IProductSupplier[];
    totals: IGenericRecord;
    setProducts: (e: IProductSupplier[]) => void;
    addNewProduct: () => void;
    validateProducts: () => boolean;
}

/**
 *
 * This const contain de array with the names of fields disabled in the component "FormInvoicePurchase"
 *
 */
export const fieldsDisabled = [
    'associated_invoice_number',
    'associated_issuance_date',
    'associated_issuance_time',
    'foreign_exchange_id',
    'supplier_name',
    'supplier_document_name',
    'supplier_document_number',
    'supplier_email',
    'supplier_address',
    'supplier_country_id',
    'supplier_country_name',
    'supplier_department_id',
    'supplier_department_name',
    'supplier_city_name',
    'supplier_city_id',
    'supplier_postal_code',
    'supplier_phone',
    'supplier_type_taxpayer_name',
    'taxes_details',
    'type_taxpayer_name',
];

/**
 *
 * This const contain de array with the names of fields disabled in the component "FormInvoicePurchase"
 *
 */
export const allFieldsDisabled = [
    'cude',
    'number',
    'associated_issuance_date',
    'prefix_note',
    'prefix_co',
    'number',
    'foreign_exchange_id',
    'foreign_exchange_rate',
    'date',
    'date_limit',
    'number_purchase_order',
    'sales_manager',
    'document_type_sales_manager',
    'document_number_sales_manager',
    'name',
    'document_name',
    'email',
    'address',
    'country_id',
    'country_name',
    'department_id',
    'city_id',
    'department_name',
    'city_name',
    'postal_code',
    'phone',
    'purchasing_manager',
    'payment_type_id',
    'document_type_purchasing_manager',
    'document_number_purchasing_manager',
    'payment_type_id',
    'days_payment',
    'payment_method_id',
    'type_taxpayer_name',
    'taxes_details',
    'note',
    'fiscal_responsibility',
    'associated_invoice_number',
    'associated_issuance_date',
    'associated_issuance_time',
    'foreign_exchange_id',
    'supplier_name',
    'supplier_document_name',
    'supplier_document_number',
    'supplier_email',
    'supplier_address',
    'supplier_country_id',
    'supplier_country_name',
    'supplier_department_id',
    'supplier_department_name',
    'supplier_city_name',
    'supplier_city_id',
    'supplier_postal_code',
    'supplier_phone',
    'supplier_type_taxpayer_name',
    'taxes_details',
    'type_taxpayer_name',
];

/**
 * This function describes formatting data fo sent to Endpoint structure.
 *
 * @param invoice: IGenericRecord - Invoice information
 * @param invoiceValue: IGenericRecord -  Note information
 * @param invoicePurchaseId: string -  Id for purchase invoice reference
 * @param productsNote: IGenericRecord[] -  Array of products of this note
 * @param totalsNote: IGenericRecord -  An object with totals for this note
 * @param typeNote: string - Type note
 * @param isEdit: boolean - Boolean with type create or edit note
 * @returns IGenericRecord - Data format for create Note Endpoint
 */
export const formatDataNote = (
    invoice: IGenericRecord,
    invoiceValue: IGenericRecord,
    invoicePurchaseId: string,
    productsNote: IGenericRecord[],
    totalsNote: IGenericRecord,
    typeNote: string,
    isEdit: boolean
): IGenericRecord => {
    return {
        cufe: '',
        is_annulled: invoiceValue.is_annulled,
        document_uuid: invoiceValue.cude,
        supplier_invoice_number: invoiceValue.prefix_note,
        person_id: invoiceValue.supplier.person_id,
        invoice_id: isEdit ? invoicePurchaseId : invoice.invoice_id,
        invoice_type: typeNote === DEBIT ? 'DEBIT_NOTE_SUPPLIER' : 'CREDIT_NOTE_SUPPLIER',
        invoice_state: 'ACCEPTED',
        prefix: invoiceValue.prefix_id,
        number: invoiceValue.number,
        foreign_exchange_id: invoiceValue.foreign_exchange_id,
        foreign_exchange_name: invoiceValue.foreign_exchange_name,
        date: getDateFromUnix(invoiceValue.date, 'YYYY-MM-DD').dateFormat,
        time_issue: getTimeIssue(invoiceValue.date),
        sales_manager: invoiceValue.sales_manager,
        document_type_sales_manager: '',
        document_number_sales_manager: '',
        name: invoiceValue.supplier.name,
        document_type: invoiceValue.supplier.document_type_id,
        document_number: invoiceValue.supplier.document_number,
        email: invoiceValue.supplier.email,
        address: invoiceValue.supplier.address,
        postal_code: invoiceValue.supplier.postal_code,
        country_id: invoiceValue.supplier.country_id,
        country_name: invoiceValue.supplier.country_name,
        department_id: invoiceValue.supplier.department_id,
        department_name: invoiceValue.supplier.department_name,
        city_id: invoiceValue.supplier.city_id,
        city_name: invoiceValue.supplier.city_name,
        company_postal_code: invoiceValue.supplier.postal_code,
        company_address: invoiceValue.supplier.address,
        phone: invoiceValue.supplier.phone,
        purchasing_manager: invoiceValue.purchasing_manager,
        document_type_purchasing_manager: '',
        document_number_purchasing_manager: '',
        payment_type_id: invoiceValue.payment_type_id,
        payment_type_name: invoiceValue.payment_type_name,
        days_collection: invoiceValue.days_payment,
        payment_method_id: invoiceValue.payment_method_id,
        type_taxpayer_id: invoiceValue.supplier.type_taxpayer_id,
        type_taxpayer_name: invoiceValue.supplier.type_taxpayer_name,
        tax_details_name: invoiceValue.taxes_details,
        note: invoiceValue.note,
        products: formatProductsNote(productsNote),
        total_sale: totalsNote.totalBuy,
        total_discount: totalsNote.totalDiscount,
        sending_charge: invoiceValue.sending_charge,
        send_address: invoiceValue.send_address,
        total_sale_value: 1,
        sale_channel: 'PHYSICAL_STORE',
        total_iva: totalsNote.totalTax,
        total_impoconsumption: 0.0,
        total: totalsNote.total,
        total_invoice: totalsNote.total,
        base_reteica: 0.0,
        base_reteiva: 0.0,
        base_retefuente: 0.0,
        retefuente: 0.0,
        reteiva: 0.0,
        reteica: 0.0,
        number_purchase_order: invoiceValue.number_purchase_order,
        electronic_billing: false,
        is_paid: true,
        is_electronic_invoice: false,
        apply_deductible: false,
        source_type: 'CUSTOMERS',
        aggregation_method: 'NO_ELECTRONICS',
        invoice_pdf_url: null,
        invoice_excel_url: null,
        pdf_url: null,
    };
};

/**
 * This function formatting products information for send to Endpoint structure.
 *
 * @param productsNote: IGenericRecord[] - Array of products of table note
 * @returns IGenericRecord[] - products format for endpoint structure
 */
export const formatProductsNote = (productsNote: IGenericRecord[]): IGenericRecord[] => {
    return productsNote.map((product: IGenericRecord) => {
        const iva = parseInt(product.iva);
        const ivaProduct = (iva / 100) * stringToFloat(product.unit_cost);
        const totalIva = ivaProduct * stringToFloat(product.quantity);
        return {
            warehouse_id: '',
            warehouse_name: '',
            unique_products_id: product.isNewProduct ? uuid() : product.product_id,
            unique_product_name: product.unique_product_name,
            batch_id: '',
            unit_measurements_id: product.isNewProduct ? null : product.unit_measurements_id,
            quantity: stringToFloat(product.quantity),
            unit_cost: stringToFloat(product.unit_cost),
            unit_value: 0,
            iva,
            iva_product: ivaProduct,
            total_iva: totalIva,
            discount: stringToFloat(product.discount) / stringToFloat(product.quantity),
            delivery_cost: 0,
            total_buy: stringToFloat(product.unit_cost) * stringToFloat(product.quantity),
            date_expiration: '',
            description: '',
            reference: '1',
            sku_internal: product.product_sku,
            ciiu_id: '',
            is_new: product.isNewProduct,
        };
    });
};

/**
 * Const for prefix
 */
export const INVOICE_PREFIX = { prefix: 'FC' };
