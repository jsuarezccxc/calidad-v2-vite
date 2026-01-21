import { IEntity } from '@components/radiobutton';

export { default } from './Form';

/**
 * This constant is for the aunts radio button type
 */
export const COLLECTION_OPTIONS: IEntity[] = [
    {
        name: 'Agregar entrada',
        label: 'Agregar entrada',
        labelClass: 'w-26.4 xs:w-full',
        tooltip: true,
        titleTooltip: 'Agregar entrada:',
        descTooltip: 'es un proceso de inventario que le permite registrar en diggi pymes el ingreso de cantidades de un producto.'
    },
    {
        name: 'Agregar salida',
        label: 'Agregar salida',
        labelClass: 'w-32.4 xs:w-full',
        tooltip: true,
        titleTooltip: 'Agregar salida:',
        descTooltip: 'es un proceso de inventario que le permite registrar en diggi pymes el descuento de cantidades de un producto.'
    },
];
