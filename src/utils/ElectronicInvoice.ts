import { NumberFormatValues } from 'react-number-format';
import dayjs from '@utils/Dayjs';
import { IOptionSelect, IPropsInput } from '@components/input';
import { IDataTableTotals } from '@components/table-totals';
import { COLOMBIA } from '@constants/Location';
import { VARIABLE_TYPE } from '@constants/DataTypes';
import { SPECIAL_TAX, TAX_NAME_IVA } from '@constants/Tax';
import { IBUA, TypeTransaction } from '@constants/BuildProduct';
import { NATURAL_RESPONSIBILITIES, DEFAULT_TYPE_PRODUCT } from '@constants/ElectronicInvoice';
import {
    CREDIT_NOTE,
    DATA_TABLE_TOTALS,
    DATA_TAXES,
    DATA_WITHHOLDINGS,
    DEBIT_NOTE,
    EDIT_INPUTS,
    FIFTEEN,
    KEYS_TOTALS,
    MESSAGE_RETENTIONS,
    NA,
    ONE_HUNDRED,
    THIRTY_THREE,
    TWENTY,
    TWO,
    textBusinessDays,
    ITEM_TABLE_TOTAL,
    LABELS_TOTAL_TAXES,
    INVOICE_CALCULATES,
    ADJUSTMENT_NOTE,
} from '@constants/ElectronicInvoice';
import { ZERO } from '@constants/Numbers';
import { IGenericRecord } from '@models/GenericRecord';
import { ITaxesProductsStock } from '@models/Inventory';
import {
    IChangePercentageDiscount,
    IInvoiceCalculates,
    IInvoiceDetails,
    ITableTaxesAndRetention,
    ITaxesTableInvoice,
    ITotalInvoiceDetails,
    ITotalTaxes,
    ITotalTaxesIva,
    InvoiceDetailsTaxes,
    KeysInvoiceCalculates,
} from '@models/ElectronicInvoice';
import { buildOptions } from './Company';
import { discountOfValue, ivaDiscount } from './Number';
import { calculateTotal } from './Calculate';
import { assignValue, createNewJson } from './Json';
import { getDateFormatUnix, nextBusinessDay } from './Date';
import { lengthEqualToZero, lengthGreaterThanZero } from './Length';

export const toggleWithholdings = (withholdings: IGenericRecord[], retention: string): IGenericRecord[] => {
    return withholdings?.map(withholding =>
        withholding.name === retention ? { ...withholding, is_active: !withholding.is_active } : withholding
    );
};

export const retentionIsSelected = (withholdings: IGenericRecord[] = [], retention: string): boolean => {
    return withholdings.find(withholding => withholding.name === retention)?.is_active || false;
};

/**
 * This const is validate fields in invoice details
 *
 * @param productFilter: IGenericRecord - Product company
 * @param productSale: IGenericRecord - Product to sale
 * @returns { warehouse_name: string; batch_number: string; date_expiration: string }
 */
export const validateTypeProduct = (
    productFilter: IGenericRecord,
    productSale = DEFAULT_TYPE_PRODUCT
): { warehouse_name: string; batch_number: string; date_expiration: string } => {
    const { product, is_inventoriable, stock } = productFilter;
    const typeProduct = createNewJson(productSale);
    if (product.is_product) {
        if (is_inventoriable && lengthGreaterThanZero(stock)) {
            return typeProduct;
        }
        if (product?.product_type?.is_perishable && !lengthGreaterThanZero(stock)) {
            return {
                ...typeProduct,
                warehouse_name: EDIT_INPUTS.WAREHOUSE_INPUT,
            };
        }
    }
    return {
        ...typeProduct,
        warehouse_name: NA,
        batch_number: NA,
        date_expiration: NA,
    };
};

export const changesTypeInput = (warehouse: string): boolean => warehouse === EDIT_INPUTS.WAREHOUSE_INPUT;

export const validateIsTypeInput = (productDetail: IGenericRecord): string =>
    !productDetail?.text_fields?.warehouse ? productDetail.warehouse_name || NA : EDIT_INPUTS.WAREHOUSE_INPUT;

/**
 * This function validate stock for product
 *
 * @param dataTable: IInvoiceDetails[] - Invoice details
 * @returns string[]
 */
export const validateErrorStock = (dataTable: IInvoiceDetails[]): string[] => {
    const errorsQuantity: string[] = [];
    dataTable.forEach(({ sku_internal, warehouse_name, ...item }) => {
        if (
            sku_internal &&
            item.quantity &&
            item.is_product &&
            item.is_inventoriable &&
            warehouse_name &&
            warehouse_name !== NA
        ) {
            const quantityWarehouse = stringToFloat(item.quantity_max);
            const quantityProduct = stringToFloat(item.quantity);
            if (quantityWarehouse < 0) {
                errorsQuantity.push(
                    `No tiene cantidades disponibles del producto ${sku_internal} en su inventario. Tenga en cuenta trasladar o comprar mínimo ${
                        Math.abs(quantityWarehouse) + quantityProduct
                    } unidades de este producto para la bodega ${warehouse_name} después de finalizar esta venta.`
                );
                return;
            }
            if (quantityProduct > quantityWarehouse) {
                errorsQuantity.push(
                    `Hay ${Intl.NumberFormat().format(quantityWarehouse)} cantidades disponibles del producto ${sku_internal}`
                );
            }
        }
    });
    return errorsQuantity;
};

export const invoiceDetailsRequest = (products: IGenericRecord[]): IGenericRecord[] =>
    products.map(({ mandate_id, discount, ...product }) => ({
        ...product,
        mandate_id,
        discount: stringToFloat(discount),
        ...(mandate_id === NA ? { mandate_id: null, mandate: null } : {}),
    }));

export const replaceInputs = (value: string, search = '.', replaces = ''): string => String(value).replaceAll(search, replaces);

export const stringToFloat = (value: string | number): number => {
    if (typeof value === 'number') return value;
    return Number(replaceInputs(replaceInputs(value), ',', '.'));
};

export const filterTypeTransactionProduct = (products: IGenericRecord[], typeTransaction: TypeTransaction): IGenericRecord[] =>
    products.filter(({ product: { type_transaction } }: IGenericRecord) => type_transaction !== typeTransaction);

export const dateFormat = 'YYYY-MM-DD';

export const sortOptionBatch = (optionBatch: IOptionSelect[]): IOptionSelect[] => {
    return [...optionBatch].sort((aOption, bOption) => {
        const [, numberA] = aOption.value.split(' ');
        const [, numberB] = bOption.value.split(' ');
        if (stringToFloat(numberA) < stringToFloat(numberB)) return -1;
        if (stringToFloat(numberA) > stringToFloat(numberB)) return 1;
        return 0;
    });
};

export const columnClass = (value: string, disabled: boolean): string =>
    disabled || String(value).includes(NA) ? 'text-gray' : 'text-gray-dark';

export const defaultPercentageValue: NumberFormatValues = {
    floatValue: NaN,
    formattedValue: '',
    value: '',
};

export const defaultPercentageInput = (name: string, floatValue: number | undefined): IChangePercentageDiscount => ({
    name,
    values: { ...defaultPercentageValue, ...(typeof floatValue !== VARIABLE_TYPE.UNDEFINED ? { floatValue } : {}) },
});

export const filterOptionReasonRejections = (reasonRejections: IGenericRecord[] = [], typeNote: string): IOptionSelect[] =>
    buildOptions(
        changeUltimateItem(
            reasonRejections.filter(
                item =>
                    (typeNote.includes(DEBIT_NOTE) && item.code_debit_note) ||
                    (typeNote.includes(CREDIT_NOTE) && item.code_credit_note) ||
                    (typeNote.includes(ADJUSTMENT_NOTE) && item.code_adjustment_note)
            )
        )
    );

export const changeUltimateItem = (array: IGenericRecord[] = []): IGenericRecord[] => {
    if (lengthEqualToZero(array)) return [];
    const itemUltimate = array[array.length - 1];
    const arrayFinal = [...array];
    arrayFinal.pop();
    return [itemUltimate, ...arrayFinal];
};

export const validateDateLimit = (days?: number, typeDays?: string): string => {
    if (!days || !typeDays) return '';
    return typeDays === textBusinessDays
        ? nextBusinessDay(String(addDaysDate(0)), days)
        : getDateFormatUnix(String(addDaysDate(days))).formatYearMonthDay || '';
};

/**
 * This function calculates tax details
 *
 * @param uniqueProductTaxes: ITaxesProductsStock[] - Product's tax
 * @param total: number - Total buy
 * @returns ITaxesTableInvoice[]
 */
export const buildTaxesInvoiceDetails = (uniqueProductTaxes: ITaxesProductsStock[] = [], total: number): ITaxesTableInvoice[] =>
    uniqueProductTaxes.map(tax => ({
        ...tax,
        total,
    }));

/**
 * This function search product's tax
 *
 * @param keyValue: string - Name's tax
 * @param uniqueProductTaxes: Product's tax
 * @returns ITaxesTableInvoice
 */
export const findTaxInvoiceDetail = (keyValue: string, uniqueProductTaxes: ITaxesProductsStock[] = []): ITaxesProductsStock => {
    return (
        uniqueProductTaxes.find(({ tax_name }) => tax_name === keyValue) || {
            company_tax_id: '',
            tax_name: keyValue,
            tax_rate: 0,
            tax_value: 0,
            custom_tax_value: 0,
            unique_product_id: '',
            id: '',
            is_customized: false,
            tax_rate_name: '',
        }
    );
};

/**
 * This function is to create the tax per unit column information
 *
 * @param param0: ITaxesProductsStock - Unique product taxes
 * @param param1: Record<string, number> - Values to calculate
 * @returns string
 */
export const taxInformationForTables = (
    { tax_rate_name, tax_name, tax_value, tax_rate }: ITaxesProductsStock,
    { quantity, sale_value }: Record<string, number>
): string => {
    return TAX_NAME_IVA.includes(tax_rate_name || '')
        ? tax_rate_name || ''
        : `${Intl.NumberFormat('es-CO', { minimumFractionDigits: 2 }).format(
              tax_name === IBUA ? tax_value * quantity : (sale_value * tax_rate) / 100
          )}`;
};

/**
 * This function converts an event to number format
 *
 * @param value: string - Value
 * @returns NumberFormatValues
 */
export const eventToNumber = (value = ''): NumberFormatValues => ({
    floatValue: value ? stringToFloat(value) : NaN,
    formattedValue: value,
    value,
});

/**
 * This function is to assign the calculations for the tablets of the electronic document
 *
 * @param document: IGenericRecord - Electronic document
 * @param isInvoice: Boolean - Optional param for type document
 * @returns { tableTotals: IDataTableTotals[]; taxes: ITableTaxesAndRetention[]; withholdings: ITableTaxesAndRetention[] }
 */
export const assignDocument = (
    document: IGenericRecord,
    isInvoice = false
): { tableTotals: IDataTableTotals[]; taxes: ITableTaxesAndRetention[]; withholdings: ITableTaxesAndRetention[] } => {
    const assignTotals = assignValue({ tree: {}, base: KEYS_TOTALS }, document);
    return {
        tableTotals: DATA_TABLE_TOTALS({ isInvoice }).map(item => {
            return {
                ...item,
                value: assignTotals[item.field],
            };
        }),
        taxes: [...DATA_TAXES].map(item => {
            const { base = 0, value = 0 } =
                document.taxes.find(({ name }: ITableTaxesAndRetention) => name.includes(item.name)) || {};
            return {
                ...item,
                base,
                value,
            };
        }),
        withholdings: [...DATA_WITHHOLDINGS()].map(item => {
            const {
                base = 0,
                percentage = 0,
                value = 0,
            } = document.withholdings.find(({ name }: ITableTaxesAndRetention) => name.includes(item.name)) || {};
            return {
                ...item,
                base,
                percentage: stringToFloat(percentage),
                value,
            };
        }),
    };
};

/**
 * This function discard taxes
 *
 * @param taxes: ITaxesProductsStock[] - Product taxes
 * @returns ITaxesProductsStock[]
 */
export const discardUntaxed = (taxes: ITaxesProductsStock[] = []): ITaxesProductsStock[] =>
    [...taxes].filter(
        ({ tax_rate_name, tax_rate }: ITaxesProductsStock) => !SPECIAL_TAX.UNTAXED.includes(tax_rate_name || String(tax_rate))
    );

/**
 * This function validate percentage in table withholdings
 *
 * @param percentage: number - Value percentage
 * @param max: number - Maximum value percentage
 * @param country: string - Country client
 * @returns string
 */
export const validatePercentageWithHoldings = (percentage: number, max: number, country = COLOMBIA): string => {
    if (max === THIRTY_THREE)
        if ((percentage > TWENTY && country === COLOMBIA) || percentage > THIRTY_THREE) return MESSAGE_RETENTIONS.RETE_FUENTE;
    if (percentage && ![FIFTEEN, ONE_HUNDRED].includes(percentage) && max === ONE_HUNDRED) return MESSAGE_RETENTIONS.RETE_IVA;
    if (percentage > TWO && max === TWO) return MESSAGE_RETENTIONS.RETE_ICA;
    return '';
};

/**
 * This const is validate retentions
 */
const [FUENTE, ICA, IVA] = ['fuente', 'ica', 'iva'];

/**
 * This function is for validate retentions
 *
 * @param retentions: ITableTaxesAndRetention[] - Optional param retentions
 * @param country: string - Optional param country
 * @returns string[]
 */
export const validateTableRetentions = (retentions: ITableTaxesAndRetention[] = [], country = ''): string[] =>
    retentions.map(({ name, percentage }) => {
        const nameRetention = name.toLowerCase();
        if (nameRetention.includes(FUENTE)) return validatePercentageWithHoldings(percentage, THIRTY_THREE, country);
        if (nameRetention.includes(ICA)) return validatePercentageWithHoldings(percentage, TWO, country);
        if (nameRetention.includes(IVA)) return validatePercentageWithHoldings(percentage, ONE_HUNDRED, country);
        return '';
    });

/**
 * This function is for totals by invoice details
 *
 * @param invoiceDetails: IInvoiceDetails[] - Invoice details
 * @returns ITotalInvoiceDetails
 */
export const getTotalsByInvoiceDetails = (invoiceDetails: IInvoiceDetails[]): ITotalInvoiceDetails => {
    let totalBuy = 0;
    let totalIVA = 0;
    invoiceDetails.forEach(({ total_buy, product_taxes }) => {
        const { tax_rate = 0 } = product_taxes?.find(({ tax_name }) => tax_name === IVA.toUpperCase()) || {};
        totalIVA += (total_buy * tax_rate) / 100;
        totalBuy += total_buy || 0;
    });
    return {
        totalBuy,
        totalIVA,
    };
};

/**
 * This function update state table retention
 *
 * @param tableRetention: ITableTaxesAndRetention[] - Table retention
 * @param param1: ITotalInvoiceDetails - Totals by invoice details
 * @returns ITableTaxesAndRetention[]
 */
export const updateTableRetentions = (
    tableRetention: ITableTaxesAndRetention[],
    { totalBuy, totalIVA }: ITotalInvoiceDetails
): ITableTaxesAndRetention[] =>
    tableRetention.map(item => {
        if (item.name.includes(IVA.toUpperCase())) {
            return {
                ...item,
                base: totalIVA,
                value: (totalIVA * item.percentage) / 100,
            };
        }
        return {
            ...item,
            base: totalBuy,
            value: (totalBuy * item.percentage) / 100,
        };
    });

/**
 * This function update calculate table taxes
 *
 * @param invoiceDetails: IGenericRecord[] - Invoice details
 * @param invoiceCalculations: IInvoiceCalculates - Totals by back-end
 * @param key: string - Optional param key product taxes
 * @returns ITableTaxesAndRetention[]
 */
export const updateTableTaxes = (
    invoiceDetails: IGenericRecord[],
    invoiceCalculations: IInvoiceCalculates,
    key = 'product_taxes'
): ITableTaxesAndRetention[] =>
    DATA_TAXES.map(({ percentage, ...item }, index) => {
        return {
            ...item,
            percentage,
            base: calculateTotal(
                invoiceDetails.flatMap(detail => {
                    if (
                        detail[key]?.some(
                            ({ tax_name, tax_rate, tax_rate_name }: ITaxesProductsStock) =>
                                tax_name === IVA.toUpperCase() &&
                                (item?.isLabel
                                    ? item.label?.includes(!tax_rate_name ? String(tax_rate) : tax_rate_name)
                                    : tax_rate_name?.includes(String(percentage)) || tax_rate === percentage)
                        )
                    ) {
                        return detail.total_buy;
                    }
                    return [0];
                })
            ),
            value: invoiceCalculations.total_taxes_iva[`0${index + 1}` as keyof ITotalTaxesIva],
        };
    });

/**
 * This const is validate taxes
 */
const TAXES = ['IVA_0', 'IVA_EXCLUIDO', 'INC_0'];
const FOUR = 4;

/**
 *
 * @param param0: IInvoiceCalculates - Param with object totals
 * @param isInvoice: boolean - Optional param
 * @param isSupportOrDocument: boolean - Optional param
 * @returns IDataTableTotals[]
 */
export const updateTableTotals = (
    { total_taxes = { ...INVOICE_CALCULATES.total_taxes }, ...invoiceCalculations }: IInvoiceCalculates,
    isInvoice = false,
    isSupportOrDocument = false,
    isPurchaseInvoice = false
): IDataTableTotals[] => {
    const tableTotals: IDataTableTotals[] = [];
    const initTotal = DATA_TABLE_TOTALS({ isInvoice, isSupportOrDocument, isPurchaseInvoice });
    for (let index = 0; index < initTotal.length; index++) {
        if (index === FOUR) {
            Object.keys(total_taxes).forEach(key => {
                const value = total_taxes[key as keyof ITotalTaxes] || ZERO;
                if (!!value || TAXES.includes(key))
                    tableTotals.push({ ...ITEM_TABLE_TOTAL, field: key, title: LABELS_TOTAL_TAXES[key], value });
            });
        }
        const item = initTotal[index];
        tableTotals.push({ ...item, value: invoiceCalculations[item.field as keyof KeysInvoiceCalculates] });
    }
    return tableTotals;
};

/**
 * Calculate the sale value
 *
 * @param item: IInvoiceDetails - Optional param
 * @returns IGenericRecord
 */
export const calculatorDetail = (item: IInvoiceDetails): IGenericRecord => {
    const quantity = stringToFloat(item.quantity),
        sendCost = stringToFloat(item.delivery_cost || 0),
        unitValue = stringToFloat(item.unit_cost);
    const unit_value = unitValue * quantity;
    const discount = discountOfValue(unit_value, item.percentage_discount || 0);
    const saleDiscount = unit_value - discount;
    const total_buy = saleDiscount + sendCost;

    return {
        unit_value,
        total_buy,
        discount,
    };
};

/**
 * Function that indicates if a hold is selected
 *
 * @param withholdings: IGenericRecord[] - Withholding list
 * @returns boolean
 */
export const hasAWithholding = (withholdings: IGenericRecord[]): boolean => withholdings.some(item => item.is_active);

/**
 * This function validates empty responsibilities
 *
 * @param fiscalResponsibilities: IGenericRecord[] - Added Fiscal responsibilities
 * @returns boolean
 */
export const validateEmptyResponsibilities = (fiscalResponsibilities: IGenericRecord[]): boolean => {
    return fiscalResponsibilities.some(({ name, number_resolution: resolution = '', withholdings = [] }) => {
        if (!NATURAL_RESPONSIBILITIES.includes(name)) return !String(resolution);
        return !name || (withholdings.length && !hasAWithholding(withholdings));
    });
};

/**
 * This returns the document type
 *
 * @param utils: IGenericRecord - Data with the fields used in the form
 * @param documentId: string - Document id
 * @returns string
 */
export const getDocumentType = (utils: IGenericRecord, documentId = ''): string => {
    return utils?.document_types?.find(({ id }: IGenericRecord) => id === documentId)?.value ?? '';
};

/**
 * Get taxes percentage
 *
 * @param taxes: ITaxesProductsStock - Optional param
 * @param typeTax: string - param type tax
 * @param index: keyof ITaxesProductsStock - Optional param
 * @returns ITaxesProductsStock
 */
export const getTaxes = (
    taxes: ITaxesProductsStock[] = [],
    typeTax: string,
    index: keyof ITaxesProductsStock = 'tax_name'
): ITaxesProductsStock =>
    taxes.find(item => item[index] === typeTax) || {
        company_tax_id: '',
        custom_tax_value: 0,
        id: '',
        is_customized: false,
        tax_name: '',
        tax_rate: 0,
        tax_rate_name: '',
        tax_value: 0,
        unique_product_id: '',
    };

/**
 * This function converts the unit cost to details
 *
 * @param param0: IGenericRecord - Object with unit_value and is_include_tax
 * @param uniqueProductTaxes: ITaxesProductsStock[] - Unique product taxes
 * @returns number
 */
export const unitCostToDetails = (
    { unit_value, is_include_tax }: IGenericRecord,
    uniqueProductTaxes: ITaxesProductsStock[]
): number => {
    if (is_include_tax) return unit_value;
    const { tax_rate } = getTaxes(uniqueProductTaxes, IVA);
    return ivaDiscount(unit_value, tax_rate);
};

/**
 * Returns a function that adjusts the tax_value of an InvoiceDetailsTaxes object based on the given foreign exchange rate.
 *
 * @param foreignRate: number (optional) - The foreign exchange rate to divide the tax_value by. Defaults to 0.
 * @returns (param: InvoiceDetailsTaxes) => InvoiceDetailsTaxes - A function that returns the updated object with adjusted tax_value.
 */
export const valueToRate =
    (foreignRate = 0): ((param: InvoiceDetailsTaxes) => InvoiceDetailsTaxes) =>
    ({ tax_value, ...value }: InvoiceDetailsTaxes): InvoiceDetailsTaxes => ({
        ...value,
        tax_value: foreignRate ? tax_value / foreignRate : tax_value,
    });

/**
 * Generates input props for the "Tipo de contribuyente" field based on validation and context.
 *
 * @param validate: boolean - Indicates if validation is required for the field.
 * @param isClient: boolean - Defines whether the user is a client (removes required marking if true).
 * @param value: string (optional) - The current value of the field to check if it's empty.
 * @returns Pick<IPropsInput, 'labelText' | 'required'> - The label and optional required flag for the input.
 */
export const propsToPersonType = (
    validate: boolean,
    isClient: boolean,
    value = ''
): Pick<IPropsInput, 'labelText' | 'required'> => {
    const labelText = 'Tipo de contribuyente:';
    if (isClient)
        return {
            labelText,
        };
    return {
        labelText: `*${labelText}`,
        required: validate && !value,
    };
};

/**
 * Function that returns the modal text
 *
 * @param documents: IGenericRecord[] - Object with electronic documents
 * @returns string
 */
export const documentText = (documents: IGenericRecord[]): string => {
    const documentArray: string[] = [];

    documents?.forEach((document: IGenericRecord) => {
        documentArray.push(`${document?.invoice_type} - ${document?.invoice_number}`);
    });

    return documentArray.join(', ');
};

/**
 * Function that returns the invoice url
 *
 * @returns IGenericRecord
 */
export const getInvoiceUrl = (): IGenericRecord => {
    const url = new URL(document.URL);
    return {
        invoice: url.searchParams.get('invoice'),
        dateNotification: url.searchParams.get('date'),
    };
};

/**
 * Format to obtain the codes of each ciuu separated by commas
 *
 * @returns string
 */
export const formatMultipleCodes = (ciuus: IGenericRecord[], isFiscal?: boolean): string => {
    let ciuusString = '';
    ciuus.map((ciuu: IGenericRecord, index: number) => {
        ciuusString += `${ciuu.code}${ciuus.length === index + 1 ? '' : isFiscal ? ';' : ','}`;
    });
    return String(ciuusString);
};

/**
 * This function adds days to a date
 *
 * @param days: number: Days
 * @returns Date
 */
export const addDaysDate = (days: number): Date => {
    const currentDate = new Date();
    const initialDate = currentDate.setDate(currentDate.getDate() + days);
    const date = new Date(initialDate);
    return date;
};

/**
 * This function returns a date after 9 days
 *
 * @returns Date
 */
export const getPreviousDays = (): Date => {
    const currentDate = new Date();
    const initialDate = currentDate.setDate(currentDate.getDate() - 9);
    const date = new Date(initialDate);
    return date;
};

/**
 * Create data for time
 * @param time: IGenericRecord -  Param object
 * @returns string
 */
export const getTimeIssue = (time?: IGenericRecord, format = 'HH:mm:ss'): string => {
    const now = dayjs();
    if (!time) return now.format(format);

    const rawHour = Number(time.hour ?? 0);
    const minutes = Number(time.minutes ?? 0);
    const meridiem = String(time.schedule ?? '').toLowerCase();

    const hour24 = meridiem === 'pm' ? (rawHour % 12) + 12 : rawHour % 12; // am

    return now.set('hour', hour24).set('minute', minutes).set('second', 0).format(format);
};
