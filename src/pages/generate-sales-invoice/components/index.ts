/* eslint-disable @typescript-eslint/no-explicit-any */
import { v4 as uuid } from 'uuid';
import { ISharedModalProps } from '@components/modal';
import { ChangeEvent, IOptionSelect, IPropsInput } from '@components/input';

import { IVA } from '@constants/Tax';
import { Routes } from '@constants/Paths';
import { CREDIT, MANDATE } from '@constants/Invoice';
import { TableNameInputs } from '@constants/CancellationElectronic';
import { COLOMBIAN_CURRENCY_ID, DEFAULT_LANG, INVOICE, NA } from '@constants/ElectronicInvoice';

import { Form } from '@models/ElectronicDocuments';
import { IGenericRecord } from '@models/GenericRecord';
import { FieldName, Modal } from '@models/SalesInvoice';
import { IInvoiceCalculates, IInvoiceDetails, ITableTaxesAndRetention } from '@models/ElectronicInvoice';

import { TYPE_NAVIGATION } from '@pages/consult-electronic-document';

import { INFORMATION, TOOLTIP_DATA } from '@information-texts/GenerateSalesInvoice';

import { getDateFromUnix, getDateISO8601ToDate, getTodaysTime, getUnixFromDate } from '@utils/Date';
import { getRoute } from '@utils/Paths';
import { getEmptyFields, getErrorMessages } from '@utils/Table';
import { discardUntaxed, stringToFloat, valueToRate } from '@utils/ElectronicInvoice';
import { lengthGreaterThanZero } from '@utils/Length';
import { calculatePercentage } from '@utils/Number';
import { ElementType, generateId, ModuleApp, ActionElementType } from '@utils/GenerateId';

export { BillingInformation } from './BillingInformation';
export { InvoiceForm } from './InvoiceForm';
export { ProductsTable } from './ProductsTable';
export { RadioButtons } from './RadioButtons';
export { SubTotals } from './SubTotals';
export { WithholdingTable } from './WithholdingTable';

/**
 * This interface describes the props of the table data
 *
 * @typeParam symbol: string - This is the currency symbol
 * @typeParam validate: boolean - This indicates when to validate the table
 * @typeParam isMandate: boolean - This is optional and indicates whether the invoice is with a message
 * @typeParam data: IInvoiceDetails[] - This is the shipping cost
 * @typeParam errorMessages: string[] - Error messages
 * @typeParam perishableErrors: string[] - Optional list of perishable product errors
 * @typeParam isPurchaseInvoice?: boolean - With page is purchase invoice
 * @typeParam foreignExchangeRate: number | null - This is the foreign exchange rate, if applicable
 * @typeParam toggleTotalsQuery: () => void - This toggles the state that indicates when to query the totals
 * @typeParam updateData: (data: IInvoiceDetails[]) => void - This is used to update the data
 */
export interface ITableDataProps {
    symbol: string;
    validate: boolean;
    isMandate?: boolean;
    data: IInvoiceDetails[];
    errorMessages?: string[];
    perishableErrors?: string[];
    isPurchaseInvoice?: boolean;
    foreignExchangeRate: number | null;
    toggleTotalsQuery: () => void;
    updateData: (data: IInvoiceDetails[]) => void;
}

/**
 * This interface is props in component withholdings
 *
 * @typeParam data: ITableTaxesAndRetention[] - Withholdings
 * @typeParam updateData: (data: ITableTaxesAndRetention[]) => void - Set withholdings
 * @typeParam validate: boolean - Validate table
 * @typeParam toggleTotalsQuery: () => void - This toggles the state that indicates when to query the totals
 * @typeParam symbol: string - This is the currency symbol
 */
export interface IWithholdingsProps {
    data: ITableTaxesAndRetention[];
    updateData: (data: ITableTaxesAndRetention[]) => void;
    validate: boolean;
    toggleTotalsQuery: () => void;
    symbol: string;
}

/**
 * This interface describes the sub totals props
 *
 * @typeParam sendingCharge: number - This is the shipping cost
 * @typeParam totals: IGenericRecord - Invoice totals
 * @typeParam updateSendingCharge: (e: IGenericRecord) => void - This updates the shipping cost
 * @typeParam disableShippingCost: boolean - This disables the shipping cost field
 * @typeParam toggleTotalsQuery: () => void- This toggles the prompt to calculate totals
 * @typeParam symbol: string - This is the currency symbol
 */
export interface ISubTotalsProps {
    sendingCharge: number;
    totals: IInvoiceCalculates;
    updateSendingCharge: (e: IGenericRecord) => void;
    disableShippingCost: boolean;
    toggleTotalsQuery: () => void;
    symbol: string;
}

/**
 * This interface describes the invoice props
 *
 * @typeParam data: IGenericRecord - Invoice data
 * @typeParam answer: string - Function to update invoice data
 * @typeParam disabled: boolean - Optional for disabled inputs and buttons
 */
export interface IInvoiceProps {
    formData: IGenericRecord;
    updateFormData: (data: IGenericRecord) => void;
    disabled?: boolean;
}

/**
 * This interface is props component
 *
 * @typeParam openForm: (type: Form) => void - Set action in state
 * @typeParam toggleModal: () => void - Change modal
 * @typeParam isContingency: boolean - If is contingency page
 * @typeParam isInsertedPage?: boolean - Optional prop if component in other page
 * @typeParam initialProductData?: IInvoiceDetails[] - Initial product data from quote
 * @typeParam initialWithholdingData?: ITableTaxesAndRetention[] - Initial withholding data from quote
 * @typeParam initialSendingCharge?: number - Initial sending charge from quote
 */
export interface IBillingInformationProps extends IInvoiceProps {
    openForm: (type: Form) => void;
    toggleModal: () => void;
    isContingency: boolean;
    isInsertedPage?: boolean;
    initialProductData?: IInvoiceDetails[];
    initialWithholdingData?: ITableTaxesAndRetention[];
    initialSendingCharge?: number;
}

/**
 * This interface is props component
 *
 * @typeParam openForm: (type: Form) => void - Set action in state
 * @typeParam validate: boolean - Validate form
 * @typeParam isContingency: boolean - If is contingency page
 */
export interface IInformationFormProps extends IInvoiceProps {
    openForm: (type: Form) => void;
    validate: boolean;
    isContingency: boolean;
}

/**
 * This interface is props component
 *
 * @typeParam formData: IGenericRecord - Form state
 * @typeParam handleChange: (value: boolean) => void - Set change form
 * @typeParam disabled?: boolean - Disabled input
 */
export interface IRadioButtonsProps {
    formData: IGenericRecord;
    handleChange: (value: boolean) => void;
    disabled?: boolean;
}

/**
 * This interface describes the props of the form fields
 *
 * @typeParam data: IGenericRecord - Form data
 * @typeParam handleValueChange: (e: ChangeEvent) => void - Function to update invoice data
 */
export interface IFieldsProps {
    data: IGenericRecord;
    handleValueChange: (e: ChangeEvent) => void;
    updateData: (data: IGenericRecord) => void;
    utils: IGenericRecord;
}

/**
 * These are the maximum field lengths for the invoice
 */
export enum FieldLength {
    UnitValue = 14,
    DiscountPercentage = 3,
    Discount = 14,
}

/**
 * DIAN responses at the time of creating the invoice
 */
export enum DianResponse {
    Rejected = 'REJECTED_DIAN',
    Accepted = 'ACCEPTED',
    InVerification = 'IN_VERIFICATION',
    Contingency = 'CONTINGENCY',
    NoEmailSent = 'ACCEPTED_NO_EMAIL_SENT',
}

/**
 * Maps products with taxes to format required by backend getTotals.
 * Hybrid approach: tries catalog first, falls back to IVA reconstruction.
 *
 * @typeParam products: IInvoiceDetails[] - Array of invoice products
 * @typeParam catalogProducts: IGenericRecord[] - Redux products catalog with valid tax UUIDs
 * @typeParam companyTaxes: IGenericRecord[] - Company taxes for fallback reconstruction
 * @returns Array of products formatted for totals calculation with taxes
 */
export const mapProductsForTotals = (
    products: IInvoiceDetails[],
    catalogProducts?: IGenericRecord[],
    companyTaxes?: IGenericRecord[]
): Array<IInvoiceDetails> => {
    return products.map(item => {
        const quantity = stringToFloat(item.quantity);
        const unitValue = stringToFloat(item.unit_value); // ← CORRECTED: Use existing unit_value, don't recalculate
        const discount = stringToFloat(item.discount) || 0;

        let taxes = item?.product_taxes ?? [];

        // APPROACH 1: Get taxes from Redux product catalog (same as assignProducts pattern)
        if ((!taxes || taxes.length === 0) && item.unique_products_id && catalogProducts && catalogProducts.length > 0) {
            const matchedProduct = catalogProducts.find(catalogProduct => catalogProduct.id === item.unique_products_id);

            if (matchedProduct) {
                // Use the same pattern as assignProducts (line 1321-1323)
                const productTaxes =
                    matchedProduct.unique_product_taxes && matchedProduct.unique_product_taxes.length > 0
                        ? matchedProduct.unique_product_taxes
                        : matchedProduct.product?.product_taxes || [];

                if (productTaxes && productTaxes.length > 0) {
                    taxes = productTaxes.map(({ company_tax_id, tax_value }: IGenericRecord) => ({
                        company_tax_id,
                        tax_value,
                    }));
                }
            }
        }

        // APPROACH 2: FALLBACK - If still no taxes but quote has IVA value, reconstruct from IVA
        if (
            (!taxes || taxes.length === 0) &&
            item.iva &&
            stringToFloat(item.iva) > 0 &&
            companyTaxes &&
            companyTaxes.length > 0
        ) {
            const ivaValue = stringToFloat(item.iva);
            // Calculate subtotal: (unit_value * quantity) - discount
            const subtotal = unitValue * quantity - discount;

            // Calculate tax rate from IVA value: rate = (iva / subtotal) * 100
            const calculatedRate = subtotal > 0 ? (ivaValue / subtotal) * 100 : 0;

            // Find matching IVA tax in company taxes (19%, 16%, 5%, 0%)
            const matchingTax = companyTaxes.find((tax: IGenericRecord) => {
                const isIVA = tax.name === IVA || tax.tax_name === IVA;
                const taxRate = tax.rate || 0; // ← CORRECTED: Use 'rate' property
                // Allow 0.5% margin for rounding differences
                const rateDiff = Math.abs(taxRate - calculatedRate);
                return isIVA && rateDiff < 0.5;
            });

            if (matchingTax) {
                taxes = [
                    {
                        company_tax_id: matchingTax.id,
                        tax_value: matchingTax.rate, // ← CORRECTED: Use 'rate' property
                    },
                ];
            }
        }

        // Return ONLY the fields backend needs for totals calculation
        const cleanProduct = {
            quantity,
            unit_value: unitValue,
            discount,
            unit_measure_milliliters: item.unit_measure_milliliters || 0,
            taxes,
        };

        return cleanProduct;
    });
};

/**
 * Modal that is displayed according to the dian's response
 */
export const RESPONSE_MODAL: { [key: string]: Modal } = {
    [DianResponse.Rejected]: Modal.InvoiceRejected,
    [DianResponse.Accepted]: Modal.InvoiceGenerated,
    [DianResponse.InVerification]: Modal.InvoiceInVerification,
    [DianResponse.Contingency]: Modal.InvoiceError,
    [DianResponse.NoEmailSent]: Modal.InvoiceGenerated,
};

/**
 * This returns the props of each field
 *
 * @param data: IGenericRecord - Invoice data
 * @returns { [key: string]: IPropsInput }
 */
export const getFieldProps = (data: IGenericRecord): { [key: string]: IPropsInput } => {
    const { SalesManager, ManagerDocumentType, PurchaseOrderNumber, ManagerDocumentNumber } = FieldName;
    return {
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
        [SalesManager]: {
            id: generateId({
                module: ModuleApp.ELECTRONIC_DOCUMENTS,
                submodule: `${ModuleApp.ELECTRONIC_INVOICE}-sales-manager`,
                action: ActionElementType.INPUT,
                elementType: ElementType.TXT,
            }),
            labelText: 'Encargado de la venta:',
            name: SalesManager,
            classesWrapper: 'form-field',
            value: data?.[SalesManager],
            placeholder: '...',
        },
        [ManagerDocumentNumber]: {
            id: generateId({
                module: ModuleApp.ELECTRONIC_DOCUMENTS,
                submodule: `${ModuleApp.ELECTRONIC_INVOICE}-manager-document-number`,
                action: ActionElementType.INPUT,
                elementType: ElementType.TXT,
            }),
            labelText: 'Número de documento del encargado de la venta:',
            name: ManagerDocumentNumber,
            classesWrapper: 'form-field',
            value: data?.[ManagerDocumentNumber],
            placeholder: '...',
            onlyNumbers: true,
        },
        [ManagerDocumentType]: {
            id: generateId({
                module: ModuleApp.ELECTRONIC_DOCUMENTS,
                submodule: `${ModuleApp.ELECTRONIC_INVOICE}-manager-document-type`,
                action: ActionElementType.INPUT,
                elementType: ElementType.TXT,
            }),
            labelText: 'Tipo de documento encargado de la venta:',
            name: ManagerDocumentType,
            classesWrapper: 'form-field',
            value: data?.[ManagerDocumentType],
        },
    };
};

/**
 * This searches for the tooltip data according to the id
 *
 * @param options: IGenericRecord[] - Task progress
 * @param activeId: string - Task progress
 * @returns IGenericRecord
 */
export const getTooltipData = (options: IGenericRecord[], activeId: string): IGenericRecord => {
    return options.find(option => option.id === activeId) ?? {};
};

/**
 * This formats the tax data which is used to display the table.
 *
 * @param data: IInvoiceCalculates | IGenericRecord - Invoice values
 * @returns IGenericRecord[]
 */
export const formatTaxData = (data: IInvoiceCalculates | IGenericRecord): IGenericRecord[] => [
    {
        name: '06 Retefuente',
        base: (data?.total_gross ?? 0) - (data?.total_charge_amount ?? 0),
        percentage: '0',
        value: 240,
        isTax: false,
        disabled: false,
    },
    {
        name: '07 ReteICA',
        base: (data?.total_gross ?? 0) - (data?.total_charge_amount ?? 0),
        percentage: '0',
        isTax: false,
        value: 0,
        disabled: false,
    },
    {
        name: '08 ReteIVA',
        base: data?.total_iva ?? 0,
        percentage: '0',
        isTax: false,
        value: 0,
        disabled: false,
        isSelector: true,
    },
];

/**
 * This calculates the discount for each product
 *
 * @param data: IGenericRecord - Product data
 * @returns number
 */
const getDiscount = ({ percentage_discount: discount = 0, unit_value: unitValue = 0 }: IGenericRecord): number => {
    return unitValue * (discount / 100) || 0;
};

/**
 * This calculates the vat for each product
 *
 * @param taxes: IGenericRecord[] - Product taxes
 * @param base: number - Product value
 * @returns number
 */
export const calculateVat = (taxes: IGenericRecord[] = [], base: number): number => {
    const tax = taxes?.find(({ tax_name: name }) => name === IVA)?.tax_rate ?? 0;
    return base * (tax / 100);
};

/**
 * This calculates the base for each product
 *
 * @param item: IGenericRecord - Product data
 * @returns number
 */
export const calculateBase = (item: IInvoiceDetails): number => stringToFloat(item.quantity) * item.unit_cost - getDiscount(item);

/**
 * This calculates the taxes for each product
 *
 * @param products: IGenericRecord[] - Product list
 * @returns IGenericRecord[]
 */
export const calculateProductTaxes = (products: IInvoiceDetails[]): IInvoiceDetails[] => {
    return products.map(product => {
        const base = calculateBase(product);
        return {
            ...product,
            total_buy: base,
        };
    });
};

/**
 *
 */
interface IParamsToDetails {
    isMandate: boolean;
    foreignRate: number;
    productsStock: IGenericRecord[];
}

/**
 * This formats the products for the invoice request
 *
 * @param products: IInvoiceDetails[] - Product list
 * @param isMandate: boolean - This indicates whether the invoice is with a mandate
 * @par
 * @returns number
 */
const formatProducts = (
    products: IInvoiceDetails[],
    { isMandate, foreignRate, productsStock }: IParamsToDetails
): IGenericRecord[] => {
    return products.map(({ batch_number, warehouse_name, ...product }) => {
        const isNAWarehouse = warehouse_name !== NA;
        const isNABatch = batch_number !== NA;
        const productFind = productsStock.find(item => item.sku_internal === product.sku_internal) || {};
        const taxes = discardUntaxed(productFind.unique_product_taxes);

        return {
            ...product,
            ciiu_id: product.ciiu_id || '2',
            batch_detail_id: product.batch_detail_id,
            batch_id: isNABatch ? product.batch_id : null,
            batch: isNABatch ? batch_number : null,
            date_expiration: isNABatch ? getDateISO8601ToDate(product.date_expiration || '') : null,
            date: new Date(),
            quantity: stringToFloat(product.quantity),
            unique_products_id: product.id,
            warehouse_name: isNAWarehouse ? warehouse_name : null,
            warehouse_id: isNAWarehouse ? product.warehouse_id : null,
            delivery_cost: 0,
            unit_value: product.unit_cost * stringToFloat(product.quantity),
            total_buy: product.unit_cost * stringToFloat(product.quantity) - (product.discount ?? 0),
            supplier: isMandate ? product.mandate : null,
            supplier_id: isMandate ? product.mandate_id : null,
            product_taxes: taxes.map(valueToRate(foreignRate)),
            taxes: taxes.map(({ company_tax_id, tax_value }) => valueToRate(foreignRate)({ company_tax_id, tax_value })),
        };
    });
};

/**
 * This formats the invoice request
 *
 * @param data: IGenericRecord - Data required to create the invoice
 * @returns IGenericRecord
 */
export const formatInvoiceRequest = ({
    formData,
    information,
    productsWithTaxes,
    utils,
    client: selectedClient,
    invoiceValues,
    withholdingTable,
    products,
    isDraft = false,
}: IGenericRecord): IGenericRecord => {
    const client = selectedClient?.customer?.person;
    const authorizePersonalData = formData?.not_information_customer;
    const isMandate = formData?.[FieldName.OperationType] === MANDATE;
    const isCredit = formData?.isCreditSelected;
    const [retefuente, reteica, reteiva] = withholdingTable;
    return {
        lang: formData?.lang || DEFAULT_LANG,
        operation_type_id: formData.operation_type_id,
        address: null,
        aggregation_method: 'ELECTRONICS',
        apply_deductible: false,
        apply_electronic_invoice: true,
        city_id: client?.city_id,
        city_name: client?.city_name,
        client_id: authorizePersonalData ? client?.id : null,
        company_address: information?.address,
        company_device_id: null,
        company_device_name: null,
        company_postal_code: null,
        country_id: client?.country_id,
        country_name: client?.country_name,
        customer_id: authorizePersonalData ? client?.id : formData.id,
        date: '',
        date_limit: getDateFromUnix(getUnixFromDate()).formatYearMonthDay,
        days_collection: isCredit ? Number(formData?.collection_days) : 0,
        days_collection_type: isCredit ? formData?.days_collection_type : null,
        department_id: null,
        department_name: null,
        document_number: authorizePersonalData ? client?.document_number.slice(0, 10) : formData?.document_number,
        document_number_purchasing_manager: null,
        document_number_sales_manager: formData?.document_number_sales_manager,
        document_type: authorizePersonalData ? client?.document_type : 'f73f5793-795e-33db-9115-95437f9ecaea',
        document_type_purchasing_manager: null,
        document_type_sales_manager: formData?.document_type_sales_manager_id,
        electronic_biller: false,
        electronic_billing: true,
        email: client?.email,
        foreign_exchange_id: formData?.foreign_exchange_id,
        foreign_exchange_name: formData?.foreign_exchange_name,
        foreign_exchange_rate: formData?.foreign_exchange_rate || 0,
        invoice_state: 'ACCEPTED',
        invoice_type: 'INVOICE',
        is_draft: isDraft,
        is_electronic_invoice: true,
        is_mandate: isMandate,
        mandate_id: isMandate ? formData?.mandate_id : '',
        mandate: isMandate ? formData?.mandate : '',
        is_paid: true,
        loaded_inventory: false,
        name: authorizePersonalData ? selectedClient?.customer?.name : formData?.name,
        name_legal_representative: client?.name_legal_representative ?? null,
        not_information_customer: authorizePersonalData,
        note: formData?.note,
        internal_notes: formData?.internal_notes,
        number: 0,
        number_max: 0,
        number_purchase_order: formData?.number_purchase_order || null,
        payment_method_id: formData?.payment_method_id,
        payment_method_name: formData?.payment_method_name,
        payment_method_code: formData?.payment_method_name,
        payment_type_code: formData?.payment_type_name,
        payment_type_id: formData?.payment_type_id,
        payment_type_name: formData?.payment_type_name,
        person_id: authorizePersonalData ? client?.id : null,
        phone: 0,
        postal_code: null,
        prefix_id: formData?.prefix_id,
        prefix_id_name: formData?.prefix_name,
        products: formatProducts(productsWithTaxes, {
            isMandate,
            productsStock: products,
            foreignRate: formData?.foreign_exchange_rate,
        }),
        purchasing_manager: null,
        receive_device: false,
        receive_email: false,
        receive_printed_invoice: false,
        receive_products: false,
        reload: true,
        base_retefuente: retefuente.base,
        base_reteica: reteica.base,
        base_reteiva: reteiva.base,
        retefuente: retefuente.value,
        reteica: reteica.value,
        reteiva: reteiva.value,
        sale_channel: 'PHYSICAL_STORE',
        sales_manager: formData?.sales_manager || null,
        send_address: null,
        sending_charge: invoiceValues.total_charge_amount,
        source_type: 'CUSTOMERS',
        tax_details_id:
            utils?.tax_details?.findIndex((item: IGenericRecord) => item.name === selectedClient?.customer?.tax_details_name) + 1,
        tax_details_name: authorizePersonalData ? selectedClient?.customer?.tax_details_name : 'No aplica',
        tax_details_code: authorizePersonalData ? selectedClient?.customer?.tax_details_code : 'ZZ',
        taxes: formatTaxes(invoiceValues),
        time_issue: getTodaysTime(),
        total: invoiceValues.total,
        total_discount: invoiceValues.total_discount,
        total_ibua: invoiceValues.total_ibua,
        total_icui: invoiceValues.total_icui,
        total_impoconsumption: invoiceValues.total_inc,
        total_invoice: invoiceValues.total_gross,
        total_iva: invoiceValues.total_iva,
        total_sale: invoiceValues.subtotal,
        total_sale_value: invoiceValues.total_payable,
        type_taxpayer_code: authorizePersonalData ? client?.type_taxpayer_id : formData?.type_taxpayer_code,
        type_taxpayer_id: authorizePersonalData ? client?.type_taxpayer_id : formData?.type_taxpayer_id,
        type_taxpayer_name: authorizePersonalData ? client?.type_taxpayer_name : formData?.type_taxpayer_name,
        withholdings: withholdingTable,
    };
};

/**
 * This formats the taxes of the products
 *
 * @param totals: IGenericRecord - Invoice totals
 * @returns IGenericRecord[]
 */
const formatTaxes = (totals: IGenericRecord): IGenericRecord[] =>
    DEFAULT_TAXES.map(tax => {
        const value = totals?.total_taxes_iva?.[tax.name.split(' ')[0]];
        return {
            ...tax,
            ...(value && { base: totals.subtotal }),
            value,
        };
    });

/**
 * This returns the props of the modals
 *
 * @param data: IGenericRecord - Modal props
 * @returns { [key: string]: ISharedModalProps }
 */
export const getModalProps = ({ history, invoice, resetData }: IGenericRecord): { [key: string]: ISharedModalProps } => ({
    [Modal.Draft]: {
        moduleId: generateId({
            module: ModuleApp.ELECTRONIC_DOCUMENTS,
            submodule: `${ModuleApp.ELECTRONIC_INVOICE}-${ModuleApp.MODALS}-${Modal.Draft}`,
            action: ActionElementType.INFO,
            elementType: ElementType.MDL,
        }),
        text: INFORMATION.DRAFT_MODAL,
        finalAction: resetData,
        open: true,
    },
    [Modal.InvoiceGenerated]: {
        moduleId: generateId({
            module: ModuleApp.ELECTRONIC_DOCUMENTS,
            submodule: `${ModuleApp.ELECTRONIC_INVOICE}-${ModuleApp.MODALS}-${Modal.InvoiceGenerated}`,
            action: ActionElementType.INFO,
            elementType: ElementType.MDL,
        }),
        text: INFORMATION.INVOICE_GENERATED,
        leftButton: { action: resetData, text: 'Generar nueva factura de venta' },
        finishButtonText: 'Siguiente',
        open: true,
        finalAction: (): void =>
            history.push(`${getRoute(Routes.CONSULT_ELECTRONIC_DOCUMENT)}?id=${invoice}&type=${TYPE_NAVIGATION.CREATED_INVOICE}`),
    },
    [Modal.InvoiceRejected]: {
        moduleId: generateId({
            module: ModuleApp.ELECTRONIC_DOCUMENTS,
            submodule: `${ModuleApp.ELECTRONIC_INVOICE}-${ModuleApp.MODALS}-${Modal.InvoiceRejected}`,
            action: ActionElementType.INFO,
            elementType: ElementType.MDL,
        }),
        text: INFORMATION.INVOICE_REJECTED,
        open: true,
        finalAction: resetData,
        iconName: 'triangleInfoMulticolor',
        leftButton: {
            action: (): void => history.push(`${getRoute(Routes.CORRECTION_BUSINESS_DOCUMENT)}?id=${invoice}`),
            text: 'Corregir',
        },
    },
    [Modal.InvoiceInVerification]: {
        moduleId: generateId({
            module: ModuleApp.ELECTRONIC_DOCUMENTS,
            submodule: `${ModuleApp.ELECTRONIC_INVOICE}-${ModuleApp.MODALS}-${Modal.InvoiceInVerification}`,
            action: ActionElementType.INFO,
            elementType: ElementType.MDL,
        }),
        text: INFORMATION.INVOICE_IN_VERIFICATION,
        iconName: 'triangleInfoMulticolor',
        finalAction: (): void => history.push(getRoute(Routes.ELECTRONIC_DOCUMENTS_GENERATED)),
        open: true,
    },
    [Modal.InvoiceError]: {
        moduleId: generateId({
            module: ModuleApp.ELECTRONIC_DOCUMENTS,
            submodule: `${ModuleApp.ELECTRONIC_INVOICE}-${ModuleApp.MODALS}-${Modal.InvoiceError}`,
            action: ActionElementType.INFO,
            elementType: ElementType.MDL,
        }),
        finalAction: resetData,
        text: INFORMATION.INVOICE_ERROR,
        iconName: 'triangleInfoMulticolor',
        open: true,
    },
    [Modal.ErrorDIAN]: {
        moduleId: generateId({
            module: ModuleApp.ELECTRONIC_DOCUMENTS,
            submodule: `${ModuleApp.ELECTRONIC_INVOICE}-${ModuleApp.MODALS}-${Modal.ErrorDIAN}`,
            action: ActionElementType.INFO,
            elementType: ElementType.MDL,
        }),
        text: INFORMATION.ERROR_DIAN,
        finalAction: (): void => history.push(getRoute(Routes.GENERATE_CONTINGENCY_INVOICE)),
        className: 'generate-invoices__modal-contingency',
        iconName: 'triangleInfoMulticolor',
        open: true,
    },
    [Modal.ContingencySave]: {
        moduleId: generateId({
            module: ModuleApp.ELECTRONIC_DOCUMENTS,
            submodule: `${ModuleApp.ELECTRONIC_INVOICE}-${ModuleApp.MODALS}-${Modal.ContingencySave}`,
            action: ActionElementType.INFO,
            elementType: ElementType.MDL,
        }),
        open: true,
        finishButtonText: 'Siguiente',
        text: INFORMATION.CONTINGENCY_SAVE,
        leftButton: { action: resetData, text: 'Generar nueva factura de venta' },
        finalAction: (): void => history.push(`${getRoute(Routes.CONSULT_ELECTRONIC_DOCUMENT)}?id=${invoice}`),
    },
});

/**
 * This This formats the prefixes
 *
 * @param storePrefix: IGenericRecord[] - List of prefixes
 * @param isContingency: boolean - If contingency page
 * @returns IOptionSelect[]
 */
export const formatPrefixes = (storePrefix: IGenericRecord[] = [], isContingency = false): IOptionSelect[] => {
    return storePrefix.flatMap(({ prefix, id, ...item }: IGenericRecord) => {
        const isValidPrefix = isContingency
            ? item.contingency && item.type === INVOICE
            : !item.contingency && !item.supporting_document && item.type === INVOICE;
        return isValidPrefix ? [{ ...item, key: id, value: prefix, id }] : [];
    });
};

/**
 * This returns the perishable errors
 *
 * @param productData: IGenericRecord[] - Product data
 * @returns string[]
 */
export const getPerishableErrors = (productData: IGenericRecord[]): string[] => {
    const emptyFields = getEmptyFields(
        productData?.filter(item => item?.isPerishable),
        REQUIRED_PERISHABLE_FIELDS
    );

    return getErrorMessages(emptyFields, REQUIRED_PERISHABLE_FIELDS);
};

/**
 * Default product taxes
 */
const DEFAULT_TAXES = [
    {
        name: '01 IVA',
        base: 0,
        value: 0,
        isTax: true,
        isSelectInput: false,
        percentage: 19,
    },
    {
        name: '02 IVA',
        base: 0,
        value: 0,
        isTax: true,
        isSelectInput: false,
        percentage: 16,
    },
    {
        name: '03 IVA',
        base: 0,
        value: 0,
        isTax: true,
        isSelectInput: false,
        percentage: 5,
    },
    {
        name: '04 IVA',
        base: 0,
        label: 'Exento (0%)',
        value: 0,
        isTax: true,
        isLabel: true,
        isSelectInput: false,
        percentage: 0,
    },
    {
        name: '05 IVA',
        base: 0,
        label: 'Excluido',
        isTax: true,
        value: 0,
        isSelectInput: false,
        isLabel: true,
        percentage: 0,
    },
];

/**
 * This returns the required fields of the form
 *
 * @param data: IGenericRecord - Form data
 * @returns string[]
 */
export const REQUIRED_FORM_FIELDS = (data: IGenericRecord): string[] => [
    FieldName.Prefix,
    FieldName.PaymentType,
    FieldName.ForeignExchangeId,
    ...(data?.not_information_customer ? [FieldName.ClientId] : []),
    ...(data?.payment_type_name === CREDIT ? [FieldName.CollectionDays] : []),
    ...(data?.foreign_exchange_id !== COLOMBIAN_CURRENCY_ID ? [FieldName.ForeignExchangeRate] : []),
];

/**
 * Withholding table headers
 */
export const WITHHOLDING_TABLE_HEADINGS = ['Retención', 'Base', 'Tarifa', 'Valor'];

/**
 * This is used to store the ide of the fields that need it
 */
export const ID_KEY: { [key: string]: string } = {
    [FieldName.OperationType]: 'operation_type_id',
    [FieldName.Prefix]: 'prefix_id',
    [FieldName.PaymentMethod]: 'payment_method_id',
    [FieldName.PaymentType]: 'payment_type_id',
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

/**
 * These are used to define the use of personal information
 */
export const PERSONAL_DATA_OPTIONS = [
    {
        id: uuid(),
        label: 'Voluntariamente autoriza su información personal',
        description:
            'Si su cliente suministra su información personal, agréguela en el formulario para la generación de la factura.',
        value: true,
    },
    {
        id: uuid(),
        label: 'No autoriza su información personal',
        description:
            'Si su cliente no autoriza dar su información personal, la factura se genera a nombre de Consumidor final con número de documento 222222222222.',
        value: false,
    },
];

/**
 * Headers used to display products table
 */
export const PRODUCT_TABLE_HEADERS = (isMandate: boolean, isPurchaseInvoice: boolean): IGenericRecord[] => [
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
            title: 'SKU/Código - Producto/Servicio:',
            description: 'es el código único de identificación y el nombre de sus productos/servicios.',
        },
    },
    {
        title: 'Descripción',
        className: 'description',
        tooltip: {
            title: 'Descripción:',
            description: 'información adicional para la venta del producto/servicio.',
        },
    },
    {
        title: '*Bodega',
        className: 'warehouse',
        tooltip: {
            title: 'Bodega:',
            description: 'es el nombre de la(s) bodega(s) en las que está almacenado el producto.',
        },
    },
    {
        title: '*Lote',
        className: 'batch',
        tooltip: {
            title: 'Lote:',
            description: 'es la identificación del lote del producto.',
        },
    },
    {
        title: '*Fecha de vencimiento',
        className: 'due-date',
        tooltip: {
            title: 'Fecha de vencimiento:',
            description: 'es la fecha de expiración de su producto.',
        },
    },
    {
        title: '*Cantidad',
        className: 'quantity',
        tooltip: {
            title: 'Cantidad:',
            description: 'es la cantidad del producto vendida a su cliente.',
        },
    },
    {
        title: 'Unidad de medida',
        className: 'unit',
        tooltip: {
            title: 'Unidad de medida:',
            description: 'es la magnitud con la que se mide su producto/servicio.',
        },
    },
    ...(isMandate
        ? [
              {
                  title: '*Proveedor o tercero',
                  className: 'supplier',
                  tooltip: {
                      title: 'Nombre proveedor o tercero:',
                      description:
                          'Entidad externa que suministra bienes o servicios a una empresa u organización en el curso de sus operaciones comerciales.',
                  },
              },
          ]
        : []),
    ...(isPurchaseInvoice
        ? [
              {
                  title: '*Costo unitario',
                  className: 'unit-value',
                  tooltip: {
                      title: 'Costo unitario:',
                      description: 'es el valor que cobra el proveedor por cada unidad de producto/servicio.',
                  },
              },
          ]
        : [
              {
                  title: 'Valor unitario',
                  className: 'unit-value',
                  tooltip: {
                      title: 'Valor unitario:',
                      description: 'es el precio de venta de una unidad de la referencia del producto.',
                  },
              },
          ]),
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
        tooltip: {
            title: TOOLTIP_DATA.taxes.titleTooltip,
            description: TOOLTIP_DATA.taxes.descTooltip,
        },
    },
];

/**
 * Total fields used to build the table
 */
export const TOTAL_FIELDS: IGenericRecord[] = [
    {
        detail: 'Subtotal',
        bold: true,
        value: '',
        key: 'subtotal',
    },
    {
        detail: 'Total descuentos',
        value: '',
        key: 'total_discount',
    },
    {
        detail: 'Costo de envio',
        value: 0,
        editable: true,
        key: 'total_charge_amount',
    },
    {
        detail: 'Total bruto',
        value: '',
        bold: true,
        key: 'total_gross',
    },
    {
        detail: 'Total IVA',
        value: '',
        key: 'total_iva',
    },
    {
        detail: 'Total IBUA',
        value: '',
        key: 'total_ibua',
    },
    {
        detail: 'Total ICUI',
        value: '',
        key: 'total_icui',
    },
    {
        detail: 'Total INC',
        value: '',
        key: 'total_inc',
    },
    {
        detail: 'Total neto factura',
        value: 0,
        bold: true,
        key: 'total_payable',
    },
    {
        detail: 'Retefuente',
        value: '',
        key: 'retefuente',
    },
    {
        detail: 'ReteICA',
        value: '',
        key: 'reteica',
    },
    {
        detail: 'ReteIVA',
        value: '',
        key: 'reteiva',
    },
    {
        detail: 'Total a pagar',
        value: '',
        bold: true,
        key: 'total',
    },
];

/**
 * Required table fields used for validation
 */
export const REQUIRED_TABLE_FIELDS = (validateSupplier: boolean): { name: string; value: string }[] => [
    {
        name: TableNameInputs.SKU,
        value: 'SKU/Código - Producto/Servicio',
    },
    {
        name: TableNameInputs.QUANTITY,
        value: 'Cantidad',
    },
    {
        name: TableNameInputs.WAREHOUSE,
        value: 'Bodega',
    },
    {
        name: TableNameInputs.BATCH,
        value: 'Lote',
    },
    {
        name: TableNameInputs.DATE_EXPIRATION,
        value: 'Fecha de vencimiento',
    },
    ...(validateSupplier
        ? [
              {
                  name: TableNameInputs.MANDATE,
                  value: 'Proveedor o tercero',
              },
          ]
        : []),
];

/**
 * Default withholding data
 */
export const WITHHOLDING_DATA: ITableTaxesAndRetention[] = [
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
 * Possible values for VAT
 */
export const VAT_VALUES = [
    {
        value: '0',
        name: '0,00%',
    },
    {
        value: '15',
        name: '15%',
    },
    {
        value: '100',
        name: '100%',
    },
];

/**
 * Default form data
 */
export const FORM_DATA = {
    prefix_id: '',
    prefix_name: '',
    client_id: '',
    not_information_customer: false,
    collection_days: '',
    supplier: 'N/A',
    days_collection_type: 'Días calendario',
    operation_type: 'Estándar',
    operation_type_id: '9513b27d-f642-320c-a89c-07496841eb52',
    payment_method_id: '',
    payment_method_name: '',
    payment_type_id: '',
    payment_type_name: '',
    foreign_exchange_id: '',
    foreign_exchange_name: '',
    foreign_exchange_rate: null,
    number_purchase_order: '',
    sales_manager: '',
    document_number_sales_manager: '',
    document_type_purchasing_manager: '',
    date: getTodaysTime('YYYY-MM-DD'),
    lang: 'es',
    id: '',
    isCreditSelected: false,
};

/**
 * These fields cause the invoice totals to be consulted every time one of them changes its value
 */
export const QUERY_FIELDS = ['quantity', 'percentage_discount', 'discount'];

/**
 * This is used to add products
 */
export const PRODUCT_ITEM = {
    warehouse_id: '',
    warehouse: '',
    batch: '',
    date_expiration: '',
    quantity: '',
    discount: 0,
    isPerishable: true,
};

/**
 * Initial state of the modals
 */
export const MODALS = {
    [Modal.InvoiceGenerated]: false,
    [Modal.InvoiceRejected]: false,
    [Modal.Draft]: false,
    [Modal.RemoveProduct]: false,
    [Modal.InvoiceInVerification]: false,
    [Modal.InvoiceError]: false,
    [Modal.ErrorDIAN]: false,
    [Modal.ContingencySave]: false,
};

/**
 * Data added by default when the customer does not authorize the use of their personal data
 */
export const UNAUTHORIZED_DATA = {
    id: '07ee58bc-f1cf-4f6d-96ef-c87ec72b8aef',
    client_id: '1c69a81f-f072-4715-bbce-6997cdf5b851',
    document_number: '222222222222',
    name: 'Consumidor final',
    document_type: 'CC',
    person_type: 'Persona natural',
    type_taxpayer_code: 'c8dfbea8-11ca-35bb-bea2-3dc15b66af64',
    type_taxpayer_id: 'c8dfbea8-11ca-35bb-bea2-3dc15b66af64',
    type_taxpayer_name: 'Persona natural',
    tax_details_name: 'No aplica',
    tax_details_code: 'ZZ',
};

/**
 * Data reset fields
 */
export const AUTHORIZED_DATA = {
    id: '',
    client_id: '',
    document_number: '',
    name: '',
    document_type: '',
    person_type: '',
    type_taxpayer_code: '',
    type_taxpayer_id: '',
    type_taxpayer_name: '',
    tax_details_name: '',
    tax_details_code: '',
};

/**
 * Required fields for perishable products
 */
const REQUIRED_PERISHABLE_FIELDS = [
    {
        name: FieldName.Batch,
        value: 'Lote',
    },
    {
        name: FieldName.ExpirationDate,
        value: 'Fecha de vencimiento',
    },
];

/**
 * This const is for payment method when the state is empty
 */
export const PAYMENT_METHOD = {
    payment_method_id: 'b47ef225-6d25-4733-ab5c-22da3d2b7841',
    payment_method_name: 'Instrumento no definido',
};

/**
 * This function assing products in state
 *
 * @param invoiceDetails: IGenericRecortd[] - Products draft
 * @param products: Products company
 * @returns IGenericRecord[]
 */
export const assignProducts = (invoiceDetails: IGenericRecord[], products: IGenericRecord[]): IInvoiceDetails[] => {
    if (!products || products.length === 0) {
        console.warn('⚠️ CRITICAL: Redux products catalog is EMPTY or UNDEFINED!');
    }

    return (invoiceDetails as IGenericRecord[]).map(item => {
        const matchedProduct = products.find(itemProduct => itemProduct.id === item.unique_products_id);

        const { stock, unique_product_taxes, product } = matchedProduct || {
            stock: 0,
        };

        // CRÍTICO: Siempre usar taxes del producto en Redux, no del item de cotización
        // Los items de cotización pueden tener IVA calculado pero sin UUIDs de taxes
        const productTaxes =
            unique_product_taxes && unique_product_taxes.length > 0 ? unique_product_taxes : product?.product_taxes || [];

        const isPerishable = Array.isArray(stock) && lengthGreaterThanZero(stock);
        const { batch: batches } = isPerishable
            ? stock.find((warehouse: IGenericRecord) => warehouse.warehouses_id === item.warehouse_id) || { batch: [] }
            : { batch: [] };
        const isNotNA = isPerishable && lengthGreaterThanZero(batches);

        const hasCalculatedIva = item.iva && parseFloat(item.iva) > 0;

        /* eslint-disable @typescript-eslint/no-unused-vars */
        const { warehouse_id, batch_id, warehouse_name, batch_number, date_expiration, ...itemWithoutWarehouseBatch } = item;
        /* eslint-enable @typescript-eslint/no-unused-vars */

        const baseProduct = {
            ...itemWithoutWarehouseBatch,
            product_taxes: productTaxes,
            taxes: productTaxes?.map(({ company_tax_id, tax_value }: IGenericRecord) => ({ company_tax_id, tax_value })) || [],
            percentage_discount: calculatePercentage(item.unit_value, item.discount),
            iva: hasCalculatedIva ? item.iva : undefined,

            ...(isPerishable
                ? {
                      warehouse_name: item.warehouse_name,
                      warehouse_id: item.warehouse_id,
                  }
                : {
                      warehouse_name: NA,
                  }),

            ...(isNotNA
                ? {
                      batch_number: item.batch_number,
                      batch_id: item.batch_id,
                      date_expiration: getDateFromUnix(getUnixFromDate(item.date_expiration || '')).dateFormat,
                  }
                : {
                      batch_number: NA,
                      date_expiration: NA,
                  }),
        };

        return baseProduct as IInvoiceDetails;
    });
};
