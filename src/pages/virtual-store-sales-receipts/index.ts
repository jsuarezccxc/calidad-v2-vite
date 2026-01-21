import { Routes } from '@constants/Paths';
import { ITableFieldType } from '@constants/TableFieldType';
import { getRoute, getRouteName } from '@utils/Paths';
import { Section } from '@components/bread-crumb';
import { LinkColor } from '@components/button';
import { IBodyTable } from '@components/table';
import { IconsNames } from '@components/icon';
import { IGenericRecord } from '@models/GenericRecord';
import { WEBSITE_DASHBOARD } from '@information-texts/WebsiteDashboard';
import { INVOICE_TYPE } from '@constants/InvoiceType';
import { VOUCHER_PURCHASE } from '@constants/ElectronicInvoice';
export { default } from './virtualStoreSalesReceipts';

/**
 * This interface describes that properties the component display proof payment
 *
 * @typeParam proof: string - Require title proof of payment
 * @typeParam onClickBack: () => void - Require funcion return
 * @typeParam urlProofPayment: string - Require url proof of purchase
 * @typeParam data: IGenericRecord - Data from options
 */

export interface IDisplayProofPaymentProps {
    proof: string;
    onClickBack: () => void;
    urlProofPayment: string;
    data: IGenericRecord;
}

/**
 * Interface to describe output of a constants
 * @typeParam id: number - Unique identifier
 * @typeParam icon: IconsNames - Icon name
 * @typeParam text: string - Title button
 * @typeParam identifier: string - To identify button
 */
interface IButtonsInvoice {
    id: number;
    icon: IconsNames;
    text: string;
    identifier: string;
}

/**
 * This function routes for breadcrumbs
 *
 * @param onClickProof: () => void - function returns to main screen
 * @returns Section[]
 */
export const routes = (onClickProof?: () => void, additional?: Section[]): Section[] => {
    return !additional
        ? [
              {
                  name: getRouteName(Routes.WEBSITE_MENU),
                  route: getRoute(Routes.WEBSITE_DASHBOARD),
              },
              {
                  name: WEBSITE_DASHBOARD.TITLE,
                  route: '#',
                  disabled: true,
              },
              {
                  name: getRouteName(Routes.VIRTUAL_STORE_SALES_RECEIPTS),
                  route: getRoute(Routes.VIRTUAL_STORE_SALES_RECEIPTS),
                  onClick: onClickProof,
              },
          ]
        : [
              {
                  name: getRouteName(Routes.HOME),
                  route: getRoute(Routes.WEBSITE_DASHBOARD),
              },
              {
                  name: 'Consulte los reportes del sitio web',
                  route: '#',
                  disabled: true,
              },
              {
                  name: 'Listado de ventas de su tienda diggital',
                  route: `${getRoute(Routes.VIRTUAL_STORE_SALES_RECEIPTS)}?back=true`,
                  onClick: onClickProof,
              },
              ...additional,
          ];
};

/**
 * Data table header
 */
export const headerTable = [
    { title: 'Fecha', wrapperClassName: 'container-table__date' },
    { title: 'Número de venta', wrapperClassName: 'container-table__sales' },
    { title: 'Documentos', wrapperClassName: 'container-table__date' },
    { title: 'Cliente', wrapperClassName: 'container-table__customer' },
    { title: 'Total venta', wrapperClassName: 'container-table__customer' },
];

/**
 * This function routes data body table
 *
 * @param onClick: (e: IGenericRecord) => void - function returns link data
 * @returns IBodyTable[]
 */
export const dataFieldsBody = (onClick: (e: IGenericRecord) => void): IBodyTable[] => [
    { type: ITableFieldType.DATE, field: 'date', editableField: false, wrapperClassName: 'container-table__heights' },
    {
        type: ITableFieldType.TEXT,
        field: 'number_purchase_order',
        editableField: false,
        wrapperClassName: 'container-table__heights',
    },
    {
        type: ITableFieldType.LINK,
        field: 'number',
        editableField: false,
        color: LinkColor.PURPLE,
        onClick: onClick,
        className: 'justify-center aling-center items-center',
        wrapperClassName: 'container-table__heights',
    },
    { type: ITableFieldType.TEXT, field: 'client_name', editableField: false, wrapperClassName: 'container-table__heights' },
    {
        type: ITableFieldType.VALUE,
        field: 'total',
        editableField: false,
        containerClass: 'container-table__money',
    },
];

/**
 * Initial data table
 */
export const initialDataProofPayment = [
    {
        number: '',
        date: 0,
        client_name: '',
        client_email: '',
        invoice_pdf_url: '',
    },
];

/**
 * Information component description
 */
export const DESCRIPTION_INFORMATION = `Visualice todas la ventas de su tienda diggital`;

/**
 * Keys search function
 */
export const keysSearch = ['client_name'];

/**
 * Constants file download
 */
export const MODULE = 'list-voucher-purchases';
export const FILE_NAME = 'Listado de ventas de su tienda diggital';
export const commonClassNameButtons = {
    className: 'flex items-center justify-center pl-1 pr-1 align-middle bg-white rounded custom-button',
};
/**
 * Information about Buttons to use in preview invoice
 */
export const BUTTONS_INVOICE: IButtonsInvoice[] = [
    {
        id: 1,
        icon: 'newPdf',
        text: 'Descargar PDF',
        identifier: 'pdf',
    },
    {
        id: 2,
        icon: 'xml',
        text: 'Descargar XML',
        identifier: 'xls',
    },
    {
        id: 3,
        icon: 'newPrint',
        text: 'Imprimir',
        identifier: 'print',
    },
    {
        id: 4,
        icon: 'newMail',
        text: 'Enviar por  correo',
        identifier: 'mail',
    },
];

//90 to const to use in common elements
export const NINETY = 90;

//max lenght to email inputs
export const MAX_LENGTH_INPUTS_EMAIL = 240;

/**
 * Options array to order dropdown
 */
export const ORDER_OPTIONS = [
    { key: VOUCHER_PURCHASE, value: 'Comprobante de venta' },
    { key: INVOICE_TYPE?.INVOICE, value: 'Factura electrónica de venta' },
];

export const MAIL = 'mail';
export const THREE = 3;
export const FOUR = 4;
export const TWO = 2;
export const INVOICE = 'Factura de venta';
export const STATE_DOCUMENT = 'Estado del documento';

//Extra time to set the current day to 23:59:59
export const EXTRA_TIME_TO_DAY = 85319;

/**
 * Default data to filter input
 */
export const BASE_FILTER = { key: '', value: '' };
