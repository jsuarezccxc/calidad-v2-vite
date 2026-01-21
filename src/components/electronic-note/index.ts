import { Dispatch, SetStateAction } from 'react';
import dayjs from '@utils/Dayjs';
import { ICompany } from '@models/Company';
import { IGenericRecord } from '@models/GenericRecord';
import { ITaxesProductsStock } from '@models/Inventory';
import { IElectronicNoteForm } from '@models/ElectronicNote';
import { IOptionsForm } from '@models/CorrectCancelElectronicDocument';
import { IErrorsTableRetention, IInvoiceDetails, ITableTaxesAndRetention } from '@models/ElectronicInvoice';
import { IDataTableTotals } from '@components/table-totals';
import { IFields, initFieldsTable } from '@components/electronic-document';
import { createNewJson } from '@utils/Json';
import { calculatePercentage } from '@utils/Number';
import { lengthGreaterThanZero } from '@utils/Length';
import { getDateFromUnix, getUnixFromDate } from '@utils/Date';
import { changesTypeInput, discardUntaxed, stringToFloat, validateIsTypeInput } from '@utils/ElectronicInvoice';
import { VARIABLE_TYPE } from '@constants/DataTypes';
import { DOCUMENT_TYPE_REQUIRE, NA, VALUE_ZERO } from '@constants/ElectronicInvoice';
import { IRequiredFieldsTable } from '@components/table-invoice';
export * from './ElectronicNote';

/**
 * This interface describes electronic note props
 *
 * @typeParam products: IGenericRecord - Prop products
 * @typeParam className?: string - Optional prop classes styles
 * @typeParam fieldsValues: IGenericRecord - Prop state values form note
 * @typeParam setFieldsValues: Dispatch<SetStateAction<IGenericRecord>> - Prop set state values form note
 * @typeParam dataValueTableProduct: IGenericRecord[] - Prop data table products
 * @typeParam setDataValueTableProduct: Dispatch<SetStateAction<IGenericRecord[]>> - Prop set data table products
 * @typeParam errorsCustom: string[] - Prop set state errors custom
 * @typeParam errorsTableProduct: IRequiredFieldsTable[] - Prop state errors delete products
 * @typeParam deleteProductButton?: Prop enable icon delete products
 * @typeParam isDebitNote: boolean - Prop type of note
 * @typeParam dataValuesTableTaxes: ITableTaxesAndRetention[] - Prop value for inputs table products
 * @typeParam setDataValuesTableTaxes: Dispatch<SetStateAction<ITableTaxesAndRetention[]>> - Prop set value for inputs table products
 * @typeParam dataValuesTableRetention: ITableTaxesAndRetention[] - Prop data of table retention
 * @typeParam setDataValuesTableRetention: Dispatch<SetStateAction<ITableTaxesAndRetention[]>> - Prop set data for inputs of table retention
 * @typeParam errorsTableRetention: IErrorsTableRetention - Prop errors of table retention
 * @typeParam dataValuesTableTotals: IDataTableTotals[] - Prop data of table totals
 * @typeParam setDataValuesTableTotals: Dispatch<SetStateAction<IDataTableTotals[]>> - Prop set data table totals
 */
export interface IElectronicNoteProps {
    products: IGenericRecord[];
    className?: string;
    fieldsValues: IElectronicNoteForm;
    setFieldsValues: Dispatch<SetStateAction<IElectronicNoteForm>>;
    tableNote: IInvoiceDetails[];
    setTableNote: Dispatch<SetStateAction<IInvoiceDetails[]>>;
    tableRetention: ITableTaxesAndRetention[];
    setTableTaxes: Dispatch<SetStateAction<ITableTaxesAndRetention[]>>;
    setTableRetention: Dispatch<SetStateAction<ITableTaxesAndRetention[]>>;
    tableTotals: IDataTableTotals[];
    setTableTotals: Dispatch<SetStateAction<IDataTableTotals[]>>;
    optionsForm: IOptionsForm;
    errorsCustom: string[];
    errorsTableProduct: IRequiredFieldsTable;
    errorsTableRetention: IErrorsTableRetention;
    isDebitNote: boolean;
    isSubmit: boolean;
}

/**
 * This constants for handle strings
 */
export const CONSTANTS = {
    CONTADO: 'Contado',
};

/**
 * Format date for table main
 * @param data:IGenericRecord - Optional param data
 * @param products: IGenericRecord[] - Param list products
 * @param isSupplierNote?: boolean - Optional param is visual supplier note
 * @returns IGenericRecord[]
 */
export const formatDataTableMain = (
    data: IInvoiceDetails[] = [],
    products: IGenericRecord[],
    isSupplierNote = false
): IInvoiceDetails[] =>
    data.map(({ batch_number, ...item }) => {
        const {
            is_mandate,
            mandate = null,
            unique_product_taxes = [],
        } = products.find(product => product.sku_internal === item.sku_internal) || {};
        const warehouse = !isSupplierNote ? validateIsTypeInput(item) : item.warehouse_name || NA;
        const isCustomInput = changesTypeInput(warehouse);
        return {
            ...item,
            batch_id: item.batch_id || '',
            batch_number: isCustomInput ? '' : batch_number || NA,
            date_expiration: !batch_number ? NA : getDateFromUnix(getUnixFromDate(item.date_expiration || '')).dateFormat,
            sale: item.unit_value,
            warehouse_name: warehouse,
            percentage_discount: calculatePercentage(stringToFloat(item.unit_value), stringToFloat(item.discount)),
            new_product: true,
            is_inventoriable: item.is_inventoriable || false,
            is_mandate,
            mandate: is_mandate ? mandate : null,
            mandate_id: is_mandate ? item.mandate_id : null,
            taxes: unique_product_taxes.map(({ company_tax_id, tax_value }: ITaxesProductsStock) => ({
                company_tax_id,
                tax_value,
            })),
            product_taxes: discardUntaxed(item.product_taxes || unique_product_taxes),
            quantity_max: quantityMaxProduct(products, item as IProductDetail),
        };
    });

/**
 * Validate type of variable and value
 * @param percentage: string | number - Param percentage
 * @param typePercentage: number - Param type percentage
 * @param newValue: string - Param change value
 * @returns boolean
 */
export const validatePercentage = (percentage: string | number, typePercentage: string, newValue: string): boolean =>
    newValue.includes(',')
        ? false
        : (!percentage || percentage === VALUE_ZERO) &&
          (typePercentage === VARIABLE_TYPE.NUMBER || typePercentage === VARIABLE_TYPE.STRING);

/**
 * Validate the maximum of the percentage
 * @param firstValue: number - param first value
 * @param value: number - param  value
 * @param secondValue: number - param  second value
 * @returns boolean
 */
export const validatePercentageRetention = (firstValue: number, value: number, secondValue: number): boolean =>
    !(firstValue <= value || isNaN(secondValue));

/**
 * Create data for time
 * @param time: IGenericRecord -  Param object
 * @returns string
 */
export const getTimeIssue = (time?: IGenericRecord, format = 'HH:mm:ss'): string => {
    const dateComplete = dayjs();
    if (time) {
        const baseHour = time.hour === 12 ? 0 : time.hour;
        const hour24 = time.schedule === 'pm' ? (time.hour === 12 ? time.hour : time.hour + 12) : baseHour;
        return dateComplete.set('hour', hour24).set('minute', time.minutes).set('second', 0).format(format);
    }
    return dateComplete.format(format);
};

/**
 * Validate reteIva in table retention
 * @param fieldInputs: IGenericRecord - Param inputs value in form
 * @param tableMain: IGenericRecord[] - Param array of values products
 * @param infoCompany: ICompany | undefined - Param information by company
 * @returns
 */
export const isEnabledReteIva = (
    fieldInputs: IGenericRecord,
    tableMain: IGenericRecord[],
    infoCompany: ICompany | null
): boolean => {
    const isReteIva = fieldInputs.fiscal_responsibility?.filter((x: IGenericRecord) => x.value.includes('O-23'));
    const isProductsIva = tableMain.filter(x => String(x.iva).includes('19') || String(x.iva).includes('8'));
    const isMeReteIva = infoCompany
        ? infoCompany.fiscal_responsibilities?.filter((x: IGenericRecord) => x.code.includes('O-15'))
        : [];
    return lengthGreaterThanZero(isProductsIva) && lengthGreaterThanZero(isReteIva) && !lengthGreaterThanZero(isMeReteIva);
};

/**
 * Validate type note create
 * @param typeDocument: string - param type document
 * @returns boolean
 */
export const typeNote = (typeDocument: string): boolean => DOCUMENT_TYPE_REQUIRE.DEBIT_NOTE === typeDocument;

/**
 * Initial data fields from products and services table
 */
export const fieldsInputsTableProducts: IFields = createNewJson({
    ...initFieldsTable,
    percentage_discount: {
        name: 'percentage_discount',
        value: 0,
        onChange: () => {},
        disabled: true,
    },
});

/**
 * Template for block inputs
 */
export const tableBlock = {
    main: [
        'sku',
        'element',
        'warehouse',
        'lot',
        'description',
        'quantity',
        'percentage_discount',
        'send_cost',
        'unit_value',
        'date',
    ],
    retention: ['base', 'rate', 'value'],
    total: ['shipping_cost'],
};

/**
 * This interface is product detail
 *
 * @typeParam sku_internal: string - Sku product
 * @typeParam warehouse_id?: string - Warehouse Id
 * @typeParam batch_detail_id?: string - Batch detail Id
 */
export interface IProductDetail {
    sku_internal: string;
    warehouse_id?: string;
    batch_detail_id?: string;
}

/**
 * This function calculate max quantity to product or service
 *
 * @param products: IGenericRecord[] - Param list products
 * @param param1: IProductDetail - Param information invoice detail
 * @returns number
 */
export const quantityMaxProduct = (
    products: IGenericRecord[] = [],
    { sku_internal, warehouse_id = '', batch_detail_id = '' }: IProductDetail
): number => {
    const product = products.find(item => item.sku_internal.includes(sku_internal));
    if (!product || !product.is_inventoriable) return 0;
    if (!product.product.is_product) return product.periodicity;
    if (warehouse_id) {
        const { quantity: quantityWarehouse = 0, ...warehouse } =
            product.stock.find((item: IGenericRecord) => item.warehouses_id === warehouse_id) || {};
        if (batch_detail_id && warehouse) {
            const { quantity = 0 } =
                warehouse.batch.find((item: IGenericRecord) => item.batch_detail_id === batch_detail_id) || {};
            return quantity;
        }
        return Number(quantityWarehouse);
    }
    return 0;
};

/**
 * Const tax name
 */
export const TAX_NAME = 'tax';

/**
 * Const keys exclude in handle
 */
export const INDEX_VALUES = ['sku', 'element', 'batch', 'warehouse'];

/**
 * This interface describe code reason rejected
 */
interface ICodeReasonRejection {
    code_debit_note: string | null;
    code_credit_note: string | null;
}

/**
 * This function assign reason rejection's code
 *
 * @param idReasonRejection: string - Id reason rejection
 * @param reasonsRejection: IGenericRecord[] - Reason rejections
 * @param isDebitNote: boolean - If debit or credit note
 * @returns ICodeReasonRejection
 */
export const codeReasonRejection = (
    idReasonRejection: string,
    reasonsRejection: IGenericRecord[],
    isDebitNote: boolean
): ICodeReasonRejection => {
    const { code_debit_note, code_credit_note } = reasonsRejection.find(({ id }) => id === idReasonRejection) || {};
    return {
        code_debit_note: isDebitNote ? code_debit_note : null,
        code_credit_note: isDebitNote ? null : code_credit_note,
    };
};

/**
 * Create data for invoice_details notes
 *
 * @param products: IGenericRecord[] - Param array
 * @returns IGenericRecord[]
 */
export const formatProductsNote = (products: IGenericRecord[]): IGenericRecord[] => {
    return products.map(({ product_taxes, ...item }: IGenericRecord) => ({
        batch_detail_id: item.batch_detail_id,
        batch_id: item.lot_id,
        batch_number: item.lot,
        ciiu_id: item.ciiu_id || null,
        delivery_cost: stringToFloat(item.send_cost),
        description: item.description,
        discount: stringToFloat(item.discount),
        id: item.id,
        is_product: item.is_product,
        is_inventoriable: item.is_inventoriable,
        quantity: stringToFloat(item.quantity),
        reference: item.reference,
        sale: item.sale,
        sku_internal: item.sku,
        total_buy: item.sale_cost,
        unique_product_name: item.element,
        unique_products_id: item.unique_products_id,
        unit_cost: stringToFloat(item.unit_value),
        unit_measurement_name: item.measurement,
        unit_measurements_id: item.measurement_id,
        unit_value: item.sale,
        warehouse_id: item.warehouse_id || null,
        warehouse_name: item.warehouse || null,
        mandate_id: item.mandate_id === NA ? null : item.mandate_id,
        mandate: item.mandate === NA ? null : item.mandate,
        unit_measure_milliliters: item.unit_measure_milliliters,
        taxes: product_taxes.map(({ company_tax_id, tax_value }: IGenericRecord) => ({ company_tax_id, tax_value })),
        product_taxes,
    }));
};
