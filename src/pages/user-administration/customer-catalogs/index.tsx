import { Routes } from '@constants/Paths';
import { ITableFieldType } from '@constants/TableFieldType';
import { IBodyTable, IHeaderTable, NA } from '@components/table';
import { LinkColor } from '@components/button';
import { Section } from '@components/bread-crumb';
import { IOptionSelect } from '@components/input';
import { getRoute, getRouteName } from '@utils/Paths';
import { IGenericRecord } from '@models/GenericRecord';

export { default } from './CustomerCatalogs';

/**
 * Routes from breadcrumb
 */
export const routes = (): Section[] => [
    {
        name: getRouteName(Routes.DIGGI_PYMES_CUSTOMER),
        route: getRoute(Routes.DIGGI_PYMES_CUSTOMER),
        routeIndex: Routes.DIGGI_PYMES_CUSTOMER,
    },
    {
        name: getRouteName(Routes.DIGGI_PYMES_CUSTOMER_DATABASE),
        route: getRoute(Routes.DIGGI_PYMES_CUSTOMER_DATABASE),
        routeIndex: Routes.DIGGI_PYMES_CUSTOMER_DATABASE,
    },
];

/**
 * This interface describes the properties for table user
 *
 * @typeParam number: string - Number user
 * @typeParam name: string - Customer name
 * @typeParam document_type: string - Document type user
 * @typeParam document_number: string - Document number user
 * @typeParam person_type: string - Person type user
 * @typeParam ciius: string - Economic activities (CIIUs) associated with the user
 * @typeParam email: string - Email user
 * @typeParam address: string - Address user
 * @typeParam phone: string - Phone user
 * @typeParam plan: string - Current plan of the user
 * @typeParam is_active: number - Indicates if the plan is active (1 for active, 0 for inactive)
 * @typeParam purchase_date_plan: string - Date when the plan was purchased
 * @typeParam plan_expiration_date: string - Date when the plan will expire
 * @typeParam domain: string - Domain associated with the user
 * @typeParam documents_processed: string - Number of documents processed
 * @typeParam last_login: string - Date of the last login of the user
 */
export interface IDataTableCustomer {
    number: string;
    name: string;
    document_type: string;
    document_number: string;
    person_type: string;
    ciius: string;
    email: string;
    address: string;
    phone: string;
    plan: string;
    is_active: number;
    purchase_date_plan: string;
    plan_expiration_date: string;
    domain: string;
    documents_processed: string;
    last_login: string;
}

/**
 * Data header from supplier table
 */
export const headersTable: IHeaderTable[] = [
    {
        title: 'N°',
        className: 'px-2 py-1 xs:p-2 xs:h-8.75',
        wrapperClassName: 'supplier-database__table-column-number xs:h-8.75',
    },
    {
        title: 'Nombre del cliente',
        className: 'px-2 py-1 xs:p-1 xs:h-8.75',
        wrapperClassName: 'supplier-database__table-column-name xs:h-8.75',
    },
    {
        title: 'Tipo de documento',
        className: 'px-2 py-1 xs:p-1 xs:h-8.75',
        wrapperClassName: 'supplier-database__table-column-documentType xs:h-8.75',
    },
    {
        title: 'Número de documento',
        className: 'px-2 py-1 xs:p-1 xs:h-8.75',
        wrapperClassName: 'supplier-database__table-column-documentNumber xs:h-8.75',
    },
    {
        title: 'Tipo de contribuyente',
        className: 'px-2 py-1 xs:p-1 xs:h-8.75',
        wrapperClassName: 'supplier-database__table-column-taxpayerType xs:h-8.75',
    },
    {
        title: 'CIIU - Actividad económica',
        className: 'px-2 py-1 xs:p-1 xs:h-8.75',
        wrapperClassName: 'supplier-database__table-column-ciiuActivity xs:h-8.75',
    },
    {
        title: 'Correo electrónico',
        className: 'px-2 py-1 xs:p-1 xs:h-8.75',
        wrapperClassName: 'supplier-database__table-column-email xs:h-8.75',
    },
    {
        title: 'Dirección',
        className: 'px-2 py-1 xs:p-1 xs:h-8.75',
        wrapperClassName: 'supplier-database__table-column-address xs:h-8.75',
    },
    {
        title: 'Teléfono',
        className: 'px-2 py-1 xs:p-1 xs:h-8.75',
        wrapperClassName: 'supplier-database__table-column-phone xs:h-8.75',
    },
    {
        title: 'Plan',
        className: 'px-2 py-1 xs:p-1 xs:h-8.75',
        wrapperClassName: 'supplier-database__table-column-plan xs:h-8.75',
    },
    {
        title: 'Estado del plan',
        className: 'px-2 py-1 xs:p-1 xs:h-8.75',
        wrapperClassName: 'supplier-database__table-column-planStatus xs:h-8.75',
    },
    {
        title: 'Fecha de compra del plan',
        className: 'px-2 py-1 xs:p-1 xs:h-8.75',
        wrapperClassName: 'supplier-database__table-column-planPurchaseDate xs:h-8.75',
    },
    {
        title: 'Fecha vencimiento del plan',
        className: 'px-2 py-1 xs:p-1 xs:h-8.75',
        wrapperClassName: 'supplier-database__table-column-planExpirationDate xs:h-8.75',
    },
    {
        title: 'URL sitio web',
        className: 'px-2 py-1 xs:p-1 xs:h-8.75',
        wrapperClassName: 'supplier-database__table-column-websiteUrl xs:h-8.75',
    },
    {
        title: 'Número de documentos transmitidos',
        className: 'px-2 py-1 xs:p-1 xs:h-8.75',
        wrapperClassName: 'supplier-database__table-column-numberElectronicDocuments xs:h-8.75',
    },
    {
        title: 'Última fecha de ingreso',
        className: 'px-2 py-1 xs:p-1 xs:h-8.75',
        wrapperClassName: 'supplier-database__table-column-lastAccess xs:h-8.75',
    },
];

/**
 * Table body configuration for admin view
 */
export const tableBody: IBodyTable[] = [
    {
        type: ITableFieldType.NUMBER,
        field: 'number',
        editableField: false,
        classNameTd: 'h-10 pl-3 border-b border-gray',
        className: 'text-gray',
    },
    {
        type: ITableFieldType.TEXT,
        field: 'name',
        editableField: false,
        classNameTd: 'h-10 pl-4 border-b border-gray',
        color: LinkColor.PURPLE,
    },
    {
        type: ITableFieldType.TEXT,
        field: 'document_type',
        editableField: false,
        classNameTd: 'h-10 pl-3 border-b border-gray',
        className: 'text-gray',
    },
    {
        type: ITableFieldType.TEXT,
        field: 'document_number',
        editableField: false,
        classNameTd: 'h-10 pl-3 border-b border-gray',
        className: 'text-gray',
    },
    {
        type: ITableFieldType.TEXT,
        field: 'person_type',
        editableField: false,
        classNameTd: 'h-10 pl-3 border-b border-gray',
        className: 'text-gray',
    },
    {
        type: ITableFieldType.TEXT,
        field: 'ciius',
        editableField: false,
        classNameTd: 'h-10 pl-3 border-b border-gray',
        className: 'text-gray',
    },
    {
        type: ITableFieldType.TEXT,
        field: 'email',
        editableField: false,
        classNameTd: 'h-10 pl-3 border-b border-gray',
        className: 'text-gray',
    },
    {
        type: ITableFieldType.TEXT,
        field: 'address',
        editableField: false,
        classNameTd: 'h-10 pl-3 border-b border-gray',
        className: 'text-gray',
    },
    {
        type: ITableFieldType.TEXT,
        field: 'phone',
        editableField: false,
        classNameTd: 'h-10 pl-3 border-b border-gray',
        className: 'text-gray',
    },
    {
        type: ITableFieldType.OBJECT,
        field: 'plan',
        editableField: false,
        classNameTd: 'h-10 pl-3 border-b border-gray',
        className: 'text-gray',
        classesMultipleModules: 'border-b border-solid border-gray w-full h-12 py-2',
    },
    {
        type: ITableFieldType.OBJECT,
        field: 'is_active',
        editableField: false,
        classNameTd: 'h-10 pl-3 border-b border-gray',
        className: 'text-gray',
        classesMultipleModules: 'border-b border-solid border-gray w-full h-12 py-2',
    },
    {
        type: ITableFieldType.OBJECT,
        field: 'purchase_date_plan',
        editableField: false,
        classNameTd: 'h-10 pl-3 border-b border-gray',
        className: 'text-gray',
        classesMultipleModules: 'border-b border-solid border-gray w-full h-12 py-2',
    },
    {
        type: ITableFieldType.OBJECT,
        field: 'plan_expiration_date',
        editableField: false,
        classNameTd: 'h-10 pl-3 border-b border-gray',
        className: 'text-gray',
        classesMultipleModules: 'border-b border-solid border-gray w-full h-12 py-2',
    },
    {
        type: ITableFieldType.LINK,
        color: LinkColor.PURPLE,
        field: 'domain',
        editableField: false,
        classNameTd: 'h-10 pl-3 border-b border-gray',
        className: 'text-gray',
        onClick: (item: IGenericRecord): void => {
            const domain = item?.domain?.trim() || NA;
            window.open(`https://${domain}`);
        },
    },
    {
        type: ITableFieldType.OBJECT,
        field: 'documents_processed',
        editableField: false,
        classNameTd: 'h-10 pl-3 border-b border-gray',
        className: 'text-gray',
        classesMultipleModules: 'border-b border-solid border-gray w-full h-12 py-2',
    },
    {
        type: ITableFieldType.TEXT,
        field: 'last_login',
        editableField: false,
        classNameTd: 'h-10 pl-3 border-b border-gray',
        className: 'text-gray',
    },
];

/**
 * Function column selector initial data
 *
 * @param user: string - user
 * @returns string
 */
export const initialSelectColumn = (): string => 'N°,Nombre del cliente';

/**
 * Constants for plan status SelectInput
 */
export const optionsPlanStatus = [
    { key: 'true', value: 'Activo' },
    { key: 'false', value: 'Inactivo' },
];

/**
 * Request file customer
 */
export const RequestFile = {
    module: 'diggipymes-client-report',
    moduleName: getRouteName(Routes.DIGGI_PYMES_CUSTOMER),
    nameFile: 'Clientes diggi pymes',
};

/**
 * user table options
 */
export const TABLE_OPTIONS: IOptionSelect[] = [
    {
        key: '0',
        value: 'Tipo de documento',
        multiSelectCheck: {
            value: true,
        },
    },
    {
        key: '1',
        value: 'Número de documento',
        multiSelectCheck: {
            value: true,
        },
    },
    {
        key: '2',
        value: 'Tipo de contribuyente',
        multiSelectCheck: {
            value: true,
        },
    },
    {
        key: '3',
        value: 'CIIU - Actividad económica',
        multiSelectCheck: {
            value: true,
        },
    },
    {
        key: '4',
        value: 'Correo electrónico',
        multiSelectCheck: {
            value: true,
        },
    },
    {
        key: '5',
        value: 'Dirección',
        multiSelectCheck: {
            value: true,
        },
    },
    {
        key: '6',
        value: 'Teléfono',
        multiSelectCheck: {
            value: true,
        },
    },
    {
        key: '7',
        value: 'Plan',
        multiSelectCheck: {
            value: true,
        },
    },
    {
        key: '8',
        value: 'Estado del plan',
        multiSelectCheck: {
            value: true,
        },
    },
    {
        key: '9',
        value: 'Fecha de compra del plan',
        multiSelectCheck: {
            value: true,
        },
    },
    {
        key: '10',
        value: 'Fecha vencimiento del plan',
        multiSelectCheck: {
            value: true,
        },
    },
    {
        key: '11',
        value: 'URL sitio web',
        multiSelectCheck: {
            value: true,
        },
    },
    {
        key: '12',
        value: 'Número de documentos transmitidos',
        multiSelectCheck: {
            value: true,
        },
    },
    {
        key: '13',
        value: 'Última fecha de ingreso',
        multiSelectCheck: {
            value: true,
        },
    },
];

/**
 * This key select for columns
 */
export const KEY_SELECT_COLUMN: { [key: string]: string } = {
    document_type: 'Tipo de documento',
    document_number: 'Número de documento',
    person_type: 'Tipo de contribuyente',
    ciius: 'CIIU - Actividad económica',
    email: 'Correo electrónico',
    address: 'Dirección',
    phone: 'Teléfono',
    plan: 'Plan',
    is_active: 'Estado del plan',
    purchase_date_plan: 'Fecha de compra del plan',
    plan_expiration_date: 'Fecha vencimiento del plan',
    domain: 'URL sitio web',
    documents_processed: 'Número de documentos transmitidos',
    last_login: 'Última fecha de ingreso',
};

/**
 * This key select for search
 */
export const KEY_SELECT_SEARCH: { [key: string]: string } = {
    'Tipo de documento': 'document_type',
    'Número de documento': 'document_number',
    'Tipo de contribuyente': 'person_type',
    'CIIU - Actividad económica': 'ciius',
    'Correo electrónico': 'email',
    Dirección: 'address',
    Teléfono: 'phone',
    Plan: 'plan',
    'Estado del plan': 'is_active',
    'Fecha de compra del plan': 'purchase_date_plan',
    'Fecha vencimiento del plan': 'plan_expiration_date',
    'URL sitio web': 'domain',
    'Número de documentos transmitidos': 'documents_processed',
    'Última fecha de ingreso': 'last_login',
};

/**
 * Constant type number
 */
export const NUMBER = 'number';

/**
 * Constant first column table
 */
export const FIRST_COLUMN = 'N°';

/**
 * This constant type value string
 */
export const TYPE_VALUE_STRING = 'string';

/**
 * This constant min length
 */
export const MIN_LENGTH = 1;

/**
 * This constant min select
 */
export const MIN_SELECT = 24;

/**
 * This constant max select
 */
export const MAX_SELECT = 46;

/**
 * Constants for numbers
 */
export const ONE = 1;
export const ZERO = 0;
