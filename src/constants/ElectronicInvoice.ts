import { v4 as uuid } from 'uuid';
import { ITableProps } from '@components/table';
import { IEntity } from '@components/radiobutton';
import { IDataTableTotals } from '@components/table-totals';
import { IRadioButtons } from '@hooks/useRadioButton';
import { IFieldsAssign } from '@models/SupportDocument';
import { ITableTaxesAndRetention, KeysInvoiceCalculates } from '@models/ElectronicInvoice';
import { ElementType, generateId, ModuleApp, ActionElementType } from '@utils/GenerateId';
import { CREDIT_NOTE_SUPPLIER, DEBIT_NOTE_SUPPLIER } from './PurchaseInvoiceNotes';

export const MORE_RECENT = 'MORE_RECENT';
export const LESS_RECENT = 'LESS_RECENT';
export const CORRECT = 'CORRECT';
export const COMPLETE_SALE = 'COMPLETE_SALE';
export const NA = 'N/A';
export const INC_EXCLUDED_ID = '1c0849d0-c505-4a53-a4fa-af948dc4df13';
export const IVA_EXCLUDED_ID = '0b9849d0-c505-4a53-a4fa-af948dc4de02';
export const SUPPORTING_DOCUMENT = 'SUPPORTING_DOCUMENT';
export const VOUCHER_PURCHASE = 'VOUCHER_PURCHASE';
export const INVOICE = 'INVOICE';
export const QUOTE = 'QUOTE';
export const DEBIT_NOTE = 'DEBIT_NOTE';
export const CREDIT_NOTE = 'CREDIT_NOTE';
export const ADJUSTMENT_NOTE = 'ADJUSTMENT_NOTE';
export const PURCHASE_SUPPLIER = 'PURCHASE_SUPPLIER';
export const IN_VERIFICATION = 'IN_VERIFICATION';
export const RETE_FUENTE = '06 Retefuente';
export const RETE_ICA = '07 ReteICA';
export const RETE_IVA = '08 ReteIVA';

export enum DOCUMENT_TYPE_REQUIRE {
    DEBIT_NOTE = 'Nota débito',
    INVOICE = 'Factura electrónica de venta',
    QUOTE = 'Cotización',
    CREDIT_NOTE = 'Nota crédito',
    ADJUSTMENT_NOTE = 'Nota de ajuste',
    SUPPORT_DOCUMENT = 'Documento soporte',
}

export enum SIGNER_ROLE {
    SUPPLIER = 'supplier',
    THIRD_PARTY = 'third party',
}

export enum DOCUMENT_TYPE_ISSUED {
    INVOICE = 'Factura electrónica',
    NO_INVOICE = 'Factura no electrónica',
    CREDIT_NOTE = 'Nota crédito',
    DEBIT_NOTE = 'Nota débito',
    ADJUSTMENT_NOTE = 'Nota de ajuste',
    PURCHASE_ORDER = 'Archivo XML',
}

export enum DIAN_RESPONSE {
    IN_VERIFICATION = 'En verificación',
    CONTINGENCY = 'Contingencia',
    ACCEPTED = 'Aceptada',
    REJECTED_DIAN = 'Rechazada',
    PENDING_DIAN = 'Pendiente',
    ERROR_DIAN = 'Rechazada',
    ERROR_CCXC = 'Rechazada',
    ACCEPTED_NO_EMAIL_SENT = 'Aceptada',
    null = 'Pendiente',
}

export enum DocumentTraceability {
    IN_VERIFICATION = 'IN_VERIFICATION',
    CONTINGENCY = 'CONTINGENCY',
    ERROR_CCXC = 'ERROR_CCXC',
    REJECTED_DIAN = 'REJECTED_DIAN',
    ACCEPTED_NO_EMAIL_SENT = 'ACCEPTED_NO_EMAIL_SENT',
    ACCEPTED = 'ACCEPTED',
    REJECTED_CLIENT = 'REJECTED_CLIENT',
}

export enum CUSTOMER_RESPONSE {
    REJECTED_CLIENT = 'Rechazada',
    ACCEPTED = 'Aceptada',
    IN_VERIFICATION = 'En verificación',
    NA = 'N/A',
    VOIDED = 'Anulado',
    null = 'Pendiente',
}

export enum ACTION_REQUIRE {
    NA = 'N/A',
    CORRECT = 'Corregir',
    COMPLETE_SALE = 'Verificar venta finalizada',
}

export enum CHANNEL_REQUIRE {
    PHYSICAL_STORE = 'Tienda física',
    WEBSITE = 'Tienda virtual',
    SOCIAL_MEDIA = 'Redes sociales',
    MARKETING = 'Marketing',
}

export enum AGGREGATION_METHOD {
    XML_FILE = 'Archivo XML',
    ELECTRONICS = 'Electrónica',
    NO_ELECTRONICS = 'No electrónica',
}

export enum typeInvoice {
    NO_ELECTRONICS = 'NO_ELECTRONICS',
    ELECTRONICS = 'ELECTRONICS',
}

export const SELF_RETAINING_OPTIONS = [
    {
        name: 'RETEIVA',
        label: 'Retención de IVA',
    },
    {
        name: 'RETEICA',
        label: 'Retención de ICA',
    },
    {
        name: 'RETEFUENTE',
        label: 'Retención en la fuente',
    },
];

export const WITHHOLDINGS = [
    {
        is_active: false,
        name: 'RETEIVA',
    },
    {
        is_active: false,
        name: 'RETEICA',
    },
    {
        is_active: false,
        name: 'RETEFUENTE',
    },
];

export const NATURAL_RESPONSIBILITIES = ['O-47 Régimen simple de tributación SIMPLE', 'R-99-PN No aplica - Otros'];

export enum EDIT_INPUTS {
    WAREHOUSE_INPUT = 'WAREHOUSE_INPUT',
    BATCH_INPUT = 'BATCH_INPUT',
    DATE_INPUT = 'DATE_INPUT',
}

export const initialStateFiscalResponsibilities = {
    uuid: uuid(),
    id: '',
    key: '',
    value: '',
    fiscal_responsibility_name: '',
};

export const EMPTY_TABLE = '*No tiene productos agregados';

export const TYPE_TAXPAYER = 'type_taxpayer';
export const TYPE_TAX_PAYER_ID = 'type_taxpayer_id';
export const SELECTED = 'Seleccione...';
export const TAX_TYPE = 'tax_type';
export const THREE_ZERO = '000';
export const CLIENT = 'client';
export const CIIU_ID_TWO = '2';
export const VALUE_ZERO = '0';
export const PERCENTAGE_ZERO = '0%';
export const COP = 'COP';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const defaultStateSelectedTimepicker: any = { hour: false, minutes: false, seconds: false, schedule: false };

interface IContentTable {
    paragraphs: string[] | JSX.Element[];
    images: string[];
}

export type ITableInformationProps = ITableProps & IContentTable;

export interface ITableInformation {
    [key: string]: ITableInformationProps;
}

export interface ISubInformationProps {
    init: number;
    finish: number;
    isInvoice: boolean;
}

export enum TypeTablesInstructions {
    QUALIFICATION_TABLE_ONE = 'QUALIFICATION_TABLE_ONE',
    QUALIFICATION_TABLE_TWO = 'QUALIFICATION_TABLE_TWO',
}

export enum TEXT_DROPDOWN {
    ONE_TEXT,
    TWO_TEXT,
    THREE_TEXT,
    FOUR_TEXT,
    FIVE_TEXT,
    SIX_TEXT,
    ONE_TEXT_SUPPORT,
    TWO_TEXT_SUPPORT,
}

export const LIMIT_TEXT = {
    [TEXT_DROPDOWN.ONE_TEXT]: {
        init: 0,
        finish: 4,
    },
    [TEXT_DROPDOWN.TWO_TEXT]: {
        init: 4,
        finish: 10,
    },
    [TEXT_DROPDOWN.THREE_TEXT]: {
        init: 10,
        finish: 11,
    },
    [TEXT_DROPDOWN.FOUR_TEXT]: {
        init: 11,
        finish: 14,
    },
    [TEXT_DROPDOWN.FIVE_TEXT]: {
        init: 14,
        finish: 16,
    },
    [TEXT_DROPDOWN.SIX_TEXT]: {
        init: 20,
        finish: 24,
    },
    [TEXT_DROPDOWN.ONE_TEXT_SUPPORT]: {
        init: 0,
        finish: 3,
    },
    [TEXT_DROPDOWN.TWO_TEXT_SUPPORT]: {
        init: 16,
        finish: 20,
    },
};

export const MAX_NUMBER_SIX = 6;

export enum MaxLengthFields {
    ZERO = 0,
    ORDER = 9,
    PHONE = 10,
    Name = 240,
    PREFIX = 20,
    DOCUMENT = 10,
    POSTAL_CODE = 6,
    PHONE_DAYS = 10,
    STATE_CITY = 60,
    DESCRIPTION = 1000,
    OBSERVATIONS = 1500,
    FOREIGN_EXCHANGE = 3,
    PERCENTAGE_DISCOUNT = 100,
    FOREIGN_EXCHANGE_RATE = 14,
    DS_PERCENTAGE_DISCOUNT = 99,
}

export const CONSUMER_CLIENT_DOCUMENT = '222222222222';

export const CUSTOMER_CONSUMER_DEFAULT = {
    client_id: '1c69a81f-f072-4715-bbce-6997cdf5b851',
    company_device_id: null,
    company_device_name: null,
    created_at: '2023-07-06T14:57:34.000000Z',
    deleted_at: null,
    description: null,
    id: '07ee58bc-f1cf-4f6d-96ef-c87ec72b8aef',
    last_name: null,
    name: 'Consumidor final',
    person: {
        address: null,
        cellphone: null,
        city_id: null,
        city_name: null,
        company_id: '83e80ae5-affc-32b4-b11d-b4cab371c48b',
        company_name: null,
        country_id: null,
        country_name: null,
        created_at: '2023-06-22T18:56:26.000000Z',
        department_id: null,
        department_name: null,
        document_number: '222222222222',
        document_type: 'f73f5793-795e-33db-9115-95437f9ecaea',
        document_name: 'CC',
        electronic_biller: false,
        email: null,
        fiscalResposibilities: [{ id: 5, name: 'R-99-PN No aplica - Otros', code: 'R-99-PN', meaning: 'Gran contribuyente' }],
        fiscal_resposibilities: [
            {
                fiscal_responsibility_id: 5,
                fiscal_responsibility_name: 'R-99-PN No aplica - Otros',
                id: '52ad430b-97fa-4949-8032-200d8d643b31',
                person_id: 'b3f96558-f0bf-4f39-b103-c7a0dea7b6a1',
                withholdings: [],
            },
        ],
        id: 'b3f96558-f0bf-4f39-b103-c7a0dea7b6a1',
        indications_address: null,
        phone: null,
        postal_code: null,
        type_taxpayer_id: 'c8dfbea8-11ca-35bb-bea2-3dc15b66af64',
        type_taxpayer_name: 'Persona natural',
        updated_at: '2023-07-14T20:00:51.000000Z',
    },
    updated_at: '2023-07-14T20:00:51.000000Z',
    person_id: 'b3f96558-f0bf-4f39-b103-c7a0dea7b6a1',
    receive_email: false,
    receive_printed_invoice: false,
    tax_details_code: 'ZZ',
    tax_details_name: 'No aplica',
};

export const defaultData = {
    reasonRejection: {
        id: '3f0cd416-b195-4191-8f1f-958ecc8628f3',
        value: 'Otros',
    },
};

export enum TotalTableKeys {
    TOTAL_IVA = 'total_iva',
}

export const QuoteToInvoiceKeys: IFieldsAssign = {
    tree: {
        person: [
            { keyOrigin: 'document_type' },
            { keyOrigin: 'document_type_name' },
            { keyOrigin: 'document_number' },
            { keyOrigin: 'fiscal_responsibilities' },
            {
                keyOrigin: 'customer',
                skip: true,
                children: {
                    tree: {
                        customer: [
                            { keyOrigin: 'name' },
                            { keyOrigin: 'tax_details_code' },
                            { keyOrigin: 'tax_details_name' },
                            { keyOrigin: 'receive_products' },
                        ],
                    },
                },
            },
            { keyOrigin: 'email' },
            { keyOrigin: 'address' },
            { keyOrigin: 'address', keyValue: 'company_address' },
            {
                keyOrigin: 'address',
                keyValue: 'send_address',
            },
            { keyOrigin: 'country_id' },
            { keyOrigin: 'country_name' },
            { keyOrigin: 'department_id' },
            { keyOrigin: 'department_name' },
            { keyOrigin: 'city_id' },
            { keyOrigin: 'city_name' },
            { keyOrigin: 'postal_code' },
            { keyOrigin: 'postal_code', keyValue: 'company_postal_code' },
            { keyOrigin: 'phone' },
            { keyOrigin: 'type_taxpayer_id' },
            { keyOrigin: 'type_taxpayer_name' },
            { keyOrigin: 'electronic_biller' },
        ],
    },
    base: [
        { keyOrigin: 'country_id' },
        { keyOrigin: 'country_name' },
        { keyOrigin: 'department_id' },
        { keyOrigin: 'department_name' },
        { keyOrigin: 'city_id' },
        { keyOrigin: 'city_name' },
        { keyOrigin: 'postal_code' },
        { keyOrigin: 'person_id' },
        { keyOrigin: 'payment_method_id' },
        { keyOrigin: 'payment_method_name' },
        { keyOrigin: 'payment_type_id' },
        { keyOrigin: 'payment_type_name' },
        { keyOrigin: 'foreign_exchange_id' },
        { keyOrigin: 'foreign_exchange_name' },
        { keyOrigin: 'note' },
        { keyOrigin: 'invoice_details' },
        { keyOrigin: 'taxes' },
        { keyOrigin: 'withholdings' },
        { keyOrigin: 'sending_charge' },
        { keyOrigin: 'number_purchase_order' },
        { keyOrigin: 'document_number_sales_manager' },
        { keyOrigin: 'document_type_name_sales_manager', keyValue: 'document_type_sales_manager_name' },
        { keyOrigin: 'document_type_sales_manager' },
        { keyOrigin: 'sales_manager' },
        { keyOrigin: 'days_collection' },
    ],
};

/**
 * This const is structure radio button component
 */
export const dataRadioButton: IEntity[] = [
    {
        name: 'yes',
        label: 'Sí',
        labelElement: 'Si',
    },
    {
        name: 'no',
        label: 'No',
    },
];

/**
 * This enum are the names of radio buttons
 */
export enum RadioButtonName {
    AuthorizedInformation = 'authorized_information',
    IsElectronicCustomer = 'is_electronic_customer',
    InvoiceEmail = 'invoice_email',
    SendProducts = 'send_products',
}

/**
 * This const is for state radio buttons
 */
export const radioButtonList: IRadioButtons = {
    [RadioButtonName.AuthorizedInformation]: '',
    [RadioButtonName.IsElectronicCustomer]: '',
    [RadioButtonName.InvoiceEmail]: '',
    [RadioButtonName.SendProducts]: '',
};

/**
 * This const is for assign value
 */
export const radioButtonKeys: { [keys: string]: string } = {
    [RadioButtonName.IsElectronicCustomer]: 'electronic_biller',
    [RadioButtonName.InvoiceEmail]: 'receive_email',
    [RadioButtonName.SendProducts]: 'receive_products',
    [RadioButtonName.AuthorizedInformation]: 'is_authorization_information',
};

/**
 * This const is for business days
 */
export const textBusinessDays = 'Días hábiles';

/**
 * This constant is for the aunts radio button type
 */
export const RadioDaysCollectionType: IEntity[] = [
    {
        name: textBusinessDays,
        label: textBusinessDays,
        labelClass: 'w-26.4 xs:w-full',
    },
    {
        name: 'Días calendario',
        label: 'Días calendario',
        labelClass: 'w-32.4 xs:w-full',
    },
];

/**
 * Data fake from taxes table
 */
export const DATA_TAXES: ITableTaxesAndRetention[] = [
    {
        name: '01 IVA',
        base: 0,
        percentage: 19,
        value: 0,
        isTax: true,
        isSelectInput: false,
    },
    {
        name: '02 IVA',
        base: 0,
        percentage: 16,
        value: 0,
        isTax: true,
        isSelectInput: false,
    },
    {
        name: '03 IVA',
        base: 0,
        percentage: 5,
        value: 0,
        isTax: true,
        isSelectInput: false,
    },
    {
        name: '04 IVA',
        base: 0,
        label: 'Exento (0%)',
        percentage: 0,
        value: 0,
        isTax: true,
        isLabel: true,
        isSelectInput: false,
    },
    {
        name: '05 IVA',
        base: 0,
        label: 'Excluido',
        percentage: 0,
        isTax: true,
        value: 0,
        isSelectInput: false,
        isLabel: true,
    },
];

/**
 * Data fake from retentions table
 *
 * @param isSupportOrDocument: boolean - Optional param to validate retention
 * @return ITableTaxesAndRetention[]
 */
export const DATA_WITHHOLDINGS = (isSupportOrDocument = false): ITableTaxesAndRetention[] => [
    {
        name: '06 Retefuente',
        base: 0,
        percentage: 0,
        value: 0,
        isTax: false,
        disabled: false,
        isSelectInput: false,
    },
    {
        name: '07 ReteICA',
        base: 0,
        percentage: 0,
        isTax: false,
        value: 0,
        disabled: false,
        isSelectInput: false,
        omitElement: isSupportOrDocument,
    },
    {
        name: '08 ReteIVA',
        base: 0,
        percentage: 0,
        isTax: false,
        value: 0,
        disabled: false,
        isSelectInput: true,
    },
];

/**
 * Data fake from total values
 */
export const DATA_TOTAL_VALUES: KeysInvoiceCalculates = {
    subtotal: 0,
    total_discount: 0,
    total_charge_amount: 0,
    total_gross: 0,
    total_iva: 0,
    total_inc: 0,
    total_ibua: 0,
    total_icui: 0,
    total_payable: 0,
    retefuente: 0,
    reteica: 0,
    reteiva: 0,
    total: 0,
};

/**
 * This interface is to params to table totals
 *
 * @typeParam isInvoice?: boolean - Optional param to validate
 * @typeParam isSupportOrDocument?: boolean - Optional param to validate
 * @typeParam isPurchaseInvoice?: boolean - Optional param to validate
 */
interface IParamsToTableTotals {
    isInvoice?: boolean;
    isSupportOrDocument?: boolean;
    isPurchaseInvoice?: boolean;
}

/**
 * Titles from total table
 *
 * @param 0param: boolean - Optional param for type document
 * @return IDataTableTotals[]
 */
export const DATA_TABLE_TOTALS = ({
    isInvoice = false,
    isSupportOrDocument = false,
    isPurchaseInvoice = false,
}: IParamsToTableTotals): IDataTableTotals[] => [
    {
        id: generateId({
            module: ModuleApp.ELECTRONIC_INVOICE,
            submodule: `${ModuleApp.TABLE}-totals-subtotal`,
            action: ActionElementType.INPUT,
            elementType: ElementType.TXT,
        }),
        title: 'Subtotal',
        field: 'subtotal',
        disabled: true,
        value: 0,
        className: 'body__bg-green',
    },
    {
        id: generateId({
            module: ModuleApp.ELECTRONIC_INVOICE,
            submodule: `${ModuleApp.TABLE}-totals-total-discount`,
            action: ActionElementType.INPUT,
            elementType: ElementType.TXT,
        }),
        title: 'Total descuento',
        field: 'total_discount',
        symbol: '-',
        disabled: true,
        value: 0,
        className: '',
    },
    {
        id: generateId({
            module: ModuleApp.ELECTRONIC_INVOICE,
            submodule: `${ModuleApp.TABLE}-totals-shipping-cost`,
            action: ActionElementType.INPUT,
            elementType: ElementType.TXT,
        }),
        title: 'Costo de envío',
        field: 'total_charge_amount',
        disabled: false,
        value: 0,
        className: '',
        omitElement: isPurchaseInvoice,
    },
    {
        id: generateId({
            module: ModuleApp.ELECTRONIC_INVOICE,
            submodule: `${ModuleApp.TABLE}-totals-total-sale-value`,
            action: ActionElementType.INPUT,
            elementType: ElementType.TXT,
        }),
        title: 'Total bruto',
        field: 'total_gross',
        disabled: true,
        value: 0,
        className: 'body__bg-green',
    },
    {
        id: generateId({
            module: ModuleApp.ELECTRONIC_INVOICE,
            submodule: `${ModuleApp.TABLE}-totals-total-payable`,
            action: ActionElementType.INPUT,
            elementType: ElementType.TXT,
        }),
        title: `Total neto ${isInvoice ? 'factura' : ''}`,
        field: 'total_payable',
        disabled: true,
        value: 0,
        className: 'body__bg-green',
        omitElement: isPurchaseInvoice,
    },
    {
        id: generateId({
            module: ModuleApp.ELECTRONIC_INVOICE,
            submodule: `${ModuleApp.TABLE}-totals-retefuente`,
            action: ActionElementType.INPUT,
            elementType: ElementType.TXT,
        }),
        title: 'Retefuente',
        field: 'retefuente',
        symbol: '-',
        disabled: true,
        value: 0,
        className: '',
        omitElement: isPurchaseInvoice,
    },

    {
        id: generateId({
            module: ModuleApp.ELECTRONIC_INVOICE,
            submodule: `${ModuleApp.TABLE}-totals-reteica`,
            action: ActionElementType.INPUT,
            elementType: ElementType.TXT,
        }),
        title: 'ReteICA',
        field: 'reteica',
        symbol: '-',
        disabled: true,
        value: 0,
        className: '',
        omitElement: isSupportOrDocument || isPurchaseInvoice,
    },
    {
        id: generateId({
            module: ModuleApp.ELECTRONIC_INVOICE,
            submodule: `${ModuleApp.TABLE}-totals-reteiva`,
            action: ActionElementType.INPUT,
            elementType: ElementType.TXT,
        }),
        title: 'ReteIVA',
        field: 'reteiva',
        symbol: '-',
        disabled: true,
        value: 0,
        className: '',
        omitElement: isPurchaseInvoice,
    },
    {
        id: generateId({
            module: ModuleApp.ELECTRONIC_INVOICE,
            submodule: `${ModuleApp.TABLE}-totals-total`,
            action: ActionElementType.INPUT,
            elementType: ElementType.TXT,
        }),
        title: `Total ${isInvoice ? 'a pagar' : ''}`,
        field: 'total',
        disabled: true,
        value: 0,
        className: 'body__bg-green',
    },
];

/**
 * This const is item table total
 */
export const ITEM_TABLE_TOTAL: IDataTableTotals = {
    id: generateId({
        module: ModuleApp.ELECTRONIC_INVOICE,
        submodule: `${ModuleApp.TABLE}-totals`,
        action: ActionElementType.INPUT,
        elementType: ElementType.TXT,
    }),
    title: '',
    field: '',
    value: 0,
    className: '',
    disabled: true,
};

/**
 * Data initialization for state
 */
export const INVOICE_CALCULATES = {
    subtotal: 0,
    total_discount: 0,
    total_charge_amount: 0,
    total_gross: 0,
    total_iva: 0,
    total_inc: 0,
    total_ibua: 0,
    total_icui: 0,
    total: 0,
    total_payable: 0,
    retefuente: 0,
    reteica: 0,
    reteiva: 0,
    total_taxes: {
        IVA_19: 0,
        IVA_16: 0,
        IVA_8: 0,
        IVA_5: 0,
        IBUA: 0,
        ICUI: 0,
        INC_16: 0,
        INC_8: 0,
        INC_4: 0,
        INC_2: 0,
    },
    total_taxes_iva: {
        '01': 0,
        '02': 0,
        '03': 0,
        '04': 0,
        '05': 0,
    },
};

/**
 * Keys total table
 */
export const KEYS_TOTALS = [
    {
        keyOrigin: 'total_sale',
        keyValue: 'subtotal',
    },
    {
        keyOrigin: 'total_discount',
    },
    {
        keyOrigin: 'sending_charge',
        keyValue: 'total_charge_amount',
    },
    {
        keyOrigin: 'total_invoice',
        keyValue: 'total_gross',
    },
    {
        keyOrigin: 'total_iva',
    },
    {
        keyOrigin: 'total_icui',
    },
    {
        keyOrigin: 'total_ibua',
    },
    {
        keyOrigin: 'total_impoconsumption',
        keyValue: 'total_inc',
    },
    {
        keyOrigin: 'total_sale_value',
        keyValue: 'total_payable',
    },
    {
        keyOrigin: 'retefuente',
    },
    {
        keyOrigin: 'reteica',
    },
    {
        keyOrigin: 'reteiva',
    },
    {
        keyOrigin: 'total',
    },
];

/**
 * This const is for maximum digits
 */
export const MAXIMUM_DIGITS = 99;

/**
 * This const is validate range de percentage
 */
export const { TWO, THREE, FIVE, FIFTEEN, ONE_HUNDRED, THIRTY_THREE, TWENTY, ONE, NINE, TEN, ONE_THOUSAND } = {
    ONE: 1,
    TWO: 2,
    THREE: 3,
    FIVE: 5,
    NINE: 9,
    TEN: 10,
    TWENTY: 20.0,
    FIFTEEN: 15,
    ONE_HUNDRED: 100,
    THIRTY_THREE: 33.0,
    ONE_THOUSAND: 1000,
};

/**
 * This enum is for message table retentions
 */
export enum MESSAGE_RETENTIONS {
    RETE_FUENTE = 'Ingrese una tarifa de Retefuente de máximo 20%',
    RETE_ICA = 'Ingrese una tarifa de ReteICA de máximo 2%',
    RETE_IVA = 'Tarifa ReteIVA inválida',
}

/**
 * This enum is for keys table retentions
 */
export enum RETENTIONS {
    ICA = 'ICA',
    IVA = 'IVA',
    FUENTE = 'fuente',
}

/**
 * File types to upload
 */
export enum TypeFile {
    CERTIFICATE = 'certificate',
    LOGO_INVOICE = 'logo-invoice',
    LOGO_SUPPORT = 'logo-support-documents',
    LOGO = 'logo',
    RUT = 'RUT',
}

/**
 * This const is for taxes invoice key
 */
export const TAXES_INVOICE = 'taxes_invoice';

/**
 * This const content labels total tables
 */
export const LABELS_TOTAL_TAXES: { [key: string]: string } = {
    IVA_19: 'Total IVA 19%',
    IVA_16: 'Total IVA 16%',
    IVA_8: 'Total IVA 8%',
    IVA_5: 'Total IVA 5%',
    IVA_0: 'Total IVA 0%',
    IVA_EXCLUIDO: 'Total IVA Exento (0%)',
    IBUA: 'Total IBUA',
    ICUI: 'Total ICUI',
    INC_16: 'Total INC 2%',
    INC_8: 'Total INC 2% ',
    INC_4: 'Total INC 2%',
    INC_2: 'Total INC 2% ',
    INC_0: 'Total INC 0% ',
};

/**
 * Invoice types
 */
export const INVOICE_TYPES = [
    {
        key: 'Mandato',
        value: 'Mandato',
        code: '10',
        id: '645ce619-929b-36c2-b711-027fb2fe5b5a',
    },
    {
        key: 'Estándar',
        value: 'Estándar',
        code: '11',
        id: '9513b27d-f642-320c-a89c-07496841eb52',
    },
];

/*
 * This const is default language
 */
export const DEFAULT_LANG = 'es';

/**
 * This const is defaults option language
 */
export const DEFAULT_LANGUAGES = [{ name: 'Español', value: 'es' }];

/**
 * Document language options for quotes and invoices
 */
export const DOCUMENT_LANGUAGES = [
    { value: 'es', name: 'Español' },
    { value: 'en', name: 'English' },
] as const;

/**
 * Quote-specific constants for status management
 */
export const QUOTE_STATUS = {
    DRAFT: 'DRAFT',
    SENT: 'SENT',
    PENDING: 'PENDING',
    CONVERTED: 'CONVERTED',
    CANCELLED: 'CANCELLED',
} as const;

/**
 * Quote status display names for UI
 */
export const QUOTE_STATUS_LABELS = {
    [QUOTE_STATUS.DRAFT]: 'Borrador',
    [QUOTE_STATUS.SENT]: 'Enviado',
    [QUOTE_STATUS.PENDING]: 'Pendiente',
    [QUOTE_STATUS.CONVERTED]: 'Convertido',
    [QUOTE_STATUS.CANCELLED]: 'Cancelado',
} as const;

/**
 * Quote validation constants
 */
export const QUOTE_VALIDATION = {
    MAX_QUOTE_DAYS_VALID: 30,
    MIN_QUOTE_AMOUNT: 0,
    MAX_QUOTE_AMOUNT: 999999999,
    QUOTE_NUMBER_PREFIX: 'COT-',
    QUOTE_NUMBER_LENGTH: 10,
} as const;

/**
 * This const is validate currency id
 */
export const COLOMBIAN_CURRENCY_ID = '0e2346cd-2d32-3383-a762-203a9c013b02';

/**
 * This const is default fields
 */
export const DEFAULT_TYPE_PRODUCT = {
    warehouse_name: '',
    batch_number: '',
    date_expiration: '',
};

/**
 * This const is all notes
 */
export const ALL_NOTES = [ADJUSTMENT_NOTE, DEBIT_NOTE, CREDIT_NOTE, CREDIT_NOTE_SUPPLIER, DEBIT_NOTE_SUPPLIER];

/**
 * It is used to set the default value for each responsibility
 */
export const DEFAULT_RESPONSIBILITY = { id: '', name: '', withholdings: WITHHOLDINGS, date: new Date() };

/**
 * This enum is validate class name in DOM
 */
export enum ValidateClassName {
    Invoice = '.table-field--required',
    PrefixNote = '.table-prefix-required',
    ElectronicDocument = '.table-invoice--required',
    CorrectionNote = '.table-body-correction--required',
}

/**
 * This const is for the format date
 */
export const DATE_BACK_FORMAT = 'YYYY-MM-DD';

/**
 * Number formatting options for currency display
 */
export const OPTIONS_NUMBER_FORMAT = {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
    currency: 'COP',
} as const;
