import { INoteTypeForm, INotesReducer, IOptionsForm, IValidateNote } from '@models/CorrectCancelElectronicDocument';
import { getDateFromUnix } from '@utils/Date';
import { typeInvoice as TypeInvoice } from './ElectronicInvoice';

/**
 * This enum is for modals keys
 */
export enum PageModals {
    SAVE = 'SAVE',
    DRAFT = 'DRAFT',
}

/**
 * This const is modals state
 */
export const MODALS = {
    [PageModals.SAVE]: false,
    [PageModals.DRAFT]:  false,
}

/**
 * This const is init validate state
 */
export const INIT_VALIDATE: IValidateNote = {
    form: [],
    details: {
        fields: [],
        messages: [],
    },
    retentions: [],
};

/**
 * This const is init main form state
 */
export const INIT_MAIN_FORM: INoteTypeForm = {
    associatedDocument: '',
    idReason: '',
    reason: '',
    typeNote: '',
};

/**
 * This const us init state reducer
 */
export const INIT_STATE: INotesReducer = {
    submit: false,
    mainForm: { ...INIT_MAIN_FORM },
    note: {
        operation_type_id: '',
        associated_document_prefix: '',
        acceptance_agreement: false,
        accepted_customer: false,
        address: '',
        aggregation_method: TypeInvoice.ELECTRONICS,
        amount_paid: 0,
        answer_client: '',
        answer_dian: '',
        apply_deductible: false,
        apply_electronic_invoice: false,
        associated_date: '',
        associated_expiration_date: '',
        base_retefuente: 0,
        base_reteica: 0,
        base_reteiva: 0,
        cellphone: '',
        city_id: '',
        city_name: '',
        client_id: '',
        code_credit_note: null,
        code_debit_note: null,
        company_address: '',
        company_postal_code: '',
        country_id: '',
        country_name: '',
        customer: {
            company_device_id: '',
            company_device_name: '',
            description: '',
            id: '',
            last_name: '',
            name: '',
            receive_email: false,
            receive_printed_invoice: false,
            receive_products: false,
            tax_details_code: '',
            tax_details_name: '',
        },
        customer_id: '',
        date: getDateFromUnix().formatYearMonthDay || '',
        date_limit: getDateFromUnix().formatYearMonthDay || '',
        date_purchase_order: '',
        days_collection: NaN,
        department_id: '',
        department_name: '',
        document_number: '',
        document_number_purchasing_manager: '',
        document_number_sales_manager: '',
        document_type: '',
        document_type_name: '',
        document_type_name_purchasing_manager: '',
        document_type_name_sales_manager: '',
        document_type_purchasing_manager: '',
        document_type_sales_manager: '',
        electronic_billing: false,
        email: '',
        fiscal_responsibilities: [],
        foreign_exchange_id: '',
        foreign_exchange_name: '',
        foreign_exchange_rate: NaN,
        invoice_id: '',
        invoice_state: '',
        is_electronic_invoice: false,
        is_paid: false,
        name: '',
        note: '',
        number: '',
        number_associated: '',
        number_max: NaN,
        number_purchase_order: '',
        payment_method_id: '',
        payment_method_name: '',
        payment_type_id: '',
        payment_type_name: '',
        person_id: '',
        phone: '',
        postal_code: '',
        prefix_id: '',
        prefix_id_associated: '',
        prefix_name: '',
        products: [],
        purchasing_manager: '',
        reason_rejection_description: '',
        reason_rejection_id: '',
        retefuente: 0,
        reteica: 0,
        reteiva: 0,
        sale_channel: '',
        sales_manager: '',
        send_address: '',
        sending_charge: 0,
        shop_cart_id: '',
        source_type: '',
        state_purchase_order: '',
        tax_details_code: '',
        tax_details_name: '',
        taxes: [],
        time_issue: '',
        total: 0,
        total_discount: 0,
        total_ibua: 0,
        total_icui: 0,
        total_impoconsumption: 0,
        total_invoice: 0,
        total_iva: 0,
        total_sale: 0,
        total_sale_value: 0,
        total_sale_before_tax: 0,
        type_taxpayer_id: '',
        type_taxpayer_name: '',
        withholdings: [],
        name_legal_representative: '',
    },
    typeNote: 'DEBIT_NOTE',
};

/**
 * This const is init state options
 */
export const INIT_STATE_OPTIONS: IOptionsForm = {
    documentTypes: [],
    fiscalResponsibilities: [],
    foreignExchange: [],
    paymentMethods: [],
    paymentTypes: [],
    prefix: [],
    taxDetails: [],
    typeTaxPayer: [],
    withholdings: [],
};
