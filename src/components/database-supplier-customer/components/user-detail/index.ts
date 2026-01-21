import { Section } from '@components/bread-crumb';
import { IDataTableSupplier } from '@components/database-supplier-customer';
import { IBodyTable, IHeaderTable } from '@components/table';
import { ITableFieldType } from '@constants/TableFieldType';
import { IGenericRecord } from '@models/GenericRecord';

export * from './UserDetail';

/**
 * Routes bread crumb pages
 *
 * @param singleItem: string - Text single item
 * @param pluralItem: string - Text plural item
 * @param route: string - Text route
 * @returns Section[]
 */
export const routesSupplierDetail = (singleItem = '', pluralItem = '', route = '#'): Section[] => {
    return [
        {
            name: 'Ficha técnica',
            route: '#',
        },
        {
            name: `Ficha técnica de ${pluralItem}`,
            route: route,
        },
        {
            name: `Detalle del ${singleItem}`,
            route: '#',
        },
    ];
};

/**
 * This interface describes the properties for supplier
 *
 * @typeParam data: IDataTableSupplier - Supplier data
 * @typeParam onClickEdit: () => void; - Function edit supplier
 * @typeParam title: { singular: string; plural: string } - Page title
 * @typeParam pageRoute: string - Page route
 * @typeParam historicalInformation: { date: string; number: string; total: number }[] - Historical information user
 * @typeParam activeElectronicDocuments: boolean - Active electronic documents
 */
export interface ISupplerDetailProps {
    data: IDataTableSupplier | IGenericRecord;
    onClickEdit: () => void;
    title: { singular: string; plural: string };
    pageRoute: string;
    historicalInformation: { date: string; number: string; total: number }[];
    activeElectronicDocuments: boolean;
}

/**
 * Data header from supplier table
 */
export const headersTableDetail: IHeaderTable[] = [
    {
        title: 'Fecha',
        className: 'px-2 py-1 xs:p-2 xs:h-8.75',
        wrapperClassName: 'supplier-database__table-detail-column-first xs:h-8.75',
    },
    {
        title: 'Documento electrónico',
        className: 'px-2 py-1 xs:p-2 xs:h-8.75',
        wrapperClassName: 'supplier-database__table-detail-column-second xs:h-8.75',
    },
    {
        title: 'Total valor venta/compra',
        className: 'px-2 py-1 xs:p-2 xs:h-8.75',
        wrapperClassName: 'supplier-database__table-detail-column-third xs:h-8.75',
    },
];

/**
 * this function values supplier table
 */
export const tableBodyDetail: IBodyTable[] = [
    {
        type: ITableFieldType.DATE,
        field: 'date',
        editableField: false,
        classNameTd: 'h-10 pl-2 border-b border-gray',
        className:'text-gray'
    },
    {
        type: ITableFieldType.TEXT,
        field: 'number',
        editableField: false,
        classNameTd: 'h-10 pl-2 border-b border-gray',
        className:'text-gray'
    },
    {
        type: ITableFieldType.VALUE,
        field: 'total_sale_value',
        editableField: false,
        classNameTd: 'h-10 pl-3 border-b border-gray',
        className:'text-gray',
        inputClass:'supplier-database__table-detail-column-value'
    },
];
