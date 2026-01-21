import { ITime } from '@utils/TimePicker';
import { IGenericRecord } from './GenericRecord';

/**
 * This interface describes properties for supplier into products.
 *
 * @typeParam id: string - Id supplier
 * @typeParam name: string - Name supplier
 * @typeParam address: string - Address supplier
 * @typeParam document_name: string - Document name supplier
 * @typeParam document_type: string - Document type supplier
 * @typeParam person_id: string - Email supplier
 * @typeParam document_number: string - Document number supplier
 * @typeParam email: string - Email supplier
 * @typeParam phone: string - Phone supplier
 * @typeParam country_id: number | string - Country id supplier
 * @typeParam country_name: string - Country name supplier
 * @typeParam department_id: number | string - Department id supplier
 * @typeParam department_name: string - department name supplier
 * @typeParam city_id: number - City id supplier
 * @typeParam city_name: string - City name supplier
 * @typeParam postal_code: string - Postal code supplier
 * @typeParam fiscal_responsibilities: IGenericRecord[] - Fiscal responsibilities supplier
 * @typeParam type_taxpayer_id: number - Type taxpayer id supplier
 * @typeParam type_taxpayer_name: string - Type taxpayer name supplier
 */
interface ISupplierProduct {
    id: string;
    name: string;
    address: string;
    document_type_id?: string;
    document_name: string;
    document_type: string;
    person_id: string;
    document_number: string;
    email: string;
    phone: string;
    country_id: number | string;
    country_name: string;
    department_id: number | string;
    department_name: string;
    city_id: number;
    city_name: string;
    postal_code: string;
    fiscal_responsibilities: IGenericRecord[];
    type_taxpayer_id: number;
    type_taxpayer_name: string;
}

/**
 * This interface describes properties for products
 *
 * @typeParam cufe: string - Cufe product
 * @typeParam cude: string - cude product
 * @typeParam is_annulled: boolean - Note is annulled
 * @typeParam prefix: string - Prefix product
 * @typeParam prefix_id: string - Prefix id product
 * @typeParam number: string - Optional number product
 * @typeParam supplier_invoice_number: string - Optional supplier invoice number
 * @typeParam foreign_exchange_id: string - Foreign exchange id product
 * @typeParam foreign_exchange_name: string - Foreign exchange name product
 * @typeParam foreign_exchange_rate: string - Foreign exchange rate product
 * @typeParam date: number - Date purchase order product
 * @typeParam time_issue: string - time purchase order product
 * @typeParam date_limit: string - Date limit product
 * @typeParam number_purchase_order: string - Number purchase order product
 * @typeParam sales_manager: string - Sales manager product
 * @typeParam document_type_sales_manager: string - Document type sales manager product
 * @typeParam document_number_sales_manager: string - Document number manager product
 * @typeParam purchasing_manager: string - Purchasing manager
 * @typeParam document_type_purchasing_manager: string - Document type purchasing manager product
 * @typeParam document_number_purchasing_manager: string - Document number purchasing manager product
 * @typeParam days_payment: string - Days payment product
 * @typeParam payment_method_id: string - Payment method id product
 * @typeParam payment_type_id: string - Payment type id product
 * @typeParam payment_type_name: string - Payment type name product
 * @typeParam type_taxpayer_name: string - Type taxpayer name product
 * @typeParam taxes_details: string - Taxes details product
 * @typeParam note: string - Note product
 * @typeParam is_paid: boolean - Paid product
 * @typeParam total_sale: number - Total sale product
 * @typeParam total_discount: number - Total discount product
 * @typeParam sending_charge: number - Sending charge product
 * @typeParam total_sale_value: number - Total sale value product
 * @typeParam total_iva: number - Total iva product
 * @typeParam retefuente: number - Retefuente product
 * @typeParam reteica: number - Reteica product
 * @typeParam reteiva: number - Reteiva product
 * @typeParam total: number - Total product
 * @typeParam total_impoconsumption: number - Total impoconsumption product
 * @typeParam total_invoice: number - Total invoice product
 * @typeParam supplier: ISupplierProduct - Prop with supplier values
 */
export interface IProductValues {
    cude?: string;
    cufe?: string;
    is_annulled?: boolean;
    associated_invoice_number?: string;
    associated_issuance_date?: number;
    associated_issuance_time?: number;
    hour_associated_issuance_time?: ITime;
    prefix_note?: string;
    prefix: string;
    prefix_id: string;
    number?: string;
    supplier_invoice_number?: string;
    foreign_exchange_id: string;
    foreign_exchange_name: string;
    foreign_exchange_rate?: string;
    date: number;
    time_issue: string;
    date_limit: number;
    number_purchase_order: string;
    sales_manager: string;
    document_type_sales_manager: string;
    document_number_sales_manager: string;
    purchasing_manager: string;
    document_type_purchasing_manager: string;
    document_number_purchasing_manager: string;
    days_payment: string;
    payment_method_id: string;
    payment_type_id: string;
    payment_type_name: string;
    type_taxpayer_name: string;
    taxes_details_id?: string;
    taxes_details: string;
    note: string;
    is_paid: boolean;
    send_address?: string;
    total_sale: number;
    total_discount: number;
    sending_charge: number;
    total_sale_value: number;
    total_iva: number;
    retefuente: number;
    reteica: number;
    reteiva: number;
    total: number;
    total_impoconsumption: number;
    total_invoice: number;
    supplier: ISupplierProduct;
}

/**
 * This interface describes properties for supplier invoices.
 *
 * @typeParam date: number - Prop for date of supplier invoice
 * @typeParam employee_id: string | undefined - Prop for employee id of supplier invoice
 * @typeParam id: string - Prop for id of supplier invoice
 * @typeParam number: string - Prop for number of supplier invoice
 * @typeParam person_id: string - Prop for person id of supplier invoice
 * @typeParam products: IInvoiceProps[] - Prop for products of supplier invoice
 * @typeParam supplier: string - Prop for supplier invoice
 * @typeParam total: number - Prop for total of supplier invoice
 * @typeParam total_discount: number - Prop for total discount of supplier invoice
 * @typeParam total_iva: number - Prop for total iva of supplier invoice
 * @typeParam total_sale: number - Prop for total sale of supplier invoice
 * @typeParam total_sale_value: number - Prop for total sale value of supplier invoice
 */
export interface ISupplierInvoice {
    date: number;
    employee_id: string | undefined;
    id: string;
    number: string;
    person_id: string;
    products: IInvoiceProps[];
    supplier: string;
    total: number;
    total_discount: number;
    total_iva: number;
    total_sale: number;
    total_sale_value: number;
}
/**
 * This interface describes properties for invoice.
 *
 * @typeParam id: string - Prop for id invoice
 * @typeParam unique_products_id: string - Prop for unique product id invoice
 * @typeParam unique_product_name: string - Prop for unique product name invoice
 * @typeParam quantity: number - Prop for quiantity invoice
 * @typeParam total_buy: number - Prop for product total buy invoice
 * @typeParam total_value_buy: number - Prop for total value buy invoice
 * @typeParam sku: string - Prop for sku invoice
 * @typeParam unit_cost: number - Prop for unit const invoice
 * @typeParam discount: number - Prop for discount invoice
 * @typeParam total_discount: number - Prop for total discount invoice
 * @typeParam discount_percentage: number - Prop for discount percentage invoice
 * @typeParam iva: number | null - Optional prop for iva invoice
 * @typeParam total_iva: number - Prop for total iva invoice
 * @typeParam product_id: string | null - Optional prop for product id invoice
 */
export interface IInvoiceProps {
    id: string;
    unique_products_id: string;
    unique_product_name: string;
    quantity: number;
    total_buy: number;
    total_value_buy: number;
    sku: string;
    unit_cost: number;
    discount: number;
    total_discount: number;
    discount_percentage: number;
    iva?: number | null;
    total_iva: number;
    product_id?: string | null;
}
