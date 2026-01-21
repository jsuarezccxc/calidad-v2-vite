import { MODULE_TITLES } from '@constants/ElectronicDocuments';
import { PATHS, Routes } from '@constants/Paths';
import { PRODUCT_NAME } from '@constants/ProductName';
import { getRoute, getRouteName } from '@utils/Paths';
export { OperationsTable } from './OperationsTable';

const { INVOICE, NOTE } = MODULE_TITLES;

/**
 * This describes the props of the tab
 *
 * @typeParam module: string - Tab module
 * @typeParam icon: string - Tab icon
 * @typeParam items: IItem[] - Tab items
 * @typeParam options: { name: string; icon: string; parentItem?: string; parentModule?: string }[] - Optional menu options
 * @typeParam route: string - Optional route to navigate
 * @typeParam parentItem: string - Optional parent
 * @typeParam parentModule: string - Optional parent module
 * @typeParam soon: boolean - Optional soon tab
 * @typeParam isLargeTexte: boolean - Optional flag for a big Tab
 */
interface ITab {
    module: string;
    icon: string;
    items: IItem[];
    options?: { name: string; icon: string; route: string; parentItem: string; parentModule?: string }[];
    route?: string;
    parentItem?: string;
    parentModule?: string;
    soon?: boolean;
    isLargeText?: boolean;
}

/**
 * This describes the props of the each item
 *
 * @typeParam routeIndex: number - Optional route index
 * @typeParam name: string - Optional item name
 * @typeParam options: { name: string; icon: string; parentItem?: string; parentModule?: string }[] - Optional menu options
 * @typeParam items: IItem[] - Optional subitems
 * @typeParam parent: string - Optional parent
 * @typeParam parentModule: string - Optional parent module
 * @typeParam parentItem: string - Optional parent search
 */
interface IItem {
    routeIndex?: number;
    name?: string;
    options?: { name: string; icon: string; route: string; parentItem: string; parentModule?: string }[];
    items?: IItem[];
    parent?: string;
    parentModule?: string;
    parentItem?: string;
}

/**
 * This describes the props of the active tab
 *
 * @typeParam module: string - Tab module
 * @typeParam parents: string[] - Parent item list
 * @typeParam item: string - Item name
 * @typeParam route: string - item route
 * @typeParam notShowOptions - Do not display options with the following clickable identifier
 */
export interface IActiveTab {
    module: string;
    parents: string[];
    item: string;
    route: string;
    notShowOptions: boolean;
}

/**
 * This describes the props of the select tab
 *
 * @typeParam key: string - Tab module
 * @typeParam value: string[] - Item value
 * @typeParam route: string - Item route
 * @typeParam showOption: string - Item showOption
 * @typeParam authorized: boolean - Authorized show page
 */
export interface ISelectTabParams {
    key: string;
    value: string;
    route: string;
    showOption: boolean;
    authorized: boolean;
}

/**
 * This describes the props of the options select tab
 *
 * @typeParam name: string - Tab module
 * @typeParam icon: string - Tab icon
 * @typeParam route: string - Tab route
 * @typeParam parentItem: string - Tab parent item
 * @typeParam parentModule: string - Tab parent module
 */
export interface IOptionParam {
    name: string;
    icon: string;
    route: string;
    parentItem: string;
    parentModule: string;
}

/**
 * This describes the props of the options
 *
 * @typeParam options: IOptionsParams[] - props for module options
 * @typeParam module: string - Prop for module
 */
export interface IOptionsProps {
    options: IOptionParam[];
    module: string;
}

/**
 * Sidebar items
 */
export const ITEMS = (firstTime: boolean): ITab[] => [
    {
        module: PATHS[Routes.PURCHASING_PROCESS].title,
        route: '',
        items: [
            {
                name: TAB_GET_PURCHASE_PLAN,
            },
            {
                name: PATHS[Routes.PLAN_METHOD_PAYMENT].title,
                parentItem: PATHS[Routes.PLAN_METHOD_PAYMENT].title,
                parentModule: PATHS[Routes.PLAN_METHOD_PAYMENT].title,
                routeIndex: Routes.PLAN_METHOD_PAYMENT,
            },
            {
                name: PATHS[Routes.PAYMENT_PLAN].title,
                parentItem: PATHS[Routes.PAYMENT_PLAN].title,
                parentModule: PATHS[Routes.PAYMENT_PLAN].title,
                routeIndex: Routes.PAYMENT_PLAN,
            },
        ],
        icon: '',
    },
    {
        module: PATHS[Routes.DATABASE_MENU].title,
        route: PATHS[Routes.DATABASE_MENU].route,
        items: [
            {
                name: 'Base de productos/servicios',
                routeIndex: Routes.PRODUCT_DATABASE,
                parentItem: PATHS[Routes.PRODUCT_DATABASE].title,
                parentModule: PATHS[Routes.PRODUCT_DATABASE].title,
            },
            {
                name: PATHS[Routes.DATABASE_MENU].title,
                routeIndex: Routes.WAREHOUSES,
                parentItem: PATHS[Routes.DATABASE_MENU].title,
                parentModule: PATHS[Routes.DATABASE_MENU].title,
                items: [],
            },
            {
                name: PATHS[Routes.CUSTOMER_DATABASE].title,
                parentItem: PATHS[Routes.DATABASE_MENU].title,
                routeIndex: Routes.CUSTOMER_DATABASE,
                parentModule: PATHS[Routes.DATABASE_MENU].title,
                items: [],
            },
            {
                name: PATHS[Routes.SUPPLIER_DATABASE].title,
                routeIndex: Routes.SUPPLIER_DATABASE,
                parentItem: PATHS[Routes.DATABASE_MENU].title,
                parentModule: PATHS[Routes.DATABASE_MENU].title,
                items: [],
            },
            {
                name: 'Ficha técnica empleados',
                parentItem: PATHS[Routes.DATABASE_MENU].title,
                parentModule: PATHS[Routes.DATABASE_MENU].title,
                items: [],
                options: [
                    {
                        name: PATHS[Routes.DATABASE_EMPLOYEES].title,
                        icon: 'database-employees',
                        route: firstTime ? PATHS[Routes.DATABASE_EMPLOYEES].route : PATHS[Routes.DATABASE_EMPLOYEES].route,
                        parentItem: PATHS[Routes.DATABASE_MENU].title,
                        parentModule: PATHS[Routes.DATABASE_MENU].title,
                    },
                    {
                        name: 'Organigrama de su empresa',
                        icon: 'organization-chart',
                        route: PATHS[Routes.DATABASE_ORGANIZATION_CHART].route,
                        parentItem: PATHS[Routes.DATABASE_MENU].title,
                        parentModule: PATHS[Routes.DATABASE_MENU].title,
                    },
                ],
            },
        ],
        icon: 'user',
    },
    {
        module: PATHS[Routes.WEBSITE_MENU].title,
        route: PATHS[Routes.WEBSITE_DASHBOARD].route,
        items: [
            {
                items: [],
                name: 'Cómo escoger y activar el dominio',
                routeIndex: Routes.WEBSITE_ACTIVE_DOMAIN,
                parentItem: PATHS[Routes.WEBSITE_MENU].title,
                parentModule: PATHS[Routes.WEBSITE_MENU].title,
            },
            {
                name: 'Cómo armar el sitio web',
                items: [],
                parentItem: PATHS[Routes.WEBSITE_MENU].title,
                parentModule: PATHS[Routes.WEBSITE_MENU].title,
                options: [
                    {
                        name: 'Mi sitio web',
                        icon: 'website',
                        route: PATHS[Routes.WEBSITE_EDITOR].route,
                        parentItem: 'Cómo armar el sitio web',
                        parentModule: PATHS[Routes.WEBSITE_MENU].title,
                    },
                    {
                        icon: 'pay-u',
                        parentItem: 'Cómo armar el sitio web',
                        parentModule: PATHS[Routes.WEBSITE_MENU].title,
                        route: getRoute(Routes.PAYMENT_GATEWAY_SYNCHRONIZATION),
                        name: getRouteName(Routes.PAYMENT_GATEWAY_SYNCHRONIZATION),
                    },
                ],
            },
            {
                name: 'Cómo promocionar y optimizar el sitio web',
                items: [],
                parentItem: PATHS[Routes.WEBSITE_MENU].title,
                parentModule: PATHS[Routes.WEBSITE_MENU].title,
                options: [
                    {
                        name: 'Haga visible su sitio web en internet',
                        icon: 'seo',
                        route: PATHS[Routes.WEBSITE_VISIBILITY].route,
                        parentItem: 'Cómo promocionar y optimizar el sitio web',
                        parentModule: PATHS[Routes.WEBSITE_MENU].title,
                    },
                    {
                        name: 'Agregue las redes sociales de su empresa en el sitio web',
                        icon: 'social-networks',
                        route: PATHS[Routes.WEBSITE_SOCIAL].route,
                        parentItem: 'Cómo promocionar y optimizar el sitio web',
                        parentModule: PATHS[Routes.WEBSITE_MENU].title,
                    },
                    {
                        name: 'Costo de envio de productos',
                        icon: 'delivery-shipping-cost-multicolor',
                        route: '/product-shipping-cost',
                        parentItem: 'Cómo promocionar y optimizar el sitio web',
                        parentModule: PATHS[Routes.WEBSITE_MENU].title,
                    },
                    {
                        name: 'Ubicación de la prestación de servicios',
                        icon: 'location-service-provision',
                        route: PATHS[Routes.INFORMATION_PROVISION_OF_SERVICES].route,
                        parentItem: 'Cómo promocionar y optimizar el sitio web',
                        parentModule: PATHS[Routes.WEBSITE_MENU].title,
                    },
                ],
            },
            {
                name: PATHS[Routes.WEBSITE_INVENTORY_MOVEMENTS].title,
                items: [],
                routeIndex: Routes.WEBSITE_INVENTORY_MOVEMENTS,
                parentItem: PATHS[Routes.WEBSITE_MENU].title,
                parentModule: PATHS[Routes.WEBSITE_MENU].title,
            },
            {
                name: PATHS[Routes.WEBSITE_INVENTORY].title,
                items: [],
                routeIndex: Routes.WEBSITE_INVENTORY,
                parentItem: PATHS[Routes.WEBSITE_MENU].title,
                parentModule: PATHS[Routes.WEBSITE_MENU].title,
            },
            {
                name: 'Consulte los reportes del sitio web',
                items: [],
                parentItem: PATHS[Routes.WEBSITE_MENU].title,
                parentModule: PATHS[Routes.WEBSITE_MENU].title,
                options: [
                    {
                        name: 'Reporte de analítica de su Sitio web',
                        icon: 'analytics',
                        route: PATHS[Routes.WEBSITE_ANALYTICS].route,
                        parentItem: 'Consulte los reportes',
                        parentModule: PATHS[Routes.WEBSITE_MENU].title,
                    },
                    {
                        name: 'Listado de ventas de su tienda virtual',
                        icon: 'sales',
                        route: PATHS[Routes.VIRTUAL_STORE_SALES_RECEIPTS].route,
                        parentItem: 'Consulte los reportes',
                        parentModule: PATHS[Routes.WEBSITE_MENU].title,
                    },
                    {
                        name: 'Reportes contables',
                        icon: 'accounting-reports',
                        route: PATHS[Routes.ACCOUNTING_REPORTS_MENU].route,
                        parentItem: 'Consulte los reportes',
                        parentModule: PATHS[Routes.WEBSITE_MENU].title,
                    },
                ],
            },
        ],
        icon: 'website-module',
    },
    {
        module: getRouteName(Routes.ELECTRONIC_DOCUMENTS),
        //This route is temporary
        route: PATHS[Routes.DASHBOARD_ELECTRONIC_DOCUMENT].route,
        options: [
            {
                name: `Gestióne fácil y rápido ${PRODUCT_NAME}`,
                icon: 'manage-easy',
                route: `${getRoute(Routes.HELP_CENTER)}?name=definitions`,
                parentItem: getRouteName(Routes.ELECTRONIC_DOCUMENTS),
                parentModule: getRouteName(Routes.ELECTRONIC_DOCUMENTS),
            },
        ],
        items: [
            {
                name: getRouteName(Routes.ENABLE_ELECTRONIC_BILLER),
                routeIndex: Routes.ENABLE_ELECTRONIC_BILLER,
                parentItem: getRouteName(Routes.ELECTRONIC_DOCUMENTS),
                parentModule: getRouteName(Routes.ELECTRONIC_DOCUMENTS),
            },
            {
                name: INVOICE,
                items: [],
                parentItem: getRouteName(Routes.ELECTRONIC_DOCUMENTS),
                parentModule: getRouteName(Routes.ELECTRONIC_DOCUMENTS),
                options: [
                    {
                        name: PATHS[Routes.NUMBER_RANGE].title,
                        icon: 'numbering-ranges',
                        route: PATHS[Routes.NUMBER_RANGE].route,
                        parentItem: INVOICE,
                        parentModule: getRouteName(Routes.ELECTRONIC_DOCUMENTS),
                    },
                    {
                        name: PATHS[Routes.GENERATE_SALES_INVOICE].title,
                        icon: 'electronic-document',
                        route: PATHS[Routes.GENERATE_SALES_INVOICE].route,
                        parentItem: INVOICE,
                        parentModule: getRouteName(Routes.ELECTRONIC_DOCUMENTS),
                    },
                    {
                        name: PATHS[Routes.GENERATE_PURCHASE_INVOICE].title,
                        icon: 'invoice',
                        route: PATHS[Routes.GENERATE_PURCHASE_INVOICE].route,
                        parentItem: INVOICE,
                        parentModule: getRouteName(Routes.ELECTRONIC_DOCUMENTS),
                    },
                    {
                        name: PATHS[Routes.GENERATE_SUPPORT_DOCUMENT].title,
                        icon: 'electronic-document',
                        route: PATHS[Routes.GENERATE_SUPPORT_DOCUMENT].route,
                        parentItem: INVOICE,
                        parentModule: getRouteName(Routes.ELECTRONIC_DOCUMENTS),
                    },
                    {
                        name: 'Borradores de documentos electrónicos',
                        icon: 'electronic-document-drafts',
                        route: getRoute(Routes.DRAFT_DOCUMENTS),
                        parentItem: INVOICE,
                        parentModule: getRouteName(Routes.ELECTRONIC_DOCUMENTS),
                    },
                    {
                        name: 'Cotizaciones',
                        icon: 'electronic-document-Quote',
                        route: getRoute(Routes.QUOTES_REPORT),
                        parentItem: INVOICE,
                        parentModule: getRouteName(Routes.ELECTRONIC_DOCUMENTS),
                    },
                ],
            },
            {
                name: getRouteName(Routes.ELECTRONIC_DOCUMENTS_GENERATED),
                routeIndex: Routes.ELECTRONIC_DOCUMENTS_GENERATED,
                parentItem: getRouteName(Routes.ELECTRONIC_DOCUMENTS),
                parentModule: getRouteName(Routes.ELECTRONIC_DOCUMENTS),
            },
            {
                name: NOTE,
                items: [],
                parentItem: getRouteName(Routes.ELECTRONIC_DOCUMENTS),
                parentModule: getRouteName(Routes.ELECTRONIC_DOCUMENTS),
                options: [
                    {
                        name: 'Prefijos nota débito/crédito y de ajuste',
                        icon: 'debit-credit-prefixes',
                        route: PATHS[Routes.PREFIX_NOTE].route,
                        parentItem: NOTE,
                        parentModule: getRouteName(Routes.ELECTRONIC_DOCUMENTS),
                    },
                    {
                        name: 'Generar nota débito',
                        icon: 'generate-debit-note',
                        route: PATHS[Routes.GENERATE_DEBIT_NOTE].route,
                        parentItem: NOTE,
                        parentModule: getRouteName(Routes.ELECTRONIC_DOCUMENTS),
                    },
                    {
                        name: 'Generar nota crédito',
                        icon: 'generate-credit-note',
                        route: PATHS[Routes.GENERATE_CREDIT_NOTE].route,
                        parentItem: NOTE,
                        parentModule: getRouteName(Routes.ELECTRONIC_DOCUMENTS),
                    },
                    {
                        name: 'Generar nota de ajuste',
                        icon: 'generate-adjust-note',
                        route: PATHS[Routes.GENERATE_ADJUSTMENT_NOTE].route,
                        parentItem: NOTE,
                        parentModule: getRouteName(Routes.ELECTRONIC_DOCUMENTS),
                    },
                    {
                        name: 'Borradores de corrección de documentos electrónicos',
                        icon: 'electronic-document-drafts',
                        route: getRoute(Routes.DRAFT_DOCUMENTS_NOTE),
                        parentItem: NOTE,
                        parentModule: getRouteName(Routes.ELECTRONIC_DOCUMENTS),
                    },
                ],
            },
            {
                name: getRouteName(Routes.CORRECTED_DOCUMENTS),
                routeIndex: Routes.CORRECTED_DOCUMENTS,
                parentItem: getRouteName(Routes.ELECTRONIC_DOCUMENTS),
                parentModule: getRouteName(Routes.ELECTRONIC_DOCUMENTS),
            },
            {
                name: 'Consulte los reportes contables',
                items: [],
                parentItem: getRouteName(Routes.ELECTRONIC_DOCUMENTS),
                parentModule: getRouteName(Routes.ELECTRONIC_DOCUMENTS),
                options: [
                    {
                        name: 'Reporte de movimiento de inventario por documentos electrónicos',
                        icon: 'accounting-report',
                        route: PATHS[Routes.REPORT_ELECTRONIC_DOCUMENTS].route,
                        parentItem: 'Consulte los reportes contables',
                        parentModule: getRouteName(Routes.ELECTRONIC_DOCUMENTS),
                    },
                    {
                        name: 'Reporte de ventas',
                        icon: 'analitycs-sell',
                        route: PATHS[Routes.SALES_REPORT].route,
                        parentItem: 'Consulte los reportes contables',
                        parentModule: getRouteName(Routes.ELECTRONIC_DOCUMENTS),
                    },
                ],
            },
        ],
        icon: 'electronic-documents',
    },
    {
        module: PATHS[Routes.PLANNING_AND_ORGANIZATION_MENU].title,
        route: PATHS[Routes.PLANNING_AND_ORGANIZATION_MENU].route,
        items: [
            {
                routeIndex: Routes.CALENDAR,
                parentItem: PATHS[Routes.HOME].title,
                parentModule: PATHS[Routes.HOME].title,
            },
            {
                routeIndex: Routes.GANTT,
                parentItem: PATHS[Routes.PLANNING_AND_ORGANIZATION_MENU].title,
                parentModule: PATHS[Routes.PLANNING_AND_ORGANIZATION_MENU].title,
            },
            {
                routeIndex: Routes.CALENDAR_PLANNING,
                parentItem: PATHS[Routes.PLANNING_AND_ORGANIZATION_MENU].title,
                parentModule: PATHS[Routes.PLANNING_AND_ORGANIZATION_MENU].title,
            },
        ],
        icon: 'planning',
    },
    {
        module: PATHS[Routes.ACCOUNTING_FINANCE].title,
        route: PATHS[Routes.ACCOUNTING_FINANCE].route,
        items: [
            {
                routeIndex: Routes.INVENTORY_MOVEMENTS,
                parentItem: PATHS[Routes.ACCOUNTING_FINANCE].title,
                parentModule: PATHS[Routes.ACCOUNTING_FINANCE].title,
                items: [],
            },
            {
                routeIndex: Routes.ACCOUNTING_REPORTS,
                parentItem: PATHS[Routes.ACCOUNTING_FINANCE].title,
                parentModule: PATHS[Routes.ACCOUNTING_FINANCE].title,
                items: [],
            },
        ],
        icon: 'accounting',
    },
    {
        module: PATHS[Routes.CRM].title,
        route: PATHS[Routes.CRM].route,
        items: [
            {
                items: [],
                name: PATHS[Routes.CRM_CONTACTS].title,
                routeIndex: Routes.CRM_CONTACTS,
                parentItem: PATHS[Routes.CRM].title,
                parentModule: PATHS[Routes.CRM].title,
            },
            {
                name: PATHS[Routes.CRM_SALES_MANAGEMENT].title,
                parentItem: PATHS[Routes.CRM].title,
                parentModule: PATHS[Routes.CRM].title,
                items: [],
                options: [
                    {
                        name: PATHS[Routes.CRM_PROSPECTUS_STATUS].title,
                        icon: 'crm-prospectus-status',
                        route: PATHS[Routes.CRM_PROSPECTUS_STATUS].route,
                        parentItem: PATHS[Routes.CRM_SALES_MANAGEMENT].title,
                        parentModule: PATHS[Routes.CRM].title,
                    },
                    {
                        name: PATHS[Routes.CRM_CONVERSION_CUSTOMER].title,
                        icon: 'crm-conversion-customer',
                        route: PATHS[Routes.CRM_CONVERSION_CUSTOMER].route,
                        parentItem: PATHS[Routes.CRM_SALES_MANAGEMENT].title,
                        parentModule: PATHS[Routes.CRM].title,
                    },
                    {
                        name: PATHS[Routes.CRM_CUSTOMER_EVOLUTION].title,
                        icon: 'crm-customer-evolution',
                        route: PATHS[Routes.CRM_CUSTOMER_EVOLUTION].route,
                        parentItem: PATHS[Routes.CRM_SALES_MANAGEMENT].title,
                        parentModule: PATHS[Routes.CRM].title,
                    },
                ],
            },
            {
                name: PATHS[Routes.CRM_SERVICES].title,
                parentModule: PATHS[Routes.CRM].title,
                parentItem: PATHS[Routes.CRM].title,
                items: [],
                options: [
                    {
                        name: PATHS[Routes.CRM_PQRSF].title,
                        icon: 'crm-pqrsf',
                        route: PATHS[Routes.CRM_PQRSF].route,
                        parentItem: PATHS[Routes.CRM_SERVICES].title,
                        parentModule: PATHS[Routes.CRM].title,
                    },
                    {
                        name: PATHS[Routes.CRM_SEND_EMAILS_CONTACT].title,
                        icon: 'crm-send-emails-contact',
                        route: PATHS[Routes.CRM_SEND_EMAILS_CONTACT].route,
                        parentItem: PATHS[Routes.CRM_SERVICES].title,
                        parentModule: PATHS[Routes.CRM].title,
                    },
                ],
            },
            {
                name: PATHS[Routes.CRM_ANALYTICAL_REPORTS].title,
                parentItem: PATHS[Routes.CRM].title,
                parentModule: PATHS[Routes.CRM].title,
                items: [],
                options: [
                    {
                        name: PATHS[Routes.CRM_PREDEFINED_REPORTS].title,
                        icon: 'crm-send-emails-contact',
                        route: PATHS[Routes.CRM_PREDEFINED_REPORTS].route,
                        parentItem: PATHS[Routes.CRM_ANALYTICAL_REPORTS].title,
                        parentModule: PATHS[Routes.CRM].title,
                    },
                    {
                        name: PATHS[Routes.CRM_CUSTOM_REPORTS].title,
                        icon: 'crm-pqrsf',
                        route: PATHS[Routes.CRM_CUSTOM_REPORTS].route,
                        parentItem: PATHS[Routes.CRM_ANALYTICAL_REPORTS].title,
                        parentModule: PATHS[Routes.CRM].title,
                    },
                ],
            },
        ],
        icon: 'crm',
    },
    {
        module: PATHS[Routes.DIGITIZATION_PHYSICAL_STORE_MENU].title,
        route: PATHS[Routes.DIGITIZATION_PHYSICAL_STORE_MENU].route,
        items: [],
        icon: 'physicalphy-store',
        soon: true,
    },
    {
        module: 'Administración de nómina',
        items: [],
        icon: 'roster',
        soon: true,
    },
    {
        module: PATHS[Routes.INTERNAL_CONTROL_MENU].title,
        route: PATHS[Routes.INTERNAL_CONTROL_MENU].route,
        items: [
            {
                routeIndex: Routes.GOVERNMENT_REGULATIONS,
                parentItem: PATHS[Routes.INTERNAL_CONTROL_MENU].title,
                parentModule: PATHS[Routes.INTERNAL_CONTROL_MENU].title,
            },
            {
                routeIndex: Routes.TAX_RULES,
                parentItem: PATHS[Routes.INTERNAL_CONTROL_MENU].title,
                parentModule: PATHS[Routes.INTERNAL_CONTROL_MENU].title,
            },
            {
                routeIndex: Routes.OCCUPATIONAL_HEALTH_SAFETY_STANDARDS,
                parentItem: PATHS[Routes.INTERNAL_CONTROL_MENU].title,
                parentModule: PATHS[Routes.INTERNAL_CONTROL_MENU].title,
            },
            {
                routeIndex: Routes.PROCESS_QUALITY,
                parentItem: PATHS[Routes.INTERNAL_CONTROL_MENU].title,
                parentModule: PATHS[Routes.INTERNAL_CONTROL_MENU].title,
            },
        ],
        icon: 'internal-control',
        soon: true,
    },
];

/**
 * Sidebar items to show in UserAdmin panel in DiggiPymes
 */
export const ITEMS_ADMIN = (): ITab[] => [
    {
        items: [],
        icon: 'user',
        module: PATHS[Routes.DIGGI_PYMES_CUSTOMER].title,
        route: PATHS[Routes.DIGGI_PYMES_CUSTOMER].route,
    },
    {
        items: [],
        soon: true,
        isLargeText: true,
        icon: 'customer-report',
        module: PATHS[Routes.DIGGI_PYMES_CUSTOMER_REPORTS].title,
        route: PATHS[Routes.DIGGI_PYMES_CUSTOMER_REPORTS].route,
    },
    {
        icon: 'documents',
        module: MODULE_TITLES.CONTINGENCY,
        items: [
            {
                name: getRouteName(Routes.CONTINGENCY_ACTIVATION),
                routeIndex: Routes.CONTINGENCY_ACTIVATION,
                parentItem: MODULE_TITLES.CONTINGENCY,
                parentModule: MODULE_TITLES.CONTINGENCY,
            },
            {
                name: getRouteName(Routes.CONTINGENCY_HISTORY),
                routeIndex: Routes.CONTINGENCY_HISTORY,
                parentItem: MODULE_TITLES.CONTINGENCY,
                parentModule: MODULE_TITLES.CONTINGENCY,
            },
        ],
    },
];

/**
 * This flattens all the items
 *
 * @param items: IItem[] - Sidebar items
 * @returns IItem[]
 */
export const separateItems = (items: IItem[] = []): IItem[] => {
    let allItems: IItem[] = [];
    for (const item of items) {
        allItems = allItems
            .concat([item])
            .concat(
                separateItems(
                    (item.items?.length ? item?.items : item?.options)?.map(subItem => ({ ...subItem, parent: item.name }))
                )
            );
    }
    return allItems;
};

/**
 * This returns the modules with the items at the same level
 *
 * @param items: IItem[] - Sidebar items
 * @returns IItem[]
 */
export const getModulesWithItems = (data: ITab[]): ITab[] =>
    data.map(({ items, ...item }) => ({
        ...item,
        items: separateItems(items),
    }));

/**
 * This returns the indexes according to the pathname
 *
 * @param pathname: string - Current pathname
 * @returns number
 */
export const getRouteIndex = (pathname: string): number => {
    const [routeIndex] = Object.entries(PATHS).find(([, item]) => item.route === pathname) ?? [];
    return Number(routeIndex);
};

/**
 * Constant current year
 */
export const CURRENT_YEAR = new Date().getFullYear().toString();

/**
 * Constant route consultancy
 */
export const ROUTE_CONSULTANCY = getRoute(Routes.HOME);

/**
 * Default active tab
 */
export const ACTIVE_TAB = { module: '', parents: [], item: '', route: '', notShowOptions: false };

/**
 * Tab website
 */
export const TAB_WEBSITE = 'Sitio web y tienda diggital';

/**
 * Id tab modal element
 */
export const idModalTabElement = 'sidebar-options--modal';

/**
 * Tab electronic documents
 */
export const TAB_ELECTRONIC_DOCUMENTS = 'Documentos electrónicos';

/**
 * Tab technical data
 */
export const TAB_TECHNICAL_DATA = 'Ficha técnica';

/**
 * Tab CRM
 */
export const TAB_CRM = 'CRM';

/**
 * Const for tab purchasing process
 */
export const TAB_PURCHASING_PROCESS = 'Proceso de compra';

/**
 * Const for tab get purchase plan
 */
export const TAB_GET_PURCHASE_PLAN = 'Adquirir plan de compras';

/**
 * Constant item type
 */
export const ITEM = 'item';

/**
 * Constant module type
 */
export const MODULE = 'module';

/**
 * Constant parent type
 */
export const PARENT = 'parent';

/**
 * Constant that it contains the options for the basic and standard plans
 */
export const OPTIONS_BASIC_PLAN = [
    'Mi sitio web',
    'Haga visible su sitio web en internet',
    'Agregue las redes sociales de su empresa en el sitio web',
    'Reporte de analítica de su Sitio web',
    'Reportes contables',
];

/**
 * Constant that it contains the options for to push the class
 */
export const OPTIONS_HEIGHT_BURBLE = {
    WEB_SITE: 'Mi sitio web',
    PAYU: `Sincronización de PayU con ${PRODUCT_NAME}`,
    RED_SOCIAL: 'Agregue las redes sociales de su empresa en el sitio web',
    REPORTS: 'Reportes contables',
};

/**
 * Constant that it contains options for class
 */
export const CLASS_OPTION_MAP: Record<string, string> = {
    [OPTIONS_HEIGHT_BURBLE.WEB_SITE]: 'h-web-site',
    [OPTIONS_HEIGHT_BURBLE.PAYU]: 'h-payu',
    [OPTIONS_HEIGHT_BURBLE.RED_SOCIAL]: 'h-red-social',
    [OPTIONS_HEIGHT_BURBLE.REPORTS]: 'h-reports',
};

/**
 * Constant mobile size
 */
export const MOBILE_SCREEN = 767;

/**
 * Constant to handle sidebar menu in preview page of website editor
 */
export const PREVIEW = 'preview';

/**
 * Constant to value zero
 */
export const ZERO = 0;

/**
 * Constant CRM
 */
export const CRM = 'crm';

/**
 * Constant route default
 */
export const ROUTE_DEFAULT = '#';
