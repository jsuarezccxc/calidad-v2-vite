import { Dispatch, SetStateAction } from 'react';
import { IGenericRecord } from '@models/GenericRecord';
import { IInvoiceDetails } from '@models/ElectronicInvoice';
import { IOptionSelect } from '@components/input';
import { IOption } from '@components/select-search';
import { lengthGreaterThanZero } from '@utils/Length';
import { multiOptionsSelect } from '@utils/ElectronicNote';
import { buildOptions } from '@utils/Company';
import { ONE } from '@constants/ElectronicInvoice';
import { INIT_VALUE_PERCENTAGE } from '@constants/CancellationElectronic';

export { TableInvoice } from './TableInvoice';

/**
 * Props defaults to inputs type number
 */
export const defaultPropsInputNumber = {
    inputClass: 'number-input-style',
    allowLeadingZeros: false,
    allowNegative: false,
    withIcon: false,
};

/**
 * This interface is state selected
 *
 * @typeParam id: string - Id product
 */
export interface ISelected {
    id: string;
}

/**
 * This interface is for field mapping options
 *
 * @typeParam noteDetails: IGenericRecord[] - Note details
 * @typeParam invoiceDetails: IGenericRecord[] -  Invoice details
 * @typeParam products: IGenericRecord[] - Products by company
 * @typeParam isDebitNote: boolean - If debit note
 * @typeParam addMoreProducts?: boolean - If debit note
 * @typeParam suppliers?: IGenericRecord[] - Mandate
 */
interface IOptionsForProducts {
    noteDetails: IInvoiceDetails[];
    invoiceDetails: IGenericRecord[];
    products: IGenericRecord[];
    addMoreProducts?: boolean;
    suppliers?: IGenericRecord[];
}

/**
 * This interface is for the create options parameter
 *
 * @typeParam addMoreProducts: boolean - If debit note
 * @typeParam noteDetails: IInvoiceDetails[] - Electronic document
 * @typeParam invoiceDetails: IGenericRecord[] - Invoice details
 * @typeParam key?: string - Key to create options
 */
interface IParamsOptions {
    addMoreProducts?: boolean;
    noteDetails: IInvoiceDetails[];
    invoiceDetails: IGenericRecord[];
    key?: string;
}

/**
 * This interface is required table fields
 *
 * @typeParam fields: string[][] - Fields keys
 * @typeParam messages: string[] - Messages error
 */
export interface IRequiredFieldsTable {
    fields: string[][];
    messages: string[];
}

/**
 * This interface is param to handle change in table
 * 
 * @typeParam target: any - Event to change
 * @typeParam field: string - Field name
 * @typeParam index: number - Index data
 */
export interface IHandleParam {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    target: any;
    field: string;
    index: number;
}

/**
 * This interface table invoice props
 *
 * @typeParam id: string - Optional identifier
 * @typeParam data: IInvoiceDetails[] - Data table
 * @typeParam selected: ISelected[] - Selected ID
 * @typeParam setSelected: Dispatch<SetStateAction<ISelected[]>> - Set state ID
 * @typeParam onChangeTable: (e: any, item: IInvoiceDetails, index: string) => void - Handle change
 * @typeParam addProductService?: () => void - Add new item
 * @typeParam deleteProduct: () => void - Delete item
 * @typeParam options: IOptionsTableNote - Options table
 * @typeParam redirectRoute: string - Redirect page
 * @typeParam showAddProduct: boolean - Show add item
 * @typeParam warningsStock?: string[] - Warning Stock
 * @typeParam requiredFieldsTable?: IRequiredFieldsTable - Required fields
 * @typeParam className?: string - Custom class
 * @typeParam isMandate?: boolean - If need show mandate column
 * @typeParam symbol: string - Currency symbol
 */
export interface ITableInvoiceProps {
    id?: string;
    data: IInvoiceDetails[];
    selected: ISelected[];
    setSelected: Dispatch<SetStateAction<ISelected[]>>;
    onChangeTable: (param: IHandleParam) => void;
    addProductService?: () => void;
    deleteProduct: () => void;
    options: IOptionsTable;
    redirectRoute: string;
    showAddProduct: boolean;
    warningsStock?: string[];
    requiredFieldsTable?: IRequiredFieldsTable;
    className?: string;
    isMandate?: boolean;
    symbol: string;
}

/**
 * This interface is options table
 *
 * @typeParam sku: IOption[] - SKU options
 * @typeParam warehouse: IOptionSelect[][] - Warehouse options
 * @typeParam batch: IOptionSelect[][] - Batch options
 * @typeParam date: IOptionSelect[][] - Date options
 * @typeParam suppliers: IOptionSelect[] - Mandate options
 */
export interface IOptionsTable {
    sku: IOption[];
    warehouse: IOptionSelect[][];
    batch: IOptionSelect[][];
    date: IOptionSelect[][];
    suppliers: IOptionSelect[];
}

/**
 * This function create options in detail invoice
 *
 * @param products: IGenericRecord[] - List products
 * @param param: IParamsOptions - IParamsOptions
 * @returns IOption[]
 */
const buildOptionSearch = (
    products: IGenericRecord[],
    { addMoreProducts, invoiceDetails, noteDetails }: IParamsOptions
): IOption[] => {
    const buildOptions = products.flatMap(({ stock, ...item }) => {
        let times = 0;
        if (Array.isArray(stock)) {
            stock.forEach((warehouse: IGenericRecord) => {
                times += warehouse.batch.length || ONE;
            });
        } else times += ONE;
        const timesDetails = noteDetails.filter(detail => detail.id === item.id).length;
        if (times === timesDetails) return [];
        return {
            name: `${item.sku_internal} - ${item.name}`,
            value: item.id,
        };
    });
    if (!addMoreProducts && lengthGreaterThanZero(invoiceDetails)) {
        return buildOptions.filter(
            ({ value }) =>
                invoiceDetails?.some(({ unique_products_id }) => unique_products_id === value) &&
                !noteDetails.some(({ unique_products_id }) => unique_products_id === value)
        );
    }
    return buildOptions;
};

/**
 * Create fields inputs for table product
 *
 * @param param: IOptionsForProducts - Param for build options
 * @returns IFields
 */
export const buildOptionsTable = ({
    noteDetails,
    products,
    suppliers = [],
    ...moreParam
}: IOptionsForProducts): IOptionsTable => {
    const { multiWarehouse, multiBatch, multiDates } = multiOptionsSelect(products, noteDetails);
    return {
        sku: buildOptionSearch(products, { ...moreParam, key: 'sku_internal', noteDetails }),
        warehouse: multiWarehouse,
        batch: multiBatch,
        date: multiDates,
        suppliers: buildOptions(suppliers),
    };
};

/**
 * Template add product detail in table main
 */
export const ADD_PRODUCT_SERVICE: IInvoiceDetails = {
    id: '',
    number: '',
    sku_internal: '',
    reference: '',
    batch_detail_id: '',
    batch_id: '',
    batch_number: '',
    date_expiration: '',
    warehouse_id: '',
    warehouse_name: '',
    description: '',
    quantity: 0,
    is_mandate: false,
    mandate_id: null,
    mandate: null,
    unit_value: 0,
    unit_measurements_id: '',
    unit_measurement_name: '',
    sale: 0,
    discount: 0,
    delivery_cost: 0,
    total_buy: 0,
    impoconsumption: INIT_VALUE_PERCENTAGE,
    iva: INIT_VALUE_PERCENTAGE,
    ciiu_id: '',
    is_inventoriable: false,
    is_product: false,
    taxes: [],
    unique_product_name: '',
    unique_products_id: '',
    unit_cost: 0,
    product_taxes: [],
    unit_measure_milliliters: 0,
    text_fields: {
        warehouse: '',
        batch: '',
        date_expiration: NaN,
    },
    new_product: false,
    percentage_discount: 0,
    quantity_max: 0,
    checked: false,
};
