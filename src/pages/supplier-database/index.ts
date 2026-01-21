import { v4 as uuid } from 'uuid';
import { IBodyTable, IHeaderTable } from '@components/table';
import { Routes } from '@constants/Paths';
import { getRoute, getRouteName } from '@utils/Paths';
import { ITableFieldType } from '@constants/TableFieldType';
import { IGenericRecord } from '@models/GenericRecord';
import { LinkColor } from '@components/button';

export { default } from './SupplierDatabase';

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
        title: 'Nombre del proveedor',
        className: 'px-2 py-1 xs:p-1 xs:h-8.75',
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
export enum QueryParamSupplier {
    AddSupplier = 'add-supplier',
    SupplierDetail = 'supplier-detail',
    EditSupplier = 'edit-supplier',
}

/**
 * This component props
 */
export const componentProps = {
    propsTable: { headersTable: headersTable, tableBody: tableBody, dataTable: [] },
    pagesElements: {
        title: getRouteName(Routes.SUPPLIER_DATABASE),
        description: `En esta sección, gestione los proveedores agregados. Para ver el detalle de cada uno, haga clic en el nombre del proveedor. Para eliminar la 
        información del proveedor, seleccione el recuadro de la izquierda de la tabla y después haga clic en el icono`,
        titleTotalTable: 'Total proveedores',
        addButton: 'Agregar proveedor',
        queryParams: {
            addUser: QueryParamSupplier.AddSupplier,
            editUser: QueryParamSupplier.EditSupplier,
            detailUser: QueryParamSupplier.SupplierDetail,
        },
        pageRoute: getRoute(Routes.SUPPLIER_DATABASE),
    },
    nextRoute: getRoute(Routes.DATABASE_EMPLOYEES),
};

/**
 * Data default fiscal responsibilities
 */
export const DEFAULT_FISCAL_RESPONSIBILITIES = {
    id_fiscal: uuid(),
    id: '5',
    name: 'R-99-PN No aplica - Otros',
};

/**
 * Data default fiscal id taxpayer
 */
export const DEFAULT_ID_TAXPAYER = 'c8dfbea8-11ca-35bb-bea2-3dc15b66af64';
