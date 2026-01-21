import { IOptionSelect } from '@components/input';
import { Variants } from '@constants/Product';

/**
 * This interface define structure of tax select available options
 *
 * @typeParam id: string - Element id
 * @typeParam value: string - Option's value
 * @typeParam key: string - Option's tax identifying
 * @typeParam multiSelectCheck?: boolean - Optional check value for each option of the select component
 */
export interface ITaxOption extends IOptionSelect {
    id: string;
    value: string;
    key: keyof typeof eTaxes;
    multiSelectCheck: {
        value: boolean;
    };
}

/**
 * This interface defines the structure of the tax rate selectors
 *
 * @typeParam id: string - Element id
 * @typeParam value: string - Option's value
 * @typeParam key: string - Option's tax identifying
 */
export interface IRateOption {
    id: string;
    value: string;
    key: string;
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
 * This interface defines the structure for handling variant product information.
 *
 * @typeParam string: string - Unique product identification
 * @typeParam value: string - Value of tax
 * @typeParam calculateValue: Optional value of calculated tax for variants
 * @typeParam unitMeasureMilliliters: Optional value of quantity of milliliters
 */
export interface IVariantValues {
    id: string;
    value?: string;
    calculateValue?: number;
    unitMeasureMilliliters?: number;
}

/**
 * This emun defines the available taxes
 */
export enum eTaxes {
    IVA = 'IVA',
    IBUA = 'IBUA',
    ICUI = 'ICUI',
    INC = 'INC',
}

/**
 * This interface describes the variant props
 *
 * @typeParam vat: string - Variant id
 * @typeParam productTypeId: string - Product type id used for details
 * @typeParam type: Variants - Variant type
 */
export interface IVariant {
    id: string;
    productTypeId?: string;
    type: Variants;
}
