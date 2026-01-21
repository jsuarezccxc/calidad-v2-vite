import { IBodyTable } from '@components/table';
import { ITableFieldType } from '@constants/TableFieldType';

/**
 * Dynamic Routes
 */
export const extraRoutes = [{ name: 'Cálculo total de inventario final', route: '#' }];

/**
 * Data structure Header from table
 */
export const headerTableCppTop = [
    { title: 'Operación', wrapperClassName: 'container-table__date cppTable__header-first' },
    { title: 'Fecha de operación', wrapperClassName: 'container-table__sales cppTable__header-first' },
    { title: 'Cantidad neta', wrapperClassName: 'container-table__date cppTable__header-second' },
    { title: 'Costo por cantidad', wrapperClassName: 'container-table__customer cppTable__header-second' },
    { title: 'Costo de la operación', wrapperClassName: 'container-table__customer cppTable__header-second' },
    { title: 'Costo promedio ponderado', wrapperClassName: 'container-table__customer cppTable__header-second' },
];

/**
 * Data structure Header from table
 */
export const headerTableCppBottom = [
    { title: 'Inventario final', wrapperClassName: 'container-table__date', rowSpan: 4, colSpan: 4 },
];

/**
 * Options to select the method to use
 */
export const methodOptions = [
    { key: 'cpp', value: 'Método CCP por producto' },
    { key: 'peps', value: 'Método PEPS por producto' },
];

/**
 * Fields to use in Cpp Table
 */
export const fieldsBodyTableCppTop: IBodyTable[] = [
    { type: ITableFieldType.TEXT, field: 'operation', editableField: false, className: 'cppTable__height' },
    {
        type: ITableFieldType.DATE,
        field: 'operation_date',
        editableField: false,
        wrapperClassName: 'cppTable__height',
    },
    {
        type: ITableFieldType.NUMBER,
        field: 'quantity',
        editableField: false,
        wrapperClassName: 'cppTable__height',
    },

    {
        type: ITableFieldType.VALUE,
        field: 'unit_cost',
        editableField: false,
        inputClass: 'cppTable__inputs_orientation',
        containerClass: 'cppTable__money',
    },
    {
        type: ITableFieldType.VALUE,
        field: 'operation_cost',
        editableField: false,
        inputClass: 'cppTable__inputs_orientation',
        containerClass: 'cppTable__money',
    },
    {
        type: ITableFieldType.TEXT,
        field: '',
        editableField: false,
        inputClass: 'cppTable__inputs_orientation',
        wrapperClassName: 'cppTable__height',
    },
];

/**
 * Data structure Header from table
 */
export const headerTablePeps = [
    { title: 'Operación', wrapperClassName: 'container-table__customer pepsTable__header-first' },
    { title: 'Fecha de operación', wrapperClassName: 'container-table__customer pepsTable__header-first' },
    { title: 'Cantidad neta', wrapperClassName: 'container-table__customer pepsTable__header-third' },
    { title: 'Costo por cantidad', wrapperClassName: 'container-table__customer pepsTable__header-fourth' },
    { title: 'Costo de la operación', wrapperClassName: 'container-table__customer pepsTable__header-fifth' },
    { title: 'Cantidad disponible para la venta', wrapperClassName: 'pepsTable__header-fifth' },
    {
        title: 'Costo total cantidad disponible para la venta',
        wrapperClassName: 'container-table__customer pepsTable__header-sixth',
    },
];

/**
 * Fields to use in peps Table
 */
export const fieldsBodyTablePeps: IBodyTable[] = [
    { type: ITableFieldType.TEXT, field: 'operation', editableField: false },
    {
        type: ITableFieldType.DATE,
        field: 'operation_date',
        editableField: false,
        wrapperClassName: 'pepsTable__height',
    },
    {
        type: ITableFieldType.NUMBER,
        field: 'quantity',
        editableField: false,
        wrapperClassName: 'pepsTable__height',
    },
    {
        type: ITableFieldType.VALUE,
        field: 'unit_cost',
        editableField: false,
        inputClass: 'cppTable__inputs_orientation',
        containerClass: 'pepsTable__money',
    },
    {
        type: ITableFieldType.VALUE,
        field: 'operation_cost',
        editableField: false,
        inputClass: 'cppTable__inputs_orientation',
        containerClass: 'pepsTable__money',
    },
    {
        type: ITableFieldType.TEXT,
        field: 'quantity_available_sale',
        editableField: false,
        inputClass: 'cppTable__inputs_orientation ',
        wrapperClassName: 'pepsTable__height',
    },
    {
        type: ITableFieldType.VALUE,
        field: 'total_cost_quantity_available_for_sale',
        editableField: false,
        inputClass: 'cppTable__inputs_orientation',
        containerClass: 'pepsTable__money',
    },
];

//Data to use until back-end is done
export const dataFake = [
    {
        operation: 'compra',
        date: '22-04-2024',
        quantity: 23,
        cost_per_quantity: 2300,
        operation_cost: 100,
        average: 300,
        available_quantity: 3223,
        total_cost_available_quantity: 213123,
    },
    {
        operation: 'compra',
        date: '22-04-2024',
        quantity: 23,
        cost_per_quantity: 2300,
        operation_cost: 100,
        average: 300,
        available_quantity: 3223,
        total_cost_available_quantity: 213123,
    },
    {
        operation: 'compra',
        date: '22-04-2024',
        quantity: 23,
        cost_per_quantity: 2300,
        operation_cost: 100,
        average: 300,
        available_quantity: 3223,
        total_cost_available_quantity: 213123,
    },
];

//Constant cpp
export const CPP = 'cpp';

//Constant module
export const TWO_MODULE = 2;

//Constant initial inventory text
export const INITIAL_INVENTORY_TEXT = 'Inventario inicial';

//Constant initial inventory
export const INITIAL_INVENTORY = 'INITIAL_INVENTORY';

//object that contains the endpoint props to legible props
export const TYPE_OF_OPERATION = {
    INVOICE: 'Venta',
    PURCHASE_SUPPLIER: 'Compra',
    INITIAL_INVENTORY: 'Inventario inicial',
    CREDIT_NOTE_SUPPLIER: 'Devolución',
    CREDIT_NOTE: 'Devolución',
};
