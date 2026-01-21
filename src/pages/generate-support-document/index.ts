import { v4 as uuid } from 'uuid';
import { Routes } from '@constants/Paths';
import { TitleButtons } from '@constants/Buttons';
import { COLOMBIA_ID, REQUIRED_LOCATIONS_KEYS } from '@constants/Location';
import { VARIABLE_TYPE } from '@constants/DataTypes';
import { MODULE_TITLES } from '@constants/ElectronicDocuments';
import { SUPPORT_DOCUMENTS_SUBTITLE } from '@constants/DocumentTexts';
import { NA, SUPPORTING_DOCUMENT } from '@constants/ElectronicInvoice';
import { ISupplier } from '@models/Supplier';
import { IGenericRecord } from '@models/GenericRecord';
import { ISupportDocument } from '@models/SupportDocument';
import { validateEmail } from '@utils/Validation';
import { getDateISO8601ToDate } from '@utils/Date';
import { getRouteName, getRoute } from '@utils/Paths';
import { lengthGreaterThanZero } from '@utils/Length';
import { changeUltimateItem, discardUntaxed, valueToRate } from '@utils/ElectronicInvoice';
import { buildGlobalOptionsSelect, buildOptionsSearch } from '@utils/Company';
import { MODAL } from '@information-texts/GenerateSupportDocument';
import { TOOLTIP_PAGE } from '@information-texts/CorrectCancelElectronicDocument';
import { Section } from '@components/bread-crumb';
import { IOptionsSupportForm } from '@components/support-document-and-buy';
import { FieldsName } from './components';

export { default } from './GenerateSupportDocument';

/**
 * This const is used to get the support document prefixes
 */
const PREFIX_TYPE = {
    with_prefixes: true,
    types: [SUPPORTING_DOCUMENT],
    only_available: true,
};

/**
 * This const type products
 */
const PRODUCT_TYPE = { option: 'BUY' };

/**
 * This function is build options page
 *
 * @param utilsData: IGenericRecord - Utils data
 * @param prefixes: IGenericRecord[] - Prefixes
 * @param suppliers: IGenericRecord[] - Suppliers
 * @returns IOptionsSupportForm
 */
const buildOptionsPage = (
    utilsData: IGenericRecord,
    prefixes: IGenericRecord[],
    suppliers: IGenericRecord[]
): IOptionsSupportForm => ({
    fiscalResponsibilities: buildGlobalOptionsSelect({ util: changeUltimateItem(utilsData?.fiscal_responsibilities) }),
    paymentMethods: buildGlobalOptionsSelect({ util: changeUltimateItem(utilsData?.payment_methods) }),
    taxDetails: buildGlobalOptionsSelect({ util: changeUltimateItem(utilsData?.tax_details) }),
    foreignExchange: buildOptionsSearch(utilsData?.foreign_exchange),
    prefix: buildGlobalOptionsSelect({ util: prefixes, keyValue: 'prefix' }),
    documentTypes: buildGlobalOptionsSelect({ util: utilsData?.document_types }),
    typeTaxPayer: buildGlobalOptionsSelect({ util: utilsData?.type_tax_payer }),
    paymentTypes: buildGlobalOptionsSelect({ util: utilsData?.payment_types }),
    withholdings: buildGlobalOptionsSelect({ util: utilsData?.withholdings }),
    suppliers:
        suppliers?.flatMap(({ person, ...supplier }) => {
            if (lengthGreaterThanZero(person.fiscal_responsibilities)) {
                return {
                    key: uuid(),
                    value: supplier.name,
                    id: supplier.person_id,
                };
            }
            return [];
        }) || [],
});

/**
 * This const describe required keys in supplier
 */
const REQUIRED_KEYS = ['name', 'document_name', 'document_number', 'type_taxpayer_name', 'email', 'country_name', 'city_name'];

/**
 * This function is validate supplier
 *
 * @param supplier: ISupplier - Supplier data
 * @param returnBoolean: boolean - Optional param if return boolean value
 * @returns string[] | boolean
 */
const validateSupplier = (supplier: ISupplier, isEmailValidation: boolean, returnBoolean = false): string[] | boolean => {
    let existError = false;
    const errors: string[] = Object.keys(supplier).flatMap(key => {
        const validationEmail = key === FieldsName.EMAIL && supplier[key];
        if (key === FieldsName.FISCAL_RESPONSIBILITIES && supplier[key].some(fiscal => !fiscal.id_fiscal)) {
            existError = true;
            return key;
        }
        if (validationEmail && !validateEmail(supplier[key])) {
            existError = true;
            return FieldsName.INVALIDATE_EMAIL;
        }
        if (validationEmail && isEmailValidation) existError = true;
        if (
            !supplier[key as keyof ISupplier] &&
            (REQUIRED_KEYS.includes(key) || (Number(supplier.country_id) === COLOMBIA_ID && REQUIRED_LOCATIONS_KEYS.includes(key)))
        ) {
            existError = true;
            return key;
        }
        return [];
    });
    return returnBoolean ? existError : errors;
};

/**
 * This function validate information page to show
 *
 * @param route: string - Route page
 * @returns { routes: Section[]; subTitle: string }
 */
const validateInfoPage = (route: string): { routes: Section[]; subTitle: string } => {
    const supplierRoute = getRoute(Routes.CREATE_SUPPLIER);
    const routes: Section[] = [
        {
            name: getRouteName(Routes.DASHBOARD_ELECTRONIC_DOCUMENT),
            route: getRoute(Routes.DASHBOARD_ELECTRONIC_DOCUMENT),
        },
        {
            name: MODULE_TITLES.INVOICE,
            route: '#',
        },
        {
            name: getRouteName(Routes.GENERATE_SUPPORT_DOCUMENT),
            route: getRouteName(Routes.GENERATE_SUPPORT_DOCUMENT),
        },
    ];
    if (route === supplierRoute) routes.push({ name: 'Agregar proveedor', route: '#' });
    if (route.includes(`${supplierRoute}&ID=`)) routes.push({ name: 'Editar proveedor', route: '#' });
    return {
        routes,
        subTitle: MODULE_TITLES.INVOICE,
    };
};

/**
 * This const is for information page
 */
const PAGE_TITLE = {
    title: getRouteName(Routes.ELECTRONIC_DOCUMENTS),
    pageContent: SUPPORT_DOCUMENTS_SUBTITLE,
};

/**
 * This enum is keys modals
 */
export enum ModalKeys {
    SAVE_SUPPLIER = 'SAVE_SUPPLIER',
    SAVE_SUPPORT = 'SAVE_SUPPORT',
}

/**
 * This const  is state modals
 */
const STATE_MODAL = {
    SAVE_SUPPLIER: false,
    SAVE_SUPPORT: false,
};

/**
 * This function is type modal props
 *
 * @param onClick: (isDraft: boolean) => void - Optional param new support
 * @returns { [key: string]: any }
 */
// eslint-disable-next-line
const modals = (onClick?: (isDraft: boolean) => void): { [key: string]: any } => ({
    SAVE_SUPPLIER: {
        text: MODAL.SAVE_SUPPLIER,
    },
    SAVE_SUPPORT: {
        text: MODAL.SAVE_SUPPORT,
        textButton: TitleButtons.NEXT,
        otherButton: {
            textButton: MODAL.BUTTON_SAVE_SUPPORT,
            onClick,
        },
    },
});

/**
 * This function replace empty string to null
 *
 * @param data: ISupportDocument - Support data
 * 
 * @returns IGenericRecord
 */
const formatRequestData = (data: ISupportDocument, productsStock: IGenericRecord[]): IGenericRecord => {
    const requestData: IGenericRecord = { ...data };
    const foreignRate = data.foreign_exchange_rate;
    Object.keys(data).forEach(key => {
        if (!data[key as keyof ISupportDocument] && typeof data[key as keyof ISupportDocument] === VARIABLE_TYPE.STRING)
            requestData[key] = null;
    });
    const products = data.products.map(({ batch_number, date_expiration, warehouse_name, ...item }) => {
        const isNAWarehouse = warehouse_name === NA;
        const isNABatch = batch_number === NA;
        const productFind = productsStock.find(stock => stock.sku_internal === item.sku_internal) || {};
        const taxes = discardUntaxed(productFind.unique_product_taxes);

        return {
            ...item,
            batch: isNABatch ? null : batch_number,
            batch_id: isNABatch ? null : item.batch_id,
            product_taxes: taxes.map(valueToRate(foreignRate)),
            warehouse_name: isNAWarehouse ? null : warehouse_name,
            warehouse_id: isNAWarehouse ? null : item.warehouse_id,
            date_expiration: isNABatch ? null : getDateISO8601ToDate(date_expiration),
            taxes: taxes.map(({ company_tax_id, tax_value }) => valueToRate(foreignRate)({ company_tax_id, tax_value })),
        };
    });
    return {
        ...requestData,
        fiscal_responsibilities: data.fiscal_responsibilities.map(({ id, ...fiscal }) => ({ ...fiscal, id: String(id) })),
        products,
        base_reteica: 0,
        reteica: 0,
    };
};

/**
 * This const is for props footer buttons
 *
 * @param id: string - Optional param to get id
 * @returns { titleButtonLeft: string, titleButtonRight: string }
 */
const footerSupplier = (id?: string): { titleButtonLeft: string, titleButtonRight: string } => ({
    titleButtonLeft: TitleButtons.BACK,
    titleButtonRight: id ? TitleButtons.SAVE : TitleButtons.NEXT,
});

/**
 * Interface footer support
 *
 * @typeParam titleButtonLeft: string - Title button left
 * @typeParam titleButtonRight: string - Title button right
 * @typeParam titleButtonCenter: string - Title button center
 * @typeParam tooltip: typeof TOOLTIP_PAGE.BUTTON_DRAFT - Object tooltip information
 * @typeParam classNameBtnCenter: string - Class name in center button
 * @typeParam classNameBtnLeft: string - Class name in left button
 * @typeParam threeButtons: boolean - Boolean to show three buttons
 */
interface IFooterSupport {
    titleButtonLeft: string;
    titleButtonRight: string;
    titleButtonCenter: string;
    tooltip: typeof TOOLTIP_PAGE.BUTTON_DRAFT;
    classNameBtnCenter: string;
    classNameBtnLeft: string;
    threeButtons: boolean;
}

/**
 * Funtion to get props from buttons footer
 *
 * @typeParam nameButton: () => string - Action to change name button
 * @returns IFooterSupport - Object with properties from buttons footer component
 */
const FOOTER_SUPPORT = (nameButton: () => string): IFooterSupport => {
    return {
        titleButtonLeft: nameButton(),
        titleButtonRight: TitleButtons.NEXT,
        titleButtonCenter: TitleButtons.SAVE_DRAFT,
        tooltip: TOOLTIP_PAGE.BUTTON_DRAFT,
        classNameBtnCenter: 'custom-footer-button__button-center',
        classNameBtnLeft: 'px-2.5',
        threeButtons: true,
    };
};

/**
 * This const is utils page
 */
export const UTILS = {
    modals,
    STATE_MODAL,
    FOOTER_SUPPORT,
    footerSupplier,
    PAGE_TITLE,
    SUB_TITLE: getRouteName(Routes.GENERATE_SUPPORT_DOCUMENT),
    PREFIX_TYPE,
    PRODUCT_TYPE,
    buildOptionsPage,
    validateSupplier,
    formatRequestData,
    validateInfoPage,
    Routes,
    getRoute,
    KEYS_VALIDATE: ['prefix_id', 'name', 'document_type', 'payment_method_id', 'payment_type_id', 'foreign_exchange_id'],
    VIEW: 'view',
    ID: 'ID',
};
