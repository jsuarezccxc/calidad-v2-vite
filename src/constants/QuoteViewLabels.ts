export const DOCUMENT_CONFIG = {
    ITEM_INDEX_START: 1,
    DOCUMENT_TYPE: 'COTIZACIÓN',
} as const;

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

export const PRODUCT_TABLE_CONSTANTS = {
    ERROR_MESSAGES: {
        ADD_PRODUCT_FAILED: 'Error agregando producto a la tabla',
        INCOMPLETE_CONFIGURATION: 'Configuración incompleta para el componente de tabla de productos',
    },
} as const;

export const QUOTE_SEND_MAIL_UI_CONFIG = {
    ARRAY_INDICES: {
        FIRST_ELEMENT: 0,
    },
    FORM_STATES: {
        THREE_BUTTONS_ENABLED: true,
    },
} as const;


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


export const DEFAULT_PERCENTAGE_VALUE = '0';
export const MINIMUM_VALUE = 0;



export const VALID_DOCUMENT_TYPES = ['CC', 'TI', 'RC'] as const;

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

export const QUOTE_QUERY_FIELDS = ['quantity', 'percentage_discount', 'discount'];

export const QUOTE_MODALS = {
    CHARACTER_LIMIT: {
        MAX_CHARACTERS: 1000,
        WARNING_THRESHOLD: 900,
    },
    CONFIRMATION: {
        AUTO_HIDE_DELAY: 3000,
    },
} as const;

export const QUOTE_ID_KEY: { [key: string]: string } = {
    DRAFT_DOCUMENT: 'draft_document',
    QUOTE_ID: 'quote_id',
    DOCUMENT_ID: 'document_id',
    INVOICE_ID: 'invoice_id',
} as const;

export const QUOTE_WITHHOLDING_DATA = [
    {
        name: '06 Retefuente',
        base: 0,
        percentage: 0,
        value: 0,
        isTax: false,
        disabled: false,
        isSelectInput: false,
    },
    {
        name: '07 ReteICA',
        base: 0,
        percentage: 0,
        isTax: false,
        value: 0,
        disabled: false,
        isSelectInput: false,
    },
    {
        name: '08 ReteIVA',
        base: 0,
        percentage: 0,
        isTax: false,
        value: 0,
        disabled: false,
        isSelectInput: true,
    },
];

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

export const QUOTE_WITHHOLDING_TABLE_HEADINGS = ['Retención', 'Base', 'Tarifa', 'Valor'];

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

export const QUOTE_PAYMENT_METHOD = {
    payment_method_id: 'b47ef225-6d25-4733-ab5c-22da3d2b7841',
    payment_method_name: '',
};

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

export const QUOTE_PRODUCT_ITEM = {
    warehouse_id: '',
    warehouse: '',
    batch: '',
    date_expiration: '',
    quantity: '',
    discount: 0,
    isPerishable: true,
};

export const QUOTE_PERSONAL_DATA_ENTITIES = QUOTE_PERSONAL_DATA_OPTIONS.map(option => ({
    id: option.id,
    name: option.name,
    value: option.value,
    label: option.label,
    title: option.title,
    description: option.description,
}));

export const QUOTES_PAGINATION = {
    INITIAL_PAGE: 1,
    QUOTES_PER_PAGE: 15,
    BULK_EXPORT_LIMIT: 1000,
    EMPTY_STATE_VALUE: 0,
} as const;

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

export const DOCUMENT_STATUS = [
    { key: '', value: QUOTES_DEFAULTS.DOCUMENT_STATES.SELECT_PLACEHOLDER },
    { key: 'sent', value: QUOTES_DEFAULTS.DOCUMENT_STATES.SENT },
    { key: 'unsent', value: QUOTES_DEFAULTS.DOCUMENT_STATES.NOT_SENT },
] as const;

export const DATA_INPUT_STYLE = 'w-38 xs:mb-5 mb-0 xs:w-full mt-4.5 xs:mt-0 md:mt-0';

export const FILTER_INPUT_STYLE = 'w-73 xs:w-full xs:mb-4.5';

export const QUOTE_MAGIC_NUMBERS = {
    // Array and validation constants
    EMPTY_ARRAY_LENGTH: 0,
    MINIMUM_ITEMS_COUNT: 1,
    
    // Array index constants
    FIRST_ITEM_INDEX: 0,
    SECOND_ITEM_INDEX: 1,
    
    // Document type limits
    MAX_DOCUMENT_TYPES_DISPLAYED: 4,
    
    // File access constants
    FIRST_FILE_INDEX: 0,
    
    // Default numeric values
    DEFAULT_UNIT_COST: 0,
    DEFAULT_QUANTITY: 0,
    DEFAULT_PERCENTAGE_DISCOUNT: 0,
} as const;

export const TAXPAYER_TYPE_IDS = {
    NATURAL: 'c8dfbea8-11ca-35bb-bea2-3dc15b66af64',
    JURIDICA: '02287cd4-2eaf-3e16-a341-1f894429aebd'
} as const;

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
