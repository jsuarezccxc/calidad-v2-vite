import React, { Dispatch, SetStateAction } from 'react';
import { v4 as uuid } from 'uuid';
import dayjs from '@utils/Dayjs';
import { SelectedOption } from 'react-select-search';
import { getPreviousDays } from '@utils/ElectronicInvoice';
import { formatInitialNumber } from '@utils/Decimals';
import { IOptionSelect } from '@components/input';
import { IPaginatorProps } from '@components/paginator';
import { IFields } from '@components/electronic-document';
import { IModalTypeProps } from '@components/modal-custom';
import { ChangeEvent as ChangeEventTable } from '@components/radiobutton';
import { assignValue } from '@utils/Json';
import { validateEmail, validateNit } from '@utils/Validation';
import { calculatePercentage, ivaDiscount } from '@utils/Number';
import { lengthEqualToZero, lengthGreaterThanZero } from '@utils/Length';
import { currentDateInUnix, getDateFromUnix, getDateToString } from '@utils/Date';
import {
    changeUltimateItem,
    dateFormat,
    discardUntaxed,
    findTaxInvoiceDetail,
    sortOptionBatch,
    stringToFloat,
} from '@utils/ElectronicInvoice';
import {
    EDIT_INPUTS,
    MaxLengthFields,
    MAX_NUMBER_SIX,
    VALUE_ZERO,
    INVOICE,
    NA,
    RadioButtonName,
} from '@constants/ElectronicInvoice';
import { PERCENTAGE } from '@constants/Tax';
import { COLOMBIA } from '@constants/Location';
import { TitleButtons } from '@constants/Buttons';
import { ActionType } from '@constants/ActionType';
import { keysCustomer } from '@constants/Customer';
import { INC, IVA } from '@constants/BuildProduct';
import { VARIABLE_TYPE } from '@constants/DataTypes';
import { VALIDATIONS_INVOICES } from '@information-texts/ElectronicInvoice';
import { IGenericRecord } from '@models/GenericRecord';
import { ITaxesProductsStock } from '@models/Inventory';
import { INotificationParameterization } from '@models/Notification';
import { IChangePercentageDiscount, ITableTaxesAndRetention } from '@models/ElectronicInvoice';
import { IFieldColumns } from './components';
export * from './ElectronicInvoice';

/**
 * This interface describes electronic document props
 *
 * @typeParam fieldInputs: IGenericRecord - Optional initial inputs state
 * @typeParam route: string - Route to redirect module
 * @typeParam textRoute: string - Optional text shown in the route link
 * @typeParam routeOnClick  () => void - Optional action to on click link
 * @typeParam fileLinkView: boolean - Optional file link view
 * @typeParam setFieldInputs: Dispatch<SetStateAction<IGenericRecord>> - Optional change initial inputs state
 * @typeParam onSubmitForm: boolean - Optional prop Specifies whether or not a form was submitted
 * @typeParam idInvoice: string - Optional prop is the id of the invoice, it is received when you want to consult an invoice
 * @typeParam registerInvoice: boolean - Optional prop difference between creating invoice and editing invoice
 * @typeParam isView: boolean - Optional prop specifies if it is a view to disable the fields
 * @typeParam paginator: IPaginatorProps - Optional receive the data from the paginator in case it is excel
 * @typeParam isExcel: boolean - Optional that indicates if it is excel or not
 * @typeParam setShowModalSearchClient: Dispatch<SetStateAction<boolean>> - Optional prop function to search for the modal of searching for clients
 * @typeParam isQuote: boolean - Optional prop difference between creating invoice and is quote
 * @typeParam isModalResolution?: boolean -  Optional prop for order show modals
 * @typeParam setNewUpdatedField?: Dispatch<SetStateAction<string[]>> -  Optional function to save the modified fields
 * @typeParam initialCustomerData?: IGenericRecord -  Optional prop with customer data
 * @typeParam resetData?: boolean -  Optional to reset data
 * @typeParam modalUpdateCustomer?: boolean - Optional prop to modal update customer
 * @typeParam setModalUpdateCustomer?: Dispatch<SetStateAction<boolean>> - Optional prop to change state modal update customer
 * @typeParam isWantedCustomer?: boolean - Optional prop if wanted customer
 * @typeParam existingCustomer?: boolean - Optional prop if existing customer
 * @typeParam setExistingCustomer?: Dispatch<SetStateAction<boolean>> - Optional prop to change state existing customer
 * @typeParam modalUpdateDocumentNumber?: boolean - Optional prop to modal update document number
 * @typeParam setModalUpdateDocumentNumber?: Dispatch<SetStateAction<boolean>> - Optional prop to change state modal update customer
 * @typeParam setValidateEditedField?: Dispatch<SetStateAction<boolean>> - Optional prop to change state validate edit field
 */
export interface IElectronicInvoiceProps {
    fieldInputs: IGenericRecord;
    route: string;
    textRoute?: string;
    routeOnClick?: () => void;
    fileLinkView?: boolean;
    setFieldInputs: Dispatch<SetStateAction<IGenericRecord>>;
    onSubmitForm?: boolean;
    idInvoice?: string;
    registerInvoice?: boolean;
    isView?: boolean;
    paginator?: IPaginatorProps;
    isExcel?: boolean;
    setShowModalSearchClient?: Dispatch<SetStateAction<boolean>>;
    isQuote?: boolean;
    isModalResolution?: boolean;
    setNewUpdatedField?: Dispatch<SetStateAction<string[]>>;
    initialCustomerData?: IGenericRecord;
    resetData?: boolean;
    modalUpdateCustomer?: boolean;
    setModalUpdateCustomer?: Dispatch<SetStateAction<boolean>>;
    isWantedCustomer?: boolean;
    existingCustomer?: boolean;
    setExistingCustomer?: Dispatch<SetStateAction<boolean>>;
    modalUpdateDocumentNumber?: boolean;
    setModalUpdateDocumentNumber?: Dispatch<SetStateAction<boolean>>;
    setValidateEditedField?: Dispatch<SetStateAction<boolean>>;
}

/**
 * This interface describes type of state modals
 *
 * @typeParam [key: string]: boolean - state to show modals;
 */
export interface IModals {
    [key: string]: boolean;
}

/**
 * options modal
 */
export enum ModalOpen {
    TERMS = 'terms',
    SUCCESS = 'success',
    UPLOAD = 'upload',
    DELETE = 'delete',
    WAREHOUSES = 'warehouses',
}

/**
 * It is fixed for queries on pivot table
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
    'withholdings',
];

/**
 * This function format options prefix
 *
 * @param prefix: IGenericRecord[] - Data prefix for invoice
 * @returns IGenericRecord[]
 */
export const formatOptionsPrefix = (prefix: IGenericRecord[]): IGenericRecord[] => {
    return prefix.map(newPrefix => {
        return {
            id: newPrefix.id,
            name: newPrefix.prefix,
        };
    });
};

/**
 * Data header from taxes table
 *
 * @param symbolReg?: string | RegExp - Optional symbol
 * @returns IGenericRecord[]
 */
export const headerTableTaxes = (symbolReg: string | RegExp = ''): IGenericRecord[] => [
    {
        idName: 'dp-electronic-invoice-cesi-tax',
        title: 'Impuesto',
        className: 'remove-min-height w-32.7',
        wrapperClassName: 'padding-none',
    },
    {
        idName: 'dp-electronic-invoice-cesi',
        title: 'Base'.replaceAll(symbolReg, ''),
        className: 'remove-min-height w-32.7',
        wrapperClassName: 'padding-none',
    },
    {
        idName: 'dp-electronic-invoice-cesi-rate',
        title: 'Tarifa',
        className: 'remove-min-height w-32.7',
        wrapperClassName: 'padding-none',
    },
    {
        idName: 'dp-electronic-invoice-cesi-value',
        title: 'Valor'.replaceAll(symbolReg, ''),
        className: 'remove-min-height w-32.7',
        wrapperClassName: 'padding-none',
    },
];

/**
 * This const is for type taxes
 */
const typeTaxes = {
    IVA: 'IVA',
    CONSUMPTION: 'CONSUMPTION',
};

/**
 * Data body from products and services table
 *
 * @param onChange: (e: ChangeEventTable | IChangePercentageDiscount, item: IGenericRecord) => void - Change fields
 * @param handleChangeSelectTable: (option: IOptionSelect, others?: IGenericRecord, name?: string) => void - its function is to make an onchange of the select table
 * @param handleChangeSelectSearch: (option: SelectedOption, others?: IGenericRecord, name?: string) => void - its function is to make an onchange of the select table
 * @param handleChangeInputs: (e: IGenericRecord, item: IGenericRecord, keyName: string) => void its function is to make an onchange of the input table
 * @param listOptionsTable: IGenericRecord - Is an object that contains the options of each select
 * @param isView: boolean - Fields disabled in table
 * @returns IFieldColumns - Data to table
 */
export const fieldsBody = (
    onChange: (e: ChangeEventTable | IChangePercentageDiscount, item: IGenericRecord) => void,
    handleChangeSelectTable: (option: IOptionSelect, others?: IGenericRecord, name?: string) => void,
    handleChangeSelectSearch: (option: SelectedOption, others?: IGenericRecord, name?: string) => void,
    handleChangeInputs: (e: IGenericRecord, item: IGenericRecord, keyName: string) => void,
    listOptionsTable: IGenericRecord,
    isView: boolean
): IFieldColumns => ({
    number: {
        name: 'number',
        disabled: true,
        options: [],
    },
    sku: {
        name: 'sku_internal',
        options: listOptionsTable.sku,
        onChange: handleChangeSelectSearch,
        disabled: isView,
    },
    products: {
        name: 'unique_products_id',
        options: listOptionsTable.products,
        onChange: handleChangeSelectSearch,
        disabled: isView,
    },
    warehouse: {
        name: 'warehouse_name',
        multiOptions: listOptionsTable.warehouse,
        onChangeSimple: handleChangeSelectTable,
        disabled: isView,
        options: [],
    },
    batch: {
        name: 'batch',
        multiOptions: listOptionsTable.batch,
        onChangeSimple: handleChangeSelectTable,
        disabled: isView,
        options: [],
    },
    input_date_expiration: {
        name: 'input_date_expiration',
        multiOptions: listOptionsTable.expirationDates,
        onChangeSimple: handleChangeSelectTable,
        disabled: isView,
        options: [],
    },
    description: {
        name: 'description',
        onChange,
        disabled: isView,
    },
    quantity: {
        name: 'quantity',
        onChange,
        disabled: isView,
    },
    measurement: {
        name: 'measurement',
        onChange,
        disabled: true,
    },
    unit_cost: {
        name: 'unit_cost',
        onChange,
        disabled: true,
    },
    percentage_discount: {
        name: 'percentage_discount',
        onChange,
        disabled: isView,
    },
    discount: {
        name: 'discount',
        onChange,
        disabled: true,
    },
    total_buy: {
        name: 'total_buy',
        onChange,
        disabled: true,
    },
    percentage: {
        name: 'percentage',
        onChange,
        disabled: true,
    },
    iva: {
        name: 'iva',
        onChange,
        disabled: true,
    },
    check: {
        field: 'check',
        className: 'margin-check',
        editableField: true,
        disabled: isView,
    },
    warehouse_input: {
        name: 'warehouse',
        onChangeInput: handleChangeInputs,
        disabled: true,
    },
    batch_input: {
        name: 'batch',
        onChangeInput: handleChangeInputs,
        disabled: true,
    },
    date_input: {
        name: 'date_expiration',
        onChangeInput: handleChangeInputs,
        disabled: true,
    },
});

/**
 * Initial data fields disabled from taxes table
 */
export const initFieldsTaxTable: IFields = {
    tax: {
        value: '',
        onChange: () => {},
        disabled: false,
    },
    base: {
        value: 0,
        onChange: () => {},
        disabled: false,
    },
    rate: {
        value: '',
        onChange: () => {},
        disabled: false,
    },
    value: {
        value: 0,
        onChange: () => {},
        disabled: false,
    },
};

/**
 * This constant is the initial state for the products and services table
 *
 * @param index: number - Index number
 * @param onSubmit: boolean - Is submit form
 * @returns IGenericRecord
 */
export const initialDataTable = (index: number, onSubmit: boolean): IGenericRecord => {
    const state = {
        number: formatInitialNumber(index),
        id: uuid(),
        total_buy: 0,
        reference: null,
        unit_cost: 0,
        sku_internal: '',
        unique_product_name: '',
        unique_products_id: '',
        warehouse_id: '',
        warehouse_name: '',
        batch: '',
        batch_id: '',
        input_date_expiration: null,
        batch_detail_id: null,
        date_expiration: null,
        description: '',
        quantity: 0,
        unit_measurements_id: '',
        unit_value: 0,
        discount: 0,
        delivery_cost: null,
        ciiu_id: 2,
        iva: 0,
        taxes_invoice: [],
        is_product: true,
        is_inventoriable: true,
        percentage: 0,
        percentage_discount: 0,
        check: false,
        text_fields: {
            warehouse: '',
            batch: '',
            date_expiration: '',
        },
        quantityMax: 0,
        unit_measure_milliliters: 0,
    };
    return {
        ...state,
        fieldsWithError: onSubmit ? validateProduct(state) : [],
    };
};

/**
 * This enum are the names of the inputs that have alternate validations
 */
export enum TypeNamesInputs {
    NUMBER = 'number',
    DOCUMENT_NUMBER = 'document_number',
    DOCUMENT_TYPE = 'document_type',
    DOCUMENT_TYPE_PURCHASING = 'document_type_purchasing_manager',
    DOCUMENT_TYPE_SALES = 'document_type_sales_manager',
    NAME = 'name',
    PURCHASING_MANAGER = 'purchasing_manager',
    SALES_MANAGER = 'sales_manager',
    SKU = 'sku_internal',
    UNIQUE_PRODUCT = 'unique_product_name',
    UNIQUE_PRODUCTS_ID = 'unique_products_id',
    QUANTITY = 'quantity',
    WAREHOUSE = 'warehouse_name',
    DISCOUNT = 'discount',
    ADDRESS = 'address',
    DESCRIPTION = 'description',
    BATCH = 'batch',
    TAX_DETAIL = 'tax_detail',
    TAX_DETAILS = 'tax_details',
    DATE_EXPIRED = 'date_expired',
    BATCH_DETAIL_ID = 'batch_detail_id',
    DATE_EXPIRED_INPUT = 'input_date_expiration',
    DATE_LIMIT = 'date_limit',
    PREFIX = 'prefix_id',
    DELIVERY_COST = 'delivery_cost',
    PAYMENT_TYPE = 'payment_type',
    PERCENTAGE = 'percentage',
    VALUE = 'value',
    DAYS = 'days_collection',
    DAYS_TYPE = 'days_collection_type',
    COUNTRY = 'country',
    DEPARTMENT = 'department',
    UNIT_COST = 'unit_cost',
    WAREHOUSE_INPUT = 'warehouse',
    DATE_INPUT = 'date_expiration',
    IVA = 'iva',
    SHIPPING_COST = 'shipping_cost',
    WAREHOUSE_ID = 'warehouse_id',
    BATCH_ID = 'batch_id',
    COMPANY_DEVICE = 'company_device',
    RECEIVE_DEVICE = 'receive_device',
    DOCUMENT_NUMBER_PURCHASING = 'document_number_purchasing_manager',
    DOCUMENT_NUMBER_SALES = 'document_number_sales_manager',
    POSTAL_CODE = 'postal_code',
    EMAIL = 'email',
    DATE = 'date',
    FOREIGN_EXCHANGE = 'foreign_exchange_rate',
    PERCENTAGE_DISCOUNT = 'percentage_discount',
    COMPANY_DEVICE_ID = 'company_device_id',
    COUNTRY_NAME = 'country_name',
    DEPARTMENT_NAME = 'department_name',
    CITY_NAME = 'city_name',
    FISCAL_RESPONSIBILITIES = 'fiscalResposibilities',
    TYPE_TAXPAYER_ID = 'type_taxpayer_id',
    TAX_DETAILS_NAME = 'tax_details_name',
    FISCAL_RESPONSIBILITIES_SNAKE = 'fiscal_responsibilities',
    CITY_ID = 'city_id',
    COUNTRY_ID = 'country_id',
    DEPARTMENT_ID = 'department_id',
}

/**
 * This constant validates the expiration dates in case they are null
 */
export const UNDEFINED = 'N/A';

/**
 * This constant look for the name of the options sent by parameters
 *
 * @param documentTypes: IGenericRecord[] - List document types
 * @param id: string - Id document type
 * @returns string
 */
export const getDocumentTypeName = (documentTypes: IGenericRecord[], id: string): string =>
    documentTypes?.find((documentType: IGenericRecord) => documentType.id === id || documentType?.warehouses_id === id)?.name ||
    '';

/**
 * This function validates the data of the entire component
 *
 * @param listProducts: IGenericRecord[] - State data invoice details
 * @param setListProducts?: React.Dispatch<React.SetStateAction<IGenericRecord[]>> - Optional dispatch state
 * @returns IGenericRecord
 */
export const validateFieldsInputs = (
    listProducts: IGenericRecord[],
    setListProducts?: React.Dispatch<React.SetStateAction<IGenericRecord[]>>
): IGenericRecord => {
    let errorTable = false;
    let countServices = 0;
    if (lengthEqualToZero(listProducts)) {
        errorTable = true;
    }
    const productValidation: IGenericRecord[] = listProducts?.map((product: IGenericRecord) => {
        let fieldsWithErrorProducts: string[] = [];
        fieldsWithErrorProducts = validateProduct(product);
        if (!product?.is_product) countServices = countServices + 1;

        if (lengthGreaterThanZero(fieldsWithErrorProducts)) errorTable = true;

        return {
            ...product,
            fieldsWithError: fieldsWithErrorProducts,
        };
    });

    setListProducts && setListProducts(productValidation || []);
    return { errorTable, productValidation, countServices };
};

/**
 * This const is for keys that are not validated in form invoice
 */
export const skipValidation = [
    'person_id',
    'customer_id',
    'client_id',
    'foreign_exchange_code',
    'total_sale',
    'total_discount',
    'sending_charge',
    'total_sale_value',
    'total_iva',
    'total_impoconsumption',
    'retefuente',
    'reteica',
    'reteiva',
    'total',
    'total_invoice',
    'prefix_id_name',
    'last_name',
    'number_purchase_order',
    'sales_manager',
    'description',
    'send_address',
    'document_type_sales_manager',
    'document_number_sales_manager',
    'purchasing_manager',
    'document_type_purchasing_manager',
    'document_type_sales_manager_name',
    'document_type_purchasing_manager_name',
    'document_number_purchasing_manager',
    'note',
    'taxes',
    'withholdings',
    'loaded_inventory',
    'department_code',
    'city_code',
    'country_id',
    'country_name',
    'department_id',
    'department_name',
    'email',
    'phone',
    'address',
    'city_id',
    'city_name',
    'postal_code',
    'type_taxpayer_name',
    'tax_details_id',
    'tax_details_name',
    'tax_details_code',
    'company_device_id',
    'company_device_name',
    'country_code',
    'payment_method_code',
    'payment_method_id',
    'payment_method_name',
];

/**
 * This function validate form invoice
 *
 * @typeParam fieldInputs: IGenericRecord: IGenericRecord - Data form invoice
 * @param isSale: boolean - type invoice
 * @param isQuote?: boolean - Optional quote
 * @returns string[]
 */
export const validateFormInputs = (fieldInputs: IGenericRecord, isSale: boolean, isQuote?: boolean): string[] => {
    const fieldsValidate: string[] = [];

    if (fieldInputs) {
        Object.keys(fieldInputs).forEach((name: string) => {
            const valueField = fieldInputs[name];
            // Validate email field
            validateEmailField(name, fieldInputs, fieldsValidate);
            validateDocumentNumbers(fieldInputs, fieldsValidate, name);
            validateFirstValuesForm(fieldInputs, fieldsValidate, name, isSale);
            validateWithholding(fieldInputs, fieldsValidate);
            validateQuoteFields(name, fieldInputs, fieldsValidate, isQuote);
            validateSecondValuesForm(fieldInputs, fieldsValidate, name, isSale);
            validateAddressFields(fieldInputs, fieldsValidate, name);
            skipValidationForSpecificFields(name);
            validateRequiredFields(name, valueField, fieldsValidate);
        });
    }

    return fieldsValidate;
};

/**
 * Validates the email field.
 * @typeParam name: string - The name of the field.
 * @typeParam fieldInputs: IGenericRecord - The object containing all the form fields.
 * @typeParam fieldsValidate: string[] - The array that will hold names of invalid fields.
 */
const validateEmailField = (name: string, fieldInputs: IGenericRecord, fieldsValidate: string[]): void => {
    if (name === TypeNamesInputs.EMAIL && !validateEmail(fieldInputs?.email)) fieldsValidate.push(name);
};

/**
 * Validates withholding fields.
 * @typeParam fieldInputs: IGenericRecord - The object containing all the form fields.
 * @typeParam fieldsValidate: string[] - The array that will hold names of invalid fields.
 */
const validateWithholding = (fieldInputs: IGenericRecord, fieldsValidate: string[]): void => {
    if (isWithholdingInvalid(fieldInputs)) fieldsValidate.push('withholdings');
};

/**
 * Validates fields specific to quotes.
 * @typeParam name: string - The name of the field.
 * @typeParam fieldInputs: IGenericRecord - The object containing all the form fields.
 * @typeParam fieldsValidate: string[] - The array that will hold names of invalid fields.
 * @param isQuote - Boolean indicating whether the form is for a quote.
 */
const validateQuoteFields = (name: string, fieldInputs: IGenericRecord, fieldsValidate: string[], isQuote?: boolean): void => {
    if (isQuote) {
        if (name === TypeNamesInputs.EMAIL && fieldInputs.email && !validateEmail(fieldInputs.email)) {
            fieldsValidate.push(name);
        }
        if (name === TypeNamesInputs.DOCUMENT_NUMBER || name === TypeNamesInputs.DOCUMENT_TYPE) {
            validateDocumentTypeAndNumber(fieldInputs, fieldsValidate);
        }
    }
};

/**
 * Skips validation for specific fields.
 * @typeParam name: string - The name of the field.
 */
const skipValidationForSpecificFields = (name: string): void => {
    if (skipValidation.includes(name)) return;
};

/**
 * Validates required fields that should not be empty.
 * @typeParam name: string - The name of the field.
 * @typeParam valueField: IGenericRecord - The value of the field.
 * @typeParam fieldsValidate: string[] - The array that will hold names of invalid fields.
 */
const validateRequiredFields = (name: string, valueField: IGenericRecord, fieldsValidate: string[]): void => {
    const typeOf = typeof valueField;
    if (!valueField && ![VARIABLE_TYPE.BOOLEAN, VARIABLE_TYPE.NUMBER].includes(typeOf)) fieldsValidate.push(name);
};

/**
 * Validate first values form
 *
 * @typeParam fieldInputs: IGenericRecord - The data of the invoice form.
 * @typeParam fieldsValidate: string[] - The array of field names that failed validation.
 * @typeParam name: string - The current field name being validated.
 * @param isSale - State to knwo if it's sale
 */
const validateFirstValuesForm = (fieldInputs: IGenericRecord, fieldsValidate: string[], name: string, isSale: boolean): void => {
    // Validate postal code length
    if (name === TypeNamesInputs.POSTAL_CODE && fieldInputs[name] && fieldInputs?.postal_code.length < MAX_NUMBER_SIX) {
        fieldsValidate.push(name);
    }

    // Validate document number length
    if (name === TypeNamesInputs.DOCUMENT_NUMBER && fieldInputs[name] && fieldInputs[name].length < MAX_NUMBER_SIX) {
        fieldsValidate.push(name);
    }

    // Validate date limit
    if (name === TypeNamesInputs.DATE_LIMIT && fieldInputs?.date > fieldInputs?.date_limit) {
        fieldsValidate.push(name);
    }

    // Validate date for non-sale invoices
    if (!isSale && name === TypeNamesInputs.DATE && new Date(fieldInputs?.date) < getPreviousDays()) {
        fieldsValidate.push(name);
    }

    // Validate foreign exchange field length
    if (fieldInputs[name] === TypeNamesInputs.FOREIGN_EXCHANGE && fieldInputs[name].length < MaxLengthFields.FOREIGN_EXCHANGE) {
        fieldsValidate.push(name);
    }
};

/**
 * Validate first values form
 *
 * @typeParam fieldInputs: IGenericRecord - The data of the invoice form.
 * @typeParam fieldsValidate: string[] - The array of field names that failed validation.
 * @typeParam name: string - The current field name being validated.
 * @param isSale - State to knwo if it's sale
 */
const validateSecondValuesForm = (fieldInputs: IGenericRecord, fieldsValidate: string[], name: string, isSale: boolean): void => {
    // Validate electronic biller and receive email
    if (fieldInputs.electronic_biller && fieldInputs.receive_email && !validateEmail(fieldInputs.email)) {
        fieldsValidate.push(name);
    }

    // Validate company device ID
    if (fieldInputs.receive_device && name === TypeNamesInputs.COMPANY_DEVICE_ID && !fieldInputs[name]) {
        fieldsValidate.push(name);
    }

    // Validate payment type fields
    if ([TypeNamesInputs.DAYS_TYPE, TypeNamesInputs.DATE_LIMIT, TypeNamesInputs.DAYS].includes(name as TypeNamesInputs)) {
        if (!fieldInputs?.payment_type_name || fieldInputs?.payment_type_name === TextPaymentTypes.COUNTED) {
            return;
        }
    }

    // Validate prefix for sale invoices
    if (isSale && name === TypeNamesInputs.PREFIX) {
        return;
    }

    // Validate number for sale invoices
    if (name === TypeNamesInputs.NUMBER) {
        if (!isSale) return;
        if (fieldInputs[name] === VALUE_ZERO) fieldsValidate.push(name);
    }
};

/**
 * Validates the document numbers for purchasing and sales managers.
 *
 * @typeParam fieldInputs: IGenericRecord - The data of the invoice form.
 * @typeParam fieldsValidate: string[] - The array of field names that failed validation.
 * @typeParam name: string - The current field name being validated.
 */
const validateDocumentNumbers = (fieldInputs: IGenericRecord, fieldsValidate: string[], name: string): void => {
    if (
        TypeNamesInputs.DOCUMENT_TYPE_PURCHASING === name &&
        fieldInputs[name] &&
        validateDocumentNumber(fieldInputs.document_number_purchasing_manager)
    ) {
        fieldsValidate.push(TypeNamesInputs.DOCUMENT_NUMBER_PURCHASING);
    }

    if (fieldInputs.document_type_sales_manager && TypeNamesInputs.DOCUMENT_NUMBER_SALES === name && !fieldInputs[name]) {
        fieldsValidate.push(name);
    }
};

/**
 * Validates the withholding percentages in the form inputs.
 *
 * @typeParam fieldInputs: IGenericRecord - The data of the invoice form.
 * @returns A boolean indicating if any withholding percentage is invalid.
 */
const isWithholdingInvalid = (fieldInputs: IGenericRecord): boolean => {
    return (
        !!validatePercentageWithHoldings(
            findPercentage(TextNameTotals.RETE_FUENTE, fieldInputs.withholdings as ITableTaxesAndRetention[]),
            fieldInputs?.country_name,
            THIRTY_THREE
        ) ||
        !!validatePercentageWithHoldings(
            findPercentage(TextNameTotals.RETE_ICA, fieldInputs.withholdings as ITableTaxesAndRetention[]),
            fieldInputs?.country_name,
            TWO
        ) ||
        !!validatePercentageWithHoldings(
            findPercentage(TextNameTotals.RETE_IVA, fieldInputs.withholdings as ITableTaxesAndRetention[]),
            fieldInputs?.country_name,
            ONE_HUNDRED
        )
    );
};

/**
 * Validates the document type and number in the form inputs.
 *
 * @typeParam fieldInputs: IGenericRecord - The data of the invoice form.
 * @typeParam fieldsValidate: string[] - The array of fields that failed validation.
 */
const validateDocumentTypeAndNumber = (fieldInputs: IGenericRecord, fieldsValidate: string[]): void => {
    if (fieldInputs.document_number && !fieldInputs.document_type) fieldsValidate.push(TypeNamesInputs.DOCUMENT_TYPE);
    if (!fieldInputs.document_number && fieldInputs.document_type) fieldsValidate.push(TypeNamesInputs.DOCUMENT_NUMBER);
};

/**
 * Validates the address fields in the form inputs when receiving products.
 *
 * @typeParam fieldInputs: IGenericRecord - The data of the invoice form.
 * @typeParam fieldsValidate: string[] - The array of fields that failed validation.
 * @typeParam name: string - The name of the current field being validated.
 */
const validateAddressFields = (fieldInputs: IGenericRecord, fieldsValidate: string[], name: string): void => {
    if (
        [
            TypeNamesInputs.DEPARTMENT_NAME,
            TypeNamesInputs.COUNTRY_NAME,
            TypeNamesInputs.CITY_NAME,
            TypeNamesInputs.ADDRESS,
        ].includes(name as TypeNamesInputs) &&
        !fieldInputs[name]
    ) {
        fieldsValidate.push(name);
    }
};

/**
 * This const is for keys that are not validated in detail invoice
 */
export const skipValidationProducts = [
    'id',
    'number',
    'total_buy',
    'reference',
    'unit_cost',
    'date_expiration',
    'unit_measurements_id',
    'unit_value',
    'iva',
    'ciiu_id',
    'is_product',
    'percentage',
    'check',
    'measurement',
    'batch_detail_id',
    'taxes',
    'description',
    'fieldsWithError',
    'ivaObject',
    'percentageObject',
    'batch',
    'text_fields',
    'warehouse_id',
    'batch_id',
    'warehouse_name',
    'input_date_expiration',
    'delivery_cost',
    'quantityMax',
    'is_mandate',
    'mandate_id',
    'mandate',
    'is_inventoriable',
    'other_cost',
    'impoconsumption',
    'batch_number',
    'unit_measure_milliliters',
];

/**
 * This function validates the detail of the invoice
 *
 * @param product: IGenericRecord - Detail invoice's item
 * @returns string[]
 */
export const validateProduct = (product: IGenericRecord): string[] => {
    const fieldsWithErrorProducts: string[] = [];

    if (product) {
        validateTextFields(product, fieldsWithErrorProducts);
        validateWarehouseFields(product, fieldsWithErrorProducts);
        validateProductFields(product, fieldsWithErrorProducts);
    }

    return fieldsWithErrorProducts;
};

/**
 * Function to validate fields from product
 * @param product: IGenericRecord - Current product
 * @param fieldsWithErrorProducts: string[] - List errors
 */
const validateTextFields = (product: IGenericRecord, fieldsWithErrorProducts: string[]): void => {
    const validateTextInputs = product.warehouse_name === EDIT_INPUTS.WAREHOUSE_INPUT;
    if (validateTextInputs && product.text_fields.warehouse) {
        Object.keys(product.text_fields).forEach(item => {
            if (!product.text_fields[item]) {
                fieldsWithErrorProducts.push(item);
            }
        });
    }
};

/**
 * Validate warehouses by product
 * @param product: IGenericRecord - Current product
 * @param fieldsWithErrorProducts: string[] - List errors
 */
const validateWarehouseFields = (product: IGenericRecord, fieldsWithErrorProducts: string[]): void => {
    if (!product.warehouse_name) {
        if (!product.batch) fieldsWithErrorProducts.push('batch');
        if (!product.input_date_expiration) fieldsWithErrorProducts.push('input_date_expiration');
    }
};

/**
 * Validate quantity, percentage, discounts and delivery cost by product
 * @param product: IGenericRecord - Current product
 * @param fieldsWithErrorProducts: string[] - List errors
 */
const validateProductFields = (product: IGenericRecord, fieldsWithErrorProducts: string[]): void => {
    Object.keys(product).forEach((name: string) => {
        if (skipValidationProducts.includes(name)) {
            return;
        }
        if (name === TypeNamesInputs.QUANTITY && !stringToFloat(product[name])) {
            fieldsWithErrorProducts.push(name);
        }
        if (
            !product[name] &&
            ![TypeNamesInputs.PERCENTAGE_DISCOUNT, TypeNamesInputs.DISCOUNT].includes(name as TypeNamesInputs)
        ) {
            fieldsWithErrorProducts.push(name);
        }
        if (name === TypeNamesInputs.PERCENTAGE_DISCOUNT && stringToFloat(product[name]) > MaxLengthFields.PERCENTAGE_DISCOUNT) {
            fieldsWithErrorProducts.push(name);
        }
        if (
            name === TypeNamesInputs.DELIVERY_COST &&
            stringToFloat(product?.unit_value) < stringToFloat(product[name]) &&
            stringToFloat(product[name])
        ) {
            fieldsWithErrorProducts.push(name);
        }
    });
};

/**
 * This function validates that input is required
 *
 * @typeParam name: string: string - Input name
 * @param fields: string[] - List name inputs to validate
 * @returns boolean
 */
export const searchNameInput = (name: string, fields: string[]): boolean => fields.includes(name);

/**
 * This function calculates the invoice details
 *
 * @param productFilter: IGenericRecord - Data product
 * @param product: IGenericRecord - Product from invoice details
 * @param params?: IGenericRecord - Optional param calculate
 * @param isSupport?: boolean - Optional param to support document
 * @returns IGenericRecord
 */
export const getTotalBuy = (
    productFilter: IGenericRecord,
    product: IGenericRecord,
    params?: IGenericRecord,
    isSupport = false
): IGenericRecord => {
    let totalBuyParams = 0;
    let totalBuy = 0;
    let impoconsumo = 0;
    let cost = 0;

    const IVAPercentage = findProductTax(productFilter.unique_product_taxes, IVA).tax_rate;
    const unitValue = calculateUnitValue(productFilter, IVAPercentage);

    if (productFilter?.product) {
        impoconsumo = calculateImpoconsumo(productFilter);
        cost = calculateCost(unitValue, product.quantity, isSupport, params);
        if (params) totalBuyParams = calculateTotalBuyParams(unitValue, params);
        totalBuy = calculateTotalBuy(cost, product);
        return {
            impoconsumo,
            IVAPercentage,
            cost,
            totalBuy,
            totalBuyParams,
        };
    }
    return {
        impoconsumo,
        IVAPercentage,
        cost,
        totalBuy,
        totalBuyParams,
    };
};

/**
 * Calculates the unit value, taking into account the IVA (tax).
 * @typeParam productFilter: IGenericRecord - The product filter containing unit value and tax inclusion flag.
 * @typeParam IVAPercentage: number - The IVA percentage to apply if taxes are included.
 * @returns number - The calculated unit value after applying any tax considerations.
 */
const calculateUnitValue = (productFilter: IGenericRecord, IVAPercentage: number): number =>
    productFilter.is_include_tax ? ivaDiscount(productFilter.unit_value, IVAPercentage) : productFilter.unit_value;

/**
 * Calculates the impoconsumo (consumption tax) from the product filter.
 * @typeParam productFilter: IGenericRecord - The object containing the product filter data.
 * @returns number - The calculated impoconsumo value.
 */
const calculateImpoconsumo = (productFilter: IGenericRecord): number => {
    return Number(
        productFilter?.product.product_taxes
            ?.find(
                (tax: IGenericRecord) =>
                    tax.tax_type === typeTaxes.CONSUMPTION && !tax.tax_name.includes('Excluido', 'No grabado')
            )
            ?.tax_name?.replace('%', '') || 0
    );
};

/**
 * Calculates the cost based on unit value, quantity, and support flag.
 * @typeParam unitValue: number - The unit value of the product.
 * @typeParam quantity: number | undefined - The quantity of the product.
 * @typeParam isSupport: boolean - Indicates if it's a support-related product.
 * @typeParam params?: IGenericRecord - Additional parameters (if any) for cost calculation.
 * @returns number - The calculated cost.
 */
const calculateCost = (unitValue: number, quantity: number | undefined, isSupport: boolean, params?: IGenericRecord): number => {
    const unit_value = isSupport ? params?.unit_cost ?? 0 : unitValue;
    return unit_value * (quantity ?? 0);
};

/**
 * Calculates total buy params if parameters exist (unit cost, discount, and delivery cost).
 * @typeParam unitValue: number - The unit value of the product.
 * @typeParam params: IGenericRecord - Parameters for cost calculation (unit cost, quantity, discount, delivery cost).
 * @returns number - The total buy params value.
 */
const calculateTotalBuyParams = (unitValue: number, params: IGenericRecord): number => {
    const costPrams: number = unitValue * params.quantity;
    const discountParam = params.discount ? costPrams - params.discount : costPrams;
    return stringToFloat(discountParam + (params?.delivery_cost || 0));
};

/**
 * Calculates the total buy value (cost + discount + delivery).
 * @typeParam cost: number - The calculated cost of the product.
 * @typeParam product: IGenericRecord - The product object containing discount and delivery cost.
 * @returns number - The total buy value.
 */
const calculateTotalBuy = (cost: number, product: IGenericRecord): number => {
    const discount = product.discount ? cost - product.discount : cost;
    return parseFloat(Number(discount + Number(product?.delivery_cost)).toFixed(2));
};

/**
 * This enum is to payment types
 */
export enum TextPaymentTypes {
    COUNTED = 'Contado',
    CREDIT = 'Crédito',
}

/**
 * This enum is to title in table totals
 */
export enum TextNameTotals {
    SHIPPING_COST = 'Costo de envío',
    DELIVERY_COST = 'Costo de entrega',
    TOTAL_SALE = 'Total valor venta',
    TOTAL_VALUE_BUY = 'Total valor compra',
    TOTAL_IVA = 'Total IVA',
    TOTAL_IMP = 'Impoconsumo',
    RETE_FUENTE = 'retefuente',
    RETE_ICA = 'reteica',
    RETE_IVA = 'reteiva',
    TOTAL = 'Total',
}

/**
 * This constant is used to get the electronic invoice prefixes
 */
export const PARAMETER_GET_PREFIX_TYPES = {
    with_prefixes: true,
    types: [INVOICE],
};

/**
 * This const is to handle change in input select
 */
export const namesSelectDepCityCountry = ['city', 'department', 'country'];

/**
 * This functions update value options for select tax details
 *
 * @param array: IOptionSelect[] - Options tax details
 * @returns IOptionSelect[]
 */
export const formatTaxDetails = (array: IOptionSelect[]): IOptionSelect[] => {
    return lengthGreaterThanZero(array)
        ? (changeUltimateItem(array).map(tax => {
              tax.value = `${tax?.code} - ${tax?.value}`;
              return tax;
          }) as IOptionSelect[])
        : [];
};

/**
 * This function validate list products
 *
 * @param products: IGenericRecord[] - List products
 * @returns string
 */
export const showMessageTableProducts = (products: IGenericRecord[]): string => {
    for (const product of products) {
        if (!stringToFloat(product?.quantity)) {
            return VALIDATIONS_INVOICES.QUANTITY_ZERO;
        }
        if (product?.fieldsWithError?.includes(TypeNamesInputs.PERCENTAGE_DISCOUNT)) {
            return VALIDATIONS_INVOICES.PERCENTAGE_DISCOUNT;
        }
        if (
            product?.fieldsWithError?.includes(TypeNamesInputs.BATCH) ||
            product?.fieldWithError?.includes(TypeNamesInputs.DATE_EXPIRED_INPUT)
        ) {
            return VALIDATIONS_INVOICES.BATCH_AND_WAREHOUSE;
        }
    }
    return VALIDATIONS_INVOICES.SKU;
};

const { TWO, FIFTEEN, ONE_HUNDRED, THIRTY_THREE, TWENTY } = {
    TWO: 2.0,
    TWENTY: 20.0,
    FIFTEEN: 15,
    ONE_HUNDRED: 100,
    THIRTY_THREE: 33.0,
};

/**
 * This function validate percentage in table withholdings
 *
 * @param percentage: number - Value percentage
 * @param country: string - Country client
 * @param max: number - Maximum value percentage
 * @returns string
 */
export const validatePercentageWithHoldings = (percentage: number, country: string, max: number): string => {
    if (max === THIRTY_THREE) {
        if ((percentage > TWENTY && country === COLOMBIA) || percentage > THIRTY_THREE) {
            return 'Ingrese una tarifa de Retefuente de máximo 20%';
        }
    }
    if (percentage && ![FIFTEEN, ONE_HUNDRED].includes(percentage) && max === ONE_HUNDRED) {
        return 'Tarifa ReteIVA inválida';
    }
    if (percentage > TWO && max === TWO) {
        return 'Ingrese una tarifa de ReteICA de máximo 2%';
    }
    return '';
};

/**
 * This function validate number characters in number document
 *
 * @param document: string - Number document
 * @returns string
 */
export const validateDocumentNumber = (document: string): string =>
    document?.length < MAX_NUMBER_SIX ? `*El número de documento debe tener mínimo ${MAX_NUMBER_SIX} dígitos` : '';

/**
 * This const value NIT
 */
const NIT = 'NIT';
const validationNit = (typeDocument: string, document = ''): string | undefined =>
    typeDocument === NIT && !validateNit(document)
        ? '*Ingrese un NIT válido, este debe tener el dígito de verificación separado por un guión'
        : undefined;

/**
 * This function validate the document number
 *
 * @param typeDocument: string - Type document
 * @param document: string - Number document
 * @returns string
 */
export const validateDocumentNumberClient = (typeDocument: string, document = ''): string | undefined =>
    document?.length < MAX_NUMBER_SIX
        ? `*El número de documento debe tener mínimo ${MAX_NUMBER_SIX} dígitos`
        : validationNit(typeDocument, document);

/**
 * This const is value comma
 */
export const COMMA = 'Comma';

/**
 * This function is to change the state in disabled in the withholdings table
 *
 * @param withholdings: IGenericRecord[] - Data Withholdings
 * @param disabledColumns: boolean - Disabled rows
 * @returns IGenericRecord[]
 */
export const changeTableWithholdings = (withholdings: IGenericRecord[], disabledColumns: boolean): IGenericRecord[] =>
    withholdings.map(({ disabled, is_tax, ...withholding }) => {
        if (is_tax) return { ...withholding, disabled, is_tax };
        return {
            ...withholding,
            is_tax,
            disabled: disabledColumns,
        };
    });

/**
 * This function is to update the taxes and retentions table with list products
 *
 * @param taxesAndRetentions: IGenericRecord[] - Data taxes and retentions
 * @param listProducts: IGenericRecord[] - Data details invoices
 * @returns IGenericRecord[]
 */
export const formatTableTaxesAndRetentions = (
    taxesAndRetentions: IGenericRecord[],
    listProducts: IGenericRecord[]
): IGenericRecord[] => {
    let valueIVa = 0;
    return taxesAndRetentions?.map(tax => {
        const isReteIVA = tax.title === TextNameTotals.RETE_IVA;
        let base = 0;
        let value = 0;
        listProducts?.forEach(({ total_buy, taxes_invoice }: IGenericRecord) => {
            const { tax_rate_name, tax_rate, company_tax_id } = findTaxInvoiceDetail(IVA, taxes_invoice);
            if (company_tax_id && tax.rate?.includes(tax_rate_name ?? tax_rate) && tax.is_tax) {
                base += total_buy;
                value = stringToFloat((base * tax_rate) / 100);
            }
            if (!tax.is_tax && !isReteIVA) {
                base += total_buy;
                value = stringToFloat((base * stringToFloat(String(tax.percentage).replaceAll('%', ''))) / 100);
            }
        });
        if (tax.is_tax) valueIVa += value;
        if (isReteIVA) {
            return {
                ...tax,
                base: valueIVa,
                value: stringToFloat((valueIVa * stringToFloat(String(tax.percentage).replaceAll('%', ''))) / 100),
            };
        }
        return { ...tax, base, value };
    });
};

/**
 * This function is to assign values in the total
 *
 * @param totals: IGenericRecord - Values totals
 * @param taxesAndRetentions: IGenericRecord[] - Data taxes and retentions
 * @returns IGenericRecord
 */
export const assignTotalValues = (retentions: ITableTaxesAndRetention[]): IGenericRecord => {
    const objectRetentions: IGenericRecord = {};
    ['retefuente', 'reteica', 'reteiva'].forEach(key => {
        const { value = 0, base = 0 } = retentions.find(({ name }) => name.toLowerCase().includes(key)) || {};
        Object.assign(objectRetentions, {
            [`base_${key}`]: base,
            [key]: value,
        });
    });
    return objectRetentions;
};

/**
 * This interface is for prefix next to expire
 *
 * @typeParam numberPrefix: string - Resolution number
 * @typeParam dayExpirate: string - Date expire resolution
 * @typeParam consecutiveAvailable: string - Number consecutive resolution
 * @typeParam currentConsecutive?: string - Optional message input select
 */
export interface IPrefixNextToExpire {
    numberPrefix: string;
    dayExpirate: string;
    consecutiveAvailable: string;
    currentConsecutive?: string;
}

/**
 * This const define default prefix next to expire
 */
const defaultPrefixNextToExpire: IPrefixNextToExpire = {
    numberPrefix: '',
    dayExpirate: '',
    consecutiveAvailable: '',
};

/**
 * This function validate the current resolution
 *
 * @param param: IGenericRecord - Prefix for validate
 * @param parameterization: number - Notifications invoice
 * @param isInputSelect?: boolean -  Optional param for message input select
 * @param isExpireResolution?: boolean - Optional param for consecutive validation
 * @returns IPrefixNextToExpire | undefined
 */
export const consecutiveValidation = (
    { last_consecutive_number, final_authorization_range, final_validity, resolution_number, prefix }: IGenericRecord,
    parameterization: INotificationParameterization | undefined,
    isInputSelect = false,
    isExpireResolution = true
): IPrefixNextToExpire | undefined => {
    const { resolution_expiration_date = 10, consecutive_invoice_authorized = 10 } = parameterization || {};
    const consecutiveAvailable = final_authorization_range - last_consecutive_number;
    const formatNumber = (number: number): string => Intl.NumberFormat('de-DE').format(number);
    if (isExpireResolution) {
        const today = dayjs(getDateFromUnix(currentDateInUnix(), dateFormat).dateFormat, dateFormat);
        const finalValidity = dayjs(getDateFromUnix(final_validity, dateFormat).dateFormat, dateFormat);
        const differenceOfDays = finalValidity.diff(today, 'day');
        if (resolution_expiration_date >= differenceOfDays) {
            if (isInputSelect) {
                return {
                    ...defaultPrefixNextToExpire,
                    currentConsecutive: `*Le quedan ${formatNumber(
                        consecutiveAvailable
                    )} consecutivos disponibles a vencer el día ${
                        getDateFromUnix(final_validity).dateFormat
                    } del prefijo ${prefix}.`,
                };
            }
            return {
                ...defaultPrefixNextToExpire,
                numberPrefix: resolution_number,
                dayExpirate: formatNumber(differenceOfDays),
            };
        }
    } else if (consecutive_invoice_authorized >= consecutiveAvailable) {
        return {
            ...defaultPrefixNextToExpire,
            consecutiveAvailable: formatNumber(consecutiveAvailable),
        };
    }
};

/**
 * This function is for the expiration date of a product
 *
 * @param date: string - Date expiration
 * @returns string
 */
const dateExpirationToProduct = (date: string): string => dayjs(getDateToString(date)).add(5, 'hour').format('DD/MM/YYYY');

/*
 * This function creates warehouse, batch and date options
 *
 * @param listProducts: IGenericRecord[] - Data table invoice
 * @param products: IGenericRecord[] - Data products company
 * @returns IGenericRecord
 */
export const createOptionsInTableInvoice = (listProducts: IGenericRecord[], products: IGenericRecord[]): IGenericRecord => {
    const optionsByTableInvoice: IGenericRecord = {
        warehouse: [],
        batch: [],
        expirationDates: [],
    };
    listProducts.forEach((item, index) => {
        const product = findProductBySku(item.sku_internal, products);
        if (product) {
            optionsByTableInvoice.warehouse[index] = getWarehouseOptions(product);
            optionsByTableInvoice.batch[index] = getBatchOptions(product, item);
            if (lengthGreaterThanZero(optionsByTableInvoice.batch[index])) {
                optionsByTableInvoice.batch[index] = sortOptionBatch(optionsByTableInvoice.batch[index]);
            }
            optionsByTableInvoice.expirationDates[index] = getExpirationDates(item, optionsByTableInvoice.batch[index]);
        }
    });
    return optionsByTableInvoice;
};

/**
 * Find product by sku
 * @param sku_internal: string | undefined - Sku internal by product
 * @param products: IGenericRecord[] - List of products
 * @returns IGenericRecord | null - Product by sku internal
 */
const findProductBySku = (sku_internal: string | undefined, products: IGenericRecord[]): IGenericRecord | null => {
    return sku_internal ? products?.find(product => product.sku_internal === sku_internal) ?? null : null;
};

/**
 * Get warehouse options by product
 * @param product: IGenericRecord - Current product data
 * @returns List of warehouses
 */
const getWarehouseOptions = (product: IGenericRecord): IGenericRecord[] => {
    if (product?.stock && lengthGreaterThanZero(product.stock)) {
        return product.stock.map((warehouse: IGenericRecord) => ({
            value: warehouse.name,
            key: warehouse.warehouses_id,
            quantity: warehouse.quantity,
        }));
    }
    return [];
};

/**
 * Get batch options by product
 * @param product: IGenericRecord - Current product data
 * @param item: IGenericRecord - Current item
 * @returns List batch options
 */
const getBatchOptions = (product: IGenericRecord, item: IGenericRecord): IGenericRecord[] => {
    if (item.warehouse_id && product?.stock) {
        const { batch = [] } =
            product.stock.find(({ warehouses_id }: IGenericRecord) => warehouses_id === item.warehouse_id) || {};
        if (lengthGreaterThanZero(batch)) {
            return batch.map(({ batch_id, number, date_expired, batch_detail_id }: IGenericRecord) => ({
                date_expired,
                value: number,
                key: batch_id,
                batch_detail_id,
            }));
        }
    }
    return [];
};

/**
 * Get expiration dates
 * @param item: IGenericRecord - Current item with data
 * @param batchOptions: IGenericRecord - List of batches by product
 * @returns list options of expiration date by product
 */
const getExpirationDates = (item: IGenericRecord, batchOptions: IGenericRecord): IGenericRecord[] => {
    if (item.batch_id && lengthGreaterThanZero(batchOptions)) {
        return batchOptions
            .filter(({ key }: IGenericRecord) => key === item.batch_id)
            .flatMap(({ date_expired }: IGenericRecord) => {
                if (date_expired) {
                    return {
                        key: uuid(),
                        date_expired,
                        value: dateExpirationToProduct(String(date_expired)),
                    };
                }
            });
    }
    return [];
};

/**
 * This function is the modal props
 *
 * @param title: string - Title modal
 * @param text: JSX.Element - Description modal
 * @param show: boolean - Show modal
 * @param showModal: () => void
 * @returns IModalTypeProps
 */
export const modalInfoProps = (title: string, text: JSX.Element, show: boolean, showModal: () => void): IModalTypeProps => ({
    show,
    showModal,
    type: ActionType.INFO,
    title,
    text,
    isHiddenButton: false,
    backBtnText: TitleButtons.ACCEPT,
    classesModal: 'w-120.9 xs:w-full p-11.5',
});

/**
 * This const is change country
 */
export const defaultDepartmentAndCity = {
    department_id: null,
    department_name: null,
    city_id: null,
    city_name: null,
};

/**
 * This enum are the names of the inputs that have customer
 */
export enum FieldCustomer {
    FISCAL_RESPONSIBILITIES = 'fiscal_responsibilities',
    CITY_ID = 'city_id',
}

/**
 * This funtiontion return persentage of retetions
 *
 * @param taxTitle: string - Title tax
 * @param dataTaxesState: ITableTaxesAndRetention[] - Optinal param by taxes state
 * @returns number
 */
export const findPercentage = (taxTitle: string, withholdings: ITableTaxesAndRetention[] = []): number =>
    withholdings.find(tax => tax.name.toLowerCase().includes(taxTitle))?.percentage ?? 0;

/**
 * This function verifies the edited information
 *
 * @param form: IGenericRecord - Data form invoice
 * @param customer: IGenericRecord - Data customer
 * @returns string[]
 */
export const compareInformation = (form: IGenericRecord, customer: IGenericRecord = {}): string[] => {
    const fieldsEdit: string[] = [];

    if (lengthEqualToZero(Object.keys(customer))) return fieldsEdit;

    const customerAssign = assignValue(keysCustomer, customer);
    delete customerAssign.id;

    const excludedFields = [
        TypeNamesInputs.TAX_DETAILS_NAME,
        TypeNamesInputs.FISCAL_RESPONSIBILITIES_SNAKE,
        TypeNamesInputs.CITY_ID,
        TypeNamesInputs.COUNTRY_ID,
        TypeNamesInputs.DEPARTMENT_ID,
    ];

    Object.keys(customerAssign).forEach(name => {
        if (shouldSkipComparison(name, excludedFields)) return;

        const formValue = form[name];
        const customerValue = customerAssign[name];

        if (isDifferentValue(formValue, customerValue)) {
            fieldsEdit.push(name);
        }

        if (name === TypeNamesInputs.FISCAL_RESPONSIBILITIES_SNAKE) {
            compareFiscalResponsibilities(form[name], customerValue, fieldsEdit, name);
        }
    });
    return fieldsEdit;
};

/**
 * Checks if the field should be skipped from comparison.
 * @typeParam name: string - The field name.
 * @typeParam excludedFields: string[] - A list of field names to exclude from comparison.
 * @returns boolean - True if the field should be skipped, false otherwise.
 */
const shouldSkipComparison = (name: string, excludedFields: string[]): boolean => {
    return excludedFields.includes(name as TypeNamesInputs);
};

/**
 * Checks if two values are different and not both falsy.
 * @typeParam formValue: IGenericRecord - The value from the form.
 * @typeParam customerValue: IGenericRecord - The value from the customer.
 * @returns boolean - True if the values are different and not both falsy.
 */
const isDifferentValue = (formValue: IGenericRecord, customerValue: IGenericRecord): boolean => {
    return formValue !== customerValue && (!!formValue || !!customerValue);
};

/**
 * Compares fiscal responsibilities and adds the field name to fieldsEdit if necessary.
 * @typeParam formFiscal: IGenericRecord[] - Fiscal responsibilities from the form.
 * @typeParam customerFiscal: IGenericRecord[] - Fiscal responsibilities from the customer.
 * @typeParam fieldsEdit: string[] - List of fields that have discrepancies.
 * @typeParam name: string - The field name (Fiscal responsibilities).
 */
const compareFiscalResponsibilities = (
    formFiscal: IGenericRecord[],
    customerFiscal: IGenericRecord[],
    fieldsEdit: string[],
    name: string
): void => {
    customerFiscal.forEach((item: IGenericRecord) => {
        if (
            item &&
            !formFiscal.some(
                (itemField: IGenericRecord) => (itemField.name ?? itemField.fiscal_responsibility_name) === item.name
            )
        ) {
            fieldsEdit.push(name);
        }
    });
};

/**
 * This constant has the keys to assign by radio button
 */
export const radioButtonsKeys: { [key: string]: string } = {
    [RadioButtonName.IsElectronicCustomer]: 'electronic_biller',
    [RadioButtonName.InvoiceEmail]: 'receive_email',
    [RadioButtonName.AuthorizedInformation]: 'not_information_customer',
    [RadioButtonName.SendProducts]: 'receive_products',
};

/**
 * Response by NA
 */
export enum ResponseNA {
    NA_STRING = 'na_string',
    NULL_STRING = 'null-string',
    NA_NULL = 'na-null',
}

/**
 * This function is to search for the taxes of a product
 *
 * @param { product: { product_taxes = [] } }: IGenericRecord - Data product
 * @param typeTax: string - Type tax
 * @returns IGenericRecord
 */
export const findProductTax = (productTaxes: ITaxesProductsStock[], typeTax: string): ITaxesProductsStock =>
    productTaxes.find(tax => tax.tax_name === typeTax) || {
        company_tax_id: '',
        tax_name: '',
        tax_value: 0,
        custom_tax_value: 0,
        id: '',
        is_customized: true,
        unique_product_id: '',
        tax_rate: 0,
        tax_rate_name: '',
    };

/**
 * This function is to assign the data for the products
 *
 * @param invoiceDetails: IGenericRecord[] - Data invoice details
 * @param products: IGenericRecord[] - Products company
 * @returns IGenericRecord[]
 */
export const formatItemProduct = (invoiceDetails: IGenericRecord[], products: IGenericRecord[]): IGenericRecord[] =>
    invoiceDetails.map(({ warehouse_name, batch_id, ...item }, index) => {
        const { mandate, mandate_id, ...product } = products.find(product => product.id === item.unique_products_id) || {};
        const productTaxes = discardUntaxed(item.product_taxes);
        const ivaObject = findProductTax(productTaxes, IVA);
        const percentageObject = findProductTax(productTaxes, INC);
        const warehouseName = (value = ''): string => (warehouse_name === NA ? NA : value);
        const isNA = (value = ''): string | null => (item.is_product ? warehouseName(value) : NA);
        const {
            batch: [batchs],
        } = createOptionsInTableInvoice(item ? [{ ...item, batch_id }] : [], [product]);
        const batchAndDate = {
            batch_id,
            batch: batch_id ? batchs.find(({ key }: IGenericRecord) => key === batch_id).value : isNA(item.batch_number),
            input_date_expiration: isNA(item.date_expiration ? dateExpirationToProduct(String(item.date_expiration)) : ''),
        };
        return {
            ...initialDataTable(index, false),
            ...item,
            ...batchAndDate,
            warehouse_name,
            measurement: item.unit_measurement_name,
            iva: ivaObject?.tax_name || PERCENTAGE.ZERO,
            percentage: percentageObject?.tax_name || PERCENTAGE.ZERO,
            percentage_discount: stringToFloat(calculatePercentage(item.unit_value, item.discount)),
            taxes: productTaxes.map(({ company_tax_id, tax_value }) => ({ company_tax_id, tax_value })),
            is_mandate: !!mandate_id,
            taxes_invoice: productTaxes,
            mandate_id: mandate_id ?? NA,
            mandate: mandate ?? NA,
        };
    });

export const INVOICE_VALIDATION = '*El número de factura ya se está utilizando';
export const DATE_VALIDATION = '*La fecha de emisión es anterior en mas de 10 días de la fecha actual';
export const EMAIL_VALIDATION = '*Ingrese un email válido, este no puede ser menor a la fecha de emisión';
export const VALID_EMAIL_VALIDATION = '*Ingrese un email válido';
export const CUSTOMER_VALIDATION = '*Ya existe un cliente con este número de documento';
export const SEND_PRODUCTS = '¿El cliente solicita que se le envíen los productos y/o cotización a su dirección?';
export const SEND_ADDRESS =
    'En caso de que la cotización incluya el envío de productos a una dirección o que la cotización vaya a ser enviada de forma impresa, esta dirección se agregará aquí.';
export const POSTAL_CODE_VALIDATION = '*El código postal debe tener 6 dígitos';

/**
 * This const define the document type NIT
 */
export const DOCUMENT_NIT = '80fc8d67-9a2b-3027-9eae-09db2d46dfd1';

/**
 * Types of prefixes
 */
export enum typePrefixNotes {
    CREDIT_NOTE = 'Nota crédito',
    DEBIT_NOTE = 'Nota débito',
    INVOICE = 'INVOICE',
    DELETE = 'DELETE',
    SUPPORTING_DOCUMENT = 'SUPPORTING_DOCUMENT',
    ADJUSTMENT_NOTE = 'ADJUSTMENT_NOTE',
}

/**
 * This const is customer default
 */
export const SIMPLE_INFORMATION = {
    person_id: '', //If it already exists
    customer_id: '', //If it already exists
    client_id: '', //If it already exists
    document_type: '',
    document_number: '',
    name: '',
    fiscal_responsibilities: [
        {
            uuid: uuid(),
            id: '',
            key: '',
            value: '',
            fiscal_responsibility_name: '',
        },
    ],
    tax_details_code: '',
    tax_details_name: '',
};
