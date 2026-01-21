import { v4 } from 'uuid';
import { IOptionSelect } from '@components/input';
import { currentDateInUnix } from '@utils/Date';
import { IGenericRecord } from '@models/GenericRecord';
import { IFileRequest } from '@models/File';

export { ReportTable } from './ReportTable';
export { Texts } from './Texts';

/**
 * Interface for table headers.
 *
 * @interface
 * @typeParam title: string - Title of the header.
 * @typeParam className: string - Optional class name for the header.
 * @typeParam amount: string - Optional amount field for the header.
 * @typeParam value: string - Optional value field for the header.
 * @typeParam classNameTexts: string - Class name for the text styles.
 * @typeParam colSpan: number - Optional column span for the header.
 */
interface ITableHeaders {
    title: string;
    className?: string;
    amount?: string;
    value?: string;
    classNameTexts: string;
    colSpan?: number;
}

/**
 * Generates a file request object for inventory movement electronic documents.
 *
 * @param type: string - The type of file.
 * @param initialDate: number - The initial date in milliseconds.
 * @param finishDate: number - The finish date in milliseconds.
 * @param sortBy: string - The field by which to sort the data.
 * @param search: string - The search string.
 * @param data: IGenericRecord[] - Data to render in document.
 * @returns IFileRequest.
 */
export const getRequestFile = (
    type: string,
    initialDate: number,
    finishDate: number,
    sortBy: string,
    search: string,
    concept: string,
    data: IGenericRecord[]
): IFileRequest => {
    return {
        type,
        module: 'inventory-movement-electronic-documents',
        range: {
            start_date: initialDate ? initialDate : null,
            finish_date: initialDate ? finishDate : null,
        },
        sort_by: SelectOrderOptions.find(option => option.code === sortBy)?.value || '',
        concept_type: concept,
        searched_by: search,
        data: data,
    };
};

/**
 * Generates a class name string for text styles.
 *
 * @param textCenter: boolean - Optional flag to center the text.
 * @returns string.
 */
export const classNameTexts = (textCenter?: boolean): string =>
    `text-tiny lg:text-sm font-bold text-blue font-allerbold flex items-center w-full h-10 ${textCenter ? 'justify-center border-gray border-b' : ''}`;

/**
 * Array of table headers for the report table.
 *
 */
export const TABLE_HEADERS: ITableHeaders[][] = [
    [
        { title: 'Fecha', className: 'report-table--date h-17.5 lg:h-20', classNameTexts: classNameTexts() },
        { title: 'Producto', className: 'report-table--product h-17.5 lg:h-20', classNameTexts: classNameTexts() },
        { title: 'SKU', className: 'report-table--sku h-17.5 lg:h-20', classNameTexts: classNameTexts() },
        { title: 'Concepto', className: 'report-table--concept h-17.5 lg:h-20', classNameTexts: classNameTexts() },
        {
            title: 'Número de documento electrónico',
            className: 'report-table--electronic h-17.5 lg:h-20',
            classNameTexts: classNameTexts(),
        },
    ],
    [
        {
            title: 'Entrada',
            className: 'report-table--input h-17.5 lg:h-20',
            amount: 'Cantidad',
            value: 'Valor',
            classNameTexts: classNameTexts(true),
            colSpan: 2,
        },
        {
            title: 'Salida',
            className: 'report-table--output h-17.5 lg:h-20',
            amount: 'Cantidad',
            value: 'Valor',
            classNameTexts: classNameTexts(true),
            colSpan: 2,
        },
        {
            title: 'Disponible',
            className: 'report-table--available h-17.5 lg:h-20',
            amount: 'Cantidad',
            value: 'Valor',
            classNameTexts: classNameTexts(true),
            colSpan: 2,
        },
    ],
];

/**
 * Sort type
 */
export enum OrderType {
    Asc = 'asc',
    Desc = 'desc',
}

/**
 * Options to select order for
 */
export const SelectOrderOptions: IOptionSelect[] = [
    {
        value: 'Del más reciente al más antiguo',
        code: OrderType.Desc,
        key: v4(),
    },
    {
        value: 'Del más antiguo al más reciente',
        code: OrderType.Asc,
        key: v4(),
    },
];

/**
 * initial date state for input range date
 */
export const initialDateState = {
    initialDate: currentDateInUnix(),
    finishDate: currentDateInUnix(),
};

/**
 * Concept options
 */
export const CONCEPT_OPTIONS = [
    {
        value: 'Factura electrónica de venta - Tienda física',
        
        key: 'INVOICE_PHYSICAL_STORE',
    },
    {
        value: 'Factura electrónica de venta - Sitio web',
        key: 'INVOICE_WEBSITE',
    },
    {
        value: 'Inventario inicial',
        key: 'INVENTORY',
    },
    {
        value: 'Nota débito',
        key: 'INVOICE_DEBIT_NOTE',
    },
    {
        value: 'Nota crédito',
        key: 'INVOICE_CREDIT_NOTE',
    },
    {
        value: 'Factura de compra',
        key: 'INVOICE',
    }
]
