import { IOptionSelect } from '@components/input';
import { IOption } from '@components/select-search';
import { IGenericRecord } from '@models/GenericRecord';

export * from './Iva';
export * from './Icui';
export * from './Inc';

/**
 * This constant defines the structure of the unit of measure options for the IBUA tax.
 */
export const netContentOptions: IOptionSelect[] = [
    {
        id: '1',
        key: 'lt',
        value: 'Litros',
    },
    {
        id: '2',
        key: 'ml',
        value: 'Mililitros',
    },
];

/**
 * This constant defines the structure of the unit of measure options for the IBUA tax.
 */
export const netContentOptionsTable: IOption[] = [
    {
        id: '1',
        value: 'lt',
        key: 'lt',
        name: 'lt',
    },
    {
        id: '2',
        value: 'ml',
        key: 'ml',
        name: 'ml',
    },
];

/**
 * This constant defines mililiters unit of measure
 */
export const ML = 'ml';

/**
 * This constant defines liters unit of measure
 */
export const LT = 'lt';

/**
 *
 * @param taxes:  IGenericRecord - Taxes to find search
 * @param taxType: string - Value search
 * @param localValues: IGenericRecord - Local values to identify tax search for tax_rate
 * @returns
 */
export const findTaxRate = (taxes: IGenericRecord, taxType: string, localValues: IGenericRecord): IGenericRecord =>
    taxes.find((tax: IGenericRecord) => String(tax.key) === String(localValues[taxType]?.tax_rate));

/**
 * This interface describes the properties of the IBUA options
 *
 * @typeParam id: string - Optional id of the option
 * @typeParam key: string - Value of the option key
 * @typeParam value: string - Value of the option
 */
interface IIbuaOptions {
    id?: string;
    key: string;
    value: string;
}

/**
 * This interface describes the properties of the IBUA values
 *
 * @typeParam option: IIbuaOptions - Require option of the IBUA
 * @typeParam product: IGenericRecord - Optional product quantities available
 */
export interface IIbuaValues {
    option: IIbuaOptions;
    product?: IGenericRecord;
}

/**
 * This interface describes the properties of the IBUA options
 *
 * @typeParam id: string - Id of the option
 * @typeParam value: string - Optional value of the option
 * @typeParam unitSelected: string - Optional selected unit for the variant
 * @typeParam calculateValue: number - Optional value of calculated tax for variants
 * @typeParam unitMeasureMilliliters: number - Optional unit measure in milliliters
 */
export interface IVariantsNetContent {
    id: string;
    value?: string;
    unitSelected?: string;
    calculateValue?: number;
    unitMeasureMilliliters?: number;
}

/**
 * This interface describes the properties of the IBUA options
 *
 * @typeParam tax: number - Tax value
 * @typeParam total: number - Total value after tax calculation
 */
export type ITaxResult = {
    tax: number;
    total: number;
};

/**
 *
 * @param netMl:  nmber | string | undefined - Net content in milliliters
 * @param taxRate: number | string | undefined - Tax rate to apply
 * @param unitSelected: string - Selected unit for the variant
 * @param basePrice: number | string | undefined - Base price of the product
 * @returns ITaxResult
 */
export const computeTaxForVariant = (
    netMl: number | string | undefined,
    taxRate: number | string | undefined,
    unitSelected: string,
    basePrice: number | string | undefined
): ITaxResult => {
    const rate = Number(taxRate ?? 0);
    const ml = Number(netMl ?? 0);
    const base = Number(basePrice ?? 0);

    let tax = 0;
    if (unitSelected === ML) {
        tax = (ml / 100) * rate;
    } else {
        tax = ml * 10 * rate;
    }

    return {
        tax,
        total: base + tax,
    };
};
