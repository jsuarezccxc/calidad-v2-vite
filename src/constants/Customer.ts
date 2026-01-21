import { IFieldsAssign } from '@models/SupportDocument';

/**
 * This enum is type page
 */
export enum TypeView {
    View = 'View',
    Edit = 'Edit',
}

/**
 * This const is for keys assign in customer page
 */
export const keysCustomer: IFieldsAssign = {
    tree: {
        person: [
            { keyOrigin: 'address' },
            { keyOrigin: 'city_id' },
            { keyOrigin: 'city_name' },
            { keyOrigin: 'country_id' },
            { keyOrigin: 'country_name' },
            { keyOrigin: 'department_id' },
            { keyOrigin: 'department_name' },
            { keyOrigin: 'document_number' },
            { keyOrigin: 'document_type' },
            { keyOrigin: 'postal_code' },
            { keyOrigin: 'type_taxpayer_id' },
            { keyOrigin: 'type_taxpayer_name' },
            { keyOrigin: 'phone' },
            { keyOrigin: 'email' },
            { keyOrigin: 'fiscalResposibilities', keyValue: 'fiscal_responsibilities' },
        ],
    },
    base: [{ keyOrigin: 'name' }, { keyOrigin: 'tax_details_code' }, { keyOrigin: 'tax_details_name' }, { keyOrigin: 'id' }],
};

/**
 * This constant is to assign customer information to create invoice
 */
export const keysCustomerInvoice: IFieldsAssign = {
    tree: {
        person: [
            { keyOrigin: 'id', keyValue: 'person_id' },
            { keyOrigin: 'document_type' },
            { keyOrigin: 'document_number' },
            { keyOrigin: 'email' },
            { keyOrigin: 'type_taxpayer_id' },
            { keyOrigin: 'type_taxpayer_name' },
            { keyOrigin: 'fiscalResposibilities', keyValue: 'fiscal_responsibilities' },
            { keyOrigin: 'address' },
            { keyOrigin: 'address', keyValue: 'send_address' },
            { keyOrigin: 'city_id' },
            { keyOrigin: 'city_name' },
            { keyOrigin: 'country_id' },
            { keyOrigin: 'country_name' },
            { keyOrigin: 'department_id' },
            { keyOrigin: 'department_name' },
            { keyOrigin: 'postal_code' },
        ],
    },
    base: [
        { keyOrigin: 'id', keyValue: 'customer_id' },
        { keyOrigin: 'name' },
        { keyOrigin: 'tax_details_code' },
        { keyOrigin: 'tax_details_name' },
        { keyOrigin: 'client_id' },
    ],
};
