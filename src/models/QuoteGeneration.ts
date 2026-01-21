import { IGenericRecord } from '@models/GenericRecord';
import { IPaginatorBackend } from '@models/Paginator';

/**
 * Quote billing information component properties
 * Main interface for the billing information form component
 * 
 * @interface IQuoteBillingInformationProps
 * @typeParam formData: IGenericRecord - Form data containing all quote information
 * @typeParam openForm: () => void - Function to open modal forms and dialogs
 * @typeParam updateFormData: (data: IGenericRecord) => void - Function to update form state
 * @typeParam isContingency: boolean - Flag indicating if this is a contingency quote
 * @typeParam onProductsChange: (products: IGenericRecord[]) => void - Callback when products array changes
 */
export interface IQuoteBillingInformationProps {
    formData: IGenericRecord;
    openForm: () => void;
    updateFormData: (data: IGenericRecord) => void;
    isContingency: boolean;
    onProductsChange: (products: IGenericRecord[]) => void;
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
 * @typeParam tooltipData: IGenericRecord - Optional tooltip configuration object with title and description
 * @typeParam disabled: boolean - Optional flag to disable input interaction and show disabled state
 * @typeParam required: boolean - Optional flag to mark field as required with visual indicators
 * @typeParam selectProps: object - Optional properties specific to SelectInput component rendering
 * @typeParam selectProps.value: string | number - Current selected value displayed in select dropdown
 * @typeParam selectProps.options: IGenericRecord[] - Array of selectable options with value/name pairs
 * @typeParam selectProps.optionSelected: (option: IGenericRecord) => void - Callback function when option is selected
 * @typeParam selectProps.name: string - Optional form field name attribute for SelectInput form handling
 * @typeParam textProps: object - Optional properties specific to TextInput component rendering
 * @typeParam textProps.value: string | number - Current input value displayed in text field
 * @typeParam textProps.name: string - Optional form field name attribute for TextInput form handling
 * @typeParam textProps.onChange: (e: React.ChangeEvent<HTMLInputElement>) => void - Optional change handler for TextInput events
 */
export interface IConditionalFieldInputProps {
    condition: boolean;
    id: string;
    labelText: string;
    classesWrapper?: string;
    tooltipData?: IGenericRecord;
    disabled?: boolean;
    required?: boolean;
    selectProps?: {
        value: string | number;
        options?: IGenericRecord[];
        optionSelected?: (option: IGenericRecord) => void;
        name?: string;
    };
    textProps?: {
        value: string | number;
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
 * @typeParam startDate: string - Start date filter
 * @typeParam endDate: string - End date filter
 */
export interface IQuoteFilters {
    search: string;
    documentStatus: string;
    startDate: string;
    endDate: string;
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
        data: IPaginatorBackend<IGenericRecord>;
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
 * @typeParam data: IPaginatorBackend<IGenericRecord> - Paginated quote data for current view
 * @typeParam filters: IQuoteFilters - Active filters to determine download scope
 * @typeParam allQuotes: IQuote[] - Complete quote dataset for full export operations
 */
export interface IUseReportDownloadParams {
    data: IPaginatorBackend<IGenericRecord>;
    filters: IQuoteFilters;
    allQuotes: IQuote[];
}

/**
 * Comprehensive return type interface for useReportDownload hook
 * Combines download state and operations functionality for complete export workflow
 * 
 * @interface IUseReportDownloadReturn
 * @typeParam state: IDownloadState - Download state management including modal controls
 * @typeParam operations: IDownloadOperations - Download operation functions for PDF and Excel export
 */
export interface IUseReportDownloadReturn {
    state: IDownloadState;
    operations: IDownloadOperations;
}

/**
 * Pagination data types for handlePaginationChange function
 * 
 * @typeParam PageObject - Object structures with page information
 * @typeParam PaginationData - Combined union type for all pagination inputs
 */
export type PageObject = { page?: number; meta?: { current_page?: number }; params?: { page?: number } };
export type PaginationData = number | string | PageObject;
