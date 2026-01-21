import { IFiscal } from './Company';
import { IInvoiceDetails, ITableTaxesAndRetention } from './ElectronicInvoice';

/**
 * This interface keys by data for assign
 *
 * @typeParam keyOrigin: string - Key by data
 * @typeParam keyValue?: string - New key assign
 * @typeParam skip?: boolean - Skip key
 * @typeParam children?: IFieldsAssign - Children in nested data
 */
export interface IKeysAssign {
    keyOrigin: string;
    keyValue?: string;
    skip?: boolean;
    children?: IFieldsAssign;
}

/**
 * This interface describe structure keys
 *
 * @typeParam [key:string]: IKeysAssign[] - Any key
 */
export interface ITreeAssign {
    [key: string]: IKeysAssign[];
}

/**
 * This interface describe structure data
 *
 * @typeParam tree: ITreeAssign - Nested data
 * @typeParam base?: IKeysAssign[] - Base keys data
 */
export interface IFieldsAssign {
    tree: ITreeAssign;
    base?: IKeysAssign[];
}

/**
 * This interface is support document
 * 
 * @typeParam add_warehouse: boolean - Prop for create support document
 * @typeParam address: string - Prop for create support document
 * @typeParam aggregation_method: string - Prop for create support document
 * @typeParam apply_deductible: boolean - Prop for create support document
 * @typeParam apply_electronic_invoice: boolean - Prop for create support document
 * @typeParam city_id: string - Prop for create support document
 * @typeParam city_name: string - Prop for create support document
 * @typeParam client_id: string - Prop for create support document
 * @typeParam company_address: string - Prop for create support document
 * @typeParam country_id: string - Prop for create support document
 * @typeParam country_name: string - Prop for create support document
 * @typeParam customer_id: string - Prop for create support document
 * @typeParam company_postal_code: string - Prop for create support document
 * @typeParam date_limit: string - Prop for create support document
 * @typeParam date: string - Prop for create support document
 * @typeParam days_collection: string - Prop for create support document
 * @typeParam days_collection_type: string - Prop for create support document
 * @typeParam department_id: string - Prop for create support document
 * @typeParam department_name: string - Prop for create support document
 * @typeParam document_number_purchasing_manager: string - Prop for create support document
 * @typeParam document_number_sales_manager: string - Prop for create support document
 * @typeParam document_number: string - Prop for create support document
 * @typeParam document_type_purchasing_manager: string - Prop for create support document
 * @typeParam document_name_purchasing_manager: string - Prop for create support document
 * @typeParam document_type_sales_manager: string - Prop for create support document
 * @typeParam document_type: string - Prop for create support document
 * @typeParam document_name: string - Prop for create support document
 * @typeParam electronic_billing: boolean - Prop for create support document
 * @typeParam email: string - Prop for create support document
 * @typeParam foreign_exchange_id: string - Prop for create support document
 * @typeParam foreign_exchange_name: string - Prop for create support document
 * @typeParam foreign_exchange_rate: number - Prop for create support document
 * @typeParam invoice_state: string - Prop for create support document
 * @typeParam invoice_type: string - Prop for create support document
 * @typeParam is_electronic_invoice: boolean - Prop for create support document
 * @typeParam is_paid: boolean - Prop for create support document
 * @typeParam loaded_inventory: boolean - Prop for create support document
 * @typeParam name: string - Prop for create support document
 * @typeParam note: string - Prop for create support document
 * @typeParam number_max: number - Prop for create support document
 * @typeParam number_purchase_order: string - Prop for create support document
 * @typeParam number: string - Prop for create support document
 * @typeParam payment_method_id: string - Prop for create support document
 * @typeParam payment_method_name: string - Prop for create support document
 * @typeParam payment_type_id: string - Prop for create support document
 * @typeParam payment_type_name: string - Prop for create support document
 * @typeParam person_id: string - Prop for create support document
 * @typeParam phone: string - Prop for create support document
 * @typeParam postal_code: string - Prop for create support document
 * @typeParam prefix_name: string - Prop for create support document
 * @typeParam prefix_id: string - Prop for create support document
 * @typeParam product_classification: string - Prop for create support document
 * @typeParam purchasing_manager: string - Prop for create support document
 * @typeParam sale_channel: string - Prop for create support document
 * @typeParam sales_manager: string - Prop for create support document
 * @typeParam send_address: string - Prop for create support document
 * @typeParam source_type: string - Prop for create support document
 * @typeParam tax_details_code: string - Prop for create support document
 * @typeParam tax_details_name: string - Prop for create support document
 * @typeParam time_issue: string - Prop for create support document
 * @typeParam type_taxpayer_id: string - Prop for create support document
 * @typeParam type_taxpayer_name: string - Prop for create support document
 * @typeParam warehouse_id: string - Prop for create support document
 * @typeParam warehouseInput: WarehouseInput - Prop for create support document
 * @typeParam fiscal_responsibilities: IFiscal[] - Prop for create support document
 * @typeParam invoice_number_supplier: string - Prop for create support document
 * @typeParam internal_notes: string - Prop for create support document
 */
export interface ISupportDocumentForm {
    add_warehouse: boolean;
    address: string;
    aggregation_method: string;
    apply_deductible: boolean;
    apply_electronic_invoice: boolean;
    city_id: string;
    city_name: string;
    client_id: string;
    company_address: string;
    country_id: string;
    country_name: string;
    customer_id: string;
    company_postal_code: string;
    date_limit: string;
    date: string;
    days_collection: string;
    days_collection_type: string;
    department_id: string;
    department_name: string;
    document_number_purchasing_manager: string;
    document_number_sales_manager: string;
    document_number: string;
    document_type_purchasing_manager: string;
    document_name_purchasing_manager: string;
    document_type_sales_manager: string;
    document_type: string;
    document_name: string;
    electronic_billing: boolean;
    email: string;
    foreign_exchange_id: string;
    foreign_exchange_name: string;
    foreign_exchange_rate: number;
    invoice_state: string;
    invoice_type: string;
    is_electronic_invoice: boolean;
    is_paid: boolean;
    loaded_inventory: boolean;
    name: string;
    note: string;
    number_max: number;
    number_purchase_order: string;
    number: string;
    payment_method_id: string;
    payment_method_name: string;
    payment_type_id: string;
    payment_type_name: string;
    person_id: string;
    phone: string;
    postal_code: string;
    prefix_name: string;
    prefix_id: string;
    product_classification: string;
    purchasing_manager: string;
    sale_channel: string;
    sales_manager: string;
    send_address: string;
    source_type: string;
    tax_details_code: string;
    tax_details_name: string;
    time_issue: string;
    type_taxpayer_id: string;
    type_taxpayer_name: string;
    warehouse_id: string;
    warehouseInput: WarehouseInput;
    fiscal_responsibilities: IFiscal[];
    invoice_number_supplier: string;
    internal_notes: string;
}

/**
 * This interface is warehouse input
 * 
 * @typeParam id: string - ID
 * @typeParam value: string - Warehouse name 
 */
export interface WarehouseInput {
    id: string;
    value: string;
}

/**
 * This interface is totals support
 * 
 * @typeParam lang: string: string - Language document
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
export interface ISupportDocument extends ISupportDocumentForm {
    lang: string;
    base_retefuente: number;
    base_reteica?: number;
    base_reteiva: number;
    products: IInvoiceDetails[];
    taxes: ITableTaxesAndRetention[];
    withholdings: ITableTaxesAndRetention[];
    sending_charge: number;
    retefuente: number;
    reteica?: number;
    reteiva: number;
    total_discount: number;
    total_impoconsumption: number;
    total_invoice: number;
    total_iva: number;
    total_sale_value: number;
    total_sale: number;
    total: number;
}
