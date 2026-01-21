import { v4 as uuid } from 'uuid';
import { ISupplier, ISupplierResponse } from '@models/Supplier';
import { IFieldsAssign } from '@models/SupportDocument';
import { WITHHOLDINGS } from './ElectronicInvoice';

/**
 * This const is the name of the fields
 */
export const POSTAL_CODE = 'postal_code';
export const CELLPHONE = 'cellphone';
export const PHONE = 'phone';
export const DOCUMENT_NUMBER = 'document_number';
export const CUSTOMER = 'cliente';

export const keysSupplier: IFieldsAssign = {
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
            { keyOrigin: 'fiscal_responsibilities' },
            { keyOrigin: 'postal_code' },
            { keyOrigin: 'type_taxpayer_name' },
            { keyOrigin: 'type_taxpayer_id' },
            { keyOrigin: 'phone' },
            { keyOrigin: 'id', keyValue: 'supplier_id' },
            {
                keyOrigin: 'supplier',
                skip: true,
                children: {
                    tree: {
                        supplier: [
                            { keyOrigin: 'name' },
                            { keyOrigin: 'name', keyValue: 'supplier_name' },
                            { keyOrigin: 'name', keyValue: 'supplier' },
                        ],
                    },
                },
            },
        ],
    },
    base: [
        { keyOrigin: 'person_id' },
        { keyOrigin: 'person_id', keyValue: 'id' },
        { keyOrigin: 'prefix_id_associated', keyValue: 'prefix_id' },
        { keyOrigin: 'prefix_name_associated', keyValue: 'prefix_id_name' },
    ],
};

/**
 * This const is preview name
 */
export const PREVIEW_DOCUMENT_SUPPORT = 'PREVIEW_DOCUMENT_SUPPORT';

/**
 * This const is initial data
 */
export const INITIAL_SUPPLIER: ISupplier = {
    id: '',
    name: '',
    buy_responsible: '',
    fiscal_responsibilities: [{ id_fiscal: '', id: '', name: '', withholdings: WITHHOLDINGS }],
    taxpayer: '',
    type_taxpayer_id: '',
    type_taxpayer_name: '',
    qualification_id: uuid(),
    company_id: '',
    user_type_id: uuid(),
    document_type: '',
    document_name: '',
    document_number: '',
    postal_code: '',
    address: '',
    email: '',
    phone: '',
    cellphone: '',
    country_id: '',
    country_name: '',
    department_id: '',
    department_name: '',
    city_id: '',
    city_name: '',
    tax_details_id: '',
    tax_details_code: '',
    tax_details_name: '',
};

/**
 * This const is default fields
 */
export const SUPPLIER_EXIST_RESPONSE = { is_created: false };

/**
 * This const is default fields
 */
export const SUPPLIER_RESPONSE: ISupplierResponse = {
    buy_responsible: '',
    created_at: '',
    deleted_at: '',
    id: '',
    name: '',
    person_id: '',
    qualification_id: '',
    tax_details_code: '',
    updated_at: '',
    tax_details_name: '',
    person: {
        address: '',
        cellphone: '',
        city_name: '',
        company_id: '',
        country_name: '',
        created_at: '',
        department_name: '',
        document_number: '',
        document_type: '',
        id: '',
        phone: '',
        postal_code: '',
        city_id: 0,
        company_name: '',
        country_id: 0,
        department_id: 0,
        electronic_biller: false,
        email: '',
        indications_address: '',
        type_taxpayer_id: '',
        type_taxpayer_name: '',
        updated_at: '',
        fiscal_responsibilities: [],
    },
};

/**
 * This const to assign data in object
 */
export const KEY_ASSIGN_SUPPLIER: Record<string, string> = {
    id: 'id',
    supplier_id: 'id',
    name: 'name',
    email: 'email',
    person_id: 'person.id',
    document_name: 'person.document_name',
    document_type: 'person.document_type',
    document_number: 'person.document_number',
    address: 'person.address',
    country_id: 'person.country_id',
    country_name: 'person.country_name',
    department_id: 'person.department_id',
    department_name: 'person.department_name',
    city_id: 'person.city_id',
    city_name: 'person.city_name',
    postal_code: 'person.postal_code',
    phone: 'person.phone',
    type_taxpayer_id: 'person.type_taxpayer_id',
    type_taxpayer_name: 'person.type_taxpayer_name',
    fiscal_responsibilities: 'person.fiscal_responsibilities',
    tax_details_code: 'tax_details_code',
    tax_details_id: 'no source',
    tax_details_name: 'tax_details_name',
};
