import { IGenericRecord } from '@models/GenericRecord';
import { IQuoteFormData, IQuoteProduct, IQuoteTotalsData, ITaxBreakdownItem } from '@models/QuoteGeneration';
import { IInvoiceCalculates, ITableTaxesAndRetention } from '@models/ElectronicInvoice';
import { IDataTableTotals } from '@components/table-totals';

import { DATA_TAXES } from '@constants/ElectronicInvoice';

import { QUOTE_UNAUTHORIZED_DATA } from './components';

export { QUOTE_REQUIRED_FORM_FIELDS } from './components';

export const GENERATE_QUOTE_TEXTS = {
    BREADCRUMB: {
        TITLE_HOW_TO: 'Cómo generar y transmitir Factura electrónica de venta y Documento soporte',
        QUOTES: 'Cotizaciones',
        ADD_CLIENT: 'Agregar cliente',
        GENERATE_QUOTE: 'Generar cotización',
        ROUTE_ELECTRONIC_DOCS: '/dashboard-electronic-documents',
        ROUTE_ELECTRONIC_INVOICE: '/dashboard-electronic-documents',
        ROUTE_QUOTES: '/quotes-report',
        ROUTE_CURRENT: '#',
    },
    PAGE: {
        SUBTITLE: 'Cómo generar y transmitir Factura electrónica de venta y Documento soporte',
    },
    UI_CONSTANTS: {
        BACKGROUND_COLOR: 'bg-famiefi-light-blue',
    },
} as const;

export { default as GenerateQuote } from './GenerateQuote';
export { QuoteBillingInformation } from './components/QuoteBillingInformation';
export { PageButtonsFooter } from '@components/page-buttons-footer';

/**
 * Type alias for total table rows in quote financial summary
 * Uses the same structure as DATA_TABLE_TOTALS for consistency
 *
 * @typeParam id: string - Unique identifier for the total row
 * @typeParam title: string - Display label for the total row
 * @typeParam field: string - Field name corresponding to backend data
 * @typeParam symbol?: string - Optional symbol prefix (e.g., '-' for discounts)
 * @typeParam value: number - Calculated total value
 * @typeParam disabled: boolean - Whether the field is read-only
 * @typeParam className: string - CSS classes for styling
 * @typeParam omitElement?: boolean - Optional flag to hide the row
 */
export type ITotalTableRow = IDataTableTotals;

/**
 * Event interface for sending charge input changes in quote financial summary
 * Extends NumberFormatValues to include the float value from react-number-format
 *
 * @typeParam value: number - Current charge value
 */
export interface ISendingChargeChangeEvent {
    value: number;
}

/**
 * Props interface for QuoteFinancialSummary component
 * Manages the display of quote totals, withholdings, and shipping costs
 *
 * @interface IQuoteFinancialSummaryProps
 * @typeParam withholdingData: ITableTaxesAndRetention[] - Array of withholding tax configurations
 * @typeParam updateWithholdingData: (data: ITableTaxesAndRetention[]) => void - Callback to update withholding data
 * @typeParam totals: IInvoiceCalculates - Calculated invoice totals from Redux state
 * @typeParam sendingCharge: number - Current shipping/sending charge amount
 * @typeParam updateSendingCharge: (e: ISendingChargeChangeEvent) => void - Callback for shipping charge changes
 * @typeParam disableShippingCost: boolean - Flag to disable shipping cost input
 * @typeParam toggleTotalsQuery: () => void - Callback to trigger totals recalculation
 * @typeParam isOnlyWithholdingTable?: boolean - Optional flag to show only withholding table
 * @typeParam isOnlySubTotals?: boolean - Optional flag to show only subtotals section
 */
export interface IQuoteFinancialSummaryProps {
    withholdingData: ITableTaxesAndRetention[];
    updateWithholdingData: (data: ITableTaxesAndRetention[]) => void;
    totals: IInvoiceCalculates;
    sendingCharge: number;
    updateSendingCharge: (e: ISendingChargeChangeEvent) => void;
    disableShippingCost: boolean;
    toggleTotalsQuery: () => void;
    isOnlyWithholdingTable?: boolean;
    isOnlySubTotals?: boolean;
}

/**
 * Quote invoice state interface for Redux persistence
 * Used when saving quote state to Redux for navigation between forms
 *
 * @interface IQuoteInvoiceState
 * @typeParam formData: IQuoteFormData - Current quote form data including customer and payment info
 * @typeParam productData: IQuoteProduct[] - Array of products included in the quote
 * @typeParam withholdingTable: ITableTaxesAndRetention[] - Withholding tax calculations
 * @typeParam sendingCharge: number - Shipping/sending charge amount
 */
export interface IQuoteInvoiceState {
    formData: IQuoteFormData;
    productData: IQuoteProduct[];
    withholdingTable: ITableTaxesAndRetention[];
    sendingCharge: number;
}

/**
 * Document configuration that IDocumentConfig interface receives
 * 
 * @typeParam language: string - Document language setting
 * @typeParam type: string - Invoice/quote type configuration
 * @typeParam authorizePersonalData: boolean - Personal data processing authorization
 */
/**
 * Document configuration that IDocumentConfig interface receives
 * 
 * @typeParam language: string - Document language setting (Spanish or English)
 * @typeParam document_language: string - Document language code (es|en) for quote generation
 * @typeParam type: string - Invoice/quote type configuration
 * @typeParam authorizePersonalData: boolean - Personal data processing authorization
 */
export interface IDocumentConfig {
  language: string;
  document_language?: string;
  type: string;
  authorizePersonalData: boolean;
}

/**
 * Client information that IClientInfo interface receives
 * 
 * @typeParam name: string - Client full name for identification and documentation
 * @typeParam id: string | null - Optional unique client identifier in system
 * @typeParam documentType: string - Type of identification document (CC, NIT, etc.)
 * @typeParam documentNumber: string - Document identification number for Colombian compliance
 * @typeParam taxpayerType: string - Taxpayer classification per Colombian tax system
 * @typeParam email: string - Optional client email for communication
 * @typeParam phone: string - Optional client phone number
 * @typeParam address: string - Optional client physical address
 * @typeParam city: string - Optional client city location
 * @typeParam country: string - Optional client country location
 * @typeParam postalCode: string - Optional postal code for delivery
 * @typeParam fiscalResponsibilities: string[] - Optional Colombian fiscal responsibilities
 * @typeParam personType: string - Optional person type classification
 * @typeParam contribuyenteTipo: string - Optional Colombian taxpayer category
 * @typeParam taxRegime: string - Optional tax regime classification
 */
export interface IClientInfo {
  name: string;
  id?: string | null;
  documentType: string;
  documentNumber: string;
  taxpayerType: string;
  email?: string;
  phone?: string;
  address?: string;
  city?: string;
  country?: string;
  postalCode?: string;
  fiscalResponsibilities?: string[];
  personType?: string;
  contribuyenteTipo?: string;
  taxRegime?: string;
}

/**
 * Payment configuration that IPaymentConfig interface receives
 * 
 * @typeParam paymentType: string - Payment classification for Colombian business standards
 * @typeParam paymentMethod: string - Method of payment (cash, credit, etc.)
 * @typeParam currency: string - Currency code (COP for Colombian peso)
 * @typeParam exchangeRate: number - Optional exchange rate for foreign currency
 * @typeParam paymentTerms: string - Optional payment terms and conditions
 * @typeParam paymentDueDate: string - Optional payment due date
 * @typeParam discountForEarlyPayment: number - Optional early payment discount percentage
 * @typeParam latePaymentPenalty: number - Optional late payment penalty rate
 */
export interface IPaymentConfig {
  paymentType: string;
  paymentMethod: string;
  currency: string;
  exchangeRate?: number;
  paymentTerms?: string;
  paymentDueDate?: string;
  discountForEarlyPayment?: number;
  latePaymentPenalty?: number;
}

/**
 * Sales manager information that ISalesManagerInfo interface receives
 * 
 * @typeParam name: string - Sales manager full name for identification
 * @typeParam email: string - Contact email for communication
 * @typeParam phone: string - Contact phone number
 * @typeParam department: string - Optional department or division
 * @typeParam commission: number - Optional commission rate percentage
 * @typeParam employeeId: string - Optional unique employee identifier
 * @typeParam territory: string - Optional sales territory assignment
 * @typeParam managerId: string - Optional reporting manager identifier
 */
export interface ISalesManagerInfo {
  name: string;
  email: string;
  phone: string;
  department?: string;
  commission?: number;
  employeeId?: string;
  territory?: string;
  managerId?: string;
}

/**
 * Form data that IFormData interface receives
 * Complete form state for quote generation and management
 * 
 * @typeParam documentConfig: IDocumentConfig - Document configuration settings
 * @typeParam clientInfo: IClientInfo - Client information and details
 * @typeParam paymentConfig: IPaymentConfig - Payment configuration settings
 * @typeParam salesManagerInfo: ISalesManagerInfo - Optional sales manager assignment
 * @typeParam products: Array<IGenericRecord> - Optional products list for quote
 * @typeParam notes: string - Optional public notes visible to client
 * @typeParam terms: string - Optional terms and conditions
 * @typeParam validUntilDate: string - Optional quote validity expiration date
 * @typeParam deliveryDate: string - Optional expected delivery date
 * @typeParam deliveryAddress: string - Optional delivery address
 * @typeParam specialInstructions: string - Optional special delivery instructions
 * @typeParam discountPercentage: number - Optional global discount percentage
 * @typeParam discountAmount: number - Optional global discount amount
 * @typeParam subtotal: number - Optional calculated subtotal before taxes
 * @typeParam totalTax: number - Optional calculated total tax amount
 * @typeParam total: number - Optional final total amount
 * @typeParam quoteName: string - Optional quote name or title
 * @typeParam quoteNumber: string - Optional quote number identifier
 * @typeParam createdDate: string - Optional creation date
 * @typeParam lastModifiedDate: string - Optional last modification date
 * @typeParam createdBy: string - Optional creator user identifier
 * @typeParam approvedBy: string - Optional approver user identifier
 * @typeParam status: string - Optional quote status
 * @typeParam version: number - Optional quote version number
 * @typeParam relatedDocuments: Array<string> - Optional related document references
 * @typeParam attachments: Array<string> - Optional file attachments
 * @typeParam internalNotes: string - Optional internal notes for staff
 * @typeParam customerPO: string - Optional customer purchase order number
 * @typeParam projectId: string - Optional project identifier
 * @typeParam costCenter: string - Optional cost center assignment
 * @typeParam businessUnit: string - Optional business unit assignment
 * @typeParam priorityLevel: string - Optional priority level classification
 * @typeParam estimatedClosingDate: string - Optional estimated closing date
 * @typeParam probabilityOfClosure: number - Optional closure probability percentage
 * @typeParam competitorAnalysis: string - Optional competitor analysis notes
 * @typeParam marketingSource: string - Optional marketing source tracking
 * @typeParam campaignCode: string - Optional marketing campaign code
 * @typeParam referralSource: string - Optional referral source information
 * @typeParam clientRelationshipManager: string - Optional CRM manager assignment
 * @typeParam technicalRequirements: string - Optional technical requirements
 * @typeParam legalRequirements: string - Optional legal requirements
 * @typeParam complianceNotes: string - Optional compliance notes
 * @typeParam riskAssessment: string - Optional risk assessment information
 * @typeParam approvalWorkflow: Array<string> - Optional approval workflow steps
 * @typeParam auditTrail: Array<IGenericRecord> - Optional audit trail records
 * @typeParam integrationData: IGenericRecord - Optional integration system data
 * @typeParam customFields: IGenericRecord - Optional custom field values
 * @typeParam logo: IGenericRecord - Optional company logo file for quote header
 * @typeParam urlLogo: string - Optional URL for stored logo file
 * @typeParam document_language: string - Optional document language override (es|en)
 * @typeParam not_information_customer: boolean - Optional flag for incomplete customer information
 */
export interface IFormData {
  documentConfig: IDocumentConfig;
  clientInfo: IClientInfo;
  paymentConfig: IPaymentConfig;
  salesManagerInfo?: ISalesManagerInfo;
  products?: Array<IGenericRecord>;
  notes?: string;
  terms?: string;
  validUntilDate?: string;
  deliveryDate?: string;
  deliveryAddress?: string;
  sending_charge?: number;
  specialInstructions?: string;
  discountPercentage?: number;
  discountAmount?: number;
  subtotal?: number;
  totalTax?: number;
  total?: number;
  quoteName?: string;
  quoteNumber?: string;
  createdDate?: string;
  lastModifiedDate?: string;
  createdBy?: string;
  approvedBy?: string;
  status?: string;
  version?: number;
  relatedDocuments?: Array<string>;
  attachments?: Array<string>;
  internalNotes?: string;
  customerPO?: string;
  projectId?: string;
  costCenter?: string;
  businessUnit?: string;
  priorityLevel?: string;
  estimatedClosingDate?: string;
  probabilityOfClosure?: number;
  competitorAnalysis?: string;
  marketingSource?: string;
  campaignCode?: string;
  referralSource?: string;
  clientRelationshipManager?: string;
  technicalRequirements?: string;
  legalRequirements?: string;
  complianceNotes?: string;
  riskAssessment?: string;
  approvalWorkflow?: Array<string>;
  auditTrail?: Array<IGenericRecord>;
  integrationData?: IGenericRecord;
  customFields?: IGenericRecord;
  logo?: IGenericRecord;
  urlLogo?: string;
  document_language?: string;
  not_information_customer?: boolean;
}

/**
 * Quote data that IQuoteData interface receives
 * Extended form data with persistence and workflow management
 * 
 * @typeParam id: string - Unique quote identifier for database reference
 * @typeParam createdAt: string - Quote creation timestamp
 * @typeParam updatedAt: string - Last modification timestamp
 * @typeParam isActive: boolean - Optional active status flag
 * @typeParam workflowState: string - Optional current workflow state
 * @typeParam approvalStatus: string - Optional approval status
 * @typeParam lockedBy: string - Optional user who locked the quote
 * @typeParam lockedAt: string - Optional lock timestamp
 * @typeParam archivedAt: string - Optional archive timestamp
 * @typeParam deletedAt: string - Optional soft deletion timestamp
 * @typeParam restoredAt: string - Optional restoration timestamp
 * @typeParam duplicatedFrom: string - Optional source quote for duplication
 * @typeParam convertedToInvoice: boolean - Optional invoice conversion flag
 * @typeParam invoiceId: string - Optional linked invoice identifier
 * @typeParam conversionDate: string - Optional invoice conversion date
 * @typeParam parentQuoteId: string - Optional parent quote reference
 * @typeParam childQuoteIds: Array<string> - Optional child quote references
 * @typeParam linkedOpportunityId: string - Optional CRM opportunity link
 * @typeParam linkedProjectId: string - Optional project management link
 * @typeParam syncStatus: string - Optional external system sync status
 * @typeParam lastSyncDate: string - Optional last synchronization date
 * @typeParam externalSystemId: string - Optional external system identifier
 * @typeParam migrationMetadata: IGenericRecord - Optional migration data
 * @typeParam dataIntegrity: object - Optional data integrity validation
 * @typeParam dataIntegrity.checksum: string - Optional data checksum
 * @typeParam dataIntegrity.validatedAt: string - Optional validation timestamp
 * @typeParam dataIntegrity.validatedBy: string - Optional validator identifier
 * @typeParam dataIntegrity.issues: Array<string> - Optional integrity issues
 */
export interface IQuoteData extends IFormData {
  id: string;
  createdAt: string;
  updatedAt: string;
  isActive?: boolean;
  workflowState?: string;
  approvalStatus?: string;
  lockedBy?: string;
  lockedAt?: string;
  archivedAt?: string;
  deletedAt?: string;
  restoredAt?: string;
  duplicatedFrom?: string;
  convertedToInvoice?: boolean;
  invoiceId?: string;
  conversionDate?: string;
  parentQuoteId?: string;
  childQuoteIds?: Array<string>;
  linkedOpportunityId?: string;
  linkedProjectId?: string;
  syncStatus?: string;
  lastSyncDate?: string;
  externalSystemId?: string;
  migrationMetadata?: IGenericRecord;
  dataIntegrity?: {
    checksum?: string;
    validatedAt?: string;
    validatedBy?: string;
    issues?: Array<string>;
  };
}

/**
 * Form validation result that IFormValidationResult interface receives
 * Comprehensive validation result with multiple error types and recommendations
 * 
 * @typeParam isValid: boolean - Overall form validation status
 * @typeParam errors: string[] - Array of validation error messages
 * @typeParam warnings: string[] - Array of validation warnings
 * @typeParam fieldErrors: Record<string, string> - Field-specific error messages
 * @typeParam missingRequiredFields: string[] - Optional array of missing required fields
 * @typeParam invalidFields: string[] - Optional array of invalid field names
 * @typeParam businessRuleViolations: string[] - Optional business rule violations
 * @typeParam recommendations: string[] - Optional improvement recommendations
 */
export interface IFormValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
  fieldErrors: Record<string, string>;
  missingRequiredFields?: string[];
  invalidFields?: string[];
  businessRuleViolations?: string[];
  recommendations?: string[];
}

/**
 * Quote generation form constants
 */
export const DEFAULT_FORM_VALUES = {
    LANGUAGE: 'Español',
    INVOICE_TYPE: 'Estándar',
    CURRENCY: 'Peso colombiano',
    AUTHORIZE_PERSONAL_DATA: false,
} as const;

export const QUOTE_CONFIG = {
    NUMBER_PREFIX: 'COT-',
    TIMESTAMP_DIGITS: 6,
    DEFAULT_STATUS: 'draft',
    STORAGE_KEY: 'quotes',
} as const;

export const VALIDATION_MESSAGES = {
    CLIENT_REQUIRED: 'Por favor seleccione un cliente o configure la información del consumidor final',
    QUOTE_SAVE_SUCCESS: 'Cotización guardada exitosamente',
    QUOTE_SAVE_ERROR: 'Error al guardar la cotización',
    DATA_VALIDATION_ERROR: 'Los datos del formulario no son válidos',
} as const;

export const REQUIRED_FIELDS = {
    CLIENT_SELECTION: ['client_id', 'not_information_customer'],
    MINIMUM_DATA: ['documentConfig', 'clientInfo', 'paymentConfig'],
} as const;

export const NAVIGATION_ROUTES = {
    QUOTE_VIEW: '/quotes-report?view=quote-view&quoteNumber=',
    QUOTES_REPORT: '/quotes-report',
} as const;

export const INITIAL_FORM_DATA: IFormData = {
  ...DEFAULT_FORM_VALUES,
  ...QUOTE_UNAUTHORIZED_DATA,
  documentConfig: {
    language: DEFAULT_FORM_VALUES.LANGUAGE,
    type: DEFAULT_FORM_VALUES.INVOICE_TYPE,
    authorizePersonalData: DEFAULT_FORM_VALUES.AUTHORIZE_PERSONAL_DATA,
  },
  clientInfo: {
    name: QUOTE_UNAUTHORIZED_DATA.name,
    documentType: QUOTE_UNAUTHORIZED_DATA.document_type,
    documentNumber: QUOTE_UNAUTHORIZED_DATA.document_number,
    taxpayerType: QUOTE_UNAUTHORIZED_DATA.person_type,
  },
  paymentConfig: {
    paymentType: '',
    paymentMethod: '',
    currency: DEFAULT_FORM_VALUES.CURRENCY,
    exchangeRate: undefined,
  },
  observations: '',
  internalComments: '',
  document_language: DEFAULT_FORM_VALUES.LANGUAGE,
  not_information_customer: false,
};

/**
 * Tax name parsing configuration
 * Colombian DIAN tax names follow pattern "XX IVA" where XX is the tax code
 */
const TAX_NAME_PARTS = {
    SEPARATOR: ' ',
    CODE_INDEX: 0,
} as const;

/**
 * Formats taxes array for quote payload using backend-calculated values
 * Follows the same pattern as generate-sales-invoice
 *
 * @typeParam totals: IQuoteTotalsData | IInvoiceCalculates - Invoice calculations from backend (invoiceValues)
 * @returns ITaxBreakdownItem[] - Formatted taxes array ready for API payload
 */
export const formatTaxes = (totals: IQuoteTotalsData | IInvoiceCalculates): ITaxBreakdownItem[] =>
    DATA_TAXES.map(tax => {
        const totalTaxesIva = totals?.total_taxes_iva as Record<string, number> | undefined;
        const taxCode = tax.name.split(TAX_NAME_PARTS.SEPARATOR)[TAX_NAME_PARTS.CODE_INDEX];
        const taxAmount = totalTaxesIva?.[taxCode] || 0;
        return {
            tax_id: taxCode,
            tax_name: tax.name,
            tax_rate: tax.percentage,
            tax_amount: taxAmount,
            tax_base: taxAmount > 0 ? totals.subtotal : 0,
        };
    });

export { useQuoteForm } from '../../hooks/useQuoteForm';
