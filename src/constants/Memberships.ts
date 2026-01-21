import { v4 as uuid } from 'uuid';
// NAMES' MEMBERSHIPS
export enum NamesMembership {
    MEMBERSHIP_ONE = 'Módulos',
    MEMBERSHIP_TWO = 'Membresía 2',
    MEMBERSHIP_THREE = 'Membresía 3',
}

// MODULES' MEMBERSHIPS
export const PHYSICAL_STORE_MODULE = 'Digitalización tienda física';
export const WEBSITE_MODULE = 'Servicios de sitio web y tienda virtual';
export const WAREHOUSE_ADMIN_MODULE = 'Administración de bodegas';
export const ELECTRONIC_INVOICE_MODULE = 'Facturación electrónica';
export const ELECTRONIC_DOCUMENTS = 'Documentos electrónicos';
export const DOCUMENT_SUPPORT =
    'Documentos Electrónicos: Facturación electrónica, Documento Soporte, Notas débito y crédito, Notas de ajuste';
export const INTERNAL_CONTROL_MODULE = 'Control Interno';
export const CRM_MODULE = 'CRM que incluye Proceso de compra y venta y Mercadeo';
export const ACCOUNTING_MODULE = 'Contabilidad';
export const ELECTRONIC_PAYROLL_MODULE = 'Nómina electrónica';
export const CALENDAR = 'Calendario';
export const COMPANY_PROFILE = 'Perfil de la empresa';
export const NOTIFICATIONS = 'Centro de notificaciones';
export const ANALYTICAL_REPORTS = 'Reportes analíticos';
export const ADDITIONAL_USERS = 'Usuarios adicionales';
export const MODULES = 'modules';
export const PLANS = 'plans';
export const PLANNING_ORGANIZATION = 'Planeación y organización';
export const WEBSITE_AND_VIRTUAL_STORE = 'Sitio web y tienda virtual';
export const SUPPORT_DOCUMENT =
    'Documentos Electrónicos: Facturación electrónica, Documento Soporte, Notas débito y crédito, Notas de ajuste';
export const PREMIUM_PLAN = 'Plan Premium';
export const USERS = 'users';
export const DELETE_BILLS_USERS = 'billsUsers';
export const DELETE_PAYMENT_MODULES = 'paymentModules';
export const STANDARD_PLAN = 'Plan Estándar';

// TYPES' MEMBERSHIPS
export const MEMBERSHIPS = [
    {
        id: 1,
        name: NamesMembership.MEMBERSHIP_ONE,
    },
];

export const USERS_VALUE = [
    {
        id: uuid(),
        membership_id: 1,
        value: 25000,
    },
    {
        id: uuid(),
        membership_id: 2,
        value: 30000,
    },
    {
        id: uuid(),
        membership_id: 3,
        value: 60000,
    },
];

export enum TypesModules {
    FREE = 'free',
    COMING = 'coming',
}

export enum TypesModulesText {
    FREE = 'Gratis',
    COMING = 'Próximamente',
    CLICK_HERE = 'Haga click aquí',
}

// MODULES ID' MEMBERSHIPS
export const ADDITIONAL_USERS_ID = 20;
export const DIGITALIZATION_PHYSICAL_STORE_ID = 1;
export const WEBSITE_VIRTUAL_STORE_SERVICES_ID = 2;
export const ELECTRONIC_BILLING_ID = 3;
export const WAREHOUSE_MANAGEMENT = 4;
export const DESIGN_MANAGEMENT_LANDING_PAGE_ID = 5;
export const ON_LINE_SHOP_ID = 6;
export const ADDITIONAL_PAGE_ID = 7;
export const BILL_PACK_ONE_ID = 1;
export const BILL_PACK_TWO_ID = 2;
export const BILL_PACK_THREE_ID = 3;
export const BILL_PACK_FOUR_ID = 4;
export const BASIC_PLAN_ID = 2.1;
export const PREMIUM_PLAN_ID = 2.2;
export const ADDITIONAL_PAGE_PLAN_ID = 2.3;
export const ZERO_DAYS = 0;
export const VALUE_ZERO = '0';

// Maximum number of additional pages
export const MAX_PAGES_BASIC_PLAN = 5;
export const MAX_PAGES_PREMIUM_PLAN = 4;

//membership percentage discount
export const DISCOUNT_PERCENTAGE = 30;

//membership prices
export const ADDITIONAL_PAGE_DISCOUNT_PRICE = 3550;
export const SINGLE_USER_PRICE = 25000;
export const ADDITIONAL_PAGE_PRICE = 177600;

// Contact whatsapp ccxc
export const CONTACT_WHATSAPP = 'https://wa.me/573174411845';

/**
 * Phone number contact lading page
 */
export const PHONE_CONTACT_LANDING = '317 441 1845';

/**
 * Email address contact landing
 */
export const EMAIL_CONTACT_LANDING = 'ventas@ccxc.co';

/**
 * This key modules
 */
export const KEY_MODULES: { [key: number]: string } = {
    1: 'Digitalización tienda física',
    2: 'Sitio web y tienda virtual',
    3: 'Facturación electrónica',
    4: 'Administración de bodegas',
};

/**
 * free modules with purchase
 */
export const FREE_MODULES = [
    INTERNAL_CONTROL_MODULE,
    PLANNING_ORGANIZATION,
    COMPANY_PROFILE,
    NOTIFICATIONS,
    ANALYTICAL_REPORTS,
    CALENDAR,
];
