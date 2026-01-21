import { KEYS_ASSIGN_OBJECT } from '@constants/BillingInformation';
import { CREDIT } from '@constants/Invoice';

import { IGenericRecord } from '@models/GenericRecord';
import { FieldName } from '@models/SalesInvoice';
import { IQuoteFormData, IQuoteProduct } from '@models/QuoteGeneration';
import { ITableTaxesAndRetention } from '@models/ElectronicInvoice';

import { assignValue } from '@utils/Json';

import { INVOICE_TYPES } from '@constants/ElectronicInvoice';
import { QUOTE_CONSTANTS } from '@constants/QuoteViewLabels';
import { assignQuoteProducts } from '@utils/quoteCalculations';

export { QuoteBillingInformation } from './QuoteBillingInformation';
export { QuoteFinancialSummary } from './QuoteFinancialSummary';
export { QuoteWithholdingTable } from './QuoteWithholdingTable';
export { QuoteSubTotals } from './QuoteSubTotals';
export { QuoteCharacterLimitModal } from './QuoteCharacterLimitModal';
export { ConditionalFieldInput } from './ConditionalFieldInput';
export { QuoteInvoiceForm } from './QuoteInvoiceForm';

export type {
    IQuoteBillingInformationProps,
    IConditionalFieldInputProps,
    IQuoteFormData,
    IQuoteDraftFormData,
    IQuoteOption,
    IQuoteProduct,
    IProductTax,
    IUserData,
    QuoteStatus
} from '@models/QuoteGeneration';
export { QuoteFieldLength, QuoteDianResponse } from '@models/QuoteGeneration';

export {
    DEFAULT_PERCENTAGE_VALUE,
    MINIMUM_VALUE,
    VALID_DOCUMENT_TYPES,
    MODAL_TEXTS,
    QUOTE_QUERY_FIELDS,
    QUOTE_MODALS,
    QUOTE_ID_KEY,
    QUOTE_VAT_VALUES,
    QUOTE_PERSONAL_DATA_OPTIONS,
    QUOTE_AUTHORIZED_DATA,
    QUOTE_UNAUTHORIZED_DATA,
    QUOTE_WITHHOLDING_TABLE_HEADINGS,
    QUOTE_PAYMENT_METHOD,
    QUOTE_FORM_DATA,
    QUOTE_PRODUCT_ITEM,
    QUOTE_PERSONAL_DATA_ENTITIES
} from '@constants/QuoteViewLabels';

/**
 * Configuration for quote totals fields styling
 * Defines which fields should be displayed in bold for emphasis
 */
export const QUOTE_TOTAL_FIELDS = [
    { key: 'subtotal', bold: true },
    { key: 'total_gross', bold: true },
    { key: 'total_payable', bold: true },
    { key: 'total', bold: true },
] as const;

export {
    QUOTE_PRODUCT_TABLE_HEADERS,
    QUOTE_REQUIRED_TABLE_FIELDS,
    assignQuoteProducts,
    calculateQuoteBase,
    calculateQuoteVat,
    calculateQuoteProductTaxes,
    getDocumentTypeValue,
    getQuotePerishableErrors,
    handleExchangeRateChange,
    handleOptionChange,
    isStateDataReadyForTotals,
    updatePersonalFields
} from '@utils/quoteCalculations';

export { calculateWithholdingValues } from '@utils/ElectronicInvoice';

export {
    isDraftDocumentReady,
    getQuoteRadioButtonTooltipData,
    getTooltipData,
    shouldApplyPercentage,
    isQuotesDataValid,
    getNextQuoteNumber,
    handlePersonalDataOptionChange,
    isValidTableConfiguration,
    getTableCellClassName,
    getValidatedCellClassName,
    getQuoteTooltipData,
    formatQuotePrefixes
} from '@utils/quoteValidation';

export { INVOICE_TYPES } from '@constants/ElectronicInvoice';
export { VARIABLE_TYPE } from '@constants/DataTypes';

/**
 * Default values for quote calculations
 */
export const QUOTE_DEFAULT_VALUES = {
    PERCENTAGE_VALUE: '0',
    TIMEOUT_DELAY: 1000,
} as const;

/**
 * Number format options for quote financial displays
 * Uses comma as thousands separator instead of period (Colombia standard)
 */
export const QUOTE_NUMBER_FORMAT_OPTIONS = {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
    useGrouping: true,
} as const;

/**
 * Formats a number with comma as thousands separator for quote displays
 * Example: 1000000 → "1,000,000.00"
 *
 * @typeParam value: number - The numeric value to format
 * @typeParam options?: Intl.NumberFormatOptions - Optional format configuration
 * @returns string - Formatted number string with comma separators
 */
export const formatQuoteNumber = (
    value: number,
    options: Intl.NumberFormatOptions = QUOTE_NUMBER_FORMAT_OPTIONS
): string => {
    return new Intl.NumberFormat('en-US', options).format(value);
};

/**
 * Quote pagination and limits configuration
 */
export const QUOTE_PAGINATION_CONFIG = {
    ALL_QUOTES_LIMIT: 9999,
    INITIAL_PAGE: 1,
} as const;

/**
 * Returns required form fields for quote validation
 * Follows the same pattern as generate-sales-invoice for consistency
 *
 * @typeParam data: IQuoteFormData - Current form data to determine conditional field requirements
 * @returns string[] - Array of required field names for validation
 */
export const QUOTE_REQUIRED_FORM_FIELDS = (data: IQuoteFormData | IGenericRecord): string[] => [
    FieldName.OperationType,
    FieldName.PaymentType,
    FieldName.PaymentMethodId,
    FieldName.ForeignExchangeId,
    FieldName.SalesManager,
    FieldName.QuoteManagerDocumentType,
    FieldName.QuoteManagerDocumentNumber,
    ...(data?.not_information_customer ? [FieldName.ClientId] : []),
    ...(data?.payment_type_name === CREDIT ? [FieldName.CollectionDays] : []),
    ...(data?.foreign_exchange_id !== QUOTE_CONSTANTS.COLOMBIAN_CURRENCY_ID ? [FieldName.ForeignExchangeRate] : []),
];




/**
 * Quote invoice state structure for Redux persistence
 * Contains complete quote state for session management and persistence
 *
 * @interface IQuoteInvoiceState
 * @typeParam formData: IQuoteFormData - Quote form data with all billing information
 * @typeParam productData: IQuoteProduct[] - Array of quote products with tax calculations
 * @typeParam withholdingTable: ITableTaxesAndRetention[] - Withholding taxes table configuration
 * @typeParam sendingCharge: number - Shipping/sending charge amount for quote
 */
export interface IQuoteInvoiceState {
    formData: IQuoteFormData;
    productData: IQuoteProduct[];
    withholdingTable: ITableTaxesAndRetention[];
    sendingCharge: number;
}

/**
 * Processes draft document data for quote generation
 *
 * @typeParam draftDocument: IGenericRecord - Draft document from backend
 * @typeParam formData: IQuoteFormData - Current quote form data
 * @typeParam updateFormData: (data: IQuoteFormData) => void - Form update function with quote data
 * @typeParam products: IQuoteProduct[] - Current quote products array
 * @returns IQuoteInvoiceState - Object with processed form data, products, charge, and withholdings
 */
export const processDraftDocument = (
    draftDocument: IGenericRecord,
    formData: IQuoteFormData,
    updateFormData: (data: IQuoteFormData) => void,
    products: IQuoteProduct[]
): IQuoteInvoiceState => {
    const { withholdings, invoiceDetails, ...form } = assignValue(KEYS_ASSIGN_OBJECT, draftDocument);

    const processedFormData = {
        ...formData,
        ...form,
        not_information_customer: form.document_number !== QUOTE_CONSTANTS.CONSUMER_CLIENT_DOCUMENT,
        operation_type: INVOICE_TYPES.find((item: IGenericRecord) => item.id === form.operation_type_id)?.value,
    } as IQuoteFormData;

    const productData = assignQuoteProducts(invoiceDetails as IQuoteProduct[], products);
    const sendingCharge = draftDocument?.sending_charge || 0;

    updateFormData(processedFormData);

    return {
        formData: processedFormData,
        productData,
        withholdingTable: withholdings,
        sendingCharge
    };
};



/**
 * Interface for warning modal components props
 * Used by QuoteCharacterLimitModal for modal state management
 *
 * @interface IQuoteWarningModalsProps
 * @typeParam show: boolean - Modal visibility state
 * @typeParam onClose: function - Callback function when modal is closed
 * @typeParam onAccept: function - Callback function when user accepts/confirms
 */
export interface IQuoteWarningModalsProps {
    show: boolean;
    onClose: () => void;
    onAccept: () => void;
}

/**
 * Select dropdown option data structure
 * Represents individual option in select components with extensible properties
 *
 * @interface ISelectOption
 * @typeParam value: string | number - Option value identifier used for form submission
 * @typeParam name: string - Optional option display name/label shown to user
 * @typeParam [key: string]: unknown - Additional extensible properties for custom option data
 */
export interface ISelectOption {
    value: string | number;
    name?: string;
    [key: string]: unknown;
}

/**
 * Interface for select dropdown option change events
 * Used when handling SelectSearch component changes in quote forms
 *
 * @interface ISelectOptionEvent
 * @typeParam option: ISelectOption - Selected option object with value and additional properties
 * @typeParam name: string - Optional field name that triggered the change for event routing
 */
export interface ISelectOptionEvent {
    option: ISelectOption;
    name?: string;
}

/**
 * Interface for input field change events
 * Used when handling TextInput, NumberInput, and TextArea changes in quote forms
 *
 * @interface IInputChangeEvent
 * @typeParam target: object - Event target object with input properties
 * @typeParam target.name: string - Input field name identifier
 * @typeParam target.value: string | number - Current input field value
 */
export interface IInputChangeEvent {
    target: {
        name: string;
        value: string | number;
    };
}


