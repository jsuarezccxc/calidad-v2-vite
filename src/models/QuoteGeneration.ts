import { IGenericRecord } from '@models/GenericRecord';
import { IPaginatorBackend } from '@components/paginator-backend';
import { IOptionSelect } from '@components/input';
import { IInvoiceDetails, ITableTaxesAndRetention } from '@models/ElectronicInvoice';

/**
 * Tooltip configuration interface for form field guidance
 *
 * @interface ITooltipData
 * @typeParam title: string - Tooltip title text
 * @typeParam description: string - Tooltip description content
 * @typeParam placement: string - Optional tooltip placement position (top/bottom/left/right)
 */
export interface ITooltipData {
    title: string;
    description: string;
    placement?: string;
}

/**
 * Quote billing information component properties
 * Main interface for the billing information form component
 *
 * @interface IQuoteBillingInformationProps
 * @typeParam formData: IQuoteFormData - Form data containing all quote information with specific field types
 * @typeParam openForm: () => void - Function to open modal forms and dialogs
 * @typeParam updateFormData: (data: IQuoteFormData | ((prev: IQuoteFormData) => IQuoteFormData)) => void - Function to update form state with typed quote data or callback with previous state
 * @typeParam isContingency: boolean - Flag indicating if this is a contingency quote
 * @typeParam validate: boolean - Flag to enable/disable field validation display
 * @typeParam onProductsChange: (products: IInvoiceDetails[]) => void - Callback when products array changes with complete product and tax information
 * @typeParam onWithholdingsChange: (withholdings: ITableTaxesAndRetention[]) => void - Optional callback when withholdings table changes
 */
export interface IQuoteBillingInformationProps {
    formData: IQuoteFormData;
    openForm: (formType?: string) => void;
    updateFormData: (data: IQuoteFormData | ((prev: IQuoteFormData) => IQuoteFormData)) => void;
    isContingency: boolean;
    validate: boolean;
    onProductsChange: (products: IInvoiceDetails[]) => void;
    onWithholdingsChange?: (withholdings: ITableTaxesAndRetention[]) => void;
}

/**
 * Quote products table component properties
 * Nested configuration structure for table data, handlers, and display options
 * Used by QuoteProductsTable component for managing quote product data with validation
 *
 * @interface IQuoteTableDataProps
 * @typeParam tableConfig: object - Table data and validation configuration object
 * @typeParam tableConfig.data: IInvoiceDetails[] - Array of invoice detail records with complete product information
 * @typeParam tableConfig.validate: boolean - Flag to enable/disable validation display
 * @typeParam tableConfig.errorMessages: string[] - Array of validation error messages
 * @typeParam tableConfig.perishableErrors: string[] - Array of perishable product specific errors
 * @typeParam tableHandlers: object - Event handlers for table operations and data updates
 * @typeParam tableHandlers.updateData: (products: IInvoiceDetails[]) => void - Handler to update product data array
 * @typeParam tableHandlers.toggleTotalsQuery: () => void - Handler to trigger totals recalculation
 * @typeParam tableHandlers.onDeleteRow: () => void - Optional handler for row deletion confirmation
 * @typeParam tableOptions: object - Optional display and behavior configuration settings
 * @typeParam tableOptions.isMandate: boolean - Optional flag indicating mandate operation type
 */
export interface IQuoteTableDataProps {
    tableConfig: {
        data: IInvoiceDetails[];
        validate: boolean;
        errorMessages: string[];
        perishableErrors: string[];
    };
    tableHandlers: {
        updateData: (products: IInvoiceDetails[]) => void;
        toggleTotalsQuery: () => void;
        onDeleteRow?: () => void;
    };
    tableOptions?: {
        isMandate?: boolean;
    };
}

/**
 * Conditional field input component properties that IConditionalFieldInputProps interface receives
 * Supports dynamic rendering of either SelectInput or TextInput based on condition parameter
 * 
 * @interface IConditionalFieldInputProps
 * @typeParam condition: boolean - Determines whether to render SelectInput (true) or TextInput (false)
 * @typeParam id: string - Unique identifier for the input element used in DOM and accessibility
 * @typeParam labelText: string - Label text displayed above the input field for user guidance
 * @typeParam classesWrapper: string - Optional CSS classes for wrapper element styling and layout
 * @typeParam tooltipData: ITooltipData - Optional tooltip configuration object with title and description
 * @typeParam disabled: boolean - Optional flag to disable input interaction and show disabled state
 * @typeParam required: boolean - Optional flag to mark field as required with visual indicators
 * @typeParam selectProps: object - Optional properties specific to SelectInput component rendering
 * @typeParam selectProps.value: string - Optional current selected value displayed in select dropdown
 * @typeParam selectProps.options: IOptionSelect[] - Optional array of selectable options compatible with SelectInput
 * @typeParam selectProps.optionSelected: (option: IOptionSelect, name?: string) => void - Optional callback when option is selected
 * @typeParam selectProps.name: string - Optional form field name attribute for SelectInput form handling
 * @typeParam textProps: object - Optional properties specific to TextInput component rendering
 * @typeParam textProps.value: string - Optional current input value displayed in text field
 * @typeParam textProps.name: string - Optional form field name attribute for TextInput form handling
 * @typeParam textProps.onChange: (e: React.ChangeEvent<HTMLInputElement>) => void - Optional change handler for TextInput events
 */
export interface IConditionalFieldInputProps {
    condition: boolean;
    id: string;
    labelText: string;
    classesWrapper?: string;
    tooltipData?: ITooltipData;
    disabled?: boolean;
    required?: boolean;
    selectProps?: {
        value?: string;
        options?: IOptionSelect[];
        optionSelected?: (option: IOptionSelect, name?: string) => void;
        name?: string;
    };
    textProps?: {
        value?: string;
        name?: string;
        onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
    };
}

/**
 * Quote field length validation constants
 * Defines maximum character limits for different quote form fields
 */
export enum QuoteFieldLength {
    NOTES_FIELD = 1000,
    TERMS_CONDITIONS_FIELD = 1000,
    ATTACHMENTS_FIELD = 500,
    REFERENCES_FIELD = 300,
    CUSTOMER_SIGNATURE_FIELD = 50,
    CUSTOMER_NAME_FIELD = 100,
    EMPLOYEE_SIGNATURE_FIELD = 50,
    EMPLOYEE_NAME_FIELD = 100,
    PAYMENT_TERMS_FIELD = 200,
}

/**
 * DIAN response status codes for quote processing
 * Represents different states returned by the Colombian tax authority (DIAN)
 */
export enum QuoteDianResponse {
    Rejected = 'REJECTED_DIAN',
    Accepted = 'ACCEPTED',
    InProgress = 'IN_PROGRESS',
    Error = 'ERROR',
    Pending = 'PENDING',
    Cancelled = 'CANCELLED',
    Validated = 'VALIDATED',
    Processing = 'PROCESSING',
    Sent = 'SENT',
    Delivered = 'DELIVERED',
    Received = 'RECEIVED',
}

/**
 * Quote form data structure with specific field types
 * Extends generic record with quote-specific fields
 *
 * @interface IQuoteFormData
 * @typeParam client_id: string - Unique client identifier
 * @typeParam authorize_personal_data: string - Personal data authorization status
 * @typeParam selected_option_id: string - Selected option identifier
 * @typeParam payment_type_name: string - Payment method name
 * @typeParam collection_days: number | null - Payment collection days
 * @typeParam days_collection_type: string - Type of collection days (calendar/business)
 */
export interface IQuoteFormData extends IGenericRecord {
    client_id: string;
    authorize_personal_data: string;
    selected_option_id: string;
    payment_type_name?: string;
    collection_days?: number | null;
    days_collection_type?: string;
}

/**
 * Processed draft quote form data structure with complete billing and customer information
 * Replaces IGenericRecord for type-safe form data processing aligned with backend structure
 *
 * @interface IQuoteDraftFormData
 * @typeParam prefix_id: string - Quote prefix identifier for numbering system
 * @typeParam prefix_name: string - Quote prefix name for display
 * @typeParam client_id: string - Unique client database identifier
 * @typeParam customer_id: string - Customer entity identifier
 * @typeParam name: string - Customer legal or full name
 * @typeParam document_number: string - Customer tax identification document number
 * @typeParam document_type: string - Type of identification document (NIT, CC, etc.)
 * @typeParam type_taxpayer_id: string - Taxpayer type identifier
 * @typeParam type_taxpayer_code: string - Taxpayer classification code
 * @typeParam type_taxpayer_name: string - Taxpayer type descriptive name
 * @typeParam person_type: string - Person type classification (natural/juridica)
 * @typeParam tax_details_code: string - Tax detail classification code
 * @typeParam tax_details_name: string - Tax detail descriptive name
 * @typeParam collection_days: number - Payment collection days
 * @typeParam days_collection_type: string - Collection days type (calendar/business)
 * @typeParam operation_type_id: string - Operation type identifier
 * @typeParam operation_type: string - Operation type name for display
 * @typeParam payment_method_id: string - Payment method identifier
 * @typeParam payment_method_name: string - Payment method descriptive name
 * @typeParam payment_type_id: string - Payment type identifier
 * @typeParam payment_type_name: string - Payment type descriptive name (cash/credit)
 * @typeParam foreign_exchange_id: string - Foreign exchange currency identifier
 * @typeParam foreign_exchange_name: string - Currency name (COP, USD, EUR)
 * @typeParam foreign_exchange_rate: number - Exchange rate for currency conversion
 * @typeParam number_purchase_order: string - Customer purchase order reference number
 * @typeParam sales_manager: string - Sales manager name assigned to quote
 * @typeParam document_number_sales_manager: string - Sales manager identification number
 * @typeParam document_type_purchasing_manager_id: string - Manager document type identifier
 * @typeParam document_type_purchasing_manager: string - Manager document type name
 * @typeParam note: string - Internal notes for quote reference
 * @typeParam internal_notes: string - Additional internal notes field
 * @typeParam not_information_customer: boolean - Flag indicating if customer has full information
 */
export interface IQuoteDraftFormData {
    prefix_id: string;
    prefix_name: string;
    client_id: string;
    customer_id: string;
    name: string;
    document_number: string;
    document_type?: string;
    type_taxpayer_id: string;
    type_taxpayer_code: string;
    type_taxpayer_name: string;
    person_type: string;
    tax_details_code?: string;
    tax_details_name?: string;
    collection_days: number;
    days_collection_type: string;
    operation_type_id: string;
    operation_type?: string;
    payment_method_id: string;
    payment_method_name: string;
    payment_type_id: string;
    payment_type_name: string;
    foreign_exchange_id: string;
    foreign_exchange_name: string;
    foreign_exchange_rate: number;
    number_purchase_order?: string;
    sales_manager?: string;
    document_number_sales_manager?: string;
    document_type_purchasing_manager_id?: string;
    document_type_purchasing_manager?: string;
    note?: string;
    internal_notes?: string;
    not_information_customer: boolean;
}

/**
 * Quote option interface for select dropdowns and radio buttons
 * 
 * @interface IQuoteOption
 * @typeParam id: string - Unique option identifier
 * @typeParam name: string - Option internal name/value
 * @typeParam value: string - Display value for the option
 * @typeParam title: string - Optional title for tooltips
 * @typeParam description: string - Optional description text
 */
export interface IQuoteOption {
    id: string;
    name: string;
    value: string;
    title?: string;
    description?: string;
}

/**
 * Quote product structure with tax and pricing information
 * 
 * @interface IQuoteProduct
 * @typeParam id: string - Product unique identifier
 * @typeParam unique_products_id: string - External product reference
 * @typeParam product_taxes: IProductTax[] - Array of applicable taxes
 * @typeParam quantity: number - Product quantity
 * @typeParam unit_cost: number - Unit cost price
 * @typeParam percentage_discount: number - Discount percentage applied
 * @typeParam unit_value: number - Unit value after calculations
 * @typeParam is_product: boolean - Flag indicating if item is a product
 * @typeParam date_expiration: string | null - Product expiration date
 * @typeParam batch_number: string - Product batch identifier
 */
export interface IQuoteProduct {
    id: string;
    unique_products_id: string;
    product_taxes?: IProductTax[];
    quantity: number;
    unit_cost: number;
    percentage_discount?: number;
    unit_value?: number;
    is_product?: boolean;
    date_expiration?: string | null;
    batch_number?: string;
    checked?: boolean;
    sku_internal?: string;
}

/**
 * Product tax configuration interface
 * 
 * @interface IProductTax
 * @typeParam company_tax_id: string - Tax identifier in company system
 * @typeParam tax_value: number - Tax percentage or fixed value
 */
export interface IProductTax {
    company_tax_id: string;
    tax_value: number;
}

/**
 * Quote status enumeration for validation
 * Defines valid quote states in the system
 */
export type QuoteStatus = 'draft' | 'sent' | 'pending' | 'completed' | 'cancelled' | 'approved' | 'rejected';

/**
 * User data interface for document type validation
 * 
 * @interface IUserData
 * @typeParam document_type: string - Document type code (CC, TI, RC, etc.)
 * @typeParam type_document: string - Alternative document type field
 * @typeParam document_type_name: string - Human-readable document type name
 */
export interface IUserData {
    document_type?: string;
    type_document?: string;
    document_type_name?: string;
}

/**
 * Quote record structure that IQuote interface receives
 * 
 * @interface IQuote
 * @typeParam id: string - Quote unique identifier
 * @typeParam person_id: string - Person ID associated with quote
 * @typeParam number: string - Quote number
 * @typeParam date: string - Quote creation date
 * @typeParam customer: string - Customer name
 * @typeParam email: string - Customer email
 * @typeParam state: string - Quote delivery status
 * @typeParam total: number - Quote total amount
 * @typeParam currency: string - Currency code
 * @typeParam items: IQuoteItem[] - Array of quote items
 * @typeParam observations: string - Customer observations
 * @typeParam internalComments: string - Internal staff comments
 */
export interface IQuote {
    id: string;
    person_id?: string;
    number: string;
    date: string;
    customer: string;
    email: string;
    state: string;
    checked?: boolean;
    total?: number;
    currency?: string;
    items?: IQuoteItem[];
    observations?: string;
    internalComments?: string;
    timestamp?: number;
    client_name?: string;
    client_email?: string;
    is_send_email?: string;
    created_at?: string;
    updated_at?: string;
    status?: string;
}

/**
 * Quote line item structure that IQuoteItem interface receives
 * 
 * @interface IQuoteItem
 * @typeParam id: string - Item unique identifier
 * @typeParam code: string - Product code
 * @typeParam description: string - Item description
 * @typeParam quantity: number - Item quantity
 * @typeParam unitPrice: number - Unit price
 * @typeParam discount: number - Discount amount
 * @typeParam tax: number - Tax amount
 * @typeParam total: number - Line total amount
 */
export interface IQuoteItem {
    id: string;
    code: string;
    description: string;
    quantity: number;
    unitPrice: number;
    discount?: number;
    tax?: number;
    total: number;
}

/**
 * Filter parameters that IQuoteFilters interface receives
 *
 * @interface IQuoteFilters
 * @typeParam search: string - Search term filter
 * @typeParam documentStatus: string - Document status filter
 * @typeParam startDate: Date | null - Start date filter as Date object
 * @typeParam endDate: Date | null - End date filter as Date object
 */
export interface IQuoteFilters {
    search: string;
    documentStatus: string;
    startDate: Date | null;
    endDate: Date | null;
}

/**
 * Extended form data structure for quote creation workflow
 * Complete form state for Colombian business quote generation
 *
 * @interface IQuoteFormDataExtended
 * @typeParam document_language: string - Document language for Colombian localization
 * @typeParam invoice_type: string - Type of invoice for Colombian tax compliance
 * @typeParam authorize_personal_data: boolean - Personal data authorization for GDPR compliance
 * @typeParam client_name: string - Client name for quote generation
 * @typeParam client_id: string - Optional client identifier for linking
 * @typeParam document_type: string - Document type for Colombian identification
 * @typeParam document_number: string - Document number for Colombian identification
 * @typeParam taxpayer_type: string - Taxpayer type for Colombian tax system
 * @typeParam payment_method: string - Payment method for Colombian business practices
 * @typeParam payment_means: string - Payment means for transaction processing
 * @typeParam currency: string - Currency code for Colombian peso transactions
 * @typeParam observations: string - Customer-visible observations and notes
 * @typeParam internal_comments: string - Internal comments for staff use
 * @typeParam logo: File | null - Optional company logo for quote branding
 * @typeParam purchase_order_number: string - Optional purchase order reference
 * @typeParam sales_manager: string - Optional sales manager for quote assignment
 * @typeParam manager_document_type: string - Optional manager document type
 * @typeParam manager_document_number: string - Optional manager document number
 */
export interface IQuoteFormDataExtended {
    document_language: string;
    invoice_type: string;
    authorize_personal_data: boolean;
    client_name: string;
    client_id?: string;
    document_type: string;
    document_number: string;
    taxpayer_type: string;
    payment_method: string;
    payment_means: string;
    currency: string;
    observations: string;
    internal_comments: string;
    logo?: File | null;
    purchase_order_number?: string;
    sales_manager?: string;
    manager_document_type?: string;
    manager_document_number?: string;
    [key: string]: unknown;
}

/**
 * Filter setter functions interface for useReportData hook
 * Provides controlled access to filter state updates and search functionality
 * 
 * @interface IFilterSetters
 * @typeParam setSearch: (value: string) => void - Updates search term filter for quote lookup
 * @typeParam setDocumentStatus: (value: string) => void - Updates document status filter (Enviado/Sin enviar)
 * @typeParam setStartDate: (value: string) => void - Updates start date filter for date range filtering
 * @typeParam setEndDate: (value: string) => void - Updates end date filter for date range filtering
 */
export interface IFilterSetters {
    setSearch: (value: string) => void;
    setDocumentStatus: (value: string) => void;
    setStartDate: (value: string) => void;
    setEndDate: (value: string) => void;
}

/**
 * Data operation functions interface for useReportData hook
 * Encapsulates CRUD operations and pagination functionality for quote management
 * 
 * @interface IDataOperations
 * @typeParam handleCheckboxChange: (quoteId: string, checked: boolean) => void - Toggles quote selection for batch operations
 * @typeParam handleDeleteQuotes: () => void - Deletes selected quotes with confirmation workflow
 * @typeParam loadAllQuotesForExport: () => Promise<IQuote[]> - Loads all quotes data for export operations
 * @typeParam handlePageChange: (newPage: number) => void - Updates current page for pagination navigation
 */
export interface IDataOperations {
    handleCheckboxChange: (quoteId: string, checked: boolean) => void;
    handleDeleteQuotes: () => void;
    loadAllQuotesForExport: () => Promise<IQuote[]>;
    handlePageChange: (newPage: number) => void;
}

/**
 * Comprehensive return type interface for useReportData hook
 * Combines state, filters, and operations in structured format for complete quote management
 * 
 * @interface IUseReportDataReturn
 * @typeParam state: object - Complete state information including data, filters, and pagination
 * @typeParam filters: IFilterSetters - Filter setter functions for state updates
 * @typeParam operations: IDataOperations - Data operation functions for CRUD and pagination
 */
export interface IUseReportDataReturn {
    state: {
        data: IPaginatorBackend<IQuote>;
        filters: IQuoteFilters;
        hasSelectedQuotes: boolean;
        isLoading: boolean;
        paginationInfo: {
            currentPage: number;
            totalPages: number;
            total: number;
            from: number;
            to: number;
        };
    };
    filters: IFilterSetters;
    operations: IDataOperations;
}

/**
 * Download state interface for useReportDownload hook
 * Manages modal visibility and download status for user feedback
 *
 * @interface IDownloadState
 * @typeParam showDownloadSuccessModal: boolean - Controls visibility of download success confirmation modal
 */
export interface IDownloadState {
    showDownloadSuccessModal: boolean;
}

/**
 * Download operation functions interface for useReportDownload hook
 * Handles PDF and Excel export functionality with Colombian business formatting
 *
 * @interface IDownloadOperations
 * @typeParam setShowDownloadSuccessModal: (value: boolean) => void - Controls download success modal visibility
 * @typeParam handlePDFDownload: () => Promise<void> - Generates and downloads PDF report with quote data
 * @typeParam handleExcelDownload: () => Promise<void> - Generates and downloads Excel report with quote data
 */
export interface IDownloadOperations {
    setShowDownloadSuccessModal: (value: boolean) => void;
    handlePDFDownload: () => Promise<void>;
    handleExcelDownload: () => Promise<void>;
}

/**
 * Parameters interface for useReportDownload hook initialization
 * Defines required data and filters for download operations with complete context
 * 
 * @interface IUseReportDownloadParams
 * @typeParam data: IPaginatorBackend<IQuote> - Paginated quote data for current view
 * @typeParam filters: IQuoteFilters - Active filters to determine download scope
 * @typeParam allQuotes: IQuote[] - Complete quote dataset for full export operations
 */
export interface IUseReportDownloadParams {
    data: IPaginatorBackend<IQuote>;
    filters: IQuoteFilters;
    allQuotes: IQuote[];
}

/**
 * Return type interface for useReportDownload hook
 * Contains download state and operation functions for PDF and Excel export
 *
 * @interface IUseReportDownloadReturn
 * @typeParam state: IDownloadState - Download state including modal visibility
 * @typeParam operations: IDownloadOperations - Download operation functions for PDF and Excel export
 */
export interface IUseReportDownloadReturn {
    state: IDownloadState;
    operations: IDownloadOperations;
}

/**
 * Select dropdown option event interface
 * Replaces IGenericRecord for type-safe select option change events
 *
 * @interface ISelectOptionEvent
 * @typeParam option: object - Selected option data structure
 * @typeParam option.value: string - Selected option value
 * @typeParam option.name: string - Selected option name/label
 * @typeParam name: string - Optional form field name for event routing
 */
export interface ISelectOptionEvent {
    option: {
        value: string;
        name: string;
        [key: string]: unknown;
    };
    name?: string;
}

/**
 * Input field change event interface
 * Replaces IGenericRecord for type-safe input change events
 *
 * @interface IInputChangeEvent
 * @typeParam target: object - Input target element data
 * @typeParam target.name: string - Input field name attribute
 * @typeParam target.value: string | number - Current input value
 */
export interface IInputChangeEvent {
    target: {
        name: string;
        value: string | number;
    };
}

/**
 * Tax breakdown item structure for financial calculations
 * Detailed breakdown of individual tax components in Colombian format
 *
 * @interface ITaxBreakdownItem
 * @typeParam tax_id: string - Unique tax identifier
 * @typeParam tax_name: string - Tax descriptive name (IVA, INC, etc.)
 * @typeParam tax_rate: number - Tax percentage rate
 * @typeParam tax_amount: number - Calculated tax amount in currency
 * @typeParam tax_base: number - Base amount for tax calculation
 */
export interface ITaxBreakdownItem {
    tax_id: string;
    tax_name: string;
    tax_rate: number;
    tax_amount: number;
    tax_base: number;
}

/**
 * Quote financial totals data structure
 * Replaces IGenericRecord for type-safe financial calculations aligned with backend
 *
 * @interface IQuoteTotalsData
 * @typeParam subtotal: number - Subtotal amount before taxes and discounts
 * @typeParam total: number - Final total amount including all calculations
 * @typeParam total_discount: number - Total discount amount applied
 * @typeParam total_taxes: number - Sum of all tax amounts
 * @typeParam tax_breakdown: ITaxBreakdownItem[] - Optional detailed tax breakdown array
 */
export interface IQuoteTotalsData {
    subtotal: number;
    total: number;
    total_discount: number;
    total_taxes: number;
    tax_breakdown?: ITaxBreakdownItem[];
    [key: string]: unknown;
}

/**
 * Fiscal responsibility structure for Colombian tax classification
 * Required for DIAN compliance and customer invoice generation
 *
 * @interface IFiscalResponsibility
 * @typeParam id: string - Fiscal responsibility unique identifier
 * @typeParam code: string - DIAN fiscal responsibility code
 * @typeParam name: string - Fiscal responsibility descriptive name
 */
export interface IFiscalResponsibility {
    id: string;
    code: string;
    name: string;
}

/**
 * Client data structure for quote generation
 * Replaces IGenericRecord with complete Colombian customer information structure
 *
 * @interface IClientData
 * @typeParam client_id: string - Unique client database identifier
 * @typeParam name: string - Client legal or full name
 * @typeParam document_number: string - Client tax identification number
 * @typeParam document_type: string - Type of identification document (NIT, CC, TI, etc.)
 * @typeParam email: string - Client primary email address
 * @typeParam phone: string - Client contact phone number
 * @typeParam address: string - Client physical address
 * @typeParam city_name: string - Client city name
 * @typeParam department_name: string - Client department/state name
 * @typeParam country_name: string - Client country name (typically Colombia)
 * @typeParam type_taxpayer_id: string - Taxpayer type identifier for Colombian tax system
 * @typeParam type_taxpayer_name: string - Taxpayer type descriptive name
 * @typeParam person_type: string - Person type classification (natural/juridica)
 * @typeParam fiscal_responsibilities: IFiscalResponsibility[] - Array of DIAN fiscal responsibilities
 */
export interface IClientData {
    client_id: string;
    name: string;
    document_number: string;
    document_type: string;
    email: string;
    phone: string;
    address: string;
    city_name: string;
    department_name: string;
    country_name: string;
    type_taxpayer_id: string;
    type_taxpayer_name: string;
    person_type: string;
    fiscal_responsibilities?: IFiscalResponsibility[];
    [key: string]: unknown;
}

/**
 * Sales manager data structure for quote assignment
 * Replaces IGenericRecord for type-safe sales manager information
 *
 * @interface ISalesManagerData
 * @typeParam user_id: string - Unique user identifier in system
 * @typeParam name: string - Sales manager full name
 * @typeParam email: string - Sales manager email address
 * @typeParam document_type: string - Manager document type (CC, CE, etc.)
 * @typeParam document_number: string - Manager identification number
 */
export interface ISalesManagerData {
    user_id: string;
    name: string;
    email: string;
    document_type: string;
    document_number: string;
    [key: string]: unknown;
}

/**
 * Payment configuration data structure for quote financial terms
 * Replaces IGenericRecord for type-safe payment method configuration
 *
 * @interface IPaymentConfigData
 * @typeParam payment_type_id: string - Payment type identifier (cash/credit)
 * @typeParam payment_type_name: string - Payment type descriptive name
 * @typeParam payment_method_id: string - Payment method identifier
 * @typeParam payment_method_name: string - Payment method descriptive name (bank transfer/cash/etc.)
 * @typeParam collection_days: number - Days for payment collection
 * @typeParam days_collection_type: string - Collection days type (calendar/business)
 */
export interface IPaymentConfigData {
    payment_type_id: string;
    payment_type_name: string;
    payment_method_id: string;
    payment_method_name: string;
    collection_days: number;
    days_collection_type: string;
    [key: string]: unknown;
}

/**
 * Quote withholding tax data structure
 * Replaces IGenericRecord[] for type-safe withholding configuration
 *
 * @interface IQuoteWithholdingData
 * @typeParam id: string - Withholding identifier (06, 07, 08 for Colombian taxes)
 * @typeParam name: string - Withholding descriptive name (Retefuente, ReteICA, ReteIVA)
 * @typeParam tax_value: number - Withholding tax percentage
 * @typeParam tax_amount: number - Calculated withholding amount
 * @typeParam base_amount: number - Base amount for withholding calculation
 */
export interface IQuoteWithholdingData {
    id: string;
    name: string;
    tax_value: number;
    tax_amount: number;
    base_amount: number;
    [key: string]: unknown;
}

/**
 * Information component props interface
 * Replaces IGenericRecord for Information tooltip component props
 *
 * @interface IInformationProps
 * @typeParam tooltip: ITooltipData - Tooltip configuration with title and description
 * @typeParam title: string - Information label text displayed
 */
export interface IInformationProps {
    tooltip: ITooltipData;
    title: string;
}

/**
 * Pagination data types for handlePaginationChange function
 *
 * @typeParam PageObject - Object structures with page information
 * @typeParam PaginationData - Combined union type for all pagination inputs
 */
export type PageObject = { page?: number; meta?: { current_page?: number }; params?: { page?: number } };
export type PaginationData = number | string | PageObject;

/**
 * Quote data with withholdings array structure
 * Used by buildWithholdingTable function to map backend data to form structure
 *
 * @interface IQuoteWithWithholdings
 * @typeParam withholdings: ITableTaxesAndRetention[] - Array of withholding tax data from backend
 */
export interface IQuoteWithWithholdings {
    withholdings: ITableTaxesAndRetention[];
}

/**
 * Totals calculation result for quote financial summary
 * Aligned with backend calculation structure
 *
 * @interface IQuoteTotals
 * @typeParam totalBase: number - Base amount before taxes and discounts
 * @typeParam totalIva: number - Total IVA (VAT) amount calculated
 * @typeParam totalDiscount: number - Total discount amount applied
 */
export interface IQuoteTotals {
    totalBase: number;
    totalIva: number;
    totalDiscount: number;
}

