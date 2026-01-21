import { ChangeEvent, IPropsInput } from '@components/input';
import { IOption } from '@components/select-search';
import { TOOLTIP_DATA } from '@information-texts/GeneratePurchaseInvoice';
import { INFORMATION } from '@information-texts/Invoice';
import { IGenericRecord } from '@models/GenericRecord';
import { IInvoiceDetails } from '@models/ElectronicInvoice';
import { FieldName, IFormPurchaseInvoice } from '@models/PurchaseInvoice';
import { removeThousandsPoint } from '@utils/Decimals';
import { generateId, ModuleApp, ActionElementType, ElementType } from '@utils/GenerateId';
import { FIFTY } from '..';
export { InvoiceForm } from './InvoiceForm';
export { OptionalFields } from './OptionalFields';
export { ProductsTable } from './ProductsTable';
export { Totals } from './Totals';

/**
 * This interface describes the props of the form fields
 *
 * @typeParam data: IGenericRecord - Form data
 * @typeParam handleValueChange: (e: ChangeEvent) => void - Function to handle value change
 * @typeParam updateData: (data: IGenericRecord) => void- Function to update invoice data
 * @typeParam utils: IGenericRecord - Field utils
 */
export interface IFieldsProps {
    data: IFormPurchaseInvoice;
    handleValueChange: (e: ChangeEvent) => void;
    updateData: (data: IFormPurchaseInvoice) => void;
    utils: IGenericRecord;
}

/**
 * This interface describes the props of the invoice form
 *
 * @typeParam openForm: () => void - Function to open the add people form
 * @typeParam validate: boolean - This indicates the time to validate the form
 * @typeParam validationError: string[] - Error backend's
 */
export interface IInvoiceFormProps extends IFieldsProps {
    openForm: () => void;
    validate: boolean;
    validationError: string[];
}

/**
 * This interface describes the props of the product table
 *
 * @typeParam data: IGenericRecord - Form data
 * @typeParam updateData: (e: ChangeEvent) => void - Function to update data
 * @typeParam errorMessages: string[] - Error messages
 * @typeParam validate: boolean - This indicates the time to validate the form
 * @typeParam handleGoToAddTaxes: (product: IGenericRecord) => void - Function for set product to add taxes
 */
export interface IProductTableProps {
    data: IGenericRecord[];
    updateData: (data: IGenericRecord[]) => void;
    errorMessages: string[];
    validate: boolean;
    handleGoToAddTaxes: (product: IGenericRecord) => void;
}

/**
 * This interface describes the props of the totals component
 *
 * @typeParam symbol: string - Currency symbol
 * @typeParam data: IInvoiceDetails[] - Invoice details
 * @typeParam onTotalsCalculated: (totals: IGenericRecord) => void - Function to handle totals calculation
 */
export interface ITotalsProps {
    symbol: string;
    data: IInvoiceDetails[];
    onTotalsCalculated?: (totals: IGenericRecord) => void;
}

/**
 * This returns the product discount
 *
 * @param data: IGenericRecord - Values to calculate the discount
 * @returns number
 */
export const getDiscount = ({ discount_percentage: discount, unit_cost: unitCost, quantity }: IGenericRecord): number => {
    return (
        parseInt(removeThousandsPoint(quantity)) *
            parseInt(removeThousandsPoint(unitCost)) *
            (Number(String(discount).slice(0, discount?.length - 1)) / 100) || 0
    );
};

/**
 * This returns the props of each field
 *
 * @param data: IGenericRecord - Invoice data
 * @param validate: boolean - This indicates the time to validate the form
 * @returns { [key: string]: IPropsInput }
 */
export const getFieldProps = (data: IGenericRecord, validate = false): { [key: string]: IPropsInput } => {
    const {
        DocumentType,
        DocumentNumber,
        Supplier,
        BroadcastDate,
        Cufe,
        Prefix,
        InvoiceNumber,
        PaymentType,
        PaymentMethod,
        PersonType,
        ForeignExchange,
        PurchaseOrderNumber,
        PurchasingManager,
        PurchasingDocumentNumber,
        ManagerDocumentType,
        ExpirationDate,
    } = FieldName;
    return {
        [Cufe]: {
            id: generateId({
                module: ModuleApp.ELECTRONIC_DOCUMENTS,
                submodule: `${ModuleApp.ELECTRONIC_INVOICE}-purchase-cufe`,
                action: ActionElementType.INPUT,
                elementType: ElementType.TXT,
            }),
            name: Cufe,
            placeholder: '...',
            classesWrapper: 'form-field invoice-form__cufe',
            labelText: '*CUFE:',
            value: data?.[Cufe],
            required: validate && !data[Cufe],
            maxLength: MAXIMUM_LENGTH_FIELDS.CUFE,
            alphanumeric: true,
            ...TOOLTIP_DATA[Cufe],
        },
        [InvoiceNumber]: {
            id: generateId({
                module: ModuleApp.ELECTRONIC_DOCUMENTS,
                submodule: `${ModuleApp.ELECTRONIC_INVOICE}-purchase-invoice-number`,
                action: ActionElementType.INPUT,
                elementType: ElementType.TXT,
            }),
            name: InvoiceNumber,
            placeholder: '...',
            classesWrapper: 'form-field',
            value: data?.[InvoiceNumber],
            required: validate && !data[InvoiceNumber],
            labelText: '*Número de factura del proveedor:',
            maxLength: FIFTY,
            alphanumericNoWhitespace: true,
            ...TOOLTIP_DATA[InvoiceNumber],
        },
        [Prefix]: {
            id: generateId({
                module: ModuleApp.ELECTRONIC_DOCUMENTS,
                submodule: `${ModuleApp.ELECTRONIC_INVOICE}-purchase-prefix`,
                action: ActionElementType.INPUT,
                elementType: ElementType.DRP,
            }),
            name: Prefix,
            classesWrapper: 'form-field',
            value: data?.[Prefix],
            required: validate && !data[Prefix],
            labelText: '*Prefijo:',
            selectIconType: 'arrowDownGreen',
            ...TOOLTIP_DATA[Prefix],
        },
        [BroadcastDate]: {
            id: generateId({
                module: ModuleApp.ELECTRONIC_DOCUMENTS,
                submodule: `${ModuleApp.ELECTRONIC_INVOICE}-purchase-broadcast-date`,
                action: ActionElementType.INPUT,
                elementType: ElementType.TXT,
            }),
            labelText: '*Fecha emisión:',
            classesWrapper: 'lg:w-39 w-full',
            selected: data?.[BroadcastDate],
            ...TOOLTIP_DATA[BroadcastDate],
            maxDate: new Date(),
        },
        [ExpirationDate]: {
            id: generateId({
                module: ModuleApp.ELECTRONIC_DOCUMENTS,
                submodule: `${ModuleApp.ELECTRONIC_INVOICE}-purchase-exp-date`,
                action: ActionElementType.INPUT,
                elementType: ElementType.TXT,
            }),
            labelText: '*Fecha de vencimiento:',
            classesWrapper: 'lg:w-39 w-full',
            selected: data?.[ExpirationDate],
            ...TOOLTIP_DATA[ExpirationDate],
        },
        [Supplier]: {
            id: generateId({
                module: ModuleApp.ELECTRONIC_DOCUMENTS,
                submodule: `${ModuleApp.ELECTRONIC_INVOICE}-purchase-supplier`,
                action: ActionElementType.INPUT,
                elementType: ElementType.DRP,
            }),
            name: Supplier,
            classesWrapper: 'form-field',
            valueSelect: data?.[Supplier],
            required: validate && !data[Supplier],
            labelText: '*Nombre proveedor o tercero:',
            selectIconType: 'arrowDownGreen',
            placeholder: 'Seleccionar',
            ...TOOLTIP_DATA[Supplier],
        },
        [DocumentType]: {
            id: generateId({
                module: ModuleApp.ELECTRONIC_DOCUMENTS,
                submodule: `${ModuleApp.ELECTRONIC_INVOICE}-purchase-document-type`,
                action: ActionElementType.INPUT,
                elementType: ElementType.DRP,
            }),
            labelText: '*Tipo de documento:',
            classesWrapper: 'form-field',
            disabled: true,
            selectIconType: 'arrowDownGreen',
            ...TOOLTIP_DATA[DocumentType],
        },
        [DocumentNumber]: {
            id: generateId({
                module: ModuleApp.ELECTRONIC_DOCUMENTS,
                submodule: `${ModuleApp.ELECTRONIC_INVOICE}-purchase-document-number`,
                action: ActionElementType.INPUT,
                elementType: ElementType.TXT,
            }),
            labelText: '*Número de documento:',
            disabled: true,
            selectIconType: 'arrowDownGreen',
            ...TOOLTIP_DATA[DocumentNumber],
        },
        [PaymentType]: {
            id: generateId({
                module: ModuleApp.ELECTRONIC_DOCUMENTS,
                submodule: `${ModuleApp.ELECTRONIC_INVOICE}-purchase-payment-type`,
                action: ActionElementType.INPUT,
                elementType: ElementType.DRP,
            }),
            name: PaymentType,
            labelText: '*Forma de pago:',
            classesWrapper: 'form-field',
            valueSelect: data?.[PaymentType],
            selectIconType: 'arrowDownGreen',
            required: validate && !data[PaymentType],
            ...TOOLTIP_DATA[PaymentType],
        },
        [PaymentMethod]: {
            id: generateId({
                module: ModuleApp.ELECTRONIC_DOCUMENTS,
                submodule: `${ModuleApp.ELECTRONIC_INVOICE}-purchase-payment-method`,
                action: ActionElementType.INPUT,
                elementType: ElementType.DRP,
            }),
            name: PaymentMethod,
            labelText: '*Medio de pago:',
            classesWrapper: 'form-field',
            required: validate && !data[PaymentMethod],
            valueSelect: data?.[PaymentMethod],
            selectIconType: 'arrowDownGreen',
            ...TOOLTIP_DATA[PaymentMethod],
        },
        [PersonType]: {
            id: generateId({
                module: ModuleApp.ELECTRONIC_DOCUMENTS,
                submodule: `${ModuleApp.ELECTRONIC_INVOICE}-purchase-person-type`,
                action: ActionElementType.INPUT,
                elementType: ElementType.DRP,
            }),
            labelText: '*Tipo de contribuyente:',
            classesWrapper: 'form-field',
            disabled: true,
            selectIconType: 'arrowDownGreen',
            ...TOOLTIP_DATA[PersonType],
        },
        [ForeignExchange]: {
            id: generateId({
                module: ModuleApp.ELECTRONIC_DOCUMENTS,
                submodule: `${ModuleApp.ELECTRONIC_INVOICE}-purchase-foreign-exchange`,
                action: ActionElementType.INPUT,
                elementType: ElementType.DRP,
            }),
            labelText: '*Divisa:',
            classesWrapper: 'form-field',
            valueSelect: data?.[ForeignExchange],
            required: validate && !data[ForeignExchange],
            selectIconType: 'arrowDownGreen',
            ...TOOLTIP_DATA[ForeignExchange],
        },
        [PurchaseOrderNumber]: {
            id: generateId({
                module: ModuleApp.ELECTRONIC_DOCUMENTS,
                submodule: `${ModuleApp.ELECTRONIC_INVOICE}-purchase-order-number`,
                action: ActionElementType.INPUT,
                elementType: ElementType.TXT,
            }),
            labelText: 'Número de orden de compra:',
            name: PurchaseOrderNumber,
            classesWrapper: 'form-field',
            value: data?.[PurchaseOrderNumber],
            onlyNumbers: true,
            placeholder: '...',
        },
        [PurchasingManager]: {
            id: generateId({
                module: ModuleApp.ELECTRONIC_DOCUMENTS,
                submodule: `${ModuleApp.ELECTRONIC_INVOICE}-purchase-manager`,
                action: ActionElementType.INPUT,
                elementType: ElementType.TXT,
            }),
            labelText: 'Encargado de la compra:',
            name: PurchasingManager,
            classesWrapper: 'form-field',
            value: data?.[PurchasingManager],
            placeholder: '...',
        },
        [PurchasingDocumentNumber]: {
            id: generateId({
                module: ModuleApp.ELECTRONIC_DOCUMENTS,
                submodule: `${ModuleApp.ELECTRONIC_INVOICE}-purchase-manager-document-number`,
                action: ActionElementType.INPUT,
                elementType: ElementType.TXT,
            }),
            labelText: 'Número de documento del encargado de la compra:',
            name: PurchasingDocumentNumber,
            classesWrapper: 'form-field',
            value: data?.[PurchasingDocumentNumber],
            placeholder: '...',
            onlyNumbers: true,
        },
        [ManagerDocumentType]: {
            id: generateId({
                module: ModuleApp.ELECTRONIC_DOCUMENTS,
                submodule: `${ModuleApp.ELECTRONIC_INVOICE}-purchase-manager-document-type`,
                action: ActionElementType.INPUT,
                elementType: ElementType.TXT,
            }),
            labelText: 'Tipo de documento encargado de la compra:',
            name: ManagerDocumentType,
            classesWrapper: 'form-field',
            valueSelect: data?.[ManagerDocumentType],
            selectIconType: 'arrowDownGreen',
        },
    };
};

/**
 * This formats the products
 *
 * @param products: IGenericRecord[] - Product list
 * @returns IOption[]
 */
export const formatProducts = (products: IGenericRecord[]): IOption[] => {
    return products.map(({ reference, ...product }) => ({
        ...product,
        value: product.sku_internal,
        name: reference,
    }));
};

/**
 * Headers used to display products table
 */
export const PRODUCT_TABLE_HEADERS = (): IGenericRecord[] => [
    {
        className: 'selector',
    },
    {
        title: 'No.',
        className: 'number',
    },
    {
        title: '*SKU/Código - Producto/Servicio',
        className: 'sku',
        tooltip: {
            title: 'SKU/Código - Producto/ Servicio:',
            description: 'es el código único de identificación y el nombre de sus productos/servicios.',
        },
    },
    {
        title: '*Cantidad',
        className: 'quantity',
        tooltip: {
            title: 'Cantidad:',
            description: 'es la cantidad del producto comprada a su proveedor.',
        },
    },
    {
        title: 'Costo unitario',
        className: 'unit-cost',
        tooltip: {
            title: 'Costo unitario:',
            description: 'Es el valor que cobra el proveedor por cada unidad de producto/servicio.',
        },
    },
    {
        title: '% de descuento',
        className: 'discount-rate',
        tooltip: {
            title: 'Porcentaje de descuento:',
            description: 'es el porcentaje del costo unitario que se disminuye al producto/servicio.',
        },
    },
    {
        title: 'Descuento',
        className: 'discount',
        tooltip: {
            title: 'Descuento:',
            description: 'es el resultado de la siguiente operación (Costo unitario * Porcentaje descuento) ',
        },
    },
    {
        title: 'Impuestos',
        className: 'taxes',
        tooltip: INFORMATION.TAXES,
    },
];

/**
 * This is used to add products to the table
 */
export const PRODUCT_ITEM = {
    sku: '',
    quantity: '',
    discount: 0,
    discount_percentage: 0,
    unit_cost: '0',
    unique_product_taxes: [],
};

/**
 * Max lenght to inptus table
 */
export enum MaxiLengthTable {
    Large = 255,
    Quantity = 9,
    Medium = 14,
    Percentage = 3,
}

/**
 * Max lenght to quantity input
 */
export const MAX_QUANTITY_LENGTH = 9;

/**
 * This is used to add products to the table
 */
export const ID_KEY: { [key: string]: string } = {
    [FieldName.Prefix]: 'prefix_id',
    [FieldName.Supplier]: 'supplier_id',
    [FieldName.PaymentType]: 'payment_type_id',
    [FieldName.PaymentMethod]: 'payment_method_id',
    [FieldName.ManagerDocumentType]: 'document_type_purchasing_manager_id',
};

/**
 * Fields used for calculate taxes
 */
export enum TableNameInputs {
    QUANTITY = 'quantity',
    UNIT_COST = 'unit_cost',
    PERCENTAGE_DISCOUNT = 'discount_percentage',
}

/**
 * Number constans
 */
export const THOUSAND = 1000;
export const HUNDRED = 100;
export const TEN = 10;
export const ZERO = 0;

/**
 * Fields used for totals table
 */
export const TOTAL_FIELDS = [
    {
        field: 'Subtotal',
        name: 'total_sale',
    },
    {
        field: 'Total descuentos',
        name: 'total_discount',
    },
    {
        field: 'Total IVA 19%',
        name: 'IVA_19%',
    },
    {
        field: 'Total IVA 5%',
        name: 'IVA_5%',
    },
    {
        field: 'Total IVA Exento (0%)',
        name: 'IVA_0%',
    },
    {
        field: 'Total INC 4%',
        name: 'INC_4%',
    },
    {
        field: 'Total INC 16%',
        name: 'INC_16%',
    },
    {
        field: 'Total ICUI 15%',
        name: 'ICUI_15%',
    },
    {
        field: 'Total ICUI 20%',
        name: 'ICUI_20%',
    },
    {
        field: 'Total IBUA',
        name: 'IBUA',
    },

    {
        field: 'Total',
        name: 'total',
    },
];

/**
 * This const is value total
 */
export const TOTALS = {
    taxes: {},
    base_retefuente: 0,
    base_reteica: 0,
    base_reteiva: 0,
    total_sale: 0,
    total_discount: 0,
    sending_charge: 0,
    total_sale_before_tax: 0,
    total_invoice: 0,
    total_iva: 0,
    total_impoconsumption: 0,
    total_icui: 0,
    total_ibua: 0,
    total_sale_value: 0,
    retefuente: 0,
    reteica: 0,
    reteiva: 0,
    total: 0,
};

/**
 * Const for max length inputs
 */
export const MAXIMUM_LENGTH_FIELDS = {
    POSTAL_CODE: 6,
    FOREIGN_RATE: 10,
    CUFE: 96,
    NUMBER_PURCHASE: 96,
    SALES_MANAGER: 96,
    DOCUMENT_MANAGER: 10,
    DOCUMENT_NUMBER: 10,
    EMAIL: 60,
    ADDRESS: 96,
    PHONE: 10,
    PURCHASING_MANAGER: 96,
    DOCUMENT_NUMBER_MANAGER: 10,
    DAYS_PAYMENT: 3,
    NOTE: 96,
};
