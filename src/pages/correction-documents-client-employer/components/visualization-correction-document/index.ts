import { useCorrection } from '@hooks/useCorrection';
import { PARAGRAPHS } from '@information-texts/CorrectionDocumentsClientEmployer';
import { IGenericRecord } from '@models/GenericRecord';
import { getDateFromUnix, getTodaysTime } from '@utils/Date';
import { stringToFloat } from '@utils/ElectronicInvoice';

export const DEBIT = 'DEBIT_NOTE';
export const CREDIT = 'CREDIT_NOTE';
export const INVOICE = 'INVOICE';
export const ANNULATION_ID = '2fa06691-c4db-4989-b157-67a2f0003298';
export const ANNULATION_DESCRIPTION = 'Anulación de factura electrónica';
const { formatProducts } = useCorrection();

export const information = (type: string): IGenericRecord => ({
    DEBIT_NOTE: {
        title: 'Nota débito',
        information: type === INVOICE ? 'invoice' : PARAGRAPHS.DESCRIPTION_CREATE_DEBIT_NOTE,
        separator: type === INVOICE,
    },
    CREDIT_NOTE: {
        title: 'Nota crédito',
        information: type === INVOICE ? 'invoice' : PARAGRAPHS.DESCRIPTION_CREATE_CREDIT_NOTE,
        separator: type === INVOICE,
    },
    INVOICE: {
        title: 'Nota crédito',
        information: PARAGRAPHS.DESCRIPTION_CREATE_CREDIT_NOTE,
    },
});

export const formatDateRequest = (date: number): string => {
    const formatDate = getDateFromUnix(date);
    return `${formatDate.year}-${formatDate.month}-${formatDate.day}`;
};

export const formatDataRequest = (
    fields: IGenericRecord,
    data: IGenericRecord,
    productsStock: IGenericRecord[],
    products?: IGenericRecord[],
    taxesTable?: IGenericRecord[],
    totalsTable?: IGenericRecord[],
    invoiceCorrection?: IGenericRecord,
    typeNote?: string,
    withholdings?: IGenericRecord[]
): IGenericRecord => {
    const totalsValues: IGenericRecord = {};
    const taxes: IGenericRecord[] = [];
    totalsTable?.forEach((total: IGenericRecord) => {
        totalsValues[total.field] = stringToFloat(total.value);
    });

    taxesTable?.forEach((item: IGenericRecord) => {
        taxes.push({
            name: item.name,
            base: item.value,
            percentage: item.percentage,
            value: item.other_value,
        });
    });
    const [reteICA, reteFuente, reteIVA] = withholdings ? withholdings : [];
    return {
        base_reteica: withholdings ? reteICA?.value : 0,
        base_reteiva: withholdings ? reteIVA?.value : 0,
        base_retefuente: withholdings ? reteFuente?.value : 0,
        total: totalsValues.total,
        total_invoice: totalsValues.total_gross,
        total_discount: totalsValues.total_discount,
        reteiva: totalsValues.reteiva,
        reteica: totalsValues.reteica,
        retefuente: totalsValues.retefuente,
        sending_charge: totalsValues.total_charge_amount,
        total_iva: totalsValues.total_iva,
        total_icui: totalsValues.total_icui,
        total_ibua: totalsValues.total_ibua,
        total_impoconsumption: totalsValues.total_inc,
        total_sale_value: totalsValues.total_payable,
        total_sale: totalsValues.subtotal,
        company_postal_code: data?.company_postal_code,
        company_address: data?.company_address,
        person_id: data?.person?.id,
        customer_id: data?.person?.customer.id,
        number_associated: data?.consecutive?.number,
        client_id: data?.person?.customer.client_id,
        prefix_id: fields?.prefix.id,
        prefix_id_associated: data?.consecutive?.prefix_id,
        send_address: fields.address.value,
        sales_manager: fields.sales_manager,
        number_max: data?.consecutive?.number_max,
        number: data?.consecutive?.number,
        invoice_type: typeNote,
        foreign_exchange_id: fields.badge.value,
        foreign_exchange_name: fields.badge.name,
        foreign_exchange_rate: fields.badge.foreign_exchange_rate,
        date_limit: formatDateRequest(fields.due_date),
        date: formatDateRequest(fields?.date_issue),
        time_issue: getTodaysTime(),
        number_purchase_order: fields.purchase_order_number,
        document_type: fields.customer_document_type.id,
        document_number: fields.customer_document_number.value,
        name: fields.customer_name.value,
        address: fields.address.value,
        country_id: fields.country.value,
        country_name: fields.country.name || 'Colombia',
        department_id: fields.department_state.value,
        department_name: fields.department_state.name || 'Cundinamarca',
        city_id: fields.city.value,
        city_name: fields.city.name || 'Bogotá, D.C',
        postal_code: fields.postal_code.value,
        email: fields.email.value,
        phone: fields.phone.value,
        sale_channel: data?.sale_channel,
        apply_deductible: false,
        is_electronic_invoice: true,
        purchasing_manager: fields.purchase_manager,
        document_type_purchasing_manager: fields.type_document_purchase_manager.id,
        document_number_purchasing_manager: fields.purchase_number_document_number.value,
        document_type_sales_manager: fields.seller_type_document.id,
        document_number_sales_manager: fields.seller_document_number.value,
        payment_method_id: fields.way_pay.id,
        type_taxpayer_id: fields.type_taxpayer.id,
        type_taxpayer_name: fields.type_taxpayer.value,
        tax_details_code: data?.person?.customer?.tax_details_code,
        tax_details_name: data?.person?.customer?.tax_details_name,
        note: fields.observations,
        electronic_billing: true,
        is_paid: true,
        source_type: 'CUSTOMERS',
        aggregation_method: 'ELECTRONICS',
        payment_type_id: fields.payment_type.id,
        payment_type_name: fields.payment_type.value,
        days_collection: fields.collection_days.value,
        invoice_state: 'ACCEPTED',
        accepted_customer: false,
        taxes,
        withholdings: withholdings?.map((item: IGenericRecord) => ({
            name: item.name,
            base: item.value,
            percentage: item.percentage,
            value: item.other_value,
        })),
        fiscal_responsibilities: data?.person?.fiscal_responsibilities.map((item: IGenericRecord) => {
            return {
                id: String(item.id),
            };
        }),
        reason_rejection_id: fields.reason_rejection.id,
        reason_rejection_description: fields.reason_rejection.value,
        code_debit_note: fields.reason_rejection.code_debit_note,
        code_credit_note: fields.reason_rejection.code_credit_note,
        products: formatProducts(products || [], productsStock),
    };
};

export const validate: IGenericRecord = {
    name: false,
};

/**
 * It's used to compare invoice state
 */
export const VOIDED = 'VOIDED';
