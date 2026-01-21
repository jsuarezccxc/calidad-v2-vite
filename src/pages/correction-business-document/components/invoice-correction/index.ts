import { v4 as uuid } from 'uuid';
import { useCorrection } from '@hooks/useCorrection';
import { IGenericRecord } from '@models/GenericRecord';
import { ICompany } from '@models/Company';
import { ITaxesProductsStock } from '@models/Inventory';
import { IElectronicDocument, ITableTaxesAndRetention } from '@models/ElectronicInvoice';
import { getDateFromUnix, getDateTablePicker, getTodaysTime } from '@utils/Date';
import { lowerCase } from '@utils/Text';
import { createNewJson } from '@utils/Json';
import { calculatePercentage } from '@utils/Number';
import { getRoute, getRouteName } from '@utils/Paths';
import { formatInitialNumber } from '@utils/Decimals';
import { lengthGreaterThanZero } from '@utils/Length';

import { discardUntaxed, stringToFloat, validateDateLimit, validateIsTypeInput } from '@utils/ElectronicInvoice';
import { VALIDATIONS_INVOICES } from '@information-texts/ElectronicInvoice';
import { Routes } from '@constants/Paths';
import {
    init_fields_correction,
    init_fields_table_corrections,
    init_fields_tax_table_corrections,
} from '@constants/InitFieldCorrection';
import { VARIABLE_TYPE } from '@constants/DataTypes';
import { IBUA, ICUI, INC, IVA } from '@constants/BuildProduct';
import {
    ADJUSTMENT_NOTE,
    ALL_NOTES,
    CREDIT_NOTE,
    DEBIT_NOTE,
    DEFAULT_LANG,
    INVOICE,
    MaxLengthFields,
    NA,
    SUPPORTING_DOCUMENT,
    TypeFile,
    RETE_FUENTE,
    RETE_ICA,
    RETE_IVA,
} from '@constants/ElectronicInvoice';
import { ACCEPTED, REJECTED } from '@constants/InvoiceState';
import { RETEIVA } from '@pages/correction-business-document';
import { ZERO as FIRST_POSITION } from '@constants/Numbers';
import { CREDIT_PAYMENT } from '@pages/correction-documents-client-employer/components/electronic-document-correction';
import { TextNameTotals } from '@components/electronic-invoice';
import { Section } from '@components/bread-crumb';
import { IElectronicDocumentProps } from '@components/electronic-document';

export { default } from './InvoiceCorrection';
export const EXEMPT_ID = 'fa7450cd-7d8e-477c-a5fa-adc10940d6ac';
export const NOT_RECORDED_ID = '58173c3c-2d0c-43a9-957d-1223cd9e699f';
export const EXCLUDED_ID = '0b9849d0-c505-4a53-a4fa-af948dc4de02';
export const EXCLUDED_CONSUMPTION_ID = '1c0849d0-c505-4a53-a4fa-af948dc4df13';

const { formatProducts } = useCorrection();

/**
 * Header table
 */
export const headersTable = [
    {
        title: 'Errores presentados en el documento',
        className: 'header-table-reason-rejection',
        wrapperClassName: 'no-padding',
    },
];

/**
 * router options
 */
export const ROUTER_OPTIONS = {
    [INVOICE]: 'Factura de venta.',
    [DEBIT_NOTE]: 'Nota débito.',
    [CREDIT_NOTE]: 'Nota crédito.',
    [SUPPORTING_DOCUMENT]: 'Documento soporte.',
    [ADJUSTMENT_NOTE]: 'Nota de ajuste.',
};

export type InvoiceType =
    | typeof INVOICE
    | typeof SUPPORTING_DOCUMENT
    | typeof DEBIT_NOTE
    | typeof CREDIT_NOTE
    | typeof ADJUSTMENT_NOTE;

/**
 * file type for get logo of the document
 */
export const fileTypeMap = {
    [INVOICE]: TypeFile.LOGO_INVOICE,
    [DEBIT_NOTE]: TypeFile.LOGO_INVOICE,
    [CREDIT_NOTE]: TypeFile.LOGO_INVOICE,
    [SUPPORTING_DOCUMENT]: TypeFile.LOGO_SUPPORT,
    [ADJUSTMENT_NOTE]: TypeFile.LOGO_SUPPORT,
};

/**
 * This function is routes page
 *
 * @returns Section[]
 */
export const routes = ({ id = '', invoice_type = '' }: IElectronicDocument): Section[] => [
    {
        name: getRouteName(Routes.ELECTRONIC_DOCUMENTS),
        route: getRoute(Routes.ELECTRONIC_DOCUMENTS),
    },
    ...[
        ALL_NOTES.includes(invoice_type)
            ? {
                  name: getRouteName(Routes.CORRECTED_DOCUMENTS),
                  route: getRoute(Routes.CORRECTED_DOCUMENTS),
              }
            : {
                  name: getRouteName(Routes.ELECTRONIC_DOCUMENTS_GENERATED),
                  route: getRoute(Routes.ELECTRONIC_DOCUMENTS_GENERATED),
              },
    ],
    {
        name: getRouteName(Routes.CONSULT_ELECTRONIC_DOCUMENT),
        route: `${getRoute(Routes.CONSULT_ELECTRONIC_DOCUMENT)}?id=${id}`,
    },
    {
        name: 'Corrección del documento electrónico por parte del empresario',
        route: '#',
    },
    { name: ROUTER_OPTIONS[invoice_type as InvoiceType], route: '#' },
];

/**
 * This function is principal title
 *
 * @param invoiceType: string - Optional param invoice type
 * @returns string
 */
export const principalTitle = (invoiceType = ''): string => {
    if (ALL_NOTES.includes(invoiceType)) return getRouteName(Routes.CORRECTED_DOCUMENTS);
    return getRouteName(Routes.ELECTRONIC_DOCUMENTS_GENERATED);
};

/**
 *
 * @param obj: IGenericRecord - Object data
 * @returns boolean
 */
export const isObjEmpty = (obj: IGenericRecord): boolean => Object.keys(obj).length === 0;

interface IFormatMainDataTable {
    data: IGenericRecord[];
    products?: IGenericRecord[];
    isList?: boolean;
    primary?: boolean;
    operation_type_id?: string;
}

/**
 *
 * @param data: IGenericRecord[] - Data
 * @param products
 * @param typeNote
 * @param isList
 * @param primary
 * @returns IGenericRecord[]
 */

// Round
export const formatMainDataTable = ({
    data = [],
    products = [],
    isList = false,
    primary = false,
}: IFormatMainDataTable): IGenericRecord[] => {
    const calculationTotalBuy = (item: IGenericRecord): IGenericRecord => {
        item.unique_product_taxes = discardUntaxed(
            products?.find(product => product?.id === item?.unique_products_id)?.unique_product_taxes
        );
        const existIVA = item?.unique_product_taxes?.find((tax: ITaxesProductsStock) => tax.tax_name === IVA) || null;
        const existINC = item?.unique_product_taxes?.find((tax: ITaxesProductsStock) => tax.tax_name === INC) || null;
        const existICUI = item?.unique_product_taxes?.find((tax: ITaxesProductsStock) => tax.tax_name === ICUI) || null;
        const existIBUA = item?.unique_product_taxes?.find((tax: ITaxesProductsStock) => tax.tax_name === IBUA) || null;

        const values = {
            unitCost: stringToFloat(item.unit_cost.value || item.unit_cost) || 0,
            quantity: Number(item.quantity.value || item.quantity) || 0,
            delivery: Number(item.delivery_cost.value || item.delivery_cost) || 0,
            discount: Number(item.discount.value || item.discount) || 0,
            iva: existIVA ? existIVA.tax_rate : 0,
            consumption: existINC ? existINC.tax_rate : 0,
        };

        const { unitCost, quantity, delivery, discount, iva, consumption } = values;
        const quantityXUnitCost = stringToFloat(unitCost * quantity);
        const totalBeforeTaxes = quantityXUnitCost - discount;
        const totalIva = (totalBeforeTaxes / 100) * iva;
        const totalIcui = stringToFloat(totalBeforeTaxes * existICUI?.tax_rate) / 100 || 0;
        const totalIbua = stringToFloat(existIBUA?.tax_value * quantity) || 0;
        const totalConsumption = stringToFloat((totalBeforeTaxes / 100) * consumption);
        const totalBuy = totalBeforeTaxes + delivery;
        const totalBuyWithTaxes = totalBeforeTaxes + totalIva + totalIbua + totalIcui + totalConsumption + delivery;
        const unitValue = quantityXUnitCost;

        return {
            totalBuy,
            totalBeforeTaxes,
            totalIva,
            totalIcui,
            totalIbua,
            totalConsumption,
            totalBuyWithTaxes,
            unitValue,
        };
    };

    return data?.map((item: IGenericRecord, index: number) => {
        const existIVA = item?.unique_product_taxes?.find((tax: IGenericRecord) => tax.tax_name === IVA) || null;
        const existConsumption = item?.unique_product_taxes?.find((tax: IGenericRecord) => tax.tax_name === INC) || null;
        const currentProduct = products?.find(product => product?.id === item?.unique_products_id) || null;

        return {
            ...item,
            temporary_id: uuid(),
            is_inventoriable: item.is_inventoriable,
            sku_internal: primary
                ? {
                      value: item.sku_internal,
                      id: item.unique_products_id,
                      required: false,
                  }
                : item.sku_internal,
            unique_product_name: primary
                ? {
                      value: item.unique_product_name,
                      required: false,
                  }
                : item.unique_product_name,
            warehouse_name: primary
                ? {
                      id: item.warehouse_id,
                      value: validateIsTypeInput(item),
                      required: false,
                  }
                : item.warehouse_name,
            percentage_discount: primary
                ? {
                      value: calculatePercentage(stringToFloat(item.unit_value), stringToFloat(item?.discount)) || 0,
                      required: false,
                  }
                : { ...item.percentage_discount },
            discount: primary
                ? { value: item.discount || 0, required: false }
                : { ...item?.discount, value: item.discount.value || 0 },
            delivery_cost: primary ? { value: 0, required: false } : item.delivery_cost,
            unit_cost: primary ? { value: item.unit_cost, required: false } : item.unit_cost,
            unit_value: {
                ...item.unit_value,
                value: calculationTotalBuy(item).unitValue,
            },
            quantity: primary
                ? {
                      ...item.quantity,
                      value: item.quantity || 0,
                  }
                : { ...item.quantity, value: item.quantity.value || 0 },
            total_buy: calculationTotalBuy(item).totalBuy,
            total_iva: calculationTotalBuy(item).totalIva,
            total_icui: calculationTotalBuy(item).totalIcui,
            total_ibua: calculationTotalBuy(item).totalIbua,
            total_consumption: calculationTotalBuy(item).totalConsumption,
            total: calculationTotalBuy(item).totalBeforeTaxes,
            totalBuyWithTaxes: calculationTotalBuy(item).totalBuyWithTaxes,
            batch_number: primary
                ? {
                      id: item.batch_id,
                      value: item.batch_number || 'N/A',
                      required: false,
                  }
                : item.batch_number,
            number: formatInitialNumber(index + 1),
            iva: existIVA?.is_customized ? existIVA?.tax_rate_name || 0 : `${existIVA?.tax_rate || 0}%`,
            consumption: existConsumption?.is_customized
                ? existConsumption?.tax_rate_name || 0
                : `${existConsumption?.tax_rate || 0}%`,
            date_expiration: primary
                ? {
                      value: item.batch_number ? getDateTablePicker(item.date_expiration) : 'N/A',
                      required: false,
                  }
                : item.date_expiration,
            required: false,
            validate_delivery: item.validate_delivery || false,
            test: !isList
                ? products?.filter((product: IGenericRecord) => product.id === item.unique_products_id)[0]?.stock || []
                : [],
            mandate: item.mandate || NA,
            mandate_id: item.mandate_id || NA,
            text_fields: {
                warehouse: '',
                batch: '',
                date_expiration: '',
            },
            unit_measure_milliliters: currentProduct?.unit_measure_milliliters || 0,
            unique_product_taxes: discardUntaxed(currentProduct?.unique_product_taxes),
        };
    });
};

/**
 * Format request put invoice
 *
 * @param fields?: IGenericRecord - fields? main data
 * @param data: IGenericRecord - Main data
 * @param currentErrors: IGenericRecord[] - Main errors data
 * @param productsStock: IGenericRecord[] - List products stock
 * @param products: IGenericRecord[] - Main products
 * @param taxesTable: IGenericRecord[] - Main taxes data
 * @param totalsTable: IGenericRecord[] - Main totals data
 * @param documentType: string - Type note and invoice
 * @param withHoldings: IGenericRecord - Main data withHoldings
 * @returns  IGenericRecord
 */
export const formatDataRequest = (
    fields: IGenericRecord,
    data: IGenericRecord,
    currentErrors: IGenericRecord[],
    productsStock: IGenericRecord[],
    products?: IGenericRecord[],
    taxesTable?: IGenericRecord[],
    totalsTable?: IGenericRecord[],
    documentType?: string,
    withHoldings?: IGenericRecord[]
): IGenericRecord => {
    const refactorTotals: IGenericRecord = {};
    const errors: IGenericRecord[] = currentErrors
        .filter((error: IGenericRecord) => !error.corrected)
        .map((error: IGenericRecord) => ({ id: error.id }));

    totalsTable?.forEach((total: IGenericRecord) => {
        refactorTotals[total.field] = `${total.value}` || 0;
    });

    const isSupportDocument = documentType === SUPPORTING_DOCUMENT;
    const isAdjustmentNote = documentType === ADJUSTMENT_NOTE;

    const reteFuente = withHoldings?.find(item => lowerCase(item.name) === lowerCase(RETE_FUENTE)) ?? null;
    const reteICA = withHoldings?.find(item => lowerCase(item.name) === lowerCase(RETE_ICA)) ?? null;
    const reteIVA = withHoldings?.find(item => lowerCase(item.name) === lowerCase(RETE_IVA)) ?? null;

    const dateLimit =
        fields?.payment_type.id === CREDIT_PAYMENT
            ? validateDateLimit(fields?.collection_days?.value, fields?.days_collection_type?.value)
            : getDateFromUnix().formatYearMonthDay;

    return {
        ...(isAdjustmentNote && {
            annulment: true,
        }),
        id: data?.id,
        accepted_customer: true,
        address: fields?.address?.value,
        aggregation_method: 'ELECTRONICS',
        apply_deductible: false,
        apply_electronic_invoice: true,
        base_retefuente: reteFuente?.value ?? 0,
        base_reteica: reteICA?.value ?? 0,
        base_reteiva: reteIVA?.value ?? 0,
        city_id: fields?.city?.value,
        city_name: fields?.city?.name || 'Bogotá, D.C',
        client_id: data?.person?.customer?.client_id,
        company_address: data?.company_address,
        company_postal_code: data?.company_postal_code,
        country_id: fields?.country.value,
        country_name: fields?.country.name || 'Colombia',
        customer_id: data?.person?.customer?.id,
        date:
            isSupportDocument || isAdjustmentNote
                ? getDateFromUnix(fields?.date_issue).formatYearMonthDay
                : getDateFromUnix().formatYearMonthDay,
        date_limit: isSupportDocument || isAdjustmentNote ? getDateFromUnix(fields?.due_date).formatYearMonthDay : dateLimit,
        ...(isSupportDocument && {
            date_associated: data?.date_associated,
            date_purchase_order: getDateFromUnix(fields?.date_purchase_order).formatYearMonthDay ?? data.date_purchase_order,
            loaded_inventory: false,
        }),
        days_collection_type: fields?.days_collection_type?.value || null,
        days_collection: fields?.collection_days.value,
        department_id: fields?.department_state.value,
        department_name: fields?.department_state.name || 'Cundinamarca',
        document_number_purchasing_manager: fields?.purchase_number_document_number?.value,
        document_number_sales_manager: fields?.seller_document_number?.value,
        document_number: fields?.customer_document_number?.value,
        document_type_purchasing_manager: fields?.type_document_purchase_manager?.id,
        document_type_sales_manager: fields?.seller_type_document?.id,
        document_type: fields?.customer_document_type?.id,
        electronic_billing: true,
        email: fields?.email?.value,
        error_histories: errors,
        fiscal_responsibilities: data?.person?.fiscal_responsibilities.map((item: IGenericRecord) => {
            return {
                id: isSupportDocument
                    ? String(item.fiscal_responsibility_id || item.id)
                    : item.fiscal_responsibility_id || item.id,
            };
        }),
        foreign_exchange_id: fields?.badge?.value,
        foreign_exchange_name: fields?.badge?.name,
        foreign_exchange_rate: !fields?.foreign_exchange_rate ? 0 : fields?.foreign_exchange_rate,
        internal_notes: fields?.internal_notes,
        invoice_id: data?.invoice_id,
        invoice_state: isSupportDocument || isAdjustmentNote ? ACCEPTED : REJECTED,
        invoice_type: documentType,
        ...((isSupportDocument || isAdjustmentNote) && {
            invoice_number_supplier: fields?.invoice_number_supplier?.value,
        }),
        lang: fields?.lang ?? DEFAULT_LANG,
        is_electronic_invoice: true,
        is_paid: true,
        name: fields?.customer_name?.value,
        name_legal_representative: fields?.name_legal_representative || null,
        note: fields?.observations,
        payment_method_id: fields?.way_pay?.id,
        payment_type_id: fields?.payment_type.id,
        payment_type_name: fields?.payment_type.value,
        person_id: fields?.person?.id || data?.person?.id,
        person: fields?.person || data?.person,
        phone: fields?.phone?.value,
        postal_code: fields?.postal_code?.value,
        prefix_id_associated: data?.prefix_id_associated,
        number_associated: data?.prefix_number_associated,
        prefix_id: fields?.prefix?.id,
        prefix_name: fields?.prefix?.value,
        number: data?.number,
        number_max: data?.consecutive?.number_max,
        number_purchase_order: fields?.purchase_order_number,
        products: formatProducts(products || [], productsStock),
        purchasing_manager: fields?.purchase_manager,
        retefuente: refactorTotals.retefuente,
        reteica: refactorTotals.reteica,
        reteiva: refactorTotals.reteiva,
        sale_channel: data?.sale_channel,
        sales_manager: fields?.sales_manager,
        send_address: fields?.address?.value,
        sending_charge: refactorTotals.total_charge_amount,
        source_type: 'CUSTOMERS',
        tax_details_code: fields?.tax_detail?.id,
        tax_details_name: fields?.tax_detail?.value?.replaceAll(`${fields?.tax_detail.id} - `, ''),
        taxes: taxesTable?.map((item: IGenericRecord) => ({
            name: item.name,
            base: item.value,
            percentage: item.percentage,
            value: item.other_value,
        })),
        time_issue: getTodaysTime(),
        total_discount: refactorTotals.total_discount,
        total_ibua: refactorTotals.total_ibua,
        total_icui: refactorTotals.total_icui,
        total_impoconsumption: refactorTotals.total_inc,
        total_invoice: refactorTotals.total_gross,
        total_iva: refactorTotals.total_iva,
        total_sale_value: refactorTotals.total_payable,
        total_sale: refactorTotals.subtotal,
        total: refactorTotals.total,
        type_taxpayer_id: fields?.type_taxpayer?.id,
        type_taxpayer_name: fields?.type_taxpayer?.value,
        withholdings: withHoldings?.map((item: IGenericRecord) => ({
            name: item.name,
            base: item.value,
            percentage: item.percentage,
            value: item.other_value,
        })),
    };
};

/**
 *
 * @param data: IGenericRecord[] - Data main
 * @return string[]
 */
export const formatTableValidations = (data: IGenericRecord[]): IGenericRecord[] => {
    const errors: IGenericRecord[] = [];
    data?.forEach((item: IGenericRecord) => {
        item.percentage_discount.value > MaxLengthFields.PERCENTAGE_DISCOUNT &&
            errors.push({ error: VALIDATIONS_INVOICES.PERCENTAGE_DISCOUNT, field: 'percentage_discount' });
        item.unit_cost.required && errors.push({ error: '*El valor unitario debe ser mayor a 0', field: 'unit_cost' });
        item.quantity.required && errors.push({ error: VALIDATIONS_INVOICES.QUANTITY_ZERO, field: 'quantity' });
        item.delivery_cost.required && errors.push({ error: '*El campo costo de envio es obligatorio', field: 'delivery_cost' });
        item.batch_number.required &&
            item.sku_internal.value &&
            item.warehouse_name.value &&
            errors.push({ error: '*El campo lote obligatorio', field: 'batch_number' });
        item.sku_internal.required && errors.push({ error: VALIDATIONS_INVOICES.SKU, field: 'sku_internal' });
    });
    return [...new Set(errors)];
};

/**
 * This function calculate values for total tables
 *
 * @param data: IGenericRecord[] - Data main invoice
 * @param valuesTotal: IGenericRecord - Data total,
 * @param withHoldings?: IGenericRecord[] - Data withholdings,
 * @param round?: boolean - Visualization document
 * @returns ITotalValue[]
 */
export const formatTotalTableData = (
    data: IGenericRecord[],
    valuesTotal: IGenericRecord,
    withHoldings?: IGenericRecord[],
    round = false
): IGenericRecord[] => {
    const totalValues = createNewJson(valuesTotal);
    const taxesParams: IGenericRecord = {
        retefuente: 0,
        reteica: 0,
        reteiva: 0,
    };
    const valueTotals: string[] = [
        'total_sale',
        'total_discount',
        'sending_charge',
        'total',
        'total_iva',
        'total_ibua',
        'total_icui',
        'consumption',
        'retefuente',
        'reteica',
        'reteiva',
        'total_sale_value',
    ];

    withHoldings?.forEach((item: IGenericRecord) => {
        if (item.name === '06 Retefuente') {
            taxesParams.retefuente = stringToFloat(item.other_value);
        }
        if (item.name === '07 ReteICA') taxesParams.reteica = stringToFloat(item.other_value);
        if (item.name === '08 ReteIVA') taxesParams.reteiva = stringToFloat(item.other_value);
    });

    const totalRetentions = taxesParams.retefuente + taxesParams.reteiva + taxesParams.reteica;

    data?.forEach((item: IGenericRecord) => {
        totalValues.total_sale += stringToFloat(item.unit_value.value);
        totalValues.total_discount += item?.discount?.value || 0;
        totalValues.total += round ? stringToFloat(item.total) : item.total;
        totalValues.total_iva += item.total_iva;
        totalValues.total_ibua += item.total_ibua;
        totalValues.total_icui += item.total_icui;
        totalValues.consumption += item.total_consumption;
        totalValues.retefuente = taxesParams.retefuente;
        totalValues.reteica = taxesParams.reteica;
        totalValues.reteiva = taxesParams.reteiva;
        totalValues.total_sale_value += item.totalBuyWithTaxes;
    });
    totalValues.total += stringToFloat(totalValues.sending_charge);
    totalValues.total_sale_value = Number(
        Number(totalValues.total_sale_value + stringToFloat(totalValues.sending_charge) - totalRetentions).toFixed(2)
    );
    return valueTotals.map((item: string) => ({
        value: totalValues[item],
        field: item,
    }));
};

/**
 * This function format totals for Table
 *
 * @param valuesTotal: IGenericRecord - Data total,
 * @param withHoldings?: IGenericRecord[] - Data withholdings,
 * @returns IGenericRecord[]
 */
export const totalsToTable = (valuesTotal: IGenericRecord, withHoldings: IGenericRecord[]): IGenericRecord[] => {
    const totalsInvoice = Object.keys(valuesTotal).map((item: string) => ({
        value: valuesTotal[item],
        field: item,
    }));

    const retefuente = withHoldings.find(item => lowerCase(item.name).includes(TextNameTotals.RETE_FUENTE)) ?? {};
    const reteica = withHoldings.find(item => lowerCase(item.name).includes(TextNameTotals.RETE_ICA)) ?? {};
    const reteiva = withHoldings.find(item => lowerCase(item.name).includes(TextNameTotals.RETE_IVA)) ?? {};

    const totalsWithholdings = [
        {
            value: retefuente?.other_value ?? 0,
            field: TextNameTotals.RETE_FUENTE,
        },
        {
            value: reteica?.other_value ?? 0,
            field: TextNameTotals.RETE_ICA,
        },
        {
            value: reteiva?.other_value ?? 0,
            field: TextNameTotals.RETE_IVA,
        },
    ];

    const filteredTotalsInvoice = totalsInvoice.filter(
        invoice => !totalsWithholdings.some(withholding => withholding.field === invoice.field)
    );

    return [...filteredTotalsInvoice, ...totalsWithholdings];
};

/**
 * fields? to recalculate totals
 */
export const FIELDS_TO_RECALCULATE_TOTALS = ['quantity', 'percentage_discount', 'unit_cost', 'total_charge_amount'];

/**
 * This function condition is reteIVA
 *
 * @param retention: IGenericRecord - retention data,
 * @returns boolean
 */
export const isReteiva = (retention: IGenericRecord): boolean => {
    return retention?.name?.toLowerCase().includes('reteiva');
};

/**
 * This function Format Retentions
 *
 * @param withHoldings: IGenericRecord[] - Withholdings data,
 * @returns ITableTaxesAndRetention[]
 */
export const getTaxesAndRetentionFormat = (withHoldings: IGenericRecord[]): ITableTaxesAndRetention[] => {
    return withHoldings.map((retention: IGenericRecord) => {
        return {
            id: retention.id,
            name: retention.name,
            value: isNaN(retention.other_value) ? 0 : retention.other_value ?? 0,
            percentage: parseInt(retention.percentage),
            base: isNaN(retention.value) ? 0 : retention.other_value ?? 0,
            isTax: false,
            isSelectInput: isReteiva(retention),
        };
    });
};

/**
 * This function Format Products
 *
 * @param products: IGenericRecord[] - Withholdings data,
 * @returns IGenericRecord[]
 */
export const formatBussinesProducts = (products: IGenericRecord[]): IGenericRecord[] => {
    return products.map(data => ({
        number: data.number,
        id: data.id,
        total_buy: data.total_buy,
        reference: data.reference,
        unit_cost: data.unit_cost.value,
        sku_internal: data.sku_internal.value,
        unique_product_name: data.unique_product_name.value,
        unique_products_id: data.unique_products_id,
        warehouse_id: data.warehouse_id,
        warehouse_name: data.warehouse_name.value,
        batch: data.batch_number.value,
        batch_id: data.batch_id,
        input_date_expiration: new Date(data.date_expiration.value).toLocaleDateString(),
        batch_detail_id: data.batch_detail_id,
        date_expiration: data.date_expiration.value,
        description: data.description || '',
        quantity: data.quantity.value,
        unit_measurements_id: data.unit_measurements_id,
        unit_value: data.unit_value.value,
        discount: data.discount.value,
        delivery_cost: data.delivery_cost.value,
        ciiu_id: data.ciiu_id,
        iva: data.iva,
        taxes_invoice:
            data.product_taxes?.map((tax: IGenericRecord) => ({
                id: tax.id,
                unique_product_id: data.unique_products_id,
                company_tax_id: tax.company_tax_id,
                tax_value: tax.tax_value,
                custom_tax_value: tax.custom_tax_value,
                created_at: tax.created_at,
                updated_at: tax.updated_at,
                deleted_at: tax.deleted_at,
                tax_name: tax.tax_name,
                tax_rate: tax.tax_rate,
                tax_rate_name: tax.tax_rate_name,
                is_customized: tax.is_customized,
            })) || [],
        is_product: data.is_product,
        is_inventoriable: data.is_inventoriable,
        percentage: `${data.percentage_discount.value}%`,
        percentage_discount: data.percentage_discount.value,
        check: false,
        text_fields: data.text_fields,
        quantityMax: data.quantity.value,
        unit_measure_milliliters: data.unit_measure_milliliters,
        fieldsWithError: [],
        measurement: data.unit_measurement_name,
        taxes:
            data.product_taxes?.map((tax: IGenericRecord) => ({
                company_tax_id: tax.company_tax_id,
                tax_value: tax.tax_value,
            })) || [],
        is_mandate: data.is_mandate,
        mandate_id: data.mandate_id,
    }));
};

/**
 *
 * @param products: IGenericRecord[] - Products main invoice
 * @param isList: boolean - Check is table list
 * @returns  IGenericRecord[]
 */
export const dataTaxes = (products: IGenericRecord[], isList = false): IGenericRecord[] => {
    const initialTaxes = [
        {
            id: 'daa83c3f-077d-49c8-857e-e6e358d29fc0',
            name: '01 IVA',
            value: 0,
            percentage: 19,
            percentage_string: '19.00%',
            is_tax: true,
            other_value: 0,
        },
        {
            id: 'daa83c3f-077d-49c8-857e-e6e358d29fc1',
            name: '02 IVA',
            value: 0,
            percentage: 16,
            percentage_string: '16.00%',
            is_tax: true,
            other_value: 0,
        },
        {
            id: 'd327ade0-a53c-41c6-a4ef-bdfb62a7258d',
            name: '03 IVA',
            value: 0,
            percentage: 5,
            percentage_string: '5.00%',
            is_tax: true,
            other_value: 0,
        },
        {
            id: 'fa7450cd-7d8e-477c-a5fa-adc10940d6ac',
            name: '04 IVA',
            value: 0,
            percentage: 0,
            percentage_string: 'Exento (0%)',
            is_tax: true,
            other_value: 0,
        },
        {
            id: '0b9849d0-c505-4a53-a4fa-af948dc4de02',
            name: '05 IVA',
            value: 0,
            percentage: 0,
            percentage_string: 'Excluido',
            is_tax: true,
            other_value: 0,
        },
    ];

    products?.forEach((product: IGenericRecord) => {
        if (lengthGreaterThanZero(product?.unique_product_taxes)) {
            const existIVA = discardUntaxed(product?.unique_product_taxes).find(tax => tax.tax_name === IVA) || null;
            initialTaxes.forEach((tax: IGenericRecord) => {
                if (
                    existIVA?.company_tax_id &&
                    tax?.percentage_string?.split('.')[FIRST_POSITION]?.includes(existIVA?.tax_rate_name || existIVA?.tax_rate) &&
                    tax.is_tax
                ) {
                    tax.value += isList
                        ? product.unit_value - product.discount
                        : product.unit_value.value -
                          (typeof product.discount.value === VARIABLE_TYPE.UNDEFINED ? 0 : product.discount.value);
                    tax.other_value = stringToFloat(tax.value * (existIVA.tax_rate / 100));
                    return { ...tax };
                }
                return tax;
            });
        }
    });

    return initialTaxes;
};

export const enabledReteIva = (
    fieldInputs: IGenericRecord,
    tableMain: IGenericRecord[],
    infoCompany?: ICompany | undefined
): boolean => {
    const isReteIva = fieldInputs?.fiscal_responsibility?.value?.filter((responsibility: IGenericRecord) =>
        String(responsibility.fiscal_responsibility_name || responsibility.name).includes('O-23 Agente de retención IVA')
    );
    const isProductsIva = tableMain?.filter(x => String(x.iva).includes('19') || String(x.iva).includes('5'));
    const isMeReteIva = infoCompany !== undefined ? infoCompany.fiscal_responsibilities.filter(x => x.code.includes('O-15')) : [];
    return lengthGreaterThanZero(isProductsIva) && lengthGreaterThanZero(isReteIva) && !lengthGreaterThanZero(isMeReteIva);
};

export const dataWithHoldings = (
    withHoldings?: IGenericRecord[],
    products?: IGenericRecord[],
    removeReteica = false
): IGenericRecord[] => {
    const retentions = [
        {
            id: 6,
            name: '06 Retefuente',
            value: 0,
            percentage: 0,
            is_tax: false,
            other_value: 0,
        },
        {
            id: 7,
            name: '07 ReteICA',
            value: 0,
            percentage: 0,
            is_tax: false,
            other_value: 0,
        },
        {
            id: 8,
            name: '08 ReteIVA',
            value: 0,
            percentage: 0,
            is_tax: false,
            other_value: 0,
        },
    ];

    const currentRetentions = !removeReteica
        ? retentions
        : retentions.filter(item => item?.name?.toLowerCase() !== RETE_ICA.toLowerCase());

    return currentRetentions.map(tax => {
        let value = 0;
        let other_value = 0;
        const { percentage } = withHoldings?.find(item => item?.name?.toLowerCase() === tax?.name?.toLowerCase()) || {
            percentage: 0,
        };
        const validatePercentage =
            typeof percentage === VARIABLE_TYPE.STRING ? stringToFloat(String(percentage)?.replaceAll('%', '')) : percentage;
        products?.forEach(({ total_iva, total_buy }) => {
            value += tax.name === RETEIVA ? total_iva : total_buy;
            other_value = stringToFloat((value * validatePercentage) / 100);
        });
        return { ...tax, value, percentage, other_value };
    });
};

/**
 *
 * @param data_main_table: IGenericRecord[] - Data main table
 * @param data_taxes: IGenericRecord[] - Data taxes
 * @param fields?_tax_table: IGenericRecord - Tax table fields? data
 * @param fields?: IGenericRecord - Data fields?
 * @param fields?_tax_table: IGenericRecord - Data fields? main table
 * @param totalValues: boolean - Check total values
 * @param other_value: boolean - Check other values
 * @returns ElectronicDocumentProps
 */
export const electronicDocumentProps = ({
    data_main_table = [],
    data_taxes = [],
    fields_tax_table = {},
    fields = {},
    fields_main_table = {},
    totalValues = true,
    other_fields = false,
}: IGenericRecord): IElectronicDocumentProps => {
    return {
        valueTotals: [],
        totalValues,
        data_taxes,
        data_main_table,
        fields: isObjEmpty(fields) ? init_fields_correction : fields,
        fields_tax_table: isObjEmpty(fields_tax_table) ? init_fields_tax_table_corrections : fields_tax_table,
        fields_main_table: isObjEmpty(fields_main_table) ? init_fields_table_corrections : fields_main_table,
        route: '#',
        symbol: '$',
        reason_rejection: false,
        delete_elements: false,
        addProductService: false,
        other_fields,
    };
};

/**
 * fields? basic validations
 */
export const BASIC_FIELDS = ['sku_internal', 'unique_product_name', 'quantity', 'unit_cost', 'percentage_discount'];

/**
 * fields? warehouse validation
 */
export const WAREHOUSE_FIELDS = ['warehouse_name', 'batch_number', 'date_expiration'];

/**
 * Specific name field
 */
export const WAREHOUSE_NAME = 'warehouse_name';
