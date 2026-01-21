import type { 
    IQuoteFormData, 
    IQuoteProduct, 
    IProductTax, 
    IUserData 
} from '@models/QuoteGeneration';
import { IGenericRecord } from '@models/GenericRecord';
import { lengthGreaterThanZero } from '@utils/Length';
import { calculatePercentage } from '@utils/Number';
import { stringToFloat } from '@utils/ElectronicInvoice';
import { getDateFromUnix, getUnixFromDate } from '@utils/Date';
import { NA } from '@constants/ElectronicInvoice';
import { QUOTE_ID_KEY } from '@constants/QuoteViewLabels';

/**
 * Valid Colombian document types accepted directly
 * Includes Cédula de Ciudadanía (CC), Tarjeta de Identidad (TI), and Registro Civil (RC)
 */
const VALID_DOCUMENT_TYPES = ['CC', 'TI', 'RC'] as const;

/**
 * Calculate quote discount value based on percentage and unit value
 * Internal helper function for quote calculations
 * 
 * @typeParam item: IGenericRecord - Quote item with percentage_discount and unit_value
 * @returns Calculated discount amount
 */
const getQuoteDiscount = ({ percentage_discount: discount = 0, unit_value: unitValue = 0 }: IGenericRecord): number => {
    if (discount <= 0 || unitValue <= 0) return 0;
    return (unitValue * discount) / 100;
};

/**
 * Extracts document type value from user data with priority fallback
 * Handles multiple possible sources for document type information
 * 
 * @typeParam userData: IUserData - User data object with document information
 * @returns Document type value string
 */
export const getDocumentTypeValue = (userData: IUserData): string => {
    // Priority 1: Direct document types (CC, TI, RC)
    if (userData.document_type && VALID_DOCUMENT_TYPES.includes(userData.document_type)) {
        return userData.document_type;
    }
    
    // Priority 2: Alternative document type field
    if (userData.type_document) {
        return userData.type_document;
    }
    
    // Priority 3: Extract from document type name
    if (userData.document_type_name) {
        const match = userData.document_type_name.match(/\(([^)]+)\)/);
        return match ? match[1] : userData.document_type_name;
    }
    
    return '';
};

/**
 * Handles exchange rate change with validation and formatting
 * Manages foreign exchange rate input with Colombian peso validation
 * 
 * @typeParam value: string - New exchange rate value from input
 * @typeParam formData: IQuoteFormData - Current form data state
 * @typeParam updateFormData: (data: IQuoteFormData) => void - Function to update form state
 */
export const handleExchangeRateChange = (
    value: string, 
    formData: IQuoteFormData, 
    updateFormData: (data: IQuoteFormData) => void
): void => {
    const floatValue = stringToFloat(value);
    const [integers] = String(floatValue).split('.');
    const NINE = 9;
    
    updateFormData({
        ...formData,
        foreign_exchange_rate: integers.length > NINE ? formData?.foreign_exchange_rate : floatValue,
    });
};

/**
 * Generate product table headers based on invoice type and mandate status
 * Provides dynamic headers configuration for quote product tables with tooltips
 * 
 * @typeParam isMandate: boolean - Whether the invoice requires mandate fields
 * @typeParam isPurchaseInvoice: boolean - Whether this is a purchase invoice (affects unit cost vs unit value)
 * @returns Array of header configuration objects with tooltips
 */
export const QUOTE_PRODUCT_TABLE_HEADERS = (isMandate: boolean, isPurchaseInvoice: boolean): IGenericRecord[] => [
    {
        className: 'selector',
    },
    {
        title: 'No.',
        className: 'number',
    },
    {
        title: '*SKU/Código - Producto/Servicio',
        className: 'sku',
        tooltip: {
            title: 'SKU/Código - Producto/Servicio:',
            description: 'es el código único de identificación y el nombre de sus productos/servicios.',
        },
    },
    {
        title: 'Descripción',
        className: 'description',
        tooltip: {
            title: 'Descripción:',
            description: 'información adicional para la venta del producto/servicio.',
        },
    },
    {
        title: '*Bodega',
        className: 'warehouse',
        tooltip: {
            title: 'Bodega:',
            description: 'es el nombre de la(s) bodega(s) en las que está almacenado el producto.',
        },
    },
    {
        title: '*Lote',
        className: 'batch',
        tooltip: {
            title: 'Lote:',
            description: 'es la identificación del lote del producto.',
        },
    },
    {
        title: '*Fecha de vencimiento',
        className: 'due-date',
        tooltip: {
            title: 'Fecha de vencimiento:',
            description: 'es la fecha en la que el producto dejará de ser apto para su consumo.',
        },
    },
    {
        title: '*Cantidad',
        className: 'quantity',
        tooltip: {
            title: 'Cantidad:',
            description: 'es la cantidad de producto/servicio a vender.',
        },
    },
    {
        title: `*Valor ${isPurchaseInvoice ? 'unitario de compra' : 'unitario'}`,
        className: 'unit-cost',
        tooltip: {
            title: `Valor ${isPurchaseInvoice ? 'unitario de compra' : 'unitario'}:`,
            description: `es el precio ${isPurchaseInvoice ? 'de compra ' : ''}de la unidad del producto/servicio.`,
        },
    },
    {
        title: '% Desc.',
        className: 'discount',
        tooltip: {
            title: '% Desc.:',
            description: 'es el porcentaje de descuento aplicado al producto/servicio.',
        },
    },
    {
        title: 'Valor total',
        className: 'total',
        tooltip: {
            title: 'Valor total:',
            description: 'es el precio total del producto/servicio.',
        },
    },
    ...(isMandate
        ? [
              {
                  title: '*Proveedor',
                  className: 'supplier',
                  tooltip: {
                      title: 'Proveedor:',
                      description: 'es el nombre del proveedor del producto/servicio.',
                  },
              },
          ]
        : []),
];

/**
 * Generate required table fields list based on supplier validation requirements
 * Provides field mapping for quote product table validation
 * 
 * @typeParam validateSupplier: boolean - Whether supplier validation is required
 * @returns Array of field configuration objects with name and display value
 */
export const QUOTE_REQUIRED_TABLE_FIELDS = (validateSupplier: boolean): { name: string; value: string }[] => [
    {
        name: 'sku_internal',
        value: 'SKU/Código - Producto/Servicio',
    },
    {
        name: 'warehouse_name',
        value: 'Bodega',
    },
    {
        name: 'batch_number',
        value: 'Lote',
    },
    {
        name: 'date_expiration',
        value: 'Fecha de vencimiento',
    },
    {
        name: 'quantity',
        value: 'Cantidad',
    },
    {
        name: 'unit_cost',
        value: 'Valor unitario',
    },
    ...(validateSupplier ? [{ name: 'mandate_id', value: 'Proveedor' }] : []),
];

/**
 * Assign quote products with processed tax and stock information
 * Processes quote details to include warehouse, batch, taxes, and expiration data
 * 
 * @typeParam quoteDetails: IQuoteProduct[] - Array of quote detail items to process
 * @typeParam products: IGenericRecord[] - Array of available products with stock and tax information
 * @returns Array of processed invoice details with complete product information
 */
export const assignQuoteProducts = (quoteDetails: IQuoteProduct[], products: IGenericRecord[]): IQuoteProduct[] => {
    return quoteDetails.map(item => {
        const { stock, unique_product_taxes } = products.find(itemProduct => itemProduct.id === item.unique_products_id) || {
            stock: 0,
        };
        const isPerishable = Array.isArray(stock);
        const { batch: batches } = isPerishable
            ? stock.find((warehouse: IGenericRecord) => warehouse.warehouses_id === item.warehouse_id) || { batch: [] }
            : { batch: [] };
        const isNotNA = isPerishable && lengthGreaterThanZero(batches);
        return {
            ...item,
            warehouse_name: isPerishable ? item.warehouse_name : NA,
            batch_number: isNotNA ? item.batch_number : NA,
            product_taxes: unique_product_taxes || [],
            taxes:
                unique_product_taxes?.map(({ company_tax_id, tax_value }: IProductTax) => ({ company_tax_id, tax_value })) ||
                [],
            date_expiration: isNotNA ? getDateFromUnix(getUnixFromDate(item.date_expiration || '')).dateFormat : NA,
            percentage_discount: calculatePercentage(item.unit_value, item.discount),
        };
    });
};

/**
 * Calculate quote base amount (quantity × unit_cost - discount)
 * Base amount used for tax calculations
 * 
 * @typeParam item: IGenericRecord - Quote item with quantity, unit_cost, and discount data
 * @returns Base amount for tax calculations
 */
export const calculateQuoteBase = (item: IGenericRecord): number => {
    return stringToFloat(item.quantity) * item.unit_cost - getQuoteDiscount(item);
};

/**
 * Calculate VAT amount based on tax configuration and base amount
 * Finds IVA tax in tax array and calculates VAT amount
 * 
 * @typeParam taxes: IGenericRecord[] - Array of tax configurations
 * @typeParam base: number - Base amount for VAT calculation
 * @returns Calculated VAT amount
 */
export const calculateQuoteVat = (taxes: IGenericRecord[] = [], base: number): number => {
    const vatTax = taxes.find(({ tax_name }) => tax_name?.toLowerCase().includes('iva')) || {};
    const { tax_rate = 0 } = vatTax;
    return (base * tax_rate) / 100;
};

/**
 * Calculate product taxes for quote items
 * Processes quote products to calculate tax amounts based on base values
 * 
 * @typeParam products: IQuoteProduct[] - Array of quote products to process
 * @returns Array of products with calculated tax amounts
 */
export const calculateQuoteProductTaxes = (products: IQuoteProduct[]): IQuoteProduct[] => {
    return products.map(item => {
        if (!lengthGreaterThanZero(item.product_taxes) || !item.quantity || !item.unit_cost) return item;
        const base = calculateQuoteBase(item);
        return {
            ...item,
            total_buy: base,
            taxes: item.product_taxes?.map(({ company_tax_id, tax_value }: IProductTax) => ({
                company_tax_id,
                tax_value: (base * tax_value) / 100,
            })) || [],
        };
    });
};

/**
 * Get validation errors for perishable products in quotes
 * Validates that perishable products have required batch and expiration date
 * 
 * @typeParam productData: IGenericRecord[] - Array of product data to validate
 * @returns Array of validation error messages
 */
export const getQuotePerishableErrors = (productData: IGenericRecord[]): string[] => {
    const errors: string[] = [];
    
    productData.forEach(({ is_product, date_expiration, batch_number }, index) => {
        if (!is_product || date_expiration === NA || batch_number === NA) return;
        if (!date_expiration) {
            errors.push(`El producto de la fila ${index + 1} debe tener fecha de vencimiento.`);
        }
        if (!batch_number) {
            errors.push(`El producto de la fila ${index + 1} debe tener lote.`);
        }
    });
    return errors;
};

/**
 * Check if state data is ready for totals calculation
 * Validates that both details and retentions arrays are available and valid
 * 
 * @typeParam details: IGenericRecord[] | null - Product details array  
 * @typeParam retentions: IGenericRecord[] | null - Withholding retentions array
 * @returns True if both arrays are valid
 */
export const isStateDataReadyForTotals = (details: IGenericRecord[] | null, retentions: IGenericRecord[] | null): boolean => {
    return Boolean(details && Array.isArray(details) && retentions && Array.isArray(retentions));
};

/**
 * Update personal fields based on data authorization toggle
 * Manages client data visibility and form state based on authorization
 * 
 * @typeParam value: boolean - Whether client authorizes data usage
 * @typeParam formData: IGenericRecord - Current form data state
 * @typeParam updateFormData: (data: IGenericRecord) => void - Function to update form state
 * @typeParam dispatch: (action: IGenericRecord) => void - Redux dispatch function
 * @typeParam setClientSelected: (data: IGenericRecord) => IGenericRecord - Function to set selected client
 * @typeParam authorizedData: IGenericRecord - Data to use when authorization is granted
 * @typeParam unauthorizedData: IGenericRecord - Data to use when authorization is denied
 */
export const updatePersonalFields = (
    value: boolean,
    formData: IGenericRecord,
    updateFormData: (data: IGenericRecord) => void,
    dispatch: (action: IGenericRecord) => void,
    setClientSelected: (data: IGenericRecord) => IGenericRecord,
    authorizedData?: IGenericRecord,
    unauthorizedData?: IGenericRecord
): void => {
    // Default fallback values if constants not provided
    const defaultAuthorizedData = {
        client_id: '',
        name: '',
        document_type: '',
        document_number: '',
        email: '',
        phone: '',
        address: '',
        person_id: null,
    };
    
    const defaultUnauthorizedData = {
        client_id: '',
        name: 'No aplica',
        document_type: 'CC',
        document_number: '00000000',
        email: 'noemail@noemail.com',
        phone: '0000000000',
        address: 'No aplica',
        person_id: null,
    };
    
    if (value) {
        updateFormData({ 
            ...formData, 
            ...(authorizedData || defaultAuthorizedData), 
            not_information_customer: value 
        });
        dispatch(setClientSelected({}));
        return;
    }
    updateFormData({ 
        ...formData, 
        ...(unauthorizedData || defaultUnauthorizedData), 
        not_information_customer: value 
    });
};

/**
 * Handle option changes in form select dropdowns
 * Manages cascading field updates when payment types or other options change
 * 
 * @typeParam option: IGenericRecord - Selected option object containing value and id
 * @typeParam name: string - Field name being updated
 * @typeParam formData: IGenericRecord - Current form data state
 * @typeParam updateFormData: (data: IGenericRecord) => void - Function to update form state
 */
export const handleOptionChange = (
    { value, id }: IGenericRecord,
    name: string,
    formData: IGenericRecord,
    updateFormData: (data: IGenericRecord) => void
): void => {
    const keyId = QUOTE_ID_KEY[name];
    
    updateFormData({
        ...formData,
        [name]: value,
        ...(keyId && { [keyId]: id }),
        ...(name === 'payment_type_name' && { collection_days: null, days_collection_type: 'Días calendario' }),
    });
};
