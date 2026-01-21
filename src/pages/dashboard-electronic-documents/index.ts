import { getRoute } from '@utils/Paths';
import { ElementType, generateId, ModuleApp, ActionElementType } from '@utils/GenerateId';
import { Routes } from '@constants/Paths';
import { IDataDashboardElectronicDocuments, IElectronicDocumentCounting } from '@models/DashboardElectronicDocuments';
import { IColorCardProps, ILittleCardProps, ISimpleCardProps } from './components';

export { default } from './DashboardElectronicDocuments';

/**
 * This const is routes duplicate
 */
const { GENERATE_SALES_INVOICE, GENERATE_SUPPORT_DOCUMENT } = Routes;

/**
 * This interface is props to component
 *
 * @typeParam field: string - Key field total
 * @typeParam optionsIntl?: Intl.NumberFormatOptions - Optional options intl
 */
interface IColorCard extends Omit<IColorCardProps, 'number'> {
    field: string;
    optionsIntl?: Intl.NumberFormatOptions;
}

/**
 * This interface is props component
 *
 * @typeParam field: string - Key field total
 * @typeParam optionsIntl?: Intl.NumberFormatOptions - Optional options intl
 */
interface ILittleCard extends Omit<ILittleCardProps, 'number'> {
    field: string;
    optionsIntl?: Intl.NumberFormatOptions;
}

/**
 * This const is simple cards props
 */
const SIMPLE_CARDS: ISimpleCardProps[] = [
    {
        id: generateId({
            module: ModuleApp.ELECTRONIC_DOCUMENTS,
            submodule: `dashboard-simple-generate-sales-invoice`,
            action: ActionElementType.INFO,
            elementType: ElementType.CRD,
        }),
        iconName: 'addMoneyInvoice',
        principalText: 'Generar nueva',
        secondText: 'factura de venta',
        route: getRoute(GENERATE_SALES_INVOICE),
    },
    {
        id: generateId({
            module: ModuleApp.ELECTRONIC_DOCUMENTS,
            submodule: `dashboard-simple-generate-support-document`,
            action: ActionElementType.INFO,
            elementType: ElementType.CRD,
        }),
        iconName: 'addMoneyInvoice',
        principalText: 'Generar nuevo',
        secondText: 'documento soporte',
        route: getRoute(GENERATE_SUPPORT_DOCUMENT),
    },
    {
        id: generateId({
            module: ModuleApp.ELECTRONIC_DOCUMENTS,
            submodule: `dashboard-simple-generate-purchase-invoice`,
            action: ActionElementType.INFO,
            elementType: ElementType.CRD,
        }),
        iconName: 'moneyInvoice',
        principalText: 'Generar nueva',
        secondText: 'factura de compra',
        route: getRoute(Routes.GENERATE_PURCHASE_INVOICE),
    },
    {
        id: generateId({
            module: ModuleApp.ELECTRONIC_DOCUMENTS,
            submodule: `dashboard-simple-add-new-client`,
            action: ActionElementType.INFO,
            elementType: ElementType.CRD,
        }),
        iconName: 'addUser',
        principalText: 'Agregar nuevo',
        secondText: 'cliente',
        route: `${getRoute(GENERATE_SALES_INVOICE)}?form=client`,
        isBlueText: true,
    },
    {
        id: generateId({
            module: ModuleApp.ELECTRONIC_DOCUMENTS,
            submodule: `dashboard-simple-add-new-product-service`,
            action: ActionElementType.INFO,
            elementType: ElementType.CRD,
        }),
        iconName: 'addBox',
        principalText: 'Agregar nuevo',
        secondText: 'producto/servicio',
        route: getRoute(Routes.HOME),
        isBlueText: true,
    },
    {
        id: generateId({
            module: ModuleApp.ELECTRONIC_DOCUMENTS,
            submodule: `dashboard-simple-add-new-supplier`,
            action: ActionElementType.INFO,
            elementType: ElementType.CRD,
        }),
        iconName: 'userBox',
        principalText: 'Agregar nuevo',
        secondText: 'proveedor',
        route: `${getRoute(GENERATE_SUPPORT_DOCUMENT)}?view=SUPPLIER`,
        isBlueText: true,
    },
    {
        id: generateId({
            module: ModuleApp.ELECTRONIC_DOCUMENTS,
            submodule: `dashboard-simple-add-new-warehouse`,
            action: ActionElementType.INFO,
            elementType: ElementType.CRD,
        }),
        iconName: 'addWarehouses',
        principalText: 'Agregar nueva',
        secondText: 'Bodega',
        route: `${getRoute(Routes.WAREHOUSES)}?mode=add`,
        isBlueText: true,
    },
];

/**
 * This const is percentage sale name
 */
const PERCENTAGE = 'percentage_sale';

/**
 * This const is left cards props
 */
const LEFT_CARDS: IColorCard[] = [
    {
        id: generateId({
            module: ModuleApp.ELECTRONIC_DOCUMENTS,
            submodule: `dashboard-left-total-sales`,
            action: ActionElementType.INFO,
            elementType: ElementType.CRD,
        }),
        field: 'total_sales',
        className: 'custom-cards-color bg-purple-smooth height-91',
        classNameLine: 'bg-purple',
        classNameNumber: 'text-purple',
        iconName: 'userBurgerPurple',
        text: 'Ingresos totales por mes',
    },
    {
        id: generateId({
            module: ModuleApp.ELECTRONIC_DOCUMENTS,
            submodule: `dashboard-left-percentage`,
            action: ActionElementType.INFO,
            elementType: ElementType.CRD,
        }),
        field: PERCENTAGE,
        className: 'custom-cards-color bg-green-extraLight height-108',
        classNameLine: 'bg-blue',
        classNameNumber: 'text-green',
        iconName: 'userBurgerGreen',
        text: 'Porcentaje de ventas respecto al mes anterior',
        optionsIntl: { signDisplay: 'always', style: 'percent', minimumFractionDigits: 0, maximumFractionDigits: 0 },
    },
    {
        id: generateId({
            module: ModuleApp.ELECTRONIC_DOCUMENTS,
            submodule: `dashboard-left-total-clients`,
            action: ActionElementType.INFO,
            elementType: ElementType.CRD,
        }),
        field: 'total_clients',
        className: 'custom-cards-color bg-blue-light height-91',
        classNameLine: 'bg-blue',
        classNameNumber: 'text-blue',
        iconName: 'userBurgerBlue',
        text: 'Número de clientes',
        optionsIntl: { minimumFractionDigits: 0 },
    },
];

/**
 * This const is little card props
 */
const RIGHT_CARDS: ILittleCard[] = [
    {
        id: generateId({
            module: ModuleApp.ELECTRONIC_DOCUMENTS,
            submodule: `dashboard-right-total-invoices`,
            action: ActionElementType.INFO,
            elementType: ElementType.CRD,
        }),
        className: 'bg-green-extraLight margin-x-0-5 h-6',
        title: 'Facturación electrónica',
        field: 'total_invoice',
    },
    {
        id: generateId({
            module: ModuleApp.ELECTRONIC_DOCUMENTS,
            submodule: `dashboard-right-total-support-documents`,
            action: ActionElementType.INFO,
            elementType: ElementType.CRD,
        }),
        className: 'bg-purple-smooth margin-x-0-5 h-6',
        title: 'Documento soporte',
        field: 'total_supporting_document',
    },
    {
        id: generateId({
            module: ModuleApp.ELECTRONIC_DOCUMENTS,
            submodule: `dashboard-right-total-adjustment-note`,
            action: ActionElementType.INFO,
            elementType: ElementType.CRD,
        }),
        className: 'bg-purple-smooth margin-x-0-5 h-6',
        title: 'Nota de ajuste',
        field: 'total_adjustment_note',
    },
    {
        id: generateId({
            module: ModuleApp.ELECTRONIC_DOCUMENTS,
            submodule: `dashboard-right-total-debit-note`,
            action: ActionElementType.INFO,
            elementType: ElementType.CRD,
        }),
        className: 'bg-blue-light margin-x-0-5 h-6',
        title: 'Nota débito',
        field: 'total_debit_note',
    },
    {
        id: generateId({
            module: ModuleApp.ELECTRONIC_DOCUMENTS,
            submodule: `dashboard-right-total-credit-note`,
            action: ActionElementType.INFO,
            elementType: ElementType.CRD,
        }),
        className: 'bg-green-extraLight margin-x-0-5 h-6',
        title: 'Nota crédito',
        field: 'total_credit_note',
    },
];

/**
 * This type is keys different interfaces
 */
export type KeysColorCard = keyof Omit<
    IDataDashboardElectronicDocuments,
    'annual_income' | 'electronic_document_counting' | 'is_unlimited'
>;
export type keysLittleCard = keyof IElectronicDocumentCounting;

/**
 * This const is utils page
 */
export const UTILS = {
    LEFT_CARDS,
    PERCENTAGE,
    RIGHT_CARDS,
    SIMPLE_CARDS,
    ROUTE_SALE: getRoute(Routes.SALES_REPORT),
    NEXT_PAGE: getRoute(Routes.ENABLE_ELECTRONIC_BILLER),
};
