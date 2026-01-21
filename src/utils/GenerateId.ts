/**
 * Enum for supported element type suffixes for UI components.
 */
export enum ElementType {
    TXT = 'txt', // Input / textbox (inputs de texto, datepicker, numéricos, etc.)
    BTN = 'btn', // Botones
    LNK = 'lnk', // Enlaces
    TBL = 'tbl', // Tablas
    ROW = 'row', // Filas de tabla
    COL = 'col', // Columnas de tabla
    CELL = 'cell', // Celdas de tabla
    MDL = 'mdl', // Modales
    CHK = 'chk', // Checkbox
    RDO = 'rdo', // Radio button
    DRP = 'drp', // Dropdown / select
    UPL = 'upl', // Upload / carga de archivos
    DWN = 'dwn', // Download / descarga
    CHT = 'cht', // Charts
    PGN = 'pgn', // Paginator
    INF = 'inf', // Information component
    CRD = 'crd', // Cards
    TOOL = 'tool', // Tooltips
    TAB = 'tab', // Tabs
    CONT = 'cont', // Contenedores
    FRM = 'frm', // Formularios
    ICO = 'ico', // Íconos
}

/**
 * Enum for supported action element type suffixes for actions in UI components.
 */
export enum ActionElementType {
    ACCEPT = 'accept',
    ACTION = 'action',
    ACTIVATE = 'activate',
    ADD = 'add',
    ADD_PRODUCT = 'add-product',
    ADD_SERVICE = 'add-service',
    ALERT = 'alert',
    ANNULAR = 'annular',
    ARROW_DOWN = 'arrow-down',
    BACK = 'back',
    BUY = 'buy',
    BUY_PAYMENT_PLAN = 'buy-payment-plan',
    CANCEL = 'cancel',
    CALENDAR = 'calendar',
    CHANGE = 'change',
    CLOSE = 'close',
    CONFIRM = 'confirm',
    CONTAINER = 'container',
    CONTINUE = 'continue',
    CONNECT = 'connect',
    COPY = 'copy',
    CUT = 'cut',
    CREATE = 'create',
    CUSTOM_ACTION = 'custom-action',
    DATE = 'date',
    DELETE = 'delete',
    DETAIL = 'detail',
    DISCARD = 'discard',
    DOWNLOAD = 'download',
    EDIT = 'edit',
    ERROR = 'error',
    FINISH = 'finish',
    FIX = 'fix',
    HEADER = 'header',
    INFO = 'info',
    INPUT = 'input',
    LABEL = 'label',
    LOGIN = 'login',
    LOADER = 'loader',
    NEXT = 'next',
    OTHER_ACTION = 'other-action',
    OPEN = 'open',
    OMIT = 'omit',
    PASTE = 'paste',
    PREVIOUS = 'previous',
    PREVIEW = 'preview',
    PRINT = 'print',
    PRICE = 'price',
    PUBLISH = 'publish',
    PUT_FORWARD = 'put-forward',
    PUT_BACK = 'put-back',
    REDIRECT = 'redirect',
    RECOVERY = 'recovery',
    RENEW = 'renew',
    RETRY = 'retry',
    REFRESH = 'refresh',
    SAVE = 'save',
    SEARCH = 'search',
    SELECT = 'select',
    SELECT_DATE = 'select-date',
    SELECT_HOUR = 'select-hour',
    SEND = 'send',
    SUBMIT = 'submit',
    SUCCESS = 'success',
    SYNC = 'sync',
    START = 'start',
    TABLE = 'table',
    TITLE = 'title',
    TIME = 'time',
    TOGGLE = 'toggle',
    TRASH = 'trash',
    UPDATE = 'update',
    UPLOAD = 'upload',
    UPGRADE = 'upgrade',
    VALUE = 'value',
    VALIDATE = 'validate',
    VIDEO = 'video',
    VIEW = 'view',
    VERIFY = 'verify',
}

/**
 * Enum for modules
 */
export enum ModuleApp {
    // Pages
    ACCOUNT_ACCREDITATION = 'account-accreditation',
    ACCOUNT_CREATED = 'account-created',
    ANALYTICAL_REPORTS = 'analytical-reports',
    ACCOUNTING_REPORTS = 'accounting-reports',
    BUILD_PRODUCT = 'build-product',
    BUYING_AND_SELLING = 'buying-selling',
    BUYING_AND_SELLING_MENU = 'buying-selling-menu',
    BIN = 'bin',
    CALENDAR = 'calendar',
    CALENDAR_PLANNING = 'calendar-planning',
    CATALOG_CUSTOMER = 'catalog-customer',
    CLIENT_PORTAL = 'client-portal',
    COMMON_QUESTIONS = 'common-questions',
    COMPANY_DATA = 'company-data',
    COMPANY_INFORMATION = 'company-information',
    COMPANY_PROFILE = 'company-profile',
    COMPANY_REGISTRATION = 'company-registration',
    CONTACT_US = 'contact-us',
    CONTINGENCY = 'contingency',
    COUNTABILITY_MENU = 'countability-menu',
    COUNT_BOOK_MENU = 'count-book-menu',
    CREATE_ACCOUNT = 'create-account',
    CREATE_EXPENSE_VOUCHER = 'create-expense-voucher',
    DASHBOARD = 'dashboard',
    DESIGN_ADMIN_MENU_WEBSITE = 'design-admin-menu-website',
    DESIGN_TABS_WEBSITE = 'design-tabs-website',
    DIGGI_PYMES_MAINTENANCE = 'diggi-pymes-maintenance',
    DIGITIZATION_PHYSICAL_STORE = 'digitization-physical-store',
    DIAN_ENABLEMENT = 'dian-enablement',
    DYNAMIC_ANALYSIS = 'dynamic-analysis',
    DRAFT_DOCUMENTS = 'draft-documents',
    ELECTRONIC_CREDIT_NOTE = 'electronic-credit-note',
    ELECTRONIC_DEBIT_NOTE = 'electronic-debit-note',
    ELECTRONIC_CREDIT_DEBIT_ADJUSTMENT_NOTE = 'electronic-credit-debit-adjustment-note',
    ELECTRONIC_DOCUMENTS = 'electronic-documents',
    ELECTRONIC_INVOICE = 'electronic-invoice',
    ELECTRONIC_INVOICE_MENU = 'electronic-invoice-menu',
    GENERAL_LEDGER_BALANCE = 'general-ledger-balance-sheets',
    HISTORICAL_AVERAGE_SALES = 'historical-average-sales',
    HISTORY_MODIFICATION = 'history-modification',
    HELP_CENTER = 'help-center',
    HOME = 'home',
    INTERNAL_CONTROL_MENU = 'internal-control-menu',
    INVENTORY_MENU = 'inventory-menu',
    INVENTORY_MOVEMENTS = 'inventory-movements',
    INSTRUCTIONS = 'instructions',
    LANDING = 'landing',
    LIST_CASH_RECEIPTS = 'list-cash-receipts',
    LIST_COUNTABILITY = 'list-countability',
    LIST_EXPENSE_VOUCHER = 'list-expense-voucher',
    NOTIFICATION_ADMIN = 'notification-admin',
    NOTIFICATION_ADMIN_MENU_WEBSITE = 'notification-admin-menu-website',
    ONLINE_SHOP_MENU_WEBSITE = 'online-shop-menu-website',
    PARAMETRIZATION_NOTIFICATION = 'parametrization-notification',
    PAYMENT_GATEWAY_WEBSITE = 'payment-gateway-website',
    PAYMENT_METHODS = 'payment-methods',
    PAYMENT_PLANS = 'payment-plans',
    PERSONALIZED_CONSULTANCY = 'personalized-consultancy',
    PERSONALIZED_CONSULTING = 'personalized-consulting',
    PLANNING_AND_ORGANIZATION = 'planning-and-organization',
    PQR = 'pqr',
    PRODUCT_ANALYSIS = 'product-analysis',
    PRODUCT_POLICY = 'product-return-policy',
    PURCHASING_PROCESS = 'purchasing-process',
    POLITICS_PERSONAL = 'politics-personal',
    PURCHASE_INVOICE_NOTES = 'purchase-invoice-notes',
    GANTT = 'gantt',
    SUPPLIER_PURCHASE = 'supplier-purchase',
    SUPPORT_DOCUMENT = 'support-document',
    TECHNICAL_SHEET = 'technical-sheet',
    TECHNICAL_SHEET_WAREHOUSES = 'technical-sheet-warehouses',
    TECHNICAL_SHEET_PRODUCTS_SERVICES = 'technical-sheet-products-services',
    TECHNICAL_SHEET_CUSTOMER_SUPPLIER = 'technical-sheet-customer-supplier',
    TECHNICAL_SHEET_EMPLOYEES = 'technical-sheet-employees',
    USER_ADMINISTRATION = 'user-administration',
    VERIFICATION_MENU = 'verification-menu',
    VIRTUAL_STORE = 'virtual-store',
    WAREHOUSE = 'warehouse',
    WAREHOUSE_CONFIG = 'warehouse-config',
    WAREHOUSES_ADMIN = 'warehouses-admin',
    WAREHOUSES_ADMIN_MENU = 'warehouses-admin-menu',
    WEBSITE = 'website',
    WEBSITE_MENU = 'website-menu',
    QUOTES = 'quotes',
    // Components
    BREAD_CRUMB = 'bread-crumb',
    BUTTONS = 'buttons',
    CARD = 'card',
    CUSTOM_MODALS = 'custom-modals',
    FOOTER = 'footer',
    HEADER = 'header',
    INPUT = 'input',
    LOGIN = 'login',
    MODALS = 'modals',
    OPERATION_TABLE = 'operation-table',
    OTHERS = 'others',
    PAGINATOR = 'paginator',
    TABLE = 'table',
    TOOLTIP = 'tooltip',
}

/**
 * Options for generating a stable and predictable element ID.
 *
 * @typeParam {string} appPrefix  - Two-letter application prefix (e.g., "dp").
 * @typeParam {string} module     - Module name in kebab-case (e.g., "electronic-document").
 * @typeParam {string} [submodule] - Optional submodule name in kebab-case (e.g., "form-document-type-supplier").
 * @typeParam {ActionElementType} action     - Action or attribute describing the element (e.g., "create", "name", "delete").
 * @typeParam {ElementType} elementType - UI element type suffix (e.g., "btn", "txt").
 */
interface IGenerateIdOptions {
    appPrefix?: string;
    module: ModuleApp;
    submodule?: string;
    action: ActionElementType;
    elementType: ElementType;
}

/**
 * Converts a given string into kebab-case format.
 *
 * @typeParam {string} str - The input string.
 * @returns {string} The kebab-case formatted string.
 */
export const toKebabCase = (str: string): string => {
    return str
        ?.replace(/([a-z])([A-Z])/g, '$1-$2')
        ?.replace(/[\s/_]+/g, '-')
        ?.toLowerCase();
};

/**
 * Generates a unique, stable, and predictable element ID following the convention:
 *
 * Format: `[app-prefix]-[module]-[submodule]-[action]-[elementType]`
 *
 * @typeParam {IGenerateIdOptions} options - Options for generating the ID.
 * @returns {string} The generated element ID.
 */
export const generateId = ({ appPrefix = 'dp', module, submodule, action, elementType }: IGenerateIdOptions): string => {
    const parts = [
        toKebabCase(appPrefix),
        toKebabCase(module),
        submodule ? toKebabCase(submodule) : null,
        toKebabCase(action),
        elementType,
    ].filter(Boolean);

    return parts.join('-');
};
