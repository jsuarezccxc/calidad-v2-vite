import { Dispatch, SetStateAction } from 'react';
import { Section } from '@components/bread-crumb';
import { Routes } from '@constants/Paths';
import { IGenericRecord } from '@models/GenericRecord';
import { getRoute, getRouteName } from '@utils/Paths';
import { remToPx } from '@utils/Size';
import { ITaxOption } from '..';

export { default } from './ProductCatalog';

/**
 * This interface define product catalog props
 *
 * @typeParam toggleShowCatalog: () => void - Toggle show catalog
 * @typeParam setShowCatalog: Dispatch<SetStateAction<boolean>> - Set state show catalog
 */
export interface IProductCatalogProps {
    toggleShowCatalog: () => void;
    setShowCatalog: Dispatch<SetStateAction<boolean>>;
}

/**
 * Routes bread crumb pages
 * @returns Section[]
 */
export const routes = (): Section[] => {
    return [
        {
            name: getRouteName(Routes.DATABASE_MENU),
            route: getRoute(Routes.DATABASE_MENU),
        },
        {
            name: getRouteName(Routes.PRODUCT_DATABASE),
            route: getRoute(Routes.PRODUCT_DATABASE),
        },
    ];
};

/**
 * This constant defines the initial values for the tax selector
 */
export const columnsOptions: ITaxOption[] = [
    {
        id: '1',
        key: 'image',
        value: 'Imágen',
        multiSelectCheck: {
            value: true,
        },
        width: remToPx(4.125),
    },
    {
        id: '2',
        value: 'Clasificación',
        key: 'classification',
        multiSelectCheck: {
            value: true,
        },
        width: remToPx(6.25),
    },
    {
        id: '3',
        value: 'Unidad de medida',
        key: 'unitMeasure',
        multiSelectCheck: {
            value: true,
        },
        width: remToPx(6.25),
    },
    {
        id: '4',
        value: 'SKU',
        key: 'sku',
        multiSelectCheck: {
            value: true,
        },
        width: remToPx(6.25),
    },
    {
        id: '5',
        value: 'Valor unitario',
        key: 'unitValue',
        multiSelectCheck: {
            value: true,
        },
        width: remToPx(8.125),
    },
    {
        id: '6',
        value: 'Impuestos',
        key: 'taxes',
        multiSelectCheck: {
            value: true,
        },
        width: remToPx(6.25),
    },
    {
        id: '7',
        value: 'Canal de venta',
        key: 'saleChannel',
        multiSelectCheck: {
            value: true,
        },
        width: remToPx(6.25),
    },
    {
        id: '8',
        value: 'Categoría',
        key: 'category',
        multiSelectCheck: {
            value: true,
        },
        width: remToPx(6.25),
    },
];

/**
 * This constant indicate the limit for change class table
 */
export const LIMIT_COLUMNS = 6;

/**
 * This constant is use to create array of search columns
 */
export const keyMapping: Record<string, string> = {
    classification: 'classification',
    unitMeasure: 'unit_measurement_name',
    sku: 'sku_internal',
    unitValue: 'unit_value',
    saleChannel: 'sale_channel_name',
    category: 'category_name',
};

/**
 * This function is used to build titles to download pdf and xls
 * @param input: IGenericRecord - Columns selected for rendering in the table
 * @returns
 */
export const transformObject = (input: IGenericRecord): IGenericRecord => {
    const example: IGenericRecord = {
        unique_product_images: 'imagen',
        name: 'Nombre del producto/servicio',
        classification: 'Clasificación',
        unit_measurement_name: 'Unidad de medida',
        sku_internal: 'SKU',
        unit_value: 'Valor unitario',
        taxes: 'Impuestos',
        sale_channel_name: 'Canal de venta',
        category_name: 'Categoria',
    };

    if (!input.image) delete example.unique_product_images;
    if (!input.unitMeasure) delete example.unit_measurement_name;
    if (!input.sku) delete example.sku_internal;
    if (!input.unitValue) delete example.unit_value;
    if (!input.taxes) delete example.taxes;
    if (!input.saleChannel) delete example.sale_channel_name;
    if (!input.classification) delete example.classification;

    return example;
};
