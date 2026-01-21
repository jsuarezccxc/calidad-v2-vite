import { Routes } from '@constants/Paths';
import { PRODUCT_NAME } from '@constants/ProductName';
import { Help } from '@models/HelpCenter';
import { getRoute, getRouteName } from '@utils/Paths';

export * from './Header';
export { HelpCenterItem } from './HelpCenterItem';
export { DirectAccessItem } from './DirectAccessItem';

/**
 * Item of menu
 *
 * @typeParam id: number - Element's id
 * @typeParam text: string - Text to show on li element
 * @typeParam route: string - Route to navigate
 * @typeParam level: number - Indicates level on menu, this is used to apply someone classes
 * @typeParam idName: string - Optional prop for defining element's id
 * @typeParam parentNodeId: number | undefined - Indicates principal li on menu
 * @typeParam neverActive: boolean - Optional property tha indicates if the item should be active
 * @typeParam module: string - Optional property with the module name of the item
 * @typeParam comingSoon: boolean - Optional prop if item is coming soon
 * @typeParam comingSoon: boolean - Optional prop if item is in production
 * @typeParam className: string - Optional prop for customize the component
 * @typeParam classNameComming: string - Optional prop for customize the comming and production
 * @typeParam isDoubleText: boolean - Optional prop if item is double text
 * @typeParam isDoubleText: boolean - Optional prop get the name of the parent module
 * @typeParam onlyCCXC: boolean - Optional prop for pages for ccxc
 */
export interface IItem {
    id: number;
    text: string;
    route: string;
    level: number;
    idName: string;
    parentNodeId: number | undefined;
    items: IItem[];
    neverActive?: boolean;
    module?: string;
    comingSoon?: boolean;
    inProduction?: boolean;
    className?: string;
    classNameComming?: string;
    isDoubleText?: boolean;
    parentModule?: string;
    onlyCCXC?: boolean;
}

/**
 * This interface describes the properties of the search input
 *
 * @typeParam show: boolean - Boolean that show and hide the input search
 * @typeParam word: string - Word of the search
 * @typeParam results: IItem[] - List with the search results
 *
 */
export interface ISearch {
    show: boolean;
    word: string;
    results: IItem[];
}

/**
 * Header options
 */
export const OPTIONS = {
    HOME: 'Inicio',
    PROFILE: 'Perfil',
    SEARCH: 'Buscar',
    BIN: 'Papelera',
    SHORTCUTS: 'Acceso directo',
    NOTIFICATIONS: 'Notificaciones',
    SUPPORT: 'Servicio de atención al empresario',
    LOGOUT: 'Cerrar sesión',
    VIDEOS: `Banco de videos ${PRODUCT_NAME}`,
};

/**
 * Header options
 */
const ICON_PROFILE = {
    MODIFICATION_HISTORY: 'modificationHistory',
    MODIFICATION_HISTORY_HOVER: 'modificationHistoryWhite',
};

/**
 * Shortcuts options
 */
export const SHORTCUTS_OPTIONS = [
    {
        name: 'Agregar producto/servicio',
        path: getRoute(Routes.PRODUCT_DATABASE),
        module: getRouteName(Routes.DATABASE_MENU),
    },
    {
        name: 'Generar factura electrónica de venta',
        path: getRoute(Routes.GENERATE_SALES_INVOICE),
        module: getRouteName(Routes.ELECTRONIC_INVOICE),
    },
    {
        name: 'Generar factura de compra',
        path: getRoute(Routes.GENERATE_PURCHASE_INVOICE),
        module: getRouteName(Routes.ELECTRONIC_INVOICE),
    },
];

/**
 * Value current notification
 */
export const MORE_NOTIFICATIONS = '9+';

/**
 * Notifications options
 */
export const NOTIFICATIONS_OPTIONS = [
    {
        name: 'Referencia verificación',
        description: 'Tipo de verificación',
        date: 'dd/mm',
        path: '#',
    },
    {
        name: 'O/C #1',
        description: 'Comprobante de pago',
        date: 'dd/mm',
        path: '#',
    },
    {
        name: 'SKU 002',
        description: 'Nivel de inventario',
        date: 'dd/mm',
        path: '#',
    },
    {
        name: 'SKU 003',
        description: 'Nivel de inventario',
        date: 'dd/mm',
        path: '#',
    },
];

/**
 * Profile options
 */
export const PROFILE_OPTIONS = [
    {
        idName: 'dp-information',
        name: 'Mi plan de compras',
        path: getRoute(Routes.PAYMENT_PLAN),
        icon: ICON_PROFILE.MODIFICATION_HISTORY,
        hoverIcon: ICON_PROFILE.MODIFICATION_HISTORY_HOVER,
        isBorder: true,
    },
    {
        idName: 'dp-user-adm',
        name: 'Datos de la empresa',
        path: getRoute(Routes.DATA_COMPANY),
        icon: ICON_PROFILE.MODIFICATION_HISTORY,
        hoverIcon: ICON_PROFILE.MODIFICATION_HISTORY_HOVER,
        isBorder: false,
    },
    {
        idName: 'dp-user-adm',
        name: 'Administrador de usuarios',
        path: getRoute(Routes.USER_CATALOG_LIST),
        icon: 'userMenu',
        hoverIcon: 'userMenuWhite',
        isBorder: false,
    },
    {
        idName: 'dp-user-adm',
        name: 'Histórico de modificaciones',
        path: getRoute(Routes.MODIFICATION_HISTORY),
        icon: ICON_PROFILE.MODIFICATION_HISTORY,
        hoverIcon: ICON_PROFILE.MODIFICATION_HISTORY_HOVER,
        isBorder: true,
    },
    {
        idName: 'dp-logout',
        name: 'Cerrar sesión',
        path: '#',
        icon: 'signUpBlue',
        hoverIcon: 'signUpWhite',
        isBorder: true,
    },
];

/**
 * Profile options in UserAdmin panel in DiggiPymes
 */
export const PROFILE_ADMIN_USER_OPTIONS = [
    {
        idName: 'dp-logout',
        name: 'Cerrar sesión',
        path: '#',
        icon: 'signUpBlue',
        hoverIcon: 'signUpWhite',
        isBorder: true,
    },
];

/**
 * Initial search state
 */
export const SEARCH_INITIAL_STATE = {
    show: false,
    word: '',
    results: [],
};

/**
 * This is used to display the help center options
 */
export const HELP_CENTER_OPTIONS = [
    {
        name: 'Gestione fácil y rápido diggi pymes',
        queryParam: Help.Definitions,
    },
    {
        name: 'Contáctenos para soluciones eficientes',
        queryParam: Help.Contact,
    },
    {
        name: 'Reciba asesoría personalizada para su empresa.',
        queryParam: Help.Advisory,
    },
];

/** Limits from notifications */
export const NO_NOTIFICATIONS = 0;
export const MAX_NOTIFICATIONS = 9;
