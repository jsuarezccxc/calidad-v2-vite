import { IFieldsAssign } from '@models/SupportDocument';

/**
 * This const is keys assign
 */
export const KEYS_ASSIGN_PURCHASE: IFieldsAssign = {
    tree: {
        consecutive: [{ keyOrigin: 'prefix_id' }, { keyOrigin: 'number' }, { keyOrigin: 'name', keyValue: 'prefix' }],
        person: [{ keyOrigin: 'supplier' }],
    },
    base: [
        { keyOrigin: 'collection_days', keyValue: 'days_collection' },
        { keyOrigin: 'days_collection_type' },
        { keyOrigin: 'cufe' },
        { keyOrigin: 'cufe', keyValue: 'document_uuid' },
        { keyOrigin: 'document_number_purchasing_manager' },
        { keyOrigin: 'document_type_purchasing_manager', keyValue: 'document_type_purchasing_manager_id' },
        { keyOrigin: 'document_type_name_purchasing_manager', keyValue: 'document_type_purchasing_manager' },
        { keyOrigin: 'foreign_exchange_id' },
        { keyOrigin: 'foreign_exchange_name' },
        { keyOrigin: 'foreign_exchange_rate' },
        { keyOrigin: 'internal_notes' },
        { keyOrigin: 'note' },
        { keyOrigin: 'is_paid' },
        { keyOrigin: 'number_purchase_order' },
        { keyOrigin: 'payment_method_id' },
        { keyOrigin: 'payment_method_name', keyValue: 'payment_method' },
        { keyOrigin: 'payment_type_id' },
        { keyOrigin: 'payment_type_name' },
        { keyOrigin: 'person_id' },
        { keyOrigin: 'sales_manager' },
        { keyOrigin: 'supplier_invoice_number' },
        { keyOrigin: 'person' },
        { keyOrigin: 'date' },
        { keyOrigin: 'time_issue' },
        { keyOrigin: 'date_limit', keyValue: 'expiration_date' }
    ],
};
