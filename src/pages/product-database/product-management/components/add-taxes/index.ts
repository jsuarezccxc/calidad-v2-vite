import { Section } from '@components/bread-crumb';
import { IOptionSelect } from '@components/input';
import { Routes } from '@constants/Paths';
import { getRoute } from '@utils/Paths';

export * from './AddTaxes';

/**
 * Routes bread crumb pages in new version
 *
 * @param showCatalog: () => void - Function to redirect catalog.
 * @param showProduct: () => void - Function to redirect product.
 * @param edit: boolean - Indicates if product is edit
 * @returns Section[]
 */
export const routesAddTaxes = (showCatalog: () => void, showProduct: () => void, edit: boolean): Section[] => {
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
            onClick: showProduct,
        },
        {
            name: edit ? 'Edite los  Impuestos' : 'Agregue los impuestos',
            route: '#',
        },
    ];
};

export type SectionKeys = 'IVA' | 'IBUA' | 'ICUI' | 'INC';
export interface IRateOption {
    id: string;
    key: number;
    value: string;
}

/**
 * This constant is used to manage the values entered for each tax.
 */
export const taxValues: { [key: string]: ITaxValues } = {
    IVA: {
        tax_id: '',
        tax_value: '',
        tax_calculated_value: 0,
        unit_measure_milliliters: 0,
        variants: [],
    },
    IBUA: {
        tax_id: '',
        tax_value: '',
        tax_calculated_value: 0,
        unit_measure_milliliters: 0,
        variants: [],
    },
    ICUI: {
        tax_id: '',
        tax_value: '',
        tax_calculated_value: 0,
        unit_measure_milliliters: 0,
        variants: [],
    },
    INC: {
        tax_id: '',
        tax_value: '',
        tax_calculated_value: 0,
        unit_measure_milliliters: 0,
        variants: [],
    },
};

/**
 * This constant defines the BD id of IVA untaxed
 */
export const IVA_UNTAXED_ID = '58173c3c-2d0c-43a9-957d-1223cd9e699f';

/**
 * This constant defines the BD id of INC untaxed
 */
export const INC_UNTAXED_ID = '1c0849d0-c505-4a53-a4fa-af948dc4df13';

/**
 * This function classifies the taxes by prioritizing the taxes excluding
 * @param a: IRateOption - First comparison value
 * @param b: IRateOption - second comparison value
 * @returns number
 */
export const sortRates = (a: IOptionSelect, b: IOptionSelect): number => {
    const isAExcluded = a.value.toLowerCase().includes('excluido');
    const isBExcluded = b.value.toLowerCase().includes('excluido');

    if (isAExcluded && !isBExcluded) return -1;
    if (!isAExcluded && isBExcluded) return 1;

    const keyA = parseFloat(a.key);
    const keyB = parseFloat(b.key);

    if (isNaN(keyA)) return 1;
    if (isNaN(keyB)) return -1;

    return keyA - keyB;
};

/**
 * This interface defines the structure for handling variant product information.
 *
 * @typeParam string: string - Unique product identification
 * @typeParam value: string - Value of tax
 * @typeParam calculateValue: Optional value of calculated tax for variants
 * @typeParam unitMeasureMilliliters: Optional unit measure in milliliters
 * @typeParam unitSelected: Optional selected unit for the variant
 */
export interface IVariantValues {
    id: string;
    value: string;
    calculateValue?: number;
    unitMeasureMilliliters?: number;
    unitSelected?: string;
}

/**
 * This interface defines the structure of each option of the tax values object.
 * @typeParam tax_id: string - Tax identification
 * @typeParam tax_value: string - Value of tax for the case where it has no variants
 * @typeParam tax_calculated_value: string - Value of calculated tax for the case where it has no variants
 * @typeParam variants: IVariantValues[] - Array of unique product identifiers and their values
 */
export interface ITaxValues {
    tax_id: string;
    tax_value: string;
    tax_calculated_value: number;
    unit_measure_milliliters?: number;
    variants: IVariantValues[];
}
/**
 * This constant is used to validate conflict in taxed to product
 */
export const conflictTax: { [key: string]: string } = {
    IBUA: 'ICUI',
    ICUI: 'IBUA',
};
