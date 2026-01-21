export { default } from './SupportDocument';
import { Section } from '@components/bread-crumb';
import { typeInvoice } from '@constants/ElectronicInvoice';
import { Routes } from '@constants/Paths';
import { IGenericRecord } from '@models/GenericRecord';
import { getDateFormatUnix } from '@utils/Date';
import { getTimeIssue } from '@utils/ElectronicInvoice';
import { createNewJson } from '@utils/Json';
import { getRoute, getRouteName } from '@utils/Paths';

export enum TYPE_PAGE {
    PREVIEW = 'preview',
    SUPPORT = 'support',
}

export const routesBread = (page = '', isUuid: boolean): Section[] => {
    const route = [
        {
            name: getRouteName(Routes.SUPPORT_DOCUMENT_MENU),
            route: getRoute(Routes.SUPPORT_DOCUMENT_MENU),
        },
        {
            name: getRouteName(Routes.SUPPORT_DOCUMENT),
            route: getRoute(Routes.SUPPORT_DOCUMENT),
        },
    ];
    if (page && !isUuid)
        route.push({
            name: page === TYPE_PAGE.PREVIEW ? 'Previsualización' : 'Subir documento entregado por el proveedor',
            route: '',
        });
    return route;
};

export const titleButton = (page: string): string => {
    if (page === TYPE_PAGE.PREVIEW) return 'Transmitir';
    if (page === TYPE_PAGE.SUPPORT) return 'Guardar';
    return 'Previsualizar';
};

export const PREVIEW_DOCUMENT_SUPPORT = 'PREVIEW_DOCUMENT_SUPPORT';

export const SUPPORTING_DOCUMENT = 'SUPPORTING_DOCUMENT';

export const PAYMENT_METHOD_ID_BOND = '6a62da20-c0ca-4ad4-8c27-8f5e8a013ebb';

export const infoModalSave = {
    prefix: '',
    number: '',
    show: false,
};

export const formatRequestData = (data: IGenericRecord): IGenericRecord => {
    const requestData = createNewJson(data);
    Object.keys(data).forEach(key => {
        if (!data[key] && typeof data[key] === 'string') requestData[key] = null;
    });
    return requestData;
};

export const FILE = [{ name: 'certificate', files: [] }];

export const TYPES_FILE = ['application/pdf', 'image/jpg', 'image/jpeg', 'image/png'];

/**
 * This const is structure data device
 */
const DEFAULT_COMPANY_DEVICE = {
    company_device_id: null,
    company_device_name: null,
};

/**
 * This cons is structure field client
 */
const FIELDS_DEFAULT_CLIENT: IGenericRecord = {
    email: '',
    send_address: '',
    address: '',
    country_id: null,
    country_name: '',
    department_id: null,
    department_name: '',
    city_id: null,
    city_name: '',
    postal_code: '',
    phone: '',
    type_taxpayer_id: '',
    electronic_biller: false,
    not_information_customer: false,
    receive_printed_invoice: false,
    receive_email: false,
    receive_device: false,
    receive_products: false,
    payment_type_id: '',
    payment_type_name: '',
    payment_method_id: '',
    days_collection: '',
    days_collection_type: '',
    reload: false,
    ...DEFAULT_COMPANY_DEVICE,
};

/**
 * This const is structure for create invoice
 */
export const INPUTS_STATE_ELECTRONIC_INVOICE: IGenericRecord = {
    ...FIELDS_DEFAULT_CLIENT,
    prefix_id: '', //Required when apply_electronic_invoice == true
    prefix_id_name: null,
    number_max: 2000,
    number: null,
    foreign_exchange_id: null,
    foreign_exchange_name: null,
    date: getDateFormatUnix(String(new Date())).formatYearMonthDay,
    time_issue: getTimeIssue(),
    date_limit: null,
    number_purchase_order: '',
    purchasing_manager: '',
    document_number_purchasing_manager: '',
    document_type_purchasing_manager: '',
    sales_manager: '',
    document_number_sales_manager: '',
    document_type_sales_manager: '',
    note: '',
    total_sale: null,
    total_discount: null,
    sending_charge: null,
    total_sale_value: null,
    total_iva: null,
    total_impoconsumption: null,
    retefuente: null,
    reteica: null,
    reteiva: null,
    total: null,
    electronic_billing: true,
    sale_channel: 'PHYSICAL_STORE',
    total_invoice: null,
    is_paid: true,
    is_electronic_invoice: true,
    apply_deductible: false,
    products: [],
    source_type: 'CUSTOMERS',
    aggregation_method: typeInvoice.ELECTRONICS,
    invoice_state: 'ACCEPTED',
    apply_electronic_invoice: true,
    invoice_type: 'INVOICE',
    company_address: '',
    company_postal_code: null,
    onSubmit: false,
    loaded_inventory: false,
};
