export { QuoteBillingInformation } from './QuoteBillingInformation';
export { QuoteProductsTable } from './QuoteProductsTable';
export { QuoteFinancialSummary } from './QuoteFinancialSummary';
export { QuoteCharacterLimitModal } from './QuoteCharacterLimitModal';
export { QuoteInvoiceForm } from './QuoteInvoiceForm';
export { ConditionalFieldInput } from './ConditionalFieldInput';

// Re-export types from models
export type { 
    IQuoteBillingInformationProps, 
    IConditionalFieldInputProps,
    IQuoteFormData,
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
    QUOTE_WITHHOLDING_DATA,
    QUOTE_VAT_VALUES,
    QUOTE_PERSONAL_DATA_OPTIONS,
    QUOTE_AUTHORIZED_DATA,
    QUOTE_UNAUTHORIZED_DATA,
    QUOTE_WITHHOLDING_TABLE_HEADINGS,
    QUOTE_TOTAL_FIELDS,
    QUOTE_PAYMENT_METHOD,
    QUOTE_FORM_DATA,
    QUOTE_PRODUCT_ITEM,
    QUOTE_PERSONAL_DATA_ENTITIES
} from '@constants/QuoteViewLabels';

// Re-export from quoteCalculations
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

// Re-export utils from utils
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

// Re-export additional constants from ElectronicInvoice
export { INVOICE_TYPES } from '@constants/ElectronicInvoice';

// Local utility functions
import { IInvoiceDetails } from '@models/ElectronicInvoice';
import { IGenericRecord } from '@models/GenericRecord';
import { getSum } from '@utils/Array';
import { assignValue } from '@utils/Json';
import { CONSUMER_CLIENT_DOCUMENT } from '@constants/ElectronicInvoice';
import { KEYS_ASSIGN_OBJECT } from '@constants/BillingInformation';
import { RETE_ICA, RETE_IVA } from '@constants/Tax';
import { BASE, IVA } from '@constants/Invoice';
import { ONE_HUNDRED, ONE_THOUSAND } from '@constants/ElectronicInvoice';
import { calculateQuoteVat, assignQuoteProducts } from '@utils/quoteCalculations';

/**
 * Calculates withholding values for quote products based on tax configuration
 * 
 * @typeParam productsWithTaxes: IInvoiceDetails[] - Array of products with calculated taxes
 * @typeParam withholdingTable: IGenericRecord[] - Withholding configuration table
 * @returns IGenericRecord[] - Updated withholding table with calculated values
 */
export const calculateWithholdingValues = (
    productsWithTaxes: IInvoiceDetails[],
    withholdingTable: IGenericRecord[]
): IGenericRecord[] => {
    return withholdingTable.map(({ name, ...item }: IGenericRecord) => {
        const base = getSum(
            productsWithTaxes.map(({ total_buy, product_taxes }) => ({
                iva: calculateQuoteVat(product_taxes, total_buy),
                base: total_buy,
            })),
            name === RETE_IVA ? IVA : BASE
        );
        return {
            ...item,
            base,
            name,
            value: (base * item.percentage) / (name === RETE_ICA ? ONE_THOUSAND : ONE_HUNDRED),
        };
    });
};

/**
 * Processes draft document data for quote generation
 * 
 * @typeParam draftDocument: IGenericRecord - Draft document from backend
 * @typeParam formData: IGenericRecord - Current form data
 * @typeParam updateFormData: function - Form update function
 * @typeParam products: IInvoiceDetails[] - Current products array
 * @returns Object with processed form data and products
 */
export const processDraftDocument = (
    draftDocument: IGenericRecord,
    formData: IGenericRecord,
    updateFormData: (data: IGenericRecord) => void,
    products: IInvoiceDetails[]
): { formData: IGenericRecord; products: IInvoiceDetails[] } => {
    const { withholdings, invoiceDetails, ...form } = assignValue(KEYS_ASSIGN_OBJECT, draftDocument);
    
    const processedFormData = {
        ...formData,
        ...form,
        not_information_customer: form.document_number !== CONSUMER_CLIENT_DOCUMENT,
        operation_type: INVOICE_TYPES.find(item => item.id === form.operation_type_id)?.value,
    };
    
    const processedProducts = assignQuoteProducts(invoiceDetails, products);
    const sendingCharge = draftDocument?.sending_charge || 0;
    
    updateFormData(processedFormData);
    
    return {
        processedFormData,
        processedProducts,
        sendingCharge,
        withholdings
    };
};

/**
 * Creates table configuration object for quote products table
 * 
 * @typeParam productData: IInvoiceDetails[] - Product data array
 * @typeParam errorMessages: string[] - Validation error messages
 * @typeParam perishableErrors: string[] - Perishable product errors
 * @returns ITableConfig - Table configuration object
 */
export const createTableConfig = (
    productData: IInvoiceDetails[],
    errorMessages: string[],
    perishableErrors: string[]
): ITableConfig => ({
    data: Array.isArray(productData) ? productData : [],
    validate: false,
    errorMessages: Array.isArray(errorMessages) ? errorMessages : [],
    perishableErrors: Array.isArray(perishableErrors) ? perishableErrors : [],
});

/**
 * Interface for table configuration
 * 
 * @interface ITableConfig
 * @typeParam data: IInvoiceDetails[] - Table data
 * @typeParam validate: boolean - Validation flag
 * @typeParam errorMessages: string[] - Error messages array
 * @typeParam perishableErrors: string[] - Perishable errors array
 */
export interface ITableConfig {
    data: IInvoiceDetails[];
    validate: boolean;
    errorMessages: string[];
    perishableErrors: string[];
}

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
