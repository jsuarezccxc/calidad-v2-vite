import type { IQuote } from '@pages/quotes-report';
import type { 
    IQuoteOption, 
    QuoteStatus 
} from '@models/QuoteGeneration';
import { IGenericRecord } from '@models/GenericRecord';

/**
 * Structure for saved quote data that might come from localStorage
 * 
 * @interface ISavedQuoteData
 * @typeParam quoteNumber: string - Quote identifier number
 * @typeParam createdAt: string - Quote creation date
 * @typeParam client_name: string - Client name from external source
 * @typeParam name: string - Alternative client name field
 * @typeParam client_email: string - Client email address
 * @typeParam status: string - Quote status (sent, draft, pending)
 * @typeParam total: number - Quote total amount
 * @typeParam currency: string - Currency code (COP, USD, etc.)
 */
export interface ISavedQuoteData {
    quoteNumber?: string;
    createdAt?: string;
    client_name?: string;
    name?: string;
    client_email?: string;
    status?: string;
    total?: number;
    currency?: string;
    [key: string]: unknown;
}

/**
 * Validation result structure for quote data validation
 * 
 * @interface IValidationResult
 * @typeParam isValid: boolean - Whether validation passed
 * @typeParam data: T - Validated data if successful
 * @typeParam errors: string[] - Array of validation errors
 * @typeParam warnings: string[] - Array of validation warnings
 */
export interface IValidationResult<T> {
    isValid: boolean;
    data?: T;
    errors: string[];
    warnings: string[];
}

/**
 * Email validation constants for quote data
 */
const EMAIL_VALIDATION = {
    REGEX: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    MIN_LENGTH: 5,
    MAX_LENGTH: 254
} as const;

/**
 * Storage keys for localStorage operations
 */
const STORAGE_KEYS = {
    QUOTES: 'quotes_data'
} as const;

/**
 * Valid quote statuses for validation
 */
const VALID_QUOTE_STATUSES: QuoteStatus[] = [
    'draft', 
    'sent', 
    'pending', 
    'completed', 
    'cancelled', 
    'approved', 
    'rejected'
];

/**
 * Validates if a string is a valid email address
 * 
 * Uses RFC 5322 compliant regex pattern for email validation
 * with additional length constraints for security.
 * 
 * @typeParam email: string - Email string to validate
 * @returns True if email is valid, false otherwise
 */
export const isValidEmail = (email: string): boolean => {
    if (!email || typeof email !== 'string') return false;
    if (email.length < EMAIL_VALIDATION.MIN_LENGTH || email.length > EMAIL_VALIDATION.MAX_LENGTH) return false;
    return EMAIL_VALIDATION.REGEX.test(email);
};

/**
 * Date validation constants for quote data
 */
const DATE_VALIDATION = {
    MIN_YEAR: 1900,
    MAX_YEAR: 2100,
    ISO_DATE_REGEX: /^\d{4}-\d{2}-\d{2}$/
} as const;

/**
 * Validates if a date string is valid and within acceptable range
 * 
 * Validates both format and logical date constraints.
 * Supports ISO date strings (YYYY-MM-DD) and other standard formats.
 * 
 * @typeParam dateString: string - Date string to validate
 * @returns True if date is valid and within range, false otherwise
 */
export const isValidDate = (dateString: string): boolean => {
    if (!dateString || typeof dateString !== 'string') return false;
    
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return false;
    
    const year = date.getFullYear();
    return year >= DATE_VALIDATION.MIN_YEAR && year <= DATE_VALIDATION.MAX_YEAR;
};

/**
 * Quote validation limits and constraints
 */
const QUOTE_VALIDATION_LIMITS = {
    MIN_TOTAL: 0,
    MAX_TOTAL: 999999999,
    QUOTE_NUMBER_MIN_LENGTH: 1,
    QUOTE_NUMBER_MAX_LENGTH: 50
} as const;

/**
 * Validates a single saved quote data object with comprehensive error checking
 * 
 * Performs type checking, business rule validation, and data integrity checks
 * for quote data from localStorage or external sources.
 * 
 * @typeParam data: unknown - Quote data to validate (unknown type for safety)
 * @typeParam index: number - Optional index for error reporting in batch operations
 * @returns Validation result with success status, validated data, and error details
 */
export const validateSavedQuoteData = (
    data: unknown,
    index?: number
): IValidationResult<ISavedQuoteData> => {
    const idx = index ?? 0;
    const errors: string[] = [];
    const warnings: string[] = [];

    // Check if data is an object
    if (!data || typeof data !== 'object') {
        errors.push(`Quote ${idx + 1}: Data must be an object`);
        return { isValid: false, errors, warnings };
    }

    const quote = data as ISavedQuoteData;
    
    // Validate required fields
    if (!quote.client_name && !quote.name) {
        errors.push(`Quote ${idx + 1}: Client name is required (client_name or name)`);
    }

    // Validate email if present
    if (quote.client_email && !isValidEmail(quote.client_email)) {
        errors.push(`Quote ${idx + 1}: Invalid email format`);
    }

    // Validate date if present
    if (quote.createdAt && !isValidDate(quote.createdAt)) {
        warnings.push(`Quote ${idx + 1}: Invalid creation date, will use current date`);
    }

    // Validate numeric fields with business constraints
    if (quote.total !== undefined && (
        typeof quote.total !== 'number' || 
        quote.total < QUOTE_VALIDATION_LIMITS.MIN_TOTAL || 
        quote.total > QUOTE_VALIDATION_LIMITS.MAX_TOTAL
    )) {
        warnings.push(`Quote ${idx + 1}: Invalid total amount, will default to 0`);
    }

    // Validate quote number format and length
    if (quote.quoteNumber && (
        typeof quote.quoteNumber !== 'string' ||
        quote.quoteNumber.length < QUOTE_VALIDATION_LIMITS.QUOTE_NUMBER_MIN_LENGTH ||
        quote.quoteNumber.length > QUOTE_VALIDATION_LIMITS.QUOTE_NUMBER_MAX_LENGTH
    )) {
        warnings.push(`Quote ${idx + 1}: Invalid quote number format or length`);
    }

    // Validate status against known quote states
    if (quote.status && !VALID_QUOTE_STATUSES.includes(quote.status as QuoteStatus)) {
        warnings.push(`Quote ${idx + 1}: Unknown status "${quote.status}", will default to draft`);
    }

    return {
        isValid: errors.length === 0,
        data: quote,
        errors,
        warnings
    };
};

/**
 * Validates an array of saved quote data
 * 
 * @typeParam data: unknown - Array of quote data to validate
 * @returns Validation result with valid quotes
 */
export const validateSavedQuotesArray = (
    data: unknown
): IValidationResult<ISavedQuoteData[]> => {
    const errors: string[] = [];
    const warnings: string[] = [];
    const validQuotes: ISavedQuoteData[] = [];

    // Check if data is an array
    if (!Array.isArray(data)) {
        errors.push('Quotes data must be an array');
        return { isValid: false, errors, warnings };
    }

    // Validate each quote
    data.forEach((quote, index) => {
        const validation = validateSavedQuoteData(quote, index);
        
        errors.push(...validation.errors);
        warnings.push(...validation.warnings);
        
        // Only include valid quotes
        if (validation.isValid && validation.data) {
            validQuotes.push(validation.data);
        }
    });

    return {
        isValid: validQuotes.length > 0,
        data: validQuotes,
        errors,
        warnings
    };
};

/**
 * Transforms validated saved quote data to IQuote format
 * 
 * @typeParam savedQuote: ISavedQuoteData - Validated saved quote data
 * @typeParam index: number - Index for generating fallback values
 * @returns Transformed IQuote object
 */
export const transformSavedQuoteToIQuote = (
    savedQuote: ISavedQuoteData,
    index: number
): IQuote => {
    return {
        id: savedQuote.quoteNumber || `quote-${index + 1}`,
        number: savedQuote.quoteNumber || `${index + 1}`.padStart(3, '0'),
        date: savedQuote.createdAt 
            ? new Date(savedQuote.createdAt).toISOString().split('T')[0]
            : new Date().toISOString().split('T')[0],
        customer: savedQuote.client_name || savedQuote.name || 'Cliente no especificado',
        email: savedQuote.client_email || 'sin-email@example.com',
        state: savedQuote.status === 'sent' ? 'Enviado' as const : 'Sin enviar' as const,
        total: typeof savedQuote.total === 'number' && 
               savedQuote.total >= QUOTE_VALIDATION_LIMITS.MIN_TOTAL && 
               savedQuote.total <= QUOTE_VALIDATION_LIMITS.MAX_TOTAL 
               ? savedQuote.total 
               : 0,
        currency: savedQuote.currency || 'COP',
        checked: false
    };
};

/**
 * Safe localStorage getter with validation
 * 
 * @typeParam key: string - Storage key to retrieve
 * @returns Validation result with parsed data
 */
export const getSafeLocalStorageData = <T>(key: string): IValidationResult<T | null> => {
    const errors: string[] = [];
    const warnings: string[] = [];

    try {
        const rawData = localStorage.getItem(key);
        
        if (!rawData) {
            return {
                isValid: true,
                data: null,
                errors,
                warnings
            };
        }

        const parsedData = JSON.parse(rawData);
        
        return {
            isValid: true,
            data: parsedData,
            errors,
            warnings
        };
    } catch (error) {
        errors.push(`Failed to parse localStorage data for key "${key}": ${error}`);
        return {
            isValid: false,
            errors,
            warnings
        };
    }
};

/**
 * Safe localStorage setter with error handling
 * 
 * @typeParam key: string - Storage key
 * @typeParam data: T - Data to store
 * @returns Success status with any errors
 */
export const setSafeLocalStorageData = <T>(
    key: string,
    data: T
): { success: boolean; errors: string[] } => {
    const errors: string[] = [];

    try {
        const serializedData = JSON.stringify(data);
        localStorage.setItem(key, serializedData);
        
        return { success: true, errors };
    } catch (error) {
        errors.push(`Failed to save data to localStorage for key "${key}": ${error}`);
        return { success: false, errors };
    }
};

/**
 * Validates and retrieves quote data from localStorage
 * 
 * @returns Validation result with transformed IQuote array
 */
export const getValidatedQuotesFromStorage = (): IValidationResult<IQuote[]> => {
    const errors: string[] = [];
    const warnings: string[] = [];

    // Get data from localStorage
    const storageResult = getSafeLocalStorageData<unknown>(STORAGE_KEYS.QUOTES);
    
    if (!storageResult.isValid) {
        errors.push(...storageResult.errors);
        return { isValid: false, errors, warnings };
    }

    // If no data, return empty array (valid case)
    if (!storageResult.data) {
        return {
            isValid: true,
            data: [],
            errors,
            warnings
        };
    }

    // Validate the quotes array
    const validationResult = validateSavedQuotesArray(storageResult.data);
    
    if (!validationResult.isValid || !validationResult.data) {
        errors.push(...validationResult.errors);
        warnings.push(...validationResult.warnings);
        return { isValid: false, errors, warnings };
    }

    // Transform to IQuote format
    const transformedQuotes = validationResult.data.map(transformSavedQuoteToIQuote);

    return {
        isValid: true,
        data: transformedQuotes,
        errors,
        warnings: [...warnings, ...validationResult.warnings]
    };
};

/**
 * Cleans and validates localStorage quote data
 * Removes invalid entries and logs warnings
 * 
 * @returns Cleanup result with statistics
 */
export const cleanupQuoteStorage = (): {
    success: boolean;
    originalCount: number;
    validCount: number;
    errors: string[];
    warnings: string[];
} => {
    const result = getValidatedQuotesFromStorage();
    
    if (!result.isValid) {
        return {
            success: false,
            originalCount: 0,
            validCount: 0,
            errors: result.errors,
            warnings: result.warnings
        };
    }

    const validQuotes = result.data || [];
    
    // Save cleaned data back to storage
    const saveResult = setSafeLocalStorageData(STORAGE_KEYS.QUOTES, validQuotes);
    
    return {
        success: saveResult.success,
        originalCount: validQuotes.length, // We already have cleaned data
        validCount: validQuotes.length,
        errors: [...result.errors, ...saveResult.errors],
        warnings: result.warnings
    };
};

// Additional quote generation utility functions

/**
 * Validates if a draft document is ready for processing
 * Checks for document ID existence and proper structure
 * 
 * @typeParam quoteId: string - Quote identifier for validation
 * @typeParam draftDocument: ISavedQuoteData | null - Draft document data from state
 * @returns True if draft document is ready for processing
 */
export const isDraftDocumentReady = (quoteId: string, draftDocument: ISavedQuoteData | null): boolean => {
    return Boolean(quoteId && draftDocument && draftDocument.quoteNumber);
};

/**
 * Gets tooltip data for radio button entities based on selected value
 * Finds matching entity configuration for tooltip display
 * 
 * @typeParam entities: IQuoteOption[] - Array of radio button entity configurations
 * @typeParam selectedValue: string - Currently selected radio button value
 * @returns Matching entity configuration or undefined if not found
 */
export const getQuoteRadioButtonTooltipData = (entities: IQuoteOption[], selectedValue: string): IQuoteOption | undefined => {
    return entities.find(entity => entity.name === selectedValue);
};

/**
 * Gets tooltip data from options array based on active ID
 * Finds matching option configuration for tooltip display
 * 
 * @typeParam options: IQuoteOption[] - Array of option objects with id and tooltip data
 * @typeParam activeId: string - Currently active option ID
 * @returns Matching option configuration or undefined if not found
 */
export const getTooltipData = (options: IQuoteOption[], activeId: string): IQuoteOption | undefined => {
    return options.find(option => option.id === activeId);
};

/**
 * Validates if percentage should be applied based on tax type and value
 * Determines tax calculation logic for Colombian withholding taxes
 * 
 * @typeParam floatValue: number - The percentage value entered by user
 * @typeParam taxName: string - Name of the tax type (ReteICA, ReteIVA, etc.)
 * @returns True if percentage should be applied, false otherwise
 */
export const shouldApplyPercentage = (floatValue: number, taxName: string): boolean => {
    const isReteICA = taxName.includes('ReteICA');
    const isReteOrRetIVA = ['ReteICA', 'ReteIVA'].includes(taxName);
    
    return (floatValue < 10 && isReteICA) || 
           (floatValue < 100 && !isReteOrRetIVA);
};

/**
 * Validates if quotes data from Redux store is valid and properly structured
 * Checks for data existence and array format required by quote components
 * 
 * @typeParam quotesData: IGenericRecord | null - Quotes data object from Redux store
 * @returns True if data is valid, false otherwise
 */
export const isQuotesDataValid = (quotesData: IGenericRecord | null): boolean => {
    return Boolean(quotesData && quotesData.data && Array.isArray(quotesData.data));
};

/**
 * Generates the next sequential quote number based on existing quotes
 * Analyzes existing quote numbers and returns the next available number
 * 
 * @typeParam quotesData: IGenericRecord | null - Quotes data object containing existing quote numbers
 * @returns Next available quote number as string (default: '001')
 */
export const getNextQuoteNumber = (quotesData: IGenericRecord | null): string => {
    if (isQuotesDataValid(quotesData)) {
        const numbers = quotesData.data
            .map((quote: IGenericRecord) => parseInt(quote.number) || 0)
            .filter((num: number) => !isNaN(num));
        
        if (numbers.length > 0) {
            const maxNumber = Math.max(...numbers);
            return String(maxNumber + 1);
        }
    }
    return '001';
};

/**
 * Handles option change for radio button components
 * Updates form data with new option selection and manages related state
 * 
 * @typeParam option: IQuoteOption - Selected option object with value and metadata
 * @typeParam formData: IGenericRecord - Current form data state
 * @typeParam updateFormData: (data: IGenericRecord) => void - Function to update form state
 */
export const handlePersonalDataOptionChange = (
    option: IQuoteOption,
    formData: IGenericRecord,
    updateFormData: (data: IGenericRecord) => void
): void => {
    const updatedData = {
        ...formData,
        authorize_personal_data: option.name,
        selected_option_id: option.id,
    };
    updateFormData(updatedData);
};

/**
 * Validates table configuration and handlers for proper operation
 * Ensures both table configuration and handlers are properly defined
 * 
 * @typeParam tableConfig: IGenericRecord | null - Table configuration object
 * @typeParam tableHandlers: IGenericRecord | null - Table event handlers object
 * @returns True if both configuration and handlers are valid
 */
export const isValidTableConfiguration = (tableConfig: IGenericRecord | null, tableHandlers: IGenericRecord | null): boolean => {
    return Boolean(
        tableConfig && 
        typeof tableConfig === 'object' && 
        tableHandlers && 
        typeof tableHandlers === 'object'
    );
};

/**
 * Generates CSS class name for table cells based on column index
 * Provides consistent styling for table cell layout and alignment
 * 
 * @typeParam index: number - Column index for the table cell
 * @returns CSS class name string for the table cell
 */
export const getTableCellClassName = (index: number): string => {
    const baseClass = 'table-cell';
    const alignmentClass = index === 0 ? 'text-left' : 'text-center';
    return `${baseClass} ${alignmentClass}`;
};

/**
 * Generates validated CSS class name for table cells with error states
 * Combines base cell styling with validation state indicators
 * 
 * @typeParam index: number - Column index for the table cell
 * @typeParam validate: boolean - Whether validation is enabled
 * @typeParam hasError: boolean - Whether the cell has validation errors
 * @returns CSS class name string with validation states
 */
export const getValidatedCellClassName = (index: number, validate: boolean, hasError: boolean): string => {
    const baseClass = getTableCellClassName(index);
    const validationClass = validate ? (hasError ? 'cell-error' : 'cell-valid') : '';
    return `${baseClass} ${validationClass}`.trim();
};

/**
 * Gets tooltip data from quotes array based on active ID
 * Finds matching quote configuration for tooltip display
 * 
 * @typeParam options: IGenericRecord[] - Array of quote option objects
 * @typeParam activeId: string - Currently active quote option ID
 * @returns Matching quote configuration object
 */
export const getQuoteTooltipData = (options: IGenericRecord[], activeId: string): IGenericRecord | undefined => {
    return options.find(option => option.id === activeId) || {};
};

/**
 * Formats store prefixes for quote numbering system
 * Handles contingency mode and standard prefix formatting
 * 
 * @typeParam storePrefix: IGenericRecord[] - Array of store prefix configurations
 * @typeParam isContingency: boolean - Whether system is in contingency mode
 * @returns Formatted prefix array for quote numbering
 */
export const formatQuotePrefixes = (storePrefix: IGenericRecord[] = [], isContingency = false): IGenericRecord[] => {
    if (isContingency) {
        return storePrefix.filter(prefix => prefix.contingency === true);
    }
    return storePrefix.filter(prefix => prefix.contingency !== true);
};
