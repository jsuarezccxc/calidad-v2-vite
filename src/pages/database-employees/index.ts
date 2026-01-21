import { Section } from '@components/bread-crumb';
import { IOptionSelect, IPropsInput } from '@components/input';
import { IBodyTable, IHeaderTable, ITableProps } from '@components/table';
import { IGenericRecord } from '@models/GenericRecord';
import { ITableFieldType } from '@constants/TableFieldType';
import { Routes } from '@constants/Paths';
import { getRoute, getRouteName } from '@utils/Paths';
import { generateId, ModuleApp, ActionElementType, ElementType } from '@utils/GenerateId';
import { DATABASE_EMPLOYEE } from '@information-texts/DatabaseEmployees';

export { default } from './DatabaseEmployees';

/**
 * Function that returns the routes for the breadcrumb
 * @returns Section[]
 */
export const routes = (): Section[] => [
    {
        name: DATABASE_EMPLOYEE.TITLE,
        route: getRoute(Routes.DATABASE_MENU),
    },
    {
        name: getRouteName(Routes.DATABASE_EMPLOYEES),
        route: getRoute(Routes.DATABASE_EMPLOYEES),
    },
];

const generateOptions = (data: IGenericRecord[]): IOptionSelect[] =>
    data.map(element => ({
        key: element.id,
        value: element.name,
    }));

/**
 * Function that return the input props
 *
 * @param options: IOptionSelect[] - Options columns to show
 * @param columns: string - Columns value
 * @param optionStatus: IOptionSelect[] - Select options
 * @param handleChangeSelect: (option: IOptionSelect, name: string) => void - Function that change option select
 * @param searchValue: string - Search value
 * @param handleSearch: (e: React.ChangeEvent<HTMLInputElement>) => void - Function that filter the data based on the search value
 * @returns IPropsInput[]
 */
export const inputsProps = (
    options: IOptionSelect[],
    columns: string,
    optionStatus: string,
    handleChangeSelect: (option: IOptionSelect, name: string) => void,
    searchValue: string,
    handleSearch: (e: React.ChangeEvent<HTMLInputElement>) => void
): IPropsInput[] => [
    {
        id: generateId({
            module: ModuleApp.TECHNICAL_SHEET_EMPLOYEES,
            submodule: 'filter-columns',
            action: ActionElementType.INPUT,
            elementType: ElementType.DRP,
        }),
        name: 'filter',
        labelText: 'Seleccione las columnas que desea ver en la tabla:',
        isNewSelect: true,
        classListSelect: true,
        value: columns,
        optionSelected: (option: IOptionSelect): void => handleChangeSelect(option, CurrentField.COLUMNS),
        options,
        placeholder: 'Seleccionar',
        classesWrapper: 'filter-columns',
        selectTextClass: 'flex items-center h-7',
    },
    {
        id: generateId({
            module: ModuleApp.TECHNICAL_SHEET_EMPLOYEES,
            submodule: 'filter-status',
            action: ActionElementType.INPUT,
            elementType: ElementType.DRP,
        }),
        name: 'filter_status',
        labelText: 'Estado:',
        value: optionStatus,
        optionSelected: (option: IOptionSelect): void => handleChangeSelect(option, CurrentField.STATUS),
        options: [{ key: '', value: 'Seleccionar' }, ...generateOptions(optionsState)],
        placeholder: 'Seleccionar',
        classesWrapper: 'filter-columns',
    },
    {
        id: generateId({
            module: ModuleApp.TECHNICAL_SHEET_EMPLOYEES,
            submodule: 'search',
            action: ActionElementType.INPUT,
            elementType: ElementType.TXT,
        }),
        name: 'search',
        labelText: 'Buscar:',
        placeholder: 'Nombre del empleado y tipo de documento',
        value: searchValue,
        onChange: handleSearch,
        classesWrapper: 'w-45 h-full xs:w-full flex justify-end',
    },
];

/**
 * Fields body of the table
 */
export const fieldsBody = (handleRedirect: (item: IGenericRecord) => void): IBodyTable[] => [
    {
        type: ITableFieldType.NUMBER,
        field: 'consecutive',
        wrapperClassName: 'h-10 xs:h-8.2',
        editableField: false,
    },
    {
        type: ITableFieldType.LINK,
        field: 'name',
        wrapperClassName: 'h-10 xs:h-8.2',
        editableField: false,
        onClick: handleRedirect,
    },
    {
        type: ITableFieldType.TEXT,
        field: 'document_type',
        wrapperClassName: 'h-10 xs:h-8.2',
        editableField: false,
    },
    {
        type: ITableFieldType.TEXT,
        field: 'document_number',
        wrapperClassName: 'h-10 xs:h-8.2',
        editableField: false,
    },
    {
        type: ITableFieldType.TEXT,
        field: 'area',
        wrapperClassName: 'h-10 xs:h-8.2',
        editableField: false,
    },
    {
        type: ITableFieldType.TEXT,
        field: 'position',
        wrapperClassName: 'h-10 xs:h-8.2',
        editableField: false,
    },
    {
        type: ITableFieldType.VALUE,
        field: 'salary',
        wrapperClassName: 'h-10 xs:h-8.2',
        editableField: false,
    },
    {
        type: ITableFieldType.DATE,
        field: 'initial_date',
        wrapperClassName: 'h-10 xs:h-8.2',
        editableField: false,
    },
    {
        type: ITableFieldType.TEXT,
        field: 'contract_type',
        wrapperClassName: 'h-10 xs:h-8.2',
        editableField: false,
    },
    {
        type: ITableFieldType.TEXT,
        field: 'status',
        wrapperClassName: 'h-10 xs:h-8.2',
        editableField: false,
    },
];

/**
 * Function that return the formatted data table
 *
 * @param data: IGenericRecord[] - Table data
 * @returns IGenericRecord[]
 */
const getDataTable = (data: IGenericRecord[]): IGenericRecord[] =>
    data?.map((employee, index) => ({
        ...employee,
        consecutive: index + 1,
        status: CurrentStatus[employee.status as keyof typeof CurrentStatus],
    }));

/**
 * Function that return the table props
 *
 * @param data: IGenericRecord[] - Table data
 * @param fieldsBody: IBodyTable[] - Body data to render in table
 * @returns ITableProps - Return props from table
 */
export const tableProps = (data: IGenericRecord[], fieldsBody: IBodyTable[]): ITableProps => {
    return {
        id: generateId({
            module: ModuleApp.TECHNICAL_SHEET_EMPLOYEES,
            action: ActionElementType.INFO,
            elementType: ElementType.TBL,
        }),
        fieldsBody,
        data: getDataTable(data),
        isNew: true,
        className: 'xs:mt-3 w-max',
    };
};

/**
 * Function that return the header of the table
 *
 * @returns IHeaderTable[]
 */
export const headersTable = (): IHeaderTable[] => [
    {
        title: 'Nº',
        wrapperClassName: 'w-header__1',
    },
    {
        title: 'Nombre de empleado',
        wrapperClassName: 'w-38.4',
    },
    {
        title: 'Tipo de documento',
        wrapperClassName: 'w-22',
    },
    {
        title: 'Número de documento',
        wrapperClassName: 'w-22.6',
    },
    {
        title: 'Área',
        wrapperClassName: 'w-22.6',
    },
    {
        title: 'Cargo',
        wrapperClassName: 'w-22',
    },
    {
        title: 'Salario',
        wrapperClassName: 'w-26.3',
    },
    {
        title: 'Fecha de ingreso',
        wrapperClassName: 'w-28',
    },
    {
        title: 'Tipo de contrato',
        wrapperClassName: 'w-28',
    },
    {
        title: 'Estado',
        wrapperClassName: 'w-20.4',
    },
];

/**
 * Data from options to show columns in table
 */
export const listColumns = [
    {
        id: 1,
        name: 'Nº',
    },
    {
        id: 2,
        name: 'Nombre de empleado',
    },
    {
        id: 3,
        name: 'Tipo de documento',
    },
    {
        id: 4,
        name: 'Número de documento',
    },
    {
        id: 5,
        name: 'Área',
    },
    {
        id: 6,
        name: 'Cargo',
    },
    {
        id: 7,
        name: 'Salario',
    },
    {
        id: 8,
        name: 'Fecha de ingreso',
    },
    {
        id: 9,
        name: 'Tipo de contrato',
    },
    {
        id: 10,
        name: 'Estado',
    },
];

/**
 * Data options to filter by state employee
 */
export const optionsState = [
    {
        id: 1,
        name: 'Empleados activos',
    },
    {
        id: 2,
        name: 'Empleados inactivos',
    },
];

/**
 * Data to show in table state
 */
export enum CurrentStatus {
    ACTIVE = 'Activo',
    INACTIVE = 'Inactivo',
}

/**
 * Name fields to filter
 */
export enum CurrentField {
    COLUMNS = 'COLUMNS',
    STATUS = 'STATUS',
}

export const STATUS_SELECT = ['Empleados activos', 'Empleados inactivos'];
export const STATUS = ['INACTIVE', 'ACTIVE'];
