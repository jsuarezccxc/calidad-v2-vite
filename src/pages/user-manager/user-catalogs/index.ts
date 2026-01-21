import { getRouteName } from '@utils/Paths';
import { Routes } from '@constants/Paths';
import { Section } from '@components/bread-crumb';
import { IDownloadIconsProps } from '@components/icon';
import { downloadIconsProps } from '@utils/DownloadFile';
export { default } from './UserCatalogs';

/**
 * Routes from breadcrumb
 */
export const routes = (): Section[] => [
    {
        name: getRouteName(Routes.USER_CATALOG_LIST),
        route: '#',
    },
];

/**
 * Constant use for validate query param and render UserManagement component
 */
export const USER_MANAGEMENT = 'user-management';

/**
 * Constant use for validate query param and render UserDetail component
 */
export const USER_DETAIL = 'user-detail';

/**
 * This interface describes download icons xls and pdf
 * @typeParam downloadIcons: download: (icon: string) => void - Prop for download files
 */
interface IProps {
    downloadIcons: (download: (icon: string) => void, className?: string) => IDownloadIconsProps;
}

/**
 * Function that return download icons props
 * @returns IProps
 */
export const props = (): IProps => {
    return {
        downloadIcons: downloadIconsProps,
    };
};

/**
 * this constants
 */
export const CONSTANTS = {
    MANAGER_USER: 'manage-user',
    NAME_REPORT: 'Reporte listado de catalogo de usuarios',
    DESIGN_NOTIFICATION_ADMINISTRATION: 'Notificaciones Diseño',
    ADMINISTRATION_WAREHOUSE_NOTIFICATION: 'Notificaciones Bodegas',
    ADMINISTRATION_NOTIFICATION: 'Notificaciones',
    PRODUCT_SERVICE_MANAGEMENT: 'Gestión de productos/servicios',
    PHYSICAL_STORE_DIGITIZATION: 'Digitalización tienda física',
    ELECTRONIC_INVOICE: 'Facturación electrónica',
    ADMINISTRATION_INVOICE_NOTIFICATION: 'Notificaciones Facturación',
    ANALYTICAL_PURCHASE_AND_SALES_REPORTS: 'Reportes analíticos',
    DYNAMIC_ANALYSIS_OF_PRODUCT_AND_SERVICE: 'Análisis dinámico de productos/servicios',
    NUMBER_HISTORICAL_REPORT: 511,
    NUMBER_DYNAMIC_ANALYSIS: 512,
    LENGTH_ELECTRONIC_INVOICE: 11,
    ACCOUNTING: 'Contabilidad (Próximamente)',
    CRM: 'CRM (Próximamente)',
    ELECTRONIC_PAYROLL: 'Nómina electrónica (Próximamente)',
    WEBSITE_DESIGN_AND_ADMINISTRATION: 'Servicios de sitio web y tienda virtual',
    NUMBER_MODULES_WEBSITE: 7,
    ITEM_FIRST: 0,
    ALL_MODULES: 'Todos los módulos',
    ALL_REPORTS: 'Todos los reportes',
    NO_PERMISSIONS: 'No hay permisos que mostrar',
};

/**
 * title information
 */
export const CONSTANT_INFORMATION = {
    TITLE: 'Listado de catálogo de usuarios',
};

/**
 * this constants ignore sub menu module
 */
export const DATA_IGNORE = {
    USER_MANGER: 'Administrador de usuarios',
    VIRTUAL_STORE: 'Tienda virtual: productos/servicios',
    CHECKS: 'Verificaciones',
    ELECTRONIC_DOCUMENTS: 'Documentos electrónicos que requieren acción',
    HISTORICAL_REPORT: 'Reporte histórico de valor unitario (precio de venta) por producto',
    DYNAMIC_ANALYSIS: 'Análisis dinámico de productos/ servicios',
    OPTIMAL_PORTFOLIO: 'Portafolio óptimo de productos/ servicios',
    COMPLETED_SALES: 'Ventas finalizadas',
    QUANTITIES_AVAILABLE_WAREHOUSE: 'Cantidades disponibles por producto por bodega',
};

export const TRANSLATION_KEY = 'company-profile.user-catalog';

/**
 * Notification validation list
 */
export const VALIDATION_NOTIFICATION = [
    'Facturación: Notificaciones',
    'Documento: Notificaciones',
    'Contabilidad: Notificaciones',
];
