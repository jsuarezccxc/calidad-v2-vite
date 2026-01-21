import { IGenericRecord } from '@models/GenericRecord';
import { QUOTE_UNAUTHORIZED_DATA } from './components';

/**
 * UI Text constants for GenerateQuote component
 * Centralizes all user-facing strings for consistency and maintainability
 */
export const GENERATE_QUOTE_TEXTS = {
    BREADCRUMB: {
        TITLE_HOW_TO: 'Cómo generar y transmitir Factura electrónica de venta y Documento soporte',
        QUOTES: 'Cotizaciones',
        ADD_CLIENT: 'Agregar cliente',
        GENERATE_QUOTE: 'Generar cotización',
        ROUTE_ELECTRONIC_DOCS: '/documentos-electronicos',
        ROUTE_ELECTRONIC_INVOICE: '/documentos-electronicos/factura-electronica',
        ROUTE_QUOTES: '/documentos-electronicos/factura-electronica/cotizaciones',
        ROUTE_CURRENT: '#',
    },
    VALIDATION: {
        ERRORS_TITLE: 'Errores de validación:',
        WARNINGS_TITLE: 'Advertencias:',
    },
    PAGE: {
        SUBTITLE: 'Cómo generar y transmitir Factura electrónica de venta y Documento soporte',
    },
    KEY_PREFIXES: {
        ERROR: 'error',
        WARNING: 'warning',
    },
    KEY_SLICE_LENGTH: 20,
    UI_CONSTANTS: {
        EMPTY_VALIDATION: 0,
        BACKGROUND_COLOR: 'bg-famiefi-light-blue',
    },
} as const;

export { default as GenerateQuote } from './GenerateQuote';
export { QuoteBillingInformation } from './components/QuoteBillingInformation';
export { PageButtonsFooter } from '@components/page-buttons-footer';

/**
 * Document configuration that IDocumentConfig interface receives
 * 
 * @typeParam language: string - Document language setting
 * @typeParam type: string - Invoice/quote type configuration
 * @typeParam authorizePersonalData: boolean - Personal data processing authorization
 */
export interface IDocumentConfig {
  language: string;
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
    method: '',
    means: '',
    currency: DEFAULT_FORM_VALUES.CURRENCY,
    foreignExchangeId: '',
    foreignExchangeName: '',
    foreignExchangeRate: null,
  },
  observations: '',
  internalComments: '',
  document_language: DEFAULT_FORM_VALUES.LANGUAGE,
  not_information_customer: false,
};

// Re-export from hooks directory
export { useQuoteForm } from '../../hooks/useQuoteForm';
