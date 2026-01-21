import { IFields } from '@components/electronic-document';

export const init_fields_correction: IFields = {
    associated_document_prefix: {
        value: '',
        onChange: () => {},
        disabled: true,
    },
    associated_document_number: {
        value: '',
        onChange: () => {},
        disabled: true,
    },
    prefix: {
        value: '',
        options: [],
        onChange: () => {},
        disabled: true,
        required: false,
        requiredText: ''
    },
    invoice_number: {
        value: '',
        onChange: () => {},
        disabled: true,
        required: false,
        requiredText: ''
    },
    badge: {
        value: '',
        options: [],
        onChange: () => {},
        disabled: true,
    },
    date_issue: {
        value: '',
        onChange: () => {},
        disabled: true,
        required: false,
        requiredText: ''
    },
    broadcast_time: {
        value: '',
        onChange: () => {},
        disabled: true,
        required: false,
        requiredText: ''
    },
    due_date: {
        value: '',
        onChange: () => {},
        disabled: true,
        required: false,
        requiredText: ''
    },
    reason_rejection: {
        value: '',
        onChange: () => {},
        disabled: true,
        required: false,
        requiredText: ''
    },
    purchase_order_number: {
        value: '',
        onChange: () => {},
        disabled: true,
    },
    customer_document_type: {
        value: '',
        options: [],
        onChange: () => {},
        disabled: true,
    },
    customer_name: {
        value: '',
        onChange: () => {},
        disabled: true,
    },
    address: {
        value: '',
        onChange: () => {},
        disabled: true,
    },
    department_state: {
        value: '',
        options: [],
        onChange: () => {},
        disabled: true,
    },
    postal_code: {
        value: '',
        onChange: () => {},
        disabled: true,
    },
    purchase_manager: {
        value: '',
        onChange: () => {},
        disabled: true,
    },
    purchase_number_document_number: {
        value: '',
        onChange: () => {},
        disabled: true,
    },
    collection_days: {
        value: '',
        onChange: () => {},
        disabled: true,
        required: false,
        requiredText: ''
    },
    way_pay: {
        value: '',
        options: [],
        onChange: () => {},
        disabled: true,
    },
    fiscal_responsibility: {
        value: '',
        options: [],
        onChange: () => {},
        disabled: true,
    },
    observations: {
        value: '',
        onChange: () => {},
        disabled: true,
    },
    sales_manager: {
        value: '',
        onChange: () => {},
        disabled: true,
    },
    customer_document_number: {
        value: '',
        onChange: () => {},
        disabled: true,
    },
    email: {
        value: '',
        onChange: () => {},
        disabled: true,
    },
    country: {
        value: '',
        options: [],
        onChange: () => {},
        disabled: true,
    },
    city: {
        value: '',
        options: [],
        onChange: () => {},
        disabled: true,
    },
    phone: {
        value: '',
        onChange: () => {},
        disabled: true,
    },
    type_document_purchase_manager: {
        value: '',
        options: [],
        onChange: () => {},
        disabled: true,
    },
    payment_type: {
        value: '',
        options: [],
        onChange: () => {},
        disabled: true,
    },
    type_taxpayer: {
        value: '',
        options: [],
        onChange: () => {},
        disabled: true,
    },
    tax_detail: {
        value: '',
        options: [],
        onChange: () => {},
        disabled: true,
    },
    seller_type_document: {
        value: '',
        options: [],
        onChange: () => {},
        disabled: true,
    },
    seller_document_number: {
        value: '',
        onChange: () => {},
        disabled: true,
    },
    type_tax_payer: {
        value: '',
        options: [],
        onChange: () => {},
        disabled: true,
    },
};

export const init_fields_table_corrections: IFields = {
    number: {
        value: '',
        onChange: () => {},
        disabled: true,
    },
    sku: {
        value: '',
        options: [],
        onChange: () => {},
        disabled: true,
    },
    element: {
        value: '',
        options: [],
        onChange: () => {},
        disabled: true,
    },
    warehouse: {
        value: '',
        options: [],
        onChange: () => {},
        disabled: true,
    },
    lot: {
        value: '',
        options: [],
        onChange: () => {},
        disabled: true,
    },
    date: {
        value: '',
        onChange: () => {},
        disabled: true,
    },
    description: {
        value: '',
        onChange: () => {},
        disabled: true,
    },
    quantity: {
        value: '',
        onChange: () => {},
        disabled: true,
    },
    measurement: {
        value: '',
        onChange: () => {},
        disabled: true,
    },
    unit_value: {
        value: 0,
        onChange: () => {},
        disabled: true,
    },
    sale: {
        value: 0,
        onChange: () => {},
        disabled: true,
    },
    discount: {
        value: 0,
        onChange: () => {},
        disabled: true,
    },
    send_cost: {
        value: 0,
        onChange: () => {},
        disabled: true,
    },
    sale_cost: {
        value: 0,
        onChange: () => {},
        disabled: true,
    },
    percentage: {
        value: 0,
        onChange: () => {},
        disabled: true,
    },
    iva: {
        value: 0,
        onChange: () => {},
        disabled: true,
    },
    check: {
        value: '',
        onChange: () => {},
        disabled: true,
    },
};

/**
 * Initial data fields disabled from taxes table
 */
export const init_fields_tax_table_corrections: IFields = {
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
