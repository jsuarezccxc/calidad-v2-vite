import React from 'react';
import { PRODUCT_NAME } from '@constants/ProductName';
import { IPath } from '@models/Paths';

const Bin = React.lazy(() => import('@pages/bin'));
const ChangePassword = React.lazy(() => import('@pages/change-password'));
const PaymentMethods = React.lazy(() => import('@pages/payment-methods'));
const UserCatalogs = React.lazy(() => import('@pages/user-manager/user-catalogs'));
const UserManagement = React.lazy(() => import('@pages/user-manager/user-catalogs/user-management'));
const NotificationCenter = React.lazy(() => import('@pages/notification-center'));
const ProductShippingCostInformation = React.lazy(() => import('@pages/product-shipping-cost-information'));
const EditEmailTemplate = React.lazy(() => import('@pages/edit-email-template'));
const CorrectionBusinessDocument = React.lazy(() => import('@pages/correction-business-document'));
const CorrectionDocumentsClientEmployer = React.lazy(() => import('@pages/correction-documents-client-employer'));
const InvoiceSummary = React.lazy(() => import('@components/invoice-summary'));
const InformationProvisionOfServices = React.lazy(() => import('@pages/information-provision-of-services'));
const Calendar = React.lazy(() => import('@pages/calendar'));
const Gantt = React.lazy(() => import('@pages/gantt'));
const SupportDocument = React.lazy(() => import('@pages/support-document'));
const DocumentCorrectionCCXC = React.lazy(() => import('@pages/document-correction-ccxc'));
const VirtualStoreSalesReceipts = React.lazy(() => import('@pages/virtual-store-sales-receipts'));
const CalendarPlanning = React.lazy(() => import('@pages/catalog-planning'));
const WebsiteEditor = React.lazy(() => import('@pages/website-editor'));
const WebsiteInventory = React.lazy(() => import('@pages/website-inventory'));
const InventoryMovements = React.lazy(() => import('@pages/website-inventory'));
const WebsiteVisibility = React.lazy(() => import('@pages/website-visibility'));
const WebsiteSocial = React.lazy(() => import('@pages/website-social'));
const WebsiteAnalytics = React.lazy(() => import('@pages/website-analytics'));
const SalesReportProductWarehouse = React.lazy(() => import('@pages/sales-report-product-warehouse'));
const ShoppingReportProductWarehouse = React.lazy(() => import('@pages/shopping-report-product-warehouse'));
const InstructionsPayu = React.lazy(() => import('@pages/instructions-payu'));
const SynchronizePayu = React.lazy(() => import('@pages/synchronize-payu'));
const AccountingReports = React.lazy(() => import('@pages/accounting-reports-menu'));
const EndingInventoryAccountingMonth = React.lazy(() => import('@pages/ending-inventory-accounting-month'));
const WebsiteDashboard = React.lazy(() => import('@pages/website-dashboard'));
const WebsiteActiveDomain = React.lazy(() => import('@pages/website-active-domain'));
const DailyEndingInventory = React.lazy(() => import('@pages/daily-ending-inventory'));
const FinalInventoryCalculation = React.lazy(() => import('@pages/final-inventory-calculation'));
const EnableElectronicBiller = React.lazy(() => import('@pages/enable-electronic-biller'));
const ReportElectronicDocuments = React.lazy(() => import('@pages/report-electronic-documents'));
const CorrectCancelElectronicDocument = React.lazy(() => import('@pages/correct-cancel-electronic-document'));
const ConsultElectronicDocument = React.lazy(() => import('@pages/consult-electronic-document'));
const CorrectedDocuments = React.lazy(() => import('@pages/corrected-documents'));
const ElectronicDocumentsGenerated = React.lazy(() => import('@pages/electronic-documents-generated'));
const HelpCenter = React.lazy(() => import('@pages/help-center'));
const DraftDocuments = React.lazy(() => import('@pages/draft-documents'));
const DatabaseMenu = React.lazy(() => import('@pages/database-menu'));
const ModificationHistory = React.lazy(() => import('@pages/modifications-history'));
const NumberRange = React.lazy(() => import('@pages/number-range'));
const DocsInstructions = React.lazy(() => import('@pages/docs-instructions'));
const DatabaseEmployees = React.lazy(() => import('@pages/database-employees'));
const DatabaseEmployeesForm = React.lazy(() => import('@pages/database-employees-form'));
const DatabaseEmployeeDetail = React.lazy(() => import('@pages/database-employee-detail'));
const DatabaseOrganizationChart = React.lazy(() => import('@pages/database-organization-chart'));
const DataCompany = React.lazy(() => import('@pages/data-company'));
const SalesReport = React.lazy(() => import('@pages/sales-report'));
const PrefixNote = React.lazy(() => import('@pages/prefix-note'));
const SupplierDatabase = React.lazy(() => import('@pages/supplier-database'));
const GeneratePurchaseInvoice = React.lazy(() => import('@pages/generate-purchase-invoice'));
const CustomerDatabase = React.lazy(() => import('@pages/customer-database'));
const GenerateSupportDocument = React.lazy(() => import('@pages/generate-support-document'));
const DashboardElectronicDocuments = React.lazy(() => import('@pages/dashboard-electronic-documents'));
const GenerateSalesInvoice = React.lazy(() => import('@pages/generate-sales-invoice'));
const Warehouses = React.lazy(() => import('@pages/warehouses'));
const GeneralDashboard = React.lazy(() => import('@pages/general-dashboard'));
const ProductDatabase = React.lazy(() => import('@pages/product-database'));
const PaymentPlan = React.lazy(() => import('@pages/payment-plan'));
const PaymentPlans = React.lazy(() => import('@pages/new-payment-plans'));
const PlanMethodPayment = React.lazy(() => import('@pages/plan-method-payment'));
const CustomerCatalogs = React.lazy(() => import('@pages/user-administration/customer-catalogs'));
const CompanyDataLanding = React.lazy(
    () => import('@pages/home/components/landing-home-diggipymes/components/company-data-landing/CompanyDataLanding')
);
const PurchasingProcess = React.lazy(() => import('@pages/purchasing-process'));
const ContingencyActivation = React.lazy(() => import('@pages/contingency-activation'));
const ContingencyHistory = React.lazy(() => import('@pages/contingency-history'));
const CrmDashboard = React.lazy(() => import('@pages/crm-dashboard'));
const CrmContacts = React.lazy(() => import('@pages/crm-contacts'));
const CrmProspectusStatus = React.lazy(() => import('@pages/crm-prospectus-status'));
const CrmConversionCustomer = React.lazy(() => import('@pages/crm-conversion-customer'));
const CrmCustomerEvolution = React.lazy(() => import('@pages/crm-customer-evolution'));
const CrmPqrsf = React.lazy(() => import('@pages/crm-pqrsf'));
const CrmSendEmailsContact = React.lazy(() => import('@pages/crm-send-emails-contact'));
const CrmPredefinedReports = React.lazy(() => import('@pages/crm-predefined-reports'));
const CrmCustomReports = React.lazy(() => import('@pages/crm-custom-reports'));
const PaymentGatewaySynchronization = React.lazy(() => import('@pages/payment-gateway-synchronization'));
const QuotesReport = React.lazy(() => import('@pages/quotes-report/QuotesReport'));
const PurchaseInvoiceNotes = React.lazy(() => import('@pages/purchase-invoice-notes'));

export enum Routes {
    HOME,
    CHANGE_PASSWORD,
    MEMBERSHIP_STATUS,
    USER_CATALOG_LIST,
    PAYMENT_METHODS,
    ELECTRONIC_INVOICE,
    ADD_USER,
    EDIT_USER,
    BIN,
    WEBSITE_MENU,
    EDIT_SUPPLIER,
    CLIENT_PORTAL_VIEWER_INVOICE,
    USER_ADMINISTRATOR,
    ACCOUNT_ACCREDITATION,
    USER_MANAGEMENT,
    NOTIFICATION_CENTER,
    PRODUCT_SHIPPING_COST,
    DAILY_NOTIFICATIONS_BUYING_SELLING_PROCESS,
    EDIT_EMAIL_TEMPLATE,
    EDIT_EMAIL_TEMPLATE_DOCUMENT,
    NOTIFICATIONS_PARAMETERIZATION_ELECTRONIC_INVOICE,
    CORRECTION_BUSINESS_DOCUMENT,
    CORRECTION_DOCUMENTS_CLIENT_EMPLOYER,
    INVOICE_SUMMARY,
    REJECT_INVOICE,
    NOTIFICATIONS_PARAMETRIZATION_BUYING_AND_SELLING,
    DIGITIZATION_PHYSICAL_STORE_MENU,
    COMPANY_PROFILE_MENU_PHYSICAL_STORE,
    BUYING_AND_SELLING_PROCESS_MENU_PHYSICAL_STORE,
    PLANNING_AND_ORGANIZATION_MENU,
    REPORT_NOTE_PURCHASE,
    SUPPLIER_PURCHASE_DIGITALIZATION,
    INFORMATION_PROVISION_OF_SERVICES,
    CALENDAR,
    INTERNAL_CONTROL_MENU,
    PAYMENT_PLANS_MENU,
    GANTT,
    SUPPORT_DOCUMENT_MENU,
    SUPPORT_DOCUMENT,
    DOCUMENT_CORRECTION_CCXC,
    PRODUCT_VARIANTS_SYSTEM_ADMINISTRATION,
    EDIT_EMAIL_TEMPLATE_SUPPORTING_DOCUMENTS,
    NOTIFICATIONS_PARAMETERIZATION_SUPPORT_DOCUMENT,
    VIRTUAL_STORE_SALES_RECEIPTS,
    CALENDAR_PLANNING,
    QUOTES,
    MAIL_QUOTES,
    WEBSITE_EDITOR,
    WEBSITE_INVENTORY,
    WEBSITE_INVENTORY_MOVEMENTS,
    WEBSITE_DASHBOARD,
    WEBSITE_ANALYTICS,
    ELECTRONIC_DOCUMENTS,
    WEBSITE_VISIBILITY,
    SALES_REPORT_PRODUCT_WAREHOUSE,
    SHOPPING_REPORT_PRODUCT_WAREHOUSE,
    INSTRUCTIONS_PAYU,
    SYNCHRONIZE_PAYU,
    ACCOUNTING_REPORTS_MENU,
    ENDING_INVENTORY_ACCOUNTING_MONTH,
    WEBSITE_ACTIVE_DOMAIN,
    WEBSITE_SOCIAL,
    DAILY_ENDING_INVENTORY,
    FINAL_INVENTORY_CALCULATION,
    DATABASE_MENU,
    MODIFICATION_HISTORY,
    ENABLE_ELECTRONIC_BILLER,
    REPORT_ELECTRONIC_DOCUMENTS,
    GENERATE_DEBIT_NOTE,
    GENERATE_CREDIT_NOTE,
    GENERATE_ADJUSTMENT_NOTE,
    CONSULT_ELECTRONIC_DOCUMENT,
    CORRECTED_DOCUMENTS,
    ELECTRONIC_DOCUMENTS_GENERATED,
    HELP_CENTER,
    EASY_MANAGEMENT,
    DRAFT_DOCUMENTS,
    DRAFT_DOCUMENTS_NOTE,
    NUMBER_RANGE,
    DOCS_INSTRUCTIONS,
    DATABASE_EMPLOYEES,
    DATABASE_EMPLOYEES_FORM,
    DATABASE_EMPLOYEE_DETAIL,
    DATABASE_ORGANIZATION_CHART,
    DATA_COMPANY,
    SALES_REPORT,
    PREFIX_NOTE,
    SUPPLIER_DATABASE,
    GENERATE_PURCHASE_INVOICE,
    CUSTOMER_DATABASE,
    GENERATE_SUPPORT_DOCUMENT,
    DASHBOARD_ELECTRONIC_DOCUMENT,
    CREATE_SUPPLIER,
    GENERATE_SALES_INVOICE,
    GENERATE_CONTINGENCY_INVOICE,
    WAREHOUSES,
    GENERAL_DASHBOARD,
    PRODUCT_DATABASE,
    PAYMENT_PLAN,
    PLAN_METHOD_PAYMENT,
    DIGGI_PYMES_CUSTOMER,
    DIGGI_PYMES_CUSTOMER_DATABASE,
    DIGGI_PYMES_CUSTOMER_REPORTS,
    COMPANY_DATA_LANDING,
    PURCHASING_PROCESS,
    CONTINGENCY_ACTIVATION,
    CONTINGENCY_HISTORY,
    CRM,
    CRM_CONTACTS,
    CRM_SALES_MANAGEMENT,
    CRM_PROSPECTUS_STATUS,
    CRM_CONVERSION_CUSTOMER,
    CRM_CUSTOMER_EVOLUTION,
    CRM_SERVICES,
    CRM_PQRSF,
    CRM_SEND_EMAILS_CONTACT,
    CRM_ANALYTICAL_REPORTS,
    CRM_PREDEFINED_REPORTS,
    CRM_CUSTOM_REPORTS,
    PAYMENT_GATEWAY_SYNCHRONIZATION,
    ACCOUNTING_FINANCE,
    INVENTORY_MOVEMENTS,
    ACCOUNTING_REPORTS,
    QUOTES_REPORT,
    PURCHASE_INVOICE_NOTES,
}

export const PATHS: IPath = {
    [Routes.HOME]: {
        route: '/',
        component: GeneralDashboard,
        type: 'public',
        title: '',
    },
    [Routes.CHANGE_PASSWORD]: {
        route: '/change-password',
        component: ChangePassword,
        type: 'public',
        title: 'Nueva contraseña',
    },
    [Routes.USER_CATALOG_LIST]: {
        route: '/user-catalog-list',
        component: UserCatalogs,
        type: 'private',
        title: 'Administración de usuarios',
    },
    [Routes.PAYMENT_METHODS]: {
        route: '/payment-methods',
        component: PaymentMethods,
        type: 'public',
        title: 'Método de pago',
    },
    [Routes.ELECTRONIC_INVOICE]: {
        route: '/electronic-invoice',
        component: null,
        type: 'private',
        title: 'Facturación electrónica',
    },
    [Routes.USER_MANAGEMENT]: {
        route: '/user-catalog-list?user-management',
        component: UserManagement,
        type: 'private',
        title: 'Editar usuario',
    },
    [Routes.BIN]: {
        route: '/bin',
        component: Bin,
        type: 'private',
        title: '',
    },
    [Routes.WEBSITE_MENU]: {
        route: '#',
        component: null,
        type: 'private',
        title: 'Sitio web y tienda diggital',
    },
    [Routes.EASY_MANAGEMENT]: {
        route: '/help-center?name=definitions',
        component: HelpCenter,
        type: 'private',
        title: `Gestióne fácil y rápido ${PRODUCT_NAME}`,
    },
    [Routes.USER_ADMINISTRATOR]: {
        route: '/user-catalogs',
        component: UserCatalogs,
        type: 'private',
        title: 'Administrador de usuarios',
    },
    [Routes.NOTIFICATION_CENTER]: {
        route: '/notification-history',
        component: NotificationCenter,
        type: 'private',
        title: 'Histórico de notificaciones',
    },
    [Routes.PRODUCT_SHIPPING_COST]: {
        route: '/product-shipping-cost',
        component: ProductShippingCostInformation,
        type: 'private',
        title: 'Costo de envío de productos',
    },
    [Routes.EDIT_EMAIL_TEMPLATE]: {
        route: '/report-issued-documents?edit-email-template=true',
        type: 'private',
        component: EditEmailTemplate,
        title: 'Enviar correo',
    },

    [Routes.EDIT_EMAIL_TEMPLATE_DOCUMENT]: {
        route: '/edit-email-template',
        type: 'private',
        component: EditEmailTemplate,
        title: 'Documentos electrónicos',
    },

    [Routes.EDIT_EMAIL_TEMPLATE_SUPPORTING_DOCUMENTS]: {
        route: '/report-issued-supporting-documents?edit-email-template=true',
        type: 'private',
        component: EditEmailTemplate,
        title: 'Enviar correo',
    },
    [Routes.CORRECTION_DOCUMENTS_CLIENT_EMPLOYER]: {
        route: '/correction-documents-client-employer',
        type: 'private',
        component: CorrectionDocumentsClientEmployer,
        title: 'Corrección de documentos electrónicos ante el cliente por parte del empresario',
    },
    [Routes.INVOICE_SUMMARY]: {
        route: '/invoice-summary',
        type: 'public',
        component: InvoiceSummary,
        title: 'Resumen documento electrónico',
    },
    [Routes.REJECT_INVOICE]: {
        route: '/reject-invoice',
        type: 'public',
        component: InvoiceSummary,
        title: 'Rechazar documento electrónico',
    },
    [Routes.CORRECTION_BUSINESS_DOCUMENT]: {
        route: '/correction-business-document',
        type: 'private',
        component: CorrectionBusinessDocument,
        title: 'Corrección de documentos electrónicos de la DIAN por parte del empresario',
    },
    [Routes.DIGITIZATION_PHYSICAL_STORE_MENU]: {
        route: '/digitization-physical-store-menu',
        component: null,
        type: 'private',
        title: 'Vendedor diggital',
    },
    [Routes.PLANNING_AND_ORGANIZATION_MENU]: {
        route: '#',
        component: null,
        type: 'private',
        title: 'Planeación y organización',
    },
    [Routes.INFORMATION_PROVISION_OF_SERVICES]: {
        route: '/information-provision-services',
        component: InformationProvisionOfServices,
        type: 'private',
        title: 'Información de la prestación de servicios',
    },
    [Routes.CALENDAR]: {
        route: '/calendar',
        component: Calendar,
        type: 'private',
        title: 'Calendario',
    },
    [Routes.INTERNAL_CONTROL_MENU]: {
        route: '#',
        component: null,
        type: 'private',
        title: 'Control interno y legal',
    },
    [Routes.PAYMENT_PLANS_MENU]: {
        route: '/payments-plans',
        component: PaymentPlans,
        type: 'public',
        title: 'Planes de pago',
    },
    [Routes.GANTT]: {
        route: '/gantt',
        component: Gantt,
        type: 'private',
        title: 'Diagrama de Gantt',
    },
    [Routes.SUPPORT_DOCUMENT_MENU]: {
        route: '#',
        component: null,
        type: 'private',
        title: 'Documento soporte',
    },
    [Routes.SUPPORT_DOCUMENT]: {
        route: '/support-document',
        component: SupportDocument,
        type: 'private',
        title: 'Crear documento soporte',
    },
    [Routes.DOCUMENT_CORRECTION_CCXC]: {
        route: '/document-correction-ccxc',
        component: DocumentCorrectionCCXC,
        type: 'private',
        title: 'Corrección de documentos electrónicos por parte de CCxC',
    },
    [Routes.VIRTUAL_STORE_SALES_RECEIPTS]: {
        route: '/virtual-store-sales-receipts',
        type: 'private',
        component: VirtualStoreSalesReceipts,
        title: 'Listado de ventas de su tienda diggital',
    },
    [Routes.CALENDAR_PLANNING]: {
        route: '/calendar-planning',
        type: 'private',
        component: CalendarPlanning,
        title: 'Configuración citas y calendario',
    },
    [Routes.MAIL_QUOTES]: {
        route: '/mail-quotes',
        type: 'private',
        component: EditEmailTemplate,
        title: 'Enviar correo',
    },
    [Routes.WEBSITE_EDITOR]: {
        route: '/website-editor',
        type: 'private',
        component: WebsiteEditor,
        title: 'Cómo armar el sitio web',
    },
    [Routes.WEBSITE_INVENTORY]: {
        route: '/website-inventory',
        component: WebsiteInventory,
        type: 'private',
        title: 'Agregar inventario',
    },
    [Routes.WEBSITE_INVENTORY_MOVEMENTS]: {
        route: '/website-inventory-movements',
        component: InventoryMovements,
        type: 'private',
        title: 'Movimientos de inventario',
    },
    [Routes.WEBSITE_VISIBILITY]: {
        route: '/website-visibility',
        component: WebsiteVisibility,
        type: 'private',
        title: 'Cómo lograr que las personas encuentren su sitio web en Internet',
    },
    [Routes.WEBSITE_SOCIAL]: {
        route: '/website-social',
        component: WebsiteSocial,
        type: 'private',
        title: 'Cómo lograr que las personas encuentren su sitio web en Internet',
    },
    [Routes.WEBSITE_ANALYTICS]: {
        route: '/website-analytics',
        component: WebsiteAnalytics,
        type: 'private',
        title: 'Reporte de analítica del sitio web',
    },
    [Routes.ELECTRONIC_DOCUMENTS]: {
        route: '#',
        component: null,
        type: 'private',
        title: 'Documentos electrónicos',
    },
    [Routes.SALES_REPORT_PRODUCT_WAREHOUSE]: {
        route: '/sales-report-product-warehouse',
        component: SalesReportProductWarehouse,
        type: 'private',
        title: 'Ventas netas por tipo de producto y bodega',
    },
    [Routes.INSTRUCTIONS_PAYU]: {
        route: '/instructions-payu',
        component: InstructionsPayu,
        type: 'private',
        title: `Sincronización de PayU con ${PRODUCT_NAME}`,
    },
    [Routes.SYNCHRONIZE_PAYU]: {
        route: '/synchronize-payu',
        component: SynchronizePayu,
        type: 'private',
        title: `Sincronización de PayU con ${PRODUCT_NAME}`,
    },
    [Routes.ACCOUNTING_REPORTS_MENU]: {
        route: '/accounting-reports-menu',
        component: AccountingReports,
        type: 'private',
        title: 'Consulte los reportes contables ',
    },
    [Routes.SHOPPING_REPORT_PRODUCT_WAREHOUSE]: {
        route: '/shopping-report-product-warehouse',
        component: ShoppingReportProductWarehouse,
        type: 'private',
        title: 'Compras netas por tipo de producto y bodega',
    },
    [Routes.ENDING_INVENTORY_ACCOUNTING_MONTH]: {
        route: '/ending-inventory-accounting-month',
        component: EndingInventoryAccountingMonth,
        type: 'private',
        title: 'Inventario final al cierre del mes contable',
    },
    [Routes.WEBSITE_DASHBOARD]: {
        route: '/website-dashboard',
        component: WebsiteDashboard,
        type: 'private',
        title: 'Mi sitio web',
    },
    [Routes.WEBSITE_ACTIVE_DOMAIN]: {
        route: '/website-active-domain',
        component: WebsiteActiveDomain,
        type: 'private',
        title: 'Cómo escoger y activar el dominio',
    },
    [Routes.DAILY_ENDING_INVENTORY]: {
        route: '/daily-ending-inventory',
        component: DailyEndingInventory,
        type: 'private',
        title: 'Inventario final diario',
    },
    [Routes.FINAL_INVENTORY_CALCULATION]: {
        route: '/final-inventory-calculation',
        component: FinalInventoryCalculation,
        type: 'private',
        title: 'Cálculo total de inventario final',
    },
    [Routes.ENABLE_ELECTRONIC_BILLER]: {
        route: '/enable-electronic-biller',
        component: EnableElectronicBiller,
        type: 'private',
        title: 'Cómo habilitarse como facturador electrónico',
    },
    [Routes.REPORT_ELECTRONIC_DOCUMENTS]: {
        route: '/report-electronic-documents',
        component: ReportElectronicDocuments,
        type: 'private',
        title: 'Consulte los reportes contables',
    },
    [Routes.GENERATE_DEBIT_NOTE]: {
        route: '/correct-cancel-electronic-document/DEBIT_NOTE',
        component: CorrectCancelElectronicDocument,
        type: 'private',
        title: 'Generar nota débito',
    },
    [Routes.GENERATE_CREDIT_NOTE]: {
        route: '/correct-cancel-electronic-document/CREDIT_NOTE',
        component: CorrectCancelElectronicDocument,
        type: 'private',
        title: 'Generar nota crédito',
    },
    [Routes.GENERATE_ADJUSTMENT_NOTE]: {
        route: '/correct-cancel-electronic-document/ADJUSTMENT_NOTE',
        component: CorrectCancelElectronicDocument,
        type: 'private',
        title: 'Generar nota de ajuste',
    },
    [Routes.CONSULT_ELECTRONIC_DOCUMENT]: {
        route: '/consult-electronic-documents',
        component: ConsultElectronicDocument,
        type: 'private',
        title: 'Estado del documento',
    },
    [Routes.CORRECTED_DOCUMENTS]: {
        route: '/corrected-documents',
        component: CorrectedDocuments,
        type: 'private',
        title: 'Consulte los documentos electrónicos corregidos',
    },
    [Routes.ELECTRONIC_DOCUMENTS_GENERATED]: {
        route: '/electronic-documents-generated',
        component: ElectronicDocumentsGenerated,
        type: 'private',
        title: 'Consulte los documentos electrónicos generados',
    },
    [Routes.HELP_CENTER]: {
        route: '/help-center',
        component: HelpCenter,
        type: 'private',
        title: 'Centro de ayuda',
    },
    [Routes.DRAFT_DOCUMENTS]: {
        route: '/draf-documents/documents',
        component: DraftDocuments,
        type: 'private',
        title: 'Documentos electrónicos',
    },
    [Routes.DRAFT_DOCUMENTS_NOTE]: {
        route: '/draf-documents/notes',
        component: DraftDocuments,
        type: 'private',
        title: 'Documentos electrónicos',
    },
    [Routes.DATABASE_MENU]: {
        route: '/database-menu',
        component: DatabaseMenu,
        type: 'private',
        title: 'Ficha técnica',
    },
    [Routes.MODIFICATION_HISTORY]: {
        route: '/modification-history',
        component: ModificationHistory,
        type: 'private',
        title: 'Histórico de modificaciones',
    },
    [Routes.NUMBER_RANGE]: {
        route: '/number-range',
        component: NumberRange,
        type: 'private',
        title: 'Sincronización de rangos de numeración',
    },
    [Routes.DOCS_INSTRUCTIONS]: {
        route: '/docs-instructions',
        component: DocsInstructions,
        type: 'private',
        title: 'Selección del documento electrónico',
    },
    [Routes.DATABASE_EMPLOYEES]: {
        route: '/database-employees',
        component: DatabaseEmployees,
        type: 'private',
        title: 'Ficha técnica de empleados',
    },
    [Routes.DATABASE_EMPLOYEES_FORM]: {
        route: '/database-employees-form',
        component: DatabaseEmployeesForm,
        type: 'private',
        title: 'Agregar empleado',
    },
    [Routes.DATABASE_EMPLOYEE_DETAIL]: {
        route: '/database-employee-detail',
        component: DatabaseEmployeeDetail,
        type: 'private',
        title: 'Detalle del empleado',
    },
    [Routes.DATABASE_ORGANIZATION_CHART]: {
        route: '/database-organization-chart',
        component: DatabaseOrganizationChart,
        type: 'private',
        title: 'Organigrama',
    },
    [Routes.DATA_COMPANY]: {
        route: '/data-company',
        component: DataCompany,
        type: 'private',
        title: 'Datos de la empresa',
    },
    [Routes.SALES_REPORT]: {
        route: '/sales-report',
        component: SalesReport,
        type: 'private',
        title: 'Reporte de Ventas',
    },
    [Routes.PREFIX_NOTE]: {
        route: '/prefix-note',
        component: PrefixNote,
        type: 'private',
        title: 'Prefijos nota débito/crédito y nota de ajuste',
    },
    [Routes.SUPPLIER_DATABASE]: {
        route: '/supplier-database',
        component: SupplierDatabase,
        type: 'private',
        title: 'Ficha técnica de proveedores',
    },
    [Routes.GENERATE_PURCHASE_INVOICE]: {
        component: GeneratePurchaseInvoice,
        route: '/generate-purchase-invoice',
        title: 'Generar factura de compra',
        type: 'private',
    },
    [Routes.CUSTOMER_DATABASE]: {
        route: '/customer-database',
        component: CustomerDatabase,
        type: 'private',
        title: 'Ficha técnica de clientes',
    },
    [Routes.GENERATE_SUPPORT_DOCUMENT]: {
        component: GenerateSupportDocument,
        route: '/generate-support-document',
        title: 'Generar documento soporte',
        type: 'private',
    },
    [Routes.DASHBOARD_ELECTRONIC_DOCUMENT]: {
        route: '/dashboard-electronic-documents',
        component: DashboardElectronicDocuments,
        type: 'private',
        title: 'Documentos electrónicos',
    },
    [Routes.CREATE_SUPPLIER]: {
        component: GenerateSupportDocument,
        route: '/generate-support-document?view=SUPPLIER',
        title: 'Agregar proveedor',
        type: 'private',
    },
    [Routes.GENERATE_SALES_INVOICE]: {
        route: '/generate-sales-invoice',
        component: GenerateSalesInvoice,
        type: 'private',
        title: 'Generar factura electrónica de venta',
    },
    [Routes.GENERATE_CONTINGENCY_INVOICE]: {
        route: '/generate-contingency-invoice',
        component: GenerateSalesInvoice,
        type: 'private',
        title: 'Generar factura electrónica de contingencia',
    },
    [Routes.WAREHOUSES]: {
        route: '/warehouses',
        component: Warehouses,
        type: 'private',
        title: 'Ficha técnica de bodegas',
    },
    [Routes.PRODUCT_DATABASE]: {
        route: '/product-database',
        component: ProductDatabase,
        type: 'private',
        title: 'Ficha técnica de productos/servicios',
    },
    [Routes.PAYMENT_PLAN]: {
        route: '/payment-plan',
        component: PaymentPlan,
        type: 'private',
        title: 'Mi plan de compras',
    },
    [Routes.PLAN_METHOD_PAYMENT]: {
        route: '/plan-method-payment',
        component: PlanMethodPayment,
        type: 'private',
        title: 'Método de pago',
    },
    [Routes.DIGGI_PYMES_CUSTOMER]: {
        route: '/diggi-pymes-customer',
        type: 'private',
        component: CustomerCatalogs,
        title: `Clientes ${PRODUCT_NAME}`,
    },
    [Routes.DIGGI_PYMES_CUSTOMER_DATABASE]: {
        route: '/diggi-pymes-customer-database',
        type: 'private',
        component: CustomerCatalogs,
        title: `Base de datos clientes ${PRODUCT_NAME}`,
    },
    [Routes.DIGGI_PYMES_CUSTOMER_REPORTS]: {
        route: '/diggi-pymes-customer-database-reports',
        type: 'private',
        component: CustomerCatalogs,
        title: `Consulte los reportes sobre los clientes en ${PRODUCT_NAME}`,
    },
    [Routes.COMPANY_DATA_LANDING]: {
        route: '/company-data-landing',
        type: 'private',
        component: CompanyDataLanding,
        title: 'Información de cuenta creaada',
    },
    [Routes.PURCHASING_PROCESS]: {
        route: '/purchasing-process',
        type: 'private',
        component: PurchasingProcess,
        title: 'Proceso de compra',
    },
    [Routes.CONTINGENCY_ACTIVATION]: {
        route: '/contingency-activation',
        type: 'private',
        component: ContingencyActivation,
        title: `Activación de contingencia en ${PRODUCT_NAME}`,
    },
    [Routes.CONTINGENCY_HISTORY]: {
        component: ContingencyHistory,
        route: '/contingency-history',
        type: 'private',
        title: `Histórico activación de contingencia en ${PRODUCT_NAME}`,
    },
    [Routes.CRM]: {
        component: CrmDashboard,
        route: '/crm',
        type: 'private',
        title: 'CRM',
    },
    [Routes.CRM_CONTACTS]: {
        component: CrmContacts,
        route: '/crm-contacts',
        type: 'private',
        title: 'Contactos',
    },
    [Routes.CRM_SALES_MANAGEMENT]: {
        component: CrmContacts,
        route: '/crm/sales-management',
        type: 'private',
        title: 'Gestion de ventas',
    },
    [Routes.CRM_PROSPECTUS_STATUS]: {
        component: CrmProspectusStatus,
        route: '/crm-prospectus-management',
        type: 'private',
        title: 'Estado del prospecto',
    },
    [Routes.CRM_CONVERSION_CUSTOMER]: {
        component: CrmConversionCustomer,
        route: '/crm-conversion-customer',
        type: 'private',
        title: 'Conversión a cliente',
    },
    [Routes.CRM_CUSTOMER_EVOLUTION]: {
        component: CrmCustomerEvolution,
        route: '/crm-customer-evolution',
        type: 'private',
        title: 'Evolución de clientes',
    },
    [Routes.CRM_SERVICES]: {
        component: CrmPqrsf,
        route: '/crm-services',
        type: 'private',
        title: 'Servicios',
    },
    [Routes.CRM_PQRSF]: {
        component: CrmPqrsf,
        route: '/crm-pqrsf',
        type: 'private',
        title: 'PQRSF',
    },
    [Routes.CRM_SEND_EMAILS_CONTACT]: {
        component: CrmSendEmailsContact,
        route: '/crm/send-emails-contact',
        type: 'private',
        title: 'Envío de correos electrónicos a lista de contactos',
    },
    [Routes.CRM_ANALYTICAL_REPORTS]: {
        component: CrmSendEmailsContact,
        route: '/crm/send-emails-contact',
        type: 'private',
        title: 'Reportes analíticos',
    },
    [Routes.CRM_PREDEFINED_REPORTS]: {
        component: CrmPredefinedReports,
        route: '/crm/predefined-reports',
        type: 'private',
        title: 'Reportes preestablecidos',
    },
    [Routes.CRM_CUSTOM_REPORTS]: {
        component: CrmCustomReports,
        route: '/crm/custom-reports',
        type: 'private',
        title: 'Reportes personalizados',
    },
    [Routes.PAYMENT_GATEWAY_SYNCHRONIZATION]: {
        type: 'private',
        component: PaymentGatewaySynchronization,
        route: '/payment-gateway-synchronization',
        title: 'Sincronización de pasarelas de pago con diggi pymes',
    },
    [Routes.ACCOUNTING_FINANCE]: {
        component: null,
        route: '#',
        type: 'private',
        title: 'Contabilidad y finanzas',
    },
    [Routes.INVENTORY_MOVEMENTS]: {
        component: InventoryMovements,
        route: '/inventory-movements',
        type: 'private',
        title: 'Movimientos de inventario',
    },
    [Routes.ACCOUNTING_REPORTS]: {
        component: AccountingReports,
        route: '/accounting-reports',
        type: 'private',
        title: 'Consulte los reportes contables',
    },
    [Routes.QUOTES_REPORT]: {
        component: QuotesReport,
        route: '/quotes-report',
        type: 'private',
        title: 'Cotizaciones',
    },
    [Routes.PURCHASE_INVOICE_NOTES]: {
        component: PurchaseInvoiceNotes,
        route: '/purchase-invoice-notes',
        type: 'private',
        title: 'Registrar nota',
    },
};
