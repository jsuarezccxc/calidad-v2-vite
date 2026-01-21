import { IFieldsAssign } from '@models/SupportDocument';

/**
 * This const is keys assign invoice
 */
export const KEYS_ASSIGN_OBJECT: IFieldsAssign = {
    tree: {
        consecutive: [{ keyOrigin: 'prefix_id' }, { keyOrigin: 'name', keyValue: 'prefix_name' }],
        person: [
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
            { keyOrigin: 'document_number' },
            { keyOrigin: 'type_taxpayer_id' },
            { keyOrigin: 'type_taxpayer_id', keyValue: 'type_taxpayer_code' },
            { keyOrigin: 'type_taxpayer_name', keyValue: 'person_type' },
            { keyOrigin: 'type_taxpayer_name' },
        ],
    },
    base: [
        { keyOrigin: 'days_collection', keyValue: 'collection_days' },
        { keyOrigin: 'days_collection_type' },
        { keyOrigin: 'operation_type_id' },
        { keyOrigin: 'payment_method_id' },
        { keyOrigin: 'payment_method_name' },
        { keyOrigin: 'payment_type_id' },
        { keyOrigin: 'payment_type_name' },
        { keyOrigin: 'foreign_exchange_id' },
        { keyOrigin: 'foreign_exchange_name' },
        { keyOrigin: 'foreign_exchange_rate' },
        { keyOrigin: 'number_purchase_order' },
        { keyOrigin: 'sales_manager' },
        { keyOrigin: 'document_number_sales_manager' },
        { keyOrigin: 'document_type_sales_manager', keyValue: 'document_type_purchasing_manager_id' },
        { keyOrigin: 'document_type_name_sales_manager', keyValue: 'document_type_purchasing_manager' },
        { keyOrigin: 'document_number_sales_manager' },
        { keyOrigin: 'note' },
        { keyOrigin: 'internal_notes' },
        { keyOrigin: 'invoice_details', keyValue: 'invoiceDetails' },
        { keyOrigin: 'taxes' },
        { keyOrigin: 'withholdings' },
    ],
};
