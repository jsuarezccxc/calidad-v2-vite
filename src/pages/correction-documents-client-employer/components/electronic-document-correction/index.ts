import { IGenericRecord } from '@models/GenericRecord';
import { ADJUSTMENT_NOTE, CONSUMER_CLIENT_DOCUMENT, SUPPORTING_DOCUMENT } from '@constants/ElectronicInvoice';
import { buildOptions } from '@utils/Company';
import { initTimeByTimePicker } from '@utils/TimePicker';
import { currentDateInUnix, getDateFromUnix, getDateToString, getTimePicker, getUnixFromDate } from '@utils/Date';

export const CREDIT_PAYMENT = 'a503de55-0e1a-3358-b383-c69722a85eac';
export const NO_QUANTITIES_AVAILABLE = 'No hay cantidades disponibles';

/**
 * Format previous due date
 *
 * @param date: number - Current date param
 * @returns Date
 */
export const formatPreviousDate = (date: number): Date => {
    const currentDate = getDateFromUnix(date);
    return new Date(Number(currentDate.year), Number(currentDate.month), Number(currentDate.day));
};

/**
 * Titles from total table
 */
export const valueTitles = [
    {
        title: 'Subtotal',
        field: 'subtotal',

        isTotal: true,
    },
    {
        title: 'Total descuento',
        field: 'total_discount',
        symbol: '-',
    },
    {
        title: 'Costo de envio',
        field: 'total_charge_amount',
        edit: true,
    },
    {
        title: 'Total bruto',
        field: 'total_gross',

        isTotal: true,
    },
    {
        title: 'Total IVA Exento (0%)',
        field: 'total_iva',
    },
    {
        title: 'Total neto',
        field: 'total_payable',

        isTotal: true,
    },
    {
        title: 'Retefuente',
        field: 'retefuente',
        symbol: '-',
    },
    {
        title: 'ReteICA',
        field: 'reteica',
        symbol: '-',
    },
    {
        title: 'ReteIVA',
        field: 'reteiva',
        symbol: '-',
    },
    {
        title: 'Total',
        field: 'total',

        isTotal: true,
    },
];

/**
 * mandate id
 */
export const MANDATE_ID = '645ce619-929b-36c2-b711-027fb2fe5b5a';

/**
 * Invoice types
 */
export const INVOICE_TYPES = [
    {
        key: 'Mandato',
        value: 'Mandato',
        code: '10',
        id: '645ce619-929b-36c2-b711-027fb2fe5b5a',
    },
    {
        key: 'Estándar',
        value: 'Estándar',
        code: '11',
        id: '9513b27d-f642-320c-a89c-07496841eb52',
    },
    {
        key: 'Nota débito',
        value: 'Nota débito',
        code: '30',
        id: '71d24ba8-ebbb-414c-8e0c-5acd264e197f',
    },
    {
        key: 'Nota crédito',
        value: 'Nota crédito',
        code: '20',
        id: 'd497cc2d-3522-4bfd-bc96-c445a5aa2c22',
    },
];

export const useFieldsValues = (
    data?: IGenericRecord,
    utilsData?: IGenericRecord,
    isList = false,
    isCorrection = false
): IGenericRecord => {
    const nowDate = currentDateInUnix();

    return {
        address: { value: data?.person?.address || '', required: false },
        associated_document_number: isList ? data?.prefix_number_associated || '' : data?.consecutive?.number || '',
        associated_document_prefix: isList ? data?.prefix_name_associated || '' : data?.consecutive?.name || '',
        badge: { value: data?.foreign_exchange_id, name: data?.foreign_exchange_name },
        broadcast_time: initTimeByTimePicker(true),
        city: { value: data?.person?.city_id, name: data?.person?.city_name },
        collection_days: { value: data?.days_collection || '', required: false },
        country: { value: data?.person?.country_id, name: data?.person?.country_name },
        customer_document_number: { value: data?.person?.document_number, required: false },
        customer_document_type: {
            id: data?.person?.document_type,
            value: data?.person?.document_type_name,
            options: buildOptions(utilsData?.document_typ),
        },
        name_legal_representative: data?.person?.name_legal_representative || '',
        customer_name: { value: data?.person?.customer?.name, required: false },
        date_issue_associated_document: getUnixFromDate(data?.date),
        date_issue: isCorrection ? getUnixFromDate(data?.date) : nowDate,
        days_collection_type: { value: data?.days_collection_type || '', required: false },
        department_state: { value: data?.person?.department_id, name: data?.person?.department_name },
        due_date: isCorrection ? getUnixFromDate(data?.date_limit) : nowDate,
        electronic_biller: data?.person?.electronic_biller || false,
        email: { value: data?.person?.email, required: false },
        fiscal_responsibility: {
            value:
                data?.person?.fiscal_responsibilities?.map(({ id, name }: IGenericRecord) => ({
                    fiscal_responsibility_id: id,
                    fiscal_responsibility_name: name,
                })) || [],
        },
        foreign_exchange_rate: data?.foreign_exchange_rate || '',
        hour_issue_associated_document:
            getTimePicker(
                getDateToString(`${getDateFromUnix(getUnixFromDate(data?.date), 'MM/DD/YYYY').dateFormat}  ${data?.time_issue}`),
                true
            ) || initTimeByTimePicker(true),
        invoice_number: isCorrection ? data?.consecutive?.number : 0,
        is_authorization_information: data?.person?.document_number !== CONSUMER_CLIENT_DOCUMENT,
        observations: data?.note || '',
        operation_type_id: {
            value: data?.operation_type_id,
            required: !data?.operation_type_id,
        },
        payment_type: {
            id: data?.payment_type_id,
            value: data?.payment_type_name || '',
            options: buildOptions(utilsData?.payment_types),
            required: false,
        },
        phone: { value: data?.person?.phone, required: false },
        postal_code: { value: data?.person?.postal_code || '', required: false },
        prefix: {
            value: isList ? data?.consecutive?.name ?? data?.prefix_name_associated : '',
            id: isCorrection ? data?.consecutive?.prefix_id ?? data?.prefix_id_associated : 1,
            required: !isCorrection,
        },
        purchase_manager: data?.purchasing_manager || '',
        purchase_number_document_number: { value: data?.document_number_purchasing_manager || '', required: false },
        purchase_order_number: data?.number_purchase_order || '',
        reason_rejection: {
            id: isList ? data?.reason_rejected_id : '',
            value: isList ? data?.reason_rejected_name : '',
            required: false,
            code_debit_note: null,
            code_credit_note: null,
        },
        receive_email: data?.person?.customer?.receive_email || false,
        receive_products: data?.person?.customer?.receive_products || false,
        reload: true,
        sales_manager: data?.sales_manager || '',
        seller_document_number: { value: data?.document_number_sales_manager || '', required: false },
        seller_type_document: {
            id: data?.document_type_sales_manager,
            value: data?.document_type_name_sales_manager || '',
            options: buildOptions(utilsData?.document_types),
        },
        supplier_document_type: {
            id: data?.person?.supplier?.document_type,
            value: data?.person?.document_type_name,
            options: buildOptions(utilsData?.document_types),
        },
        supplier_name: { value: data?.person?.supplier?.name, required: false },
        tax_detail: {
            id: data?.person?.customer?.tax_details_code,
            value: `${data?.person?.customer?.tax_details_code} - ${data?.person?.customer?.tax_details_name || ''}`,
            options: buildOptions(utilsData?.tax_details),
        },
        type_document_purchase_manager: {
            id: data?.document_type_purchasing_manager,
            value: data?.document_type_name_purchasing_manager || '',
            options: buildOptions(utilsData?.document_types),
        },
        type_taxpayer: {
            id: data?.person?.type_taxpayer_id,
            value: data?.person?.type_taxpayer_name || '',
            options: buildOptions(utilsData?.type_tax_payer),
        },
        way_pay: {
            id: data?.payment_method_id,
            value: data?.payment_method_name || '',
            options: buildOptions(utilsData?.payment_methods),
        },
        ...(data?.invoice_type === SUPPORTING_DOCUMENT && {
            date_purchase_order: getUnixFromDate(data?.date_purchase_order),
            supplier: data?.person?.supplier,
        }),
        ...((data?.invoice_type === SUPPORTING_DOCUMENT || data?.invoice_type === ADJUSTMENT_NOTE) && {
            invoice_number_supplier: { value: data?.invoice_number_supplier },
        }),
    };
};

/**
 * Used to sort table data
 */
export const VALUE = 'value';
