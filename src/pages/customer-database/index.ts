import { IBodyTable, IHeaderTable } from '@components/table';
import { LinkColor } from '@components/button';
import { Routes } from '@constants/Paths';
import { ITableFieldType } from '@constants/TableFieldType';
import { getRoute, getRouteName } from '@utils/Paths';
import { IGenericRecord } from '@models/GenericRecord';

export { default } from './CustomerDatabase';

/**
 * Data header from supplier table
 */
export const headersTable: IHeaderTable[] = [
    {
        title: '',
        className: 'w-7.5',
    },
    {
        title: 'N°',
        className: 'px-2 py-1 xs:p-2 xs:h-8.75',
        wrapperClassName: 'supplier-database__table-column-first xs:h-8.75',
    },
    {
        title: 'Nombre del cliente o empresa',
        className: 'pl-2 pr-6.70 py-1 xs:p-1 xs:h-8.75',
        wrapperClassName: 'supplier-database__table-column-second xs:h-8.75',
    },
    {
        title: 'Tipo de documento',
        className: 'px-2 py-1 xs:p-1 xs:h-8.75',
        wrapperClassName: 'supplier-database__table-column-third xs:h-8.75',
    },
    {
        title: 'Número de documento',
        className: 'px-2 py-1 xs:p-1 xs:h-8.75',
        wrapperClassName: 'supplier-database__table-column-other xs:h-8.75',
    },
    {
        title: 'Nombre del representante legal',
        className: 'px-2 py-1 xs:p-1 xs:h-8.75',
        wrapperClassName: 'supplier-database__table-column__legal-name xs:h-8.75',
    },
    {
        title: 'Dirección',
        className: 'px-2 py-1 xs:p-1 xs:h-8.75',
        wrapperClassName: 'supplier-database__table-column-other xs:h-8.75',
    },
    {
        title: 'País',
        className: 'px-2 py-1 xs:p-1 xs:h-8.75',
        wrapperClassName: 'supplier-database__table-column-other xs:h-8.75',
    },
    {
        title: 'Departamento',
        className: 'px-2 py-1 xs:p-1 xs:h-8.75',
        wrapperClassName: 'supplier-database__table-column-other xs:h-8.75',
    },
    {
        title: 'Ciudad',
        className: 'px-2 py-1 xs:p-1 xs:h-8.75',
        wrapperClassName: 'supplier-database__table-column-other xs:h-8.75',
    },
    {
        title: 'Teléfono',
        className: 'px-2 py-1 xs:p-1 xs:h-8.75',
        wrapperClassName: 'supplier-database__table-column-other xs:h-8.75',
    },
    {
        title: 'Correo electrónico',
        className: 'px-2 py-1 xs:p-1 xs:h-8.75',
        wrapperClassName: 'supplier-database__table-column-other xs:h-8.75',
    },
];

/**
 * this function values supplier table
 */
export const tableBody = (onClick: (item: IGenericRecord) => void): IBodyTable[] => [
    {
        type: ITableFieldType.CHECKBOX,
        field: '',
        editableField: false,
        classNameTd: 'h-10 bg-checkbox',
    },
    {
        type: ITableFieldType.NUMBER,
        field: 'number',
        editableField: false,
        classNameTd: 'h-10 pl-3 border-b border-gray',
        className: 'text-gray',
    },
    {
        type: ITableFieldType.LINK,
        field: 'name',
        editableField: false,
        onClick,
        classNameTd: 'h-10 pl-4 border-b border-gray',
        color: LinkColor.PURPLE,
    },
    {
        type: ITableFieldType.TEXT,
        field: 'document_name',
        editableField: false,
        classNameTd: 'h-10 pl-3 border-b border-gray',
        className: 'text-gray',
    },
    {
        type: ITableFieldType.NUMBER,
        field: 'document_number',
        editableField: false,
        classNameTd: 'h-10 pl-3 border-b border-gray',
        className: 'text-gray',
    },
    {
        type: ITableFieldType.LINK,
        field: 'name_legal_representative',
        editableField: false,
        onClick,
        classNameTd: 'h-10 pl-3 border-b border-gray',
        color: LinkColor.PURPLE,
    },
    {
        type: ITableFieldType.TEXT,
        field: 'address',
        editableField: false,
        notApply: true,
        classNameTd: 'h-10 pl-3 border-b border-gray',
        className: 'text-gray',
    },
    {
        type: ITableFieldType.TEXT,
        field: 'country_name',
        editableField: false,
        notApply: true,
        classNameTd: 'h-10 pl-3 border-b border-gray',
        className: 'text-gray',
    },
    {
        type: ITableFieldType.TEXT,
        field: 'department_name',
        editableField: false,
        notApply: true,
        classNameTd: 'h-10 pl-3 border-b border-gray',
        className: 'text-gray',
    },
    {
        type: ITableFieldType.TEXT,
        field: 'city_name',
        editableField: false,
        notApply: true,
        classNameTd: 'h-10 pl-3 border-b border-gray',
        className: 'text-gray',
    },
    {
        type: ITableFieldType.NUMBER,
        field: 'phone',
        editableField: false,
        notApply: true,
        classNameTd: 'h-10 pl-3 border-b border-gray',
        className: 'text-gray',
    },
    {
        type: ITableFieldType.TEXT,
        field: 'email',
        editableField: false,
        notApply: true,
        classNameTd: 'h-10 pl-3 border-b border-gray',
        className: 'text-gray',
    },
];

/**
 * Query params
 */
export enum QueryParamCustomer {
    AddCustomer = 'add-customer',
    CustomerDetail = 'customer-detail',
    EditCustomer = 'edit-customer',
}

/**
 * Props component
 */
export const componentProps = {
    propsTable: { headersTable: headersTable, tableBody: tableBody, dataTable: [] },
    pagesElements: {
        title: getRouteName(Routes.CUSTOMER_DATABASE),
        description: `En esta sección, gestione los clientes agregados. Para ver el detalle de cada uno, haga clic en el nombre del cliente. Para eliminar la información
        del cliente, seleccione el recuadro de la izquierda de la tabla y después haga clic en el icono`,
        titleTotalTable: 'Total clientes',
        addButton: 'Agregar cliente',
        queryParams: {
            addUser: QueryParamCustomer.AddCustomer,
            editUser: QueryParamCustomer.EditCustomer,
            detailUser: QueryParamCustomer.CustomerDetail,
        },
        pageRoute: getRoute(Routes.CUSTOMER_DATABASE),
    },
    nextRoute: getRoute(Routes.SUPPLIER_DATABASE),
};

export const NA = 'N/A';
