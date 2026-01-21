import { validate as uuidValidate } from 'uuid';
import { NA } from '@components/table';
import { Section } from '@components/bread-crumb';
import {
    CITIES,
    COUNTRIES,
    DEPARTMENTS,
    DOCUMENT_TYPES,
    FISCAL_RESPONSIBILITIES,
    FOREIGN_EXCHANGE,
    PAYMENT_METHODS,
    PAYMENT_TYPES,
    TAX_DETAILS,
    TYPE_TAX_PAYER,
} from '@constants/UtilsConstants';
import { Routes } from '@constants/Paths';
import { MODULE_TITLES } from '@constants/ElectronicDocuments';
import { COLOMBIAN_CURRENCY_ID, DEFAULT_LANG, PURCHASE_SUPPLIER } from '@constants/ElectronicInvoice';
import { Form } from '@models/ElectronicDocuments';
import { IGenericRecord } from '@models/GenericRecord';
import { IInvoiceDetails } from '@models/ElectronicInvoice';
import { FieldName, IFormPurchaseInvoice } from '@models/PurchaseInvoice';
import { formatTime } from '@utils/TimePicker';
import { getRoute, getRouteName } from '@utils/Paths';
import { getDateISO8601ToDate, getUnixFromDate } from '@utils/Date';
import { COLOMBIAN_PESO } from '@constants/SupportDocument';
import { discardUntaxed, valueToRate } from '@utils/ElectronicInvoice';

export { default } from './GeneratePurchaseInvoice';

/**
 * Routes for the breadcrumb
 *
 * @returns Section[]
 */
export const getRoutes = (queryParam: string): Section[] => {
    const routes = [
        {
            name: getRouteName(Routes.ELECTRONIC_DOCUMENTS),
            route: getRoute(Routes.ELECTRONIC_DOCUMENTS),
            routeIndex: Routes.ELECTRONIC_DOCUMENTS,
        },
        {
            name: MODULE_TITLES.INVOICE,
            route: '#',
        },
    ];
    if (uuidValidate(queryParam)) {
        return routes.concat([
            {
                route: '#',
                name: 'Editar factura de compra',
            },
        ]);
    }
    routes.push({
        name: getRouteName(Routes.GENERATE_PURCHASE_INVOICE),
        route: getRoute(Routes.GENERATE_PURCHASE_INVOICE),
        routeIndex: Routes.GENERATE_PURCHASE_INVOICE,
    });
    if (queryParam === Form.Supplier) {
        routes.push({ name: 'Agregar proveedor', route: '#' });
    }
    if (queryParam === Form.EditSupplier) {
        routes.push({ name: 'Editar proveedor', route: '#' });
    }
    if (queryParam === Form.Taxes) {
        routes.push({ name: 'Agregue los impuestos', route: '#' });
    }
    return routes;
};

/**
 * Pad to format numbers
 */
export const PAD_NUMBER = 3;

/**
 * Max lenght input
 */
export const FIFTY = 50;

/**
 * Number zero for validations
 */
export const ZERO = 0;

/**
 * Type prefix document
 */
export const TYPE_PREFIX = 'PURCHASE_SUPPLIER';

/**
 * This formats the invoice request
 *
 * @param data: IGenericRecord - Invoice data
 *
 * @returns IGenericRecord
 */
export const formatRequestData = (
    { formData: { foreign_exchange_rate, ...formData }, tableData, user }: IGenericRecord,
    productsStock: IGenericRecord[]
): IGenericRecord => ({
    ...formData,
    foreign_exchange_rate: foreign_exchange_rate || 0,
    supplier: formData.supplier,
    products: tableData.map(({ warehouse_name, batch_number, ...item }: IInvoiceDetails) => {
        const isNAWarehouse = warehouse_name === NA;
        const isNABatch = batch_number === NA;
        const productFind = productsStock.find(stock => stock.sku_internal === item.sku_internal) || {};
        const taxes = discardUntaxed(productFind.unique_product_taxes);

        return {
            ...item,
            batch: isNABatch ? null : batch_number,
            batch_id: isNABatch ? null : item.batch_id,
            warehouse_name: isNAWarehouse ? null : warehouse_name,
            warehouse_id: isNAWarehouse ? null : item.warehouse_id,
            product_taxes: taxes.map(valueToRate(foreign_exchange_rate)),
            date_expiration: isNABatch ? null : getDateISO8601ToDate(item.date_expiration || ''),
            taxes: taxes.map(({ company_tax_id, tax_value }) =>
                valueToRate(foreign_exchange_rate)({ company_tax_id, tax_value })
            ),
        };
    }),
    sending_charge: formData.sending_charge ?? ZERO,
    total: formData.total ?? ZERO,
    total_discount: (formData.totalDiscounts || formData?.total_discount) ?? ZERO,
    total_invoice: formData?.total_sale - formData?.total_discount,
    total_sale: formData?.total_sale ?? ZERO,
    total_sale_value: formData?.total + (formData.retefuente + formData.reteica + formData.reteiva) || ZERO,
    total_impoconsumption: formData.total_impoconsumption ?? ZERO,
    is_paid: true,
    retefuente: formData.retefuente ?? ZERO,
    reteica: formData.reteica ?? ZERO,
    reteiva: formData.reteiva ?? ZERO,
    document_uuid: formData?.cufe,
    document_type_purchasing_manager: formData?.document_type_purchasing_manager_id,
    employee_id: user?.id,
    supplier_invoice_number: formData?.[FieldName.InvoiceNumber],
    invoice_type: PURCHASE_SUPPLIER,
});

/**
 * Required form fields
 */
export const REQUIRED_FORM_FIELDS = (data: IGenericRecord): string[] => [
    FieldName.Cufe,
    FieldName.InvoiceNumber,
    FieldName.Prefix,
    FieldName.BroadcastDate,
    FieldName.Supplier,
    FieldName.PaymentMethod,
    FieldName.ForeignExchange,
    ...(data?.foreign_exchange_id !== COLOMBIAN_CURRENCY_ID ? [FieldName.ForeignExchangeRate] : []),
];

/**
 * Required table fields
 */
export const REQUIRED_TABLE_FIELDS = [
    {
        name: FieldName.Sku,
        value: 'SKU/Código - Producto/Servicio',
    },
    {
        name: FieldName.Quantity,
        value: 'Cantidad',
    },
    {
        name: FieldName.Warehouse,
        value: 'Bodega',
    },
    {
        name: FieldName.Batch,
        value: 'Lote',
    },
    {
        name: FieldName.DateExpiration,
        value: 'Fecha de vencimiento',
    },
    {
        name: FieldName.UnitCost,
        value: 'Costo unitario',
    },
];

/**
 * Initial invoice data
 */
export const INITIAL_INVOICE: IFormPurchaseInvoice = {
    lang: DEFAULT_LANG,
    date: getUnixFromDate(),
    is_draft: false,
    time_issue: formatTime(),
    expiration_date: getUnixFromDate(),
    collection_days: '',
    cufe: '',
    days_collection_type: '',
    document_number_sales_manager: '',
    document_type_purchasing_manager: '',
    document_type_purchasing_manager_id: '',
    document_uuid: '',
    employee_id: '',
    foreign_exchange_id: COLOMBIAN_CURRENCY_ID,
    foreign_exchange_name: COLOMBIAN_PESO,
    foreign_exchange_rate: 0,
    internal_notes: '',
    is_paid: true,
    note: '',
    number_purchase_order: '',
    logo: {},
    urlLogo: '',
    payment_method: '',
    payment_method_id: '',
    payment_type_id: '',
    payment_type_name: '',
    person_id: '',
    prefix: '',
    prefix_id: '',
    sales_manager: '',
    supplier: {
        name: '',
        address: '',
        cellphone: '',
        city_id: null,
        city_name: '',
        company_id: '',
        country_id: null,
        country_name: '',
        department_id: null,
        department_name: '',
        document_name: '',
        document_number: '',
        document_type: '',
        electronic_biller: false,
        email: '',
        fiscal_responsibilities: [],
        id: '',
        indications_address: '',
        phone: '',
        postal_code: '',
        type_taxpayer_id: '',
        type_taxpayer_name: '',
    },
    supplier_id: '',
    supplier_invoice_number: '',
};

/**
 * Key used to save the invoice image
 */
export const INVOICE_LOGO = 'logo-invoice';

/**
 * Used for get all utils utilized in generate purchase
 */
export const GET_UTILS = [
    PAYMENT_TYPES,
    PAYMENT_METHODS,
    FOREIGN_EXCHANGE,
    DOCUMENT_TYPES,
    COUNTRIES,
    DEPARTMENTS,
    CITIES,
    TYPE_TAX_PAYER,
    TAX_DETAILS,
    FISCAL_RESPONSIBILITIES,
];
