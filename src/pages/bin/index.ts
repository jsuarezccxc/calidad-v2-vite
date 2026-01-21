import { IBodyTable } from '@components/table';
import { ITableFieldType } from '@constants/TableFieldType';
import { IGenericRecord } from '@models/GenericRecord';

export { default } from './Bin';

/**
 * Data structure Header from table
 */
export const headersTable = [
    {
        title: 'Categoría ',
        className: 'py-1 lg:w-52 2xl:w-auto',
    },
    {
        title: 'Referencia',
        wrapperClassName: 'lg:w-60 2xl:w-auto',
    },
    {
        title: 'Fecha de eliminación',
        wrapperClassName: 'lg:w-60 2xl:w-auto',
    },
    {
        wrapperClassName: 'w-60',
    },
];

/**
 * Data fields from Body (name, type) fields
 */
export const fieldsBody = (restoreData: ({ ...args }: IGenericRecord) => void, disabledInputs = false): IBodyTable[] => {
    const allFields: IBodyTable[] = [
        {
            type: ITableFieldType.TEXT,
            field: 'category',
            editableField: false,
            className: 'py-2.5',
        },
        {
            type: ITableFieldType.TEXT,
            field: 'reference',
            editableField: false,
        },
        {
            type: ITableFieldType.DATE,
            field: 'date',
            editableField: false,
        },
    ];

    if (disabledInputs) return allFields;

    return [
        ...allFields,
        {
            type: ITableFieldType.BUTTON,
            field: 'button_restore',
            editableField: false,
            className: 'btn-bin-table',
            button: {
                text: 'Restaurar',
                onClick: ({ ...args }: IGenericRecord): void => restoreData(args),
            },
        },
    ];
};

/**
 * Data for table
 */
export const data = [
    {
        id: 1,
        category: 'Producto',
        reference: 'Bodega 1',
        deletion_date: 'dd/mm/aaaa',
    },
    {
        id: 2,
        category: 'Factura de compra',
        reference: 'Bodega 2',
        deletion_date: 'dd/mm/aaaa',
    },
    {
        id: 3,
        category: 'Proveedor',
        reference: 'Bodega 3',
        deletion_date: 'dd/mm/aaaa',
    },
    {
        id: 4,
        category: 'Factura de venta',
        reference: 'Bodega 4',
        deletion_date: 'dd/mm/aaaa',
    },
];

export const optionsFilterBy = [
    {
        type: 'category',
        key: 'all',
        value: 'Seleccione...',
    },
    {
        type: 'category',
        key: 'product',
        value: 'Producto',
    },
    {
        type: 'category',
        key: 'provider',
        value: 'Proveedor',
    },
    {
        type: 'category',
        key: 'sale_invoice',
        value: 'Factura de venta',
    },
    {
        type: 'category',
        key: 'purchase_invoice',
        value: 'Factura de compra',
    },
];

export const keyForSearch = ['reference'];
