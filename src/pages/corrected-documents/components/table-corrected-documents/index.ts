import { LinkColor } from '@components/button';
import { IPaginatorBackend } from '@components/paginator-backend';
import { IBodyTable } from '@components/table';
import { DOCUMENT_TYPE_REQUIRE } from '@constants/ElectronicInvoice';
import { Routes } from '@constants/Paths';
import { ITableFieldType } from '@constants/TableFieldType';
import { TYPE_NAVIGATION } from '@pages/consult-electronic-document';
import { getRoute } from '@utils/Paths';
import { ICorrectionNotes } from '../../';

export { TableCorrectedDocuments } from './TableCorrectedDocuments';

/**
 * This function is fields table
 *
 * @returns IBodyTable[]
 */
const fieldsBody = (): IBodyTable[] => [
    {
        type: ITableFieldType.LINK,
        editableField: false,
        wrapperClassName: 'px-2',
        inputClass: 'table-corrected-documents__body__number',
        field: 'number',
        color: LinkColor.PURPLE,
        href: (item): string => `${getRoute(Routes.CONSULT_ELECTRONIC_DOCUMENT)}?id=${item.id}&type=${TYPE_NAVIGATION.CORRECTED}`,
    },
    {
        type: ITableFieldType.DATE,
        editableField: false,
        wrapperClassName: 'px-2',
        inputClass: 'table-corrected-documents__body__number',
        className: 'text-gray',
        field: 'date',
    },
    {
        type: ITableFieldType.TEXT_ACTION,
        editableField: false,
        wrapperClassName: 'px-2',
        inputClass: 'table-corrected-documents__body__number',
        className: 'text-gray',
        field: 'name',
    },
    {
        type: ITableFieldType.VALUE,
        editableField: false,
        wrapperClassName: 'px-2',
        inputClass: 'table-corrected-documents__body__number text-gray',
        field: 'number_sold',
        withIcon: false,
    },
    {
        type: ITableFieldType.VALUE,
        editableField: false,
        wrapperClassName: 'px-2',
        inputClass: 'table-corrected-documents__body__number text-gray',
        field: 'total',
        withIcon: true,
        fixedDecimalScale: true,
    },
    {
        type: ITableFieldType.VALUE,
        editableField: false,
        wrapperClassName: 'px-2',
        inputClass: 'table-corrected-documents__body__number text-gray',
        className: 'text-gray',
        field: 'DIAN_response',
        message: true,
    },
    {
        type: ITableFieldType.TEXT_ACTION,
        editableField: false,
        wrapperClassName: 'px-2',
        inputClass: 'table-corrected-documents__body__number',
        className: 'text-gray',
        field: 'customer_response',
    },
];

/**
 * This interface is props for header table
 *
 * @typeParma title: string - Title column
 */
export interface IPropsHeaderCorrected {
    title: string;
}

/**
 * This interface is props footer table
 *
 * @typeParam totalQuantities: number - Total quantities sale or buy
 * @typeParam totalNotes: number - Total notes
 * @typeParam TotalSale: number - Total sale or buy
 */
export interface IPropsFooterCorrected {
    totalQuantities: number;
    totalNotes: number;
    TotalSale: number;
}

/**
 * This function is for header title
 *
 * @param data: ICorrectionNotes[] - Data report
 * @returns string
 */
const headerTitle = (data: ICorrectionNotes[]): string => {
    const existClient = data.some(({ invoice_type }) =>
        [DOCUMENT_TYPE_REQUIRE.CREDIT_NOTE, DOCUMENT_TYPE_REQUIRE.DEBIT_NOTE].includes(invoice_type as DOCUMENT_TYPE_REQUIRE)
    );
    const existSupplier = data.some(({ invoice_type }) => DOCUMENT_TYPE_REQUIRE.ADJUSTMENT_NOTE === invoice_type);
    if (existClient && !existSupplier) return 'Cliente';
    if (existSupplier && !existClient) return 'Proveedor';
    return 'Cliente/proveedor';
};

/**
 * This const is utils component
 */
export const utils = {
    headerTitle,
    fieldsBody,
};

/**
 * This interface is props table
 *
 * @typeParam props: IPaginatorBackend<IGenericRecord> - Props paginator
 * @typeParam isLoadingTable?: Boolean - Optional prop indicating when loading data for render skeleton
 */
export interface IPropsTableCorrected {
    props: IPaginatorBackend<ICorrectionNotes>;
    isLoadingTable?: boolean;
}
