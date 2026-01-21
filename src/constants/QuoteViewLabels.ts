import { IGenericRecord } from '@models/GenericRecord';

/**
 * This const is document configuration for quote generation
 */
export const DOCUMENT_CONFIG = {
    ITEM_INDEX_START: 1,
    DOCUMENT_TYPE: 'COTIZACIÓN',
} as const;
/**
 * This const is UI labels for quote display and components
 */
export const UI_LABELS = {
    COMPANY_LABELS: {
        NIT: 'NIT:',
        ADDRESS: 'Dirección:',
        PHONE: 'Tel:',
    },
    QUOTE_LABELS: {
        QUOTE_NUMBER: 'No.',
        DATE: 'Fecha:',
        VALID_UNTIL: 'Válida hasta:',
    },
    CLIENT_SECTION: 'CLIENTE',
    TABLE_HEADERS: {
        ITEM: 'Item',
        DESCRIPTION: 'Descripción',
        QUANTITY: 'Cantidad',
        UNIT_PRICE: 'Valor Unitario',
        DISCOUNT: 'Descuento',
        TAX: 'IVA',
        TOTAL: 'Total',
    },
    TOTALS: {
        SUBTOTAL: 'Subtotal:',
        TOTAL_DISCOUNT: 'Descuento Total:',
        TOTAL_TAX: 'IVA Total:',
        FINAL_TOTAL: 'TOTAL:',
    },
    SECTIONS: {
        NOTES: 'Notas:',
        TERMS: 'Términos y Condiciones:',
        ATTENDED_BY: 'Atendido por:',
        AUTHORIZED_SIGNATURE: 'Firma Autorizada',
    },
} as const;

/**
 * This const is product table configuration and error messages
 */
export const PRODUCT_TABLE_CONSTANTS = {
    ERROR_MESSAGES: {
        ADD_PRODUCT_FAILED: 'Error agregando producto a la tabla',
        INCOMPLETE_CONFIGURATION: 'Configuración incompleta para el componente de tabla de productos',
    },
} as const;

/**
 * This const is quote send mail UI configuration
 */
export const QUOTE_SEND_MAIL_UI_CONFIG = {
    ARRAY_INDICES: {
        FIRST_ELEMENT: 0,
    },
    FORM_STATES: {
        THREE_BUTTONS_ENABLED: true,
    },
} as const;

/**
 * This const is quote email form UI configuration
 */
export const QUOTE_EMAIL_FORM_UI_CONFIG = {
    FILE_SIZE_MB_DIVISOR: 1024 * 1024,
    VALIDATION_STATES: {
        VALID: true,
        INVALID: false,
    },
    FILE_TYPES: {
        ACCEPTED_IMAGE_TYPES: ['image/png', 'image/jpg', 'image/jpeg'],
    },
} as const;

/**
 * This const is default percentage value for quote calculations
 */
export const DEFAULT_PERCENTAGE_VALUE = '0';
/**
 * This const is minimum value for quote validations
 */
export const MINIMUM_VALUE = 0;

/**
 * This const is valid document types for Colombian identification
 */
export const VALID_DOCUMENT_TYPES = ['CC', 'TI', 'RC'] as const;

/**
 * This const is modal texts for quote notifications and messages
 */
export const MODAL_TEXTS = {
    INVOICE_GENERATED: {
        title: 'Cotización generada correctamente',
        description: 'Su cotización ha sido creada exitosamente.',
    },
    UPDATE_SUCCESS: {
        title: 'Cotización actualizada',
        description: 'Los cambios han sido guardados exitosamente.',
    },
    VALIDATION_ERROR: {
        title: 'Error de validación',
        description: 'Por favor revise los datos ingresados.',
    },
    CONNECTION_ERROR: {
        title: 'Error de conexión',
        description: 'No se pudo conectar con el servidor.',
    },
    QUOTE_SAVE_SUCCESS: {
        title: '¡Su cotización se ha guardado con éxito!',
        description: 'Para ver el detalle de su documento haga clic en el botón Siguiente o si desea generar una nueva cotización haga clic en el botón Generar nueva cotización.',
    },
} as const;

/**
 * This const is quote query fields for data filtering
 */
export const QUOTE_QUERY_FIELDS = ['quantity', 'percentage_discount', 'discount'];

/**
 * This const is quote modals configuration
 */
export const QUOTE_MODALS = {
    CHARACTER_LIMIT: {
        MAX_CHARACTERS: 1000,
        WARNING_THRESHOLD: 900,
    },
    CONFIRMATION: {
        AUTO_HIDE_DELAY: 3000,
    },
} as const;

/**
 * This const is quote ID key mappings for document identification
 */
export const QUOTE_ID_KEY: { [key: string]: string } = {
    DRAFT_DOCUMENT: 'draft_document',
    QUOTE_ID: 'quote_id',
    DOCUMENT_ID: 'document_id',
    INVOICE_ID: 'invoice_id',
    payment_type_name: 'payment_type_id',
    operation_type: 'operation_type_id',
} as const;

/**
 * This const is quote VAT values for Colombian tax calculations
 */
export const QUOTE_VAT_VALUES = [
    {
        value: DEFAULT_PERCENTAGE_VALUE,
        name: '0,00%'
    },
    {
        value: '15',
        name: '15%',
    },
    {
        value: '100',
        name: '100%',
    },
];

/**
 * This const is quote personal data options for customer authorization
 */
export const QUOTE_PERSONAL_DATA_OPTIONS = [
    {
        id: '1',
        name: 'true',
        value: true,
        label: 'Voluntariamente autoriza su información personal',
        title: 'Cliente autoriza manejo de datos',
        description: 'Si su cliente suministra su información personal, agréguela en el formulario para la generación de la cotización.',
        authorized: true,
    },
    {
        id: '2', 
        name: 'false',
        value: false,
        label: 'No autoriza su información personal',
        title: 'Cliente no autoriza manejo de datos',
        description: 'Si su cliente no autoriza dar su información personal, la cotización se genera a nombre de No aplica con número de documento 00000000.',
        authorized: false,
    },
];

/**
 * This const is quote authorized customer data structure
 */
export const QUOTE_AUTHORIZED_DATA = {
    id: '',
    client_id: '',
    name: '',
    document_type: '',
    document_number: '',
    email: '',
    phone: '',
    address: '',
    person_id: null,
    person_type: '',
    type_taxpayer_code: '',
    type_taxpayer_id: '',
    type_taxpayer_name: '',
    tax_details_name: '',
    tax_details_code: '',
};

/**
 * This const is quote unauthorized customer default data
 */
export const QUOTE_UNAUTHORIZED_DATA = {
    id: '07ee58bc-f1cf-4f6d-96ef-c87ec72b8aef',
    client_id: '1c69a81f-f072-4715-bbce-6997cdf5b851',
    name: 'Consumidor final',
    document_type: 'CC',
    document_number: '222222222222',
    email: '',
    phone: '',
    address: '',
    person_id: null,
    person_type: 'Persona natural',
    type_taxpayer_code: 'c8dfbea8-11ca-35bb-bea2-3dc15b66af64',
    type_taxpayer_id: 'c8dfbea8-11ca-35bb-bea2-3dc15b66af64',
    type_taxpayer_name: 'Persona natural',
    tax_details_name: 'No aplica',
    tax_details_code: 'ZZ',
};

/**
 * This const is quote withholding table column headings
 */
export const QUOTE_WITHHOLDING_TABLE_HEADINGS = ['Retención', 'Base', 'Tarifa', 'Valor'];

/**
 * This const is quote total fields configuration for display
 */
export const QUOTE_TOTAL_FIELDS = [
    {
        name: 'subtotal',
        label: 'Subtotal:',
        className: 'font-bold text-right',
        format: 'currency',
    },
    {
        name: 'discount_total',
        label: 'Descuento Total:',
        className: 'text-right text-red-600',
        format: 'currency',
    },
    {
        name: 'tax_total',
        label: 'IVA Total:',
        className: 'text-right',
        format: 'currency',
    },
    {
        name: 'withholding_total',
        label: 'Retenciones Total:',
        className: 'text-right text-orange-600',
        format: 'currency',
    },
    {
        name: 'final_total',
        label: 'TOTAL:',
        className: 'font-bold text-right text-lg',
        format: 'currency',
        divider: true,
    },
];

/**
 * This const is quote payment method default configuration
 */
export const QUOTE_PAYMENT_METHOD = {
    payment_method_id: 'b47ef225-6d25-4733-ab5c-22da3d2b7841',
    payment_method_name: '',
};

/**
 * This const is quote form data initial values
 */
export const QUOTE_FORM_DATA = {
    prefix_id: '',
    prefix_name: '',
    client_id: '',
    not_information_customer: false,
    collection_days: '',
    supplier: 'N/A',
    days_collection_type: 'Días calendario',
    operation_type: 'Estándar',
    operation_type_id: '9513b27d-f642-320c-a89c-07496841eb52',
    payment_method_id: '',
    payment_method_name: '',
    payment_type_id: '',
    payment_type_name: '',
    foreign_exchange_id: '',
    foreign_exchange_name: '',
    foreign_exchange_rate: null,
    number_purchase_order: '',
    sales_manager: '',
    document_number_sales_manager: '',
    document_type_purchasing_manager: '',
    date: new Date().toISOString().split('T')[0],
    lang: 'es',
    id: '',
};

/**
 * This const is quote product item structure
 */
export const QUOTE_PRODUCT_ITEM = {
    warehouse_id: '',
    warehouse: '',
    batch: '',
    date_expiration: '',
    quantity: '',
    discount: 0,
    isPerishable: true,
};

/**
 * This const is quote personal data entities mapped from options
 */
export const QUOTE_PERSONAL_DATA_ENTITIES = QUOTE_PERSONAL_DATA_OPTIONS.map(option => ({
    id: option.id,
    name: option.name,
    value: option.value,
    label: option.label,
    title: option.title,
    description: option.description,
}));

/**
 * This const is quotes pagination configuration
 */
export const QUOTES_PAGINATION = {
    INITIAL_PAGE: 1,
    QUOTES_PER_PAGE: 15,
    BULK_EXPORT_LIMIT: 1000,
    EMPTY_STATE_VALUE: 0,
} as const;

/**
 * This const is quotes default values and configurations
 */
export const QUOTES_DEFAULTS = {
    INITIAL_PAGINATION: {
        current_page: QUOTES_PAGINATION.INITIAL_PAGE,
        from: QUOTES_PAGINATION.EMPTY_STATE_VALUE,
        last_page: QUOTES_PAGINATION.INITIAL_PAGE,
        per_page: QUOTES_PAGINATION.QUOTES_PER_PAGE,
        to: QUOTES_PAGINATION.EMPTY_STATE_VALUE,
        total: QUOTES_PAGINATION.EMPTY_STATE_VALUE,
    },
    DOCUMENT_STATES: {
        SENT: 'Enviado',
        NOT_SENT: 'Sin enviar',
        SELECT_PLACEHOLDER: 'Seleccione',
    },
    DEFAULT_CURRENCY: 'COP',
} as const;

/**
 * This const is quote table headers configuration
 */
export const QUOTE_TABLE_HEADERS = [
    {
        title: '',
    },
    {
        title: 'No. de cotización',
        wrapperClassName: 'quotes-report__table_width',
    },
    {
        title: 'Fecha de emisión',
        wrapperClassName: 'quotes-report__table_width',
    },
    {
        title: 'Nombre cliente',
        wrapperClassName: 'quotes-report__table_width',
    },
    {
        title: 'Correo electrónico del cliente',
        wrapperClassName: 'quotes-report__table_width',
    },
    {
        title: 'Estado del documento',
        wrapperClassName: 'quotes-report__table_width',
    },
];

/**
 * Generate product table headers based on mandate status
 * Provides dynamic headers configuration for quote product tables with tooltips
 *
 * @typeParam isMandate: boolean - Whether the invoice requires mandate fields
 * @returns Array of header configuration objects with tooltips
 */
export const QUOTE_PRODUCT_TABLE_HEADERS = (isMandate: boolean): IGenericRecord[] => [
    {
        className: 'selector',
    },
    {
        title: 'No.',
        className: 'number',
    },
    {
        title: `*SKU/Código - Producto/
Servicio`,
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
        title: `*Fecha de
vencimiento`,
        className: 'due-date',
        tooltip: {
            title: 'Fecha de vencimiento:',
            description: 'es la fecha en la que el producto dejará de ser apto para su consumo.',
        },
    },
    {
        title: 'Cantidad',
        className: 'quantity',
        tooltip: {
            title: 'Cantidad:',
            description: 'es la cantidad de producto/servicio a vender.',
        },
    },
    {
        title: `Unidad de
medida`,
        className: 'unit-measure',
        tooltip: {
            title: 'Unidad de medida:',
            description: 'es la unidad de medida del producto/servicio.',
        },
    },
    {
        title: `Valor
unitario`,
        className: 'unit-value',
        tooltip: {
            title: 'Valor unitario:',
            description: 'es el precio de la unidad del producto/servicio.',
        },
    },
    {
        title: `% de
descuento`,
        className: 'discount',
        tooltip: {
            title: '% de descuento:',
            description: 'es el porcentaje de descuento aplicado al producto/servicio.',
        },
    },
    {
        title: 'Descuento',
        className: 'discount-value',
        tooltip: {
            title: 'Descuento:',
            description: 'es el valor del descuento aplicado al producto/servicio.',
        },
    },
    {
        title: 'Impuestos',
        className: 'taxes',
        tooltip: {
            title: 'Impuestos:',
            description: 'son los impuestos aplicados al producto/servicio.',
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
 * This const is document status options for filtering
 */
export const DOCUMENT_STATUS = [
    { key: '', value: QUOTES_DEFAULTS.DOCUMENT_STATES.SELECT_PLACEHOLDER },
    { key: 'sent', value: QUOTES_DEFAULTS.DOCUMENT_STATES.SENT },
    { key: 'unsent', value: QUOTES_DEFAULTS.DOCUMENT_STATES.NOT_SENT },
] as const;

/**
 * This const is data input style classes
 */
export const DATA_INPUT_STYLE = 'w-38 xs:mb-5 mb-0 xs:w-full mt-4.5 xs:mt-0 md:mt-0';

/**
 * This const is filter input style classes
 */
export const FILTER_INPUT_STYLE = 'w-73 xs:w-full xs:mb-4.5';

/**
 * This const is quote magic numbers for calculations and validations
 */
export const QUOTE_MAGIC_NUMBERS = {
    EMPTY_ARRAY_LENGTH: 0,
    MINIMUM_ITEMS_COUNT: 1,
    FIRST_ITEM_INDEX: 0,
    SECOND_ITEM_INDEX: 1,
    MAX_DOCUMENT_TYPES_DISPLAYED: 4,
    FIRST_FILE_INDEX: 0,
    DEFAULT_UNIT_COST: 0,
    DEFAULT_QUANTITY: 0,
    DEFAULT_PERCENTAGE_DISCOUNT: 0,
} as const;

/**
 * This const is taxpayer type IDs for Colombian tax system
 */
export const TAXPAYER_TYPE_IDS = {
    NATURAL: 'c8dfbea8-11ca-35bb-bea2-3dc15b66af64',
    JURIDICA: '02287cd4-2eaf-3e16-a341-1f894429aebd'
} as const;

/**
 * This const is UI texts for placeholders and labels
 */
export const UI_TEXTS = {
    PLACEHOLDERS: {
        DATE: 'dd/mm/aaaa',
        DEFAULT_CUSTOMER: 'Nombre cliente',
        DEFAULT_EMAIL: 'correo@correo.com',
        DEFAULT_QUOTE_NUMBER: '00000',
        DEFAULT_STATE: 'Sin enviar',
    },
    LABELS: {
        INITIAL_DATE: 'Fecha inicial:',
        FINAL_DATE: 'Fecha final:',
        SEARCHER: 'Buscador:',
        DOCUMENT_STATUS: 'Estado del documento',
        SELECT_OPTION: 'Seleccionar',
        SENT: 'Enviado',
        UNSENT: 'Sin enviar',
    },
} as const;

/**
 * Core constants for quote generation and management
 *
 * @constant QUOTE_CONSTANTS
 * @typeParam NA: string - Not applicable label for empty or non-required fields
 * @typeParam CONSUMER_CLIENT_DOCUMENT: string - Default document number for final consumer clients
 * @typeParam COLOMBIAN_CURRENCY_ID: string - UUID identifier for Colombian Peso (COP) currency
 * @typeParam DATE_BACK_FORMAT: string - Date format string for backend communication (YYYY-MM-DD)
 * @typeParam ONE: number - Numeric constant for value 1 (used in calculations and indexing)
 * @typeParam TWO: number - Numeric constant for value 2 (used in calculations)
 * @typeParam TypeFile: object - File type identifiers for document attachments
 * @typeParam TypeFile.CERTIFICATE: string - Certificate file type
 * @typeParam TypeFile.LOGO_INVOICE: string - Invoice logo file type
 * @typeParam TypeFile.LOGO_SUPPORT: string - Support documents logo file type
 * @typeParam TypeFile.LOGO: string - Generic logo file type
 * @typeParam TypeFile.RUT: string - Colombian tax registration (RUT) file type
 * @typeParam MaxLengthFields: object - Maximum character length constraints for form fields
 * @typeParam MaxLengthFields.ZERO: number - Zero length constraint
 * @typeParam MaxLengthFields.ORDER: number - Maximum length for order numbers (9 digits)
 * @typeParam MaxLengthFields.PHONE: number - Maximum length for phone numbers (10 digits)
 * @typeParam MaxLengthFields.Name: number - Maximum length for name fields (240 characters)
 * @typeParam MaxLengthFields.PREFIX: number - Maximum length for quote prefix (20 characters)
 * @typeParam QUOTE_NUMBER_FORMAT: object - Number formatting configuration for quote numbers
 * @typeParam QUOTE_NUMBER_FORMAT.style: string - Number format style (decimal)
 * @typeParam QUOTE_NUMBER_FORMAT.minimumFractionDigits: number - Minimum decimal places (3)
 * @typeParam QUOTE_NUMBER_FORMAT.maximumFractionDigits: number - Maximum decimal places (3)
 * @typeParam QUOTE_NUMBER_FORMAT.minimumIntegerDigits: number - Minimum integer digits (9)
 * @typeParam QUOTE_NUMBER_FORMAT.useGrouping: boolean - Enable thousand separators
 */
export const QUOTE_CONSTANTS = {
    NA: 'N/A',
    CONSUMER_CLIENT_DOCUMENT: '222222222222',
    COLOMBIAN_CURRENCY_ID: '0e2346cd-2d32-3383-a762-203a9c013b02',
    DATE_BACK_FORMAT: 'YYYY-MM-DD',
    ONE: 1,
    TWO: 2,
    TypeFile: {
        CERTIFICATE: 'certificate',
        LOGO_INVOICE: 'logo-invoice',
        LOGO_SUPPORT: 'logo-support-documents',
        LOGO: 'logo',
        RUT: 'RUT',
    },
    MaxLengthFields: {
        ZERO: 0,
        ORDER: 9,
        PHONE: 10,
        Name: 240,
        PREFIX: 20,
    },
    QUOTE_NUMBER_FORMAT: {
        style: 'decimal',
        minimumFractionDigits: 3,
        maximumFractionDigits: 3,
        minimumIntegerDigits: 9,
        useGrouping: true,
    },
} as const;
