import { NumberFormatValues } from 'react-number-format';
import { IGenericRecord } from './GenericRecord';
import { ITaxesProductsStock } from './Inventory';
import { IStatusHistoryDocument } from './AdjustmentNote';

/**
 * This interface is for errors in table retention
 *
 * @typeParam messageFuente: string - Error message
 * @typeParam messageIca: string - Error message
 * @typeParam messageIva: string - Error message
 */
export interface IErrorsTableRetention {
    messageFuente: string;
    messageIca: string;
    messageIva: string;
}

/**
 * This interfaces is for param on change
 *
 * @typeParam name: string - Name input
 * @typeParam values: NumberFormatValues - Values input
 */
export interface IChangePercentageDiscount {
    name: string;
    values: NumberFormatValues;
}

/**
 * This interface is for taxes invoice
 *
 * @typeParam company_tax_id: string - Company tax id
 * @typeParam tax_name: string - Tax name
 * @typeParam tax_rate: number - Tax rate
 * @typeParam tax_value: number - Tax value
 * @typeParam total: number - Tax for sale
 */
export interface ITaxesTableInvoice {
    company_tax_id: string;
    tax_name: string;
    tax_rate: number;
    tax_value: number;
    total: number;
}

/**
 * This interface for props of table taxes and retention
 *
 * @typeParam name: string - Name tax or retention
 * @typeParam base: number - Input value
 * @typeParam percentage: number - Value percentage
 * @typeParam value: number - Value calculate
 * @typeParam isTax: boolean - Type tax or retention
 * @typeParam isLabel?: boolean - Optional prop if text or number
 * @typeParam label?: string - Optional prop name tax or retention type string
 * @typeParam isSelectInput: boolean - Optional prop if is select input
 * @typeParam disabled?: boolean - Optional prop disabled inputs
 * @typeParam className?: string - Optional prop custom
 * @typeParam omitElement?: boolean - Optional prop to omit element
 */
export interface ITableTaxesAndRetention {
    name: string;
    base: number;
    percentage: number;
    value: number;
    isTax: boolean;
    isLabel?: boolean;
    label?: string;
    isSelectInput: boolean;
    disabled?: boolean;
    className?: string;
    omitElement?: boolean;
}

/**
 * This interface is calculate invoice
 *
 * @typeParam withholdings: ITableTaxesAndRetention[] - Withholdings table
 * @typeParam sending_charge: number - Sending charge
 * @typeParam products: IInvoiceDetails[] - Invoice details
 */
export interface ICalculateInvoice {
    withholdings: ITableTaxesAndRetention[];
    sending_charge: number;
    products: IGenericRecord[];
}

/**
 * This type is to omit taxes from the table
 */
export type KeysInvoiceCalculates = Omit<IInvoiceCalculates, 'total_taxes_iva' | 'total_taxes'>;

/**
 * This interface is for total table
 *
 * @typeParam subtotal: number - Subtotal invoice
 * @typeParam total_discount: number - Total discount
 * @typeParam total_charge_amount: number - Total charge amount
 * @typeParam total_gross: number - Total gross
 * @typeParam total_iva: number - Total IVA
 * @typeParam total_inc: number - Total INC
 * @typeParam total_ibua: number - Total IBUA
 * @typeParam total_icui: number - Total ICUI
 * @typeParam retefuente: number - ReteFuente
 * @typeParam reteica: number - ReteICA
 * @typeParam reteiva: number - ReteIVA
 * @typeParam total_payable: number - Total payable
 * @typeParam total_taxes_iva: ITotalTaxesIva - Total taxes for IVA
 * @typeParam total_taxes: ITotalTaxes - Total taxes
 * @typeParam total: number - Total Invoice
 */
export interface IInvoiceCalculates {
    subtotal: number;
    total_discount: number;
    total_charge_amount: number;
    total_gross: number;
    total_iva: number;
    total_inc: number;
    total_ibua: number;
    total_icui: number;
    retefuente: number;
    reteica: number;
    reteiva: number;
    total_payable: number;
    total_taxes_iva: ITotalTaxesIva;
    total_taxes: ITotalTaxes;
    total: number;
}

/**
 * This interface is for taxes table
 *
 * @typeParam [key]: number - The situation of IVA totals
 */
export interface ITotalTaxesIva {
    '01': number;
    '02': number;
    '03': number;
    '04': number;
    '05': number;
}

/**
 * This interface is total taxes
 *
 * @typeParam [key]: number - The situation of taxes totals
 */
export interface ITotalTaxes {
    IVA_19: number;
    IVA_16: number;
    IVA_8: number;
    IVA_5: number;
    IVA_0?: number;
    IVA_EXCLUIDO?: number;
    INC_16: number;
    INC_8: number;
    INC_4: number;
    INC_2: number;
    INC_0?: number;
    IBUA: number;
    ICUI: number;
}

/**
 * This interfaces is calculate invoice details
 *
 * @typeParam totalBuy: number - Total buy (quantity * unit_cost - discount)
 * @typeParam totalIVA: number - Total IVA (total_buy * tax_rate / 100)
 */
export interface ITotalInvoiceDetails {
    totalBuy: number;
    totalIVA: number;
}

/**
 * This type is documents electronics
 */
type DocumentType = 'INVOICE' | 'DEBIT_NOTE' | 'CREDIT_NOTE' | 'SUPPORTING_DOCUMENT' | 'ADJUSTMENT_NOTE';

/**
 * This interface is information document
 *
 * @typeParam documentType: DocumentType - Document type
 * @typeParam isElectronicDocument?: boolean - If is electronic document
 * @typeParam prefixId?: string - Prefix id
 */
export interface IInformationDocument {
    documentType: DocumentType;
    isElectronicDocument?: boolean;
    prefixId?: string;
}

/**
 * This interface is taxes products
 *
 * @typeParam company_tax_id: string - Company tax id
 * @typeParam tax_value: number - Tax value
 */
export interface ITaxes {
    company_tax_id: string;
    tax_value: number;
}

/**
 * This interface is products
 *
 * @typeParam warehouse: string - Warehouse name
 * @typeParam batch: string - Batch name
 * @typeParam date_expiration: number - Date expiration product
 */
export interface ITextFields {
    warehouse: string;
    batch: string;
    date_expiration: number;
}

/**
 * This interface is invoice details
 *
 * @typeParam product_taxes: ITaxesProductsStock[] - Product taxes
 * @typeParam total_buy: number - Total buy (quantity * unit_cost - discount)
 * @typeParam batch_detail_id: string | null - Batch detail id
 * @typeParam batch_id: string | null - Batch id
 * @typeParam batch_number: string | null - Batch number
 * @typeParam ciiu_id: string | null - Ciiu id
 * @typeParam delivery_cost: number | null - Delivery cost
 * @typeParam description: string - Description
 * @typeParam discount: number - Discount product
 * @typeParam id: string - Id invoice details
 * @typeParam is_product: boolean - If is product or service
 * @typeParam is_inventoriable: boolean - If is product inventoriable
 * @typeParam quantity: number - Quantity
 * @typeParam reference: string - Reference
 * @typeParam sale: number - Sale
 * @typeParam sku_internal: string - SKU product
 * @typeParam unique_product_name: string - Unique product name
 * @typeParam unique_products_id: string - Unique product id
 * @typeParam unit_cost: number - Unit cost
 * @typeParam unit_measurement_name: string - Unit measurement
 * @typeParam unit_measurements_id: string - Unit measurement id
 * @typeParam unit_value: number - Unit value
 * @typeParam warehouse_id: string | null - Warehouse id
 * @typeParam warehouse_name: string | null - Warehouse
 * @typeParam mandate_id: string | null - Mandate id
 * @typeParam mandate: IGenericRecord | null - Mandate information
 * @typeParam unit_measure_milliliters: number | null - Unit measure milliliters IBUA
 * @typeParam taxes: ITaxes[] - Taxes product
 * @typeParam number: string - Number detail
 * @typeParam date_expiration: string | null - Date expiration product
 * @typeParam impoconsumption: string | null - Impoconsumption
 * @typeParam iva: string | null - Iva
 * @typeParam text_fields: ITextFields | null - Text fields
 * @typeParam new_product: boolean - If is new product
 * @typeParam percentage_discount: number - Percentage discount
 * @typeParam is_mandate: boolean - If is mandate product
 * @typeParam quantity_max: number - Quantity max
 * @typeParam checked: boolean - Checked
 */
export interface IInvoiceDetails {
    batch_detail_id: string | null;
    batch_id: string | null;
    batch_number: string | null;
    ciiu_id: string | null;
    delivery_cost: number | null;
    description: string;
    discount: number;
    id: string;
    is_product: boolean;
    is_inventoriable: boolean;
    quantity: number;
    reference: string;
    sale: number;
    sku_internal: string;
    total_buy: number;
    unique_product_name: string;
    unique_products_id: string;
    unit_cost: number;
    unit_measurement_name: string;
    unit_measurements_id: string;
    unit_value: number;
    warehouse_id: string | null;
    warehouse_name: string | null;
    mandate_id: string | null;
    mandate: IGenericRecord | null;
    unit_measure_milliliters: number | null;
    taxes: ITaxes[];
    product_taxes: ITaxesProductsStock[];
    number: string;
    date_expiration: string | null;
    impoconsumption: string | null;
    iva: string | null;
    text_fields: ITextFields | null;
    new_product: boolean;
    percentage_discount: number;
    is_mandate: boolean;
    quantity_max: number;
    checked: boolean;
}

/**
 * This interface electronic document
 *
 * @typeParam status_history_document?: IStatusHistoryDocument[] - History events
 * @typeParam cufe?: string | null - ID DIAN document
 */
export interface IElectronicDocument extends IGenericRecord {
    status_history_document?: IStatusHistoryDocument[];
    cufe?: string | null;
}

/**
 * This interface DIAN event
 *
 * @typeParam case: string -
 * @typeParam invoice_id: string -
 * @typeParam document_uuid: string -
 * @typeParam claim_code: string | null -
 * @typeParam claim_name: string | null -
 * @typeParam observations: string | null -
 */
export interface IDIANEvent {
    nextCase: string;
    case: string;
    invoice_id: string;
    document_uuid: string;
    claim_code: string | null;
    claim_name: string | null;
    observations: string | null;
}

/**
 * This interface to descriptive details calculation
 *
 * @typeParam unit_cost: number - Unit value product
 * @typeParam unit_value: number - Quantity * unit cost
 * @typeParam discount: number - Discount
 * @typeParam total_buy: number - Quantity * unit cost - discount
 */
export interface IInvoiceDetailCalculate {
    unit_cost: number;
    unit_value: number;
    discount: number;
    total_buy: number;
}

/**
 * This type is to taxes
 */
export type InvoiceDetailsTaxes = ITaxesProductsStock | ITaxes;

/**
 * Interface for state select note
 */
export interface ISelectedNote {
    id: string;
    invoiceId: string;
    typeNote: string;
    isEdit: boolean;
}
