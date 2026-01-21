export * from './SaleProduct'

/**
 * Product sales channel options.
 */
export const optionsSaleChannel = [
    {
        key: 'PHYSICAL_STORE',
        value: 'Tienda física',
    },
    {
        key: 'WEBSITE',
        value: 'Tienda virtual',
    },
    {
        key: 'PHYSICAL_STORE_WEBSITE',
        value: 'Tienda física y Tienda virtual',
    },
];

/**
 * Object to render sales channel options.
 */
export const valueSaleChannel: { [key: string]: string } = {
    PHYSICAL_STORE: 'Tienda física',
    WEBSITE: 'Tienda virtual',
    PHYSICAL_STORE_WEBSITE: 'Tienda física y Tienda virtual',
};
