export { default as QuoteView } from './QuoteView';

/**
 * Quote data structure for view display with complete business information
 *
 * @interface IQuoteDataView
 * @typeParam id: string - Unique quote identifier from database
 * @typeParam number: string - Sequential quote number for business reference
 * @typeParam date: string - Quote creation date in ISO format
 * @typeParam validUntil: string - Quote expiration date for client reference
 * @typeParam company: object - Company information with Colombian business data
 * @typeParam customer: object - Customer information with tax details
 * @typeParam seller: object - Sales representative information
 * @typeParam products: Array - Product array with quantities, prices, and taxes
 * @typeParam subtotal: number - Total before taxes and discounts
 * @typeParam totalDiscount: number - Total discount amount applied
 * @typeParam totalTax: number - Total tax amount (IVA, etc.)
 * @typeParam total: number - Final quote total
 * @typeParam notes: string - Optional quote notes
 * @typeParam terms: string - Optional payment terms and conditions
 * @typeParam status: string - Quote status (ACTIVE, EXPIRED, etc.)
 * @typeParam pdfUrl: string - Generated PDF URL for download
 */
export interface IQuoteDataView {
    id: string;
    number: string;
    date: string;
    validUntil: string;
    company: {
        name: string;
        nit: string;
        address: string;
        phone: string;
        city: string;
        email: string;
    };
    customer: {
        name: string;
        nit: string;
        address: string;
        phone: string;
        email: string;
        person_id?: string | null;
    };
    seller: {
        name: string;
        email: string;
        phone: string;
    };
    products: Array<{
        id: string;
        description: string;
        quantity: number;
        unitPrice: number;
        discount: number;
        tax: number;
        total: number;
    }>;
    subtotal: number;
    totalDiscount: number;
    totalTax: number;
    total: number;
    notes?: string;
    terms?: string;
    status?: string;
    pdfUrl?: string;
}

/**
 * Action button component properties for quote view interactions
 *
 * @interface IActionButtonProps
 * 
 * @typeParam id: string - Id for recognize button
 * @typeParam label: string - Button text label for user display
 * @typeParam iconSrc: string - Icon source path from assets folder
 * @typeParam iconAlt: string - Icon alt text for accessibility
 * @typeParam onClick: () => void - Click handler function for button action
 * @typeParam width: 'auto' | 'fixed' - Button width configuration
 * @typeParam multiline: boolean - Enable multiline text support
 * @typeParam ariaLabel: string - ARIA label for screen readers
 * @typeParam disabled: boolean - Button disabled state
 * @typeParam className: string - Additional CSS classes for styling
 * @typeParam style: React.CSSProperties - Inline styles for custom appearance
 */
export interface IActionButtonProps {
    id: string;
    label: string;
    iconSrc: string;
    iconAlt: string;
    onClick: () => void;
    width?: 'auto' | 'fixed';
    multiline?: boolean;
    ariaLabel?: string;
    disabled?: boolean;
    className?: string;
    style?: React.CSSProperties;
}

/**
 * Action buttons bar properties for quote view toolbar
 *
 * @interface IActionButtonsBarProps
 * @typeParam onExportPDF: () => void - Handler for PDF export functionality
 * @typeParam onExportExcel: () => void - Handler for Excel export functionality
 * @typeParam onPrint: () => void - Handler for print functionality
 * @typeParam onSendEmail: () => void - Handler for email sending workflow
 * @typeParam onGenerateInvoice: () => void - Handler for electronic invoice generation
 * @typeParam disabled: object - Individual button disabled states
 * @typeParam isLoading: boolean - Global loading state for all buttons
 * @typeParam loadingStates: object - Individual button loading states
 */
export interface IActionButtonsBarProps {
    onExportPDF: () => void;
    onExportExcel: () => void;
    onPrint: () => void;
    onSendEmail: () => void;
    onGenerateInvoice: () => void;
    disabled?: {
        exportPDF?: boolean;
        exportExcel?: boolean;
        print?: boolean;
        sendEmail?: boolean;
        generateInvoice?: boolean;
    };
    isLoading?: boolean;
    loadingStates?: {
        exportPDF?: boolean;
        exportExcel?: boolean;
        print?: boolean;
        sendEmail?: boolean;
        generateInvoice?: boolean;
    };
}

/**
 * Quote preview container properties for PDF display and modal management
 *
 * @interface IQuotePreviewContainerProps
 * @typeParam quoteData: IQuoteDataView | null - Quote data for preview display
 * @typeParam showModal: boolean - Modal visibility state
 * @typeParam onModalToggle: (show: boolean) => void - Modal toggle handler
 * @typeParam previewOptions: object - Preview configuration options
 * @typeParam className: string - Additional CSS classes
 * @typeParam fallbackContent: object - Content shown when quote data unavailable
 */
export interface IQuotePreviewContainerProps {
    quoteData: IQuoteDataView | null;
    showModal?: boolean;
    onModalToggle?: (show: boolean) => void;
    previewOptions?: {
        scale: number;
        showZoom: boolean;
        showFullscreen: boolean;
    };
    className?: string;
    fallbackContent?: {
        title: string;
        message: string;
        content?: React.ReactNode;
    };
}

/**
 * Individual quote product structure for display and calculations
 *
 * @interface IQuoteProduct
 * @typeParam id: string - Unique product identifier
 * @typeParam sku: string - Product SKU or internal code
 * @typeParam description: string - Product description for display
 * @typeParam quantity: number - Product quantity ordered
 * @typeParam unitPrice: number - Price per unit before discounts
 * @typeParam discount: number - Discount amount applied
 * @typeParam tax: number - Tax amount (IVA, etc.)
 * @typeParam total: number - Total amount for this product line
 */
export interface IQuoteProduct {
    id: string;
    sku?: string;
    description: string;
    quantity: number;
    unitPrice: number;
    discount: number;
    tax: number;
    total: number;
}

/**
 * Complete quote data structure for document generation and display
 *
 * @interface IQuoteData
 * @typeParam number: string - Sequential quote number
 * @typeParam date: string - Quote creation date
 * @typeParam validUntil: string - Quote expiration date
 * @typeParam company: object - Company information with Colombian tax data
 * @typeParam customer: object - Customer details with fiscal responsibility
 * @typeParam seller: object - Sales representative information
 * @typeParam products: IQuoteProduct[] - Array of quoted products
 * @typeParam subtotal: number - Subtotal before taxes
 * @typeParam totalDiscount: number - Total discount amount
 * @typeParam totalTax: number - Total tax amount
 * @typeParam total: number - Final quote total
 * @typeParam totalInWords: string - Total amount spelled out in Spanish
 * @typeParam notes: string - Additional quote notes
 * @typeParam terms: string - Payment terms and conditions
 */
export interface IQuoteData {
    number: string;
    date: string;
    validUntil: string;
    company: {
        name: string;
        nit: string;
        address: string;
        phone: string;
        city: string;
        email: string;
    };
    customer: {
        name: string;
        nit: string;
        address: string;
        phone: string;
        email: string;
        city?: string;
        country?: string;
        department?: string;
        postalCode?: string;
        taxpayerType?: string;
        fiscalResponsibility?: string;
        taxDetail?: string;
    };
    seller?: {
        name: string;
        email: string;
        phone: string;
    };
    products: IQuoteProduct[];
    subtotal: number;
    totalDiscount: number;
    totalTax: number;
    total: number;
    totalInWords?: string;
    notes?: string;
    terms?: string;
}

/**
 * Quote document component properties for PDF-style display
 *
 * @interface IQuoteDocumentProps
 * @typeParam data: IQuoteData - Complete quote data for document generation
 * @typeParam className: string - Additional CSS classes for styling
 * @typeParam printMode: boolean - Enable print-optimized layout
 * @typeParam displayOptions: object - Control visibility of document sections
 */
export interface IQuoteDocumentProps {
    data: IQuoteData;
    className?: string;
    printMode?: boolean;
    displayOptions?: {
        showNotes: boolean;
        showTerms: boolean;
        showSeller: boolean;
    };
}

/**
 * Action button design system constants for consistent styling
 * Defines standardized dimensions, spacing, and visual properties for quote action buttons.
 * Ensures consistent user experience across all quote view interactions.
 */
export const ACTION_BUTTON = {
    HEIGHT: '2.875rem', // 46px
    GAP: '1.125rem', // 18px
    PADDING: '0.5rem', // 8px
    BORDER_RADIUS: '0.375rem', // 6px
    ICON_SIZE: '1.875rem', // 30px
    FONT_SIZE: '0.875rem', // 14px
    BOX_SHADOW: '0 0.25rem 0.25rem rgba(0,0,0,0.25)',
    TRANSITION: 'opacity 0.2s ease',
} as const;

/**
 * Layout constants for quote view dimensions and positioning
 * Defines container sizes, modal dimensions, and responsive breakpoints.
 * Optimized for Colombian A4 document format and accessibility requirements.
 */
export const LAYOUT = {
    MAIN_CONTAINER_WIDTH: '60.25rem', // 964px
    MAIN_CONTAINER_HEIGHT: '35rem', // 560px
    PREVIEW_SCALE: '0.7',
    MODAL_MAX_WIDTH: '90vw',
    MODAL_MAX_HEIGHT: '90vh',
    ICON_SIZE: '3rem', // 48px
    CLOSE_ICON_SIZE: '1.5rem', // 24px,
} as const;

/**
 * Color palette constants for quote view theming
 * Brand-consistent colors aligned with Colombian business design standards.
 * Includes primary colors, backgrounds, and accessibility-compliant contrasts.
 */
export const COLORS = {
    PRIMARY_BLUE: '#0B2C4C',
    PRIMARY_TEAL: '#00a99d',
    BACKGROUND_LIGHT: '#FCFDFF',
    WHITE: '#FFFFFF',
    OVERLAY_HOVER: 'rgba(0,0,0,0.1)',
    PREVIEW_BACKGROUND: 'rgba(0,169,157,0.15)',
    GRAY_TEXT: '#6b7280',
} as const;

/**
 * Typography constants for quote document formatting
 * Font families and sizes optimized for Colombian business documents.
 * Ensures readability and professional appearance in PDF and print formats.
 */
export const TYPOGRAPHY = {
    FONT_FAMILY: 'Aller',
    FONT_FAMILY_BOLD: 'Aller-Bold',
    TITLE_SIZE: '1.125rem', // 18px
    DESCRIPTION_SIZE: '1rem',
    BUTTON_TEXT_SIZE: '0.875rem', // 14px,
} as const;

/**
 * Application routes for quote workflow navigation
 * Defines URL paths for quote-related pages and workflow transitions.
 * Supports quote viewing, email sending, and electronic document generation.
 */
export const ROUTES = {
    QUOTES_REPORT: '/quotes-report',
    QUOTE_SEND_MAIL: '/quotes-report?view=quote-send-mail',
    ELECTRONIC_DOCUMENTS: '/documentos-electronicos',
    ELECTRONIC_INVOICE: '/documentos-electronicos/factura-electronica',
} as const;

/**
 * Button configuration presets for quote actions
 * Pre-configured button settings with Spanish labels, icons, and accessibility attributes.
 * Optimized for Colombian business workflow and DIAN compliance requirements.
 */
export const BUTTON_CONFIG = {
    DOWNLOAD_PDF: {
        label: 'Descargar PDF',
        icon: 'new-pdf.svg',
        width: 'auto',
        ariaLabel: 'Descargar PDF',
    },
    DOWNLOAD_EXCEL: {
        label: 'Descargar Excel',
        icon: 'excel.svg',
        width: 'auto',
        ariaLabel: 'Descargar Excel',
    },
    PRINT: {
        label: 'Imprimir',
        icon: 'print.svg',
        width: '9.75rem', // 156px
        ariaLabel: 'Imprimir',
    },
    SEND_EMAIL: {
        label: 'Enviar por\ncorreo',
        icon: 'email.svg',
        width: 'auto',
        ariaLabel: 'Enviar por correo',
        multiline: true,
    },
    GENERATE_INVOICE: {
        label: 'Generar factura\nelectrónica de venta',
        icon: 'add-money-invoice.svg',
        width: 'auto',
        ariaLabel: 'Generar factura electrónica de venta',
        multiline: true,
    },
} as const;

// Re-export useQuoteView from hooks directory
export { useQuoteView } from './hooks/useQuoteView';
