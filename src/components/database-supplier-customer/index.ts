import { Section } from '@components/bread-crumb';
import { IOptionSelect } from '@components/input';
import { IPaginatorBackend } from '@components/paginator-backend';
import { IBodyTable, IHeaderTable } from '@components/table';
import { IGenericRecord } from '@models/GenericRecord';
import { getRoute, getRouteName } from '@utils/Paths';
import { Routes } from '@constants/Paths';
import { ITableFieldType } from '@constants/TableFieldType';
import { IUserData } from './components';

export { default } from './DatabaseSupplierCustomer';

/**
 * Routes bread crumb pages
 *
 * @param textRoute: string - text route
 * @returns Section[]
 */
export const routes = (textRoute: string): Section[] => {
    return [
        {
            name: getRouteName(Routes.DATABASE_MENU),
            route: getRoute(Routes.DATABASE_MENU),
        },
        {
            name: textRoute,
            route: '#',
        },
    ];
};

/**
 * This interface describes the properties for user
 *
 * @typeParam propsTable: IPropsTable - Customer and supplier table properties
 * @typeParam dataUserEdit: IUserData - User data to edit
 * @typeParam pagesElements: IPageElements - Page elements
 * @typeParam saveUser: (data: IUserData | IGenericRecord) => void - Save user function
 * @typeParam showModalSave: boolean - Open modal save user
 * @typeParam setShowModalSave: React.Dispatch<React.SetStateAction<boolean>> - Function open modal save user
 * @typeParam setShowModalSave: string - Path next page
 */
export interface IDatabaseSupplierCustomerProps {
    propsTable: IPropsTable;
    dataUserEdit?: IUserData;
    pagesElements: IPageElements;
    saveUser: (data: IUserData | IGenericRecord) => void;
    showModalSave: boolean;
    setShowModalSave: React.Dispatch<React.SetStateAction<boolean>>;
    nextRoute: string;
}

/**
 * This interface describes the properties for table user
 *
 * @typeParam headersTable: IHeaderTable - User table header properties
 * @typeParam tableBody: (onClick: (item: IGenericRecord) => void) => IBodyTable[] - User table body properties
 * @typeParam dataTable: IDataTableSupplier[] | IGenericRecord[] - User table data
 * @typeParam paginatorBackendData: IPaginatorBackend<IGenericRecord> - User table paginator properties
 */
export interface IPropsTable {
    headersTable: IHeaderTable[];
    tableBody: (onClick: (item: IGenericRecord) => void) => IBodyTable[];
    dataTable: IDataTableSupplier[] | IGenericRecord[];
    paginatorBackendData: IPaginatorBackend<IGenericRecord>;
}

/**
 * This interface describes the properties for supplier customer
 *
 * @typeParam title: string - Page element title
 * @typeParam description: React.ReactElement | string; - Page element description
 * @typeParam addButton: string - Page element add button name
 * @typeParam titleTotalTable: string - Page element title table
 * @typeParam queryParams: string - Page element query param
 * @typeParam pageRoute: string - Page element route
 */
export interface IPageElements {
    title: string;
    description: React.ReactElement | string;
    addButton: string;
    titleTotalTable: string;
    queryParams: { addUser: string; editUser: string; detailUser: string };
    pageRoute: string;
}

/**
 * This interface describes the properties for table user
 *
 * @typeParam number: string - Number user
 * @typeParam name: string - Document name user
 * @typeParam document_name: string - Document type user
 * @typeParam document_type?: string - Optional document type user
 * @typeParam document_number: string - Document number user
 * @typeParam address: string - Address user
 * @typeParam country_name: string - Country name user
 * @typeParam department_name: string  => void - Department name user
 * @typeParam city_name: string - City name user
 * @typeParam phone: string - Phone user
 * @typeParam email: string - Email user
 * @typeParam id: string - Optional id user
 * @typeParam client_id: string - Optional client id
 * @typeParam tax_details_name: string -  Optional tax detail name
 * @typeParam type_taxpayer_name: string - Optional type taxpayer name
 * @typeParam fiscal_responsibilities: IFiscalResponsibilities[] - Optional fiscal responsibilities user
 * @typeParam postal_code: string - Optional postal code user
 * @typeParam supplier_id: string - Optional supplier id
 * @typeParam person_id: string - Optional person id
 * @typeParam tax_details_code: string - Optional tax details code
 * @typeParam name_legal_representative: string | null - Optional legal representative name
 */
export interface IDataTableSupplier {
    number: string;
    name: string;
    document_name: string;
    document_type?: string;
    document_number: string;
    address: string;
    country_name: string;
    department_name: string;
    city_name: string;
    phone: string;
    email: string;
    id?: string;
    client_id?: string;
    tax_details_name?: string;
    type_taxpayer_name?: string;
    fiscal_responsibilities?: IFiscalResponsibilities[];
    postal_code?: string;
    supplier_id?: string;
    person_id?: string;
    tax_details_code?: string;
    name_legal_representative?: string | null;
}

/**
 * This interface describes the properties fiscal responsibilities
 *
 * @typeParam id_fiscal: string - Fiscal id
 * @typeParam id: string - Id code
 * @typeParam name: string - Name fiscal responsibility
 */
export interface IFiscalResponsibilities {
    id_fiscal: string;
    id: string;
    name: string;
}

/**
 * user table options
 */
export const tableOptions = (isClient: boolean): IOptionSelect[] => [
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
    ...(isClient
        ? [
              {
                  key: '8',
                  value: 'Nombre del representante legal',
                  multiSelectCheck: {
                      value: true,
                  },
              },
          ]
        : []),
    {
        key: '2',
        value: 'Dirección',
        multiSelectCheck: {
            value: true,
        },
    },
    {
        key: '3',
        value: 'País',
        multiSelectCheck: {
            value: true,
        },
    },
    {
        key: '4',
        value: 'Departamento',
        multiSelectCheck: {
            value: true,
        },
    },
    {
        key: '5',
        value: 'Ciudad',
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
        value: 'Correo electrónico',
        multiSelectCheck: {
            value: true,
        },
    },
];

/**
 * This key select
 */
export const KEY_SELECT_COLUMN: { [key: string]: string } = {
    document_name: 'Tipo de documento',
    document_number: 'Número de documento',
    address: 'Dirección',
    country_name: 'País',
    department_name: 'Departamento',
    city_name: 'Ciudad',
    phone: 'Teléfono',
    email: 'Correo electrónico',
    name_legal_representative: 'Nombre del representante legal',
};

/**
 * This key select
 */
export const KEY_SELECT_SEARCH: { [key: string]: string } = {
    'Tipo de documento': 'document_name',
    'Número de documento': 'document_number',
    Dirección: 'address',
    País: 'country_name',
    Departamento: 'department_name',
    Ciudad: 'city_name',
    Teléfono: 'phone',
    'Correo electrónico': 'email',
};

/**
 * Query params
 */
export enum QueryParamSupplier {
    AddSupplier = 'add-supplier',
    SupplierDetail = 'supplier-detail',
    EditSupplier = 'edit-supplier',
}

/**
 * Request file customer
 */
export const RequestFile = {
    module: 'catalog-customer',
    moduleName: getRouteName(Routes.CUSTOMER_DATABASE),
    nameFile: 'Ficha técnica de clientes',
    searchedBy: null,
    quantity: true,
    quantityTitle: 'Total clientes',
};

/**
 * Request file supplier
 */
export const RequestFileSupplier = {
    module: 'supplier catalog report',
    moduleName: getRouteName(Routes.SUPPLIER_DATABASE),
    nameFile: 'Ficha técnica de proveedores',
    searchedBy: null,
    quantity: true,
    quantityTitle: 'Total proveedores',
};

/**
 * Function column selector initial data
 *
 * @param user: string - user
 * @returns string
 */
export const initialSelectColumn = (user: string): string => {
    if (user === SUPPLIER) return 'N°,Nombre del proveedor';
    return 'N°,Nombre del cliente o empresa';
};

/**
 * Data header from supplier table
 */
export const headersTableDelete = (user: string): IHeaderTable[] => [
    {
        title: `Nombre del ${user}`,
        className: 'px-2 py-1 xs:p-1 xs:h-8.75',
        wrapperClassName: 'supplier-database__table-delete-column-first xs:h-8.75',
    },

    {
        title: 'Documento electrónico',
        className: 'px-2 py-1 xs:p-1 xs:h-8.75',
        wrapperClassName: 'supplier-database__table-delete-column-second xs:h-8.75',
    },
];

/**
 * this function values supplier table
 */
export const tableBodyDelete: IBodyTable[] = [
    {
        type: ITableFieldType.TEXT,
        field: 'name',
        editableField: false,
        classNameTd: 'h-10 xs:h-8.75',
    },
    {
        type: ITableFieldType.TEXT,
        field: 'invoice',
        editableField: false,
    },
];

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
 * This constant type supplier
 */
export const SUPPLIER = 'proveedor';

/**
 * These constant type suppliers
 */
export const SUPPLIERS = 'proveedores';

/**
 * This constant type customer
 */
export const CUSTOMER = 'cliente';

/**
 * These constant type customers
 */
export const CUSTOMERS = 'clientes';

/**
 * This constant min select
 */
export const MIN_SELECT = 24;

/**
 * This constant min select customer
 */
export const MIN_SELECT_CUSTOMER = 32;

/**
 * This constant max select
 */
export const MAX_SELECT = 46;
export const MAX_SELECT_CUSTOMER = 56;

/**
 * This constant max select
 */
export const ID_ELECTRONIC_DOCUMENT = 3;

/**
 * This constant min length
 */
export const MIN_LENGTH = 1;

/**
 * This constant supplier route.
 */
export const SUPPLIER_ROUTE = '/supplier-database';
