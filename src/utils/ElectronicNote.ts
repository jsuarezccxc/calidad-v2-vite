import { v4 as uuid } from 'uuid';
import { CREDIT } from '@constants/Invoice';
import { MANDATE_ID } from '@constants/ElectronicNote';
import { ONE_HUNDRED, RETE_FUENTE, RETE_ICA, RETE_IVA } from '@constants/ElectronicInvoice';
import { SupportingDocumentFieldNames } from '@constants/SupportDocument';
import { InvoiceTableKeys, KEYS_VALIDATE_DETAILS } from '@constants/TableInvoice';
import { VALIDATIONS_ESPECIAL, VALIDATIONS_INVOICES } from '@information-texts/CorrectCancelElectronicDocument';
import { IOptionSelect } from '@components/input';
import { IGenericRecord } from '@models/GenericRecord';
import { IElectronicDocumentTotals } from '@models/ElectronicNote';
import { IValidateInFunction, IValidateNote } from '@models/CorrectCancelElectronicDocument';
import { IInvoiceCalculates, IInvoiceDetails, ITableTaxesAndRetention } from '@models/ElectronicInvoice';
import { includeArray } from './Array';
import { getDateFromUnix, getUnixFromDate } from './Date';
import { validateTableRetentions } from './ElectronicInvoice';
import { lengthEqualOne, lengthEqualToZero, lengthGreaterThanZero } from './Length';

/**
 * This interface is multi options
 *
 * @typeParam multiWarehouse: IOptionSelect[][] - Options warehouse
 * @typeParam multiBatch: IOptionSelect[][] - Options batch
 * @typeParam multiDates: IOptionSelect[][] - Options dates
 * @typeParam batchDetailId: string | null - Batch detail Id
 */
interface IMultiOptions {
    multiWarehouse: IOptionSelect[][];
    multiBatch: IOptionSelect[][];
    multiDates: IOptionSelect[][];
    batchDetailId: string | null;
}

/**
 * Create options selects customs
 *
 * @param options:IGenericRecord Param options
 * @param value:string - Optional param selects custom value and id
 * @param idCode:boolean - Optional param boolean
 * @param nameValue:boolean - Optional param boolean
 * @returns IOptionSelect[]
 */
export const setOptionsSelect = (
    options: IGenericRecord[] = [],
    value = '',
    idCode = true,
    nameValue = true
): IOptionSelect[] => {
    if (lengthGreaterThanZero(options)) {
        return options.map((item: IGenericRecord) => {
            return {
                key: uuid(),
                id: !idCode ? item[value] : item.id,
                value: !nameValue ? item[value] : item.name,
            };
        });
    }
    return [];
};

/**
 * Create options for selects warehouse and batch
 *
 * @param products:IGenericRecord[] - Optional param products
 * @param invoiceDetails:IGenericRecord[] - Optional param invoiceDetails
 * @param index:string - Optional param index
 * @returns IGenericRecord
 */
export const multiOptionsSelect = (
    products: IGenericRecord[] = [],
    invoiceDetails: IInvoiceDetails[] = [],
    index = 'unique_products_id',
    isWarehouse = false
): IMultiOptions => {
    const productStockFind = (value: string): IGenericRecord[] => {
        return products.find(({ id }: IGenericRecord) => id === value)?.stock || [];
    };
    const warehouse = invoiceDetails.map((item: IGenericRecord) => {
        const warehouseFilter = productStockFind(item[index]).filter(warehouse => {
            if (
                lengthEqualToZero(
                    [...invoiceDetails].filter(
                        details => details.id === warehouse.unique_product_id && details.warehouse_id === warehouse.warehouses_id
                    )
                ) ||
                lengthGreaterThanZero(warehouse.batch)
            ) {
                return warehouse;
            }
        });
        return setOptionsSelect(warehouseFilter, 'warehouses_id', false);
    });
    let batchDetailId = null;
    const batch = invoiceDetails.map((item: IGenericRecord) => {
        if (item.warehouse_id) {
            const warehouses = productStockFind(item[index]);
            let batchP: IGenericRecord[] = [];
            warehouses.forEach(({ warehouses_id, batch }: IGenericRecord) => {
                if (warehouses_id === item.warehouse_id) {
                    batchP = batch.flatMap(({ batch_id, number }: IGenericRecord) => {
                        if (isWarehouse) {
                            return {
                                id: batch_id,
                                name: number,
                            };
                        }
                        const validateDetail = [...invoiceDetails].filter(
                            detail =>
                                detail.id === item.id && detail.warehouse_id === warehouses_id && detail.batch_id === batch_id
                        );
                        if (lengthEqualOne(validateDetail) || lengthEqualToZero(validateDetail)) {
                            return {
                                id: batch_id,
                                name: number,
                            };
                        }
                        return [];
                    });
                }
            });
            return setOptionsSelect(batchP);
        }
        return [];
    });
    const date = invoiceDetails.map((item: IGenericRecord) => {
        const dates: IGenericRecord[] = [];
        if (item.batch_id && lengthGreaterThanZero(products)) {
            const productDate = products.find(({ id }: IGenericRecord) => id === item[index])?.purchase_details;
            const batchDate = productDate?.filter(
                (itemBatch: IGenericRecord) =>
                    itemBatch.batch_detail &&
                    itemBatch.batch_detail.date_expired &&
                    itemBatch.batch_detail.batch_id === item.batch_id
            );
            const [{ batch_detail_id = null }] = lengthGreaterThanZero(batchDate) ? batchDate : [{}];
            batchDetailId = batch_detail_id;
            batchDate?.forEach((batch: IGenericRecord) => {
                if (batch.batch_detail_id) {
                    dates.push({
                        id: getDateFromUnix(getUnixFromDate(batch.batch_detail.date_expired)).dateFormat,
                        name: getDateFromUnix(getUnixFromDate(batch.batch_detail.date_expired)).dateFormat,
                    });
                }
            });
        }
        return setOptionsSelect(dates);
    });
    return {
        multiWarehouse: warehouse,
        multiBatch: batch,
        multiDates: date,
        batchDetailId,
    };
};

/**
 * This function is table total assign
 *
 * @param totals: IInvoiceCalculates - Calculation for back
 * @param tableRetentions: ITableTaxesAndRetention[] - Table retentions
 *
 * @returns IElectronicDocumentTotals
 */
export const tableTotalsToJson = (
    totals: IInvoiceCalculates,
    tableRetentions: ITableTaxesAndRetention[]
): IElectronicDocumentTotals => {
    const getRetentionBase = (name: string): number => tableRetentions.find(item => item.name === name)?.base ?? 0;
    const base_retefuente = getRetentionBase(RETE_FUENTE);
    const base_reteica = getRetentionBase(RETE_ICA);
    const base_reteiva = getRetentionBase(RETE_IVA);

    return {
        base_retefuente,
        base_reteica,
        base_reteiva,
        total_sale: totals.subtotal,
        total_discount: totals.total_discount,
        sending_charge: totals.total_charge_amount,
        total_sale_before_tax: totals.total_gross,
        total_invoice: totals.total_gross,
        total_iva: totals.total_iva,
        total_icui: totals.total_icui,
        total_ibua: totals.total_ibua,
        total_impoconsumption: totals.total_inc,
        total_sale_value: totals.total_payable,
        retefuente: totals.retefuente,
        reteica: totals.reteica,
        reteiva: totals.reteiva,
        total: totals.total,
    };
};

const { DAYS_COLLECTION, DAYS_COLLECTION_TYPE } = SupportingDocumentFieldNames;

/**
 * This function is validate note
 *
 * @param note: IElectronicNote | IAdjustmentNote - Note to create
 * @param isReturnBoolean: If is validate button
 * @returns IValidateNote | IValidateInFunction
 */
export const validateDocument = (
    document: IGenericRecord,
    keysValidate: string[],
    isReturnBoolean = false
): IValidateNote | IValidateInFunction => {
    const form = Object.keys(document).flatMap(key => {
        if (keysValidate.includes(key) && !document[key]) {
            return key;
        }
        if (
            document.payment_type_name === CREDIT &&
            !document[key] &&
            [DAYS_COLLECTION, DAYS_COLLECTION_TYPE].includes(key as SupportingDocumentFieldNames)
        ) {
            return key;
        }
        return [];
    });
    const messages: string[] = [];
    const fields: string[][] = document.products.map((detail: IInvoiceDetails) => {
        return Object.keys(detail).flatMap(key => {
            const keyUpperCase = key.toUpperCase();
            if (
                KEYS_VALIDATE_DETAILS.includes(key) ||
                (document.operation_type_id === MANDATE_ID && key === InvoiceTableKeys.MANDATE)
            ) {
                if (!detail[key as keyof IInvoiceDetails]) {
                    const label = VALIDATIONS_INVOICES[keyUpperCase];
                    if (!includeArray(messages, label)) messages.push(label);
                    return key;
                }
            }
            if (key === InvoiceTableKeys.PERCENTAGE_DISCOUNT && detail[key] > ONE_HUNDRED) {
                const label = VALIDATIONS_ESPECIAL[keyUpperCase];
                if (!includeArray(messages, label)) messages.push(label);
                return key;
            }
            return [];
        });
    });
    const retentions = validateTableRetentions(document.withholdings, document.country_name || '');
    return isReturnBoolean
        ? {
              form: lengthGreaterThanZero(form),
              details: lengthGreaterThanZero(messages),
              retentions: retentions.some(msg => msg),
          }
        : {
              form,
              details: {
                  fields,
                  messages,
              },
              retentions,
          };
};
