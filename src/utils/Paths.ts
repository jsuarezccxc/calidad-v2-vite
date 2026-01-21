import { Section } from '@components/bread-crumb';
import { Routes, PATHS } from '@constants/Paths';

export const getRoute = (name: Routes): string => PATHS[name]?.route;

export const getRouteName = (name: Routes): string => PATHS[name]?.title;

// This constant contains the names of the routes which you will have access to by purchasing at least one plan.
export const ALWAYS_ACCESS_WITH_MODULE_NAME = [
    getRouteName(Routes.USER_CATALOG_LIST),
    getRouteName(Routes.PAYMENT_PLAN),
    getRouteName(Routes.MODIFICATION_HISTORY),
    getRouteName(Routes.EASY_MANAGEMENT),
    getRouteName(Routes.HELP_CENTER),
    getRouteName(Routes.DATABASE_MENU),
    getRouteName(Routes.DOCS_INSTRUCTIONS),
    'Contingencia diggi pymes',
    getRouteName(Routes.CONTINGENCY_HISTORY),
    getRouteName(Routes.CONTINGENCY_ACTIVATION),
    getRouteName(Routes.PURCHASING_PROCESS),
    getRouteName(Routes.PLAN_METHOD_PAYMENT),
    getRouteName(Routes.PAYMENT_PLANS_MENU),
];

// This constant contains the routes which you will have access to by purchasing at least one plan.
export const ALWAYS_ACCESS_WITH_MODULE_ROUTE = [
    getRoute(Routes.USER_CATALOG_LIST),
    getRoute(Routes.PAYMENT_PLAN),
    getRoute(Routes.MODIFICATION_HISTORY),
    getRoute(Routes.EASY_MANAGEMENT),
    getRoute(Routes.HELP_CENTER),
    getRoute(Routes.DOCS_INSTRUCTIONS),
    getRoute(Routes.CALENDAR_PLANNING),
    getRoute(Routes.CONTINGENCY_ACTIVATION),
    getRoute(Routes.CONTINGENCY_HISTORY),
    getRoute(Routes.WEBSITE_EDITOR),
    getRoute(Routes.PLAN_METHOD_PAYMENT),
    getRoute(Routes.PAYMENT_PLANS_MENU),
];

// This constant contains the routes names which you will have access always
export const ALWAYS_ACCESS_MODULES_NAME = [
    getRouteName(Routes.DATA_COMPANY),
    getRouteName(Routes.DATABASE_MENU),
    getRouteName(Routes.PRODUCT_DATABASE),
    getRouteName(Routes.WAREHOUSES),
    getRouteName(Routes.CUSTOMER_DATABASE),
    getRouteName(Routes.SUPPLIER_DATABASE),
    getRouteName(Routes.DATABASE_EMPLOYEES),
    getRouteName(Routes.DATABASE_EMPLOYEES_FORM),
    getRouteName(Routes.DATABASE_ORGANIZATION_CHART),
    getRouteName(Routes.HOME),
    getRouteName(Routes.BIN),
    getRouteName(Routes.NOTIFICATION_CENTER),
    getRouteName(Routes.CALENDAR_PLANNING),
    'Contingencia diggi pymes',
    getRouteName(Routes.CONTINGENCY_ACTIVATION),
    getRouteName(Routes.CONTINGENCY_HISTORY),
    getRouteName(Routes.PURCHASING_PROCESS),
    getRouteName(Routes.PLAN_METHOD_PAYMENT),
    getRouteName(Routes.PAYMENT_PLANS_MENU),
];

// This constant contains the routes which you will have access always
export const ALWAYS_ACCESS_MODULES_ROUTE = [
    getRoute(Routes.PAYMENT_PLAN),
    getRoute(Routes.DATA_COMPANY),
    getRoute(Routes.DATABASE_MENU),
    getRoute(Routes.PRODUCT_DATABASE),
    getRoute(Routes.WAREHOUSES),
    getRoute(Routes.CUSTOMER_DATABASE),
    getRoute(Routes.SUPPLIER_DATABASE),
    getRoute(Routes.DATABASE_EMPLOYEES),
    getRoute(Routes.DATABASE_EMPLOYEES_FORM),
    getRoute(Routes.DATABASE_ORGANIZATION_CHART),
    getRoute(Routes.HOME),
    getRoute(Routes.BIN),
    getRoute(Routes.NOTIFICATION_CENTER),
    'Contingencia diggi pymes',
    getRoute(Routes.CONTINGENCY_ACTIVATION),
    getRoute(Routes.CONTINGENCY_HISTORY),
    getRoute(Routes.PLAN_METHOD_PAYMENT),
    getRoute(Routes.PAYMENT_PLANS_MENU),
];

// This constant contains the  internal routes which you will have access id yo have module electronic documents
export const ACCESS_ELECTRONIC_DOCUMENTOS_INTERNAL_ROUTES = [
    getRoute(Routes.CORRECTION_BUSINESS_DOCUMENT),
    getRoute(Routes.DOCUMENT_CORRECTION_CCXC),
    getRoute(Routes.CONSULT_ELECTRONIC_DOCUMENT),
    getRoute(Routes.DOCS_INSTRUCTIONS),
    getRoute(Routes.GENERATE_SUPPORT_DOCUMENT),
    getRoute(Routes.GENERATE_DEBIT_NOTE),
    getRoute(Routes.GENERATE_CREDIT_NOTE),
    getRoute(Routes.GENERATE_ADJUSTMENT_NOTE),
    getRoute(Routes.ELECTRONIC_DOCUMENTS_GENERATED),
    getRoute(Routes.CORRECTED_DOCUMENTS),
    getRoute(Routes.GENERATE_CONTINGENCY_INVOICE),
    getRoute(Routes.CORRECTION_DOCUMENTS_CLIENT_EMPLOYER),
    getRoute(Routes.EDIT_EMAIL_TEMPLATE_DOCUMENT),
    getRoute(Routes.QUOTES_REPORT),
    getRoute(Routes.PURCHASE_INVOICE_NOTES),
];

// This constant contains the  internal routes to analytics resports website
export const ROUTES_ANALYTICS_REPORTS_WEBSITE = [
    getRoute(Routes.SALES_REPORT_PRODUCT_WAREHOUSE),
    getRoute(Routes.SHOPPING_REPORT_PRODUCT_WAREHOUSE),
    getRoute(Routes.DAILY_ENDING_INVENTORY),
    getRoute(Routes.ENDING_INVENTORY_ACCOUNTING_MONTH),
    getRoute(Routes.FINAL_INVENTORY_CALCULATION),
    getRoute(Routes.INSTRUCTIONS_PAYU),
    getRoute(Routes.SYNCHRONIZE_PAYU),
];

// This constant contains the name modules
export const nameModules: string[] = [
    getRouteName(Routes.HOME),
    getRouteName(Routes.WEBSITE_MENU),
    getRouteName(Routes.ELECTRONIC_INVOICE),
    getRouteName(Routes.HOME),
    getRouteName(Routes.HOME),
];

export const nameSubModules: string[] = [
    /* COMPANY PROFILE MODULE */
    getRouteName(Routes.HOME),
    getRouteName(Routes.HOME),
    /* WEBSITE DESIGN MODULE */
    getRouteName(Routes.HOME),
    /* WAREHOUSE ADMINISTRATION MODULE */
    getRouteName(Routes.HOME),
    getRouteName(Routes.HOME),
    getRouteName(Routes.HOME),
];

export const removeSlash = (name: string): string => name.slice(1);

export const getRoutes = (routes: number[]): Section[] => {
    return routes.map(routeIndex => ({ name: getRouteName(routeIndex), route: getRoute(routeIndex), routeIndex }));
};
