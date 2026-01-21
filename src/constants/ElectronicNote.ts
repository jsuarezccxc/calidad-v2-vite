import { IFieldsAssign } from '@models/SupportDocument';

/**
 * This const is keys values assign
 */
export const KEYS_VALUES: IFieldsAssign = {
    tree: {
        person: [
            { keyOrigin: 'customer' },
            { keyOrigin: 'document_type' },
            { keyOrigin: 'document_type_name' },
            { keyOrigin: 'fiscal_responsibilities' },
            { keyOrigin: 'document_number' },
            { keyOrigin: 'email' },
            { keyOrigin: 'department_id' },
            { keyOrigin: 'department_name' },
            { keyOrigin: 'country_id' },
            { keyOrigin: 'country_name' },
            { keyOrigin: 'city_id' },
            { keyOrigin: 'city_name' },
            { keyOrigin: 'address' },
            { keyOrigin: 'postal_code' },
            { keyOrigin: 'phone' },
            { keyOrigin: 'phone', keyValue: 'cellphone' },
            { keyOrigin: 'type_taxpayer_id' },
            { keyOrigin: 'type_taxpayer_name' },
            {
                keyOrigin: 'customer',
                skip: true,
                children: {
                    tree: {
                        customer: [
                            { keyOrigin: 'name' },
                            { keyOrigin: 'tax_details_code' },
                            { keyOrigin: 'tax_details_name' },
                            { keyOrigin: 'client_id' },
                            { keyOrigin: 'id', keyValue: 'customer_id' },
                        ],
                    },
                },
            },
            { keyOrigin: 'name_legal_representative' }
        ],
        consecutive: [
            { keyOrigin: 'prefix_id', keyValue: 'prefix_id_associated' },
            { keyOrigin: 'number', keyValue: 'number_associated' },
        ],
    },
    base: [
        { keyOrigin: 'date', keyValue: 'associated_date' },
        { keyOrigin: 'date_limit', keyValue: 'associated_expiration_date' },
        { keyOrigin: 'aggregation_method' },
        { keyOrigin: 'amount_paid' },
        { keyOrigin: 'answer_client' },
        { keyOrigin: 'answer_client' },
        { keyOrigin: 'answer_dian' },
        { keyOrigin: 'apply_deductible' },
        { keyOrigin: 'company_address' },
        { keyOrigin: 'company_postal_code' },
        { keyOrigin: 'date_purchase_order' },
        {
            keyOrigin: 'id',
            keyValue: 'invoice_id',
        },
        { keyOrigin: 'invoice_state' },
        {
            keyOrigin: 'payment_method_name',
            keyValue: 'payment_type_name',
        },
        { keyOrigin: 'person_id' },
        { keyOrigin: 'source_type' },
        { keyOrigin: 'shop_cart_id' },
        { keyOrigin: 'state_purchase_order' },
        { keyOrigin: 'purchasing_manager' },
        { keyOrigin: 'document_type_name_purchasing_manager' },
        { keyOrigin: 'document_type_purchasing_manager' },
        { keyOrigin: 'document_number_purchasing_manager' },
        { keyOrigin: 'document_type_sales_manager' },
        { keyOrigin: 'document_type_name_sales_manager' },
        { keyOrigin: 'document_number_sales_manager' },
        { keyOrigin: 'foreign_exchange_id' },
        { keyOrigin: 'foreign_exchange_name' },
        { keyOrigin: 'foreign_exchange_rate' },
        { keyOrigin: 'payment_method_id' },
        { keyOrigin: 'payment_method_name' },
        { keyOrigin: 'payment_type_id' },
        { keyOrigin: 'payment_type_name' },
        { keyOrigin: 'days_collection' },
        { keyOrigin: 'note' },
        { keyOrigin: 'number', keyValue: 'associated_document_prefix' },
        { keyOrigin: 'operation_type_id' },
        { keyOrigin: 'internal_notes' },
        { keyOrigin: 'sales_manager'},
        { keyOrigin: 'number_purchase_order' }
    ],
};

/**
 * Const default lot data
 */
export const DEFAULT_BATCH = { batch_number: '', batch_id: '' };

/**
 * Const default date data
 */
export const DEFAULT_DATE = { date_expiration: '', date_id: '' };

/**
 * Const is invoice type mandate id
 */
export const MANDATE_ID = '645ce619-929b-36c2-b711-027fb2fe5b5a';
