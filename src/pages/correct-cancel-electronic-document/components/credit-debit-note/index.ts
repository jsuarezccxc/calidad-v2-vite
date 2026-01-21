import { IGenericRecord } from '@models/GenericRecord';
import { ITableTaxesAndRetention } from '@models/ElectronicInvoice';
import { IFields } from '@components/electronic-document';
import { IInformationProps } from '@components/information';
import { formatProductsNote, typeNote } from '@components/electronic-note';
import { CANCELLATION_ELECTRONIC_DOCUMENTS } from '@information-texts/CancellationElectronicDocuments';
import { getDateFromUnix, getTodaysTime } from '@utils/Date';
import { CREDIT_NOTE, DEBIT_NOTE, RETENTIONS } from '@constants/ElectronicInvoice';
import { FormNameInputs } from '@constants/CancellationElectronic';

export { CreditDebitNote } from './CreditDebitNote';

/**
 * Type information the page (debit/credit)
 * @param typeDocument: string - Param type note
 * @returns IInformationProps
 */
export const infoPage = (typeDocument: string): IInformationProps => {
    if (typeNote(typeDocument)) {
        return {
            title: 'Nota débito',
            description:
                'Las notas débito a una factura de venta se generan cuando el valor registrado quedó por debajo del que debía quedar o cuando la cantidad registrada es menor a la acordada.',
        };
    }
    return {
        title: 'Nota crédito',
        description: CANCELLATION_ELECTRONIC_DOCUMENTS.CANCEL_CREDIT_DESCRIPTION,
    };
};

/**
 * Template for table taxes
 */
export const initFieldsTaxTable: IFields = {
    tax: {
        value: '',
        onChange: () => {},
        disabled: true,
    },
    base: {
        value: 0,
        onChange: () => {},
        disabled: true,
    },
    rate: {
        value: '',
        onChange: () => {},
        disabled: true,
    },
    value: {
        value: 0,
        onChange: () => {},
        disabled: true,
    },
};

/**
 * Create data for new note
 *
 * @param fields: IGenericRecord[] - Data fields invoice
 * @param data: IGenericRecord[] - Data main invoice
 * @param products: ITableTaxesAndRetention[] - Products invoice
 * @param totals: ITableTaxesAndRetention[] - Totals values
 * @returns IGenericRecord
 */
export const getFormatDataNote = (
    fields: IGenericRecord,
    data: IGenericRecord,
    products: IGenericRecord[],
    totals: IGenericRecord,
    taxes: ITableTaxesAndRetention[],
    withholdings: ITableTaxesAndRetention[]
): IGenericRecord => {
    return {
        aggregation_method: data.aggregation_method,
        amount_paid: data.amount_paid,
        answer_client: data.answer_client,
        answer_dian: data.answer_dian,
        apply_deductible: data.apply_deductible,
        company_address: data.company_address,
        company_postal_code: data.company_postal_code,
        customer_id: data.person.customer.id,
        client_id: data.person.customer.client_id,
        customer: data.person.customer,
        tax_details_code: data.person.customer.tax_details_code,
        tax_details_name: data.person.customer.tax_details_name,
        date_purchase_order: data.date_purchase_order,
        invoice_id: data.id,
        invoice_state: data.invoice_state,
        payment_type_name: data.payment_method_name,
        person_id: data.person_id,
        source_type: data.source_type,
        shop_cart_id: data.shop_cart_id,
        state_purchase_order: data.state_purchase_order,
        apply_electronic_invoice: false,
        address: fields.address,
        cellphone: fields.phone,
        city_id: fields.city.value,
        city_name: fields.city.name,
        country_id: fields.country.value,
        country_name: fields.country.name,
        date_limit: getDateFromUnix(fields.due_date, 'YYYY-MM-DD').dateFormat,
        days_collection: fields.collection_days,
        department_id: fields.department_state.value,
        department_name: fields.department_state.name,
        document_number: fields.customer_document_number,
        document_number_purchasing_manager: fields.purchase_number_document_number,
        document_number_sales_manager: fields.seller_document_number,
        document_type: fields.customer_document_type.id,
        document_type_name: fields.customer_document_type.value,
        document_type_name_purchasing_manager: fields.type_document_purchase_manager.value,
        document_type_name_sales_manager: fields.seller_type_document.value,
        document_type_purchasing_manager: fields.type_document_purchase_manager.id,
        document_type_sales_manager: fields.seller_type_document.id,
        electronic_billing: true,
        email: fields.email,
        fiscal_responsibilities: fields.fiscal_responsibility.map((x: IGenericRecord) => ({ id: String(x.id) })),
        foreign_exchange_id: fields.badge.value,
        foreign_exchange_name: fields.badge.name,
        foreign_exchange_rate: fields.badge.foreign_exchange_rate,
        is_electronic_invoice: true,
        is_paid: true,
        name: fields.customer_name,
        note: fields.observations,
        number: 0,
        number_associated: fields.associated_document_number,
        number_max: 200,
        number_purchase_order: fields.purchase_order_number,
        payment_method_id: fields.way_pay.id,
        payment_method_name: fields.way_pay.value,
        payment_type_id: fields.payment_type.id,
        phone: fields.phone,
        postal_code: fields.postal_code,
        prefix_id: fields.prefix.id,
        prefix_id_associated: fields.associated_document_prefix_id,
        products: formatProductsNote(products),
        purchasing_manager: fields.purchase_manager,
        sale_channel: 'PHYSICAL_STORE',
        sales_manager: fields.sales_manager,
        send_address: fields.address,
        time_issue: getTodaysTime(),
        type_taxpayer_id: fields.type_taxpayer.id,
        type_taxpayer_name: fields.type_taxpayer.value,
        reason_rejection_id: fields.reason_rejection.id,
        reason_rejection_description: fields.reason_rejection.value,
        code_debit_note: fields.reason_rejection.code_debit_note,
        code_credit_note: fields.reason_rejection.code_credit_note,
        acceptance_agreement: true,
        accepted_customer: true,
        taxes: taxes.map(({ name, base, percentage, value }) => ({
            name,
            base,
            percentage,
            value,
        })),
        withholdings: withholdings.map(({ name, base, percentage, value }) => ({
            name,
            base,
            percentage,
            value,
        })),
        base_reteica: withholdings?.find(item => item.name.includes(RETENTIONS.ICA))?.base || 0,
        base_reteiva: withholdings?.find(item => item.name.includes(RETENTIONS.IVA))?.base || 0,
        base_retefuente: withholdings?.find(item => item.name.includes(RETENTIONS.FUENTE))?.base || 0,
        ...totals,
    };
};

/**
 * This cons is fields required state
 */
const initStateErrors = {
    prefix: false,
    invoice_number: false,
    date_issue: false,
    due_date: false,
};

/**
 * This const is fields table main required
 */
const initStateErrorsTable = {
    sku: false,
    element: false,
    warehouse: false,
    lot: false,
    date: false,
    quantity: false,
    discount: false,
    send_cost: false,
    unit_value: false,
    warehouse_availability: false,
};

/**
 * This const is keys of fields required
 */
const requiredInputs = [
    FormNameInputs.PREFIX,
    FormNameInputs.DATE_ISSUE,
    FormNameInputs.DUE_DATE,
    FormNameInputs.COLLECTION_DAYS,
];

/**
 * This const is key credit note
 */
const creditNote = CREDIT_NOTE;

/**
 * This const is key debit note
 */
const debitNote = DEBIT_NOTE;

/**
 * This const default response data in save note
 */
const defaultNoteSave = {
    consecutive: {
        name: 'xxxx',
        number: 'yyyy',
    },
    time_issue: 'hh:mm:ss',
};

/**
 * This const is initial page
 */
const initForm = {
    prefix_id: '',
    apply_electronic_invoice: false,
    electronic_billing: true,
    is_electronic_invoice: true,
    is_paid: true,
    number_max: 200,
    sale_channel: 'PHYSICAL_STORE',
    time_issue: getTodaysTime(),
    acceptance_agreement: true,
    accepted_customer: true,
    reason_rejection_id: '',
    reason_rejection_description: '',
    code_debit_note: null,
    code_credit_note: null,
    prefix_name: '',
};

/**
 * This const is utils page
 */
export const utils = {
    initStateErrorsTable,
    initStateErrors,
    defaultNoteSave,
    requiredInputs,
    creditNote,
    debitNote,
    initForm,
};
