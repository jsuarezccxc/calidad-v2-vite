import { Section } from '@components/bread-crumb';
import { IEntity } from '@components/radiobutton';
import { Routes } from '@constants/Paths';
import { UNIQUE_PRODUCTS } from '@constants/Product';
import { PRODUCT_NAME } from "@constants/ProductName";
import { IGenericRecord } from '@models/GenericRecord';
import { getRoute } from '@utils/Paths';

export { default } from './ProductManagement';

/**
 * This interface define product management props
 *
 * @typeParam toggleShowCatalog: () => void - Toggle show catalog
 * @typeParam addTaxes: boolean - Flag add taxes
 */
export interface IProductManagementProps {
    toggleShowCatalog: () => void;
    addTaxes: boolean;
}

/**
 * It's used to get the First 20 unit measurements
 */
export const MAIN_UNITS = 'main_unit_measurements';

/**
 * Const that indicates the id of the untaxed tax
 */
export const UNTAXED_TAX = '58173c3c-2d0c-43a9-957d-1223cd9e699f';

/**
 * Option that validates if is product
 */
export const SERVICE = 'SERVICE';

/**
 * Option that validates if is product
 */
export const PRODUCT = 'PRODUCT';

/**
 * Routes bread crumb pages
 * @param showCatalog: () => void - Function redirect to catalog
 * @param edit: boolean - Indicates if it is a product edition
 * @returns Section[]
 */
export const routes = (showCatalog: () => void, edit: boolean): Section[] => {
    return [
        {
            name: 'Ficha técnica',
            route: getRoute(Routes.DATABASE_MENU),
        },
        {
            name: 'Ficha técnica de productos/servicios',
            route: '#',
            onClick: showCatalog,
        },
        {
            name: edit ? 'Editar producto/servicio' : 'Agregar producto/servicio',
            route: '#',
        },
    ];
};

/**
 * Options used to select the add type
 */
export const addTypeOptions: IEntity[] = [
    {
        name: 'ONE_BY_ONE',
        label: `Agregar producto/servicio desde ${PRODUCT_NAME}`,
    },
    {
        name: 'MASSIVE_UPLOAD',
        label: 'Agregar producto/servicio a través de Excel',
        labelClass: 'w-51.25',
    },
];

/**
 * Options used to select the add type
 */
export const classificationOptions: IEntity[] = [
    {
        name: PRODUCT,
        label: 'Producto',
        description: ' Elemento que satisface una necesidad o deseo del consumidor.',
        title: 'Producto:',
        tooltip: true,
        titleTooltip: 'Producto: ',
        descTooltip: 'Elemento que satisface una necesidad o deseo del consumidor. ',
    },
    {
        name: SERVICE,
        label: 'Servicios',
        labelClass: 'w-51.25',
        description: ' Acciones o actividades ofrecidas para satisfacer necesidades específicas o realizar tareas determinadas.',
        title: 'Servivos:',
        tooltip: true,
        titleTooltip: 'Servicios: ',
        descTooltip: 'Acciones o actividades ofrecidas para satisfacer necesidades específicas o realizar tareas determinadas.',
    },
];

/**
 * Fields required for product creation
 */
const requiredProduct = {
    withVariants: ['categories', 'sale_channel', 'unique_products'],
    withVariantsEdit: ['categories', 'sale_channel', 'unique_products'],
    noVariants: ['sale_channel', 'categories', 'unique_products'],
    noVariantsSupplier: ['sale_channel', 'unique_products', 'categories'],
};

/**
 * Function that detects empty fields of the product
 *
 * @param item: IGenericRecord - Information to create the product
 * @returns boolean
 */
export const hasEmptyProduct = (item: IGenericRecord, require: keyof typeof requiredProduct): boolean => {
    const requiredFields = requiredProduct[require];
    if (!item.unit_measurement_id) return true;
    for (const field of requiredFields) {
        const value = item[field];
        if (field === UNIQUE_PRODUCTS && !!value.length) return hasEmptyUniqueVariants(value);
        if (Array.isArray(value) && !value.length) return true;
        if (!value) return true;
    }

    return false;
};

/**
 * Function that detects empty fields of the variants
 *
 * @param item: IGenericRecord - Information to create the product
 * @returns boolean
 */
export const hasEmptyUniqueVariants = (variant: IGenericRecord[]): boolean => {
    for (const item of variant) {
        if (!item.name || !item.unit_value) {
            return true;
        }
        if ((item.is_mandate || item.includes_mandate) && !item.mandate_id) {
            return true;
        }
    }
    return false;
};

/**
 * Function that cleans data that is sent in the request
 *
 * @param product: IGenericRecord - Information to create the product
 * @returns IGenericRecord
 */
export const cleanData = (product: IGenericRecord): IGenericRecord => {
    for (const key in product) {
        if (Array.isArray(product[key]) && !product[key].length) {
            product[key] = null;
        }
    }
    return product;
};
